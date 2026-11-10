/**
 * `true` si la persona pidió menos movimiento (`prefers-reduced-motion: reduce`).
 * Solo en el navegador (efectos y manejadores de eventos); lee la consulta en el
 * momento de llamar, sin suscribirse. Para seguirla en vivo, `usePrefersReducedMotion`.
 */
export const prefiereQuieto = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
