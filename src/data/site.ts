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
