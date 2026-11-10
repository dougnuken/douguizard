import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudy } from "@/data/work";
import { anchoCifras } from "@/components/case/CaseImpact";

describe("F7 · caso en B", () => {
  it("k de P1-6: «~1.200» mide ≈ 2,88 em (la virgulilla va en Urbanist a 0,6 em, F7 P2-1) y todas las cifras de un caso comparten k", () => {
    expect(anchoCifras([{ value: "~1.200" }])).toBeCloseTo(2.88, 2);
    expect(anchoCifras([{ value: "30" }, { value: "~1.200" }, { value: "130+" }])).toBe(anchoCifras([{ value: "~1.200" }]));
    // La coma del EN ocupa un carácter entero: nunca más estrecha que el ES.
    expect(anchoCifras([{ value: "~1,200" }])).toBeGreaterThanOrEqual(anchoCifras([{ value: "~1.200" }]));
  });

  it("platforms: solo nombres de plataforma conocidos, sin repetir, iguales en ES y EN", () => {
    const validas = new Set(["Web", "iOS", "Android", "PWA"]);
    for (const c of caseStudies) {
      if (!c.platforms) continue;
      expect(c.platforms.length).toBeGreaterThan(0);
      expect(new Set(c.platforms).size).toBe(c.platforms.length);
      for (const p of c.platforms) expect(validas.has(p), `${c.slug}: ${p}`).toBe(true);
      expect(getCaseStudy(c.slug, "es")?.platforms).toEqual(c.platforms);
    }
    // Donde el caso no lo dice, no se inventa (07 F7).
    expect(caseStudies.find((c) => c.slug === "qrvey")?.platforms).toBeUndefined();
  });

  it("heads (P1-3): mismas claves en ES y EN, sin vacíos, solo para bloques que existen; Naowee con el copy de caso.html", () => {
    for (const c of caseStudies) {
      const es = getCaseStudy(c.slug, "es")!;
      expect(Object.keys(es.heads ?? {}).sort(), c.slug).toEqual(Object.keys(c.heads ?? {}).sort());
      for (const h of [c.heads, es.heads]) {
        for (const v of Object.values(h ?? {})) expect((v as string).trim().length, c.slug).toBeGreaterThan(0);
        if (h?.decisions) expect(c.decisions?.length, `${c.slug} decisions`).toBeGreaterThan(0);
        if (h?.process) expect(c.process?.length, `${c.slug} process`).toBeGreaterThan(0);
      }
    }
    expect(getCaseStudy("naowee-suid", "es")?.heads).toEqual({
      context: "Un sector que funcionaba con archivos",
      contributions: "Dirigí el producto y construí el prototipo",
      decisions: "Tres reglas que sostienen la plataforma",
      product: "Así se despeja hoy un trámite vencido",
      process: "Del archivo al prototipo firmado",
    });
  });
});
