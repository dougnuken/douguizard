// Render scripts/og/og.html to public/og.png at 1200 × 630 with Chrome
// headless over CDP. Dev-only, never part of `next build`.
//
//   node scripts/og/shot-og.mjs
//
// Playwright is not a dependency of this repo, so `npx playwright screenshot`
// (08-assets.md §6) is replaced by the browser that is already installed.
//
// A 24-bit screenshot of this card is ~198 kB, over the 120 kB budget. One
// adaptive palette holds the gradient and halves it — run after this script:
//
//   python3 -c "from PIL import Image; im=Image.open('public/og.png').convert('RGB'); \
//     im.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG) \
//       .save('public/og.png','PNG',optimize=True)"
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const PAGE = `file://${join(ROOT, "scripts/og/og.html")}`;
const OUT = join(ROOT, "public/og.png");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const port = 9700 + Math.floor(Math.random() * 200);
const profile = mkdtempSync(join(tmpdir(), "og-shot-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--window-size=1200,630",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  throw new Error("Chrome did not expose the devtools endpoint");
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
await s("Emulation.setDeviceMetricsOverride", {
  width: 1200,
  height: 630,
  deviceScaleFactor: 1,
  mobile: false,
});
await s("Page.navigate", { url: PAGE });
await sleep(1200);
const { result } = await s("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: false,
  optimizeForSpeed: false,
});
writeFileSync(OUT, Buffer.from(result.data, "base64"));
console.log(`wrote ${OUT}`);

sock.close();
chrome.kill();
