import type { ExperienceId } from "@/data/cv";

export interface Testimonial {
  id: string;
  quote: string;
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

export function getTestimonial(id: string): Testimonial | undefined {
  return testimonials.find((t) => t.id === id);
}
