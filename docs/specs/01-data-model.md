# 01 — Data model (final types + content)

Spec owner: data/SEO/copy agent. Companion files: `06-seo.md`, `07-copy-deck.md`.
Sources of truth: `~/.claude/plans/douguizard-bn-refactor.md` §1, §1b, §3.1 · `scratchpad/report-cvSync.md` §0, §6, §7 · `scratchpad/cv-pdf/cv.pdf` · Behance CV (`behance.net/dougvargas/resume`).

**Principle.** `cv.ts` owns employers, roles, dates and locations. `work.ts` owns the narrative of a case and points at an experience by id. `site.ts` owns identity, headline, summary, contact and SEO. `testimonials.ts` points at both. **No component declares its own experience, tools, proof or facts array.**

Every string below is final English copy. Where a figure has no source it carries `⚠️ CONFIRMAR DOUG` inline — the build agent must not silently drop the marker or invent a replacement.

---

## 1. `src/data/site.ts` — identity

```ts
export interface SocialLink {
  label: string;
  href: string;
  /** Shown in the header pill and listed first in the footer. */
  primary?: boolean;
}

export interface Site {
  name: string;
  brand: string;
  /** One canonical headline. Header, hero kicker, CV, JSON-LD jobTitle, OG. */
  headline: string;
  /** The arc. Shown as a label, never as a sentence ("I transitioned…" is banned). */
  positioning: string;
  /** 3 sentences. About bio lead, CV summary lead, and the base for seo.description. */
  summary: string;
  location: { city: string; country: string; timezone: string; iata: string };
  email: string;
  phone: string;
  phoneHref: string;
  availability: { status: "employed" | "open" | "available"; label: string; note?: string };
  social: SocialLink[];
  cv: { path: string; pdf?: string };
  seo: {
    /** Trimmed to survive Google's ~160-char cut. Not the same string as summary. */
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

const social: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/dougvargasco", primary: true },
  { label: "Behance", href: "https://www.behance.net/dougvargas" },
  // ⚠️ CONFIRMAR DOUG — GitHub handle. `github.com/dougnuken` is the account that
  // hosts olbo (work.ts links to dougnuken/bolsillo) but it has never been listed
  // as a profile link. Include only if Doug confirms it is the profile he wants
  // public; otherwise delete this entry AND the matching `sameAs` in 06-seo.md.
  { label: "GitHub", href: "https://github.com/dougnuken" },
  // Dribbble is REMOVED. It sat at the same weight as LinkedIn and carries no
  // work the portfolio references. Plan §2 ("LinkedIn primero").
];

export const site: Site = {
  name: "Doug Vargas",
  brand: "Douguizard",
  headline: "Head of Product · Design Engineer",
  positioning: "Product Designer → Design Engineer",
  summary:
    "I'm a product designer who builds. I lead product at Naowee and ship the prototypes that define it — one design system, working code, AI in the loop. Before that I maintained Andes, the design system behind Mercadolibre across 18 countries.",
  location: {
    city: "Barranquilla",
    country: "Colombia",
    timezone: "UTC-5",
    iata: "BAQ", // fixes the "BCN" bug in the legacy Navigation.tsx (cvSync §4)
  },
  email: "hello@douguizard.com",
  // ⚠️ CONFIRMAR DOUG — the 2026 PDF prints dougvargas72@gmail.com. Decide one
  // address for both the site and the printable CV; do not ship two.
  phone: "+57 300.351.8299",
  phoneHref: "tel:+573003518299",
  availability: {
    status: "employed",
    label: "Head of Product at Naowee",
    note: "Open to selected consulting on design systems and AI-native product.",
  },
  social,
  cv: { path: "/cv" },
  seo: {
    description:
      "Doug Vargas leads product at Naowee and builds it — design systems, working prototypes in code, AI in the loop. Previously Andes at Mercadolibre.",
    keywords: [
      "Doug Vargas",
      "Douguizard",
      "Design Engineer",
      "Head of Product",
      "Design Systems",
      "Product Designer",
      "Naowee",
      "Andes Design System",
      "Mercadolibre",
      "AI-native product",
      "Barranquilla",
      "Colombia",
    ],
    ogImage: "/og.png",
  },
};
```

**Removed from today's `site.ts`:** `role` (replaced by `headline` + `positioning`), `cvPath` (moved into `cv.path`; it was defined and never used — cvSync §0), `location`/`timezone` as flat strings, the Dribbble entry, `availability.status: "available"` + `label: "Available 2026"` (contradicted the Footer, cvSync §7).

---

## 2. `src/data/cv.ts` — career structure

### 2.1 Types

```ts
export type Month = 1|2|3|4|5|6|7|8|9|10|11|12;
export type YearMonth = { year: number; month?: Month };

export type ExperienceId =
  | "naowee" | "mercadolibre" | "aval" | "globant"
  | "qrvey" | "ideaware" | "smartbiz" | "freelance";

export interface Experience {
  id: ExperienceId;
  company: { name: string; url?: string };
  /** End client the work was for. Never the employer. */
  client?: string;
  /** ONE canonical spelling. Used everywhere: CV, case meta strip, timeline. */
  role: string;
  /** Optional shorter form for narrow rows. Same words, fewer of them. */
  roleShort?: string;
  start: YearMonth;
  /** Omitted = current role. Exactly one experience may omit it. */
  end?: YearMonth;
  location: { city?: string; country?: string; region?: string; mode: "remote" | "hybrid" | "onsite" };
  /** 1–2 sentences. The CV line. */
  summary: string;
  /** 3–4 bullets. `**bold**` supported by the renderer. */
  impact: string[];
  caseSlug?: string;
  /** Groups everything before the product-design career under one "Earlier" heading. */
  era?: "current" | "core" | "earlier";
}

export interface Education {
  id: string;
  start: YearMonth;
  end?: YearMonth;
  program: string;
  institution: string;
  location?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  url?: string;
}

export interface SkillGroup {
  id: "product" | "systems" | "engineering" | "ai" | "platforms";
  label: string;
  items: { label: string; primary?: boolean }[];
}

export interface ToolGroup {
  id: "design" | "code" | "ai" | "collaboration";
  label: string;
  items: string[];
}

export interface Language {
  name: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
  /** Rendered verbatim. Do not compute a percentage bar from it. */
  level: string;
}

/**
 * The experience `yearsOfExperience()` counts from. Smartbiz (Oct 2014) is the
 * first UI/product role; the freelance years before it are shown as context
 * under "Earlier" but are NOT counted, which is what keeps the number honest
 * and matches Doug's own PDF ("over 10 years").
 * ⚠️ CONFIRMAR DOUG — anchor choice. smartbiz → 11 years today; freelance → 16.
 */
export const CAREER_ANCHOR: ExperienceId = "smartbiz";
```

### 2.2 `experiences` — content (newest first)

```ts
export const experiences: Experience[] = [
  {
    id: "naowee",
    company: { name: "Naowee" },
    role: "Head of Product",
    start: { year: 2026, month: 1 },
    // no `end` — current
    location: { city: "Barranquilla", country: "Colombia", mode: "remote" },
    summary:
      "Product direction for SUID, the platform built for Colombia's sports system. I set direction across eight business modules and build the prototypes that define them.",
    impact: [
      "**Product direction across 8 business modules** — inspection and control over ~1,200 sports organizations and their 30 regulatory procedures, plus events, venues, incentives, convocatorias and scoring.",
      "**One design system, and I build in it** — 38+ components, a canonical shell and a single wizard recipe holding 130+ screens to one language.",
      "**Modeled the sector's real hierarchy** — committees, federations, leagues, clubs and athletes with cascading approval, across 45+ states and 15 roles.",
      "**Working prototypes instead of specs** — built in code, then walked story by story with analysts who sign off against the running product.",
    ],
    caseSlug: "naowee-suid",
    era: "current",
  },
  {
    id: "mercadolibre",
    company: { name: "Mercadolibre", url: "https://ux.mercadolibre.com" },
    client: "Andes Design System",
    role: "Tech Lead · Design Systems",
    roleShort: "Tech Lead · Design Systems",
    start: { year: 2024 }, // ⚠️ CONFIRMAR DOUG — start month
    end: { year: 2026, month: 1 },
    location: { region: "LATAM", mode: "remote" },
    summary:
      "Technical lead on Andes, the design system behind Mercadolibre's commerce, fintech and shipping products across 18 countries.",
    impact: [
      "**Design library maintained across iOS, Android and Web** — used by 400+ designers and 2,000+ engineers.",
      "**Foundational definitions** — tokens, spacing, type and motion governing the product suite across 18 countries.",
      "**Cross-platform work with engineering** — component APIs agreed once and shipped the same on every platform.",
      "**AI inside the systems practice** — prompt-driven audits that catch system drift in Figma before it ships.",
    ],
    caseSlug: "mercadolibre-andes",
    era: "core",
  },
  {
    id: "aval",
    company: { name: "Aval Digital Labs", url: "https://www.adldigitallab.com" },
    client: "Banco de Occidente",
    role: "Senior Product Designer · Design System Gatekeeper",
    roleShort: "Senior Product Designer · DS Gatekeeper",
    start: { year: 2018, month: 11 },
    end: { year: 2024 }, // ⚠️ CONFIRMAR DOUG — end month
    location: { city: "Bogotá", country: "Colombia", mode: "hybrid" }, // ⚠️ CONFIRMAR DOUG — mode
    summary:
      "Senior product designer for Banco de Occidente's digital banking, and the official gatekeeper of the design system shared across the bank's product squads.",
    impact: [
      "**Design System Gatekeeper** — governed additions, deprecations and patterns across 12+ product squads.",
      "**Built Velocity, the bank's design system** — documentation, foundations, atoms, molecules and organisms, on atomic-design principles.",
      "**Redesigned core banking flows** — login and registration, accounts and cards, transfers and payments, for desktop, tablet and mobile.",
      "**System literacy** — workshops, classes and crits, plus mentorship for junior and mid-level designers.",
    ],
    caseSlug: "banco-de-occidente",
    era: "core",
  },
  {
    id: "globant",
    company: { name: "Globant", url: "https://www.globant.com" },
    client: "Royal Caribbean",
    role: "Senior Product Designer",
    start: { year: 2017, month: 8 },
    end: { year: 2018, month: 11 },
    location: { city: "Medellín", country: "Colombia", mode: "onsite" },
    summary:
      "Mobile and web design for Royal Caribbean cruises, from Globant's Medellín studio, with product and engineering based in the US.",
    impact: [
      "**Booking and onboard guest experience** — mobile flows across destinations, stateroom types and life aboard.",
      "**Designed for intermittent connectivity** — schedules, dining, excursions and balances that hold up at sea.",
      "**Cross-functional collaboration** with US-based product and engineering teams.",
    ],
    caseSlug: "royal-caribbean",
    era: "core",
  },
  {
    id: "qrvey",
    company: { name: "Qrvey", url: "https://www.qrvey.com" },
    client: "Embedded Analytics Platform",
    role: "Lead UI Designer",
    start: { year: 2016, month: 10 },
    end: { year: 2017, month: 8 },
    location: { city: "Barranquilla", country: "Colombia", mode: "onsite" },
    summary:
      "Lead UI designer on Qrvey's embedded analytics platform — dashboards, charts and configuration that SaaS products ship inside their own interfaces.",
    impact: [
      "**Owned the visual language** of the dashboard product, mobile and web.",
      "**Chart and data-visualization system** built to stay brand-neutral inside any host product.",
      "**Prototyped UX/UI improvements** that shipped to production for enterprise clients.",
    ],
    caseSlug: "qrvey",
    era: "core",
  },
  {
    id: "ideaware",
    company: { name: "Ideaware", url: "https://www.ideaware.co" },
    role: "Senior UX/UI Designer",
    start: { year: 2016, month: 3 },
    end: { year: 2016, month: 10 },
    location: { city: "Barranquilla", country: "Colombia", mode: "onsite" },
    summary:
      "UX/UI design for international clients at a remote-first agency — wireframes, UI kits and high-fidelity prototypes for web and mobile.",
    impact: [
      "**Wireframes, UI kits and prototypes** delivered developer-ready across web and mobile.",
      "**A new domain on every engagement** — the multi-domain fluency that later made systems work feel natural.",
      "**Pool Botball** — an iOS app for pool chemistry monitoring, designed screen by screen.",
    ],
    caseSlug: "ideaware",
    era: "core",
  },
  {
    id: "smartbiz",
    company: { name: "Smartbiz Solutions" },
    role: "Junior UI Designer",
    start: { year: 2014, month: 10 },
    end: { year: 2016, month: 2 },
    location: { city: "Barranquilla", country: "Colombia", mode: "onsite" },
    summary:
      "First UI role. Interface design for web and mobile client projects, and the first time I worked inside a shared component library instead of one-off screens.",
    // ⚠️ CONFIRMAR DOUG — these three bullets are the only part of the CV with no
    // written source. The Behance résumé lists the role, dates and employer only.
    // Confirm, replace, or cut the bullets and keep just `summary`.
    impact: [
      "**Interface design for web and mobile** client projects, from first sketch to handoff.",
      "**Reusable UI kits** instead of one-off screens — the habit the rest of the career is built on.",
    ],
    era: "earlier",
  },
  {
    id: "freelance",
    company: { name: "Freelance" },
    role: "Graphic & Interface Designer",
    start: { year: 2010, month: 2 },
    end: { year: 2014, month: 10 },
    location: { city: "Barranquilla", country: "Colombia", mode: "onsite" },
    summary:
      "Independent graphic and interface design for local clients — brand systems, print and early web work.",
    // ⚠️ CONFIRMAR DOUG — same as smartbiz. Behance lists "Freelance Graphic
    // Designer, feb 2010 — oct 2014" and nothing else. The Behance projects from
    // this era (Labrick, Quimbayo, Hortal, Tactical Energy) are brand/print and
    // are deliberately NOT published as cases (plan §0).
    impact: [
      "**Brand systems and print** for local businesses, plus the first web work.",
    ],
    era: "earlier",
  },
];
```

### 2.3 Education, certifications, skills, tools, languages

```ts
export const education: Education[] = [
  {
    id: "uac",
    start: { year: 2006 },
    end: { year: 2009 },
    program: "Professional Graphic Designer",
    institution: "Universidad Autónoma del Caribe",
    location: "Barranquilla, Colombia",
  },
];

// Formal courses, separated from the degree. The 2025 "AI for Designers ·
// Continuous learning · ongoing" row in today's cv.ts is DELETED: it names no
// issuer and is not a credential (cvSync §4).
export const certifications: Certification[] = [
  { id: "globant-foundations", name: "Design Foundations", issuer: "Globant", year: 2018 },
  { id: "adl-ds-essentials", name: "Design System Essentials", issuer: "Aval Digital Labs", year: 2020 },
  { id: "coursera-ui", name: "Introduction to UI", issuer: "Coursera", year: 2022 },
];

export const skills: SkillGroup[] = [
  {
    id: "product",
    label: "Product",
    items: [
      { label: "Product direction", primary: true },
      { label: "Design thinking", primary: true },
      { label: "User research & surveys" },
      { label: "User journeys" },
      { label: "User flows" },
      { label: "A/B testing" },
      { label: "Wireframing" },
      { label: "Prototyping" },
    ],
  },
  {
    id: "systems",
    label: "Design systems",
    items: [
      { label: "Tokens & foundations", primary: true },
      { label: "Component libraries", primary: true },
      { label: "Governance" },
      { label: "Documentation" },
      { label: "UI kits" },
      { label: "Atomic design" },
      { label: "Cross-platform parity" },
    ],
  },
  {
    // New group. The plan (§1b) requires it; olbo and Naowee are the evidence.
    id: "engineering",
    label: "Engineering",
    items: [
      { label: "TypeScript & JavaScript", primary: true },
      { label: "React & Next.js", primary: true },
      { label: "Node.js" },
      { label: "Automated testing" },
      { label: "PWA & service workers" },
      { label: "IndexedDB" },
      { label: "Content Security Policy" },
      { label: "Git" },
    ],
  },
  {
    id: "ai",
    label: "AI in the build",
    items: [
      { label: "Prototyping in code with AI", primary: true },
      { label: "Generative UI" },
      { label: "LLM-driven flows" },
      { label: "Prompt-driven design audits" },
      { label: "Structured tool calls" },
      { label: "On-device and privacy constraints" },
    ],
  },
  {
    id: "platforms",
    label: "Platforms",
    items: [
      { label: "iOS" },
      { label: "Android" },
      { label: "Web" },
      { label: "Responsive" },
      { label: "Web & app interactions" },
      { label: "No-code tools" },
    ],
  },
];

// The 15 tool icons identified in the 2026 PDF, plus the five the cases already
// cite (Claude Code, Cursor, Gemini, GitHub, Storybook).
// NOTE — the plan named three groups (design / code / ai). Jira and Notion are in
// the PDF's 15 and belong to none of them, so a fourth `collaboration` group is
// added rather than dropping documented tools or mislabelling them. If the build
// agent prefers three groups, drop `collaboration` entirely — not its contents
// into another group.
export const tools: ToolGroup[] = [
  {
    id: "design",
    label: "Design",
    items: ["Figma", "Sketch", "Adobe XD", "Illustrator", "Photoshop", "Balsamiq", "InVision", "Marvel", "Spline", "Webflow"],
  },
  {
    id: "code",
    label: "Code",
    items: ["Claude Code", "Cursor", "GitHub", "Storybook"],
  },
  {
    id: "ai",
    label: "AI",
    items: ["Claude", "Gemini", "ChatGPT", "Midjourney"],
  },
  {
    id: "collaboration",
    label: "Collaboration",
    items: ["Jira", "Notion"],
  },
];

export const languages: Language[] = [
  { name: "Spanish", cefr: "Native", level: "Native" },
  { name: "English", cefr: "B1", level: "B1 · Working proficiency" },
];
```

**Dropped from today's `cv.ts` tools** (never appear in any case or in the PDF's icons): `After Effects`, `Principle`, `Framer`, `v0`. Re-add only with a source.

---

## 3. `src/data/work.ts` — changes to `CaseStudy` only

Narrative fields (`tagline`, `impact`, `context`, `contributions`, `kpis`, `process`, `decisions`, `features`, `video`, `gallery`, `links`, `credits`, `technologies`) keep their current shape. The diff:

```ts
export interface CaseStudy {
  slug: string;
  num: string;
  project: string;
  category: string;
  kind?: "client" | "personal";

  // ── ADDED ──────────────────────────────────────────────────────────────
  /** Links the case to its employer. Omitted only for `kind: "personal"`. */
  experienceId?: ExperienceId;
  /** Only when the role INSIDE the case differs from the CV role. olbo uses it. */
  roleOverride?: string;
  /** Only for a case with no experience behind it. olbo uses it. */
  yearOverride?: string;
  /** Renders the CaseTestimonial slot. */
  testimonialId?: string;

  // ── REMOVED ────────────────────────────────────────────────────────────
  // colors: [string, string];   ← the B/N refactor has no cover gradients
  // thumbnail?: string;          ← declared, never populated on any case
  // client: string;              ← derived (getCaseMeta)
  // role: string;                ← derived (getCaseMeta)
  // year: string;                ← derived (getCaseMeta)

  /** Stays on the case — it describes the case, not the employment. */
  team: string;
  /** Optional now; derived from the experience when absent. */
  duration?: string;

  // …everything else unchanged…
}
```

**Per-case wiring (the only edits to the seven existing entries beyond copy):**

| slug | `experienceId` | `roleOverride` | `yearOverride` | `testimonialId` |
|---|---|---|---|---|
| `olbo` | — (`kind: "personal"`) | `"Design Engineer — end to end"` | `"2026"` | — |
| `naowee-suid` | `"naowee"` | — | — | — ⚠️ CONFIRMAR DOUG (no testimonial yet) |
| `mercadolibre-andes` | `"mercadolibre"` | — | — | — ⚠️ CONFIRMAR DOUG (no testimonial yet) |
| `banco-de-occidente` | `"aval"` | — | — | `"francesca"` |
| `royal-caribbean` | `"globant"` | — | — | `"nicolas"` |
| `qrvey` | `"qrvey"` | — | — | `"arman"` |
| `ideaware` | `"ideaware"` | — | — | — |

`caseStudies` order is unchanged: olbo /01, naowee-suid /02, mercadolibre-andes /03, banco-de-occidente /04, royal-caribbean /05, qrvey /06, ideaware /07.

---

## 4. `src/data/testimonials.ts`

```ts
export interface Testimonial {
  id: string;
  quote: string;
  author: { name: string; role: string; company: string; initials: string };
  /** What the quote is about. */
  context?: string;
  year: string;
  experienceId: ExperienceId;
  caseSlug?: string;
}
```

Content: the three existing quotes are kept verbatim; only the two link fields are added.

| id | experienceId | caseSlug | context |
|---|---|---|---|
| `francesca` | `aval` | `banco-de-occidente` | `"Banco de Occidente · Velocity Design System"` |
| `arman` | `qrvey` | `qrvey` | `"Qrvey Analytics Platform"` |
| `nicolas` | `globant` | `royal-caribbean` | `"Royal Caribbean Cruises Project"` |

Two notes the build agent must not resolve on its own:

- **"Velocity Design System" is verified.** The cvSync audit flagged it as appearing nowhere else; it is printed in the published Behance piece ("Velocity Design System", section 05). The context string stands.
- ⚠️ **CONFIRMAR DOUG — Francesca's quote.** Its first sentence ("Extremely professional and fast service… We've done 8 projects with him") reads as a vendor review and sits oddly against six years in-house. Doug has already decided the testimonial stays (plan D10). Options, Doug picks one: **(a)** publish verbatim as-is; **(b)** publish only the second half, which reads in-house — *"Doug is a master of detail and very creative. He doesn't just design — he architects how products should feel."* A testimonial must never be edited without the author's or Doug's explicit say-so, so the build agent ships (a) until told otherwise.

---

## 5. `src/data/sections.ts` — home panels

Shared by `app/page.tsx` and `SectionIndex`. Layout belongs to `03-home-panels.md`; this file owns only the list and its labels.

```ts
export interface Section {
  id: string;      // anchor + skip-link target
  num: string;     // "00".."04"
  label: string;   // SectionIndex + header nav
  title: string;   // panel heading, see 07-copy-deck.md
}

export const sections: Section[] = [
  { id: "home",    num: "00", label: "Home",    title: "Doug Vargas" },
  { id: "work",    num: "01", label: "Work",    title: "Selected work" },
  { id: "craft",   num: "02", label: "Craft",   title: "How I work" },
  { id: "about",   num: "03", label: "About",   title: "About" },
  { id: "contact", num: "04", label: "Contact", title: "Let's talk" },
];
```

---

## 6. `src/lib/career.ts` — helpers

```ts
import { experiences, CAREER_ANCHOR, type Experience, type ExperienceId, type YearMonth } from "@/data/cv";
import { type CaseStudy } from "@/data/work";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const;

/** The one experience with no `end`. Throws if the data has zero or two. */
export function currentExperience(): Experience;

/** Experience by id. Throws on an unknown id — a typo must fail the build, not render blank. */
export function getExperience(id: ExperienceId): Experience;

/** "Oct 2016", "2024" (month omitted), "Now" (end undefined). */
export function formatPoint(point: YearMonth | undefined): string;

/**
 * "Oct 2016 — Aug 2017" · "Jan 2026 — Now" · "2024 — Jan 2026" (start month unknown).
 * Em dash with spaces on both sides. Never "Present", never "Ongoing".
 */
export function formatPeriod(e: Experience): string;

/**
 * Whole years, floored, from CAREER_ANCHOR's start to `now`.
 * Replaces every hardcoded "Twelve years" / "12" / "A decade" in the codebase.
 * `now` is injected so the test is not time-dependent.
 */
export function yearsOfExperience(now?: Date): number;
```

`career.ts` imports only from `cv.ts`. The `import { type CaseStudy }` line above is therefore **not** needed — `getCaseMeta` does not live here (see §6.1).

### 6.1 `getCaseMeta` — lives in `src/data/work.ts`

Import direction: `career.ts → cv.ts`, and `work.ts → cv.ts + career.ts`. Putting `getCaseMeta` in `career.ts` would make `career.ts` import `work.ts` and close a cycle. It goes in `work.ts`, beside `getCaseStudy`, and takes a **slug** — which is what the case template has in hand (`04-case-template.md` line 57: `const meta = getCaseMeta(study.slug)`).

```ts
// src/data/work.ts
export interface CaseMeta {
  client: string;
  role: string;
  /** Formatted span: "Nov 2018 — 2024". */
  year: string;
  /** Same string, named for a timeline context, so the meta strip can label
   *  the cell either way without recomputing it. */
  period: string;
  team: string;
  duration: string;
  location?: string;
}

/** Throws on an unknown slug — a typo must fail the build, not render blank. */
export function getCaseMeta(slug: string): CaseMeta;
```

Contract:

| field | `experienceId` present | `experienceId` absent (personal) |
|---|---|---|
| `client` | `getExperience(id).client ?? getExperience(id).company.name` | `"Personal product"` |
| `role` | `c.roleOverride ?? getExperience(id).role` | `c.roleOverride` (required — throw if missing) |
| `year` / `period` | `c.yearOverride ?? formatPeriod(getExperience(id))` | `c.yearOverride` (required — throw if missing) |
| `team` | `c.team` | `c.team` |
| `duration` | `c.duration ?? ` span derived from the experience | `c.duration` (required — throw if missing) |
| `location` | formatted from `getExperience(id).location` | `undefined` |

The meta strip in `04-case-template.md` renders `Role · Duration · Team · Year` from this object and reads nothing off `study` directly.

---

## 7. Hardcoded arrays to delete (file : line)

Every line range below is a local copy of data that moves to `cv.ts` / `site.ts` / `tools`. Sources: cvSync §0 and §6, verified against the working tree at `redesign/bn-editorial`.

| File | Lines | What it is | Replace with |
|---|---|---|---|
| `src/components/sections/SelectedWork.tsx` | **82–119** | `interface ExperienceItem` + `const experience: ExperienceItem[]` — 6 employers, third duplicate of the career | `experiences` from `@/data/cv` |
| `src/components/sections/SelectedWork.tsx` | **183–185** | `"A decade of systems, products, and teams —"` | `yearsOfExperience()` interpolated — see `07-copy-deck.md` §Work |
| `src/components/sections/SelectedWork.tsx` | **234–237** | Education folded to one hardcoded line (UAC 2006–2009) | `education[0]` |
| `src/components/sections/About.tsx` | **16–22** | `const facts: Fact[]` — Based / Currently / Focus / Availability / Languages, all literals | `currentExperience()`, `site.location`, `site.availability`, `languages` |
| `src/components/sections/About.tsx` | **67–71** | Bio lead: `"Twelve years…"` **and** `"most recently leading Andes"` — contradicts `Currently: Naowee` 50 lines above | `site.summary` |
| `src/components/sections/Capabilities.tsx` | **43–59** | `const tools` — 15 names, second copy (third if `ToolsMarquee` counted) | `tools` from `@/data/cv` |
| `src/components/sections/Capabilities.tsx` | **67–72** | `const proof: Proof[]` — `"12"` years unsourced, plus Andes figures | `yearsOfExperience()` + KPIs of `mercadolibre-andes` |
| `src/components/sections/WorkTimeline.tsx` | **whole file** | 5-employer copy, orphan since `a588bd8`, says `"Twelve years, five chapters"` | delete file |
| `src/components/sections/ToolsMarquee.tsx` | **whole file** | orphan tools list | delete file |
| `src/components/sections/Intro.tsx` | **76–92** | `"Senior Product Designer × Design Systems Architect — currently leading components at Andes"` | delete file (`/cv` clone, plan §1.8) |
| `src/data/site.ts` | **15** | `role:` | `headline` + `positioning` |
| `src/data/site.ts` | **27** | `cvPath:` — defined, never imported | `cv.path` |
| `src/app/layout.tsx` | **34–78** | metadata block, "Senior Product Designer × AI" | `site.seo` — see `06-seo.md` |
| `src/app/cv/layout.tsx` | **3–7** | `"CV — Senior Product Designer × AI"`, company list without Naowee | `06-seo.md` §3 |

After the deletions, the following greps must return hits **only** under `src/data/` and `src/lib/`:
`Head of Product` · `Tech Lead` · `Technical Lead` · `Senior Product Designer` · `Design System Gatekeeper` · `Mercadolibre` · `Naowee` · `Aval Digital Labs`.

---

## 8. Unit tests (vitest) — specs

New: `vitest` + `@vitest/coverage-v8`, `test` and `test:watch` scripts, `vitest.config.ts` with the `@/` alias. Files under `src/lib/__tests__/` and `src/data/__tests__/`.

### 8.1 `career.yearsOfExperience.test.ts`

```
describe("yearsOfExperience")
  it("counts whole years from the career anchor, not from a literal")
     → yearsOfExperience(new Date("2026-09-12")) === 11   // anchor Oct 2014
  it("has not incremented the day before the anniversary")
     → yearsOfExperience(new Date("2026-10-31")) === 12
     → yearsOfExperience(new Date("2026-09-30")) === 11
  it("derives from data — bumping the anchor's start year moves the result")
     → with a stubbed anchor start of { year: 2010, month: 2 }, result === 16
  it("never returns a hardcoded 12")
     → expect(String(yearsOfExperience(new Date("2030-01-01")))).not.toBe("12")
```

### 8.2 `career.formatPeriod.test.ts`

```
describe("formatPeriod")
  it("renders a closed period with both months")
     → getExperience("qrvey")    → "Oct 2016 — Aug 2017"
  it("renders the current role as Now")
     → getExperience("naowee")   → "Jan 2026 — Now"
  it("omits an unknown start month instead of guessing one")
     → getExperience("mercadolibre") → "2024 — Jan 2026"
  it("renders an unknown end month as the bare year")
     → getExperience("aval")     → "Nov 2018 — 2024"
  it("uses an em dash with single spaces, never a hyphen or 'Present'")
     → every experience: /^.+ — .+$/ and not /-|Present|Ongoing/
```

### 8.3 `work.getCaseMeta.test.ts`

Signature under test: `getCaseMeta(slug: string): CaseMeta`, exported from `@/data/work` (§6.1).

```
describe("getCaseMeta")
  it("derives client, role and year from the experience for a client case")
     → banco-de-occidente → { client: "Banco de Occidente",
                              role: "Senior Product Designer · Design System Gatekeeper",
                              year: "Nov 2018 — 2024" }
  it("uses the employer name when the experience declares no client")
     → ideaware → client === "Ideaware"
  it("uses the overrides for a personal case")
     → olbo → { client: "Personal product",
                role: "Design Engineer — end to end",
                year: "2026" }
  it("throws when a personal case is missing roleOverride or yearOverride")
  it("never reads a removed field")
     → expect(study).not.toHaveProperty("colors")
     → expect(study).not.toHaveProperty("thumbnail")
```

### 8.4 `data.singleSource.test.ts` — the guard

```
describe("components declare no career data")
  it("no file in src/components/sections contains an array literal with company:")
     → read every *.tsx under src/components/sections
     → fail if /\bcompany\s*:/ is present, naming the file and line
  it("no component hardcodes a year count")
     → fail on /\b(Twelve|Eleven|Ten)\s+years\b/i or /\bA decade\b/i
       outside src/data and src/lib
  it("no component hardcodes a role string")
     → for each of ["Head of Product","Tech Lead","Technical Lead",
                    "Senior Product Designer","Design System Gatekeeper"]
       assert the only matches under src/ are in src/data/ or src/lib/
  it("the retired identity is gone")
     → fail on /Senior Product Designer × AI/ anywhere in src/ or in README.md
```

### 8.5 `data.integrity.test.ts`

```
describe("cv + work integrity")
  it("exactly one experience is current (no end)")
  it("every caseSlug on an experience resolves to a case study")
  it("every experienceId on a case study resolves to an experience")
  it("every testimonial's experienceId and caseSlug resolve")
  it("experiences are ordered newest first by start")
  it("no experience period overlaps another")   // catches the old Qrvey/Globant 2017–18 clash
  it("site.headline and site.positioning are the only identity strings")
```

---

## 9. Open contradictions this spec could not resolve

1. **Globant role.** The Behance résumé says *Senior Visual Designer*; the 2026 PDF and the current code say *Senior Product designer*. This spec uses **Senior Product Designer** (the newer, self-authored source). ⚠️ CONFIRMAR DOUG.
2. **Qrvey role.** Behance says *Lead Senior UX/UI*; the PDF says *Lead UI Designer*. This spec uses **Lead UI Designer**. ⚠️ CONFIRMAR DOUG.
3. **Aval end date.** Behance says *nov 2018 → Presente* (stale), the PDF says *2018 — 2024*, the code says *2018 — 2024*. Month of departure unknown. ⚠️ CONFIRMAR DOUG.
4. **Mercadolibre start month.** No source anywhere has it. ⚠️ CONFIRMAR DOUG.
5. **Degree end year.** `cv.ts` says 2006–2009; the Behance résumé says 2006–2010. This spec uses **2009** (self-authored PDF agrees). ⚠️ CONFIRMAR DOUG.
