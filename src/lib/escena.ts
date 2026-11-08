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
  caraFuerza?: number;
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
  /** Multiplicador de la fuerza sobre la cara (1 = sin cambio). */
  caraF: number;
  /**
   * Fase base (px) que pone el **centro** de una estría, no una costura, en el eje de
   * la nariz (P1-2 de la crítica F5; cierra F4 P2-1). Se suma a `phase` al pintar.
   */
  centro: number;
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
  /** Fase extra (px) a lo largo del ancla del home (F5). */
  fase?: number;
}): UniformesVidrio {
  const { caja, foto, params } = o;
  const c = o.col ?? cubrir(caja, foto.w / foto.h, o.pos);
  const [cx, cy, rx, ry] = foto.cara;
  const banda = o.laser !== false && foto.laser ? foto.laser : null;
  const lente = o.lente ?? 0;
  const w = Math.max(4, params.estria * c.Dy);
  const ang = (params.angulo * Math.PI) / 180;
  // La nariz: el eje de la cara, un poco bajo la línea de los ojos.
  const nariz = Math.cos(ang) * cx * c.Dx + Math.sin(ang) * (cy + 0.15 * ry) * c.Dy;
  const centro = (((0.5 * w - nariz) % w) + w) % w;
  return {
    off: [c.Ox, c.Oy],
    size: [c.Dx, c.Dy],
    w,
    ang,
    str: Math.max(0, Math.min(1, o.fuerza ?? params.fuerza)),
    phase: (o.fase ?? 0) + (o.mx === undefined ? 0 : (o.mx - caja.w / 2) * 0.04 * lente),
    face: [c.Ox + cx * c.Dx, c.Oy + cy * c.Dy, rx * c.Dx, ry * c.Dy],
    lineY: c.Oy + (banda ? banda.y : foto.ojo) * c.Dy,
    lineH: banda ? banda.h * c.Dy : 0,
    lensR: params.lente,
    prot: params.proteccionCara,
    caraF: params.caraFuerza ?? 1,
    centro,
  };
}

/* ── F5 · acto 1 «cine» → OS (scroll anclado de 1 viewport) ─────────────────
   Todo puro: lo usan `useScrollScene` (pinta), `VidrioGL` (parámetros) y vitest.
   Tiempos de NOTAS §2 corregidos por §7 (07 F5). */

/** Progreso local de un tramo [a, b] de p, recortado a [0, 1]. */
export function tramo(p: number, a: number, b: number): number {
  if (!Number.isFinite(p)) return 0;
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
/** `power2.inOut` / `power1.inOut` / `power2.out` de GSAP, para pintar sin tweens. */
export const p2io = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const p1io = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
export const p2o = (t: number) => 1 - (1 - t) * (1 - t);

/** Fin de cada pista del timeline (p ∈ [0, 1]). */
export const ESCENA = {
  foto: 0.72,
  /** P0-2 (crítica F5): K2 sube cuando el nombre ya salió hacia K1; sus trayectorias no se cruzan. */
  k2Viaje: [0.15, 0.6] as const,
  /** El FLIP del nombre XL a K1 (`power2.out`: sale rápido hacia la derecha, sobre la foto). */
  nombre: [0, 0.45] as const,
  material: [0.3, 0.52] as const,
  /** La tinta de K2 cambia de golpe aquí (P1-2): el contraste nunca cae a 1:1. */
  tinta: 0.41,
  /** Losas: opacidad, y 24 → 0, escala .96 → 1; sin blur (P1-1). */
  losas: { k3: 0.3, k4: 0.36, k5: 0.42, duracion: 0.2 },
  rail: [0.5, 0.8] as const,
  velo: [0, 0.4] as const,
  nombreFuera: [0.66, 0.76] as const,
  panelDentro: [0.68, 0.8] as const,
  laserOs: [0.8, 1] as const,
  /** P1-1 (crítica F5): la atmósfera borrosa se va antes de 0,35 (nunca queda la caja gris sola). */
  atmosfera: [0, 0.35] as const,
  indicador: [0.05, 0.17] as const,
} as const;

/** Lo que cada elemento de la escena vale en p (sin DOM). */
export function frameEscena(p: number) {
  const q = eio(tramo(p, 0, ESCENA.foto));
  const losa = (inicio: number) => p2o(tramo(p, inicio, inicio + ESCENA.losas.duracion));
  return {
    /** Foto: pantalla completa → K1 (cúbica in-out). */
    q,
    radio: q,
    /** K2: viaje (0 = abajo a la izquierda, 1 = su celda) y material. */
    k2: p2io(tramo(p, ...ESCENA.k2Viaje)),
    m: p1io(tramo(p, ...ESCENA.material)),
    mt: p >= ESCENA.tinta ? 1 : 0,
    /** Nombre XL: FLIP a K1 (`power2.out`, 0 → 0,45) y fundido. */
    nombre: p2o(tramo(p, ...ESCENA.nombre)),
    /** …y en vertical más tarde (`power2.inOut`): primero se aparta a la derecha, luego baja a K1. */
    nombreY: p2io(tramo(p, ...ESCENA.nombre)),
    nombreOpacidad: 1 - tramo(p, ...ESCENA.nombreFuera),
    panel: tramo(p, ...ESCENA.panelDentro),
    k3: losa(ESCENA.losas.k3),
    k4: losa(ESCENA.losas.k4),
    k5: losa(ESCENA.losas.k5),
    rail: p2o(tramo(p, ...ESCENA.rail)),
    velo: 1 - tramo(p, ...ESCENA.velo),
    laserOs: tramo(p, ...ESCENA.laserOs),
    atm: 1 - p2io(tramo(p, ...ESCENA.atmosfera)),
    /** P1-1: el láser sigue a todo el ancho (`.os-laser` pegado a la línea de la foto),
     *  con la alfa bajando de 1 a 0,5 hasta 0,8; ahí vuelve a 1 como láser del tablero. */
    laserAncho: Math.max(1 - 0.5 * tramo(p, 0, ESCENA.laserOs[0]), tramo(p, ...ESCENA.laserOs)),
    indicador: 1 - tramo(p, ...ESCENA.indicador),
  };
}

/**
 * Parámetros del vidrio a lo largo del ancla: de `cine` a `losa` con la foto
 * (q), y la fuerza con una joroba de +0,30 a mitad del viaje (las estrías «se
 * cierran» y se abren al llegar). La fase avanza 140 px. F4 dejó las estrías a
 * 12° en los tres estados (P0 de 06-CRITICA-F4): el ángulo ya no gira a 0°.
 */
export function vidrioEnEscena(p: number, cine: ParamsVidrio, losa: ParamsVidrio): ParamsVidrio & { fase: number } {
  const t = tramo(p, 0, ESCENA.foto);
  const q = eio(t);
  return {
    angulo: lerpN(cine.angulo, losa.angulo, q),
    estria: lerpN(cine.estria, losa.estria, q),
    fuerza: lerpN(cine.fuerza, losa.fuerza, q) + 0.3 * Math.sin(Math.PI * t),
    lente: lerpN(cine.lente, losa.lente, q),
    proteccionCara: lerpN(cine.proteccionCara, losa.proteccionCara, q),
    caraFuerza: lerpN(cine.caraFuerza ?? 1, losa.caraFuerza ?? 1, q),
    fase: 140 * Math.min(1, Math.max(0, p)),
  };
}
