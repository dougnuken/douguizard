import Link from "next/link";
import HeroPoster from "@/components/hero/HeroPoster";
import VidrioCss from "@/components/hero/VidrioCss";
import VidrioDiferido from "@/components/hero/VidrioDiferido";
import Flecha from "@/components/sistema/Flecha";
import { getFotoActiva, varsFoto } from "@/data/hero";
import { getSite } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";
import { rolCorto } from "@/lib/career";

/**
 * K1 · la losa del retrato (04 §2.3), en su estado OS: la foto activa de
 * `hero.ts` horneada con el vidrio (es el LCP), el vidrio vivo en WebGL2 tras el
 * `load` (respaldo: la lente en CSS), la línea láser
 * sobre los ojos y el panel de vidrio con el nombre (el único visible en
 * escritorio, P1-4) → `/about`. En móvil es la foto a sangre detrás de K2; el
 * panel y su enlace no se pintan (el perfil va en K13).
 */
/** El póster `cine` más pequeño: la atmósfera borrosa que llena el acto 1 fuera de la foto (F5). */
function atmosfera() {
  const r = getFotoActiva().rutas.poster.cine.webp;
  return r[Math.min(...Object.keys(r).map(Number))];
}

export default function K1Retrato({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = tableroDict[locale].k1;
  const [nombre, apellido] = s.name.split(" ");
  return (
    <article className="tarjeta k1" id="k1">
      <div className="k1-foto" style={{ ...varsFoto(), "--foto-atm": `url(${atmosfera()})` } as React.CSSProperties}>
        <HeroPoster
          locale={locale}
          className="k1-poster"
          // La foto llena el alto de la losa (cover): su ancho pintado es alto × 0,753,
          // más que el de la columna (≈ 595 px a 1440×900). En móvil, alto de pantalla.
          // En el acto 1 (F5) la misma foto llena la pantalla (130 % del alto): el máster entero.
          sizes="(min-width: 1024px) 880px, 75vh"
        />
        {/* `espejo`: en el acto 1 la escena mueve la foto y el vidrio la sigue (y lee `--vidrio-p`). */}
        <VidrioDiferido estados={{ escritorio: "losa", movil: "movil" }} className="vidrio-llena" pos={[0.5, 0]} espejo="img.k1-poster">
          <VidrioCss />
        </VidrioDiferido>
        <div className="k1-velo" aria-hidden="true" />
        <div className="k1-laser" aria-hidden="true" />
      </div>
      <div className="k1-panel">
        <p className="k1-nombre" aria-hidden="true">
          <span>{nombre}</span>
          <span>{apellido}</span>
          <span className="k1-rol">{rolCorto()}</span>
        </p>
        <Flecha />
      </div>
      <Link href={localePath(locale, "/about")} className="k1-enlace">
        <span className="sr-only">{t.enlace(s.name)}</span>
      </Link>
    </article>
  );
}
