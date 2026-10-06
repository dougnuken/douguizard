import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/work";
import { localePath } from "@/i18n/config";

const BASE = "https://douguizard.com";

/**
 * Every page in both languages, each entry carrying its `hreflang` pair so a
 * crawler learns the two versions are one page, not duplicates of each other.
 */
/** The bare origin for the Spanish home, matching its canonical — no trailing slash. */
const abs = (path: string) => (path === "/" ? BASE : `${BASE}${path}`);

function entry(path: string): MetadataRoute.Sitemap {
  const languages = { es: abs(localePath("es", path)), en: abs(localePath("en", path)) };
  return [
    { url: languages.es, alternates: { languages } },
    { url: languages.en, alternates: { languages } },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("/"),
    ...entry("/cv"),
    ...caseStudies.flatMap((c) => entry(`/work/${c.slug}`)),
  ];
}
