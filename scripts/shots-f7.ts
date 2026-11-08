/**
 * Capturas de F7 (`docs/rediseno-2026/F7-capturas/`): los 4 casos con imagen en
 * la hoja (abierta desde el home) y en la página completa (pliegue y página
 * entera), a 1440 y 390, en ES; Naowee también en EN; y los 404.
 * Requiere `next build` + `next start -p 3131`. `npx tsx scripts/shots-f7.ts`.
 */
import { chromium, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { settle } from "../tests/e2e/settle";
import { setTheme } from "../tests/e2e/matrix";

const NOMBRE = "globalThis.__name = (f) => f;";
const BASE = "http://localhost:3131";
const OUT = "docs/rediseno-2026/F7-capturas";
const CASOS = ["naowee-suid", "mercadolibre-andes", "olbo", "dc-medical"];
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
      await ctx.addInitScript(NOMBRE);
      const page = await ctx.newPage();
      for (const slug of pre ? ["naowee-suid"] : CASOS) {
        await abrirHoja(page, pre, slug);
        await page.screenshot({ path: join(OUT, `hoja-${slug}-${idioma}-${ancho}.jpg`), type: "jpeg", quality: 82 });
        await page.goto(`${BASE}${pre}/work/${slug}`, { waitUntil: "networkidle" });
        await settle(page);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        await page.screenshot({ path: join(OUT, `completa-${slug}-${idioma}-${ancho}.jpg`), type: "jpeg", quality: 82 });
        await page.screenshot({ path: join(OUT, `entera-${slug}-${idioma}-${ancho}.jpg`), type: "jpeg", quality: 70, fullPage: true });
      }
      await ctx.close();
    }
  }
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await ctx.addInitScript(setTheme("dark"));
  const page = await ctx.newPage();
  for (const [ruta, nombre] of [
    ["/esta-pagina-no-existe", "404-es-1440"],
    ["/work/no-es-un-caso", "404-caso-es-1440"],
  ]) {
    await page.goto(`${BASE}${ruta}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(OUT, `${nombre}.jpg`), type: "jpeg", quality: 82 });
  }
  await ctx.close();
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
