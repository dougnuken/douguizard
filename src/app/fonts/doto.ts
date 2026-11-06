import { Doto } from "next/font/google";

/**
 * Cifras, fechas y reloj (nunca < 20 px, D20). Matriz de puntos con el eje
 * `ROND` (100 = puntos redondos). `display: optional` y sin preload (07 §1.7):
 * si no llega a tiempo, la cifra se lee en la de respaldo y no hay salto.
 */
export const doto = Doto({
  subsets: ["latin"],
  axes: ["ROND"],
  variable: "--font-doto",
  display: "optional",
  preload: false,
});
