import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

/**
 * F4 · vidrio estriado WebGL2 (07 F4, pruebas a–e + cambio de foto). El canvas
 * entra después del `load` sobre el póster horneado; sin WebGL queda la lente
 * CSS; con RM, el póster solo. En el contenedor, Chromium da WebGL2 por
 * SwiftShader y `failIfMajorPerformanceCaveat` lo acepta: si algún día no,
 * las pruebas (a), (d) y (e) se saltan con el motivo.
 */

/** Antes de cualquier script: tiempos del canvas y del LCP, y errores. */
const OBSERVAR = `
  window.__v = { canvasEn: null, lcpEl: null, errores: [] };
  new MutationObserver(() => {
    if (!window.__v.canvasEn && document.querySelector("canvas[data-vidrio='gl']")) window.__v.canvasEn = performance.now();
  }).observe(document, { childList: true, subtree: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__v.lcpEl = e.element ? (e.element.tagName + "." + e.element.className) : null;
  }).observe({ type: "largest-contentful-paint", buffered: true });
`;

const conCanvas = async (page: Page, sel: string) => {
  const c = page.locator(`${sel} canvas[data-vidrio='gl']`);
  try {
    await expect(c).toHaveClass(/\bon\b/, { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
};

const cuadros = (page: Page, sel: string) =>
  page.locator(`${sel} canvas[data-vidrio='gl']`).evaluate((c) => Number((c as HTMLElement).dataset.cuadros ?? 0));

const errores = (page: Page) => {
  const e: string[] = [];
  page.on("pageerror", (x) => e.push(x.message));
  page.on("console", (m) => m.type() === "error" && e.push(m.text()));
  return e;
};

test.describe("(a) Chromium con WebGL2", () => {
  test("home 1440: el póster horneado es el LCP y el canvas entra después del load, con fundido, sin errores", async ({ page }) => {
    const e = errores(page);
    await page.addInitScript(OBSERVAR);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    const r = await page.evaluate(() => {
      const w = window as unknown as { __v: { canvasEn: number; lcpEl: string } };
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const tex = performance.getEntriesByType("resource").find((x) => x.name.includes("/textura."));
      const img = document.querySelector<HTMLImageElement>("img.k1-poster")!;
      return {
        canvasEn: w.__v.canvasEn,
        load: nav.loadEventEnd,
        texturaDesde: tex?.startTime ?? -1,
        lcp: w.__v.lcpEl,
        poster: img.currentSrc,
        transicion: getComputedStyle(document.querySelector(".k1 canvas")!).transitionDuration,
      };
    });
    expect(r.lcp).toMatch(/^IMG\.k1-poster/);
    expect(r.poster).toMatch(/\/hero\/[\w]+-v\d+\/losa-\d+\.avif$/);
    expect(r.canvasEn).toBeGreaterThanOrEqual(r.load);
    expect(r.texturaDesde).toBeGreaterThanOrEqual(r.load);
    expect(r.transicion).toBe("0.4s");
    expect(e).toEqual([]);
  });

  test("0 fps en reposo; el cursor abre el vidrio solo sobre la foto y lo cierra al salir", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    await page.waitForTimeout(500);
    const quieto = await cuadros(page, ".k1");
    await page.waitForTimeout(1200);
    expect(await cuadros(page, ".k1"), "sin bucle en reposo").toBe(quieto);

    const k1 = (await page.locator(".k1").boundingBox())!;
    await page.mouse.move(k1.x + k1.width * 0.3, k1.y + k1.height * 0.7, { steps: 4 });
    const lente = page.locator(".k1 canvas");
    await expect(lente).toHaveAttribute("data-lente", "1.00", { timeout: 3000 });
    await page.mouse.move(20, 450, { steps: 4 });
    await expect(lente).toHaveAttribute("data-lente", "0.00", { timeout: 3000 });
    const tras = await cuadros(page, ".k1");
    await page.waitForTimeout(1000);
    expect(await cuadros(page, ".k1"), "se detiene al cerrarse").toBe(tras);
  });

  test("/about: el canvas sigue a la foto y la fuerza baja de .62 a .08 con el scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".portada")), "sin WebGL2 en este navegador");
    const caja = async () =>
      page.evaluate(() => {
        const a = document.querySelector("img.poster")!.getBoundingClientRect();
        const b = document.querySelector(".portada canvas")!.getBoundingClientRect();
        return [a.x - b.x, a.y - b.y, a.width - b.width, a.height - b.height].map((v) => Math.round(v));
      });
    expect(await caja()).toEqual([0, 0, 0, 0]);
    const f = () => page.locator(".portada canvas").evaluate((c) => parseFloat((c as HTMLElement).style.getPropertyValue("--vidrio-f")));
    expect(await f()).toBeCloseTo(0.62, 2);
    await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>(".portada")!.offsetHeight));
    await expect.poll(f, { timeout: 4000 }).toBeCloseTo(0.08, 2);
    await expect.poll(caja).toEqual([0, 0, 0, 0]);
  });
});

test.describe("(b) sin WebGL (Chromium lanzado con --disable-webgl)", () => {
  for (const [ruta, sel] of [
    ["/", ".k1"],
    ["/about", ".portada"],
  ] as const) {
    test(`${ruta}: póster horneado + VidrioCss activo; el cursor abre la lente CSS; sin errores`, async ({ playwright }, info) => {
      const navegador = await playwright.chromium.launch({ args: ["--disable-webgl", "--disable-webgl2", "--disable-3d-apis"] });
      const page = await navegador.newPage({ baseURL: info.project.use.baseURL });
      const e = errores(page);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ruta, { waitUntil: "load" });
      const capa = page.locator(`${sel} [data-vidrio='css']`);
      await expect(capa).toHaveAttribute("data-activo", "", { timeout: 8000 });
      expect(await page.locator("canvas").count()).toBe(0);
      const poster = await page.locator(`${sel} img[data-poster='horneado']`).evaluate((i) => (i as HTMLImageElement).naturalWidth);
      expect(poster).toBeGreaterThan(0);
      const b = (await capa.boundingBox())!;
      expect(b.width * b.height).toBeGreaterThan(0);
      expect(await capa.evaluate((c) => getComputedStyle(c).backgroundImage)).toMatch(/textura\.webp/);
      await page.mouse.move(b.x + b.width * 0.5, b.y + Math.min(b.height, 900 - b.y) * 0.6, { steps: 4 });
      await expect.poll(() => capa.evaluate((c) => Number(getComputedStyle(c).opacity)), { timeout: 3000 }).toBeGreaterThan(0.9);
      expect(e).toEqual([]);
      await navegador.close();
    });
  }
});

test("(c) RM: el póster solo — sin canvas, sin lente, sin bucle ni animaciones en el héroe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [ruta, sel] of [
    ["/", ".k1"],
    ["/about", ".portada"],
  ] as const) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ruta, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    expect(await page.locator("canvas").count()).toBe(0);
    expect(await page.locator("[data-cuadros]").count()).toBe(0);
    await expect(page.locator(`${sel} [data-vidrio='css'][data-activo]`)).toHaveCount(0);
    const anim = await page.locator(sel).evaluate((el) => el.getAnimations({ subtree: true }).length);
    expect(anim).toBe(0);
    await expect(page.locator(`${sel} img[data-poster='horneado']`)).toBeVisible();
  }
});

test.describe("(d) táctil", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("arrastre horizontal mueve la lente; el vertical hace scroll (pan-y)", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    expect(await page.locator(".k1").evaluate((k) => getComputedStyle(k).touchAction)).toBe("pan-y pinch-zoom");
    const cdp = await page.context().newCDPSession(page);
    const toque = (type: string, x: number, y: number) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });

    // Horizontal, a la altura del pecho (encima de la foto, fuera de K2).
    await toque("touchStart", 80, 300);
    for (let x = 90; x <= 300; x += 15) await toque("touchMove", x, 302);
    const lente = page.locator(".k1 canvas");
    await expect(lente).toHaveAttribute("data-lente", /^(0\.[5-9]\d|1\.00)$/, { timeout: 3000 });
    await toque("touchEnd", 300, 302);
    await expect(lente).toHaveAttribute("data-lente", "0.00", { timeout: 3000 });

    // Vertical: el navegador se queda el gesto y la página baja.
    const y0 = await page.evaluate(() => window.scrollY);
    await toque("touchStart", 200, 600);
    for (let y = 590; y >= 200; y -= 30) await toque("touchMove", 201, y);
    await toque("touchEnd", 201, 200);
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBeGreaterThan(y0 + 100);
  });
});

test("(e) webglcontextlost → respaldo CSS, sin errores", async ({ page }) => {
  const e = errores(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "load" });
  test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
  await page.locator(".k1 canvas").evaluate((c) => {
    const gl = (c as HTMLCanvasElement).getContext("webgl2")!;
    gl.getExtension("WEBGL_lose_context")!.loseContext();
  });
  await expect(page.locator(".k1 canvas")).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator(".k1 [data-vidrio='css']")).toHaveAttribute("data-activo", "", { timeout: 5000 });
  expect(e).toEqual([]);
});

test("cambio de foto: otra imagen 3:4 servida en las rutas de hero.ts se pinta sin tocar componentes", async ({ page }) => {
  const foto = readFileSync("tests/fixtures/foto-prueba-a4ef948f.jpg");
  // El póster y la textura salen de la otra foto; los componentes solo conocen `hero.ts`.
  await page.route(/\/hero\/[\w]+-v\d+\/.+\.(avif|webp)$/, (r) => r.fulfill({ body: foto, contentType: "image/jpeg" }));
  const e = errores(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "load" });
  const ancho = await page.locator("img.k1-poster").evaluate((i) => (i as HTMLImageElement).naturalWidth);
  expect(ancho).toBeGreaterThan(0);
  if (await conCanvas(page, ".k1")) expect(await cuadros(page, ".k1")).toBeGreaterThan(0);
  else await expect(page.locator(".k1 [data-vidrio='css']")).toHaveAttribute("data-activo", "");
  expect(e).toEqual([]);
});
