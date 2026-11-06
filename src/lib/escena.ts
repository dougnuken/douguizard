/**
 * Geometría de la foto del héroe (puro, sin DOM). F2 usa `placement()` para la
 * portada de `/about`; F4 completa este archivo con `frame(p)` para el vidrio.
 * Fuente: `propuestas/B-paginas/about.html` (`placement`, `layout`).
 */

export type ModoEscena = "cine" | "losa" | "movil";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Dónde se pinta la foto: origen y tamaño (px). */
export interface Colocacion {
  Ox: number;
  Oy: number;
  Dx: number;
  Dy: number;
}

export interface Foto {
  w: number;
  h: number;
  /** Línea del ojo, normalizada [0, 1]. */
  ojo: number;
}

/**
 * - `cine`: la foto a 130 % del alto, centrada al 62 % del ancho, con el ojo al 41 %.
 * - `losa`: cubre la losa (≥ 121 % del alto), centrada, con el ojo al 30 % de la losa.
 * - `movil`: cubre la pantalla (≥ 95 % del alto), con el ojo al 22 %.
 */
export function placement(r: Rect, modo: ModoEscena, foto: Foto): Colocacion {
  const ar = foto.w / foto.h;
  if (modo === "cine") {
    const Dy = r.h * 1.3;
    return { Dx: Dy * ar, Dy, Ox: r.x + r.w * 0.62 - (Dy * ar) / 2, Oy: r.y + 0.41 * r.h - foto.ojo * Dy };
  }
  if (modo === "movil") {
    const Dy = Math.max(r.h * 0.95, (r.w / ar) * 1.02);
    return { Dx: Dy * ar, Dy, Ox: r.x + r.w / 2 - (Dy * ar) / 2, Oy: r.y + 0.22 * r.h - foto.ojo * Dy };
  }
  const Dy = Math.max(r.h * 1.21, (r.w / ar) * 1.05);
  return { Dx: Dy * ar, Dy, Ox: r.x + r.w / 2 - (Dy * ar) / 2, Oy: r.y + 0.3 * r.h - foto.ojo * Dy };
}

/** La losa final de la portada de `/about`: columnas 8–12 del contenido, de la cabecera al margen. */
export function losaPerfil(W: number, H: number): Rect {
  const izq = Math.max(112, (W - 1320) / 2);
  const ancho = Math.min(1320, W - izq - 24);
  const col = (ancho - 11 * 16) / 12;
  return { x: izq + 7 * (col + 16), y: 88, w: 5 * col + 4 * 16, h: H - 88 - 24 };
}

/** Cúbica in-out (la del morph de la foto). */
export function eio(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
