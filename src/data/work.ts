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
  client: string;
  project: string;
  year: string;
  role: string;
  duration: string;
  team: string;
  category: string;
  /** Cover gradient — used as fallback if no image */
  colors: [string, string];
  /** Path to thumbnail in /public/work/ — undefined uses gradient */
  thumbnail?: string;
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
  /** Screenshots from /public/work/<slug>/ — alt is required, caption optional. */
  gallery?: { src: string; alt: string; caption?: string }[];
  /** Extra destinations beyond externalLink — live app, source, writeups. */
  links?: { label: string; href: string }[];
  /** Who did what — authorship and collaborators, in one paragraph. */
  credits?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "olbo",
    num: "/01",
    client: "Personal Product",
    project: "olbo",
    year: "2026",
    role: "Design Engineer — end to end",
    duration: "Weeks — still shipping",
    team: "Solo — design, engineering, shipping",
    category: "Personal Product × Design Engineering",
    colors: ["#A98CFF", "#2B2169"],
    kind: "personal",
    tagline:
      "A personal finance PWA that asks whether you're on pace, not what's left — zero dependencies, 634 tests, shipped.",
    impact:
      "A live, installable finance PWA with 634 tests passing in 292ms and zero dependencies — designed and engineered end to end, AI in the loop, nothing thrown away.",
    context:
      "Budgeting apps answer \"how much is left\" — the anxious question. I built olbo for my own household: a local-first PWA in Colombian pesos whose core is a traffic light that reads spending pace against the day of the month.",
    contributions: [
      "**Product direction and interface** — 24 views, from the traffic-light dashboard to voice, photo-receipt and bank-SMS capture.",
      "**Pure domain layer** — the budget math carries no DOM, no database and no clock of its own; 634 tests run in Node in 292ms.",
      "**Zero dependencies** — vanilla ES modules the browser runs as written: no bundler, no framework, no build step.",
      "**Verifiable privacy** — a strict CSP limits the app to itself plus api.anthropic.com, so the local-first promise is readable in the header.",
    ],
    kpis: [
      { value: "634", label: "Tests passing", delta: "in 292ms" },
      { value: "0", label: "Dependencies", delta: "no bundler, no framework" },
      { value: "62", label: "JS modules", delta: "across 24 views" },
      { value: "1:2.5", label: "Test-to-code ratio", delta: "6,305 lines of tests" },
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
    client: "Naowee",
    project: "Naowee — Sports Sector Platform",
    year: "2026 — Now",
    role: "Head of Product",
    duration: "Ongoing",
    team: "Product, design & engineering",
    category: "GovTech × Sports × AI-native",
    colors: ["#00c2b8", "#0a84ff"],
    tagline:
      "Digitizing how a country runs its sport — a modular platform built design-and-engineering in one motion, with AI in the loop end to end.",
    impact:
      "One AI-native platform now stands in for a stack of disconnected tools — shipped at a pace a classic design-to-dev handoff can't match.",
    context:
      "Colombia's sports sector ran on paper, spreadsheets, and siloed systems. As Head of Product I set the direction and built SUID end to end — a single design system, AI in the loop, and real operators in mind.",
    contributions: [
      "**Product direction** across 9+ modules — inspection & control, events, venues, incentives, convocatorias and live scoring.",
      "**One design system** (naowee-*) — 38+ components, canonical shells and wizards keeping every module consistent.",
      "**AI-native build** — prototyping in code with Claude Code, Cursor and Gemini: idea to working screen in hours.",
      "**Guided tours per user story** so analysts sign off requirements against the running product.",
    ],
    kpis: [
      { value: "9+", label: "Modules unified", delta: "one platform" },
      { value: "38+", label: "System components", delta: "one language" },
      { value: "Hours", label: "Idea → working screen", delta: "not sprints" },
      { value: "12+", label: "Operator roles modeled" },
    ],
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
    client: "Mercadolibre",
    project: "Andes Design System",
    year: "2024 — 2026",
    role: "Tech Lead · Design Systems",
    duration: "~2 years",
    team: "30+ designers, 100+ engineers",
    category: "Design Systems × E-commerce",
    colors: ["#7e6dff", "#5eb8ff"],
    tagline:
      "Architecting the design system that powers LATAM's largest e-commerce platform.",
    impact:
      "The single source of truth for Mercadolibre's product — powering experiences for hundreds of millions of people across 18 countries.",
    context:
      "Thousands of designers and engineers ship daily across iOS, Android and Web. I owned the foundations, governance and tooling that keep it all one product — and brought AI into the systems practice.",
    contributions: [
      "**Foundations & governance** — tokens, type, motion and component APIs adopted org-wide.",
      "**Cross-platform parity** — one library maintained for iOS, Android and Web.",
      "**AI-assisted audits** — LLM workflows that catch system drift in Figma before it ships.",
    ],
    kpis: [
      { value: "~40%", label: "Fewer rework cycles", delta: "vs. before" },
      { value: "400+", label: "Designers on the system" },
      { value: "2K+", label: "Engineers on the system" },
      { value: "18", label: "Countries shipped to" },
    ],
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
    client: "Aval Digital Labs",
    project: "Banco de Occidente",
    year: "2018 — 2024",
    role: "Senior Product Designer · DS Gatekeeper",
    duration: "6 years",
    team: "12+ product squads",
    category: "Banking × Design Systems",
    colors: ["#ff8b5e", "#ff5e9f"],
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
    client: "Globant · Medellín",
    project: "Royal Caribbean Cruises",
    year: "2017 — 2018",
    role: "Senior Product Designer",
    duration: "1 year",
    team: "Cross-functional US + LATAM",
    category: "Travel × Mobile",
    colors: ["#5eb8ff", "#7e6dff"],
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
    client: "Qrvey",
    project: "Embedded Analytics Platform",
    year: "2017 — 2018",
    role: "Lead UI Designer",
    duration: "1 year",
    team: "Product + Engineering",
    category: "SaaS × Data Visualization",
    colors: ["#a8ff5e", "#5eb8ff"],
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
      { value: "Dozens", label: "Chart types", delta: "one system" },
      { value: "Enterprise", label: "SaaS deployments" },
      { value: "Native", label: "Embed in any host" },
    ],
    technologies: ["Sketch", "Charts.js", "Data Viz", "Component Libraries"],
    externalLink: { label: "Visit qrvey.com", href: "https://www.qrvey.com" },
  },
  {
    slug: "ideaware",
    num: "/07",
    client: "Ideaware co",
    project: "Multi-client UX Design",
    year: "2016 — 2017",
    role: "Senior UX/UI Designer",
    duration: "1 year",
    team: "Distributed agency",
    category: "Agency × Multi-client",
    colors: ["#ff5e9f", "#ff8b5e"],
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
      { value: "Multi", label: "Domains shipped", delta: "fintech → B2B" },
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
