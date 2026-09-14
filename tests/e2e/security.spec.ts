import { test, expect } from "@playwright/test";
import { ROUTES } from "./matrix";

/**
 * The response headers are configured in `next.config.ts` rather than at the
 * host precisely so this file can see them: `next start` serves them, so every
 * run checks them. Headers that live only in a hosting dashboard drift the
 * moment nobody is looking.
 */

const REQUIRED: Record<string, RegExp> = {
  "content-security-policy": /default-src 'self'/,
  "strict-transport-security": /^max-age=63072000; includeSubDomains; preload$/,
  "x-content-type-options": /^nosniff$/,
  "x-frame-options": /^DENY$/,
  "referrer-policy": /^strict-origin-when-cross-origin$/,
  "permissions-policy": /geolocation=\(\)/,
  "cross-origin-opener-policy": /^same-origin$/,
};

for (const route of ROUTES) {
  test(`S1 security headers on ${route}`, async ({ request }) => {
    const res = await request.get(route);
    expect(res.status(), `${route} status`).toBe(200);
    const headers = res.headers();
    const missing: string[] = [];
    for (const [name, shape] of Object.entries(REQUIRED)) {
      const value = headers[name];
      if (!value || !shape.test(value)) missing.push(`${name} = ${value ?? "(absent)"}`);
    }
    expect(missing, `S1 ${route}\n${missing.join("\n")}`).toEqual([]);
  });
}

test("S2 CSP allows no origin but this one", async ({ request }) => {
  const csp = (await request.get("/")).headers()["content-security-policy"] ?? "";
  // The only way a policy lets a script in from elsewhere is by naming a host.
  // If none is named, nothing off-origin can load, whatever else the policy says.
  const hosts = csp.match(/https?:\/\/[^\s;]+/g) ?? [];
  expect(hosts, `S2 external origins in CSP: ${hosts.join(", ")}`).toEqual([]);

  for (const directive of [
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ]) {
    expect(csp, `S2 missing ${directive}`).toContain(directive);
  }
});

test("S3 the stack does not introduce itself", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-powered-by"], "S3 X-Powered-By should be off").toBeUndefined();
});

test("S4 nothing executable comes from another origin", async ({ page }) => {
  const offOrigin: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    const found = await page.evaluate(() => {
      const here = location.origin;
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]"))) {
        if (new URL(el.src, here).origin !== here) out.push(el.src);
      }
      for (const el of Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
      )) {
        if (new URL(el.href, here).origin !== here) out.push(el.href);
      }
      return out;
    });
    offOrigin.push(...found.map((f) => `${route} → ${f}`));
  }
  // A self-hosted font and no analytics is what makes the CSP above honest.
  // The day a tag manager arrives, this fails before the policy does.
  expect(offOrigin, `S4 off-origin subresources:\n${offOrigin.join("\n")}`).toEqual([]);
});

test("S5 every outbound link is opener-safe", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const bad = await page.evaluate(() => {
    const here = location.origin;
    return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
      .filter((a) => {
        if (!a.href.startsWith("http")) return false;
        if (new URL(a.href).origin === here) return false;
        return a.target === "_blank" && !/noopener/.test(a.rel);
      })
      .map((a) => a.href);
  });
  expect(bad, `S5 target=_blank without rel=noopener:\n${bad.join("\n")}`).toEqual([]);
});

test("S6 security.txt is served and has not expired", async ({ request }) => {
  const res = await request.get("/.well-known/security.txt");
  expect(res.status(), "S6 security.txt status").toBe(200);
  const body = await res.text();
  expect(body, "S6 Contact").toMatch(/^Contact:\s*mailto:.+@.+$/m);
  const expires = body.match(/^Expires:\s*(.+)$/m)?.[1];
  expect(expires, "S6 Expires field").toBeTruthy();
  expect(
    new Date(expires!).getTime(),
    `S6 security.txt expired on ${expires}`,
  ).toBeGreaterThan(Date.now());
});
