import { Urbanist } from "next/font/google";
import type { EstiloLockup } from "./lockup-tipos";

/**
 * El nombre en la display de B (Urbanist 600), la base antes de elegir lockup.
 * Se conserva para probar que `NameLockup` y la medida del FLIP no dependen de
 * la opción: cambiar `lockup.ts` a este archivo debe dejar el lab intacto.
 */
const urbanistNombre = Urbanist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nombre",
  display: "swap",
  preload: false,
});

export const lockup: EstiloLockup = {
  fuente: urbanistNombre,
  peso: 600,
  tracking: "-0.045em",
  interlineado: 0.92,
  variaciones: "normal",
  tamanos: { xl: 120, movil: 56, losa: 30 },
};
