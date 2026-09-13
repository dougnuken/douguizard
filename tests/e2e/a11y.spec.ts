import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { THEMES, ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`axe ${route} ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(setTheme(theme));
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await settle(page);
      const r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const brief = r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
        help: v.help,
      }));
      expect(brief, JSON.stringify(brief, null, 2)).toEqual([]);
    });
  }
}

// 3.1 AAA body contrast
function lum(rgb: number[]) {
  const a = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function ratio(fg: number[], bg: number[]) {
  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
const parse = (s: string) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`3.1 AAA body contrast ${route} ${theme}`, async ({ page }) => {
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
        const ps = Array.from(document.querySelectorAll("p"))
          .filter((p) => (p.textContent || "").trim().length > 40)
          .filter((p) => {
            const r = p.getBoundingClientRect();
            return r.width > 40 && r.height > 8;
          })
          .slice(0, 14);
        return ps.map((p) => ({
          color: getComputedStyle(p).color,
          bg: effBg(p),
          size: getComputedStyle(p).fontSize,
          text: (p.textContent || "").trim().slice(0, 40),
        }));
      });
      expect(samples.length, "found body paragraphs to sample").toBeGreaterThan(0);
      const bad = samples
        .map((s) => ({ ...s, r: +ratio(parse(s.color), parse(s.bg)).toFixed(2) }))
        .filter((s) => s.r < 7);
      expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
    });
  }
}

for (const route of ROUTES) {
  test(`3.2-3.4 structure ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    expect(await page.locator("h1").count(), "3.2 exactly one h1").toBe(1);
    expect(await page.locator("header").count(), "3.4 header").toBe(1);
    expect(await page.locator("main#main").count(), "3.4 main#main").toBe(1);
    expect(await page.locator("footer").count(), "3.4 footer").toBe(1);
  });

  test(`3.5 skip link ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return {
        tag: a.tagName.toLowerCase(),
        href: a.getAttribute("href"),
        visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
      };
    });
    expect(info, "3.5 first tab stop").toMatchObject({ tag: "a", href: "#main", visible: true });
  });

  test(`3.8 zoom meta ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const v = await page.getAttribute('meta[name="viewport"]', "content");
    expect(v || "", "3.8 no user-scalable").not.toMatch(/user-scalable/);
    expect(v || "", "3.8 no maximum-scale").not.toMatch(/maximum-scale/);
  });
}

// 3.6 touch targets at 375
for (const route of ROUTES) {
  test(`3.6 touch targets ${route} @375`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route, { waitUntil: "networkidle" });
    await settle(page);
    const small = await page.evaluate(() => {
      const out: { sel: string; w: number; h: number; text: string }[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("a, button"))) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        // inline links inside running prose are exempt from the 44px rule
        const inProse = !!el.closest("p, li");
        if (inProse) continue;
        if (r.height < 44 || r.width < 44) {
          out.push({
            sel: `${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 40)}`,
            w: +r.width.toFixed(1),
            h: +r.height.toFixed(1),
            text: (el.textContent || "").trim().slice(0, 30),
          });
        }
      }
      return out;
    });
    expect(small, JSON.stringify(small, null, 2)).toEqual([]);
  });
}
