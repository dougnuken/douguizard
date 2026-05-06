"use client";

import InterstellarShader from "./GalaxyField";

/**
 * Scene background — full-screen interstellar shader.
 * Replaces R3F galaxy with shader-only fragment for a more cinematic feel.
 */
export default function Scene3D() {
  return (
    <>
      {/* Layer 1 — The shader */}
      <InterstellarShader speed={1} opacity={1} />

      {/* Layer 2 — Subtle vignette to push shader behind text & give depth */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 35%, rgba(5,5,7,0.55) 100%),
            linear-gradient(180deg, rgba(5,5,7,0.6) 0%, transparent 30%, transparent 70%, rgba(5,5,7,0.85) 100%)
          `,
        }}
      />
    </>
  );
}