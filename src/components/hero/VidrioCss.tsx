import "./vidrio.css";
import { getFotoActiva } from "@/data/hero";

/**
 * Respaldo del vidrio estriado sin WebGL (07 §1.3): franjas CSS sobre la foto,
 * con la cara y la banda del láser **protegidas** (la máscara las deja nítidas:
 * la elipse `cara` y la línea `laser` de `hero.ts`). F3 lo monta en K1 y en la
 * portada de `/about`; F4 pone `VidrioGL` encima y lo deja como respaldo (sin
 * WebGL, contexto perdido o `failIfMajorPerformanceCaveat`).
 *
 * `angulo`: 0 en el OS (estrías verticales), 12 en el acto 1 (F5).
 */
export default function VidrioCss({
  angulo = 0,
  className,
  cara,
  laser,
}: {
  angulo?: number;
  className?: string;
  /** La elipse de la cara **en la caja del vidrio**, si la foto no la llena (portada de `/about`). */
  cara?: [number, number, number, number];
  /** Altura de la banda láser en la caja; `null` = sin banda. Por defecto, la de la foto. */
  laser?: number | null;
}) {
  const f = getFotoActiva();
  const [cx, cy, rx, ry] = cara ?? f.cara;
  const ly = laser === undefined ? (f.laser?.y ?? f.ojo) : laser;
  const estilo = {
    "--v-ang": `${90 + angulo}deg`,
    "--v-cx": `${cx * 100}%`,
    "--v-cy": `${cy * 100}%`,
    "--v-rx": `${rx * 100}%`,
    "--v-ry": `${ry * 100}%`,
    "--v-ly": ly === null ? "-10%" : `${ly * 100}%`,
  } as React.CSSProperties;
  return <div className={className ? `vidrio-css ${className}` : "vidrio-css"} style={estilo} aria-hidden="true" data-vidrio="css" />;
}
