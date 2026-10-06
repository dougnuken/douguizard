import type { Metadata } from "next";
import { caseStudies } from "@/data/work";
import CasePage from "@/components/pages/CasePage";
import { caseMetadata } from "@/lib/metadata";

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
  return caseMetadata("en", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CasePage slug={slug} locale="en" />;
}
