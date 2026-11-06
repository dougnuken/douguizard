import { describe, expect, it } from "vitest";
import { getFotoActiva } from "@/data/hero";
import { eio, losaPerfil, placement } from "@/lib/escena";

const f = getFotoActiva();
const foto = { w: f.tamano.w, h: f.tamano.h, ojo: f.ojo };

describe("escena · placement", () => {
  it("cine: 130 % del alto, ojo al 41 % y centro al 62 % del ancho", () => {
    const r = { x: 0, y: 0, w: 1440, h: 900 };
    const p = placement(r, "cine", foto);
    expect(p.Dy).toBeCloseTo(1170);
    expect(p.Oy + foto.ojo * p.Dy).toBeCloseTo(0.41 * 900);
    expect(p.Ox + p.Dx / 2).toBeCloseTo(0.62 * 1440);
    expect(p.Dx / p.Dy).toBeCloseTo(foto.w / foto.h);
  });

  it("losa cubre su rectángulo (móvil, el ancho y los tres cuartos de arriba) y ponen el ojo donde toca", () => {
    for (const [modo, ojo] of [["losa", 0.3], ["movil", 0.22]] as const) {
      for (const r of [{ x: 900, y: 88, w: 534, h: 788 }, { x: 0, y: 0, w: 390, h: 844 }]) {
        const p = placement(r, modo, foto);
        expect(p.Ox, modo).toBeLessThanOrEqual(r.x + 0.01);
        expect(p.Ox + p.Dx, modo).toBeGreaterThanOrEqual(r.x + r.w - 0.01);
        expect(p.Oy, modo).toBeLessThanOrEqual(r.y + 0.01);
        // En móvil la foto deja libre el último cuarto: ahí el velo funde a vacío y va el nombre.
        if (modo === "losa") expect(p.Oy + p.Dy, modo).toBeGreaterThanOrEqual(r.y + r.h - 0.01);
        else expect(p.Oy + p.Dy, modo).toBeGreaterThanOrEqual(r.y + 0.75 * r.h);
        expect(p.Oy + foto.ojo * p.Dy, modo).toBeCloseTo(r.y + ojo * r.h);
      }
    }
  });

  it("la losa de /about son las columnas 8–12 del contenido", () => {
    const l = losaPerfil(1440, 900);
    const col = (1304 - 176) / 12;
    expect(l.x).toBeCloseTo(112 + 7 * (col + 16));
    expect(l.x + l.w).toBeCloseTo(1440 - 24);
    expect(l.y).toBe(88);
    expect(l.h).toBe(900 - 112);
    const ancha = losaPerfil(1920, 1080);
    expect(ancha.x + ancha.w).toBeCloseTo(300 + 1320);
  });

  it("eio va de 0 a 1, simétrica", () => {
    expect(eio(0)).toBe(0);
    expect(eio(1)).toBe(1);
    expect(eio(0.5)).toBeCloseTo(0.5);
    expect(eio(0.25) + eio(0.75)).toBeCloseTo(1);
  });
});
