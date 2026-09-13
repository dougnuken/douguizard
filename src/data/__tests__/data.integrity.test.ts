import { describe, expect, it } from "vitest";
import { experiences, type YearMonth } from "@/data/cv";
import { caseStudies, getCaseStudy } from "@/data/work";
import { testimonials } from "@/data/testimonials";
import { site } from "@/data/site";

const asMonths = (p: YearMonth) => p.year * 12 + ((p.month ?? 1) - 1);

describe("cv + work integrity", () => {
  it("exactly one experience is current (no end)", () => {
    expect(experiences.filter((e) => e.end === undefined)).toHaveLength(1);
  });

  it("every caseSlug on an experience resolves to a case study", () => {
    for (const e of experiences) {
      if (e.caseSlug) expect(getCaseStudy(e.caseSlug), e.caseSlug).toBeDefined();
    }
  });

  it("every experienceId on a case study resolves to an experience", () => {
    for (const c of caseStudies) {
      if (c.experienceId) {
        expect(experiences.some((e) => e.id === c.experienceId), c.slug).toBe(true);
      } else {
        // No employer behind it, so it has to be one of the two kinds that
        // does not have one: Doug's own product, or work taken on outside a
        // job. Anything else is a case that lost its `experienceId`.
        expect(["personal", "side"], c.slug).toContain(c.kind);
      }
    }
  });

  it("every testimonial's experienceId and caseSlug resolve", () => {
    for (const t of testimonials) {
      expect(experiences.some((e) => e.id === t.experienceId), t.id).toBe(true);
      if (t.caseSlug) expect(getCaseStudy(t.caseSlug), t.id).toBeDefined();
    }
  });

  it("every testimonialId on a case study resolves to a testimonial", () => {
    for (const c of caseStudies) {
      if (c.testimonialId) {
        expect(testimonials.some((t) => t.id === c.testimonialId), c.slug).toBe(true);
      }
    }
  });

  it("experiences are ordered newest first by start", () => {
    for (let i = 1; i < experiences.length; i++) {
      expect(asMonths(experiences[i - 1].start)).toBeGreaterThan(
        asMonths(experiences[i].start),
      );
    }
  });

  /**
   * Qrvey and Ideaware overlap on purpose: Doug was promoted onto the Qrvey
   * account from inside Ideaware, so he held both at once. Every other pair
   * must stay disjoint — an accidental overlap is a wrong date.
   */
  const ALLOWED_OVERLAPS = [["qrvey", "ideaware"]] as const;
  const isAllowed = (a: string, b: string) =>
    ALLOWED_OVERLAPS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));

  it("no experience period overlaps another, except the declared one", () => {
    const spans = experiences.map((e) => ({
      id: e.id,
      from: asMonths(e.start),
      to: e.end ? asMonths(e.end) : Number.POSITIVE_INFINITY,
    }));
    for (let i = 0; i < spans.length; i++) {
      for (let j = i + 1; j < spans.length; j++) {
        const a = spans[i];
        const b = spans[j];
        if (isAllowed(a.id, b.id)) continue;
        const overlaps = a.from < b.to && b.from < a.to;
        expect(overlaps, `${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
  });

  it("the declared overlap is still an overlap — otherwise delete the exception", () => {
    const span = (id: string) => {
      const e = experiences.find((x) => x.id === id)!;
      return { from: asMonths(e.start), to: e.end ? asMonths(e.end) : Number.POSITIVE_INFINITY };
    };
    for (const [x, y] of ALLOWED_OVERLAPS) {
      const a = span(x);
      const b = span(y);
      expect(a.from < b.to && b.from < a.to, `${x} no longer overlaps ${y}`).toBe(true);
    }
  });

  it("site.headline and site.positioning are the only identity strings", () => {
    expect(site.headline).toBe("Head of Product · Design Engineer");
    expect(site.positioning).toBe("Product Designer → Design Engineer");
    expect(site).not.toHaveProperty("role");
    expect(site).not.toHaveProperty("cvPath");
  });

  it("LinkedIn is the single primary social link", () => {
    const primary = site.social.filter((s) => s.primary);
    expect(primary).toHaveLength(1);
    expect(primary[0].label).toBe("LinkedIn");
    expect(site.social.some((s) => s.label === "Dribbble")).toBe(false);
  });

  it("case study numbering matches the published order", () => {
    expect(caseStudies.map((c) => c.slug)).toEqual([
      "olbo",
      "naowee-suid",
      "mercadolibre-andes",
      "banco-de-occidente",
      "royal-caribbean",
      "qrvey",
      "ideaware",
      "chub",
      "makeappet",
    ]);
  });

  it("the /NN on each case matches its position", () => {
    caseStudies.forEach((c, i) => {
      expect(c.num, c.slug).toBe(`/${String(i + 1).padStart(2, "0")}`);
    });
  });
});
