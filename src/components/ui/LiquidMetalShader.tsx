"use client";

import { useEffect, useRef } from "react";
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";

interface LiquidMetalShaderProps {
  speed?: number;
  scale?: number;
  borderRadius?: string;
  className?: string;
  /**
   * Shader color tint via offsets — defaults tuned for warm metallic.
   * For violet/cosmic tint use shiftRed: -0.2, shiftBlue: 0.4
   */
  shiftRed?: number;
  shiftBlue?: number;
  contour?: number;
  distortion?: number;
}

/**
 * Renders the @paper-design liquid metal shader as an absolutely-positioned
 * background fill. Parent must be `position: relative` and clip overflow.
 * Use as a decorative layer behind other content.
 */
export function LiquidMetalShader({
  speed = 0.6,
  scale = 8,
  borderRadius = "9999px",
  className = "",
  shiftRed = -0.2,
  shiftBlue = 0.4,
  contour = 0,
  distortion = 0,
}: LiquidMetalShaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const mountRef = useRef<any>(null);

  // Inject the canvas-fill style only once per page
  useEffect(() => {
    const styleId = "liquid-metal-shader-canvas-fill";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .liquid-metal-shader-fill canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    if (mountRef.current?.destroy) {
      mountRef.current.destroy();
    }

    mountRef.current = new ShaderMount(
      ref.current,
      liquidMetalFragmentShader,
      {
        u_repetition: 4,
        u_softness: 0.5,
        u_shiftRed: shiftRed,
        u_shiftBlue: shiftBlue,
        u_distortion: distortion,
        u_contour: contour,
        u_angle: 45,
        u_scale: scale,
        u_shape: 1,
        u_offsetX: 0.1,
        u_offsetY: -0.1,
      },
      undefined,
      speed,
    );

    return () => {
      if (mountRef.current?.destroy) {
        mountRef.current.destroy();
        mountRef.current = null;
      }
    };
  }, [speed, scale, shiftRed, shiftBlue, contour, distortion]);

  /** Imperative speed setter for hover/press transitions */
  const setSpeed = (s: number) => {
    mountRef.current?.setSpeed?.(s);
  };

  // Expose via data-attribute hack so parent can access via ref forwarding alternative
  // (We use a regular div ref + a custom hook below for a cleaner API)

  return (
    <div
      ref={ref}
      className={`liquid-metal-shader-fill absolute inset-0 pointer-events-none ${className}`}
      style={{
        borderRadius,
        overflow: "hidden",
      }}
      data-shader-speed-setter={setSpeed.toString()}
    />
  );
}