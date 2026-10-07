import { getCv, type ExperienceId } from "@/data/cv";
import { workEs } from "@/data/es/work";
import { formatLocation, formatPeriod } from "@/lib/career";
import type { Locale } from "@/i18n/config";

export interface Kpi {
  /** Headline figure — "40%", "18", "2K+", "Hours". */
  value: string;
  /** What it measures. */
  label: string;
  /** Optional small context chip — "vs. before", "not sprints", "beat goal". */
  delta?: string;
}

export interface CaseStudy {
  slug: string;
  num: string;
  project: string;
  category: string;
  /**
   * Links the case to its employer in `cv.ts`. Client, role and period are
   * derived from it — see `getCaseMeta`. Omitted only for `kind: "personal"`.
   */
  experienceId?: ExperienceId;
  /** Only when the role INSIDE the case differs from the CV role. */
  roleOverride?: string;
  /** Only for a case with no experience behind it. */
  yearOverride?: string;
  /** Renders the case testimonial slot. */
  testimonialId?: string;
  /**
   * The work is client-confidential: no gallery, no screenshots. The index row
   * and the case page show "Case study available on request" instead.
   */
  nda?: boolean;
  /** Describes the case, not the employment. */
  team: string;
  /** Optional; derived from the experience when absent. */
  duration?: string;
  /** One-line hero tagline. */
  tagline: string;
  /** One punchy, results-first sentence — the market hook. */
  impact: string;
  /** Problem + approach, in brief. Keep it to 1–2 sentences. */
  context: string;
  /** 3–4 short bullets of what I actually did. **bold** supported. */
  contributions: string[];
  /** 3–5 metric cards. Draft figures — confirm real numbers per project. */
  /** Verified figures only. Omit entirely when a case has none — the band
   *  then prints the impact sentence alone. */
  kpis?: Kpi[];
  technologies?: string[];
  externalLink?: { label: string; href: string };
  /**
   * Client engagement, self-initiated product, or a side project taken on
   * outside a job — drives framing and which group the index lists it under.
   */
  kind?: "client" | "personal" | "side";
  /** What the meta strip calls the client when there is no experience behind it. */
  clientOverride?: string;
  /** Numbered narrative of how the work happened, phase by phase. */
  process?: { phase: string; title: string; body: string }[];
  /** The calls worth defending — each one a choice and its reasoning. */
  decisions?: { title: string; body: string }[];
  /** Lead-in paragraph that frames the capability list below it. */
  featuresIntro?: string;
  /** Standout capabilities — `kind` separates AI-powered ones from product depth. */
  features?: { title: string; body: string; kind?: "ai" | "product" }[];
  /** Silent screen recording from /public/work/<slug>/ — `label` is the accessible name, dimensions reserve the box. */
  video?: {
    webm?: string;
    mp4: string;
    poster?: string;
    caption?: string;
    label: string;
    width: number;
    height: number;
  };
  /**
   * Screenshots from /public/work/<slug>/ — alt is required, caption optional.
   * `width`/`height` are the intrinsic pixels of that file; only "plain"
   * galleries need them, because their items each have their own aspect ratio
   * instead of sharing the frame's.
   */
  gallery?: { src: string; alt: string; caption?: string; width?: number; height?: number }[];
  /**
   * Which device frame `gallery` renders in. Mobile products ("phone") get the
   * handset mockup; desktop web platforms ("browser") need a browser chrome
   * instead. "plain" is for captures that already contain their own device or
   * are diagrams — a presentation artboard inside a browser window renders a
   * browser holding a tablet holding the product. Omitted means "phone" — the
   * original behaviour, so olbo is unchanged.
   */
  galleryKind?: "phone" | "browser" | "plain";
  /**
   * Which frame `video` renders in. Omitted, it follows `galleryKind` — a clip
   * of the same product almost always belongs in the same frame as its stills,
   * so naowee's browser gallery gives its walkthrough a browser window for free
   * and olbo, which declares neither field, keeps the handset it always had.
   * Set it only when a case genuinely mixes the two (a mobile clip of a desktop
   * platform, or the reverse).
   */
  videoKind?: "phone" | "browser";
  /** Extra destinations beyond externalLink — live app, source, writeups. */
  links?: { label: string; href: string }[];
  /** Who did what — authorship and collaborators, in one paragraph. */
  credits?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "olbo",
    num: "/01",
    project: "olbo",
    category: "Personal Product × Design Engineering",
    roleOverride: "Design Engineer — end to end",
    yearOverride: "2026",
    duration: "Weeks — still shipping",
    team: "Solo — design, engineering, shipping",
    kind: "personal",
    tagline:
      "A personal finance PWA that asks whether you're on pace, not what's left — zero dependencies, 634 tests, shipped.",
    impact:
      "A live, installable finance PWA with 634 tests passing in 292ms and zero dependencies — designed and engineered end to end, AI in the loop, nothing thrown away.",
    context:
      "Budgeting apps answer \"how much is left\" — the anxious question. I built olbo for my own household: a local-first PWA in Colombian pesos whose core is a traffic light that reads spending pace against the day of the month.",
    contributions: [
      "**Product direction and interface** — 24 views, from the traffic-light dashboard to AI capture that reads a photographed receipt, a spoken sentence or a PDF statement.",
      "**Pure domain layer** — the budget math carries no DOM, no database and no clock of its own; 634 tests run in Node in 292ms.",
      "**Zero dependencies** — vanilla ES modules the browser runs as written: no bundler, no framework, no build step.",
      "**Verifiable privacy** — a strict CSP limits the app to itself plus api.anthropic.com, so the local-first promise is readable in the header.",
    ],
    kpis: [
      { value: "634", label: "Tests passing", delta: "in 292ms" },
      { value: "0", label: "Dependencies", delta: "no bundler, no framework" },
      { value: "62", label: "JS modules", delta: "across 24 views" },
      // Verified 2026-09-12 in the olbo repo: 6,410 lines of test vs 16,265 of
      // code = 1:2.5. The delta is rounded down so it cannot be over-read.
      { value: "1:2.5", label: "Test-to-code ratio", delta: "6,400 lines of tests" },
    ],
    process: [
      {
        phase: "01",
        title: "The problem was mine",
        body: "I built olbo because I needed it. Every budgeting app I tried answered the wrong question — how much is left — and answered it in someone else's currency, with cents, for someone else's month. In Colombia the salary lands, the fixed costs bite, and what remains has to stretch. I wanted whole pesos, Spanish that sounds like home, and my data staying on my own phone. So I scoped it as product first: one screen that tells me if I'm fine, and a capture flow that takes seconds.",
      },
      {
        phase: "02",
        title: "Pace instead of balance",
        body: "The core call was to stop measuring the balance and start measuring rhythm. Progress is the day over the days in the month; pace is variable spending over the variable pocket; the ratio between them picks the color. Green at or under one, amber to 1.25, red above. Spending 90% of the pocket on the 28th is fine; 80% on the 10th is not. The same expense changes color with the calendar, so the app stopped punishing consumption and started choreographing time.",
      },
      {
        phase: "03",
        title: "Built with AI, held to production discipline",
        body: "I worked with Claude as a pair and refused to let the output be disposable. No dependencies, no build step. The domain layer stays pure — no DOM, no IndexedDB, no window — and \"today\" is always injected, never Date.now() inside the math. That single constraint is what lets 634 tests run in Node in 292ms with no browser involved. AI wrote fast; the tests decided what survived. Every commit is in Spanish, in product voice, describing behavior rather than code.",
      },
      {
        phase: "04",
        title: "Shipping, then listening",
        body: "Then I shipped it: a PWA on GitHub Pages, installable, offline, service worker now at v150. Daily use surfaced what no spec would have — a timezone bug that broke the color at night west of Greenwich, receipts and card statements I refused to retype, an interface I re-skinned dark once I saw it in my hand after sunset. Each became a decision, a test, and a version bump. The app keeps moving because I use it every day and it tells me when it's wrong.",
      },
    ],
    decisions: [
      {
        title: "The traffic light reads pace, not balance",
        body: "Balance answers an anxious question. Pace answers an actionable one. The color compares your spending rhythm to how far the month has gone — ratio at or under 1 is green, up to 1.25 amber, above that red. This is a product decision, not a technical one: it means accepting that the same amount can be calm or alarming depending on the date, and trusting the calendar to say which.",
      },
      {
        title: "Variable bills never reserve money",
        body: "Fixed costs with a variable amount — power, water, fuel — do not reserve their estimate. Reserving looks prudent, and that is the trap: reserving too much produces a red that isn't true, and one false red is enough to stop believing the color. So a variable bill only weighs once you record what it actually cost. The traffic light's credibility outranks its caution.",
      },
      {
        title: "Privacy you can check, not just read",
        body: "Local-first is a claim everyone makes. I made this one verifiable: a strict Content-Security-Policy allows scripts and styles only from the app itself and limits connect-src to 'self' plus api.anthropic.com. Nothing else can leave the device, and anyone can read the header to confirm it. It cost me every inline style — including inside SVGs — and it was the right price.",
      },
    ],
    featuresIntro:
      "Capture is where finance apps die. If recording an expense takes effort nobody records it, and with no data there is no pace to read and no traffic light — so olbo takes the expense however it arrives: a photo, a sentence said out loud, a bank text, a whole statement.",
    features: [
      {
        title: "Photograph the receipt",
        body: "Point the camera at a receipt and Claude reads back the total in whole pesos, the merchant, and a category taken from your own list — into a review card you confirm before anything is saved. It runs on your own Anthropic key, kept on the device, shown masked and excluded from backups.",
        kind: "ai",
      },
      {
        title: "Say the expense out loud",
        body: "Hold the mic and speak: \"cincuenta mil en el mercado\". Colombian Spanish recognition on the device, then Claude with the tool call forced, so the answer is always a structured movement — amount, type, merchant, category, account — not free prose. It reports its own confidence; below 0.7 the card flags itself for review.",
        kind: "ai",
      },
      {
        title: "Paste the bank's text message",
        body: "Bank alerts follow a template, so this one deliberately uses no model: an exact parser reads both of the bank's formats — one writes 50,000.00, the other $100.000 — offline, instantly, free, with no way to hallucinate an amount. An iOS Shortcut hands the message straight to the app.",
        // Deliberately not tagged "ai": the copy's whole point is that a parser
        // beats a model here. An AI label next to it would contradict the text.
        kind: "product",
      },
      {
        title: "Read the whole card statement",
        body: "Hand it a PDF statement and it comes back as structured data: closing and due dates, the rate converted from annual to monthly, total, balance, and every installment purchase with its remaining term. The file is decrypted and rendered on the phone, and the CSP allows no destination but api.anthropic.com.",
        kind: "ai",
      },
      {
        title: "A conscience that talks back",
        body: "The advisor sees your real numbers and answers in blunt Colombian Spanish — a short remark on each expense you record, and a full-screen room where you can ask. It is handed each product's installment factors, so it computes what a purchase really costs in interest, and says so when a rate is missing.",
        kind: "product",
      },
      {
        title: "The wallet: what you owe, what you're owed",
        body: "Cards, loans and utility bills sit in one portfolio, sortable by what falls due next instead of by name. Person-to-person loans run both directions — money you lent and money you owe — with payments logged against the balance, a progress bar, and interest estimated per month and per year.",
        kind: "product",
      },
    ],
    video: {
      webm: "/work/olbo/captura-gasto.webm",
      mp4: "/work/olbo/captura-gasto.mp4",
      poster: "/work/olbo/captura-gasto-poster.jpg",
      label:
        "Screen recording of olbo: an expense of 120.000 Colombian pesos typed on the app's own keypad, categorized and saved, then the dashboard and the movements list recalculating.",
      caption:
        "The floor every capture path lands on: 120.000 pesos in four taps, the balance counting down, and the pace recalculated before the sheet finishes closing.",
      width: 786,
      height: 1704,
    },
    gallery: [
      {
        src: "/work/olbo/semaforo-verde.webp",
        alt: "olbo dashboard with the traffic light in green — spending pace is at or under the share of the month elapsed.",
        caption: "Green: the pace matches the calendar.",
      },
      {
        src: "/work/olbo/semaforo-alerta.webp",
        alt: "olbo dashboard with the traffic light in alert — the same pocket read against an earlier day of the month turns the color to a warning.",
        caption: "The same amount, earlier in the month, reads as alert.",
      },
      {
        src: "/work/olbo/registrar.webp",
        alt: "olbo expense capture screen — entering a movement in whole Colombian pesos in a few taps.",
        caption: "Capture in whole pesos, in seconds.",
      },
      {
        src: "/work/olbo/movimientos.webp",
        alt: "olbo movements list — recorded expenses grouped and categorized, stored locally in IndexedDB.",
        caption: "Movements, categorized and kept on the device.",
      },
    ],
    links: [
      { label: "Live app", href: "https://dougnuken.github.io/bolsillo/" },
      { label: "Source", href: "https://github.com/dougnuken/bolsillo" },
    ],
    credits:
      "Design and engineering end to end: product direction, interface, domain logic, tests and deploy, all mine. Claude worked as a collaborator inside the build and inside the product itself, but the decisions — and the tests that enforce them — are mine.",
    technologies: [
      "Vanilla JS (ES modules)",
      "PWA & Service Worker",
      "IndexedDB",
      "node --test",
      "Strict CSP",
      "Claude API",
    ],
    externalLink: { label: "Live app", href: "https://dougnuken.github.io/bolsillo/" },
  },
  {
    slug: "naowee-suid",
    num: "/02",
    experienceId: "naowee",
    project: "Naowee — Sports Sector Platform",
    category: "GovTech × Sports × AI-native",
    duration: "Ongoing",
    team: "Product, design & engineering",
    kind: "client",
    tagline:
      "Digitizing how a country runs its sport — a modular platform built design-and-engineering in one motion, with AI in the loop end to end.",
    impact:
      "One AI-native platform now stands in for a stack of disconnected tools — shipped at a pace a classic design-to-dev handoff can't match.",
    context:
      "Colombia's sports sector ran on paper, spreadsheets, and siloed systems. As Head of Product I set the direction and built SUID end to end — a single design system, AI in the loop, and real operators in mind.",
    contributions: [
      "**Product direction across 8 business modules** — inspection and control over ~1,200 sports organizations and their 30 regulatory procedures, plus events, venues, incentives, convocatorias and live scoring.",
      "**One design system, and I build in it** — 38+ naowee-* components, a canonical shell and a single wizard recipe holding 130+ screens to one language.",
      "**Modeled the sector's real hierarchy** — committees → federations → leagues → clubs → athletes, with cascading approval and the federation's double validation; events enter by .xlsx template with partial load and row-numbered errors.",
      "**Working prototypes instead of specs** — built in code with Claude Code, Cursor and Gemini, then walked story by story through guided tours so analysts sign off against the running product.",
    ],
    kpis: [
      { value: "30", label: "Procedures digitized", delta: "Word, email and GESDOC before" },
      { value: "~1,200", label: "Sports organizations in scope" },
      { value: "130+", label: "Screens shipped", delta: "across 8 business modules" },
      { value: "8", label: "Business modules", delta: "of 13 total" },
    ],
    process: [
      {
        phase: "01",
        title: "The sector ran on files, not systems",
        body: "I joined as a product designer and spent the first weeks reading how the sector actually works. Colombia's Ministry of Sport supervises around 1,200 sports organizations through 30 regulatory procedures — recognition, inspection, sanctions — and every one of them moved through a Word template, an email thread and a document manager called GESDOC. Events ran on loose spreadsheets passed between people. Nothing was a system; everything was a file. Before drawing a single screen I mapped 45+ states and 15 roles across the inspection flow, because the states were the product. The interface was going to be the easy part.",
      },
      {
        phase: "02",
        title: "The problem wasn't the screens",
        body: "Once modules started multiplying the real failure showed up: eight business modules, each with its own buttons, its own tables, its own idea of a wizard. Analysts couldn't tell whether something was a rule or a rendering accident. So I stopped drawing screens and built the language — one design system, 38+ components, a canonical shell, one wizard recipe, one badge semantics map. The rule I hold myself and everyone else to: no custom component, ever; if the system lacks something, you extend the system. 130+ screens later that is what keeps eight modules reading as one product.",
      },
      {
        phase: "03",
        title: "Athletes and events, modeled by building them",
        body: "The two domains that looked simplest were the hardest. Athlete registration isn't a form: Colombian sport is a chain — committees, federations, leagues, clubs, athletes — where each level approves the one below, a federation needs both the Ministry and its committee to sign off, and an approved athlete inherits the club's league and federation. Events aren't a form either. Everything enters by template: download the .xlsx, fill it, upload it; valid rows load even when others fail, and failures come back listed by row number. Results, medal tables and rankings land the same way, across 83 parameterized sports. I designed both by building them — running prototypes in code, AI in the loop.",
      },
      {
        phase: "04",
        title: "The prototype is what gets signed",
        body: "Today I set product direction and I build. A module starts as a working prototype, not a document: real roles, real states, clickable. On top of it I ship a guided tour that walks an analyst through one user story at a time — the task, why it exists, and a spotlight on where to click — across screens and across roles. Business signs off against the product running, not against a spec everyone will read differently in two months. Engineering receives something already resolved, and my acceptance review is whether the built version is identical to the demo. The design system is the contract; the demo is how we sign it.",
      },
    ],
    decisions: [
      {
        title: "One system, or eight dialects",
        body: "Eight business modules, each with its own deadline and its own pressure to just ship. I could have let each build its own components and reconciled later. Instead every module builds from the same 38+ components and extends them through an override pattern rather than forking. It costs time at the start of each module and pays back on every review: when something looks wrong, it is a bug, not a preference.",
      },
      {
        title: "The demo is the requirement, not the document",
        body: "Specs get approved and then read differently by everyone who touches them. So what business signs is a working prototype with real roles and states, walked through one user story at a time. Disagreement surfaces while it is still cheap, and engineering gets a resolved target instead of an interpretation. It only works because I build the prototype myself — a doc-to-mockup-to-dev chain is too slow to argue with.",
      },
      {
        title: "The hierarchy is the product, not a lookup table",
        body: "A flat athlete table would have shipped months earlier. But Colombian sport is a chain of approvals: a federation needs both the Ministry and its committee, a league needs its federation, a club needs its league, an athlete needs a club — and nobody can approve while their own status is still pending. I modeled the chain, including the athlete with no club, because reporting medals by league only means something if the links are real.",
      },
    ],
    galleryKind: "browser",
    // `videoKind` is left to follow `galleryKind`: the walkthrough is a capture
    // of the same desktop platform the stills below it show, so it belongs in
    // the same browser window.
    video: {
      webm: "/work/naowee/recorrido-ivc.webm",
      mp4: "/work/naowee/recorrido-ivc.mp4",
      poster: "/work/naowee/recorrido-ivc-poster.jpg",
      label:
        "IVC: a coordinator assigns an overdue filing to a professional",
      caption:
        "A coordinator clears an overdue filing: pick the professional — the picker flags who is already overloaded — confirm, and the queue counters recompute in place, 6 pending down to 5, 3 assigned up to 4.",
      width: 1920,
      height: 1200,
    },
    gallery: [
      {
        src: "/work/naowee/ivc-bandeja.webp",
        alt: "The IVC coordinator's assignment queue: counters reading 6 in referral, 3 assigned and 3 in validation, above a table of 25 procedures listing each filing number, the sports organization and its NIT, days remaining, status and assigned professional.",
        caption: "The coordinator's queue: every procedure with a deadline and an owner.",
      },
      {
        src: "/work/naowee/ivc-workspace-tramite.webp",
        alt: "The professional's workspace on procedure IVC-2026-005: 18 days left on the deadline beside a checklist of 7 documents, each citing the article of Decreto 1387/1970 it answers, with validate, reject or observe available per document.",
        caption: "Each document checked against the article it has to answer.",
      },
      {
        src: "/work/naowee/project-panel-admin.webp",
        alt: "The convocatorias administrator panel: 1 of 7 calls open, 33 applications, 10 at the documentary stage and 30.5 million COP in active investment, over lists of recent applications and currently active calls.",
        caption: "Investment calls, applications and stages in a single panel.",
      },
      {
        src: "/work/naowee/project-revision-area-tecnica.webp",
        alt: "Technical-area review of application RAD-2026-003: an assigned-area notice with its SLA, an architectural checklist where every item cites its article of Resolución 933 and is marked compliant or unverified, progress at 4 of 6, and a panel of the uploaded documents.",
        caption: "One of eight technical areas, reviewed article by article.",
      },
      {
        src: "/work/naowee/escenarios-mapa.webp",
        alt: "The georeferenced sports-venue registry: a choropleth of Colombia shaded by department, with filters for region, venue type, status and CAR, beside a ranking of departments and an intensity legend.",
        caption: "The country's sports venues, department by department.",
      },
      {
        src: "/work/naowee/escenarios-perfil-escenario.webp",
        alt: "The profile of the venue Centro deportivo Norte, carrying a CAR badge: a photo carousel above tabs for general information, documentation and history, showing department, municipality, cadastral registration and coordinates.",
        caption: "A single venue: photos, documents and coordinates.",
      },
    ],
    // Both are public GitHub Pages, and Doug wants them reachable from the
    // case: the design system is the artefact the contribution list claims
    // ("38+ naowee-* components"), so a reader can go and count them.
    links: [
      {
        label: "Design system",
        href: "https://naowee-tech.github.io/design-naowee-design-system/",
      },
      { label: "Demos hub", href: "https://naowee-tech.github.io/design-naowee-demos-hub/" },
    ],
    credits:
      "Head of Product at Naowee: I set direction across the platform's business modules and build the prototypes that define them — product decisions, design system and working code. I work alongside business analysts, a designer I lead, and the engineering teams that take each module to production.",
    technologies: [
      "Product Strategy",
      "Design Systems",
      "Claude Code",
      "Cursor",
      "Gemini",
      "Generative UI",
    ],
  },
  {
    slug: "mercadolibre-andes",
    num: "/03",
    experienceId: "mercadolibre",
    project: "Andes Design System",
    category: "Design Systems × E-commerce",
    duration: "~2 years",
    team: "400+ designers, 2,000+ engineers",
    kind: "client",
    // No gallery, no video, no screenshots: the screens are Mercadolibre's.
    nda: true,
    tagline:
      "Technical lead on the design system behind Mercadolibre: 18 countries, three platforms, one library.",
    impact:
      "400+ designers and 2,000+ engineers build from one library, kept in parity across iOS, Android and Web.",
    context:
      "Andes is the source of truth for Mercadolibre's commerce, fintech and shipping products. I owned its foundations and component definitions, and brought AI into how it audits itself.",
    contributions: [
      "**Foundations** — tokens, spacing, type and motion, agreed once and governing the product suite.",
      "**Cross-platform parity** — one component API, shipped identically on iOS, Android and Web, worked out with engineering.",
      "**Maintenance at scale** — additions, deprecations and migrations in a library hundreds of designers open daily.",
      "**AI in the systems practice** — prompt-driven audits that catch drift in Figma before it ships.",
    ],
    // "~40% fewer rework cycles" is REMOVED: no source behind it. Its
    // qualitative replacement lives in `impact` ("kept in parity across iOS,
    // Android and Web"). Reinstate a number only against a real measurement.
    // The "Countries shipped to" label is looked up verbatim by Hero and Craft.
    kpis: [
      { value: "400+", label: "Designers on the system" },
      { value: "2K+", label: "Engineers on the system" },
      { value: "18", label: "Countries shipped to" },
      { value: "3", label: "Platforms in parity", delta: "iOS, Android, Web" },
    ],
    credits:
      "Technical lead on Andes, working across the design and engineering organizations that build on it.",
    technologies: [
      "Figma",
      "Design Tokens",
      "Storybook",
      "Cross-platform parity",
      "AI workflows",
    ],
    externalLink: { label: "Visit ux.mercadolibre.com", href: "https://ux.mercadolibre.com" },
  },
  {
    slug: "banco-de-occidente",
    num: "/04",
    experienceId: "aval",
    testimonialId: "francesca",
    project: "Banco de Occidente",
    category: "Banking × Design Systems",
    duration: "6 years",
    team: "12+ product squads",
    kind: "client",
    tagline:
      "One of Colombia's largest banks: its portal redesigned, and Velocity, the design system 12+ squads shared.",
    impact:
      "An overloaded banking portal rebuilt as one light, legible product, on a documented system that made each screen cheaper than the last.",
    context:
      "The portal was dense and hard to navigate, and every squad solved the same problems differently. I redesigned it and built Velocity to fix both.",
    contributions: [
      "**Redesigned the transactional portal** — login, accounts, cards, transfers, payments and product blocking, identical on desktop, tablet and mobile.",
      "**Built Velocity, the bank's design system** — foundations to organisms, on atomic design so the front end mirrors it.",
      "**Design System Gatekeeper** — approved additions, deprecations and patterns for 12+ squads, and ran the workshops and crits.",
    ],
    kpis: [
      // Doug's own figure, consistent across cv.ts and the published piece.
      { value: "12+", label: "Product squads aligned", delta: "one system" },
      // Derived from the Aval experience (Nov 2018 — 2024), not typed.
      { value: "6 yr", label: "As design system gatekeeper" },
      // Counted off the published system grid: 23 named tiles across five
      // columns. "20+" is deliberately conservative so it cannot be over-read.
      { value: "20+", label: "Documented system areas", delta: "foundations → organisms" },
      // The "Illustrated Icons" section of the piece: three rows of five.
      { value: "15", label: "Illustrated icons", delta: "drawn for the system" },
      // ⚠️ CONFIRMAR DOUG — "millions of customers" was a KPI here ("M+") with
      // no source behind it, so it is out. Reinstate only against a real figure.
    ],
    process: [
      {
        phase: "01",
        title: "Research, then flows",
        body: "Discovery, competitive research and user research came first. Then six flows, mapped with their exceptions before any screen: in banking, the exception is the product.",
      },
      {
        phase: "02",
        title: "Prototypes tested on people",
        body: "Every stage became an interactive prototype that users tested before any build; registration went through several rounds.",
      },
    ],
    decisions: [
      {
        title: "Two layers of navigation, and no more",
        body: "The old portal buried people in nested pages. A popup system replaced navigation depth, and two layers cover every banking task.",
      },
      {
        title: "Identical across devices, not merely similar",
        body: "The brief asked for similar. Every desktop capability reaches the phone with the same names, in the same order: nothing to relearn on the bus.",
      },
    ],
    // Every capture is a presentation artboard that already contains its own
    // tablet, phone or isometric board, so they render as flat cards: a browser
    // window around a tablet would be a frame inside a frame.
    galleryKind: "plain",
    // Ordered show-first: the portal home is the cover, the phone and the
    // accounts screen follow it, then the system, then the flow behind it.
    gallery: [
      {
        src: "/work/banco-de-occidente/portal-dashboard.webp",
        width: 2271,
        height: 1715,
        alt: "The Banco de Occidente transactional portal on a tablet: a left sidebar with the customer's name and benefit tier, cards for a Mastercard and a savings account with their balances, a favourite-transactions row, a month calendar and a spending chart.",
        caption: "The portal home: products, favourite transactions, the month at a glance.",
      },
      {
        src: "/work/banco-de-occidente/responsive-mobile.webp",
        width: 1510,
        height: 1461,
        alt: "Two iPhone screens side by side: a Mastercard Black detail with minimum payment, total payment and due date above a Pay button, and the movements tab listing card purchases with dates, instalment counts and amounts.",
        caption: "On a phone: every desktop capability, in the same order.",
      },
      {
        src: "/work/banco-de-occidente/products-and-cards.webp",
        width: 1784,
        height: 1218,
        alt: "The accounts section of the portal on a tablet: a savings account card showing available, redeemable and current balances, a filterable movements table listing purchases and transfers with amounts, and a success toast confirming a chequebook has been blocked.",
        caption: "Balances, movements, and proof the block worked.",
      },
      {
        src: "/work/banco-de-occidente/login-registration.webp",
        width: 1784,
        height: 1218,
        alt: "The portal's login screen on a tablet: a cookie notice across the top, a promotional panel on the left, and a sign-in card asking for document type, document number and password, with links to recover a password and to register.",
        caption: "Login, with nothing to distract mid-task.",
      },
      {
        src: "/work/banco-de-occidente/design-system-foundations.webp",
        width: 2033,
        height: 2340,
        alt: "Design system foundation boards laid out in perspective: a colour scale from light to dark blue with neutral and gold secondaries, a type scale from hero down to caption, a spacing scale, and sheets of button and form-field states.",
        caption: "Foundations: colour, type, spacing, every state of every control.",
      },
      {
        src: "/work/banco-de-occidente/design-system-grid.webp",
        width: 1786,
        height: 795,
        alt: "The Velocity design system index, five columns wide: Documentation, Foundations, Atoms, Molecules and Organisms, listing basics, naming rules, writing principles, grids, spacing, colours, typography, buttons, inputs, controls, icons, fields, dropdowns, lists, tables, headers, forms, modals, date picker and tab navigation.",
        caption: "Velocity, indexed the way the front end is built.",
      },
      {
        src: "/work/banco-de-occidente/illustrated-icons.webp",
        width: 1203,
        height: 709,
        alt: "Fifteen illustrated icons in blue and green line art: a statement, a credit score, a certificate, a scheduled document, a location pin, stacked coins, a piggy bank, a phone payment, a phone message, a phone with a plus, a protected phone, a phone with a fingerprint, a failed transaction, a house, and a browser window.",
        caption: "Fifteen icons drawn for the system, not licensed.",
      },
      {
        src: "/work/banco-de-occidente/popups-system.webp",
        width: 1569,
        height: 804,
        alt: "The popup system drawn as four stacked planes in perspective, labelled from the back: the page, a blurred background, the component, and the popup itself.",
        caption: "Depth instead of nesting: two layers, every task.",
      },
      {
        src: "/work/banco-de-occidente/user-flow-login-otp.webp",
        width: 1965,
        height: 1053,
        alt: "The registration and one-time-password flow diagrammed as boxes and arrows: register, enter document type and ID, send a one-time password, enter it or request another by SMS, accept the data-processing agreement, then either a successful login or a validation failure.",
        caption: "Registration, mapped with its exceptions before any screen.",
      },
    ],
    links: [
      // ⚠️ CONFIRMAR DOUG — the URL returns HTTP 200, but a headless load stops
      // at Figma's loading screen, which proves the URL resolves and nothing
      // more. Open it in a private window before shipping; drop the entry if it
      // asks a logged-out visitor to sign in.
      {
        label: "Interactive prototype (Figma)",
        href: "https://www.figma.com/proto/0r3LsQkQBzD8BM6Qr9hRgI/BDO-Web-Page?page-id=239%3A20692&node-id=239%3A20693",
      },
      {
        label: "Case on Behance",
        href: "https://www.behance.net/gallery/143620441/UI-Portal-Bancario-Banco-de-Occidente",
      },
    ],
    // No individual is named. The published piece lists five other people in a
    // Roles table; none of them appear anywhere in this repo.
    credits:
      "Design system, art direction and UI design: mine. Product ownership and UX research sat with the bank's and the lab's teams. Published by **Aval Digital Labs**, Colombia, 2022.",
    technologies: ["Figma", "Sketch", "Atomic design", "Design tokens", "InVision", "Prototyping"],
    // `externalLink` removed: adldigitallab.com is the employer's corporate site
    // and adds nothing to the work. The two `links` above are the destinations.
  },
  {
    slug: "dc-medical",
    num: "/05",
    project: "DC Medical Aesthetics",
    category: "Clinic Operations × Design Engineering",
    roleOverride: "Product designer and design engineer — end to end",
    yearOverride: "2026",
    clientOverride: "DC Medical Aesthetics",
    duration: "Live since Sep 21, 2026 — still shipping",
    team: "Solo — product, design, code",
    kind: "personal",
    tagline:
      "A clinic that ran on WhatsApp, a calendar and a shared drive, now run from one panel on the secretary's phone — and no procedure starts before it is paid for.",
    impact:
      "Two weeks from the first commit to the version the clinic runs today: one panel where every patient has a phase, a balance and a next step, built on the clinic's own Drive and Calendar — and a procedure only gets its green light once the payment, the receipt and the signed consent are in.",
    context:
      "An aesthetic-medicine clinic in Barranquilla whose doctor also sees patients in rented rooms in Bogotá and Medellín. A secretary who schedules, advises and sells over WhatsApp, a Google Calendar, and a shared Drive holding the money, the consents and the clinical histories. Everything was already written down; nothing was connected — least of all what a patient still owed.",
    contributions: [
      "**A plan attacked before it was built** — the first plan went through an adversarial review on three fronts, data, security and feasibility, and only its third version reached code.",
      "**The patient case as three locked phases** — valuation, payment, procedure. Each unlocks the next, and the green light for a procedure appears only once the full payment, its receipt and the signed consent are in.",
      "**One file, two runtimes, and a phone app** — the same dashboard runs as a read-only Claude artifact and as a web panel behind a Cloudflare Worker with a login per person, and installs on the secretary's iPhone as an app.",
      "**Rules as tested functions** — balances, card fees, dates and the name matching that reconciles one patient spelled three ways, covered by twelve test suites, from pure functions to a real browser at phone width.",
    ],
    kpis: [
      // First commit 2026-09-19, agenda by city released 2026-10-02 — both
      // read off the dc-medical-dashboard history on 2026-10-06.
      { value: "14", label: "Days, first commit to today's version", delta: "Sep 19 → Oct 2, 2026" },
      { value: "3", label: "Phases with locks", delta: "valuation, payment, procedure" },
      { value: "0", label: "New databases", delta: "Drive and Calendar stay the source of truth" },
      // 12 `test:*` scripts in the repo's package.json, verified 2026-10-06.
      { value: "12", label: "Test suites", delta: "domain, ledger, worker, browser" },
    ],
    process: [
      {
        phase: "01",
        title: "The clinic already had a system — it just wasn't software",
        body: "Before writing anything I mapped what actually happens. A patient writes on WhatsApp; the secretary books the valuation in Google Calendar; the doctor sets the price after seeing her; the deposit goes into an accounting sheet; the consent is a document in a Drive folder; the follow-up happens 45 days after the procedure. None of it was wrong. It was spread across four tools that never spoke to each other, so the question that runs the clinic — what does this patient owe, and what is missing before Thursday? — took ten minutes of opening files.",
      },
      {
        phase: "02",
        title: "A plan that had to survive an attack first",
        body: "The first plan was not built; it was attacked. A review on three fronts — data, security and feasibility — found the traps the sheets hide: one row per payment, so adding up the pending column counts a debt again with every deposit; patient folders spelled two different ways; formulas already sitting in rows the panel must never overwrite. The third version is the one that reached code, with the business decisions written into it: one login per person, a minimum deposit of half the price, and an exception down to thirty per cent only with the doctor's authorization, logged where he can read it.",
      },
      {
        phase: "03",
        title: "Read first, write later",
        body: "Version one could not write at all. It ran as a Claude artifact that read Drive and Calendar through connectors, which made it safe to put in front of the clinic on day one. Version two is the same file behind a Cloudflare Worker, with a login per person and a Google Apps Script holding the only credentials that touch the real sheets. Before it went live on September 21, the books from June to September were reconciled against the annual accounting file, and all three layers went through a security audit.",
      },
      {
        phase: "04",
        title: "The phone rewrote the interface",
        body: "Then the panel met its real user. The secretary runs the clinic from an iPhone, often from the car, so the second week went to the phone: the panel installs as an app, tables become cards, the patient sheet slides up from the bottom, every tap target is at least 44 pixels and no field zooms the page. The voice note came out of the same week — she says what happened, the model fills in the new-patient form, and nothing is saved until she has checked it.",
      },
      {
        phase: "05",
        title: "Real money brought its own rules",
        body: "A week of real payments produced rules no plan had. A credit card lands at 95 per cent, because the clinic passes the card fee on to the patient. The valuation counts inside the price. A payment can be registered before its receipt exists, and stays flagged until the receipt is uploaded. A case whose procedure date has passed with money still owed stays open and says so. Each one came out of real payments and became a rule the panel enforces.",
      },
      {
        phase: "06",
        title: "The clinic started asking for things",
        body: "By the second week the requests came from the clinic. The doctor's availability is now read from the document the secretary already writes, as a week of red and green slots she copies straight into WhatsApp. The agenda shows every day by city, because the doctor works in three. A control can move when the doctor brings it forward for a medical reason, with the reason in the log. Each person gets their own permissions, area by area. Most requests shipped within a day of being asked for; the agenda by city, the latest, went out on October 2.",
      },
    ],
    decisions: [
      {
        title: "The spreadsheet stays the source of truth",
        body: "The obvious build was a database with a real schema. I did not do it. The person who keeps the accounting works in Drive every day and would have had to abandon her tool for mine, and the clinic would have been left depending on me to keep the lights on. Reading the sheets instead means the panel can be switched off tomorrow and the clinic loses nothing: it still has every number, in the files it already knows.",
      },
      {
        title: "Balances are read, not summed",
        body: "Each row of income is one payment, and it carries the balance left after it — so adding up the pending column counts the same debt again with every deposit. An early version did exactly that and reported a phantom balance of thirty-eight million pesos. The fix is one line: a patient's balance is the one on her most recent row. The test that proves it is the one I would keep if I had to delete every other test in the repo.",
      },
      {
        title: "Nothing is written without a person confirming it",
        body: "A voice note, a photographed receipt, a supplier's invoice: the model reads all of them, and none of them is written until a person has checked the form it filled. It costs a click. It is also why the AI is usable at all: a model that silently miscategorises an expense is worse than typing, because the error is now invisible.",
      },
      {
        title: "One accent, and only for what you can press",
        body: "After a week of daily use the interface was redesigned: Inter throughout, a lighter canvas, white cards without borders, and a single indigo kept for what is actionable — the primary button, the active tab, the active filter. Status colours never stack on top of it, and no text drops below 4.5:1. On a screen where payments, alerts and cities all compete, the one colour that means press here has to mean only that.",
      },
      {
        title: "A colour per city, never on its own",
        body: "The doctor works in three cities, so the agenda gives each one a colour — orange for Barranquilla, blue for Bogotá, teal for Medellín — checked for colour blindness with every pair side by side. And the colour never carries the city alone: the name always sits beside its dot, and the filter chips double as the legend, so nobody has to tell teal from blue to know where the doctor is.",
      },
    ],
    featuresIntro:
      "The panel is one board with the clinic's day on it — on a laptop at the front desk or on a phone in a car. These are the pieces that carry the most weight.",
    features: [
      {
        title: "A voice note that fills the form",
        body: "Say who came in, from where, for what, what she paid and when the appointment is. The model fills the new-patient form, lists what it could not place, and leaves the payments as reminders on the case — nothing is saved until a person checks it.",
        kind: "ai",
      },
      {
        title: "Phases with locks",
        body: "Each phase lists what is missing and links straight to the form that clears it. The footer always names the next step, so the panel answers \"what do I do now\" without anyone having to remember the protocol.",
        kind: "product",
      },
      {
        title: "The agenda, by city",
        body: "List, day and month views of the clinic's Google Calendar, each appointment coloured by the city it happens in — written in the appointment, taken from the patient's record, or inferred from where the doctor is that day — and each one says which.",
        kind: "product",
      },
      {
        title: "The doctor's slots, ready to send",
        body: "The availability the secretary keeps in a document becomes a week of red and green slots, with a warning for any day that lands in two cities at once, and copies into WhatsApp as the message she already sends.",
        kind: "product",
      },
      {
        title: "Receipts and invoices read by AI",
        body: "Photograph a payment receipt, a supplier invoice or a stack of travel expenses and the values come back filled in for review — supplies land in the inventory, expenses in the month's accounting.",
        kind: "ai",
      },
      {
        title: "Who can do what",
        body: "Users and permissions per area — agenda, patients, payments, accounting, inventory — deciding, area by area, what a person can see and what they can change. The secretary runs the day, the doctor reads it, and everything written lands in an activity log with who did it.",
        kind: "product",
      },
    ],
    galleryKind: "browser",
    // The walkthrough is the phone, the stills are the desk: the secretary
    // runs the clinic from both, and the phone is where the voice note lives.
    videoKind: "phone",
    video: {
      webm: "/work/dc-medical/nota-de-voz.webm",
      mp4: "/work/dc-medical/nota-de-voz.mp4",
      poster: "/work/dc-medical/nota-de-voz-poster.jpg",
      label:
        "On the phone: a voice note fills the new-patient form, the valuation takes a free hour from the clinic's calendar, and saving opens the case on phase one",
      caption:
        "From the secretary's phone: one note describes a new patient, and the form comes back filled — name, WhatsApp, city, procedure, and the valuation already paid. The hour comes from the clinic's calendar, and saving opens the case on phase one with the dictated payment waiting for its receipt. Recorded against the local demo, which stands in for the model with simple rules, on seeded data; the note is typed for the recording, where on her phone it is spoken.",
      width: 786,
      height: 1704,
    },
    gallery: [
      {
        src: "/work/dc-medical/agenda-mes.webp",
        alt: "The agenda in month view: September 2026 laid out Monday to Sunday, each day's appointments as short lines coloured by city — orange for Barranquilla, blue for Bogotá, teal for Medellín — with a coloured band over the days the doctor spends in each city, and a count of appointments per city above the grid.",
        caption: "A month of appointments, coloured by the city each one happens in.",
      },
      {
        src: "/work/dc-medical/caso-fases.webp",
        alt: "A patient's case sheet open over the cases list: a three-step tracker with valuation and payment done and the procedure current, the procedure set at four vials for face and neck, the procedure date booked, a payment bar at 5.3 of 9.8 million pesos, the case's payments newest first, and a footer naming the next step — register the final payment.",
        caption: "The case: what is paid, what is missing, and the one action that comes next.",
      },
      {
        src: "/work/dc-medical/seguimiento-controles.webp",
        alt: "The follow-up board: counters for valuations, procedures, controls to reschedule, this week, the next 30 days and controls with no date; tabs for valuations, procedures, controls, agenda, slots and balances owed; city filters; and a table of 45-day controls, each with the days left, its status and a WhatsApp button.",
        caption: "The day, counted: who is due, who has no appointment yet, and who slipped.",
      },
      {
        src: "/work/dc-medical/agenda-dia.webp",
        alt: "The agenda in day view for Thursday, 24 September: a banner saying the doctor is in Medellín according to the calendar, appointments as cards by the hour with their type and city, a red line marking the current time, and patient-record and calendar buttons on each card.",
        caption: "One day by the hour — with a line for now, and where the doctor is.",
      },
      {
        src: "/work/dc-medical/cupos-semana.webp",
        alt: "The doctor's slots for the week of 5 to 11 October: seven columns, each headed by the city the doctor is in, with hours marked occupied in red or free in green, a count of free hours over the next two months, and a button to copy two months of slots for WhatsApp.",
        caption: "The doctor's availability, read from the document the secretary already keeps.",
      },
      {
        src: "/work/dc-medical/usuarios-permisos.webp",
        alt: "Editing a user in Users and permissions: the doctor's account set to view only, with toggles to see, create and edit per area — and to delete, for patients and cases — across agenda and follow-up, patients and cases, and patient payments, under presets for running the day, viewing only, and nothing.",
        caption: "Who sees what, area by area: the doctor reads, the secretary runs the day.",
      },
    ],
    // The live panel, which is a sign-in page by design: it is the clinic's
    // internal tool and holds patient data. The label says so, so nobody
    // clicks through expecting a demo. Went live 2026-09-21.
    externalLink: {
      label: "Live panel — staff sign-in",
      href: "https://panel.dcmedicalaesthetics.com/login",
    },
    technologies: [
      "Product Strategy",
      "HTML & Vanilla JS",
      "Tailwind CSS",
      "Cloudflare Workers",
      "Google Apps Script",
      "Google Drive & Calendar",
      "Claude (API & MCP)",
      "PWA",
      "Playwright",
      "node --test",
    ],
    credits:
      "I co-own the clinic with the doctor and built this end to end — product decisions, interface and code, AI in the loop. The doctor owns the medical protocol the phases encode; the clinic's secretary is the daily user, and the flows are shaped by watching her use them, at the desk and on her phone. Screens and walkthrough are recorded against seeded demo data with invented names: no patient information, and no figure from the clinic's books, appears anywhere in this case.",
  },
  {
    slug: "royal-caribbean",
    num: "/06",
    experienceId: "globant",
    testimonialId: "nicolas",
    project: "Royal Caribbean Cruises",
    category: "Travel × Mobile",
    duration: "1 year",
    team: "Cross-functional US + LATAM",
    kind: "client",
    tagline:
      "Mobile booking and onboard experiences for Royal Caribbean guests on Caribbean and Mediterranean routes.",
    impact:
      "One mobile journey from booking to disembarkation — schedules, dining, excursions, balances — that holds up on a ship's patchy Wi-Fi.",
    context:
      "Cruise guests of every age and comfort level spend a week aboard on patchy connectivity. I designed booking and the onboard experience to work for all of them.",
    contributions: [
      "**Mobile booking** — flows across destinations and stateroom types.",
      "**Onboard experience** — schedules, dining, excursions and balances that work on intermittent Wi-Fi.",
      "**Remote collaboration** — with US product and engineering at Royal Caribbean HQ.",
    ],
    kpis: [
      { value: "2", label: "Fleets & regions", delta: "Caribbean + Med" },
      { value: "End-to-end", label: "Guest journey" },
      { value: "Offline", label: "Resilient at sea" },
    ],
    technologies: ["Sketch", "iOS", "Android", "Prototyping", "Cross-cultural collaboration"],
    externalLink: { label: "Visit globant.com", href: "https://www.globant.com" },
  },
  {
    slug: "qrvey",
    num: "/07",
    experienceId: "qrvey",
    testimonialId: "arman",
    project: "Qrvey — AutomatiQ",
    category: "SaaS × Survey & NPS × Automation",
    duration: "11 months",
    team: "Product + Engineering",
    kind: "client",
    tagline:
      "A survey automation builder — trigger, condition, action — for people who had never drawn a flow chart.",
    impact:
      "A bad answer could answer itself: a follow-up survey a week later, and the results in the right inbox, with nobody watching.",
    context:
      "Qrvey was a survey and NPS platform; someone still had to act on the answers. As lead UI designer, I designed AutomatiQ, the builder that did.",
    contributions: [
      "**A list that reports on itself** — every process shows status, surveys covered, average cycle time and cycles run.",
      "**Cards, not a canvas** — triggers and conditions open in place, in the product's words; no connectors to draw.",
      "**The follow-up is the next survey** — emails carry the results and a live survey link in the body.",
    ],
    // No KPIs. Nothing here was ever measured in a figure I can source, and
    // three words in number slots ("Charts", "Embedded", "Native") were worse
    // than none.
    // Ordered show-first: the process list is the cover, the condition editor
    // (trigger, condition and action slot in one frame) comes next, then the
    // parts in the order a process is built, then the whole scenario.
    gallery: [
      {
        src: "/work/qrvey/process-list.webp",
        alt: "The Automation tab of Qrvey: a Create Process button over a list of process cards, each with a coloured status bar reading Running or Paused, its name and creation date, and three figures — surveys covered, average time and cycles run. A sidebar offers example surveys and tips.",
        caption: "Each process: running or paused, and what it has done.",
        width: 2000,
        height: 1438,
      },
      {
        src: "/work/qrvey/condition-branching.webp",
        alt: "A condition under a New Response trigger: two pills, If Answer Is and Number of Responses, above a panel holding a question and its answer rows with buttons to add or remove each one, and a Select Action row waiting underneath.",
        caption: "Conditions in the product's words: \"if answer is\", \"number of responses\".",
        width: 2000,
        height: 1200,
      },
      {
        src: "/work/qrvey/trigger-scheduling.webp",
        alt: "An expanded Scheduling trigger card: repeat frequency, an interval in days and a time of day, a start date, and an end that is either a number of runs or a specific date.",
        caption: "Scheduling, with both ways a schedule can end.",
        width: 2000,
        height: 682,
      },
      {
        src: "/work/qrvey/trigger-new-response.webp",
        alt: "A New Response trigger with its survey picker open: a searchable list of surveys, each row carrying an Active or Draft badge and the date it went active.",
        caption: "Picking the survey whose responses start the process.",
        width: 2000,
        height: 583,
      },
      {
        src: "/work/qrvey/action-send-email.webp",
        alt: "The Send Email action open: recipient chips, a subject with a remaining-character count, a rich-text message with buttons to attach results or insert a survey, a survey link inserted into the body, and an attachment block holding the chosen survey.",
        caption: "Email: results attached, a survey in the body.",
        width: 2000,
        height: 1040,
      },
      {
        src: "/work/qrvey/scenario-end-to-end.webp",
        alt: "A whole process assembled from one scenario written in plain language at the top: a new-response trigger, a condition on the answer given, and two email actions — one to the respondent with a follow-up survey, one to the team with the results — above a Save Changes button warning that saving resets the process.",
        caption: "One scenario: trigger, condition, two actions.",
        width: 2000,
        height: 3543,
      },
    ],
    galleryKind: "plain",
    technologies: ["Sketch", "Design Systems", "Interaction Design", "Data Viz"],
    externalLink: { label: "Visit qrvey.com", href: "https://www.qrvey.com" },
  },
  {
    slug: "ideaware",
    num: "/08",
    experienceId: "ideaware",
    project: "Multi-client UX Design",
    category: "Agency × Multi-client",
    duration: "1 year",
    team: "Distributed agency",
    kind: "client",
    tagline:
      "Wireframes, UI kits and prototypes for US and LATAM clients, across web and mobile.",
    impact:
      "Developer-ready design across fintech, marketplaces and B2B — the multi-domain fluency that later made systems work feel natural.",
    context:
      "A remote-first agency, where the job was learning a client's domain fast and shipping clean design.",
    contributions: [
      "**Wireframes and UI kits** — for fintech, consumer and B2B products.",
      "**High-fidelity prototypes** — for stakeholder validation and developer handoff.",
      "**Reusable patterns** — applied across clients and tailored to each.",
    ],
    // "Dev-ready" is gone from the cards: it is one of the draft placeholder
    // values the content suite bans. The claim itself lives in `impact`.
    kpis: [
      { value: "Agency", label: "A new domain each engagement" },
      { value: "US + LATAM", label: "Distributed clients" },
    ],
    technologies: ["Sketch", "InVision", "Wireframing", "Prototyping"],
    externalLink: { label: "Visit ideaware.co", href: "https://www.ideaware.co" },
  },
  {
    slug: "chub",
    num: "/09",
    project: "Chub",
    category: "iOS × Mobility",
    kind: "side",
    clientOverride: "Freelance side project",
    roleOverride: "Product designer — end to end",
    yearOverride: "2018",
    duration: "2018",
    team: "Me and the dev team, through handoff",
    // ⚠️ CONFIRMAR DOUG — Doug calls it "Chupp"; the splash screen's wordmark
    // reads CHUB. Going with the artwork, since that is what a reader sees.
    tagline:
      "Book a car by the minute, see the cost up front, then control the cabin.",
    impact:
      "A booking flow that answers what rental apps usually hide — what the car is, what the trip costs — before you commit.",
    // ⚠️ CONFIRMAR DOUG — Doug described it as "an app for requesting services,
    // Uber-style", but no screen has a driver: pricing is per minute, the
    // vehicle sheet leads with range and acceleration, and one screen is the
    // car's own dashboard. Written as what the screens show.
    context:
      "Chub books a car, not a ride: pick a vehicle, see its range and per-minute rate, and once the trip starts the app becomes the cabin's controls.",
    contributions: [
      "**The decision on one card** — range, acceleration, seats and the per-minute rate, above the button.",
      "**Cost up front** — pickup, destination, estimated time and a fare range, before the trip starts.",
      "**The app becomes the car** — mid-trip it runs climate and ventilated seats, and shows temperature and speed.",
    ],
    // Ordered show-first: the vehicle sheet is the cover — the car, its specs
    // and its price in one frame — then the trip in the order it happens.
    gallery: [
      {
        src: "/work/chub/vehicle.webp",
        alt: "A vehicle sheet over the map: the model name with its rating, a spec row for acceleration, range and seats, its pick-up address and distance, the saved card, a per-minute price, and a Book Car button.",
        caption: "Range, rate and distance before the button.",
      },
      {
        src: "/work/chub/route.webp",
        alt: "The route drawn across a dark map with a distance marker, and a panel below carrying the pick-up and destination, the service class, a fare range, the estimated trip time, the saved card and a Need Assistance button.",
        caption: "Priced and timed before it starts.",
      },
      {
        src: "/work/chub/cabin.webp",
        alt: "The in-car panel: chips for air conditioning and ventilated seats, inside and outside temperature, a circular gauge reading 65 km/h with the gear selector around it, and a line saying the air conditioning is on.",
        caption: "Under way, the app is the cabin.",
      },
      {
        src: "/work/chub/onboarding.webp",
        alt: "Chub's first run screen: the wordmark over a car rendered on a glowing ring, the line \"Choose a Vehicle and trip with style\", and Get started above a Skip link.",
        caption: "First run: the product in one screen.",
      },
    ],
    galleryKind: "phone",
    technologies: ["Sketch", "iOS", "Prototyping", "Developer handoff"],
    credits:
      "Product design end to end, handed off to the development team that built it. Never released.",
  },
  {
    slug: "makeappet",
    num: "/10",
    project: "MakeAppet",
    category: "iOS × Pet adoption",
    kind: "side",
    clientOverride: "Freelance side project",
    roleOverride: "Product designer — end to end",
    yearOverride: "2018",
    duration: "2018",
    team: "Me and the dev team, through handoff",
    tagline:
      "Swipe to meet a dog or cat nearby: the dating pattern everyone knows, pointed at adoption.",
    impact:
      "Adoption borrowed the one interaction everyone already knows, and put the shelters' donation ask where the attention already was.",
    context:
      "MakeAppet applies swipe-to-match to finding a pet nearby: browse by species, swipe through what is close, and open a full profile before deciding.",
    contributions: [
      "**Nobody adopts from a photo** — a tap deeper, the profile adds breed, weight, sex and a description.",
      "**Two ways in** — swipe to browse, or filter by species and distance when you know what you want.",
      "**The shelter ask where people look** — a donation panel between search and results, not buried in a menu.",
    ],
    // Ordered show-first: the swipe card is the cover — the pattern reads in
    // one glance — then the profile and the match it leads to, then the grid.
    gallery: [
      {
        src: "/work/makeappet/swipe.webp",
        alt: "The swipe screen: For you and Nearby tabs above a full-bleed photo card of a dog with its name, age and distance, and round dismiss and like buttons below it.",
        caption: "The pattern everyone already knows, unchanged.",
      },
      {
        src: "/work/makeappet/profile.webp",
        alt: "A pet profile: a large photograph, the name and distance, a four-cell grid of age, breed, sex and weight, a written description, and a primary Bark me button beside a favourite button.",
        caption: "What a photo cannot carry.",
      },
      {
        src: "/work/makeappet/match.webp",
        alt: "The match screen: a Congratulations heading with an It's a Match ribbon, the two matched pets either side of a heart, a suggested opening line, and a Say woof button above a Not now link.",
        caption: "A match, and something to say.",
      },
      {
        src: "/work/makeappet/browse.webp",
        alt: "The browse screen: a location and a search field with filters, a violet panel asking for a donation on behalf of shelters, then an Adoption section with species tabs and a grid of nearby pets.",
        caption: "Browse by species, the shelters' ask included.",
      },
      {
        src: "/work/makeappet/welcome.webp",
        alt: "The welcome screen: a grid of photographs of dogs and their owners behind a paw mark, the line \"Connect and uncover the ideal pets that match your preferences in your area\", and an Explore button.",
        caption: "The premise, before any sign-up.",
      },
    ],
    galleryKind: "phone",
    technologies: ["Sketch", "iOS", "Prototyping", "Developer handoff"],
    credits:
      "Product design end to end, handed off to the development team that built it. Never released.",
  },
];

/**
 * What a case SAYS, as opposed to what it IS — the part that changes with the
 * language. Lists that pair with media or figures (KPIs, process, features,
 * gallery, links) are matched to the English list by position; `decisions` and
 * `technologies` are free-standing and replace it whole.
 */
export interface CaseCopy {
  project?: string;
  category: string;
  team: string;
  tagline: string;
  impact: string;
  context: string;
  contributions: string[];
  roleOverride?: string;
  clientOverride?: string;
  duration?: string;
  /** `value` only where the digits are written differently ("~1.200", "6 años"). */
  kpis?: { value?: string; label: string; delta?: string }[];
  process?: { title: string; body: string }[];
  decisions?: { title: string; body: string }[];
  featuresIntro?: string;
  features?: { title: string; body: string }[];
  video?: { label: string; caption?: string };
  gallery?: { alt: string; caption?: string }[];
  links?: { label: string }[];
  externalLink?: { label: string };
  credits?: string;
  technologies?: string[];
}

function localize(c: CaseStudy, t: CaseCopy | undefined): CaseStudy {
  if (!t) return c;
  return {
    ...c,
    project: t.project ?? c.project,
    category: t.category,
    team: t.team,
    tagline: t.tagline,
    impact: t.impact,
    context: t.context,
    contributions: t.contributions,
    roleOverride: t.roleOverride ?? c.roleOverride,
    clientOverride: t.clientOverride ?? c.clientOverride,
    duration: t.duration ?? c.duration,
    kpis: c.kpis?.map((k, i) => {
      const tk = t.kpis?.[i];
      return tk ? { value: tk.value ?? k.value, label: tk.label, delta: tk.delta } : k;
    }),
    process: c.process?.map((p, i) => ({ ...p, ...t.process?.[i] })),
    decisions: t.decisions ?? c.decisions,
    featuresIntro: t.featuresIntro ?? c.featuresIntro,
    features: c.features?.map((f, i) => ({ ...f, ...t.features?.[i] })),
    video: c.video && { ...c.video, ...t.video },
    gallery: c.gallery?.map((g, i) => ({ ...g, ...t.gallery?.[i] })),
    links: c.links?.map((l, i) => ({ ...l, ...t.links?.[i] })),
    externalLink: c.externalLink && { ...c.externalLink, ...t.externalLink },
    credits: t.credits ?? c.credits,
    technologies: t.technologies ?? c.technologies,
  };
}

/** Built once: the Spanish cases are the English ones with their words swapped. */
const caseStudiesEs: CaseStudy[] = caseStudies.map((c) => localize(c, workEs[c.slug]));

/**
 * The cases in one language. English returns `caseStudies` itself — the live
 * array, not a copy — so a test that edits it sees its edit.
 */
export function getCaseStudies(locale: Locale = "en"): CaseStudy[] {
  return locale === "es" ? caseStudiesEs : caseStudies;
}

export function getCaseStudy(slug: string, locale: Locale = "en"): CaseStudy | undefined {
  return getCaseStudies(locale).find((c) => c.slug === slug);
}

export function getNextCaseStudy(slug: string, locale: Locale = "en"): CaseStudy {
  const list = getCaseStudies(locale);
  const idx = list.findIndex((c) => c.slug === slug);
  return list[(idx + 1) % list.length];
}

export interface CaseMeta {
  client: string;
  role: string;
  /** Formatted span: "Nov 2018 — 2024". */
  year: string;
  /** The same string, named for a timeline context. */
  period: string;
  team: string;
  duration: string;
  location?: string;
}

/** What the meta strip calls the client of a product Doug made for himself. */
const PERSONAL_PRODUCT: Record<Locale, string> = { en: "Personal product", es: "Producto propio" };

/**
 * Client, role and period for a case, derived from the employer in `cv.ts`.
 * Lives here rather than in `career.ts` so the import direction stays
 * `career.ts → cv.ts` and `work.ts → cv.ts + career.ts` — no cycle.
 *
 * Throws on an unknown slug, and on a personal case missing its overrides:
 * a typo must fail the build, not render blank.
 */
export function getCaseMeta(slug: string, locale: Locale = "en"): CaseMeta {
  const c = getCaseStudy(slug, locale);
  if (!c) throw new Error(`Unknown case study slug: "${slug}".`);

  if (!c.experienceId) {
    if (!c.roleOverride || !c.yearOverride || !c.duration) {
      throw new Error(
        `Case "${slug}" has no experienceId, so it must declare roleOverride, yearOverride and duration.`,
      );
    }
    return {
      client: c.clientOverride ?? PERSONAL_PRODUCT[locale],
      role: c.roleOverride,
      year: c.yearOverride,
      period: c.yearOverride,
      team: c.team,
      duration: c.duration,
    };
  }

  const exp = getCv(locale).experiences.find((e) => e.id === c.experienceId);
  if (!exp) throw new Error(`Unknown experience id: "${c.experienceId}".`);
  const period = c.yearOverride ?? formatPeriod(exp, locale);

  return {
    client: exp.client ?? exp.company.name,
    role: c.roleOverride ?? exp.role,
    year: period,
    period,
    team: c.team,
    duration: c.duration ?? period,
    location: formatLocation(exp),
  };
}
