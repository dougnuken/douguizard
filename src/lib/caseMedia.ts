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

/**
 * A caption and the gap under it, as a fraction of the column's width — about
 * 70px on a desktop column, which is what one caption line, its 12px top
 * margin and the 24px between cards add up to.
 */
const CAPTION_ALLOWANCE = 0.1;

/**
 * What one screen out of authored order costs, in column widths. A tenth of a
 * column (~70px) of uneven bottom edge is worth it to keep a screen in order;
 * a hole the height of a whole card is not.
 */
const ORDER_COST = 0.1;

/** Past this many stills the exhaustive split below stops being instant. */
const SPLIT_SEARCH_MAX = 14;

/**
 * Two columns of artboards, as near the same height as the screens allow.
 *
 * A plain gallery's cards run from 0.56:1 to 3.4:1, and CSS columns alone fill
 * the first column and then the second, in order — so the only freedom they
 * have is WHERE to cut the list. On Banco de Occidente every cut left one
 * column ~760px short of the other. Choosing which column each card goes to,
 * not just where the list is cut, closes that to ~40px.
 *
 * Each card's height is known before anything loads: the column's width over
 * the screen's ratio, plus its caption. Every assignment is tried (galleries
 * are short), keeping each column's cards in authored order, and the one kept
 * minimises the difference in height plus a small cost for every screen that
 * ends up higher on the page than one numbered before it — so the eye still
 * meets 02, 03, 04 roughly top to bottom.
 *
 * The first card always opens the left column. Pure, so a test holds both
 * rules: every still appears exactly once, and each column keeps its order.
 */
export function balanceColumns(shots: Shot[]): [Shot[], Shot[]] {
  const heights = shots.map(
    ({ item }) => (item.height ?? 836) / (item.width ?? 1238) + CAPTION_ALLOWANCE,
  );
  const n = shots.length;
  if (n < 2) return [shots, []];

  // Too many to try every split: fall back to the best single cut, which is
  // what CSS columns would have chosen anyway.
  if (n > SPLIT_SEARCH_MAX) {
    const total = heights.reduce((a, b) => a + b, 0);
    let cut = 1;
    let run = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < n - 1; i++) {
      run += heights[i];
      const diff = Math.abs(total - 2 * run);
      if (diff < bestDiff) [bestDiff, cut] = [diff, i + 1];
    }
    return [shots.slice(0, cut), shots.slice(cut)];
  }

  let best = { cost: Infinity, mask: 0 };
  // Bit i-1 set: card i goes right. Card 0 is always left.
  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    const tops = [0];
    let left = heights[0];
    let right = 0;
    for (let i = 1; i < n; i++) {
      if (mask & (1 << (i - 1))) {
        tops.push(right);
        right += heights[i];
      } else {
        tops.push(left);
        left += heights[i];
      }
    }
    let outOfOrder = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) if (tops[j] < tops[i] - 1e-9) outOfOrder++;
    }
    const cost = Math.abs(left - right) + ORDER_COST * outOfOrder;
    if (cost < best.cost) best = { cost, mask };
  }

  const left: Shot[] = [];
  const right: Shot[] = [];
  shots.forEach((shot, i) => (i > 0 && best.mask & (1 << (i - 1)) ? right : left).push(shot));
  return [left, right];
}

/** `7` → `"07"`: the eyebrow every still carries. */
export function shotNumber(num: number): string {
  return String(num).padStart(2, "0");
}
