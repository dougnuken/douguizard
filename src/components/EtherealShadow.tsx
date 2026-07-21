"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";

interface EtherealShadowProps {
  className?: string;
  /** Smoke tint — light on a dark panel. Any CSS color. */
  color?: string;
  /** Overall layer opacity. */
  opacity?: number;
  /** Displacement churn amount. */
  scale?: number;
}

/** Soft radial falloff — cloud sits to the right, melting into the panel. */
const MASK =
  "radial-gradient(95% 95% at 74% 44%, #000 0%, rgba(0,0,0,0.42) 44%, transparent 78%)";

/**
 * Ethereal Shadow — self-contained drifting smoke built entirely from animated
 * SVG feTurbulence (no external images). fractalNoise → wispy alpha → flooded
 * with `color` → churned by an animated displacement field, then softened.
 * Motion-safe: prefers-reduced-motion renders a still cloud.
 */
export default function EtherealShadow({
  className,
  color = "#d4d4d4",
  opacity = 0.8,
  scale = 60,
}: EtherealShadowProps) {
  const raw = useId();
  const id = `es-${raw.replace(/:/g, "")}`;
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden
      className={className}
      style={{ maskImage: MASK, WebkitMaskImage: MASK, opacity }}
    >
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <filter
            id={id}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            {/* Base cloud — large soft billows */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.01"
              numOctaves={3}
              seed={7}
              stitchTiles="stitch"
              result="turb"
            >
              {!reduce && (
                <animate
                  attributeName="baseFrequency"
                  dur="46s"
                  values="0.006 0.01;0.009 0.007;0.006 0.01"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                />
              )}
            </feTurbulence>

            {/* Slow warp field that drives the drift */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005"
              numOctaves={2}
              seed={4}
              result="warp"
            >
              {!reduce && (
                <animate
                  attributeName="baseFrequency"
                  dur="33s"
                  values="0.005;0.008;0.005"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>

            <feDisplacementMap
              in="turb"
              in2="warp"
              scale={reduce ? 0 : scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="disp"
            />

            {/* Noise luminance → wispy alpha (low-contrast, translucent haze) */}
            <feColorMatrix
              in="disp"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0.6 0 0 0 -0.2"
              result="alpha"
            />

            {/* Flood the wisps with the smoke color */}
            <feFlood floodColor={color} result="tint" />
            <feComposite in="tint" in2="alpha" operator="in" result="smoke" />
            <feGaussianBlur in="smoke" stdDeviation="3.2" />
          </filter>
        </defs>

        <rect x="0" y="0" width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}
