/**
 * Pulido I · destello «Cíclope» del láser (retinas + raya anamórfica + bloom).
 * Cuánto queda encendido en el progreso `p` del acto 1: entero en p = 0, se apaga
 * de forma progresiva mientras la foto viaja a su losa y ya no está desde
 * `DESTELLO.fin` (en el OS solo queda la línea fina). Sin DOM: lo usa
 * `useScrollScene` y lo fija `__tests__/destello.test.ts`.
 */
export const DESTELLO = { inicio: 0.02, fin: 0.62 } as const;

export function atenuacionDestello(p: number): number {
  const t = Math.min(1, Math.max(0, (p - DESTELLO.inicio) / (DESTELLO.fin - DESTELLO.inicio)));
  // Suave en los dos extremos (smoothstep): ni arranca ni termina de golpe.
  return 1 - t * t * (3 - 2 * t);
}
