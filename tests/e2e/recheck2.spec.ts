import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { ROUTES, setTheme } from "./matrix";

test("R2b skip link geometry AFTER the focus transition settles", async ({ page }) => {
  const rows: Record<string, unknown>[] = [];
  for (const route of ROUTES) {
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    await page.waitForTimeout(800); // let any focus transition finish
    rows.push(
      await page.evaluate((r) => {
        const a = document.activeElement as HTMLElement;
        const rect = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        return {
          route: r,
          href: a.getAttribute("href"),
          cls: a.className?.toString().slice(0, 30),
          top: +rect.top.toFixed(1),
          bottom: +rect.bottom.toFixed(1),
          h: +rect.height.toFixed(1),
          fullyInViewport: rect.top >= 0 && rect.bottom <= innerHeight,
          transform: cs.transform,
          transitionDuration: cs.transitionDuration,
        };
      }, route),
    );
  }
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/skiplink2.json", JSON.stringify(rows, null, 2));
  console.log("R2b", JSON.stringify(rows, null, 2));
  const hidden = rows.filter((r) => !r.fullyInViewport);
  expect(hidden, `3.5 skip link not visible on focus: ${JSON.stringify(hidden, null, 2)}`).toEqual(
    [],
  );
});

// R4b (Enter en `SectionIndex`, una sola carga) se retira en F3 con el shell:
// lo cubre `keyboard 6.5` (las pills con Enter llevan el foco a su sección).

test("R6 /cv footer presence", async ({ page }) => {
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/cv", { waitUntil: "networkidle" });
  const r = await page.evaluate(() => ({
    footers: Array.from(document.querySelectorAll("footer")).map((f) => ({
      cls: f.className?.toString().slice(0, 40),
      text: (f.textContent || "").trim().slice(0, 60),
    })),
    contentinfo: document.querySelectorAll("[role='contentinfo']").length,
    lastMainChild: (document.querySelector("main#main")?.lastElementChild?.tagName || "").toLowerCase(),
  }));
  console.log("R6", JSON.stringify(r, null, 2));
  fs.writeFileSync("tests/out/cv-footer.json", JSON.stringify(r, null, 2));
});
