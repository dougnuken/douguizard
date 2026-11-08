import { getSite, site } from "@/data/site";
import { getCv } from "@/data/cv";
import { currentExperience } from "@/lib/career";
import { htmlLang, localePath, type Locale } from "@/i18n/config";

const SITE_URL = `https://${site.domain}`;

/**
 * The `Person` node, without a context of its own so it can be dropped into a
 * `@graph` beside another node. Built from `site` and `cv`, so it can never
 * drift from what the page says.
 *
 * `WebSite` is deliberately not emitted: there is no site search, so a
 * SearchAction would be a lie, and a second top-level entity dilutes the
 * Person. Case studies are still not emitted as CreativeWork — several are
 * NDA-shaped or client-owned, and that is Doug's call to make, not a gap.
 */
export function personNode(locale: Locale = "en") {
  const current = currentExperience();
  const site = getSite(locale);
  const { certifications, education, skills } = getCv(locale);

  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: site.name,
    alternateName: site.brand,
    url: SITE_URL,
    // There is a usable original now — the 900px master the About panel and
    // the CV masthead are both cut from — so the Person carries a face. It is
    // what a knowledge panel shows, and an entity without one is harder for
    // Google to reconcile with the same name on LinkedIn and Behance.
    image: `${SITE_URL}/portrait/doug-portrait-900.webp`,
    jobTitle: site.headline,
    description: site.seo.description,
    email: `mailto:${site.email}`,
    telephone: site.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: "CO",
    },
    worksFor: { "@type": "Organization", name: current.company.name },
    alumniOf: education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.institution,
    })),
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
    knowsAbout: skills.flatMap((g) =>
      g.items.filter((i) => i.primary).map((i) => i.label),
    ),
    knowsLanguage: [
      { "@type": "Language", name: "Spanish" },
      { "@type": "Language", name: "English" },
    ],
    sameAs: site.social.map((s) => s.href),
  };
}

/** The root document's structured data: one Person, one context. */
export function personJsonLd(locale: Locale = "en") {
  return { "@context": "https://schema.org", ...personNode(locale) };
}

/**
 * `/cv`'s structured data.
 *
 * A `ProfilePage` whose `mainEntity` is the Person, and the Person itself
 * alongside it in the same `@graph` — a bare `@id` reference to a node defined
 * on a different URL is a reference to nothing as far as a parser walking this
 * page alone is concerned.
 */
export function cvJsonLd(locale: Locale = "en") {
  const site = getSite(locale);
  const home = localePath(locale, "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(locale),
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}${site.cv.path}#profile`,
        url: `${SITE_URL}${site.cv.path}`,
        name: `${site.name} — CV`,
        description: site.summary,
        inLanguage: htmlLang[locale],
        mainEntity: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@type": "WebPage", "@id": `${SITE_URL}${home === "/" ? "/" : home}` },
      },
    ],
  };
}

/**
 * `/about`: un `ProfilePage` cuyo `mainEntity` es el mismo Person que `/cv`
 * (mismo `@id`, E2). Dos `ProfilePage` con el mismo `mainEntity` son válidos:
 * el perfil y el CV son dos páginas sobre la misma persona.
 */
export function aboutJsonLd(locale: Locale, descripcion: string) {
  const site = getSite(locale);
  const path = localePath(locale, "/about");
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(locale),
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}${path}#profile`,
        url: `${SITE_URL}${path}`,
        name: site.name,
        description: descripcion,
        inLanguage: htmlLang[locale],
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}

/** `/work`: un `ItemList` con los casos en el orden visible (/01…/10). */
export function workIndexJsonLd(locale: Locale, slugs: readonly string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${localePath(locale, "/work")}#casos`,
    inLanguage: htmlLang[locale],
    numberOfItems: slugs.length,
    itemListElement: slugs.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${localePath(locale, `/work/${slug}`)}`,
    })),
  };
}
