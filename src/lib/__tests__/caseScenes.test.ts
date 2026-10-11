import { describe, expect, it } from "vitest";
import scenesJson from "@/data/scenes.generated.json";
import type { CaseStudy } from "@/data/work";
import { SCENE_BAND_MAX, getCaseScenes, planScenes, type CaseScene, type SceneEntry } from "../caseScenes";

const entry = (over: Partial<SceneEntry> = {}): SceneEntry => ({
  case: "demo",
  kind: "wide",
  src: "/x.webp",
  width: 100,
  height: 50,
  alt: { es: "alt es", en: "alt en" },
  caption: { es: "pie es", en: "pie en" },
  ...over,
});
const study = (scenes: string[]) => ({ slug: "demo", scenes }) as unknown as CaseStudy;
const sc = (id: string, kind: CaseScene["kind"]): CaseScene => ({ id, kind, src: "/x", width: 1, height: 1, alt: "a", caption: "c" });

describe("getCaseScenes", () => {
  const source = { a: entry(), _fixture: entry(), other: entry({ case: "x" }) };
  it("returns words in each language", () => {
    expect(getCaseScenes(study(["a"]), "es", source)[0]).toMatchObject({ alt: "alt es", caption: "pie es" });
    expect(getCaseScenes(study(["a"]), "en", source)[0]).toMatchObject({ alt: "alt en", caption: "pie en" });
  });
  it("is empty without scenes", () => {
    expect(getCaseScenes({ slug: "demo" } as CaseStudy, "es", source)).toEqual([]);
  });
  it("throws on unknown, fixture, wrong case and repeated ids", () => {
    expect(() => getCaseScenes(study(["nope"]), "es", source)).toThrow();
    expect(() => getCaseScenes(study(["_fixture"]), "es", source)).toThrow();
    expect(() => getCaseScenes(study(["other"]), "es", source)).toThrow();
    expect(() => getCaseScenes(study(["a", "a"]), "es", source)).toThrow();
  });
});

describe("planScenes", () => {
  it("picks the hero, one scene or none", () => {
    expect(planScenes([sc("h", "hero"), sc("w", "wide")]).hero?.id).toBe("h");
    expect(planScenes([sc("h", "hero")]).band).toEqual([]);
    expect(planScenes([]).hero).toBeUndefined();
    expect(() => planScenes([sc("h", "hero"), sc("g", "hero")])).toThrow();
  });
  it("caps the band", () => {
    const many = Array.from({ length: SCENE_BAND_MAX + 1 }, (_, i) => sc(`w${i}`, "wide"));
    expect(() => planScenes(many)).toThrow();
  });
  it("pairs two details and centres a lone one", () => {
    const pair = planScenes([sc("a", "detail"), sc("b", "detail")]).band;
    expect(pair.map((b) => [b.span, b.offset])).toEqual([[6, false], [6, false]]);
    const lone = planScenes([sc("w", "wide"), sc("a", "detail")]).band;
    expect(lone.map((b) => [b.span, b.offset])).toEqual([[12, false], [6, true]]);
    const three = planScenes([sc("a", "detail"), sc("b", "detail"), sc("c", "detail")]).band;
    expect(three.map((b) => b.offset)).toEqual([false, false, true]);
  });
});

describe("the real manifest", () => {
  it("has es and en words that differ", () => {
    for (const [id, e] of Object.entries(scenesJson as Record<string, SceneEntry>)) {
      for (const k of ["alt", "caption"] as const) {
        expect(e[k].es.trim().length, `${id}.${k}.es`).toBeGreaterThan(0);
        expect(e[k].en.trim().length, `${id}.${k}.en`).toBeGreaterThan(0);
        expect(e[k].es, `${id}.${k}`).not.toBe(e[k].en);
      }
    }
  });
});
