import { test, expect, type Page } from "@playwright/test";
import { contrastes } from "./contraste-pixel";

/**
 * 06-CRITICA-FINAL P2-1: durante el viaje de la píldora ninguna etiqueta queda
 * blanca sobre blanco. Se congela el viaje a mitad de camino (las animaciones
 * WAAPI de las tres piezas, también las del dock que se vuelve a montar con la
 * ruta nueva) y, para cada etiqueta, se fotografía su caja con texto y sin él:
 * los píxeles que cambian son el texto, y su contraste contra el fondo que
 * queda debajo (blanco de la píldora o vidrio oscuro) tiene que ser legible.
 */

/** Congela cualquier viaje de la píldora de `sel` en `ms` (también los que arranquen después). */
async function congelarEn(page: Page, sel: string, ms: number) {
  await page.evaluate(
    ([s, t]) => {
      const paso = () => {
        for (const nav of document.querySelectorAll<HTMLElement>(s as string)) {
          for (const i of nav.querySelectorAll(":scope > .pildora > i")) {
            for (const a of i.getAnimations()) {
              if (a.playState === "running" && Number(a.currentTime) >= (t as number)) {
                a.currentTime = t as number;
                a.pause();
              }
            }
          }
        }
        requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    },
    [sel, ms],
  );
}

test.describe("píldora: contraste durante el viaje", () => {
  test("dock 390, de Perfil a Trabajo, congelado en el cruce: todas las etiquetas ≥ 4,5:1", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await congelarEn(page, "nav.dock", 40);
    await page.locator('nav.dock a[href="/work"]').click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator("nav.dock:visible")).toHaveAttribute("data-moviendo", "");
    await page.waitForTimeout(300);
    const m = await contrastes(page, "nav.dock:visible :is(a, button) > span");
    expect(m.length).toBe(5);
    for (const x of m) expect(x.ratio, JSON.stringify(m)).toBeGreaterThanOrEqual(4.5);
  });

  test("filtro de /work congelado en el cruce: todas las etiquetas ≥ 4,5:1", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work", { waitUntil: "networkidle" });
    await congelarEn(page, ".filtros", 40);
    await page.locator(".filtro").nth(1).click();
    await expect(page.locator(".filtros")).toHaveAttribute("data-moviendo", "");
    await page.waitForTimeout(300);
    const m = await contrastes(page, ".filtro");
    for (const x of m) expect(x.ratio, JSON.stringify(m)).toBeGreaterThanOrEqual(4.5);
  });
});
