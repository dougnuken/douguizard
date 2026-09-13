import { test } from "@playwright/test";
import { setTheme } from "./matrix";

for (const theme of ["dark", "light"] as const) {
  test(`hero at 320 ${theme} (viewport only)`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme(theme));
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `tests/shots/manual-hero-320-${theme}.png` });
  });
}

test("olbo phone frames at 1440 (viewport clip)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/olbo", { waitUntil: "networkidle" });
  const box = await page.evaluate(() => {
    const el = document.querySelector("[data-phone-frame], [class*='phone']");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top - 80);
    return true;
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: "tests/shots/manual-olbo-frames-1440.png" });
  console.log("frame found:", box);
});
