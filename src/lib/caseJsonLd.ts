import { site } from "@/data/site";
import { getCaseMeta, type CaseStudy } from "@/data/work";
import { localePath, type Locale } from "@/i18n/config";

const SITE_URL = `https://${site.domain}`;

/**
 * A `BreadcrumbList` for a case study.
 *
 * Two rungs, not three. There is no `/work` index route — the work section is
 * a panel of the home page — and a breadcrumb that points at a fragment is a
 * breadcrumb that leads somewhere a crawler cannot treat as a page. Home, then
 * the case, is the trail that is actually true.
 *
 * Deliberately NOT a `CreativeWork`: several of these engagements are
 * client-owned or NDA-shaped, and asserting authorship of them in machine
 * -readable form is a decision for Doug rather than a default.
 */
export function caseJsonLd(study: CaseStudy, locale: Locale = "en") {
  const meta = getCaseMeta(study.slug, locale);
  const home = localePath(locale, "/");
  const name =
    study.project === meta.client ? study.project : `${study.project} — ${meta.client}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: site.name,
        item: home === "/" ? SITE_URL : `${SITE_URL}${home}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${SITE_URL}${localePath(locale, `/work/${study.slug}`)}`,
      },
    ],
  };
}
