import HeroPoster from "@/components/hero/HeroPoster";
import NameLockup from "@/components/marca/NameLockup";
import Estado from "@/components/sistema/Estado";
import { getFotoActiva } from "@/data/hero";
import { getBio } from "@/data/perfil";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import PortadaPerfilCliente from "./PortadaPerfilCliente";

/**
 * Antes del primer pintado, solo a ≥ 1024 px y sin movimiento reducido, marca
 * `html.perfil-cine` (la foto a pantalla completa, p = 0). `<html>` ya tolera
 * atributos de scripts (`suppressHydrationWarning`, como el tema). Sin JS, en
 * móvil o con RM no se marca y la portada se pinta en su estado final.
 */
const INICIO = `try{if(matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("perfil-cine")}catch(e){}`;

/**
 * Portada de `/about` (07 F2, `about.html`): la foto activa de `hero.ts` con
 * velo y láser; el `h1` es el `NameLockup` XL con corte. ≥ 1024 con GSAP: un
 * escenario sticky de 210 svh que la isla liga al scroll (sin pin). El vidrio
 * es un hueco en F2: F3 monta `VidrioCss` y F4 `VidrioGL`.
 */
export default function PortadaPerfil({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = paginasDict[locale].perfil;
  const { bio } = getBio(locale);
  const atm = getFotoActiva().rutas.poster.webp[440];
  return (
    <section className="portada" id="portada">
      <script dangerouslySetInnerHTML={{ __html: INICIO }} />
      <div className="escenario">
        <div className="foto">
          <div className="foto-clip" style={{ "--foto-atm": `url(${atm})` } as React.CSSProperties}>
            <HeroPoster locale={locale} className="poster" sizes="(min-width: 1024px) 880px, 100vw" />
          </div>
        </div>
        <div className="velo" aria-hidden="true" />
        <div className="laser" aria-hidden="true" />
        <div className="heroe-texto">
          <p className="ceja">{t.ceja}</p>
          <NameLockup
            escala="xl"
            corte
            as="h1"
            className="portada-nombre"
            style={{ "--lockup-xl": "clamp(56px, 17vw, var(--t-120))" } as React.CSSProperties}
          />
          <p className="nivel">{s.headline}</p>
          <p className="lugar">
            <Estado>
              {s.location.city}, {s.location.country} · {s.location.timezone}
            </Estado>
          </p>
          <p className="bio">{bio}</p>
        </div>
        <div className="indicador" aria-hidden="true">
          <i />
          <span className="indicador-txt">{t.desliza}</span>
        </div>
      </div>
      <PortadaPerfilCliente />
    </section>
  );
}
