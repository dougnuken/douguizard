// Render each language's CV page to the PDF that its `site.cv.pdf` hands out,
// and stamp each with the page's own content digest so a stale file cannot
// survive a test run. Spanish (/cv) and English (/en/cv) are separate sheets
// with separate stamps: changing a Spanish bullet must fail the Spanish check.
//
//   node scripts/build-cv-pdf.mjs [baseUrl]
//
// Needs a server already serving the built site (npm run build && npx next
// start -p 4173). Chrome does the printing: `Page.printToPDF` with
// preferCSSPageSize, so the sheet obeys the print stylesheet in globals.css
// rather than a size guessed here.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";

/**
 * One sheet per language. The English file keeps the name it has always had,
 * so a link to it sent before the site spoke Spanish still opens the CV.
 */
const SHEETS = [
  { route: "/cv", out: resolve("public/cv/doug-vargas-cv-es.pdf"), stamp: resolve("public/cv/cv.stamp.es.json") },
  { route: "/en/cv", out: resolve("public/cv/doug-vargas-cv.pdf"), stamp: resolve("public/cv/cv.stamp.json") },
];

// A4, inches. Letter also fits in two pages; A4 is the one that ships because
// it is the sheet most of the world prints on.
const PAPER = { width: 8.27, height: 11.69 };

// Doug's Mac by default; `CHROME=/path/to/chrome` anywhere else, and the
// Playwright Chromium when it is the one installed.
const CHROME =
  process.env.CHROME ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/opt/pw-browsers/chromium"].find(
    (p) => existsSync(p),
  ) ??
  "google-chrome";
const port = 9700 + Math.floor(Math.random() * 200);
const profile = mkdtempSync(join(tmpdir(), "cv-pdf-"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--window-size=1280,900",
    // Chrome will not start as root without it — a CI container, not a Mac.
    ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
    "about:blank",
  ],
  { stdio: "ignore" },
);

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const j = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    wsUrl = j.webSocketDebuggerUrl;
  } catch {
    await sleep(250);
  }
}
if (!wsUrl) {
  chrome.kill();
  throw new Error("Chrome never opened a devtools endpoint");
}

const sock = new WebSocket(wsUrl);
await new Promise((res, rej) => {
  sock.onopen = res;
  sock.onerror = rej;
});
let seq = 0;
const pending = new Map();
sock.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const id = ++seq;
    pending.set(id, res);
    sock.send(JSON.stringify({ id, method, params, sessionId }));
  });

const {
  result: { targetId },
} = await send("Target.createTarget", { url: "about:blank" });
const {
  result: { sessionId },
} = await send("Target.attachToTarget", { targetId, flatten: true });
const s = (m, p) => send(m, p, sessionId);

await s("Page.enable");
await s("Runtime.enable");

// This file is emailed and read on a screen, so it is the dark document, and
// motion is off — the same frame a reduced-motion visitor already sees. The
// print stylesheet forces the dark tokens regardless, but emulating dark here
// keeps anything theme-dependent honest before the sheet rules apply.
await s("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-color-scheme", value: "dark" },
    { name: "prefers-reduced-motion", value: "reduce" },
  ],
});
await s("Page.addScriptToEvaluateOnNewDocument", {
  source: `try{localStorage.setItem("dg-theme","dark")}catch(e){}`,
});

for (const sheet of SHEETS) {
  await s("Page.navigate", { url: `${BASE}${sheet.route}` });
  await sleep(2500);
  await s("Runtime.evaluate", { awaitPromise: true, expression: "document.fonts.ready.then(()=>1)" });

  // Runtime.evaluate nests its payload one level deeper than printToPDF does:
  // the message is { result: { result: { value } } }.
  // A `next start` left running from a previous build serves the OLD asset
  // manifest, so the new HTML asks for CSS hashes it does not have, every
  // stylesheet 404s, and this script cheerfully prints an unstyled document and
  // stamps it as current. Ask the page whether its own stylesheet arrived.
  const { result: styled } = await s("Runtime.evaluate", {
    returnByValue: true,
    expression:
      "getComputedStyle(document.querySelector('.site-header')).position === 'fixed'" +
      " && document.styleSheets.length > 0",
  });
  if (styled?.result?.value !== true) {
    sock.close();
    chrome.kill();
    throw new Error(
      `${BASE}${sheet.route} rendered without its stylesheet — the server on that port is ` +
        "serving a stale build. Restart it (npm run build && npx next start -p 4173) " +
        "and run this again.",
    );
  }

  const { result: evaluated } = await s("Runtime.evaluate", {
    returnByValue: true,
    expression: `document.querySelector('meta[name="cv-fingerprint"]')?.content ?? ""`,
  });
  const fingerprint = evaluated?.result?.value ?? "";
  if (!fingerprint) {
    sock.close();
    chrome.kill();
    throw new Error(`${sheet.route} served no cv-fingerprint meta — is this a CV route?`);
  }

  const { result } = await s("Page.printToPDF", {
    // The whole design is background: the surface, the purple wash and the
    // grain. With this off the sheet prints as bare type on white, which is
    // exactly how the last one came out.
    printBackground: true,
    preferCSSPageSize: true,
    paperWidth: PAPER.width,
    paperHeight: PAPER.height,
  });

  const buf = Buffer.from(result.data, "base64");
  mkdirSync(dirname(sheet.out), { recursive: true });
  writeFileSync(sheet.out, buf);

  // Chrome leaves the page tree readable enough to count without a parser.
  const raw = readFileSync(sheet.out, "latin1");
  const pages = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;

  writeFileSync(
    sheet.stamp,
    `${JSON.stringify({ fingerprint, pages, bytes: buf.length, paper: "A4" }, null, 2)}\n`,
  );

  console.log(JSON.stringify({ out: sheet.out, fingerprint, pages, bytes: buf.length }));

  // Three, not the two spec 05 §6 set for paper. That budget bought its second
  // page by forcing 1.28 leading on every element in the document, which is what
  // Doug called cramped. On a screen a page costs nothing; a squeezed one costs
  // every reader.
  if (pages > 3) {
    console.error(`WARNING: ${sheet.route} printed ${pages} pages. Three is the budget.`);
  }
}

sock.close();
chrome.kill();
