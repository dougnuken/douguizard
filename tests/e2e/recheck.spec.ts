import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

// 3.4 as LANDMARKS (a <header> nested in article/section is not a banner landmark)
test("R1 landmark counts per route", async ({ page }) => {
  const rows: Record<string, unknown>[] = [];
  for (const route of ROUTES) {
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    rows.push(
      await page.evaluate(
        (r) => ({
          route: r,
          headerTags: document.querySelectorAll("header").length,
          bannerLandmarks: document.querySelectorAll(
            "body > header, body > div > header, header[role='banner']",
          ).length,
          mainMain: document.querySelectorAll("main#main").length,
          footerTags: document.querySelectorAll("footer").length,
          contentinfoLandmarks: document.querySelectorAll(
            "body > footer, body > div > footer, footer[role='contentinfo']",
          ).length,
          h1: document.querySelectorAll("h1").length,
        }),
        route,
      ),
    );
  }
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/landmarks.json", JSON.stringify(rows, null, 2));
  console.log("R1", JSON.stringify(rows, null, 2));
});

// 3.5 skip-link visibility on focus, per route
test("R2 skip link geometry on focus", async ({ page }) => {
  const rows: Record<string, unknown>[] = [];
  for (const route of ROUTES) {
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    rows.push(
      await page.evaluate((r) => {
        const a = document.activeElement as HTMLElement;
        const rect = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        return {
          route: r,
          href: a.getAttribute("href"),
          cls: a.className?.toString().slice(0, 40),
          top: +rect.top.toFixed(1),
          left: +rect.left.toFixed(1),
          w: +rect.width.toFixed(1),
          h: +rect.height.toFixed(1),
          inViewport: rect.top >= 0 && rect.bottom <= innerHeight,
          opacity: cs.opacity,
          transform: cs.transform,
          position: cs.position,
        };
      }, route),
    );
  }
  fs.writeFileSync("tests/out/skiplink.json", JSON.stringify(rows, null, 2));
  console.log("R2", JSON.stringify(rows, null, 2));
});

// 8.1 corrected: distinguish the SITE header from the CV document header
test("R3 print: site chrome hidden, CV header kept", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/cv", { waitUntil: "networkidle" });
  await settle(page);
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("header")).map((h) => ({
      cls: h.className?.toString().slice(0, 50),
      parent: h.parentElement?.tagName.toLowerCase(),
      display: getComputedStyle(h).display,
      text: (h.textContent || "").trim().slice(0, 40),
    }));
    const siteHeader = document.querySelector<HTMLElement>(
      ".site-header, body > header, body > div > header",
    );
    const toggles = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".theme-toggle, [data-theme-toggle], button[aria-label*='theme' i]",
      ),
    ).map((e) => getComputedStyle(e).display);
    const glow = Array.from(
      document.querySelectorAll<HTMLElement>(".glow-corner, [data-glow], [class*='glow']"),
    ).map((e) => getComputedStyle(e).display);
    const pdfBtn = Array.from(document.querySelectorAll<HTMLElement>("button, a"))
      .filter((e) => /download pdf|descargar pdf|print/i.test(e.textContent || ""))
      .map((e) => getComputedStyle(e).display);
    return {
      headers: all,
      siteHeaderDisplay: siteHeader ? getComputedStyle(siteHeader).display : "absent",
      toggles,
      glow,
      pdfBtn,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyColor: getComputedStyle(document.body).color,
    };
  });
  fs.writeFileSync("tests/out/print.json", JSON.stringify(r, null, 2));
  console.log("R3", JSON.stringify(r, null, 2));
  const allNone = (a: string[]) => a.length === 0 || a.every((x) => x === "none");
  expect(r.siteHeaderDisplay, "8.1 site header hidden in print").toBe("none");
  expect(allNone(r.toggles), `8.1 theme toggle ${JSON.stringify(r.toggles)}`).toBe(true);
  expect(allNone(r.glow), `8.1 glow ${JSON.stringify(r.glow)}`).toBe(true);
  expect(allNone(r.pdfBtn), `8.1 pdf button ${JSON.stringify(r.pdfBtn)}`).toBe(true);
});

// R4 (los enlaces de `SectionIndex` caen en su panel) y R5 (panel inalcanzable
// por teclado) se retiran en F3 con el shell horizontal: no hay paneles ni
// `SectionIndex`. Los cubren `keyboard 6.2–6.5` (orden de Tab, Enter en card,
// tabulable por sección, pills que llevan el foco).
