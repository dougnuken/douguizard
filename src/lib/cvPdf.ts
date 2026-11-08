import { decisiones } from "@/data/decisiones";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";

/** El PDF del CV que ofrece cada idioma en las páginas B (D · `pdfPorIdioma`). */
export function pdfCv(locale: Locale): string {
  const cv = getSite(locale).cv;
  const pdf = decisiones.pdfPorIdioma[locale] === "con-foto" ? cv.pdf : cv.pdfNoPhoto;
  return pdf ?? cv.path;
}
