import { describe, expect, it } from "vitest";
import {
  aperturaDesdeProgreso,
  bezier,
  CONSULTA_CORTE,
  CORTE,
  corteDesdeMetricas,
  desplazamientos,
  ENTRADA,
  topSobreLaser,
} from "@/lib/corte";

describe("corte láser del nombre", () => {
  it("--corte = línea base − 0,52 × altura de x", () => {
    // Caja de 108 px (120 × 0,9), ascendente 112, descendente 28, altura x 62.
    const base = (108 - 140) / 2 + 112;
    const k = corteDesdeMetricas({ interlineado: 108, ascendente: 112, descendente: 28, alturaX: 62 });
    expect(k).toBeCloseTo(base - 0.52 * 62, 6);
    expect(k).toBeLessThan(base);
  });

  it("el corte escala en proporción al tamaño de la fuente", () => {
    const m = (fs: number) =>
      corteDesdeMetricas({ interlineado: fs * 0.9, ascendente: fs * 0.93, descendente: fs * 0.23, alturaX: fs * 0.52 });
    expect(m(96) / m(120)).toBeCloseTo(0.8, 6);
  });

  it("abierto: −0,10 em arriba, +0,06 em abajo y 3 px de rendija en total", () => {
    const d = desplazamientos(1);
    expect(d.despEm).toBeCloseTo(-0.1);
    expect(d.despEm * CORTE.factorInf).toBeCloseTo(0.06);
    expect(d.rendijaPx * 2).toBe(3);
  });

  it("cerrado: todo a cero; fuera de rango se recorta", () => {
    expect(desplazamientos(0)).toEqual({ despEm: -0, rendijaPx: 0, t: 0 });
    expect(desplazamientos(2).t).toBe(1);
    expect(desplazamientos(-1).t).toBe(0);
    expect(desplazamientos(Number.NaN).t).toBe(0);
  });

  it("el scroll lo cierra entre p = 0 y p = 0,3", () => {
    expect(aperturaDesdeProgreso(0)).toBe(1);
    expect(aperturaDesdeProgreso(0.15)).toBeCloseTo(0.5);
    expect(aperturaDesdeProgreso(0.3)).toBe(0);
    expect(aperturaDesdeProgreso(1)).toBe(0);
    expect(aperturaDesdeProgreso(Number.NaN)).toBe(0);
  });

  it("la entrada es una sola: 880 ms de espera y 520 ms con --curva-salida", () => {
    expect(ENTRADA.retrasoMs).toBe(880);
    expect(ENTRADA.duracionMs).toBe(520);
    expect(ENTRADA.curva).toEqual([0.23, 1, 0.32, 1]);
  });

  it("la curva empieza en 0, termina en 1 y nunca se pasa (sin rebote)", () => {
    const [x1, y1, x2, y2] = ENTRADA.curva;
    expect(bezier(x1, y1, x2, y2, 0)).toBe(0);
    expect(bezier(x1, y1, x2, y2, 1)).toBe(1);
    let previo = 0;
    for (let x = 0.05; x < 1; x += 0.05) {
      const y = bezier(x1, y1, x2, y2, x);
      expect(y).toBeGreaterThanOrEqual(previo);
      expect(y).toBeLessThanOrEqual(1);
      previo = y;
    }
    expect(bezier(0, 0, 1, 1, 0.37)).toBeCloseTo(0.37, 4); // lineal
  });

  it("el láser pasa por el corte, nunca por encima de la cabecera", () => {
    expect(topSobreLaser(400, 108, 70)).toBe(222);
    expect(topSobreLaser(150, 108, 70)).toBe(88);
  });

  it("solo hay corte en escritorio y con movimiento", () => {
    expect(CONSULTA_CORTE).toContain("min-width: 1024px");
    expect(CONSULTA_CORTE).toContain("prefers-reduced-motion: no-preference");
  });
});
