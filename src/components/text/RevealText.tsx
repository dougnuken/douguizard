"use client";

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
  once?: boolean;
  /** IntersectionObserver root margin for the trigger. */
  margin?: string;
}

/**
 * Reveal-on-scroll text. The "mask" variant reproduces the case-study hero
 * effect — a single clipped block that slides up into place — and "fade" is the
 * gentler rise used for body copy. Motion-safe: collapses to a plain fade under
 * prefers-reduced-motion. Only transform/opacity animate.
 */
export default function RevealText({
  children,
  as = "div",
  className,
  variant = "mask",
  delay = 0,
  duration,
  once = true,
  margin = "-12%",
}: RevealTextProps) {
  const reduce = useReducedMotion() ?? false;
  const Tag = as;
  const viewport = { once, margin } as const;

  if (variant === "fade") {
    const MTag = (motion as unknown as Record<string, ElementType>)[
      typeof as === "string" ? as : "div"
    ] ?? motion.div;
    return (
      <MTag
        className={className}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: duration ?? 0.7, delay, ease: EASE }}
      >
        {children}
      </MTag>
    );
  }

  // "mask" — slide up from behind an overflow clip. The pb/-mb pair gives
  // descenders room so nothing is clipped at rest.
  return (
    <Tag className={className}>
      <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
        <motion.span
          className="inline-block will-change-transform"
          initial={reduce ? { opacity: 0 } : { y: "115%" }}
          whileInView={reduce ? { opacity: 1 } : { y: 0 }}
          viewport={viewport}
          transition={{ duration: duration ?? 0.9, delay, ease: EASE }}
        >
          {children}
        </motion.span>
      </span>
    </Tag>
  );
}
