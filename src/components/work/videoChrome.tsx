"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/components/text/useInView";

/**
 * Play / pause glyphs drawn as outlines in `currentColor`, so they inherit the
 * ink of whatever control holds them and stay monochrome in both appearances.
 */
export function PlayIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden focusable="false">
      <path
        d="M1.6 1.5v9l7.3-4.5-7.3-4.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden focusable="false">
      <path
        d="M3 1.6v8.8M8 1.6v8.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const VIDEO_FOCUS_RING =
  "focus-visible:[outline:2px_solid_var(--ink)] focus-visible:[outline-offset:3px]";

export interface SilentVideo {
  ref: RefObject<HTMLVideoElement | null>;
  /** Reduced motion is on: nothing may move on its own. */
  reduce: boolean;
  /** Autoplay is allowed — after mount, and never under reduced motion. */
  autoAllowed: boolean;
  isPlaying: boolean;
  hasStarted: boolean;
  toggle: () => void;
  onPlay: () => void;
  onPause: () => void;
}

/**
 * The playback policy shared by the phone and the browser walkthroughs.
 *
 * - Default: muted autoplay, but only while the frame is on screen.
 * - `prefers-reduced-motion: reduce`: nothing moves on its own. The poster
 *   stands still behind a real button, and when the viewer chooses to play, the
 *   clip runs once instead of looping.
 * - Either way there is always a keyboard-reachable play/pause control, which is
 *   what WCAG 2.2.2 asks of anything that autoplays for more than five seconds.
 *
 * Autoplay is driven from an effect rather than trusted to the attribute alone:
 * the reduced-motion preference is unknown during SSR, so the attribute is
 * withheld until after mount (no hydration mismatch, and no flash of motion for
 * a viewer who asked for none), and `play()` is then called explicitly.
 */
export function useSilentVideo(playWhenVisible: boolean): SilentVideo {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  /** The viewer pressed pause: never resume behind their back. */
  const userPausedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const autoAllowed = mounted && !reduce;

  useEffect(() => setMounted(true), []);

  const tryPlay = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    const attempt = video.play();
    // Blocked autoplay (iOS low-power, strict policies) is not an error here —
    // the poster stays up and the play button remains the way in.
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }, []);

  useEffect(() => {
    const video = ref.current;
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
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [autoAllowed, playWhenVisible, tryPlay]);

  const toggle = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      tryPlay();
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, [tryPlay]);

  return {
    ref,
    reduce,
    autoAllowed,
    isPlaying,
    hasStarted,
    toggle,
    onPlay: () => {
      setIsPlaying(true);
      setHasStarted(true);
    },
    onPause: () => setIsPlaying(false),
  };
}

/**
 * The poster-state affordance: the only control under reduced motion, and the
 * recovery path anywhere autoplay was refused. Flat — a 1px ring on paper, no
 * bloom behind the glyph and no shadow under the button.
 */
export function PosterButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute inset-0 grid place-items-center ${VIDEO_FOCUS_RING}`}
      style={{ background: "color-mix(in srgb, var(--paper) 32%, transparent)" }}
    >
      <span
        className="grid h-14 w-14 place-items-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] transition-transform duration-300 hover:scale-105"
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        {/* optical centering of the triangle */}
        <span className="ml-[2px] flex">
          <PlayIcon />
        </span>
      </span>
    </button>
  );
}

/** Play/pause row under a frame. Ink on paper inside a 1px pill; hover raises opacity, never colour. */
export function VideoControlRow({
  isPlaying,
  onToggle,
  playLabel,
  pauseLabel,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  playLabel: string;
  pauseLabel: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPlaying}
        className={`kicker inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-[var(--ink)] transition-opacity duration-200 hover:opacity-70 ${VIDEO_FOCUS_RING}`}
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
        {isPlaying ? pauseLabel : playLabel}
      </button>
    </div>
  );
}
