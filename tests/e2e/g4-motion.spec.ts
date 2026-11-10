import { test, expect, type Page } from "@playwright/test";

/**
 * G4 (pulido-G): transiciones entre páginas (React `<ViewTransition>`) y
 * «Cómo trabajo» en secuencia. `docs/rediseno-2026/pulido-G/INFORME-G4.md`.
 */

/** Estado visible de cada paso de «Cómo trabajo»: opacidad del título y del texto, y la luz del nodo. */
async function pasos(page: Page) {
  return page.locator(".craft .pasos").evaluate((ol) =>
    [...ol.querySelectorAll(":scope > li")].map((li) => ({
      titulo: Number(getComputedStyle(li.querySelector("h3")!).opacity),
      texto: Number(getComputedStyle(li.querySelector("p")!).opacity),
      luz: Number(getComputedStyle(li.querySelector(".nodo")!, "::after").opacity),
      // Caja en coordenadas de la página (sin el scroll).
      caja: ((r) => [r.left, r.top + scrollY, r.width, r.height].map((v) => v.toFixed(1)).join(","))(li.getBoundingClientRect()),
    })),
  );
}

async function irACraft(page: Page) {
  await page.locator(".craft").evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 120, behavior: "instant" }));
}

for (const ancho of [1440, 390]) {
  test(`«Cómo trabajo» se enciende paso a paso y termina con los 4 visibles @${ancho}`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: ancho < 600 ? 844 : 900 });
    await page.goto("/about");
    const ol = page.locator(".craft .pasos");
    await expect(ol).toHaveAttribute("data-pasos", "espera");
    const antes = await pasos(page);
    expect(antes.every((p) => p.titulo === 0 && p.luz === 0)).toBe(true);

    await irACraft(page);
    await expect(ol).toHaveAttribute("data-pasos", "anima");
    const t0 = Date.now();
    // A media secuencia: el paso 1 ya está, el 4 todavía no.
    await page.waitForTimeout(700);
    const medio = await pasos(page);
    expect(medio[0].titulo, JSON.stringify(medio)).toBeGreaterThan(0.9);
    expect(medio[0].luz).toBe(1);
    expect(medio[3].titulo, JSON.stringify(medio)).toBeLessThan(0.1);
    expect(medio[3].luz).toBeLessThan(0.1);

    await expect(ol).toHaveAttribute("data-pasos", "listo", { timeout: 5_000 });
    const dura = Date.now() - t0;
    // Pulido H (P2-4): ≈ 1,7–1,95 s de secuencia; margen para el reloj de headless.
    expect(dura).toBeGreaterThan(1_400);
    expect(dura).toBeLessThan(3_000);
    const fin = await pasos(page);
    for (const p of fin) expect(p).toMatchObject({ titulo: 1, texto: 1, luz: 1 });
    // Sin CLS: cada paso ocupa la misma caja antes y después.
    expect(fin.map((p) => p.caja)).toEqual(antes.map((p) => p.caja));
    // Láser lleno y ninguna animación viva en reposo.
    expect(await ol.evaluate((el) => getComputedStyle(el, "::before").transform)).toBe("none");
    expect(await page.evaluate(() => document.querySelector(".craft")!.getAnimations({ subtree: true }).length)).toBe(0);
  });
}

test("«Cómo trabajo» con movimiento reducido: todo visible al instante, sin animaciones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  const ol = page.locator(".craft .pasos");
  await expect(ol).not.toHaveAttribute("data-pasos", /.+/);
  await irACraft(page);
  await page.waitForTimeout(100);
  for (const p of await pasos(page)) expect(p).toMatchObject({ titulo: 1, texto: 1, luz: 1 });
  expect(await page.evaluate(() => document.querySelector(".craft")!.getAnimations({ subtree: true }).length)).toBe(0);
});

/** Registra en `window.__vt` cada View Transition y las animaciones de sus pseudo-elementos. */
async function espiarVT(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __vt: { anims: string[]; fin: boolean; nombre?: string; filtros?: string[] }[] };
    w.__vt = [];
    const orig = document.startViewTransition.bind(document);
    document.startViewTransition = ((arg: Parameters<typeof orig>[0]) => {
      const t = orig(arg);
      const r = { anims: [] as string[], fin: false, nombre: "", filtros: [] as string[] };
      w.__vt.push(r);
      t.ready
        .then(() => {
          r.anims = document
            .getAnimations()
            .map((a) => `${(a.effect as KeyframeEffect).pseudoElement ?? ""}|${(a as CSSAnimation).animationName ?? ""}|${a.effect?.getTiming().duration}`);
          // Pulido H: el nombre de la cabecera existe durante la transición (P2-2) y
          // el filtro de las capturas de página (P2-5).
          r.nombre = getComputedStyle(document.querySelector(".cab-b")!).viewTransitionName;
          r.filtros = document
            .getAnimations()
            .filter((a) => /^pag-(sale|entra)$/.test((a as CSSAnimation).animationName ?? ""))
            .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes().map((k) => String(k.filter ?? "")))
            .filter(Boolean);
        })
        .catch(() => {});
      t.finished.then(() => (r.fin = true)).catch(() => {});
      return t;
    }) as typeof document.startViewTransition;
  });
}
const vt = (page: Page) =>
  page.evaluate(() => (window as unknown as { __vt: { anims: string[]; fin: boolean; nombre: string; filtros: string[] }[] }).__vt);

test("de /experience a /cv: la página sale y la nueva entra; la cabecera no se funde", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/experience");
  await page.mouse.wheel(0, 900);
  await espiarVT(page);
  await page.locator('header a.pill[href="/cv"]').click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.locator("main#main h1")).toBeVisible();
  await expect.poll(async () => (await vt(page))[0]?.fin, { timeout: 3_000 }).toBe(true);
  const [t] = await vt(page);
  expect(t.anims.some((a) => /::view-transition-old\(.+\)\|pag-sale\|250/.test(a)), t.anims.join("\n")).toBe(true);
  expect(t.anims.some((a) => /::view-transition-new\(.+\)\|pag-entra\|250/.test(a))).toBe(true);
  // Cabecera con nombre propio y sin animación: ni sale ni entra.
  expect(t.anims.some((a) => a.includes("(cabecera)"))).toBe(false);
  // Pulido H: nombre solo durante la transición (P2-2); en escritorio, blur de 3 px (P2-5).
  expect(t.nombre).toBe("cabecera");
  expect(await page.evaluate(() => getComputedStyle(document.querySelector(".cab-b")!).viewTransitionName)).toBe("none");
  expect(t.filtros.some((f) => f === "blur(3px)"), t.filtros.join()).toBe(true);
  expect(await page.evaluate(() => document.documentElement.dataset.vt)).toBe("adelante");
  expect(await page.evaluate(() => document.querySelectorAll(".cab-b").length)).toBe(1);
  expect(await page.evaluate(() => document.documentElement.getAttribute("data-ruta"))).toBe("cv");
  // Volver atrás también funciona (y va hacia atrás).
  await page.goBack();
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.locator("main#main h1")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.vt)).toBe("atras");
});

test("con movimiento reducido el cambio de página es solo un fundido breve", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/experience");
  await espiarVT(page);
  await page.locator('header a.pill[href="/cv"]').click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect.poll(async () => (await vt(page))[0]?.fin, { timeout: 3_000 }).toBe(true);
  const [t] = await vt(page);
  const pagina = t.anims.filter((a) => /pag-/.test(a));
  expect(pagina.length).toBeGreaterThan(0);
  for (const a of pagina) expect(a, pagina.join("\n")).toMatch(/\|pag-fundido-(sale|entra)\|150$/);
});

test("abrir la hoja de un caso no lanza la transición de página y la hoja sigue funcionando", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work");
  await espiarVT(page);
  await page.locator('main a[href="/work/olbo"]').first().click();
  await expect(page).toHaveURL(/\/work\/olbo$/);
  await expect(page.locator("dialog.hoja[open]")).toBeVisible();
  expect(await page.evaluate(() => document.querySelectorAll("main#main").length)).toBe(1);
  await page.waitForTimeout(500);
  expect(await vt(page)).toHaveLength(0);
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator("dialog.hoja")).toHaveCount(0);
});

test("Contacto del dock desde /about llega a /#contact con la sección en pantalla @390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  await page.locator('nav.dock a[href="/#contact"]').click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect
    .poll(() => page.evaluate(() => Math.round(document.getElementById("contact")!.getBoundingClientRect().top)), { timeout: 4_000 })
    .toBeLessThan(844);
  await expect(page.locator("#contact")).toBeInViewport();
});

test("K14 del home lleva a /about#craft y la secuencia se ve entera", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const k14 = page.locator('.k14 a[href="/about#craft"]');
  await k14.scrollIntoViewIfNeeded();
  await k14.click();
  await expect(page).toHaveURL(/\/about#craft$/);
  await expect(page.locator(".craft .pasos")).toHaveAttribute("data-pasos", "listo", { timeout: 6_000 });
  for (const p of await pasos(page)) expect(p).toMatchObject({ titulo: 1, texto: 1, luz: 1 });
});

test("pulido H (P2-5): a 390 el cambio de página es fundido + desplazamiento, sin blur", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/experience");
  await espiarVT(page);
  await page.locator('nav.dock a[href="/cv"]').click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect.poll(async () => (await vt(page))[0]?.fin, { timeout: 3_000 }).toBe(true);
  const [t] = await vt(page);
  expect(t.anims.some((a) => /pag-sale\|250/.test(a)), t.anims.join("\n")).toBe(true);
  expect(t.filtros.length, "keyframes con filter").toBeGreaterThan(0);
  expect(t.filtros.every((f) => f === "none"), t.filtros.join()).toBe(true);
  expect(t.nombre).toBe("cabecera");
});
