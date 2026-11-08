import Estado from "@/components/sistema/Estado";
import { Icono } from "@/components/sistema/Iconos";
import { decisiones } from "@/data/decisiones";
import { getSite } from "@/data/site";
import { getCaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";
import { pdfCv } from "@/lib/cvPdf";
import IrASeccionLink from "./IrASeccionLink";

/**
 * K2 · claim + rol (04 §2.2): el `h1` del home se oye «Doug Vargas. Dirijo el
 * producto. Después, lo construyo.». Losa blanca en el OS de escritorio; vidrio
 * oscuro sobre la foto en móvil. El nombre visible solo va en móvil (en
 * escritorio lo dice K1: un nombre por pantalla, P1-4). La disponibilidad sale
 * aquí una vez (P1-5). Los países se leen del KPI de Andes.
 */
export default function K2Claim({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = tableroDict[locale].k2;
  const paises = getCaseStudy("mercadolibre-andes", locale)?.kpis?.[2]?.value ?? "";
  return (
    <article className="losa tarjeta k2">
      <div className="k2-cont">
        <div className="k2-fila">
          <span className="k2-nombre" aria-hidden="true">
            {s.name}
          </span>
          {t.estado[decisiones.disponibilidad] && (
            <Estado className="k2-estado">
              <span title={s.availability.note}>{t.estado[decisiones.disponibilidad]}</span>
            </Estado>
          )}
        </div>
        <h1 className="k2-h1">
          <span className="sr-only">{s.name}. </span>
          <span className="claim">{t.claim}</span>
        </h1>
        <p className="nivel">{s.headline}</p>
        <p className="sub">{t.sub(paises)}</p>
      </div>
      <div className="k2-cta">
        <IrASeccionLink seccion="work" className="boton cta-1">
          {t.verCasos}
        </IrASeccionLink>
        <a className="boton cta-2" href={pdfCv(locale)} download aria-label={t.cvAria}>
          <Icono nombre="bajar" />
          <span>{t.cv}</span>
        </a>
      </div>
    </article>
  );
}
