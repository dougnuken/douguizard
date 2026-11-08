import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * F1 · `NameLockup` «corte láser» (07, F1). El lab del sistema B (`/lab`, solo
 * de build propio) se retiró en F8: sus pruebas del lockup ya viven en las rutas
 * reales (`/about` aquí; `/` en tablero, escena y vidrio), y la de variables
 * pasa a `/`.
 */
const XL = '[data-lockup][data-escala="xl"]';

/**
 * Cada `var(--x)` de las hojas que no pasan por Tailwind. Las locales del
 * lockup (`--corte`, `--lockup-*`, `--font-nombre`) se definen en el propio
 * elemento y no en `:root` (como `--fin-nombre` en la escena), así que
 * quedan fuera.
 */
const HOJAS = ["src/components/sistema/sistema.css", "src/components/marca/marca.css"];
const LOCALES = /^--(corte|lockup-[a-z]+|font-nombre|fin-nombre)$/;
const variablesDeHojas = () =>
  [...new Set(HOJAS.flatMap((f) => [...readFileSync(f, "utf8").matchAll(/var\((--[\w-]+)/g)].map((m) => m[1])))]
    .filter((v) => !LOCALES.test(v))
    .sort();

/** Espera a la entrada única (880 ms + 520 ms) con margen. */
async function esperarEntrada(page: Page) {
  await page.waitForFunction(
    (sel) => (document.querySelector(sel) as HTMLElement | null)?.style.getPropertyValue("--desp") === "-0.1em",
    XL,
    { timeout: 5_000 },
  );
}


test.describe("sistema B en las rutas reales", () => {
  test("/lab retirado: da 404 y no está en el sitemap", async ({ request }) => {
    expect((await request.get("/lab")).status()).toBe(404);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/lab");
  });

  test("toda var() de sistema y marca resuelve en :root de / (P0-1)", async ({ page }) => {
    const vars = variablesDeHojas();
    expect(vars.length).toBeGreaterThan(40);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const vacias = await page.evaluate((vs) => {
      const cs = getComputedStyle(document.documentElement);
      return vs.filter((v) => cs.getPropertyValue(v).trim() === "");
    }, vars);
    expect(vacias).toEqual([]);
  });
});

/** F2: el XL con corte de la portada de `/about` (existe en los dos builds). */
test.describe("lockup en /about", () => {
  test("1440×900: --corte = base − 0,52 × altura de x (±1 px), entrada única y cierre exacto al bajar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await esperarEntrada(page);
    await page.waitForTimeout(600);
    const m = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      const sup = el.querySelector(".m.sup") as HTMLElement;
      const cs = getComputedStyle(sup);
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight);
      const c = document.createElement("canvas").getContext("2d")!;
      c.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const t = c.measureText("Vargas");
      const x = c.measureText("x");
      const base = (lh - (t.fontBoundingBoxAscent + t.fontBoundingBoxDescent)) / 2 + t.fontBoundingBoxAscent;
      return {
        tag: el.tagName,
        esperado: base - 0.52 * x.actualBoundingBoxAscent,
        corte: parseFloat(el.style.getPropertyValue("--corte")),
        estado: el.dataset.corte,
      };
    }, XL);
    expect(m.tag).toBe("H1");
    expect(m.estado).toBe("abierto");
    expect(Math.abs(m.corte - m.esperado)).toBeLessThanOrEqual(1);

    await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>(".portada")!.offsetHeight));
    await expect(page.locator(XL)).toHaveAttribute("data-corte", "cerrado");
    const cerrado = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      return {
        clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath,
        inf: getComputedStyle(el.querySelector(".m.inf")!).display,
        hilo: getComputedStyle(el.querySelector(".hilo")!).display,
      };
    }, XL);
    expect(cerrado).toEqual({ clip: "none", inf: "none", hilo: "none" });
  });

  test("390×844 y con RM: nombre entero, sin isla activa", async ({ page }) => {
    for (const [w, h, rm] of [
      [390, 844, false],
      [1440, 900, true],
    ] as const) {
      await page.emulateMedia({ reducedMotion: rm ? "reduce" : "no-preference" });
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/about", { waitUntil: "networkidle" });
      await page.waitForTimeout(1600);
      const r = await page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        return { corte: el.dataset.corte, isla: el.dataset.corteIsla ?? null, clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath };
      }, XL);
      expect(r, `${w} rm=${rm}`).toEqual({ corte: "cerrado", isla: null, clip: "none" });
    }
  });
});
