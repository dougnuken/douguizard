/**
 * La foto del héroe y los parámetros del vidrio estriado (F4 los consume).
 *
 * D7 · La imagen final está en pausa (ESTADO.md): se usa la provisional
 * `199598aa` (láser rojo, gorra NY, 880×1168). Cambiar de foto = añadir un
 * objeto aquí, cambiar `fotoActiva` y correr `npm run hero:poster` (F4).
 * Todo lo geométrico va normalizado a [0, 1] respecto a la foto.
 */

export type EstadoVidrio = "cine" | "losa" | "movil";

export interface ParametrosVidrio {
  /** Ángulo de las estrías en grados (oblicuo). */
  angulo: number;
  /** Ancho de cada estría en px CSS. */
  estria: number;
  /** Fuerza de la refracción, 0–1. */
  fuerza: number;
  /** Joroba (curvatura) de cada estría, 0–1. */
  joroba: number;
  /** Radio de la lente del cursor, en fracción del lado menor del viewport. */
  lente: number;
  /** Cuánto se protege la cara (1 = sin vidrio sobre la cara). */
  proteccionCara: number;
  /** DPR máximo del canvas. */
  dprMax: number;
}

export interface FotoHeroe {
  id: string;
  /** Sube con cada cambio del máster: va en el nombre de cada archivo (caché inmutable). */
  version: number;
  rutas: {
    master: string;
    poster: { avif: Record<number, string>; webp: Record<number, string> };
    textura: Record<1600 | 1024, string>;
  };
  tamano: { w: number; h: number };
  /** Punto focal [fx, fy]. */
  foco: [number, number];
  /** Elipse de la cara [cx, cy, rx, ry]: el vidrio la respeta. */
  cara: [number, number, number, number];
  /** Línea del ojo (donde pasa el láser en el acto 1). */
  ojo: number;
  /** Banda láser de la foto, si la trae. */
  laser?: { y: number; h: number };
  alt: { es: string; en: string };
}

const ruta = (id: string, v: number, sufijo: string) => `/hero/${id}-v${v}-${sufijo}`;

function foto(id: string, version: number, resto: Omit<FotoHeroe, "id" | "version" | "rutas">): FotoHeroe {
  // La foto mide 880 px de ancho: no se inventan anchos mayores (07, corrección 10).
  const anchos = [440, 640, 880];
  return {
    id,
    version,
    rutas: {
      master: ruta(id, version, "master.jpg"),
      poster: {
        avif: Object.fromEntries(anchos.map((w) => [w, ruta(id, version, `${w}.avif`)])),
        webp: Object.fromEntries(anchos.map((w) => [w, ruta(id, version, `${w}.webp`)])),
      },
      textura: { 1600: ruta(id, version, "tex-1600.jpg"), 1024: ruta(id, version, "tex-1024.jpg") },
    },
    ...resto,
  };
}

export const fotos: FotoHeroe[] = [
  foto("199598aa", 1, {
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

export const fotoActiva = "199598aa";

export function getFotoActiva(): FotoHeroe {
  const f = fotos.find((x) => x.id === fotoActiva);
  if (!f) throw new Error(`hero.ts: no existe la foto activa "${fotoActiva}".`);
  return f;
}

/** Parámetros del vidrio por estado. Provisionales: F4 los ajusta al portar el shader de `propuestas/B/index.html`. */
export const vidrio: Record<EstadoVidrio, ParametrosVidrio> = {
  cine: { angulo: 102, estria: 44, fuerza: 0.55, joroba: 0.6, lente: 0.16, proteccionCara: 0.68, dprMax: 2 },
  losa: { angulo: 102, estria: 28, fuerza: 0.4, joroba: 0.5, lente: 0.12, proteccionCara: 0.68, dprMax: 2 },
  movil: { angulo: 102, estria: 24, fuerza: 0.35, joroba: 0.45, lente: 0, proteccionCara: 0.75, dprMax: 1.5 },
};

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
