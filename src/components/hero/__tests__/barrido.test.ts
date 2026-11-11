import { describe, expect, it } from "vitest";
import { PERIODO, REENTRADA, REPOSO, actividad, ritmo, suave, trayectoria } from "@/components/hero/barrido";
import { getFotoActiva } from "@/data/hero";

const f = getFotoActiva();
const [cx, cy, rx, ry] = f.cara;

describe("barrido automático · trayectoria (pulido I)", () => {
  it("nace entre los ojos y es cerrada: tras un periodo vuelve al mismo punto", () => {
    const [x0, y0] = trayectoria(0, f);
    expect(x0).toBeCloseTo(cx, 6);
    expect(y0).toBeCloseTo(f.ojo, 6);
    const [x1, y1] = trayectoria(PERIODO, f);
    expect(x1).toBeCloseTo(x0, 6);
    expect(y1).toBeCloseTo(y0, 6);
  });

  it("no sale de la foto y la recorre entera (Doug): más allá de la cara en los dos ejes", () => {
    let [minX, maxX, minY, maxY] = [1, 0, 1, 0];
    for (let t = 0; t < PERIODO; t += 0.05) {
      const [x, y] = trayectoria(t, f);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    expect(minX).toBeGreaterThan(0.1);
    expect(maxX).toBeLessThan(0.9);
    expect(minY).toBeGreaterThan(0.1);
    expect(maxY).toBeLessThan(0.9);
    expect(maxX - minX).toBeGreaterThan(1.8 * rx);
    // Toda la foto, no solo la cara: al menos 0,55 de ancho y 0,45 de alto.
    expect(maxX - minX).toBeGreaterThan(0.55);
    expect(maxY - minY).toBeGreaterThan(0.45);
    expect(minY).toBeLessThan(cy - 0.5 * ry);
    expect(maxY).toBeGreaterThan(cy + 0.5 * ry);
  });

  it("el ritmo avanza siempre (sin retrocesos), se frena en los ojos y cambia de velocidad", () => {
    const v: number[] = [];
    for (let t = 0; t < PERIODO; t += 0.1) v.push((ritmo(t + 0.1) - ritmo(t)) / 0.1);
    expect(Math.min(...v)).toBeGreaterThan(0);
    // La pausa mayor es la del arranque (sobre los ojos).
    expect(v[0]).toBeCloseTo(Math.min(...v), 3);
    expect(Math.max(...v) / Math.min(...v)).toBeGreaterThan(4);
    expect(ritmo(PERIODO)).toBeCloseTo(1, 9);
  });

  // Pulido I (Doug): el recorrido pasó de la cara a toda la foto en la misma vuelta de 30 s; el tope sube de 0,16 a 0,22.
  it("es lenta: nunca pasa de 0,22 anchos de foto por segundo", () => {
    let max = 0;
    for (let t = 0; t < PERIODO; t += 0.02) {
      const [a, b] = trayectoria(t, f);
      const [c, d] = trayectoria(t + 0.02, f);
      max = Math.max(max, Math.hypot(c - a, (d - b) * (f.tamano.h / f.tamano.w)) / 0.02);
    }
    expect(max).toBeLessThan(0.22);
  });

  it("tiempos de la decisión: el cursor manda y el barrido retoma a los ~3 s con una vuelta suave", () => {
    expect(REPOSO).toBe(3);
    expect(REENTRADA).toBeGreaterThanOrEqual(1.5);
    expect([suave(-1), suave(0), suave(0.5), suave(1), suave(2)]).toEqual([0, 0, 0.5, 1, 1]);
  });
});

describe("barrido automático · actividad", () => {
  it("a la vista y sin desplazar barre; fuera de vista o con el héroe a medias, no", () => {
    expect(actividad({ visible: 1 })).toBe(1);
    expect(actividad({ visible: 0.3 })).toBe(0);
    expect(actividad({ visible: 0 })).toBe(0);
  });

  it("home de escritorio: se apaga al empezar el viaje de la foto (`--vidrio-p`) y vuelve al regresar", () => {
    expect(actividad({ visible: 1, p: 0 })).toBe(1);
    expect(actividad({ visible: 1, p: 0.09 })).toBeGreaterThan(0);
    expect(actividad({ visible: 1, p: 0.09 })).toBeLessThan(1);
    expect(actividad({ visible: 1, p: 0.2 })).toBe(0);
    expect(actividad({ visible: 1, p: 1 })).toBe(0);
    expect(actividad({ visible: 1, p: NaN })).toBe(1);
  });

  it("/about: sin vidrio (`--vidrio-f` baja con el scroll) no hay nada que barrer", () => {
    expect(actividad({ visible: 1, fuerza: 0.62 })).toBe(1);
    expect(actividad({ visible: 1, fuerza: 0.08 })).toBe(0);
  });
});
