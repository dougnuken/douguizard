# 02 — Site chrome and horizontal shell

**Files:** `src/app/layout.tsx` · `src/app/page.tsx` · `src/components/SiteHeader.tsx` (new) · `src/components/ThemeToggle.tsx` (see `00-tokens.md` §10) · `src/components/SectionIndex.tsx` · `src/components/HorizontalShell.tsx` · `src/data/sections.ts` (new, typed in `01-data-model.md`)
**Source:** plan §1.3, §2 (LinkedIn always visible), §3.9, §6 (overscroll).

---

## 1. Objective

One header for the whole site. LinkedIn reachable without scrolling on `/`, `/cv` and `/work/*` at 375 and 1440. A horizontal shell that is horizontal from the **first painted frame** on desktop and is operable by keyboard. The per-panel theme machinery disappears now that the theme is global.

---

## 2. Files

| Action | Path |
|---|---|
| CREATE | `src/components/SiteHeader.tsx` (~120 lines, client) |
| CREATE | `src/components/icons/LinkedInMark.tsx` (~14 lines, server) |
| CREATE | `src/data/sections.ts` (see `01-data-model.md`) |
| MODIFY | `src/app/layout.tsx` — skip link + `<SiteHeader/>` above `{children}` |
| MODIFY | `src/app/page.tsx` — remove the loose brand `<a>`, wrap the shell in `<main id="main">` |
| REWRITE | `src/components/SectionIndex.tsx` — monochrome, data-fed, no `data-panel-theme` |
| MODIFY | `src/components/HorizontalShell.tsx` — CSS-only breakpoint, keyboard, overscroll |
| DELETE | `src/components/sections/Navigation.tsx` (the `/cv` header) |
| MODIFY | `src/app/work/[slug]/page.tsx` — delete the fixed `motion.header` and the `data-panel-theme` cleanup `useEffect` |

---

## 3. `SiteHeader`

```tsx
// "use client" — needs ThemeToggle and the mobile disclosure
export default function SiteHeader(): JSX.Element;
```

No props. Reads `site` and `sections` from `src/data/`.

### 3.1 Anatomy (desktop ≥ 1024)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Douguizard        Work  Craft  About  CV          [in LinkedIn]   [ ◐ ]    │
└───────────────────────────────────────────────────────────────────────────┘
   brand (left)     section links (centre)          pill        toggle (right)
```

- Element: `<header class="site-header">`, `position: fixed; inset-block-start: 0; inset-inline: 0; z-index: 60;`
- Height: **56 px** below `lg`, **64 px** from `lg`.
- Background: `color-mix(in srgb, var(--paper) 86%, transparent)` + `backdrop-filter: blur(12px)`. Bottom rule `1px solid var(--line)`. **No** shadow, no saturation boost, no glass token.
- Brand: `<Link href="/">Douguizard</Link>`, `font-display`, `600`, 17 px, `letter-spacing:-0.02em`, colour `var(--ink)`. **No asterisk** (the red `*` and `Spark` are deleted).
- Section links: only on `/` and only `≥ lg`. Fed by `sections.filter(s => s.num !== "00")` (the Home panel is the brand's own target, so it is not repeated as a link) — the `Section` type is `{ id, num, label, title }`, owned by `01-data-model.md` §5. Each is `<a href={"#"+id}>` with the mono meta type, `--ink-muted`, `aria-current="true"` when it is the active panel (state comes from the same active-section signal `SectionIndex` computes — see §5.3). A `CV` link to `site.cv.path` is appended. On any other route the whole set is replaced by a single `<Link href="/#work">Work</Link>` plus the `CV` link.
- LinkedIn pill: `.btn-pill` + `LinkedInMark` 14×14 + text `LinkedIn`, `target="_blank" rel="noopener noreferrer"`, `href={site.social.find(s => s.primary)!.href}` (`site.social` is a `SocialLink[]` with `primary: true` on LinkedIn — `01-data-model.md` §2). Visible at **every** width (it is the primary CTA of the whole site). Below `lg` the text label is kept — it is only 8 characters and hiding it would make the icon ambiguous.
- `ThemeToggle` last.

### 3.2 Anatomy (< 1024)

```
┌──────────────────────────────────────────────┐
│ Douguizard        [in LinkedIn] [ ◐ ] [ ≡ ]  │
└──────────────────────────────────────────────┘
```

Menu button `<button aria-expanded aria-controls="site-menu">` with a 2-line glyph. Opening reveals a **non-modal disclosure** anchored under the header:

- `<nav id="site-menu" aria-label="Sections">` with `hairline-b`, `background: var(--paper)`, full width, links stacked, each ≥ 48 px tall.
- Content: the section anchors (on `/` only), then `Work`, `CV`, `LinkedIn`, `Email`.
- Open/close animates `opacity` + `transform: translateY(-4px)` over `--dur`, `--ease-out`; it is `hidden` (attribute) when closed so it is out of the a11y tree and the tab order.
- `Escape` closes and returns focus to the button. A click on any link closes it. It does **not** trap focus and does **not** lock body scroll — it is a disclosure, not a dialog.
- Not rendered at all `≥ lg` (`lg:hidden`).

### 3.3 `LinkedInMark`

```tsx
export default function LinkedInMark({ size = 14 }: { size?: number }): JSX.Element;
```
Inline `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">` with the standard glyph path. `fill: currentColor` so it inherits ink and inverts inside a solid pill. Never coloured LinkedIn blue.

### 3.4 States

| State | Treatment |
|---|---|
| link hover | `text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px;` + colour to `var(--ink)` — **no** colour-only hover |
| link active panel | colour `var(--ink)` + `font-weight: 500` (weight change, not colour) |
| pill hover | `transform: translateY(-1px)`, `border-color: var(--ink)` |
| any `:focus-visible` | global 2 px `signal` ring, offset 3 px |
| menu button open | glyph rotates to an × via `transform` only |

### 3.5 Skip link

In `layout.tsx`, the **first** child of `<body>`:

```tsx
<a href="#main" className="skip-link">Skip to content</a>
```

```css
.skip-link {
  position: fixed; inset-block-start: .5rem; inset-inline-start: .5rem; z-index: 100;
  padding: .625rem 1rem; border-radius: 9999px;
  background: var(--ink); color: var(--paper);
  transform: translateY(-200%);
  transition: transform var(--dur-fast) var(--ease-out);
}
.skip-link:focus-visible { transform: translateY(0); }
```

Every page renders `<main id="main" tabIndex={-1}>` so the jump lands a real focus.

---

## 4. `HorizontalShell`

```tsx
export default function HorizontalShell({ children }: { children: React.ReactNode }): JSX.Element;
```

### 4.1 CSS-only breakpoint (kills the hydration flash)

The desktop/mobile decision moves entirely into class names, so the server HTML is already horizontal at ≥ 1024 and nothing re-lays-out after hydration. `isDesktop` state is **deleted**.

```tsx
<div
  ref={ref}
  data-hshell
  tabIndex={0}
  role="group"
  aria-label="Sections — use the arrow keys to move between panels"
  onKeyDown={onKeyDown}
  className={[
    "flex flex-col",
    "lg:h-svh lg:w-screen lg:flex-row lg:snap-x lg:snap-mandatory",
    "lg:overflow-x-auto lg:overflow-y-hidden",
    "lg:[overscroll-behavior-y:contain]",
    "lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden",
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
  ].join(" ")}
>
  {React.Children.map(children, (child) => (
    <div
      data-panel
      tabIndex={-1}
      className="relative lg:flex lg:h-svh lg:w-screen lg:shrink-0 lg:snap-start lg:flex-col lg:overflow-y-auto lg:pr-24 pt-14 lg:pt-16"
    >
      {child}
    </div>
  ))}
</div>
```

`DARK_PANELS` and the `theme-dark` class are deleted.

### 4.2 Wheel mapping

Unchanged in behaviour, but the desktop test becomes intrinsic instead of a media query:

```ts
const onWheel = (e: WheelEvent) => {
  const el = ref.current;
  if (!el || el.scrollWidth <= el.clientWidth) return;   // ← mobile / no overflow
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // native horizontal intent
  const panel = (e.target as HTMLElement)?.closest<HTMLElement>("[data-panel]");
  if (panel) {
    const down = e.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
    const up   = e.deltaY < 0 && panel.scrollTop > 0;
    if (down || up) return;                              // let a tall panel scroll first
  }
  e.preventDefault();
  el.scrollLeft += e.deltaY;
};
```

Registered once with `{ passive: false }`, no `isDesktop` dependency.

### 4.3 Keyboard

Handler on the shell (`onKeyDown`), no-op when `scrollWidth <= clientWidth`.

| Key | Action |
|---|---|
| `ArrowRight`, `PageDown` | next panel |
| `ArrowLeft`, `PageUp` | previous panel |
| `Home` | first panel |
| `End` | last panel |
| `ArrowUp` / `ArrowDown` | **not** intercepted — they scroll inside a tall panel |

```ts
const go = (i: number) => {
  const el = ref.current!;
  const n = el.children.length;
  const idx = Math.min(Math.max(i, 0), n - 1);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollTo({ left: idx * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
};
```

Current index is derived as `Math.round(el.scrollLeft / el.clientWidth)` — never stored, so resize can never desynchronise it. `e.preventDefault()` only on the keys listed above.

### 4.4 Focusability (WCAG 2.1.1)

The shell is a scrollable region, so it takes `tabIndex={0}` and an `aria-label`. Panels take `tabIndex={-1}` — they are programmatic focus targets for `SectionIndex` jumps, not tab stops. Every panel contains at least one focusable element (a link or a button), so a keyboard user can always reach and scroll its content; QA verifies this per panel (`09-qa-checklist.md` §6).

### 4.5 Overscroll

`overscroll-behavior-y: contain` is applied **only** to the shell and **only** at `lg` (see the class list in §4.1). `html`/`body` keep browser defaults so `/work/*` wheel scrolling and mobile pull-to-refresh stay intact — this is the exact regression recorded in plan §6 and commit `af5fad7`.

---

## 5. `SectionIndex`

```tsx
export default function SectionIndex(): JSX.Element;
```

### 5.1 Data

`SECTIONS` is deleted. The component imports `sections` from `src/data/sections.ts` — the same array `page.tsx` maps over to render the panels, so the index can never drift from the panels again. The type and the five entries are owned by `01-data-model.md` §5:

```ts
export interface Section { id: string; num: string; label: string; title: string }
// home/00 · work/01 · craft/02 · about/03 · contact/04
```

> **Note for the build agent:** the panel order changes from the current `hero · about · capabilities · work · footer` to the plan's `Home · Work · Craft · About · Contact` (plan §3.4), and the first panel's anchor id becomes **`home`**, not `hero`. `sections.ts` is the only place that order and those ids are written down; every `id`, `href="#…"` and `aria-labelledby` on the home derives from it.

### 5.2 Visual

`<nav aria-label="Section index">`, fixed right rail, `hidden lg:flex`, vertically centred, `gap: 1rem`, `z-index: 45`.

Per item (`<a href="#id">`):

| Part | Idle | Active | Hover / focus-visible |
|---|---|---|---|
| Label (mono 10 px, uppercase, `0.2em`) | `opacity: 0` | `opacity: 1`, colour `var(--ink)` | `opacity: 1`, colour `var(--ink)` |
| Rail (1 px line) | `width: 1rem`, `color-mix(in srgb, var(--ink) 30%, transparent)` | `width: 2rem`, `background: var(--signal)` | `width: 1.5rem`, `var(--ink)` |
| Numeral (mono 10 px, tabular) | `var(--ink-dim)` | `var(--ink)` | `var(--ink)` |

The **rail** is the only signal use: it is a graphical indicator at 3.77:1 / 4.83:1 (≥ 3:1 ✓, `00-tokens.md` §5), while the text of the active item is full `ink` at AAA. Signal is therefore never load-bearing for the reading of a label.

Transitions: `width` is a layout property, so animate `transform: scaleX()` on a fixed 2 rem rule with `transform-origin: right` instead — **no layout animation**.

`aria-current="true"` on the active item. Hit area per item ≥ 44 × 44 (padding, not visual size).

### 5.3 Active-section computation

Keep the existing nearest-centre algorithm verbatim (it is correct for both axes and has no observer race). Two changes:

1. `apply()` no longer writes `data-panel-theme` on `<html>` — it only calls `setActive(id)`.
2. The active id is published so `SiteHeader` can mark its own links. Use a tiny module-scope store rather than context (the shell is not a provider):
   ```ts
   // src/lib/activeSection.ts
   export function subscribeActiveSection(cb: (id: string) => void): () => void;
   export function setActiveSection(id: string): void;
   export function getActiveSection(): string;
   ```
   `SectionIndex` calls `setActiveSection`; `SiteHeader` subscribes via `useSyncExternalStore`. ~25 lines, no dependency.

### 5.4 Jump behaviour

```ts
el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "start", block: "nearest" });
(el.closest("[data-panel]") as HTMLElement | null)?.focus({ preventScroll: true });
```
Focusing the panel after the jump is what makes the index usable with a screen reader and keeps subsequent `Tab` presses inside the panel the user just chose.

---

## 6. Retiring `data-panel-theme`

It exists today for one reason: the fixed chrome (brand + index) had to invert over the two dark bookend panels while the rest of the page was light. With a **global** theme there are no mixed-appearance panels, so:

| Delete | Where |
|---|---|
| `:root { --chrome-ink }` and `:root[data-panel-theme="dark"]` | `globals.css` |
| `text-[var(--chrome-ink)]` and the `color-mix(--chrome-ink …)` calls | `SectionIndex`, `page.tsx` brand |
| `document.documentElement.setAttribute("data-panel-theme", …)` | `SectionIndex` |
| `document.documentElement.removeAttribute("data-panel-theme")` + the `overflow` reset | `work/[slug]/page.tsx` `useEffect` |
| `DARK_PANELS` / `theme-dark` | `HorizontalShell` |

Chrome now simply uses `var(--ink)`, which the global `[data-theme]` already resolves correctly on every route. **Nothing writes to `<html>` at runtime except `ThemeToggle`.** The defensive `overflow` reset in the case page also goes: nothing locks scroll any more, and `window.scrollTo(0,0)` is handled by Next's default scroll restoration.

---

## 7. Header on `/work/*` and `/cv`

Same `SiteHeader`, rendered once in `layout.tsx` — the routes do not render their own.

- `/work/[slug]`: the old fixed `motion.header` (`← All work` / `num · project` / `Doug × Vargas`) is **removed**. Its useful content moves in-flow into `CaseHeader` (`04-case-template.md` §4): a breadcrumb row `<Link href="/#work">← All work</Link> · {num} · {category} · {year}`. The page gets `padding-block-start` equal to the header height.
- `/cv`: `Navigation.tsx` is deleted. The header is hidden in print (`@media print { .site-header { display: none } }`, `05-cv-page.md` §6).
- `not-found.tsx` and `/work/[slug]/not-found.tsx` inherit the header for free — fix their accent colours to `ink` while you are there.

---

## 8. Responsive matrix

| Width | Header | Shell | Index rail | Notes |
|---|---|---|---|---|
| 320 | 56 px, brand + pill + toggle + menu; brand may truncate with `text-overflow: ellipsis` (min-width 0 on the flex child) | vertical stack | hidden | `body` must not scroll horizontally |
| 375 | as above, all four controls fit | vertical stack | hidden | LinkedIn pill visible without scrolling ✓ |
| 768 | as above | vertical stack | hidden | panels are `min-h-svh`, not `h-svh` |
| 1024 | 64 px, section links appear, menu button gone | **horizontal**, snap on | visible | first paint already horizontal |
| 1440 | as above | horizontal | visible | panel `pr-24` keeps content clear of the rail |
| 1920 | as above, content capped at 1400 px and centred | horizontal | visible | — |

---

## 9. Accessibility

- Landmarks per route: `header[banner]` (1), `nav[aria-label="Section index"]` (1, `/` only), `nav[aria-label="Sections"]` (mobile menu, `/` only), `main#main` (1), `footer[contentinfo]` (1).
- Heading outline on `/`: one `h1` (Hero), `h2` per panel, `h3` inside.
- `role="group"` + `aria-label` on the shell explains the arrow keys to AT.
- The mobile menu button exposes `aria-expanded` and `aria-controls`.
- Every interactive target ≥ 44 × 44 including the index rail items.
- No `aria-live` on the section index (it would chatter on every scroll frame); the theme toggle is the only `role="status"` on the page.

---

## 10. Acceptance criteria

1. `grep -rn "data-panel-theme\|chrome-ink\|DARK_PANELS\|theme-dark" src/` → **0 hits**.
2. Desktop first paint is horizontal: record `/` at 1440 with CPU 4× throttle; frame 1 shows the Hero occupying the full viewport width with no vertical stack. `document.querySelector("[data-hshell]").scrollWidth === 5 * innerWidth`.
3. `SectionIndex` and `page.tsx` both import from `src/data/sections.ts`; no array literal of sections exists in any component (`grep -rn "num: \"0" src/components/` → 0).
4. Keyboard: focus the shell with `Tab`, then `→ → → →` reaches panel 04, `Home` returns to 00, `End` goes to 04, `PageDown`/`PageUp` behave the same. Inside the Work panel, `↓` scrolls the panel and does **not** change panels.
5. `prefers-reduced-motion: reduce` → panel changes jump instantly (`behavior: "auto"`), no smooth scroll.
6. LinkedIn pill is in the initial viewport, without scrolling, on `/`, `/cv`, `/work/olbo` at 375 × 667 and 1440 × 900, in both themes.
7. `body.scrollWidth === window.innerWidth` at 320/375/768/1024/1440/1920.
8. Only one `<header>` in the DOM per route; exactly one `<main id="main">`.
9. Mobile menu: `Escape` closes and focus returns to the toggle button; when closed, `#site-menu` has the `hidden` attribute and contains no tabbable node.
10. `/work/olbo` reached by client-side navigation from `/` scrolls normally with the wheel (the regression from `af5fad7` does not return), and `document.documentElement` carries only `lang`, `class` and `data-theme`.
