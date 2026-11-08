import { expect, test } from "@playwright/test";

/** Arreglos tras la crítica de F3 (06-CRITICA-F3 P1-1, P1-2, P1-3). */

// P1-1 · las cuatro piezas de la cabecera comparten `y` y alto (40 px visibles).
for (const ruta of ["/", "/about", "/cv"]) {
  test(`P1-1 cabecera alineada en ${ruta} @1440x900`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ruta, { waitUntil: "networkidle" });
    const cajas = await page.evaluate(() =>
      [".cab-marca .wordmark", ".cab-pills", ".idioma", ".cab-b .hablemos"].map((s) => {
        const r = document.querySelector(s)!.getBoundingClientRect();
        return { s, y: Math.round(r.y * 10) / 10, h: Math.round(r.height * 10) / 10 };
      }),
    );
    for (const c of cajas) {
      expect(c.h, `${c.s} alto`).toBe(40);
      expect(c.y, `${c.s} y`).toBe(cajas[0].y);
    }
  });
}

// P1-2 · sin preferencia de sistema, las rutas B pintan en oscuro; /cv conserva su tema.
for (const ruta of ["/", "/work", "/about", "/experience", "/en"]) {
  test(`P1-2 color-scheme dark en ${ruta}`, async ({ page }) => {
    await page.goto(ruta, { waitUntil: "networkidle" });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe("dark");
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute("content", "dark");
  });
}
test("P1-2 /cv conserva su tema (claro sin preferencia)", async ({ page }) => {
  await page.goto("/cv", { waitUntil: "networkidle" });
  const r = await page.evaluate(() => ({
    cs: getComputedStyle(document.documentElement).colorScheme,
    t: document.documentElement.dataset.theme,
  }));
  expect(r.cs).toBe(r.t);
});

// P1-3 · rejilla 1280–1439: la columna de Andes ≥ 300 px y nada se parte.
for (const [w, h] of [[1280, 720], [1366, 768]] as const) {
  test(`P1-3 K4 ≥ 300 px y textos sin partir @${w}x${h}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/", { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const ancho = document.querySelector<HTMLElement>(".os .k4")!.getBoundingClientRect().width;
      const partidos = Array.from(document.querySelectorAll<HTMLElement>(".os .losa-caso .ceja"))
        .filter((e) => e.getClientRects().length && e.getBoundingClientRect().height > 1.6 * parseFloat(getComputedStyle(e).lineHeight))
        .map((e) => e.textContent);
      return { ancho, partidos };
    });
    expect(r.ancho).toBeGreaterThanOrEqual(300);
    expect(r.partidos, "ceja/eyebrow en una sola línea").toEqual([]);
  });
}
