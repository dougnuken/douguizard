import { test, expect } from "@playwright/test";
import { WIDTHS, THEMES, ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

// 5.1 / 5.2
for (const width of WIDTHS) {
  for (const route of ROUTES) {
    test(`5.1-5.2 overflow ${route} @${width}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(setTheme("dark"));
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await settle(page);
      const res = await page.evaluate(() => {
        const over = [] as { sel: string; right: number }[];
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > innerWidth + 1) {
            // allow-list: elements inside a horizontally scrollable container
            let n: HTMLElement | null = el.parentElement;
            let inScroller = false;
            while (n) {
              const c = getComputedStyle(n);
              if (
                (c.overflowX === "auto" || c.overflowX === "scroll" || c.overflowX === "hidden") &&
                n.scrollWidth > n.clientWidth + 1
              ) {
                inScroller = true;
                break;
              }
              if (c.overflowX === "hidden") {
                inScroller = true;
                break;
              }
              n = n.parentElement;
            }
            if (inScroller) continue;
            over.push({
              sel: `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${el.className?.toString().slice(0, 50)}`,
              right: +r.right.toFixed(1),
            });
          }
        }
        return {
          bodyScrollWidth: document.body.scrollWidth,
          innerWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          over: over.slice(0, 8),
        };
      });
      expect(
        res.bodyScrollWidth,
        `5.1 body.scrollWidth ${res.bodyScrollWidth} <= innerWidth ${res.innerWidth}+1`,
      ).toBeLessThanOrEqual(res.innerWidth + 1);
      expect(res.over, `5.2 ${JSON.stringify(res.over, null, 2)}`).toEqual([]);
    });
  }
}

// 5.3 / 5.4 · F3: el shell horizontal ya no existe (07 F3). Su geometría se
// reemplaza por la del tablero OS: el pliegue a 1440×900 tiene las 6 filas de
// `os-top`, y ninguna `.tarjeta` recorta su contenido en los anchos de escritorio.
for (const theme of THEMES) {
  test(`5.3 el OS cabe en el pliegue @1440x900 ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme(theme));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const top = document.querySelector<HTMLElement>(".os-top")!;
      const filas = getComputedStyle(top).gridTemplateRows.split(" ").length;
      const cards = Array.from(top.querySelectorAll<HTMLElement>(":scope > .tarjeta, :scope > .losa-caso"));
      return { filas, bottom: Math.max(...cards.map((c) => c.getBoundingClientRect().bottom)), n: cards.length, ih: innerHeight };
    });
    expect(r.filas, "5.3 seis filas en os-top").toBe(6);
    expect(r.n, "5.3 K1–K5 en os-top").toBe(5);
    expect(r.bottom, `5.3 la última fila acaba en ${r.bottom} ≤ ${r.ih}`).toBeLessThanOrEqual(r.ih);
  });
}

for (const [w, h] of [[1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080]] as const) {
  test(`5.4 ninguna .tarjeta recorta @${w}x${h}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/", { waitUntil: "networkidle" });
    await settle(page);
    const malas = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>(".tarjeta"))
        .map((c) => {
          // La medida de 07 es `scrollHeight ≤ clientHeight + 1`, salvo lo que la
          // card deja salir a propósito: medios decorativos (`aria-hidden`, como
          // el teléfono de olbo, que sangra por el borde en la maqueta).
          const r = c.getBoundingClientRect();
          let fondo = r.top;
          for (const el of Array.from(c.querySelectorAll<HTMLElement>("*"))) {
            if (el.closest("[aria-hidden='true']") || getComputedStyle(el).display === "none") continue;
            const b = el.getBoundingClientRect();
            if (b.height > 0 && el.children.length === 0) fondo = Math.max(fondo, b.bottom);
          }
          const decorativo = c.querySelector("[aria-hidden='true'].telefono, .losa-media.telefono");
          const scroll = decorativo ? 0 : c.scrollHeight - c.clientHeight;
          return { k: c.className.slice(0, 48), scroll, salida: +(fondo - r.bottom).toFixed(1) };
        })
        .filter((x) => x.scroll > 1 || x.salida > 1),
    );
    expect(malas, JSON.stringify(malas)).toEqual([]);
  });
}

// 5.5 lo fijo de un caso no queda bajo la cabecera.
// F7: la plantilla B ya no fija rótulos de banda («Decisiones clave» era el
// último); quien acompaña la lectura es el índice lateral (≥ 1280), sticky a
// 128 px. Se mide en DC Medical, a media lectura de «Decisiones».
test("5.5 sticky index clears header on /work/dc-medical @1440", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/dc-medical", { waitUntil: "networkidle" });
  await settle(page);
  const info = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const nav = document.querySelector<HTMLElement>("main nav[data-indice]");
    const dec = document.getElementById("decisiones");
    if (!nav || !dec) return { found: false as const };
    window.scrollTo(0, dec.getBoundingClientRect().top + window.scrollY - 200);
    await sleep(250);
    const r = nav.getBoundingClientRect();
    const zona = nav.parentElement!.getBoundingClientRect();
    return {
      found: true as const,
      position: getComputedStyle(nav).position,
      top: +r.top.toFixed(1),
      pinnedBy: +(r.top - zona.top).toFixed(1),
      headerBottom: +(document.querySelector("header")?.getBoundingClientRect().bottom ?? 0).toFixed(1),
    };
  });
  expect(info.found, "5.5 índice y Decisiones existen").toBe(true);
  if (info.found) {
    expect(info.position, "5.5 índice sticky").toBe("sticky");
    expect(info.pinnedBy, "5.5 fijado, no en el flujo").toBeGreaterThan(0);
    expect(info.top, `5.5 top ${info.top} >= 64`).toBeGreaterThanOrEqual(64);
    expect(info.top, `5.5 top ${info.top} bajo la cabecera`).toBeGreaterThanOrEqual(info.headerBottom);
  }
});
