"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/text/useInView";

interface FocusWordsProps {
  /** Space-separated words; focus cycles through them. */
  sentence?: string;
  /** Blur applied to the unfocused words, in pixels. */
  blurAmount?: number;
  /** Seconds a single transition takes. */
  duration?: number;
  /** Seconds the focus rests on a word before moving on. */
  pause?: number;
  className?: string;
}

/** Pixels the bracket frame extends beyond the word it frames. */
const PAD = 10;

/** SSR and the first client render agree on this, so there is nothing to mismatch. */
const EMPTY_RECT = { x: 0, y: 0, width: 0, height: 0 } as const;

/**
 * Three words, one in focus at a time, framed by corner brackets that travel
 * between them.
 *
 * Rebuilt without an animation library: the words transition `filter` and
 * `opacity`, and the frame moves on `transform`, which is the only way this
 * costs the compositor nothing while it loops. `width`/`height` do transition —
 * the frame has to resize to each word — but it is an absolutely positioned
 * overlay with no children in flow, so nothing else on the page relays out.
 *
 * The brackets are drawn in `--signal`, the one accent this theme allows, and
 * they earn it: the frame is literally a focus indicator, which is exactly what
 * that token is reserved for. No red, and no glow behind them.
 *
 * Under `prefers-reduced-motion` the cycle never starts: every word is legible,
 * unblurred, and the frame rests on the first one.
 */
export default function FocusWords({
  sentence = "Design Build Ship",
  blurAmount = 5,
  duration = 0.5,
  pause = 1.1,
  className = "",
}: FocusWordsProps) {
  const words = sentence.split(" ");
  const reduce = usePrefersReducedMotion();

  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number }>(EMPTY_RECT);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduce) {
      setIndex(0);
      return;
    }
    const period = (duration + pause) * 1000;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % words.length), period);
    return () => clearInterval(id);
  }, [reduce, duration, pause, words.length]);

  // Measure after paint so the frame is never a frame behind the word it marks.
  useLayoutEffect(() => {
    const measure = () => {
      const el = wordRefs.current[index];
      const parent = containerRef.current;
      if (!el || !parent) return;
      const p = parent.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setRect({ x: r.left - p.left, y: r.top - p.top, width: r.width, height: r.height });
    };
    measure();

    // The words are fluid type: a resize moves them, and a font swap changes
    // their width after the first measurement.
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [index, sentence]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap items-center gap-x-[0.35em] gap-y-2 ${className}`}
    >
      {words.map((word, i) => {
        const focused = reduce || i === index;
        return (
          <span
            key={word}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="relative"
            style={{
              filter: focused ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: focused ? 1 : 0.55,
              transition: `filter ${duration}s var(--ease-out), opacity ${duration}s var(--ease-out)`,
            }}
          >
            {word}
          </span>
        );
      })}

      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 block"
        style={{
          boxSizing: "content-box",
          padding: PAD,
          width: rect.width,
          height: rect.height,
          opacity: rect.width > 0 ? 1 : 0,
          transform: `translate3d(${rect.x - PAD}px, ${rect.y - PAD}px, 0)`,
          transition: reduce
            ? "none"
            : `transform ${duration}s var(--ease-out), width ${duration}s var(--ease-out), height ${duration}s var(--ease-out), opacity ${duration}s var(--ease-out)`,
        }}
      >
        {[
          "left-0 top-0 border-l-2 border-t-2",
          "right-0 top-0 border-r-2 border-t-2",
          "left-0 bottom-0 border-l-2 border-b-2",
          "right-0 bottom-0 border-r-2 border-b-2",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute h-3 w-3 border-[var(--signal)] ${pos}`}
          />
        ))}
      </span>
    </div>
  );
}
