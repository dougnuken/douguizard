#!/usr/bin/env node
// Comprobaciones funcionales automáticas por ruta y ancho. Cero tokens de razonamiento: el QA solo lee el resumen.
//
//   node scripts/qa/check.mjs --routes /,/work/dc-medical --widths 390,1440
//   opciones: --base http://localhost:3131  --theme dark|light
//
// Marca: errores de consola/página, peticiones fallidas o con HTTP>=400, desborde horizontal, imágenes rotas o sin alt,
// enlaces externos sin rel="noopener noreferrer", href vacío o "#", toques menores de 44 px (solo <768), <html lang> que no
// corresponde a la ruta, título vacío y h1 distinto de uno. Sale con código 1 si hay algún hallazgo.
import { parseArgs, list, launch, settle, open } from "./lib.mjs";

const a = parseArgs();
const base = a.base || "http://localhost:3131";
const routes = list(a.routes, ["/", "/en"]);
const widths = list(a.widths, ["390", "1440"]).map(Number);
const theme = a.theme === "light" ? "light" : "dark";
const origin = new URL(base).origin;

let total = 0;
const browser = await launch();
try {
  for (const route of routes) {
    for (const width of widths) {
      const { ctx, page, go } = await open(browser, { base, route, width, theme });
      const issues = [];
      page.on("console", (m) => {
        if (m.type() === "error") issues.push(`consola: ${m.text().slice(0, 140)}`);
      });
      page.on("pageerror", (e) => issues.push(`pageerror: ${String(e).slice(0, 140)}`));
      page.on("requestfailed", (r) => {
        const why = r.failure()?.errorText || "";
        // Un <video> con varios <source> aborta la petición del que descarta: no es un fallo.
        if (r.resourceType() === "media" && /ERR_ABORTED/.test(why)) return;
        issues.push(`petición fallida (${why}): ${r.url().slice(0, 100)}`);
      });
      page.on("response", (r) => {
        if (r.status() >= 400) issues.push(`HTTP ${r.status()}: ${r.url().slice(0, 100)}`);
      });

      const res = await go();
      if (!res || res.status() >= 400) issues.push(`la ruta responde ${res ? res.status() : "sin respuesta"}`);
      const invisible = await settle(page);
      if (invisible.length) issues.push(`invisible tras el revelado: ${invisible.slice(0, 3).join(" | ")}`);

      const found = await page.evaluate(
        ({ origin, narrow, route }) => {
          const out = [];
          const de = document.documentElement;
          if (de.scrollWidth > window.innerWidth + 1) out.push(`desborde horizontal: ${de.scrollWidth}px > ${window.innerWidth}px`);

          const wantLang = route === "/en" || route.startsWith("/en/") ? "en" : "es";
          if (!(de.lang || "").toLowerCase().startsWith(wantLang)) out.push(`<html lang="${de.lang}"> en una ruta ${wantLang}`);
          if (!document.title.trim()) out.push("título vacío");
          const h1 = document.querySelectorAll("h1").length;
          if (h1 !== 1) out.push(`h1: hay ${h1}, debe haber 1`);

          for (const img of document.images) {
            const label = (img.currentSrc || img.src || "").split("/").slice(-2).join("/").slice(0, 70);
            if (!img.hasAttribute("alt")) out.push(`imagen sin alt: ${label}`);
            if (img.complete && img.naturalWidth === 0) out.push(`imagen rota: ${label}`);
          }

          for (const link of document.querySelectorAll("a[href]")) {
            const href = link.getAttribute("href") || "";
            const text = (link.textContent || link.getAttribute("aria-label") || "").trim().slice(0, 30);
            if (href === "" || href === "#") out.push(`enlace sin destino: "${text}"`);
            let url;
            try {
              url = new URL(href, location.href);
            } catch {
              out.push(`href inválido: ${href.slice(0, 60)}`);
              continue;
            }
            if (/^https?:$/.test(url.protocol) && url.origin !== origin) {
              const rel = (link.getAttribute("rel") || "").toLowerCase();
              if (!(rel.includes("noopener") && rel.includes("noreferrer"))) out.push(`externo sin rel noopener noreferrer: ${url.host}`);
            }
          }

          if (narrow) {
            const small = [];
            for (const el of document.querySelectorAll("a[href], button, [role=button], input, select, textarea, summary")) {
              const cs = getComputedStyle(el);
              if (cs.visibility === "hidden" || cs.display === "none" || el.getAttribute("aria-hidden") === "true") continue;
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (r.right < 0 || r.left > window.innerWidth) continue; // fuera de pantalla (carrusel)
              // un enlace dentro de un párrafo queda exento, como en WCAG
              const inline = el.tagName === "A" && cs.display === "inline" && (el.parentElement?.textContent || "").length > (el.textContent || "").length + 12;
              if (inline) continue;
              if (Math.min(r.width, r.height) < 44) small.push(`${el.tagName.toLowerCase()} ${Math.round(r.width)}×${Math.round(r.height)} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}"`);
            }
            if (small.length) out.push(`toques <44 px (${small.length}): ${small.slice(0, 4).join("; ")}`);
          }
          return out;
        },
        { origin, narrow: width < 768, route },
      );
      issues.push(...found);

      const uniq = [...new Set(issues)];
      total += uniq.length;
      console.log(`${uniq.length ? "✗" : "✓"} ${route} @${width}${uniq.length ? "" : "  ok"}`);
      for (const i of uniq.slice(0, 12)) console.log(`    - ${i}`);
      if (uniq.length > 12) console.log(`    … y ${uniq.length - 12} más`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`TOTAL hallazgos: ${total}`);
process.exit(total ? 1 : 0);
