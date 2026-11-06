import { expect, test } from "@playwright/test";
import { setTheme } from "./matrix";

for (const theme of ["dark", "light"] as const) {
  test(`hero at 320 ${theme} (viewport only)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme(theme));
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `tests/shots/manual-hero-320-${theme}.png` });
    // F3 (07): antes solo tomaba la captura; ahora afirma la foto a sangre y K2
    // sin desborde a 320.
    const r = await page.evaluate(() => {
      const k1 = document.querySelector<HTMLElement>(".k1")!.getBoundingClientRect();
      const k2 = document.querySelector<HTMLElement>(".k2")!;
      const b = k2.getBoundingClientRect();
      return {
        k1: { left: k1.left, right: k1.right, top: k1.top, w: document.body.clientWidth },
        k2: { left: b.left, right: b.right, scroll: k2.scrollWidth - k2.clientWidth },
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(r.k1.left, "foto a sangre: borde izquierdo").toBe(0);
    expect(r.k1.top, "foto a sangre: arriba").toBe(0);
    expect(Math.round(r.k1.right), "foto a sangre: borde derecho").toBe(r.k1.w);
    expect(r.k2.left, "K2 dentro del viewport").toBeGreaterThanOrEqual(0);
    expect(r.k2.right, "K2 dentro del viewport").toBeLessThanOrEqual(r.k1.w);
    expect(r.k2.scroll, "K2 sin desborde interno").toBeLessThanOrEqual(0);
    expect(r.doc, "sin scroll horizontal a 320").toBeLessThanOrEqual(0);
  });
}

test("chub phone frames at 1440 (viewport clip)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/chub", { waitUntil: "networkidle" });
  const box = await page.evaluate(() => {
    const el = document.querySelector("[data-phone-frame], [class*='phone']");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top - 80);
    return true;
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: "tests/shots/manual-chub-frames-1440.png" });
  console.log("frame found:", box);
});
