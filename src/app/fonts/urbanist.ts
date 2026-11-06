import { Urbanist } from "next/font/google";

/**
 * Display de las losas y titulares del sistema B (01 §4.4). Variable: el peso
 * de cada uso (600 en losas) lo pone el CSS.
 *
 * `preload: false` mientras solo la usa `/lab` (F1): así las páginas actuales no
 * piden una fuente que no pintan. Pasa a `true` en F3, cuando el home la use.
 */
export const urbanist = Urbanist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-urbanist",
  display: "swap",
  preload: false,
});
