import "./paginas-b.css";
import { getSite } from "@/data/site";
import { localePath, otherLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import Boton from "@/components/sistema/Boton";

/**
 * El 404 de una dirección que ninguna ruta reconoce, en el sistema B (F7):
 * lienzo oscuro, ceja, titular en Urbanist y las tres salidas de 04 §4.5
 * («Ir al inicio · Ver casos · CV»). Sin el chiste de la máscara: ya no hay
 * máscara (D17, «Aquí no hay nada.»). La línea de abajo lleva al otro idioma.
 */
export default function NotFoundContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).notFound;
  const site = getSite(locale);
  const other = otherLocale(locale);
  const o = getDict(other).notFound;
  return (
    <>
      <meta name="robots" content="noindex, follow" />
      <main id="main" tabIndex={-1} className="pagina-b min-h-svh" data-404="">
        <div className="resplandor" aria-hidden="true" />
        <div className="pagina">
          <div className="contenido flex min-h-[calc(100svh-var(--cabecera)-96px)] max-w-[900px] flex-col justify-center">
            <p className="ceja">{t.kicker}</p>
            <h1 className="t-pagina mt-4">{t.title}</h1>
            <p className="lead mt-6">{t.body(site.domain)}</p>
            <div className="mt-10 flex flex-wrap gap-2">
              <Boton variante="blanco" href={localePath(locale, "/")}>
                {t.home}
              </Boton>
              <Boton variante="linea" href={localePath(locale, "/work")}>
                {t.work}
              </Boton>
              <Boton variante="linea" href={site.cv.path}>
                {t.cv}
              </Boton>
            </div>
            <p lang={other} className="micro mt-12">
              {o.kicker} ·{" "}
              <a href={localePath(other, "/")} hrefLang={other} className="enlace-texto">
                {o.home}
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
