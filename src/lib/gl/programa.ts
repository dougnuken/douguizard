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
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "vidrio: shader");
  return s;
}

/** Compila y enlaza el vidrio; triángulo que cubre la pantalla en el atributo 0. Lanza si algo falla. */
export function crearPrograma(gl: WebGL2RenderingContext): Programa {
  const prog = gl.createProgram();
  if (!prog) throw new Error("vidrio: no se pudo crear el programa");
  const vs = shader(gl, gl.VERTEX_SHADER, VS);
  const fs = shader(gl, gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, "a");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "vidrio: enlace");
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
  gl.uniform1f(u.uPhase, v.phase);
  gl.uniform1f(u.uProt, v.prot);
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
