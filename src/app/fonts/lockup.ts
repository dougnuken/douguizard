import localFont from "next/font/local";

/**
 * La voz del nombre: opción 4 de `docs/rediseno-2026/propuestas/B-tipo/TIPO.md`,
 * «corte láser», decidida por Doug el 6 nov. Geologica con SHRP 100: los remates
 * en bisel refuerzan la idea de corte. Solo la importan `NameLockup` y
 * `Wordmark`, así que solo viaja donde se pinta el nombre.
 *
 * F8: se sirve una instancia estática (wght 600, SHRP 100, subconjunto latin de
 * Google Fonts) en vez de la variable completa: 14 KB en lugar de 29 KB, en
 * cada ruta (la marca de la cabecera la usa) y en la carrera del LCP móvil de
 * `/about`. El nombre, la marca y las marcas de `/about` solo usan peso 600.
 * Regenerar (OFL sin nombre reservado, se permite instanciar):
 *   python3 -c "from fontTools.ttLib import TTFont; from fontTools.varLib import instancer;
 *     f=instancer.instantiateVariableFont(TTFont('Geologica[SHRP,wght].woff2'),{'SHRP':100,'wght':600});
 *     f.flavor='woff2'; f.save('src/app/fonts/geologica-shrp100-600.woff2')"
 *
 * **Reversión (una línea aquí + `decisiones.nombreLockup`):** reexportar Big
 * Shoulders Stencil (`next/font/google`, `axes: ["opsz"]`, opsz 72) con
 * `construccion: "banda"`. `NameLockup` y el FLIP no cambian: miden el DOM.
 */
const geologica = localFont({
  src: "./geologica-shrp100-600.woff2",
  weight: "600",
  variable: "--font-nombre",
  display: "swap",
  // F5: el home también lo usa (acto 1, solo ≥ 1024). Sin precarga para que en
  // móvil no compita con Urbanist/Instrument (CLS de K2 en Slow 4G); el corte
  // espera a `document.fonts.load` antes de medir y abrir.
  preload: false,
  // Sin síntesis: «D» del círculo de la marca pedía 700 y ahora se pinta en 600.
  declarations: [{ prop: "font-synthesis", value: "none" }],
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
