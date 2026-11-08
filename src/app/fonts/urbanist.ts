import { Urbanist } from "next/font/google";

/**
 * Display de las losas y titulares del sistema B (01 §4.4). Variable: el peso
 * de cada uso (600 en losas) lo pone el CSS.
 */
export const urbanist = Urbanist({
  // F8: solo `latin` (cubre el español): `latin-ext` se precargaba en cada ruta sin uso (27 KB).
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
  // F3: la cabecera, el rail y el dock B las usan en todas las rutas.
  preload: true,
});
