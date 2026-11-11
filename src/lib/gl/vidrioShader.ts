/**
 * Vidrio estriado oblicuo, un solo pase. Pulido I: cada estría es una lente
 * cilíndrica de verdad (como `pulido-I/referencias/ref-vidrio-estriado-refraccion.jpg`):
 * - comprime dentro de su ancho un trozo de foto más ancho que ella, así la
 *   imagen «se repite» de estría en estría (más comprimida hacia los cantos);
 * - el desenfoque varía a lo ancho (nítido en el lomo, corrido en los cantos) y
 *   de una estría a otra (irregularidad de fábrica), y es anisótropo: tres
 *   lecturas a lo largo del eje que además separan rojo y azul en los cantos;
 * - volumen: brillo especular fino, canto brillante en la junta y sombra al
 *   otro lado.
 * Lo demás sigue igual: cara protegida → banda láser legible (desplazamiento
 * horizontal en su banda, el haz no se rompe) → zona nítida (`uMouse`, `uLens`:
 * el cursor o el barrido automático) → fuera de la foto: borde estirado + mip
 * borroso, sin aberración cromática (F3 P2-11).
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
uniform float uW, uAng, uStr, uPhase, uProt, uCaraF;
uniform vec4 uFace;
uniform float uLineY, uLineH;
uniform vec2 uMouse;
uniform float uLens, uLensR;
out vec4 o;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
// Una franja ya sombreada: estría \`k\`, posición \`t\` ∈ [0, 1] dentro de ella.
// \`str\` = refracción (0 bajo la zona nítida); \`g\` = cuánto vidrio queda (1 − lente).
vec3 franja(vec2 p, vec2 dir, float k, float t, float str, float band, float g, float aa) {
  float s = 2.0 * t - 1.0;
  float h1 = hash(k), h2 = hash(k + 37.0);
  // Perfil de lente: la pendiente crece hacia los cantos (s³) → más compresión ahí.
  float amp = str * uW * (0.84 + 0.32 * h2);
  float disp = amp * (s * (0.6 + 0.52 * s * s) + (h1 - 0.5) * 0.46);
  vec2 eje = normalize(mix(dir, vec2(1.0, 0.0), band));
  vec2 q = p + eje * disp;
  vec2 uv = (q - uOff) / uSize;
  float fuera = max(max(-uv.x, uv.x - 1.0), max(-uv.y, uv.y - 1.0));
  float libre = 1.0 - band;
  // Cuánta foto cabe en un píxel de la estría (1 = sin comprimir).
  float comp = 1.0 + 2.0 * str * (0.6 + 1.56 * s * s);
  float bias = clamp(fuera * 16.0, 0.0, 4.5) + (0.8 * log2(comp) + str * (0.2 + 1.1 * h2 * h2)) * libre;
  // Tres lecturas a lo largo del eje: desenfoque corrido + dispersión en los cantos.
  vec2 d = eje * (amp * (0.035 + 0.21 * s * s) * libre) / uSize;
  vec3 a = texture(uTex, uv - d, bias).rgb;
  vec3 b = texture(uTex, uv, bias).rgb;
  vec3 c = texture(uTex, uv + d, bias).rgb;
  vec3 col = (a + 2.0 * b + c) * 0.25;
  float disper = fuera > 0.0 ? 0.0 : min(1.0, 2.2 * str * s * s) * libre;
  col = mix(col, vec3(0.62 * a.r + 0.30 * b.r + 0.08 * c.r, col.g, 0.08 * a.b + 0.30 * b.b + 0.62 * c.b), disper);
  col *= mix(1.0, 0.62, smoothstep(0.0, 0.3, fuera));
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, vec3(luma), 0.06 * str);
  // Volumen de la estría: la luz entra por la izquierda.
  float sh = g * (0.32 + str);
  float lomo = 1.0 + sh * (0.12 * (1.0 - smoothstep(0.0, 0.45, t)) - 0.26 * pow(smoothstep(0.42, 1.0, t), 1.6));
  float e = (t - 0.21) / 0.075;
  float brillo = exp(-e * e) * 0.2 * sh;
  float canto = (1.0 - smoothstep(0.0, max(0.085, 2.6 * aa), t)) * 0.56 * sh;
  float sombra = smoothstep(1.0 - max(0.14, 3.5 * aa), 1.0, t) * 0.27 * sh;
  col *= lomo * (1.0 - sombra);
  return col + (brillo + canto) * (0.22 + 0.78 * luma) * vec3(1.0, 0.985, 0.97);
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 dir = vec2(cos(uAng), sin(uAng));
  float u = (dot(p - uOff, dir) + uPhase) / uW;
  float k = floor(u), t = fract(u);
  // Antialias de la arista (F4 P1-2): ancho de un píxel de dispositivo en unidades de estría.
  float aa = max(fwidth(u), 1e-4);
  float face = 1.0 - smoothstep(0.78, 1.1, length((p - uFace.xy) / uFace.zw));
  float md = length(p - uMouse);
  float lens = uLensR > 0.0 ? (1.0 - smoothstep(uLensR * 0.55, uLensR * 1.2, md)) * uLens : 0.0;
  // P1-2 (crítica F5): en \`cine\` la fuerza baja también en una elipse algo mayor que la cara (ojos–boca).
  float caraA = 1.0 - smoothstep(0.95, 1.5, length((p - uFace.xy) / uFace.zw));
  float str = uStr * (1.0 - uProt * face) * mix(1.0, uCaraF, caraA) * (1.0 - lens);
  float band = uLineH > 0.0 ? 1.0 - smoothstep(uLineH, uLineH * 2.4, abs(p.y - uLineY)) : 0.0;
  float g = 1.0 - lens;
  vec3 col = franja(p, dir, k, t, str, band, g, aa);
  float w = smoothstep(0.0, aa * 1.5, t);
  // En el borde de entrada se funde con la estría anterior (solo en esa franja: tres lecturas más).
  if (w < 1.0) col = mix(franja(p, dir, k - 1.0, t + 1.0, str, band, g, aa), col, w);
  col *= 1.0 + 0.04 * lens;
  o = vec4(col, 1.0);
}`;

export const UNIFORMES = [
  "uTex", "uRes", "uDpr", "uOff", "uSize", "uW", "uAng", "uStr", "uPhase", "uProt",
  "uFace", "uLineY", "uLineH", "uMouse", "uLens", "uLensR", "uCaraF",
] as const;

export type Uniforme = (typeof UNIFORMES)[number];
