# 09 — QA checklist (executable)

**Audience:** the QA agent (pipeline step P3, plan §5). Everything here is a command or an assertion — no judgement calls.
**Source:** plan §3.9 (acceptance criteria), §5 (hard rules); audit §E (measured baselines).
**Rule from the plan:** verify in a real browser (headless + screenshot). Never "should work".

---

## 0. Baselines to beat (measured on `feat/olbo-case-study`)

| Route | JS gz | CSS | Target |
|---|---|---|---|
| `/` | 240.3 kB | 75.8 kB | **≤ 150 kB** JS (goal 120), **≤ 30 kB** CSS |
| `/cv` | 262.8 kB | 75.8 kB | ≤ 40 kB JS |
| `/work/olbo` | 253.6 kB | 75.8 kB | ≤ 160 kB JS |

---

## 1. Setup (once)

```bash
cd /Users/dvargas/Desktop/douguizard
npm i -D @playwright/test @axe-core/playwright
npx playwright install chromium
npm run build && npx next start -p 3099   # test against the production build, never dev
```

`playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3099", trace: "retain-on-failure" },
  reporter: [["list"], ["html", { outputFolder: "tests/report" }]],
  webServer: { command: "npx next start -p 3099", port: 3099, reuseExistingServer: true },
});
```

Shared constants (`tests/e2e/matrix.ts`):

```ts
export const WIDTHS = [320, 375, 768, 1024, 1440, 1920];
export const THEMES = ["dark", "light"] as const;
export const ROUTES = ["/", "/cv", "/work/olbo", "/work/naowee-suid", "/work/banco-de-occidente"];
export const setTheme = (t: string) =>
  `localStorage.setItem("dg-theme", ${JSON.stringify(t)})`;
```

Theme is set by seeding `localStorage` **before** the first navigation (`page.addInitScript`), so the anti-flash script picks it up on the first paint.

---

## 2. Visual matrix — 60 screenshots

`tests/e2e/visual.spec.ts`

```ts
for (const theme of THEMES)
  for (const width of WIDTHS)
    for (const route of ROUTES)
      test(`${route} ${width} ${theme}`, async ({ page }) => {
        await page.addInitScript(setTheme(theme));
        await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
        await page.goto(route, { waitUntil: "networkidle" });
        await page.emulateMedia({ reducedMotion: "reduce" });   // deterministic frames
        await expect(page).toHaveScreenshot(
          `${route.replace(/\W+/g, "_")}-${width}-${theme}.png`,
          { fullPage: true, maxDiffPixelRatio: 0.01 },
        );
      });
```

**Manual review gate** (the agent looks at these, does not just store them):
- `/` at 1440 dark and light: the Hero glow is in one corner only, the LinkedIn pill is visible, no red anywhere.
- `/work/olbo` at 1440: phone frames have a single 1 px border, 12 px corners, **no** halo and **no** shadow.
- `/cv` at 1440 dark and light: two-column layout, no cosmic anything.
- `/` at 320: no clipped text, no horizontal scrollbar, wordmarks wrapped.

---

## 3. Accessibility — axe, zero violations

```ts
import AxeBuilder from "@axe-core/playwright";
for (const theme of THEMES)
  for (const route of ROUTES)
    test(`axe ${route} ${theme}`, async ({ page }) => {
      await page.addInitScript(setTheme(theme));
      await page.goto(route, { waitUntil: "networkidle" });
      const r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(r.violations, JSON.stringify(r.violations, null, 2)).toEqual([]);
    });
```

Plus the rules axe cannot see:

| # | Check | How |
|---|---|---|
| 3.1 | AAA body contrast | Sample the computed colour of a body `<p>` and its background on each route/theme; assert ratio ≥ 7 against the table in `00-tokens.md` §5 |
| 3.2 | One `h1` per route | `page.locator("h1").count() === 1` |
| 3.3 | Heading order | axe `heading-order` (included above) |
| 3.4 | Landmarks | `header` 1, `main#main` 1, `footer` 1 on every route |
| 3.5 | Skip link | `Tab` once from load → focused element is `a[href="#main"]` and it is visible |
| 3.6 | Touch targets | every `a`, `button` has `boundingBox().height >= 44 && width >= 44` at 375 |
| 3.7 | Colour-only meaning | `FeatureKind` renders the words `AI` / `Product`; the section index active item has an `aria-current` **and** a text/weight difference |
| 3.8 | Zoom | `user-scalable` absent, `maximum-scale` absent from the viewport meta |

---

## 4. Performance

```bash
npx --yes lighthouse http://localhost:3099/            --preset=desktop --quiet --chrome-flags="--headless=new" --output=json --output-path=tests/lh-home.json
npx --yes lighthouse http://localhost:3099/cv          --preset=desktop --quiet --chrome-flags="--headless=new" --output=json --output-path=tests/lh-cv.json
npx --yes lighthouse http://localhost:3099/work/olbo   --preset=desktop --quiet --chrome-flags="--headless=new" --output=json --output-path=tests/lh-olbo.json
```

Assertions (all four categories, all three routes): **Performance ≥ 95 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95**, `cumulative-layout-shift < 0.1`, `total-blocking-time < 200 ms`, `largest-contentful-paint < 2500 ms`.

Budget measurement (the audit's own method, so the numbers are comparable):

```bash
node -e '
const {gzipSync}=require("zlib");
(async()=>{
 for (const r of ["/","/cv","/work/olbo","/work/naowee-suid"]) {
  const html=await (await fetch("http://localhost:3099"+r)).text();
  const srcs=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
  const css =[...html.matchAll(/<link[^>]+href="(\/_next\/static\/css\/[^"]+)"/g)].map(m=>m[1]);
  let js=0; for (const s of new Set(srcs)) js+=gzipSync(Buffer.from(await (await fetch("http://localhost:3099"+s)).arrayBuffer())).length;
  let c=0;  for (const s of new Set(css))  c +=Buffer.from(await (await fetch("http://localhost:3099"+s)).arrayBuffer()).length;
  console.log(r, "JS gz", (js/1024).toFixed(1)+"kB", "CSS", (c/1024).toFixed(1)+"kB");
 }})()'
```

Gate: `/` JS gz ≤ **150 kB**, CSS ≤ **30 kB**. Report the delta against the §0 baseline in the QA report.

---

## 5. Layout integrity

| # | Check | Assertion |
|---|---|---|
| 5.1 | No horizontal overflow | For every width in `WIDTHS` and every route: `document.body.scrollWidth <= window.innerWidth + 1` |
| 5.2 | No element wider than the viewport | `[...document.querySelectorAll("*")].filter(e => e.getBoundingClientRect().right > innerWidth + 1)` → `[]` (allow-list: `.glow-corner`, which is `pointer-events:none` and clipped by an `overflow:hidden` parent — verify that parent exists) |
| 5.3 | **No vertical flash on desktop** | At 1440, record `/` with `page.video`; at 250 ms after `domcontentloaded`, `document.querySelector("[data-hshell]").getBoundingClientRect().width >= 1400` and `scrollWidth === 5 * innerWidth`. Also assert `document.body.scrollHeight <= innerHeight + 2` (the page must never be vertically scrollable on desktop) |
| 5.4 | Panel count | `document.querySelectorAll("[data-panel]").length === 5` |
| 5.5 | Sticky eyebrows clear the header | On `/work/olbo` at 1440, scroll to the Process band: the sticky `h2` top edge ≥ 64 px |

---

## 6. Keyboard and shell

| # | Check |
|---|---|
| 6.1 | `Tab` from load → skip link → brand → section links → LinkedIn → toggle → shell |
| 6.2 | With the shell focused at 1440: `→ → → →` lands on panel `04`; `Home` returns to `00`; `End` → `04`; `PageDown`/`PageUp` behave identically |
| 6.3 | Inside the Work panel, `↓` scrolls the panel and `scrollLeft` does **not** change |
| 6.4 | Every panel contains at least one tabbable element (`panel.querySelectorAll("a,button,[tabindex='0']").length > 0`) |
| 6.5 | `SectionIndex` link activated by `Enter` scrolls **and** moves focus into that panel (`document.activeElement.closest("[data-panel]")` is the target) |
| 6.6 | Mobile menu at 375: `Escape` closes it and focus returns to the toggle button; when closed it has the `hidden` attribute and 0 tabbable descendants |
| 6.7 | Focus ring is visible on every interactive element in both themes (2 px `#485EF2`, offset 3 px) — verified by screenshot, not by computed style alone |

---

## 7. Reduced motion

```ts
await page.emulateMedia({ reducedMotion: "reduce" });
```

| # | Check |
|---|---|
| 7.1 | `document.getAnimations().length === 0` on `/` after load |
| 7.2 | `VignetteOlbo` shows flat bars at final height; `VignetteNaowee` shows `5` and `4` with a static delta |
| 7.3 | Section-index jump uses `behavior:"auto"` (no smooth scroll — assert `scrollLeft` reaches its target within one frame) |
| 7.4 | Case-page reveals render their final state immediately (`MotionConfig reducedMotion="user"` is still in place) |
| 7.5 | No `transition-duration` above 1 ms in any computed style sample |

---

## 8. Print (`/cv`)

```ts
const pdf = await page.pdf({ format: "A4", printBackground: false, margin: { top:"12mm", bottom:"12mm", left:"14mm", right:"14mm" } });
// page count:
const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
expect(pages).toBeLessThanOrEqual(2);
```

Repeat with `format: "Letter"`. Then assert on the emulated print media (`page.emulateMedia({ media: "print" })`):

| # | Check |
|---|---|
| 8.1 | `.site-header`, `.theme-toggle`, `.glow-corner`, the `Download PDF` button are all `display: none` |
| 8.2 | `getComputedStyle(document.body).backgroundColor` is white and body text is black, **with `dg-theme=dark` seeded** |
| 8.3 | No `a[href]::after` URL expansion in the rendered text |
| 8.4 | No experience entry is split across the page fold (visual review of the PDF) |
| 8.5 | Every `cv.experiences` entry appears in the PDF text layer |

---

## 9. Regression greps (run from the repo root)

```bash
set -x
grep -rn "#FF2A00" src/ public/ && echo FAIL                       # 0 hits
grep -rn -- "--color-accent" src/ && echo FAIL                     # 0 hits
grep -rn "theme-dark\|data-panel-theme\|chrome-ink" src/ && echo FAIL
grep -rn "cosmic-\|glass-\|btn-round\|animate-marquee" src/ && echo FAIL
grep -rn "three\|lenis\|@paper-design\|clsx" src/ package.json && echo FAIL
grep -rEn '#[0-9a-fA-F]{6}\b' src/ --include='*.tsx' --include='*.ts' && echo FAIL   # hex only in globals.css
grep -rn "Senior Product Designer" src/ | grep -v "src/data/" && echo FAIL
grep -rn "@apply" src/ && echo FAIL                                # Tailwind v4 rule
grep -rn "\.png\"" src/data/ && echo FAIL                          # assets converted
grep -rn "decade\|twelve years\|12 years\|12+ years" src/components/ && echo FAIL
grep -rn "Dribbble" src/components/ && echo FAIL                   # data may keep it; UI may not
grep -rln "Tierra Querida" src/ public/ docs/ && echo FAIL         # never publish
```

Every line must print nothing. Additional consistency greps:

- `grep -rn "Head of Product\|Tech Lead\|Technical Lead" src/ | grep -v "src/data/"` → **0** (single source of truth, plan §3.9).
- `grep -rn "linkedin.com" src/ | grep -v "src/data/site.ts"` → **0**; every consumer reads `site.social.find(s => s.primary)`.
- Section ids are never literals: `grep -rn '"#home"\|"#work"\|"#craft"\|"#about"\|"#contact"' src/components/` → 0 (they are built from `sections`).
- Width/height on every `next/image`: `grep -n "<Image" -A6 src/components/work/*.tsx | grep -c "width=" ` equals the `<Image` count.

---

## 10. Content consistency

| # | Check |
|---|---|
| 10.1 | `<title>` on `/`, the hero `h1`, the About "Currently" fact, the footer and `/cv` all name the same current role |
| 10.2 | OG title/description match `site.headline` / `site.summary` |
| 10.3 | The Naowee case, the About timeline and `/cv` show the same period string for Naowee |
| 10.4 | `getCaseMeta("mercadolibre-andes").team` reads `400+ designers · 2K+ engineers` (plan D9) |
| 10.5 | "Case study available on request" appears exactly twice: the ML row on `/` and the ML case page |
| 10.6 | No KPI on any page still carries a `Draft figures` value (`M+`, `Dozens`, `Enterprise`, `Multi`, `Dev-ready`) |
| 10.7 | `Francesca Steri` appears on `/work/banco-de-occidente` and `/cv`, nowhere else |

---

## 11. Links

```bash
npx --yes linkinator http://localhost:3099 --recurse --skip "linkedin.com|behance.net|github.com" --silent
```
Expect 0 broken internal links. External links are skipped (they rate-limit bots) but must be checked once by hand: LinkedIn, Behance, the olbo live app, the olbo repo.

Also assert every external anchor carries `target="_blank" rel="noopener noreferrer"`.

---

## 12. Build and tests

```bash
npm run lint                  # EXIT=0
npx tsc --noEmit              # EXIT=0
npx vitest run                # EXIT=0, data-model tests from 01-data-model.md
npm run build                 # EXIT=0; 7 /work slugs pre-rendered; / , /cv static
```

Also: `npx depcheck` reports no unused dependency, and `node -e "require('./package.json')"` shows the eight removed packages gone.

---

## 13. Report format

The QA agent writes `scratchpad/report-qa.md` with:

1. A pass/fail table for §2–§12, one row per numbered check.
2. The JS/CSS/Lighthouse numbers next to the §0 baseline, as a delta.
3. Inline links to the 60 screenshots plus the four manual-review shots called out in §2.
4. A list of every failure with: the check id, the route/width/theme, the exact assertion output, and the file:line most likely responsible.
5. No speculation. If something could not be measured, it is reported as **not measured**, never as passing.
