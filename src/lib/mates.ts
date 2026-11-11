/** Utilidades numéricas compartidas (antes copiadas en cada módulo que las necesitaba). */

/** Recorta `v` al intervalo [a, b] (por defecto 0–1). */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Interpolación lineal de `a` a `b` con `t` en 0–1. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
