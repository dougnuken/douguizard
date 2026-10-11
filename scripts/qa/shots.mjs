#!/usr/bin/env node
// Capturas de QA. Solo viewport por defecto (ahorra tokens: ~1.500 por imagen); --full para la página entera.
//
//   node scripts/qa/shots.mjs --routes /,/work/dc-medical --widths 390,1440 --tag u1
//   opciones: --base http://localhost:3131  --theme dark|light  --full  --y 1800 (desplazamiento antes de capturar)
//             --height 720 (alto del viewport)  --shell 0.25 (fracción del desplazamiento horizontal del panel de la home, 0–1)
//             --out tests/shots   (ignorada por git)
//
// Escribe <out>/<tag>-<ruta>-<ancho>-<tema>.png y lo que siga invisible tras el revelado, si algo quedó.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, list, launch, settle, slug, open } from "./lib.mjs";

const a = parseArgs();
const base = a.base || "http://localhost:3131";
const routes = list(a.routes, ["/"]);
const widths = list(a.widths, ["390", "1440"]).map(Number);
const tag = a.tag || "shot";
const theme = a.theme === "light" ? "light" : "dark";
const out = a.out || "tests/shots";
mkdirSync(out, { recursive: true });

const browser = await launch();
try {
  for (const route of routes) {
    for (const width of widths) {
      const { ctx, page, go } = await open(browser, { base, route, width, height: a.height ? Number(a.height) : undefined, theme });
      const res = await go();
      if (!res || res.status() >= 400) console.log(`! ${route} ${width}: HTTP ${res ? res.status() : "sin respuesta"}`);
      const invisible = await settle(page);
      if (a.y) await page.evaluate((y) => window.scrollTo(0, y), Number(a.y));
      if (a.shell !== undefined)
        await page.evaluate((f) => {
          const sh = document.querySelector("[data-hshell]");
          if (sh) sh.scrollLeft = (sh.scrollWidth - sh.clientWidth) * f;
        }, Number(a.shell));
      if (a.shell !== undefined) await page.waitForTimeout(700);
      const file = join(out, `${tag}-${slug(route)}-${width}${a.height ? "x" + a.height : ""}${a.shell !== undefined ? "-sh" + a.shell : ""}-${theme}.png`);
      await page.screenshot({ path: file, fullPage: Boolean(a.full) });
      console.log(`${file}${invisible.length ? `  (aún invisible: ${invisible.join(" | ")})` : ""}`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
