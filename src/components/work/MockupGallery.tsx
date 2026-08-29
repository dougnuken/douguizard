"use client";

import { twMerge } from "tailwind-merge";
import DeviceMockup, { type DeviceMockupProps } from "./DeviceMockup";

/** One screen in the gallery. Same contract as the frame, minus what the gallery owns. */
export interface MockupItem
  extends Omit<DeviceMockupProps, "delay" | "animate" | "className"> {
  /** Stable key. Falls back to `src` when omitted. */
  id?: string;
}

export interface MockupGalleryProps {
  items: MockupItem[];
  /** Desktop column count. Inferred from `items.length` when omitted. */
  columns?: 1 | 2 | 3 | 4;
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
const GRID_COLS: Record<1 | 2 | 3 | 4, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/** Per-column `sizes`, so next/image never downloads a 1179px file for a 300px slot. */
const SIZES: Record<1 | 2 | 3 | 4, string> = {
  1: "(max-width: 767px) 70vw, 380px",
  2: "(max-width: 767px) 70vw, (max-width: 1279px) 44vw, 420px",
  3: "(max-width: 767px) 70vw, (max-width: 1279px) 30vw, 340px",
  4: "(max-width: 767px) 70vw, (max-width: 1279px) 42vw, 300px",
};

/**
 * Wide columns (1–2 up) center the device; 3–4 up stay left-aligned so the
 * stagger reads as a composition instead of a centered row.
 */
const ALIGN: Record<1 | 2 | 3 | 4, string> = {
  1: "md:mx-auto",
  2: "md:mx-auto",
  3: "",
  4: "",
};

const MAX_DELAY = 0.28;

function resolveColumns(count: number, override?: 1 | 2 | 3 | 4): 1 | 2 | 3 | 4 {
  if (override) return override;
  if (count <= 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
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
  columns,
  stagger = true,
  mobile = "rail",
  hint,
  stepDelay = 0.08,
  className = "",
  ariaLabel = "Product screens",
}: MockupGalleryProps) {
  if (items.length === 0) return null;

  const cols = resolveColumns(items.length, columns);
  const isRail = mobile === "rail";

  const listClass = twMerge(
    "m-0 list-none p-0",
    isRail
      ? "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      : "grid grid-cols-1 gap-12",
    "md:grid md:snap-none md:gap-x-8 md:gap-y-12 md:overflow-x-visible md:pb-0",
    GRID_COLS[cols],
    className
  );

  const itemClass = isRail
    ? "shrink-0 basis-[70vw] max-w-[290px] snap-start md:max-w-none md:basis-auto"
    : "";

  return (
    <div className="w-full">
      <ul className={listClass} aria-label={ariaLabel}>
        {items.map((item, i) => {
          const offset = stagger && i % 2 === 1 ? "md:mt-14" : "md:mt-0";
          return (
            <li key={item.id ?? item.src} className={`${itemClass} ${offset}`}>
              <DeviceMockup
                {...item}
                className={ALIGN[cols]}
                sizes={item.sizes ?? SIZES[cols]}
                delay={Math.min(i * stepDelay, MAX_DELAY)}
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
