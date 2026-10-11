#!/usr/bin/env node
// Escáner de fugas para un repo PÚBLICO. Busca lo que nunca debe publicarse: ids de Drive/Docs/Sheets, URLs de Apps Script,
// correos y teléfonos fuera de la lista permitida, claves y tokens, rutas locales y —con --denylist— nombres reales.
//
//   node scripts/qa/leak-scan.mjs                       # src public mockups docs scripts .claude tests/e2e + raíz
//   node scripts/qa/leak-scan.mjs --dirs public,src     # otras carpetas
//   node scripts/qa/leak-scan.mjs --denylist ~/lista.txt   # una línea por nombre o teléfono real
//
// La lista de nombres reales debe vivir FUERA del repo: el script se niega a leerla desde dentro (acabaría en un commit).
// Nunca imprime el dato encontrado, solo dónde está y una máscara. Sale con código 1 si queda algún hallazgo.
// Los medios binarios (imágenes, video) no se leen aquí: los revisa una persona o pf-security mirándolos.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, sep, extname } from "node:path";
import { parseArgs, list } from "./lib.mjs";

const ROOT = resolve(new URL("../..", import.meta.url).pathname);
const a = parseArgs();
const dirs = list(a.dirs, ["src", "public", "mockups", "docs", "scripts", ".claude", "tests/e2e"]);
const allowFile = a.allow || join(ROOT, "scripts/qa/leak-allow.json");
const allow = existsSync(allowFile) ? JSON.parse(readFileSync(allowFile, "utf8")) : {};
const allowedEmails = new Set((allow.emails || []).map((s) => s.toLowerCase()));
const allowedPhones = new Set((allow.phones || []).map((s) => s.replace(/\D/g, "")));
const allowedFiles = allow.files || {}; // { "ruta": ["clave", ...] }

const SKIP_DIR = new Set(["node_modules", ".next", ".git", "shots", "out", "test-results", "playwright-report", "coverage"]);
const SKIP_FILE = new Set(["package-lock.json"]);
const BINARY = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif", ".ico", ".mp4", ".webm", ".mov", ".pdf", ".woff", ".woff2", ".ttf", ".otf", ".zip"]);
const MAX_BYTES = 2_000_000;

const PATTERNS = [
  { key: "drive_id", sev: "alto", re: /(?:\/d\/|\/folders\/|[?&]id=)[A-Za-z0-9_-]{25,}/g },
  { key: "drive_id_like", sev: "alto", re: /(?<![A-Za-z0-9_-])1[A-Za-z0-9_-]{43}(?![A-Za-z0-9_-])/g },
  { key: "apps_script_url", sev: "crítico", re: /script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+/g },
  { key: "email", sev: "alto", re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g },
  { key: "telefono_co", sev: "alto", re: /(?<![\d.])(?:\+?57[\s-]?)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)/g },
  { key: "clave_openai_anthropic", sev: "crítico", re: /\bsk-[A-Za-z0-9_-]{20,}/g },
  { key: "clave_aws", sev: "crítico", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { key: "clave_google", sev: "crítico", re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { key: "clave_github", sev: "crítico", re: /\b(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}/g },
  { key: "clave_slack", sev: "crítico", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/g },
  { key: "llave_privada", sev: "crítico", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { key: "secreto_asignado", sev: "alto", re: /\b(?:api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*["'][^"'\s]{12,}["']/gi },
  { key: "ruta_local", sev: "bajo", re: /(?:\/Users\/[A-Za-z0-9._-]+\/|C:\\Users\\[A-Za-z0-9._-]+)/g },
];

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ");
const mask = (s) => `${s.slice(0, 3)}…(${s.length})`;

// Lista de nombres reales (opcional, fuera del repo).
let deny = null;
if (a.denylist) {
  const p = resolve(String(a.denylist).replace(/^~(?=$|\/)/, process.env.HOME || "~"));
  if (p === ROOT || p.startsWith(ROOT + sep)) {
    console.error("✗ La lista de nombres reales no puede estar dentro del repo (acabaría en un commit). Muévela y repite.");
    process.exit(2);
  }
  if (!existsSync(p)) {
    console.error(`✗ No existe la lista: ${p}`);
    process.exit(2);
  }
  const tokens = readFileSync(p, "utf8").split("\n").map((s) => norm(s.trim())).filter((s) => s.length >= 4);
  if (tokens.length) {
    deny = {
      tokens,
      re: new RegExp(tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g"),
    };
  }
  console.log(`(lista de nombres reales: ${tokens.length} entradas; no se imprimen)`);
}

const findings = [];
let scanned = 0;
let skippedBig = 0;
let binaries = 0;

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIR.has(e.name)) walk(full);
    } else if (e.isFile()) scanFile(full);
  }
}

function scanFile(full) {
  const rel = relative(ROOT, full).split(sep).join("/");
  const name = rel.split("/").pop();
  if (SKIP_FILE.has(name)) return;
  if (BINARY.has(extname(name).toLowerCase())) {
    binaries++;
    return;
  }
  if (statSync(full).size > MAX_BYTES) {
    skippedBig++;
    return;
  }
  const text = readFileSync(full, "utf8");
  if (text.includes("\u0000")) return;
  scanned++;
  const lines = text.split("\n");
  const okKeys = new Set(allowedFiles[rel] || []);
  lines.forEach((line, i) => {
    for (const p of PATTERNS) {
      if (okKeys.has(p.key)) continue;
      for (const m of line.matchAll(p.re)) {
        const hit = m[0];
        if (p.key === "email" && allowedEmails.has(hit.toLowerCase())) continue;
        if (p.key === "telefono_co" && allowedPhones.has(hit.replace(/\D/g, "").replace(/^57/, "")) ) continue;
        if (p.key === "telefono_co" && allowedPhones.has(hit.replace(/\D/g, ""))) continue;
        findings.push({ sev: p.sev, key: p.key, rel, line: i + 1, shown: mask(hit) });
      }
    }
    if (deny) {
      const n = norm(line);
      for (const m of n.matchAll(deny.re)) {
        findings.push({ sev: "crítico", key: `nombre_real#${deny.tokens.indexOf(m[0]) + 1}`, rel, line: i + 1, shown: "(oculto)" });
      }
    }
  });
}

for (const d of dirs) {
  const full = resolve(ROOT, d);
  if (existsSync(full)) walk(full);
}
// Archivos sueltos de la raíz (README, HANDOFF, scripts de despliegue…).
for (const e of readdirSync(ROOT, { withFileTypes: true })) if (e.isFile()) scanFile(join(ROOT, e.name));

const order = { crítico: 0, alto: 1, medio: 2, bajo: 3 };
findings.sort((x, y) => order[x.sev] - order[y.sev] || x.rel.localeCompare(y.rel) || x.line - y.line);
for (const f of findings.slice(0, 60)) console.log(`${f.sev.padEnd(7)} ${f.key.padEnd(22)} ${f.rel}:${f.line}  ${f.shown}`);
if (findings.length > 60) console.log(`… y ${findings.length - 60} más`);
console.log(`escaneados ${scanned} archivos de texto · ${binaries} medios binarios sin leer (revisar a la vista) · ${skippedBig} muy grandes omitidos`);
console.log(findings.length ? `✗ ${findings.length} hallazgo(s)` : "✓ sin hallazgos");
process.exit(findings.length ? 1 : 0);
