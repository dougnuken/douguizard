import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { testimonials } from "../../src/data/testimonials";
import { losaPerfil } from "../../src/lib/escena";

/**
 * `/about` (07 F2): portada con el corte sobre el láser (sticky + scrub, sin
 * pin), un solo láser en móvil, alineaciones de «Lo que hago», marcas y citas.
 */

/** Lleva la portada al progreso p y espera a que el scrub (0,3) asiente. */
async function aProgreso(page: Page, p: number) {
  await page.evaluate((p) => {
    const s = document.querySelector<HTMLElement>(".portada")!;
    const recorrido = s.offsetHeight - window.innerHeight;
    window.scrollTo(0, Math.round(p * recorrido));
  }, p);
  await page.waitForFunction(
    (p) => Math.abs(Number(document.querySelector<HTMLElement>(".portada")?.dataset.p ?? -1) - p) < 0.004,
    p,
    { timeout: 5000 },
  );
  await page.waitForTimeout(120);
}

async function cineListo(page: Page) {
  await page.waitForFunction(
    () => document.documentElement.classList.contains("perfil-cine") && document.querySelector(".portada")?.hasAttribute("data-p"),
    undefined,
    { timeout: 8000 },
  );
}

test.describe("/about", () => {
  test("«Doug Vargas» se nombra una sola vez: el h1", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Doug Vargas");
    const snap = await page.locator("main").ariaSnapshot();
    const exactos = snap.split("\n").filter((l) => /"Doug Vargas"/.test(l));
    expect(exactos, snap).toHaveLength(1);
    expect(exactos[0]).toMatch(/heading "Doug Vargas" \[level=1\]/);
  });

  for (const [w, h] of [
    [1280, 720],
    [1440, 900],
    [1920, 1080],
  ] as const) {
    test(`${w}×${h}: en p = 0 el láser pasa por la rendija (±2 px); desde p = 0,3 el corte está cerrado; en p = 0,7 la foto es la losa de las columnas 8–12`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/about", { waitUntil: "networkidle" });
      await cineListo(page);
      await page.waitForTimeout(1700); // entrada: 880 + 520 ms
      const m = await page.evaluate(() => {
        const l = document.querySelector<HTMLElement>(".portada [data-lockup]")!;
        const l2 = l.querySelector<HTMLElement>(".l2")!;
        const laser = document.querySelector<HTMLElement>(".portada .laser")!.getBoundingClientRect();
        const corte = parseFloat(l.style.getPropertyValue("--corte"));
        return {
          estado: l.dataset.corte,
          yLaser: laser.top + laser.height / 2,
          yCorte: l2.getBoundingClientRect().top + corte,
        };
      });
      expect(m.estado, "abierto tras la entrada").toBe("abierto");
      expect(Math.abs(m.yLaser - m.yCorte), JSON.stringify(m)).toBeLessThanOrEqual(2);

      await aProgreso(page, 0.35);
      await expect(page.locator(".portada [data-lockup]")).toHaveAttribute("data-corte", "cerrado");

      await aProgreso(page, 0.7);
      const r = await page.locator(".foto-clip").boundingBox();
      const { top, cw, ch } = await page.locator(".escenario").evaluate((e) => ({ top: e.getBoundingClientRect().top, cw: e.clientWidth, ch: e.clientHeight }));
      const esperado = losaPerfil(cw, ch);
      expect(Math.abs(r!.x - esperado.x), "x").toBeLessThanOrEqual(2);
      expect(Math.abs(r!.y - top - esperado.y), "y").toBeLessThanOrEqual(2);
      expect(Math.abs(r!.width - esperado.w), "w").toBeLessThanOrEqual(2);
      expect(Math.abs(r!.height - esperado.h), "h").toBeLessThanOrEqual(2);

      await aProgreso(page, 0.85);
      const op = await page.locator(".bio").evaluate((b) => Number(getComputedStyle(b).opacity));
      expect(op).toBe(1);
    });
  }

  test("la rueda siempre mueve la página: sin .pin-spacer y scrollY crece en cada paso", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await cineListo(page);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await page.mouse.move(700, 450);
    let antes = await page.evaluate(() => window.scrollY);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 240);
      await page.waitForTimeout(400);
      const ahora = await page.evaluate(() => window.scrollY);
      expect(ahora, `paso ${i}`).toBeGreaterThan(antes);
      antes = ahora;
    }
  });

  test("390×844: un solo láser visible (el de la foto), sin copia ni clip-path en el nombre", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const visible = (el: Element) => {
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return b.width > 0 && b.height > 0 && cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0;
      };
      const l = document.querySelector<HTMLElement>(".portada [data-lockup]")!;
      return {
        laseres: Array.from(document.querySelectorAll("main .laser, main .hilo")).filter(visible).map((e) => e.className),
        inf: visible(l.querySelector(".m.inf")!),
        clips: [l, ...Array.from(l.querySelectorAll<HTMLElement>("*:not(.sr-only)"))].map((e) => getComputedStyle(e).clipPath).filter((c) => c && c !== "none"),
      };
    });
    expect(r.laseres).toEqual(["laser"]);
    expect(r.inf).toBe(false);
    expect(r.clips).toEqual([]);
  });

  test("«Lo que hago»: los tres títulos a la misma altura a 1440; marcas sin fila huérfana a 1440 y 390", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const w of [1440, 390]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto("/about", { waitUntil: "networkidle" });
      if (w === 1440) {
        const tops = await page.locator(".hago .t-losa").evaluateAll((h) => h.map((x) => x.getBoundingClientRect().top));
        expect(tops).toHaveLength(3);
        expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(1);
      }
      const filas = await page.locator(".marquee-lista:not([aria-hidden]) li").evaluateAll((l) => {
        const m = new Map<number, number>();
        for (const li of l) {
          const t = Math.round(li.getBoundingClientRect().top);
          m.set(t, (m.get(t) ?? 0) + 1);
        }
        return [...m.values()];
      });
      expect(filas.filter((n) => n === 1), `${w}: ${JSON.stringify(filas)}`).toEqual([]);
    }
  });

  test("citas verbatim con lang de origen, en ES y EN", async ({ page }) => {
    for (const ruta of ["/about", "/en/about"]) {
      await page.goto(ruta, { waitUntil: "networkidle" });
      const citas = await page.locator(".testimonios blockquote").evaluateAll((b) => b.map((q) => ({ lang: q.getAttribute("lang"), t: q.textContent })));
      expect(citas).toEqual(testimonials.map((t) => ({ lang: t.quoteLang, t: `“${t.quote}”` })));
    }
  });

  test("con movimiento reducido: estado final, sin sticky ni pin", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => ({
      cine: document.documentElement.classList.contains("perfil-cine"),
      pos: getComputedStyle(document.querySelector(".escenario")!).position,
      bio: getComputedStyle(document.querySelector(".bio")!).opacity,
      corte: document.querySelector<HTMLElement>(".portada [data-lockup]")!.dataset.corte,
      spacer: document.querySelectorAll(".pin-spacer").length,
    }));
    expect(r).toEqual({ cine: false, pos: "relative", bio: "1", corte: "cerrado", spacer: 0 });
    const losa = await page.locator(".foto-clip").boundingBox();
    const tam = await page.locator(".escenario").evaluate((x) => [x.clientWidth, x.clientHeight] as const);
    const e = losaPerfil(tam[0], tam[1]);
    expect(Math.abs(losa!.x - e.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(losa!.width - e.w)).toBeLessThanOrEqual(2);
  });

  test("axe sin violaciones con y sin movimiento reducido, ES y EN", async ({ page }) => {
    for (const rm of [true, false]) {
      await page.emulateMedia({ reducedMotion: rm ? "reduce" : "no-preference" });
      for (const ruta of ["/about", "/en/about", "/work", "/en/work", "/experience", "/en/experience"]) {
        await page.goto(ruta, { waitUntil: "networkidle" });
        await page.waitForTimeout(rm ? 100 : 1700);
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(r.violations.map((v) => `${ruta} rm=${rm} ${v.id}: ${v.nodes.map((n) => n.target).join(" ")}`)).toEqual([]);
      }
    }
  });
});
