/** Sube la foto (mismo origen: sin `blob:`, CSP `img-src 'self'`) con mipmaps: el shader los usa para el desenfoque. */
export function subirTextura(gl: WebGL2RenderingContext, img: TexImageSource): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("vidrio: sin textura");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

/**
 * Carga y decodifica una imagen del mismo origen **fuera del hilo principal**
 * (G1): `fetch` → `Blob` → `createImageBitmap`. Con un `<img>`, `texImage2D`
 * volvía a decodificar la foto en el hilo principal (Chromium la re-extrae sin
 * premultiplicar): ~75 ms con CPU ×4. El `ImageBitmap` ya trae los píxeles y la
 * subida no decodifica nada. Sin `createImageBitmap`, el `<img>` de siempre.
 * `fetch` es del mismo origen (CSP `connect-src 'self'`) y usa la caché HTTP.
 */
export async function cargarImagen(src: string): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      const r = await fetch(src);
      if (!r.ok) throw new Error(`vidrio: textura ${r.status}`);
      return await createImageBitmap(await r.blob(), { premultiplyAlpha: "none", colorSpaceConversion: "default" });
    } catch {
      // Navegador sin `createImageBitmap(Blob)` o fallo de red: el `<img>`.
    }
  }
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  return img;
}
