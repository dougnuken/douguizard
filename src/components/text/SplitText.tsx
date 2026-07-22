"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SplitTextProps {
  text: string;
  tag?: ElementType;
  className?: string;
  /** ms between each unit's start (stagger step). */
  delay?: number;
  /** seconds per unit. */
  duration?: number;
  /** "chars" cascades letter-by-letter; "words" reveals whole words. */
  splitType?: "chars" | "words";
  from?: { opacity?: number; y?: number };
  to?: { opacity?: number; y?: number };
  /** Words rendered with `emphasizeClassName` (e.g. the bold hero word). */
  emphasize?: string[];
  emphasizeClassName?: string;
  /** Seconds before the cascade begins (sequence after other hero elements). */
  startDelay?: number;
}

/**
 * SplitText (framer replica of the React Bits/GSAP component) — splits text into
 * words, then chars, and cascades each with a staggered rise + fade. No GSAP
 * dependency; reuses the app's framer-motion. Preserves per-word emphasis and
 * stays accessible (the whole string is exposed via aria-label; fragments are
 * aria-hidden). Motion-safe: reduced motion collapses to a single fade.
 */
export default function SplitText({
  text,
  tag = "p",
  className = "",
  delay = 30,
  duration = 0.7,
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  emphasize = [],
  emphasizeClassName = "",
  startDelay = 0,
}: SplitTextProps) {
  const reduce = useReducedMotion() ?? false;
  const Tag = tag;

  const words = text.split(" ");
  const emph = new Set(emphasize.map((w) => w.toLowerCase()));
  let unitIndex = 0;

  const initial = reduce ? { opacity: 0 } : { opacity: from.opacity ?? 0, y: from.y ?? 40 };
  const animate = reduce ? { opacity: 1 } : { opacity: to.opacity ?? 1, y: to.y ?? 0 };

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => {
        const key = word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
        const isEmph = emph.has(key);
        const units = splitType === "chars" ? Array.from(word) : [word];
        return (
          <Fragment key={wi}>
            <span
              aria-hidden
              className={`inline-block whitespace-nowrap ${isEmph ? emphasizeClassName : ""}`}
            >
              {units.map((unit, ui) => {
                const i = unitIndex++;
                return (
                  <motion.span
                    key={ui}
                    className="inline-block will-change-transform"
                    initial={initial}
                    animate={animate}
                    transition={{
                      duration: reduce ? 0.3 : duration,
                      delay: reduce ? 0 : startDelay + i * (delay / 1000),
                      ease: EASE,
                    }}
                  >
                    {unit === " " ? " " : unit}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
