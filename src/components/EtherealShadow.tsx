"use client";

import React, { useRef, useId, useEffect, CSSProperties } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";

interface AnimationConfig {
  scale: number;
  speed: number;
}
interface NoiseConfig {
  opacity: number;
  scale: number;
}
interface EtherealShadowProps {
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  sizing?: "fill" | "stretch";
  style?: CSSProperties;
  className?: string;
}

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number,
): number {
  if (fromLow === fromHigh) return toLow;
  const p = (value - fromLow) / (fromHigh - fromLow);
  return toLow + p * (toHigh - toLow);
}

const useInstanceId = (): string => {
  const id = useId();
  return `ethereal-${id.replace(/:/g, "")}`;
};

/** Inline fractal-noise (no external asset). */
const NOISE_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Organic blob mask, CSS-generated (replaces the external framer PNG). */
const MASK =
  "radial-gradient(65% 60% at 30% 38%, #000 0%, transparent 72%), radial-gradient(55% 70% at 72% 58%, #000 0%, transparent 70%), radial-gradient(70% 55% at 48% 82%, #000 0%, transparent 74%)";

/**
 * Ethereal Shadow (after kokonutd) — a soft masked field warped by animated
 * feTurbulence + feDisplacementMap for a drifting smoke/shadow. Self-contained:
 * no external images. Decorative; motion-safe.
 */
export default function EtherealShadow({
  color = "rgba(255,255,255,0.3)",
  animation,
  noise,
  sizing = "fill",
  style,
  className,
}: EtherealShadowProps) {
  const id = useInstanceId();
  const reduce = useReducedMotion() ?? false;
  const animationEnabled = !!animation && animation.scale > 0 && !reduce;

  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotate = useMotionValue(180);
  const hueAnim = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (!feColorMatrixRef.current || !animationEnabled) return;
    hueAnim.current?.stop();
    hueRotate.set(0);
    hueAnim.current = animate(hueRotate, 360, {
      duration: animationDuration / 25,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
      ease: "linear",
      onUpdate: (v: number) =>
        feColorMatrixRef.current?.setAttribute("values", String(v)),
    });
    return () => hueAnim.current?.stop();
  }, [animationEnabled, animationDuration, hueRotate]);

  const maskSize = sizing === "stretch" ? "100% 100%" : "cover";

  return (
    <div
      aria-hidden
      className={className}
      style={{ overflow: "hidden", position: "relative", width: "100%", height: "100%", ...style }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : "blur(8px)",
        }}
      >
        {animationEnabled && animation && (
          <svg style={{ position: "absolute" }} aria-hidden>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: MASK,
            WebkitMaskImage: MASK,
            maskSize,
            WebkitMaskSize: maskSize,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${NOISE_URI}")`,
            backgroundSize: noise.scale * 160,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
