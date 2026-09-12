"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Intrinsic pixel size of the walkthrough captures we ship today
 * (iPhone 393×852 logical, grabbed at @2x → 786×1704).
 * Same 0.4613 aspect ratio as `DEVICE_SOURCE` in `DeviceMockup`, so a clip and a
 * screenshot sit in visually identical frames.
 */
export const DEVICE_VIDEO_SOURCE = { width: 786, height: 1704 } as const;

/**
 * Concentric frame geometry — outer radius minus bezel = inner radius.
 * These three numbers and the two `style` blocks in `PhoneFrame` are a verbatim
 * mirror of `DeviceMockup.tsx`: that component renders `next/image` directly and
 * exposes no `children`/slot, so there is no way to reuse its frame without
 * editing it. Keep the two in sync — or, better, lift `PhoneFrame` into its own
 * module and have `DeviceMockup` consume it the next time that file is in scope.
 */
const BEZEL_PX = 8;
const OUTER_RADIUS_PX = 46;
const INNER_RADIUS_PX = OUTER_RADIUS_PX - BEZEL_PX;

/**
 * The bare editorial phone frame: ambient halo + bezel + clipped screen.
 * Token-driven end to end (`var(--color-*)`), so it reads correctly on the light
 * base theme and on `.theme-dark` subtrees alike.
 */
export function PhoneFrame({
  children,
  className = "",
  frameClassName = "",
}: {
  children: ReactNode;
  className?: string;
  frameClassName?: string;
}) {
  return (
    /* isolate → the halo's negative z stays inside this box */
    <div className={twMerge("relative isolate", className)}>
      {/* Ambient halo. Token-driven so it inverts with the theme. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 46%, color-mix(in srgb, var(--ink) 9%, transparent) 0%, transparent 100%)",
        }}
      />

      {/* Bezel */}
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
        {/* Screen */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: `${INNER_RADIUS_PX}px`,
            background: "var(--paper-raised)",
            boxShadow:
              "inset 0 0 0 1px color-mix(in srgb, var(--ink) 12%, transparent)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface DeviceVideoProps {
  /** Public path of the WebM/VP9 source, e.g. `/work/olbo/captura-gasto.webm`. Offered first. */
  webmSrc?: string;
  /** Public path of the MP4/H.264 source. Required — it is the universal fallback. */
  mp4Src: string;
  /** Poster frame. Shown before playback and as the still under reduced motion. */
  poster: string;
  /** Intrinsic width of the source file. Defaults to the 786×1704 captures. */
  width?: number;
  /** Intrinsic height of the source file. */
  height?: number;
  /** Accessible name for the clip — what it shows, in one line. */
  label: string;
  /** Optional longer, screen-reader-only account of what happens in the clip. */
  description?: string;
  /** Small mono/uppercase label above the caption (e.g. "01 — Captura"). */
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
  /** Stagger offset in seconds when several devices animate together. */
  delay?: number;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
  /** Control labels. Spanish-first, matching the rest of the case copy. */
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
 * A silent product walkthrough inside the same editorial phone frame the
 * screenshots use, so a clip and a still can sit side by side in one section.
 *
 * Motion policy:
 * - Default: muted autoplay, looping, but only while the frame is on screen.
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
export default function DeviceVideo({
  webmSrc,
  mp4Src,
  poster,
  width = DEVICE_VIDEO_SOURCE.width,
  height = DEVICE_VIDEO_SOURCE.height,
  label,
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
  playLabel = "Reproducir",
  pauseLabel = "Pausar",
}: DeviceVideoProps) {
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
      className={twMerge("m-0 flex w-full max-w-[420px] flex-col", className)}
      style={style}
      initial={motionOn ? { opacity: 0, y: 28 } : undefined}
      whileInView={motionOn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      <PhoneFrame frameClassName={frameClassName}>
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
      </PhoneFrame>

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
              className={`block text-[13.5px] leading-[1.5] text-[var(--ink-muted)] ${
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
