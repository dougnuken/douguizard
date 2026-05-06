import { Metadata } from "next";
import { caseStudies, getCaseStudy } from "@/data/work";

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

  return {
    title: `${study.project} — ${study.client}`,
    description: study.tagline,
    openGraph: {
      title: `${study.project} — ${study.client}`,
      description: study.tagline,
    },
  };
}

export default function WorkSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
