import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudies } from "@/data/work";
import {
  LEAD_PHONES_MAX,
  LEAD_PHONES_SPLIT,
  balanceColumns,
  hasShowcase,
  planCaseMedia,
  shotNumber,
  type GalleryItem,
  type Shot,
} from "@/lib/caseMedia";

const shots = (n: number): GalleryItem[] =>
  Array.from({ length: n }, (_, i) => ({ src: `/work/x/s${i + 1}.webp`, alt: `Screen ${i + 1}` }));

const clip = { mp4: "/work/x/clip.mp4", poster: "/work/x/poster.jpg", label: "Clip", width: 786, height: 1704 };

describe("planCaseMedia — the invariant", () => {
  // Every real case, in both languages: whatever the copy does to the
  // galleries, no screen may be dropped, repeated or reordered by the split.
  for (const locale of ["en", "es"] as const) {
    for (const study of getCaseStudies(locale)) {
      it(`${locale}/${study.slug}: every still appears once, in order, numbered by its place`, () => {
        const plan = planCaseMedia(study);
        const shown = [...plan.lead, ...plan.rest];
        expect(shown.map((s) => s.item.src)).toEqual((study.gallery ?? []).map((g) => g.src));
        expect(shown.map((s) => s.num)).toEqual(shown.map((_, i) => i + 1));
      });
    }
  }

  it("every case with any media opens on it", () => {
    for (const study of caseStudies) {
      const hasMedia = Boolean(study.video) || Boolean(study.gallery?.length);
      expect(hasShowcase(planCaseMedia(study)), study.slug).toBe(hasMedia);
    }
  });
});

describe("planCaseMedia — the rules", () => {
  it("a browser walkthrough opens alone and leaves every still for later", () => {
    const plan = planCaseMedia({ galleryKind: "browser", video: clip, gallery: shots(6) });
    expect(plan.videoKind).toBe("browser");
    expect(plan.lead).toHaveLength(0);
    expect(plan.rest).toHaveLength(6);
  });

  it("a phone walkthrough shares one row of handsets with the first stills", () => {
    const fits = planCaseMedia({ video: clip, gallery: shots(LEAD_PHONES_MAX - 1) });
    expect(fits.videoKind).toBe("phone");
    expect(fits.rest).toHaveLength(0);
    // The clip takes a cell, so a row holds one still fewer.
    const long = planCaseMedia({ video: clip, gallery: shots(6) });
    expect(long.lead.map((s) => s.num)).toEqual([1, 2, 3, 4].slice(0, LEAD_PHONES_MAX - 1));
    expect(long.rest[0].num).toBe(LEAD_PHONES_MAX);
  });

  it("a phone walkthrough of a desktop product opens beside the first desktop screen", () => {
    const plan = planCaseMedia({ galleryKind: "browser", videoKind: "phone", video: clip, gallery: shots(6) });
    expect(plan.lead.map((s) => s.num)).toEqual([1]);
    expect(plan.rest[0].num).toBe(2);
  });

  it("a short phone gallery with no walkthrough opens whole", () => {
    expect(planCaseMedia({ gallery: shots(LEAD_PHONES_MAX) }).rest).toHaveLength(0);
    const long = planCaseMedia({ gallery: shots(LEAD_PHONES_MAX + 2) });
    expect(long.lead).toHaveLength(LEAD_PHONES_SPLIT);
    expect(long.rest[0].num).toBe(LEAD_PHONES_SPLIT + 1);
  });

  it("a desktop or artboard gallery with no walkthrough opens on its first screen", () => {
    for (const galleryKind of ["browser", "plain"] as const) {
      const plan = planCaseMedia({ galleryKind, gallery: shots(3) });
      expect(plan.lead.map((s) => s.num), galleryKind).toEqual([1]);
      expect(plan.rest.map((s) => s.num), galleryKind).toEqual([2, 3]);
    }
  });

  it("a clip with no poster borrows the first still, and with neither it is dropped", () => {
    const { poster: _omit, ...bare } = clip;
    void _omit;
    expect(planCaseMedia({ video: bare, gallery: shots(1) }).video?.poster).toBe("/work/x/s1.webp");
    const nothing = planCaseMedia({ video: bare });
    expect(nothing.video).toBeUndefined();
    expect(hasShowcase(nothing)).toBe(false);
  });

  it("a plain gallery's walkthrough defaults to the browser window", () => {
    expect(planCaseMedia({ galleryKind: "plain", video: clip }).videoKind).toBe("browser");
  });

  it("numbers stills with two digits", () => {
    expect(shotNumber(3)).toBe("03");
    expect(shotNumber(12)).toBe("12");
  });
});

describe("balanceColumns", () => {
  const sized = (dims: [number, number][]): Shot[] =>
    dims.map(([width, height], i) => ({
      item: { src: `/work/x/s${i + 1}.webp`, alt: `Screen ${i + 1}`, width, height },
      num: i + 1,
    }));
  // A column's height, in column widths, as the split estimates it.
  const tall = (column: Shot[]) =>
    column.reduce((sum, { item }) => sum + item.height! / item.width! + 0.1, 0);
  const nums = (column: Shot[]) => column.map((s) => s.num);

  // Every real plain gallery, in both languages: the split may move a screen
  // to the other column, never drop, repeat or reorder one within a column.
  for (const locale of ["en", "es"] as const) {
    for (const study of getCaseStudies(locale).filter((s) => s.galleryKind === "plain")) {
      it(`${locale}/${study.slug}: every still once, each column in order, the first top left`, () => {
        const { rest } = planCaseMedia(study);
        const [left, right] = balanceColumns(rest);
        expect([...nums(left), ...nums(right)].sort((a, b) => a - b)).toEqual(nums(rest));
        for (const column of [left, right]) {
          expect(nums(column)).toEqual([...nums(column)].sort((a, b) => a - b));
        }
        expect(left[0]).toBe(rest[0]);
      });
    }
  }

  it("evens out what no single cut can: one tall board among short ones", () => {
    // Banco de Occidente's gallery band. The best cut CSS columns could make
    // left ~1.1 column widths (~760px) between the two.
    const shots = sized([
      [1510, 1461], [1784, 1218], [1784, 1218], [2033, 2340],
      [1786, 795], [1203, 709], [1569, 804], [1965, 1053],
    ]);
    const [left, right] = balanceColumns(shots);
    expect(Math.abs(tall(left) - tall(right))).toBeLessThan(0.1);
  });

  it("keeps the authored cut when it is already the even one", () => {
    // Qrvey: four short boards, then the 2000×3543 scenario on its own.
    const shots = sized([[2000, 1200], [2000, 682], [2000, 583], [2000, 1040], [2000, 3543]]);
    const [left, right] = balanceColumns(shots);
    expect(nums(left)).toEqual([1, 2, 3, 4]);
    expect(nums(right)).toEqual([5]);
  });

  it("handles no still and one still", () => {
    expect(balanceColumns([])).toEqual([[], []]);
    const one = sized([[1000, 800]]);
    expect(balanceColumns(one)).toEqual([one, []]);
  });
});
