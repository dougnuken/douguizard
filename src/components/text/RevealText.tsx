"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  delay?: number;
  duration?: number;
}

/**
 * Reveal-on-scroll text driven by a self-owned IntersectionObserver (root =
 * viewport). Reliable in both the horizontal shell and normal detail pages —
 * unlike framer's whileInView, which mis-fires for off-screen panels.
 *
 * Fail-safe by design: it reveals as soon as any part of the element enters the
 * viewport (threshold 0), reveals immediately if it's already on screen at
 * mount, and once revealed it never hides again — so content can never get
 * stuck invisible. "mask" reproduces the case-study slide-up; "fade" is the
 * gentler rise for body copy. Motion-safe. Transform/opacity only.
 */
export default function RevealText({
  children,
  as = "div",
  className,
  variant = "mask",
  delay = 0,
  duration,
}: RevealTextProps) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    let io: IntersectionObserver | null = null;
    const reveal = () => {
      setShown(true);
      io?.disconnect();
      io = null;
    };
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal();
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);
    // Reveal immediately if it's already within/above the viewport at mount.
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh && r.bottom > 0) reveal();
    return () => io?.disconnect();
  }, []);

  const Tag = as;

  if (variant === "fade") {
    const MTag =
      (motion as unknown as Record<string, ElementType>)[
        typeof as === "string" ? as : "div"
      ] ?? motion.div;
    const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 22 };
    return (
      <MTag
        ref={ref as never}
        className={className}
        initial={hidden}
        animate={shown ? { opacity: 1, y: 0 } : hidden}
        transition={{ duration: duration ?? 0.7, delay, ease: EASE }}
      >
        {children}
      </MTag>
    );
  }

  // "mask" — slide up from behind an overflow clip. The py/-my pair gives
  // ascenders AND descenders room, so display type set at leading < 1 (the
  // hero h1 runs at 0.92) is not clipped top or bottom at rest.
  const hidden = reduce ? { opacity: 0 } : { y: "115%" };
  const visible = reduce ? { opacity: 1 } : { y: 0 };
  return (
    <Tag className={className}>
      <span
        ref={ref as never}
        className="block overflow-hidden py-[0.16em] -my-[0.16em]"
      >
        <motion.span
          className="inline-block will-change-transform"
          initial={hidden}
          animate={shown ? visible : hidden}
          transition={{ duration: duration ?? 0.9, delay, ease: EASE }}
        >
          {children}
        </motion.span>
      </span>
    </Tag>
  );
}
