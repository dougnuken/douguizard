import { site } from "@/data/site";
import { certifications, education, skills } from "@/data/cv";
import { currentExperience } from "@/lib/career";

const SITE_URL = `https://${site.domain}`;

/**
 * The JSON-LD `Person`, built from `site` and `cv` so it can never drift from
 * what the page says. `WebSite` is deliberately not emitted: there is no site
 * search, so a SearchAction would be a lie, and a second top-level entity
 * dilutes the Person. Case studies are not emitted as CreativeWork in phase 1 —
 * several are NDA-shaped or client-owned.
 */
export function personJsonLd() {
  const current = currentExperience();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: site.name,
    alternateName: site.brand,
    url: SITE_URL,
    // `image` is omitted on purpose: the only portrait on file is a 190 px
    // crop from the PDF. ⚠️ CONFIRMAR DOUG — add only with a usable original.
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
