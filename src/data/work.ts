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
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "naowee-suid",
    num: "/01",
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
    num: "/02",
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
    num: "/03",
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
    num: "/04",
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
    num: "/05",
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
    num: "/06",
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
