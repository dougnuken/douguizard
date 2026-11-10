import { splitLocale } from "@/i18n/config";

/**
 * Orden espacial de las rutas (G4): el mismo del dock y de las pills
 * (Inicio · Trabajo · caso · Perfil · Experiencia · CV). La transición de página
 * se desliza hacia el lado al que se va: hacia la derecha en la lista, la
 * página nueva entra desde la derecha; hacia atrás, desde la izquierda. Así el
 * cambio de página y la píldora del dock cuentan el mismo viaje.
 */
const ORDEN: [RegExp, number][] = [
  [/^\/$/, 0],
  [/^\/work\/?$/, 1],
  [/^\/work\/[^/]+\/?$/, 1.5],
  [/^\/about\/?$/, 2],
  [/^\/experience\/?$/, 3],
  [/^\/cv(\/|$)/, 4],
];

/** Posición de una ruta (con o sin `/en`) en el orden; `null` si no es una página B. */
export function ordenRuta(pathname: string): number | null {
  const { path } = splitLocale(pathname || "/");
  for (const [re, n] of ORDEN) if (re.test(path)) return n;
  return null;
}

export type DireccionRuta = "adelante" | "atras";

/** Hacia dónde va una navegación entre dos rutas; `null` si es la misma o alguna no está en el orden. */
export function direccionRuta(desde: string, hasta: string): DireccionRuta | null {
  const a = ordenRuta(desde);
  const b = ordenRuta(hasta);
  if (a === null || b === null || a === b) return null;
  return b > a ? "adelante" : "atras";
}
