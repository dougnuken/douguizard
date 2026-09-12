# 04 — Case-study template

**Files:** `src/app/work/[slug]/page.tsx` (818 → ~120 lines) · `src/components/case/*` (new) · `src/components/work/{BrowserFrame,DeviceMockup,DeviceVideo,MockupGallery,PhoneFrame}.tsx`
**Source:** plan §1.5, §2 (flat frames), audit §A (current structure), `04` verdicts table.
**Rule:** every conditional in the current page is preserved verbatim. This is a **split and re-theme**, not a redesign of the narrative.

---

## 1. Objective

Break the monolith into ten composable sections under 300 lines each, move the three meta fields onto `getCaseMeta()`, add a testimonial slot, and flatten every frame to the B/W language (1 px bezel, 12 px radius, no halo, no bloom, no gradient).

---

## 2. Files

| Action | Path | Approx. lines |
|---|---|---|
| REWRITE | `src/app/work/[slug]/page.tsx` | ~120 (composition + the five derived flags) |
| CREATE | `src/components/case/CaseHeader.tsx` | ~70 |
| CREATE | `src/components/case/CaseMeta.tsx` | ~50 |
| CREATE | `src/components/case/CaseLinks.tsx` | ~45 |
| CREATE | `src/components/case/CaseImpact.tsx` | ~70 |
| CREATE | `src/components/case/CaseNarrative.tsx` | ~60 — Context + What I did |
| CREATE | `src/components/case/CaseProcess.tsx` | ~60 |
| CREATE | `src/components/case/CaseDecisions.tsx` | ~55 |
| CREATE | `src/components/case/CaseFeatures.tsx` | ~80 |
| CREATE | `src/components/case/CaseProduct.tsx` | ~110 — video + gallery |
| CREATE | `src/components/case/CaseTestimonial.tsx` | ~55 (new slot) |
| CREATE | `src/components/case/CaseColophon.tsx` | ~70 — tools · live link · authorship |
| CREATE | `src/components/case/CaseNext.tsx` | ~55 |
| CREATE | `src/components/case/primitives.tsx` | ~90 — `FadeIn`, `Eyebrow`, `EyebrowHeading`, `Band`, `renderBold` |
| CREATE | `src/components/work/PhoneFrame.tsx` | ~90 — the single extracted frame |
| MODIFY | `src/components/work/BrowserFrame.tsx` | flatten; keep the 732-line API surface |
| MODIFY | `src/components/work/DeviceMockup.tsx`, `DeviceVideo.tsx` | import `PhoneFrame`; delete the duplicate |
| MODIFY | `src/app/work/[slug]/not-found.tsx` | accent → ink |
| KEEP | `src/components/work/MockupGallery.tsx` | untouched |

---

## 3. New `page.tsx`

Stays a client component (it uses `useParams`), but loses the `useEffect` (see `02-chrome-and-shell.md` §6) and the fixed header.

```tsx
"use client";
import { MotionConfig } from "framer-motion";
import { useParams, notFound } from "next/navigation";
import { getCaseStudy, getNextCaseStudy, getCaseMeta } from "@/data/work";
/* …case/* imports… */

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const meta = getCaseMeta(study.slug);
  const next = getNextCaseStudy(study.slug);

  // ── the five derived flags, moved verbatim from the old file ──
  const showExternalLink = Boolean(study.externalLink) && !study.links?.length;
  const videoPoster = study.video?.poster ?? study.gallery?.[0]?.src;
  const video = videoPoster && study.video ? study.video : undefined;
  const hasGallery = Boolean(study.gallery?.length);
  const galleryKind = study.galleryKind ?? "phone";
  const videoKind = study.videoKind ?? galleryKind;

  return (
    <MotionConfig reducedMotion="user">
      <main id="main" tabIndex={-1}>
        <CaseHeader study={study} meta={meta} />
        <CaseMeta meta={meta} />
        {study.links?.length ? <CaseLinks links={study.links} /> : null}
        <CaseImpact impact={study.impact} kpis={study.kpis} />
        <CaseNarrative context={study.context} contributions={study.contributions} />
        {study.process?.length ? <CaseProcess process={study.process} /> : null}
        {study.decisions?.length ? <CaseDecisions decisions={study.decisions} /> : null}
        {study.testimonialId ? <CaseTestimonial id={study.testimonialId} /> : null}
        {study.features?.length ? (
          <CaseFeatures intro={study.featuresIntro} features={study.features} />
        ) : null}
        {(hasGallery || video) && (
          <CaseProduct
            project={study.project}
            video={video}
            videoPoster={videoPoster}
            videoKind={videoKind}
            gallery={study.gallery}
            galleryKind={galleryKind}
          />
        )}
        {(study.technologies || showExternalLink || study.credits) && (
          <CaseColophon
            technologies={study.technologies}
            externalLink={showExternalLink ? study.externalLink : undefined}
            credits={study.credits}
          />
        )}
        <CaseNext next={next} />
      </main>
    </MotionConfig>
  );
}
```

Every guard above is the same guard the 818-line file had. Nothing that renders today stops rendering.

---

## 4. Component APIs

```ts
// primitives.tsx
export function FadeIn(p: { children: ReactNode; delay?: number; className?: string }): JSX.Element;
export function Eyebrow(p: { children: ReactNode; sticky?: boolean }): JSX.Element;          // <div>
export function EyebrowHeading(p: { children: ReactNode; sticky?: boolean }): JSX.Element;   // <h2>
export function Band(p: { children: ReactNode; tone?: "paper" | "raised"; rule?: "t" | "b" | "y" | "none"; wide?: boolean }): JSX.Element;
export function renderBold(text: string): ReactNode;   // **bold** → <strong>
```

`Band` replaces the repeated `section className="relative z-[2] px-6 md:px-12 py-28 …"`. `tone="raised"` maps to `--paper-raised`; the old three-way `bg-deep / bg-mid / bg-soft` rhythm collapses to two tones. `wide` swaps the `1100px` prose measure for the `1400px` media measure.

```ts
// CaseHeader.tsx
export default function CaseHeader(p: { study: CaseStudy; meta: CaseMeta }): JSX.Element;
```
Renders, in order: the **in-flow** breadcrumb row that replaces the deleted fixed header — `← All work` (`Link href="/#work"`) · `{study.num}` · `{study.category}` · `{meta.year}`, all mono 11 px — then the client line (`h2`, mono, `0.3em`, **`--ink-muted`**, was accent), the `h1` (`--step-display`, weight 800, mask reveal), and the tagline (`--step-lead`, `--ink`, `max-width: 46ch`). Hero band is `min-block-size: 62svh`, `padding-block-start` = header height + 48 px. `Spark` is removed from the eyebrow row.

```ts
// CaseMeta.tsx
export default function CaseMeta(p: { meta: CaseMeta }): JSX.Element;
```
`CaseMeta` (the type) is produced by `getCaseMeta(slug)` in `01-data-model.md` and carries `{ client, role, period, year, team, duration }`, all derived from `cv.experiences` + the case's own overrides. The strip renders four cells (`Role · Duration · Team · Year`) in a `grid-cols-2 md:grid-cols-4` with the `/ Label` mono caption. No field is read off `study` directly any more.

```ts
// CaseLinks.tsx
export default function CaseLinks(p: { links: { label: string; href: string }[] }): JSX.Element;
```
Same 4-column rhythm. The leading accent dot on the first link is **deleted**; emphasis now comes from order and from the `hairline-b` under each link. Hover: underline thickens to 2 px + arrow translates 4 px. No colour change.

```ts
// CaseImpact.tsx
export default function CaseImpact(p: { impact: string; kpis: Kpi[] }): JSX.Element;
```
Impact sentence at `clamp(1.75rem, 4vw, 3.375rem)`, weight 500. KPI grid `grid-cols-2 md:grid-cols-4`. `KpiCard` moves inside this file: figure `font-display` weight 800, `--ink`; label mono 11 px `--ink-muted`; `delta` chip becomes mono 10 px `--ink-dim` preceded by a 1 px 8 px-wide rule instead of the accent dot.

```ts
// CaseNarrative.tsx
export default function CaseNarrative(p: { context: string; contributions: string[] }): JSX.Element;
```
Two `Band`s: `Context` (eyebrow-left / prose-right, `200px 1fr`) and `What I did` (numbered rows, `section-num` in `--ink-dim`).

```ts
// CaseProcess.tsx      p: { process: { phase: string; title: string; body: string }[] }
// CaseDecisions.tsx    p: { decisions: { title: string; body: string }[] }
// CaseFeatures.tsx     p: { intro?: string; features: { title: string; body: string; kind?: "ai" | "product" }[] }
```
Structure identical to today (`<ol>`, `<ul>`, the two-up grid with meeting hairlines). Three re-themes:
- Decisions: the accent bullet becomes a 10 px × 1 px `--ink` rule on the baseline.
- `FeatureKind`: the `ai` variant loses the accent dot and accent text; both variants render as mono 10 px `--ink-dim` with a 1 px leading rule, and the `ai` one adds `letter-spacing: .3em` plus the word `AI`. Distinguished by text, never by colour alone (WCAG 1.4.1).
- Headings stay `h3` so the outline `h1 → h2 → h3` is preserved.

```ts
// CaseTestimonial.tsx  (new slot)
export default function CaseTestimonial(p: { id: string }): JSX.Element | null;
```
Looks the quote up in `src/data/testimonials.ts` by `id`; returns `null` when not found (so a stale id can never crash a build). Renders a `Band tone="raised"` with:
- `<figure>` → `<blockquote>` quote at `--step-lead`, weight 400, `max-width: 56ch`, with a 1 px `--line-strong` rule on the inline-start edge and 24 px padding.
- `<figcaption>` → name (`--ink`, weight 500), role + company (mono 11 px, `--ink-muted`).
- No avatar, no quotation-mark glyph, no card fill, no carousel. One quote per case.
- Placement: **after Decisions, before Features** — the endorsement lands on the argument, not on the screenshots.

```ts
// CaseProduct.tsx
export default function CaseProduct(p: {
  project: string;
  video?: CaseStudy["video"];
  videoPoster?: string;
  videoKind: "phone" | "browser";
  gallery?: { src: string; alt: string; caption?: string }[];
  galleryKind: "phone" | "browser";
}): JSX.Element;
```
Holds the `browserLabel(src)` helper verbatim (path → `product · module` chrome label) and the whole video/gallery branch exactly as it is today, including `featureCount={2}` for browser galleries, the `loop={false}` decision and its WCAG 2.2.2 rationale, the two-column phone layout and the full-measure browser layout. **No content, caption, dimension, `sizes` or `alt` changes.**

```ts
// CaseColophon.tsx   p: { technologies?: string[]; externalLink?: {label,href}; credits?: string }
// CaseNext.tsx       p: { next: CaseStudy }
```
`CaseNext`: the huge `h2` keeps its scale but hover changes **weight and underline**, not colour (today it goes accent). The arrow keeps its 4 px translate.

The old page-level `<footer>` (`← Back to all work · © 2026`) is deleted — the global footer is not on `/work/*`, so `CaseNext` ends the page and the global header carries the way back. Add `© {year} Doug Vargas` inside `CaseColophon`'s bottom rule so `contentinfo` still exists: wrap that last row in `<footer>`.

---

## 5. Band rhythm

| Section | Tone | Rule |
|---|---|---|
| Header (hero) | paper | — |
| Meta strip | paper | `y` |
| Links | paper | `b` |
| Impact + KPIs | paper | — |
| Context | raised | `y` |
| What I did | paper | — |
| Process | raised | `y` |
| Decisions | paper | — |
| Testimonial | raised | `y` |
| Features | raised | `t` |
| Product | raised, `wide` | `y` |
| Colophon | paper | `t` |
| Next | raised | `t` |

`--paper-raised` differs from `--paper` by ~4 % luminance — enough to read as a band change, not enough to look like a card.

---

## 6. Frame re-theme (the visual heart of this spec)

### 6.1 `PhoneFrame` — extracted once

```tsx
export interface PhoneFrameProps {
  children: ReactNode;           // an <Image> or a <video>
  className?: string;            // outer wrapper
  frameClassName?: string;       // width cap etc.
  style?: CSSProperties;
}
export function PhoneFrame(p: PhoneFrameProps): JSX.Element;
```

Today this markup exists twice, literally (`DeviceMockup.tsx:61+` and `DeviceVideo.tsx:42`, and the comment in `DeviceVideo` admits the copy). Both import the new module; the duplicates are deleted.

New visual spec:

| Property | Before | After |
|---|---|---|
| Bezel | multi-stop gradient + inner highlight | `border: 1px solid var(--line-strong)`; `background: var(--paper)` |
| Outer radius | ~44 px | **12 px** (plan §2) |
| Screen radius | inherits | 8 px, `overflow: hidden` |
| Halo | `absolute -inset-x-8 -inset-y-6 -z-10 blur-2xl` | **deleted** — both files, both call sites |
| Shadow | double drop shadow | **none** |
| Notch / speaker | rendered | keep the notch as a 1 px outlined pill, `--line`; drop any fill gradient |
| Hover lift | `translateY(-4px)` + shadow | `translateY(-2px)`, no shadow, off under reduced motion |

### 6.2 `BrowserFrame`

Keep the whole exported API (`BrowserFrameProps`, `BrowserWindowProps`, `BrowserVideoProps`, `BrowserShot`, `BrowserGalleryProps`, `BrowserChrome`, `BrowserGalleryLayout`, `layout`, `featureCount`, `stepDelay`, `priorityFirst`, `sizes`, `eyebrow`, `caption`). Changes:

- `halo?: boolean` — keep the prop for source compatibility but make it a **no-op**, and mark it `@deprecated` in the JSDoc. Remove the 3 render sites. (Deleting the prop would touch call sites in `CaseProduct` and buy nothing.)
- Window: `border: 1px solid var(--line-strong)`, `border-radius: 12px`, `background: var(--paper)`. No gradients, no bloom, no `box-shadow`.
- Chrome bar: 32 px tall, `hairline-b`, `background: var(--paper)`. The `"dots"` chrome becomes **three 6 px circles outlined 1 px in `--line-strong`, unfilled** — monochrome, no traffic-light colours.
- Address-bar label: mono 10 px `--ink-dim`, uppercase, truncated with `text-overflow: ellipsis`.
- Video controls: `--ink` on a `--paper` pill with a 1 px `--line-strong` border; hover raises opacity, never colour. Play/pause glyphs are inline SVG, `currentColor`, `stroke-width: 1.25`. Keep `playLabel`/`pauseLabel` and the accessible names exactly as they are.
- Reveal animation and `sizes` logic untouched.

### 6.3 `DeviceMockup` / `DeviceVideo` / `MockupGallery`

`DeviceMockup` and `DeviceVideo` keep their prop interfaces byte-for-byte; they only swap their inline frame for `<PhoneFrame>` and drop the halo div. `MockupGallery` is untouched (its `columns`, `stagger`, `mobile`, `hint`, `stepDelay`, `ariaLabel` behaviour is correct).

---

## 7. Responsive

| Width | Case page |
|---|---|
| 320 | `px-6`; `h1` at 48 px; meta strip 2 cols; KPI grid 2 cols; features 1 col; phone gallery = snap rail with `Swipe →` hint; browser gallery = 1 col stacked |
| 375 | as above |
| 768 | `px-12`; eyebrow-left / prose-right grids engage (`200px 1fr`); KPI 4 cols; features 2 cols with the meeting hairlines |
| 1024 | browser video runs the full `1400px` measure with the caption below; phone video uses the `400px 1fr` two-column layout |
| 1440 | prose capped at `1100px`, media at `1400px`, both centred |
| 1920 | identical to 1440 — nothing grows past the caps |

Sticky eyebrows (`md:sticky md:top-32`) must clear the fixed header: change the offset to `md:top-[calc(64px+2rem)]`.

---

## 8. Accessibility

- Outline: `h1` (project) → `h2` per section (`EyebrowHeading`) → `h3` per phase / decision / feature. The client line in `CaseHeader` stays an `h2` **only if** it precedes the `h1`; it does not — so it becomes a `<p class="kicker">`, fixing the current outline inversion (today an `h2` sits above the `h1`).
- One `<main id="main" tabIndex={-1}>`; one `<footer>` inside `CaseColophon`.
- All images keep their long, real `alt` from `work.ts`. Decorative SVG keeps `aria-hidden`.
- Video: `loop={false}`, visible replay/pause control, accessible name from `label`, "no sound" stated in the caption row. WCAG 2.2.2 satisfied as today.
- `FeatureKind` conveys AI vs Product **in text**, never by colour (this is the one 1.4.1 violation the re-theme fixes).
- Focus order follows the visual order; the whole page is a normal vertical document with no scroll containers, so 2.1.1 is trivially met.
- Contrast: prose `--ink`/`--ink-muted` (AAA); `--ink-dim` only on `/ Label` captions, chrome labels, `section-num` and KPI deltas.

---

## 9. Acceptance criteria

1. No file under `src/components/case/` or `src/app/work/` exceeds **300 lines**; `page.tsx` ≤ 140.
2. `grep -rn "color-accent\|blur-2xl\|bloom\|halo=" src/components/work/ src/components/case/` → only the deprecated no-op prop declaration in `BrowserFrame.tsx`.
3. `grep -c "PhoneFrame" src/components/work/DeviceMockup.tsx src/components/work/DeviceVideo.tsx` → both import it; the literal duplicate markup appears **once** in the repo.
4. Rendered `/work/olbo` and `/work/naowee-suid` contain the same section count, the same video sources, the same gallery items in the same order and the same captions as before the split (diff the extracted text content of both builds).
5. `/work/mercadolibre-andes` still renders only hero · meta · impact · context · what-I-did · colophon · next (the five skeleton cases must not gain empty sections).
6. `getCaseMeta()` is the only source of `role`, `duration`, `team`, `year` on the page — `grep -n "study.role\|study.team\|study.duration\|study.year" src/components/case/` → 0.
7. `CaseTestimonial` renders on any case whose data sets `testimonialId`, returns `null` otherwise, and the build succeeds with an unknown id.
8. Visual: at 1440 the phone and browser frames show a single 1 px border, 12 px corners, no shadow, no glow. Screenshot-diff against the pre-refactor capture shows the frame changed and the **screen content did not**.
9. Heading outline on `/work/olbo` is `h1 → h2* → h3*` with no skipped level (axe `heading-order` passes).
10. `next build` EXIT=0 and all 7 slugs still pre-render (`generateStaticParams` untouched).
