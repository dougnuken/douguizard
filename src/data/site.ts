import type { Locale } from "@/i18n/config";

export interface SocialLink {
  label: string;
  href: string;
  /** Shown in the header pill and listed first in the footer. */
  primary?: boolean;
  /** Printed on the CV. Doug picks these per profile; the site lists more. */
  onCv?: boolean;
}

export interface Site {
  name: string;
  brand: string;
  /** Bare host, no scheme. The one place the address is written down. */
  domain: string;
  /** One canonical headline. Header, hero kicker, CV, JSON-LD jobTitle, OG. */
  headline: string;
  /** The arc. Shown as a label, never narrated as a sentence. */
  positioning: string;
  /** 3 sentences. About bio lead, CV summary lead, and the base for seo.description. */
  summary: string;
  /** Long form, 5 sentences. `/cv` only. */
  summaryLong: string;
  location: { city: string; country: string; timezone: string; iata: string };
  email: string;
  phone: string;
  phoneHref: string;
  availability: {
    status: "employed" | "open" | "available";
    label: string;
    /** One word for the header badge. What `note` offers, in the shortest form. */
    badge: string;
    note?: string;
  };
  social: SocialLink[];
  /** `pdf` is per language: each CV page hands out the sheet in its own language. */
  cv: { path: string; pdf?: string };
  seo: {
    /** Trimmed to survive Google's ~160-char cut. Not the same string as summary. */
    description: string;
    keywords: string[];
    ogImage: string;
  };
}

const social: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/dougvargasco", primary: true, onCv: true },
  { label: "Behance", href: "https://www.behance.net/dougvargas", onCv: true },
  // Stays on the site — it is already public from olbo's "Source" link — but
  // NOT on the CV: asked directly which profiles the downloadable CV should
  // carry, Doug named douguizard.com, LinkedIn and Behance, and left this out.
  { label: "GitHub", href: "https://github.com/dougnuken" },
  // The old third profile link is REMOVED: it sat at the same weight as
  // LinkedIn and carries no work this portfolio references.
];

export const site: Site = {
  name: "Doug Vargas",
  brand: "Douguizard",
  domain: "douguizard.com",
  headline: "Head of Product · Design Engineer",
  positioning: "Product Designer → Design Engineer",
  summary:
    "I'm a product designer who builds. I lead product at Naowee and ship the prototypes that define it — one design system, working code, AI in the loop. Before that I maintained Andes, the design system behind Mercadolibre across 18 countries.",
  summaryLong:
    "I'm a product designer who builds. Today I'm Head of Product at Naowee, where I set direction across the eight business modules of the platform built for Colombia's sports system, and build the prototypes that define them. Before that I was technical lead on Andes, the design system behind Mercadolibre across 18 countries, used by 400+ designers and 2,000+ engineers. Earlier I spent six years at Aval Digital Labs as the gatekeeper of Banco de Occidente's design system, and built the bank's digital banking flows for desktop, tablet and mobile. I work in code as well as in Figma, with AI in the loop, and the thing I hand over is a running product.",
  location: {
    city: "Barranquilla",
    country: "Colombia",
    timezone: "UTC-5",
    iata: "BAQ",
  },
  // The 2026 PDF prints dougvargas72@gmail.com. Confirmed: one address for both
  // the site and the printable CV, and it is this one.
  email: "hello@douguizard.com",
  phone: "+57 300.351.8299",
  phoneHref: "tel:+573003518299",
  availability: {
    status: "employed",
    label: "Head of Product at Naowee",
    // Employed AND available: the badge is about the consulting in `note`, not
    // about looking for a job. `note` is the badge's own tooltip, so the header
    // can never claim more than this line says.
    badge: "Available",
    note: "Selected consulting on design systems and AI-native product",
  },
  social,
  // Generated from /cv itself by `npm run cv:pdf`, never hand-made — that is
  // how the last one ended up two jobs out of date. A test compares the file's
  // stamp against the live data and fails if they drift.
  cv: { path: "/cv", pdf: "/cv/doug-vargas-cv.pdf" },
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

/**
 * What changes when the site speaks Spanish. Everything else — the name, the
 * address, the profiles, the headline — is the same fact in both languages.
 *
 * The headline stays in English on purpose: "Head of Product · Design
 * Engineer" is the title on the contract, on LinkedIn and on the CV, and in
 * Colombian tech it is written that way. Translating it would make the two
 * versions of the site disagree about what Doug's job is called.
 */
const siteEs: Site = {
  ...site,
  summary:
    "Soy un diseñador de producto que construye. Lidero producto en Naowee y hago los prototipos que lo definen: un solo sistema de diseño, código que funciona y la IA en el proceso. Antes mantuve Andes, el sistema de diseño detrás de Mercadolibre en 18 países.",
  summaryLong:
    "Soy un diseñador de producto que construye. Hoy soy Head of Product en Naowee, donde marco la dirección de los ocho módulos de negocio de la plataforma construida para el sistema deportivo de Colombia, y construyo los prototipos que los definen. Antes fui líder técnico de Andes, el sistema de diseño detrás de Mercadolibre en 18 países, usado por más de 400 diseñadores y más de 2.000 ingenieros. Antes de eso pasé seis años en Aval Digital Labs como guardián del sistema de diseño del Banco de Occidente, y diseñé su banca digital para escritorio, tableta y celular. Trabajo en código además de en Figma, con la IA en el proceso, y lo que entrego es un producto funcionando.",
  availability: {
    ...site.availability,
    label: "Head of Product en Naowee",
    badge: "Disponible",
    note: "Consultoría puntual en sistemas de diseño y producto nativo de IA",
  },
  cv: { path: "/cv", pdf: "/cv/doug-vargas-cv-es.pdf" },
  seo: {
    ...site.seo,
    description:
      "Doug Vargas lidera producto en Naowee y lo construye: sistemas de diseño, prototipos que funcionan en código y la IA en el proceso. Antes, Andes en Mercadolibre.",
    keywords: [
      ...site.seo.keywords,
      "Diseñador de producto",
      "Sistemas de diseño",
      "Ingeniería de diseño",
      "Producto nativo de IA",
    ],
  },
};

const siteEn: Site = { ...site, cv: { path: "/en/cv", pdf: site.cv.pdf } };

/** The site's facts in one language. `site` itself is the English source. */
export function getSite(locale: Locale): Site {
  return locale === "es" ? siteEs : siteEn;
}
