import { describe, expect, it } from "vitest";
import { PILDORA_MS, cajaVista, guardarHuella, leerHuella, misma, piezas, restante, traslacion } from "@/lib/pildora";

describe("pildora", () => {
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
