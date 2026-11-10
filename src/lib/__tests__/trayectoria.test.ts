import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { aniosEnProducto, casosPublicados, empresas } from "@/lib/cuentas";
import {
  acumuladosEn,
  activoEn,
  eraEn,
  hitosTrayectoria,
  hoyDecimal,
  inicioEje,
  pDe,
  yDe,
} from "@/lib/trayectoria";

const NOV_2026 = new Date(Date.UTC(2026, 10, 6));
const HOY = hoyDecimal(NOV_2026);

describe("trayectoria · hitos", () => {
  const hs = hitosTrayectoria("es", NOV_2026);

  it("10 hitos en orden: UAC → Naowee, con Chub en paralelo entre Globant y Aval", () => {
    expect(hs.map((h) => h.id)).toEqual([
      "uac",
      "freelance",
      "smartbiz",
      "ideaware",
      "qrvey",
      "globant",
      "chub",
      "aval",
      "mercadolibre",
      "naowee",
    ]);
    for (let i = 1; i < hs.length; i++) expect(hs[i].inicio).toBeGreaterThanOrEqual(hs[i - 1].inicio);
    expect(hs.filter((h) => h.paralelo).map((h) => h.id)).toEqual(["chub"]);
  });

  it("hoy = nov 2026 = 2026 + 10/12; el último rol (Naowee) terminó en oct 2026, antes de hoy", () => {
    expect(HOY).toBeCloseTo(2026 + 10 / 12, 6);
    expect(hs.at(-1)?.fin).toBeCloseTo(2026 + 9 / 12, 6);
    expect(hs.at(-1)?.fin).toBeLessThanOrEqual(HOY);
  });

  it("cada hito tiene logro, rol, periodo y título en ES y EN", () => {
    for (const l of locales) {
      for (const h of hitosTrayectoria(l, NOV_2026)) {
        expect(h.logro.length, `${l} ${h.id}`).toBeGreaterThan(10);
        expect(h.logro.length, `${l} ${h.id} ≤ 140`).toBeLessThanOrEqual(140);
        expect(h.rol, `${l} ${h.id}`).not.toBe("");
        expect(h.periodo, `${l} ${h.id}`).not.toBe("");
        expect(h.titulo, `${l} ${h.id}`).not.toBe("");
      }
    }
  });

  it("7 hitos con caso; Andes con NDA", () => {
    expect(hs.filter((h) => h.caso)).toHaveLength(7);
    expect(hs.find((h) => h.id === "mercadolibre")?.nda).toBe(true);
  });
});

describe("trayectoria · scroll por hito (P1-9)", () => {
  const hs = hitosTrayectoria("es", NOV_2026);
  const n = hs.length;

  it("yDe recorre de 2006 a hoy y nunca retrocede", () => {
    expect(yDe(0, hs, HOY)).toBeCloseTo(inicioEje(hs), 6);
    expect(yDe(1, hs, HOY)).toBeCloseTo(HOY, 6);
    let prev = -Infinity;
    for (let k = 0; k <= 400; k++) {
      const y = yDe(k / 400, hs, HOY);
      expect(y).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = y;
    }
  });

  it("yDe((i + 0,5)/n) cae dentro del tramo del hito i y pDe(i) lo activa, para todo i", () => {
    for (let i = 0; i < n; i++) {
      const y = yDe((i + 0.5) / n, hs, HOY);
      expect(y, `hito ${hs[i].id}`).toBeGreaterThanOrEqual(hs[i].inicio);
      expect(y, `hito ${hs[i].id}`).toBeLessThan(hs[i].fin);
      expect(activoEn(yDe(pDe(i, n), hs, HOY), hs), `pDe(${i})`).toBe(i);
    }
  });

  it("pasos de 1/n activan los hitos 0 → 9 en orden, sin saltarse ninguno", () => {
    const vistos: number[] = [];
    for (let k = 0; k <= 10 * n; k++) {
      const a = activoEn(yDe(k / (10 * n), hs, HOY), hs);
      if (vistos.at(-1) !== a) vistos.push(a);
    }
    expect(vistos).toEqual(hs.map((_, i) => i));
  });
});

describe("trayectoria · acumulados", () => {
  const hs = hitosTrayectoria("en", NOV_2026);

  it("en y = hoy dan lo mismo que cuentas.ts (12 · 6 · 10)", () => {
    expect(acumuladosEn(HOY, hs)).toEqual({
      anios: aniosEnProducto(NOV_2026),
      empresas: empresas(),
      casos: casosPublicados(),
    });
  });

  it("en el primer año todo vale 0 y nunca baja", () => {
    expect(acumuladosEn(inicioEje(hs), hs)).toEqual({ anios: 0, empresas: 0, casos: 0 });
    let prev = acumuladosEn(inicioEje(hs), hs);
    for (let y = inicioEje(hs); y <= HOY; y += 0.05) {
      const a = acumuladosEn(y, hs);
      expect(a.anios).toBeGreaterThanOrEqual(prev.anios);
      expect(a.empresas).toBeGreaterThanOrEqual(prev.empresas);
      expect(a.casos).toBeGreaterThanOrEqual(prev.casos);
      prev = a;
    }
  });

  it("eras: Base en 2006, Dirección hoy", () => {
    expect(eraEn(2006)).toBe(0);
    expect(eraEn(HOY)).toBe(4);
  });
});
