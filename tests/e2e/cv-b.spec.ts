import { test, expect, type Page } from "@playwright/test";

/**
 * 06-CRITICA-FINAL P1-2: el cuerpo de `/cv` en pantalla es del sistema B (sin
 * mono ni mayúsculas espaciadas, nada < 13 px, «Ver caso» ≥ 44 px en táctil y
 * ≥ 24 px en escritorio, retícula de 12 a 1440). La impresión no cambia: con
 * `media: print` el cuerpo sigue en su tipografía de hoja.
 */

async function textos(page: Page) {
  return page.evaluate(() => {
    const out: { t: string; fam: string; px: number; upper: boolean }[] = [];
    for (const e of document.querySelectorAll<HTMLElement>("main *")) {
      if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) continue;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(e);
      if (cs.visibility === "hidden") continue;
      out.push({ t: e.textContent!.trim().slice(0, 24), fam: cs.fontFamily, px: parseFloat(cs.fontSize), upper: cs.textTransform === "uppercase" });
    }
    return out;
  });
}

for (const [w, h, minCaso] of [
  [1440, 900, 24],
  [390, 844, 44],
] as const) {
  test(`/cv a ${w}: cuerpo B (sin mono ni mayúsculas, ≥ 13 px) y «Ver caso» ≥ ${minCaso} px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/cv", { waitUntil: "networkidle" });
    const ts = await textos(page);
    expect(ts.length).toBeGreaterThan(50);
    const mono = ts.filter((x) => /mono/i.test(x.fam));
    expect(mono, "textos en mono").toEqual([]);
    expect(ts.filter((x) => x.px < 13), "textos < 13 px").toEqual([]);
    expect(ts.filter((x) => x.upper), "textos en mayúsculas").toEqual([]);
    const casos = await page.locator(".cv-case").evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height));
    expect(casos.length).toBeGreaterThan(0);
    for (const hgt of casos) expect(hgt).toBeGreaterThanOrEqual(minCaso);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("/cv a 1440: experiencia en col 2–8 y lateral en col 9–12 de la retícula de 12", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/cv", { waitUntil: "networkidle" });
  const g = await page.evaluate(() => {
    const main = document.querySelector("main")!;
    const cols = getComputedStyle(main).gridTemplateColumns.split(" ").length;
    const grid = document.querySelector(".cv-grid")!;
    const [exp, lat] = [grid.firstElementChild!, grid.lastElementChild!].map((e) => getComputedStyle(e));
    return { cols, exp: [exp.gridColumnStart, exp.gridColumnEnd], lat: [lat.gridColumnStart, lat.gridColumnEnd] };
  });
  expect(g).toEqual({ cols: 12, exp: ["2", "9"], lat: ["9", "13"] });
});

test("/cv impreso: la hoja conserva su tipografía (los cambios B son solo de pantalla)", async ({ page }) => {
  await page.emulateMedia({ media: "print" });
  await page.goto("/cv", { waitUntil: "networkidle" });
  const meta = await page.locator(".cv-entry > .cv-meta").first().evaluate((e) => getComputedStyle(e).fontFamily);
  expect(meta).toMatch(/mono/i);
  const display = await page.locator("main").evaluate((m) => getComputedStyle(m).display);
  expect(display).not.toBe("grid");
});
