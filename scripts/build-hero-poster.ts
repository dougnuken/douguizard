/**
 * Hornea el póster del héroe (07 F4): abre en Chromium un arnés con **el mismo
 * shader** que `VidrioGL` y la foto activa de `src/data/hero.ts`, pinta el
 * canvas a tamaño nativo de la foto (lente cerrada) en cada estado (`cine`,
 * `losa`, `movil`) y con `sharp` saca AVIF q 58 y WebP q 78 a los anchos de
 * `anchosPoster()` (nunca mayores que el máster). Escribe también la textura
 * limpia del WebGL y `manifest.json` en `public/hero/<id>-v<version>/`.
 * Además, el retrato de K13 (F3).
 *
 *   npm run hero:poster            # la foto activa
 *   HERO_FOTO=<ruta.jpg> HERO_SALIDA=<dir> npm run hero:poster   # otra foto 3:4 (prueba de cambio de foto)
 *
 * Cambiar de foto = añadir su objeto en `hero.ts`, cambiar `fotoActiva`, subir
 * `version` y correr esto. Ningún componente lleva números de la foto.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { ESTADOS, anchosPoster, getFotoActiva, retratoPerfil, vidrio, type FotoHeroe } from "../src/data/hero";
import { uniformesVidrio, type UniformesVidrio } from "../src/lib/escena";
import { FS, VS } from "../src/lib/gl/vidrioShader";

async function hornear(foto: FotoHeroe, master: string, raiz: string) {
  const { w, h } = await sharp(master).metadata().then((m) => ({ w: m.width ?? 0, h: m.height ?? 0 }));
  if (w !== foto.tamano.w || h !== foto.tamano.h) throw new Error(`hero.ts dice ${foto.tamano.w}×${foto.tamano.h}; el máster mide ${w}×${h}`);
  const salida = (ruta: string) => path.join(raiz, ruta);
  mkdirSync(path.dirname(salida(foto.rutas.textura)), { recursive: true });

  // La textura limpia (WebGL y la lente CSS): ancho nativo, ≤ 1600.
  await sharp(master).resize({ width: Math.min(w, 1600) }).webp({ quality: 84, effort: 6 }).toFile(salida(foto.rutas.textura));

  const dataUrl = `data:image/jpeg;base64,${readFileSync(master).toString("base64")}`;
  const navegador = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const pagina = await navegador.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  // tsx (esbuild, keepNames) envuelve las funciones con `__name`: en la página no existe.
  await pagina.evaluate("globalThis.__name = (f) => f");
  const manifest: Record<string, unknown> = { id: foto.id, version: foto.version, tamano: foto.tamano, textura: foto.rutas.textura, poster: {} };
  try {
    for (const estado of ESTADOS) {
      const u = uniformesVidrio({
        caja: { w, h },
        foto: { ...foto.tamano, cara: foto.cara, ojo: foto.ojo, laser: foto.laser },
        params: vidrio[estado],
        // La portada de `/about` no lleva banda (su láser es un elemento propio que se mueve).
        laser: estado !== "cine",
      });
      const png = await pagina.evaluate(
        async ({ VS, FS, u, w, h, dataUrl }: { VS: string; FS: string; u: UniformesVidrio; w: number; h: number; dataUrl: string }) => {
          const img = new Image();
          img.src = dataUrl;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const gl = c.getContext("webgl2", { preserveDrawingBuffer: true, premultipliedAlpha: true, antialias: false });
          if (!gl) throw new Error("arnés sin WebGL2");
          const sh = (t: number, src: string) => {
            const s = gl.createShader(t)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
            return s;
          };
          const pr = gl.createProgram()!;
          gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
          gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
          gl.bindAttribLocation(pr, 0, "a");
          gl.linkProgram(pr);
          gl.useProgram(pr);
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
          gl.enableVertexAttribArray(0);
          gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
          gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          const L = (n: string) => gl.getUniformLocation(pr, n);
          gl.viewport(0, 0, w, h);
          gl.uniform1i(L("uTex"), 0);
          gl.uniform2f(L("uRes"), w, h);
          gl.uniform1f(L("uDpr"), 1);
          gl.uniform2f(L("uOff"), u.off[0], u.off[1]);
          gl.uniform2f(L("uSize"), u.size[0], u.size[1]);
          gl.uniform1f(L("uW"), u.w);
          gl.uniform1f(L("uAng"), u.ang);
          gl.uniform1f(L("uStr"), u.str);
          gl.uniform1f(L("uPhase"), 0);
          gl.uniform1f(L("uProt"), u.prot);
          gl.uniform4f(L("uFace"), u.face[0], u.face[1], u.face[2], u.face[3]);
          gl.uniform1f(L("uLineY"), u.lineY);
          gl.uniform1f(L("uLineH"), u.lineH);
          gl.uniform2f(L("uMouse"), -1e4, -1e4);
          gl.uniform1f(L("uLens"), 0);
          gl.uniform1f(L("uLensR"), u.lensR);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          return c.toDataURL("image/png");
        },
        { VS, FS, u, w, h, dataUrl },
      );
      const buf = Buffer.from(png.split(",")[1], "base64");
      const r = foto.rutas.poster[estado];
      for (const ancho of anchosPoster(w)) {
        await sharp(buf).resize({ width: ancho }).avif({ quality: 58, effort: 6 }).toFile(salida(r.avif[ancho]));
        await sharp(buf).resize({ width: ancho }).webp({ quality: 78, effort: 6 }).toFile(salida(r.webp[ancho]));
      }
      (manifest.poster as Record<string, unknown>)[estado] = r;
      console.log(`  ${estado}: ${anchosPoster(w).join(", ")} px`);
    }
  } finally {
    await navegador.close();
  }
  writeFileSync(salida(foto.rutas.manifest), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`póster horneado de ${foto.id} v${foto.version} en ${path.dirname(salida(foto.rutas.manifest))}`);
}

async function main() {
  const otra = process.env.HERO_FOTO;
  if (otra) {
    // Prueba de cambio de foto: misma geometría normalizada que la activa, otro máster 3:4.
    const { width = 0, height = 0 } = await sharp(otra).metadata();
    const base = getFotoActiva();
    const { foto } = await import("../src/data/hero");
    const f = foto(path.basename(otra, path.extname(otra)), 1, { ...base, tamano: { w: width, h: height }, master: otra });
    await hornear(f, otra, process.env.HERO_SALIDA ?? "tests/out/hero");
    return;
  }
  const f = getFotoActiva();
  await hornear(f, f.master, "public");
  // K13 (F3): el retrato de la card de Perfil del home.
  const k13 = path.join("docs/rediseno-2026/retratos-hf", `${retratoPerfil.id}.jpg`);
  mkdirSync(path.join("public", "portrait"), { recursive: true });
  for (const [w, ruta] of Object.entries(retratoPerfil.rutas.avif)) {
    await sharp(k13).resize({ width: Number(w) }).avif({ quality: 50, effort: 6 }).toFile(path.join("public", ruta));
  }
  for (const [w, ruta] of Object.entries(retratoPerfil.rutas.webp)) {
    await sharp(k13).resize({ width: Number(w) }).webp({ quality: 72, effort: 6 }).toFile(path.join("public", ruta));
  }
  console.log(`retrato K13 ${retratoPerfil.id} v${retratoPerfil.version} listo en public/portrait/`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
