import { describe, expect, it } from "vitest";
import { yearsBetween, yearsOfExperience } from "@/lib/career";
import { CAREER_ANCHOR } from "@/data/cv";

describe("yearsOfExperience", () => {
  it("counts whole years from the career anchor, not from a literal", () => {
    expect(CAREER_ANCHOR).toBe("smartbiz"); // Oct 2014
    expect(yearsOfExperience(new Date("2026-09-12"))).toBe(11);
  });

  it("has not incremented the day before the anniversary", () => {
    expect(yearsOfExperience(new Date("2026-10-31"))).toBe(12);
    expect(yearsOfExperience(new Date("2026-09-30"))).toBe(11);
  });

  it("derives from data — bumping the anchor's start moves the result", () => {
    expect(yearsBetween({ year: 2010, month: 2 }, new Date("2026-09-12"))).toBe(16);
    expect(yearsBetween({ year: 2014, month: 10 }, new Date("2026-09-12"))).toBe(11);
  });

  it("never returns a hardcoded 12", () => {
    expect(String(yearsOfExperience(new Date("2030-01-01")))).not.toBe("12");
  });
});
