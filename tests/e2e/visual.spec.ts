import { test } from "@playwright/test";
import { WIDTHS, THEMES, ROUTES, setTheme, slugify } from "./matrix";
import { settle } from "./settle";

const OUT = "tests/shots";

/**
 * 60-shot visual matrix. There is no committed baseline on this branch, so this
 * spec CAPTURES the matrix as artifacts for review rather than diffing against
 * snapshots that do not exist. Structural assertions live in layout.spec.ts.
 */
for (const theme of THEMES) {
  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      test(`shot ${route} ${width} ${theme}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.addInitScript(setTheme(theme));
        await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
        await page.goto(route, { waitUntil: "networkidle" });
        await settle(page);
        await page.screenshot({
          path: `${OUT}/${slugify(route)}-${width}-${theme}.png`,
          fullPage: true,
        });
      });
    }
  }
}
