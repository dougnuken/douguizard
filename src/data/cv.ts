export interface Experience {
  period: string;
  isCurrent?: boolean;
  company: { plain: string; accent: string; suffix?: string };
  role: string;
  description: string;
  impact?: string[];
  link?: { label: string; href: string };
}

export interface Education {
  year: string;
  program: { plain: string; accent: string; order: "before" | "after" };
  institution: string;
}

export const experiences: Experience[] = [
  {
    period: "2024 — Jan 2026",
    company: { plain: "· Andes", accent: "Mercadolibre" },
    role: "Tech Lead · Product Design Systems",
    description:
      "Lead designer for Andes — the design system powering Mercadolibre's e-commerce, fintech and shipping verticals across 18 LATAM countries. Define foundations, govern components, and partner cross-platform with engineering org-wide.",
    impact: [
      "**Design library** maintained across iOS, Android and Web — used by 400+ designers and 2,000+ engineers.",
      "**Foundational definitions** (tokens, spacing, type, motion) governing the entire ML product suite.",
      "**AI workflows:** introduced prompt-driven design audits and generative UI exploration into the system practice.",
    ],
    link: { label: "View ux.mercadolibre.com", href: "https://ux.mercadolibre.com" },
  },
  {
    period: "2018 — 2024",
    company: { plain: "Digital Labs", accent: "Aval" },
    role: "Senior Product Designer · Design System Gatekeeper",
    description:
      "Senior product designer for Banco de Occidente — one of Colombia's top banks. Owned mobile and web banking experiences; built and governed the design system across squads as official 'gatekeeper'.",
    impact: [
      "**Design system advocacy:** ran workshops, classes and crits that scaled the system across 12+ product squads.",
      "**Mentorship** for junior and mid-level designers across the digital banking org.",
      "Shipped redesigns for core banking flows used by **millions of customers**.",
    ],
    link: { label: "View adldigitallab.com", href: "https://www.adldigitallab.com" },
  },
  {
    period: "2017 — 2018",
    company: { plain: "", accent: "Globant" },
    role: "Senior Product Designer · Royal Caribbean Project",
    description:
      "Senior product designer for Royal Caribbean cruises across Globant's Medellín studio. Mobile and web design for booking, onboarding and on-board experiences.",
    impact: [
      "Designed mobile flows for **onboard guest experience** used by passengers across Caribbean and Mediterranean fleets.",
      "Cross-functional collaboration with US-based product and engineering teams.",
    ],
    link: { label: "View globant.com", href: "https://www.globant.com" },
  },
  {
    period: "2017 — 2018",
    company: { plain: "", accent: "Qrvey" },
    role: "Lead UI Designer · Embedded Analytics",
    description:
      "Lead UI designer for Qrvey's analytics platform — dashboards, charts and data visualization features for SaaS clients.",
    impact: [
      "Owned the **visual language** for the dashboard product.",
      "Prototyped UX/UI improvements that shipped to production for the platform's enterprise clients.",
    ],
    link: { label: "View qrvey.com", href: "https://www.qrvey.com" },
  },
  {
    period: "2016 — 2017",
    company: { plain: "co", accent: "Ideaware" },
    role: "Senior UX/UI Designer",
    description:
      "UX/UI design for international clients — wireframes, UI kits and high-fidelity prototypes for web and mobile applications.",
    link: { label: "View ideaware.co", href: "https://www.ideaware.co" },
  },
];

export const education: Education[] = [
  {
    year: "2006 — 2009",
    program: { plain: "Graphic Designer", accent: "Professional", order: "before" },
    institution: "Universidad Autónoma del Caribe",
  },
  {
    year: "2018",
    program: { plain: "Design", accent: "Foundations", order: "after" },
    institution: "Globant",
  },
  {
    year: "2020",
    program: { plain: "Design System", accent: "Essentials", order: "after" },
    institution: "Aval Digital Labs",
  },
  {
    year: "2022",
    program: { plain: "Introduction to", accent: "UI", order: "after" },
    institution: "Coursera",
  },
  {
    year: "2025",
    program: { plain: "for Designers", accent: "AI", order: "before" },
    institution: "Continuous learning · ongoing",
  },
];

export const skills = {
  productDesign: [
    { label: "UX Strategy", primary: true },
    { label: "Design Thinking", primary: true },
    { label: "User Research" },
    { label: "User Journeys" },
    { label: "User Flows" },
    { label: "A/B Testing" },
    { label: "Prototyping" },
    { label: "Wireframing" },
  ],
  designSystems: [
    { label: "Tokens & Foundations", primary: true },
    { label: "Component Libraries", primary: true },
    { label: "Governance" },
    { label: "Documentation" },
    { label: "UI Kits" },
    { label: "Cross-platform parity" },
  ],
  aiDesign: [
    { label: "Prompt Engineering", warm: true },
    { label: "Generative UI", warm: true },
    { label: "LLM-driven UX", warm: true },
    { label: "AI Agent Flows", warm: true },
    { label: "Conversational Interfaces" },
    { label: "AI Ethics & Guardrails" },
  ],
  platforms: [
    { label: "iOS Design" },
    { label: "Android Design" },
    { label: "Web" },
    { label: "Responsive" },
    { label: "No-code tools" },
    { label: "Web & App Interactions" },
  ],
};

export const tools = [
  "Figma",
  "Sketch",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Principle",
  "Marvel",
  "Notion",
  "Webflow",
  "Framer",
  "ChatGPT",
  "Claude",
  "Cursor",
  "v0",
  "Midjourney",
];

export const languages = [
  { name: "Spanish", level: "Native — C2", percent: 100 },
  { name: "English", level: "B1 Mid · Working proficiency", percent: 55 },
];