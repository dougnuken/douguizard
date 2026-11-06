import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import sharp from "sharp";

/**
 * F1 · `NameLockup` «corte láser» y el lab del sistema B (07, F1).
 *
 * `/lab` es estática y solo existe si el build se hizo con `DG_LAB=1`. Por eso
 * esta spec afirma cosas distintas según el build que esté sirviendo:
 * - build normal (la puerta común): `/lab` da 404;
 * - `DG_LAB=1 npm run build` + `DG_LAB=1 npx playwright test lockup`: todo lo demás.
 */
const LAB = process.env.DG_LAB === "1";
const XL = '[data-lockup][data-escala="xl"]';

/**
 * Cada `var(--x)` de las hojas que no pasan por Tailwind. Las locales del
 * lockup (`--corte`, `--lockup-*`, `--font-nombre`) se definen en el propio
 * elemento y no en `:root` (como `--fin-nombre` en la escena del lab), así que
 * quedan fuera.
 */
const HOJAS = ["src/components/sistema/sistema.css", "src/components/marca/marca.css", "src/app/(es)/lab/lab.css"];
const LOCALES = /^--(corte|lockup-[a-z]+|font-nombre|fin-nombre)$/;
const variablesDeHojas = () =>
  [...new Set(HOJAS.flatMap((f) => [...readFileSync(f, "utf8").matchAll(/var\((--[\w-]+)/g)].map((m) => m[1])))]
    .filter((v) => !LOCALES.test(v))
    .sort();

async function abrirLab(page: Page) {
  await page.goto("/lab", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

/** Espera a la entrada única (880 ms + 520 ms) con margen. */
async function esperarEntrada(page: Page) {
  await page.waitForFunction(
    (sel) => (document.querySelector(sel) as HTMLElement | null)?.style.getPropertyValue("--desp") === "-0.1em",
    XL,
    { timeout: 5_000 },
  );
}

if (LAB) test.describe("lab del sistema B", () => {
  test("fuente del lockup: Geologica cargada, SHRP 100, un solo woff2 ≤ 50 KB, CLS 0", async ({ page }) => {
    const woff2: { url: string; bytes: number }[] = [];
    page.on("response", async (r) => {
      if (r.url().endsWith(".woff2")) woff2.push({ url: r.url(), bytes: (await r.body()).length });
    });
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[])
          if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await esperarEntrada(page);
    const r = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      const urls: string[] = [];
      for (const s of [...document.styleSheets]) {
        let reglas: CSSRuleList;
        try {
          reglas = s.cssRules;
        } catch {
          continue;
        }
        for (const regla of [...reglas])
          if (regla instanceof CSSFontFaceRule && /Geologica/.test(regla.style.getPropertyValue("font-family")))
            urls.push(...(regla.style.getPropertyValue("src").match(/[\w.-]+\.woff2/g) ?? []));
      }
      return {
        cargada: document.fonts.check('600 16px "Geologica"'),
        fvs: getComputedStyle(el).fontVariationSettings,
        urls,
        cls: (window as unknown as { __cls: number }).__cls,
      };
    }, XL);
    expect(r.cargada).toBe(true);
    expect(r.fvs).toContain('"SHRP" 100');
    const geologica = woff2.filter((w) => r.urls.some((u) => w.url.endsWith(`/${u}`)));
    expect(geologica).toHaveLength(1);
    expect(geologica[0].bytes).toBeLessThanOrEqual(50 * 1024);
    expect(r.cls).toBe(0);
  });

  test("toda var() de sistema, marca y lab resuelve en :root (P0-1)", async ({ page }) => {
    const vars = variablesDeHojas();
    expect(vars.length).toBeGreaterThan(40);
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    const vacias = await page.evaluate((vs) => {
      const cs = getComputedStyle(document.documentElement);
      return vs.filter((v) => cs.getPropertyValue(v).trim() === "");
    }, vars);
    expect(vacias).toEqual([]);
  });

  for (const ancho of [390, 1440]) {
    test(`Doto pinta las cifras a ${ancho} (segunda visita, P0-1)`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await abrirLab(page);
      // `display: optional`: la primera visita puede caer en el respaldo; la segunda, ya en caché, no.
      await page.reload({ waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => ({
        familias: [...document.querySelectorAll<HTMLElement>("[data-dot]")].map((d) => getComputedStyle(d).fontFamily),
        cargada: document.fonts.check("700 48px Doto"),
      }));
      expect(r.familias.length).toBeGreaterThanOrEqual(7);
      expect(r.familias.filter((f) => !/^"?Doto\b/.test(f))).toEqual([]);
      expect(r.cargada).toBe(true);
    });
  }

  for (const [w, h] of [
    [1440, 900],
    [1280, 720],
  ] as const) {
    test(`medida, apertura y entrada única a ${w}×${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await abrirLab(page);
      await esperarEntrada(page);
      await page.waitForTimeout(100);
      const m = await page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        const sup = el.querySelector(".m.sup") as HTMLElement;
        const inf = el.querySelector(".m.inf") as HTMLElement;
        const cs = getComputedStyle(sup);
        const fs = parseFloat(cs.fontSize);
        const lh = parseFloat(cs.lineHeight);
        const c = document.createElement("canvas").getContext("2d")!;
        c.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
        const t = c.measureText("Vargas");
        const x = c.measureText("x");
        const base = (lh - (t.fontBoundingBoxAscent + t.fontBoundingBoxDescent)) / 2 + t.fontBoundingBoxAscent;
        const px = (v: string) => parseFloat(v.split(" ")[0]);
        return {
          fs,
          esperado: base - 0.52 * x.actualBoundingBoxAscent,
          corte: parseFloat(el.style.getPropertyValue("--corte")),
          estado: el.dataset.corte,
          rendija: parseFloat(getComputedStyle(el).getPropertyValue("--rendija")),
          tSup: px(getComputedStyle(sup).translate),
          tInf: px(getComputedStyle(inf).translate),
          clipSup: getComputedStyle(sup).clipPath,
          animaciones: el.getAnimations({ subtree: true }).length,
        };
      }, XL);
      expect(m.estado).toBe("abierto");
      expect(Math.abs(m.corte - m.esperado)).toBeLessThanOrEqual(1);
      expect(Math.abs(2 * m.rendija - 3)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(m.tSup - -0.1 * m.fs)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(m.tInf - 0.06 * m.fs)).toBeLessThanOrEqual(0.5);
      expect(m.clipSup).not.toBe("none");
      expect(m.animaciones).toBe(0);
    });
  }

  test("tras un resize 1440 → 1280×720 el corte se recalcula en proporción", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await esperarEntrada(page);
    const leer = () =>
      page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        return {
          corte: parseFloat(el.style.getPropertyValue("--corte")),
          fs: parseFloat(getComputedStyle(el).fontSize),
        };
      }, XL);
    const a = await leer();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForFunction(
      ([sel, antes]) =>
        parseFloat((document.querySelector(sel as string) as HTMLElement).style.getPropertyValue("--corte")) !==
        antes,
      [XL, a.corte] as const,
    );
    const b = await leer();
    expect(b.fs).toBeLessThan(a.fs);
    expect(Math.abs(b.corte - (a.corte * b.fs) / a.fs)).toBeLessThanOrEqual(1);
  });

  test("filo legible: sin halo rojo sobre la caja del nombre (P1-2)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await esperarEntrada(page);
    const caja = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      const l2 = el.querySelector(".l2") as HTMLElement;
      const r = l2.getBoundingClientRect();
      const corte = parseFloat(el.style.getPropertyValue("--corte"));
      return {
        sombraHilo: getComputedStyle(el.querySelector(".hilo")!).boxShadow,
        clip: { x: r.left, y: r.top + corte - 12, width: r.width, height: 24 },
      };
    }, XL);
    expect(caja.sombraHilo).toBe("none");
    // Franja de 24 px centrada en el corte, a lo ancho de «Vargas»: el filo es
    // claro (casi blanco) y lo demás, letras o fondo; nada de rojo saturado.
    const png = await page.screenshot({ clip: caja.clip });
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    let rojos = 0;
    for (let i = 0; i < data.length; i += info.channels)
      if (data[i] > 120 && data[i] - data[i + 1] > 60 && data[i] - data[i + 2] > 60) rojos++;
    expect(rojos / (info.width * info.height)).toBeLessThanOrEqual(0.01);
  });

  test("resize vertical 1440×900 → 1440×1100: el corte sigue al láser, |Δ| ≤ 1 px (P1-3)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await esperarEntrada(page);
    const medir = () =>
      page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        const l2 = el.querySelector(".l2") as HTMLElement;
        const laser = document.querySelector(".lab-laser") as HTMLElement;
        const rl = laser.getBoundingClientRect();
        return {
          yLaser: rl.top + rl.height / 2,
          yCorte: l2.getBoundingClientRect().top + parseFloat(el.style.getPropertyValue("--corte")),
          fs: parseFloat(getComputedStyle(el).fontSize),
        };
      }, XL);
    const a = await medir();
    expect(Math.abs(a.yLaser - a.yCorte)).toBeLessThanOrEqual(1);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.waitForTimeout(300);
    const b = await medir();
    expect(b.fs).toBe(a.fs); // el nombre no cambia de tamaño…
    expect(Math.abs(b.yLaser - a.yLaser)).toBeGreaterThan(10); // …pero el láser sí se mueve
    expect(Math.abs(b.yLaser - b.yCorte)).toBeLessThanOrEqual(1);
  });

  test("cerrado (t = 0): sin clip-path ni copia, y «Vargas» igual a la palabra sin construcción", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await esperarEntrada(page);
    await page.locator('[data-lab="apertura"]').fill("0");
    const m = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      return {
        estado: el.dataset.corte,
        clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath,
        inf: getComputedStyle(el.querySelector(".m.inf")!).display,
        hilo: getComputedStyle(el.querySelector(".hilo")!).display,
      };
    }, XL);
    expect(m).toEqual({ estado: "cerrado", clip: "none", inf: "none", hilo: "none" });

    const l2 = page.locator(`${XL} .l2`);
    const conConstruccion = await l2.screenshot();
    await page.evaluate((sel) => {
      const l = document.querySelector(`${sel} .l2`) as HTMLElement;
      l.textContent = "Vargas";
    }, XL);
    const palabra = await l2.screenshot();
    const [a, b] = await Promise.all(
      [conConstruccion, palabra].map((buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true })),
    );
    expect(a.info.width).toBe(b.info.width);
    expect(a.info.height).toBe(b.info.height);
    let distintos = 0;
    for (let i = 0; i < a.data.length; i += a.info.channels) {
      if (
        Math.abs(a.data[i] - b.data[i]) > 8 ||
        Math.abs(a.data[i + 1] - b.data[i + 1]) > 8 ||
        Math.abs(a.data[i + 2] - b.data[i + 2]) > 8
      )
        distintos++;
    }
    expect(distintos / (a.info.width * a.info.height)).toBeLessThanOrEqual(0.005);
  });

  test("con movimiento reducido: cerrado desde el primer cuadro y ninguna animación", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await page.waitForTimeout(1_600);
    const m = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      return {
        estado: el.dataset.corte,
        isla: el.dataset.corteIsla ?? null,
        desp: getComputedStyle(el).getPropertyValue("--desp").trim(),
        clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath,
        animaciones: el.getAnimations({ subtree: true }).length,
      };
    }, XL);
    expect(m).toEqual({ estado: "cerrado", isla: null, desp: "0px", clip: "none", animaciones: 0 });
  });

  test("390×844: sin isla, sin copia ni hilo, nombre entero", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await abrirLab(page);
    await page.waitForTimeout(1_600);
    const m = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      return {
        isla: el.dataset.corteIsla ?? null,
        clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath,
        inf: getComputedStyle(el.querySelector(".m.inf")!).display,
        hilo: getComputedStyle(el.querySelector(".hilo")!).display,
        desborde: document.documentElement.scrollWidth > window.innerWidth,
      };
    }, XL);
    expect(m).toEqual({ isla: null, clip: "none", inf: "none", hilo: "none", desborde: false });
  });

  test("si los chunks JS no llegan, el nombre XL se ve entero a los 1,5 s (P1-1)", async ({ page }) => {
    await page.route(/\/_next\/static\/chunks\/.*\.js/, (r) => r.abort());
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/lab", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1_500);
    const m = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      return {
        visibilidad: getComputedStyle(el).visibility,
        lineas: [...el.querySelectorAll<HTMLElement>(".linea")].map((l) => getComputedStyle(l).visibility),
        estado: el.dataset.corte,
        isla: el.dataset.corteIsla ?? null,
        clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath,
      };
    }, XL);
    expect(m).toEqual({
      visibilidad: "visible",
      lineas: ["visible", "visible"],
      estado: "cerrado",
      isla: null,
      clip: "none",
    });
  });

  test("sin JS: nombre entero, sin rendija", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/lab");
    const xl = page.locator(XL);
    await expect(xl).toHaveAttribute("data-corte", "cerrado");
    await expect(xl.locator(".m.inf")).toBeHidden();
    await expect(xl.locator(".hilo")).toBeHidden();
    await expect(xl.locator(".m.sup")).toHaveCSS("clip-path", "none");
    await ctx.close();
  });

  test("accesibilidad: «Doug Vargas» se lee una vez en el lab y axe no encuentra nada", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirLab(page);
    await esperarEntrada(page);
    const arbol = await page.locator("main").ariaSnapshot();
    expect(arbol.match(/Doug Vargas/g) ?? []).toHaveLength(1);
    const r = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  for (const ancho of [390, 1440]) {
    test(`contraste de las muestras y Doto ≥ 20 px a ${ancho}`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await abrirLab(page);
      const r = await page.evaluate(() => {
        const rgba = (c: string) => {
          const n = c.match(/[\d.]+/g)!.map(Number);
          return { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 };
        };
        const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
          const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const sobre = (arriba: ReturnType<typeof rgba>, abajo: ReturnType<typeof rgba>) => ({
          r: arriba.r * arriba.a + abajo.r * (1 - arriba.a),
          g: arriba.g * arriba.a + abajo.g * (1 - arriba.a),
          b: arriba.b * arriba.a + abajo.b * (1 - arriba.a),
          a: 1,
        });
        /** Fondo efectivo: se componen las capas semitransparentes hasta una opaca. */
        const fondo = (el: Element) => {
          const capas: ReturnType<typeof rgba>[] = [];
          for (let n: Element | null = el; n; n = n.parentElement) {
            const c = rgba(getComputedStyle(n).backgroundColor);
            if (c.a > 0) capas.push(c);
            if (c.a >= 1) break;
          }
          let res = { r: 0, g: 0, b: 0, a: 1 };
          for (const c of capas.reverse()) res = sobre(c, res);
          return res;
        };
        const fallos: string[] = [];
        let muestras = 0;
        for (const el of document.querySelectorAll<HTMLElement>("[data-contraste-min]")) {
          muestras++;
          const min = Number(el.dataset.contrasteMin);
          const tinta = rgba(getComputedStyle(el).color);
          const fo = fondo(el);
          const a = lum(sobre(tinta, fo));
          const b = lum(fo);
          const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
          const largo = el.tagName === "P" && (el.textContent ?? "").trim().length > 40;
          const exigido = largo ? Math.max(7, min) : min;
          if (ratio < exigido) fallos.push(`${el.textContent?.trim().slice(0, 30)}: ${ratio.toFixed(2)} < ${exigido}`);
        }
        const dots = [...document.querySelectorAll<HTMLElement>("[data-dot]")].map((d) =>
          parseFloat(getComputedStyle(d).fontSize),
        );
        return { fallos, muestras, dots };
      });
      expect(r.muestras).toBeGreaterThanOrEqual(28);
      expect(r.fallos).toEqual([]);
      expect(r.dots.length).toBeGreaterThan(0);
      expect(Math.min(...r.dots)).toBeGreaterThanOrEqual(20);
    });
  }
});

if (!LAB) test.describe("lab fuera del build de laboratorio", () => {
  test("sin DG_LAB, /lab da 404 y no está en el sitemap", async ({ request }) => {
    expect((await request.get("/lab")).status()).toBe(404);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/lab");
  });
});

/** F2: el XL con corte de la portada de `/about` (existe en los dos builds). */
test.describe("lockup en /about", () => {
  test("1440×900: --corte = base − 0,52 × altura de x (±1 px), entrada única y cierre exacto al bajar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await esperarEntrada(page);
    await page.waitForTimeout(600);
    const m = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      const sup = el.querySelector(".m.sup") as HTMLElement;
      const cs = getComputedStyle(sup);
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight);
      const c = document.createElement("canvas").getContext("2d")!;
      c.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const t = c.measureText("Vargas");
      const x = c.measureText("x");
      const base = (lh - (t.fontBoundingBoxAscent + t.fontBoundingBoxDescent)) / 2 + t.fontBoundingBoxAscent;
      return {
        tag: el.tagName,
        esperado: base - 0.52 * x.actualBoundingBoxAscent,
        corte: parseFloat(el.style.getPropertyValue("--corte")),
        estado: el.dataset.corte,
      };
    }, XL);
    expect(m.tag).toBe("H1");
    expect(m.estado).toBe("abierto");
    expect(Math.abs(m.corte - m.esperado)).toBeLessThanOrEqual(1);

    await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>(".portada")!.offsetHeight));
    await expect(page.locator(XL)).toHaveAttribute("data-corte", "cerrado");
    const cerrado = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      return {
        clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath,
        inf: getComputedStyle(el.querySelector(".m.inf")!).display,
        hilo: getComputedStyle(el.querySelector(".hilo")!).display,
      };
    }, XL);
    expect(cerrado).toEqual({ clip: "none", inf: "none", hilo: "none" });
  });

  test("390×844 y con RM: nombre entero, sin isla activa", async ({ page }) => {
    for (const [w, h, rm] of [
      [390, 844, false],
      [1440, 900, true],
    ] as const) {
      await page.emulateMedia({ reducedMotion: rm ? "reduce" : "no-preference" });
      await page.setViewportSize({ width: w, height: h });
      await page.goto("/about", { waitUntil: "networkidle" });
      await page.waitForTimeout(1600);
      const r = await page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        return { corte: el.dataset.corte, isla: el.dataset.corteIsla ?? null, clip: getComputedStyle(el.querySelector(".m.sup")!).clipPath };
      }, XL);
      expect(r, `${w} rm=${rm}`).toEqual({ corte: "cerrado", isla: null, clip: "none" });
    }
  });
});
