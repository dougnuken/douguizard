import { chromium } from "@playwright/test";
import sharp from "sharp";
import { getFotoActiva } from "../../src/data/hero";
import { getSite } from "../../src/data/site";
import { tableroDict } from "../../src/i18n/tablero";

/**
 * Hornea las tarjetas Open Graph (F8): `public/og.png` (ES) y `public/og-en.png`
 * (EN), 1200 × 630, con el póster `cine` de la foto activa de `src/data/hero.ts`,
 * el nombre en la fuente del lockup, el láser a la altura de los ojos y el claim
 * de K2. Usa las fuentes reales del sitio: abre la página que sirve
 * `next start` y cambia su cuerpo por la tarjeta.
 *
 *   npm run build && npx next start -p 3131     # en otra terminal
 *   npm run og
 *
 * Cambiar la foto (`hero.ts` + `npm run hero:poster`) → volver a correr esto.
 */
const BASE = process.env.OG_BASE ?? "http://localhost:3131";
const W = 1200;
const H = 630;

type Datos = {
  W: number;
  H: number;
  poster: string;
  fotoW: number;
  ojoY: number;
  fuenteNombre: string;
  nombre: string;
  claim: string;
  rol: string;
  dominio: string;
};

async function main() {
  const foto = getFotoActiva();
  const anchos = Object.keys(foto.rutas.poster.cine.avif).map(Number);
  const poster = foto.rutas.poster.cine.avif[Math.max(...anchos)];
  const browser = await chromium.launch();
  for (const locale of ["es", "en"] as const) {
    const site = getSite(locale);
    const page = await browser.newPage({
      viewport: { width: W, height: H },
      deviceScaleFactor: 1,
    });
    await page.goto(`${BASE}${locale === "es" ? "/" : "/en"}`, {
      waitUntil: "networkidle",
    });
    const fuenteNombre = await page.evaluate(() => {
      const el = document.querySelector("[data-lockup]");
      return (
        el ? getComputedStyle(el).fontFamily : "Geologica, sans-serif"
      ).replaceAll('"', "'");
    });
    const datos: Datos = {
      W,
      H,
      poster,
      // Ancho pintado de la foto a 630 de alto, y la línea del ojo de `hero.ts`.
      fotoW: Math.round((H * foto.tamano.w) / foto.tamano.h),
      ojoY: Math.round(H * foto.ojo),
      fuenteNombre,
      nombre: site.name,
      claim: tableroDict[locale].k2.claim,
      rol: site.titleHeadline,
      dominio: site.domain,
    };
    await page.evaluate((d: Datos) => {
      const gris = "#a1a1ab";
      document.body.removeAttribute("class");
      document.body.innerHTML = `
<div style="position:fixed;inset:0;width:${d.W}px;height:${d.H}px;overflow:hidden;background:#060608;color:#f5f5f7">
  <img src="${d.poster}" alt="" style="position:absolute;top:0;right:0;height:${d.H}px;width:${d.fotoW}px;object-fit:cover;
    -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 40%);mask-image:linear-gradient(90deg,transparent 0,#000 40%)">
  <div style="position:absolute;left:0;right:0;top:${d.ojoY - 1}px;height:2px;background:#ff3344;
    box-shadow:0 0 6px 1px rgba(255,51,68,.85),0 0 22px 4px rgba(255,51,68,.35);
    -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6%);mask-image:linear-gradient(90deg,transparent 0,#000 6%)"></div>
  <p style="position:absolute;left:72px;top:64px;margin:0;font:500 22px/1 'Instrument Sans',sans-serif;color:${gris}">${d.dominio}</p>
  <p style="position:absolute;left:66px;bottom:${d.H - d.ojoY + 20}px;margin:0;font:600 104px/0.9 ${d.fuenteNombre};letter-spacing:-0.05em;white-space:nowrap">${d.nombre}</p>
  <p style="position:absolute;left:72px;top:${d.ojoY + 40}px;width:640px;margin:0;font:600 50px/1.06 Urbanist,sans-serif;letter-spacing:-0.025em;text-wrap:balance">${d.claim}</p>
  <p style="position:absolute;left:72px;bottom:60px;margin:0;font:400 22px/1.3 'Instrument Sans',sans-serif;color:${gris}">${d.rol}</p>
</div>`;
    }, datos);
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => undefined)),
      );
      await document.fonts.ready;
    });
    const png = await page.screenshot({
      clip: { x: 0, y: 0, width: W, height: H },
    });
    const salida = locale === "es" ? "public/og.png" : "public/og-en.png";
    const out = await sharp(png)
      .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
      .toFile(salida);
    console.log(
      `${salida} · ${out.width}×${out.height} · ${Math.round(out.size / 1024)} KB · foto ${foto.id} v${foto.version}`,
    );
    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
