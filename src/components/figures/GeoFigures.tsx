"use client";

/**
 * Monochrome geometric figures — B&W photo substitutes used across the site.
 * All motion is ambient (CSS classes in globals.css): slow spin, breathe, and
 * a dot orbiting the viewBox centre. Transform/opacity only, and fully disabled
 * under prefers-reduced-motion. Purely decorative → aria-hidden.
 *
 * Every figure shares a 0–100 viewBox so the motion classes resolve their
 * centre consistently; visual size comes from the `className`/width.
 */

const LINE_STRONG = "var(--line-strong)";
const LINE = "var(--line)";
const DOT = "var(--ink-dim)";

/** Four small column marks for Capabilities — one per capability card. */
export function ColumnMark({ index }: { index: number }) {
  const common = {
    viewBox: "0 0 100 100",
    "aria-hidden": true,
    className: "block h-7 w-7 shrink-0 overflow-visible",
  } as const;

  switch (index) {
    case 0: // dashed circle, spinning
      return (
        <svg {...common}>
          <circle
            cx={50}
            cy={50}
            r={42}
            fill="none"
            stroke={LINE_STRONG}
            strokeWidth={4.5}
            strokeDasharray="11 15"
            strokeLinecap="round"
            className="geo-spin"
          />
        </svg>
      );
    case 1: // ring + orbiting dot
      return (
        <svg {...common}>
          <circle cx={50} cy={50} r={42} fill="none" stroke={LINE_STRONG} strokeWidth={4.5} />
          <g className="geo-orbit">
            <circle cx={50} cy={8} r={6.5} fill={DOT} />
          </g>
        </svg>
      );
    case 2: // top-right corner bracket, slow spin
      return (
        <svg {...common}>
          <path
            d="M22 22 H78 V78"
            fill="none"
            stroke={LINE_STRONG}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="geo-spin-slow"
          />
        </svg>
      );
    default: // diamond (square wobbling between diamond orientations)
      return (
        <svg {...common}>
          <rect
            x={24}
            y={24}
            width={52}
            height={52}
            fill="none"
            stroke={LINE_STRONG}
            strokeWidth={4.5}
            className="geo-diamond"
          />
        </svg>
      );
  }
}

/**
 * Concentric rings with an orbiting dot — used in About and Contact.
 * Outer ring breathes, dashed mid ring spins, centre dot pulses, dot orbits.
 */
export function OrbitRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={`overflow-visible ${className ?? ""}`}>
      <circle cx={50} cy={50} r={46} fill="none" stroke={LINE_STRONG} strokeWidth={1} className="geo-breathe" />
      <circle
        cx={50}
        cy={50}
        r={28}
        fill="none"
        stroke={LINE}
        strokeWidth={1}
        strokeDasharray="5 9"
        className="geo-spin"
      />
      <circle cx={50} cy={50} r={2.6} fill={DOT} className="animate-pulse-dot" />
      <g className="geo-orbit">
        <circle cx={50} cy={4} r={2.4} fill={DOT} />
      </g>
    </svg>
  );
}

/**
 * Single outline circle that breathes, with a dot orbiting counter-clockwise.
 * Used as the negative-space mark in Selected Work.
 */
export function PulseCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={`overflow-visible ${className ?? ""}`}>
      <circle cx={50} cy={50} r={46} fill="none" stroke={LINE_STRONG} strokeWidth={2} className="geo-breathe" />
      <g className="geo-orbit-rev">
        <circle cx={50} cy={4} r={3} fill={DOT} />
      </g>
    </svg>
  );
}
