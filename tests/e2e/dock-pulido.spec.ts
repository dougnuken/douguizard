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
