"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { CSSProperties, ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "@/components/text/useInView";
import { PhoneFrame, DEVICE_VIDEO_SOURCE } from "./PhoneFrame";
import { PosterButton, VideoControlRow, useSilentVideo } from "./videoChrome";

export { DEVICE_VIDEO_SOURCE };

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
  playLabel?: string;
  pauseLabel?: string;
}

/**
 * A silent product walkthrough inside the same phone frame the screenshots use,
 * so a clip and a still can sit side by side in one section and read as the
 * same object.
 *
 * The frame comes from `PhoneFrame` and the playback policy from
 * `useSilentVideo`, which is also what the browser walkthrough uses — the two
 * cannot drift. Reveal is a CSS transition on `transform`/`opacity` behind an
 * IntersectionObserver; there is no animation library in this file.
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
  className,
  frameClassName,
  style,
  playLabel = "Play",
  pauseLabel = "Pause",
}: DeviceVideoProps) {
  const reduceGlobal = usePrefersReducedMotion();
  const [revealRef, shown] = useInView<HTMLElement>();
  const { ref, reduce, autoAllowed, isPlaying, hasStarted, toggle, onPlay, onPause } =
    useSilentVideo(playWhenVisible);

  const animating = animate && !reduceGlobal;
  const descriptionId = description ? `${mp4Src.replace(/\W+/g, "-")}-desc` : undefined;

  return (
    <figure
      ref={revealRef as never}
      className={twMerge("m-0", className)}
      style={{
        ...style,
        opacity: animating ? (shown ? 1 : 0) : 1,
        transform: animating ? (shown ? "translateY(0)" : "translateY(18px)") : undefined,
        transitionProperty: animating ? "opacity, transform" : undefined,
        transitionDuration: animating ? "0.75s" : undefined,
        transitionDelay: animating ? `${delay}s` : undefined,
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <PhoneFrame frameClassName={frameClassName}>
        <video
          ref={ref}
          className="block h-auto w-full"
          width={width}
          height={height}
          poster={poster}
          muted
          playsInline
          preload={preload}
          /* Looping is a motion decision, so it follows the preference too. */
          loop={loop && !reduce}
          autoPlay={autoAllowed}
          controls={nativeControls}
          aria-label={label}
          aria-describedby={descriptionId}
          onPlay={onPlay}
          onPause={onPause}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={mp4Src} type="video/mp4" />
          {/* Last resort: the poster, with the clip's own description as its alt. */}
          <Image src={poster} alt={label} width={width} height={height} className="block h-auto w-full" />
        </video>

        {/* The way in whenever nothing is moving: reduced motion, a refused
            autoplay, or simply before the first play. */}
        {!hasStarted && !isPlaying && <PosterButton onClick={toggle} label={playLabel} />}
      </PhoneFrame>

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

      {(eyebrow || caption) && (
        <figcaption className="mt-4 flex gap-3 text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">
          {eyebrow && <span className="kicker shrink-0 pt-[3px]">{eyebrow}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
