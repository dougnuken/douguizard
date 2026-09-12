# 07 — Copy deck (English, final, paste-ready)

Spec owner: data/SEO/copy agent. Every string below is the final text, with its destination field or component. Layout is not specified here — see `02-chrome-and-shell.md`, `03-home-panels.md`, `04-case-template.md`, `05-cv-page.md`.

**Voice rules applied throughout.** First person. Short sentences. No buzzwords, no exclamation marks, no decorative em dashes (an em dash separates clauses, never ornaments a line). The arc *Product Designer → Design Engineer* is **shown** — by the timeline, by olbo, by what the cases say he built — and never announced. The strings *"Senior Product Designer"*, *"× AI"*, *"I transitioned into design engineering"*, *"Design Systems Architect"* appear nowhere.

`⚠️ CONFIRMAR DOUG` on a line means: ship it with the marker visible in the source comment, never as bare fact.

---

## (a) Hero — panel 00

| Slot | String | Destination |
|---|---|---|
| Kicker | `PRODUCT × SYSTEMS × CODE` | `Hero.tsx` literal (a positioning device, not data) |
| Availability chip | `Head of Product at Naowee` | `site.availability.label` |
| Sub-line | `Doug Vargas — Head of Product · Design Engineer` | `` `${site.name} — ${site.headline}` `` |

### H1 — two options, one recommended

**A — recommended.**
```
I direct the product, then I build it.
```
Thirty-eight characters. Says both halves of the job in the order he does them, in his own voice. It carries the arc without narrating it, and it reads as a claim he can be held to — which is the point of the whole refactor. It also breaks cleanly for the display scale: *I direct the product,* / *then I build it.*

**B — fallback.**
```
Product direction, built in code.
```
Tighter and closer to antid's *"Design that ships."*, but it drops the first person and reads like a service line rather than a person. Use only if A collides with the display type at 320 px.

**Retired:** *"Designing the human side of an AI era"* (says nothing about what he does), *"Design Build Ship"* (the TrueFocus device, removed with the component).

### Sub-paragraph

```
Head of Product at Naowee. I set direction across the platform and build the
prototypes that define it. Before that, Andes at Mercadolibre — the design
system behind 18 countries, 400+ designers and 2,000+ engineers.
```
Destination: `Hero.tsx`, composed from `currentExperience()` and the `mercadolibre-andes` KPIs. Do not hardcode the figures.

### CTAs

| Order | Label | Target | Note |
|---|---|---|---|
| Primary | `LinkedIn` | `site.social` entry with `primary: true` | Plan §2: LinkedIn is the primary CTA. Opens in a new tab. |
| Secondary | `See work` | `#work` | Replaces "View work" — one spelling site-wide. |

Retired: *"Let's talk"* as a hero CTA (it stays as the Contact panel heading only).

### Wordmark strip (D4)

Grey, below the hero, in career order, newest first:
```
Naowee · Mercadolibre · Aval Digital Labs · Banco de Occidente · Globant · Qrvey · Ideaware
```
Rendered from `experiences.filter(e => e.era !== "earlier")`, using `company.name` and appending `client` when it differs. Accessible label on the container: `Where I've worked`.

> Deviation from the plan, flagged: D4 wrote the third item as *"Grupo Aval / Banco de Occidente"*. Doug's employer was **Aval Digital Labs**, the bank was the client — Grupo Aval is the holding company he never worked for. The list above is the accurate form and reads the same width. ⚠️ CONFIRMAR DOUG if he wants the plan's wording instead.

---

## (b) Work — panel 01

### Section intro

```
Kicker:   / Selected work
Lead:     {yearsOfExperience()} years of systems, products and teams —
          from LATAM's largest marketplace to national banks, cruise lines
          and early-stage startups, plus one product I designed, built and
          shipped on my own. Seven that shaped how I work.
```
Destination: `SelectedWork.tsx`, replacing lines 183–185. `A decade` is deleted; the number is interpolated so it can never contradict About again.

### Row fields

Each row renders `num · project · getCaseMeta(study).client · getCaseMeta(study).year · category`. No case declares those strings itself.

### NDA label — Mercadolibre only

```
Case study available on request
```
Rendered as a small mono chip on the `/03` row and repeated on the case page. Nothing else marks it; no "confidential", no lock icon, no apology.

### Live-vignette microcopy

Four cases carry a monochrome React vignette (plan §2). Each needs one caption line under it and a real accessible name — the vignette is decorative in form but informative in content, so it gets a label, not `aria-hidden`.

| Case | Caption (under the vignette) | `aria-label` on the vignette |
|---|---|---|
| `/01` olbo | `Say it out loud; the category is inferred.` | `A captured expense: spoken text becomes an amount, a merchant and a category.` |
| `/02` Naowee | `Assign a filing; the queue recounts in place.` | `A work queue recounting: six pending becomes five, three assigned becomes four.` |
| `/03` Mercadolibre | `One component, its tokens and its variants.` | `The anatomy of a design-system component: tokens resolving into variants.` |
| `/04` Banco de Occidente | `Foundations first, then atoms, then organisms.` | `A design-system grid: foundations, atoms, molecules and organisms.` |

Rows `/05` Royal Caribbean, `/06` Qrvey and `/07` Ideaware are compact — no vignette, no caption.

---

## (c) Craft — panel 02

Two blocks, clearly separated: **Expertise** (what he is good at) and **How I work** (the sequence). The "FIG 0.x" tags are editorial figure marks, set in mono.

### Expertise — three, numbered

**01 · Product direction** — `FIG 0.1`
```
I decide what a product should be and then stay accountable for it shipping.
At Naowee that means eight business modules, the states and roles underneath
them, and a review where the built version has to match the demo.
```

**02 · Design systems** — `FIG 0.2`
```
Tokens, components, governance and the boring documentation that makes good
design repeatable. I have built one for a bank and maintained one used by
400+ designers and 2,000+ engineers across 18 countries.
```

**03 · Design engineering with AI** — `FIG 0.3`
```
I prototype in code, with Claude Code, Cursor and Gemini carrying the
repetitive weight. The output is a running product, not a mockup, which is
why business signs off against it instead of against a document.
```

Retired from `Capabilities.tsx`: the fourth column *"Tech Leadership"* (its content is absorbed into 01), and the tag chips — the sentences carry the meaning and the chips repeated `skills`.

### How I work — four steps

**01 · Read the domain before drawing**
```
Before a screen exists I map how the thing actually works. For Naowee's
inspection flow that was 45+ states and 15 roles. The states were the product;
the interface was the easy part.
```

**02 · Build the language, not the screens**
```
The failure mode is eight modules with eight dialects. So I build the system
first and hold everyone to it, myself included. No custom component — if the
system is missing something, the system gets extended.
```

**03 · The prototype is the spec**
```
What business signs is a working prototype with real roles and real states,
walked through one story at a time. Disagreement surfaces while it is still
cheap and engineering receives something already resolved.
```

**04 · Ship, then listen**
```
Daily use surfaces what no spec would have. olbo taught me that in a week —
a timezone bug that broke the colour after dark, receipts I refused to retype.
Each one became a decision, a test and a version bump.
```

---

## (d) About — panel 03

### Bio

Paragraph 1 is `site.summary` verbatim (it is also the seed of the meta description — see `06-seo.md`):
```
I'm a product designer who builds. I lead product at Naowee and ship the
prototypes that define it — one design system, working code, AI in the loop.
Before that I maintained Andes, the design system behind Mercadolibre across
18 countries.
```

Paragraph 2 — `About.tsx` literal:
```
What has kept me here is not any single screen. It is the systems underneath:
the tokens, the governance, the shared language that lets hundreds of
designers and thousands of engineers ship as one product.
```

Paragraph 3 — `About.tsx` literal:
```
The line between designing and building stopped being useful to me. I
prototype in code, ship real interfaces, and let the system and the model
carry the repetitive weight. olbo is the clearest proof: a finance app I
designed, engineered and shipped on my own, still running every day.
```

### Facts (from data — `About.tsx:16–22` is deleted)

| Label | Value | Source |
|---|---|---|
| `Based` | `Barranquilla, Colombia · UTC-5` | `site.location` |
| `Currently` | `Head of Product · Naowee` | `currentExperience()` |
| `Focus` | `Design systems · AI-native product` | literal |
| `Open to` | `Selected consulting on design systems and AI-native product` | `site.availability.note` |
| `Languages` | `Spanish (native) · English (B1)` | `languages` |

The old `Availability: Open to select work · 2026` is gone — it contradicted the Footer, which said he consults *alongside* leading product at Naowee (cvSync §7). One status, stated once.

### Timeline block

```
Kicker:  / Experience
Rows:    {formatPeriod(e)} · {e.company.name} · {e.role}   → "See case →" when e.caseSlug
Divider: Earlier          (before the two `era: "earlier"` rows)
Footer:  / Education — Professional Graphic Designer, Universidad Autónoma del Caribe (2006 — 2009)
CTA:     Full CV →        → /cv
```
All from `experiences` and `education`. No component-local array.

---

## (e) Contact — panel 04 / Footer

| Slot | String |
|---|---|
| Heading | `Let's talk` |
| Lead | `The fastest way to reach me is LinkedIn. Email works too.` |
| Primary CTA | `LinkedIn` |
| Column `/ The signal` | `I lead product at Naowee and take on selected consulting alongside it. Most interested in design systems at scale and AI-native product work.` |
| Column `/ Direct` | `site.email` · `site.phone` |
| Column `/ Elsewhere` | LinkedIn, Behance, GitHub ⚠️ CONFIRMAR DOUG — in that order |
| Legal left | `© 2026 Doug Vargas` |
| Legal right | `Barranquilla · UTC-5` |

Retired: `— All rights reserved` (noise), `Crafted in Barranquilla` (the `Based` fact already says it), and the `● Online` dot with its accent colour — there is no presence signal behind it.

---

## (f) `/cv`

### Header

```
Doug Vargas
Head of Product · Design Engineer
Barranquilla, Colombia · UTC-5 · hello@douguizard.com
LinkedIn · Behance
```
`site.name`, `site.headline`, `site.location`, `site.email`, `site.social`.
⚠️ CONFIRMAR DOUG — the printable CV shows one email; the 2026 PDF prints `dougvargas72@gmail.com`. Pick one.

### Summary (long form, 5 sentences — `/cv` only)

```
I'm a product designer who builds. Today I'm Head of Product at Naowee, where
I set direction across the eight business modules of the platform built for
Colombia's sports system, and build the prototypes that define them. Before that
I was technical lead on Andes, the design system behind Mercadolibre across
18 countries, used by 400+ designers and 2,000+ engineers. Earlier I spent six
years at Aval Digital Labs as the gatekeeper of Banco de Occidente's design
system, and built the bank's digital banking flows for desktop, tablet and
mobile. I work in code as well as in Figma, with AI in the loop, and the
thing I hand over is a running product.
```
Replaces the PDF's *"senior product designer… over 10 years"* opener, which is out of date. Destination: `05-cv-page.md` summary block, stored as `site.summaryLong` or rendered as a literal in the CV page — the build agent picks, but it lives in exactly one place.

### Experience bullets

Identical to the `impact[]` arrays in **`01-data-model.md` §2.2**. Do not retype them here or there; the CV renders `experiences[].impact`. Each row: `formatPeriod(e)` · `company.name` (+ `client` when present) · `role` · `location` · `summary` · bullets · `See case →` when `caseSlug`.

### Section labels

```
Summary · Experience · Earlier · Education · Certifications · Skills · Tools · Languages · References
```
`Earlier` heads the `era: "earlier"` rows (Smartbiz, Freelance). `References` carries the three testimonials (`01-data-model.md` §4); if Doug prefers a CV without quotes, the section drops and nothing else changes.

### Buttons

```
Download PDF     → window.print()
LinkedIn         → site.social primary
```
Both hidden under `@media print`.

---

## (g) Banco de Occidente — full case study

`slug: "banco-de-occidente"` · `num: "/04"` · `experienceId: "aval"` · `testimonialId: "francesca"` · `kind: "client"` · `galleryKind: "browser"`.

**Source.** The published Behance piece *UI Portal Bancario Banco de Occidente* (Aval Digital Labs, May 2022, 1440×19591, 11 numbered sections) plus *Banco de Occidente Landing Page* (Nov 2022). All copy below is rewritten from the rasterized original — the source has typos (*"unncessary elemtns"*, *"maximun"*, *"posible"*) and mixes "I" and "we"; this version is consistent first person for what Doug did and plural for what the team did.

**Hard rule (D7).** The six third-party names in the piece's Roles section appear in **no** string here or anywhere in the repo.

```ts
project: "Banco de Occidente",
category: "Banking × Design Systems",
team: "12+ product squads",
duration: "6 years",
```

### `tagline`
```
The transactional portal for one of Colombia's largest banks, and Velocity —
the design system that kept it consistent across twelve squads.
```

### `impact`
```
An outdated, overloaded banking portal rebuilt as one light, legible product —
and a documented design system that made the next screen cheaper than the last.
```

### `context`
```
Banco de Occidente's digital banking was visually dense and hard to move
through, and every squad solved the same problems differently. I redesigned
the transactional portal and built Velocity, the bank's design system, as the
official gatekeeper of what went into it.
```

### `contributions` — 4
```
**Redesigned the transactional portal** — login and registration, accounts and
cards, transfers, payments and product blocking, for desktop, tablet and mobile.

**Built Velocity, the bank's design system** — documentation, foundations,
atoms, molecules and organisms, on atomic-design principles so the front end
could mirror the structure.

**Design System Gatekeeper** — approved additions, deprecations and patterns
across 12+ product squads, and ran the workshops and crits that taught the
system.

**Drew the illustrated icon set** — 15 mini-illustrations that give the whole
product a recognizable character instead of a generic glyph library.
```

### `kpis` — 4, each sourced
```ts
{ value: "12+",  label: "Product squads aligned",     delta: "one system" },
  // source: cv.ts + work.ts, Doug's own figure, consistent across both.
{ value: "6 yr", label: "As design system gatekeeper" },
  // derived: Nov 2018 — 2024. Rendered, not typed.
{ value: "20+",  label: "Documented system areas",    delta: "foundations → organisms" },
  // source: the published system grid (5 columns × named tiles). I counted 23
  // named tiles; the conservative "20+" is used so the figure cannot be over-read.
{ value: "15",   label: "Illustrated icons",          delta: "drawn for the system" },
  // source: the "Illustrated Icons" section, three rows of five.
```
⚠️ **CONFIRMAR DOUG — "millions of customers".** It is in today's `cv.ts` and as the KPI `M+ / Customers reached` in `work.ts`, with no source behind it. It is **not** in the KPI list above. Reinstate only if Doug can point at a number; the bank's own landing page claims *"más de 60 operaciones"* for the portal, which is a marketing claim about the product, not a metric Doug owns.

### `process` — 4 phases
```
01 · Discovery, then research
To build the thing you have to understand the business first. We ran discovery
with the client and the stakeholders, then competitive and user research —
days spent on the business model, the requirements, and who was actually going
to use this.

02 · Flows before screens
We mapped the system's behaviour for each use case before drawing anything:
login and registration, payments, enabling and disabling services, transfers,
sending and requesting, blocking a product. Six flows, with their exceptions
and their error states, because in banking the exception is the product.

03 · Interactive wireframes, tested on people
Every stage went to an interactive prototype before it went to visual design.
It let the team and the client see how the product would actually work, and it
let us run user testing without paying for a full build first. The registration
flow went through several rounds on the back of that feedback.

04 · A system, not a set of screens
Large products cannot scale without one. Velocity documents foundations,
atoms, molecules and organisms so designers across digital products, marketing
and engineering stay in sync. I followed atomic design deliberately, because
the same structure survives the handoff into the front end.
```

### `decisions` — 3
```
Atomic design, because the front end thinks that way too
A design system can be organized any number of ways. I chose atoms, molecules
and organisms because that structure survives the crossing into code —
engineers were building components at the same granularity, so documentation
and implementation could share one vocabulary instead of translating.

Two layers of navigation, and no more
The old portal buried people in nested page trees. I replaced navigation depth
with a popup system: page, then a blurred background, then the component, then
the popup. Two layers is enough for every banking task in the product, and
nobody gets lost in something two layers deep.

Identical across devices, not merely similar
The brief asked for a similar experience on desktop, tablet and mobile. We
targeted identical instead. Every desktop capability survives to the phone
with the same names in the same order, because a customer who learns the
portal on a laptop should not have to relearn it on the bus.
```

### `gallery` — 9 items

Filenames are the contract with `08-assets.md`; all crops come from the two Behance composites and are written to `/public/work/banco-de-occidente/` as WebP.

```ts
gallery: [
  { src: "/work/banco-de-occidente/portal-dashboard.webp",
    alt: "The Banco de Occidente transactional portal on a tablet: a left sidebar with the customer's name and benefit tier, cards for a Mastercard and a savings account with their balances, a favourite-transactions row, a month calendar and a spending chart.",
    caption: "The portal home: products, favourite transactions and the month at a glance." },

  { src: "/work/banco-de-occidente/login-registration.webp",
    alt: "The portal's login screen on a tablet: a cookie notice across the top, a promotional panel on the left, and a sign-in card asking for document type, document number and password, with links to recover a password and to register.",
    caption: "Login and registration, stripped of anything that could distract mid-task." },

  { src: "/work/banco-de-occidente/user-flow-login-otp.webp",
    alt: "The registration and one-time-password flow diagrammed as boxes and arrows: register, enter document type and ID, send a one-time password, enter it or request another by SMS, accept the data-processing agreement, then either a successful login or a validation failure.",
    caption: "One of six flows mapped before any screen existed, exceptions included." },

  { src: "/work/banco-de-occidente/design-system-grid.webp",
    alt: "The Velocity design system index, five columns wide: Documentation, Foundations, Atoms, Molecules and Organisms, listing basics, naming rules, writing principles, grids, spacing, colours, typography, buttons, inputs, controls, icons, fields, dropdowns, lists, tables, headers, forms, modals, date picker and tab navigation.",
    caption: "Velocity, indexed the way the front end is built." },

  { src: "/work/banco-de-occidente/design-system-foundations.webp",
    alt: "Design system foundation boards laid out in perspective: a colour scale from light to dark blue with neutral and gold secondaries, a type scale from hero down to caption, a spacing scale, and sheets of button and form-field states.",
    caption: "Foundations: colour, type, spacing and every state of every control." },

  { src: "/work/banco-de-occidente/illustrated-icons.webp",
    alt: "Fifteen illustrated icons in blue and green line art: a statement, a credit score, a certificate, a scheduled document, a location pin, stacked coins, a piggy bank, a phone payment, a phone message, a phone with a plus, a protected phone, a phone with a fingerprint, a failed transaction, a house, and a browser window.",
    caption: "Fifteen icons drawn for the system, not licensed into it." },

  { src: "/work/banco-de-occidente/products-and-cards.webp",
    alt: "The accounts section of the portal on a tablet: a savings account card showing available, redeemable and current balances, a filterable movements table listing purchases and transfers with amounts, and a success toast confirming a chequebook has been blocked.",
    caption: "Accounts and cards: balances, movements and the confirmation that the block worked." },

  { src: "/work/banco-de-occidente/popups-system.webp",
    alt: "The popup system drawn as four stacked planes in perspective, labelled from the back: the page, a blurred background, the component, and the popup itself.",
    caption: "Depth instead of nesting: two layers cover every task in the product." },

  // ⚠️ Cross-spec note for 04-case-template.md: this item is an artboard that
  // already contains its own device bezels. If the template gains a per-item
  // frame, set `frame: "none"` here so it is not wrapped in browser chrome.
  { src: "/work/banco-de-occidente/responsive-mobile.webp",
    alt: "Two iPhone screens side by side: a Mastercard Black detail with minimum payment, total payment and due date above a Pay button, and the movements tab listing card purchases with dates, instalment counts and amounts.",
    caption: "The same portal on a phone — every desktop capability, in the same order." },
],
```

Two further crops from the landing composite, to be added **only if** Doug publishes the public-site work as part of this case (it is a different product — the marketing site, not the portal):
- `landing-hero.webp` — *"The bank's public site: the credit hero, the chat entry point and the product cards."*
- `landing-mobile-banking.webp` — *"The mobile banking section of the public site, card carousel and all."*
⚠️ CONFIRMAR DOUG — include the landing, or keep this case to the portal alone.

### `links`
```ts
links: [
  { label: "Interactive prototype (Figma)",
    href: "https://www.figma.com/proto/0r3LsQkQBzD8BM6Qr9hRgI/BDO-Web-Page?page-id=239%3A20692&node-id=239%3A20693" },
  { label: "Case on Behance",
    href: "https://www.behance.net/gallery/143620441/UI-Portal-Bancario-Banco-de-Occidente" },
],
```
The Figma URL returns **HTTP 200** as of 2026-09-12, so the link is reachable. ⚠️ CONFIRMAR DOUG — that only proves the URL resolves, not that a public prototype renders for a logged-out visitor, and not that Doug still wants a bank prototype linked from his site. Verify in a private window before shipping; drop the entry if it asks for login.

`externalLink` is removed from this case: `adldigitallab.com` is the employer's corporate site and adds nothing to the work.

### `credits`
```
Design system, art direction and UI design: mine. Product ownership and UX
research sat with the bank's and the lab's teams. Published by Aval Digital
Labs, Colombia, 2022.
```
No individual is named. The piece's own Roles table lists five people besides Doug; none of them appear.

### `technologies`
```ts
["Figma", "Sketch", "Atomic design", "Design tokens", "InVision", "Prototyping"]
```

---

## (h) Mercadolibre — rewritten under the NDA pattern

`slug: "mercadolibre-andes"` · `num: "/03"` · `experienceId: "mercadolibre"` · `kind: "client"`. **No gallery, no video, no screenshots.** The case earns its place on what the practice was, not on what it looked like.

```ts
project: "Andes Design System",
category: "Design Systems × E-commerce",
team: "400+ designers, 2,000+ engineers",   // was "30+ designers, 100+ engineers"
duration: "~2 years",
```
The old `team` contradicted the case's own KPIs on the same screen (cvSync §1). Doug confirmed the real figure: *"fue todo Andes"* — the whole design system, 400+ / 2K+.

### `tagline`
```
Technical lead on the design system behind Mercadolibre, across 18 countries.
```

### `impact`
```
One library, maintained for iOS, Android and Web, that 400+ designers and
2,000+ engineers build the same product out of.
```

### `context`
```
Andes is the source of truth for Mercadolibre's commerce, fintech and shipping
products. I owned foundations and component definitions, kept the three
platforms in parity, and brought AI into how the system audits itself.
```

### `contributions` — 4
```
**Foundational definitions** — tokens, spacing, type and motion, agreed once
and governing the product suite.

**Cross-platform parity** — one component API, shipped the same on iOS,
Android and Web, worked out directly with the engineering teams that build it.

**Component maintenance at scale** — additions, deprecations and migrations
across a library hundreds of designers open every day.

**AI inside the systems practice** — prompt-driven audits that catch drift in
Figma before it reaches a release.
```

### `kpis` — 4
```ts
{ value: "400+", label: "Designers on the system" },     // confirmed by Doug
{ value: "2K+",  label: "Engineers on the system" },     // confirmed by Doug
{ value: "18",   label: "Countries shipped to" },        // consistent across every source
{ value: "3",    label: "Platforms in parity", delta: "iOS, Android, Web" },  // his own description
```
⚠️ **CONFIRMAR DOUG — "~40% fewer rework cycles".** Today's KPI. It has no source, and the `work.ts` interface itself calls the figures *"Draft figures — confirm real numbers"*. It is **removed**. Its qualitative replacement, used inside `context`, is *"kept the three platforms in parity"* — true and defensible. Reinstate the number only against a real measurement.

### NDA block

Rendered where the gallery would be, as plain text:
```
Heading:  Case study available on request
Body:     The screens are Mercadolibre's, so they don't go on a public site.
          I'm happy to walk through the system, the governance model and the
          audit workflow directly.
CTA:      Ask on LinkedIn   →  site.social primary
CTA:      Email             →  mailto:site.email
```

### `credits`
```
Technical lead on Andes, working across the design and engineering
organizations that build on it.
```

`externalLink` stays: `{ label: "Visit ux.mercadolibre.com", href: "https://ux.mercadolibre.com" }` — public documentation, safe to link.

---

## (i) Corrections to olbo and Naowee

Only the lines that contradict the single identity or carry an unsourced figure. **Everything not listed here stays exactly as written** — both cases are in good shape.

### olbo (`/01`)

| Field | Change |
|---|---|
| `role` → `roleOverride` | `"Design Engineer — end to end"` — unchanged text, moved field. |
| `year` → `yearOverride` | `"2026"` — unchanged text, moved field. |
| `client` | Removed. `getCaseMeta` returns `"Personal product"`. |
| `colors`, `thumbnail` | Removed. |
| KPI 4 | ⚠️ CONFIRMAR DOUG — `{ value: "1:2.5", label: "Test-to-code ratio", delta: "6,305 lines of tests" }`. The verified olbo figures are 634 tests / 292 ms, 0 dependencies, 62 modules / 24 views. The ratio and the line count are not on that list. Either Doug confirms them or the KPI is replaced with `{ value: "24", label: "Views shipped", delta: "62 JS modules" }`, which is verified. |
| `links` | ⚠️ CONFIRMAR DOUG — both point at `dougnuken/bolsillo`; the product is called olbo everywhere else. A visitor clicking "Source" lands on a repo with a different name. Either rename the repo before launch or add `caption`-level context. Outside this refactor's scope, but it is visible to anyone who clicks. |

Everything else — the tagline, the four process phases, the three decisions, the six features, the video, the four gallery items, the credits — ships unchanged. The pace-not-balance narrative is the strongest writing on the site.

### Naowee (`/02`)

| Field | Change |
|---|---|
| `role`, `year`, `client`, `duration` | Removed; derived from `experienceId: "naowee"`. `year` becomes `"Jan 2026 — Now"` instead of `"2026 — Now"`, matching every other surface. |
| `colors` | Removed. |
| KPI 4 | Replace `{ value: "Hours", label: "Idea → working screen", delta: "not sprints" }` with `{ value: "8", label: "Business modules", delta: "of 13 total" }`. "Hours, not sprints" is a claim about velocity with nothing behind it; the module count is on the verified list. The velocity idea survives in `process` phase 04, where it is narrated rather than measured. |
| `process[0]` | ⚠️ CONFIRMAR DOUG — it opens *"I joined as a product designer"*, but `cv.ts` records Head of Product from Jan 2026 with no earlier title. Either the CV needs two Naowee rows (product designer, then Head of Product, with the month of the change) or the sentence becomes *"I spent the first weeks reading how the sector actually works."* This is the one place where the PD→DE arc is narrated rather than shown, so it is worth getting exactly right. |
| `impact` | Unchanged. |
| `credits` | Unchanged. It names no one. |

Naowee's verified figure set, for any surface that quotes it: **~1,200 organizations · 30 procedures · 83 sports · 57 federations · 45+ states · 15 roles · 13 modules (8 of business) · 130+ screens · 38+ design-system components.** There are **no** figures for users, departments or registered athletes — do not write one.

### Royal Caribbean, Qrvey, Ideaware (`/05`–`/07`)

Vague KPIs (`"M+"`, `"Dozens"`, `"Enterprise"`, `"Multi"`) are replaced with honest qualitative values. Full rewrite is phase 2 (plan §2.5); for phase 1 the minimum is:

| Case | Replace | With |
|---|---|---|
| Royal Caribbean | — | keep as-is; its three KPIs are already qualitative and true |
| Qrvey | `{ "Dozens", "Chart types" }` | `{ value: "Charts", label: "The visual language", delta: "one system, many types" }` |
| Qrvey | `{ "Enterprise", "SaaS deployments" }` | `{ value: "Embedded", label: "Inside the host product" }` |
| Ideaware | `{ "Multi", "Domains shipped" }` | `{ value: "Agency", label: "A new domain each engagement" }` |

---

## (j) Metadata strings

All defined in `06-seo.md`; repeated here so the copy deck is complete and Doug approves them in one pass.

| Surface | String |
|---|---|
| `<title>` default | `Doug Vargas — Head of Product · Design Engineer` |
| `<title>` template | `%s · Doug Vargas` |
| Meta description | `Doug Vargas leads product at Naowee and builds it — design systems, working prototypes in code, AI in the loop. Previously Andes at Mercadolibre.` |
| OG / Twitter title | `Doug Vargas — Head of Product · Design Engineer` |
| OG / Twitter description | same as meta description |
| OG image alt | `Doug Vargas — Head of Product · Design Engineer` |
| `/cv` title | `CV — Head of Product · Design Engineer` |
| `/cv` description | `Curriculum vitae of Doug Vargas. {n} years of product design and design engineering across Naowee, Mercadolibre, Aval Digital Labs, Globant, Qrvey, Ideaware.` |
| `/work/*` title | `{project} — {client}` (de-duplicated when equal) |
| `/work/*` description | the case's `tagline` |
| OG image line 1 | `PRODUCT × SYSTEMS × CODE` |
| Skip link | `Skip to content` |
| Theme toggle label | `Switch to light theme` / `Switch to dark theme` |
| Header LinkedIn pill | `LinkedIn` |
| 404 heading | `That page doesn't exist.` |
| 404 CTA | `Back to work` |

---

## Copy lint — for the QA agent (`09-qa-checklist.md`)

These greps must return zero hits across `src/` and `README.md`:
```
Senior Product Designer × AI
Design Systems Architect
Twelve years | A decade | 12+ years
most recently leading Andes
I transitioned
Available 2026
Dribbble
● Online
douguizard.webflow.io
```
And these must return hits **only** inside `src/data/` or `src/lib/`:
```
Head of Product | Tech Lead | Technical Lead | Design System Gatekeeper
Naowee | Mercadolibre | Aval Digital Labs
400+ | 2K+ | ~1,200 | 130+ | 634
```
