import { test, expect } from "@playwright/test";

/** DC Medical is the most recent case: first on the home, its two origins under the case hero. */

for (const route of ["/", "/en"]) {
  test(`DC1 ${route}: the first Work row is DC Medical with its capture`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const row = page.locator("#work ul").first().locator("li").first();
    await expect(row.locator('a[href$="/work/dc-medical"]')).toHaveCount(1);
    const img = row.locator("img").first();
    expect(await img.getAttribute("src")).toContain("seguimiento-controles");
    await expect(img).toHaveCount(1);
    expect(((await img.getAttribute("alt")) ?? "").trim().length).toBeGreaterThan(0);
  });
}

const VIEWPORTS = [
  { w: 390, h: 844, both: false },
  { w: 1440, h: 900, both: true },
];

for (const route of ["/work/dc-medical", "/en/work/dc-medical"]) {
  for (const vp of VIEWPORTS) {
    test(`DC2 ${route} @${vp.w}: origin links`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(route, { waitUntil: "networkidle" });
      const site = page.locator('main a[href="https://dcmedicalaesthetics.com/"]');
      const panel = page.locator('main a[href="https://panel.dcmedicalaesthetics.com/login"]');
      for (const l of [site, panel]) {
        await expect(l).toHaveCount(1);
        await expect(l).toHaveAttribute("target", "_blank");
        expect(await l.getAttribute("rel")).toMatch(/noopener/);
        expect(await l.getAttribute("rel")).toMatch(/noreferrer/);
      }
      await expect(site).toBeVisible();
      await page.waitForTimeout(1200); // reveal animation settles
      const bottoms = await page.evaluate(() => {
        const b = (h: string) => document.querySelector(`main a[href="${h}"]`)!.getBoundingClientRect().bottom;
        return {
          site: b("https://dcmedicalaesthetics.com/"),
          panel: b("https://panel.dcmedicalaesthetics.com/login"),
          inner: window.innerHeight,
        };
      });
      expect(bottoms.site).toBeLessThan(bottoms.inner);
      if (vp.both) expect(bottoms.panel).toBeLessThan(bottoms.inner);
    });
  }
  test(`DC3 ${route}: no external link in the colophon`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByText(/Panel en vivo|Live panel/)).toHaveCount(0);
  });
}
