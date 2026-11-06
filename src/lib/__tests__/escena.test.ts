import { describe, expect, it } from "vitest";
import { getFotoActiva } from "@/data/hero";
import { cubrir, eio, losaPerfil, placement, uniformesVidrio } from "@/lib/escena";
import { vidrio } from "@/data/hero";
import { enMovimiento, pasoLente, type EstadoLente } from "@/components/hero/useLente";

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

describe("escena · vidrio (F4)", () => {
  const fv = { w: f.tamano.w, h: f.tamano.h, cara: f.cara, ojo: f.ojo, laser: f.laser };

  it("cubrir = object-fit: cover con object-position", () => {
    const ar = 0.75;
    const ancha = cubrir({ w: 600, h: 600 }, ar, [0.5, 0]);
    expect([ancha.Dx, ancha.Dy, ancha.Ox + 0, ancha.Oy + 0]).toEqual([600, 800, 0, 0]);
    const alta = cubrir({ w: 300, h: 800 }, ar, [0.5, 0.5]);
    expect(alta.Dy).toBe(800);
    expect(alta.Ox).toBeCloseTo((300 - 600) / 2);
  });

  it("las estrías viven en la foto: mismo ancho relativo horneado (caja = foto) y en vivo (cover)", () => {
    const horneado = uniformesVidrio({ caja: { w: f.tamano.w, h: f.tamano.h }, foto: fv, params: vidrio.losa });
    const vivo = uniformesVidrio({ caja: { w: 595, h: 700 }, foto: fv, params: vidrio.losa, pos: [0.5, 0] });
    expect(horneado.off).toEqual([0, 0]);
    expect(horneado.w / horneado.size[1]).toBeCloseTo(vivo.w / vivo.size[1]);
    expect(vivo.off[0]).toBeCloseTo(0);
  });

  it("cara, ojo y banda láser en px de la foto pintada; sin banda si se pide", () => {
    const u = uniformesVidrio({ caja: { w: 880, h: 1168 }, foto: fv, params: vidrio.cine });
    expect(u.face[0]).toBeCloseTo(f.cara[0] * 880);
    expect(u.lineY).toBeCloseTo((f.laser?.y ?? f.ojo) * 1168);
    expect(u.lineH).toBeGreaterThan(0);
    expect(uniformesVidrio({ caja: { w: 880, h: 1168 }, foto: fv, params: vidrio.cine, laser: false }).lineH).toBe(0);
  });

  it("la fuerza se sobrescribe (/about: .62 → .08) y se acota a [0, 1]; la fase solo se mueve con la lente abierta", () => {
    const base = { caja: { w: 500, h: 700 }, foto: fv, params: vidrio.cine };
    expect(uniformesVidrio({ ...base, fuerza: 0.08 }).str).toBe(0.08);
    expect(uniformesVidrio({ ...base, fuerza: 3 }).str).toBe(1);
    expect(uniformesVidrio({ ...base, mx: 400, lente: 0 }).phase).toBe(0);
    expect(uniformesVidrio({ ...base, mx: 400, lente: 1 }).phase).toBeCloseTo(6);
  });
});

describe("lente · muelle (useLente)", () => {
  const s0: EstadoLente = { mx: 0, my: 0, vx: 0, vy: 0, tx: 100, ty: 50, abierta: 0, objetivo: 1, arrastre: false };

  it("críticamente amortiguado: llega sin pasarse y se detiene (0 fps en reposo)", () => {
    let s = s0;
    let max = 0;
    for (let i = 0; i < 120; i++) {
      s = pasoLente(s, 1 / 60);
      max = Math.max(max, s.mx);
    }
    expect(max).toBeLessThanOrEqual(100.01);
    expect(s.abierta).toBe(1);
    expect(enMovimiento(s)).toBe(false);
  });

  it("la apertura entra más rápido de lo que sale (k = 7 vs 4)", () => {
    const entra = pasoLente(s0, 0.1).abierta;
    const sale = 1 - pasoLente({ ...s0, abierta: 1, objetivo: 0 }, 0.1).abierta;
    expect(entra).toBeGreaterThan(sale);
  });

  it("táctil: el arrastre sigue al dedo 1:1, sin inercia", () => {
    const s = pasoLente({ ...s0, arrastre: true }, 1 / 60);
    expect([s.mx, s.my, s.vx]).toEqual([100, 50, 0]);
  });
});
