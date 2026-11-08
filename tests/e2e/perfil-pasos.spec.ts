import { test, expect } from "@playwright/test";

/**
 * «Cómo trabajo» de /about no hereda el CSS de K14 del home (las dos usan
 * `.pasos`): al llegar desde el home por navegación cliente, la hoja del
 * tablero sigue cargada y partía el texto en una columna de 40 px.
 */
for (const ancho of [1440, 1280]) {
  test(`${ancho}: del home a /about sin recargar, cada paso ocupa su columna entera`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator('header a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about$/);
    const pasos = page.locator(".craft .pasos li");
    await expect(pasos).toHaveCount(4);
    const m = await pasos.evaluateAll((lis) =>
      lis.map((li) => ({ li: li.getBoundingClientRect().width, p: li.querySelector("p")!.getBoundingClientRect().width, cols: getComputedStyle(li).gridTemplateColumns.split(" ").length })),
    );
    for (const x of m) {
      expect(x.cols, JSON.stringify(m)).toBe(1);
      expect(x.p, JSON.stringify(m)).toBeGreaterThan(x.li - 1);
    }
  });
}
