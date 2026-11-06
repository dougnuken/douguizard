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

// 5.5 sticky eyebrow clears the header
// olbo became a long-form case (cover, film, story) and lost its Decisions
// band; DC Medical keeps one, so the sticky eyebrow is measured there.
test("5.5 sticky eyebrow clears header on /work/dc-medical @1440", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/dc-medical", { waitUntil: "networkidle" });
  await settle(page);
  const info = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const heads = Array.from(document.querySelectorAll<HTMLElement>("h2"));
    // The Decisions band keeps the page's sticky gutter eyebrow: "Key
    // decisions", "Decisiones clave" on the Spanish page this route serves
    // (CaseDecisions.tsx). Process used to be the target, but it is a
    // horizontal timeline now, with its eyebrow on top and nothing to stick.
    const head = heads.find((h) => /key decisions|decisiones clave/i.test(h.textContent || ""));
    if (!head) return { found: false as const, all: heads.map((h) => (h.textContent || "").trim()) };
    head.scrollIntoView({ block: "start", behavior: "auto" });
    await sleep(120);
    // A sticky element travels only within its containing block — here the
    // grid cell beside the decisions list. Scroll 300px past the heading's
    // own position, or as far as that cell allows if the list is shorter,
    // so the reading is taken while the heading is still pinned rather than
    // after the cell has carried it away.
    const cell = head.parentElement!.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(head).top) || 0;
    const travel = cell.height - head.offsetHeight - stickyTop;
    const by = Math.max(0, Math.min(300, Math.floor(travel) - 16));
    window.scrollBy(0, by);
    await sleep(250);
    const r = head.getBoundingClientRect();
    return {
      found: true as const,
      by,
      top: +r.top.toFixed(1),
      // How far the heading sits below its cell's top: positive only if it
      // stuck, since in flow it would sit at the cell's very top.
      pinnedBy: +(r.top - head.parentElement!.getBoundingClientRect().top).toFixed(1),
      headerBottom: +(document.querySelector("header")?.getBoundingClientRect().bottom ?? 0).toFixed(1),
      position: getComputedStyle(head).position,
      text: (head.textContent || "").trim().slice(0, 40),
    };
  });
  expect(info.found, "5.5 Decisions h2 exists").toBe(true);
  if (info.found) {
    expect(info.position, "5.5 Decisions h2 is sticky").toBe("sticky");
    expect(info.by, "5.5 the band leaves room to scroll past the heading").toBeGreaterThan(100);
    expect(info.pinnedBy, "5.5 heading is pinned, not in flow").toBeGreaterThan(0);
    expect(info.top, `5.5 sticky h2 top ${info.top} >= 64`).toBeGreaterThanOrEqual(64);
    expect(info.top, `5.5 sticky h2 top ${info.top} clears the header`).toBeGreaterThanOrEqual(info.headerBottom);
  }
});
