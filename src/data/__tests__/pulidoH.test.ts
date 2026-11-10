import { describe, expect, it } from "vitest";
import { banderaDeIdioma, getDatos } from "@/data/perfil";
import { getCv } from "@/data/cv";

describe("banderas de idioma (pulido H, P2-1)", () => {
  it("cada idioma lleva su código y la bandera sale de él, no del orden", () => {
    for (const locale of ["es", "en"] as const) {
      const d = getDatos(locale);
      expect(d.idiomas.map((l) => [l.codigo, l.pais])).toEqual([
        ["es", "co"],
        ["en", "us"],
      ]);
      for (const l of d.idiomas) expect(l.pais).toBe(banderaDeIdioma[l.codigo]);
    }
  });
  it("reordenar la lista no cambia la bandera de cada idioma", () => {
    const invertida = [...getCv("es").languages].reverse();
    expect(invertida.map((l) => banderaDeIdioma[l.code])).toEqual(["us", "co"]);
  });
});
