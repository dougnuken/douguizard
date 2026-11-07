import "@/components/pages/paginas-b.css";
import "./caso.css";
import { getCaseMeta, getNextCaseStudy, type CaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { hasShowcase, planCaseMedia } from "@/lib/caseMedia";
import { VIGNETTES } from "@/components/vignettes/registry";

import CaseHeader from "@/components/case/CaseHeader";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNda from "@/components/case/CaseNda";
import CaseImpact from "@/components/case/CaseImpact";
import CaseNarrative from "@/components/case/CaseNarrative";
import CaseTestimonial from "@/components/case/CaseTestimonial";
import CaseGallery from "@/components/case/CaseGallery";
import CaseFeatures from "@/components/case/CaseFeatures";
import CaseProcess from "@/components/case/CaseProcess";
import CaseDecisions from "@/components/case/CaseDecisions";
import CaseColophon from "@/components/case/CaseColophon";
import CaseNext from "@/components/case/CaseNext";
import CaseIndice, { type EntradaIndice } from "@/components/case/CaseIndice";
import HojaSecciones from "@/components/case/HojaSecciones";
import { RegistrarLeido } from "@/components/trabajo/Leido";
import { CaseChapter, CaseCover, CaseFilm } from "@/components/case/CaseStory";
import { WalkthroughFilm } from "@/components/case/caseFrames";
import { CabBloque } from "@/components/case/primitives";

/**
 * Un caso, compuesto, en un idioma: la misma pieza en la página completa y en
 * la hoja (F6), en el sistema B (F7, `propuestas/B-paginas/caso.html`).
 *
 * El orden es el de 02 §5.3 y es el del DOM y del Tab:
 *
 *   miga → portada (título + ficha) → captura a sangre → impacto → problema →
 *   mi parte → decisiones → producto (película, capítulos, galería, funciones)
 *   → proceso → testimonio → colofón → siguiente caso
 *
 * Un bloque sin datos no se pinta, y su entrada del índice tampoco. La captura
 * a sangre la ocupa, si no hay pantallas, la cubierta (casos largos), el aviso
 * de NDA (con su viñeta y el jelly azul) o el testimonio (Royal Caribbean, que
 * no tiene otra prueba: ahí sube y no se repite abajo).
 *
 * En la hoja: sin índice lateral (el progreso va en el hilo de la cabecera de
 * la hoja), columna única, título `h2` a 72, y nada de la primera pantalla se
 * revela por su cuenta (06-CRITICA-F6 P1-4). Las anclas llevan el prefijo
 * `hoja-` para no chocar con la página de debajo.
 */
export default function CaseBody({
  study,
  locale,
  enHoja = false,
}: {
  study: CaseStudy;
  locale: Locale;
  enHoja?: boolean;
}) {
  const dict = getDict(locale);
  const t = dict.case;
  const meta = getCaseMeta(study.slug, locale);
  const next = getNextCaseStudy(study.slug, locale);
  const media = planCaseMedia(study);
  const showcase = hasShowcase(media);
  const pre = enHoja ? "hoja-" : "";
  const id = (s: string) => `${pre}${s}`;

  // `links` manda sobre `externalLink`; los dos viven ahora en el colofón.
  const enlaces = study.links?.length ? study.links : study.externalLink ? [study.externalLink] : undefined;

  const nda = study.nda && !study.gallery?.length;
  const vignette = nda ? VIGNETTES[study.slug] : undefined;
  const proofFirst = !showcase && !nda && study.testimonialId ? study.testimonialId : undefined;

  // La película de un producto de escritorio ya no abre la página: se ve aquí,
  // en Producto, bajo su titular (06-CRITICA-F7 P1-2).
  const pelicula = media.video && media.videoKind === "browser" ? media.video : undefined;
  const hayProducto = Boolean(
    pelicula || study.film || study.story?.length || media.rest.length || study.features?.length,
  );
  const entradas: EntradaIndice[] = [
    { id: id("impacto"), label: study.kind === "side" ? t.idea : t.impact },
    { id: id("problema"), label: t.context },
    ...(study.contributions.length ? [{ id: id("parte"), label: t.whatIDid }] : []),
    ...(study.decisions?.length ? [{ id: id("decisiones"), label: t.decisions }] : []),
    ...(hayProducto ? [{ id: id("producto"), label: t.product }] : []),
    ...(study.process?.length ? [{ id: id("proceso"), label: t.howItHappened }] : []),
  ];

  const contenido = (
    <div className="caso-pieza">
      <div className="caso-ancho">
        <CaseHeader study={study} meta={meta} enHoja={enHoja} />
        {/* «Leído» en `/work`: una comodidad por visitante (04 §6.3). */}
        <RegistrarLeido slug={study.slug} />

        <div className="caso-cubierta" data-cubierta="">
          {showcase && <CaseShowcase project={study.project} plan={media} heading={!hayProducto} />}
          {!showcase && study.cover && <CaseCover cover={study.cover} heading={!hayProducto} />}
          {proofFirst && <CaseTestimonial tone="raised" id={proofFirst} />}
          {nda && (
            <CaseNda
              body={t.ndaBody}
              visual={vignette && <vignette.Component locale={locale} />}
              visualCaption={vignette && dict.work.vignettes[vignette.key].caption}
            />
          )}
        </div>

        <div className="caso-cuerpo">
          {!enHoja && <CaseIndice entradas={entradas} label={t.sections} />}
          <div className="caso-secciones">
            <CaseImpact id={id("impacto")} impact={study.impact} kpis={study.kpis} kind={study.kind} />
            <CaseNarrative
              idProblema={id("problema")}
              idParte={id("parte")}
              context={study.context}
              heads={study.heads}
              contributions={study.contributions}
            />
            {study.decisions?.length ? (
              <CaseDecisions id={id("decisiones")} decisions={study.decisions} titular={study.heads?.decisions} />
            ) : null}

            {hayProducto && (
              <div
                id={id("producto")}
                className="bloque-grupo"
                data-producto=""
                role="region"
                aria-labelledby={id("producto-h")}
              >
                <CabBloque id={id("producto-h")} rotulo={t.product} titular={study.heads?.product} />
                {pelicula && <WalkthroughFilm video={pelicula} />}
                {study.film && <CaseFilm tone="paper" film={study.film} />}
                {study.story?.map((chapter, i) => (
                  <CaseChapter key={chapter.id} tone="paper" chapter={chapter} index={i} />
                ))}
                {media.rest.length > 0 && (
                  <CaseGallery tone="paper" project={study.project} shots={media.rest} kind={media.galleryKind} />
                )}
                {study.features?.length ? (
                  <CaseFeatures tone="paper" intro={study.featuresIntro} features={study.features} />
                ) : null}
              </div>
            )}

            {study.process?.length ? (
              <CaseProcess id={id("proceso")} process={study.process} titular={study.heads?.process} />
            ) : null}
            {study.testimonialId && !proofFirst && <CaseTestimonial tone="paper" id={study.testimonialId} />}
            {(study.technologies?.length || enlaces || study.credits) && (
              <CaseColophon technologies={study.technologies} links={enlaces} credits={study.credits} enHoja={enHoja} />
            )}
            <CaseNext next={next} enHoja={enHoja} />
          </div>
        </div>
        <HojaSecciones entradas={entradas} enHoja={enHoja} />
      </div>
    </div>
  );

  // En la hoja, todo va dentro de un `<article>` (sin `<main>`: el documento ya
  // tiene el de la página de debajo).
  return enHoja ? (
    <article className="caso-b caso-en-hoja">{contenido}</article>
  ) : (
    <article className="caso-b" aria-labelledby="caso-titulo">
      {contenido}
    </article>
  );
}
