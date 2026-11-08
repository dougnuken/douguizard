import { decisiones } from "@/data/decisiones";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";
import IrASeccionLink from "./IrASeccionLink";
import RelojBaq from "./RelojBaq";

/**
 * K5 + K6 fusionadas (P1-5): hora local de Barranquilla, lugar, la línea del
 * cargo y «Escríbeme» → `#contact`. La disponibilidad ya está en K2.
 */
export default function CardContacto({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = tableroDict[locale].k5;
  const estado = tableroDict[locale].k2.estado[decisiones.disponibilidad];
  return (
    <article className="losa losa--losa tarjeta k5">
      <div className="k5-info">
        <RelojBaq iata={s.location.iata} h12={t.h12} aria={t.relojAria("{hora}")} ariaSinHora={t.relojSinHora} />
        <p className="etiqueta">
          {s.location.city}, {s.location.country} · {s.location.timezone}
        </p>
        <p className="etiqueta">{s.availability.label}</p>
      </div>
      <IrASeccionLink seccion="contact" className="boton boton--blanco k5-boton" aria-label={estado ? t.aria(estado) : undefined}>
        {t.boton}
      </IrASeccionLink>
    </article>
  );
}
