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

// 6.2–6.5 · F3: el shell horizontal (flechas, paneles, `SectionIndex`) ya no
// existe; el viejo 6.3 (ArrowDown dentro del panel Work) se retira con él. Los
// reemplazan sus equivalentes en el tablero B (07 F3).
test("6.2 el orden de Tab es el del DOM: K2, K1, K3, K4, K5…", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("#main").focus();
  const orden: string[] = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const k = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      // La envoltura de las losas de caso lleva el área (`k3`…); las demás cards, la propia `.tarjeta`.
      const c = a?.closest(".os .losa-caso") ?? a?.closest(".os .tarjeta");
      if (!c) return null;
      return (c.className.match(/\bk(\d+)\b/) || [])[0] ?? null;
    });
    if (k && orden.at(-1) !== k) orden.push(k);
  }
  const esperado = ["k2", "k1", "k3", "k4", "k5", "k7", "k8", "k9", "k10", "k11", "k12", "k13", "k14", "k15", "k16", "k17"];
  expect(orden.slice(0, esperado.length), JSON.stringify(orden)).toEqual(esperado);
});

test("6.3 Enter en una card navega a su destino", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator(".k4 .bento-capa").focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/work/mercadolibre-andes");
  expect(new URL(page.url()).pathname).toBe("/work/mercadolibre-andes");
});

test("6.4 cada sección del home tiene un tabulable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const r = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("[data-seccion]")).map((s) => ({
      id: s.id,
      tabulables: Array.from(s.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")).filter(
        (e) => e.tabIndex >= 0 && getComputedStyle(e).visibility !== "hidden",
      ).length,
    })),
  );
  expect(r.map((x) => x.id).sort()).toEqual(["about", "contact", "experience", "work"]);
  for (const x of r) expect(x.tabulables, `6.4 ${x.id}`).toBeGreaterThan(0);
});

test("6.5 las pills con Enter llevan el foco a su sección", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  for (const id of ["experience", "about", "work"]) {
    await page.locator(`header nav a.pill[href="#${id}"]`).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({
      foco: document.activeElement?.id,
      hash: location.hash,
      top: document.activeElement?.getBoundingClientRect().top ?? -1,
      ih: innerHeight,
    }));
    expect(r.foco, `6.5 foco en #${id}`).toBe(id);
    expect(r.hash).toBe(`#${id}`);
    expect(r.top, `6.5 #${id} en el viewport`).toBeLessThan(r.ih);
    await expect(page.locator(`header nav a.pill[href="#${id}"]`)).toHaveAttribute("aria-current", "true");
  }
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
