"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useId, type CSSProperties, type ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "@/components/text/useInView";
import { PosterButton, VideoControlRow, useSilentVideo } from "./videoChrome";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

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
 * rule `PhoneFrame` follows, and now the same 12px outer corner, so a phone and
 * a browser on the same page read as one family of drawn objects.
 */
const BEZEL_PX = 4;
const OUTER_RADIUS_PX = 12;
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
  /**
   * @deprecated No-op. The window is drawn, not lit: the ambient bloom it
   * used to switch was removed with the rest of the invented light sources.
   * Kept so existing call sites keep compiling; delete on the next sweep.
   */
  halo?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
}

/**
 * Intrinsic pixel size of the desktop screen recordings we ship today
 * (1920×1200 — the same 1.6:1 window as `BROWSER_SOURCE`, so a clip and a
 * screenshot sit in visually identical frames).
 */
export const BROWSER_VIDEO_SOURCE = { width: 1920, height: 1200 } as const;

export interface BrowserWindowProps {
  /** Whatever fills the screen: an `<Image>`, a `<video>`, anything. */
  children: ReactNode;
  /** Window chrome. Default `"dots"`. */
  chrome?: BrowserChrome;
  /** Text for the address-bar slot. Omit and the bar collapses to chrome alone. */
  label?: string;
  /**
   * @deprecated No-op. The window is drawn, not lit: the ambient bloom it
   * used to switch was removed with the rest of the invented light sources.
   * Kept so existing call sites keep compiling; delete on the next sweep.
   */
  halo?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
}

/**
 * The bare browser window — bezel, chrome bar, clipped screen — with the screen
 * itself left as a slot.
 *
 * This is the single definition of the frame's materials. `BrowserFrame` fills
 * it with a screenshot and `BrowserVideo` with a clip, so the geometry can never
 * drift between the two.
 *
 * Drawn, not lit. The gradient bezel, the inset highlight, the two-layer shadow
 * and the ambient bloom are all gone: each one invented a light source, and this
 * theme has one ink, one paper and no lighting. What remains is the same 1px
 * `--line-strong` outline and 12px corner as `PhoneFrame`, so a phone and a
 * browser read as one family of objects.
 *
 * The traffic lights are outlines rather than fills, and monochrome. Red/amber/
 * green dots are the single loudest tell of a stock mockup.
 */
export function BrowserWindow({
  children,
  chrome = "dots",
  label,
  className = "",
  frameClassName = "",
}: BrowserWindowProps) {
  const hasChrome = chrome !== "none";

  return (
    <div className={twMerge("relative", className)}>
      <div
        className={twMerge("relative border border-[var(--line-strong)] bg-[var(--paper)]", frameClassName)}
        style={{ borderRadius: `${OUTER_RADIUS_PX}px`, padding: `${BEZEL_PX}px` }}
      >
        {/* Window — clips the chrome bar and the screen into one object */}
        <div
          className="relative overflow-hidden bg-[var(--paper-raised)]"
          style={{ borderRadius: `${INNER_RADIUS_PX}px` }}
        >
          {hasChrome && (
            <div
              aria-hidden
              className="relative flex h-[28px] items-center border-b border-[var(--line)] bg-[var(--paper)] px-3 md:h-[34px] md:px-4"
            >
              <div className="flex shrink-0 items-center gap-[6px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block size-[6px] rounded-full border border-[var(--line-strong)] md:size-[7px]"
                  />
                ))}
              </div>

              {label && (
                /* Address slot. Absolutely centred so it stays optically
                   centred in the window regardless of the dots' width. */
                <div className="absolute left-1/2 max-w-[min(62%,440px)] -translate-x-1/2 rounded-full border border-[var(--line)] px-3 py-[3px]">
                  <span
                    className="kicker block truncate text-[var(--ink-dim)]"
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

          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Browser window holding a screenshot — the desktop sibling of `DeviceMockup`.
 * The frame itself is `BrowserWindow`; this adds the reveal, the hover lift,
 * the image and the caption.
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
  className = "",
  frameClassName = "",
  style,
}: BrowserFrameProps) {
  const reduce = usePrefersReducedMotion();
  const [revealRef, shown] = useInView<HTMLElement>();
  const motionOn = animate && !reduce;
  const hoverOn = interactive && !reduce;
  const hasCaption = Boolean(eyebrow || caption);

  return (
    <figure
      ref={revealRef as never}
      // twMerge so a consumer's `max-w-*` / spacing beats the defaults.
      className={twMerge(
        "m-0 flex w-full flex-col",
        // Shallower than the phone's -6: the window is a heavier object, and a
        // big surface travelling far reads as a card, not as a lift.
        hoverOn && "transition-transform duration-500 hover:-translate-y-1",
        className,
      )}
      style={{
        ...style,
        opacity: motionOn ? (shown ? 1 : 0) : 1,
        transform: motionOn && !shown ? "translateY(24px)" : undefined,
        transitionProperty: motionOn ? "opacity, transform" : undefined,
        transitionDuration: motionOn ? "0.9s" : undefined,
        transitionDelay: motionOn ? `${delay}s` : undefined,
        transitionTimingFunction: EASE,
      }}
    >
      <BrowserWindow chrome={chrome} label={label} frameClassName={frameClassName}>
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
      </BrowserWindow>

      {hasCaption && (
        <figcaption className="mt-5">
          {eyebrow && <span className="kicker block">{eyebrow}</span>}
          {caption && (
            <span
              // Measure cap: the frame runs to ~1320px, and a caption that wide
              // is unreadable. The phone frame needs no cap — it is 420px.
              className={`block max-w-[68ch] text-[13.5px] leading-[1.5] text-[var(--ink-muted)] ${
                eyebrow ? "mt-2" : ""
              }`}
            >
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* ─────────────────────────── Video ─────────────────────────── */

export interface BrowserVideoProps {
  /** Public path of the WebM/VP9 source. Offered first — smaller than the MP4. */
  webmSrc?: string;
  /** Public path of the MP4/H.264 source. Required — it is the universal fallback. */
  mp4Src: string;
  /** Poster frame. Shown before playback and as the still under reduced motion. */
  poster: string;
  /** Intrinsic width of the source file. Defaults to the 1920×1200 captures. */
  width?: number;
  /** Intrinsic height of the source file. */
  height?: number;
  /** Accessible name for the clip — what it shows, in one line. */
  label: string;
  /**
   * Text for the address-bar slot — the module the clip walks through
   * ("ivc · bandeja del coordinador"). Distinct from `label`, which is the
   * accessible name: the chrome bar is `aria-hidden` decoration.
   */
  chromeLabel?: string;
  /** Window chrome. Default `"dots"`. */
  chrome?: BrowserChrome;
  /** Optional longer, screen-reader-only account of what happens in the clip. */
  description?: string;
  /** Small mono/uppercase label above the caption (e.g. "01"). */
  eyebrow?: string;
  /** Sentence-length caption. Renders a `<figcaption>` together with `eyebrow`. */
  caption?: ReactNode;
  /** Loop the clip. Always off under reduced motion (it plays once, then stops). */
  loop?: boolean;
  /** `preload` hint. `"metadata"` keeps the initial payload to a few KB. */
  preload?: "none" | "metadata" | "auto";
  /** Only play while the frame is on screen. Default `true`. */
  playWhenVisible?: boolean;
  /** Render the native control bar as well. Default `false` — we ship our own. */
  nativeControls?: boolean;
  /** Show the play/pause row under the frame. Default `true`. Required by WCAG 2.2.2 when autoplaying. */
  showControls?: boolean;
  /** Scroll-into-view reveal. Default `true`; always off under reduced motion. */
  animate?: boolean;
  /** Stagger offset in seconds when several frames animate together. */
  delay?: number;
  /**
   * @deprecated No-op. The window is drawn, not lit: the ambient bloom it
   * used to switch was removed with the rest of the invented light sources.
   * Kept so existing call sites keep compiling; delete on the next sweep.
   */
  halo?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
  /** Control labels. Spanish-first, matching `DeviceVideo` and the rest of the case copy. */
  playLabel?: string;
  pauseLabel?: string;
}

/**
 * A silent product walkthrough inside the same browser window the desktop
 * screenshots use — the landscape counterpart to `DeviceVideo`, which frames
 * the same kind of clip in a handset.
 *
 * The frame comes from `BrowserWindow` and the playback policy from
 * `useSilentVideo`, which `DeviceVideo` also uses, so the phone and the browser
 * walkthroughs cannot drift apart in either look or behaviour.
 */
export function BrowserVideo({
  webmSrc,
  mp4Src,
  poster,
  width = BROWSER_VIDEO_SOURCE.width,
  height = BROWSER_VIDEO_SOURCE.height,
  label,
  chromeLabel,
  chrome = "dots",
  description,
  eyebrow,
  caption,
  loop = true,
  preload = "metadata",
  playWhenVisible = true,
  nativeControls = false,
  showControls = true,
  animate = true,
  delay = 0,
  className = "",
  frameClassName = "",
  style,
  playLabel = "Play",
  pauseLabel = "Pause",
}: BrowserVideoProps) {
  const [revealRef, shown] = useInView<HTMLElement>();
  const {
    ref: videoRef,
    reduce,
    autoAllowed,
    isPlaying,
    hasStarted,
    toggle,
    onPlay,
    onPause,
  } = useSilentVideo(playWhenVisible);

  const descriptionId = useId();
  const hasCaption = Boolean(eyebrow || caption);
  const motionOn = animate && !reduce;

  return (
    <figure
      ref={revealRef as never}
      // twMerge so a consumer's `max-w-*` / spacing beats the defaults.
      className={twMerge("m-0 flex w-full flex-col", className)}
      style={{
        ...style,
        opacity: motionOn ? (shown ? 1 : 0) : 1,
        transform: motionOn && !shown ? "translateY(24px)" : undefined,
        transitionProperty: motionOn ? "opacity, transform" : undefined,
        transitionDuration: motionOn ? "0.9s" : undefined,
        transitionDelay: motionOn ? `${delay}s` : undefined,
        transitionTimingFunction: EASE,
      }}
    >
      <BrowserWindow chrome={chrome} label={chromeLabel} frameClassName={frameClassName}>
        {/* Own stacking context so the poster button covers the clip only —
            never the chrome bar above it. */}
        <div className="relative">
          <video
            ref={videoRef}
            width={width}
            height={height}
            poster={poster}
            preload={preload}
            // Attribute present for the browser's own autoplay pass; the effect
            // above is what actually guarantees (and gates) playback.
            autoPlay={autoAllowed}
            loop={loop && !reduce}
            muted
            playsInline
            controls={nativeControls}
            disablePictureInPicture
            aria-label={label}
            aria-describedby={description ? descriptionId : undefined}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onPause}
            className="block h-auto w-full select-none"
            // Explicit ratio alongside width/height: the box is reserved before a
            // single byte of video arrives, so the clip cannot shift the layout.
            style={{ aspectRatio: `${width} / ${height}`, background: "var(--paper-raised)" }}
          >
            {webmSrc && <source src={webmSrc} type="video/webm" />}
            <source src={mp4Src} type="video/mp4" />
          </video>

          {/* Poster-state affordance: the only control under reduced motion, and
              the recovery path anywhere autoplay was refused. */}
          {!hasStarted && <PosterButton onClick={toggle} label={`${playLabel}: ${label}`} />}
        </div>
      </BrowserWindow>

      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}

      {showControls && (
        <VideoControlRow
          isPlaying={isPlaying}
          onToggle={toggle}
          playLabel={playLabel}
          pauseLabel={pauseLabel}
        />
      )}

      {hasCaption && (
        <figcaption className={showControls ? "mt-3" : "mt-5"}>
          {eyebrow && <span className="kicker block">{eyebrow}</span>}
          {caption && (
            <span
              // Measure cap: the frame runs full-bleed, and a caption that wide
              // is unreadable.
              className={`block max-w-[68ch] text-[13.5px] leading-[1.5] text-[var(--ink-muted)] ${
                eyebrow ? "mt-2" : ""
              }`}
            >
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
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
