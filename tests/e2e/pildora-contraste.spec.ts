import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

/**
 * 06-CRITICA-FINAL P2-1: durante el viaje de la píldora ninguna etiqueta queda
 * blanca sobre blanco. Se congela el viaje a mitad de camino (las animaciones
 * WAAPI de las tres piezas, también las del dock que se vuelve a montar con la
 * ruta nueva) y, para cada etiqueta, se fotografía su caja con texto y sin él:
 * los píxeles que cambian son el texto, y su contraste contra el fondo que
 * queda debajo (blanco de la píldora o vidrio oscuro) tiene que ser legible.
 */

const lum = (r: number, g: number, b: number) => {
  const c = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Congela cualquier viaje de la píldora de `sel` en `ms` (también los que arranquen después). */
async function congelarEn(page: Page, sel: string, ms: number) {
  await page.evaluate(
    ([s, t]) => {
      const paso = () => {
        for (const nav of document.querySelectorAll<HTMLElement>(s as string)) {
          for (const i of nav.querySelectorAll(":scope > .pildora > i")) {
            for (const a of i.getAnimations()) {
              if (a.playState === "running" && Number(a.currentTime) >= (t as number)) {
                a.currentTime = t as number;
                a.pause();
              }
            }
          }
        }
        requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    },
    [sel, ms],
  );
}

async function rgb(png: Buffer) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, n: info.width * info.height };
}

/**
 * Contraste del texto de cada etiqueta: p80 de los píxeles que cambian al
 * ocultarlo, por tercios de la caja (el canto de la píldora corta la etiqueta:
 * un tercio ilegible no se esconde en la media). Se queda el peor tercio.
 */
async function contrastes(page: Page, etiquetas: string) {
  const cajas = await page.$$eval(etiquetas, (els) =>
    els.map((e, i) => {
      e.setAttribute("data-etiqueta", String(i));
      const r = e.getBoundingClientRect();
      return { texto: (e.textContent ?? "").trim(), x: r.x, y: r.y, w: r.width, h: r.height };
    }),
  );
  const con = [];
  for (const c of cajas) con.push(await page.screenshot({ clip: { x: c.x, y: c.y, width: c.w, height: c.h } }));
  await page.addStyleTag({ content: "[data-etiqueta] { color: transparent !important; transition: none !important; }" });
  await page.waitForTimeout(100);
  const out: { texto: string; ratio: number }[] = [];
  for (const [k, c] of cajas.entries()) {
    const sin = await page.screenshot({ clip: { x: c.x, y: c.y, width: c.w, height: c.h } });
    const a = await rgb(con[k]);
    const b = await rgb(sin);
    const w = a.w;
    const tercios: number[][] = [[], [], []];
    for (let p = 0; p < Math.min(a.n, b.n); p++) {
      const q = p * 3;
      const d = Math.abs(a.data[q] - b.data[q]) + Math.abs(a.data[q + 1] - b.data[q + 1]) + Math.abs(a.data[q + 2] - b.data[q + 2]);
      if (d > 6) tercios[Math.min(2, Math.floor(((p % w) / w) * 3))].push(ratio(lum(a.data[q], a.data[q + 1], a.data[q + 2]), lum(b.data[q], b.data[q + 1], b.data[q + 2])));
    }
    const p80 = (rs: number[]) => (rs.sort((x, y) => x - y), rs[Math.floor(rs.length * 0.8)]);
    const peor = Math.min(...tercios.filter((rs) => rs.length >= 4).map(p80));
    out.push({ texto: c.texto, ratio: Math.round(peor * 100) / 100 });
  }
  return out;
}

test.describe("píldora: contraste durante el viaje", () => {
  test("dock 390, de Perfil a Trabajo, congelado en el cruce: todas las etiquetas ≥ 4,5:1", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await congelarEn(page, "nav.dock", 40);
    await page.locator('nav.dock a[href="/work"]').click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator("nav.dock:visible")).toHaveAttribute("data-moviendo", "");
    await page.waitForTimeout(300);
    const m = await contrastes(page, "nav.dock:visible :is(a, button) > span");
    expect(m.length).toBe(5);
    for (const x of m) expect(x.ratio, JSON.stringify(m)).toBeGreaterThanOrEqual(4.5);
  });

  test("filtro de /work congelado en el cruce: todas las etiquetas ≥ 4,5:1", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work", { waitUntil: "networkidle" });
    await congelarEn(page, ".filtros", 40);
    await page.locator(".filtro").nth(1).click();
    await expect(page.locator(".filtros")).toHaveAttribute("data-moviendo", "");
    await page.waitForTimeout(300);
    const m = await contrastes(page, ".filtro");
    for (const x of m) expect(x.ratio, JSON.stringify(m)).toBeGreaterThanOrEqual(4.5);
  });
});
