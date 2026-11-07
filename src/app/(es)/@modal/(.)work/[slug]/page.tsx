import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, getShortName } from "@/data/work";
import CaseBody from "@/components/case/CaseBody";
import { tituloHojaId } from "@/components/hoja/ids";
import CaseSheet from "@/components/hoja/CaseSheet";

/**
 * `/work/[slug]` interceptado (navegación blanda dentro del idioma): el caso
 * en la hoja, sobre la página de la que se viene (F6, 07 §1.2). Prerenderizado
 * como la página completa, para que abrir no pida nada que el prefetch no traiga.
 */
export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug, "es");
  // Slug inexistente: el mismo 404 de caso que la carga directa (07 §1.2, punto 4).
  if (!study) notFound();
  return (
    <CaseSheet slug={study.slug} proyecto={getShortName(study)} tituloId={tituloHojaId(study.slug)}>
      <CaseBody study={study} locale="es" enHoja />
    </CaseSheet>
  );
}
