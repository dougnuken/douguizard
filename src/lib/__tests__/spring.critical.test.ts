import { describe, expect, it } from "vitest";
import { DAMPING, STIFFNESS, stepCritical, stepSpring, type Spring } from "@/lib/spring";

function correr(omega: number, dt: number, segundos: number, desde = 0, meta = 1) {
  const s: Spring = { pos: desde, vel: 0 };
  let max = -Infinity;
  let dormido = false;
  for (let t = 0; t < segundos && !dormido; t += dt) {
    dormido = stepCritical(s, meta, omega, dt);
    max = Math.max(max, s.pos);
  }
  return { s, max, dormido };
}

describe("stepCritical (muelle críticamente amortiguado)", () => {
  it("llega a la meta sin pasarse", () => {
    const { s, max, dormido } = correr(7, 1 / 60, 5);
    expect(dormido).toBe(true);
    expect(s.pos).toBe(1);
    expect(s.vel).toBe(0);
    expect(max).toBeLessThanOrEqual(1);
  });

  it("da lo mismo a 60 Hz que a 120 Hz", () => {
    const a: Spring = { pos: 0, vel: 0 };
    const b: Spring = { pos: 0, vel: 0 };
    for (let i = 0; i < 30; i++) stepCritical(a, 1, 7, 1 / 60);
    for (let i = 0; i < 60; i++) stepCritical(b, 1, 7, 1 / 120);
    expect(a.pos).toBeCloseTo(b.pos, 9);
  });

  it("no se vuelve inestable con un cuadro largo", () => {
    const s: Spring = { pos: 0, vel: 0 };
    stepCritical(s, 1, 7, 0.5);
    expect(s.pos).toBeGreaterThan(0);
    expect(s.pos).toBeLessThanOrEqual(1);
  });

  it("k = 7 responde más rápido que k = 4 (lente: entra rápido, sale lento)", () => {
    const rapida: Spring = { pos: 0, vel: 0 };
    const lenta: Spring = { pos: 0, vel: 0 };
    for (let i = 0; i < 20; i++) {
      stepCritical(rapida, 1, 7, 1 / 60);
      stepCritical(lenta, 1, 4, 1 / 60);
    }
    expect(rapida.pos).toBeGreaterThan(lenta.pos);
  });

  it("dt ≤ 0 no mueve nada", () => {
    const s: Spring = { pos: 0.3, vel: 0.2 };
    expect(stepCritical(s, 1, 7, 0)).toBe(false);
    expect(s).toEqual({ pos: 0.3, vel: 0.2 });
  });

  it("stepSpring y sus constantes no cambiaron", () => {
    expect(STIFFNESS).toBe(170);
    expect(DAMPING).toBe(16);
    const s: Spring = { pos: 0, vel: 0 };
    let max = 0;
    for (let i = 0; i < 120; i++) {
      stepSpring(s, 1, 1 / 60);
      max = Math.max(max, s.pos);
    }
    expect(max).toBeGreaterThan(1); // sigue rebotando (~7 %): es su tacto
  });
});
