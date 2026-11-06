import Link from "next/link";
import Flecha from "@/components/sistema/Flecha";
import { retratoPerfil } from "@/data/hero";
import { getSite } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";

const srcset = (r: Record<number, string>) =>
  Object.entries(r)
    .map(([w, src]) => `${src} ${w}w`)
    .join(", ");

/** K13 · perfil (4 × 3) → `/about`, con el retrato `83a47bc7` (07 F3). */
export default function CardPerfil({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = tableroDict[locale].k13;
  const sizes = "(min-width: 1024px) 33vw, 100vw";
  return (
    <article className="losa losa--losa tarjeta k13" id="about" data-seccion="about">
      <div className="k13-retrato" aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet={srcset(retratoPerfil.rutas.avif)} sizes={sizes} />
          <img
            src={retratoPerfil.rutas.webp[880]}
            srcSet={srcset(retratoPerfil.rutas.webp)}
            sizes={sizes}
            width={retratoPerfil.tamano.w}
            height={retratoPerfil.tamano.h}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <div className="k13-texto">
        <p className="ceja">{t.ceja}</p>
        <h3 className="t-losa">
          <Link href={localePath(locale, "/about")} className="enlace-tarjeta">
            {t.titulo}
            <span className="sr-only">{t.accion}</span>
          </Link>
        </h3>
        <p className="apoyo">
          {s.location.city}, {s.location.country} · ES / EN
        </p>
      </div>
      <Flecha />
    </article>
  );
}
