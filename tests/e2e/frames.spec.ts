import { test } from "@playwright/test";
import fs from "node:fs";
import { setTheme } from "./matrix";
import { settle } from "./settle";

test("F1 device frame geometry on /work/olbo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/olbo", { waitUntil: "networkidle" });
  await settle(page);
  const frames = await page.evaluate(() => {
    // a device frame = an element with a 1px border wrapping an <img> or <video>
    const out: Record<string, unknown>[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("div, figure"))) {
      if (!el.querySelector("img, video")) continue;
      const cs = getComputedStyle(el);
      if (cs.borderTopStyle === "none" || parseFloat(cs.borderTopWidth) === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 100 || r.height < 100) continue;
      out.push({
        w: +r.width.toFixed(0),
        h: +r.height.toFixed(0),
        borderWidth: cs.borderTopWidth,
        borderColor: cs.borderTopColor,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        filter: cs.filter,
        cls: el.className?.toString().slice(0, 60),
      });
    }
    return out.slice(0, 12);
  });
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/frames.json", JSON.stringify(frames, null, 2));
  console.log("F1", JSON.stringify(frames, null, 2));

  // scroll the phone gallery into view and shoot it
  await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLElement>("img"));
    const phone = imgs.find((i) => {
      const r = i.getBoundingClientRect();
      return r.height > r.width * 1.5;
    });
    if (phone) phone.scrollIntoView({ block: "center", behavior: "auto" });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: "tests/shots/manual-olbo-frames-1440.png" });
});

test("F2 wordmark strip wrapping at 320", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const r = await page.evaluate(() => {
    const marks = Array.from(document.querySelectorAll<HTMLElement>("*")).filter((e) =>
      /^NAOWEE$/i.test((e.textContent || "").trim()),
    );
    const el = marks[0];
    if (!el) return { found: false };
    const strip = el.parentElement!;
    const kids = Array.from(strip.children).map((c) => {
      const b = c.getBoundingClientRect();
      return { t: (c.textContent || "").trim().slice(0, 22), top: +b.top.toFixed(0), right: +b.right.toFixed(0) };
    });
    const rows = new Set(kids.map((k) => k.top)).size;
    return {
      found: true,
      rows,
      maxRight: Math.max(...kids.map((k) => k.right)),
      innerWidth: window.innerWidth,
      overflowing: kids.filter((k) => k.right > window.innerWidth + 1),
      kids,
    };
  });
  console.log("F2", JSON.stringify(r, null, 2));
  fs.writeFileSync("tests/out/wordmarks-320.json", JSON.stringify(r, null, 2));
});

test("F3 brand wordmark truncation in the header", async ({ page }) => {
  const rows: Record<string, unknown>[] = [];
  for (const w of [320, 375, 768, 1440]) {
    await page.addInitScript(setTheme("dark"));
    await page.setViewportSize({ width: w, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    rows.push(
      await page.evaluate((width) => {
        const a = Array.from(document.querySelectorAll<HTMLElement>("header a")).find((x) =>
          /Douguizard/i.test(x.textContent || ""),
        );
        if (!a) return { width, found: false };
        return {
          width,
          found: true,
          text: (a.textContent || "").trim(),
          clientWidth: a.clientWidth,
          scrollWidth: a.scrollWidth,
          truncated: a.scrollWidth > a.clientWidth + 1,
          overflow: getComputedStyle(a).textOverflow,
        };
      }, w),
    );
  }
  console.log("F3", JSON.stringify(rows, null, 2));
  fs.writeFileSync("tests/out/brand-truncation.json", JSON.stringify(rows, null, 2));
});
