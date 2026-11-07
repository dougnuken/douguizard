import { describe, expect, it } from "vitest";
import { vidrio } from "@/data/hero";
import { ESCENA, frameEscena, tramo, uniformesVidrio, vidrioEnEscena } from "@/lib/escena";
import { aperturaDesdeProgreso } from "@/lib/corte";
import { CONSULTA_CINE, SCENE_INIT } from "@/components/escena/sceneInit";

describe("escena F5 · tramo y timeline", () => {
  it("tramo recorta a [0, 1] y tolera NaN", () => {
    expect(tramo(-1, 0, 1)).toBe(0);
    expect(tramo(0.5, 0, 1)).toBe(0.5);
    expect(tramo(2, 0, 1)).toBe(1);
    expect(tramo(NaN, 0, 1)).toBe(0);
  });

  it("p = 0: acto 1 (foto entera, K2 abajo y oscura, losas y rail apagados, nombre visible)", () => {
    const f = frameEscena(0);
    expect(f.q).toBe(0);
    expect(f.k2).toBe(0);
    expect(f.m).toBe(0);
    expect(f.mt).toBe(0);
    expect([f.k3, f.k4, f.k5, f.rail, f.panel, f.laserOs]).toEqual([0, 0, 0, 0, 0, 0]);
    expect(f.nombreOpacidad).toBe(1);
    expect(f.velo).toBe(1);
  });

  it("p = 1: el OS de F3 (todo en su sitio y encendido; el nombre XL fuera)", () => {
    const f = frameEscena(1);
    expect(f.q).toBe(1);
    expect(f.k2).toBe(1);
    expect(f.m).toBe(1);
    expect(f.mt).toBe(1);
    expect([f.k3, f.k4, f.k5, f.rail, f.panel, f.laserOs]).toEqual([1, 1, 1, 1, 1, 1]);
    expect(f.nombreOpacidad).toBe(0);
  });

  it("la tinta de K2 cambia de golpe en 0,41 (P1-2) y el material entre 0,30 y 0,52", () => {
    expect(frameEscena(0.409).mt).toBe(0);
    expect(frameEscena(0.41).mt).toBe(1);
    expect(frameEscena(0.3).m).toBe(0);
    expect(frameEscena(0.52).m).toBeCloseTo(1, 6);
  });

  it("las losas entran con inicio fijo K3 0,30 · K4 0,36 · K5 0,42 y todo antes de 0,72 (P1-1)", () => {
    expect(frameEscena(0.3).k3).toBe(0);
    expect(frameEscena(0.36).k4).toBe(0);
    expect(frameEscena(0.42).k5).toBe(0);
    const fin = ESCENA.losas.k5 + ESCENA.losas.duracion;
    expect(fin).toBeLessThanOrEqual(ESCENA.foto);
    expect(frameEscena(fin).k5).toBe(1);
    expect(frameEscena(ESCENA.foto).q).toBe(1);
  });

  it("el corte del nombre se cierra entre p 0 y 0,3 y llega entero (lib/corte)", () => {
    expect(aperturaDesdeProgreso(0)).toBe(1);
    expect(aperturaDesdeProgreso(0.3)).toBe(0);
    expect(aperturaDesdeProgreso(1)).toBe(0);
  });

  it("el rail entra entre 0,5 y 0,8; el láser del tablero entre 0,8 y 1", () => {
    expect(frameEscena(0.5).rail).toBe(0);
    expect(frameEscena(0.8).rail).toBe(1);
    expect(frameEscena(0.8).laserOs).toBe(0);
  });
});

describe("escena F5 · vidrio a lo largo del ancla", () => {
  it("p = 0 = cine y p = 1 = losa (12° en los dos: estrías oblicuas de F4)", () => {
    const a = vidrioEnEscena(0, vidrio.cine, vidrio.losa);
    const b = vidrioEnEscena(1, vidrio.cine, vidrio.losa);
    expect(a.estria).toBe(vidrio.cine.estria);
    expect(a.lente).toBe(240);
    expect(b.estria).toBe(vidrio.losa.estria);
    expect(b.lente).toBe(150);
    expect(a.angulo).toBe(12);
    expect(b.angulo).toBe(12);
    expect(b.fase).toBe(140);
    expect(a.fuerza).toBeCloseTo(vidrio.cine.fuerza, 6);
    expect(b.fuerza).toBeCloseTo(vidrio.losa.fuerza, 6);
  });

  it("la fuerza sube con una joroba de +0,30 a mitad del viaje de la foto", () => {
    const mitad = vidrioEnEscena(ESCENA.foto / 2, vidrio.cine, vidrio.losa);
    const base = (vidrio.cine.fuerza + vidrio.losa.fuerza) / 2;
    expect(mitad.fuerza).toBeCloseTo(base + 0.3, 2);
  });

  it("uniformesVidrio suma la fase del ancla a la del cursor", () => {
    const base = {
      caja: { w: 600, h: 800 },
      foto: { w: 880, h: 1168, cara: [0.5, 0.4, 0.2, 0.2] as [number, number, number, number], ojo: 0.3 },
      params: vidrio.losa,
    };
    expect(uniformesVidrio(base).phase).toBe(0);
    expect(uniformesVidrio({ ...base, fase: 70 }).phase).toBe(70);
  });
});

describe("escena F5 · sceneInit", () => {
  it("solo ≥ 1024 sin RM, y deja el rail inerte", () => {
    expect(CONSULTA_CINE).toBe("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    expect(SCENE_INIT).toContain(JSON.stringify(CONSULTA_CINE));
    expect(SCENE_INIT).toContain('classList.add("cine")');
    expect(SCENE_INIT).toContain("inert=true");
    expect(SCENE_INIT.startsWith("try{")).toBe(true);
  });
});
