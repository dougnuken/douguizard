import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudies, getCaseStudy } from "@/data/work";
import { workEs } from "@/data/es/work";
import { experiencesEs, skillsEs } from "@/data/es/cv";
import { experiences, getCv, skills } from "@/data/cv";
import { getSections, sections } from "@/data/sections";
import { getSite } from "@/data/site";
import { getCoverLetter } from "@/data/coverLetter";
import { getTestimonial, testimonials } from "@/data/testimonials";
import { dictionaries } from "@/i18n/dictionaries";
import { alternatesFor, localePath, splitLocale } from "@/i18n/config";

/**
 * The Spanish site is the English one with its words swapped, so the failure
 * that matters is a word that was not swapped — or a list that quietly lost an
 * item and now pairs a caption with the wrong screenshot.
 */

/** Every key path in a value, arrays by index, functions as leaves. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => shape(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

describe("the interface dictionary", () => {
  it("has the same shape in both languages", () => {
    expect(shape(dictionaries.es).sort()).toEqual(shape(dictionaries.en).sort());
  });
});

describe("the cases in Spanish", () => {
  it("every case has its Spanish copy, and nothing else does", () => {
    expect(Object.keys(workEs).sort()).toEqual(caseStudies.map((c) => c.slug).sort());
  });

  // Lists matched by position must stay matched: one caption short and every
  // screenshot after it is described by its neighbour's words.
  const PAIRED = ["gallery", "kpis", "process", "features", "links"] as const;

  for (const c of caseStudies) {
    const es = workEs[c.slug];

    it(`${c.slug}: paired lists are the same length`, () => {
      for (const key of PAIRED) {
        const en = c[key];
        if (!en) {
          expect(es[key], `${c.slug}.${key} has no English list to pair with`).toBeUndefined();
          continue;
        }
        if (es[key]) expect(es[key]!.length, `${c.slug}.${key}`).toBe(en.length);
      }
    });

    it(`${c.slug}: every list a reader sees is translated, not inherited`, () => {
      // A list the Spanish copy leaves out would print in English.
      for (const key of PAIRED) {
        if (c[key] && key !== "links") expect(es[key], `${c.slug}.${key}`).toBeDefined();
      }
      if (c.links) expect(es.links, `${c.slug}.links`).toBeDefined();
      if (c.decisions) expect(es.decisions?.length, `${c.slug}.decisions`).toBe(c.decisions.length);
      if (c.featuresIntro) expect(es.featuresIntro, `${c.slug}.featuresIntro`).toBeDefined();
      if (c.video) expect(es.video?.caption ?? es.video?.label, `${c.slug}.video`).toBeDefined();
      if (c.credits) expect(es.credits, `${c.slug}.credits`).toBeDefined();
      expect(es.contributions.length, `${c.slug}.contributions`).toBe(c.contributions.length);
    });

    it(`${c.slug}: the prose is actually Spanish`, () => {
      const study = getCaseStudy(c.slug, "es")!;
      for (const field of ["tagline", "impact", "context"] as const) {
        expect(study[field], `${c.slug}.${field}`).not.toBe(c[field]);
        expect(study[field].trim().length, `${c.slug}.${field}`).toBeGreaterThan(20);
      }
      study.gallery?.forEach((g, i) =>
        expect(g.alt, `${c.slug}.gallery[${i}].alt`).not.toBe(c.gallery![i].alt),
      );
      study.process?.forEach((p, i) =>
        expect(p.body, `${c.slug}.process[${i}]`).not.toBe(c.process![i].body),
      );
    });

    it(`${c.slug}: facts stay facts`, () => {
      const study = getCaseStudy(c.slug, "es")!;
      expect(study.num).toBe(c.num);
      expect(study.slug).toBe(c.slug);
      expect(study.video?.mp4).toBe(c.video?.mp4);
      expect(study.gallery?.map((g) => g.src)).toEqual(c.gallery?.map((g) => g.src));
      expect(study.links?.map((l) => l.href)).toEqual(c.links?.map((l) => l.href));
      expect(study.externalLink?.href).toBe(c.externalLink?.href);
      expect(study.features?.map((f) => f.kind)).toEqual(c.features?.map((f) => f.kind));
    });
  }

  it("keeps the English list order", () => {
    expect(getCaseStudies("es").map((c) => c.slug)).toEqual(caseStudies.map((c) => c.slug));
  });
});

describe("the CV in Spanish", () => {
  it("every experience has a Spanish summary, and its bullets pair up", () => {
    for (const e of experiences) {
      const es = experiencesEs[e.id];
      expect(es, e.id).toBeDefined();
      expect(es.summary, e.id).not.toBe(e.summary);
      if (e.impact) expect(es.impact?.length, `${e.id}.impact`).toBe(e.impact.length);
    }
  });

  it("every skill group keeps its items and its emphasis", () => {
    for (const g of skills) {
      expect(skillsEs[g.id].items.length, g.id).toBe(g.items.length);
    }
    const es = getCv("es").skills;
    expect(es.map((g) => g.items.map((i) => Boolean(i.primary)))).toEqual(
      skills.map((g) => g.items.map((i) => Boolean(i.primary))),
    );
  });

  it("dates and companies are untouched", () => {
    const es = getCv("es").experiences;
    expect(es.map((e) => [e.id, e.start, e.end, e.company.name])).toEqual(
      experiences.map((e) => [e.id, e.start, e.end, e.company.name]),
    );
  });
});

describe("site, sections, letter and quotes", () => {
  it("the identity is the same fact in both languages", () => {
    expect(getSite("es").headline).toBe(getSite("en").headline);
    expect(getSite("es").email).toBe(getSite("en").email);
    expect(getSite("es").summary).not.toBe(getSite("en").summary);
  });

  it("each language hands out its own CV", () => {
    expect(getSite("es").cv.pdf).toBe("/cv/doug-vargas-cv-es.pdf");
    expect(getSite("en").cv.pdf).toBe("/cv/doug-vargas-cv.pdf");
    expect(getSite("en").cv.path).toBe("/en/cv");
  });

  it("panel ids and numbers survive the switch, so an anchor does too", () => {
    expect(getSections("es").map((s) => [s.id, s.num])).toEqual(sections.map((s) => [s.id, s.num]));
  });

  it("the letter is written in both", () => {
    expect(getCoverLetter("es").paragraphs.length).toBe(getCoverLetter("en").paragraphs.length);
    expect(getCoverLetter("es").salutation).not.toBe(getCoverLetter("en").salutation);
  });

  it("a quote is never translated — only what frames it", () => {
    for (const t of testimonials) {
      const es = getTestimonial(t.id, "es")!;
      expect(es.quote).toBe(t.quote);
      expect(es.author.name).toBe(t.author.name);
    }
  });
});

describe("locale paths", () => {
  it("map a path into each tree and back", () => {
    expect(localePath("es", "/work/olbo")).toBe("/work/olbo");
    expect(localePath("en", "/work/olbo")).toBe("/en/work/olbo");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/#work")).toBe("/en#work");
    expect(splitLocale("/en/work/olbo")).toEqual({ locale: "en", path: "/work/olbo" });
    expect(splitLocale("/en")).toEqual({ locale: "en", path: "/" });
    expect(splitLocale("/cv")).toEqual({ locale: "es", path: "/cv" });
    // A Spanish path that merely starts with "en" is still Spanish.
    expect(splitLocale("/encuesta")).toEqual({ locale: "es", path: "/encuesta" });
  });

  it("pair every page with its twin, Spanish as the default", () => {
    expect(alternatesFor("en", "/cv")).toEqual({
      canonical: "/en/cv",
      languages: { es: "/cv", en: "/en/cv", "x-default": "/cv" },
    });
  });
});
