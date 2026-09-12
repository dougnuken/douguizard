"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

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
  /** Ambient bloom behind the window. Default `true`. */
  halo?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
}

/**
 * The bare editorial browser window — ambient halo + bezel + chrome bar +
 * clipped screen — with the screen itself left as a slot.
 *
 * This is the single definition of the frame's materials. `BrowserFrame` fills
 * it with a screenshot and `BrowserVideo` with a clip, so the bezel geometry,
 * the shadow recipe and the bloom can never drift apart between the two.
 *
 * Same materials as the phone frame, so the two never read as different
 * families: 1px `--line-strong` border, a bezel mixed from `--ink`
 * over `--paper`, the same inset-highlight + two-layer shadow recipe,
 * and the same `--ink`-at-9% ambient bloom. Everything is expressed with
 * theme tokens, so it inverts with the global appearance.
 *
 * The traffic lights are deliberately monochrome. Red/amber/green dots are the
 * single loudest tell of a stock mockup, and on this theme the one saturated
 * colour (`--ink`) is spent on argument, not on window decoration.
 */
export function BrowserWindow({
  children,
  chrome = "dots",
  label,
  halo = true,
  className = "",
  frameClassName = "",
}: BrowserWindowProps) {
  const hasChrome = chrome !== "none";

  return (
    /* isolate → the bloom's negative z stays inside this box */
    <div className={twMerge("relative isolate", className)}>
      {halo && (
        /* Flatter and lower than the phone's halo, so it grounds the window
           like a cast shadow instead of ringing it like a glow. */
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-5 -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(64% 42% at 50% 58%, color-mix(in srgb, var(--ink) 9%, transparent) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Bezel — identical material to DeviceMockup, smaller radius */}
      <div
        className={twMerge("relative border", frameClassName)}
        style={{
          borderRadius: `${OUTER_RADIUS_PX}px`,
          padding: `${BEZEL_PX}px`,
          borderColor: "var(--line-strong)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--ink) 13%, var(--paper)) 0%, color-mix(in srgb, var(--ink) 6%, var(--paper)) 55%, color-mix(in srgb, var(--ink) 9%, var(--paper)) 100%)",
          boxShadow:
            "inset 0 1px 0 0 var(--line), 0 2px 6px -3px var(--line), 0 30px 60px -34px var(--line)",
        }}
      >
        {/* Window — clips the chrome bar and the screen into one object */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: `${INNER_RADIUS_PX}px`,
            background: "var(--paper-raised)",
            boxShadow:
              "inset 0 0 0 1px color-mix(in srgb, var(--ink) 12%, transparent)",
          }}
        >
          {hasChrome && (
            <div
              aria-hidden
              className="relative flex h-[28px] items-center px-3 md:h-[34px] md:px-4"
              style={{
                background:
                  "color-mix(in srgb, var(--ink) 4%, var(--paper))",
                borderBottom:
                  "1px solid color-mix(in srgb, var(--ink) 10%, transparent)",
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
                        "color-mix(in srgb, var(--ink) 22%, transparent)",
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
                      "color-mix(in srgb, var(--ink) 5%, transparent)",
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent)",
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

          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Editorial browser window holding a screenshot — the desktop sibling of
 * `DeviceMockup`. The frame itself is `BrowserWindow`; this adds the reveal,
 * the hover lift, the image and the caption.
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
      <BrowserWindow chrome={chrome} label={label} halo={halo} frameClassName={frameClassName}>
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
    </motion.figure>
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
  /** Ambient bloom behind the window. Default `true`. */
  halo?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
  /** Control labels. Spanish-first, matching `DeviceVideo` and the rest of the case copy. */
  playLabel?: string;
  pauseLabel?: string;
}

function PlayIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden focusable="false">
      <path d="M1 1.2v9.6a.6.6 0 0 0 .92.5l7.6-4.8a.6.6 0 0 0 0-1L1.92.7A.6.6 0 0 0 1 1.2Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden focusable="false">
      <rect x="1" y="1" width="3" height="10" rx="0.6" fill="currentColor" />
      <rect x="7" y="1" width="3" height="10" rx="0.6" fill="currentColor" />
    </svg>
  );
}

/**
 * A silent product walkthrough inside the same browser window the desktop
 * screenshots use — the landscape counterpart to `DeviceVideo`, which frames
 * the same kind of clip in a handset.
 *
 * The frame comes from `BrowserWindow`, so the bezel, the shadow and the bloom
 * are literally the same code the stills render in. Only the playback policy
 * lives here, and it is a deliberate mirror of `DeviceVideo`'s:
 * - Default: muted autoplay, but only while the frame is on screen.
 * - `prefers-reduced-motion: reduce`: **nothing moves on its own**. The poster
 *   stands still behind a real `<button>`, the reveal animation is dropped, and
 *   when the viewer chooses to play, the clip runs once instead of looping.
 * - Either way there is always a keyboard-reachable play/pause control, which is
 *   what WCAG 2.2.2 asks of anything that autoplays for more than five seconds.
 *
 * Autoplay is driven from an effect rather than trusted to the attribute alone:
 * `useReducedMotion()` is unknown during SSR, so the attribute is withheld until
 * after mount (no hydration mismatch, and no flash of motion for a viewer who
 * asked for none), and `play()` is then called explicitly.
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
  halo = true,
  className = "",
  frameClassName = "",
  style,
  playLabel = "Reproducir",
  pauseLabel = "Pausar",
}: BrowserVideoProps) {
  const reduce = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /** The viewer pressed pause: never resume behind their back. */
  const userPausedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const descriptionId = useId();
  const hasCaption = Boolean(eyebrow || caption);
  const motionOn = animate && !reduce;
  /** Autoplay is only ever allowed after mount, and never under reduced motion. */
  const autoAllowed = mounted && !reduce;

  useEffect(() => setMounted(true), []);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const attempt = video.play();
    // Blocked autoplay (iOS low-power, strict policies) is not an error here —
    // the poster stays up and the play button remains the way in.
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!autoAllowed) {
      video.pause();
      return;
    }
    if (!playWhenVisible || typeof IntersectionObserver === "undefined") {
      tryPlay();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!userPausedRef.current) tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [autoAllowed, playWhenVisible, tryPlay]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      tryPlay();
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, [tryPlay]);

  const focusRing =
    "focus-visible:[outline:2px_solid_var(--ink)] focus-visible:[outline-offset:3px]";

  return (
    <motion.figure
      // twMerge so a consumer's `max-w-*` / spacing beats the defaults.
      className={twMerge("m-0 flex w-full flex-col", className)}
      style={style}
      initial={motionOn ? { opacity: 0, y: 24 } : undefined}
      whileInView={motionOn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      <BrowserWindow
        chrome={chrome}
        label={chromeLabel}
        halo={halo}
        frameClassName={frameClassName}
      >
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
            onPlay={() => {
              setIsPlaying(true);
              setHasStarted(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
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
          {!hasStarted && (
            <button
              type="button"
              onClick={toggle}
              aria-label={`${playLabel}: ${label}`}
              className={`absolute inset-0 grid place-items-center ${focusRing}`}
              style={{
                background:
                  "radial-gradient(60% 40% at 50% 50%, color-mix(in srgb, var(--ink) 18%, transparent) 0%, transparent 100%)",
              }}
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-full border backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--paper-raised)",
                  color: "var(--ink)",
                  boxShadow: "0 10px 40px -16px var(--line)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                {/* optical centering of the triangle */}
                <span className="ml-[2px] flex">
                  <PlayIcon />
                </span>
              </span>
            </button>
          )}
        </div>
      </BrowserWindow>

      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}

      {showControls && (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={isPlaying}
            className={`kicker inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-200 ${focusRing}`}
            style={{
              borderColor: "var(--line-strong)",
              color: "var(--ink)",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            {isPlaying ? pauseLabel : playLabel}
          </button>
        </div>
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
