import { preload } from "react-dom";
import { getFotoActiva, type EstadoVidrio } from "@/data/hero";
import type { Locale } from "@/i18n/config";

const ESCRITORIO = "(min-width: 1024px)";

/**
 * El póster horneado de la foto activa (`hero.ts` + `npm run hero:poster`): la
 * foto con el vidrio ya aplicado (lente cerrada), en AVIF → WebP, un juego por
 * estado (`escritorio` ≥ 1024, `movil` por debajo). Es el LCP:
 * `fetchPriority="high"`, preload desde el `<head>` y nada de `loading="lazy"`.
 * Con RM es lo único que se ve; `VidrioGL` entra encima después del `load`.
 */
export default function HeroPoster({
  locale,
  className,
  sizes,
  id,
  estados = { escritorio: "losa", movil: "movil" },
  decorativa = false,
}: {
  locale: Locale;
  className?: string;
  sizes: string;
  id?: string;
  estados?: { escritorio: EstadoVidrio; movil: EstadoVidrio };
  /** Sin `alt` (la misma foto ya está descrita en otro sitio de la página). */
  decorativa?: boolean;
}) {
  const f = getFotoActiva();
  const srcset = (r: Record<number, string>) =>
    Object.entries(r)
      .map(([w, src]) => `${src} ${w}w`)
      .join(", ");
  const esc = f.rutas.poster[estados.escritorio];
  const mov = f.rutas.poster[estados.movil];
  const mayor = Math.max(...Object.keys(mov.webp).map(Number));
  // La descarga arranca desde el <head>, en paralelo con el CSS (una por consulta).
  preload(esc.avif[mayor], { as: "image", type: "image/avif", imageSrcSet: srcset(esc.avif), imageSizes: sizes, fetchPriority: "high", media: ESCRITORIO });
  preload(mov.avif[mayor], {
    as: "image",
    type: "image/avif",
    imageSrcSet: srcset(mov.avif),
    imageSizes: sizes,
    fetchPriority: "high",
    media: "(max-width: 1023.98px)",
  });
  return (
    <picture>
      <source media={ESCRITORIO} type="image/avif" srcSet={srcset(esc.avif)} sizes={sizes} />
      <source type="image/avif" srcSet={srcset(mov.avif)} sizes={sizes} />
      <source media={ESCRITORIO} type="image/webp" srcSet={srcset(esc.webp)} sizes={sizes} />
      <img
        id={id}
        className={className}
        src={mov.webp[mayor]}
        srcSet={srcset(mov.webp)}
        sizes={sizes}
        width={f.tamano.w}
        height={f.tamano.h}
        alt={decorativa ? "" : f.alt[locale]}
        fetchPriority="high"
        decoding="async"
        data-poster="horneado"
      />
    </picture>
  );
}
