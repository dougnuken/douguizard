import type { CaseStudy } from "@/data/work";

export type GalleryItem = NonNullable<CaseStudy["gallery"]>[number];
export type FrameKind = NonNullable<CaseStudy["galleryKind"]>;
export type VideoKind = NonNullable<CaseStudy["videoKind"]>;

/** A gallery item and its 1-based position in the case's gallery. */
export interface Shot {
  item: GalleryItem;
  /**
   * Where the screen sits in `gallery`, not in the band that renders it. The
   * "01" eyebrow is printed from this, so a screen keeps its number whether it
   * opens the page or turns up further down — the count never restarts.
   */
  num: number;
}

export interface CaseMediaPlan {
  galleryKind: FrameKind;
  videoKind: VideoKind;
  /** The walkthrough, with its poster resolved. Absent when there is nothing to show before it plays. */
  video?: NonNullable<CaseStudy["video"]> & { poster: string };
  /** Stills that open the page, beside the video or in place of it. */
  lead: Shot[];
  /** Every other still, in order, for the gallery band further down. */
  rest: Shot[];
}

/**
 * Handsets in the showcase row. Five is one row on a desktop and one swipe
 * rail on a phone; a phone gallery that fits opens the page whole, because
 * splitting it would only strand a lone screen halfway down the page. A phone
 * walkthrough takes the first cell of the same row.
 */
export const LEAD_PHONES_MAX = 5;

/** A longer phone gallery opens on one full row and keeps the rest for later. */
export const LEAD_PHONES_SPLIT = 4;

/**
 * What a case shows first, and what it keeps for later.
 *
 * The case page shows before it tells: the product goes straight under the
 * hero, and the screens that do not fit there come back after the argument.
 * This decides the split, once, as a pure function — so the one rule that
 * matters, that every screen appears exactly once and in its authored order,
 * is something a unit test can hold rather than something a layout implies.
 *
 * - **Browser walkthrough** — a landscape window already runs the full
 *   measure, so it opens alone and every still waits for the gallery.
 * - **Phone walkthrough, phone stills** — the clip and up to four stills
 *   share one row of handsets, the first one moving.
 * - **Phone walkthrough, desktop stills** — the clip beside the first desktop
 *   screen: the same product on both of the devices it runs on.
 * - **No walkthrough** — a short phone gallery opens whole; a desktop or
 *   artboard gallery opens on its first screen.
 *
 * Nothing here knows about any one case: reorder a gallery in `work.ts` and
 * whatever is first is what opens the page.
 */
export function planCaseMedia(
  study: Pick<CaseStudy, "gallery" | "galleryKind" | "video" | "videoKind">,
): CaseMediaPlan {
  const gallery = study.gallery ?? [];
  const shots: Shot[] = gallery.map((item, i) => ({ item, num: i + 1 }));

  const galleryKind = study.galleryKind ?? "phone";
  const videoKind = study.videoKind ?? (galleryKind === "plain" ? "browser" : galleryKind);

  // A video needs something to show before it plays. Falling back to the first
  // gallery frame means a case can ship a clip without also authoring a poster.
  const poster = study.video?.poster ?? gallery[0]?.src;
  const video = study.video && poster ? { ...study.video, poster } : undefined;

  let leadCount: number;
  if (video) {
    if (videoKind === "browser") leadCount = 0;
    else if (galleryKind === "phone") leadCount = LEAD_PHONES_MAX - 1;
    else leadCount = 1;
  } else if (galleryKind === "phone") {
    leadCount = shots.length <= LEAD_PHONES_MAX ? shots.length : LEAD_PHONES_SPLIT;
  } else {
    leadCount = 1;
  }
  leadCount = Math.min(leadCount, shots.length);

  return {
    galleryKind,
    videoKind,
    video,
    lead: shots.slice(0, leadCount),
    rest: shots.slice(leadCount),
  };
}

/** True when the plan has anything at all to put at the top of the page. */
export function hasShowcase(plan: CaseMediaPlan): boolean {
  return Boolean(plan.video) || plan.lead.length > 0;
}

/** `7` → `"07"`: the eyebrow every still carries. */
export function shotNumber(num: number): string {
  return String(num).padStart(2, "0");
}
