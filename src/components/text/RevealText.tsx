"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "./useInView";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

interface RevealTextProps {
  children: ReactNode;
  /** Rendered wrapper element (h1/h2/h3/p/span/div…). Defaults to div. */
  as?: ElementType;
  className?: string;
  /**
   * "mask" — text slides up from behind a clip (titles, the case-study look).
   * "fade" — text fades and rises (body copy).
   */
  variant?: "mask" | "fade";
  /** Seconds. */
  delay?: number;
  /** Seconds. Defaults to 0.9 for "mask", 0.7 for "fade". */
  duration?: number;
}

/**
 * Reveal-on-scroll text, driven by `useInView` and animated in plain CSS.
 *
 * There is no animation library behind this: the whole effect is one
 * `transition` on `transform` and `opacity`, which are the only two properties
 * the compositor can animate without touching layout. That also makes it usable
 * from anywhere — the case template and the device frames all reveal through
 * this component, so the page has exactly one reveal, not five that drift.
 *
 * Reduced motion is honoured explicitly rather than left to the global
 * `@media` rule: under `prefers-reduced-motion` the element never carries a
 * transform at all, so there is nothing to snap back from.
 */
export default function RevealText({
  children,
  as = "div",
  className,
  variant = "mask",
  delay = 0,
  duration,
}: RevealTextProps) {
  const reduce = usePrefersReducedMotion();
  const [ref, shown] = useInView<HTMLElement>();
  const Tag = as;

  const timing: CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration ?? (variant === "fade" ? 0.7 : 0.9)}s`,
    transitionDelay: `${delay}s`,
    transitionTimingFunction: EASE,
  };

  if (variant === "fade") {
    return (
      <Tag
        ref={ref as never}
        className={className}
        style={{
          ...timing,
          // Reduced motion means the settled state, immediately — not a faster
          // reveal. Gating opacity on `shown` here left twelve paragraphs at
          // zero for anyone whose observer had not fired yet, which turns a
          // motion preference into missing content.
          opacity: reduce || shown ? 1 : 0,
          transform: reduce || shown ? "none" : "translateY(22px)",
        }}
      >
        {children}
      </Tag>
    );
  }

  // "mask" — slide up from behind an overflow clip. The py/-my pair gives
  // ascenders AND descenders room, so display type set at leading < 1 (the
  // hero h1 runs at 0.92) is not clipped top or bottom at rest.
  return (
    <Tag className={className}>
      <span ref={ref as never} className="block overflow-hidden py-[0.16em] -my-[0.16em]">
        <span
          className="inline-block will-change-transform"
          style={{
            ...timing,
            opacity: reduce || shown ? 1 : 1,
            transform: reduce || shown ? "none" : "translateY(115%)",
          }}
        >
          {children}
        </span>
      </span>
    </Tag>
  );
}
