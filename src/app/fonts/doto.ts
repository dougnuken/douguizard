import { Doto } from "next/font/google";

/**
 * Cifras, fechas y reloj (nunca < 20 px, D20). Matriz de puntos con el eje
 * `ROND` (100 = puntos redondos). `display: optional` (07 §1.7): si no llega a
 * tiempo, la cifra se lee en la de respaldo y no hay salto.
 *
 * Con preload en todas las rutas (F8): antes había una segunda instancia solo
 * para el home (06-CRITICA-F1 P2-8), pero `next/font` le daba otra URL al mismo
 * archivo y las rutas que también pintan cifras (`/about`) lo bajaban dos veces.
 * Son 6 KB.
 */
export const doto = Doto({
  subsets: ["latin"],
  axes: ["ROND"],
  variable: "--font-doto",
  display: "optional",
  preload: true,
});
