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

// Pulido D · el círculo interior de ES/EN y del wordmark es concéntrico con su
// pastilla: mismo inset en los cuatro lados (±0,5 px) y radio exterior = interior + inset.
for (const ancho of [1440, 390]) {
  for (const ruta of ["/about", "/en/about"]) {
    test(`pulido D · inset concéntrico ${ruta} @${ancho}`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto(ruta, { waitUntil: "networkidle" });
      const pares = await page.evaluate(() => {
        const medir = (exterior: Element, interior: Element) => {
          const e = exterior.getBoundingClientRect();
          const i = interior.getBoundingClientRect();
          return {
            arriba: i.top - e.top,
            abajo: e.bottom - i.bottom,
            izq: i.left - e.left,
            der: e.right - i.right,
            rExt: Math.min(parseFloat(getComputedStyle(exterior).borderTopLeftRadius), e.height / 2),
            rInt: Math.min(parseFloat(getComputedStyle(interior).borderTopLeftRadius), i.height / 2),
          };
        };
        const grupo = document.querySelector(".idioma")!;
        const activa = grupo.querySelector(".idioma-op[aria-current]")!;
        // Pulido E: la burbuja es el ::after de la opción activa (círculo propio).
        const cs = getComputedStyle(activa, "::after");
        const r = activa.getBoundingClientRect();
        const m = medir(grupo, activa);
        const b = new DOMRect(
          r.left + parseFloat(cs.left),
          r.top + parseFloat(cs.top),
          parseFloat(cs.width),
          parseFloat(cs.height),
        );
        const g = grupo.getBoundingClientRect();
        const idioma = {
          ...m,
          arriba: b.top - g.top,
          abajo: g.bottom - b.bottom,
          // El canto propio de la burbuja (izq. en ES, der. en EN), y el cruzado contra el alto.
          canto: activa === grupo.firstElementChild ? b.left - g.left : g.right - b.right,
          rInt: Math.min(parseFloat(cs.borderTopLeftRadius) * (cs.borderTopLeftRadius.endsWith("%") ? b.width / 100 : 1), b.height / 2),
          radio: cs.borderTopLeftRadius,
          opacidad: cs.opacity,
          ancho: b.width,
          alto: b.height,
        };
        const marca = medir(document.querySelector(".cab-marca .wordmark")!, document.querySelector(".cab-marca .wordmark-d")!);
        return { idioma, marca };
      });
      const { idioma, marca } = pares;
      expect(Math.abs(idioma.ancho - idioma.alto), "burbuja redonda (ancho = alto)").toBeLessThanOrEqual(0.5);
      expect(idioma.radio, "burbuja con radio 50 %").toBe("50%");
      expect(idioma.opacidad, "burbuja visible en reposo").toBe("1");
      for (const lado of [idioma.arriba, idioma.abajo, idioma.canto]) {
        expect(Math.abs(lado - 4), `ES/EN inset ${JSON.stringify(idioma)}`).toBeLessThanOrEqual(0.5);
      }
      expect(Math.abs(idioma.rExt - (idioma.rInt + 4)), "ES/EN radios").toBeLessThanOrEqual(0.5);
      for (const lado of [marca.arriba, marca.abajo, marca.izq]) {
        expect(Math.abs(lado - 4), `wordmark inset ${JSON.stringify(marca)}`).toBeLessThanOrEqual(0.5);
      }
      expect(Math.abs(marca.rExt - (marca.rInt + 4)), "wordmark radios").toBeLessThanOrEqual(0.5);
      if (ancho < 360) expect(Math.abs(marca.der - 4)).toBeLessThanOrEqual(0.5);
    });
  }
}

// Pulido G2 · ES/EN son dos círculos de 32 px pegados (sin hueco entre ellos) y
// cada opción conserva un objetivo táctil de 44 × 44.
for (const ancho of [1440, 390]) {
  test(`pulido G2 · ES/EN dos círculos contiguos @${ancho}`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.goto("/about", { waitUntil: "networkidle" });
    const m = await page.evaluate(() => {
      const ops = Array.from(document.querySelectorAll<HTMLElement>(".idioma .idioma-op"));
      const circulos = ops.map((op) => {
        const r = op.getBoundingClientRect();
        const cs = getComputedStyle(op, "::after");
        return { x: r.left + parseFloat(cs.left), w: parseFloat(cs.width), h: parseFloat(cs.height), caja: { w: r.width, h: r.height } };
      });
      return { circulos, grupo: document.querySelector(".idioma")!.getBoundingClientRect().width };
    });
    const [es, en] = m.circulos;
    for (const c of m.circulos) {
      expect(c.w).toBe(32);
      expect(c.h).toBe(32);
      expect(c.caja.w, "objetivo táctil").toBeGreaterThanOrEqual(44);
      expect(c.caja.h, "objetivo táctil").toBeGreaterThanOrEqual(44);
    }
    expect(Math.abs(en.x - (es.x + es.w)), "sin hueco entre ES y EN").toBeLessThanOrEqual(0.5);
    expect(m.grupo, "cápsula de 4 + 32 + 32 + 4").toBe(72);
  });
}
