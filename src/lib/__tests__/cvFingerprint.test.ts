import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cvFingerprint } from "@/lib/cvFingerprint";

/**
 * The guard on the downloadable CVs.
 *
 * `public/cv/doug-vargas-cv.pdf` (English) and `doug-vargas-cv-es.pdf`
 * (Spanish) are committed artefacts, and a committed artefact drifts. The CV
 * Doug was still handing out in 2026 had him at Mercadolibre "Present" with no
 * Naowee on it — the file could not tell it had fallen behind. This test is how
 * it tells: change a date, a role, a bullet or a profile, in either language,
 * and it fails until someone runs the generator again.
 *
 *   npm run build && npx next start -p 4173 &
 *   npm run cv:pdf
 */
const SHEETS = [
  { locale: "en", stamp: "public/cv/cv.stamp.json" },
  { locale: "es", stamp: "public/cv/cv.stamp.es.json" },
] as const;

describe.each(SHEETS)("the downloadable CV ($locale)", ({ locale, stamp: path }) => {
  const stamp = JSON.parse(readFileSync(path, "utf8"));

  it("was generated from the CV data as it stands now", () => {
    expect(
      stamp.fingerprint,
      "The CV data changed after the PDF was generated. Rebuild it with `npm run cv:pdf` against a running server.",
    ).toBe(cvFingerprint(locale));
  });

  // Three since the spacing rewrite. The old two-page budget was paid for in
  // leading, which is what made the sheet unreadable.
  it("still fits the three-page budget", () => {
    expect(stamp.pages).toBeLessThanOrEqual(3);
  });
});

it("the two languages are different sheets", () => {
  expect(cvFingerprint("es")).not.toBe(cvFingerprint("en"));
});
