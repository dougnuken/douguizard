import { describe, expect, it } from "vitest";
import { fotoActiva, fotos, getFotoActiva, vidrio } from "@/data/hero";

const enRango = (v: number) => v >= 0 && v <= 1;

describe("foto del héroe", () => {
  it("la foto activa existe", () => {
    expect(getFotoActiva().id).toBe(fotoActiva);
  });

  it("todo lo geométrico está normalizado en [0, 1]", () => {
    for (const f of fotos) {
      for (const v of [...f.foco, ...f.cara, f.ojo]) expect(enRango(v), f.id).toBe(true);
      if (f.laser) expect(enRango(f.laser.y) && enRango(f.laser.h)).toBe(true);
    }
  });

  it("la foto activa tiene todas las rutas, con id y versión en el nombre", () => {
    const f = getFotoActiva();
    const rutas = [
      f.rutas.master,
      ...Object.values(f.rutas.poster.avif),
      ...Object.values(f.rutas.poster.webp),
      ...Object.values(f.rutas.textura),
    ];
    expect(rutas.length).toBeGreaterThanOrEqual(9);
    for (const r of rutas) expect(r).toMatch(new RegExp(`^/hero/${f.id}-v${f.version}-`));
  });

  it("no hay anchos de póster mayores que el máster", () => {
    const f = getFotoActiva();
    for (const w of Object.keys(f.rutas.poster.avif).map(Number)) expect(w).toBeLessThanOrEqual(f.tamano.w);
  });

  it("el alt existe en los dos idiomas", () => {
    for (const f of fotos) {
      expect(f.alt.es.length).toBeGreaterThan(20);
      expect(f.alt.en.length).toBeGreaterThan(20);
    }
  });

  it("los parámetros del vidrio son sanos en los tres estados", () => {
    for (const p of Object.values(vidrio)) {
      expect(enRango(p.fuerza) && enRango(p.joroba) && enRango(p.proteccionCara) && enRango(p.lente)).toBe(true);
      expect(p.dprMax).toBeGreaterThanOrEqual(1);
      expect(p.estria).toBeGreaterThan(0);
    }
  });
});
