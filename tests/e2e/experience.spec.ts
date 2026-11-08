import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { aniosEnProducto, casosPublicados, empresas, productosPropios } from "../../src/lib/cuentas";

/**
 * `/experience` (07 F2): foco por Tab sin paradas invisibles (P0-1), contraste
 * de los hitos inactivos en móvil (P1-11), la escena cabe (P1-10), scroll por
 * hito (P1-9), odómetro sin «0 · 0 · 0» (P1-8) y una sola cuenta (P1-4).
 */

const N = 10;

async function escenaLista(page: Page) {
  await page.waitForFunction(() => document.querySelector(".exp")?.hasAttribute("data-montado"), undefined, { timeout: 8000 });
}

/** Scroll al progreso p del pin y espera a que el scrub (0,5) asiente. */
async function aProgreso(page: Page, p: number) {
  await page.evaluate((p) => {
    const st = (window as unknown as { __exp: { st: () => { start: number; end: number } } }).__exp.st();
    window.scrollTo(0, Math.round(st.start + p * (st.end - st.start)));
  }, p);
  await page.waitForTimeout(900);
}

/** Opacidad acumulada de un elemento y sus ancestros. */
const OPACIDAD = `(el) => { let o = 1; for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity); return o; }`;

for (const [w, h] of [
  [1440, 900],
  [1280, 720],
  [390, 844],
] as const) {
  test(`Tab ${w}×${h}: ninguna parada en un elemento invisible; «Ver caso» del hito i activa el hito i`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/experience", { waitUntil: "networkidle" });
    await escenaLista(page);
    const malas: string[] = [];
    const vistas = new Set<string>();
    let verCasos = 0;
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(420);
      const r = await page.evaluate((OP) => {
        const op = new Function(`return ${OP}`)() as (el: Element) => number;
        const a = document.activeElement as HTMLElement | null;
        if (!a || a === document.body) return null;
        const b = a.getBoundingClientRect();
        const li = a.closest<HTMLElement>(".hito");
        return {
          id: `${a.tagName}:${a.getAttribute("href") ?? ""}:${a.getAttribute("aria-label") ?? ""}:${a.className}:${a.textContent?.trim().slice(0, 30)}`,
          opacidad: op(a),
          visible: b.width > 0 && b.height > 0 && getComputedStyle(a).visibility !== "hidden",
          dentro: b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth,
          hito: li ? Number(li.dataset.i) : null,
          activo: document.querySelector<HTMLElement>(".exp")?.dataset.activo ?? null,
          cine: document.documentElement.classList.contains("exp-cine"),
        };
      }, OPACIDAD);
      if (!r) break;
      if (vistas.has(r.id)) break; // volvió al principio
      vistas.add(r.id);
      if (r.opacidad < 0.999 || !r.visible || !r.dentro) malas.push(JSON.stringify(r));
      if (r.hito !== null) {
        verCasos++;
        if (r.cine) expect(r.activo, `foco en el hito ${r.hito}`).toBe(String(r.hito));
      }
    }
    expect(malas, [...vistas].join("\n")).toEqual([]);
    expect(verCasos, "se recorrieron los 7 «Ver caso»").toBe(7);
  });
}

test("390×844: rol, periodo, título y logro de los hitos inactivos ≥ 4,5:1 contra su fondo real", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/experience", { waitUntil: "networkidle" });
  await escenaLista(page);
  for (const y of [0, 1400, 2800]) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(400);
    const r = await page.evaluate((OP) => {
      const op = new Function(`return ${OP}`)() as (el: Element) => number;
      const rgb = (s: string) => (s.match(/[\d.]+/g) ?? []).map(Number);
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const fondo = (el: Element) => {
        for (let n: Element | null = el; n; n = n.parentElement) {
          const c = rgb(getComputedStyle(n).backgroundColor);
          if (c.length >= 3 && (c[3] ?? 1) > 0) return c;
        }
        return [6, 6, 8];
      };
      const out: { t: string; r: number }[] = [];
      let inactivos = 0;
      for (const li of Array.from(document.querySelectorAll<HTMLElement>(".hito:not(.activo)"))) {
        inactivos++;
        for (const el of Array.from(li.querySelectorAll<HTMLElement>(".periodo, .t-losa, .rol, .logro"))) {
          const c = rgb(getComputedStyle(el).color);
          const bg = fondo(el);
          const a = (c[3] ?? 1) * op(el);
          const mezcla = c.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
          const l1 = lum(mezcla), l2 = lum(bg);
          out.push({ t: `${li.dataset.hito} ${el.className}`, r: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) });
        }
      }
      return { inactivos, out };
    }, OPACIDAD);
    expect(r.inactivos).toBeGreaterThan(0);
    expect(r.out.filter((m) => m.r < 4.5)).toEqual([]);
  }
  const axe = await new AxeBuilder({ page }).include(".hitos").withRules(["color-contrast"]).analyze();
  expect(axe.violations).toEqual([]);
});

for (const [w, h] of [
  [1280, 720],
  [1366, 768],
  [1440, 900],
] as const) {
  test(`la escena cabe a ${w}×${h} en p = 0, 0,5 y 1`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/experience", { waitUntil: "networkidle" });
    await escenaLista(page);
    for (const p of [0, 0.5, 1]) {
      await aProgreso(page, p);
      const r = await page.evaluate(() => {
        const eje = document.querySelector(".eje")!.getBoundingClientRect();
        const li = document.querySelector<HTMLElement>(".hito.activo")!;
        return { eje: eje.bottom, h: innerHeight, sh: li.scrollHeight, ch: li.clientHeight };
      });
      expect(r.eje, `p=${p} eje`).toBeLessThanOrEqual(r.h);
      expect(r.sh, `p=${p} losa del hito`).toBeLessThanOrEqual(r.ch + 1);
    }
  });
}

test("scroll por hito: pasos de 3,6 × vh / 10 activan los hitos 0 → 9 en orden", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/experience", { waitUntil: "networkidle" });
  await escenaLista(page);
  const activos: number[] = [];
  for (let k = 0; k < N; k++) {
    await aProgreso(page, (k + 0.5) / N);
    activos.push(Number(await page.locator(".exp").getAttribute("data-activo")));
  }
  expect(activos).toEqual(Array.from({ length: N }, (_, i) => i));
});

test("odómetro sin ceros: en p = 0 los acumulados van con guion y su losa a opacidad .6", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/experience", { waitUntil: "networkidle" });
  await escenaLista(page);
  await aProgreso(page, 0);
  const r = await page.locator("[data-ac]").evaluateAll((dd) =>
    dd.map((d) => ({ t: d.textContent, o: Number(getComputedStyle(d.parentElement!).opacity) })),
  );
  expect(r.every((x) => !/0/.test(x.t ?? ""))).toBe(true);
  for (const x of r) expect(x.o).toBeCloseTo(0.6, 2);
  // P2-4 (06-CRITICA-FINAL): el estado inicial se lee, no es un guion de dato faltante.
  const vacios = await page.locator("[data-ac]:empty").evaluateAll((dd) => dd.map((d) => getComputedStyle(d, "::before").content));
  expect(vacios.length).toBeGreaterThan(0);
  for (const v of vacios) expect(v).toBe('"aún no"');
});

test("P2-4: en EN, la losa sin valor dice «not yet»", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/experience", { waitUntil: "networkidle" });
  await escenaLista(page);
  await aProgreso(page, 0);
  const vacios = await page.locator("[data-ac]:empty").evaluateAll((dd) => dd.map((d) => getComputedStyle(d, "::before").content));
  expect(vacios.length).toBeGreaterThan(0);
  for (const v of vacios) expect(v).toBe('"not yet"');
});

const totales = async (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(Array.from(document.querySelectorAll<HTMLElement>("[data-ac]")).map((d) => [d.dataset.ac, d.textContent?.trim()])),
  );
const esperados = () => ({ anios: String(aniosEnProducto()), empresas: String(empresas()), casos: String(casosPublicados()) });

test("una sola cuenta: en p = 1 y con RM los acumulados son 12 · 6 · 10; la pista nombra los 3 propios de /work sin pisar los años", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/experience", { waitUntil: "networkidle" });
  await escenaLista(page);
  await aProgreso(page, 1);
  // El scrub (0,5) asienta a su ritmo: bajo carga, 900 ms no bastan y se leía el mes previo
  // (11 años). Se espera el estado final real en vez de leer una vez.
  await expect.poll(() => totales(page), { timeout: 8000 }).toEqual(esperados());
  const pista = await page.locator(".propio").allTextContents();
  expect(pista).toHaveLength(productosPropios().length);

  const choques = await page.evaluate(() => {
    const anios = document.querySelector(".anios")!.getBoundingClientRect();
    return Array.from(document.querySelectorAll(".propio")).filter((p) => {
      const b = p.getBoundingClientRect();
      return b.left < anios.right && b.right > anios.left && b.top < anios.bottom && b.bottom > anios.top;
    }).length;
  });
  expect(choques).toBe(0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experience", { waitUntil: "networkidle" });
  await expect.poll(() => totales(page), { timeout: 8000 }).toEqual(esperados());

  await page.goto("/work", { waitUntil: "networkidle" });
  await page.locator('[data-filtro="propio"]').click();
  const propiosWork = await page.locator(".losa-caso:not([hidden]) .t-losa").allTextContents();
  expect(pista).toEqual(propiosWork);
});

test("con RM: sin .pin-spacer, los 10 hitos visibles y el contador en el año actual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/experience", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  expect(await page.locator(".pin-spacer").count()).toBe(0);
  const vis = await page.locator(".hito").evaluateAll((l) => l.filter((li) => Number(getComputedStyle(li).opacity) === 1 && li.getBoundingClientRect().height > 0).length);
  expect(vis).toBe(N);
  const anio = await page.locator(".odometro .tira").evaluateAll((t) =>
    t.map((x) => Math.round(-new DOMMatrix(getComputedStyle(x).transform).m42 / parseFloat(getComputedStyle(x).fontSize))).join(""),
  );
  expect(anio).toBe(String(new Date().getUTCFullYear()));
});

test("sin JS: el <ol> con los 10 hitos visibles", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/experience", { waitUntil: "load" });
  const vis = await page.locator("ol.hitos > li").evaluateAll((l) => l.filter((li) => Number(getComputedStyle(li).opacity) === 1 && li.getBoundingClientRect().height > 0).length);
  expect(vis).toBe(N);
  await ctx.close();
});
