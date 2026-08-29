"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface TextSegment {
  /** Segment text. Use "\n" for an explicit line break. */
  text: string;
  /** Optional classes for this segment (accent colour, italic, weight). */
  className?: string;
}

type Node =
  | { kind: "break"; key: string }
  | { kind: "space"; key: string }
  | { kind: "unit"; content: string; className?: string; key: string };

interface SplitTextProps {
  segments: TextSegment[];
  /** Reveal granularity. */
  by?: "words" | "chars";
  /** Per-unit stagger (seconds). Sensible default depends on `by`. */
  stagger?: number;
  /** Delay before the first unit (seconds). */
  delay?: number;
  /** Per-unit duration (seconds). */
  duration?: number;
  /**
   * When to play. "mount" fires on first paint — correct for above-the-fold
   * content like the hero, where an IntersectionObserver is unreliable.
   * "inView" waits until the block scrolls into view (default).
   */
  trigger?: "mount" | "inView";
  className?: string;
  /** Element rendered as the container. */
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Editorial entrance reveal. Each word (or char) rises + fades in with a short
 * stagger once the block scrolls into view. Collapses to a plain fade under
 * prefers-reduced-motion. Preserves explicit "\n" breaks, keeps breakable
 * spaces (so long headlines still wrap), and per-segment styling for accents.
 */
export default function SplitText({
  segments,
  by = "words",
  stagger,
  delay = 0,
  duration = 0.7,
  trigger = "inView",
  className = "",
  as = "span",
}: SplitTextProps) {
  const Tag = as as ElementType;
  const reduceMotion = useReducedMotion() ?? false;
  const step = stagger ?? (by === "chars" ? 0.025 : 0.06);

  const nodes = useMemo<Node[]>(() => {
    const out: Node[] = [];
    segments.forEach((seg, si) => {
      if (seg.text === "\n") {
        out.push({ kind: "break", key: `br-${si}` });
        return;
      }
      if (by === "chars") {
        seg.text.split("").forEach((c, ci) => {
          out.push({
            kind: "unit",
            content: c === " " ? " " : c,
            className: seg.className,
            key: `c-${si}-${ci}`,
          });
        });
        return;
      }
      // Split on whitespace, keep the words, emit breakable spaces between them
      // so the container can still wrap naturally at any point.
      seg.text.split(/(\s+)/).forEach((part, pi) => {
        if (part.length === 0) return;
        if (/^\s+$/.test(part)) {
          out.push({ kind: "space", key: `s-${si}-${pi}` });
        } else {
          out.push({
            kind: "unit",
            content: part,
            className: seg.className,
            key: `w-${si}-${pi}`,
          });
        }
      });
    });
    return out;
  }, [segments, by]);

  let unitIndex = 0;
  return (
    <Tag className={className}>
      {nodes.map((n) => {
        if (n.kind === "break") return <br key={n.key} />;
        if (n.kind === "space") return " ";
        const i = unitIndex++;
        return (
          <motion.span
            key={n.key}
            className={`inline-block ${n.className ?? ""}`}
            style={{ willChange: "transform, opacity" }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 44 }}
            {...(trigger === "mount"
              ? { animate: { opacity: 1, y: 0 } }
              : {
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                })}
            transition={{
              duration: reduceMotion ? 0.3 : duration,
              delay: reduceMotion ? 0 : delay + i * step,
              ease: EASE,
            }}
          >
            {n.content}
          </motion.span>
        );
      })}
    </Tag>
  );
}
