import type { Metadata } from "next";
import { getSite, site as baseSite } from "@/data/site";
import { getCv } from "@/data/cv";
import { getCaseMeta, getCaseStudy } from "@/data/work";
import { latestExperience, yearsOfExperience } from "@/lib/career";
import { casosPublicados, productosPropios } from "@/lib/cuentas";
import { enPalabras, paginasDict } from "@/i18n/paginas";
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
  const title = `${site.name} — ${site.titleHeadline}`;
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
          // `npm run og` (scripts/og/build-og.ts) hornea og.png (ES) y og-en.png (EN).
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
    title: t.title(site.titleHeadline),
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

/** Lo común de las páginas B: canonical + hreflang, Open Graph y tarjeta. */
function paginaMetadata(locale: Locale, path: string, titulo: string, descripcion: string): Metadata {
  const site = getSite(locale);
  const full = `${titulo} · ${site.name}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "profile",
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[otherLocale(locale)]],
      url: localePath(locale, path),
      siteName: site.brand,
      title: full,
      description: descripcion,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: full }],
    },
    twitter: { card: "summary_large_image", title: full, description: descripcion },
  };
}

/** `/work` (04 §4.6): la descripción se compone con `cuentas.ts`. */
export function workMetadata(locale: Locale): Metadata {
  const t = paginasDict[locale].trabajo.meta;
  return paginaMetadata(
    locale,
    "/work",
    t.titulo,
    t.descripcion(casosPublicados(), enPalabras(productosPropios().length, locale)),
  );
}

/** `/about` (04 §4.6): cargo y empresa del último rol de `cv.ts`. */
export function aboutDescripcion(locale: Locale): string {
  const actual = latestExperience();
  return paginasDict[locale].perfil.meta.descripcion(actual.role, actual.company.name);
}
export function aboutMetadata(locale: Locale): Metadata {
  return paginaMetadata(locale, "/about", paginasDict[locale].perfil.meta.titulo, aboutDescripcion(locale));
}

/**
 * `/experience` (04 §4.6): las empresas, de la más reciente hacia atrás, sin la
 * del último rol (va en «a Head of Product»), sin las primeras (`earlier`) y sin repetir
 * el empleador de registro (Qrvey va dentro de Ideaware).
 */
export function experienceMetadata(locale: Locale): Metadata {
  const actual = latestExperience();
  const vistas = new Set<string>();
  const nombres = getCv(locale)
    .experiences.filter((e) => e.era === "core" && e.id !== actual.id)
    .map((e) => e.company.name)
    .filter((n) => (vistas.has(n) ? false : (vistas.add(n), true)));
  const y = locale === "es" ? " e " : " and ";
  const lista = nombres.length > 1 ? `${nombres.slice(0, -1).join(", ")}${y}${nombres.at(-1)}` : nombres.join("");
  const t = paginasDict[locale].trayectoria.meta;
  return paginaMetadata(locale, "/experience", t.titulo, t.descripcion(actual.role, lista));
}
