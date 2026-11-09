import type { Page } from "@playwright/test";
import sharp from "sharp";

/**
 * Contraste real del texto en pantalla, por píxeles: se fotografía cada
 * etiqueta con texto y sin él; los píxeles que cambian son el texto y se
 * comparan con el fondo que queda debajo. Lo usan P2-1 (píldora) y P2-5 (K2).
 */

export const lum = (r: number, g: number, b: number) => {
  const c = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
export const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function rgb(png: Buffer) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, n: info.width * info.height };
}

/**
 * Contraste del texto de cada etiqueta: p80 de los píxeles que cambian al
 * ocultarlo, por tercios de la caja (el canto de la píldora corta la etiqueta:
 * un tercio ilegible no se esconde en la media). Se queda el peor tercio.
 */
export async function contrastes(page: Page, etiquetas: string) {
  const cajas = await page.$$eval(etiquetas, (els) =>
    els.map((e, i) => {
      e.setAttribute("data-etiqueta", String(i));
      const r = e.getBoundingClientRect();
      return { texto: (e.textContent ?? "").trim(), x: r.x, y: r.y, w: r.width, h: r.height };
    }),
  );
  const con = [];
  for (const c of cajas) con.push(await page.screenshot({ clip: { x: c.x, y: c.y, width: c.w, height: c.h } }));
  const estilo = await page.addStyleTag({ content: "[data-etiqueta] { color: transparent !important; transition: none !important; }" });
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
  await estilo.evaluate((e) => (e as Element).remove());
  await page.$$eval("[data-etiqueta]", (els) => els.forEach((e) => e.removeAttribute("data-etiqueta")));
  return out;
}

