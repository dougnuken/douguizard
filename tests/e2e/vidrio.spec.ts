import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";
import { getFotoActiva } from "../../src/data/hero";

/**
 * F4 · vidrio estriado WebGL2 (07 F4, pruebas a–e + cambio de foto). El canvas
 * entra después del `load` sobre el póster horneado; sin WebGL queda la lente
 * CSS; con RM, el póster solo.
 * Pulido I (f): la zona nítida barre sola mientras el héroe está a la vista y
 * sin desplazar; el cursor manda al moverse y el barrido retoma tras ~3 s. Ya
 * no vale «solo el cursor abre el vidrio»: eso queda para el OS (K1 como losa),
 * donde sigue habiendo 0 fps en reposo. En móvil, antes del primer gesto, el
 * barrido lo lleva la capa CSS (sin WebGL). En el contenedor, Chromium da WebGL2 por
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

/** Un parche de 40×40 centrado en (x, y), en gris: lo que se pinta (F4 P1-1), no un atributo. */
const parche = async (page: Page, x: number, y: number) => {
  const png = await page.screenshot({ clip: { x: x - 20, y: y - 20, width: 40, height: 40 } });
  return sharp(png).greyscale().raw().toBuffer();
};

/**
 * El mismo parche de la foto limpia (sin vidrio): pinta la textura activa en un <img> temporal
 * con la caja y el encuadre del canvas y captura ahí.
 */
const parcheLimpio = async (page: Page, canvas: ReturnType<Page["locator"]>, x: number, y: number) => {
  const src = getFotoActiva().rutas.textura;
  const b = (await canvas.boundingBox())!;
  const pos = await canvas.evaluate((c) => {
    const p = c.parentElement?.querySelector<HTMLElement>("img.k1-poster");
    const cs = getComputedStyle(p ?? c);
    return { fit: cs.objectFit, pos: cs.objectPosition };
  });
  await page.evaluate(
    async ({ src, b, pos }) => {
      const im = document.createElement("img");
      im.id = "__limpia";
      im.style.cssText = `position:fixed;left:${b.x}px;top:${b.y}px;width:${b.width}px;height:${b.height}px;object-fit:${pos.fit === "fill" ? "cover" : pos.fit};object-position:${pos.pos};z-index:2147483647;pointer-events:none;transform:none;`;
      im.src = src;
      document.body.appendChild(im);
      await im.decode();
    },
    { src, b, pos },
  );
  try {
    return await parche(page, x, y);
  } finally {
    await page.evaluate(() => document.getElementById("__limpia")?.remove());
  }
};

/**
 * Como `parcheLimpio`, pero con la foto limpia puesta **en el sitio del vidrio** (hermana del
 * canvas, con el estilo de la foto): en el acto 1 el velo y el láser quedan encima igual que
 * sobre el vidrio, así la comparación solo ve el vidrio.
 */
const parcheLimpioEnSitio = async (page: Page, x: number, y: number) => {
  const src = getFotoActiva().rutas.textura;
  await page.evaluate(async (src) => {
    const poster = document.querySelector<HTMLImageElement>("img.k1-poster")!;
    const capa = document.querySelector<HTMLElement>(".k1 [data-vidrio='css']")!;
    const im = document.createElement("img");
    im.id = "__limpia";
    im.className = poster.className;
    im.style.cssText = `${poster.style.cssText};z-index:1;`;
    im.src = src;
    capa.after(im);
    await im.decode();
  }, src);
  try {
    return await parche(page, x, y);
  } finally {
    await page.evaluate(() => document.getElementById("__limpia")?.remove());
  }
};

/** Distancia media (niveles de gris, 0–255) entre dos parches. */
const distancia = (a: Buffer, b: Buffer) => {
  let suma = 0;
  for (let i = 0; i < a.length; i++) suma += Math.abs(a[i] - b[i]);
  return suma / a.length;
};

/**
 * La zona nítida deja ver la foto: con el vidrio cerrado el parche se aleja de la foto limpia
 * (refracción, desenfoque, cantos) y abierto se queda a menos de la mitad de esa distancia.
 * (Pulido I: antes se medía la rugosidad; el vidrio nuevo desenfoca, y la rugosidad ya no lo separa de la foto.)
 */
const dejaVerLaFoto = (cerrada: Buffer, abierta: Buffer, limpia: Buffer) => {
  const dc = distancia(cerrada, limpia);
  const da = distancia(abierta, limpia);
  expect(dc, `hay vidrio que abrir (cerrada a ${dc.toFixed(2)} de la foto limpia)`).toBeGreaterThan(3);
  expect(da, `vidrio ${dc.toFixed(2)} → ${da.toFixed(2)} niveles de la foto limpia`).toBeLessThanOrEqual(dc * 0.5);
};

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
        transicion: getComputedStyle(document.querySelector(".k1 canvas[data-vidrio='gl']")!).transitionDuration,
      };
    });
    expect(r.lcp).toMatch(/^IMG\.k1-poster/);
    expect(r.poster).toMatch(/\/hero\/[\w]+-v\d+\/losa-\d+\.avif$/);
    expect(r.canvasEn).toBeGreaterThanOrEqual(r.load);
    expect(r.texturaDesde).toBeGreaterThanOrEqual(r.load);
    expect(r.transicion).toBe("0.4s");
    expect(e).toEqual([]);
  });

  test("OS (K1 como losa): 0 fps en reposo; el cursor abre el vidrio solo sobre la foto y lo cierra al salir", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    // F5: la losa K1 del OS está al final del ancla del acto 1.
    await page.waitForFunction(() => !!document.querySelector<HTMLElement>("[data-escena-pista]")?.dataset.escenaFin);
    await page.evaluate(() => document.dispatchEvent(new Event("escena:fin", { cancelable: true })));
    await expect(page.locator("html")).toHaveAttribute("data-escena-fase", "os");
    // Pulido I: en el acto 1 la zona nítida barría sola; con el OS armado se cierra y el bucle para.
    await expect(page.locator(".k1 [data-vidrio][data-barrido]")).toHaveCount(0, { timeout: 4000 });
    await expect(page.locator(".k1 canvas[data-vidrio='gl']")).toHaveAttribute("data-lente", "0.00", { timeout: 4000 });
    await page.waitForTimeout(500);
    const quieto = await cuadros(page, ".k1");
    await page.waitForTimeout(1200);
    expect(await cuadros(page, ".k1"), "sin bucle en reposo").toBe(quieto);

    const k1 = (await page.locator(".k1").boundingBox())!;
    await page.mouse.move(k1.x + k1.width * 0.3, k1.y + k1.height * 0.7, { steps: 4 });
    const lente = page.locator(".k1 canvas[data-vidrio='gl']");
    await expect(lente).toHaveAttribute("data-lente", "1.00", { timeout: 3000 });

    // Lo que se pinta: sobre la pared (arriba a la izquierda de la foto) la lente deja ver la foto limpia.
    await page.mouse.move(20, 450, { steps: 4 });
    await expect(lente).toHaveAttribute("data-lente", "0.00", { timeout: 3000 });
    const pared = async () => {
      const b = (await lente.boundingBox())!;
      return { x: b.x + b.width * 0.2, y: b.y + b.height * 0.3 };
    };
    const p0 = await pared();
    const cerrada = await parche(page, p0.x, p0.y);
    await page.mouse.move(p0.x, p0.y, { steps: 4 });
    await expect(lente).toHaveAttribute("data-lente", "1.00", { timeout: 3000 });
    await page.waitForTimeout(300); // la tarjeta sube 2 px con el hover: se mide donde quedó la foto
    const p1 = await pared();
    const abierta = await parche(page, p1.x, p1.y);
    dejaVerLaFoto(cerrada, abierta, await parcheLimpio(page, lente, p1.x, p1.y));
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
        const b = document.querySelector(".portada canvas[data-vidrio='gl']")!.getBoundingClientRect();
        return [a.x - b.x, a.y - b.y, a.width - b.width, a.height - b.height].map((v) => Math.round(v));
      });
    expect(await caja()).toEqual([0, 0, 0, 0]);
    const f = () => page.locator(".portada canvas[data-vidrio='gl']").evaluate((c) => parseFloat((c as HTMLElement).style.getPropertyValue("--vidrio-f")));
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
      expect(await page.locator("canvas[data-vidrio='gl']").count()).toBe(0);
      const poster = await page.locator(`${sel} img[data-poster='horneado']`).evaluate((i) => (i as HTMLImageElement).naturalWidth);
      expect(poster).toBeGreaterThan(0);
      const b = (await capa.boundingBox())!;
      expect(b.width * b.height).toBeGreaterThan(0);
      // La foto limpia va en un canvas dentro del disco (no es candidato a LCP).
      await expect(capa.locator("i > canvas")).toHaveAttribute("data-foto", /textura\.webp$/);
      const cursor = { x: b.x + b.width * 0.5, y: b.y + Math.min(b.height, 900 - b.y) * 0.6 };
      await page.mouse.move(cursor.x, cursor.y, { steps: 4 });
      await expect.poll(() => capa.evaluate((c) => Number(getComputedStyle(c).opacity)), { timeout: 3000 }).toBeGreaterThan(0.9);
      // El disco nítido queda bajo el cursor (el barrido automático le cede el sitio).
      const centro = async () => {
        const d = (await capa.locator("i").boundingBox())!;
        return Math.hypot(d.x + d.width / 2 - cursor.x, d.y + d.height / 2 - cursor.y);
      };
      await expect.poll(centro, { timeout: 3000 }).toBeLessThan(4);
      await expect(page.locator(`${sel} [data-vidrio='css'][data-barrido]`)).toHaveCount(0);
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
    const cdp = await page.context().newCDPSession(page);
    const toque = (type: "touchStart" | "touchMove" | "touchEnd", x: number, y: number) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y }] });
    // G1: en móvil el WebGL espera a la primera interacción; antes, el póster y,
    // encima, el barrido automático en CSS (pulido I), sin canvas.
    await page.waitForTimeout(1500);
    await expect(page.locator(".k1 canvas[data-vidrio='gl']")).toHaveCount(0);
    await expect(page.locator(".k1 img[data-poster='horneado']")).toBeVisible();
    await expect(page.locator(".k1 [data-vidrio='css'][data-barrido]")).toHaveCount(1, { timeout: 5000 });
    await toque("touchStart", 80, 300);
    await toque("touchEnd", 80, 300);
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    expect(await page.locator(".k1").evaluate((k) => getComputedStyle(k).touchAction)).toBe("pan-y pinch-zoom");

    // Horizontal, a la altura del pecho (encima de la foto, fuera de K2).
    await toque("touchStart", 80, 300);
    for (let x = 90; x <= 300; x += 15) await toque("touchMove", x, 302);
    const lente = page.locator(".k1 canvas[data-vidrio='gl']");
    await expect(lente).toHaveAttribute("data-lente", /^(0\.[5-9]\d|1\.00)$/, { timeout: 3000 });
    await toque("touchEnd", 300, 302);
    await expect(lente).toHaveAttribute("data-lente", "0.00", { timeout: 3000 });

    // Lo que se pinta: con el dedo quieto sobre la pared (izquierda, altura del pecho) se ve la foto limpia.
    const cerrada = await parche(page, 60, 302);
    await toque("touchStart", 280, 302);
    for (let x = 265; x >= 60; x -= 15) await toque("touchMove", x, 302);
    await toque("touchMove", 60, 302);
    await expect(lente).toHaveAttribute("data-lente", "1.00", { timeout: 3000 });
    const abierta = await parche(page, 60, 302);
    dejaVerLaFoto(cerrada, abierta, await parcheLimpio(page, lente, 60, 302));
    await toque("touchEnd", 60, 302);
    await expect(lente).toHaveAttribute("data-lente", "0.00", { timeout: 3000 });

    // Vertical: el navegador se queda el gesto y la página baja.
    const y0 = await page.evaluate(() => window.scrollY);
    await toque("touchStart", 200, 600);
    for (let y = 590; y >= 200; y -= 30) await toque("touchMove", 201, y);
    await toque("touchEnd", 201, 200);
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBeGreaterThan(y0 + 100);
  });
});

test.describe("(f) barrido automático de la zona nítida (pulido I)", () => {
  /** El vidrio que barre ahora: el canvas, o la capa CSS si el WebGL va lento (por software). */
  const BARRE = ".k1 [data-vidrio][data-barrido]";
  const cuadrosDe = (page: Page) =>
    page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".k1 [data-vidrio]")].map((e) => e.dataset.cuadros ?? "").join("|"));

  test("1440, acto 1: barre solo; el cursor manda al moverse y el barrido retoma tras ~3 s de reposo", async ({ page }) => {
    const e = errores(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    const barre = page.locator(BARRE);
    await expect(barre).toHaveCount(1, { timeout: 8000 });
    await expect(barre).toHaveAttribute("data-lente", "1.00", { timeout: 6000 });
    await expect(barre).toHaveAttribute("data-barrido", /^\d+,\d+$/);
    const c0 = await cuadrosDe(page);
    await page.waitForTimeout(600);
    expect(await cuadrosDe(page), "el barrido pinta sin que nadie toque nada").not.toBe(c0);

    // El cursor manda: sobre la pared de la foto (a la derecha del hombro), el barrido calla y el vidrio se abre ahí.
    const canvas = page.locator(".k1 canvas[data-vidrio='gl']");
    const b = (await canvas.boundingBox())!;
    const x = b.x + b.width * 0.8;
    const y = 560;
    const cerrada = distancia(await parche(page, x, y), await parcheLimpioEnSitio(page, x, y));
    expect(cerrada, `antes del cursor ahí hay vidrio (a ${cerrada.toFixed(2)} niveles de la foto limpia)`).toBeGreaterThan(3);
    await page.mouse.move(x - 30, y, { steps: 3 });
    await page.mouse.move(x, y, { steps: 3 });
    await expect(barre).toHaveCount(0);
    await expect(canvas).toHaveAttribute("data-lente", "1.00", { timeout: 4000 });
    const da = distancia(await parche(page, x, y), await parcheLimpioEnSitio(page, x, y));
    expect(da, `bajo el cursor se ve la foto limpia (vidrio ${cerrada.toFixed(2)} → ${da.toFixed(2)} niveles)`).toBeLessThanOrEqual(cerrada * 0.5);

    // Reposo: a los ~3 s del último movimiento el barrido retoma (y antes no).
    await page.mouse.move(x + 2, y);
    const t0 = Date.now();
    await page.waitForTimeout(1500);
    expect(await barre.count(), "antes de 3 s sigue mandando el cursor").toBe(0);
    await expect(barre).toHaveCount(1, { timeout: 5000 });
    expect(Date.now() - t0).toBeGreaterThanOrEqual(2800);
    expect(e).toEqual([]);
  });

  test("1440, barrido en WebGL (forzado: aquí es por software y lo llevaría la capa CSS): abre la foto en su zona y deja el vidrio fuera", async ({ page }) => {
    test.setTimeout(120_000);
    const e = errores(page);
    await page.addInitScript(() => {
      (window as unknown as { __vidrioSinRelevo: boolean }).__vidrioSinRelevo = true;
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    const canvas = page.locator(".k1 canvas[data-vidrio='gl']");
    await expect(canvas).toHaveAttribute("data-barrido", /^\d+,\d+$/, { timeout: 10_000 });
    // El barrido nace entre los ojos y ahí se demora: ese parche ya es la foto limpia…
    await expect(canvas).toHaveAttribute("data-lente", "1.00", { timeout: 30_000 });
    await expect(page.locator(".k1 [data-vidrio='css'][data-barrido]"), "no hay relevo a la capa CSS").toHaveCount(0);
    const b = (await canvas.boundingBox())!;
    // El centro de la zona lo da `data-barrido` (px del canvas); se mide un poco por debajo (fuera del láser).
    const [zx, zy] = ((await canvas.getAttribute("data-barrido")) ?? "").split(",").map(Number);
    const zona = { x: b.x + zx, y: b.y + zy + 60 };
    const pared = { x: b.x + b.width * 0.8, y: zona.y > 450 ? 200 : 640 };
    const dZona = distancia(await parche(page, zona.x, zona.y), await parcheLimpioEnSitio(page, zona.x, zona.y));
    // … y lejos de la zona el vidrio sigue ahí (el fondo guardado se copia entero en cada cuadro).
    const dPared = distancia(await parche(page, pared.x, pared.y), await parcheLimpioEnSitio(page, pared.x, pared.y));
    expect(dPared, `fuera de la zona hay vidrio (a ${dPared.toFixed(2)} niveles de la foto limpia)`).toBeGreaterThan(3);
    expect(dZona, `zona nítida a ${dZona.toFixed(2)} niveles de la foto limpia (fuera, ${dPared.toFixed(2)})`).toBeLessThanOrEqual(dPared * 0.5);
    expect(e).toEqual([]);
  });

  test("1440: con el héroe desplazado (OS) el barrido se detiene: 0 fps; al volver arriba, retoma", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
    await expect(page.locator(BARRE)).toHaveCount(1, { timeout: 8000 });
    await page.waitForFunction(() => !!document.querySelector<HTMLElement>("[data-escena-pista]")?.dataset.escenaFin);
    const fin = await page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-escena-pista]")!.dataset.escenaFin));
    await page.evaluate(() => document.dispatchEvent(new Event("escena:fin", { cancelable: true })));
    await page.evaluate((y) => window.scrollTo(0, y), fin);
    await expect(page.locator("html")).toHaveAttribute("data-escena-fase", "os");
    await expect(page.locator(BARRE)).toHaveCount(0, { timeout: 4000 });
    // La zona nítida se cierra (≈ 1,5 s) y ahí acaba el bucle, la lleve el canvas o la capa CSS.
    await expect
      .poll(() => page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".k1 [data-vidrio][data-lente]")].every((e) => e.dataset.lente === "0.00")), { timeout: 6000 })
      .toBe(true);
    await page.waitForTimeout(300);
    const quieto = await cuadrosDe(page);
    await page.waitForTimeout(1200);
    expect(await cuadrosDe(page), "sin bucle con el héroe desplazado").toBe(quieto);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator(BARRE)).toHaveCount(1, { timeout: 8000 });
  });

  test.describe("390", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    test("antes de cualquier gesto barre la capa CSS: sin WebGL, sin tocar el LCP, CLS 0; fuera de vista se detiene", async ({ page }) => {
      const e = errores(page);
      await page.addInitScript(() => {
        const w = window as unknown as { __cls: number; __lcp: string[] };
        w.__cls = 0;
        // Cada candidato a LCP: «vidrio» si sale de la capa del barrido.
        w.__lcp = [];
        new PerformanceObserver((l) => {
          for (const x of l.getEntries() as unknown as { element: Element | null }[])
            w.__lcp.push(x.element?.closest("[data-vidrio]") ? "vidrio" : `${x.element?.tagName}.${x.element?.className}`);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const x of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!x.hadRecentInput) w.__cls += x.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto("/", { waitUntil: "load" });
      const capa = page.locator(".k1 [data-vidrio='css']");
      await expect(capa).toHaveAttribute("data-barrido", /^\d+,\d+$/, { timeout: 8000 });
      await expect(capa).toHaveAttribute("data-lente", "1.00", { timeout: 6000 });
      expect(await page.locator("canvas[data-vidrio='gl']").count(), "el WebGL sigue esperando al primer gesto").toBe(0);
      // La zona nítida se mueve sola y solo con `transform` (compositor).
      const disco = capa.locator("i");
      const p0 = (await disco.boundingBox())!;
      await page.waitForTimeout(2500);
      const p1 = (await disco.boundingBox())!;
      expect(Math.hypot(p1.x - p0.x, p1.y - p0.y), "el disco se mueve").toBeGreaterThan(8);
      expect(await disco.evaluate((i) => getComputedStyle(i).transform)).toMatch(/^matrix/);
      const r = await page.evaluate(() => {
        const w = window as unknown as { __lcp: string[]; __cls: number };
        return { lcp: w.__lcp, cls: w.__cls };
      });
      // El LCP sigue siendo el de antes del barrido (en 390, el claim: el póster a sangre no cuenta).
      expect(r.lcp.length).toBeGreaterThan(0);
      expect(r.lcp, "la capa del barrido no es candidata a LCP").not.toContain("vidrio");
      expect(r.cls).toBeLessThanOrEqual(0.001);
      // Con el héroe fuera de vista no barre nadie y no hay bucle. (El scroll cuenta como primer
      // gesto: el WebGL entra y la capa CSS se retira, pero fuera de vista tampoco pinta.)
      await page.evaluate(() => window.scrollTo(0, 2400));
      await expect(page.locator(BARRE)).toHaveCount(0, { timeout: 4000 });
      await page.waitForTimeout(2500);
      const quieto = await cuadrosDe(page);
      await page.waitForTimeout(1000);
      expect(await cuadrosDe(page), "0 fps fuera de vista").toBe(quieto);
      await expect(page.locator(BARRE)).toHaveCount(0);
      expect(e).toEqual([]);
    });
  });
});

test("(e) webglcontextlost → respaldo CSS, sin errores", async ({ page }) => {
  const e = errores(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "load" });
  test.skip(!(await conCanvas(page, ".k1")), "sin WebGL2 en este navegador");
  await page.locator(".k1 canvas[data-vidrio='gl']").evaluate((c) => {
    const gl = (c as HTMLCanvasElement).getContext("webgl2")!;
    gl.getExtension("WEBGL_lose_context")!.loseContext();
  });
  await expect(page.locator(".k1 canvas[data-vidrio='gl']")).toHaveCount(0, { timeout: 5000 });
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
