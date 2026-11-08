import { test, expect, type Page } from "@playwright/test";

/**
 * 09-MOTION-CONTROLES: la selección se desliza (dock, pills, filtro), el ES/EN
 * lleva su burbuja al otro idioma antes de navegar y «Desliza» recorre el riel
 * un número finito de veces. Con RM, nada se mueve.
 */

/** Graba en `window.__muestras`, cuadro a cuadro, el recorte de la píldora de `sel` (sobrevive a la navegación en el cliente). */
async function grabar(page: Page, sel: string) {
  await page.evaluate((s) => {
    const w = window as unknown as { __muestras: { izq: number; moviendo: boolean; anims: number }[]; __grabando: boolean };
    w.__muestras = [];
    w.__grabando = true;
    // Al empezar el viaje (síncrono con el clic, antes de que la ruta ocupe el hilo
    // principal): de dónde a dónde va el círculo izquierdo, según sus keyframes.
    const ww = window as unknown as { __viaje: number[] | null };
    ww.__viaje = null;
    new MutationObserver(() => {
      const nav = document.querySelector<HTMLElement>(s);
      const c = nav?.querySelector<HTMLElement>(":scope > .pildora > i");
      const a = nav?.hasAttribute("data-moviendo") ? c?.getAnimations()[0] : null;
      if (!a || ww.__viaje) return;
      const x = (t: unknown) => Number(/translate\(([-\d.]+)px/.exec(String(t))?.[1] ?? NaN);
      const k = (a.effect as KeyframeEffect).getKeyframes();
      ww.__viaje = [x(k[0].transform), x(k[k.length - 1].transform), Number((a.effect as KeyframeEffect).getTiming().duration)];
    }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-moviendo"] });
    const paso = () => {
      const nav = document.querySelector<HTMLElement>(s);
      const p = nav?.querySelector<HTMLElement>(":scope > .pildora");
      if (nav && p) {
        // La x del círculo izquierdo de la píldora (`matrix(1, 0, 0, 1, x, y)`).
        const c = p.firstElementChild as HTMLElement;
        const m = /matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([-\d.]+)/.exec(getComputedStyle(c).transform);
        w.__muestras.push({ izq: m ? Number(m[1]) : -1, moviendo: nav.hasAttribute("data-moviendo"), anims: p.getAnimations({ subtree: true }).length });
      }
      if (w.__grabando) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }, sel);
}
const viaje = (page: Page) => page.evaluate(() => (window as unknown as { __viaje: number[] | null }).__viaje);
const muestras = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __muestras: { izq: number; moviendo: boolean; anims: number }[]; __grabando: boolean };
    w.__grabando = false;
    return w.__muestras;
  });
const izquierda = (page: Page, sel: string) => page.locator(sel).evaluate((el) => (el as HTMLElement).offsetLeft);

test.describe("dock móvil (390)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("la selección se desliza de Perfil a Trabajo al navegar, y en reposo no queda animación", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    const desde = await izquierda(page, 'nav.dock a[aria-current="page"]');
    await grabar(page, "nav.dock");
    await page.locator('nav.dock a[href="/work"]').click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator('nav.dock a[href="/work"]')).toHaveAttribute("aria-current", "page");
    await page.waitForTimeout(600);
    const m = await muestras(page);
    const hasta = await izquierda(page, 'nav.dock a[aria-current="page"]');
    expect(hasta).toBeLessThan(desde);
    // Al menos un cuadro a medio camino (ni en el origen ni en el destino), con la píldora a la vista.
    const medias = m.filter((x) => x.moviendo && x.izq > hasta + 2 && x.izq < desde - 2);
    expect(medias.length, JSON.stringify(m.slice(0, 40))).toBeGreaterThan(0);
    // Termina: sin `data-moviendo` ni animaciones vivas.
    await expect(page.locator("nav.dock")).not.toHaveAttribute("data-moviendo", /.*/);
    expect(await page.locator("nav.dock .pildora").evaluate((p) => p.getAnimations({ subtree: true }).length)).toBe(0);
    // En reposo la selección es el fondo de la opción (lo que ven axe y el contraste).
    expect(await page.locator('nav.dock a[aria-current="page"]').evaluate((a) => getComputedStyle(a).backgroundColor)).toBe("rgb(255, 255, 255)");
  });

  test("con RM la selección cambia sin viaje", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about", { waitUntil: "networkidle" });
    await grabar(page, "nav.dock");
    await page.locator('nav.dock a[href="/work"]').click();
    await expect(page.locator('nav.dock a[href="/work"]')).toHaveAttribute("aria-current", "page");
    await page.waitForTimeout(400);
    const m = await muestras(page);
    expect(m.some((x) => x.moviendo || x.anims > 0), JSON.stringify(m.slice(0, 20))).toBe(false);
  });
});

test.describe("cabecera (1440)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("las pills deslizan la selección entre rutas", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    const desde = await izquierda(page, '.cab-pills .pill[aria-current="page"]');
    await grabar(page, ".cab-pills");
    await page.locator('.cab-pills .pill[href="/experience"]').click();
    await expect(page.locator('.cab-pills .pill[href="/experience"]')).toHaveAttribute("aria-current", "page");
    await page.waitForTimeout(600);
    const m = await muestras(page);
    const hasta = await izquierda(page, '.cab-pills .pill[aria-current="page"]');
    expect(hasta).toBeGreaterThan(desde);
    // El viaje va de Perfil a Experiencia en 340 ms. Las pills corren en el compositor:
    // si al salir de /about la ruta ocupa el hilo principal, el muestreo por rAF puede
    // no ver cuadros intermedios aunque en pantalla sí los haya (el dock los mide).
    expect(await viaje(page)).toEqual([desde, hasta, 340]);
    const medias = m.filter((x) => x.moviendo && x.izq > desde + 2 && x.izq < hasta - 2).length;
    console.log("pills: cuadros intermedios vistos por rAF", medias);
    await expect(page.locator(".cab-pills")).not.toHaveAttribute("data-moviendo", /.*/);
  });

  test("ES/EN: la burbuja va al otro idioma y se navega enseguida", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      const w = window as unknown as { __yendo: boolean };
      w.__yendo = false;
      const g = document.querySelector(".idioma")!;
      new MutationObserver(() => {
        if (g.hasAttribute("data-yendo")) w.__yendo = true;
      }).observe(g, { attributes: true });
      // Se guarda antes de la descarga del documento.
      addEventListener("pagehide", () => sessionStorage.setItem("yendo", String(w.__yendo)));
    });
    const t0 = Date.now();
    await page.locator('.idioma a[hreflang="en"]').click();
    await page.waitForURL(/\/en\/about/);
    expect(await page.evaluate(() => sessionStorage.getItem("yendo"))).toBe("true");
    expect(Date.now() - t0).toBeLessThan(3000);
    await expect(page.locator('.idioma [aria-current="true"]')).toHaveText(/EN/);
    await expect(page.locator(".idioma")).not.toHaveAttribute("data-yendo", /.*/);
  });
});

test.describe("/work: filtro", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test("la selección se desliza al filtro pulsado", async ({ page }) => {
    await page.goto("/work", { waitUntil: "networkidle" });
    const botones = page.locator(".filtro");
    const ultimo = botones.last();
    const desde = await izquierda(page, '.filtro[aria-pressed="true"]');
    await grabar(page, ".filtros");
    await ultimo.click();
    await expect(ultimo).toHaveAttribute("aria-pressed", "true");
    await page.waitForTimeout(600);
    const m = await muestras(page);
    const hasta = await ultimo.evaluate((el) => (el as HTMLElement).offsetLeft);
    expect(m.filter((x) => x.moviendo && x.izq > desde + 2 && x.izq < hasta - 2).length, JSON.stringify(m.slice(0, 40))).toBeGreaterThan(0);
    await expect(page.locator(".filtros")).not.toHaveAttribute("data-moviendo", /.*/);
  });
});

test.describe("«Desliza»", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test("el trazo recorre el riel un número finito de veces y se retira con el scroll", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForFunction(() => !!document.querySelector<HTMLElement>("[data-escena-pista]")?.dataset.escenaFin, null, { timeout: 15_000 });
    const info = await page.evaluate(() =>
      document.getAnimations().flatMap((a) => {
        const ef = a.effect as KeyframeEffect | null;
        if (!ef || ef.pseudoElement !== "::after" || !(ef.target as HTMLElement)?.classList.contains("escena-indicador")) return [];
        return [{ iter: ef.getTiming().iterations, estado: a.playState }];
      }),
    );
    expect(info.length).toBe(1);
    expect(Number.isFinite(info[0].iter)).toBe(true);
    await page.mouse.wheel(0, 300);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.getAnimations().filter((a) => {
              const ef = a.effect as KeyframeEffect | null;
              return ef?.pseudoElement === "::after" && (ef.target as HTMLElement)?.classList.contains("escena-indicador");
            }).length,
        ),
      )
      .toBe(0);
  });
});

test.describe("menú móvil", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("el panel entra desde el botón y se cierra con `hidden` al terminar la salida", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    const boton = page.locator(".cab-menu");
    const panel = page.locator("nav[data-menu]");
    await boton.click();
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((p) => getComputedStyle(p).transformOrigin)).not.toBe("50% 50%");
    await panel.evaluate((p) => {
      const w = window as unknown as { __saliendo: boolean };
      w.__saliendo = false;
      new MutationObserver(() => {
        if (p.hasAttribute("data-saliendo") && !(p as HTMLElement).hidden) w.__saliendo = true;
      }).observe(p, { attributes: true });
    });
    await boton.click();
    await expect(panel).toBeHidden();
    expect(await page.evaluate(() => (window as unknown as { __saliendo: boolean }).__saliendo), "la salida se ve antes de `hidden`").toBe(true);
    await expect(panel).not.toHaveAttribute("data-saliendo", /.*/);
  });
});
