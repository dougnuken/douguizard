import { Metadata } from "next";
import { caseStudies, getCaseMeta, getCaseStudy } from "@/data/work";

// Pre-render all case studies at build time
export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

// Per-case metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study Not Found" };

  const meta = getCaseMeta(study.slug);
  const title =
    study.project === meta.client ? study.project : `${study.project} — ${meta.client}`;

  return {
    title,
    description: study.tagline,
    openGraph: { title, description: study.tagline },
  };
}

export default function WorkSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-svh">{children}</div>;
}
