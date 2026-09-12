import { describe, expect, it } from "vitest";
import { caseStudies, getCaseMeta, type CaseStudy } from "@/data/work";

describe("getCaseMeta", () => {
  it("derives client, role and year from the experience for a client case", () => {
    const meta = getCaseMeta("banco-de-occidente");
    expect(meta.client).toBe("Banco de Occidente");
    expect(meta.role).toBe("Senior Product Designer · Design System Gatekeeper");
    expect(meta.year).toBe("Nov 2018 — 2024");
    expect(meta.period).toBe(meta.year);
  });

  it("uses the employer name when the experience declares no client", () => {
    expect(getCaseMeta("ideaware").client).toBe("Ideaware");
  });

  it("uses the overrides for a personal case", () => {
    const meta = getCaseMeta("olbo");
    expect(meta.client).toBe("Personal product");
    expect(meta.role).toBe("Design Engineer — end to end");
    expect(meta.year).toBe("2026");
  });

  it("throws on an unknown slug", () => {
    expect(() => getCaseMeta("does-not-exist")).toThrow(/Unknown case study slug/);
  });

  it("throws when a personal case is missing roleOverride or yearOverride", () => {
    const index = caseStudies.findIndex((c) => c.slug === "olbo");
    const original = caseStudies[index];
    const broken: CaseStudy = { ...original };
    delete broken.roleOverride;
    caseStudies[index] = broken;
    try {
      expect(() => getCaseMeta("olbo")).toThrow(/roleOverride/);
    } finally {
      caseStudies[index] = original;
    }
    expect(getCaseMeta("olbo").role).toBe("Design Engineer — end to end");
  });

  it("never reads a removed field", () => {
    for (const study of caseStudies) {
      expect(study).not.toHaveProperty("colors");
      expect(study).not.toHaveProperty("thumbnail");
      expect(study).not.toHaveProperty("client");
      expect(study).not.toHaveProperty("role");
      expect(study).not.toHaveProperty("year");
    }
  });
});
