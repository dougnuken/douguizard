"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Only the tags we actually reveal — keeps `motion[as]` fully typed. */
const MOTION = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
  span: motion.span,
} as const;

interface BlurTextProps {
  children: ReactNode;
  as?: keyof typeof MOTION;
  className?: string;
  delay?: number;
  duration?: number;
  /** Initial blur radius (px). */
  blur?: number;
}

/**
 * Block-level blur-to-sharp reveal. Wraps its children so explicit line breaks
 * and inline accent spans are preserved verbatim. Collapses to a plain fade
 * under prefers-reduced-motion (no blur/transform).
 */
export default function BlurText({
  children,
  as = "h2",
  className = "",
  delay = 0,
  duration = 0.9,
  blur = 12,
}: BlurTextProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const M = MOTION[as] as (typeof MOTION)["div"];

  return (
    <M
      className={className}
      style={{ willChange: "filter, transform, opacity" }}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: `blur(${blur}px)`, y: 16 }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, filter: "blur(0px)", y: 0 }
      }
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0.3 : duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}
