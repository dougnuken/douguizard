import type { Page } from "@playwright/test";

/**
 * Components reveal on IntersectionObserver. Walk the page vertically (F3: the
 * horizontal home shell is gone, so there is no sideways walk) so every observer fires, then wait until no
 * element is left at opacity 0. Returns the ids/classes of anything still
 * invisible so a caller can report it instead of silently accepting a blank.
 */
export async function settle(page: Page, maxMs = 8000): Promise<string[]> {
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const h = document.documentElement.scrollHeight;
    if (h > window.innerHeight + 1) {
      const steps = Math.min(30, Math.ceil(h / (window.innerHeight / 2)));
      for (let i = 0; i <= steps; i++) {
        window.scrollTo(0, (h - window.innerHeight) * (i / steps));
        await sleep(70);
      }
      window.scrollTo(0, 0);
    }
    await sleep(250);
  });

  const deadline = Date.now() + maxMs;
  let invisible: string[] = [];
  while (Date.now() < deadline) {
    invisible = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        if (parseFloat(cs.opacity) > 0.01) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        // deliberately-invisible decoration is allowed
        if (el.getAttribute("aria-hidden") === "true") continue;
        out.push(
          `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${el.className?.toString().slice(0, 60)}`,
        );
      }
      return out.slice(0, 10);
    });
    if (invisible.length === 0) break;
    await page.waitForTimeout(300);
  }
  return invisible;
}
