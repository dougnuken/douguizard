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
    // The Decisions band keeps the page's sticky gutter eyebrow: "Key
    // decisions", "Decisiones clave" on the Spanish page this route serves
    // (CaseDecisions.tsx). Process used to be the target, but it is a
    // horizontal timeline now, with its eyebrow on top and nothing to stick.
    const head = heads.find((h) => /key decisions|decisiones clave/i.test(h.textContent || ""));
    if (!head) return { found: false as const, all: heads.map((h) => (h.textContent || "").trim()) };
    head.scrollIntoView({ block: "start", behavior: "auto" });
    await sleep(120);
    // A sticky element travels only within its containing block — here the
    // grid cell beside the decisions list. Scroll 300px past the heading's
    // own position, or as far as that cell allows if the list is shorter,
    // so the reading is taken while the heading is still pinned rather than
    // after the cell has carried it away.
    const cell = head.parentElement!.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(head).top) || 0;
    const travel = cell.height - head.offsetHeight - stickyTop;
    const by = Math.max(0, Math.min(300, Math.floor(travel) - 16));
    window.scrollBy(0, by);
    await sleep(250);
    const r = head.getBoundingClientRect();
    return {
      found: true as const,
      by,
      top: +r.top.toFixed(1),
      // How far the heading sits below its cell's top: positive only if it
      // stuck, since in flow it would sit at the cell's very top.
      pinnedBy: +(r.top - head.parentElement!.getBoundingClientRect().top).toFixed(1),
      headerBottom: +(document.querySelector("header")?.getBoundingClientRect().bottom ?? 0).toFixed(1),
      position: getComputedStyle(head).position,
      text: (head.textContent || "").trim().slice(0, 40),
    };
  });
  expect(info.found, "5.5 Decisions h2 exists").toBe(true);
  if (info.found) {
    expect(info.position, "5.5 Decisions h2 is sticky").toBe("sticky");
    expect(info.by, "5.5 the band leaves room to scroll past the heading").toBeGreaterThan(100);
    expect(info.pinnedBy, "5.5 heading is pinned, not in flow").toBeGreaterThan(0);
    expect(info.top, `5.5 sticky h2 top ${info.top} >= 64`).toBeGreaterThanOrEqual(64);
    expect(info.top, `5.5 sticky h2 top ${info.top} clears the header`).toBeGreaterThanOrEqual(info.headerBottom);
  }
});
