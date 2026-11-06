import "./paginas-b.css";
import "@/components/trabajo/trabajo.css";
import DockMovil from "@/components/chrome/DockMovil";
import RailAcciones from "@/components/chrome/RailAcciones";
import SiteFooter from "@/components/chrome/SiteFooter";
import { IconosSprite } from "@/components/sistema/Iconos";
import CardArchivo from "@/components/tablero/CardArchivo";
import CardCaso from "@/components/tablero/CardCaso";
import CardCifras from "@/components/tablero/CardCifras";
import FiltroCasos from "@/components/trabajo/FiltroCasos";
import { archivo, ordenCasos } from "@/data/home";
import type { Locale } from "@/i18n/config";
import { enPalabras, paginasDict } from "@/i18n/paginas";
import { aniosEnProducto, casosPublicados, productosPropios } from "@/lib/cuentas";
import { workIndexJsonLd } from "@/lib/personJsonLd";

/**
 * `/work` · índice de casos (07 F2, `work.html`). Orden del DOM = visual = Tab:
 * h1 + intro y «En cifras» → filtro (en el flujo) → losas protagonistas
 * (`home.ordenCasos`) → archivo (`home.archivo`). Numeración /01…/10 = posición
 * en esas dos listas (P1-1).
 */
export default function WorkIndexPage({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].trabajo;
  const total = casosPublicados();
  return (
    <>
      <RailAcciones locale={locale} />
      <main id="main" tabIndex={-1} className="pagina-b">
        <IconosSprite />
        <div className="resplandor" aria-hidden="true" />
        <div className="pagina">
          <div className="contenido">
            <header className="w-cab">
              <div className="w-titulo">
                <h1 className="t-pagina">{t.h1}</h1>
                <p className="lead">{t.intro(aniosEnProducto(), enPalabras(productosPropios().length, locale))}</p>
              </div>
              <CardCifras locale={locale} />
            </header>

            <FiltroCasos
              label={t.filtro.label}
              etiquetas={{
                todos: t.filtro.todos,
                escala: t.filtro.escala,
                propio: t.filtro.propios,
                anterior: t.filtro.anteriores,
              }}
              anuncio={Array.from({ length: total + 1 }, (_, n) => t.filtro.anuncio(n))}
            />

            <div id="casos-trabajo">
              <h2 className="sr-only">{t.listaCasos}</h2>
              <ul className="rejilla casos" data-contenedor-filtro="">
                {ordenCasos.map((slug, i) => (
                  <CardCaso key={slug} slug={slug} numero={i + 1} locale={locale} />
                ))}
              </ul>
              <CardArchivo locale={locale} numeroDesde={ordenCasos.length + 1} />
            </div>
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(workIndexJsonLd(locale, [...ordenCasos, ...archivo])) }}
        />
      </main>
      <SiteFooter locale={locale} />
      <DockMovil />
    </>
  );
}
