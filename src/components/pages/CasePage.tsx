import { notFound } from "next/navigation";
import { getCaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";
import { caseJsonLd } from "@/lib/caseJsonLd";
import CaseBody from "@/components/case/CaseBody";

/**
 * La página completa de un caso: `CaseBody` dentro de la única `<main>` del
 * documento, más el JSON-LD del caso. La hoja (F6) usa el mismo `CaseBody` con
 * `enHoja` y sin nada de esto.
 */
export default function CasePage({ slug, locale }: { slug: string; locale: Locale }) {
  const study = getCaseStudy(slug, locale);
  if (!study) notFound();

  return (
    <div className="min-h-svh">
      <main id="main" tabIndex={-1}>
        <CaseBody study={study} locale={locale} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(study, locale)) }}
      />
    </div>
  );
}
