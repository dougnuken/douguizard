import { test, expect, type Page } from "@playwright/test";

/**
 * 06-CRITICA-FINAL P1-1: el vidrio del cromo (cabecera, ES/EN, menú, dock) lleva
 * tinte propio (`--vidrio-cromo`), más denso que el de las losas, para que su
 * texto cumpla AA aunque pase sobre una superficie clara. El barrido de
 * contraste general mide contra el fondo de la página; esta prueba mide el
 * píxel real que queda detrás de cada etiqueta: oculta el texto, fotografía la
 * caja y toma el percentil 90 de luminancia (el fondo más claro, sin ruido).
 */

const lum = (r: number, g: number, b: number) => {
  const c = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

type Medida = { etiqueta: string; texto: string; fondo: string; ratio: number };

async function medir(page: Page, selector: string): Promise<Medida[]> {
  // Colores de texto antes de ocultarlo (sin la opción activa: va sobre la burbuja blanca).
  const items = await page.$$eval(selector, (els) =>
    els
      .filter((e) => !e.matches("[aria-current], [aria-current] *") && !e.closest("[aria-current]"))
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
      })
      .map((e, i) => {
        e.setAttribute("data-medir", String(i));
        let r = e.getBoundingClientRect();
        // Pulido G2: la opción de ES/EN mide 44 × 44 y sobresale de la cápsula (objetivo
        // táctil); su etiqueta va sobre su círculo de 32 px (el ::after): se mide ese.
        if (e.matches(".idioma-op")) {
          const cs = getComputedStyle(e, "::after");
          r = new DOMRect(r.x + parseFloat(cs.left), r.y + parseFloat(cs.top), parseFloat(cs.width), parseFloat(cs.height));
        }
        return { i, color: getComputedStyle(e).color, etiqueta: (e.textContent ?? "").trim().slice(0, 20) || e.getAttribute("aria-label") || "?", r: { x: r.x, y: r.y, w: r.width, h: r.height } };
      }),
  );
  await page.addStyleTag({
    content: "[data-medir], [data-medir] * { color: transparent !important; text-shadow: none !important; transition: none !important; } [data-medir] svg { visibility: hidden !important; }",
  });
  await page.waitForTimeout(150);
  const out: Medida[] = [];
  for (const it of items) {
    const png = await page.screenshot({ clip: { x: it.r.x, y: it.r.y, width: it.r.w, height: it.r.h }, animations: "disabled" });
    const lums = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const x = c.getContext("2d")!;
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const px: number[][] = [];
      // Solo la franja central (donde va el texto), lejos del canto redondeado.
      const y0 = Math.floor(c.height * 0.3), y1 = Math.ceil(c.height * 0.7);
      const x0 = Math.floor(c.width * 0.15), x1 = Math.ceil(c.width * 0.85);
      for (let y = y0; y < y1; y++) for (let xx = x0; xx < x1; xx++) {
        const k = (y * c.width + xx) * 4;
        px.push([d[k], d[k + 1], d[k + 2]]);
      }
      return px;
    }, png.toString("base64"));
    const conL = lums.map(([r, g, b]) => ({ l: lum(r, g, b), rgb: `${r},${g},${b}` })).sort((a, b) => a.l - b.l);
    const p90 = conL[Math.floor(conL.length * 0.9)];
    const [r, g, b] = (it.color.match(/[\d.]+/g) ?? []).map(Number);
    out.push({ etiqueta: it.etiqueta, texto: it.color, fondo: p90.rgb, ratio: Math.round(ratio(lum(r, g, b), p90.l) * 100) / 100 });
  }
  return out;
}

/** Posición (en el documento) de la superficie clara más grande de `main`. */
async function ponerClaroEn(page: Page, conImg: boolean) {
  const top = await page.evaluate((conImg) => {
    const L = (s: string) => {
      const m = s.match(/[\d.]+/g);
      if (!m || (m[3] !== undefined && Number(m[3]) < 0.9)) return 0;
      return (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
    };
    let mejor: HTMLElement | null = null, area = 0;
    for (const e of document.querySelectorAll<HTMLElement>("main *")) {
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      const claro = L(cs.backgroundColor) > 0.85 || (conImg && e.tagName === "IMG" && r.width > 300);
      if (claro && r.width * r.height > area && r.width > 300) { mejor = e; area = r.width * r.height; }
    }
    return mejor ? mejor.getBoundingClientRect().top + scrollY : null;
  }, conImg);
  expect(top, "hay una superficie clara").not.toBeNull();
  return top as number;
}

test.describe("P1-1 · contraste del cromo sobre superficies claras", () => {
  test("390 · dock sobre la cubierta clara del caso", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const top = await ponerClaroEn(page, true);
    // La cubierta queda bajo el dock (abajo): baja de más y vuelve un poco para que el dock reaparezca.
    await page.evaluate((t) => scrollTo(0, Math.max(0, t - 844 + 220)), top);
    await page.mouse.wheel(0, -40);
    await page.waitForTimeout(700);
    await expect(page.locator("nav.dock")).not.toHaveAttribute("data-escondido", "");
    const m = [...(await medir(page, "nav.dock a, nav.dock button, .cab-marca .wordmark > span:last-child, .idioma-op, .cab-menu"))];
    console.log(JSON.stringify(m));
    for (const x of m) expect(x.ratio, `${x.etiqueta} (${x.texto} sobre ${x.fondo})`).toBeGreaterThanOrEqual(4.5);
  });

  test("1440 · cabecera sobre las losas claras del OS", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const claras = await page.$$eval("main .losa", (els) =>
      els
        .map((e, i) => {
          e.setAttribute("data-losa", String(i));
          const m = (getComputedStyle(e).backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
          return { i, l: (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 };
        })
        .filter((x) => x.l > 0.85)
        .map((x) => x.i),
    );
    expect(claras.length, "losas claras en el OS").toBeGreaterThanOrEqual(3);
    const sel = [".cab-pills a", ".cab-marca .wordmark > span:last-child", ".idioma-op"];
    const todas: Medida[] = [];
    for (const i of claras) {
      await page.reload({ waitUntil: "networkidle" });
      // La escena se ancla con el scroll: se acerca varias veces hasta que la losa queda bajo la cabecera.
      for (let k = 0; k < 3; k++) {
        await page.evaluate((i) => {
          const e = document.querySelector(`[data-losa="${i}"]`) ?? document.querySelectorAll("main .losa")[i];
          scrollTo(0, e!.getBoundingClientRect().top + scrollY - 12);
        }, i);
        await page.waitForTimeout(600);
      }
      const caja = await page.evaluate((i) => {
        const r = document.querySelectorAll("main .losa")[i].getBoundingClientRect();
        return { x0: r.left, x1: r.right, y0: r.top };
      }, i);
      if (caja.y0 > 20) continue;
      // Solo las etiquetas con la losa detrás (por su centro).
      await page.evaluate(({ sel, caja }) => {
        for (const e of document.querySelectorAll<HTMLElement>(sel.join(","))) {
          const r = e.getBoundingClientRect();
          const cx = (r.left + r.right) / 2;
          if (cx >= caja.x0 && cx <= caja.x1) e.setAttribute("data-sobre-claro", "");
        }
      }, { sel, caja });
      todas.push(...(await medir(page, "[data-sobre-claro]")));
    }
    console.log(JSON.stringify(todas));
    expect(todas.length, "etiquetas medidas sobre losa clara").toBeGreaterThanOrEqual(2);
    for (const x of todas) expect(x.ratio, `${x.etiqueta} (${x.texto} sobre ${x.fondo})`).toBeGreaterThanOrEqual(4.5);
  });
});
