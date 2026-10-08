import { test, expect } from "@playwright/test";
import { EN_ROUTES, ROUTES, setTheme } from "./matrix";
import { settle } from "./settle";

/**
 * Two languages, one site: Spanish at the root, English under /en.
 *
 * What these hold is the contract between the two trees — every page has its
 * twin, the switch always lands on it, and neither language leaks the other's
 * interface words. Layout, contrast and motion are language-blind and run on
 * the Spanish matrix in the other specs.
 */

test("I1 each tree declares its own language in the HTML it serves", async ({ request }) => {
  for (const [routes, lang] of [
    [ROUTES, "es"],
    [EN_ROUTES, "en"],
  ] as const) {
    for (const route of routes) {
      const html = await (await request.get(route)).text();
      expect(html, `I1 ${route}`).toMatch(new RegExp(`<html[^>]*\\blang="${lang}"`));
    }
  }
});

test("I2 the header switch lands on the same page in the other language", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto("/work/dc-medical", { waitUntil: "networkidle" });
  const toEn = page.locator('header a[hreflang="en"]').first();
  await expect(toEn, "I2 the switch offers English").toHaveAttribute("href", "/en/work/dc-medical");
  await toEn.click();
  await page.waitForURL("**/en/work/dc-medical");
  expect(await page.evaluate(() => document.documentElement.lang), "I2 landed in English").toBe("en");

  // And back. The current language is marked, and is not a link.
  await expect(page.locator('header [aria-current="true"]').first()).toContainText("EN");
  const toEs = page.locator('header a[hreflang="es"]').first();
  await expect(toEs).toHaveAttribute("href", "/work/dc-medical");
  await toEs.click();
  await page.waitForURL((u) => u.pathname === "/work/dc-medical");
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("es");
});

test("I3 switching on the home page keeps the panel you are on", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  await page.locator('nav[data-section-index] a[href="#work"]').click();
  await page.waitForTimeout(800);
  await expect(page.locator('header a[hreflang="en"]').first()).toHaveAttribute("href", "/en#work");
});

test("I4 the switch is reachable at every width", async ({ page }) => {
  await page.addInitScript(setTheme("dark"));
  for (const width of [320, 360, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/cv", { waitUntil: "networkidle" });
    const visible = await page.locator('header a[hreflang="en"]:visible').count();
    if (visible === 0) {
      // Only the narrowest phones put it in the menu, one tap away.
      expect(width, `I4 hidden in the header at ${width}`).toBeLessThan(360);
      await page.locator("header button[aria-expanded]").click();
      await expect(page.locator('nav[data-menu] a[hreflang="en"]')).toBeVisible();
    }
    // Whatever the width, the header row never overflows the page.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `I4 horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
  }
});

/** Interface words that must never show up in the other language's pages. */
const EN_WORDS = [
  "Selected work",
  "How it happened",
  "What I did",
  "Key decisions",
  "Next case study",
  "Skip to content",
  "Download PDF",
  "Full CV",
];
const ES_WORDS = [
  "Trabajo seleccionado",
  "Cómo se hizo",
  "Qué hice",
  "Decisiones clave",
  "Siguiente caso",
  "Ir al contenido",
  "Descargar PDF",
  "CV completo",
];

test("I5 neither language leaks the other's interface", async ({ page }) => {
  test.slow();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  for (const [routes, foreign] of [
    [["/", "/cv", "/work/dc-medical", "/work/olbo"], EN_WORDS],
    [["/en", "/en/cv", "/en/work/dc-medical", "/en/work/olbo"], ES_WORDS],
  ] as const) {
    for (const route of routes) {
      await page.goto(route, { waitUntil: "networkidle" });
      const text = await page.evaluate(() => document.body.innerText);
      const leaks = foreign.filter((w) => text.toLowerCase().includes(w.toLowerCase()));
      expect(leaks, `I5 ${route}`).toEqual([]);
    }
  }
});

test("I6 each CV hands out the sheet in its own language", async ({ page, request }) => {
  for (const [route, pdf] of [
    ["/cv", "/cv/doug-vargas-cv-es.pdf"],
    ["/en/cv", "/cv/doug-vargas-cv.pdf"],
  ] as const) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator(`a[href="${pdf}"]`).first(), `I6 ${route}`).toBeVisible();
    const res = await request.get(pdf);
    expect(res.status(), `I6 ${pdf}`).toBe(200);
    expect(res.headers()["content-type"], `I6 ${pdf}`).toContain("pdf");
  }
});

test("I7 a quote stays in the words it was given, and says so", async ({ page }) => {
  await page.goto("/work/banco-de-occidente", { waitUntil: "networkidle" });
  const quote = page.locator("blockquote").first();
  await expect(quote).toHaveAttribute("lang", "en");
  await expect(page.getByText("Cita original en inglés")).toBeVisible();
});
