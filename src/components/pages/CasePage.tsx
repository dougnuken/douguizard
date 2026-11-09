import { notFound } from "next/navigation";
import { getCaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";
import { caseJsonLd } from "@/lib/caseJsonLd";
import CaseBody from "@/components/case/CaseBody";
import SiteFooter from "@/components/chrome/SiteFooter";
import DockMovil from "@/components/chrome/DockMovil";
import RailAcciones from "@/components/chrome/RailAcciones";
import { IconosSprite } from "@/components/sistema/Iconos";

/**
 * La página completa de un caso: `CaseBody` dentro de la única `<main>` del
 * documento, más el JSON-LD del caso. Lleva el cromo de las páginas B (rail a
 * la izquierda en escritorio, dock en móvil, que en un caso ofrece
 * «Secciones»); el pie es el colofón del caso. La hoja (F6) usa el mismo
 * `CaseBody` con `enHoja` y sin nada de esto.
 */
export default function CasePage({ slug, locale }: { slug: string; locale: Locale }) {
  const study = getCaseStudy(slug, locale);
  if (!study) notFound();

  return (
    <>
      <RailAcciones locale={locale} />
      <div className="min-h-svh bg-[var(--vacio)]">
        <main id="main" tabIndex={-1}>
          <IconosSprite />
          <CaseBody study={study} locale={locale} />
        </main>
        <SiteFooter locale={locale} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(study, locale)) }}
        />
      </div>
      <DockMovil />
    </>
  );
}
