import "./paginas-b.css";
import "@/components/perfil/perfil.css";
import DockMovil from "@/components/chrome/DockMovil";
import RailAcciones from "@/components/chrome/RailAcciones";
import SiteFooter from "@/components/chrome/SiteFooter";
import PortadaPerfil from "@/components/perfil/PortadaPerfil";
import { Citas, ComoTrabajo, DatosPerfil, LoQueHago, Marcas } from "@/components/perfil/Secciones";
import Boton from "@/components/sistema/Boton";
import { IconosSprite } from "@/components/sistema/Iconos";
import { getBio } from "@/data/perfil";
import { localePath, type Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import { pdfCv } from "@/lib/cvPdf";
import { aboutDescripcion } from "@/lib/metadata";
import { aboutJsonLd } from "@/lib/personJsonLd";
import TransicionPagina from "@/components/motion/TransicionPagina";

/**
 * `/about` · perfil (07 F2, `about.html`): portada (foto + corte, sticky sin
 * pin) → contexto → «Lo que hago» → «Cómo trabajo» → «Datos» y «Con qué
 * trabajo» → «Dónde he trabajado» → citas → cierre.
 */
export default function AboutPage({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].perfil;
  const { contexto } = getBio(locale);
  return (
    <TransicionPagina>
      <RailAcciones locale={locale} />
      <main id="main" tabIndex={-1} className="pagina-b">
        <IconosSprite />
        <div className="resplandor" aria-hidden="true" />
        <PortadaPerfil locale={locale} />
        <div className="pagina sin-cab">
          <div className="contenido">
            <section className="contexto" aria-label={t.contexto}>
              {contexto.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </section>
            <LoQueHago locale={locale} />
            <ComoTrabajo locale={locale} />
            <DatosPerfil locale={locale} />
            <Marcas locale={locale} />
            <Citas locale={locale} />
            <section className="seccion cierre" aria-labelledby="perfil-cierre">
              <h2 id="perfil-cierre" className="cierre-linea">
                {t.cierre}
              </h2>
              <div className="cierre-cta">
                <Boton href={localePath(locale, "/work")} variante="blanco">
                  {t.verCasos}
                </Boton>
                <Boton href={pdfCv(locale)} variante="linea" descargar icono="bajar">
                  {t.descargarCv}
                </Boton>
              </div>
            </section>
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd(locale, aboutDescripcion(locale))) }}
        />
      </main>
      <SiteFooter locale={locale} />
      <DockMovil />
    </TransicionPagina>
  );
}
