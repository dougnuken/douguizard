import { describe, expect, it } from "vitest";
import { atenuacionDestello, DESTELLO } from "@/components/escena/destello";
import { fotos, getFotoActiva, ojosDe, varsFoto } from "@/data/hero";

describe("destello del láser (pulido I)", () => {
  it("entero en p = 0, apagado desde `fin` y siempre decreciente", () => {
    expect(atenuacionDestello(0)).toBe(1);
    expect(atenuacionDestello(DESTELLO.fin)).toBe(0);
    expect(atenuacionDestello(1)).toBe(0);
    let antes = 1;
    for (let p = 0; p <= 1.0001; p += 0.02) {
      const v = atenuacionDestello(p);
      expect(v).toBeLessThanOrEqual(antes);
      expect(v).toBeGreaterThanOrEqual(0);
      antes = v;
    }
  });

  it("a medio viaje (p ≈ 0,3) sigue a la vista, ya atenuado", () => {
    const v = atenuacionDestello(0.3);
    expect(v).toBeGreaterThan(0.35);
    expect(v).toBeLessThan(0.75);
  });

  it("las pupilas de cada foto caen dentro de la cara, una a cada lado, sobre la línea del ojo", () => {
    for (const f of fotos) {
      const [i, d] = ojosDe(f);
      const [cx, , rx] = f.cara;
      expect(i[0]).toBeLessThan(cx);
      expect(d[0]).toBeGreaterThan(cx);
      for (const o of [i, d]) {
        expect(Math.abs(o[0] - cx)).toBeLessThan(rx);
        expect(Math.abs(o[1] - f.ojo)).toBeLessThan(0.02);
      }
    }
  });

  it("sin `ojos`, se estiman con la cara; `varsFoto` las publica para el CSS", () => {
    const f = getFotoActiva();
    const [i, d] = ojosDe({ cara: f.cara, ojo: f.ojo });
    expect(i).toEqual([f.cara[0] - 0.45 * f.cara[2], f.ojo]);
    expect(d).toEqual([f.cara[0] + 0.45 * f.cara[2], f.ojo]);
    const v = varsFoto(f);
    expect(Number(v["--foto-ojo-ix"])).toBe(f.ojos![0][0]);
    expect(Number(v["--foto-ojo-dy"])).toBe(f.ojos![1][1]);
  });
});
