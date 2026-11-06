import Boton from "@/components/sistema/Boton";
import { decisiones } from "@/data/decisiones";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { sistemaDict } from "@/i18n/sistema";
import { tableroDict } from "@/i18n/tablero";
import { currentExperience } from "@/lib/career";
import { pdfCv } from "@/lib/cvPdf";
import CopiarCorreo from "./CopiarCorreo";

/** K17 · contacto + CV (04 §3 K17): la sección `#contact` del home. */
export default function Contacto({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = tableroDict[locale].k17;
  const rail = sistemaDict[locale].sistema.rail;
  const conRoles = decisiones.disponibilidad === "roles" || decisiones.disponibilidad === "ambas";
  return (
    <section className="losa losa--clara tarjeta k17" id="contact" data-seccion="contact" aria-labelledby="h-contacto">
      <div>
        <h2 id="h-contacto">{t.h2}</h2>
        <p className="lead">{conRoles ? t.lead : t.leadSinRoles}</p>
      </div>
      <div className="correo-fila">
        <a className="correo" href={`mailto:${s.email}`}>
          {s.email}
        </a>
        <CopiarCorreo correo={s.email} textos={t.copiar} />
      </div>
      <div className="k17-enlaces">
        <div className="grupo">
          {s.social.map((r) => (
            <a key={r.label} className="boton boton--linea-osc externo" href={r.href} target="_blank" rel="noopener noreferrer" aria-label={rail.externo(r.label)}>
              {r.label} ↗
            </a>
          ))}
        </div>
        <div className="grupo">
          <Boton href={pdfCv(locale)} variante="tinta" descargar icono="bajar" aria-label={tableroDict[locale].k2.cvAria}>
            {tableroDict[locale].k2.cv}
          </Boton>
          {s.cv.letterPdf && (
            <Boton href={s.cv.letterPdf} variante="linea-osc" descargar>
              {t.carta}
            </Boton>
          )}
        </div>
      </div>
      <p className="etiqueta">{t.disponibilidad(currentExperience().company.name)}</p>
    </section>
  );
}
