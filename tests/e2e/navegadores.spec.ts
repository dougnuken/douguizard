import { expect, test } from "@playwright/test";

/**
 * F8 · Smoke de navegadores (07 F8): `/`, `/en`, la hoja y `/work/olbo` sin
 * errores de JS, con el OS visible y la hoja que abre y cierra. Corre en
 * Chromium con la suite; WebKit y Firefox solo con `PW_NAVEGADORES=1`
 * (`playwright.config.ts`), porque necesitan `npx playwright install webkit
 * firefox` y en el contenedor de QA el proxy no deja bajarlos.
 */
for (const ruta of ["/", "/en"]) {
  test(`smoke ${ruta}: sin errores, OS visible y la hoja abre y cierra`, async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errores.push(m.text());
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ruta, { waitUntil: "networkidle" });
    await expect(page.locator("#main .os").first()).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);

    const pre = ruta === "/en" ? "/en" : "";
    const enlace = page.locator(`#main a[href="${pre}/work/olbo"]:visible`).first();
    await enlace.scrollIntoViewIfNeeded();
    await enlace.click();
    await page.waitForURL(`**${pre}/work/olbo`);
    await expect(page.locator("dialog.hoja[open]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog.hoja")).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`${pre || ""}/?$`));
    expect(errores).toEqual([]);
  });
}

test("smoke /work/olbo por URL directa: página completa, sin hoja ni errores", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  const r = await page.goto("/work/olbo", { waitUntil: "networkidle" });
  expect(r?.status()).toBe(200);
  await expect(page.locator("dialog.hoja")).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(errores).toEqual([]);
});
