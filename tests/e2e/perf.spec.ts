import { expect, test, type Browser } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { gzipSync } from "node:zlib";

/**
 * Rendimiento de carga de `/` (07-PLAN §2 F0). En F0 solo MIDE y escribe JSON; las
 * aserciones (LCP, CLS, presupuesto de JS) llegan en F3.
 *
 * Usa CDP, así que solo corre en Chromium. Para que los números signifiquen algo, correrlo
 * solo y con un worker, no dentro de la suite completa (que comparte la CPU):
 *
 *   PERF_OUT=tests/out/baseline-F0.json npx playwright test perf --workers=1
 *
 * Perfiles (los de Lighthouse, aplicados por CDP):
 * - móvil: 390×844, DPR 3, táctil; Slow 4G (562,5 ms de RTT, 1,6 Mbit/s × 0,9 de bajada,
 *   750 kbit/s × 0,9 de subida) y CPU × 4.
 * - escritorio: 1440×900, DPR 1; 40 ms de RTT, 10 Mbit/s, sin freno de CPU.
 *
 * Cada perfil se carga RUNS veces en un contexto nuevo (caché fría) y se informa la mediana.
 * «JS inicial» = scripts terminados antes del evento `load`: bytes transferidos (lo que
 * `next start` manda comprimido, cabeceras incluidas) y, aparte, el cuerpo comprimido con
 * gzip nivel 6, que no depende del servidor.
 */

const RUTA = process.env.PERF_RUTA ?? "/";
const RUNS = Number(process.env.PERF_RUNS ?? 3);
const OUT = process.env.PERF_OUT ?? "tests/out/baseline-F0.json";

const PERFILES = {
  movil: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    red: { latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 },
    cpu: 4,
  },
  escritorio: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    red: { latency: 40, downloadThroughput: (10 * 1024 * 1024) / 8, uploadThroughput: (10 * 1024 * 1024) / 8 },
    cpu: 1,
  },
} as const;

type Perfil = keyof typeof PERFILES;

const UMBRALES: Record<Perfil, { lcpMs: number; cls: number }> = {
  movil: { lcpMs: 2000, cls: 0.02 },
  escritorio: { lcpMs: 1200, cls: 0.02 },
};

type Medida = {
  lcpMs: number | null;
  lcpElemento: string | null;
  cls: number;
  loadMs: number;
  js: { archivos: number; transferidoKB: number; gzipKB: number };
  imagenes: { archivos: number; transferidoKB: number };
};

/** Se inyecta antes de cualquier script de la página: observa LCP y CLS desde el primer cuadro. */
const OBSERVADORES = `(() => {
  const w = window;
  w.__perf = { lcp: null, lcpEl: null, cls: 0 };
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        w.__perf.lcp = e.startTime;
        const el = e.element;
        w.__perf.lcpEl = el
          ? el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") +
            (el.getAttribute("class") ? "." + el.getAttribute("class").trim().split(/\\s+/).slice(0, 3).join(".") : "") +
            (e.url ? " " + e.url.replace(location.origin, "").slice(0, 120) : " «" + (el.textContent || "").trim().slice(0, 60) + "»")
          : (e.url || null);
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) w.__perf.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  } catch (e) {}
})();`;

async function medir(browser: Browser, perfil: Perfil): Promise<Medida> {
  const p = PERFILES[perfil];
  const context = await browser.newContext({
    viewport: p.viewport,
    deviceScaleFactor: p.deviceScaleFactor,
    isMobile: p.isMobile,
    hasTouch: p.hasTouch,
  });
  await context.addInitScript(OBSERVADORES);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, ...p.red });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: p.cpu });

  const tipos = new Map<string, string>();
  const terminadas: { id: string; t: number; bytes: number }[] = [];
  let loadT = Infinity;
  cdp.on("Network.responseReceived", (e) => tipos.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => terminadas.push({ id: e.requestId, t: e.timestamp, bytes: e.encodedDataLength }));
  await cdp.send("Page.enable");
  cdp.on("Page.loadEventFired", (e) => {
    if (loadT === Infinity) loadT = e.timestamp;
  });

  await page.goto(RUTA, { waitUntil: "load", timeout: 120_000 });
  // El LCP se fija con la primera interacción o al ocultar la página; sin tocar nada, se
  // espera a que la red quede quieta y un margen para que pinte lo último.
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(perfil === "movil" ? 3000 : 1500);

  const perf = await page.evaluate(() => {
    const w = window as unknown as { __perf: { lcp: number | null; lcpEl: string | null; cls: number } };
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    return { ...w.__perf, loadMs: nav ? nav.loadEventStart : NaN };
  });

  const antesDeLoad = terminadas.filter((r) => r.t <= loadT);
  const js = antesDeLoad.filter((r) => tipos.get(r.id) === "Script");
  const img = antesDeLoad.filter((r) => tipos.get(r.id) === "Image");
  let gzip = 0;
  for (const r of js) {
    try {
      const { body, base64Encoded } = await cdp.send("Network.getResponseBody", { requestId: r.id });
      gzip += gzipSync(Buffer.from(body, base64Encoded ? "base64" : "utf8"), { level: 6 }).length;
    } catch {
      /* cuerpo ya liberado: queda fuera del total gzip, no del transferido */
    }
  }
  await context.close();

  const kb = (n: number) => Math.round((n / 1024) * 10) / 10;
  return {
    lcpMs: perf.lcp === null ? null : Math.round(perf.lcp),
    lcpElemento: perf.lcpEl,
    cls: Math.round(perf.cls * 10000) / 10000,
    loadMs: Math.round(perf.loadMs),
    js: { archivos: js.length, transferidoKB: kb(js.reduce((s, r) => s + r.bytes, 0)), gzipKB: kb(gzip) },
    imagenes: { archivos: img.length, transferidoKB: kb(img.reduce((s, r) => s + r.bytes, 0)) },
  };
}

const mediana = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

test.describe.configure({ mode: "serial" });

/** Se reescribe al terminar cada perfil, con lo que haya hasta ahí (los dos van en serie). */
function escribir(workers: number) {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        medidoEl: new Date().toISOString(),
        ruta: RUTA,
        corridasPorPerfil: RUNS,
        workers,
        perfiles: Object.fromEntries(
          Object.entries(PERFILES).map(([k, v]) => [k, { viewport: v.viewport, dpr: v.deviceScaleFactor, red: v.red, cpu: v.cpu }]),
        ),
        resultados,
      },
      null,
      2,
    ) + "\n",
  );
}

const resultados: Record<string, { mediana: Partial<Medida>; corridas: Medida[] }> = {};

for (const perfil of Object.keys(PERFILES) as Perfil[]) {
  test(`perf ${RUTA} ${perfil}`, async ({ browser, browserName }, info) => {
    test.skip(browserName !== "chromium", "CDP: solo Chromium");
    info.setTimeout(RUNS * 150_000);
    const corridas: Medida[] = [];
    for (let i = 0; i < RUNS; i++) corridas.push(await medir(browser, perfil));
    const lcps = corridas.map((c) => c.lcpMs).filter((x): x is number => x !== null);
    // La corrida de LCP mediano da el elemento LCP que se informa.
    const central = corridas.find((c) => c.lcpMs === mediana(lcps)) ?? corridas[0];
    resultados[perfil] = {
      mediana: {
        lcpMs: lcps.length ? mediana(lcps) : null,
        lcpElemento: central.lcpElemento,
        cls: mediana(corridas.map((c) => c.cls)),
        loadMs: mediana(corridas.map((c) => c.loadMs)),
        js: central.js,
        imagenes: central.imagenes,
      },
      corridas,
    };
    escribir(info.config.workers);
    // F8: umbrales finales de 07 (LCP ≤ 2,0 s móvil y ≤ 1,2 s escritorio, CLS ≤ 0,02).
    // Solo con PERF_ASSERT=1: dentro de la suite completa la CPU es compartida y la cifra no vale.
    if (process.env.PERF_ASSERT === "1") {
      const m = resultados[perfil].mediana;
      expect(m.lcpMs ?? Infinity, `LCP ${RUTA} ${perfil}`).toBeLessThanOrEqual(UMBRALES[perfil].lcpMs);
      expect(m.cls ?? Infinity, `CLS ${RUTA} ${perfil}`).toBeLessThanOrEqual(UMBRALES[perfil].cls);
    }
  });
}
