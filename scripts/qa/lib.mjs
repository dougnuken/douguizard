// Utilidades compartidas por scripts/qa/*.mjs — sin dependencias nuevas (usa @playwright/test, ya instalado).
import { chromium } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** `--clave valor` y `--bandera` → objeto. Los valores con coma se quedan como texto. */
export function parseArgs(argv = process.argv.slice(2)) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

export const list = (v, fallback) =>
  typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : fallback;

/** Chromium: el de Playwright si está; si no, el de /opt/pw-browsers (entorno en la nube). */
export async function launch() {
  const attempts = [];
  if (process.env.PW_CHROMIUM) attempts.push({ executablePath: process.env.PW_CHROMIUM });
  attempts.push({});
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (existsSync(root)) {
    for (const d of readdirSync(root).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      const exe = join(root, d, "chrome-linux", "chrome");
      if (existsSync(exe)) attempts.push({ executablePath: exe });
    }
  }
  let last;
  for (const opts of attempts) {
    try {
      return await chromium.launch({ ...opts, args: ["--no-sandbox"] });
    } catch (e) {
      last = e;
    }
  }
  throw new Error(`No pude lanzar Chromium: ${String(last).split("\n")[0]}`);
}

/**
 * Los componentes se revelan con IntersectionObserver: recorre la página para que todos disparen y espera a que
 * nada quede en opacidad 0. Devuelve lo que siga invisible (para reportarlo en vez de aceptar un hueco).
 * Misma idea que tests/e2e/settle.ts, sin los tipos de @playwright/test.
 */
export async function settle(page, maxMs = 8000) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const shell = document.querySelector("[data-hshell]");
    if (shell && shell.scrollWidth > shell.clientWidth + 1) {
      for (let i = 0; i <= 12; i++) {
        shell.scrollLeft = (shell.scrollWidth - shell.clientWidth) * (i / 12);
        await sleep(60);
      }
      for (const p of document.querySelectorAll("[data-panel]")) {
        if (p.scrollHeight > p.clientHeight + 1) {
          for (let i = 0; i <= 6; i++) {
            p.scrollTop = (p.scrollHeight - p.clientHeight) * (i / 6);
            await sleep(40);
          }
          p.scrollTop = 0;
        }
      }
      shell.scrollLeft = 0;
    }
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
  let invisible = [];
  while (Date.now() < deadline) {
    invisible = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") continue;
        if (parseFloat(cs.opacity) > 0.01) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        if (el.getAttribute("aria-hidden") === "true") continue;
        out.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).slice(0, 60)}`);
      }
      return out.slice(0, 10);
    });
    if (invisible.length === 0) break;
    await page.waitForTimeout(300);
  }
  return invisible;
}

export const slug = (route) => route.replace(/\W+/g, "_").replace(/^_+|_+$/g, "") || "root";

/** Abre una ruta con tema y alto de viewport como en tests/e2e. */
export async function open(browser, { base, route, width, height, theme = "dark", reduced = true }) {
  const ctx = await browser.newContext({
    viewport: { width, height: height || (width < 768 ? 812 : 900) },
    deviceScaleFactor: 1,
    colorScheme: theme === "light" ? "light" : "dark",
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  await ctx.addInitScript(`try{localStorage.setItem("dg-theme", ${JSON.stringify(theme)})}catch(e){}`);
  const page = await ctx.newPage();
  return { ctx, page, go: () => page.goto(new URL(route, base).href, { waitUntil: "networkidle" }) };
}
