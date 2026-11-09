import "@/components/pages/paginas-b.css";
import "./chrome.css";
import Wordmark from "@/components/marca/Wordmark";
import Estado from "@/components/sistema/Estado";
import BotonArriba from "./BotonArriba";
import { decisiones } from "@/data/decisiones";
import { getSite } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { sistemaDict } from "@/i18n/sistema";

/**
 * Pie del sistema B (04 §4.4; pulido E): una losa con el wordmark, la línea de
 * cierre, la disponibilidad y el correo; dos listas ordenadas (el sitio · fuera
 * de él) y una base con © · lugar · colofón (D11) y «Volver arriba» como botón.
 * Lo montan el home y las páginas B, **no** `RootDocument`: casos y `/cv` ya
 * tienen su `<footer>` y `a11y 3.4` exige uno solo.
 */
export default function SiteFooter({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const d = sistemaDict[locale].sistema;
  const t = d.pie;
  const anio = new Date().getUTCFullYear();
  const sitio = [
    { href: localePath(locale, "/work"), label: d.nav.trabajo },
    { href: localePath(locale, "/about"), label: d.nav.perfil },
    { href: localePath(locale, "/experience"), label: d.nav.experiencia },
    { href: localePath(locale, "/cv"), label: d.nav.cv },
  ];
  return (
    <footer className="pie-b">
      <div className="pie-b-losa">
        <div className="pie-b-cabeza">
          <Wordmark locale={locale} className="pie-b-marca" />
          <p className="pie-b-cierre">{t.cierre}</p>
          <a className="pie-b-correo" href={`mailto:${s.email}`}>
            {s.email}
          </a>
          {s.availability.modo !== "no-disponible" && s.availability.note ? (
            <p className="pie-b-dispo">
              <Estado>{s.availability.note}</Estado>
            </p>
          ) : null}
        </div>
        <nav className="pie-b-nav" aria-label={t.label}>
          <div>
            <h2 className="pie-b-rotulo">{t.sitio}</h2>
            <ul>
              {sitio.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="pie-b-rotulo">{t.fuera}</h2>
            <ul>
              {s.social.map((r) => (
                <li key={r.label}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" aria-label={d.rail.externo(r.label)}>
                    {r.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${s.email}`}>{t.correo}</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="pie-b-base">
          <p>
            © {anio} {s.name} · {t.lugar(s.location.city, s.location.timezone)}
          </p>
          <p className="pie-b-colofon">{decisiones.colofon === "A" ? t.colofonA : t.colofonB}</p>
          <BotonArriba label={t.volverArriba} />
        </div>
      </div>
    </footer>
  );
}
