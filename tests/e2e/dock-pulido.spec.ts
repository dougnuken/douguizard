import { test, expect } from "@playwright/test";

/** 06-CRITICA-FINAL P2-2 y P2-3: el dock marca «Trabajo» en un caso y la etiqueta activa respira dentro de la píldora. */

test.describe("dock: «Trabajo» en la página de un caso (P2-2)", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const ruta of ["/work/naowee-suid", "/en/work/naowee-suid"]) {
    test(`${ruta}: «Trabajo» lleva aria-current="true" y la píldora blanca`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: "networkidle" });
      const marcadas = page.locator("nav.dock [aria-current]");
      await expect(marcadas).toHaveCount(1);
      await expect(marcadas).toHaveAttribute("aria-current", "true");
      await expect(marcadas).toHaveAttribute("href", /\/work$/);
      expect(await marcadas.evaluate((a) => getComputedStyle(a).backgroundColor)).toBe("rgb(255, 255, 255)");
    });
  }
});

test.describe("dock: margen interno de la etiqueta activa (P2-3)", () => {
  // Como en un teléfono: barras de scroll superpuestas (sin `isMobile`, Chromium
  // de escritorio resta 15 px de barra al ancho del bloque contenedor del dock).
  test.use({ isMobile: true, hasTouch: true });
  for (const ancho of [390, 360, 320]) {
    for (const ruta of ["/experience", "/en/experience"]) {
      test(`${ancho} ${ruta}: ≥ 8 px a cada lado y el dock cabe`, async ({ page }) => {
        await page.setViewportSize({ width: ancho, height: 800 });
        await page.goto(ruta, { waitUntil: "networkidle" });
        const m = await page.evaluate(() => {
          const nav = document.querySelector<HTMLElement>("nav.dock")!.getBoundingClientRect();
          return [...document.querySelectorAll<HTMLElement>("nav.dock > :is(a, button)")].map((op) => {
            const o = op.getBoundingClientRect();
            const s = op.querySelector("span")!.getBoundingClientRect();
            return { texto: op.textContent?.trim(), izq: s.left - o.left, der: o.right - s.right, nav: [nav.left, nav.right] };
          });
        });
        for (const x of m) {
          expect(Math.min(x.izq, x.der), JSON.stringify(x)).toBeGreaterThanOrEqual(7.9);
          expect(x.nav[0]).toBeGreaterThanOrEqual(0);
          expect(x.nav[1]).toBeLessThanOrEqual(ancho);
        }
      });
    }
  }
});
