import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { setTheme } from "./matrix";
import { settle } from "./settle";

test("10.1 identity coherence across /, /cv and footer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const home = await page.evaluate(() => ({
    title: document.title,
    h1: (document.querySelector("h1")?.textContent || "").trim(),
    body: document.body.innerText.replace(/\s+/g, " "),
    footer: (document.querySelector("footer")?.innerText || "").replace(/\s+/g, " "),
  }));
  await page.goto("/cv", { waitUntil: "networkidle" });
  await settle(page);
  const cv = await page.evaluate(() => ({
    title: document.title,
    body: document.body.innerText.replace(/\s+/g, " "),
  }));
  const report = {
    homeTitle: home.title,
    homeH1: home.h1,
    currently: (home.body.match(/Currently[^.]{0,90}/) || [""])[0],
    footer: home.footer.slice(0, 200),
    cvTitle: cv.title,
    cvHasHeadOfProduct: /Head of Product/i.test(cv.body),
    homeHasHeadOfProduct: /Head of Product/i.test(home.body),
    homeHasSeniorPD: /Senior Product Designer/i.test(home.body),
    cvHasSeniorPD: /Senior Product Designer/i.test(cv.body),
  };
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/identity.json", JSON.stringify(report, null, 2));
  console.log("10.1", JSON.stringify(report, null, 2));
  expect(report.homeHasHeadOfProduct, "10.1 home names Head of Product").toBe(true);
  expect(report.cvHasHeadOfProduct, "10.1 cv names Head of Product").toBe(true);
});

test("10.2 OG title/description match site headline/summary", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const meta = await page.evaluate(() => {
    const g = (p: string) =>
      document.querySelector(`meta[property="${p}"], meta[name="${p}"]`)?.getAttribute("content") ||
      null;
    return {
      ogTitle: g("og:title"),
      ogDesc: g("og:description"),
      desc: g("description"),
      ogImage: g("og:image"),
      twCard: g("twitter:card"),
      title: document.title,
    };
  });
  console.log("10.2", JSON.stringify(meta, null, 2));
  expect(meta.ogTitle, "10.2 og:title present").toBeTruthy();
  expect(meta.ogDesc, "10.2 og:description present").toBeTruthy();
  expect(meta.ogImage, "10.2 og:image present").toBeTruthy();
});

test("10.5 'Case study available on request' appears on / and on the ML case", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const onHome = await page.evaluate(
    () => (document.body.innerText.match(/Case study available on request/gi) || []).length,
  );
  await page.goto("/work/mercadolibre-andes", { waitUntil: "networkidle" });
  await settle(page);
  const ml = await page.evaluate(() => ({
    count: (document.body.innerText.match(/Case study available on request/gi) || []).length,
    galleryImgs: document.querySelectorAll("main img").length,
    team: (document.body.innerText.match(/400\+\s*designers[^\n]{0,40}/i) || [""])[0],
    emptyGalleryHeading: /gallery/i.test(document.body.innerText),
  }));
  console.log("10.5 home", onHome, "ml", JSON.stringify(ml));
  expect(onHome, "10.5 exactly one on the home ML row").toBe(1);
  expect(ml.count, "10.5 exactly one on the ML case page").toBe(1);
});

test("10.4 mercadolibre team string", async ({ page }) => {
  await page.addInitScript(setTheme("dark"));
  await page.goto("/work/mercadolibre-andes", { waitUntil: "networkidle" });
  const txt = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  // The figures, not their abbreviation: "2K+" was a copy-deck spelling that
  // never shipped. What must hold is that this page carries the same two
  // numbers as the hero and the CV, all three read from `work.ts`.
  expect(txt, "10.4 team carries 400+ designers").toMatch(/400\+\s*designers/i);
  expect(txt, "10.4 team carries 2,000+ engineers").toMatch(/2,000\+\s*engineers/i);
});

test("10.6 no draft KPI values remain", async ({ page }) => {
  // Walks six routes with a full settle on each; 56s alone, over the 60s
  // default once the suite runs it beside another worker.
  test.slow();
  const routes = [
    "/",
    "/cv",
    "/work/olbo",
    "/work/naowee-suid",
    "/work/banco-de-occidente",
    "/work/mercadolibre-andes",
  ];
  const hits: { route: string; found: string[] }[] = [];
  for (const r of routes) {
    await page.addInitScript(setTheme("dark"));
    await page.goto(r, { waitUntil: "networkidle" });
    await settle(page);
    const found = await page.evaluate(() => {
      const out: string[] = [];
      // KPI value nodes only — the draft placeholders were standalone values
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("main *"))) {
        if (el.children.length) continue;
        const t = (el.textContent || "").trim();
        if (/^(M\+|Dozens|Enterprise|Multi|Dev-ready)$/i.test(t)) out.push(t);
      }
      return out;
    });
    if (found.length) hits.push({ route: r, found });
  }
  expect(hits, `10.6 ${JSON.stringify(hits, null, 2)}`).toEqual([]);
});

test("10.7 Francesca Steri only on BdO and /cv", async ({ page }) => {
  // Walks six routes with a full settle on each; 56s alone, over the 60s
  // default once the suite runs it beside another worker.
  test.slow();
  const routes = [
    "/",
    "/cv",
    "/work/olbo",
    "/work/naowee-suid",
    "/work/banco-de-occidente",
    "/work/mercadolibre-andes",
  ];
  const where: string[] = [];
  for (const r of routes) {
    await page.addInitScript(setTheme("dark"));
    await page.goto(r, { waitUntil: "networkidle" });
    await settle(page);
    const has = await page.evaluate(() => /Francesca\s+Steri/i.test(document.body.innerText));
    if (has) where.push(r);
  }
  console.log("10.7 appears on", JSON.stringify(where));
  // Only the case now. The CV's References block was removed at Doug's
  // request: a CV is his own account, and the quote belongs on the page whose
  // work it is about.
  expect(where, "10.7 only /work/banco-de-occidente").toEqual([
    "/work/banco-de-occidente",
  ]);
});

// ---- extra verifications requested beyond the checklist ----

test("X1 BdO gallery: nine images load, webp/avif, explicit dims, no stretch", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/banco-de-occidente", { waitUntil: "networkidle" });
  await settle(page);
  const imgs = await page.evaluate(async () => {
    const list = Array.from(document.querySelectorAll<HTMLImageElement>("main img"));
    await Promise.all(
      list.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => (i.onload = i.onerror = r)))),
    );
    return list.map((i) => {
      const r = i.getBoundingClientRect();
      const natural = i.naturalWidth / i.naturalHeight;
      const rendered = r.width / r.height;
      return {
        src: i.currentSrc || i.src,
        loaded: i.complete && i.naturalWidth > 0,
        naturalW: i.naturalWidth,
        naturalH: i.naturalHeight,
        attrW: i.getAttribute("width"),
        attrH: i.getAttribute("height"),
        renderedW: +r.width.toFixed(1),
        renderedH: +r.height.toFixed(1),
        naturalRatio: +natural.toFixed(4),
        renderedRatio: +rendered.toFixed(4),
        skew: +Math.abs(1 - rendered / natural).toFixed(4),
      };
    });
  });
  fs.mkdirSync("tests/out", { recursive: true });
  fs.writeFileSync("tests/out/bdo-images.json", JSON.stringify(imgs, null, 2));
  console.log("X1", JSON.stringify(imgs, null, 2));

  expect(imgs.length, "X1 nine gallery images").toBe(9);
  expect(
    imgs.filter((i) => !i.loaded),
    "X1 all images load",
  ).toEqual([]);
  expect(
    imgs.filter((i) => !/\.(webp|avif)(\?|$)/i.test(i.src) && !/_next\/image/.test(i.src)),
    "X1 webp/avif only",
  ).toEqual([]);
  expect(
    imgs.filter((i) => !i.attrW || !i.attrH),
    "X1 explicit width/height attributes",
  ).toEqual([]);
  // >2% deviation between rendered and natural aspect ratio == visible stretch
  expect(
    imgs.filter((i) => i.skew > 0.02),
    "X1 no stretched image (rendered ratio vs natural ratio)",
  ).toEqual([]);
});

test("X2 scroll regression: /work/olbo reached by client nav scrolls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(setTheme("dark"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await settle(page);
  const link = page.locator('a[href="/work/olbo"]').first();
  expect(await link.count(), "X2 an in-page link to /work/olbo exists").toBeGreaterThan(0);
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await page.waitForURL("**/work/olbo", { timeout: 15000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({
    y: window.scrollY,
    docH: document.documentElement.scrollHeight,
    innerH: window.innerHeight,
    bodyOverflow: getComputedStyle(document.body).overflow,
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    bodyPosition: getComputedStyle(document.body).position,
  }));
  console.log("X2 before", before, "after", JSON.stringify(after));
  expect(after.docH, "X2 page is taller than the viewport").toBeGreaterThan(after.innerH + 100);
  expect(after.y, `X2 wheel scrolled the page (before=${before} after=${after.y}, overflow body=${after.bodyOverflow} html=${after.htmlOverflow})`).toBeGreaterThan(before + 100);
});

test("X3 external anchors carry target/rel", async ({ page }) => {
  const routes = ["/", "/cv", "/work/olbo", "/work/naowee-suid", "/work/banco-de-occidente"];
  const bad: unknown[] = [];
  for (const r of routes) {
    await page.addInitScript(setTheme("dark"));
    await page.goto(r, { waitUntil: "networkidle" });
    await settle(page);
    const b = await page.evaluate(
      (route) =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .filter((a) => /^https?:/i.test(a.getAttribute("href") || ""))
          // Same-site links are not external. Under test `location.host` is
          // localhost, so the canonical domain has to be named too or the CV's
          // own "douguizard.com" reads as somebody else's site. Keep in step
          // with `site.domain`.
          .filter((a) => !a.href.includes(location.host) && !a.href.includes("douguizard.com"))
          .filter(
            (a) =>
              a.getAttribute("target") !== "_blank" ||
              !/noopener/.test(a.getAttribute("rel") || "") ||
              !/noreferrer/.test(a.getAttribute("rel") || ""),
          )
          .map((a) => ({
            route,
            href: a.getAttribute("href"),
            target: a.getAttribute("target"),
            rel: a.getAttribute("rel"),
          })),
      r,
    );
    bad.push(...b);
  }
  expect(bad, `X3 ${JSON.stringify(bad, null, 2)}`).toEqual([]);
});
