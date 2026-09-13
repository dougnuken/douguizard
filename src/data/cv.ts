export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type YearMonth = { year: number; month?: Month };

export type ExperienceId =
  | "naowee"
  | "mercadolibre"
  | "aval"
  | "globant"
  | "qrvey"
  | "ideaware"
  | "smartbiz"
  | "freelance";

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
  location: {
    city?: string;
    country?: string;
    region?: string;
    mode: "remote" | "hybrid" | "onsite";
  };
  /** 1–2 sentences. The CV line. */
  summary: string;
  /** 3–4 bullets. `**bold**` supported by the renderer. */
  impact?: string[];
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
 * under "Earlier" but are NOT counted.
 * ⚠️ CONFIRMAR DOUG — anchor choice. smartbiz → 11 years today; freelance → 16.
 */
export const CAREER_ANCHOR: ExperienceId = "smartbiz";

export const experiences: Experience[] = [
  {
    id: "naowee",
    company: { name: "Naowee" },
    role: "Head of Product",
    start: { year: 2026, month: 1 },
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
    // ⚠️ CONFIRMAR DOUG — start month. No source anywhere has it.
    start: { year: 2024 },
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
    // ⚠️ CONFIRMAR DOUG — end month.
    end: { year: 2024 },
    // ⚠️ CONFIRMAR DOUG — work mode.
    location: { city: "Bogotá", country: "Colombia", mode: "hybrid" },
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
    // ⚠️ CONFIRMAR DOUG — Behance says "Senior Visual Designer"; the 2026 PDF
    // and the code say "Senior Product Designer". The newer source wins.
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
    client: "Survey & NPS Platform",
    // ⚠️ CONFIRMAR DOUG — Behance says "Lead Senior UX/UI"; the PDF says
    // "Lead UI Designer". The PDF wins.
    role: "Lead UI Designer",
    start: { year: 2016, month: 10 },
    end: { year: 2017, month: 8 },
    location: { city: "Barranquilla", country: "Colombia", mode: "onsite" },
    // ⚠️ CONFIRMAR DOUG — this entry used to describe Qrvey as an embedded
    // analytics platform, which is what Qrvey sells TODAY. The 2016–17 screens
    // Doug kept show a survey and NPS product with an automation builder
    // (AutomatiQ), and the app's own navigation reads Created Qrveys / Taken
    // Qrveys / Automation. Reframed to what the artefacts prove. If Doug also
    // worked on the analytics side, say so and the third bullet comes back.
    summary:
      "Lead UI designer at Qrvey, a survey and NPS platform — the dashboard people ran their surveys from, and AutomatiQ, the builder that turned a response into an action.",
    impact: [
      "**Owned the visual language** of the product, mobile and web.",
      "**Designed AutomatiQ end to end** — the process list, the trigger cards, the condition editor and the actions they fire.",
      "**Prototyped UX/UI improvements** that shipped to production.",
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
    // ⚠️ CONFIRMAR DOUG — no `impact[]`. The Behance résumé lists role, dates
    // and employer only; no bullets are invented (review deltas §B).
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
    // ⚠️ CONFIRMAR DOUG — no `impact[]`, same reason as smartbiz.
    era: "earlier",
  },
];

export const education: Education[] = [
  {
    id: "uac",
    start: { year: 2006 },
    // ⚠️ CONFIRMAR DOUG — Behance says 2010; the self-authored PDF says 2009.
    end: { year: 2009 },
    program: "Professional Graphic Designer",
    institution: "Universidad Autónoma del Caribe",
    location: "Barranquilla, Colombia",
  },
];

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

export const tools: ToolGroup[] = [
  {
    id: "design",
    label: "Design",
    items: [
      "Figma",
      "Sketch",
      "Adobe XD",
      "Illustrator",
      "Photoshop",
      "Balsamiq",
      "InVision",
      "Marvel",
      "Spline",
      "Webflow",
    ],
  },
  { id: "code", label: "Code", items: ["Claude Code", "Cursor", "GitHub", "Storybook"] },
  { id: "ai", label: "AI", items: ["Claude", "Gemini", "ChatGPT", "Midjourney"] },
  { id: "collaboration", label: "Collaboration", items: ["Jira", "Notion"] },
];

export const languages: Language[] = [
  { name: "Spanish", cefr: "Native", level: "Native" },
  { name: "English", cefr: "B1", level: "B1 · Working proficiency" },
];
