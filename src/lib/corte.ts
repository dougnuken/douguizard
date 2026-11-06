/**
 * El «corte láser» del nombre (opción 4 de `B-tipo`, 07 F1), en funciones que
 * comparten la isla (`components/marca/NameLockupCorte.tsx`), los dueños del
 * scroll (F2 `/about`, F5 acto 1) y las pruebas. El CSS está en `marca.css`.
 */

/** Cuándo puede haber corte: escritorio y con movimiento (y con JS: este código). */
export const CONSULTA_CORTE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** TIPO.md §4: arriba −0,10 em, abajo +0,06 em (= −0,6 × arriba), rendija 1,5 px por lado. */
export const CORTE = { despEm: -0.1, factorInf: -0.6, rendijaPx: 1.5, alturaOjo: 0.52 } as const;

/** Entrada única: a los 880 ms, t de 0 a 1 en 520 ms con `--curva-salida`. */
export const ENTRADA = { retrasoMs: 880, duracionMs: 520, curva: [0.23, 1, 0.32, 1] as const };

/**
 * `--corte`: px desde arriba de la caja de línea de «Vargas» hasta el corte.
 * Línea base = (interlineado − (asc + desc)) / 2 + asc; corte = base − 0,52 ×
 * altura de x (un pelo por encima de la mitad del ojo medio).
 */
export function corteDesdeMetricas(m: {
  interlineado: number;
  ascendente: number;
  descendente: number;
  alturaX: number;
}): number {
  const base = (m.interlineado - (m.ascendente + m.descendente)) / 2 + m.ascendente;
  return base - m.alturaX * CORTE.alturaOjo;
}

/** Desplazamientos para una apertura t ∈ [0, 1] (fuera de rango se recorta). */
export function desplazamientos(t: number): { despEm: number; rendijaPx: number; t: number } {
  const k = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;
  return { despEm: CORTE.despEm * k, rendijaPx: CORTE.rendijaPx * k, t: k };
}

/** Lo que escribe el dueño del scroll: abierto en p = 0, cerrado desde p = 0,3. */
export function aperturaDesdeProgreso(p: number): number {
  if (!Number.isFinite(p)) return 0;
  return Math.min(1, Math.max(0, 1 - p / 0.3));
}

/**
 * Escribe la apertura en el `[data-lockup]`: `--desp`, `--rendija` y
 * `data-corte` («cerrado» en t = 0, sin `clip-path` ni copia: el nombre que
 * llega a K1 es la palabra entera; «abierto» en cualquier otro valor).
 */
export function fijarCorte(lockup: HTMLElement, t: number): void {
  const d = desplazamientos(t);
  lockup.style.setProperty("--desp", `${d.despEm}em`);
  lockup.style.setProperty("--rendija", `${d.rendijaPx}px`);
  lockup.dataset.corte = d.t === 0 ? "cerrado" : "abierto";
}

/** `cubic-bezier(x1, y1, x2, y2)` evaluada en x ∈ [0, 1] (Newton + bisección). */
export function bezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (s: number) => ((ax * s + bx) * s + cx) * s;
  let s = x;
  for (let i = 0; i < 8; i++) {
    const d = (3 * ax * s + 2 * bx) * s + cx;
    if (Math.abs(d) < 1e-6) break;
    const s2 = s - (X(s) - x) / d;
    if (s2 < 0 || s2 > 1) break;
    s = s2;
  }
  let lo = 0, hi = 1;
  for (let i = 0; i < 30 && Math.abs(X(s) - x) > 1e-7; i++) {
    if (X(s) < x) lo = s;
    else hi = s;
    s = (lo + hi) / 2;
  }
  return ((ay * s + by) * s + cy) * s;
}

/**
 * Primer pase de la colocación sobre el láser: `top` del lockup para que la
 * línea del láser (y en el mismo sistema de coordenadas) pase por el corte.
 * Nunca por encima de la cabecera (88 px).
 */
export function topSobreLaser(lineaLaser: number, offsetTopL2: number, corte: number, minimo = 88): number {
  return Math.max(minimo, lineaLaser - offsetTopL2 - corte);
}
