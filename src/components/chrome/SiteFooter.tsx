import "@/components/pages/paginas-b.css";
import { decisiones } from "@/data/decisiones";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { sistemaDict } from "@/i18n/sistema";

/**
 * Pie del sistema B (04 §4.4): © · lugar · colofón (D11) · Volver arriba.
 * Lo montan las páginas B (`WorkIndexPage`, `AboutPage`, `ExperiencePage` y,
 * en F3, `HomePage`), **no** `RootDocument`: casos y `/cv` ya tienen su
 * `<footer>` y `a11y 3.4` exige uno solo.
 */
export default function SiteFooter({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = sistemaDict[locale].sistema.pie;
  const anio = new Date().getUTCFullYear();
  return (
    <footer className="pie-b">
      <div className="pie-b-fila">
        <p>
          © {anio} {s.name} · {t.lugar(s.location.city, s.location.timezone)}
        </p>
        <p>{decisiones.colofon === "A" ? t.colofonA : t.colofonB}</p>
        <a href="#main">{t.volverArriba}</a>
      </div>
    </footer>
  );
}
