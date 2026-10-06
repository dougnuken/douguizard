import type { ExperienceId } from "@/data/cv";
import type { Locale } from "@/i18n/config";

export interface Testimonial {
  id: string;
  /** Verbatim, always, in the language it was given in — never translated. */
  quote: string;
  /** The language `quote` was written in. A page in another language says so. */
  quoteLang: Locale;
  author: { name: string; role: string; company: string; initials: string };
  /** What the quote is about. */
  context?: string;
  year: string;
  experienceId: ExperienceId;
  caseSlug?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "francesca",
    // ⚠️ CONFIRMAR DOUG — published verbatim, option (a) of the review deltas.
    // A testimonial is never edited without the author's or Doug's say-so.
    quote:
      "Extremely professional and fast service. Doug is a master of detail and very creative. We've done 8 projects with him and every single one delivered above expectations. He doesn't just design — he architects how products should feel.",
    quoteLang: "en",
    author: {
      name: "Francesca Steri",
      role: "Design Director",
      company: "Aval Digital Labs",
      initials: "FS",
    },
    context: "Banco de Occidente · Velocity Design System",
    year: "2024",
    experienceId: "aval",
    caseSlug: "banco-de-occidente",
  },
  {
    id: "arman",
    quote:
      "Working with Doug was an absolute pleasure. He consistently delivered designs that were not only beautiful but highly functional. His ability to translate complex data into clear interfaces transformed our entire dashboard experience.",
    quoteLang: "en",
    author: {
      name: "Arman Eshraghi",
      role: "Founder & CEO",
      company: "Qrvey",
      initials: "AE",
    },
    // The annotation, not the quote — the quote is never edited. "Analytics
    // Platform" is what Qrvey sells today; in 2016–17 it was surveys and NPS,
    // which is what the case now shows.
    context: "Qrvey · Survey & NPS platform",
    year: "2018",
    experienceId: "qrvey",
    caseSlug: "qrvey",
  },
  {
    id: "nicolas",
    quote:
      "We were fortunate to work with Doug on our latest product launch. His creativity, expertise, and passion for design shone through in every detail. He elevated the entire team's standard of craft.",
    quoteLang: "en",
    author: {
      name: "Nicolas Polverino",
      role: "Technical Director",
      company: "Globant",
      initials: "NP",
    },
    context: "Royal Caribbean Cruises Project",
    year: "2018",
    experienceId: "globant",
    caseSlug: "royal-caribbean",
  },
];

/**
 * What a Spanish page says AROUND a quote: the author's role and what the quote
 * is about. The quote itself is not here, on purpose — it is someone else's
 * words, and the page prints it as they wrote it, marked as the original.
 */
const framingEs: Record<string, { role: string; context?: string }> = {
  francesca: { role: "Directora de Diseño", context: "Banco de Occidente · Sistema de diseño Velocity" },
  arman: { role: "Fundador y CEO", context: "Qrvey · Plataforma de encuestas y NPS" },
  nicolas: { role: "Director Técnico", context: "Proyecto Royal Caribbean Cruises" },
};

export function getTestimonial(id: string, locale: Locale = "en"): Testimonial | undefined {
  const t = testimonials.find((x) => x.id === id);
  if (!t || locale === "en") return t;
  const es = framingEs[t.id];
  return es ? { ...t, author: { ...t.author, role: es.role }, context: es.context ?? t.context } : t;
}
