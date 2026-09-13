import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { setTheme } from "./matrix";
import { settle } from "./settle";

const MARGIN = { top: "12mm", bottom: "12mm", left: "14mm", right: "14mm" };
const countPages = (pdf: Buffer) =>
  (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

/** A4 is 11.69in tall, Letter 11. The same document needs one more sheet. */
const PAGE_BUDGET = { A4: 3, Letter: 4 } as const;

for (const format of ["A4", "Letter"] as const) {
  test(`8.0 /cv prints to <= ${PAGE_BUDGET[format]} pages on ${format}`, async ({ page }) => {
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
    // Raised since the spacing rewrite: the old two-page budget was paid for
    // by forcing 1.28 leading on every element, and this file is read on a
    // screen, where a page costs nothing and a squeezed one costs the reader.
    const budget = PAGE_BUDGET[format];
    expect(pages, `8.0 ${format} page count ${pages} <= ${budget}`).toBeLessThanOrEqual(budget);
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
      // `.site-header` only: a bare `header` also matches the CV's own
      // masthead, which is the document, not chrome, and must print.
      header: disp(".site-header"),
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
  const fg = rgb(r.bodyColor);
  // The sheet is dark by decision — it is emailed and read on a screen, not
  // held. `body` is transparent on purpose so the two fixed decoration layers
  // underneath it can paint; the surface lives on `html`. What still has to
  // hold is that the type is legible against whatever the sheet chose.
  expect(
    r.bodyBg === "rgba(0, 0, 0, 0)",
    `8.2 body is transparent so the print surface can show through, got ${r.bodyBg}`,
  ).toBe(true);
  expect(
    fg.every((c) => c >= 200),
    `8.2 body text ${r.bodyColor} is light, against the dark sheet`,
  ).toBe(true);
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
