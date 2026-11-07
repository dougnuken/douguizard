import { expect, test, type Page } from "@playwright/test";

/**
 * F5 · acto 1 «cine» y scroll anclado del home (07 F5). Sin RM a ≥ 1024 el home
 * abre en el acto 1 y un recorrido de 1 viewport lo lleva al OS de F3; móvil, RM
 * y sin JS ven el OS desde el primer píxel. `window.__escenaCaptura` quita el
 * snap y el suavizado para medir fotogramas exactos.
 */

const XL = "[data-lockup].escena-nombre";
const TARJETAS = [".k1", ".k2", ".k3", ".k4", ".k5"];

async function abrir(page: Page, { captura = false, ruta = "/" } = {}) {
  if (captura) await page.addInitScript(() => Object.assign(window, { __escenaCaptura: true }));
  await page.goto(ruta, { waitUntil: "load" });
  await page.waitForFunction(() => !!document.querySelector<HTMLElement>("[data-escena-pista]")?.dataset.escenaFin, null, { timeout: 15_000 });
}
const fin = (page: Page) => page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-escena-pista]")!.dataset.escenaFin));
const progreso = (page: Page) => page.evaluate(() => Number(document.querySelector<HTMLElement>(".escena")!.dataset.p ?? "NaN"));

/** Lleva el ancla a p (modo captura: el progreso sigue al scroll sin suavizado). */
async function irA(page: Page, p: number) {
  const h = await page.evaluate(() => window.innerHeight);
  const f = await fin(page);
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(f - h + p * h));
  await expect.poll(() => progreso(page), { timeout: 4000 }).toBeCloseTo(p, 2);
}

const rects = (page: Page) =>
  page.evaluate((sels) => sels.map((s) => {
    const r = document.querySelector(s)!.getBoundingClientRect();
    return [r.x, r.y, r.width, r.height].map((v) => Math.round(v));
  }), TARJETAS);

/** Las cajas del OS de F3 (el estado final): mismo viewport, con RM. */
async function rectsOS(page: Page, w: number, h: number) {
  const ctx = await page.context().browser()!.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("/", { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const r = await rects(p);
  await ctx.close();
  return r;
}

test.describe("escena del home · acto 1 «cine» (≥ 1024 sin RM)", () => {
  test.beforeEach(({ browserName }) => test.skip(browserName !== "chromium", "solo Chromium"));

  test("1440×900: acto 1 visible (nombre XL bajo y = 88, CTA en pantalla) y al final el OS idéntico a F3 (±1 px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    await abrir(page);
    expect(await page.evaluate(() => document.documentElement.classList.contains("cine"))).toBe(true);
    const nombre = await page.locator(XL).boundingBox();
    expect(nombre!.y).toBeGreaterThanOrEqual(88 - 0.5);
    const cta = await page.locator(".k2 .cta-1").boundingBox();
    expect(cta!.y + cta!.height).toBeLessThanOrEqual(900);
    expect(cta!.x).toBeGreaterThanOrEqual(0);
    // La foto llena la pantalla.
    const foto = await page.locator(".k1-foto").boundingBox();
    expect(foto).toMatchObject({ x: 0, y: 0, width: expect.any(Number), height: 900 });
    expect(foto!.width).toBeGreaterThan(1400);
    // Rueda hasta el final del ancla.
    await page.mouse.move(720, 450);
    for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 120);
    await expect.poll(() => progreso(page), { timeout: 5000 }).toBe(1);
    await expect(page.locator("html")).toHaveAttribute("data-escena-fase", "os");
    expect(await page.evaluate(() => window.scrollY)).toBe(await fin(page));
    const os = await rectsOS(page, 1440, 900);
    const final = await rects(page);
    for (let i = 0; i < TARJETAS.length; i++) {
      for (let k = 0; k < 4; k++) expect(Math.abs(final[i][k] - os[i][k]), `${TARJETAS[i]}[${k}]`).toBeLessThanOrEqual(1);
    }
    // Nada de la escena queda en línea en el OS.
    const resto = await page.evaluate(() => ({
      foto: document.querySelector<HTMLElement>(".k1-foto")!.style.left,
      k2: document.querySelector<HTMLElement>(".k2")!.style.translate,
      k3: document.querySelector<HTMLElement>(".k3")!.style.opacity,
      rail: document.querySelector<HTMLElement>(".rail-acciones")!.inert,
      nombre: getComputedStyle(document.querySelector(".escena-nombre")!).visibility,
    }));
    expect(resto).toEqual({ foto: "", k2: "", k3: "", rail: false, nombre: "hidden" });
    expect(errores).toEqual([]);
  });

  test("resize en el OS 1440×900 → 1280×800: la foto queda en su losa (P0-2); 1100 → 900: móvil sin restos", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrir(page);
    await page.evaluate(() => document.dispatchEvent(new Event("escena:fin", { cancelable: true })));
    await expect.poll(() => progreso(page)).toBe(1);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(600);
    const [k1, f] = await page.evaluate(() => [".k1", ".k1-foto"].map((s) => {
      const r = document.querySelector(s)!.getBoundingClientRect();
      return [r.x, r.y, r.width, r.height].map(Math.round);
    }));
    expect(f).toEqual(k1);
    expect(await progreso(page)).toBe(1);

    await page.setViewportSize({ width: 1100, height: 800 });
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 900, height: 800 });
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => ({
      cine: document.documentElement.classList.contains("cine"),
      fase: document.documentElement.dataset.escenaFase ?? null,
      enLinea: [".k1-foto", ".k2", ".k3", ".k4", ".k5", ".k1-panel"].map((s) => {
        const st = document.querySelector<HTMLElement>(s)!.style;
        return st.transform + st.translate + st.opacity + st.left;
      }).join(""),
      pista: document.querySelector<HTMLElement>("[data-escena-pista]")!.offsetHeight - document.querySelector<HTMLElement>(".escena")!.offsetHeight,
    }));
    expect(m).toEqual({ cine: false, fase: null, enLinea: "", pista: 0 });
  });

  test("Tab desde la carga: ninguna de las 12 primeras paradas es invisible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrir(page);
    const malas: string[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
        const b = el.getBoundingClientRect();
        const fuera = b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth;
        return { id: `${el.tagName}.${el.className}`.slice(0, 60), o, fuera };
      });
      if (r && (r.o < 0.99 || r.fuera)) malas.push(`${i + 1}: ${r.id} (opacidad ${r.o.toFixed(2)}${r.fuera ? ", fuera" : ""})`);
    }
    expect(malas).toEqual([]);
  });

  test("snap: rueda de 40 px vuelve a 0 en ≤ 1 s; desde la mitad termina el viaje", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrir(page);
    await page.waitForTimeout(1600);
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 40);
    const t0 = Date.now();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 1500, intervals: [50] }).toBeLessThanOrEqual(1);
    expect(Date.now() - t0).toBeLessThanOrEqual(1200);
    expect(await progreso(page)).toBeLessThan(0.01);
    const f = await fin(page);
    await page.mouse.wheel(0, Math.round(900 * 0.6));
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBe(f);
    await expect.poll(() => progreso(page)).toBe(1);
  });

  test("contraste de K2 durante el cruce (p 0,36 · 0,41 · 0,46) ≥ 4,5:1", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrir(page, { captura: true });
    for (const p of [0.36, 0.41, 0.46]) {
      await irA(page, p);
      const c = await page.evaluate(() => {
        // `color-mix(in oklab, …)` se lee como `oklab(L a b / α)` o `rgb(…)`: a sRGB lineal.
        const lin = (s: string): [number, number, number, number] => {
          const n = s.match(/[-\d.]+/g)!.map(Number);
          if (s.startsWith("oklab")) {
            const [L, a, b] = n;
            const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
            const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
            const k = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
            return [
              4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * k,
              -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * k,
              -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * k,
              n[3] ?? 1,
            ].map((v, i) => (i < 3 ? Math.min(1, Math.max(0, v)) : v)) as [number, number, number, number];
          }
          const u = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return [u(n[0]), u(n[1]), u(n[2]), n[3] ?? 1];
        };
        const Y = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
        const k2 = document.querySelector(".k2")!;
        const fondo = lin(getComputedStyle(k2).backgroundColor);
        // Fondo traslúcido sobre lo más oscuro de la foto (negro): el peor caso para la tinta oscura es el claro y viceversa.
        const sobre = fondo.slice(0, 3).map((v) => v * fondo[3]);
        const tinta = lin(getComputedStyle(k2.querySelector(".claim")!).color);
        const a = Y(sobre) + 0.05;
        const b = Y(tinta) + 0.05;
        return Math.max(a, b) / Math.min(a, b);
      });
      expect(c, `p = ${p}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("lockup en el acto 1: en p = 0 el láser cae en la rendija (±2 px); en p ≥ 0,3 cerrado; en K1, entero", async ({ page }) => {
    for (const [w, h] of [[1280, 720], [1440, 900], [1920, 1080]]) {
      await page.setViewportSize({ width: w, height: h });
      await abrir(page, { captura: true });
      await expect(page.locator(XL)).toHaveAttribute("data-corte", "abierto", { timeout: 5000 });
      await page.waitForTimeout(700);
      const d = await page.evaluate((sel) => {
        const el = document.querySelector<HTMLElement>(sel)!;
        const l2 = el.querySelector<HTMLElement>(".l2")!.getBoundingClientRect();
        const corte = parseFloat(el.style.getPropertyValue("--corte"));
        const laser = document.querySelector(".k1-laser")!.getBoundingClientRect();
        return { yCorte: l2.top + corte, yLaser: laser.top + laser.height / 2, top: el.getBoundingClientRect().top };
      }, XL);
      expect(Math.abs(d.yCorte - d.yLaser), `${w}×${h}`).toBeLessThanOrEqual(2);
      expect(d.top, `${w}×${h} bajo la cabecera`).toBeGreaterThanOrEqual(88 - 0.5);
      await irA(page, 0.3);
      await expect(page.locator(XL)).toHaveAttribute("data-corte", "cerrado");
      await irA(page, 1);
      await expect(page.locator(XL)).toHaveAttribute("data-corte", "cerrado");
      // En K1 el nombre es la palabra entera (el panel de la losa), sin copia ni hilo.
      expect(await page.locator(".k1-nombre").innerText()).toContain("Vargas");
      expect(await page.evaluate((sel) => getComputedStyle(document.querySelector(`${sel} .m.inf`)!).display, XL)).toBe("none");
    }
  });

  test("CLS ≤ 0,02 en la carga del acto 1 y 0 fps en reposo (sin animaciones ni rAF vivos)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __raf: number };
      w.__cls = 0;
      w.__raf = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) w.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => {
        w.__raf++;
        return raf(cb);
      };
    });
    await abrir(page);
    await page.waitForTimeout(3000);
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThanOrEqual(0.02);
    // Reposo: ni animaciones CSS/WAAPI ni bucles de rAF (GSAP duerme sin tweens).
    const antes = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
    await page.waitForTimeout(1000);
    const despues = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
    expect(despues - antes, "rAF en 1 s de reposo").toBeLessThanOrEqual(2);
    expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length)).toBe(0);
  });

  test("GSAP bloqueado: el acto 1 se retira y queda el OS armado, sin errores", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    await page.route("**/_next/static/chunks/**/*.js", async (route) => {
      const r = await route.fetch();
      const cuerpo = await r.text();
      if (/_gsap|ScrollTrigger/.test(cuerpo)) return route.abort();
      return route.fulfill({ response: r, body: cuerpo });
    });
    await page.goto("/", { waitUntil: "load" });
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("cine")), { timeout: 8000 }).toBe(false);
    const m = await page.evaluate(() => ({
      k3: getComputedStyle(document.querySelector(".k3")!).opacity,
      k2: getComputedStyle(document.querySelector(".k2")!).translate,
      rail: document.querySelector<HTMLElement>(".rail-acciones")!.inert,
      pista: document.querySelector<HTMLElement>("[data-escena-pista]")!.offsetHeight - document.querySelector<HTMLElement>(".escena")!.offsetHeight,
    }));
    expect(m).toEqual({ k3: "1", k2: "none", rail: false, pista: 0 });
    expect(errores).toEqual([]);
  });
});

test.describe("escena del home · sin acto 1", () => {
  test.beforeEach(({ browserName }) => test.skip(browserName !== "chromium", "solo Chromium"));

  for (const caso of ["rm", "sin-js", "390"] as const) {
    test(`${caso}: OS armado desde el primer píxel, sin pin ni GSAP`, async ({ browser }) => {
      const ctx = await browser.newContext({
        viewport: caso === "390" ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        reducedMotion: caso === "rm" ? "reduce" : "no-preference",
        javaScriptEnabled: caso !== "sin-js",
      });
      const page = await ctx.newPage();
      const gsap: string[] = [];
      page.on("response", async (r) => {
        if (!r.url().endsWith(".js")) return;
        const t = await r.text().catch(() => "");
        if (/_gsap|ScrollTrigger/.test(t)) gsap.push(r.url());
      });
      await page.goto("/", { waitUntil: "load" });
      await page.waitForTimeout(2500);
      const m = await page.evaluate(() => ({
        cine: document.documentElement.classList.contains("cine"),
        pista: document.querySelector<HTMLElement>("[data-escena-pista]")!.offsetHeight - document.querySelector<HTMLElement>(".escena")!.offsetHeight,
        k3: getComputedStyle(document.querySelector(".k3")!).opacity,
        nombre: getComputedStyle(document.querySelector(".escena-nombre")!).display,
        rail: document.querySelector<HTMLElement>(".rail-acciones")?.inert ?? false,
      }));
      expect(m).toEqual({ cine: false, pista: 0, k3: "1", nombre: "none", rail: false });
      expect(gsap).toEqual([]);
      await ctx.close();
    });
  }

  test("1440 sin RM: el chunk de GSAP se pide después del LCP", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: number };
      w.__lcp = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) w.__lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    const gsap: string[] = [];
    page.on("response", async (r) => {
      if (!r.url().endsWith(".js")) return;
      const t = await r.text().catch(() => "");
      if (/_gsap|ScrollTrigger/.test(t)) gsap.push(new URL(r.url()).pathname);
    });
    await abrir(page);
    expect(gsap.length).toBeGreaterThan(0);
    const t = await page.evaluate((rutas) => {
      const w = window as unknown as { __lcp: number };
      const inicios = performance
        .getEntriesByType("resource")
        .filter((e) => rutas.some((r) => e.name.includes(r)))
        .map((e) => e.startTime);
      return { lcp: w.__lcp, primero: Math.min(...inicios) };
    }, gsap);
    expect(t.lcp).toBeGreaterThan(0);
    expect(t.primero).toBeGreaterThan(t.lcp);
  });
});
