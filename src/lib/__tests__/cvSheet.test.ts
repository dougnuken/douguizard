import { describe, expect, it } from "vitest";
import { getCv } from "@/data/cv";
import { getSite } from "@/data/site";
import { renderCvSheet } from "@/lib/cvSheet";

/**
 * The printed CV is a view of the data, never a copy of it: every bullet, date
 * and employer in `cv.ts` has to reach the sheet, in both languages, and the
 * layout has to stay one tracker-readable column.
 */
const assets = { fontCss: "", photo: "data:image/jpeg;base64,AA==" };
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"');

describe.each(["es", "en"] as const)("the CV sheet (%s)", (locale) => {
  const html = renderCvSheet(locale, assets);
  const text = decode(html);
  const cv = getCv(locale);

  it("prints every bullet and every role", () => {
    for (const e of cv.experiences) {
      expect(text, e.id).toContain(e.role);
      for (const b of e.impact ?? []) expect(text, e.id).toContain(b.replace(/\*\*/g, ""));
    }
  });

  it("dates every role as MM/YYYY", () => {
    for (const e of cv.experiences) {
      const start = `${String(e.start.month).padStart(2, "0")}/${e.start.year}`;
      expect(text, e.id).toContain(start);
    }
  });

  it("leads with the employer of record when there is one", () => {
    for (const e of cv.experiences.filter((x) => x.employer)) {
      expect(text).toContain(`<strong>${e.employer}</strong> (${e.company.name})`);
    }
  });

  it("carries the profile, the contact and the photo", () => {
    const site = getSite(locale);
    for (const h of cv.profile.highlights) expect(text).toContain(h);
    expect(text).toContain(site.email);
    expect(text).toContain(site.headline);
    expect(html).toContain('class="photo"');
    expect(html).toContain(`lang="${locale}"`);
  });

  it("stays one column: no tables, no CSS columns, no grid", () => {
    expect(html).not.toMatch(/<table/i);
    expect(html).not.toMatch(/column-count|columns\s*:|display:\s*grid/i);
  });
});

it("drops the photo when none is given", () => {
  expect(renderCvSheet("es", { fontCss: "" })).not.toContain('class="photo"');
});
