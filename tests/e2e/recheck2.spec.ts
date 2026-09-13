import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

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

test("R4b SectionIndex Enter — one page load", async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const hrefs = await page.evaluate(() => [
    ...new Set(
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='#']"))
        .filter((a) => a.getAttribute("href") !== "#main")
        .map((a) => a.getAttribute("href")!),
    ),
  ]);
  const rows: Record<string, unknown>[] = [];
  for (const h of hrefs) {
    await page.locator(`a[href="${h}"]`).first().focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(800);
    rows.push(
      await page.evaluate((href) => {
        const shell = document.querySelector("[data-hshell]")!;
        const a = document.activeElement as HTMLElement | null;
        const target = document.querySelector(href!);
        const panels = Array.from(document.querySelectorAll("[data-panel]"));
        const tp = target?.closest("[data-panel]");
        return {
          href,
          landedIndex: Math.round(shell.scrollLeft / window.innerWidth),
          targetPanelIndex: tp ? panels.indexOf(tp) : -1,
          focusInsidePanel: !!a?.closest("[data-panel]"),
          focusEl:
            (a?.tagName.toLowerCase() || "none") +
            (a?.getAttribute("data-panel") !== null ? "[panel]" : ""),
        };
      }, h),
    );
  }
  fs.writeFileSync("tests/out/sectionindex.json", JSON.stringify(rows, null, 2));
  console.log("R4b", JSON.stringify(rows, null, 2));
  const wrong = rows.filter(
    (r) => (r.targetPanelIndex as number) >= 0 && r.landedIndex !== r.targetPanelIndex,
  );
  expect(wrong, `6.5 did not land on target panel: ${JSON.stringify(wrong)}`).toEqual([]);
  const noFocus = rows.filter((r) => !r.focusInsidePanel);
  expect(noFocus, `6.5 focus not moved into panel: ${JSON.stringify(noFocus)}`).toEqual([]);
});

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
