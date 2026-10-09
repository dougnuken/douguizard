"use client";

import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import DeviceMockup, { type DeviceMockupProps } from "./DeviceMockup";

/** One screen in the gallery. Same contract as the frame, minus what the gallery owns. */
export interface MockupItem
  extends Omit<DeviceMockupProps, "delay" | "animate" | "className"> {
  /** Stable key. Falls back to `src` when omitted. */
  id?: string;
}

type Columns = 1 | 2 | 3 | 4 | 5;

export interface MockupGalleryProps {
  items: MockupItem[];
  /**
   * Something to open the row with, ahead of the stills — a walkthrough in the
   * same phone frame. It takes the first cell, the first rail stop and the
   * first column count, so a clip and its stills read as one set of screens
   * rather than as a video with a gallery stapled under it.
   */
  lead?: ReactNode;
  /** Desktop column count. Inferred from the number of cells when omitted. */
  columns?: Columns;
  /** Alternating vertical offset on desktop so the row is not a flat strip. Default `true`. */
  stagger?: boolean;
  /** Mobile behaviour: a snap rail (default) or a plain vertical stack. */
  mobile?: "rail" | "stack";
  /** Optional mono hint rendered under the rail on mobile only, e.g. "Swipe →". */
  hint?: string;
  /** Reveal is staggered by this much per item, capped so the last one is not late. */
  stepDelay?: number;
  className?: string;
  /** Accessible name for the list of screens. */
  ariaLabel?: string;
}

/** Static strings only — Tailwind v4 scans source text, it cannot see computed classes. */
const GRID_COLS: Record<Columns, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
  // Five handsets fit one row from `lg`; below it they settle into three
  // across, which still beats four-and-a-stray.
  5: "md:grid-cols-3 lg:grid-cols-5",
};

/** Per-column `sizes`, so next/image never downloads a 1179px file for a 300px slot. */
const SIZES: Record<Columns, string> = {
  1: "(max-width: 767px) 70vw, 380px",
  2: "(max-width: 767px) 70vw, (max-width: 1279px) 44vw, 420px",
  3: "(max-width: 767px) 70vw, (max-width: 1279px) 30vw, 340px",
  4: "(max-width: 767px) 70vw, (max-width: 1279px) 42vw, 300px",
  5: "(max-width: 767px) 70vw, (max-width: 1023px) 30vw, (max-width: 1279px) 18vw, 260px",
};

/**
 * Wide columns (1–2 up) center the device; 3–4 up stay left-aligned so the
 * stagger reads as a composition instead of a centered row.
 */
const ALIGN: Record<Columns, string> = {
  1: "md:mx-auto",
  2: "md:mx-auto",
  3: "",
  4: "",
  5: "",
};

const MAX_DELAY = 0.28;

function resolveColumns(count: number, override?: Columns): Columns {
  if (override) return override;
  if (count <= 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  if (count === 5) return 5;
  return 4;
}

/**
 * Gallery of phone screens for a case study.
 *
 * Mobile: a horizontal snap rail that scrolls **inside its own box** — the
 * scroller is `w-full` with no negative margins, so the page itself can never
 * overflow horizontally.
 * Desktop (`md+`): a grid with an alternating vertical offset, so three or four
 * devices read as an editorial composition instead of a product-page strip.
 */
export default function MockupGallery({
  items,
  lead,
  columns,
  stagger = true,
  mobile = "rail",
  hint,
  stepDelay = 0.08,
  className = "",
  ariaLabel = "Product screens",
}: MockupGalleryProps) {
  if (items.length === 0 && !lead) return null;

  /** The lead takes a cell like any still, so it counts toward the columns and the stagger. */
  const offset = lead ? 1 : 0;
  const cols = resolveColumns(items.length + offset, columns);
  const isRail = mobile === "rail";

  const listClass = twMerge(
    "m-0 list-none p-0",
    isRail
      ? "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      : "grid grid-cols-1 gap-12",
    "md:grid md:snap-none md:gap-x-8 md:gap-y-12 md:overflow-x-visible md:pb-0",
    "focus-visible:[outline:2px_solid_var(--ink)] focus-visible:[outline-offset:4px]",
    GRID_COLS[cols],
    className
  );

  const itemClass = isRail
    ? "shrink-0 basis-[70vw] max-w-[290px] snap-start md:max-w-none md:basis-auto"
    : "";

  return (
    <div className="w-full">
      <ul className={listClass} aria-label={ariaLabel} tabIndex={isRail && !lead ? 0 : undefined}>
        {lead && (
          <li className={itemClass}>
            <div className={twMerge("w-full max-w-[420px]", ALIGN[cols])}>{lead}</div>
          </li>
        )}
        {items.map((item, i) => {
          const cell = i + offset;
          const drop = stagger && cell % 2 === 1 ? "md:mt-14" : "md:mt-0";
          return (
            <li key={item.id ?? item.src} className={`${itemClass} ${drop}`}>
              <DeviceMockup
                {...item}
                className={ALIGN[cols]}
                sizes={item.sizes ?? SIZES[cols]}
                delay={Math.min(cell * stepDelay, MAX_DELAY)}
              />
            </li>
          );
        })}
      </ul>

      {isRail && hint && (
        <p className="kicker mt-1 md:hidden" aria-hidden>
          {hint}
        </p>
      )}
    </div>
  );
}
