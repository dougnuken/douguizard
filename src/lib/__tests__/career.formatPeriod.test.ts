import { describe, expect, it } from "vitest";
import { formatPeriod, getExperience, getWordmarks } from "@/lib/career";
import { experiences } from "@/data/cv";

describe("formatPeriod", () => {
  it("renders a closed period with both months", () => {
    expect(formatPeriod(getExperience("qrvey"))).toBe("Oct 2016 — Aug 2017");
  });

  it("renders the current role as Now", () => {
    expect(formatPeriod(getExperience("naowee"))).toBe("Jan 2026 — Now");
  });

  it("omits an unknown start month instead of guessing one", () => {
    expect(formatPeriod(getExperience("mercadolibre"))).toBe("2024 — Jan 2026");
  });

  it("renders an unknown end month as the bare year", () => {
    expect(formatPeriod(getExperience("aval"))).toBe("Nov 2018 — 2024");
  });

  it("uses an em dash with single spaces, never a hyphen or 'Present'", () => {
    for (const e of experiences) {
      const period = formatPeriod(e);
      expect(period).toMatch(/^[^—]+ — [^—]+$/);
      expect(period).not.toMatch(/-|Present|Ongoing/);
    }
  });
});

describe("getWordmarks", () => {
  it("renders the strip fixed by the copy deck, newest first", () => {
    expect(getWordmarks()).toEqual([
      "Naowee",
      "Mercadolibre",
      "Aval Digital Labs",
      "Banco de Occidente",
      "Globant",
      "Qrvey",
      "Ideaware",
    ]);
  });

  it("excludes the 'earlier' era", () => {
    expect(getWordmarks()).not.toContain("Smartbiz Solutions");
    expect(getWordmarks()).not.toContain("Freelance");
  });
});
