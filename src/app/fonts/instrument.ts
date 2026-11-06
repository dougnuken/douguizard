import { Instrument_Sans } from "next/font/google";

/**
 * Texto y UI del sistema B (400/500). Variable (wght 400–700).
 * `preload: true` desde F3: la cabecera, el rail y el dock B la usan en todas las rutas.
 */
export const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
  // F3: la cabecera, el rail y el dock B las usan en todas las rutas.
  preload: true,
});
