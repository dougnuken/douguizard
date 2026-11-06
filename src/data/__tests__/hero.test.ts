import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ESTADOS, anchosPoster, foto, fotoActiva, fotos, getFotoActiva, varsFoto, vidrio } from "@/data/hero";

const enRango = (v: number) => v >= 0 && v <= 1;
const publico = (r: string) => path.join("public", r);

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

  it("la foto activa tiene póster por estado, textura y manifest, con id y versión en la carpeta", () => {
    const f = getFotoActiva();
    const rutas = [
      f.rutas.textura,
      f.rutas.manifest,
      ...ESTADOS.flatMap((e) => [...Object.values(f.rutas.poster[e].avif), ...Object.values(f.rutas.poster[e].webp)]),
    ];
    expect(rutas.length).toBe(2 + ESTADOS.length * 2 * anchosPoster(f.tamano.w).length);
    for (const r of rutas) expect(r).toMatch(new RegExp(`^/hero/${f.id}-v${f.version}/`));
  });

  it("los archivos horneados existen y el manifest coincide con hero.ts (npm run hero:poster)", () => {
    const f = getFotoActiva();
    expect(existsSync(f.master)).toBe(true);
    const m = JSON.parse(readFileSync(publico(f.rutas.manifest), "utf8"));
    expect(m).toMatchObject({ id: f.id, version: f.version, tamano: f.tamano, textura: f.rutas.textura });
    for (const e of ESTADOS) {
      expect(m.poster[e]).toEqual(JSON.parse(JSON.stringify(f.rutas.poster[e])));
      for (const r of [...Object.values(f.rutas.poster[e].avif), ...Object.values(f.rutas.poster[e].webp)]) expect(existsSync(publico(r)), r).toBe(true);
    }
    expect(existsSync(publico(f.rutas.textura))).toBe(true);
  });

  it("no hay anchos de póster mayores que el máster", () => {
    const f = getFotoActiva();
    for (const e of ESTADOS) for (const w of Object.keys(f.rutas.poster[e].avif).map(Number)) expect(w).toBeLessThanOrEqual(f.tamano.w);
    expect(anchosPoster(880)).toEqual([440, 640, 880]);
    expect(anchosPoster(2400)).toEqual([440, 640, 880, 1080, 1600, 1920]);
  });

  it("el alt existe en los dos idiomas", () => {
    for (const f of fotos) {
      expect(f.alt.es.length).toBeGreaterThan(20);
      expect(f.alt.en.length).toBeGreaterThan(20);
    }
  });

  it("los parámetros del vidrio son sanos en los tres estados; el móvil va oblicuo (F3 P2-3)", () => {
    for (const p of Object.values(vidrio)) {
      expect(enRango(p.fuerza) && enRango(p.proteccionCara) && enRango(p.estria)).toBe(true);
      expect(p.dprMax).toBeGreaterThanOrEqual(1);
      expect(p.dprMax).toBeLessThanOrEqual(1.5);
      expect(p.lente).toBeGreaterThanOrEqual(0);
    }
    expect(vidrio.movil.angulo).toBe(vidrio.cine.angulo);
    expect(vidrio.movil.angulo).toBeGreaterThan(0);
  });

  it("cambio de foto: otra foto 3:4 deriva todas sus rutas y variables sin tocar componentes", () => {
    const { foco, cara, ojo, laser, alt } = getFotoActiva();
    const f = foto("a4ef948f", 1, { foco, cara, ojo, laser, alt, tamano: { w: 1200, h: 1600 } });
    expect(f.rutas.poster.losa.avif[1080]).toBe("/hero/a4ef948f-v1/losa-1080.avif");
    expect(f.master).toBe("docs/rediseno-2026/retratos-hf/a4ef948f.jpg");
    expect(varsFoto(f)["--foto-ar"]).toBe(String(0.75));
  });
});
