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

/**
 * La misma Doto **con preload**, solo para el home (06-CRITICA-F1 P2-8): en K4
 * las cifras son el contenido. Se importa únicamente en `HomePage`, así que el
 * `<link rel="preload">` sale solo en `/` y `/en`; el archivo es el mismo que el
 * de `doto` (misma URL, misma caché). Redefine `--font-doto` en el `<main>`.
 */
export const dotoHome = Doto({
  subsets: ["latin"],
  axes: ["ROND"],
  variable: "--font-doto",
  display: "optional",
  preload: true,
});
