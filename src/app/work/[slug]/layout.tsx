import type { Metadata } from "next";
import { caseStudies, getCaseMeta, getCaseStudy } from "@/data/work";
import { site } from "@/data/site";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

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

export default function WorkSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-svh">{children}</div>;
}
