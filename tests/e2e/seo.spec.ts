import { test, expect } from "@playwright/test";
import { EN_ROUTES, ROUTES } from "./matrix";
import { caseStudies } from "../../src/data/work";

const ORIGIN = "https://douguizard.com";

/** What a search result can actually show before it truncates. */
const TITLE_MAX = 75;
const DESC_MIN = 70;
const DESC_MAX = 175;

const head = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const attr = (sel: string, name = "content") =>
      document.querySelector(sel)?.getAttribute(name) ?? null;
    return {
      title: document.title,
      description: attr('meta[name="description"]'),
      canonical: attr('link[rel="canonical"]', "href"),
      alternates: Object.fromEntries(
        Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((l) => [
          l.getAttribute("hreflang"),
          l.getAttribute("href"),
        ]),
      ),
      ogTitle: attr('meta[property="og:title"]'),
      ogDescription: attr('meta[property="og:description"]'),
      ogImage: attr('meta[property="og:image"]'),
      ogUrl: attr('meta[property="og:url"]'),
      twitterCard: attr('meta[name="twitter:card"]'),
      robots: attr('meta[name="robots"]'),
      lang: document.documentElement.lang,
      h1: Array.from(document.querySelectorAll("h1")).map((h) => h.textContent?.trim() ?? ""),
      jsonLd: Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      ).map((s) => s.textContent ?? ""),
    };
  });

/** "/work/olbo" → its Spanish and English addresses on the production origin. */
const pair = (route: string) => {
  const path = route.startsWith("/en") ? route.slice(3) || "/" : route;
  const abs = (p: string) => (p === "/" ? ORIGIN : `${ORIGIN}${p}`);
  return { es: abs(path), en: abs(path === "/" ? "/en" : `/en${path}`) };
};

for (const route of [...ROUTES, ...EN_ROUTES]) {
  const lang = route.startsWith("/en") ? "en" : "es";
  test(`E1 head is complete and honest on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const m = await head(page);
    const problems: string[] = [];

    if (!m.title) problems.push("no <title>");
    else if (m.title.length > TITLE_MAX)
      problems.push(`title ${m.title.length} chars (> ${TITLE_MAX}): ${m.title}`);

    if (!m.description) problems.push("no meta description");
    else if (m.description.length < DESC_MIN || m.description.length > DESC_MAX)
      problems.push(`description ${m.description.length} chars: ${m.description}`);

    // Absolute and pointing at the production origin, not at localhost —
    // a relative or host-local canonical is worse than none. The root's is the
    // bare origin, with no trailing slash: that is what `metadataBase` resolves
    // `"/"` to, and the two forms address the same document.
    const expected = route === "/" ? ORIGIN : `${ORIGIN}${route}`;
    if (m.canonical !== expected) problems.push(`canonical ${m.canonical} ≠ ${expected}`);

    // The page names its twin in the other language, and Spanish as the
    // default for everyone else — the same three on both sides of the pair.
    const twins = pair(route);
    const want = { es: twins.es, en: twins.en, "x-default": twins.es };
    for (const [hreflang, href] of Object.entries(want)) {
      if (m.alternates[hreflang] !== href)
        problems.push(`hreflang ${hreflang} = ${m.alternates[hreflang]} ≠ ${href}`);
    }

    for (const [name, value] of Object.entries({
      "og:title": m.ogTitle,
      "og:description": m.ogDescription,
      "og:image": m.ogImage,
      "twitter:card": m.twitterCard,
    })) {
      if (!value) problems.push(`no ${name}`);
    }
    if (m.ogImage && !m.ogImage.startsWith("http"))
      problems.push(`og:image is not absolute: ${m.ogImage}`);

    if (m.lang !== lang) problems.push(`html lang = ${m.lang}, expected ${lang}`);
    if (m.h1.length !== 1) problems.push(`${m.h1.length} <h1>: ${JSON.stringify(m.h1)}`);

    expect(problems, `E1 ${route}\n  ${problems.join("\n  ")}`).toEqual([]);
  });
}

test("E2 structured data parses and says what it should", async ({ page }) => {
  const readTypes = async (route: string) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const { jsonLd } = await head(page);
    return jsonLd.flatMap((raw) => {
      // A block that does not parse is worse than no block: Google drops the
      // whole page's structured data rather than the broken node.
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const graph = (parsed["@graph"] as Record<string, unknown>[] | undefined) ?? [parsed];
      return graph.map((node) => String(node["@type"]));
    });
  };

  expect(await readTypes("/"), "E2 home").toContain("Person");

  const cv = await readTypes("/cv");
  expect(cv, "E2 /cv Person").toContain("Person");
  expect(cv, "E2 /cv ProfilePage").toContain("ProfilePage");

  expect(await readTypes("/work/olbo"), "E2 case breadcrumb").toContain("BreadcrumbList");

  expect(await readTypes("/en"), "E2 /en").toContain("Person");
  expect(await readTypes("/en/cv"), "E2 /en/cv ProfilePage").toContain("ProfilePage");
  expect(await readTypes("/en/work/olbo"), "E2 /en case breadcrumb").toContain("BreadcrumbList");
});

test("E3 sitemap lists every indexable URL and nothing else", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status(), "E3 sitemap status").toBe(200);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const expected = [
    ORIGIN,
    `${ORIGIN}/en`,
    `${ORIGIN}/cv`,
    `${ORIGIN}/en/cv`,
    ...caseStudies.flatMap((c) => [`${ORIGIN}/work/${c.slug}`, `${ORIGIN}/en/work/${c.slug}`]),
  ];
  expect(urls.slice().sort(), `E3 sitemap:\n${urls.join("\n")}`).toEqual(expected.slice().sort());
});

test("E4 robots.txt opens the door and points at the map", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status(), "E4 robots status").toBe(200);
  const body = await res.text();
  expect(body, "E4 allows crawling").toMatch(/Allow:\s*\//);
  expect(body, "E4 names the sitemap").toContain(`${ORIGIN}/sitemap.xml`);
  expect(body, "E4 must not disallow everything").not.toMatch(/Disallow:\s*\/\s*$/m);
});

test("E5 a URL that does not exist says so", async ({ page }) => {
  const res = await page.goto("/this-page-was-never-here", { waitUntil: "networkidle" });
  expect(res?.status(), "E5 status").toBe(404);
  // A 404 that returns 200 is a soft 404, and Google indexes those.
  const m = await head(page);
  expect(m.robots ?? "", "E5 noindex").toContain("noindex");
  expect(m.h1.length, "E5 has one heading").toBe(1);

  const bogusCase = await page.goto("/work/not-a-case", { waitUntil: "networkidle" });
  expect(bogusCase?.status(), "E5 unknown case status").toBe(404);

  // The English tree 404s the same way, a case and an address alike.
  const bogusEnCase = await page.goto("/en/work/not-a-case", { waitUntil: "networkidle" });
  expect(bogusEnCase?.status(), "E5 unknown /en case status").toBe(404);
  const bogusEn = await page.goto("/en/this-page-was-never-here", { waitUntil: "networkidle" });
  expect(bogusEn?.status(), "E5 unknown /en address status").toBe(404);
});
