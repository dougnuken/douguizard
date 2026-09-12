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
  kpis: Kpi[];
  technologies?: string[];
  externalLink?: { label: string; href: string };
  /** Client engagement or self-initiated product — drives framing and index labels. */
  kind?: "client" | "personal";
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
  /** Screenshots from /public/work/<slug>/ — alt is required, caption optional. */
  gallery?: { src: string; alt: string; caption?: string }[];
  /**
   * Which device frame `gallery` renders in. Mobile products ("phone") get the
   * handset mockup; desktop web platforms ("browser") need a browser chrome
   * instead. Omitted means "phone" — the original behaviour, so olbo is unchanged.
   */
  galleryKind?: "phone" | "browser";
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
        src: "/work/olbo/semaforo-verde.png",
        alt: "olbo dashboard with the traffic light in green — spending pace is at or under the share of the month elapsed.",
        caption: "Green: the pace matches the calendar.",
      },
      {
        src: "/work/olbo/semaforo-alerta.png",
        alt: "olbo dashboard with the traffic light in alert — the same pocket read against an earlier day of the month turns the color to a warning.",
        caption: "The same amount, earlier in the month, reads as alert.",
      },
      {
        src: "/work/olbo/registrar.png",
        alt: "olbo expense capture screen — entering a movement in whole Colombian pesos in a few taps.",
        caption: "Capture in whole pesos, in seconds.",
      },
      {
        src: "/work/olbo/movimientos.png",
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
        src: "/work/naowee/ivc-bandeja.png",
        alt: "The IVC coordinator's assignment queue: counters reading 6 in referral, 3 assigned and 3 in validation, above a table of 25 procedures listing each filing number, the sports organization and its NIT, days remaining, status and assigned professional.",
        caption: "The coordinator's queue: every procedure with a deadline and an owner.",
      },
      {
        src: "/work/naowee/ivc-workspace-tramite.png",
        alt: "The professional's workspace on procedure IVC-2026-005: 18 days left on the deadline beside a checklist of 7 documents, each citing the article of Decreto 1387/1970 it answers, with validate, reject or observe available per document.",
        caption: "Each document checked against the article it has to answer.",
      },
      {
        src: "/work/naowee/project-panel-admin.png",
        alt: "The convocatorias administrator panel: 1 of 7 calls open, 33 applications, 10 at the documentary stage and 30.5 million COP in active investment, over lists of recent applications and currently active calls.",
        caption: "Investment calls, applications and stages in a single panel.",
      },
      {
        src: "/work/naowee/project-revision-area-tecnica.png",
        alt: "Technical-area review of application RAD-2026-003: an assigned-area notice with its SLA, an architectural checklist where every item cites its article of Resolución 933 and is marked compliant or unverified, progress at 4 of 6, and a panel of the uploaded documents.",
        caption: "One of eight technical areas, reviewed article by article.",
      },
      {
        src: "/work/naowee/escenarios-mapa.png",
        alt: "The georeferenced sports-venue registry: a choropleth of Colombia shaded by department, with filters for region, venue type, status and CAR, beside a ranking of departments and an intensity legend.",
        caption: "The country's sports venues, department by department.",
      },
      {
        src: "/work/naowee/escenarios-perfil-escenario.png",
        alt: "The profile of the venue Centro deportivo Norte, carrying a CAR badge: a photo carousel above tabs for general information, documentation and history, showing department, municipality, cadastral registration and coordinates.",
        caption: "A single venue: photos, documents and coordinates.",
      },
    ],
    // No public link: the demo hub is an internal catalogue of prototypes, and
    // pointing at it frames this work as demos rather than as the platform the
    // screens and the walkthrough already show. The work speaks for itself.
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
    // Full rewrite from the Behance piece (07 §g) is Build B's job.
    experienceId: "aval",
    testimonialId: "francesca",
    project: "Banco de Occidente",
    category: "Banking × Design Systems",
    duration: "6 years",
    team: "12+ product squads",
    kind: "client",
    tagline:
      "Redesigning digital banking for one of Colombia's largest banks — and building the system that keeps it consistent.",
    impact:
      "From fragmented squads to one coherent banking product — shipping faster, with accessibility passing on the first audit.",
    context:
      "As official Design System Gatekeeper for a top Colombian bank, I approved patterns across 12+ squads and redesigned core flows — transfers, payments, account management — for web and mobile.",
    contributions: [
      "**Design System Gatekeeper** — governed additions, deprecations and patterns across every squad.",
      "**Core flow redesigns** — transfers, payments and account management, web + mobile.",
      "**System literacy** — monthly crits, workshops and 1:1 mentorship across the org.",
    ],
    kpis: [
      { value: "12+", label: "Squads aligned" },
      { value: "6 yr", label: "As DS gatekeeper" },
      { value: "M+", label: "Customers reached" },
      { value: "1st-pass", label: "Accessibility audits", delta: "no rework" },
    ],
    technologies: ["Figma", "Sketch", "Design Tokens", "Prototyping", "Mentorship"],
    externalLink: { label: "Visit adldigitallab.com", href: "https://www.adldigitallab.com" },
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
    project: "Embedded Analytics Platform",
    category: "SaaS × Data Visualization",
    duration: "1 year",
    team: "Product + Engineering",
    kind: "client",
    tagline:
      "Crafting the visual language for an embedded analytics platform serving SaaS clients.",
    impact:
      "A brand-neutral analytics language that embeds natively inside any host SaaS product.",
    context:
      "Qrvey lets SaaS companies embed analytics in their own products. I owned the visual language — dashboards, charts and configuration — built to disappear into any host.",
    contributions: [
      "**Visual language** for the whole dashboard product.",
      "**Flexible chart systems** across dozens of visualization types.",
      "**Brand-neutral defaults** with deep theming hooks for each host.",
    ],
    kpis: [
      // Vague figures ("Dozens", "Enterprise") replaced with honest
      // qualitative values — nothing behind the counts.
      { value: "Charts", label: "The visual language", delta: "one system, many types" },
      { value: "Embedded", label: "Inside the host product" },
      { value: "Native", label: "Embed in any host" },
    ],
    technologies: ["Sketch", "Charts.js", "Data Viz", "Component Libraries"],
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
      client: "Personal product",
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
