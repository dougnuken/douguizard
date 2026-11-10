import { describe, expect, it } from "vitest";
import { direccionRuta, ordenRuta } from "@/lib/transicionRuta";
import { coreografiaPasos } from "@/lib/pasosCraft";

describe("transicionRuta (G4)", () => {
  it("ordena las páginas como el dock, con y sin /en", () => {
    expect(ordenRuta("/")).toBe(0);
    expect(ordenRuta("/en")).toBe(0);
    expect(ordenRuta("/work")).toBe(1);
    expect(ordenRuta("/en/work/makeapet")).toBe(1.5);
    expect(ordenRuta("/about")).toBe(2);
    expect(ordenRuta("/en/experience")).toBe(3);
    expect(ordenRuta("/cv")).toBe(4);
    expect(ordenRuta("/nada")).toBeNull();
  });
  it("va hacia delante o hacia atrás según el orden", () => {
    expect(direccionRuta("/experience", "/cv")).toBe("adelante");
    expect(direccionRuta("/en/cv", "/en/about")).toBe("atras");
    expect(direccionRuta("/about", "/about")).toBeNull();
    expect(direccionRuta("/about", "/nada")).toBeNull();
  });
});

describe("coreografiaPasos (G4)", () => {
  const c = coreografiaPasos({ eje: "x", paradas: [0, 0.25, 0.5, 0.75], pasos: 4 });
  it("enciende los nodos en orden y dura entre 2,5 y 3,5 s", () => {
    expect(c.encendidos).toEqual([...c.encendidos].sort((a, b) => a - b));
    expect(c.encendidos[0]).toBe(0);
    expect(c.total).toBeGreaterThanOrEqual(2500);
    expect(c.total).toBeLessThanOrEqual(3500);
  });
  it("el láser llega a cada nodo justo cuando se enciende y termina lleno", () => {
    const k = c.laser!.keyframes;
    expect(k[0]).toMatchObject({ offset: 0, transform: "scaleX(0.0000)" });
    for (let i = 1; i < 4; i++) {
      const f = k.find((x) => x.offset === c.encendidos[i] / c.laser!.duracion);
      expect(f?.transform).toBe(`scaleX(${(i * 0.25).toFixed(4)})`);
    }
    expect(k[k.length - 1]).toMatchObject({ offset: 1, transform: "scaleX(1.0000)" });
  });
  it("en vertical escala en Y; sin láser no hay trazo", () => {
    expect(coreografiaPasos({ eje: "y", paradas: [0, 0.3, 0.6, 0.9], pasos: 4 }).laser!.keyframes[1].transform).toMatch(/^scaleY/);
    expect(coreografiaPasos({ eje: "ninguno", paradas: [], pasos: 4 }).laser).toBeNull();
  });
});
