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
      "A personal finance app that reads your spending pace, not your balance — designed, built and shipped solo.",
    impact:
      "Live and in daily use: log an expense by photo, voice, bank text or PDF, and one color tells you whether the month is on pace.",
    context:
      "Budgeting apps answer \"how much is left\", the anxious question. I built olbo for my own household: a local-first PWA in Colombian pesos whose traffic light reads spending pace against the calendar.",
    contributions: [
      "**Product and interface** — 24 views, from the traffic-light dashboard to AI that reads receipts, voice and PDFs.",
      "**Zero dependencies** — vanilla ES modules, no build step; pure budget math, so 634 tests run in 292ms.",
      "**Privacy you can check** — your data stays on the phone; the only thing that leaves it is the call to the AI.",
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
        body: "Every app I tried counted cents in someone else's currency. Product first: whole pesos, my data on my own phone, one screen that says if I'm fine.",
      },
      {
        phase: "02",
        title: "Built with AI, decided by tests",
        body: "I paired with Claude but refused disposable output: a pure domain layer, with \"today\" always injected, so every test runs in Node without a browser. AI wrote fast; the tests decided what survived.",
      },
      {
        phase: "03",
        title: "Shipping, then listening",
        body: "Live as an installable, offline PWA, service worker at v150. Daily use surfaced what no spec would: a timezone bug that broke the color at night, and receipts I refused to retype.",
      },
    ],
    decisions: [
      {
        title: "The traffic light reads pace, not balance",
        body: "Spending pace over the month elapsed: green up to 1, amber to 1.25, red above. 90% spent on the 28th is fine; 80% on the 10th is not.",
      },
      {
        title: "Variable bills never reserve money",
        body: "Power, water and fuel count only once you record what they cost. A reserved estimate can paint a false red, and one false red is enough to stop believing the color.",
      },
      {
        title: "Privacy you can check, not just read",
        body: "Everyone claims local-first. Here the CSP header proves it: nothing leaves the device except calls to api.anthropic.com. It cost every inline style, even inside SVGs.",
      },
    ],
    featuresIntro:
      "Capture is where finance apps die: if it takes effort, nobody does it. So olbo takes an expense however it arrives.",
    features: [
      {
        title: "Photograph the receipt",
        body: "Claude reads total, merchant and category into a card you confirm before saving.",
        kind: "ai",
      },
      {
        title: "Say the expense out loud",
        body: "\"Cincuenta mil en el mercado\" becomes a structured movement: Claude with a forced tool call, flagged for review below 0.7 confidence.",
        kind: "ai",
      },
      {
        title: "Paste the bank's text message",
        body: "Deliberately no model: an exact parser reads both bank formats offline, free, with no way to hallucinate an amount.",
        // Deliberately not tagged "ai": the copy's whole point is that a parser
        // beats a model here. An AI label next to it would contradict the text.
        kind: "product",
      },
      {
        title: "Read the whole card statement",
        body: "A PDF becomes data: closing and due dates, monthly rate, every installment purchase and its remaining term.",
        kind: "ai",
      },
    ],
    video: {
      webm: "/work/olbo/captura-gasto.webm",
      mp4: "/work/olbo/captura-gasto.mp4",
      poster: "/work/olbo/captura-gasto-poster.jpg",
      label:
        "Screen recording of olbo: an expense of 120.000 Colombian pesos typed on the app's own keypad, categorized and saved, then the dashboard and the movements list recalculating.",
      caption:
        "An expense logged in four taps; the month's pace updates before the sheet closes.",
      width: 786,
      height: 1704,
    },
    // The green ring leads: "Vas al ritmo del mes" is the product's whole idea
    // in one screen, and the alert state right after it shows the contrast.
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
      "Design and engineering end to end. Claude worked inside the build and the product; the decisions, and the tests that enforce them, are mine.",
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
      "Digitizing how Colombia runs its sport: 130+ screens across 8 modules, designed and built with AI.",
    impact:
      "One platform now stands in for a stack of disconnected tools, prototyped in code with AI.",
    context:
      "Colombia's sports sector ran on paper, spreadsheets and siloed systems. As Head of Product I set the direction and build, in code, the prototypes that define the platform: one design system, AI in the loop.",
    contributions: [
      "**One design system** — 38+ shared components and one step-by-step form pattern keep every screen consistent.",
      "**The sector's real hierarchy** — committees → federations → leagues → clubs → athletes, modeled with cascading approval.",
      "**Prototypes, not specs** — built with Claude Code, Cursor and Gemini; analysts sign off on the running product.",
    ],
    kpis: [
      { value: "30", label: "Procedures digitized", delta: "Word and email before" },
      { value: "~1,200", label: "Sports organizations in scope" },
      { value: "130+", label: "Screens shipped", delta: "across 8 of 13 modules" },
      { value: "38+", label: "Shared components", delta: "one design system" },
    ],
    process: [
      {
        phase: "01",
        title: "The sector ran on files",
        body: "All 30 procedures moved through Word, email and a document manager, GESDOC. Before drawing a screen I mapped 45+ states and 15 roles: the states were the product.",
      },
      {
        phase: "02",
        title: "Athletes and events, modeled by building them",
        body: "An approved athlete inherits the club's league and federation. Events, results and rankings enter by .xlsx template across 83 sports: valid rows load, failures come back by row number.",
      },
      {
        phase: "03",
        title: "The prototype is what gets signed",
        body: "Each module starts as a clickable prototype with real roles and states, walked story by story in a guided tour. The design system is the contract; the demo is how we sign it.",
      },
    ],
    decisions: [
      {
        title: "One system, or eight dialects",
        body: "Eight modules, eight deadlines, eight temptations to fork. The rule: no custom component; extend the 38+ shared ones. Anything off on review is a bug, not a preference.",
      },
      {
        title: "The demo is the requirement, not the document",
        body: "Specs get read differently by everyone. A running prototype surfaces disagreement while it's cheap and hands engineering a resolved target. It works because I build it myself.",
      },
      {
        title: "Hierarchy is the product, not a lookup table",
        body: "A flat athlete table would have shipped months earlier. But approvals cascade from the Ministry down to the club, and medals by league only mean something if the links are real.",
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
        "A coordinator clears an overdue filing. The picker flags who's overloaded; the counters recompute in place, 6 pending to 5.",
      width: 1920,
      height: 1200,
    },
    // The IVC workspace leads, full width, right under the IVC walkthrough: an
    // odd count gives the browser gallery one leader and then two-up rows, so
    // the venues pair and the investment-calls pair each keep a row of their
    // own. The IVC queue is not repeated here: the walkthrough's poster is it.
    gallery: [
      {
        src: "/work/naowee/ivc-workspace-tramite.webp",
        alt: "The professional's workspace on procedure IVC-2026-005: 18 days left on the deadline beside a checklist of 7 documents, each citing the article of Decreto 1387/1970 it answers, with validate, reject or observe available per document.",
        caption: "Each document checked against the article it answers.",
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
      {
        src: "/work/naowee/project-panel-admin.webp",
        alt: "The convocatorias administrator panel: 1 of 7 calls open, 33 applications, 10 at the documentary stage and 30.5 million COP in active investment, over lists of recent applications and currently active calls.",
        caption: "Investment calls, applications and stages in one panel.",
      },
      {
        src: "/work/naowee/project-revision-area-tecnica.webp",
        alt: "Technical-area review of application RAD-2026-003: an assigned-area notice with its SLA, an architectural checklist where every item cites its article of Resolución 933 and is marked compliant or unverified, progress at 4 of 6, and a panel of the uploaded documents.",
        caption: "One of eight technical areas, reviewed article by article.",
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
      "Head of Product at Naowee: I set direction across the business modules and build the prototypes that define them, alongside business analysts, a designer I lead, and engineering teams.",
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
    // The kicker names the brand; the h1 under it already names the system.
    clientOverride: "Mercadolibre",
    category: "Design Systems × E-commerce",
    duration: "~2 years",
    team: "400+ designers, 2,000+ engineers",
    kind: "client",
    // No gallery, no video, no screenshots: the screens are Mercadolibre's.
    nda: true,
    tagline:
      "Technical lead on the design system behind Mercadolibre: 18 countries, three platforms, one library.",
    impact:
      "Commerce, fintech and shipping products across Mercadolibre are built from one library.",
    context:
      "Andes is Mercadolibre's source of truth. I owned its foundations and component definitions, and brought AI into how it audits itself.",
    contributions: [
      "**Foundations** — tokens, spacing, type and motion, agreed once and governing the product suite.",
      "**Cross-platform parity** — one component API, shipped identically on iOS, Android and Web, worked out with engineering.",
      "**Maintenance at scale** — additions, deprecations and migrations in a library hundreds of designers open daily.",
      "**AI in the systems practice** — prompt-driven audits that catch drift in Figma before it ships.",
    ],
    // "~40% fewer rework cycles" is REMOVED: no source behind it. Its
    // qualitative replacement is the "Platforms in parity" card. Reinstate a
    // number only against a real measurement.
    // The "Countries shipped to" label is looked up verbatim by Hero and Craft.
    kpis: [
      { value: "400+", label: "Designers on the system" },
      { value: "2,000+", label: "Engineers on the system" },
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
    duration: "5+ years",
    team: "The bank's and Aval Digital Labs' teams",
    kind: "client",
    tagline:
      "One of Colombia's largest banks: its portal redesigned, and Velocity, the design system 12+ squads shared.",
    impact:
      "A dense portal rebuilt as one light product, on a design system that made each new screen cheaper than the last.",
    context:
      "The portal was dense and hard to navigate, and every squad solved the same problems differently. I redesigned it and built Velocity to fix both.",
    contributions: [
      "**Redesigned the transactional portal** — login, accounts, cards, transfers, payments and product blocking, identical on desktop, tablet and mobile.",
      "**Built Velocity, the bank's design system** — foundations to organisms, on atomic design so the front end mirrors it.",
      "**Design System Gatekeeper** — approved additions, deprecations and patterns across the bank's squads, and ran the workshops and crits.",
    ],
    kpis: [
      // Doug's own figure, consistent across cv.ts and the published piece.
      { value: "12+", label: "Product squads aligned", delta: "one system" },
      // The "Illustrated Icons" section of the piece: three rows of five. It took
      // back the slot of a tenure card that only repeated the Duration cell.
      { value: "15", label: "Illustrated icons", delta: "drawn for the system" },
      // Counted off the published system grid: 23 named tiles across five
      // columns. "20+" is deliberately conservative so it cannot be over-read.
      { value: "20+", label: "Documented system areas", delta: "foundations → organisms" },
      // The redesign's defining promise, from the first contribution: one portal,
      // identical on all three.
      { value: "3", label: "Devices, one portal", delta: "desktop, tablet, mobile" },
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
        body: "The brief asked for a similar experience; we made it identical. Every desktop capability reaches the phone with the same names, in the same order: nothing to relearn on the bus.",
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
        alt: "The Banco de Occidente transactional portal on a tablet: a left sidebar with the customer's name and benefit tier, cards for a Mastercard and a savings account with their balances, a favorite-transactions row, a month calendar and a spending chart.",
        caption: "The portal home: products, favorite transactions, the month at a glance.",
      },
      {
        src: "/work/banco-de-occidente/responsive-mobile.webp",
        width: 1510,
        height: 1461,
        alt: "Two iPhone screens side by side: a Mastercard Black detail with minimum payment, total payment and due date above a Pay button, and the movements tab listing card purchases with dates, installment counts and amounts.",
        caption: "On a phone: every desktop capability, in the same order.",
      },
      {
        src: "/work/banco-de-occidente/products-and-cards.webp",
        width: 1784,
        height: 1218,
        alt: "The accounts section of the portal on a tablet: a savings account card showing available, redeemable and current balances, a filterable movements table listing purchases and transfers with amounts, and a success toast confirming a checkbook has been blocked.",
        caption: "Balances, movements, and proof the block worked.",
      },
      {
        src: "/work/banco-de-occidente/login-registration.webp",
        width: 1784,
        height: 1218,
        alt: "The portal's login screen on a tablet: a cookie notice across the top, a promotional panel on the left, and a sign-in card asking for document type, document number and password, with links to recover a password and to register.",
        caption: "Login: document type, document number and password.",
      },
      {
        src: "/work/banco-de-occidente/design-system-foundations.webp",
        width: 2033,
        height: 2340,
        alt: "Design system foundation boards laid out in perspective: a color scale from light to dark blue with neutral and gold secondaries, a type scale from hero down to caption, a spacing scale, and sheets of button and form-field states.",
        caption: "Foundations: color, type, spacing, every state of every control.",
      },
      {
        src: "/work/banco-de-occidente/design-system-grid.webp",
        width: 1786,
        height: 795,
        alt: "The Velocity design system index, five columns wide: Documentation, Foundations, Atoms, Molecules and Organisms, listing basics, naming rules, writing principles, grids, spacing, colors, typography, buttons, inputs, controls, icons, fields, dropdowns, lists, tables, headers, forms, modals, date picker and tab navigation.",
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
        alt: "The popup system drawn as four stacked planes in perspective, labeled from the back: the page, a blurred background, the component, and the popup itself.",
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
    roleOverride: "Product Designer and Design Engineer — end to end",
    yearOverride: "2026",
    clientOverride: "DC Medical Aesthetics",
    duration: "Live since Sep 21, 2026 — still shipping",
    team: "Solo — product, design, code",
    kind: "personal",
    tagline:
      "The panel that runs a clinic from the secretary's phone. No procedure starts until it's paid for.",
    impact:
      "Finding what a patient owed used to take ten minutes of opening files; now every case shows it beside the next step.",
    context:
      "The aesthetic-medicine clinic I co-own in Barranquilla ran on WhatsApp, Google Calendar and a shared Drive: everything written down, nothing connected. I built one panel on top of those tools, not instead of them.",
    contributions: [
      "**Three locked phases** — valuation, payment, procedure; the procedure's green light needs full payment, receipt and signed consent.",
      "**Safe rollout** — a read-only version on day one; editing came later, behind per-person logins, after a security audit.",
      "**Rules as tested functions** — balances, card fees, dates and name matching, covered by 12 test suites.",
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
        title: "The plan was attacked first",
        body: "I mapped how the clinic actually worked, then put the plan through an adversarial review on data, security and feasibility. It found the traps the sheets hide; only the third version reached code.",
      },
      {
        phase: "02",
        title: "Read first, write later",
        body: "Version one was a read-only Claude artifact, safe to put in front of the clinic on day one. Editing came later, behind a login per person, after a security audit; live since September 21.",
      },
      {
        phase: "03",
        title: "The phone rewrote the interface",
        body: "The secretary runs the clinic from an iPhone, often from the car. So the panel installs as an app, tables become cards, tap targets are at least 44 pixels, and a voice note fills the new-patient form.",
      },
      {
        phase: "04",
        title: "Real money, then real requests",
        body: "Real payments set rules no plan had: a credit card lands at 95%, because the clinic passes the fee on to the patient. Then the clinic started asking: slots, an agenda by city, permissions. Most shipped within a day.",
      },
    ],
    decisions: [
      {
        title: "The spreadsheet stays the source of truth",
        body: "A real database was the obvious build. But the person who keeps the books works in Drive every day, and the clinic shouldn't depend on me. Switch the panel off tomorrow and nothing is lost.",
      },
      {
        title: "Balances are read, not summed",
        body: "Each income row carries the balance left after that payment, so summing counts a debt again with every deposit. An early version reported a phantom thirty-eight million pesos. Now the latest row wins.",
      },
      {
        title: "A color per city, never on its own",
        body: "The doctor works in three cities: orange for Barranquilla, blue for Bogotá, teal for Medellín, checked for color blindness. The name always sits beside its dot, so nobody has to tell teal from blue.",
      },
    ],
    featuresIntro:
      "One board with the clinic's day on it, on a laptop at the front desk or a phone in a car.",
    features: [
      {
        title: "A voice note that fills the form",
        body: "Say who came, for what, and what she paid. The model fills the form and saves nothing until a person checks it.",
        kind: "ai",
      },
      {
        title: "Phases with locks",
        body: "Each phase lists what's missing and links to the form that clears it. The footer always names the next step.",
        kind: "product",
      },
      {
        title: "The doctor's slots, ready to send",
        body: "The document the secretary already keeps becomes a week of red and green slots, flags days in two cities, and copies into WhatsApp.",
        kind: "product",
      },
      {
        title: "Receipts and invoices read by AI",
        body: "Photograph a receipt, a supplier invoice or travel expenses: the values come back filled in for review, then land in inventory or the month's accounting.",
        kind: "ai",
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
        "A voice note, typed here for the recording, fills in a new patient's form and opens her case. Demo data; fixed rules stand in for the AI.",
      width: 786,
      height: 1704,
    },
    // The case sheet leads: three locked phases, the payment bar and the one
    // next step are the product's argument in a single screen. Then the month
    // agenda; the browser gallery runs two full-width leaders and two-up rows,
    // so the day view sits beside the slots, and the follow-up board beside the
    // permissions sheet drawn over it.
    // The two drawer captures are `-v2`: re-exported with the drawer's backdrop
    // lifted. The new name is what invalidates the image optimiser's year-long
    // cache, which keys on the URL, not on the file's contents.
    gallery: [
      {
        src: "/work/dc-medical/caso-fases-v2.webp",
        alt: "A patient's case sheet open over the cases list: a three-step tracker with valuation and payment done and the procedure current, the procedure set at four vials for face and neck, the procedure date booked, a payment bar at 5.3 of 9.8 million pesos, the case's payments newest first, and a footer naming the next step — register the final payment.",
        caption: "The case: what's paid, what's missing, the one action that comes next.",
      },
      {
        src: "/work/dc-medical/agenda-mes.webp",
        alt: "The agenda in month view: September 2026 laid out Monday to Sunday, each day's appointments as short lines colored by city — orange for Barranquilla, blue for Bogotá, teal for Medellín — with a colored band over the days the doctor spends in each city, and a count of appointments per city above the grid.",
        caption: "A month of appointments, each colored by its city.",
      },
      {
        src: "/work/dc-medical/agenda-dia.webp",
        alt: "The agenda in day view for Thursday, 24 September: a banner saying the doctor is in Medellín according to the calendar, appointments as cards by the hour with their type and city, a red line marking the current time, and patient-record and calendar buttons on each card.",
        caption: "One day by the hour, and the city the doctor is in.",
      },
      {
        src: "/work/dc-medical/cupos-semana.webp",
        alt: "The doctor's slots for the week of 5 to 11 October: seven columns, each headed by the city the doctor is in, with hours marked occupied in red or free in green, a count of free hours over the next two months, and a button to copy two months of slots for WhatsApp.",
        caption: "The doctor's slots, read from the secretary's own document.",
      },
      {
        src: "/work/dc-medical/seguimiento-controles.webp",
        alt: "The follow-up board: counters for valuations, procedures, controls to reschedule, this week, the next 30 days and controls with no date; tabs for valuations, procedures, controls, agenda, slots and balances owed; city filters; and a table of 45-day controls, each with the days left, its status and a WhatsApp button.",
        caption: "Follow-up, counted: who's due, who has no date yet, who slipped.",
      },
      {
        src: "/work/dc-medical/usuarios-permisos-v2.webp",
        alt: "Editing a user in Users and permissions: the doctor's account set to view only, with toggles to see, create and edit per area — and to delete, for patients and cases — across agenda and follow-up, patients and cases, and patient payments, under presets for running the day, viewing only, and nothing.",
        caption: "Permissions by area: the doctor reads, the secretary runs the day.",
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
      "I co-own the clinic with the doctor and built the panel end to end. He owns the medical protocol; the secretary's daily use shaped the flows. Screens and walkthrough use seeded demo data: no real patient, no clinic figure.",
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
      "Mobile booking and onboard experiences for cruise guests on Caribbean and Mediterranean routes.",
    impact:
      "One mobile journey that follows guests from booking to disembarkation, built to hold up at sea.",
    context:
      "Cruise guests of every age and every comfort level with technology spend a week aboard with patchy connectivity. I designed booking and the onboard experience to work for all of them.",
    contributions: [
      "**Mobile booking** — flows across destinations and stateroom types.",
      "**Onboard experience** — schedules, dining, excursions and balances that work on intermittent Wi-Fi.",
      "**Remote collaboration** — with US product and engineering at Royal Caribbean HQ.",
    ],
    // No KPIs: "End-to-end" and "Offline" were words in number slots, and one
    // figure alone reads as a gap. No external link either: globant.com is the
    // employer's site and shows none of this work.
    technologies: ["Sketch", "iOS", "Android", "Prototyping", "Cross-cultural collaboration"],
  },
  {
    slug: "qrvey",
    num: "/07",
    experienceId: "qrvey",
    testimonialId: "arman",
    project: "Qrvey — AutomatiQ",
    category: "SaaS × Survey & NPS × Automation",
    duration: "11 months",
    team: "Product and engineering",
    kind: "client",
    // The kicker names the company; "Survey & NPS Platform" read as a category.
    clientOverride: "Qrvey",
    tagline:
      "A survey automation builder — trigger, condition, action — for people who had never drawn a flow chart.",
    impact:
      "A negative answer could trigger its own follow-up — a new survey a week later, results emailed to the team — with nobody watching for it.",
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
        alt: "The Automation tab of Qrvey: a Create Process button over a list of process cards, each with a colored status bar reading Running or Paused, its name and creation date, and three figures — surveys covered, average time and cycles run. A sidebar offers example surveys and tips.",
        caption: "Each process: running or paused, and what it has done.",
        width: 2000,
        height: 1438,
      },
      {
        src: "/work/qrvey/condition-branching.webp",
        alt: "A condition under a New Response trigger: two pills, If Answer Is and # of Responses, above a panel holding a question and its answer rows with buttons to add or remove each one, and a Select Action row waiting underneath.",
        caption: "Conditions in the product's words: \"If Answer Is\", \"# of Responses\".",
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
      "Developer-ready design across fintech, marketplaces and B2B — the multi-domain fluency that later made design-systems work feel natural.",
    context:
      "A remote-first agency, where the job was learning a client's domain fast and shipping clean design.",
    contributions: [
      "**Wireframes and UI kits** — for fintech, consumer and B2B products.",
      "**High-fidelity prototypes** — for stakeholder validation and developer handoff.",
      "**Reusable patterns** — applied across clients and tailored to each.",
    ],
    // No KPIs: "Agency" and "US + LATAM" were words in number slots. No
    // external link: the agency's site shows none of this work.
    technologies: ["Sketch", "InVision", "Wireframing", "Prototyping"],
  },
  {
    slug: "chub",
    num: "/09",
    project: "Chub",
    category: "iOS × Mobility",
    kind: "side",
    clientOverride: "Freelance side project",
    roleOverride: "Product Designer — end to end",
    yearOverride: "2018",
    duration: "2018",
    team: "Solo designer, handed off to a dev team",
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
      "**A priced route** — pickup, destination, estimated time and a fare range, so the last screen holds no surprises.",
      "**One app, from booking to cabin** — mid-trip it runs climate and ventilated seats, and shows temperature and speed.",
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
    roleOverride: "Product Designer — end to end",
    yearOverride: "2018",
    duration: "2018",
    team: "Solo designer, handed off to a dev team",
    tagline:
      "Swipe to meet a dog or cat nearby: the dating pattern everyone knows, pointed at adoption.",
    impact:
      "Adoption borrows the swipe from dating apps, and puts the shelters' donation ask where the attention already is.",
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
        caption: "Name, age and distance on the card; like or pass.",
      },
      {
        src: "/work/makeappet/profile.webp",
        alt: "A pet profile: a large photograph, the name and distance, a four-cell grid of age, breed, sex and weight, a written description, and a primary Bark me button beside a favorite button.",
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
 * The client is the case's `clientOverride` first, for any case: the CV names
 * the end client of an engagement ("Andes Design System", "Survey & NPS
 * Platform") where a case page wants the brand it was for, and the kicker
 * above an h1 that already says "Andes Design System" must not say it again.
 * Without an override it is the CV's client, then the employer.
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
    client: c.clientOverride ?? exp.client ?? exp.company.name,
    role: c.roleOverride ?? exp.role,
    year: period,
    period,
    team: c.team,
    duration: c.duration ?? period,
    location: formatLocation(exp),
  };
}
