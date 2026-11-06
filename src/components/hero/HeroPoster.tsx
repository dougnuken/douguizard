import { getFotoActiva } from "@/data/hero";
import type { Locale } from "@/i18n/config";

/**
 * La foto activa de `hero.ts` como `<picture>` (AVIF → WebP), **sin hornear**
 * (F2; F4 la cambia por el póster horneado con el vidrio). Es el LCP de
 * `/about`: `fetchPriority="high"` y nada de `loading="lazy"`.
 */
export default function HeroPoster({
  locale,
  className,
  sizes,
  id,
  decorativa = false,
}: {
  locale: Locale;
  className?: string;
  sizes: string;
  id?: string;
  /** Sin `alt` (la misma foto ya está descrita en otro sitio de la página). */
  decorativa?: boolean;
}) {
  const f = getFotoActiva();
  const srcset = (r: Record<number, string>) =>
    Object.entries(r)
      .map(([w, src]) => `${src} ${w}w`)
      .join(", ");
  const anchos = Object.keys(f.rutas.poster.webp).map(Number);
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(f.rutas.poster.avif)} sizes={sizes} />
      <img
        id={id}
        className={className}
        src={f.rutas.poster.webp[Math.max(...anchos)]}
        srcSet={srcset(f.rutas.poster.webp)}
        sizes={sizes}
        width={f.tamano.w}
        height={f.tamano.h}
        alt={decorativa ? "" : f.alt[locale]}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
