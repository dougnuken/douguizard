import { Instrument_Sans } from "next/font/google";

/**
 * Texto y UI del sistema B (400/500). Variable (wght 400–700).
 * `preload: false` hasta F3, por la misma razón que `urbanist.ts`.
 */
export const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});
