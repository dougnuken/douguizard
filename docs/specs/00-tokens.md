# 00 — Tokens, theme and type system

**Owner file:** `src/app/globals.css` (rewritten from zero) · `src/app/layout.tsx` · `src/components/ThemeToggle.tsx` (new)
**Source of truth:** plan §1b (measured CV PDF palette), §2 (visual direction), §3.1.2.
**Companion specs:** data model in `01-data-model.md`, chrome in `02-chrome-and-shell.md`.

---

## 1. Objective

One global theme, two appearances, zero per-subtree theme classes. Black/white editorial with a single cold accent (`signal`) used only as **atmosphere** (one static radial glow per page) and as **state** (focus ring, active rail). Every colour in the app comes from a token; no hex may appear outside `globals.css`.

Hard budget: `globals.css` output ≤ 25 kB uncompressed; total CSS shipped ≤ 30 kB.

---

## 2. Files

| Action | Path / target |
|---|---|
| REWRITE | `src/app/globals.css` — from zero, see §3–§9 |
| MODIFY | `src/app/layout.tsx` — fonts, anti-flash script, `<html>` attrs |
| CREATE | `src/components/ThemeToggle.tsx` — client, ~60 lines |
| DELETE | every `.theme-dark` usage (`cv/layout.tsx`, `HorizontalShell`, frame comments) |
| DELETE | `--chrome-ink` and `[data-panel-theme]` (see `02-chrome-and-shell.md` §6) |

---

## 3. Tailwind v4 wiring (the only correct shape)

Utilities must resolve to **runtime** variables so `[data-theme]` can swap them. Use `@theme inline` — it makes `bg-paper` compile to `background-color: var(--paper)` instead of freezing the value.

```css
@import "tailwindcss";

/* Utilities read runtime vars, so a [data-theme] swap re-paints everything. */
@theme inline {
  --color-paper: var(--paper);          --color-paper-raised: var(--paper-raised);
  --color-ink: var(--ink);              --color-ink-muted: var(--ink-muted);
  --color-ink-dim: var(--ink-dim);      --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-signal: var(--signal);        --color-signal-soft: var(--signal-soft);
  --color-signal-deep: var(--signal-deep);

  --font-display: var(--font-archivo), "Helvetica Neue", Arial, sans-serif;
  --font-body:    var(--font-archivo), "Helvetica Neue", Arial, sans-serif;
  --font-mono:    var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;
}

/* `light:` is the exception variant — dark is the default appearance. */
@custom-variant light (&:where([data-theme="light"], [data-theme="light"] *));
```

**Forbidden:** `@apply` with any custom (non-Tailwind) class; `@theme` (non-inline) for colour tokens; `dark:` variant (there is no `dark` class strategy here).

---

## 4. Palette

Values are measured from `scratchpad/cv-pdf/page-1.png` (plan §1b). Dark is the default appearance.

```css
:root {                              /* ── dark, the default ── */
  --paper: #101010;
  --paper-raised: #17171A;           /* case-study band change only; never a card fill */
  --ink: #F2F1EE;  --ink-muted: #A3A29E;  --ink-dim: #8A8985;
  --line: color-mix(in srgb, var(--ink) 12%, transparent);
  --line-strong: color-mix(in srgb, var(--ink) 24%, transparent);
  --signal: #485EF2;  --signal-soft: #566DAB;  --signal-deep: #2D2C59;
  --glow: color-mix(in srgb, var(--signal) 55%, transparent);
  color-scheme: dark;
}

:root[data-theme="light"] {
  --paper: #FAFAF8;  --paper-raised: #F2F1EC;
  --ink: #0A0A0A;  --ink-muted: #545350;  --ink-dim: #6F6E6A;
  --line: color-mix(in srgb, var(--ink) 12%, transparent);
  --line-strong: color-mix(in srgb, var(--ink) 22%, transparent);
  --signal: #485EF2;  --signal-soft: #566DAB;  --signal-deep: #2D2C59;
  --glow: #DCE3FF;
  color-scheme: light;
}
```

### 4.1 Permitted / forbidden uses of `signal`

| Allowed (4 uses, no others) | Forbidden |
|---|---|
| One static radial glow per page (hero corner, `/cv` header corner), `opacity ≤ .6`, **no animation** | Body text, headings, any running copy |
| `:focus-visible` ring, 2 px | Row / list hover colour |
| Active rail of `SectionIndex` (graphical, not text) | Device / browser frame bezels, borders |
| Underline of the primary CTA | Icons, KPI figures, badges, chips |

`::selection` is **ink on paper inverted**, not signal. If QA finds the accent invasive, the lever is the glow's `opacity`, never a fifth use (plan §6).

### 4.2 The glow (the only decorative surface in the system)

```css
.glow-corner {
  position: absolute;
  inset-block-end: -18vmax;
  inset-inline-end: -14vmax;
  inline-size: 62vmax;
  block-size: 62vmax;
  pointer-events: none;
  z-index: 0;
  opacity: .55;
  background: radial-gradient(
    circle at 62% 62%,
    var(--glow) 0%,
    color-mix(in srgb, var(--signal-deep) 60%, transparent) 38%,
    transparent 68%
  );
}
:root[data-theme="light"] .glow-corner { opacity: .45; }
```

Static. No `filter: blur()` (it forces a full-page compositing layer). Max **one** instance per route. Content sits on `z-index: 1`.

---

## 5. Contrast table (measured, WCAG 2.1 relative luminance)

Body copy target AAA (≥ 7:1). UI / non-text indicators target ≥ 3:1.

### Dark theme — background `#101010` (L = 0.0052)

| Foreground | Hex | Ratio | Verdict | Allowed for |
|---|---|---|---|---|
| ink | `#F2F1EE` | **16.84:1** | AAA | headings, body, links |
| ink-muted | `#A3A29E` | **7.45:1** | AAA | secondary body, captions, mono meta |
| ink-dim | `#8A8985` | **5.43:1** | AA | ≤ 11 px mono labels, numerals, disabled |
| signal | `#485EF2` | **3.77:1** | AA-large / UI ✓ | focus ring, rails, dots — **never text** |
| line | ink @12 % | ~2.0:1 | n/a | hairlines only (decorative) |

### Light theme — background `#FAFAF8` (L = 0.9547)

| Foreground | Hex | Ratio | Verdict | Allowed for |
|---|---|---|---|---|
| ink | `#0A0A0A` | **18.94:1** | AAA | headings, body, links |
| ink-muted | `#545350` | **7.36:1** | AAA | secondary body, captions, mono meta |
| ink-dim | `#6F6E6A` | **4.88:1** | AA | ≤ 11 px mono labels, numerals, disabled |
| signal | `#485EF2` | **4.83:1** | AA / UI ✓ | focus ring, rails, dots — **never text** |

**Rule derived from the table:** `ink-dim` never carries information that exists nowhere else. Anything a reader must act on uses `ink-muted` or `ink`.

**Inverted surfaces** (solid ink pill with paper text) invert the same pair: 16.84:1 dark / 18.94:1 light.

---

## 6. Typography

Three weights of Archivo, two of Geist Mono. Geist Sans is removed entirely.

```ts
// src/app/layout.tsx
import { Archivo, Geist_Mono } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});
```

### 6.1 Fluid scale

```css
:root {
  --step-display: clamp(3rem, 1rem + 7vw, 8rem);      /* 48 → 128 px */
  --step-title:   clamp(2rem, 1rem + 3.6vw, 4rem);    /* 32 → 64 px  */
  --step-lead:    clamp(1.25rem, 1rem + 1.1vw, 1.75rem);
  --step-body:    clamp(1rem, 0.96rem + 0.22vw, 1.125rem);
  --step-small:   0.875rem;
  --step-meta:    0.6875rem;                          /* 11 px mono   */
}
```

| Role | Token · weight · tracking · leading |
|---|---|
| Display (H1) | `--step-display` · 800 · `-0.035em` · `0.92` |
| Section title (H2) | `--step-title` · 600 · `-0.025em` · `1.04` |
| Sub-head (H3) | `--step-lead` · 600 · `-0.015em` · `1.2` |
| Lead paragraph | `--step-lead` · 400 · `-0.01em` · `1.45` |
| Body | `--step-body` · 400 · `0` · `1.6` |
| Meta / kicker | `--step-meta` mono · 500 · `0.2em` · `1.4` |

Measure cap on running copy: `max-width: 68ch` desktop, `38ch` mobile.

### 6.2 Easings

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
  --dur-fast: 160ms;
  --dur: 300ms;
  --dur-slow: 520ms;
}
```

Animation touches **`transform` and `opacity` only**. Global guard:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Surviving utilities (the whole list — nothing else)

```css
@layer utilities {
  .kicker {
    font-family: var(--font-mono);
    font-size: var(--step-meta);
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  .section-num {
    font-family: var(--font-mono);
    font-weight: 400;
    font-variant-numeric: tabular-nums;
    color: var(--ink-dim);
  }

  .hairline-t { border-block-start: 1px solid var(--line); }
  .hairline-b { border-block-end:   1px solid var(--line); }

  .btn-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .55rem;
    min-block-size: 44px;               /* touch target */
    padding-inline: 1.375rem;
    border-radius: 9999px;
    border: 1px solid var(--line-strong);
    font-size: .9375rem;
    font-weight: 500;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    color: var(--ink);
    background: transparent;
    transition: transform var(--dur) var(--ease-out),
                opacity   var(--dur) var(--ease-out);
  }
  .btn-pill--solid { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .btn-pill:hover  { transform: translateY(-1px); }
  .btn-pill:active { transform: translateY(0) scale(.985); }
  .btn-pill--solid:hover { opacity: .88; }   /* no colour change on hover */

  .sr-only {
    position: absolute; inline-size: 1px; block-size: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap; border: 0;
  }
}
```

Deleted for good: every `.glass*`, `.cosmic-*`, `.btn-accent`, `.btn-outline`, `.btn-round*`, `.text-gradient-cosmic`, `.animate-pulse-*`, `.animate-marquee*`, `.animate-star-twinkle`, `.animate-slow-float`, `.geo-*`, `.font-serif`, `.font-sans`, `.font-body`, `.theme-dark`, `--color-gray-*`, `--color-accent*`.

Two keyframe sets are added for the live vignettes (`03-home-panels.md` §4.3) — `vignette-bar` (`transform: scaleY`) and `vignette-roll` (`transform: translateY`) — both inside `@layer utilities`, both `transform`-only, both suppressed by the reduced-motion guard in §6.2.

---

## 8. Base layer

```css
@layer base {
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    overflow-x: hidden; scrollbar-gutter: stable; scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%; text-size-adjust: 100%;
  }

  body {
    min-block-size: 100svh; max-inline-size: 100vw; overflow-x: hidden;
    background: var(--paper); color: var(--ink);
    font-family: var(--font-body); font-size: var(--step-body); line-height: 1.6;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); font-weight: 600; }
  img, video, canvas, svg { max-inline-size: 100%; block-size: auto; }
  p, h1, h2, h3, h4, h5, h6, li, a { overflow-wrap: break-word; }

  ::selection { background: var(--ink); color: var(--paper); }
  :focus-visible { outline: 2px solid var(--signal); outline-offset: 3px; border-radius: 2px; }
  :focus:not(:focus-visible) { outline: none; }
}
```

`overscroll-behavior` is **not** set here — it belongs on the shell only (`02-chrome-and-shell.md` §4).

---

## 9. Anti-flash script + `<html>`

Rendered in `layout.tsx` inside `<head>`, before any stylesheet matters. `<html>` keeps `suppressHydrationWarning` (already present) and ships **no** `data-theme` from the server, so there is nothing to mismatch.

```tsx
const THEME_INIT = `(function(){try{
var s=localStorage.getItem("dg-theme");
var t=(s==="light"||s==="dark")?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;
}catch(e){var r=document.documentElement;r.setAttribute("data-theme","dark");r.style.colorScheme="dark";}})();`;

// in RootLayout
<html lang="en" className={`${archivo.variable} ${geistMono.variable}`} suppressHydrationWarning>
  <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
  <body>{/* skip link · SiteHeader · children */}</body>
</html>
```

**Resolution order:** stored choice → `prefers-color-scheme: light` → dark. (Dark is the default *and* a light system preference is honoured; only an explicit toggle is persisted.)

`viewport.themeColor` becomes two entries so the browser chrome follows:

```ts
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#101010" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
  ],
};
```

---

## 10. `ThemeToggle`

```tsx
// src/components/ThemeToggle.tsx  — "use client"
export default function ThemeToggle(): JSX.Element;
```

No props. Contract:

- Renders a single `<button type="button" class="theme-toggle" aria-label="Switch theme">` containing **both** glyphs (sun + moon, inline SVG, `stroke="currentColor"`, `stroke-width="1.25"`, 18×18, `aria-hidden`).
- **Visibility is CSS-driven, not state-driven** — this is what removes the hydration mismatch entirely:
  ```css
  .theme-toggle [data-glyph="sun"]  { display: none; }
  .theme-toggle [data-glyph="moon"] { display: block; }
  :root[data-theme="light"] .theme-toggle [data-glyph="sun"]  { display: block; }
  :root[data-theme="light"] .theme-toggle [data-glyph="moon"] { display: none; }
  ```
- `onClick` reads `document.documentElement.getAttribute("data-theme")`, flips it, writes the attribute, sets `documentElement.style.colorScheme`, and persists `localStorage["dg-theme"]` inside a `try` (Safari private mode throws; the attribute still flips for the session). It never holds React state, so SSR and the first client render emit identical markup.
- 40 × 40 visual, 44 × 44 hit area via padding; `border-radius: 9999px`; `border: 1px solid var(--line)`. Hover `opacity .8`; `:active` `scale(.94)`; `:focus-visible` inherits the global 2 px signal ring.
- For AT: after flipping, set `aria-label` imperatively to `Switch to light theme` / `Switch to dark theme`, and write `Dark theme` / `Light theme` into a visually-hidden `<span role="status">`.

---

## 11. Responsive behaviour of the token layer

`--step-display` resolves to 48 px at 320–375 (also the iOS-zoom floor for body: 16 px, never lower), ≈ 70 px at 768, ≈ 117 px at 1440, and clamps at 128 px from ~1600 up. The glow is sized in `vmax` and capped at 62 vmax so it never bleeds past its panel at 1920. The 1024 breakpoint belongs to the shell, not to the tokens (`02-chrome-and-shell.md` §4).

---

## 12. Acceptance criteria

1. `grep -rn "#FF2A00\|--color-accent\|theme-dark\|cosmic-\|glass" src/` → **0 hits**.
2. `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/ --include=*.tsx --include=*.ts` → **0 hits** (all hex lives in `globals.css`; anchors `#id` excluded by the `\b` + length rule).
3. Built CSS for `/` ≤ **30 kB** uncompressed (`ls -l .next/static/css/*.css`); `globals.css` source ≤ 25 kB.
4. Toggling the theme in DevTools by setting `document.documentElement.dataset.theme` re-paints every surface with **no** component re-render and no layout shift.
5. Hard reload with `localStorage["dg-theme"]="light"` shows **no dark frame** (record 60 fps video, inspect frame 1).
6. React DevTools / console: **zero** hydration warnings on `/`, `/cv`, `/work/olbo`.
7. Contrast spot-check with axe on both themes reproduces the ratios in §5 within ±0.05.
8. `prefers-reduced-motion: reduce` → no element reports a `transition-duration` above 1 ms in computed styles.
9. Only two font families and five faces in the network waterfall; **no** `Geist` (sans) request.
10. Exactly one `.glow-corner` element per route (`document.querySelectorAll('.glow-corner').length === 1`).
