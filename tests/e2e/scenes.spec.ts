import { test, expect } from "@playwright/test";
import { setTheme } from "./matrix";

const ROUTES = ["/work/dc-medical", "/en/work/dc-medical"];
const HEADING = /^(Product in context|El producto en contexto)$/;

for (const theme of ["dark", "light"] as const) {
  for (const route of ROUTES) {
    for (const w of [390, 1440]) {
      test(`scenes ${route} ${theme} @${w}`, async ({ page }) => {
        await page.addInitScript(setTheme(theme));
        await page.setViewportSize({ width: w, height: 900 });
        await page.goto(route, { waitUntil: "networkidle" });

        // Fixtures never reach the page.
        const html = await page.content();
        expect(html).not.toContain("_fixture");
        expect(html).not.toContain("/scenes/_");

        const imgs = page.locator('main figure img[src*="scenes"], main figure img[src*="%2Fscenes%2F"]');
        const n = await imgs.count();
        if (n === 0) {
          await expect(page.getByRole("heading", { name: HEADING })).toHaveCount(0);
        } else {
          for (let i = 0; i < n; i++) {
            const img = imgs.nth(i);
            await img.scrollIntoViewIfNeeded();
            expect(((await img.getAttribute("alt")) ?? "").trim().length).toBeGreaterThan(0);
            expect(await img.getAttribute("width")).toBeTruthy();
            expect(await img.getAttribute("height")).toBeTruthy();
            await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
            // The card holds the image inside the band.
            const card = await img.locator("xpath=..").boundingBox();
            expect(card!.x).toBeGreaterThanOrEqual(0);
            expect(card!.x + card!.width).toBeLessThanOrEqual(w + 0.5);
          }
          // The hero scene is the first image after the h1.
          const firstAfterH1 = await page.evaluate(() => {
            const h1 = document.querySelector("main h1")!;
            const all = [...document.querySelectorAll("main img")];
            return all.find((i) => h1.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_FOLLOWING)?.getAttribute("src") ?? "";
          });
          expect(decodeURIComponent(firstAfterH1)).toContain("/scenes/");
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
        expect(overflow).toBe(true);
      });
    }
  }
}
