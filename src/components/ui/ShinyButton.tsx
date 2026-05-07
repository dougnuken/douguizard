"use client";

import type React from "react";

interface ShinyBorderProps {
  children: React.ReactNode;
  className?: string;
  /** Border radius — match your child's radius (e.g. "9999px" for full pill) */
  borderRadius?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Highlight color (the rotating shine) */
  highlight?: string;
  /** Subtle highlight on hover */
  highlightSubtle?: string;
}

/**
 * Wraps any child in a rotating conic-gradient border, creating a "shiny" CTA effect.
 * The child should have its own background — this component only paints the border.
 *
 * Uses CSS @property + custom keyframes (no JS animation, GPU-accelerated).
 */
export function ShinyBorder({
  children,
  className = "",
  borderRadius = "9999px",
  duration = 3,
  highlight = "rgba(167, 139, 250, 1)",
  highlightSubtle = "rgba(196, 181, 253, 1)",
}: ShinyBorderProps) {
  return (
    <>
      <style jsx>{`
        @property --shiny-border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --shiny-border-percent {
          syntax: "<percentage>";
          initial-value: 6%;
          inherits: false;
        }

        @property --shiny-border-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        .shiny-border-wrapper {
          --duration: ${duration}s;
          --highlight: ${highlight};
          --highlight-subtle: ${highlightSubtle};
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);

          position: relative;
          isolation: isolate;
          border-radius: ${borderRadius};
          padding: 1px;
          background: conic-gradient(
            from var(--shiny-border-angle),
            transparent 0%,
            var(--highlight) var(--shiny-border-percent),
            var(--shiny-border-shine) calc(var(--shiny-border-percent) * 2),
            var(--highlight) calc(var(--shiny-border-percent) * 3),
            transparent calc(var(--shiny-border-percent) * 4),
            transparent 100%
          );
          animation: shiny-border-spin var(--duration) linear infinite;
          transition: var(--transition);
          transition-property: --shiny-border-percent, --shiny-border-shine;
        }

        .shiny-border-wrapper:hover {
          --shiny-border-percent: 18%;
          --shiny-border-shine: var(--highlight-subtle);
        }

        @keyframes shiny-border-spin {
          to {
            --shiny-border-angle: 360deg;
          }
        }
      `}</style>

      <div className={`shiny-border-wrapper ${className}`}>{children}</div>
    </>
  );
}