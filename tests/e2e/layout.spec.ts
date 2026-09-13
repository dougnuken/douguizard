import { test, expect } from "@playwright/test";
import { WIDTHS, THEMES, ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

// 5.1 / 5.2
for (const width of WIDTHS) {
  for (const route of ROUTES) {
    test(`5.1-5.2 overflow ${route} @${width}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(setTheme("dark"));
      await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await settle(page);
      const res = await page.evaluate(() => {
        const over = [] as { sel: string; right: number }[];
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > innerWidth + 1) {
            // allow-list: elements inside a horizontally scrollable container
            let n: HTMLElement | null = el.parentElement;
            let inScroller = false;
            while (n) {
              const c = getComputedStyle(n);
              if (
                (c.overflowX === "auto" || c.overflowX === "scroll" || c.overflowX === "hidden") &&
                n.scrollWidth > n.clientWidth + 1
              ) {
                inScroller = true;
                break;
              }
              if (c.overflowX === "hidden") {
                inScroller = true;
                break;
              }
              n = n.parentElement;
            }
            if (inScroller) continue;
            over.push({
              sel: `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${el.className?.toString().slice(0, 50)}`,
              right: +r.right.toFixed(1),
            });
          }
        }
        return {
          bodyScrollWidth: document.body.scrollWidth,
          innerWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          over: over.slice(0, 8),
        };
      });
      expect(
        res.bodyScrollWidth,
        `5.1 body.scrollWidth ${res.bodyScrollWidth} <= innerWidth ${res.innerWidth}+1`,
      ).toBeLessThanOrEqual(res.innerWidth + 1);
      expect(res.over, `5.2 ${JSON.stringify(res.over, null, 2)}`).toEqual([]);
    });
  }
}

// 5.3 / 5.4 home shell on desktop
for (const theme of THEMES) {
  test(`5.3-5.4 home shell @1440 ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(setTheme(theme));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    const early = await page.evaluate(() => {
      const s = document.querySelector("[data-hshell]");
      return {
        shellWidth: s ? +s.getBoundingClientRect().width.toFixed(1) : -1,
        shellScrollWidth: s ? s.scrollWidth : -1,
        innerWidth: window.innerWidth,
        panels: document.querySelectorAll("[data-panel]").length,
      };
    });
    expect(early.shellWidth, "5.3 shell width >= 1400 at 250ms").toBeGreaterThanOrEqual(1400);
    expect(early.shellScrollWidth, "5.3 scrollWidth === 5 * innerWidth").toBe(
      5 * early.innerWidth,
    );
    expect(early.panels, "5.4 five panels").toBe(5);

    await page.waitForLoadState("networkidle");
    await settle(page);
    const after = await page.evaluate(() => ({
      bodyScrollHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      panels: document.querySelectorAll("[data-panel]").length,
    }));
    expect(
      after.bodyScrollHeight,
      `5.3 page not vertically scrollable: ${after.bodyScrollHeight} <= ${after.innerHeight}+2`,
    ).toBeLessThanOrEqual(after.innerHeight + 2);
    expect(after.panels, "5.4 five panels after settle").toBe(5);
  });
}

// 5.5 sticky eyebrow clears the header
test("5.5 sticky eyebrow clears header on /work/olbo @1440", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/olbo", { waitUntil: "networkidle" });
  await settle(page);
  const info = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const heads = Array.from(document.querySelectorAll<HTMLElement>("h2"));
    // the Process band's sticky eyebrow reads "How it happened" (CaseProcess.tsx:17)
    const proc = heads.find((h) => /how it happened|process/i.test(h.textContent || ""));
    if (!proc) return { found: false as const, all: heads.map((h) => (h.textContent || "").trim()) };
    proc.scrollIntoView({ block: "start", behavior: "auto" });
    await sleep(120);
    window.scrollBy(0, 300);
    await sleep(250);
    const r = proc.getBoundingClientRect();
    return {
      found: true as const,
      top: +r.top.toFixed(1),
      position: getComputedStyle(proc).position,
      text: (proc.textContent || "").trim().slice(0, 40),
    };
  });
  expect(info.found, "5.5 Process h2 exists").toBe(true);
  if (info.found) {
    expect(info.top, `5.5 sticky h2 top ${info.top} >= 64`).toBeGreaterThanOrEqual(64);
  }
});
