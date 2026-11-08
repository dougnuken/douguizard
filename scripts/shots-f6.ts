// Capturas de F6 (hoja de casos). Necesita `npm run build && npx next start -p 3131`.
//   npx tsx scripts/shots-f6.ts
// Salida: docs/rediseno-2026/F6-capturas/ — hoja abierta desde el home (1440 y 390,
// ES y EN) para Naowee, Andes (NDA), olbo y DC Medical; la página completa de los
// mismos por URL directa; y `hoja-1440.webm` (abrir, leer, cerrar).
import { chromium, type Page } from "@playwright/test";
import { mkdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { settle } from "../tests/e2e/settle";
import { setTheme } from "../tests/e2e/matrix";

const NOMBRE = "globalThis.__name = (f) => f;";
const BASE = "http://localhost:3131";
const OUT = "docs/rediseno-2026/F6-capturas";
const CASOS = ["naowee-suid", "mercadolibre-andes", "olbo", "dc-medical"];
// `--arreglos` (tras 06-CRITICA-F6): solo las hojas de Naowee y Andes en ES,
// Naowee en EN, y el vídeo con los tres cierres.
const ARREGLOS = process.argv.includes("--arreglos");
const VISTAS = [
  { ancho: 1440, alto: 900 },
  { ancho: 390, alto: 844 },
];

async function abrirHoja(page: Page, pre: string, slug: string) {
  await page.goto(`${BASE}${pre || "/"}`, { waitUntil: "networkidle" });
  await settle(page);
  const enlace = page.locator(`#main a[href="${pre}/work/${slug}"]:visible`).first();
  await enlace.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  await enlace.click();
  await page.waitForURL(`**${pre}/work/${slug}`);
  await page.locator('dialog.hoja[data-estado="abierta"]').waitFor();
  await page.waitForTimeout(900);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const { ancho, alto } of VISTAS) {
    for (const pre of ["", "/en"]) {
      const idioma = pre ? "en" : "es";
      const ctx = await browser.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1, reducedMotion: "reduce" });
      await ctx.addInitScript(setTheme("dark"));
    // tsx (esbuild, keepNames) envuelve las funciones con `__name`, que no existe en la página.
    await ctx.addInitScript(NOMBRE);
      const page = await ctx.newPage();
      const casos = !ARREGLOS ? CASOS : pre ? ["naowee-suid"] : ["naowee-suid", "mercadolibre-andes"];
      for (const slug of casos) {
        await abrirHoja(page, pre, slug);
        await page.screenshot({ path: join(OUT, `hoja-${slug}-${idioma}-${ancho}.jpg`), type: "jpeg", quality: 82 });
        if (ARREGLOS) continue;
        await page.goto(`${BASE}${pre}/work/${slug}`, { waitUntil: "networkidle" });
        await settle(page);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        await page.screenshot({ path: join(OUT, `completa-${slug}-${idioma}-${ancho}.jpg`), type: "jpeg", quality: 82 });
      }
      await ctx.close();
    }
  }

  // Vídeo: abrir desde el tablero, leer un poco y cerrar con la X; luego abrir
  // y cerrar con Esc y con el velo (con movimiento).
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  await ctx.addInitScript(setTheme("dark"));
  await ctx.addInitScript(NOMBRE);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await settle(page);
  await page.waitForTimeout(800);
  const enlace = page.locator('#main a[href="/work/naowee-suid"]:visible').first();
  const abrirVideo = async () => {
    const caja = await enlace.boundingBox();
    if (caja) await page.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2, { steps: 20 });
    await page.waitForTimeout(500);
    await enlace.click();
    await page.locator('dialog.hoja[data-estado="abierta"]').waitFor();
    await page.waitForTimeout(1200);
  };
  await abrirVideo();
  await page.mouse.move(720, 600, { steps: 10 });
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(900);
  const cerrar = page.locator("dialog.hoja button.hoja-circulo");
  const caja = await cerrar.boundingBox();
  if (caja) await page.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2, { steps: 12 });
  await page.waitForTimeout(400);
  await cerrar.click();
  await page.waitForURL(`${BASE}/`);
  await page.waitForTimeout(1500);
  if (ARREGLOS) {
    await abrirVideo();
    await page.keyboard.press("Escape");
    await page.waitForURL(`${BASE}/`);
    await page.waitForTimeout(1500);
    await abrirVideo();
    await page.mouse.move(60, 450, { steps: 12 });
    await page.waitForTimeout(300);
    await page.mouse.click(60, 450);
    await page.waitForURL(`${BASE}/`);
    await page.waitForTimeout(1500);
  }
  const video = page.video();
  await ctx.close();
  if (video) renameSync(await video.path(), join(OUT, "hoja-1440.webm"));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
