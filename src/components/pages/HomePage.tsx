import "./paginas-b.css";
import DockMovil from "@/components/chrome/DockMovil";
import RailAcciones from "@/components/chrome/RailAcciones";
import SiteFooter from "@/components/chrome/SiteFooter";
import Escena from "@/components/escena/Escena";
import { IconosSprite } from "@/components/sistema/Iconos";
import { TableroResto } from "@/components/tablero/Tablero";
import type { Locale } from "@/i18n/config";

/**
 * El home B (07 F3): el OS en su estado final, con la cabecera pastilla (en
 * `RootDocument`), el rail (≥ 1024), el dock (< 1024) y el pie B. El mismo en
 * los dos idiomas; `app/(es)/page.tsx` y `app/(en)/en/page.tsx` dicen cuál.
 */
export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <RailAcciones locale={locale} />
      <main id="main" tabIndex={-1} className="pagina-b tablero-home">
        <IconosSprite />
        <div className="resplandor" aria-hidden="true" />
        <Escena locale={locale} />
        <TableroResto locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      <DockMovil />
    </>
  );
}
