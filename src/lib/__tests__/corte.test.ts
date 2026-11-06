import { describe, expect, it } from "vitest";
import { alturaCorte, aperturaDesdeProgreso, CONSULTA_CORTE, CORTE } from "@/lib/corte";

describe("corte láser del nombre", () => {
  it("se abre en p = 0 y queda cerrado desde p = 0,3", () => {
    expect(aperturaDesdeProgreso(0)).toBe(1);
    expect(aperturaDesdeProgreso(0.15)).toBeCloseTo(0.5);
    expect(aperturaDesdeProgreso(0.3)).toBe(0);
    expect(aperturaDesdeProgreso(1)).toBe(0);
    expect(aperturaDesdeProgreso(-1)).toBe(1);
    expect(aperturaDesdeProgreso(Number.NaN)).toBe(0);
  });

  it("corta un pelo por encima de la mitad del ojo medio, en px enteros", () => {
    // Caja de 115,2 px (128 × 0,9), ascendente 120, descendente 30, altura x 66.
    const k = alturaCorte({ interlineado: 115.2, ascendente: 120, descendente: 30, alturaX: 66 });
    expect(Number.isInteger(k)).toBe(true);
    const base = (115.2 - 150) / 2 + 120;
    expect(k).toBe(Math.round(base - 66 * CORTE.alturaOjo));
    expect(k).toBeLessThan(base);
  });

  it("solo hay corte en escritorio y sin movimiento reducido", () => {
    expect(CONSULTA_CORTE).toContain("min-width: 1024px");
    expect(CONSULTA_CORTE).toContain("prefers-reduced-motion: no-preference");
  });

  it("el desplazamiento total a 128 px ronda los 20 px (TIPO.md)", () => {
    expect(Math.abs(CORTE.arribaEm - CORTE.abajoEm) * 128).toBeCloseTo(20.48, 1);
  });
});
