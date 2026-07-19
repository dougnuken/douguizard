"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TrueFocusProps {
  /** Space-separated words; focus cycles through each. */
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

/**
 * True Focus (after reactbits.dev) — blurs every word except the focused one and
 * frames it with animated corner brackets, cycling word by word. KINETIC-themed:
 * Ferrari-red brackets, motion-safe.
 */
export default function TrueFocus({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 5,
  borderColor = "var(--color-accent)",
  glowColor = "color-mix(in srgb, var(--color-accent) 55%, transparent)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.1,
  className = "",
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const reduce = useReducedMotion() ?? false;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Auto-cycle the focused word (disabled in manual mode or reduced motion).
  useEffect(() => {
    if (manualMode || reduce) return;
    const period = (animationDuration + pauseBetweenAnimations) * 1000;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, period);
    return () => clearInterval(id);
  }, [manualMode, reduce, animationDuration, pauseBetweenAnimations, words.length]);

  // Measure the focused word and move the frame to it.
  useEffect(() => {
    const el = wordRefs.current[currentIndex];
    const parent = containerRef.current;
    if (!el || !parent) return;
    const p = parent.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setRect({ x: r.left - p.left, y: r.top - p.top, width: r.width, height: r.height });
  }, [currentIndex, sentence]);

  const onEnter = (i: number) => {
    if (!manualMode) return;
    setLastActiveIndex(currentIndex);
    setCurrentIndex(i);
  };
  const onLeave = () => {
    if (manualMode && lastActiveIndex !== null) setCurrentIndex(lastActiveIndex);
  };

  const pad = 10; // px the frame extends beyond the word

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap items-center gap-x-[0.35em] gap-y-2 ${className}`}
    >
      {words.map((word, i) => {
        const focused = i === currentIndex;
        return (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={onLeave}
            className="relative cursor-default"
            style={{
              filter: reduce || focused ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: reduce || focused ? 1 : 0.55,
              transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Focus frame — animated corner brackets */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0"
        style={{ boxSizing: "content-box", padding: pad }}
        initial={false}
        animate={{
          x: rect.x - pad,
          y: rect.y - pad,
          width: rect.width,
          height: rect.height,
          opacity: rect.width > 0 ? 1 : 0,
        }}
        transition={{ duration: reduce ? 0 : animationDuration, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          "left-0 top-0 border-l-2 border-t-2",
          "right-0 top-0 border-r-2 border-t-2",
          "left-0 bottom-0 border-l-2 border-b-2",
          "right-0 bottom-0 border-r-2 border-b-2",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute h-3 w-3 ${pos}`}
            style={{ borderColor, filter: `drop-shadow(0 0 4px ${glowColor})` }}
          />
        ))}
      </motion.div>
    </div>
  );
}
