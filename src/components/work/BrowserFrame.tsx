"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { CSSProperties, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Intrinsic pixel size of the desktop captures we ship today
 * (1440×900 logical, taken at @2x → 2880×1800, a 1.6:1 window).
 * Exported so galleries and pages can reuse it without re-measuring.
 * Captures at other scale factors (e.g. the 2160×1350 one) share the ratio,
 * so they only need `width`/`height` overrides — the layout does not move.
 */
export const BROWSER_SOURCE = { width: 2880, height: 1800 } as const;

/**
 * Concentric frame geometry — outer radius minus bezel = inner radius, the same
 * rule `DeviceMockup` follows. The numbers are much smaller than the phone's
 * (46/8/38) on purpose: a 46px corner on a 1300px-wide window reads as a toy,
 * while a real desktop window sits around 10–14px.
 */
const BEZEL_PX = 6;
const OUTER_RADIUS_PX = 18;
const INNER_RADIUS_PX = OUTER_RADIUS_PX - BEZEL_PX;

/** Window-chrome treatment. `none` yields a bare, screen-only frame. */
export type BrowserChrome = "dots" | "none";

export interface BrowserFrameProps {
  /** Public path of the screenshot, e.g. `/work/naowee/ivc-bandeja.png`. */
  src: string;
  /** Real, descriptive alt text. Never decorative — these screens carry the argument. */
  alt: string;
  /** Intrinsic width of the source file. Defaults to the 2880×1800 captures. */
  width?: number;
  /** Intrinsic height of the source file. */
  height?: number;
  /**
   * Text for the address-bar slot. Not necessarily a URL — it is the cheapest
   * place to name the module a screen belongs to ("ivc · bandeja del coordinador").
   * Omit it and the bar collapses to chrome alone.
   */
  label?: string;
  /** Window chrome. Default `"dots"`. */
  chrome?: BrowserChrome;
  /** Small mono/uppercase label above the caption (e.g. "01"). */
  eyebrow?: string;
  /** Sentence-length caption. Renders a `<figcaption>` together with `eyebrow`. */
  caption?: ReactNode;
  /** `sizes` for next/image. Set it from the layout that owns the column widths. */
  sizes?: string;
  /** Above-the-fold only. */
  priority?: boolean;
  loading?: "eager" | "lazy";
  /** Stagger offset in seconds when several frames animate together. */
  delay?: number;
  /** Scroll-into-view reveal. Default `true`; always off under reduced motion. */
  animate?: boolean;
  /** Sober hover lift. Default `true`; always off under reduced motion. */
  interactive?: boolean;
  /** Ambient bloom behind the window. Default `true`. */
  halo?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
}

/**
 * Editorial browser window — the desktop sibling of `DeviceMockup`.
 *
 * Same materials as the phone frame, so the two never read as different
 * families: 1px `--color-line-strong` border, a bezel mixed from `--color-ink`
 * over `--color-bg-deep`, the same inset-highlight + two-layer shadow recipe,
 * and the same `--color-ink`-at-9% ambient bloom. Everything is expressed with
 * `var(--color-*)`, so it inverts correctly inside `.theme-dark` subtrees.
 *
 * The traffic lights are deliberately monochrome. Red/amber/green dots are the
 * single loudest tell of a stock mockup, and on this theme the one saturated
 * colour (`--color-accent`) is spent on argument, not on window decoration.
 */
export default function BrowserFrame({
  src,
  alt,
  width = BROWSER_SOURCE.width,
  height = BROWSER_SOURCE.height,
  label,
  chrome = "dots",
  eyebrow,
  caption,
  sizes = "(max-width: 767px) 92vw, (max-width: 1479px) 86vw, 1320px",
  priority = false,
  loading,
  delay = 0,
  animate = true,
  interactive = true,
  halo = true,
  className = "",
  frameClassName = "",
  style,
}: BrowserFrameProps) {
  const reduce = useReducedMotion() ?? false;
  const motionOn = animate && !reduce;
  const hoverOn = interactive && !reduce;
  const hasCaption = Boolean(eyebrow || caption);
  const hasChrome = chrome !== "none";

  return (
    <motion.figure
      // twMerge so a consumer's `max-w-*` / spacing beats the defaults.
      className={twMerge("m-0 flex w-full flex-col", className)}
      style={style}
      initial={motionOn ? { opacity: 0, y: 24 } : undefined}
      whileInView={motionOn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      // Shallower than the phone's -6: the window is a heavier object, and a
      // big surface travelling far reads as a card, not as a lift.
      whileHover={hoverOn ? { y: -4 } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {/* isolate → the bloom's negative z stays inside this box */}
      <div className="relative isolate">
        {halo && (
          /* Flatter and lower than the phone's halo, so it grounds the window
             like a cast shadow instead of ringing it like a glow. */
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-5 -z-10 blur-2xl"
            style={{
              background:
                "radial-gradient(64% 42% at 50% 58%, color-mix(in srgb, var(--color-ink) 9%, transparent) 0%, transparent 100%)",
            }}
          />
        )}

        {/* Bezel — identical material to DeviceMockup, smaller radius */}
        <div
          className={twMerge("relative border", frameClassName)}
          style={{
            borderRadius: `${OUTER_RADIUS_PX}px`,
            padding: `${BEZEL_PX}px`,
            borderColor: "var(--color-line-strong)",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 13%, var(--color-bg-deep)) 0%, color-mix(in srgb, var(--color-ink) 6%, var(--color-bg-deep)) 55%, color-mix(in srgb, var(--color-ink) 9%, var(--color-bg-deep)) 100%)",
            boxShadow:
              "inset 0 1px 0 0 var(--glass-highlight), 0 2px 6px -3px var(--glass-shadow), 0 30px 60px -34px var(--glass-shadow)",
          }}
        >
          {/* Window — clips the chrome bar and the screenshot into one object */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: `${INNER_RADIUS_PX}px`,
              background: "var(--color-bg-soft)",
              boxShadow:
                "inset 0 0 0 1px color-mix(in srgb, var(--color-ink) 12%, transparent)",
            }}
          >
            {hasChrome && (
              <div
                aria-hidden
                className="relative flex h-[28px] items-center px-3 md:h-[34px] md:px-4"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-ink) 4%, var(--color-bg-deep))",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--color-ink) 10%, transparent)",
                }}
              >
                {/* Traffic lights, monochrome and quiet */}
                <div className="flex shrink-0 items-center gap-[6px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="block size-[6px] rounded-full md:size-[7px]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-ink) 22%, transparent)",
                      }}
                    />
                  ))}
                </div>

                {label && (
                  /* Address slot. Absolutely centred so it stays optically
                     centred in the window regardless of the dots' width. */
                  <div
                    className="absolute left-1/2 max-w-[min(62%,440px)] -translate-x-1/2 rounded-full px-3 py-[3px]"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-ink) 5%, transparent)",
                      boxShadow:
                        "inset 0 0 0 1px color-mix(in srgb, var(--color-ink) 8%, transparent)",
                    }}
                  >
                    <span
                      className="kicker block truncate"
                      // Inline so it always beats `.kicker`'s own font-size —
                      // both live in Tailwind's utilities layer, where a class
                      // override would depend on emit order.
                      style={{ fontSize: "9.5px", letterSpacing: "0.16em" }}
                    >
                      {label}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              priority={priority}
              loading={priority ? undefined : loading}
              draggable={false}
              className="block h-auto w-full select-none"
            />
          </div>
        </div>
      </div>

      {hasCaption && (
        <figcaption className="mt-5">
          {eyebrow && <span className="kicker block">{eyebrow}</span>}
          {caption && (
            <span
              // Measure cap: the frame runs to ~1320px, and a caption that wide
              // is unreadable. The phone frame needs no cap — it is 420px.
              className={`block max-w-[68ch] text-[13.5px] leading-[1.5] text-[var(--color-ink-muted)] ${
                eyebrow ? "mt-2" : ""
              }`}
            >
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ────────────────────────── Gallery ────────────────────────── */

/** One screen in the gallery. Same contract as the frame, minus what the gallery owns. */
export interface BrowserShot
  extends Omit<
    BrowserFrameProps,
    "delay" | "animate" | "className" | "sizes" | "priority"
  > {
  /** Stable key. Falls back to `src` when omitted. */
  id?: string;
  /** Force this shot to run the full width of the grid. */
  full?: boolean;
}

export type BrowserGalleryLayout = "feature" | "pairs" | "stacked";

export interface BrowserGalleryProps {
  items: BrowserShot[];
  /**
   * `feature` (default) — the first `featureCount` shots run full width, the
   * rest pair up two-across, and a lone trailing shot widens rather than sitting
   * half-empty. `pairs` — everything two-across. `stacked` — everything full width.
   */
  layout?: BrowserGalleryLayout;
  /** How many leading shots run full width under `layout="feature"`. Default `1`. */
  featureCount?: number;
  /** Reveal is staggered by this much per item, capped so the last one is not late. */
  stepDelay?: number;
  /** Give the first shot `priority` — only when the gallery is above the fold. */
  priorityFirst?: boolean;
  className?: string;
  /** Accessible name for the list of screens. */
  ariaLabel?: string;
}

/**
 * Per-slot `sizes`, so next/image never ships a 2880px file into a 640px slot.
 * Written out as literals — Tailwind and next/image both read source text.
 */
const SIZES_FULL =
  "(max-width: 767px) 92vw, (max-width: 1479px) 86vw, 1320px";
const SIZES_HALF =
  "(max-width: 767px) 92vw, (max-width: 1479px) 43vw, 640px";

const MAX_DELAY = 0.24;

/**
 * Gallery of desktop screens for a case study.
 *
 * A 16:10 window cannot go four-up the way a phone can — at a quarter of the
 * column it stops being readable as an interface. So the grid is two-up at most,
 * and the default `feature` layout spends the extra width on hierarchy instead:
 * one screen opens at full bleed, the supporting ones pair off, and an odd
 * trailing screen closes at full bleed again. With six shots that reads
 * full → pair → pair → full, which is a composition rather than a strip.
 *
 * Mobile is a plain vertical stack at container width. There is no snap rail
 * here — a landscape screenshot at 70vw would be a postage stamp — and nothing
 * uses negative margins, so the page can never overflow horizontally.
 */
export function BrowserGallery({
  items,
  layout = "feature",
  featureCount = 1,
  stepDelay = 0.07,
  priorityFirst = false,
  className = "",
  ariaLabel = "Product screens",
}: BrowserGalleryProps) {
  if (items.length === 0) return null;

  const leaders =
    layout === "stacked"
      ? items.length
      : layout === "pairs"
        ? 0
        : Math.max(0, Math.min(featureCount, items.length));

  /** Count of shots that fall into the two-up remainder. */
  const paired = items.length - leaders;

  const isFull = (item: BrowserShot, index: number) => {
    if (item.full) return true;
    if (index < leaders) return true;
    // A lone trailing shot in an odd remainder widens instead of leaving a gap.
    return paired % 2 === 1 && index === items.length - 1;
  };

  return (
    <ul
      className={twMerge(
        "m-0 grid list-none grid-cols-1 gap-12 p-0 md:grid-cols-2 md:gap-x-8 md:gap-y-16",
        className
      )}
      aria-label={ariaLabel}
    >
      {items.map((item, i) => {
        const full = isFull(item, i);
        return (
          <li
            key={item.id ?? item.src}
            className={full ? "md:col-span-2" : "md:col-span-1"}
          >
            <BrowserFrame
              {...item}
              sizes={full ? SIZES_FULL : SIZES_HALF}
              priority={priorityFirst && i === 0}
              delay={Math.min(i * stepDelay, MAX_DELAY)}
            />
          </li>
        );
      })}
    </ul>
  );
}
