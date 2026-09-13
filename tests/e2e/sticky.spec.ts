import { test } from "@playwright/test";
import fs from "node:fs";
import { setTheme } from "./matrix";
import { settle } from "./settle";

test("S1 sticky eyebrow behaviour through its whole band", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/olbo", { waitUntil: "networkidle" });
  await settle(page);

  const info = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const h2 = Array.from(document.querySelectorAll<HTMLElement>("h2")).find((h) =>
      /how it happened/i.test(h.textContent || ""),
    );
    if (!h2) return { found: false as const };
    const cs = getComputedStyle(h2);
    const parent = h2.parentElement!;
    const grandparent = parent.parentElement!;
    const headerH = getComputedStyle(document.documentElement).getPropertyValue("--header-h");

    // absolute document position of the band
    const docTop = h2.getBoundingClientRect().top + window.scrollY;
    const band = grandparent.getBoundingClientRect();
    const bandTop = band.top + window.scrollY;
    const bandH = band.height;

    // sample the h2's viewport top as we scroll through the band
    const samples: { scrollY: number; top: number }[] = [];
    for (const frac of [0, 0.15, 0.3, 0.5, 0.7, 0.9]) {
      window.scrollTo(0, bandTop - 100 + bandH * frac);
      await sleep(160);
      samples.push({
        scrollY: Math.round(window.scrollY),
        top: +h2.getBoundingClientRect().top.toFixed(1),
      });
    }
    return {
      found: true as const,
      position: cs.position,
      cssTop: cs.top,
      headerH: headerH.trim(),
      parentTag: parent.tagName.toLowerCase(),
      parentH: +parent.getBoundingClientRect().height.toFixed(0),
      grandparentTag: grandparent.tagName.toLowerCase(),
      bandH: +bandH.toFixed(0),
      h2DocTop: Math.round(docTop),
      samples,
      minTop: Math.min(...samples.map((s) => s.top)),
    };
  });
  console.log("S1", JSON.stringify(info, null, 2));
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/sticky.json", JSON.stringify(info, null, 2));
});
