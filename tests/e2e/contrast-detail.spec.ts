import { test } from "@playwright/test";
import fs from "node:fs";
import { THEMES, ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

function lum(rgb: number[]) {
  const a = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
const ratio = (fg: number[], bg: number[]) => {
  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const parse = (s: string) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);

test("contrast detail sweep", async ({ page }) => {
  const rows: Record<string, unknown>[] = [];
  for (const theme of THEMES) {
    for (const route of ROUTES) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(setTheme(theme));
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await settle(page);
      const samples = await page.evaluate(() => {
        const effBg = (el: Element): string => {
          let n: Element | null = el;
          while (n) {
            const c = getComputedStyle(n).backgroundColor;
            if (c && !/rgba?\([^)]*,\s*0\)/.test(c) && c !== "transparent") return c;
            n = n.parentElement;
          }
          return getComputedStyle(document.body).backgroundColor;
        };
        const path = (el: Element) => {
          const parts: string[] = [];
          let n: Element | null = el;
          for (let i = 0; i < 3 && n; i++) {
            parts.unshift(
              `${n.tagName.toLowerCase()}${n.className ? "." + n.className.toString().trim().split(/\s+/).slice(0, 3).join(".") : ""}`,
            );
            n = n.parentElement;
          }
          return parts.join(" > ");
        };
        return Array.from(document.querySelectorAll("p, li, dd, dt, span"))
          .filter((p) => (p.textContent || "").trim().length > 25)
          .filter((p) => !p.querySelector("p, li, span"))
          .filter((p) => {
            const r = p.getBoundingClientRect();
            const cs = getComputedStyle(p);
            return (
              r.width > 30 && r.height > 6 && cs.display !== "none" && cs.visibility !== "hidden"
            );
          })
          .slice(0, 60)
          .map((p) => ({
            color: getComputedStyle(p).color,
            bg: effBg(p),
            size: parseFloat(getComputedStyle(p).fontSize),
            weight: getComputedStyle(p).fontWeight,
            sel: path(p),
            text: (p.textContent || "").trim().slice(0, 55),
          }));
      });
      for (const s of samples) {
        const r = +ratio(parse(s.color), parse(s.bg)).toFixed(2);
        if (r < 7) rows.push({ route, theme, ratio: r, ...s });
      }
    }
  }
  // group
  const byBucket: Record<string, Record<string, unknown>[]> = {};
  for (const r of rows) {
    const k = `${r.color} @${r.size}px ratio=${r.ratio}`;
    (byBucket[k] ||= []).push(r);
  }
  const summary = Object.entries(byBucket).map(([k, v]) => ({
    bucket: k,
    count: v.length,
    routes: [...new Set(v.map((x) => `${x.route}:${x.theme}`))],
    example: v[0],
  }));
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/contrast.json", JSON.stringify(summary, null, 2));
  console.log("CONTRAST SUMMARY", JSON.stringify(summary, null, 2));
});
