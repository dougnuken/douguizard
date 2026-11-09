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
    // El camino real: la tarjeta K14 «Cómo trabajo» del home lleva a /about#craft.
    const k14 = page.locator('.k14 a[href^="/about"]').first();
    await k14.scrollIntoViewIfNeeded();
    await k14.click();
    await expect(page).toHaveURL(/\/about(#craft)?$/);
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

/* Pulido E2 §1: losa oscura y láser por el centro de los nodos. */
for (const w of [1440, 390]) {
  test(`«Cómo trabajo» de /about: losa oscura y nodos centrados en el láser @${w}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/about");
    const craft = page.locator("section.craft");
    await expect(craft).toHaveAttribute("data-superficie", "losa");
    const d = await craft.evaluate((s) => {
      const ol = s.querySelector(".pasos")!;
      const o = ol.getBoundingClientRect();
      const cs = getComputedStyle(ol, "::before");
      const vertical = cs.width === "1px";
      const eje = vertical ? o.left + parseFloat(cs.left) + 0.5 : o.top + parseFloat(cs.top) + 0.5;
      return [...s.querySelectorAll(".nodo")].map((n) => {
        const r = n.getBoundingClientRect();
        return Math.abs((vertical ? r.left + r.width / 2 : r.top + r.height / 2) - eje);
      });
    });
    expect(d).toHaveLength(4);
    for (const x of d) expect(x, JSON.stringify(d)).toBeLessThanOrEqual(0.5);
  });
}
