import "./paginas-b.css";
import "@/components/trayectoria/trayectoria.css";
import SiteFooter from "@/components/chrome/SiteFooter";
import Boton from "@/components/sistema/Boton";
import { IconosSprite } from "@/components/sistema/Iconos";
import Trayectoria from "@/components/trayectoria/Trayectoria";
import type { Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import { pdfCv } from "@/lib/cvPdf";

/** `/experience` · trayectoria anclada por hito (07 F2, `experience.html`). */
export default function ExperiencePage({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].trayectoria;
  return (
    <>
      <main id="main" tabIndex={-1} className="pagina-b">
        <IconosSprite />
        <div className="resplandor" aria-hidden="true" />
        <Trayectoria locale={locale} />
        <div className="pagina sin-cab">
          <div className="contenido exp-cierre">
            <Boton href={pdfCv(locale)} variante="linea" descargar icono="bajar">
              {t.descargarCv}
            </Boton>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
