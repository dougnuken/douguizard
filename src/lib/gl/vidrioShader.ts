/**
 * Vidrio estriado oblicuo, un solo pase (portado de `propuestas/B/index.html`).
 * Franjas con perfil de lente cilíndrica → cara protegida → banda láser legible
 * (desplazamiento horizontal en su banda, el haz no se rompe) → lente del cursor
 * (el vidrio se abre y aclara bajo el puntero) → fuera de la foto: borde
 * estirado + mip borroso, **sin aberración cromática** (F3 P2-11).
 * Lo usan `VidrioGL` (en vivo) y `scripts/build-hero-poster.ts` (horneado).
 */
export const VS = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

export const FS = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uOff, uSize;
uniform float uW, uAng, uStr, uPhase, uProt;
uniform vec4 uFace;
uniform float uLineY, uLineH;
uniform vec2 uMouse;
uniform float uLens, uLensR;
out vec4 o;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 dir = vec2(cos(uAng), sin(uAng));
  float u = dot(p - uOff, dir) + uPhase;
  float k = floor(u / uW), t = fract(u / uW), s = 2.0 * t - 1.0;
  float face = 1.0 - smoothstep(0.78, 1.1, length((p - uFace.xy) / uFace.zw));
  float md = length(p - uMouse);
  float lens = uLensR > 0.0 ? (1.0 - smoothstep(uLensR * 0.5, uLensR * 1.2, md)) * uLens : 0.0;
  float str = uStr * (1.0 - uProt * face) * (1.0 - lens);
  float disp = str * uW * (s * 0.75 + 0.45 * s * s * s + (hash(k) - 0.5) * 0.4);
  float band = uLineH > 0.0 ? 1.0 - smoothstep(uLineH, uLineH * 2.4, abs(p.y - uLineY)) : 0.0;
  vec2 q = p + normalize(mix(dir, vec2(1.0, 0.0), band)) * disp;
  vec2 uv = (q - uOff) / uSize;
  float fuera = max(max(-uv.x, uv.x - 1.0), max(-uv.y, uv.y - 1.0));
  float bias = clamp(fuera * 16.0, 0.0, 4.5) + str * 1.1 * (0.35 + abs(s)) * (1.0 - band);
  float ca = fuera > 0.0 ? 0.0 : str * uW * 0.03 * (0.3 + abs(s)) / uSize.x * (1.0 - band);
  vec3 col = vec3(texture(uTex, uv + vec2(ca, 0.0), bias).r, texture(uTex, uv, bias).g, texture(uTex, uv - vec2(ca, 0.0), bias).b);
  col *= mix(1.0, 0.62, smoothstep(0.0, 0.3, fuera));
  float sh = 0.3 + str, g = 1.0 - lens;
  float lip = pow(smoothstep(0.10, 0.0, t), 2.0) * 0.22 * sh;
  float crease = pow(smoothstep(0.80, 1.0, t), 2.0) * 0.30 * sh;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, vec3(luma), 0.08 * str);
  col = col * (1.0 - 0.2 * str * s * s) + lip * g - col * crease * g;
  col *= 1.0 + 0.06 * lens;
  o = vec4(col, 1.0);
}`;

export const UNIFORMES = [
  "uTex", "uRes", "uDpr", "uOff", "uSize", "uW", "uAng", "uStr", "uPhase", "uProt",
  "uFace", "uLineY", "uLineH", "uMouse", "uLens", "uLensR",
] as const;

export type Uniforme = (typeof UNIFORMES)[number];
