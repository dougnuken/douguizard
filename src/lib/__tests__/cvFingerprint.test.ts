import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cvFingerprint } from "@/lib/cvFingerprint";

/**
 * The guard on the downloadable CV.
 *
 * `public/cv/doug-vargas-cv.pdf` is a committed artefact, and a committed
 * artefact drifts. The CV Doug was still handing out in 2026 had him at
 * Mercadolibre "Present" with no Naowee on it — the file could not tell it had
 * fallen behind. This test is how it tells: change a date, a role, a bullet or
 * a profile and it fails until someone runs the generator again.
 *
 *   npm run build && npx next start -p 4173 &
 *   npm run cv:pdf
 */
describe("the downloadable CV", () => {
  const stamp = JSON.parse(readFileSync("public/cv/cv.stamp.json", "utf8"));

  it("was generated from the CV data as it stands now", () => {
    expect(
      stamp.fingerprint,
      "The CV data changed after the PDF was generated. Rebuild it with `npm run cv:pdf` against a running server.",
    ).toBe(cvFingerprint());
  });

  it("still fits the two-page budget", () => {
    expect(stamp.pages).toBeLessThanOrEqual(2);
  });
});
