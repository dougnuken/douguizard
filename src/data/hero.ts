/**
 * La foto del héroe y los parámetros del vidrio estriado (F4 los consume).
 *
 * D7 · La imagen final está en pausa (ESTADO.md): se usa la provisional
 * `199598aa` (láser rojo, gorra NY, 880×1168). Cambiar de foto = añadir un
 * objeto aquí, cambiar `fotoActiva` y correr `npm run hero:poster`.
 * Todo lo geométrico va normalizado a [0, 1] respecto a la foto.
 */

export type EstadoVidrio = "cine" | "losa" | "movil";

export interface ParametrosVidrio {
  /** Inclinación de las estrías, en grados desde la vertical (0 = verticales; oblicuo > 0). */
  angulo: number;
  /** Ancho de cada estría, en fracción del alto de la foto pintada (así el póster horneado y el WebGL coinciden). */
  estria: number;
  /** Fuerza de la refracción, 0–1. */
  fuerza: number;
  /** Radio de la lente del cursor, en px CSS (0 = sin lente). */
  lente: number;
  /** Cuánto se protege la cara (1 = sin vidrio sobre la cara). */
  proteccionCara: number;
  /**
   * Fuerza extra sobre la cara (P1-2 de la crítica F5): multiplica la fuerza en una
   * elipse algo mayor que la cara (ojos–boca) y se funde a 1 fuera. 1 = sin cambio.
   */
  caraFuerza?: number;
  /** DPR máximo del canvas. */
  dprMax: number;
}

export interface FotoHeroe {
  id: string;
  /** Sube con cada cambio del máster o de los parámetros: va en la carpeta de cada archivo (caché inmutable). */
  version: number;
  /** Máster en el repo (no se publica): de aquí hornea `npm run hero:poster`. Ideal ≥ 1920 px de ancho (D7). */
  master: string;
  rutas: {
    /** Póster horneado (foto + vidrio con la lente cerrada) por estado: el LCP y lo único que se ve con RM. */
    poster: Record<EstadoVidrio, { avif: Record<number, string>; webp: Record<number, string> }>;
    /** La foto limpia que el WebGL usa de textura (y el respaldo CSS para abrir el vidrio). */
    textura: string;
    /** Lo que escribe el script: debe coincidir con estas rutas (`hero.test.ts`). */
    manifest: string;
  };
  tamano: { w: number; h: number };
  /** Punto focal [fx, fy]. */
  foco: [number, number];
  /** Elipse de la cara [cx, cy, rx, ry]: el vidrio la respeta. */
  cara: [number, number, number, number];
  /** Línea del ojo (donde pasa el láser). */
  ojo: number;
  /** Banda láser de la foto, si la trae: el vidrio la deja legible de lado a lado. */
  laser?: { y: number; h: number };
  alt: { es: string; en: string };
}

export const ESTADOS: EstadoVidrio[] = ["cine", "losa", "movil"];

/** Anchos del póster: nunca mayores que el máster (07, corrección 10). */
export const anchosPoster = (w: number) => [440, 640, 880, 1080, 1600, 1920].filter((x) => x <= w);

export function foto(
  id: string,
  version: number,
  resto: Omit<FotoHeroe, "id" | "version" | "rutas" | "master"> & { master?: string },
): FotoHeroe {
  // `resto` puede venir de otra foto (prueba de cambio de foto): sus rutas no se heredan.
  const { rutas: _ignoradas, id: _i, version: _v, ...datos } = resto as Partial<FotoHeroe> & typeof resto;
  void _ignoradas;
  void _i;
  void _v;
  const dir = `/hero/${id}-v${version}`;
  const anchos = anchosPoster(datos.tamano.w);
  const set = (estado: EstadoVidrio, ext: "avif" | "webp") =>
    Object.fromEntries(anchos.map((w) => [w, `${dir}/${estado}-${w}.${ext}`]));
  return {
    ...datos,
    id,
    version,
    master: datos.master ?? `docs/rediseno-2026/retratos-hf/${id}.jpg`,
    rutas: {
      poster: Object.fromEntries(ESTADOS.map((e) => [e, { avif: set(e, "avif"), webp: set(e, "webp") }])) as FotoHeroe["rutas"]["poster"],
      textura: `${dir}/textura.webp`,
      manifest: `${dir}/manifest.json`,
    },
  };
}

export const fotos: FotoHeroe[] = [
  // Foto elegida por Doug (7 nov, Higgsfield): ciudad nocturna, láser rojo en los ojos, 896×1200.
  foto("960e1d8c", 2, {
    tamano: { w: 896, h: 1200 },
    foco: [0.5, 0.42],
    cara: [0.5, 0.45, 0.2, 0.2],
    ojo: 0.408,
    laser: { y: 0.4215, h: 0.015 },
    alt: {
      es: "Doug Vargas, con gorra y chaqueta de cuero, de frente ante una ciudad nocturna; una línea de luz láser roja cruza la cara a la altura de los ojos.",
      en: "Doug Vargas in a cap and leather jacket, facing the camera against a city at night; a thin red laser line crosses the face at eye level.",
    },
  }),
  // Provisional (D7): máster de 880 px; la imagen final debe llegar con ≥ 1920 px de ancho.
  foto("199598aa", 4, {
    tamano: { w: 880, h: 1168 },
    foco: [0.5, 0.41],
    cara: [0.5, 0.41, 0.19, 0.205],
    ojo: 0.418,
    laser: { y: 0.418, h: 0.012 },
    alt: {
      es: "Doug Vargas, con gorra, de frente en la penumbra; una línea de luz láser roja cruza la cara a la altura de los ojos.",
      en: "Doug Vargas in a cap, facing the camera in low light; a thin red laser line crosses the face at eye level.",
    },
  }),
];

export const fotoActiva = "960e1d8c";

export function getFotoActiva(): FotoHeroe {
  const f = fotos.find((x) => x.id === fotoActiva);
  if (!f) throw new Error(`hero.ts: no existe la foto activa "${fotoActiva}".`);
  return f;
}

/**
 * Parámetros del vidrio por estado (portados de `propuestas/B/index.html`):
 * `cine` = la foto grande de `/about` (oblicuo 12°), `losa` = K1 en el tablero
 * de escritorio, `movil` = la foto a sangre (< 1024). Los tres oblicuos a 12°:
 * decisión de Doug (vidrio estriado oblicuo; F3 P2-3, F4 P0-1).
 */
export const vidrio: Record<EstadoVidrio, ParametrosVidrio> = {
  cine: { angulo: 12, estria: 0.05, fuerza: 0.62, lente: 240, proteccionCara: 0.68, caraFuerza: 0.6, dprMax: 1.5 },
  losa: { angulo: 12, estria: 0.042, fuerza: 0.55, lente: 150, proteccionCara: 0.68, dprMax: 1.5 },
  movil: { angulo: 12, estria: 0.04, fuerza: 0.55, lente: 130, proteccionCara: 0.75, dprMax: 1.5 },
};

/** Variables CSS de la foto activa (para que ningún número de la foto viva en el CSS). */
export function varsFoto(f: FotoHeroe = getFotoActiva()): Record<string, string> {
  return {
    "--foto-ojo": String(f.ojo),
    "--foto-ar": String(f.tamano.w / f.tamano.h),
    "--foto-ar-inv": String(f.tamano.h / f.tamano.w),
    "--foto-cara-x": String(f.cara[0]),
    "--foto-cara-rx": String(f.cara[2]),
  };
}

/**
 * K13 · Retrato de la card de Perfil del home (07 F3): `retratos-hf/83a47bc7`,
 * 880 × 1168 (no hay 1080: no se inventan anchos). Lo hornea
 * `npm run hero:poster` junto con el póster; `version` va en el nombre.
 */
export const retratoPerfil = {
  id: "83a47bc7",
  version: 1,
  tamano: { w: 880, h: 1168 },
  rutas: {
    avif: { 640: "/portrait/perfil-83a47bc7-v1-640.avif", 880: "/portrait/perfil-83a47bc7-v1-880.avif" },
    webp: { 640: "/portrait/perfil-83a47bc7-v1-640.webp", 880: "/portrait/perfil-83a47bc7-v1-880.webp" },
  },
} as const;
