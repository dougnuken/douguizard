import { test, expect } from "@playwright/test";

/** Pulido E · pie del sistema B: losa con wordmark, cierre, enlaces ordenados y «Volver arriba» como botón. */
for (const [ancho, alto] of [[1440, 900], [390, 844]] as const) {
  for (const [ruta, cierre, arriba] of [
    ["/about", "Diseño productos y los construyo", "Volver arriba"],
    ["/en/about", "I design products and build them", "Back to top"],
  ] as const) {
    test(`pie B ${ruta} @${ancho}`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: alto });
      await page.goto(ruta, { waitUntil: "networkidle" });
      const pie = page.locator("footer.pie-b");
      await expect(pie.locator(".wordmark .wordmark-d")).toBeVisible();
      await expect(pie.locator(".pie-b-cierre")).toContainText(cierre);
      await expect(pie).toContainText("Barranquilla · UTC-5");
      const textos = await pie.locator(".pie-b-nav a").allTextContents();
      expect(textos.map((t) => t.replace("↗", "").trim())).toEqual(
        ruta.startsWith("/en")
          ? ["Work", "About", "Experience", "CV", "LinkedIn", "Behance", "GitHub", "Email"]
          : ["Trabajo", "Perfil", "Experiencia", "CV", "LinkedIn", "Behance", "GitHub", "Correo"],
      );
      // «Volver arriba» es un botón circular de ≥ 44 px, no un enlace de texto.
      const boton = pie.getByRole("button", { name: arriba });
      await boton.scrollIntoViewIfNeeded();
      const m = await boton.evaluate((b) => {
        const r = b.getBoundingClientRect();
        return { w: r.width, h: r.height, radio: getComputedStyle(b).borderTopLeftRadius, x: document.documentElement.scrollWidth - window.innerWidth };
      });
      expect(Math.abs(m.w - m.h)).toBeLessThanOrEqual(0.5);
      expect(m.w).toBeGreaterThanOrEqual(44);
      expect(m.radio).toBe("50%");
      expect(m.x, "sin scroll horizontal").toBeLessThanOrEqual(0);
      await expect(pie.locator('a[href="#main"]')).toHaveCount(0);
      if (ancho < 1024) {
        // Con el pie al fondo, el dock no tapa la losa.
        await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" as ScrollBehavior }));
        const losa = await pie.locator(".pie-b-losa").boundingBox();
        const dock = await page.locator(".dock").boundingBox();
        expect(losa!.y + losa!.height).toBeLessThanOrEqual(dock!.y);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      await boton.click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });
  }
}

/** Pulido F (06-CRITICA-E P2-1): la fila base del pie lleva un solo cuerpo (© y colofón a 12 px). */
for (const [ancho, alto] of [[1440, 900], [390, 844]] as const) {
  for (const ruta of ["/", "/en/about"]) {
    test(`pie B: © y colofón con el mismo cuerpo ${ruta} @${ancho}`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: alto });
      await page.goto(ruta, { waitUntil: "networkidle" });
      const cuerpos = await page.locator(".pie-b-base p").evaluateAll((ps) => ps.map((p) => getComputedStyle(p).fontSize));
      expect(cuerpos).toHaveLength(2);
      expect(new Set(cuerpos).size, cuerpos.join(" · ")).toBe(1);
      expect(cuerpos[0]).toBe("12px");
    });
  }
}
