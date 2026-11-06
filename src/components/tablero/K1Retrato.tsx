import Link from "next/link";
import HeroPoster from "@/components/hero/HeroPoster";
import VidrioCss from "@/components/hero/VidrioCss";
import Flecha from "@/components/sistema/Flecha";
import { getSite } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";
import { rolCorto } from "@/lib/career";

/**
 * K1 · la losa del retrato (04 §2.3), en su estado OS: la foto activa de
 * `hero.ts` (es el LCP), el vidrio en CSS (F4 pone el WebGL), la línea láser
 * sobre los ojos y el panel de vidrio con el nombre (el único visible en
 * escritorio, P1-4) → `/about`. En móvil es la foto a sangre detrás de K2; el
 * panel y su enlace no se pintan (el perfil va en K13).
 */
export default function K1Retrato({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = tableroDict[locale].k1;
  const [nombre, apellido] = s.name.split(" ");
  return (
    <article className="tarjeta k1" id="k1">
      <div className="k1-foto">
        <HeroPoster
          locale={locale}
          className="k1-poster"
          // La foto llena el alto de la losa (cover): su ancho pintado es alto × 0,753,
          // más que el de la columna (≈ 595 px a 1440×900). En móvil, alto de pantalla.
          sizes="(min-width: 1024px) 640px, 75vh"
        />
        <VidrioCss />
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
