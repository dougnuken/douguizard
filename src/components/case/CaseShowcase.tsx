"use client";

import type { ReactNode } from "react";
import BrowserFrame from "@/components/work/BrowserFrame";
import MockupGallery from "@/components/work/MockupGallery";
import { useDict } from "@/i18n/LocaleProvider";
import type { CaseMediaPlan, Shot } from "@/lib/caseMedia";
import { shotNumber } from "@/lib/caseMedia";
import {
  PlainLead,
  WalkthroughCaption,
  WalkthroughVideo,
  browserLabel,
  toMockupItems,
} from "./caseFrames";
import { Band } from "./primitives";

/** Full-measure desktop still: the band's 1400px, less its gutters. */
const SIZES_FULL = "(max-width: 767px) 92vw, (max-width: 1479px) 92vw, 1344px";
/** The wide column beside a phone walkthrough — three quarters of the band. */
const SIZES_BESIDE_PHONE = "(max-width: 1023px) 92vw, (max-width: 1479px) 68vw, 980px";

/** A desktop or artboard still beside a phone walkthrough. */
function Companion({ shot, kind }: { shot: Shot; kind: "browser" | "plain" }) {
  if (kind === "plain") return <PlainLead shot={shot} sizes={SIZES_BESIDE_PHONE} />;
  return (
    <BrowserFrame
      src={shot.item.src}
      alt={shot.item.alt}
      caption={shot.item.caption}
      eyebrow={shotNumber(shot.num)}
      label={browserLabel(shot.item.src)}
      sizes={SIZES_BESIDE_PHONE}
      priority
    />
  );
}

/**
 * The product, straight under the hero — show first, tell after.
 *
 * This band used to close the page, after two thousand words of argument; a
 * reader skimming for a minute never reached it, and the case read as a wall
 * of text with screenshots attached. It now opens the case, so the first
 * screen of every case with media carries the hero and the top of the product.
 *
 * What goes in it is decided by `planCaseMedia`, not here: this only frames
 * the plan. The stills it does not take come back in `CaseGallery`, numbered
 * from where they stand in the case's gallery, so "03" is the third screen
 * wherever it is printed.
 *
 * The section heading is for the outline only. A visible eyebrow above the
 * product would be a label on the thing the reader is already looking at.
 */
export default function CaseShowcase({ project, plan }: { project: string; plan: CaseMediaPlan }) {
  const t = useDict().case;
  const { video, videoKind, galleryKind, lead } = plan;
  const ariaLabel = t.productScreens(project);

  let body: ReactNode = null;

  if (video && videoKind === "browser") {
    // Landscape capture (16:10). It cannot live in the column a phone uses — at
    // that width a desktop UI stops being legible — so it runs the measure.
    body = <WalkthroughVideo video={video} kind="browser" />;
  } else if (video && galleryKind === "phone") {
    // The clip is the first handset in the row: on a desktop, the phones side
    // by side, the first one moving; on a phone, the first stop of the same
    // swipe rail the stills use.
    body = (
      <MockupGallery
        ariaLabel={ariaLabel}
        hint={t.swipe}
        lead={<WalkthroughVideo video={video} kind="phone" />}
        items={toMockupItems(lead)}
      />
    );
  } else if (video) {
    // A phone clip of a desktop product (DC Medical: the secretary dictates on
    // her phone, then works the panel at the desk). The two devices sit side
    // by side at the same height — the phone a quarter of the measure, the
    // window the rest — and stack, phone first, below `lg`.
    const companion = lead[0];
    body = (
      <div
        className={
          companion
            ? "grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-12"
            : "mx-auto max-w-[400px]"
        }
      >
        <div className="mx-auto w-full max-w-[320px] lg:max-w-none">
          <WalkthroughVideo video={video} kind="phone" />
        </div>
        {companion && <Companion shot={companion} kind={galleryKind === "plain" ? "plain" : "browser"} />}
      </div>
    );
  } else if (galleryKind === "phone") {
    body = (
      <MockupGallery
        ariaLabel={ariaLabel}
        hint={t.swipe}
        items={toMockupItems(lead).map((item, i) => ({ ...item, priority: i === 0 }))}
      />
    );
  } else if (lead[0] && galleryKind === "browser") {
    const [shot] = lead;
    body = (
      <BrowserFrame
        src={shot.item.src}
        alt={shot.item.alt}
        caption={shot.item.caption}
        eyebrow={shotNumber(shot.num)}
        label={browserLabel(shot.item.src)}
        sizes={SIZES_FULL}
        priority
      />
    );
  } else if (lead[0]) {
    body = <PlainLead shot={lead[0]} sizes={SIZES_FULL} />;
  }

  if (!body) return null;

  return (
    <Band tone="raised" rule="t" wide className="py-10 md:py-14">
      <h2 className="sr-only">{t.product}</h2>
      {body}
      {video && <WalkthroughCaption caption={video.caption} />}
    </Band>
  );
}
