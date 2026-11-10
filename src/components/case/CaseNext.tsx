"use client";

import Link from "next/link";
import type { CaseMeta, CaseStudy } from "@/data/work";
import { localePath } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import DotMatrix from "@/components/sistema/DotMatrix";
import Boton from "@/components/sistema/Boton";
import Losa from "@/components/sistema/Losa";
import { FadeIn } from "./primitives";

/**
 * Siguiente caso (02 §5.3, punto 12; D19: sigue `num`) y «Hablemos»: la losa
 * azul del siguiente con sus cifras en Doto, y a su lado una losa clara para
 * escribir.
 *
 * En la página completa el enlace es un `<a>` (documento nuevo, con su
 * `@view-transition`); en la hoja, un `<Link replace>` que cambia de caso sin
 * apilar historial (F6).
 */
export default function CaseNext({
  next,
  meta,
  enHoja = false,
}: {
  next: Pick<CaseStudy, "slug" | "project" | "kpis">;
  /** `getCaseMeta(next.slug, locale)`, calculado en el servidor (sin datos de casos en el JS de cliente). */
  meta: Pick<CaseMeta, "client" | "year">;
  enHoja?: boolean;
  tone?: unknown;
}) {
  const dict = useDict();
  const t = dict.case;
  const locale = useLocale();
  const cifras = (next.kpis ?? []).slice(0, 3);
  const href = localePath(locale, `/work/${next.slug}`);
  const nombre = (
    <>
      <span translate="no">{next.project}</span>
      <span className="sr-only">{t.readCase}</span>
    </>
  );

  return (
    <section className="bloque" aria-labelledby="caso-siguiente-h" data-siguiente="">
      <h2 id="caso-siguiente-h" className="ceja">
        {t.next}
      </h2>
      <FadeIn className="sig-fila">
        <Losa as="article" superficie="azul" radio="m" className="sig-card">
          <div>
            <p className="ceja">
              <span translate="no">{meta.client}</span> · {meta.year}
            </p>
            <h3 className="t-losa">
              {enHoja ? (
                <Link href={href} replace scroll={false} className="enlace-tarjeta">
                  {nombre}
                </Link>
              ) : (
                <a href={href} className="enlace-tarjeta">
                  {nombre}
                </a>
              )}
            </h3>
          </div>
          {cifras.length > 0 && (
            <div role="group" aria-label={cifras.map((k) => `${k.value} ${k.label}`).join(", ")}>
              <div className="sig-cifras" aria-hidden="true">
                {cifras.map((k) => (
                  <DotMatrix key={k.label} valor={k.value} tamano="l" />
                ))}
              </div>
            </div>
          )}
        </Losa>
        <Losa superficie="clara" radio="m" className="sig-contacto">
          <p className="t-losa" style={{ color: "var(--tinta-osc)" }}>
            {t.nextLine}
          </p>
          <div className="sig-cta">
            <Boton variante="tinta" href={localePath(locale, "/#contact")}>
              {dict.sistema.nav.hablemos}
            </Boton>
            <Boton variante="linea-osc" href={localePath(locale, "/work")}>
              {t.allWork}
            </Boton>
          </div>
        </Losa>
      </FadeIn>
    </section>
  );
}
