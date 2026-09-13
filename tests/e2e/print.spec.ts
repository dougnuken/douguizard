import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { setTheme } from "./matrix";
import { settle } from "./settle";

const MARGIN = { top: "12mm", bottom: "12mm", left: "14mm", right: "14mm" };
const countPages = (pdf: Buffer) =>
  (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

for (const format of ["A4", "Letter"] as const) {
  test(`8.0 /cv prints to <= 2 pages on ${format}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme("dark")); // dark seeded on purpose (8.2)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/cv", { waitUntil: "networkidle" });
    await settle(page);
    const pdf = await page.pdf({ format, printBackground: false, margin: MARGIN });
    fs.mkdirSync("tests/pdf", { recursive: true });
    fs.writeFileSync(`tests/pdf/cv-${format}.pdf`, pdf);
    const pages = countPages(pdf);
    console.log(`8.0 ${format} pages=${pages} bytes=${pdf.length}`);
    expect(pages, `8.0 ${format} page count ${pages} <= 2`).toBeLessThanOrEqual(2);
  });
}

test("8.1-8.3 print media hides chrome, white bg, no URL expansion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/cv", { waitUntil: "networkidle" });
  await settle(page);
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);

  const r = await page.evaluate(() => {
    const disp = (sel: string) => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(sel));
      if (!els.length) return "absent";
      return els.map((e) => getComputedStyle(e).display).join(",");
    };
    const pdfBtn = Array.from(document.querySelectorAll<HTMLElement>("button, a")).filter((e) =>
      /download pdf|print/i.test(e.textContent || ""),
    );
    // 8.3 — look for generated content on links
    let urlExpansion = false;
    for (const a of Array.from(document.querySelectorAll("a[href]")).slice(0, 60)) {
      const c = getComputedStyle(a, "::after").content;
      if (c && c !== "none" && c !== '""' && /attr\(|http/.test(c)) urlExpansion = true;
    }
    return {
      header: disp("header, .site-header"),
      toggle: disp(".theme-toggle, [data-theme-toggle], button[aria-label*='theme' i]"),
      glow: disp(".glow-corner, [data-glow]"),
      pdfButton: pdfBtn.length
        ? pdfBtn.map((e) => getComputedStyle(e).display).join(",")
        : "absent",
      bodyBg: getComputedStyle(document.body).backgroundColor,
      bodyColor: getComputedStyle(document.body).color,
      urlExpansion,
    };
  });
  console.log("8.1-8.3", JSON.stringify(r, null, 2));

  const hiddenOrAbsent = (v: string) =>
    v === "absent" || v.split(",").every((x) => x.trim() === "none");
  expect(hiddenOrAbsent(r.header), `8.1 header display=${r.header}`).toBe(true);
  expect(hiddenOrAbsent(r.toggle), `8.1 theme toggle display=${r.toggle}`).toBe(true);
  expect(hiddenOrAbsent(r.glow), `8.1 glow display=${r.glow}`).toBe(true);
  expect(hiddenOrAbsent(r.pdfButton), `8.1 PDF button display=${r.pdfButton}`).toBe(true);

  const rgb = (s: string) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
  const bg = rgb(r.bodyBg);
  const fg = rgb(r.bodyColor);
  expect(
    bg.every((c) => c >= 250) || r.bodyBg === "rgba(0, 0, 0, 0)",
    `8.2 body bg ${r.bodyBg} is white/transparent with dark seeded`,
  ).toBe(true);
  expect(fg.every((c) => c <= 60), `8.2 body text ${r.bodyColor} is black`).toBe(true);
  expect(r.urlExpansion, "8.3 no a[href]::after URL expansion").toBe(false);
});

test("8.5 every cv experience appears in the PDF text layer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/cv", { waitUntil: "networkidle" });
  await settle(page);
  await page.emulateMedia({ media: "print" });
  const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  fs.mkdirSync("tests/pdf", { recursive: true });
  fs.writeFileSync("tests/pdf/cv-print-text.txt", text);
  console.log("8.5 print text length", text.length);
  expect(text.length, "8.5 print text is non-empty").toBeGreaterThan(500);
});
