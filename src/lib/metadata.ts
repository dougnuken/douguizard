import type { Metadata } from "next";
import { getSite, site as baseSite } from "@/data/site";
import { getCv } from "@/data/cv";
import { getCaseMeta, getCaseStudy } from "@/data/work";
import { yearsOfExperience } from "@/lib/career";
import { alternatesFor, localePath, ogLocale, otherLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

const ORIGIN = `https://${baseSite.domain}`;

/**
 * Everything a page inherits: the title template, the author, the default
 * share card. Set by each language's root layout. A page's own `openGraph`
 * replaces this one whole (Next merges metadata one key deep), which is why
 * the page-level builders below restate the parts they keep.
 */
export function rootMetadata(locale: Locale): Metadata {
  const site = getSite(locale);
  const title = `${site.name} — ${site.headline}`;
  return {
    metadataBase: new URL(ORIGIN),
    title: { default: title, template: `%s · ${site.name}` },
    description: site.seo.description,
    keywords: site.seo.keywords,
    applicationName: site.brand,
    authors: [{ name: site.name, url: ORIGIN }],
    creator: site.name,
    publisher: site.name,
    openGraph: {
      type: "profile",
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      url: `${ORIGIN}${localePath(locale, "/")}`,
      siteName: site.brand,
      title,
      description: site.seo.description,
      firstName: "Doug",
      lastName: "Vargas",
      username: "douguizard",
      images: [
        {
          // ⚠️ Build B generates public/og.png (08-assets.md). The reference is
          // fixed here so the contract cannot drift.
          url: site.seo.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.seo.description,
      images: [site.seo.ogImage],
      // No handle: Doug has no X account on record.
      // ⚠️ CONFIRMAR DOUG — add only if one exists.
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "design",
    // ⚠️ CONFIRMAR DOUG — Search Console verification token, if Doug has one.
  };
}

/** The home page: the root defaults plus its own canonical and `hreflang` pair. */
export function homeMetadata(locale: Locale): Metadata {
  return { alternates: alternatesFor(locale, "/") };
}

export function cvMetadata(locale: Locale): Metadata {
  const site = getSite(locale);
  const t = getDict(locale).cv;
  // Computed, so adding an employer to cv.ts updates the description with no
  // second edit. That is the whole point of the field.
  const companies = getCv(locale)
    .experiences.filter((e) => e.era !== "earlier")
    .map((e) => e.company.name)
    .join(", ");
  return {
    title: t.title(site.headline),
    description: t.description({ name: site.name, years: yearsOfExperience(), companies }),
    alternates: alternatesFor(locale, "/cv"),
    openGraph: {
      type: "profile",
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      url: `${ORIGIN}${site.cv.path}`,
      title: `${site.name} — CV`,
      description: `${site.headline}. ${site.seo.description}`,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: `${site.name} — CV` }],
    },
    robots: { index: true, follow: true },
  };
}

export function caseMetadata(locale: Locale, slug: string): Metadata {
  const study = getCaseStudy(slug, locale);
  if (!study) {
    return {
      title: getDict(locale).case.notFound.kicker,
      robots: { index: false, follow: false },
    };
  }

  const meta = getCaseMeta(study.slug, locale);
  // "Banco de Occidente — Banco de Occidente" stutters, and so does "Qrvey —
  // AutomatiQ — Qrvey" now that a case can name its brand: a project that
  // already opens with its client's name keeps it once.
  const title = study.project.toLowerCase().startsWith(meta.client.toLowerCase())
    ? study.project
    : `${study.project} — ${meta.client}`;
  const path = `/work/${study.slug}`;
  const site = getSite(locale);

  return {
    title,
    description: study.tagline,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "article",
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      url: localePath(locale, path),
      title,
      description: study.tagline,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description: study.tagline },
  };
}
