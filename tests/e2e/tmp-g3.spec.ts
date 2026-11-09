import { test } from "@playwright/test";

for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`capturas ${w}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/about", { waitUntil: "networkidle" });
    const datos = page.locator(".datos-fila");
    await datos.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await datos.screenshot({ path: `docs/rediseno-2026/pulido-G/g3/datos-${w}.png` });
    const emp = page.locator(".empresas");
    await emp.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await emp.screenshot({ path: `docs/rediseno-2026/pulido-G/g3/marcas-${w}.png` });
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: innerWidth,
      dot: getComputedStyle(document.querySelector(".lista-datos .estado")!, "::before").backgroundColor,
    }));
    console.log("MEDIDAS", w, JSON.stringify(r));
  });
}
