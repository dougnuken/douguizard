import { type ExperienceId } from "@/data/cv";
import { formatLocation, formatPeriod, getExperience } from "@/lib/career";

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
      "Technical lead on the design system behind Mercadolibre, across 18 countries.",
    impact:
      "One library, maintained for iOS, Android and Web, that 400+ designers and 2,000+ engineers build the same product out of.",
    context:
      "Andes is the source of truth for Mercadolibre's commerce, fintech and shipping products. I owned foundations and component definitions, kept the three platforms in parity, and brought AI into how the system audits itself.",
    contributions: [
      "**Foundational definitions** — tokens, spacing, type and motion, agreed once and governing the product suite.",
      "**Cross-platform parity** — one component API, shipped the same on iOS, Android and Web, worked out directly with the engineering teams that build it.",
      "**Component maintenance at scale** — additions, deprecations and migrations across a library hundreds of designers open every day.",
      "**AI inside the systems practice** — prompt-driven audits that catch drift in Figma before it reaches a release.",
    ],
    // "~40% fewer rework cycles" is REMOVED: no source behind it. Its
    // qualitative replacement lives in `context` ("the three platforms in
    // parity"). Reinstate a number only against a real measurement.
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
      "The transactional portal for one of Colombia's largest banks, and Velocity — the design system that kept it consistent across twelve squads.",
    impact:
      "An outdated, overloaded banking portal rebuilt as one light, legible product — and a documented design system that made the next screen cheaper than the last.",
    context:
      "Banco de Occidente's digital banking was visually dense and hard to move through, and every squad solved the same problems differently. I redesigned the transactional portal and built Velocity, the bank's design system, as the official gatekeeper of what went into it.",
    contributions: [
      "**Redesigned the transactional portal** — login and registration, accounts and cards, transfers, payments and product blocking, for desktop, tablet and mobile.",
      "**Built Velocity, the bank's design system** — documentation, foundations, atoms, molecules and organisms, on atomic-design principles so the front end could mirror the structure.",
      "**Design System Gatekeeper** — approved additions, deprecations and patterns across 12+ product squads, and ran the workshops and crits that taught the system.",
      "**Drew the illustrated icon set** — 15 mini-illustrations that give the whole product a recognizable character instead of a generic glyph library.",
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
        title: "Discovery, then research",
        body: "To build the thing you have to understand the business first. We ran discovery with the client and the stakeholders, then competitive and user research — days spent on the business model, the requirements, and who was actually going to use this.",
      },
      {
        phase: "02",
        title: "Flows before screens",
        body: "We mapped the system's behaviour for each use case before drawing anything: login and registration, payments, enabling and disabling services, transfers, sending and requesting, blocking a product. Six flows, with their exceptions and their error states, because in banking the exception is the product.",
      },
      {
        phase: "03",
        title: "Interactive wireframes, tested on people",
        body: "Every stage went to an interactive prototype before it went to visual design. It let the team and the client see how the product would actually work, and it let us run user testing without paying for a full build first. The registration flow went through several rounds on the back of that feedback.",
      },
      {
        phase: "04",
        title: "A system, not a set of screens",
        body: "Large products cannot scale without one. Velocity documents foundations, atoms, molecules and organisms so designers across digital products, marketing and engineering stay in sync. I followed atomic design deliberately, because the same structure survives the handoff into the front end.",
      },
    ],
    decisions: [
      {
        title: "Atomic design, because the front end thinks that way too",
        body: "A design system can be organized any number of ways. I chose atoms, molecules and organisms because that structure survives the crossing into code — engineers were building components at the same granularity, so documentation and implementation could share one vocabulary instead of translating.",
      },
      {
        title: "Two layers of navigation, and no more",
        body: "The old portal buried people in nested page trees. I replaced navigation depth with a popup system: page, then a blurred background, then the component, then the popup. Two layers is enough for every banking task in the product, and nobody gets lost in something two layers deep.",
      },
      {
        title: "Identical across devices, not merely similar",
        body: "The brief asked for a similar experience on desktop, tablet and mobile. We targeted identical instead. Every desktop capability survives to the phone with the same names in the same order, because a customer who learns the portal on a laptop should not have to relearn it on the bus.",
      },
    ],
    // Every capture is a presentation artboard that already contains its own
    // tablet, phone or isometric board, so they render as flat cards: a browser
    // window around a tablet would be a frame inside a frame.
    galleryKind: "plain",
    gallery: [
      {
        src: "/work/banco-de-occidente/portal-dashboard.webp",
        width: 2271,
        height: 1715,
        alt: "The Banco de Occidente transactional portal on a tablet: a left sidebar with the customer's name and benefit tier, cards for a Mastercard and a savings account with their balances, a favourite-transactions row, a month calendar and a spending chart.",
        caption: "The portal home: products, favourite transactions and the month at a glance.",
      },
      {
        src: "/work/banco-de-occidente/login-registration.webp",
        width: 1784,
        height: 1218,
        alt: "The portal's login screen on a tablet: a cookie notice across the top, a promotional panel on the left, and a sign-in card asking for document type, document number and password, with links to recover a password and to register.",
        caption: "Login and registration, stripped of anything that could distract mid-task.",
      },
      {
        src: "/work/banco-de-occidente/user-flow-login-otp.webp",
        width: 1965,
        height: 1053,
        alt: "The registration and one-time-password flow diagrammed as boxes and arrows: register, enter document type and ID, send a one-time password, enter it or request another by SMS, accept the data-processing agreement, then either a successful login or a validation failure.",
        caption: "One of six flows mapped before any screen existed, exceptions included.",
      },
      {
        src: "/work/banco-de-occidente/design-system-grid.webp",
        width: 1786,
        height: 795,
        alt: "The Velocity design system index, five columns wide: Documentation, Foundations, Atoms, Molecules and Organisms, listing basics, naming rules, writing principles, grids, spacing, colours, typography, buttons, inputs, controls, icons, fields, dropdowns, lists, tables, headers, forms, modals, date picker and tab navigation.",
        caption: "Velocity, indexed the way the front end is built.",
      },
      {
        src: "/work/banco-de-occidente/design-system-foundations.webp",
        width: 2033,
        height: 2340,
        alt: "Design system foundation boards laid out in perspective: a colour scale from light to dark blue with neutral and gold secondaries, a type scale from hero down to caption, a spacing scale, and sheets of button and form-field states.",
        caption: "Foundations: colour, type, spacing and every state of every control.",
      },
      {
        src: "/work/banco-de-occidente/illustrated-icons.webp",
        width: 1203,
        height: 709,
        alt: "Fifteen illustrated icons in blue and green line art: a statement, a credit score, a certificate, a scheduled document, a location pin, stacked coins, a piggy bank, a phone payment, a phone message, a phone with a plus, a protected phone, a phone with a fingerprint, a failed transaction, a house, and a browser window.",
        caption: "Fifteen icons drawn for the system, not licensed into it.",
      },
      {
        src: "/work/banco-de-occidente/products-and-cards.webp",
        width: 1784,
        height: 1218,
        alt: "The accounts section of the portal on a tablet: a savings account card showing available, redeemable and current balances, a filterable movements table listing purchases and transfers with amounts, and a success toast confirming a chequebook has been blocked.",
        caption: "Accounts and cards: balances, movements and the confirmation that the block worked.",
      },
      {
        src: "/work/banco-de-occidente/popups-system.webp",
        width: 1569,
        height: 804,
        alt: "The popup system drawn as four stacked planes in perspective, labelled from the back: the page, a blurred background, the component, and the popup itself.",
        caption: "Depth instead of nesting: two layers cover every task in the product.",
      },
      {
        src: "/work/banco-de-occidente/responsive-mobile.webp",
        width: 1510,
        height: 1461,
        alt: "Two iPhone screens side by side: a Mastercard Black detail with minimum payment, total payment and due date above a Pay button, and the movements tab listing card purchases with dates, instalment counts and amounts.",
        caption: "The same portal on a phone — every desktop capability, in the same order.",
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
    slug: "royal-caribbean",
    num: "/05",
    experienceId: "globant",
    testimonialId: "nicolas",
    project: "Royal Caribbean Cruises",
    category: "Travel × Mobile",
    duration: "1 year",
    team: "Cross-functional US + LATAM",
    kind: "client",
    tagline:
      "Designing onboard guest experiences for Royal Caribbean's fleets across Caribbean and Mediterranean routes.",
    impact:
      "Onboard guest experiences that follow passengers from booking to disembarkation — resilient to life at sea.",
    context:
      "Cruise guests spend a week aboard with patchy connectivity. I designed the booking and onboard experience — schedules, dining, excursions, balances — for guests of every age and comfort level.",
    contributions: [
      "**Mobile booking flows** across destinations and stateroom types.",
      "**Onboard experience** — schedules, dining, excursions and balances that work with intermittent Wi-Fi.",
      "**Remote collaboration** with US product and engineering at Royal Caribbean HQ.",
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
    num: "/06",
    experienceId: "qrvey",
    testimonialId: "arman",
    project: "Qrvey — AutomatiQ",
    category: "SaaS × Survey & NPS × Automation",
    duration: "11 months",
    team: "Product + Engineering",
    kind: "client",
    tagline:
      "An automation builder for survey work: a trigger, a condition, an action — assembled by people who had never drawn a flow chart.",
    impact:
      "A bad answer could answer itself — a follow-up survey a week later, and the result in the right inbox, with nobody watching for it.",
    context:
      "Qrvey was a survey and NPS platform: you built a Qrvey, people took it, and then somebody had to read the answers and do something about them. AutomatiQ was the part that did something. As lead UI designer I designed the builder — the process list, the trigger cards, the condition editor and the actions they fire.",
    contributions: [
      "**A process list that shows whether a process is working** — status, the surveys it covers, average cycle time and how many cycles it has run, on the row itself. A process that had quietly stopped was visible without opening it.",
      "**Triggers as cards, not as a canvas** — scheduling with its own repeat and end rules, or a new response to a chosen survey, each one a card that expands in place. No connectors to draw and nothing to lay out.",
      "**Conditions in the product's own words** — *if answer is* or *number of responses*, over a question and its answers, with rows you add and remove one at a time.",
      "**Actions that reach back into the product** — the email composer attaches the results and drops a live survey link into the body, so the follow-up is the next survey rather than a message about one.",
    ],
    // No KPIs. Nothing here was ever measured in a figure I can source, and
    // three words in number slots ("Charts", "Embedded", "Native") were worse
    // than none.
    gallery: [
      {
        src: "/work/qrvey/process-list.webp",
        alt: "The Automation tab of Qrvey: a Create Process button over a list of process cards, each with a coloured status bar reading Running or Paused, its name and creation date, and three figures — surveys covered, average time and cycles run. A sidebar offers example surveys and tips.",
        caption: "Every process says whether it is running and what it has done.",
        width: 2000,
        height: 1438,
      },
      {
        src: "/work/qrvey/trigger-scheduling.webp",
        alt: "An expanded Scheduling trigger card: repeat frequency, an interval in days and a time of day, a start date, and an end that is either a number of runs or a specific date.",
        caption: "The scheduling trigger, with both ways a schedule can end.",
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
        src: "/work/qrvey/condition-branching.webp",
        alt: "A condition under a New Response trigger: two pills, If Answer Is and Number of Responses, above a panel holding a question and its answer rows with buttons to add or remove each one, and a Select Action row waiting underneath.",
        caption: "The condition editor: a question, its answers, and what comes next.",
        width: 2000,
        height: 1200,
      },
      {
        src: "/work/qrvey/action-send-email.webp",
        alt: "The Send Email action open: recipient chips, a subject with a remaining-character count, a rich-text message with buttons to attach results or insert a survey, a survey link inserted into the body, and an attachment block holding the chosen survey.",
        caption: "The email action, with the results attached and a survey in the body.",
        width: 2000,
        height: 1040,
      },
      {
        src: "/work/qrvey/scenario-end-to-end.webp",
        alt: "A whole process assembled from one scenario written in plain language at the top: a new-response trigger, a condition on the answer given, and two email actions — one to the respondent with a follow-up survey, one to the team with the results — above a Save Changes button warning that saving resets the process.",
        caption: "One scenario, end to end: trigger, condition, and two actions.",
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
    num: "/07",
    experienceId: "ideaware",
    project: "Multi-client UX Design",
    category: "Agency × Multi-client",
    duration: "1 year",
    team: "Distributed agency",
    kind: "client",
    tagline:
      "Designing wireframes, UI kits, and prototypes for international clients across web and mobile.",
    impact:
      "Product design across fintech, marketplaces and B2B — the multi-domain fluency that later made systems work feel natural.",
    context:
      "A remote-first agency serving US and LATAM clients. Each engagement meant learning a new domain fast and shipping clean, developer-ready design.",
    contributions: [
      "**Wireframes & UI kits** across fintech, consumer and B2B products.",
      "**High-fidelity prototypes** for stakeholder validation and developer handoff.",
      "**Reusable patterns** applied and tailored per client.",
    ],
    kpis: [
      { value: "Agency", label: "A new domain each engagement" },
      { value: "US + LATAM", label: "Distributed clients" },
      { value: "Dev-ready", label: "Handoff quality" },
    ],
    technologies: ["Sketch", "InVision", "Wireframing", "Prototyping"],
    externalLink: { label: "Visit ideaware.co", href: "https://www.ideaware.co" },
  },
  {
    slug: "chub",
    num: "/08",
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
      "Book a car by the minute, see what it costs before you commit, and control the cabin once you are in it.",
    impact:
      "A booking flow that answers the two questions a rental app usually hides — what this car is, and what this trip will cost — before you agree to either.",
    // ⚠️ CONFIRMAR DOUG — Doug described it as "an app for requesting services,
    // Uber-style", but no screen has a driver: pricing is per minute, the
    // vehicle sheet leads with range and acceleration, and one screen is the
    // car's own dashboard. Written as what the screens show.
    context:
      "A side project taken on in 2018, alongside the day job. Chub books a car rather than a ride: you pick a vehicle, see its range and what it charges per minute, and the app becomes the cabin's controls once the trip starts. I designed it from scratch and worked alongside the dev team through handoff.",
    contributions: [
      "**The vehicle sheet leads with the decision** — range, acceleration, seats and the per-minute rate on one card, above the button. What a driver needs to choose is not buried behind it.",
      "**The route screen prices the trip before it starts** — pickup, destination, an estimated duration and a fare range, with the card on file already shown, so the last screen holds no surprises.",
      "**The app becomes the car** — once the trip is running the same product turns into a cabin panel: climate, ventilated seats, inside and outside temperature, and the speed.",
      "**Dark by default, one accent** — a violet that only marks what is live: the active route, the selected vehicle, the primary action.",
    ],
    gallery: [
      {
        src: "/work/chub/onboarding.webp",
        alt: "Chub's first run screen: the wordmark over a car rendered on a glowing ring, the line \"Choose a Vehicle and trip with style\", and Get started above a Skip link.",
        caption: "First run: what the product is, in one screen.",
      },
      {
        src: "/work/chub/vehicle.webp",
        alt: "A vehicle sheet over the map: the model name with its rating, a spec row for acceleration, range and seats, its pick-up address and distance, the saved card, a per-minute price, and a Book Car button.",
        caption: "Range, rate and distance before the button, not after it.",
      },
      {
        src: "/work/chub/route.webp",
        alt: "The route drawn across a dark map with a distance marker, and a panel below carrying the pick-up and destination, the service class, a fare range, the estimated trip time, the saved card and a Need Assistance button.",
        caption: "The trip priced and timed before it starts.",
      },
      {
        src: "/work/chub/cabin.webp",
        alt: "The in-car panel: chips for air conditioning and ventilated seats, inside and outside temperature, a circular gauge reading 65 km/h with the gear selector around it, and a line saying the air conditioning is on.",
        caption: "Under way, the app is the cabin.",
      },
    ],
    galleryKind: "phone",
    technologies: ["Sketch", "iOS", "Prototyping", "Developer handoff"],
    credits:
      "Product design end to end — flows, interface and the handoff. Built by a development team I worked alongside. The project ended at handoff; it was never released.",
  },
  {
    slug: "makeappet",
    num: "/09",
    project: "MakeAppet",
    category: "iOS × Pet adoption",
    kind: "side",
    clientOverride: "Freelance side project",
    roleOverride: "Product designer — end to end",
    yearOverride: "2018",
    duration: "2018",
    team: "Me and the dev team, through handoff",
    tagline:
      "Swipe to meet a dog or a cat near you — the pattern people already know, pointed at adoption instead of dating.",
    impact:
      "Adoption borrowed the one interaction everybody already knows how to use, and put a shelter's donation ask where the attention already was.",
    context:
      "A side project from 2018, alongside the day job. MakeAppet applies the swipe-to-match pattern to finding a pet nearby: browse by species, swipe through what is close, and open a full profile before deciding. I designed it from scratch and worked alongside the dev team through handoff.",
    contributions: [
      "**The card carries the decision, the profile carries the detail** — name, age and distance on the card; breed, weight, sex and a written description one tap deeper. Nobody adopts from a photograph alone.",
      "**Two ways in, not one** — a swipe stack for browsing and a filtered grid by species and distance, because half of the people arriving already know whether they want a cat.",
      "**The shelter ask sits in the browse screen** — a donation panel between the search and the results, where the attention already is, instead of behind a menu nobody opens.",
      "**The match screen hands over a first line** — the moment of a match is also the moment of not knowing what to say, so the screen offers the opener rather than an empty field.",
    ],
    gallery: [
      {
        src: "/work/makeappet/welcome.webp",
        alt: "The welcome screen: a grid of photographs of dogs and their owners behind a paw mark, the line \"Connect and uncover the ideal pets that match your preferences in your area\", and an Explore button.",
        caption: "The premise, before any account is asked for.",
      },
      {
        src: "/work/makeappet/swipe.webp",
        alt: "The swipe screen: For you and Nearby tabs above a full-bleed photo card of a dog with its name, age and distance, and round dismiss and like buttons below it.",
        caption: "The pattern everyone already knows, unchanged.",
      },
      {
        src: "/work/makeappet/profile.webp",
        alt: "A pet profile: a large photograph, the name and distance, a four-cell grid of age, breed, sex and weight, a written description, and a primary Bark me button beside a favourite button.",
        caption: "Breed, age, weight and a description — the part a photo cannot carry.",
      },
      {
        src: "/work/makeappet/browse.webp",
        alt: "The browse screen: a location and a search field with filters, a violet panel asking for a donation on behalf of shelters, then an Adoption section with species tabs and a grid of nearby pets.",
        caption: "Browse by species, with the shelters' ask in the flow.",
      },
      {
        src: "/work/makeappet/match.webp",
        alt: "The match screen: a Congratulations heading with an It's a Match ribbon, the two matched pets either side of a heart, a suggested opening line, and a Say woof button above a Not now link.",
        caption: "A match, and something to say.",
      },
    ],
    galleryKind: "phone",
    technologies: ["Sketch", "iOS", "Prototyping", "Developer handoff"],
    credits:
      "Product design end to end — flows, interface and the handoff. Built by a development team I worked alongside. The project ended at handoff; it was never released.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudy {
  const idx = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(idx + 1) % caseStudies.length];
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

/**
 * Client, role and period for a case, derived from the employer in `cv.ts`.
 * Lives here rather than in `career.ts` so the import direction stays
 * `career.ts → cv.ts` and `work.ts → cv.ts + career.ts` — no cycle.
 *
 * Throws on an unknown slug, and on a personal case missing its overrides:
 * a typo must fail the build, not render blank.
 */
export function getCaseMeta(slug: string): CaseMeta {
  const c = getCaseStudy(slug);
  if (!c) throw new Error(`Unknown case study slug: "${slug}".`);

  if (!c.experienceId) {
    if (!c.roleOverride || !c.yearOverride || !c.duration) {
      throw new Error(
        `Case "${slug}" has no experienceId, so it must declare roleOverride, yearOverride and duration.`,
      );
    }
    return {
      client: c.clientOverride ?? "Personal product",
      role: c.roleOverride,
      year: c.yearOverride,
      period: c.yearOverride,
      team: c.team,
      duration: c.duration,
    };
  }

  const exp = getExperience(c.experienceId);
  const period = c.yearOverride ?? formatPeriod(exp);

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
