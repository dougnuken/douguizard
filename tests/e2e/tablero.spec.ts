import { expect, test, type Page } from "@playwright/test";
import { setTheme } from "./matrix";

/**
 * F3 · el home como OS de B en su estado final, y el cromo nuevo (cabecera
 * pastilla, rail, dock) en las páginas de F2 (07 F3, criterios de aceptación).
 */

const abrir = async (page: Page, ruta: string, w: number, h: number, rm = true) => {
  if (rm) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: w, height: h });
  await page.goto(ruta, { waitUntil: "networkidle" });
};

/** ¿El elemento con ese texto está visible dentro del viewport? */
const enPliegue = (page: Page, sel: string, texto: RegExp) =>
  page.evaluate(
    ({ sel, src }) => {
      const re = new RegExp(src);
      return Array.from(document.querySelectorAll<HTMLElement>(sel)).some((e) => {
        if (!re.test(e.innerText || e.textContent || "")) return false;
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight + 1 && cs.visibility !== "hidden";
      });
    },
    { sel, src: texto.source },
  );

for (const [w, h] of [[1440, 900], [390, 844]] as const) {
  test(`5 s: nombre, h1, nivel, Mercadolibre, disponibilidad y los dos CTA en el pliegue @${w}`, async ({ page }) => {
    await abrir(page, "/", w, h);
    const nombre = w >= 1024 ? ".k1-nombre" : ".k2-nombre";
    expect(await enPliegue(page, nombre, /Doug/), "nombre").toBe(true);
    await expect(page.locator("h1")).toHaveText(/Doug Vargas\.\s*Dirijo el producto\. Después, lo construyo\./);
    expect(await enPliegue(page, ".k2 .claim", /Dirijo el producto/), "h1 visible").toBe(true);
    expect(await enPliegue(page, ".k2 .nivel", /Head of Product/), "línea de nivel").toBe(true);
    expect(await enPliegue(page, ".k2 .sub", /Mercadolibre/), "Mercadolibre").toBe(true);
    expect(await enPliegue(page, ".k2 .estado", /Disponible/), "disponibilidad").toBe(true);
    expect(await enPliegue(page, ".k2 .cta-1", /Ver casos/), "CTA 1").toBe(true);
    expect(await enPliegue(page, ".k2 .cta-2", /Descargar CV/), "CTA 2").toBe(true);
  });
}

test("a 390×664 los CTA quedan por encima de y = 664", async ({ page }) => {
  await abrir(page, "/", 390, 664);
  const b = await page.locator(".k2 .cta-1").boundingBox();
  expect(b!.y + b!.height).toBeLessThanOrEqual(664);
});

test("móvil: el home mide ≤ 6 pantallas de 844 (≤ 5.064 px) a 390", async ({ page }) => {
  await abrir(page, "/", 390, 844);
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(alto).toBeLessThanOrEqual(5064);
});

for (const ruta of ["/", "/en"]) {
  test(`un nombre visible por pantalla y la disponibilidad una vez en el pliegue (escritorio) ${ruta}`, async ({ page }) => {
    await abrir(page, ruta, 1440, 900);
    const r = await page.evaluate(() => {
      const vis = (e: HTMLElement) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && b.top < innerHeight && b.bottom > 0 && getComputedStyle(e).display !== "none";
      };
      const nombres = Array.from(document.querySelectorAll<HTMLElement>(".k1-nombre, .k2-nombre, [data-lockup]")).filter(vis).length;
      const disp = Array.from(document.querySelectorAll<HTMLElement>(".estado")).filter(vis).length;
      return { nombres, disp };
    });
    expect(r.nombres, "P1-4 un solo nombre").toBe(1);
    expect(r.disp, "P1-5 disponibilidad una vez").toBe(1);
  });
}

test("K5 fusiona hora y contacto: reloj con aria-label y «Escríbeme» a #contact", async ({ page }) => {
  await abrir(page, "/", 1440, 900);
  const reloj = page.locator(".k5 .reloj");
  await expect(reloj).toHaveAttribute("role", "img");
  await expect(reloj).toHaveAttribute("aria-label", /^Hora local en Barranquilla: \d{1,2}:\d{2}$/);
  await expect(page.locator(".k5 a")).toHaveAttribute("href", "#contact");
  await expect(page.locator(".k5")).toContainText("UTC-5");
  expect(await page.locator(".k6").count(), "no hay K6 aparte").toBe(0);
  await page.goto("/en", { waitUntil: "networkidle" });
  await expect(page.locator(".k5 .reloj")).toHaveAttribute("aria-label", /^Local time in Barranquilla: \d{1,2}:\d{2} (AM|PM)$/);
});

test("pills con aria-current por scroll-spy en el home; «Ver casos» y el skip link llevan al OS", async ({ page }) => {
  await abrir(page, "/", 1440, 900);
  await page.evaluate(() => document.getElementById("about")!.scrollIntoView());
  await page.waitForTimeout(300);
  await expect(page.locator('header a.pill[aria-current="true"]')).toHaveText("Perfil");
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator(".k2 .cta-1").click();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.activeElement?.id)).toBe("work");
  // El skip link es la primera parada y lleva al <main> que contiene el OS.
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveAttribute("href", "#main");
  await page.keyboard.press("Enter");
  const enOs = await page.evaluate(() => !!document.activeElement?.querySelector("#os"));
  expect(enOs, "skip link → main con el OS").toBe(true);
});

test("carrusel móvil: contador y botones; el dock aparece al salir del héroe", async ({ page }) => {
  await abrir(page, "/", 390, 844);
  const dock = page.locator("nav.dock");
  await expect(dock).toHaveAttribute("data-escondido", "");
  expect(await dock.evaluate((e) => (e as HTMLElement).inert)).toBe(true);
  const ctrl = page.locator(".carrusel-ctrl");
  await ctrl.scrollIntoViewIfNeeded();
  await expect(ctrl.locator(".contador")).toHaveText("1 de 4");
  await ctrl.getByRole("button", { name: "Siguiente" }).click();
  await expect(ctrl.locator(".contador")).toHaveText("2 de 4");
  await ctrl.getByRole("button", { name: "Anterior" }).click();
  await expect(ctrl.locator(".contador")).toHaveText("1 de 4");
  await expect(dock).not.toHaveAttribute("data-escondido", "");
  expect(await dock.evaluate((e) => (e as HTMLElement).inert)).toBe(false);
  await expect(dock.locator("a")).toHaveCount(5);
});

test("K12 usa las cifras de «En cifras» de /work (cuentas.ts)", async ({ page }) => {
  await abrir(page, "/", 1440, 900);
  const home = await page.locator(".k12 dd").allInnerTexts();
  await page.goto("/work", { waitUntil: "networkidle" });
  const work = await page.locator(".w-cab .card-cifras dd").allInnerTexts();
  expect(home.map((x) => x.replace(/\s/g, ""))).toEqual(work.map((x) => x.replace(/\s/g, "")));
  expect(home).toHaveLength(3);
});

for (const [ruta, actual] of [["/work", "Trabajo"], ["/about", "Perfil"], ["/experience", "Experiencia"]] as const) {
  test(`cromo B en ${ruta}: dock de 5 a 390 y pill activa en escritorio`, async ({ page }) => {
    await abrir(page, ruta, 390, 844);
    const dock = page.locator("nav.dock");
    await expect(dock).toBeVisible();
    await expect(dock.locator("a")).toHaveText(["Trabajo", "Perfil", "Experiencia", "CV", "Contacto"]);
    await expect(dock.locator('a[aria-current="page"]')).toHaveText(actual);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('header a.pill[aria-current="page"]')).toHaveText(actual);
    await expect(page.locator("nav.rail-acciones a")).toHaveCount(6);
  });
}

test("la losa de Naowee de /work sigue entera sobre el dock a 390×844", async ({ page }) => {
  await abrir(page, "/work", 390, 844);
  const r = await page.evaluate(() => {
    const m = document.querySelector<HTMLElement>(".c-naowee .losa-media")!.getBoundingClientRect();
    const d = document.querySelector<HTMLElement>("nav.dock")!.getBoundingClientRect();
    return { mediaBottom: m.bottom, dockTop: d.top };
  });
  expect(r.mediaBottom, JSON.stringify(r)).toBeLessThanOrEqual(r.dockTop);
});

test("con RM: el respaldo VidrioCss está en la portada de /about y en K1, inactivo, y no hay canvas (póster solo)", async ({ page }) => {
  await abrir(page, "/about", 1440, 900);
  await expect(page.locator(".portada [data-vidrio='css']")).toHaveCount(1);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".k1 [data-vidrio='css']")).toHaveCount(1);
  await page.waitForTimeout(600);
  expect(await page.locator("canvas").count(), "con RM no se pide WebGL").toBe(0);
  await expect(page.locator("[data-vidrio='css'][data-activo]")).toHaveCount(0);
});

/* ── Pulido E2: K14, K11 y K16 ─────────────────────────────────────────── */
for (const w of [1440, 1280, 390]) {
  test(`K14 «Cómo trabajo»: lista vertical, número sin montarse en el título ni títulos cortados @${w}`, async ({ page }) => {
    await abrir(page, "/", w, 900);
    const filas = await page.locator(".k14 .pasos li").evaluateAll((lis) =>
      lis.map((li) => {
        const n = li.querySelector(".pasos-num")!.getBoundingClientRect();
        const t = li.querySelector<HTMLElement>(".pasos-titulo")!;
        const r = t.getBoundingClientRect();
        const s = li.getBoundingClientRect();
        const solapa = n.right > r.left && n.left < r.right && n.bottom > r.top && n.top < r.bottom;
        return { solapa, cortado: t.scrollWidth > t.clientWidth + 1 || r.right > s.right + 0.5, cols: getComputedStyle(li.parentElement!).gridTemplateColumns.split(" ").length };
      }),
    );
    expect(filas).toHaveLength(4);
    for (const f of filas) expect(f, JSON.stringify(filas)).toEqual({ solapa: false, cortado: false, cols: 1 });
  });

  test(`K11 «Trayectoria»: el centro de cada punto cae en el eje de la línea (≤ 0,5 px) @${w}`, async ({ page }) => {
    await abrir(page, "/", w, 900);
    const d = await page.locator(".linea-tiempo .nodo i").evaluateAll((is) =>
      is
        .filter((i) => (i as HTMLElement).offsetParent)
        .map((i) => {
          const r = i.getBoundingClientRect();
          const eje = parseFloat(getComputedStyle(i, "::before").top) + 0.5;
          return Math.abs(r.top + r.height / 2 - (r.top + eje));
        }),
    );
    expect(d.length).toBeGreaterThan(2);
    for (const x of d) expect(x, JSON.stringify(d)).toBeLessThanOrEqual(0.5);
    // Todos los segmentos a la misma altura: una sola línea.
    const ys = await page.locator(".linea-tiempo .nodo i").evaluateAll((is) => is.filter((i) => (i as HTMLElement).offsetParent).map((i) => Math.round(i.getBoundingClientRect().top * 2)));
    expect(new Set(ys).size).toBe(1);
  });

  test(`K16 «Más trabajo»: cada nombre en una sola línea y sin desbordar la losa @${w}`, async ({ page }) => {
    await abrir(page, "/", w, 900);
    const m = await page.locator(".k16 .filas b").evaluateAll((bs) =>
      bs.map((b) => {
        const r = b.getBoundingClientRect();
        const losa = b.closest(".k16")!.getBoundingClientRect();
        const lh = parseFloat(getComputedStyle(b).lineHeight);
        return { t: b.textContent, lineas: Math.round(r.height / lh), cabe: b.scrollWidth <= Math.ceil(r.width) + 1 && r.right <= losa.right + 0.5 };
      }),
    );
    expect(m.length).toBeGreaterThan(0);
    for (const x of m) expect({ lineas: x.lineas, cabe: x.cabe }, JSON.stringify(x)).toEqual({ lineas: 1, cabe: true });
  });
}

/* QA pulido E: con el eje recortado por `clip-path`, a 375 el último año salía «202». */
for (const w of [1440, 414, 390, 360]) {
  test(`K11 «Trayectoria»: ningún año ni rótulo cortado ni montado sobre el vecino @${w}`, async ({ page }) => {
    await abrir(page, "/", w, 900);
    const m = await page.locator(".k11 .linea-tiempo").evaluate((ol) => {
      const o = ol.getBoundingClientRect();
      const nodos = Array.from(ol.querySelectorAll<HTMLElement>(".nodo")).filter((n) => n.offsetParent);
      const cajas = nodos.map((n) =>
        Array.from(n.querySelectorAll<HTMLElement>(".dot, b")).map((e) => {
          const r = e.getBoundingClientRect();
          return { izq: r.left, der: r.right };
        }),
      );
      const fuera = cajas.flat().filter((c) => c.izq < o.left - 0.5 || c.der > o.right + 0.5).length;
      let montados = 0;
      for (let i = 1; i < cajas.length; i++) {
        const finAnt = Math.max(...cajas[i - 1].map((c) => c.der));
        const iniSig = Math.min(...cajas[i].map((c) => c.izq));
        if (iniSig < finAnt + 4) montados++;
      }
      return { n: nodos.length, fuera, montados };
    });
    expect(m.n).toBeGreaterThanOrEqual(3);
    expect({ fuera: m.fuera, montados: m.montados }, JSON.stringify(m)).toEqual({ fuera: 0, montados: 0 });
  });
}
