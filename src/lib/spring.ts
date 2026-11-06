/* ── The rail's spring ──────────────────────────────────────────────────────
   One spring for everything on the rail that turns: the numeral drum and the
   letter reels beside it. They share it so they read as one mechanism — two
   wheels with different constants would land at different moments and feel
   like two widgets that happen to sit next to each other.

   Underdamped on purpose: ζ = 16 / (2√170) ≈ 0.61, which overshoots by ~7%
   and settles. That overshoot IS the feel — a critically damped spring only
   glides into place, and the point of a detent is that you land in it. */
export const STIFFNESS = 170;
export const DAMPING = 16;

/** Fixed substep, so the spring resolves the same on a 60Hz and a 120Hz panel. */
const SUBSTEP = 1 / 240;

/** Mutable on purpose: it is advanced every frame and never rendered by React. */
export interface Spring {
  pos: number;
  vel: number;
}

/**
 * Advances `s` toward `goal` by `dt` seconds. Returns true once the spring is
 * asleep — and snaps it exactly onto the goal, so a detent is never 0.0004 off.
 */
export function stepSpring(s: Spring, goal: number, dt: number): boolean {
  let t = dt;
  while (t > 0) {
    const h = Math.min(SUBSTEP, t);
    const a = (goal - s.pos) * STIFFNESS - s.vel * DAMPING;
    s.vel += a * h;
    s.pos += s.vel * h;
    t -= h;
  }
  const asleep = Math.abs(goal - s.pos) < 0.0005 && Math.abs(s.vel) < 0.005;
  if (asleep) {
    s.pos = goal;
    s.vel = 0;
  }
  return asleep;
}

/* ── Muelle críticamente amortiguado (sistema B) ─────────────────────────────
   Aditivo: `stepSpring` y sus constantes no cambian. Para lo que solo debe
   llegar, sin rebote: la lente del vidrio (respuesta 0,35 s; entra k = 7, sale
   k = 4) y cualquier seguimiento por eje. ζ = 1: la posición nunca pasa de la
   meta. Se integra en forma cerrada, así que el paso de tiempo no la vuelve
   inestable aunque un cuadro tarde 100 ms. */

/**
 * Avanza `s` hacia `goal` con un muelle críticamente amortiguado de pulsación
 * `omega` (rad/s; tiempo de respuesta ≈ 4/omega). Devuelve true al dormirse, y
 * entonces lo deja exactamente en la meta.
 */
export function stepCritical(s: Spring, goal: number, omega: number, dt: number): boolean {
  if (dt <= 0) return false;
  const x0 = s.pos - goal;
  const v0 = s.vel;
  const e = Math.exp(-omega * dt);
  const c = v0 + omega * x0;
  s.pos = goal + (x0 + c * dt) * e;
  s.vel = (v0 - omega * c * dt) * e;
  const asleep = Math.abs(goal - s.pos) < 0.0005 && Math.abs(s.vel) < 0.005;
  if (asleep) {
    s.pos = goal;
    s.vel = 0;
  }
  return asleep;
}
