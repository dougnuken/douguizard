"use client";

import { BrowserGallery } from "@/components/work/BrowserFrame";
import MockupGallery from "@/components/work/MockupGallery";
import { useDict } from "@/i18n/LocaleProvider";
import type { FrameKind, Shot } from "@/lib/caseMedia";
import { PlainGallery, toBrowserShots, toMockupItems } from "./caseFrames";
import { Band, EyebrowHeading, type BandProps } from "./primitives";

/**
 * The stills the showcase did not take, after the argument they illustrate.
 *
 * Wider than the prose bands: four phones, or two browser windows side by
 * side, need real room. Numbers continue from the showcase — when "01" opened
 * the page, this band starts at "02".
 */
export default function CaseGallery({
  project,
  shots,
  kind,
  tone,
}: {
  project: string;
  shots: Shot[];
  kind: FrameKind;
  tone?: BandProps["tone"];
}) {
  const t = useDict().case;
  if (shots.length === 0) return null;
  const ariaLabel = t.productScreens(project);

  return (
    <Band tone={tone} rule="t" wide>
      <EyebrowHeading>{t.gallery}</EyebrowHeading>

      <div className="mt-10 md:mt-12">
        {kind === "browser" && (
          <BrowserGallery
            ariaLabel={ariaLabel}
            /* Two-up throughout when the count is even, one leader when it is
               odd. The full-bleed window already opened the page, so a second
               one here would spend a screen on hierarchy the showcase has
               settled; and screens that arrive in same-product pairs (Naowee)
               stay paired, row by row, instead of straddling two systems. */
            featureCount={shots.length % 2}
            items={toBrowserShots(shots)}
          />
        )}

        {kind === "plain" && <PlainGallery shots={shots} ariaLabel={ariaLabel} />}

        {kind === "phone" && <MockupGallery ariaLabel={ariaLabel} hint={t.swipe} items={toMockupItems(shots)} />}
      </div>
    </Band>
  );
}
