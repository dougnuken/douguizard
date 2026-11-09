import { FS, UNIFORMES, VS, type Uniforme } from "./vidrioShader";
import type { UniformesVidrio } from "@/lib/escena";

export interface Programa {
  prog: WebGLProgram;
  buf: WebGLBuffer;
  u: Record<Uniforme, WebGLUniformLocation | null>;
}

function shader(gl: WebGL2RenderingContext, tipo: number, src: string) {
  const s = gl.createShader(tipo);
  if (!s) throw new Error("vidrio: no se pudo crear el shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

/** Un respiro al hilo principal entre sondeos de la compilación. */
const respiro = () => new Promise<void>((r) => setTimeout(r, 16));

/**
 * Compila y enlaza el vidrio; triángulo que cubre la pantalla en el atributo 0.
 * Rechaza si algo falla. G1: con `KHR_parallel_shader_compile` no pregunta el
 * estado (llamada síncrona que espera a la GPU) hasta que el driver avisa que
 * terminó, y entre sondeo y sondeo devuelve el hilo principal. Sin la extensión,
 * el camino de siempre.
 */
export async function crearPrograma(gl: WebGL2RenderingContext): Promise<Programa> {
  const prog = gl.createProgram();
  if (!prog) throw new Error("vidrio: no se pudo crear el programa");
  const vs = shader(gl, gl.VERTEX_SHADER, VS);
  const fs = shader(gl, gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, "a");
  gl.linkProgram(prog);
  const ext = gl.getExtension("KHR_parallel_shader_compile");
  if (ext) {
    const limite = performance.now() + 5000;
    while (!gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR) && performance.now() < limite) await respiro();
  }
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log =
      (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) && gl.getShaderInfoLog(vs)) ||
      (!gl.getShaderParameter(fs, gl.COMPILE_STATUS) && gl.getShaderInfoLog(fs)) ||
      gl.getProgramInfoLog(prog);
    throw new Error(log || "vidrio: enlace");
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  if (!buf) throw new Error("vidrio: sin búfer");
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const u = Object.fromEntries(UNIFORMES.map((n) => [n, gl.getUniformLocation(prog, n)])) as Programa["u"];
  return { prog, buf, u };
}

/** Un cuadro. `res` en px CSS; el búfer del canvas ya mide `res × dpr`. */
export function dibujar(
  gl: WebGL2RenderingContext,
  { u }: Programa,
  v: UniformesVidrio,
  res: { w: number; h: number; dpr: number },
  lente: { x: number; y: number; abierta: number },
) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1i(u.uTex, 0);
  gl.uniform2f(u.uRes, res.w, res.h);
  gl.uniform1f(u.uDpr, res.dpr);
  gl.uniform2f(u.uOff, v.off[0], v.off[1]);
  gl.uniform2f(u.uSize, v.size[0], v.size[1]);
  gl.uniform1f(u.uW, v.w);
  gl.uniform1f(u.uAng, v.ang);
  gl.uniform1f(u.uStr, v.str);
  gl.uniform1f(u.uPhase, v.phase + v.centro);
  gl.uniform1f(u.uProt, v.prot);
  gl.uniform1f(u.uCaraF, v.caraF);
  gl.uniform4f(u.uFace, v.face[0], v.face[1], v.face[2], v.face[3]);
  gl.uniform1f(u.uLineY, v.lineY);
  gl.uniform1f(u.uLineH, v.lineH);
  gl.uniform2f(u.uMouse, lente.x, lente.y);
  gl.uniform1f(u.uLens, lente.abierta);
  gl.uniform1f(u.uLensR, v.lensR);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

export function liberar(gl: WebGL2RenderingContext, p: Programa, tex: WebGLTexture | null) {
  gl.deleteBuffer(p.buf);
  gl.deleteProgram(p.prog);
  if (tex) gl.deleteTexture(tex);
}

/** Un cuadro ya pintado fuera de pantalla (`prepintar`), listo para volcarlo al canvas. */
export interface Prepintado {
  fb: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
}

/**
 * G1: pinta el primer cuadro en un framebuffer fuera de pantalla y espera a la
 * GPU con una valla (`fenceSync`) sondeada sin bloquear. Sin GPU (SwiftShader,
 * como en Lighthouse/PSI) el primer cuadro visible esperaba dentro del commit,
 * en el hilo principal, a la compilación perezosa del shader, los mipmaps y el
 * rasterizado (~100 ms reales, ×4 en el Lighthouse móvil). Así esa espera pasa
 * fuera del hilo y el cuadro visible es solo un `blitFramebuffer`. Con GPU real
 * cuesta un sondeo. `null` si no se pudo (se pinta como siempre).
 */
export async function prepintar(gl: WebGL2RenderingContext, w: number, h: number, pintar: () => void): Promise<Prepintado | null> {
  const tex = gl.createTexture();
  const fb = gl.createFramebuffer();
  if (!tex || !fb) return null;
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  pintar();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  const valla = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  gl.flush();
  if (valla) {
    const limite = performance.now() + 3000;
    while (gl.getSyncParameter(valla, gl.SYNC_STATUS) !== gl.SIGNALED && performance.now() < limite && !gl.isContextLost()) await respiro();
    gl.deleteSync(valla);
  }
  return { fb, tex, w, h };
}

/** Copia el cuadro prepintado al canvas (mismo tamaño) y lo libera. */
export function volcar(gl: WebGL2RenderingContext, p: Prepintado) {
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, p.fb);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  gl.blitFramebuffer(0, 0, p.w, p.h, 0, 0, p.w, p.h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  soltar(gl, p);
}

export function soltar(gl: WebGL2RenderingContext, p: Prepintado) {
  gl.deleteFramebuffer(p.fb);
  gl.deleteTexture(p.tex);
}
