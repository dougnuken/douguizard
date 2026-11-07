import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage();
await p.goto("http://localhost:3131/work/naowee-suid", { waitUntil: "networkidle" });
const r = await p.evaluate(async () => {
  await document.fonts.ready;
  const out = {};
  for (const v of ["0000000000", "~~~~~~~~~~", "++++++++++", ",,,,,,,,,,", "AAAAAAAAAA", "~1.200", "~1,200", "2.000+"]) {
    const s = document.createElement("span"); s.className = "dot"; s.style.cssText = "font-size:100px;letter-spacing:-0.06em;white-space:nowrap;position:absolute";
    s.textContent = v; document.body.append(s); out[v] = s.getBoundingClientRect().width / 100; s.remove();
  }
  const kpi = [...document.querySelectorAll(".kpi-caso .dot")].map(d => [d.textContent, d.getBoundingClientRect().width/parseFloat(getComputedStyle(d).fontSize), getComputedStyle(d).fontSize]);
  return { out, kpi };
});
console.log(JSON.stringify(r)); await b.close();
