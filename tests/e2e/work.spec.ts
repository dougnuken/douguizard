import { test, expect, type Page } from "@playwright/test";
import { archivo, ordenCasos } from "../../src/data/home";
import { aniosEnProducto, casosPublicados, productosPropios } from "../../src/lib/cuentas";

/**
 * `/work` (07 F2, criterios de aceptación). Estructura, filtro, numeración y
 * la única cuenta de «En cifras». ES y EN comparten el componente; el filtro
 * se prueba en los dos.
 */

const visibles = (page: Page, sel: string) =>
  page.evaluate((s) => {
    return Array.from(document.querySelectorAll<HTMLElement>(s)).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    }).length;
  }, sel);

test.describe("/work", () => {
  test("390×844: la captura de Naowee entra entera en el pliegue; 1440×900: h1, «En cifras» y filtros también", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work", { waitUntil: "networkidle" });
    const naowee = await page.locator(".c-naowee .losa-media").boundingBox();
    expect(naowee, "la captura existe").not.toBeNull();
    expect(naowee!.y, "empieza dentro del viewport").toBeGreaterThanOrEqual(0);
    expect(naowee!.y + naowee!.height, "bottom ≤ 844").toBeLessThanOrEqual(844);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work", { waitUntil: "networkidle" });
    for (const sel of ["h1", ".card-cifras", ".filtros"]) {
      const b = await page.locator(sel).boundingBox();
      expect(b!.y + b!.height, `${sel} en el primer pliegue`).toBeLessThanOrEqual(900);
    }
  });

  test("los filtros van en el flujo: ni sticky ni fixed, y salen del viewport al bajar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work", { waitUntil: "networkidle" });
    const posiciones = await page.evaluate(() => {
      const out: string[] = [];
      let n: HTMLElement | null = document.querySelector(".filtros");
      while (n && n !== document.body) {
        out.push(getComputedStyle(n).position);
        n = n.parentElement;
      }
      return out;
    });
    expect(posiciones.filter((p) => p === "sticky" || p === "fixed")).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 1300));
    await page.waitForTimeout(200);
    const b = await page.locator(".filtros").boundingBox();
    expect(b!.y + b!.height, "fuera por arriba").toBeLessThan(0);
  });

  for (const ruta of ["/work", "/en/work"]) {
    test(`filtro ${ruta}: propios → 3, anteriores → archivo (4), todos → 10, con aria-pressed y aria-live`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ruta, { waitUntil: "networkidle" });
      const casos = ".losa-caso, .filas li";
      expect(await visibles(page, casos)).toBe(casosPublicados());

      await page.locator('[data-filtro="propio"]').click();
      expect(await visibles(page, ".losa-caso")).toBe(productosPropios().length);
      expect(await visibles(page, ".filas li")).toBe(0);
      const pulsados = await page.locator('.filtro[aria-pressed="true"]').evaluateAll((b) => b.map((x) => x.getAttribute("data-filtro")));
      expect(pulsados).toEqual(["propio"]);
      await expect(page.locator("[data-anuncio-filtro]")).toHaveText(ruta === "/work" ? "3 casos" : "3 case studies");
      const slugs = await page.locator(".losa-caso:not([hidden])").evaluateAll((l) => l.map((x) => x.getAttribute("data-slug")));
      expect(slugs.sort()).toEqual(productosPropios().map((p) => p.slug).sort());

      await page.locator('[data-filtro="anterior"]').click();
      expect(await visibles(page, ".losa-caso")).toBe(0);
      expect(await visibles(page, ".filas li")).toBe(archivo.length);

      await page.locator('[data-filtro="todos"]').click();
      expect(await visibles(page, casos)).toBe(casosPublicados());
      await expect(page.locator("[data-anuncio-filtro]")).toHaveText(ruta === "/work" ? "10 casos" : "10 case studies");
    });
  }

  test("sin JS: los 10 casos visibles y ningún botón de filtro", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/work", { waitUntil: "load" });
    expect(await visibles(page, ".losa-caso, .filas li")).toBe(casosPublicados());
    expect(await visibles(page, ".filtro")).toBe(0);
    await ctx.close();
  });

  test("numeración /01…/10 en orden del DOM, cada card enlaza a su caso y Andes dice NDA", async ({ page }) => {
    await page.goto("/work", { waitUntil: "networkidle" });
    const nums = await page.locator("[data-num]").allTextContents();
    expect(nums.map((n) => n.trim())).toEqual(Array.from({ length: 10 }, (_, i) => `/${String(i + 1).padStart(2, "0")}`));
    const enlaces = await page
      .locator(".losa-caso")
      .evaluateAll((l) => l.map((li) => [li.getAttribute("data-slug"), li.querySelector("a.bento-capa")?.getAttribute("href")]));
    expect(enlaces).toEqual(ordenCasos.map((s) => [s, `/work/${s}`]));
    const filas = await page.locator(".filas li").evaluateAll((l) => l.map((li) => li.querySelector("a")?.getAttribute("href")));
    expect(filas).toEqual(archivo.map((s) => `/work/${s}`));
    await expect(page.locator('.losa-caso[data-slug="mercadolibre-andes"]')).toContainText("NDA");
    // Cada card se nombra por su título visible.
    const nombre = await page.locator('.losa-caso[data-slug="olbo"] a.bento-capa').evaluate((a) => {
      const id = a.getAttribute("aria-labelledby");
      return id ? document.getElementById(id)?.textContent : null;
    });
    expect(nombre).toBe("olbo");
  });

  test("«En cifras» = cuentas.ts (12 · 10 · 3) en ES y EN", async ({ page }) => {
    for (const ruta of ["/work", "/en/work"]) {
      await page.goto(ruta, { waitUntil: "networkidle" });
      const v = await page.evaluate(() =>
        Object.fromEntries(
          Array.from(document.querySelectorAll<HTMLElement>("[data-cifra]")).map((d) => [d.dataset.cifra, d.textContent?.trim()]),
        ),
      );
      expect(v, ruta).toEqual({
        anios: String(aniosEnProducto()),
        casos: String(casosPublicados()),
        propios: String(productosPropios().length),
      });
    }
  });

  test("«Leído»: tras abrir un caso, su losa lo marca (y solo esa)", async ({ page }) => {
    await page.goto("/work", { waitUntil: "networkidle" });
    expect(await page.locator("[data-leido]").count()).toBe(0);
    await page.goto("/work/olbo", { waitUntil: "networkidle" });
    await page.goto("/work", { waitUntil: "networkidle" });
    await expect(page.locator('[data-leido="olbo"]')).toBeVisible();
    expect(await page.locator("[data-leido]").count()).toBe(1);
  });
});
