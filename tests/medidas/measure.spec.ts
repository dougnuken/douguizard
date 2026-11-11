import { test } from "@playwright/test";
import fs from "node:fs";
import { setTheme } from "../e2e/matrix";
import { settle } from "../e2e/settle";

test("M1 phone/browser frame border, radius, shadow on /work/chub @1440", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/chub", { waitUntil: "networkidle" });
  await settle(page);
  const frames = await page.evaluate(() => {
    const out: Record<string, unknown>[] = [];
    const cands = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-phone-frame], [data-browser-frame], [class*='phone'], [class*='frame']",
      ),
    ).slice(0, 14);
    for (const el of cands) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      out.push({
        sel: `${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 70)}`,
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        borderWidth: cs.borderTopWidth,
        borderStyle: cs.borderTopStyle,
        borderColor: cs.borderTopColor,
        radius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        filter: cs.filter,
      });
    }
    return out;
  });
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/frames.json", JSON.stringify(frames, null, 2));
  console.log("M1", JSON.stringify(frames, null, 2));
});

// M2 (geometría del resplandor del héroe viejo) se retira en F3: ese héroe ya
// no existe. M3 (rojos en `/`) se queda como medida informativa.

test("M3 red anywhere on / (both themes)", async ({ page }) => {
  const found: Record<string, unknown>[] = [];
  for (const theme of ["dark", "light"] as const) {
    await page.addInitScript(setTheme(theme));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await settle(page);
    const reds = await page.evaluate(
      (t) => {
        const out: Record<string, unknown>[] = [];
        const isRed = (s: string) => {
          const m = (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
          if (m.length < 3) return false;
          const [r, g, b] = m;
          return r > 120 && r > g * 1.8 && r > b * 1.8;
        };
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *")).slice(0, 3000)) {
          const cs = getComputedStyle(el);
          for (const [prop, v] of [
            ["color", cs.color],
            ["backgroundColor", cs.backgroundColor],
            ["borderTopColor", cs.borderTopColor],
          ] as const) {
            if (isRed(v)) {
              const r = el.getBoundingClientRect();
              if (r.width < 2 || r.height < 2) continue;
              out.push({
                theme: t,
                prop,
                value: v,
                sel: `${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 50)}`,
              });
            }
          }
        }
        return out.slice(0, 10);
      },
      theme,
    );
    found.push(...reds);
  }
  console.log("M3", JSON.stringify(found, null, 2));
  fs.writeFileSync("tests/out/red.json", JSON.stringify(found, null, 2));
});

test("M4 focus ring style", async ({ page }) => {
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement;
    const cs = getComputedStyle(a);
    return {
      el: `${a.tagName.toLowerCase()}[${(a.textContent || "").trim().slice(0, 20)}]`,
      outlineColor: cs.outlineColor,
      outlineWidth: cs.outlineWidth,
      outlineStyle: cs.outlineStyle,
      outlineOffset: cs.outlineOffset,
    };
  });
  console.log("M4", JSON.stringify(ring, null, 2));
  fs.writeFileSync("tests/out/focus-ring.json", JSON.stringify(ring, null, 2));
});
