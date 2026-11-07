import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudy } from "@/data/work";
import { anchoCifras } from "@/components/case/CaseImpact";

describe("F7 · caso en B", () => {
  it("k de P1-6: «~1.200» mide ≈ 3,05 em y todas las cifras de un caso comparten k", () => {
    expect(anchoCifras([{ value: "~1.200" }])).toBeCloseTo(3.05, 1);
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
});
