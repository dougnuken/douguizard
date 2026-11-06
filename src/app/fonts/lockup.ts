import { Geologica } from "next/font/google";

/**
 * La voz del nombre: opción 4 de `docs/rediseno-2026/propuestas/B-tipo/TIPO.md`,
 * «corte láser», decidida por Doug el 6 nov. Geologica con SHRP 100: los remates
 * en bisel refuerzan la idea de corte. Solo la importan `NameLockup` y
 * `Wordmark`, así que solo viaja (y se precarga) donde se pinta el nombre.
 *
 * **Reversión (una línea aquí + `decisiones.nombreLockup`):** reexportar Big
 * Shoulders Stencil (`axes: ["opsz"]`, opsz 72) con `construccion: "banda"`.
 * `NameLockup` y el FLIP no cambian: miden el DOM.
 */
const geologica = Geologica({
  subsets: ["latin"],
  axes: ["SHRP"],
  variable: "--font-nombre",
  display: "swap",
});

export interface EstiloLockup {
  /** Resultado de `next/font` (su `variable` define `--font-nombre`). */
  fuente: { variable: string };
  peso: number;
  tracking: string;
  interlineado: number;
  /** `font-variation-settings` del nombre ("normal" si no aplica). */
  variaciones: string;
  /** Tamaño por escala (valor CSS). `xl` se multiplica por 0,8 con alto ≤ 800 px. */
  tamanos: { xl: string; movil: string; losa: string };
}

export const lockup: EstiloLockup = {
  fuente: geologica,
  peso: 600,
  tracking: "-0.05em",
  interlineado: 0.9,
  variaciones: '"SHRP" 100, "CRSV" 0, "slnt" 0',
  // xl: portada de /about a --t-120; el acto 1 del home lo sube a 128 px (TIPO)
  // con `--lockup-xl` desde su contenedor. losa = K1; movil = héroe móvil.
  tamanos: { xl: "var(--t-120)", movil: "66px", losa: "var(--t-30)" },
};
