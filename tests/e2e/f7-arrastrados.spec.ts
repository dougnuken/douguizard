import { test, expect, type Page } from "@playwright/test";

/** 06-CRITICA-FINAL P2-7: los P2 de pulido que venían de 06-CRITICA-F7 (desvío 4 de F8). */

async function abrirHoja(page: Page, slug: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work", { waitUntil: "networkidle" });
  const enlace = page.locator(`#main a[href="/work/${slug}"]:visible`).first();
  await enlace.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  await enlace.click();
  await page.waitForURL(`**/work/${slug}`);
  await expect(page.locator("dialog.hoja[open]")).toHaveAttribute("data-estado", "abierta");
}

test.describe("F7 P2-4 · «Secciones» de la hoja a 390", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("va en la cabecera (no flota sobre el texto), la miga cabe y abre la lista", async ({ page }) => {
    await abrirHoja(page, "naowee-suid");
    const hoja = page.locator("dialog.hoja[open]");
    const boton = hoja.locator(".hoja-cab button.hoja-secciones");
    await expect(boton).toBeVisible();
    await expect(boton).toHaveAttribute("aria-label", "Secciones");
    // Nada flotante dentro del cuerpo de la hoja que pueda tapar una línea.
    const flotantes = await hoja.locator(".hoja-cuerpo").evaluate((c) =>
      [...c.querySelectorAll<HTMLElement>("button, a")].filter((e) => /sticky|fixed/.test(getComputedStyle(e).position) && e.offsetParent).length,
    );
    expect(flotantes).toBe(0);
    // La miga no se desborda y el botón queda dentro de la cabecera.
    const m = await hoja.locator(".hoja-cab").evaluate((cab) => {
      const c = cab.getBoundingClientRect();
      const b = cab.querySelector(".hoja-secciones")!.getBoundingClientRect();
      const a = cab.querySelector(".hoja-miga a")!;
      return { dentro: b.top >= c.top && b.bottom <= c.bottom, ancho: b.width, miga: a.scrollWidth <= a.clientWidth + 1 };
    });
    expect(m).toEqual({ dentro: true, ancho: 48, miga: true });
    await boton.click();
    await expect(hoja.locator("dialog.secciones[open]")).toBeVisible();
  });

  test("a 1440 no aparece (el índice lateral ya está)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirHoja(page, "naowee-suid");
    await expect(page.locator("dialog.hoja[open] .hoja-secciones")).toBeHidden();
  });
});

test.describe("F7 P2-1, P2-5, P2-7, P2-8 · página completa de Naowee", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("P2-1: «~» en Urbanist a 0,6 em; el texto sigue siendo «~1.200»", async ({ page }) => {
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const dot = page.locator("main .tablero-caso .dot", { hasText: "1.200" }).first();
    await expect(dot).toHaveText("~1.200");
    const v = await dot.evaluate((d) => {
      const s = d.querySelector(".virgulilla")!;
      return { fam: getComputedStyle(s).fontFamily, k: parseFloat(getComputedStyle(s).fontSize) / parseFloat(getComputedStyle(d).fontSize) };
    });
    expect(v.fam).toMatch(/Urbanist/);
    expect(v.k).toBeCloseTo(0.6, 2);
  });

  test("P2-5: sin © en el colofón; el pie B del sitio cierra la página, después de «Siguiente caso»", async ({ page }) => {
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    await expect(page.locator("[data-colofon]")).not.toContainText("©");
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("footer.pie-b")).toContainText("©");
    const orden = await page.evaluate(() => {
      const sig = document.querySelector(".sig-fila, .sig-card")!;
      const pie = document.querySelector("footer.pie-b")!;
      return Boolean(sig.compareDocumentPosition(pie) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(orden).toBe(true);
  });

  test("P2-7: la duración de Naowee es su periodo («Ene 2026 — Hoy» / «Jan 2026 — Now»), no «En curso»", async ({ page }) => {
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    await expect(page.locator("main")).not.toContainText("En curso");
    await expect(page.locator("main")).toContainText("Ene 2026 — Hoy");
    await page.goto("/en/work/naowee-suid", { waitUntil: "networkidle" });
    await expect(page.locator("main")).not.toContainText("Ongoing");
    await expect(page.locator("main")).toContainText("Jan 2026 — Now");
  });

  test("P2-8: «Mi parte» y «Problema» en la misma tinta; solo el arranque en negrita en --tinta", async ({ page }) => {
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const c = await page.evaluate(() => ({
      prosa: getComputedStyle(document.querySelector("main .prosa")!).color,
      li: getComputedStyle(document.querySelector("main .lista-parte li")!).color,
      strong: getComputedStyle(document.querySelector("main .lista-parte strong")!).color,
    }));
    expect(c.li).toBe(c.prosa);
    expect(c.strong).not.toBe(c.prosa);
  });
});

test("F7 P2-2: a 390 el siguiente caso muestra cifras en una sola línea (sin huérfana), en todos los casos", async ({ page }) => {
  test.slow();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work", { waitUntil: "networkidle" });
  const slugs = [...new Set(await page.locator('#main a[href^="/work/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))];
  expect(slugs.length).toBeGreaterThan(5);
  for (const ruta of slugs) {
    await page.goto(ruta, { waitUntil: "domcontentloaded" });
    const tops = await page.locator(".sig-cifras .dot").evaluateAll((ds) =>
      ds.filter((d) => (d as HTMLElement).offsetParent).map((d) => Math.round(d.getBoundingClientRect().top)),
    );
    expect(tops.length, ruta).toBeLessThanOrEqual(2);
    expect(new Set(tops).size, `${ruta} ${tops}`).toBeLessThanOrEqual(1);
  }
});

test("F7 P2-6: en el 404 la línea en inglés va a 12 px en --tinta-3 y con lang=en", async ({ page }) => {
  await page.goto("/no-existe-esta-ruta", { waitUntil: "networkidle" });
  const p = page.locator('[data-404] p[lang="en"]');
  await expect(p).toHaveCount(1);
  expect(await p.evaluate((e) => [getComputedStyle(e).fontSize, getComputedStyle(e).color])).toEqual(["12px", "rgb(138, 138, 149)"]);
});
