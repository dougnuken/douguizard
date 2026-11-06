/**
 * El «corte láser» del nombre (opción 4 de `B-tipo`), en funciones puras para
 * que el scroll anclado (F5) y las pruebas lo compartan. El DOM lo toca
 * `components/marca/CorteLaser.tsx`; el CSS, `components/marca/marca.css`.
 */

/** Cuándo puede haber corte: escritorio, con movimiento y con JS (este código). */
export const CONSULTA_CORTE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** Desplazamientos a apertura 1 (TIPO.md §4): arriba −0,10 em, abajo +0,06 em, rendija ±1,5 px. */
export const CORTE = { arribaEm: -0.1, abajoEm: 0.06, rendijaPx: 1.5, alturaOjo: 0.52 } as const;

/**
 * Apertura del corte según el progreso `p` del ancla: abierto (1) en p = 0 y
 * cerrado (0) desde p = 0,3, cuando el nombre ya va camino de K1.
 */
export function aperturaDesdeProgreso(p: number): number {
  if (!Number.isFinite(p)) return 0;
  return Math.min(1, Math.max(0, 1 - p / 0.3));
}

/**
 * Altura del corte en px desde arriba de la caja de línea de «Vargas»: un pelo
 * por encima de la mitad del ojo medio (0,52 de la altura de la x sobre la
 * línea base), con las métricas reales de la fuente. Redondeada a px entero
 * para que, cerrado, las dos mitades casen sin costura.
 */
export function alturaCorte(m: {
  interlineado: number;
  ascendente: number;
  descendente: number;
  alturaX: number;
}): number {
  const base = (m.interlineado - (m.ascendente + m.descendente)) / 2 + m.ascendente;
  return Math.round(base - m.alturaX * CORTE.alturaOjo);
}

/** Fija la apertura (0–1) en el `[data-lockup]`. Fuera de rango se recorta. */
export function fijarApertura(lockup: HTMLElement, apertura: number): void {
  lockup.style.setProperty("--apertura", String(Math.min(1, Math.max(0, apertura || 0))));
}
