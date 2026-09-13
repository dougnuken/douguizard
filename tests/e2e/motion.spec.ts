import { test, expect } from "@playwright/test";
import { setTheme } from "./matrix";
import { settle } from "./settle";

test("7.1 no running animations on / under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const anims = await page.evaluate(() =>
    document.getAnimations().map((a) => {
      const t = (a.effect as KeyframeEffect | null)?.target as HTMLElement | null;
      return {
        state: a.playState,
        target: t ? `${t.tagName.toLowerCase()}.${t.className?.toString().slice(0, 40)}` : "?",
      };
    }),
  );
  expect(anims, `7.1 ${JSON.stringify(anims, null, 2)}`).toEqual([]);
});

test("7.2 vignettes render final state under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const r = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasNaoweeFive: /\b5\b/.test(text),
      hasNaoweeFour: /\b4\b/.test(text),
      // olbo bars: any element with a non-zero height inside the olbo vignette
      olboBars: Array.from(document.querySelectorAll("[data-vignette='olbo'] *"))
        .map((e) => +(e as HTMLElement).getBoundingClientRect().height.toFixed(1))
        .filter((h) => h > 0).length,
      vignettes: Array.from(document.querySelectorAll("[data-vignette]")).map((e) =>
        e.getAttribute("data-vignette"),
      ),
    };
  });
  console.log("7.2", JSON.stringify(r));
  expect(r.hasNaoweeFive && r.hasNaoweeFour, "7.2 Naowee vignette shows 5 and 4").toBe(true);
});

test("7.5 no transition-duration above 1ms under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const bad = await page.evaluate(() => {
    const out: { sel: string; dur: string }[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *")).slice(0, 4000)) {
      const cs = getComputedStyle(el);
      for (const d of cs.transitionDuration.split(",")) {
        const ms = d.trim().endsWith("ms")
          ? parseFloat(d)
          : parseFloat(d) * 1000;
        if (ms > 1) {
          out.push({
            sel: `${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 40)}`,
            dur: cs.transitionDuration,
          });
          break;
        }
      }
    }
    return out.slice(0, 10);
  });
  expect(bad, `7.5 ${JSON.stringify(bad, null, 2)}`).toEqual([]);
});

test("7.4 case-page reveals render final state immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/olbo", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  // without scrolling, below-the-fold reveal content must already be at opacity 1
  const hidden = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("h2, h3, p"))) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (parseFloat(cs.opacity) < 0.99) {
        out.push(
          `${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 40)} op=${cs.opacity} top=${r.top.toFixed(0)}`,
        );
      }
    }
    return out.slice(0, 12);
  });
  expect(hidden, `7.4 ${JSON.stringify(hidden, null, 2)}`).toEqual([]);
});
