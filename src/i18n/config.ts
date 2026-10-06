/**
 * The two languages the site is written in.
 *
 * Spanish is the primary language and lives at the root — `/`, `/work/olbo`,
 * `/cv` — because it is the language Doug works and hires in. English is the
 * mirror, one segment down: `/en`, `/en/work/olbo`, `/en/cv`. Every page exists
 * in both, at the same path apart from that prefix, so the switch in the header
 * can always take a reader to the same page in the other language.
 *
 * The URL is the only place the choice is stored. No cookie, no redirect on
 * `Accept-Language`: a link shared in Spanish opens in Spanish for everyone,
 * and every page stays a static file on the CDN.
 */
export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** `<html lang>`, `hreflang` and JSON-LD `inLanguage`. */
export const htmlLang: Record<Locale, string> = { es: "es", en: "en" };

/** Open Graph wants a territory, and the Spanish here is Colombian. */
export const ogLocale: Record<Locale, string> = { es: "es_CO", en: "en_US" };

/** The language's own name for itself — what the switch announces. */
export const localeName: Record<Locale, string> = { es: "Español", en: "English" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The other one. Two languages, so the switch is a toggle, not a menu. */
export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/**
 * A site path in a given language. `path` is written once, unprefixed:
 *
 *   localePath("es", "/work/olbo") → "/work/olbo"
 *   localePath("en", "/work/olbo") → "/en/work/olbo"
 *   localePath("en", "/")          → "/en"
 *   localePath("en", "/#work")     → "/en#work"
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/**
 * The inverse: which language a pathname is in, and the path without its
 * prefix. `/en` and `/en/…` are English; everything else is Spanish.
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/en" || pathname === "/en/") return { locale: "en", path: "/" };
  if (pathname.startsWith("/en/")) return { locale: "en", path: pathname.slice(3) };
  return { locale: "es", path: pathname || "/" };
}

/**
 * `alternates` for a page's metadata: its canonical in this language, and the
 * `hreflang` pair pointing at both, with Spanish as the default for anyone
 * whose language is neither.
 */
export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      es: localePath("es", path),
      en: localePath("en", path),
      "x-default": localePath("es", path),
    },
  };
}
