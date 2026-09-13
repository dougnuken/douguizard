import { test, expect } from "@playwright/test";
import { setTheme } from "./matrix";
import { settle } from "./settle";

const desc = async (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a) return "none";
    return `${a.tagName.toLowerCase()}${a.id ? "#" + a.id : ""}[${a.getAttribute("href") || a.getAttribute("aria-label") || (a.textContent || "").trim().slice(0, 24)}]`;
  });

test("6.1 tab order from load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const order: string[] = [];
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    order.push(await desc(page));
  }
  console.log("6.1 TAB ORDER:", JSON.stringify(order, null, 2));
  expect(order[0], "6.1 first stop is the skip link").toContain("#main");
});

test("6.2 arrow/Home/End/PageDown navigation @1440", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const shell = page.locator("[data-hshell]");
  await shell.focus();
  const idx = () =>
    page.evaluate(() => {
      const s = document.querySelector("[data-hshell]")!;
      return Math.round(s.scrollLeft / window.innerWidth);
    });
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(220);
  }
  expect(await idx(), "6.2 four ArrowRight -> panel 04").toBe(4);
  await page.keyboard.press("Home");
  await page.waitForTimeout(260);
  expect(await idx(), "6.2 Home -> 00").toBe(0);
  await page.keyboard.press("End");
  await page.waitForTimeout(260);
  expect(await idx(), "6.2 End -> 04").toBe(4);
  await page.keyboard.press("Home");
  await page.waitForTimeout(260);
  await page.keyboard.press("PageDown");
  await page.waitForTimeout(260);
  expect(await idx(), "6.2 PageDown -> 01").toBe(1);
  await page.keyboard.press("PageUp");
  await page.waitForTimeout(260);
  expect(await idx(), "6.2 PageUp -> 00").toBe(0);
});

test("6.3 ArrowDown inside Work panel scrolls panel, not shell", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const r = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const shell = document.querySelector<HTMLElement>("[data-hshell]")!;
    const panels = Array.from(document.querySelectorAll<HTMLElement>("[data-panel]"));
    const work = panels.find((p) => /work/i.test(p.getAttribute("data-panel") || "")) || panels[1];
    shell.scrollLeft = work.offsetLeft;
    await sleep(300);
    const beforeLeft = shell.scrollLeft;
    const scroller =
      work.scrollHeight > work.clientHeight + 1
        ? work
        : work.querySelector<HTMLElement>("*:not(script)") || work;
    const target =
      work.scrollHeight > work.clientHeight + 1
        ? work
        : (Array.from(work.querySelectorAll<HTMLElement>("*")).find(
            (e) => e.scrollHeight > e.clientHeight + 1,
          ) ?? work);
    const beforeTop = target.scrollTop;
    target.focus?.();
    target.scrollTop = beforeTop + 200;
    await sleep(250);
    return {
      beforeLeft,
      afterLeft: shell.scrollLeft,
      beforeTop,
      afterTop: target.scrollTop,
      scrollable: target.scrollHeight > target.clientHeight + 1,
      tag: scroller.tagName,
    };
  });
  console.log("6.3", JSON.stringify(r));
  expect(r.afterLeft, "6.3 shell scrollLeft unchanged while panel scrolls").toBe(r.beforeLeft);
});

test("6.4 every panel has a tabbable element", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const counts = await page.evaluate(() =>
    // The panel counts itself. Since the F-1 fix each panel wrapper carries
    // tabindex="0", which is what makes a text-only panel like Craft — no
    // links, no buttons — reachable and scrollable from the keyboard at all.
    Array.from(document.querySelectorAll("[data-panel]")).map((p) => ({
      panel: p.getAttribute("data-panel"),
      tabbable:
        (p.matches("[tabindex='0']") ? 1 : 0) +
        p.querySelectorAll("a,button,[tabindex='0'],input,select,textarea").length,
    })),
  );
  const empty = counts.filter((c) => c.tabbable === 0);
  expect(empty, JSON.stringify(counts, null, 2)).toEqual([]);
});

test("6.5 SectionIndex Enter scrolls and moves focus into panel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  // Exactly the rail. `aria-label*='Section' i` also matched the header's own
  // nav, whose label is "Sections", so this test was pressing Enter on a
  // header link and then asserting the rail's panel index.
  const links = page.locator('nav[aria-label="Section index"] a');
  const n = await links.count();
  expect(n, "6.5 section index links found").toBeGreaterThan(1);
  await links.nth(2).focus();
  const targetHash = await links.nth(2).getAttribute("href");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    const panel = a?.closest("[data-panel]");
    const shell = document.querySelector("[data-hshell]")!;
    return {
      active: a ? a.tagName.toLowerCase() + (a.getAttribute("href") || "") : "none",
      panel: panel ? panel.getAttribute("data-panel") : null,
      index: Math.round(shell.scrollLeft / window.innerWidth),
    };
  });
  console.log("6.5", JSON.stringify(r), "target", targetHash);
  expect(r.index, "6.5 scrolled to panel 2").toBe(2);
  expect(r.panel, "6.5 focus moved inside the target panel").not.toBeNull();
});

test("6.6 mobile menu Escape @375", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const toggle = page
    .locator(
      "header button[aria-expanded], header button[aria-controls], button[aria-label*='menu' i]",
    )
    .first();
  const exists = (await toggle.count()) > 0;
  expect(exists, "6.6 a mobile menu toggle exists at 375").toBe(true);
  await toggle.click();
  await page.waitForTimeout(350);
  const opened = await page.evaluate(() => {
    const b = document.querySelector("header button[aria-expanded]");
    return b?.getAttribute("aria-expanded");
  });
  expect(opened, "6.6 menu reports expanded").toBe("true");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  const after = await page.evaluate(() => {
    const b = document.querySelector("header button[aria-expanded]") as HTMLElement | null;
    const id = b?.getAttribute("aria-controls");
    const panel = id ? document.getElementById(id) : null;
    return {
      expanded: b?.getAttribute("aria-expanded"),
      focusIsToggle: document.activeElement === b,
      hiddenAttr: panel ? panel.hasAttribute("hidden") : null,
      tabbables: panel
        ? panel.querySelectorAll("a,button,[tabindex='0'],input,select,textarea").length
        : null,
    };
  });
  console.log("6.6", JSON.stringify(after));
  expect(after.expanded, "6.6 Escape collapses").toBe("false");
  expect(after.focusIsToggle, "6.6 focus returns to toggle").toBe(true);
});
