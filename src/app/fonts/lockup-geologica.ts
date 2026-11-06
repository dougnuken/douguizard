import { Geologica } from "next/font/google";
import type { EstiloLockup } from "./lockup-tipos";

/**
 * Opción 4 de `propuestas/B-tipo/TIPO.md`, «corte láser» (elegida por Doug).
 * Geologica con SHRP 100: los remates en bisel refuerzan la idea de corte.
 */
const geologica = Geologica({
  subsets: ["latin", "latin-ext"],
  axes: ["SHRP"],
  variable: "--font-nombre",
  display: "swap",
  preload: false,
});

export const lockup: EstiloLockup = {
  fuente: geologica,
  peso: 600,
  tracking: "-0.05em",
  interlineado: 0.9,
  variaciones: '"SHRP" 100, "CRSV" 0, "slnt" 0',
  /** px a 1440×900; con alto ≤ 800 se multiplica por 0,8 (regla de B). */
  tamanos: { xl: 128, movil: 66, losa: 30 },
};
