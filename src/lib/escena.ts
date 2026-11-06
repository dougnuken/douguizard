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

/* ── F4 · vidrio estriado ──────────────────────────────────────────────────
   Todo en px CSS del canvas. Las estrías viven en el espacio de la FOTO
   (origen y ancho relativos a la foto pintada), así el póster horneado (canvas
   = foto) y el WebGL en vivo (canvas = caja, foto en `cover`) coinciden. */

/** `object-fit: cover` con `object-position` [px, py] ∈ [0, 1]. */
export function cubrir(caja: { w: number; h: number }, ar: number, pos: [number, number] = [0.5, 0.5]): Colocacion {
  const Dy = Math.max(caja.h, caja.w / ar);
  const Dx = Dy * ar;
  return { Dx, Dy, Ox: (caja.w - Dx) * pos[0], Oy: (caja.h - Dy) * pos[1] };
}

export interface FotoVidrio {
  w: number;
  h: number;
  cara: [number, number, number, number];
  ojo: number;
  laser?: { y: number; h: number };
}

export interface ParamsVidrio {
  angulo: number;
  estria: number;
  fuerza: number;
  lente: number;
  proteccionCara: number;
}

export interface UniformesVidrio {
  off: [number, number];
  size: [number, number];
  /** Ancho de la estría (px). */
  w: number;
  /** Ángulo del eje que cruza las estrías (rad). */
  ang: number;
  str: number;
  phase: number;
  face: [number, number, number, number];
  lineY: number;
  /** 0 = sin banda láser. */
  lineH: number;
  lensR: number;
  prot: number;
}

/**
 * Uniformes del shader para una caja dada. `col` = dónde se pinta la foto (por
 * defecto, `cover` con `pos`); `fuerza` sobrescribe la del estado (`/about` la
 * baja con el scroll); `mx` + `lente` desplazan levemente la fase con el cursor.
 */
export function uniformesVidrio(o: {
  caja: { w: number; h: number };
  foto: FotoVidrio;
  params: ParamsVidrio;
  pos?: [number, number];
  col?: Colocacion;
  fuerza?: number;
  laser?: boolean;
  mx?: number;
  lente?: number;
}): UniformesVidrio {
  const { caja, foto, params } = o;
  const c = o.col ?? cubrir(caja, foto.w / foto.h, o.pos);
  const [cx, cy, rx, ry] = foto.cara;
  const banda = o.laser !== false && foto.laser ? foto.laser : null;
  const lente = o.lente ?? 0;
  return {
    off: [c.Ox, c.Oy],
    size: [c.Dx, c.Dy],
    w: Math.max(4, params.estria * c.Dy),
    ang: (params.angulo * Math.PI) / 180,
    str: Math.max(0, Math.min(1, o.fuerza ?? params.fuerza)),
    phase: o.mx === undefined ? 0 : (o.mx - caja.w / 2) * 0.04 * lente,
    face: [c.Ox + cx * c.Dx, c.Oy + cy * c.Dy, rx * c.Dx, ry * c.Dy],
    lineY: c.Oy + (banda ? banda.y : foto.ojo) * c.Dy,
    lineH: banda ? banda.h * c.Dy : 0,
    lensR: params.lente,
    prot: params.proteccionCara,
  };
}
