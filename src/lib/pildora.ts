/**
 * Píldora de selección que se desliza (09-MOTION-CONTROLES §3): las cuentas
 * puras, sin DOM, para el dock, las pills de la cabecera y el filtro de /work.
 *
 * La píldora son tres piezas blancas que solo se mueven con `transform` (corre
 * en el compositor: no se congela mientras React pinta la ruta nueva): dos
 * círculos del alto de la opción en los extremos y, entre sus centros, un
 * rectángulo de 1 px estirado con `scaleX`. Juntos dibujan una cápsula de
 * cualquier ancho sin animar `width` ni `left`.
 *
 * La memoria vive en el módulo: sobrevive a que el dock se vuelva a montar al
 * navegar entre rutas (cada página monta el suyo), así el dock nuevo arranca
 * donde quedó el viejo o retoma su animación a medio camino.
 */

export type Caja = { x: number; y: number; w: number; h: number };

/** 340 ms con `--curva-salida`: arranca rápido (responde al toque) y aterriza suave. */
export const PILDORA_MS = 340;
export const PILDORA_CURVA = "cubic-bezier(0.23, 1, 0.32, 1)";

const r = (n: number) => Math.round(n * 100) / 100;

/** Los `transform` de las tres piezas (círculo izquierdo, centro, círculo derecho) para una caja. */
export function piezas(c: Caja): [string, string, string] {
  const tramo = Math.max(0, c.w - c.h);
  return [
    `translate(${r(c.x)}px, ${r(c.y)}px)`,
    `translate(${r(c.x + c.h / 2)}px, ${r(c.y)}px) scaleX(${r(tramo)})`,
    `translate(${r(c.x + c.w - c.h)}px, ${r(c.y)}px)`,
  ];
}

/**
 * Pulido G2 · viaje líquido (la técnica «move» de liquid-gooey, sin el paquete):
 * cada borde de la cápsula lleva su propio muelle. El borde que va delante sale
 * con un muelle rápido y algo subamortiguado (llega antes y rebota ≤ 4 px); el de
 * atrás, con uno críticamente amortiguado y más lento. La cápsula se estira en la
 * dirección del viaje como una gota y se recoge al llegar. Los muelles se
 * muestrean a fotogramas clave con interpolación lineal (como el `linear()` de
 * CSS): sigue siendo solo `transform`, en el compositor, y dura `PILDORA_MS`.
 */
const MUESTRAS = 18;
const REBOTE_MAX = 4;

/** Respuesta de un muelle de 0 a 1 en t ∈ [0, 1] (ω en rad por duración), forzada a acabar en 1. */
function muelle(t: number, w: number, z: number): number {
  const x = (u: number) => {
    if (z >= 1) return 1 - Math.exp(-w * u) * (1 + w * u);
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * u) * (Math.cos(wd * u) + ((z * w) / wd) * Math.sin(wd * u));
  };
  // El último fotograma es exactamente el destino: se reparte el resto sin salto.
  return x(t) + (1 - x(1)) * t;
}

/** Las cajas del viaje, de `desde` a `hasta`, en `MUESTRAS + 1` instantes equiespaciados. */
export function cajasLiquidas(desde: Caja, hasta: Caja): Caja[] {
  const derecha = hasta.x + hasta.w / 2 >= desde.x + desde.w / 2;
  const izq0 = desde.x, izq1 = hasta.x;
  const der0 = desde.x + desde.w, der1 = hasta.x + hasta.w;
  const delante = (t: number) => muelle(t, 11, 0.62);
  const detras = (t: number) => muelle(t, 7.5, 1);
  const tope = (v: number, a: number, b: number) => {
    // El rebote del borde delantero pasa del destino como mucho REBOTE_MAX px.
    const lo = Math.min(a, b) - REBOTE_MAX, hi = Math.max(a, b) + REBOTE_MAX;
    return Math.min(hi, Math.max(lo, v));
  };
  const out: Caja[] = [];
  for (let i = 0; i <= MUESTRAS; i++) {
    const t = i / MUESTRAS;
    const ei = derecha ? detras(t) : delante(t);
    const ed = derecha ? delante(t) : detras(t);
    let izq = tope(izq0 + (izq1 - izq0) * ei, izq0, izq1);
    let der = tope(der0 + (der1 - der0) * ed, der0, der1);
    const h = desde.h + (hasta.h - desde.h) * t;
    // Nunca más estrecha que un círculo.
    if (der - izq < h) {
      const c = (izq + der) / 2;
      izq = c - h / 2;
      der = c + h / 2;
    }
    if (i === MUESTRAS) {
      izq = hasta.x;
      der = hasta.x + hasta.w;
    }
    out.push({ x: izq, y: desde.y + (hasta.y - desde.y) * t, w: der - izq, h });
  }
  return out;
}

/** La caja que se ve a partir de la traslación de los dos círculos (para interrumpir a medio camino). */
export function cajaVista(izq: { x: number; y: number }, der: { x: number }, h: number): Caja {
  return { x: izq.x, y: izq.y, w: der.x - izq.x + h, h };
}

/** `matrix(a, b, c, d, tx, ty)` → traslación; null si no hay transform. */
export function traslacion(m: string): { x: number; y: number } | null {
  const v = /matrix\(([^)]+)\)/.exec(m)?.[1].split(",").map(Number);
  return v && v.length === 6 ? { x: v[4], y: v[5] } : null;
}

export const misma = (a: Caja | null | undefined, b: Caja | null | undefined) =>
  !!a && !!b && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5 && Math.abs(a.w - b.w) < 0.5 && Math.abs(a.h - b.h) < 0.5;

export type Huella = {
  /** La caja de la opción activa (o hacia la que va la píldora); null si no hay. */
  hasta: Caja | null;
  /** El viaje en curso, para retomarlo si el contenedor se vuelve a montar. */
  viaje: { desde: Caja; hasta: Caja; t0: number } | null;
};

const memoria = new Map<string, Huella>();
export const leerHuella = (clave: string): Huella | undefined => memoria.get(clave);
export const guardarHuella = (clave: string, h: Huella) => void memoria.set(clave, h);

/** Cuánto le queda al viaje guardado (ms); 0 si ya terminó. */
export function restante(h: Huella | undefined, ahora: number): number {
  const v = h?.viaje;
  if (!v) return 0;
  return Math.max(0, PILDORA_MS - (ahora - v.t0));
}
