# 05 — `/cv`, a real CV

**Files:** `src/app/cv/page.tsx` (rewrite) · `src/app/cv/layout.tsx` (rewrite) · `src/components/cv/*` (new) · `package.json` · everything the cosmic clone drags in (deleted)
**Source:** plan D12, §1b (content), §3.6, §3.8; audit §D (the clone crashes without WebGL and ships 855 kB).

---

## 1. Objective

Replace the cosmic clone with a CV rendered from `cv.ts` + `site.ts`, readable in both themes, printable to **two A4/Letter pages**, with **no WebGL, no Lenis, no loader, no custom cursor**. `/cv` must render correctly in a browser with WebGL disabled — today it shows Next's "This page couldn't load" error page.

---

## 2. Files

| Action | Path |
|---|---|
| REWRITE | `src/app/cv/page.tsx` → **server component**, ~90 lines |
| REWRITE | `src/app/cv/layout.tsx` → metadata only, no wrapper div, no cursor |
| CREATE | `src/components/cv/CvHeader.tsx` (~80) |
| CREATE | `src/components/cv/CvExperience.tsx` (~90) |
| CREATE | `src/components/cv/CvSidebar.tsx` (~110) — education, certifications, languages, references |
| CREATE | `src/components/cv/CvSkills.tsx` (~70) — skills + tools, grouped |
| CREATE | `src/components/cv/PrintButton.tsx` (~25, the only client component on the route) |
| CREATE | `src/app/cv/print.css` — **no**; print rules live in `globals.css` §6 so there is one stylesheet |
| DELETE | `src/components/Loader.tsx`, `CustomCursor.tsx`, `SmoothScroll.tsx`, `three/Scene3D.tsx`, `three/GalaxyField.tsx`, `sections/{Navigation,Intro,Manifesto,Marquee,PortfolioCarousel,Stats,TestimonialsCarousel}.tsx` |

`/cv` becomes a static server-rendered route: **0 kB of route JS** except `PrintButton` and the shared header.

---

## 3. Dependencies to remove

```bash
npm uninstall three @types/three @react-three/fiber @react-three/drei \
               @paper-design/shaders @paper-design/shaders-react lenis clsx
```

| Package | Only consumer | After |
|---|---|---|
| `three` | `three/GalaxyField.tsx` | deleted |
| `@types/three` | — | deleted |
| `@react-three/fiber` | nobody (already dead) | deleted |
| `@react-three/drei` | nobody (already dead) | deleted |
| `@paper-design/shaders` | `three/Scene3D.tsx` | deleted |
| `@paper-design/shaders-react` | `three/Scene3D.tsx` | deleted |
| `lenis` | `SmoothScroll.tsx` | deleted |
| `clsx` | nobody (`tailwind-merge` is the one actually used) | deleted |

`tailwind-merge` and `framer-motion` stay. Expected result: `/cv` drops from **262.8 kB gz** to under **40 kB gz**.

---

## 4. Page structure

```
┌─ CvHeader ─────────────────────────────────────────────────┐
│  Doug Vargas                                   ░░░ (glow)  │
│  <site.headline>                                           │
│  Barranquilla, Colombia · GMT-5        [in LinkedIn] [PDF] │
│  hello@douguizard.com · douguizard.com                     │
│  ── hairline ──────────────────────────────────────────    │
│  <site.summary>                          max 70ch          │
└────────────────────────────────────────────────────────────┘
┌─ main grid: lg:grid-cols-[minmax(0,1fr)_320px] gap-16 ─────┐
│ LEFT                              │ RIGHT (CvSidebar)      │
│  Experience                       │  Education             │
│   NAOWEE          Jan 2026 —      │  Certifications        │
│    Head of Product                │  Languages             │
│    <summary>                      │  References            │
│    • impact bullet                │                        │
│    • impact bullet                │                        │
│    See case →                     │                        │
│   … one block per cv.experiences  │                        │
│  ── hairline ───────────────────  │                        │
│  CvSkills: Skills by group        │                        │
│            Tools by group         │                        │
└────────────────────────────────────────────────────────────┘
```

### 4.1 `CvHeader`

```ts
export default function CvHeader(): JSX.Element;   // reads site + cv directly
```
- `h1` = `site.name` at `--step-title` (not display — a CV is a document, not a poster), weight 700.
- Headline = `site.headline` (`Head of Product · Design Engineer`), `--step-lead`, `--ink-muted`. **Never** the PDF's stale "Product Designer - UI Specialist" (plan §1b).
- Contact row (mono 12 px): `site.location.city, site.location.country` · `site.location.timezone` · `site.email` · `douguizard.com`. Phone (`site.phone` / `site.phoneHref`) is rendered in the markup but **hidden on screen and shown only in print** — `.cv-phone { display: none } @media print { .cv-phone { display: inline } }`. That needs no new data field and keeps a public web page from advertising a mobile number to scrapers.
- Actions: `LinkedIn` pill (`.btn-pill .btn-pill--solid` + `LinkedInMark`, `href` from `site.social.find(s => s.primary)!.href`) then `PrintButton`. Both `print:hidden`; the LinkedIn **URL** is printed as text inside the contact row instead.
- Summary = `site.summary` (the same string that feeds About and the meta description) at `--step-body`, `max-width: 70ch`.
- One `.glow-corner` — the only one on this route, top-right, `opacity: .4`, `print:hidden`.

### 4.2 `CvExperience`

```ts
export default function CvExperience(): JSX.Element;
```
Maps `cv.experiences` (already newest-first). Per entry:

| Element | Source | Style |
|---|---|---|
| Company | `exp.company` (+ ` · ${exp.client}` when set) | `--step-lead`, weight 600, `--ink` |
| Period | `formatPeriod(exp)` | mono 11 px, `--ink-muted`, `white-space: nowrap` |
| Role | `exp.role` (one canonical spelling per entry) | `--step-body`, weight 500, `--ink` |
| Location | `exp.location.city` + `exp.location.mode` | mono 11 px, `--ink-dim` |
| Summary | `exp.summary` | `--step-body`, `--ink-muted`, `max-width: 68ch` |
| Bullets | `exp.impact[]` | `<ul>` with a 1 px 8 px-wide leading rule (no disc, no dot glyph), `--ink-muted` |
| Case link | `exp.caseSlug` → `<Link href={"/work/"+slug}>See case →</Link>` | mono 11 px, `--ink`, underline on hover |

Layout: `grid md:grid-cols-[180px_minmax(0,1fr)]` — period in the left rail, everything else right. `hairline-b` between entries, `padding-block: 28px`. The `Earlier` freelance line (2010–2014) renders as a single compact row with no bullets.

### 4.3 `CvSkills`

```ts
export default function CvSkills(): JSX.Element;
```
- `cv.skills` is an array of `{ group: string; items: string[] }` — including the **engineering** group the PDF lacks (TypeScript, React, Next, Node, testing, PWA, IndexedDB, CSP, Git; plan §1b).
- `cv.tools` is `{ group: "design" | "code" | "ai"; items: string[] }[]`.
- Render: group label as `kicker`, items as a comma-joined mono line (**not** chips — chips triple the print height and 30 pills is visual noise). `column-count: 2` on `md+` for density.

### 4.4 `CvSidebar`

- **Education**: `cv.education[]` — year, degree (`--ink`, weight 500), institution (`--ink-muted`).
- **Certifications**: `cv.certifications[]` — Globant 2018, ADL 2020, Coursera 2022.
- **Languages**: `cv.languages[]` — `Spanish · Native`, `English · B1 · working proficiency` (plan D11, exact wording from the copy deck).
- **References**: maps `testimonials` (three entries today, `01-data-model.md` §4) in array order, with the Francesca Steri quote first — plan D10 makes it the priority one. No filter field is introduced; if the list ever grows past four, add `.slice(0, 3)` rather than a data flag. Each entry: the quote at `--step-small` with `text-wrap: pretty`, then name + role + company. No photos, no quotation-mark glyph.
- Sidebar is `<aside>` with an `aria-label`; on `< lg` it moves below `CvSkills` and becomes a 2-column grid.

### 4.5 `PrintButton`

```tsx
"use client";
export default function PrintButton(): JSX.Element;
```
`<button type="button" className="btn-pill print:hidden" onClick={() => window.print()}>Download PDF</button>`
No `useEffect`, no state. If a static `site.cv.pdf` path is ever provided, the component prefers a plain `<a href download>` — check `site.cv.pdf` first and fall back to `window.print()`.

---

## 5. Metadata

`src/app/cv/layout.tsx` keeps only:

```ts
export const metadata: Metadata = {
  title: "CV",                                   // template appends " · Douguizard"
  description: site.summary,
  alternates: { canonical: "/cv" },
  openGraph: { title: `${site.name} — CV`, description: site.summary },
};
export default function CvLayout({ children }: { children: React.ReactNode }) { return children; }
```

The stale `"CV — Senior Product Designer × AI"` and the "12+ years across Mercadolibre…" description are deleted. Full SEO rules are owned by `06-seo.md`.

---

## 6. Print stylesheet

Lives at the end of `globals.css`. Target: **≤ 2 pages** on both A4 (210 × 297 mm) and US Letter (216 × 279 mm). Letter is 18 mm shorter, so all measurements are tuned to Letter and A4 simply gets more slack.

```css
@page { size: auto; margin: 12mm 14mm; }

@media print {
  /* Ink on white, whatever the screen theme was. */
  :root, :root[data-theme="dark"], :root[data-theme="light"] {
    --paper: #FFFFFF; --paper-raised: #FFFFFF;
    --ink: #000000; --ink-muted: #333333; --ink-dim: #555555;
    --line: #CCCCCC; --line-strong: #999999;
    color-scheme: light;
  }
  html, body { background: #fff !important; }

  .site-header, .skip-link, .theme-toggle, .glow-corner,
  [data-print="hide"], .print\:hidden { display: none !important; }

  /* Two columns become one flow; the sidebar follows the body. */
  .cv-grid { display: block !important; }
  .cv-sidebar { margin-block-start: 6mm; }

  /* Keep a job from splitting across the fold. */
  .cv-entry, .cv-edu, .cv-cert, .cv-ref { break-inside: avoid; page-break-inside: avoid; }
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }

  /* Print type scale — override the fluid clamps, which key off vw. */
  body        { font-size: 9.5pt; line-height: 1.38; }
  .cv-name    { font-size: 20pt; }
  .cv-headline{ font-size: 11pt; }
  h2          { font-size: 10.5pt; letter-spacing: .16em; }
  .cv-role    { font-size: 10pt; }
  .cv-meta    { font-size: 8pt; }

  a { text-decoration: none; color: inherit; }
  a[href]::after { content: none; }     /* never expand URLs — it costs a page */
  ul { list-style: none; }
  * { box-shadow: none !important; }
}
```

**Why `size: auto` and not `size: A4`:** forcing A4 makes Chrome scale the sheet on a Letter-configured printer and the fold moves. `auto` lets the driver decide; the 12 mm × 14 mm margins and the pt scale above fit both.

**Two-page proof:** print the page with every `cv.experiences` entry (8 entries: naowee, mercadolibre, aval, globant, qrvey, ideaware, smartbiz, freelance-earlier) — QA measures it (`09-qa-checklist.md` §8). If it overflows, the lever in order is: (1) drop `exp.summary` in print for entries older than Globant via `.cv-entry--old .cv-summary { display: none }`, (2) reduce `impact[]` to the first two bullets for those entries, (3) go to 9pt. Never shrink below 9pt and never remove Naowee/Mercadolibre/Aval detail.

---

## 7. Responsive

| Width | `/cv` |
|---|---|
| 320 | one column; period moves above the company; `Download PDF` and `LinkedIn` stack full-width; no horizontal scroll |
| 375 | as above |
| 768 | `md:grid-cols-[180px_1fr]` inside experience entries; skills go 2-column |
| 1024 | main + sidebar two-column grid engages (`1fr / 320px`) |
| 1440 | content capped at `1100px`, centred |
| 1920 | unchanged; the glow stays anchored to the content box, not the viewport |

---

## 8. Accessibility

- Landmarks: global `header`, `main#main`, `aside[aria-label="Education, certifications and references"]`, `footer`.
- Outline: `h1` = name; `h2` = Experience / Skills / Tools / Education / Certifications / Languages / References; `h3` = each company.
- Experience is an ordered structure but not a ranking — use `<ol>` for the entries (chronology is meaningful) and `<ul>` for the bullets.
- Contrast AAA on all copy in both themes (`00-tokens.md` §5); `--ink-dim` only on location and meta lines.
- `PrintButton` is a real `<button>`, keyboard-operable, ≥ 44 px.
- `See case →` links carry `aria-label={"See the " + company + " case study"}` so a list of identical "See case" links is distinguishable.
- The route contains **no** autoplaying media, no cursor hijack, no scroll hijack — all three are deleted with the clone.

---

## 9. Open items for Doug (do not invent)

1. **ADL exit month and Mercadolibre start month** (plan D5 ⚠️) — `formatPeriod` must render `2024` (year only) until these arrive; it must not guess a month.
2. **Which email prints** — `hello@douguizard.com` (site) vs `dougvargas72@gmail.com` (PDF). Default to `site.email`; flip via `site.email` only.
3. **Phone on the public CV page.** Default applied above: hidden on screen, printed on the sheet. Doug can override by clearing `site.phone`.
4. **Photo** (plan D13) — the 190 px PDF crop is unusable. Ship without a portrait unless an original arrives.

---

## 10. Acceptance criteria

1. `grep -rn "three\|lenis\|paper-design\|clsx\|Loader\|CustomCursor\|SmoothScroll\|Scene3D" src/ package.json` → **0 hits**.
2. `/cv` renders fully in Chrome launched with `--disable-gpu --disable-software-rasterizer` (the current build shows "This page couldn't load").
3. `/cv` route JS ≤ **40 kB gz**; the page is server-rendered (view-source contains the experience text).
4. `/cv` imports `@/data/cv` and `@/data/site`; `grep -rn "@/data/cv" src/` returns at least `cv/page.tsx` (today it returns nothing).
5. Every experience entry on `/cv` matches the same entry in the About mini-timeline character-for-character (both read `cv.experiences`).
6. `window.print()` preview in Chrome at default settings produces **2 pages or fewer** on both A4 and Letter, with no orphaned heading and no entry split across the fold.
7. Print output is black on white regardless of the active theme; no header, no toggle, no glow, no `Download PDF` button appears on the sheet.
8. Naowee appears as the current role; no page anywhere says "currently at Mercadolibre" or "Senior Product Designer".
9. axe: 0 violations on `/cv` in both themes.
10. `next build` EXIT=0 and `/cv` is emitted as a static route.
