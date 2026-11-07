import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setTheme } from "./matrix";
import { settle } from "./settle";

/**
 * F6 · casos en hoja con URL real (07 §1.2 y F6). La navegación blanda a un caso
 * dentro del idioma pinta la hoja (`@modal/(.)work/[slug]`) sobre la página de
 * la que se viene; la carga directa o la recarga dan la página completa.
 */

const HOJA = "dialog.hoja[open]";

async function preparar(page: Page, { rm = true, ancho = 1440, alto = 900 } = {}) {
  if (rm) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: ancho, height: alto });
}

/** Abre `slug` desde `origen` con un clic en su primer enlace visible. Devuelve el `scrollY` previo. */
async function abrir(page: Page, origen: string, slug = "olbo", { asentar = true } = {}) {
  await page.goto(origen, { waitUntil: "networkidle" });
  if (asentar) await settle(page);
  const pre = origen.startsWith("/en") ? "/en" : "";
  const enlace = page.locator(`#main a[href="${pre}/work/${slug}"]:visible`).first();
  await enlace.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  const y = await page.evaluate(() => window.scrollY);
  await enlace.click();
  await page.waitForURL(`**${pre}/work/${slug}`);
  await expect(page.locator(HOJA)).toBeVisible();
  await expect(page.locator(HOJA)).toHaveAttribute("data-estado", "abierta");
  return y;
}

async function estructura(page: Page) {
  return page.evaluate(() => ({
    main: document.querySelectorAll("main#main").length,
    h1: document.querySelectorAll("h1").length,
    footer: document.querySelectorAll("footer").length,
    mainEnHoja: document.querySelectorAll("dialog main").length,
    dialogos: document.querySelectorAll("dialog.hoja").length,
  }));
}

test.describe("hoja · comprobaciones de §1.2 (versión instalada)", () => {
  test("(a) blanda / → /work/olbo pinta la hoja y conserva el home; Atrás la quita; recarga → página completa", async ({ page }) => {
    await preparar(page);
    await abrir(page, "/");
    const e = await estructura(page);
    expect(e, "1 main#main, 1 h1, 1 footer; la hoja no aporta ninguno").toEqual({ main: 1, h1: 1, footer: 1, mainEnHoja: 0, dialogos: 1 });
    await expect(page.locator("#main .tablero, #main [data-seccion]").first()).toBeAttached();
    // El título del dialog es el h2 del caso.
    const nombre = await page.locator(HOJA).evaluate((d) => document.getElementById(d.getAttribute("aria-labelledby")!)?.tagName);
    expect(nombre).toBe("H2");
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    await page.goForward();
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    expect(await estructura(page)).toMatchObject({ main: 1, h1: 1, footer: 1, dialogos: 0 });
    await expect(page.locator("main#main h1")).toHaveText(/olbo/i);
  });

  test("(b) la regla del nivel raíz: desde /work, /about y /experience también abre la hoja", async ({ page }) => {
    await preparar(page);
    for (const [origen, slug] of [
      ["/work", "olbo"],
      ["/about", "banco-de-occidente"],
      ["/experience", "banco-de-occidente"],
    ] as const) {
      await abrir(page, origen, slug, { asentar: false });
      expect((await estructura(page)).main, origen).toBe(1);
      await page.keyboard.press("Escape");
      await expect(page).toHaveURL(new RegExp(`${origen}$`));
      await expect(page.locator("dialog.hoja")).toHaveCount(0);
    }
  });

  test("(c) default.tsx → null no cambia los 404 ni /cv", async ({ page }) => {
    for (const [ruta, estado] of [
      ["/this-page-was-never-here", 404],
      ["/en/this-page-was-never-here", 404],
      ["/work/not-a-case", 404],
      ["/en/work/not-a-case", 404],
      ["/cv", 200],
      ["/en/cv", 200],
    ] as const) {
      const r = await page.goto(ruta, { waitUntil: "networkidle" });
      expect(r?.status(), ruta).toBe(estado);
      await expect(page.locator("dialog.hoja"), ruta).toHaveCount(0);
    }
  });

  test("(c') slug inexistente por navegación blanda → el 404 de caso, sin hoja", async ({ page }) => {
    await preparar(page);
    await page.goto("/", { waitUntil: "networkidle" });
    // Navegación blanda con el router de la app (lo mismo que hace un `<Link>`).
    await page.waitForFunction(() => !!(window as unknown as { next?: { router?: unknown } }).next?.router);
    await page.evaluate(() =>
      (window as unknown as { next: { router: { push: (h: string) => void } } }).next.router.push("/work/not-a-case"),
    );
    await page.waitForURL("**/work/not-a-case");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(HOJA)).toHaveCount(0);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("(d) «Siguiente» en la hoja reemplaza: Cerrar vuelve al tablero, no al caso anterior", async ({ page }) => {
    await preparar(page);
    await abrir(page, "/");
    const siguiente = page.locator(`${HOJA} a[href^="/work/"]`).last();
    const destino = await siguiente.getAttribute("href");
    expect(destino).not.toBe("/work/olbo");
    await siguiente.scrollIntoViewIfNeeded();
    await siguiente.click();
    await page.waitForURL(`**${destino}`);
    await expect(page.locator(HOJA)).toBeVisible();
    expect(await page.locator(`${HOJA} .hoja-cuerpo`).evaluate((c) => c.scrollTop), "el caso nuevo empieza arriba").toBeLessThan(5);
    await page.locator(`${HOJA} button.hoja-circulo`).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
  });

  test("(e) el cambio de idioma desde /en/work/olbo cae en la página completa ES", async ({ page }) => {
    await preparar(page);
    await page.goto("/en/work/olbo", { waitUntil: "networkidle" });
    await page.goto("/work/olbo", { waitUntil: "networkidle" });
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    expect((await estructura(page)).main).toBe(1);
  });
});

test.describe("hoja · conducta", () => {
  test("foco inicial en Cerrar y Tab atrapado (adelante y atrás)", async ({ page }) => {
    await preparar(page);
    await abrir(page, "/");
    await expect(page.locator(`${HOJA} button.hoja-circulo`)).toBeFocused();
    for (const tecla of ["Tab", "Shift+Tab"]) {
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press(tecla);
        const dentro = await page.evaluate(() => !!document.activeElement?.closest("dialog.hoja"));
        expect(dentro, `${tecla} ×${i + 1}: el foco sigue en la hoja`).toBe(true);
      }
    }
  });

  for (const via of ["Esc", "X", "velo", "Atrás"] as const) {
    test(`${via} cierra, devuelve el foco a la card y deja el scroll del tablero intacto`, async ({ page }) => {
      await preparar(page);
      const y = await abrir(page, "/");
      // Desplazar el cuerpo de la hoja no mueve la página de debajo.
      await page.mouse.move(720, 600);
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(300);
      if (via === "Esc") await page.keyboard.press("Escape");
      if (via === "X") await page.locator(`${HOJA} button.hoja-circulo`).click();
      if (via === "velo") await page.mouse.click(40, 450);
      if (via === "Atrás") await page.goBack();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator("dialog.hoja")).toHaveCount(0);
      expect(await page.evaluate(() => window.scrollY), "scrollY del tablero").toBe(y);
      const foco = await page.evaluate(() => (document.activeElement as HTMLAnchorElement | null)?.getAttribute("href"));
      expect(foco, "el foco vuelve al enlace de la card").toBe("/work/olbo");
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe("hidden");
    });
  }

  test("con la hoja abierta la página de debajo no se desplaza y la rueda mueve el cuerpo; el progreso avanza", async ({ page }) => {
    await preparar(page);
    const y = await abrir(page, "/");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
    await page.mouse.move(720, 600);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(400);
    expect(await page.locator(`${HOJA} .hoja-cuerpo`).evaluate((c) => c.scrollTop)).toBeGreaterThan(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(y);
    const p = await page.locator(`${HOJA} .hoja-panel`).evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--p")));
    expect(p).toBeGreaterThan(0);
  });

  test("Ctrl/Cmd+clic abre una pestaña con la página completa y deja el home sin hoja", async ({ page, context }) => {
    await preparar(page);
    await page.goto("/", { waitUntil: "networkidle" });
    const enlace = page.locator('#main a[href="/work/olbo"]:visible').first();
    await enlace.scrollIntoViewIfNeeded();
    // Lo nuestro es que la app NO intercepte un clic con modificador (Next deja
    // pasar Ctrl/Cmd/Shift/clic medio y el navegador abre la pestaña). Abrir la
    // pestaña real dependía de la carga de la máquina (1 fallo en 464), así que
    // se comprueba por separado: el clic no navega ni abre la hoja, y la
    // pestaña nueva con ese enlace da la página completa.
    // El último en enterarse es `window` (después del manejador de React): si
    // la app hubiera interceptado el clic, ya vendría con `defaultPrevented`.
    const interceptado = await enlace.evaluate((a) => {
      let previo = true;
      window.addEventListener(
        "click",
        (e) => {
          previo = e.defaultPrevented;
          e.preventDefault(); // y el navegador no abre nada
        },
        { once: true },
      );
      a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ctrlKey: true, metaKey: true }));
      return previo;
    });
    expect(interceptado, "la app no intercepta el clic con modificador").toBe(false);
    await page.waitForTimeout(500);
    const href = await enlace.getAttribute("href");
    const nueva = await context.newPage();
    await nueva.goto(href!, { waitUntil: "domcontentloaded" });
    expect(new URL(nueva.url()).pathname).toBe("/work/olbo");
    await expect(nueva.locator("dialog.hoja")).toHaveCount(0);
    expect(await nueva.locator("main#main").count()).toBe(1);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
  });

  test("«Ver página completa» lleva al documento del caso, sin hoja", async ({ page }) => {
    await preparar(page);
    await abrir(page, "/");
    await page.locator(`${HOJA} a.hoja-circulo`).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/work\/olbo$/);
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    expect((await estructura(page)).main).toBe(1);
  });

  test("«Siguiente» en la página completa no abre hoja", async ({ page }) => {
    await preparar(page);
    await page.goto("/work/olbo", { waitUntil: "networkidle" });
    const siguiente = page.locator('main#main a[href^="/work/"]').last();
    const destino = await siguiente.getAttribute("href");
    await siguiente.scrollIntoViewIfNeeded();
    await siguiente.click();
    await page.waitForURL(`**${destino}`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    expect((await estructura(page)).main).toBe(1);
  });

  test("hoja → «Trabajo» de la miga: no queda hoja pintada (slot rancio oculto)", async ({ page }) => {
    await preparar(page);
    await abrir(page, "/");
    await page.locator(`${HOJA} .hoja-miga a`).click();
    await page.waitForURL(/\/work$/);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe("hidden");
  });

  test("/cv: «Ver caso» → página completa, sin dialog (D22)", async ({ page }) => {
    await preparar(page);
    await page.goto("/cv", { waitUntil: "networkidle" });
    const enlace = page.locator("a.cv-case").first();
    const destino = await enlace.getAttribute("href");
    await enlace.click();
    await page.waitForURL(`**${destino}`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    expect((await estructura(page)).main).toBe(1);
  });

  test("EN: /en → /en/work/olbo en hoja, con su copy; Atrás vuelve a /en", async ({ page }) => {
    await preparar(page);
    await abrir(page, "/en");
    await expect(page.locator(`${HOJA} button.hoja-circulo`)).toHaveAttribute("aria-label", "Close");
    await expect(page.locator(`${HOJA} .hoja-miga a`)).toHaveAttribute("href", "/en/work");
    expect(await estructura(page)).toMatchObject({ main: 1, h1: 1, footer: 1, mainEnHoja: 0 });
    await page.goBack();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    await page.goto("/en/work/olbo", { waitUntil: "networkidle" });
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
  });

  test("axe sin violaciones con la hoja abierta (ES y EN)", async ({ page }) => {
    await preparar(page);
    for (const origen of ["/", "/en"]) {
      await abrir(page, origen, "naowee-suid");
      await page.waitForTimeout(500);
      const r = await new AxeBuilder({ page }).include("dialog.hoja").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`), origen).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(page.locator("dialog.hoja")).toHaveCount(0);
    }
  });

  test("sin peticiones RSC al abrir (la ruta del slot va prerenderizada y prefetcheada)", async ({ page }) => {
    await preparar(page);
    await page.goto("/", { waitUntil: "networkidle" });
    const enlace = page.locator('#main a[href="/work/olbo"]:visible').first();
    await enlace.scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    const rsc: string[] = [];
    page.on("request", (r) => {
      // Solo la ruta del caso: los prefetch de los enlaces que entran en la hoja
      // (la miga a `/work`) son de otras rutas y no cuentan.
      const u = new URL(r.url());
      if (u.pathname === "/work/olbo" && (r.headers()["rsc"] || u.searchParams.has("_rsc"))) rsc.push(r.url());
    });
    await enlace.click();
    await expect(page.locator(HOJA)).toHaveAttribute("data-estado", "abierta");
    expect(rsc, "peticiones RSC al abrir").toEqual([]);
  });
});

test.describe("hoja · movimiento y móvil", () => {
  test("sin RM: entra en 420 ms con translate; con RM: fundido de 150 ms sin desplazamiento", async ({ page }) => {
    await preparar(page, { rm: false });
    await page.goto("/work", { waitUntil: "networkidle" });
    await abrir(page, "/work", "olbo", { asentar: false });
    const sinRm = await page.locator(`${HOJA} .hoja-panel`).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { prop: cs.transitionProperty, dur: cs.transitionDuration, translate: cs.translate };
    });
    expect(sinRm.prop).toContain("translate");
    expect(sinRm.dur).toBe("0.42s");
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog.hoja")).toHaveCount(0);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await abrir(page, "/work", "olbo", { asentar: false });
    const conRm = await page.locator(`${HOJA} .hoja-panel`).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { prop: cs.transitionProperty, dur: cs.transitionDuration, translate: cs.translate };
    });
    expect(conRm.prop).toBe("opacity");
    expect(conRm.dur).toBe("0.15s");
    expect(conRm.translate).toBe("-50%");
  });

  test("con el ancla (sin RM, 1440): cerrar deja el tablero en el mismo progreso", async ({ page }) => {
    await preparar(page, { rm: false });
    await page.goto("/", { waitUntil: "networkidle" });
    await settle(page);
    const antes = await page.evaluate(() => ({ y: window.scrollY, fase: document.documentElement.dataset.escenaFase ?? null, cine: document.documentElement.classList.contains("cine") }));
    const enlace = page.locator('#main a[href="/work/olbo"]:visible').first();
    await enlace.focus();
    await page.waitForTimeout(300);
    const y0 = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Enter");
    await page.waitForURL("**/work/olbo");
    await expect(page.locator(HOJA)).toHaveAttribute("data-estado", "abierta");
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    await page.waitForTimeout(300);
    const despues = await page.evaluate(() => ({ y: window.scrollY, fase: document.documentElement.dataset.escenaFase ?? null, cine: document.documentElement.classList.contains("cine") }));
    expect(despues.y).toBe(y0);
    expect(despues.fase).toBe(antes.fase);
    expect(despues.cine).toBe(antes.cine);
  });

  test("móvil 390: hoja a pantalla completa menos 16 px; arrastre de 140 px cierra; 60 px vuelve", async ({ page }) => {
    await preparar(page, { rm: false, ancho: 390, alto: 844 });
    await abrir(page, "/", "olbo", { asentar: false });
    await page.waitForTimeout(700); // la entrada dura 420 ms
    const caja = await page.locator(`${HOJA} .hoja-panel`).boundingBox();
    // El ancho útil del viewport (Chromium headless pinta barra clásica; en un teléfono es 390).
    // De lado a lado del dialog (Chromium headless reserva 15 px de canal de
    // barra con `scrollbar-gutter`; en un teléfono, con barras superpuestas, es 390).
    const dialogo = await page.locator(HOJA).evaluate((d) => d.clientWidth);
    expect(caja!.width).toBe(dialogo);
    expect(caja!.width).toBeGreaterThanOrEqual(390 - 16);
    expect(Math.round(caja!.y)).toBe(16);
    const cab = page.locator(`${HOJA} .hoja-asa`);
    const c = (await cab.boundingBox())!;
    const x = c.x + c.width / 2;
    const y = c.y + 6;
    // Corto: vuelve.
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let i = 1; i <= 6; i++) {
      await page.mouse.move(x, y + i * 10);
      await page.waitForTimeout(40);
    }
    await page.mouse.up();
    await page.waitForTimeout(600);
    await expect(page).toHaveURL(/\/work\/olbo$/);
    await expect(page.locator(HOJA)).toBeVisible();
    // Largo: cierra.
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let i = 1; i <= 14; i++) {
      await page.mouse.move(x, y + i * 10);
      await page.waitForTimeout(40);
    }
    await page.mouse.up();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
  });
});
