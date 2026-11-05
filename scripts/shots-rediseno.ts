// Matriz de capturas del rediseño 2026 (Propuesta B). Una carpeta por fase y etiqueta,
// para comparar «antes» y «después» de cada fase sin depender de la suite de Playwright.
//
//   npm run shots:rediseno -- --fase F0 --etiqueta antes
//   npm run shots:rediseno -- --fase F3 --anchos 390,1024,1280,1440,1920 --rutas /,/work,/cv
//
// Necesita el sitio servido (`npm run build && npx next start -p 3131`) o `--base <url>`.
// Salida: tests/shots/rediseno/<fase>/<etiqueta>/<ruta>-<ancho>-<tema>-<rm|anim>-<full|pliegue>.jpg
// (tests/shots/ está en .gitignore: son artefactos de QA, no fuente).
//
// Matriz por defecto (07-PLAN §2): 390×844, 1024×768, 1440×900; ES y EN; con y sin
// reduced-motion; DPR 1; JPG q 82; página completa y primer pliegue. Desde F3 se añaden
// 1280×720 y 1920×1080 con `--anchos`.
import { chromium, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { settle } from "../tests/e2e/settle";
import { setTheme, slugify } from "../tests/e2e/matrix";

const ALTOS: Record<number, number> = { 390: 844, 1024: 768, 1280: 720, 1440: 900, 1920: 1080 };

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const fase = arg("fase", "F0");
const etiqueta = arg("etiqueta", "actual");
const base = arg("base", "http://localhost:3131").replace(/\/$/, "");
const anchos = arg("anchos", "390,1024,1440").split(",").map(Number);
// Rutas en español; cada una se captura también en inglés (`/en` + ruta) salvo `--solo-es`.
const rutasEs = arg("rutas", "/,/work/olbo,/cv").split(",");
const temas = arg("tema", "dark") === "ambos" ? ["dark", "light"] : [arg("tema", "dark")];
const rutas = process.argv.includes("--solo-es")
  ? rutasEs
  : rutasEs.flatMap((r) => [r, r === "/" ? "/en" : `/en${r}`]);
const OUT = join("tests/shots/rediseno", fase, etiqueta);

/**
 * Lo que se mueve solo no se puede comparar entre dos corridas: los vídeos de los casos se
 * detienen en el cuadro 0 y las animaciones finitas se terminan (`animations: "disabled"`
 * en cada captura). No cambia nada del sitio, solo congela el instante que se fotografía.
 */
async function congelar(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const v of Array.from(document.querySelectorAll("video"))) {
      v.pause();
      v.currentTime = 0;
    }
  });
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  let n = 0;
  try {
    for (const tema of temas) {
      for (const rm of [true, false]) {
        for (const ancho of anchos) {
          const alto = ALTOS[ancho] ?? 900;
          const context = await browser.newContext({
            viewport: { width: ancho, height: alto },
            deviceScaleFactor: 1,
            colorScheme: tema as "dark" | "light",
            reducedMotion: rm ? "reduce" : "no-preference",
          });
          // tsx (esbuild con keepNames) envuelve las funciones en `__name(...)`; las que se mandan a la
          // página con `page.evaluate` (las de `settle`) llegan sin ese ayudante y fallan sin esto.
          await context.addInitScript("globalThis.__name = (f) => f;");
          await context.addInitScript(setTheme(tema));
          const page = await context.newPage();
          for (const ruta of rutas) {
            const nombre = `${slugify(ruta)}-${ancho}-${tema}-${rm ? "rm" : "anim"}`;
            await page.goto(base + ruta, { waitUntil: "load" });
            await page.waitForLoadState("networkidle").catch(() => {});
            await congelar(page);
            // Primer pliegue: lo que se ve al llegar, antes de recorrer la página.
            await page.screenshot({
              path: join(OUT, `${nombre}-pliegue.jpg`),
              type: "jpeg",
              quality: 82,
              animations: "disabled",
            });
            // Página completa: recorrer para que se disparen las revelaciones por IntersectionObserver.
            await settle(page);
            await congelar(page);
            await page.screenshot({
              path: join(OUT, `${nombre}-full.jpg`),
              type: "jpeg",
              quality: 82,
              fullPage: true,
              animations: "disabled",
            });
            n += 2;
          }
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`${n} capturas en ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
