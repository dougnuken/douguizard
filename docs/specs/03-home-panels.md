# 03 — Home, panel by panel

**Files:** `src/app/page.tsx` · `src/components/sections/{Hero,Work,Craft,About,Contact}.tsx` · `src/components/vignettes/*.tsx` (new)
**Source:** plan §2 (live vignettes), §3.4 (panel table), §1 D4/D9/D10.
**Copy:** every string comes from `07-copy-deck.md` or `src/data/`. This spec defines **structure, layout, states and behaviour only** — it never invents sentences.

---

## 1. Panel order and files

`page.tsx` becomes:

```tsx
export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <SectionIndex />
      <HorizontalShell>
        <Hero />       {/* id="home"    — sections[0] */}
        <Work />       {/* id="work"    — sections[1] */}
        <Craft />      {/* id="craft"   — sections[2] */}
        <About />      {/* id="about"   — sections[3] */}
        <Contact />    {/* id="contact" — sections[4] */}
      </HorizontalShell>
    </main>
  );
}
```

| Action | Path |
|---|---|
| REWRITE | `src/components/sections/Hero.tsx` |
| CREATE | `src/components/sections/Work.tsx` (replaces `SelectedWork.tsx`) |
| CREATE | `src/components/sections/Craft.tsx` (replaces `Capabilities.tsx`) |
| REWRITE | `src/components/sections/About.tsx` |
| CREATE | `src/components/sections/Contact.tsx` (replaces `Footer.tsx`) |
| CREATE | `src/components/vignettes/{VignetteOlbo,VignetteNaowee,VignetteMercadolibre,VignetteBanco}.tsx` |
| CREATE | `src/components/vignettes/vignette.css` — **no**, use utility classes only; no new stylesheet |
| DELETE | `SelectedWork.tsx`, `Capabilities.tsx`, `Footer.tsx`, `Intro.tsx`, `Manifesto.tsx`, `Marquee.tsx`, `Stats.tsx`, `PortfolioCarousel.tsx`, `TestimonialsCarousel.tsx`, `ToolsMarquee.tsx`, `WorkTimeline.tsx`, `Navigation.tsx`, `Spark.tsx`, `TrueFocus.tsx`, `BackgroundPaths.tsx`, `SplitText.tsx`, `BlurText.tsx`, `ShinyText.tsx`, `TextPressure.tsx`, `EtherealShadow.tsx`, `Loader.tsx`, `CustomCursor.tsx`, `SmoothScroll.tsx`, `figures/GeoFigures.tsx`, `three/*` |
| KEEP | `text/RevealText.tsx` — the only motion primitive on the home |

---

## 2. Shared panel shell

Every panel is a `<section id={…}>` inside its `[data-panel]` wrapper (the wrapper owns `h-svh`/`overflow-y-auto` — see `02-chrome-and-shell.md` §4.1). Panels therefore declare:

```tsx
<section
  id="work"
  aria-labelledby="work-title"
  className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-16 md:px-12 lg:min-h-full lg:justify-center lg:py-20"
>
```

Rules that apply to all five:

- Max content width **1400 px**, gutters `24px` → `48px` at `md`.
- Desktop: content is vertically centred **when it fits**; when it does not (Work, About) the panel scrolls internally and the content starts at the top — `lg:justify-center` degrades correctly because the wrapper is `overflow-y:auto`.
- Mobile: the panel is `min-h-svh` (never `h-svh`) so long content simply extends the page.
- Motion: `RevealText` only, `variant="fade"` or `"mask"`, `delay` capped at `0.25 s`, `transform`+`opacity` only, disabled under reduced motion (already built in).
- Each panel has exactly one `h2` (`id={…}-title`), except Hero which owns the page `h1`.
- Panel headers use the `kicker` utility for the section number + label: `<p class="kicker">01 — Selected work</p>`.

---

## 3. Panel 00 — Hero

### Desktop layout (≥ lg, inside `h-svh`)

```
┌─ 1400 ─────────────────────────────────────────────────────┐
│                                                     ░░░░░  │ ← .glow-corner
│  PRODUCT × SYSTEMS × CODE                          ░░░░░░  │   (bottom-right,
│                                                    ░░░░░   │    static, z-0)
│  ┌─ h1, 800, --step-display, max 14ch ─────────┐            │
│  │  <site.h1 from copy deck>                   │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  <site.summary line — the PD → DE arc>   max 58ch           │
│                                                             │
│  [ in  LinkedIn ]  ( See work → )                           │
│  ───────────────────────────────────────────────────────    │
│  NAOWEE   MERCADOLIBRE   GRUPO AVAL / BANCO DE OCCIDENTE    │
│  GLOBANT   QRVEY   IDEAWARE                                 │
└─────────────────────────────────────────────────────────────┘
```

- Grid: single column, `gap` rhythm `12 / 28 / 40 / 56` px scaled by the step scale. The hero is **left-aligned**, never centred (that is the SaaS-hero anti-pattern).
- Kicker: `PRODUCT × SYSTEMS × CODE` (`kicker` utility). It is a `<p>`, not a heading.
- `h1`: `--step-display`, weight **800**, `line-height: .92`, `letter-spacing: -.035em`, `max-width: 14ch`. Revealed with `RevealText variant="mask"` **per line**, not per character (plan §2 retires `SplitText`).
- Sub: `--step-lead`, weight 400, `--ink-muted`, `max-width: 58ch`.
- CTAs, in this order and no other: `LinkedIn` = `.btn-pill .btn-pill--solid` with `LinkedInMark`, `href` from `site.social.find(s => s.primary)!.href`; `See work` = `.btn-pill` (outline) linking to `#work`. The primary pill carries a 1 px `signal` underline (`box-shadow: inset 0 -2px 0 0 var(--signal)`) — the one permitted CTA use of the accent.
- Glow: one `.glow-corner`, bottom-right, `z-index: 0`; the content column is `position: relative; z-index: 1`.

### 3.1 Wordmark strip (D4)

**Typographic, not logos.** No third-party SVG marks are downloaded, embedded or recoloured — this avoids trademark misuse and keeps the payload at zero bytes.

```tsx
<section aria-labelledby="wordmarks-label" className="hairline-t pt-6">
  <h2 id="wordmarks-label" className="sr-only">Where the work happened</h2>
  <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
    {getWordmarks().map((w) => (
      <li key={w} className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-dim)]">{w}</li>
    ))}
  </ul>
</section>
```

- `getWordmarks(): string[]` is a new helper in `src/lib/career.ts`, derived from `cv.experiences` — no new data field. It drops the `freelance` "Earlier" entry and renders `exp.client ? `${exp.company} / ${exp.client}` : exp.company`, which is what yields the Aval / Banco de Occidente pair. `career.ts` already imports only from `cv.ts`, so no import cycle. Expected output, newest-first: `Naowee · Mercadolibre · Aval Digital Labs / Banco de Occidente · Globant · Qrvey · Ideaware · Smartbiz Solutions`. The exact display strings (e.g. whether D4's "Grupo Aval" wins over "Aval Digital Labs", and whether Smartbiz appears) are **copy**, owned by `07-copy-deck.md`.
- Colour `--ink-dim` (5.43:1 / 4.88:1 — AA, and the list is non-essential: every company also appears in About and `/cv`).
- Static. **No marquee**, no auto-scroll. On `< md` it wraps to two or three rows; no horizontal rail.
- `h2.sr-only` keeps the heading outline valid without a visible label.

### 3.2 Mobile

Stacked in the same order; `h1` at 48 px; CTAs become two full-width pills stacked with 12 px gap; the wordmark strip wraps. The glow is reduced to `opacity: .35` and anchored bottom-right of the panel (it must never sit behind the `h1`).

---

## 4. Panel 01 — Work

Two stacked blocks inside one scrolling panel: the **case index** (rows with live vignettes) and the **compact rows**.

### 4.1 Row anatomy — cases with a vignette (olbo, Naowee, Mercadolibre, Banco de Occidente)

```
┌─ row (a, block, hairline-b) ──────────────────────────────────────────┐
│  /01   olbo                              ┌──────────────────────────┐ │
│        Personal product · 2026           │  <VignetteOlbo />        │ │
│        <tagline, 1 line, --ink-muted>    │  monochrome, 16:10       │ │
│        Design engineering · AI           └──────────────────────────┘ │
│                                                            Read →     │
└───────────────────────────────────────────────────────────────────────┘
```

- Grid `lg:grid-cols-[minmax(0,1fr)_380px]`, `gap: 40px`, `align-items: center`, `padding-block: 28px`.
- Each row is one `<Link href={"/work/"+slug}>` wrapping the whole cell (a single tab stop, single target ≥ 44 px tall).
- Number: `section-num`, mono, tabular, `--ink-dim`.
- Title: `--step-title` scaled down (`clamp(1.5rem, 2.2vw, 2.25rem)`), weight 600, `--ink`.
- Meta line: mono 11 px, `--ink-muted`; fields from `getCaseMeta(slug)` (`01-data-model.md`) — client, role, period. Never hardcoded.
- `Read →` affordance: mono 11 px, `--ink`, arrow translates `4px` on group hover/focus.
- **Hover/focus:** the title gains `text-decoration: underline` (offset 6 px, thickness 1 px) and the vignette lifts `translateY(-2px)`. **No colour change, no background fill.** `:focus-visible` puts the 2 px signal ring around the whole row.
- Mercadolibre carries an extra chip under the meta line: `<span class="kicker hairline-t …">Case study available on request</span>` — mono 10 px, `--ink-dim`, 1 px border, pill, no fill.

### 4.2 Compact rows (Royal Caribbean, Qrvey, Ideaware)

Single column, no vignette, `padding-block: 18px`, `hairline-b`. Number · title · one-line meta · `Read →`. Same hover/focus rules. Introduced by a `kicker` divider: `Earlier work`.

### 4.3 The four live vignettes

Shared contract:

```tsx
export interface VignetteProps { className?: string }
export default function VignetteX({ className }: VignetteProps): JSX.Element;
```

Shared rules (all four):

- **Zero new dependencies.** Pure JSX + Tailwind utilities + inline `<svg>`. No framer-motion (they use CSS `@keyframes` declared in `globals.css` under `@layer utilities`, or no animation at all).
- Monochrome: only `--ink`, `--ink-muted`, `--ink-dim`, `--line`, `--paper`. **No signal.**
- Container: `aspect-ratio: 16/10; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; padding: 14px;` — the same flat 1 px / 12 px language as the case frames (`04-case-template.md` §6).
- `role="img"` + an `aria-label` that states what the vignette shows in one sentence; all inner text `aria-hidden`. Rationale: the marks are illustrative, and letting AT read loose numerals ("6 5 3 4") is noise.
- Animation runs **only** while the row is in view (`IntersectionObserver`, reuse the one inside `RevealText` by wrapping the vignette in `<RevealText as="div" variant="fade">` and toggling a `data-run` attribute) and **never** under `prefers-reduced-motion`, where the component renders its final frame.
- Animated properties: `transform` and `opacity` exclusively.
- Text inside the vignettes is mono 10–11 px; it is decorative, so `--ink-dim` is acceptable.

| Component | Shows | Motion |
|---|---|---|
| `VignetteOlbo` | A voice-capture card: a 14-bar waveform row, a transcript line, an amount, and an inferred-category chip with a hairline tick | Bars `scaleY` in a 1.4 s loop with 40 ms stagger; the chip fades in at 900 ms. Reduced motion → flat bars at final height, chip visible |
| `VignetteNaowee` | An inbox counter pair: `Pending 6 → 5`, `Assigned 3 → 4`, plus a 4-row list where one row moves from the first group to the second | Two digit columns of height `1lh` sliding by `translateY(-1lh)` once per 3 s cycle; the moving row shifts `translateY` by its own height. Reduced motion → shows `5` and `4` with a static `—` delta and the row already in place |
| `VignetteMercadolibre` | Component anatomy: three token rows (`color.bg.primary`, `space.16`, `radius.8`) on the left, an arrow, three rendered variants (solid / outline / ghost pill) on the right | None — it is a static diagram. Hover on the parent row raises it 2 px only |
| `VignetteBanco` | Design-system evidence: a 6-row token table (name · grayscale swatch · usage) above a 5 × 4 grid of component glyphs drawn as 1 px rectangles/circles | None — static |

`VignetteNaowee`'s digits must not cause layout shift: both digits live in a `overflow:hidden; height:1lh` column with `font-variant-numeric: tabular-nums`.

### 4.4 Panel header and footer

Header: `01 — Selected work` kicker + `h2#work-title`. Footer of the panel: a single mono link `Full CV →` to `/cv`.

### 4.5 Responsive

| Width | Work panel |
|---|---|
| ≤ 767 | one column; vignette moves **below** its text block, full width, `aspect-ratio: 16/10`; compact rows unchanged |
| 768–1023 | one column, vignette at `max-width: 420px` aligned left |
| ≥ 1024 | two columns `1fr / 380px`; panel scrolls internally (7 rows exceed `100svh`) |

---

## 5. Panel 02 — Craft

Two clearly separated blocks under one `h2#craft-title`, divided by a full-width `hairline-t` and a 64 px gap.

### 5.1 Expertise — three numbered cards

```
FIG 0.1                FIG 0.2                FIG 0.3
──────                 ──────                 ──────
Product direction      Design systems         Design engineering with AI
<3-line body>          <3-line body>          <3-line body>
```

- `grid lg:grid-cols-3`, `gap: 0`, separated by `border-inline-start: 1px solid var(--line)` on cells 2–3 with `padding-inline: 32px` (rules meet; no floating gaps).
- `FIG 0.x` label: mono 10 px, `0.25em`, `--ink-dim`, above a 24 px `hairline-t` tick.
- Card title: `h3`, `--step-lead`, weight 600.
- Body: `--step-body`, `--ink-muted`, `max-width: 34ch`.
- The numbering `0.1 / 0.2 / 0.3` is ours, not antid's; it is generated from the array index, never typed.
- No card background, no border box, no shadow — the rules are the structure.

### 5.2 How I work — four steps

- `grid lg:grid-cols-4`, same rule-between-cells treatment.
- Each step: `section-num` `01…04`, `h3` title, one-sentence body in `--ink-muted`.
- Cards 1–4 reveal with a 60 ms stagger, capped.

### 5.3 Responsive

`< md`: both blocks become single-column stacks with `hairline-b` between items instead of `border-inline-start`. `md`: 2 × 2 grids. `lg`: 3-up and 4-up as drawn.

---

## 6. Panel 03 — About

Two-column on desktop `lg:grid-cols-[minmax(0,1fr)_380px]`, `gap: 64px`.

**Left column**
1. `h2#about-title` + kicker `03 — About`.
2. Bio: `site.summary` rendered as 2 paragraphs, `--step-lead` for the first, `--step-body` for the second, `max-width: 62ch`.
3. **Mini-timeline**, built from `cv.experiences` (newest first, all entries including `smartbiz` and the `Earlier` freelance line):
   ```
   NAOWEE            Jan 2026 — Present     Head of Product              See case →
   MERCADOLIBRE      2024 — Jan 2026        Technical Lead, Andes DS     See case →
   ...
   ```
   - Rows: `grid md:grid-cols-[180px_180px_minmax(0,1fr)_auto]`, mono 11 px for company and period, `--step-small` for the role, `hairline-b`.
   - Company in `--ink`, period in `--ink-muted`, role in `--ink-muted`.
   - `See case →` renders only when `experience.caseSlug` is set; it is a `<Link>` with its own focus ring and a ≥ 44 px hit area.
   - Periods come from `formatPeriod(exp)` (`src/lib/career.ts`) — never typed inline.
4. Education + languages: two mono lists under a `hairline-t`, `--ink-muted`.
5. `Full CV →` link to `/cv`, `.btn-pill`.

**Right column** — facts, derived from data, never hardcoded:

| Label | Value source |
|---|---|
| Based | `site.location.city, site.location.country` + `site.location.timezone` |
| Currently | `currentExperience().role` + `currentExperience().company` |
| Experience | `yearsOfExperience()` years — computed from `cv.experiences[last].start`, so the "twelve years / a decade" contradiction cannot recur |
| Availability | `site.availability.label` — plain text, **no dot, no colour, no pulse** |
| Languages | `cv.languages` joined |

Photo: if Doug supplies a usable original (plan D13), it slots at the top of the right column as a `next/image` 1:1, 320 px, `border-radius: 12px`, grayscale (`filter: grayscale(1)`), with a real `alt`. Absent an original, the column starts with the facts — **do not** upscale the 190 px PDF crop.

`< lg`: single column, facts move below the timeline as a 2-column definition list.

---

## 7. Panel 04 — Contact

Centred-left, generous. No giant wordmark, no `● Online`.

1. Kicker `04 — Contact`, `h2#contact-title` at `--step-title`.
2. One sentence of lead copy, `--step-lead`, `max-width: 44ch`.
3. Channel list, in this exact order, as a `<ul>` of large rows separated by `hairline-b`:
   | Order | Channel | Treatment |
   |---|---|---|
   | 1 | **LinkedIn** (`site.social` entry with `primary: true`) | `.btn-pill .btn-pill--solid` + `LinkedInMark`, the only solid element on the panel |
   | 2 | Email (`site.email`) | large `<a href="mailto:">`, `--step-lead`, underline on hover |
   | 3…n | the remaining `site.social` entries in array order (Behance, GitHub if Doug confirms it) | mono rows |
   Dribbble is already removed from `site.social` in `01-data-model.md` §2 — the panel simply maps the array, so nothing filters it here.
4. Footer rule: `<footer>` with `© {year} Doug Vargas · Barranquilla, Colombia` in mono 11 px `--ink-dim`, plus a `Back to top` link that scrolls the shell to panel 00.

`<footer>` here is the site's only `contentinfo` landmark on `/`.

---

## 8. Accessibility (home-wide)

- Exactly one `h1` (Hero). `h2` per panel with `aria-labelledby` wiring on the `<section>`.
- Every vignette: `role="img"` + descriptive `aria-label`; inner text `aria-hidden="true"`.
- Case rows: one link per row wrapping the whole cell; the accessible name is `{project} — {tagline}` via `aria-label` so it is not just "Read".
- Wordmark list: `<ul>` with an `sr-only` heading; items are not links.
- `Availability` is text, never colour-coded.
- Contrast: all running copy uses `ink`/`ink-muted` (AAA); `ink-dim` is limited to numerals, `FIG 0.x`, wordmarks and vignette internals.
- Touch targets ≥ 44 px on every row, chip and pill; index rail included.
- Motion: reveals are `opacity` + `translateY(8px)` over 300 ms with `--ease-out`; all suppressed under `prefers-reduced-motion` (RevealText already honours it; the two animated vignettes must honour it explicitly).

---

## 9. Acceptance criteria

1. `page.tsx` renders exactly five children of `HorizontalShell`, in the order Hero · Work · Craft · About · Contact, with `id`s matching `sections.ts`.
2. `grep -rn "const experience\|const facts\|const tools\|const proof\|const capabilities" src/components/` → **0 hits**; every list comes from `src/data/`.
3. No component imports `Spark`, `TrueFocus`, `BackgroundPaths`, `SplitText`, `BlurText`, or `GeoFigures`; those files are gone.
4. The four vignettes render with **zero** network requests and add **zero** dependencies (`npm ls` unchanged after the panel work).
5. `VignetteNaowee` and `VignetteOlbo` show their final frame under `prefers-reduced-motion: reduce`, and their animations stop when the row leaves the viewport (verify with `getAnimations()`).
6. Hovering any case row changes **no** colour — only underline and a 2 px lift (screenshot diff of the row before/after hover shows no hue change).
7. "Case study available on request" appears on the Mercadolibre row and the Mercadolibre case page, nowhere else.
8. The About facts update automatically: changing `cv.experiences[0]` in data changes "Currently" on the home with no component edit.
9. `yearsOfExperience()` is the only source of a years figure on the home; `grep -rn "decade\|twelve years\|12 years" src/components/` → 0.
10. At 320 px the Work panel shows one column, the vignettes are full-width, and `body.scrollWidth === 320`.
