import { test, expect, type Page } from "@playwright/test";

/** 06-CRITICA-FINAL P2-7: los P2 de pulido que venían de 06-CRITICA-F7 (desvío 4 de F8). */

async function abrirHoja(page: Page, slug: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work", { waitUntil: "networkidle" });
  const enlace = page.locator(`#main a[href="/work/${slug}"]:visible`).first();
  await enlace.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  await enlace.click();
  await page.waitForURL(`**/work/${slug}`);
  await expect(page.locator("dialog.hoja[open]")).toHaveAttribute("data-estado", "abierta");
}

test.describe("F7 P2-4 · «Secciones» de la hoja a 390", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("va en la cabecera (no flota sobre el texto), la miga cabe y abre la lista", async ({ page }) => {
    await abrirHoja(page, "naowee-suid");
    const hoja = page.locator("dialog.hoja[open]");
    const boton = hoja.locator(".hoja-cab button.hoja-secciones");
    await expect(boton).toBeVisible();
    await expect(boton).toHaveAttribute("aria-label", "Secciones");
    // Nada flotante dentro del cuerpo de la hoja que pueda tapar una línea.
    const flotantes = await hoja.locator(".hoja-cuerpo").evaluate((c) =>
      [...c.querySelectorAll<HTMLElement>("button, a")].filter((e) => /sticky|fixed/.test(getComputedStyle(e).position) && e.offsetParent).length,
    );
    expect(flotantes).toBe(0);
    // La miga no se desborda y el botón queda dentro de la cabecera.
    const m = await hoja.locator(".hoja-cab").evaluate((cab) => {
      const c = cab.getBoundingClientRect();
      const b = cab.querySelector(".hoja-secciones")!.getBoundingClientRect();
      const a = cab.querySelector(".hoja-miga a")!;
      return { dentro: b.top >= c.top && b.bottom <= c.bottom, ancho: b.width, miga: a.scrollWidth <= a.clientWidth + 1 };
    });
    expect(m).toEqual({ dentro: true, ancho: 48, miga: true });
    await boton.click();
    await expect(hoja.locator("dialog.secciones[open]")).toBeVisible();
  });

  test("a 1440 no aparece (el índice lateral ya está)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrirHoja(page, "naowee-suid");
    await expect(page.locator("dialog.hoja[open] .hoja-secciones")).toBeHidden();
  });
});
