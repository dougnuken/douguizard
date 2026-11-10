import { describe, expect, it } from "vitest";
import { PILDORA_MS, cajaVista, cajasLiquidas, guardarHuella, leerHuella, misma, piezas, restante, traslacion } from "@/lib/pildora";

describe("pildora", () => {
  it("viaje líquido: empieza y acaba exacto, el borde delantero va delante y nunca encoge bajo un círculo", () => {
    const desde = { x: 4, y: 4, w: 80, h: 32 };
    const hasta = { x: 200, y: 4, w: 60, h: 32 };
    const c = cajasLiquidas(desde, hasta);
    expect(c[0]).toEqual(desde);
    expect(c[c.length - 1]).toEqual(hasta);
    // A la derecha: a medio viaje la cápsula se estira (el borde derecho adelanta al izquierdo).
    const mitad = c[Math.floor(c.length / 4)];
    expect(mitad.w).toBeGreaterThan(Math.max(desde.w, hasta.w));
    for (const k of c) {
      expect(k.w).toBeGreaterThanOrEqual(k.h - 1e-9);
      // El rebote no pasa del destino más de 4 px.
      expect(k.x + k.w).toBeLessThanOrEqual(hasta.x + hasta.w + 4 + 1e-9);
    }
    // Hacia la izquierda, el borde que va delante es el izquierdo.
    const vuelta = cajasLiquidas(hasta, desde);
    expect(vuelta[4].x).toBeLessThan(hasta.x - (hasta.x - desde.x) / 2);
  });

  it("dibuja la cápsula con dos círculos y un tramo estirado entre sus centros", () => {
    expect(piezas({ x: 4, y: 4, w: 64, h: 52 })).toEqual([
      "translate(4px, 4px)",
      "translate(30px, 4px) scaleX(12)",
      "translate(16px, 4px)",
    ]);
  });
  it("recupera la caja que se ve desde las traslaciones de los círculos", () => {
    expect(traslacion("matrix(1, 0, 0, 1, 40.5, 4)")).toEqual({ x: 40.5, y: 4 });
    expect(traslacion("none")).toBeNull();
    expect(cajaVista({ x: 40, y: 4 }, { x: 70 }, 52)).toEqual({ x: 40, y: 4, w: 82, h: 52 });
  });
  it("compara cajas con medio píxel de tolerancia", () => {
    expect(misma({ x: 1, y: 2, w: 3, h: 4 }, { x: 1.3, y: 2, w: 3, h: 4.2 })).toBe(true);
    expect(misma({ x: 1, y: 2, w: 3, h: 4 }, { x: 2, y: 2, w: 3, h: 4 })).toBe(false);
    expect(misma(null, { x: 1, y: 2, w: 3, h: 4 })).toBe(false);
  });
  it("la memoria sobrevive entre montajes y sabe cuánto le queda al viaje", () => {
    const c = { x: 0, y: 0, w: 1, h: 1 };
    guardarHuella("t", { hasta: c, viaje: { desde: c, hasta: c, t0: 1000 } });
    const h = leerHuella("t");
    expect(restante(h, 1100)).toBe(PILDORA_MS - 100);
    expect(restante(h, 1000 + PILDORA_MS + 1)).toBe(0);
  });
});
