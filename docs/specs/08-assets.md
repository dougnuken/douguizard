# 08 — Assets: images, OG, favicon, image pipeline

**Files:** `public/work/**` · `next.config.ts` · `src/app/icon.svg` · `public/og.png` · `src/data/work.ts` (gallery paths) · `scripts/assets.sh` (new, dev-only)
**Source:** plan §1.8, §6; audit §F (asset inventory), §E (CLS/perf budgets).
**Environment verified on this machine:** `/opt/homebrew/bin/ffmpeg` present · `cwebp` **absent** · macOS `sips` has **no** WebP encoder. So **ffmpeg is the pipeline**, `cwebp` is the documented alternative.

---

## 1. Objective

Cut ~5 MB of PNG out of the repo, give every image explicit dimensions and a correct `loading`/`fetchpriority`, ship one static black-and-white OG card, and remove red from the favicon. No layout shift (CLS < 0.1) and no image larger than it renders.

---

## 2. Current inventory (measured)

| File | Pixels | Bytes | Renders at | Verdict |
|---|---|---|---|---|
| `olbo/movimientos.png` | 1179 × 2556 | 1,085,541 | ≤ 400 px CSS (phone frame) | **convert** |
| `olbo/semaforo-alerta.png` | 1179 × 2556 | 1,005,218 | ≤ 400 px | **convert** |
| `olbo/semaforo-verde.png` | 1179 × 2556 | 981,417 | ≤ 400 px | **convert** |
| `olbo/registrar.png` | 1179 × 2556 | 182,509 | ≤ 400 px | **convert** |
| `olbo/captura-gasto-poster.jpg` | 786 × 1704 | 76,923 | ≤ 400 px | keep (JPEG is fine for a poster) |
| `naowee/*.png` (6 files) | 2880 × 1800 / 2160 × 1350 | 284–644 kB | ≤ 1330 px CSS | **convert** |
| `naowee/recorrido-ivc-poster.jpg` | 1920 × 1200 | 137,483 | ≤ 1330 px | keep |
| `*.mp4` / `*.webm` | — | 733 kB / 623 kB / 1.3 MB / 915 kB | — | keep, untouched (plan: video content intact) |

`public/` has **no** `og.png`, no CV PDF, no thumbnails. Repo media today ≈ 9.1 MB.

---

## 3. Conversion pipeline

`next/image` already re-encodes on demand, but the **repo** weight and the cold-start transform cost are what we are cutting. Convert the sources once, commit the WebP, delete the PNG.

### 3.1 The script

`scripts/assets.sh` — dev-only, not part of `next build`, committed so the work is reproducible.

```bash
#!/usr/bin/env bash
# Convert every PNG under public/work to WebP and delete the source.
# Requires ffmpeg (brew install ffmpeg).  Quality 82 is visually lossless
# for flat UI screenshots; 90 for the two olbo screens with photographic chips.
set -euo pipefail
cd "$(dirname "$0")/.."

q_for() { case "$1" in *olbo*) echo 90;; *) echo 82;; esac; }

find public/work -name '*.png' -print0 | while IFS= read -r -d '' src; do
  out="${src%.png}.webp"
  q="$(q_for "$src")"
  ffmpeg -y -loglevel error -i "$src" -c:v libwebp -quality "$q" -compression_level 6 -preset picture "$out"
  printf '%-52s %8s -> %8s\n' "$(basename "$out")" "$(stat -f%z "$src")" "$(stat -f%z "$out")"
done

echo "Review the .webp files, then:  find public/work -name '*.png' -delete"
```

Deletion is a **separate manual step** so nobody nukes a source before eyeballing the output.

### 3.2 Alternative encoders (document, do not require)

```bash
# libwebp CLI — only if someone installs it
brew install webp
cwebp -q 82 -m 6 -sharp_yuv in.png -o out.webp

# sips is NOT an option: macOS sips has no WebP encoder (verified on this machine).
```

### 3.3 Expected result

| Set | Before | After (est.) |
|---|---|---|
| `olbo/*.png` (4) | 3.25 MB | ≈ 420 kB |
| `naowee/*.png` (6) | 2.51 MB | ≈ 520 kB |
| **Repo media total** | 9.1 MB | ≈ **4.1 MB** |

### 3.4 Follow-up edits

- `src/data/work.ts` — every `gallery[].src` and `video.poster` that pointed at `.png` becomes `.webp`. Nothing else in the data changes; `alt` and `caption` are untouched.
- Grep guard: `grep -rn "\.png\"" src/data/` → 0 hits after the change.
- AVIF is **not** generated at source. `next/image` produces AVIF on demand from the WebP (see §4), and a second committed format would double the repo for a marginal win on already-small files.

---

## 4. `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: { optimizePackageImports: ["framer-motion"] },
  images: {
    formats: ["image/avif", "image/webp"],
    // The widths the layout actually asks for: phone frame ≤ 400 CSS px,
    // browser frame ≤ 1330 CSS px, both at DPR 1–3. Trimming the default
    // ladder removes transform variants nothing ever requests.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    imageSizes: [200, 256, 384, 400, 800],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
```

Do **not** add `unoptimized: true` and do **not** add remote patterns — every image is local.

---

## 5. Per-image loading policy

| Position | `priority` | `loading` | `fetchPriority` | `sizes` |
|---|---|---|---|---|
| Case hero (there is none — the hero is type only) | — | — | — | — |
| First browser shot in `CaseProduct` when the gallery is above the fold | `priority` | (implied `eager`) | `high` | from the layout that owns the column |
| Every other gallery shot | — | `lazy` | — | as today |
| Video posters | — | `lazy` | — | — |
| About portrait (if Doug supplies one) | — | `lazy` | — | `320px` |
| OG image | n/a — never rendered in the page | | | |

`BrowserGallery` already exposes `priorityFirst`; `CaseProduct` sets it to `false` for every case (the gallery sits ~4 screens down on all seven). **Nothing on `/` or `/cv` is an `<img>` at all**, which is why the home LCP is text and the budget is achievable.

Every `next/image` keeps explicit `width`/`height` (the `CaseStudy.video` fields and the frame defaults already supply them) — this is what holds CLS under 0.1. QA asserts `getComputedStyle(img).aspectRatio !== "auto"` on every image.

---

## 6. OG image

**Decision: a committed static PNG (Option A).** It removes a build step, removes the font fetch `next/og` needs, and the card never changes per route in a way that justifies runtime generation.

- Path: `public/og.png`, **1200 × 630**, black-and-white, ≤ 120 kB.
- Composition (matches the site, does not invent a new one):
  - Ground `#101010`; 64 px margin.
  - Kicker `PRODUCT × SYSTEMS × CODE` — Geist Mono 500, 22 px, `0.2em`, `#8A8985`.
  - Name `Doug Vargas` — Archivo 800, 96 px, `#F2F1EE`, `-0.035em`.
  - Headline `site.headline` — Archivo 400, 40 px, `#A3A29E`.
  - Bottom-right: the `signal` glow at 45 % opacity, matching `.glow-corner`.
  - Bottom-left: `douguizard.com` — Geist Mono 400, 20 px, `#8A8985`.
- Generate once. Reproducible recipe committed at `scripts/og/og.html` (a 1200 × 630 HTML file using the same tokens) plus the command:
  ```bash
  npx --yes playwright screenshot --viewport-size=1200,630 \
      scripts/og/og.html public/og.png
  ```
  Playwright is already a devDependency for QA (`09-qa-checklist.md`), so this adds nothing.
- Wired in `06-seo.md` as `openGraph.images` and `twitter.images` with `width`, `height` and a real `alt`.

**Option B (only if Doug later wants per-case cards):** `src/app/opengraph-image.tsx` using `ImageResponse` from `next/og` (built into Next 16, no new dependency), with the Archivo TTF committed at `src/assets/fonts/Archivo-ExtraBold.ttf` and read with `fs.readFileSync` at build time. Adds ~1.5 s to the build and a font blob to the repo. Not fase 1.

---

## 7. Favicon and icons

Current `src/app/icon.svg` carries the red mark. Replace with a monochrome glyph that reads on both browser chromes:

```svg
<!-- src/app/icon.svg — 32×32, no red, adapts to the browser's own theme -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    :root { color-scheme: light dark; }
    .bg { fill: #101010 } .fg { fill: #F2F1EE }
    @media (prefers-color-scheme: light) { .bg { fill: #FAFAF8 } .fg { fill: #0A0A0A } }
  </style>
  <rect class="bg" width="32" height="32" rx="7"/>
  <path class="fg" d="M9 8h6.4c5.4 0 8.6 3 8.6 8s-3.2 8-8.6 8H9V8Zm4.2 3.6v8.8h2.1c3 0 4.6-1.6 4.6-4.4s-1.6-4.4-4.6-4.4h-2.1Z"/>
</svg>
```

The glyph is a `D` in Archivo's proportions — the brand mark without the asterisk. Also add:

- `src/app/apple-icon.png` — 180 × 180, dark ground, same glyph (Safari ignores SVG icons).
- No `manifest.json` in fase 1 (nothing here is installable).
- `grep -rn "FF2A00" src/app/icon.svg` → 0.

---

## 8. Video assets

Untouched by this spec. For the record, so nobody re-encodes them by accident:

| File | Dimensions | Note |
|---|---|---|
| `naowee/recorrido-ivc.{mp4,webm}` | 1920 × 1200, 12.4 s | poster `recorrido-ivc-poster.jpg`, `loop={false}` |
| `olbo/captura-gasto.{mp4,webm}` | 786 × 1704 | poster `captura-gasto-poster.jpg` |

Both already ship WebM first and MP4 as the universal fallback, both are silent and both carry `preload="metadata"`. Leave them alone.

---

## 9. Responsive / density checks

| Viewport | Phone frame CSS width | Source needed @3× | `1179` wide source | Verdict |
|---|---|---|---|---|
| 375 | ~320 px | 960 px | 1179 | ✓ ample |
| 1440 | 400 px | 1200 px | 1179 | ✓ (within 2 %) |

| Viewport | Browser frame CSS width | Source needed @2× | `2880` wide source | Verdict |
|---|---|---|---|---|
| 1024 | ~930 px | 1860 px | 2880 | ✓ |
| 1440 | ~1330 px | 2660 px | 2880 | ✓ |
| 1920 | 1330 px (capped) | 2660 px | 2880 | ✓ |

No source is grossly oversized, so **no downscaling of sources** is required — only the format change. `escenarios-perfil-escenario.png` at 2160 × 1350 is the thinnest margin (2160 vs 2660 needed at 1440 @2×); it shares the 16:10 ratio so the grid does not move, and at 1.6× effective DPR it is still sharp. Leave it.

---

## 10. Acceptance criteria

1. `find public/work -name '*.png' | wc -l` → **0**; `find public/work -name '*.webp' | wc -l` → **10**.
2. `du -sh public/` ≤ **4.5 MB**.
3. `grep -rn "\.png" src/data/work.ts` → 0 hits.
4. Every `<img>` in the rendered DOM of `/work/olbo` and `/work/naowee-suid` has non-empty `width`, `height` and `alt`; `getComputedStyle(img).aspectRatio !== "auto"`.
5. `/work/olbo` and `/work/naowee-suid` request `/_next/image?...&w=…` URLs that resolve to `image/avif` or `image/webp` (check the `content-type` response header).
6. No image below the fold loads before it is scrolled to (`loading="lazy"` on every gallery shot; `priorityFirst` is `false` everywhere).
7. `public/og.png` exists, is 1200 × 630, ≤ 120 kB, contains no red pixel (`ffmpeg -i public/og.png -vf "select=1" -f rawvideo - | …` or an eyeball — QA does it visually), and is referenced from `layout.tsx` metadata.
8. `src/app/icon.svg` contains no `#FF2A00` and renders legibly at 16 px in both a light and a dark browser chrome.
9. Lighthouse "Properly size images", "Serve images in next-gen formats" and "Efficiently encode images" all pass on `/work/olbo`.
10. CLS < 0.1 on `/`, `/cv`, `/work/olbo`, `/work/naowee-suid` (see `09-qa-checklist.md` §4).
