"use client";

import { useEffect, useRef } from "react";

/**
 * An animated field of simplex noise, blended through four colours.
 *
 * Three octaves, each dragged in its own direction and each folded into the
 * next, so the field churns instead of sliding. There is no texture and no
 * asset: the whole thing is one triangle strip and a fragment shader.
 */
const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / max(1.0, u_resolution.y);
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.1;

  float n1 = snoise(p * 0.4  + vec2( t * 0.2,  -t * 0.3));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15,  t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2( t * 0.1,  -t * 0.2)  + n2 * 0.2);

  vec3 col = u_bg;

  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);

  col = mix(col, u_colors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
  col = mix(col, u_colors[1], smoothstep(-0.1, 0.6, n2) * 0.7);
  col = mix(col, u_colors[2], smoothstep(-0.3, 0.4, n3) * 0.6);
  col = mix(col, u_colors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.5);

  float glow = smoothstep(0.8, 0.0, dist) * 0.3;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`;

export interface VelarisProps {
  /** The ground the noise is mixed into. Give it the page's own paper. */
  bg?: string;
  /** Four hex colours, in mixing order. Shorter arrays are padded with `bg`. */
  colors?: string[];
  /** Multiplier on the clock. 1 is slow; 2 is the reference. */
  speed?: number;
  /** Film grain, 0 to 1. */
  grain?: number;
  /** Render scale, 0.3 to 1. The cheapest dial there is. */
  resolution?: number;
  /** Cap on device pixel ratio. */
  maxDpr?: number;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_COLORS = ["#86efac", "#4ade80", "#059669", "#000000"];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h.slice(0, 6);
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function Velaris({
  bg = "#000000",
  colors = DEFAULT_COLORS,
  speed = 2,
  grain = 0.3,
  resolution = 0.7,
  maxDpr = 1.75,
  className = "",
  children,
}: VelarisProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Latest values for the loop, which lives outside React. Written in an
  // effect rather than during render: a ref touched while rendering is the
  // kind of thing that works until concurrent React decides otherwise.
  const props = useRef({ bg, colors, speed, grain, resolution, maxDpr });
  useEffect(() => {
    props.current = { bg, colors, speed, grain, resolution, maxDpr };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // A canvas whose context never arrived does not go quietly — it paints
    // white over whatever is behind it. Take it out of the picture instead.
    if (!gl) {
      canvas.style.display = "none";
      container.dataset.webgl = "unsupported";
      return;
    }

    function compile(type: number, src: string): WebGLShader | null {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      // The reference version skipped this check, which means a shader that
      // fails to compile draws nothing and says nothing.
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        console.error("velaris: shader failed —", gl!.getShaderInfoLog(sh) || "no log");
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) {
      canvas.style.display = "none";
      container.dataset.webgl = "build-failed";
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("velaris:", gl.getProgramInfoLog(program));
      canvas.style.display = "none";
      container.dataset.webgl = "link-failed";
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      res: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      grain: gl.getUniformLocation(program, "u_grain"),
      // `u_colors[0]`, not `u_colors`: some drivers only name the first
      // element of an array uniform, and the bare name comes back null.
      colors: gl.getUniformLocation(program, "u_colors[0]") ??
        gl.getUniformLocation(program, "u_colors"),
      bg: gl.getUniformLocation(program, "u_bg"),
    };

    /* Palette, rebuilt only when it changes. The reference version parsed four
       hex strings and allocated a Float32Array every single frame. */
    const palette = new Float32Array(12);
    const bgRgb = new Float32Array(3);
    let paletteKey = "";

    function syncPalette() {
      const C = props.current;
      const key = C.bg + "|" + C.colors.join(",");
      if (key === paletteKey) return;
      paletteKey = key;
      const fallback = hexToRgb(C.bg);
      for (let i = 0; i < 4; i++) {
        const c = C.colors[i] ? hexToRgb(C.colors[i]) : fallback;
        palette[i * 3] = c[0];
        palette[i * 3 + 1] = c[1];
        palette[i * 3 + 2] = c[2];
      }
      bgRgb.set(fallback);
    }

    let width = 0;
    let height = 0;

    function resize() {
      const C = props.current;
      const dpr = Math.min(window.devicePixelRatio || 1, Math.max(1, C.maxDpr));
      const scale = Math.min(1, Math.max(0.3, C.resolution));
      const w = Math.max(2, Math.round(container!.clientWidth * dpr * scale));
      const h = Math.max(2, Math.round(container!.clientHeight * dpr * scale));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas!.width = w;
      canvas!.height = h;
      gl!.viewport(0, 0, w, h);
    }

    let raf = 0;
    let running = true;
    let visible = true;

    function frame(ms: number) {
      const C = props.current;
      syncPalette();
      gl!.uniform2f(locs.res, width, height);
      gl!.uniform1f(locs.time, ms * 0.001 * C.speed);
      gl!.uniform1f(locs.grain, C.grain);
      gl!.uniform3fv(locs.bg, bgRgb);
      gl!.uniform3fv(locs.colors, palette);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function tick(ms: number) {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      // Offscreen or in a background tab it draws nothing. A full-screen
      // fragment shader left running behind another window is a laptop fan.
      if (!visible) return;
      frame(ms);
    }

    resize();
    frame(reduced ? 4200 : 0);
    if (!reduced) raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) frame(4200);
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      visible = !document.hidden;
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      canvas.style.display = "none";
    };

    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}
