import { test, expect } from "@playwright/test";

/**
 * 06-CRITICA-FINAL P2-6: el revelado al scroll tiene respaldo para capturas de
 * página entera. Con `?estatico` nada espera al scroll; sin el parámetro, el
 * usuario sigue viendo el revelado (no cambia nada para él).
 */

const RUTAS = ["/about", "/work/naowee-suid"];

for (const ancho of [1440, 390]) {
  for (const ruta of RUTAS) {
    test(`${ancho} ${ruta}?estatico: ninguna losa espera al scroll y todas se ven sin hacer scroll`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      // Control: sin el parámetro hay losas esperando (el revelado sigue para el usuario).
      await page.goto(ruta, { waitUntil: "networkidle" });
      expect(await page.locator('[data-revelar="espera"]').count()).toBeGreaterThan(0);

      await page.goto(`${ruta}?estatico`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(await page.locator("html").getAttribute("data-estatico")).toBe("");
      expect(await page.locator('[data-revelar="espera"]').count()).toBe(0);
      const ocultas = await page.locator("#main .losa").evaluateAll((els) =>
        els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).map((e) => e.className),
      );
      expect(ocultas).toEqual([]);
      // La captura de página entera sale (sin scroll previo).
      expect((await page.screenshot({ fullPage: true })).length).toBeGreaterThan(10_000);
    });
  }
}

test("impresión: las losas en espera se ven", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about", { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const ocultas = await page.locator('[data-revelar="espera"]').evaluateAll((els) => els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length);
  expect(ocultas).toBe(0);
});
