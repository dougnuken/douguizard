import { test, expect } from "@playwright/test";

/** 06-CRITICA-FINAL P2-2 y P2-3: el dock marca «Trabajo» en un caso y la etiqueta activa respira dentro de la píldora. */

test.describe("dock: «Trabajo» en la página de un caso (P2-2)", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const ruta of ["/work/naowee-suid", "/en/work/naowee-suid"]) {
    test(`${ruta}: «Trabajo» lleva aria-current="true" y la píldora blanca`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: "networkidle" });
      const marcadas = page.locator("nav.dock [aria-current]");
      await expect(marcadas).toHaveCount(1);
      await expect(marcadas).toHaveAttribute("aria-current", "true");
      await expect(marcadas).toHaveAttribute("href", /\/work$/);
      expect(await marcadas.evaluate((a) => getComputedStyle(a).backgroundColor)).toBe("rgb(255, 255, 255)");
    });
  }
});

test.describe("dock: margen interno de la etiqueta activa (P2-3)", () => {
  // Como en un teléfono: barras de scroll superpuestas (sin `isMobile`, Chromium
  // de escritorio resta 15 px de barra al ancho del bloque contenedor del dock).
  test.use({ isMobile: true, hasTouch: true });
  for (const ancho of [390, 360, 320]) {
    for (const ruta of ["/experience", "/en/experience"]) {
      test(`${ancho} ${ruta}: ≥ 8 px a cada lado y el dock cabe`, async ({ page }) => {
        await page.setViewportSize({ width: ancho, height: 800 });
        await page.goto(ruta, { waitUntil: "networkidle" });
        const m = await page.evaluate(() => {
          const nav = document.querySelector<HTMLElement>("nav.dock")!.getBoundingClientRect();
          return [...document.querySelectorAll<HTMLElement>("nav.dock > :is(a, button)")].map((op) => {
            const o = op.getBoundingClientRect();
            const s = op.querySelector("span")!.getBoundingClientRect();
            return { texto: op.textContent?.trim(), izq: s.left - o.left, der: o.right - s.right, nav: [nav.left, nav.right] };
          });
        });
        for (const x of m) {
          expect(Math.min(x.izq, x.der), JSON.stringify(x)).toBeGreaterThanOrEqual(7.9);
          expect(x.nav[0]).toBeGreaterThanOrEqual(0);
          expect(x.nav[1]).toBeLessThanOrEqual(ancho);
        }
      });
    }
  }
});

/** Pulido D: iconos de un solo juego, outline → fill al seleccionar y píldora con aire. */
test.describe("dock: pulido D", () => {
  test.use({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 800 } });

  test("iconos: misma caja de 24 px, mismo trazo y puntas redondeadas", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    const iconos = await page.evaluate(() =>
      [...document.querySelectorAll<SVGSVGElement>("nav.dock svg")].map((s) => {
        const r = s.getBoundingClientRect();
        const trazos = [...s.querySelectorAll<SVGGraphicsElement>("path, circle, rect")].map((e) => {
          const cs = getComputedStyle(e);
          return `${cs.strokeWidth}|${cs.strokeLinecap}|${cs.strokeLinejoin}`;
        });
        return { n: s.dataset.icono, caja: s.getAttribute("viewBox"), w: r.width, h: r.height, trazos: [...new Set(trazos)] };
      }),
    );
    expect(iconos.map((i) => i.n)).toEqual(["trabajo", "perfil", "experiencia", "cv", "contacto"]);
    for (const i of iconos) {
      expect(i.caja, i.n).toBe("0 0 24 24");
      expect([i.w, i.h], i.n).toEqual([24, 24]);
      expect(i.trazos, i.n).toEqual(["1.75px|round|round"]);
    }
  });

  test("outline en reposo, fill al quedar seleccionado", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    const relleno = (n: string) =>
      page.evaluate((n) => getComputedStyle(document.querySelector(`nav.dock svg[data-icono="${n}"] .icono-dock__relleno`)!).opacity, n);
    expect(await relleno("perfil")).toBe("1");
    expect(await relleno("trabajo")).toBe("0");
    await page.locator("nav.dock a", { hasText: "Trabajo" }).click();
    await page.waitForURL(/\/work$/);
    await expect.poll(() => relleno("trabajo")).toBe("1");
    expect(await relleno("perfil")).toBe("0");
    // El relleno entra con un rebote corto (≤ 240 ms, escala ≤ 1,08).
    const anim = await page.evaluate(() =>
      document
        .querySelector('nav.dock svg[data-icono="trabajo"]')!
        .getAnimations()
        .map((a) => {
          const t = (a.effect as KeyframeEffect).getTiming();
          const picos = (a.effect as KeyframeEffect).getKeyframes().map((k) => parseFloat(String(k.scale)));
          return { dur: Number(t.duration), max: Math.max(...picos) };
        }),
    );
    for (const a of anim) {
      expect(a.dur).toBeLessThanOrEqual(240);
      expect(a.max).toBeLessThanOrEqual(1.08);
    }
  });

  test("con reduced-motion el fill entra sin rebote", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about", { waitUntil: "networkidle" });
    const n = await page.evaluate(() => document.querySelector('nav.dock svg[data-icono="perfil"]')!.getAnimations().length);
    expect(n).toBe(0);
  });

  for (const ruta of ["/experience", "/en/experience", "/cv", "/about"]) {
    test(`390 ${ruta}: ≥ 12 px entre la etiqueta y el canto de la píldora`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: "networkidle" });
      const m = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("nav.dock > :is(a, button)")].map((op) => {
          const o = op.getBoundingClientRect();
          const s = op.querySelector("span")!.getBoundingClientRect();
          return { texto: op.textContent?.trim(), lado: Math.min(s.left - o.left, o.right - s.right) };
        }),
      );
      for (const x of m) expect(x.lado, JSON.stringify(x)).toBeGreaterThanOrEqual(11.9);
    });
  }

  test("390 /: «Contacto» seleccionado respira 12 px y el dock cabe a 320", async ({ page }) => {
    for (const ancho of [390, 320]) {
      await page.setViewportSize({ width: ancho, height: 800 });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.evaluate(() => document.getElementById("contact")!.scrollIntoView());
      const contacto = page.locator('nav.dock a[href="#contact"]');
      await expect(contacto).toHaveAttribute("aria-current", "true");
      const m = await contacto.evaluate((op) => {
        const o = op.getBoundingClientRect();
        const s = op.querySelector("span")!.getBoundingClientRect();
        const n = op.parentElement!.getBoundingClientRect();
        return { lado: Math.min(s.left - o.left, o.right - s.right), nav: [n.left, n.right], ancho: document.documentElement.scrollWidth };
      });
      expect(m.lado).toBeGreaterThanOrEqual(11.9);
      expect(m.nav[0]).toBeGreaterThanOrEqual(0);
      expect(m.nav[1]).toBeLessThanOrEqual(ancho);
      expect(m.ancho).toBeLessThanOrEqual(ancho);
    }
  });
});

// Pulido E · «Contacto» desde una página B: el home bajaba en suave desde el
// scroll heredado y la selección recorría Trabajo → Experiencia → Perfil.
test.describe("dock: «Contacto» sin viaje ni ida y vuelta (pulido E)", () => {
  test.use({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  for (const ruta of ["/about", "/work", "/en/about"]) {
    test(`${ruta} → Contacto marca el destino de inmediato @390x844`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" as ScrollBehavior }));
      await page.evaluate(() => {
        const w = window as unknown as { __log: { y: number; activo: string; hash: string }[] };
        w.__log = [];
        const t0 = performance.now();
        const f = () => {
          const a = document.querySelector(".dock [aria-current]");
          w.__log.push({ y: Math.round(window.scrollY), activo: a?.getAttribute("href") ?? "", hash: location.hash });
          if (performance.now() - t0 < 2500) requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      });
      await page.locator('.dock a[href$="#contact"]').tap();
      await page.waitForURL(/#contact$/);
      await page.waitForTimeout(2600);
      const log = await page.evaluate(() => (window as unknown as { __log: { y: number; activo: string; hash: string }[] }).__log);
      const enHome = log.filter((l) => l.hash === "#contact");
      // Ninguna opción intermedia queda marcada en el home: solo «Contacto».
      const marcadas = [...new Set(enHome.map((l) => l.activo).filter(Boolean))];
      expect(marcadas, JSON.stringify(enHome.slice(0, 12))).toEqual(["#contact"]);
      // Sin viaje: como mucho dos fotogramas entre el scroll heredado y el destino.
      const yFinal = enHome[enHome.length - 1].y;
      const intermedios = enHome.filter((l) => l.y > 650 && Math.abs(l.y - yFinal) > 4);
      expect(intermedios.length, JSON.stringify(enHome.slice(0, 12))).toBeLessThanOrEqual(2);
      const caja = await page.locator("#contact").boundingBox();
      expect(caja!.y).toBeLessThan(844 * 0.35);
    });
  }
});
