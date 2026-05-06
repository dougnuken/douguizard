"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface InterstellarShaderProps {
  /** Speed multiplier. Default 1 */
  speed?: number;
  /** Opacity of the effect. Default 1 */
  opacity?: number;
}

/**
 * Interstellar fragment shader — concentric expanding color lines.
 * Adapted from a community shader to use douguizard's cosmic palette
 * (peach, violet, cool blue) instead of pure RGB.
 * Mouse-reactive: lines pulse toward cursor position.
 */
export default function InterstellarShader({
  speed = 1,
  opacity = 1,
}: InterstellarShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera | null;
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    uniforms: {
      time: { value: number };
      resolution: { value: THREE.Vector2 };
      mouse: { value: THREE.Vector2 };
    } | null;
    animationId: number;
  }>({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const refs = sceneRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Adapted shader with cosmic palette (peach, violet, blue)
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        // Mouse pull — subtle distortion toward cursor
        vec2 mouseOffset = (mouse * 2.0 - 1.0) * 0.15;
        uv -= mouseOffset;

        float t = time * 0.05;
        float lineWidth = 0.0025;

        vec3 color = vec3(0.0);

        // Three channels with custom palette colors
        // Channel 0 = peach (#ffa07a)
        // Channel 1 = violet (#b8a4ff)
        // Channel 2 = cool blue (#7fc5ff)
        vec3 peach = vec3(1.0, 0.627, 0.478);
        vec3 violet = vec3(0.722, 0.643, 1.0);
        vec3 blue = vec3(0.498, 0.773, 1.0);

        for(int j = 0; j < 3; j++){
          float channel = 0.0;
          for(int i = 0; i < 5; i++){
            channel += lineWidth * float(i * i) /
              abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
              - length(uv) + mod(uv.x + uv.y, 0.2));
          }
          if (j == 0) color += peach * channel;
          else if (j == 1) color += violet * channel;
          else color += blue * channel;
        }

        // Soft vignette to push edges into darkness
        float vignette = 1.0 - length(uv) * 0.35;
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Initialize scene
    refs.camera = new THREE.Camera();
    refs.camera.position.z = 1;
    refs.scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    refs.uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: refs.uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    refs.scene.add(mesh);

    refs.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mouse tracking
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1 - e.clientY / window.innerHeight;
    };

    // Handle resize
    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      refs.renderer.setSize(width, height);
      refs.uniforms.resolution.value.x = refs.renderer.domElement.width;
      refs.uniforms.resolution.value.y = refs.renderer.domElement.height;
    };

    handleResize();
    window.addEventListener("resize", handleResize, false);
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (refs.uniforms) {
        refs.uniforms.time.value += 0.05 * speed;
        refs.uniforms.mouse.value.set(mouseX, mouseY);
      }
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      refs.renderer?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
      style={{ opacity, background: "#050507" }}
    />
  );
}