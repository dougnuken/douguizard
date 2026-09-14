import type { Metadata } from "next";
import { caseStudies, getCaseMeta, getCaseStudy } from "@/data/work";
import { caseJsonLd } from "@/lib/caseJsonLd";
import { site } from "@/data/site";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

/*
 * `dynamicParams` is left at its default, on purpose, and it was worth trying
 * the other way to find out why. Turning it off does 404 an unknown slug
 * without rendering anything — but Next reaches that 404 by throwing
 * `NoFallbackError` internally, which lands in the production logs as an error
 * on every mistyped URL, and the reader gets a bare 404 instead of the case
 * -study one sitting in `not-found.tsx`. A render per made-up URL is the
 * cheaper of the two prices.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    return { title: "Case study not found", robots: { index: false, follow: false } };
  }

  const meta = getCaseMeta(study.slug);
  // "Banco de Occidente — Banco de Occidente" stutters, so a case whose
  // project and client are the same word keeps one of them.
  const title =
    study.project === meta.client ? study.project : `${study.project} — ${meta.client}`;
  const url = `/work/${study.slug}`;

  return {
    title,
    description: study.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: study.tagline,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description: study.tagline },
  };
}

export default async function WorkSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  return (
    <div className="min-h-svh">
      {children}
      {study ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(study)) }}
        />
      ) : null}
    </div>
  );
}
