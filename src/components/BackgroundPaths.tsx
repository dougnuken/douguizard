"use client";

import { motion, useReducedMotion } from "framer-motion";

/** One family of flowing SVG paths, mirrored by `position` (1 / -1). */
function FloatingPaths({ position, animate }: { position: number; animate: boolean }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={
              animate
                ? {
                    pathLength: 1,
                    opacity: [0.3, 0.6, 0.3],
                    pathOffset: [0, 1, 0],
                  }
                : { pathLength: 1, opacity: 0.4 }
            }
            transition={
              animate
                ? {
                    // Deterministic per-path duration (no Math.random → no hydration drift)
                    duration: 18 + (path.id % 12),
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
                : { duration: 0 }
            }
          />
        ))}
      </svg>
    </div>
  );
}

/** Decorative animated line-field for section backgrounds. Color = currentColor. */
export default function BackgroundPaths({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden>
      <FloatingPaths position={1} animate={!reduce} />
      <FloatingPaths position={-1} animate={!reduce} />
    </div>
  );
}
