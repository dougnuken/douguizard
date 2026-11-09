import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";

export interface CoverLetter {
  /** Mono eyebrow above the block. */
  kicker: string;
  /** When this text was last rewritten. Hand-set, so the page is not dated daily. */
  updated: string;
  /** Deliberately not "Dear Sir or Madam": nobody writes that and means it. */
  salutation: string;
  /** Body, in order. The first is set as the lede. Plain text — no markup. */
  paragraphs: string[];
  signoff: string;
  /** Sets the reader's expectation about what this letter is. */
  note: string;
}

/**
 * The letter that opens `/cv`.
 *
 * It exists to do the one thing the record below it cannot: say how the work
 * is done and what it is for. So it deliberately does NOT restate
 * `site.summaryLong` — that paragraph is directly above it on the page, and a
 * letter that repeats the summary is a letter nobody finishes.
 *
 * Every figure here is one the case data already carries. Nothing is written
 * up for the occasion, because the reader can click through and check.
 */
export const coverLetter: CoverLetter = {
  kicker: "Cover letter",
  updated: "November 2026",
  salutation: "Hello,",
  paragraphs: [
    "I'm a product designer who also writes code. In practice, that means I rarely hand off a spec and wait to see what comes back. I build a working version, put it in front of the people who will use it, and stay with it after it ships.",
    "My most recent role was Head of Product at Naowee, where we digitized how Colombia's sports system is inspected and regulated: about 1,200 organizations and 30 procedures that used to live in Word files and email. Before drawing a single screen, I mapped more than 45 states and 15 roles. Then I built the flows as prototypes and walked through them, story by story, with the analysts who have to sign off. Disagreements came up early, while they were still cheap to fix.",
    "Before Naowee, I worked on Andes, Mercado Libre's design system, used by more than 400 designers and 2,000 engineers across 18 countries. At that scale, a small change to one component can break dozens of screens you will never see. It taught me to care about the details other people build on, and to only write rules that can actually be enforced in code.",
    "I use AI every day, and I check its work. On olbo, a budgeting app I designed and built, I rebuilt the whole interface with AI help and didn't touch the budget math: all 647 tests had to stay green before anything shipped.",
    "If your team needs someone who can take an idea from a rough sketch to something real people can use, I'd love to talk.",
  ],
  signoff: "Best regards,",
  note: "This is my general letter. Tell me about the role and I'll write one just for it.",
};

/**
 * The Spanish letter. Written in Spanish, not translated sentence by sentence:
 * same story, same figures, and every one of them is still one the case data
 * carries.
 */
const coverLetterEs: CoverLetter = {
  kicker: "Carta de presentación",
  updated: "noviembre de 2026",
  salutation: "Hola,",
  paragraphs: [
    "Soy diseñador de producto y también programo. En la práctica, eso significa que casi nunca entrego una especificación y me siento a esperar. Construyo una versión que funciona, la pongo frente a quienes la van a usar y sigo pendiente de ella después del lanzamiento.",
    "Mi último rol fue Head of Product en Naowee, donde digitalizamos la inspección, vigilancia y control del sistema deportivo colombiano: cerca de 1.200 organizaciones y 30 trámites que vivían en archivos de Word y correos. Antes de dibujar una sola pantalla mapeé más de 45 estados y 15 roles. Después construí los flujos como prototipos y los revisé, historia por historia, con los analistas que tienen que aprobarlos. Los desacuerdos salieron temprano, cuando todavía era barato resolverlos.",
    "Antes de Naowee trabajé en Andes, el sistema de diseño de Mercado Libre, que usan más de 400 diseñadores y 2.000 ingenieros en 18 países. A esa escala, un cambio pequeño en un componente puede romper decenas de pantallas que nunca vas a ver. Ahí aprendí a cuidar los detalles sobre los que otros construyen, y a escribir solo las reglas que de verdad se pueden cumplir en código.",
    "Uso IA todos los días y reviso lo que hace. En olbo, una app de presupuesto que diseñé y construí, rehíce toda la interfaz con ayuda de IA sin tocar la lógica del presupuesto: las 647 pruebas tenían que seguir pasando antes de publicar cualquier cosa.",
    "Si tu equipo necesita a alguien que lleve una idea desde un boceto hasta algo que la gente pueda usar, me encantaría conversar.",
  ],
  signoff: "Un saludo,",
  note: "Esta es mi carta general. Cuéntame del cargo y te escribo una pensada para él.",
};

export function getCoverLetter(locale: Locale): CoverLetter {
  return locale === "es" ? coverLetterEs : coverLetter;
}

/**
 * The same letter as plain text, for the copy button — a recruiter's form or
 * an email body, not a screenshot of a web page.
 */
export function coverLetterText(locale: Locale = "en"): string {
  const { salutation, paragraphs, signoff } = getCoverLetter(locale);
  const site = getSite(locale);
  return [
    salutation,
    "",
    paragraphs.join("\n\n"),
    "",
    signoff,
    site.name,
    `${site.email} · ${site.domain}`,
  ].join("\n");
}
