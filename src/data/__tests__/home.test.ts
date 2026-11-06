import { describe, expect, it } from "vitest";
import { archivo, cardsCaso, ordenCasos, secciones } from "@/data/home";
import { getCaseStudy } from "@/data/work";

describe("estructura del home B", () => {
  it("cada slug del orden, del archivo y de las cards existe", () => {
    for (const slug of [...ordenCasos, ...archivo, ...cardsCaso.map((c) => c.slug)]) {
      expect(getCaseStudy(slug, "en"), slug).toBeDefined();
    }
  });

  it("el orden no repite casos ni comparte casos con el archivo", () => {
    expect(new Set(ordenCasos).size).toBe(ordenCasos.length);
    for (const s of archivo) expect(ordenCasos as readonly string[]).not.toContain(s);
  });

  it("el KPI referido existe en ES y en EN", () => {
    for (const c of cardsCaso) {
      if (c.kpi === null) continue;
      expect(getCaseStudy(c.slug, "en")?.kpis?.[c.kpi], `${c.k} en`).toBeDefined();
      expect(getCaseStudy(c.slug, "es")?.kpis?.[c.kpi], `${c.k} es`).toBeDefined();
    }
  });

  it("los ids de sección son los de hoy, en inglés, sin depender del idioma", () => {
    expect(secciones).toEqual(["work", "about", "experience", "contact"]);
    for (const id of secciones) expect(id).toMatch(/^[a-z]+$/);
  });
});
