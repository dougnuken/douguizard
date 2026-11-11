"use client";

import Link from "next/link";
import RevealText from "@/components/text/RevealText";
import type { CaseMeta, CaseStudy } from "@/data/work";
import { localePath } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { tituloHojaId } from "@/components/hoja/ids";
import CaseMetaFicha from "./CaseMeta";

const fold = (s: string) => s.trim().toLowerCase();

/**
 * La portada del caso (02 §5.3, `caso.html`): miga `Trabajo / {proyecto}`, y
 * en la rejilla de 12 el título (ceja · `h1` a 120 · gancho) en col 1–7 y la
 * ficha en col 8–12, alineados abajo.
 *
 * La ceja es para quién y qué fue Doug (cliente · rol, de `getCaseMeta`): las dos
 * primeras preguntas de quien recluta, encima del título.
 *
 * En la hoja (F6) el título baja a `h2` (el documento ya tiene su `h1`) con el
 * id que nombra el `<dialog>`, sin miga (la cabecera de la hoja trae la suya) y
 * sin revelado: el texto viaja con el panel (06-CRITICA-F6 P1-4).
 */
export default function CaseHeader({
  study,
  corto,
  meta,
  enHoja = false,
}: {
  study: Pick<CaseStudy, "project" | "slug" | "tagline" | "platforms">;
  /** `getShortName(study)`, calculado en el servidor para no meter los datos de casos en el JS de cliente. */
  corto: string;
  meta: CaseMeta;
  enHoja?: boolean;
}) {
  const dict = useDict();
  const t = dict.case;
  const locale = useLocale();

  // P1-1 (06-CRITICA-F7): el título es el nombre corto (el de la miga), a 120
  // como en la maqueta; el descriptor del `project` («— Plataforma del sector
  // deportivo») lo dice ya el gancho, así que en pantalla se omite y queda solo
  // para lectores de pantalla y buscadores (`<title>` y OG siguen con `project`).
  const resto = study.project.startsWith(corto) ? study.project.slice(corto.length) : "";
  const showClient = fold(meta.client) !== fold(corto) && fold(meta.client) !== fold(study.project);
  const ceja = [showClient ? meta.client : null, meta.role.replace(/ · /g, " · ")].filter(Boolean).join(" · ");
  // Red para nombres cortos de verdad largos («Multi-client UX Design»): bajan
  // un paso. «Banco de Occidente» (18) cabe a 120 en dos líneas.
  const largo = corto.length > 18 ? "" : undefined;
  const tituloId = enHoja ? tituloHojaId(study.slug) : "caso-titulo";

  return (
    <>
      {!enHoja && (
        <nav aria-label={t.breadcrumb} className="caso-miga">
          <Link href={localePath(locale, "/work")}>{dict.dock.trabajo}</Link>
          <span aria-hidden="true">/</span>
          <b translate="no">{corto}</b>
        </nav>
      )}

      <header className="caso-portada">
        <div className="caso-titulo">
          <p className="ceja">{ceja}</p>
          {enHoja ? (
            <>
              <h2 id={tituloId} className="caso-h1" data-largo={largo}>
                <span translate="no">{corto}</span>
                {resto && <span className="sr-only">{resto}</span>}
              </h2>
              <p className="gancho">{study.tagline}</p>
            </>
          ) : (
            <>
              <h1 className="caso-h1" data-largo={largo} id={tituloId}>
                <RevealText as="span" variant="mask" delay={0.05} className="block">
                  <span translate="no">{corto}</span>
                </RevealText>
                {resto && <span className="sr-only">{resto}</span>}
              </h1>
              <RevealText as="p" variant="fade" delay={0.2} className="gancho">
                {study.tagline}
              </RevealText>
            </>
          )}
        </div>
        <CaseMetaFicha meta={meta} platforms={study.platforms} t={t.meta} />
      </header>
    </>
  );
}
