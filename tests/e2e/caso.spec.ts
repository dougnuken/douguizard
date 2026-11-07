import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import base from "./fixtures/caso-base-F6.json";
import { setTheme } from "./matrix";

/**
 * F7 · el caso en el sistema B (07 F7, criterios de aceptación). La ficha
 * (P1-5), el tablero (P1-6), el índice lateral, la hoja con la misma pieza,
 * «Secciones» en móvil, el contenido frente a F6 y las transiciones.
 *
 * `fixtures/caso-base-F6.json` se tomó de la página completa de F6 (antes de
 * F7) con `next build` + `next start` a 1440: `h2`, imágenes, vídeos y cada
 * bloque de texto de ≥ 40 caracteres de `main`, por caso e idioma.
 */

const CASOS = [
  "olbo",
  "naowee-suid",
  "mercadolibre-andes",
  "banco-de-occidente",
  "dc-medical",
  "makeapet",
  "royal-caribbean",
  "qrvey",
  "ideaware",
  "chub",
] as const;
const CON_KPIS = ["olbo", "naowee-suid", "mercadolibre-andes", "banco-de-occidente", "dc-medical", "makeapet"];

async function preparar(page: Page, ancho: number, alto = 900) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: ancho, height: alto });
}

test.describe("ficha (P1-5)", () => {
  for (const ancho of [1440, 1024, 390]) {
    test(`2 × 2 sin escalera, los 10 casos a ${ancho}`, async ({ page }) => {
      test.slow();
      await preparar(page, ancho, ancho === 390 ? 844 : 900);
      for (const slug of CASOS) {
        await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
        const f = await page.evaluate(() => {
          const dl = document.querySelector<HTMLElement>("main [data-ficha]")!;
          const celdas = [...dl.querySelectorAll<HTMLElement>(":scope > div")];
          const r = (el: Element) => el.getBoundingClientRect();
          const dock = document.querySelector<HTMLElement>("nav.dock");
          const dockAlto = dock && getComputedStyle(dock).display !== "none" ? r(dock).height + 16 : 0;
          return {
            claves: celdas.map((c) => c.dataset.celda),
            estilos: celdas.map((c) => {
              const cs = getComputedStyle(c);
              return { bg: cs.backgroundColor, sombra: cs.boxShadow, borde: cs.borderTopWidth, bordeEstilo: cs.borderTopStyle };
            }),
            izq: celdas.map((c) => Math.round(r(c).left)),
            arriba: celdas.map((c) => r(c).top),
            anchoUltima: r(celdas[celdas.length - 1]).width,
            anchoFicha: r(dl).width,
            izqFicha: Math.round(r(dl).left),
            abajo: r(dl).bottom + window.scrollY,
            dockAlto,
            vh: window.innerHeight,
          };
        });
        const orden = ["rol", "duracion", "plataformas", "equipo"].filter((k) => f.claves.includes(k));
        expect(f.claves, `${slug} orden`).toEqual(orden);
        for (const e of f.estilos) {
          expect(e.bg, `${slug} sin fondo`).toBe("rgba(0, 0, 0, 0)");
          expect(e.sombra, `${slug} sin sombra`).toBe("none");
          expect(e.borde, `${slug} filete`).toBe("1px");
          expect(e.bordeEstilo).toBe("solid");
        }
        expect(new Set(f.izq).size, `${slug} bordes izquierdos: ${f.izq}`).toBeLessThanOrEqual(2);
        // Por filas de 2: las de una fila comparten top (la última, Equipo, va sola).
        for (let i = 0; i + 1 < f.arriba.length - 1; i += 2) {
          expect(Math.abs(f.arriba[i] - f.arriba[i + 1]), `${slug} fila ${i / 2}`).toBeLessThanOrEqual(1);
        }
        if (f.claves.at(-1) === "equipo") {
          expect(Math.abs(f.anchoUltima - f.anchoFicha), `${slug} Equipo a todo el ancho`).toBeLessThanOrEqual(1);
        }
        if (ancho === 390) {
          expect(f.abajo, `${slug} portada en el pliegue (dock ${f.dockAlto})`).toBeLessThanOrEqual(f.vh - f.dockAlto);
        }
      }
    });
  }
});

test.describe("tablero de impacto (P1-6)", () => {
  for (const idioma of ["es", "en"] as const) {
    for (const ancho of [1440, 1280, 1024, 390]) {
      test(`${idioma} · ${ancho}: una línea, sin desborde, mismo tamaño, losa a su medida`, async ({ page }) => {
        test.slow();
        await preparar(page, ancho);
        for (const slug of CON_KPIS) {
          await page.goto(`${idioma === "en" ? "/en" : ""}/work/${slug}`, { waitUntil: "networkidle" });
          const t = await page.evaluate(() => {
            const losas = [...document.querySelectorAll<HTMLElement>("main .tablero-caso > li")];
            return losas.map((li) => {
              const dot = li.querySelector<HTMLElement>(".dot")!;
              const cs = getComputedStyle(li);
              const hijos = [...li.children] as HTMLElement[];
              const contenido =
                hijos.reduce((s, h) => s + h.getBoundingClientRect().height + parseFloat(getComputedStyle(h).marginBottom), 0) +
                parseFloat(cs.rowGap) * (hijos.length - 1) +
                parseFloat(cs.paddingTop) +
                parseFloat(cs.paddingBottom);
              return {
                clara: li.classList.contains("clara"),
                fs: parseFloat(getComputedStyle(dot).fontSize),
                alto: dot.getBoundingClientRect().height,
                scroll: dot.scrollWidth,
                client: dot.clientWidth,
                losa: li.getBoundingClientRect().height,
                contenido,
                minAlto: cs.minHeight,
              };
            });
          });
          expect(t.length, slug).toBeGreaterThan(0);
          expect(t[0].clara, `${slug} la primera es la clara`).toBe(true);
          expect(t.slice(1).every((k) => !k.clara)).toBe(true);
          const fs = t[0].fs;
          for (const k of t) {
            expect(k.fs, `${slug} mismo font-size`).toBeCloseTo(fs, 1);
            expect(k.fs, `${slug} tope`).toBeLessThanOrEqual(ancho < 1024 ? 48 : 72);
            expect(k.alto, `${slug} una línea`).toBeLessThanOrEqual(k.fs * 1.1);
            expect(k.scroll, `${slug} sin desborde`).toBeLessThanOrEqual(k.client);
            expect(Math.abs(k.losa - k.contenido), `${slug} losa a su medida`).toBeLessThanOrEqual(1.5);
          }
        }
      });
    }
  }

  test("Naowee: «~1.200» con punto redondo en ES, «~1,200» sin él en EN; etiquetas legibles (axe)", async ({ page }) => {
    await preparar(page, 1440);
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const es = page.locator("main .tablero-caso .dot").nth(1);
    await expect(es).toHaveText("~1.200");
    await expect(es.locator("span.punto")).toHaveCount(1);
    const axe = await new AxeBuilder({ page }).include("main .tablero-caso").withTags(["wcag2aa"]).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
    await page.goto("/en/work/naowee-suid", { waitUntil: "networkidle" });
    const en = page.locator("main .tablero-caso .dot").nth(1);
    await expect(en).toHaveText("~1,200");
    await expect(en.locator("span.punto")).toHaveCount(0);
  });

  test("encendido: Doto de 100 a 700 al entrar; con RM, 700 sin transición", async ({ page }) => {
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const dw = () => page.locator("main .tablero-caso .dot").first().evaluate((d) => getComputedStyle(d).getPropertyValue("--dw").trim());
    expect(await dw()).toBe("100");
    await page.locator("main .tablero-caso").scrollIntoViewIfNeeded();
    await expect.poll(dw).toBe("700");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "networkidle" });
    expect(await dw()).toBe("700");
  });
});

test.describe("índice lateral", () => {
  test("≥ 1280: aria-current sigue a la sección del centro y el hilo crece de forma monótona", async ({ page }) => {
    await preparar(page, 1440);
    for (const slug of ["naowee-suid", "olbo", "banco-de-occidente"]) {
      await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
      const enlaces = page.locator("main nav[data-indice] a");
      const hrefs = await enlaces.evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
      expect(hrefs.length, slug).toBeGreaterThanOrEqual(2);
      let previo = -1;
      for (const href of hrefs) {
        const id = href.slice(1);
        expect(await page.locator(`[id="${id}"]`).count(), `${slug} ${href} existe`).toBe(1);
        await page.evaluate((id) => {
          const el = document.getElementById(id)!;
          const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + 40;
          window.scrollTo(0, y);
        }, id);
        await expect(page.locator(`main nav[data-indice] a[href="${href}"]`)).toHaveAttribute("aria-current", "true");
        const p = await page.locator("main nav[data-indice] .indice-hilo i").evaluate((i) => new DOMMatrix(getComputedStyle(i).transform).d);
        expect(p, `${slug} hilo en ${href}`).toBeGreaterThanOrEqual(previo);
        previo = p;
      }
      expect(previo).toBeGreaterThan(0);
    }
  });

  for (const ancho of [1024, 390]) {
    test(`no se ve a ${ancho}`, async ({ page }) => {
      await preparar(page, ancho);
      await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
      await expect(page.locator("main nav[data-indice]")).toBeHidden();
    });
  }
});

/** Abre el caso en la hoja desde `/work` (D21) con un clic en su card. */
async function abrirHoja(page: Page, slug: string, pre = "") {
  await page.goto(`${pre}/work`, { waitUntil: "networkidle" });
  const enlace = page.locator(`#main a[href="${pre}/work/${slug}"]:visible`).first();
  await enlace.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  await enlace.click();
  await page.waitForURL(`**${pre}/work/${slug}`);
  await expect(page.locator("dialog.hoja[open]")).toHaveAttribute("data-estado", "abierta");
}

async function conteo(page: Page, raiz: string) {
  return page.locator(raiz).evaluate((r) => ({
    // El título es `h1` en la página completa y `h2` en la hoja: se cuentan juntos.
    h2: [...r.querySelectorAll("h1, h2")].filter((h) => !h.closest("dialog.secciones")).length,
    img: r.querySelectorAll("img").length,
    kpis: r.querySelectorAll(".tablero-caso > li").length,
  }));
}

test.describe("la misma pieza en la hoja", () => {
  for (const slug of ["naowee-suid", "mercadolibre-andes", "olbo", "dc-medical"]) {
    test(`${slug}: mismos h2, imágenes y KPIs que la página completa; sin índice; título a 72`, async ({ page }) => {
      await preparar(page, 1440);
      await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
      const completa = await conteo(page, "main#main article.caso-b");
      await abrirHoja(page, slug);
      const hoja = await conteo(page, "dialog.hoja[open] article.caso-b");
      expect(hoja).toEqual(completa);
      await expect(page.locator("dialog.hoja[open] nav[data-indice]")).toHaveCount(0);
      const h2 = page.locator("dialog.hoja[open] .caso-h1");
      const largo = await h2.getAttribute("data-largo");
      expect(await h2.evaluate((h) => getComputedStyle(h).fontSize)).toBe(largo === null ? "72px" : "60px");
      const abrir = page.locator("dialog.hoja[open] a.hoja-circulo");
      await expect(abrir).toHaveAttribute("href", `/work/${slug}`);
      await expect(abrir).toHaveAttribute("aria-label", "Abrir como página completa");
    });
  }

  test("390: título a 48 y «Secciones» abre la lista; elegir lleva el foco a su h2", async ({ page }) => {
    await preparar(page, 390, 844);
    await abrirHoja(page, "olbo");
    expect(await page.locator("dialog.hoja[open] .caso-h1").evaluate((h) => getComputedStyle(h).fontSize)).toBe("48px");
    const boton = page.locator("dialog.hoja[open] .secciones-boton");
    await boton.scrollIntoViewIfNeeded();
    await boton.click();
    const lista = page.locator("dialog.hoja[open] dialog.secciones[open]");
    await expect(lista).toBeVisible();
    await lista.locator("a", { hasText: "Mi parte" }).click();
    await expect(lista).toHaveCount(0);
    await expect(page.locator("dialog.hoja[open]")).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.closest("section")?.id)).toBe("hoja-parte");
  });
});

test.describe("«Secciones» en el dock (página completa, 390)", () => {
  test("reemplaza a Contacto en un caso y lleva el foco al h2 elegido", async ({ page }) => {
    await preparar(page, 390, 844);
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const dock = page.locator("nav.dock");
    await expect(dock.locator("button[data-secciones]")).toHaveText(/Secciones/);
    await expect(dock.locator('a[href="/#contact"]')).toHaveCount(0);
    await dock.locator("button[data-secciones]").click();
    const lista = page.locator("dialog.secciones[open]");
    await expect(lista).toBeVisible();
    await lista.locator("a", { hasText: "Decisiones" }).click();
    expect(await page.evaluate(() => document.activeElement?.tagName + "#" + document.activeElement?.closest("section")?.id)).toBe("H2#decisiones");
    // Fuera de un caso, el dock conserva Contacto.
    await page.goto("/work", { waitUntil: "networkidle" });
    await expect(page.locator("nav.dock button[data-secciones]")).toHaveCount(0);
  });
});

test.describe("contenido frente a F6", () => {
  for (const idioma of ["es", "en"] as const) {
    test(`${idioma}: ningún caso pierde texto, h2, imágenes ni vídeo`, async ({ page }) => {
      test.slow();
      await preparar(page, 1440);
      for (const slug of CASOS) {
        await page.goto(`${idioma === "en" ? "/en" : ""}/work/${slug}`, { waitUntil: "networkidle" });
        const ahora = await page.evaluate(() => {
          const m = document.querySelector("main")!;
          return {
            texto: (m.textContent || "").replace(/\s+/g, " "),
            h2: m.querySelectorAll("h2").length,
            img: new Set([...m.querySelectorAll("img")].map((i) => i.getAttribute("src")?.split("?")[0].replace(/.*url=/, ""))).size,
            video: m.querySelectorAll("video").length,
          };
        });
        const b = (base as Record<string, { h2: number; img: number; video: number; textos: string[] }>)[`${idioma}/${slug}`];
        // Se compara sin la decoración de la plantilla vieja: el «→» de los
        // enlaces y el espaciado alrededor del «·» de las cejas.
        const norm = (t: string) => t.replace(/\s*→/g, "").replace(/\s*·\s*/g, "·").replace(/\s+/g, " ").trim();
        const textoAhora = norm(ahora.texto);
        const faltan = b.textos.filter((t) => !textoAhora.includes(norm(t)));
        expect(faltan, `${idioma}/${slug} texto perdido`).toEqual([]);
        expect(ahora.h2, `${idioma}/${slug} h2`).toBeGreaterThanOrEqual(b.h2);
        expect(ahora.img, `${idioma}/${slug} imágenes`).toBeGreaterThanOrEqual(b.img);
        expect(ahora.video, `${idioma}/${slug} vídeo`).toBe(b.video);
      }
    });
  }

  test("el vídeo no se reproduce solo", async ({ page }) => {
    await preparar(page, 1440);
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const pausados = await page.locator("main video").evaluateAll((vs) => vs.map((v) => (v as HTMLVideoElement).paused));
    expect(pausados.length).toBeGreaterThan(0);
    expect(pausados.every(Boolean)).toBe(true);
  });

  test("tema light: el caso sigue oscuro (B ignora data-theme)", async ({ page }) => {
    await page.addInitScript(setTheme("light"));
    await page.goto("/work/olbo", { waitUntil: "networkidle" });
    const bg = await page.locator("main article.caso-b").evaluate((a) => getComputedStyle(a).backgroundColor);
    expect(bg).toBe("rgb(6, 6, 8)");
  });
});

test.describe("transiciones y 404", () => {
  test("@view-transition entre documentos y la media del caso con nombre", async ({ page }) => {
    await preparar(page, 1440);
    await page.goto("/work/naowee-suid", { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const reglas = [...document.styleSheets].flatMap((s) => {
        try {
          return [...s.cssRules].map((r) => r.cssText);
        } catch {
          return [];
        }
      });
      return {
        auto: reglas.some((t) => /@view-transition\s*\{\s*navigation:\s*auto/.test(t)),
        nombre: getComputedStyle(document.querySelector(".caso-cubierta")!).viewTransitionName,
      };
    });
    expect(r.auto).toBe(true);
    expect(r.nombre).toBe("caso-media");
  });

  for (const [ruta, kicker, titulo] of [
    ["/this-page-was-never-here", "404 · Página no encontrada", "Aquí no hay nada."],
    ["/work/not-a-case", "404 · Caso no encontrado", "Este caso no existe, o todavía no está publicado."],
    ["/en/work/not-a-case", "404 · Case study not found", "This case study doesn't exist, or isn't published yet."],
  ] as const) {
    test(`404 en B: ${ruta}`, async ({ page }) => {
      await page.addInitScript(setTheme("light"));
      const res = await page.goto(ruta, { waitUntil: "networkidle" });
      expect(res?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText(titulo);
      await expect(page.locator(".ceja", { hasText: kicker })).toBeVisible();
      const bg = await page.locator(".pagina-b").first().evaluate((e) => getComputedStyle(e).backgroundColor);
      expect(bg).toBe("rgb(6, 6, 8)");
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(axe.violations.map((v) => v.id)).toEqual([]);
    });
  }
});
