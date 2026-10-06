import type { Locale } from "@/i18n/config";

export interface Section {
  /** Anchor + skip-link target. */
  id: string;
  /** "00".."04" */
  num: string;
  /** SectionIndex + header nav. */
  label: string;
  /** Panel heading. */
  title: string;
}

/**
 * The home panels, in document order. Shared by `app/page.tsx` (which renders
 * them) and `SectionIndex` (which indexes them), so the rail can never drift
 * from the panels again.
 */
export const sections: Section[] = [
  { id: "home", num: "00", label: "Home", title: "Doug Vargas" },
  { id: "work", num: "01", label: "Work", title: "Selected work" },
  { id: "craft", num: "02", label: "Craft", title: "How I work" },
  { id: "about", num: "03", label: "About", title: "About" },
  { id: "contact", num: "04", label: "Contact", title: "Let's talk" },
];

/**
 * The same five panels in Spanish. Ids and numbers never change with the
 * language — `#work` is `#work` in both — so an anchor survives the switch.
 */
const sectionsEs: Section[] = [
  { id: "home", num: "00", label: "Inicio", title: "Doug Vargas" },
  { id: "work", num: "01", label: "Trabajo", title: "Trabajo seleccionado" },
  { id: "craft", num: "02", label: "Oficio", title: "Cómo trabajo" },
  { id: "about", num: "03", label: "Sobre mí", title: "Sobre mí" },
  { id: "contact", num: "04", label: "Contacto", title: "Hablemos" },
];

export function getSections(locale: Locale): Section[] {
  return locale === "es" ? sectionsEs : sections;
}
