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
