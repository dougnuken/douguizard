import { describe, expect, it } from "vitest";
import { archivo, ordenCasos } from "@/data/home";
import { caseStudies } from "@/data/work";
import {
  aniosEnProducto,
  casosPublicados,
  empleadores,
  empresas,
  grupoCaso,
  productosPropios,
} from "@/lib/cuentas";

/** Fecha fija: el informe de F2 se escribió en noviembre de 2026. */
const NOV_2026 = new Date(Date.UTC(2026, 10, 6));

describe("cuentas · la única cuenta (P1-4)", () => {
  it("12 años · 10 casos · 3 propios · 6 empresas en nov 2026", () => {
    expect(aniosEnProducto(NOV_2026)).toBe(12);
    expect(casosPublicados()).toBe(10);
    expect(productosPropios()).toHaveLength(3);
    expect(empresas()).toBe(6);
  });

  it("productos propios = los slugs con kind personal (Chub es side, no cuenta)", () => {
    const esperados = caseStudies.filter((c) => c.kind === "personal").map((c) => c.slug);
    expect(productosPropios().map((p) => p.slug)).toEqual(esperados);
    expect(productosPropios().map((p) => p.slug)).not.toContain("chub");
  });

  it("empresas = empleadores de registro, sin freelance; Qrvey cuenta como Ideaware", () => {
    const nombres = empleadores().map((e) => e.nombre);
    expect(nombres).not.toContain("Freelance");
    expect(nombres).not.toContain("Qrvey");
    expect(nombres).toContain("Ideaware");
    expect(new Set(nombres).size).toBe(nombres.length);
  });

  it("los grupos del filtro suman todos los casos y cada uno cae en uno solo", () => {
    const grupos = caseStudies.map((c) => grupoCaso(c.slug));
    expect(grupos).toHaveLength(casosPublicados());
    expect(grupos.filter((g) => g === "propio")).toHaveLength(productosPropios().length);
    expect(grupos.filter((g) => g === "anterior")).toHaveLength(archivo.length);
    expect(grupos.filter((g) => g === "escala").length).toBe(
      ordenCasos.filter((s) => grupoCaso(s) === "escala").length,
    );
  });

  it("un slug desconocido falla", () => {
    expect(() => grupoCaso("no-existe")).toThrow();
  });
});
