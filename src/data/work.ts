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
  thumbnail?: string;        // ← ESTA LÍNEA debe existir
  tagline: string;
  challenge: string;
  approach: string[];
  outcome: {
    headline: string;
    description: string;
    metrics?: { value: string; label: string }[];
  };
  technologies?: string[];
  externalLink?: { label: string; href: string };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "mercadolibre-andes",
    num: "/01",
    client: "Mercadolibre",
    project: "Andes Design System",
    year: "2024 — Now",
    role: "Tech Lead · Design Systems",
    duration: "Ongoing",
    team: "30+ designers, 100+ engineers",
    category: "Design Systems × E-commerce",
    colors: ["#7e6dff", "#5eb8ff"],
    tagline:
      "Architecting the design system that powers LATAM's largest e-commerce platform.",
    challenge:
      "Mercadolibre operates across 18 countries with thousands of designers and engineers shipping product daily. Maintaining consistency, accessibility, and performance across iOS, Android, and Web — while keeping the system flexible enough to support rapid product innovation — required rethinking governance, foundations, and tooling.",
    approach: [
      "Established **foundational definitions** (tokens, spacing, type, motion) that govern every product surface across the company.",
      "Built and shipped a **cross-platform component library** maintained simultaneously for iOS, Android, and Web with parity guarantees.",
      "Created **AI-assisted design audit workflows** — using LLMs to scan Figma files for system compliance and surface drift before it ships.",
      "Partnered cross-functionally with engineering org-wide to align component APIs, reducing rework cycles by ~40%.",
      "Introduced **prompt-driven generative UI exploration** as a sanctioned R&D track inside the systems practice.",
    ],
    outcome: {
      headline: "A living system that ships every day.",
      description:
        "Andes is now the single source of truth for Mercadolibre's product surfaces — used by 400+ designers and 2,000+ engineers building experiences for hundreds of millions of users across LATAM.",
      metrics: [
        { value: "18", label: "Countries" },
        { value: "400+", label: "Designers" },
        { value: "2K+", label: "Engineers" },
        { value: "3", label: "Platforms" },
      ],
    },
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
    num: "/02",
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
    challenge:
      "Banco de Occidente serves millions of customers through web and mobile banking. The product was fragmented across many squads working independently, leading to inconsistent UX, accessibility gaps, and slow shipping cycles. We needed a design system that could scale governance without slowing teams down.",
    approach: [
      "Took ownership as official **Design System Gatekeeper** — the role that approves additions, deprecations, and patterns across all squads.",
      "Ran **monthly workshops, design crits, and 1:1 mentorship** sessions to spread system literacy across the org.",
      "Designed and shipped redesigns of **core banking flows** — transfers, payments, account management — for both mobile and web.",
      "Established **review rituals** that caught accessibility and consistency issues before development handoff.",
      "Mentored junior and mid-level designers, growing the digital banking design org's craft level.",
    ],
    outcome: {
      headline: "From fragmented to coherent at bank scale.",
      description:
        "Over six years, the design system became the spine of Banco de Occidente's digital banking. Squads ship faster, accessibility audits pass first time, and customer-facing UX is recognizably one product.",
      metrics: [
        { value: "12+", label: "Product squads" },
        { value: "6yr", label: "Tenure" },
        { value: "M+", label: "Customers reached" },
      ],
    },
    technologies: ["Figma", "Sketch", "Design Tokens", "Prototyping", "Mentorship"],
    externalLink: { label: "Visit adldigitallab.com", href: "https://www.adldigitallab.com" },
  },
  {
    slug: "royal-caribbean",
    num: "/03",
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
    challenge:
      "Cruise passengers spend a week or more on a ship — they need an app that handles booking, daily activities, dining, excursions, account management, and on-ship navigation. The challenge was building an interface that worked for guests of all ages and tech literacy levels, with intermittent connectivity at sea.",
    approach: [
      "Designed **mobile booking flows** for guests reserving cruises across multiple destinations and stateroom types.",
      "Built the **onboard guest experience** — daily schedules, dining reservations, excursion booking, account balance — all working with intermittent ship Wi-Fi.",
      "Collaborated with **US-based product and engineering teams** at Royal Caribbean HQ; led design sessions remotely.",
      "Iterated on flows for **guests of varied digital literacy** — from younger passengers to retirees on their first smartphone.",
    ],
    outcome: {
      headline: "An app that follows guests from booking to disembarkation.",
      description:
        "The mobile experiences shipped to passengers across Royal Caribbean's Caribbean and Mediterranean fleets, supporting the full guest journey from initial booking to onboard daily life.",
    },
    technologies: ["Sketch", "iOS", "Android", "Prototyping", "Cross-cultural collaboration"],
    externalLink: { label: "Visit globant.com", href: "https://www.globant.com" },
  },
  {
    slug: "qrvey",
    num: "/04",
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
    challenge:
      "Qrvey gives SaaS companies a way to embed analytics directly inside their own products. The dashboard, charts, and configuration UI had to feel native inside any host product — meaning visual neutrality, deep customization, and rock-solid information hierarchy across hundreds of chart types.",
    approach: [
      "Owned the **visual language** for the entire dashboard product — components, charts, configuration UIs, and data exploration patterns.",
      "Designed **flexible chart systems** that worked across line, bar, scatter, heatmap, and dozens of other visualizations.",
      "Prototyped **UX/UI improvements** that shipped to production for the platform's enterprise clients.",
      "Balanced **brand-neutral defaults** with deep theming hooks so each host product could brand the analytics natively.",
    ],
    outcome: {
      headline: "Analytics that disappears into any product.",
      description:
        "The visual language became the foundation for Qrvey's enterprise SaaS deployments — clean, neutral, and adaptable across every host context.",
    },
    technologies: ["Sketch", "Charts.js", "Data Viz", "Component Libraries"],
    externalLink: { label: "Visit qrvey.com", href: "https://www.qrvey.com" },
  },
  {
    slug: "ideaware",
    num: "/05",
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
    challenge:
      "Ideaware operates as a remote-first agency serving clients across the US and LATAM. Each engagement required quickly understanding a new product domain, stakeholder dynamics, and brand language — and producing design output that could be handed cleanly to development.",
    approach: [
      "Produced **wireframes and UI kits** for diverse client projects — fintech, consumer apps, marketplaces, B2B tools.",
      "Built **high-fidelity prototypes** for stakeholder validation and developer handoff.",
      "Adapted communication style across **time zones and cultures** to keep distributed projects on track.",
      "Established **reusable design patterns** I could apply across engagements while still customizing each per client.",
    ],
    outcome: {
      headline: "A wide-angle view of how product design adapts across contexts.",
      description:
        "The multi-client experience built fluency in switching between domains — a foundation that later made design systems work feel natural at scale.",
    },
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
