"use client";

import { useEffect, useRef } from "react";

interface TextPressureProps {
  text: string;
  className?: string;
  /** Weight axis bounds (Fraunces: 100–900). Nearest cursor → maxWeight. */
  minWeight?: number;
  maxWeight?: number;
  /** Fluid font-size for the wordmark band. */
  fontSize?: string;
}

/**
 * Interactive display wordmark: each letter's weight swells as the cursor
 * nears it — "pressure" typography on the site's variable Fraunces
 * (--font-fraunces-vf, self-hosted via next/font — no remote fetch, no deps).
 *
 * Degrades to a static, legible wordmark on coarse pointers and under
 * prefers-reduced-motion, and pauses its rAF loop while scrolled off-screen.
 */
export default function TextPressure({
  text,
  className = "",
  minWeight = 100,
  maxWeight = 900,
  fontSize = "clamp(2.25rem, 11vw, 9rem)",
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cursor = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  const chars = [...text];

  useEffect(() => {
    const spans = spansRef.current;
    const setWeight = (span: HTMLSpanElement, w: number) => {
      span.style.fontVariationSettings = `'wght' ${Math.round(w)}`;
    };

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Static fallback: a gentle centre-weighted wordmark with real character.
    if (!fine || reduce) {
      const mid = (chars.length - 1) / 2 || 1;
      spans.forEach((s, i) => {
        if (!s) return;
        const t = 1 - Math.abs(i - mid) / mid;
        setWeight(s, minWeight + (maxWeight - minWeight) * (0.4 + 0.35 * t));
      });
      return;
    }

    const centerCursor = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      cursor.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      mouse.current = { ...cursor.current };
    };
    centerCursor();

    const onMove = (e: MouseEvent) => {
      cursor.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", centerCursor);

    let raf = 0;
    let running = true;

    const loop = () => {
      // Ease the smoothed pointer toward the raw cursor for a springy feel.
      mouse.current.x += (cursor.current.x - mouse.current.x) / 12;
      mouse.current.y += (cursor.current.y - mouse.current.y) / 12;

      const title = titleRef.current;
      if (title) {
        const maxDist = title.getBoundingClientRect().width / 2 || 1;
        spans.forEach((s) => {
          if (!s) return;
          const r = s.getBoundingClientRect();
          const d = Math.hypot(
            mouse.current.x - (r.x + r.width / 2),
            mouse.current.y - (r.y + r.height / 2),
          );
          const prox = Math.max(0, 1 - d / maxDist); // 1 near → 0 far
          setWeight(s, minWeight + (maxWeight - minWeight) * prox);
        });
      }
      raf = running ? requestAnimationFrame(loop) : 0;
    };

    // Only spend frames while the band is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !raf) loop();
      },
      { threshold: 0 },
    );
    if (containerRef.current) io.observe(containerRef.current);

    return () => {
      running = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", centerCursor);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text, minWeight, maxWeight, chars.length]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div
        ref={titleRef}
        role="img"
        aria-label={text}
        className="flex w-full justify-between uppercase text-[var(--color-ink)]"
        style={{
          fontFamily: "var(--font-fraunces-vf), Georgia, serif",
          fontSize,
          lineHeight: 0.85,
          letterSpacing: "-0.01em",
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            aria-hidden
            style={{ display: "inline-block", fontVariationSettings: "'wght' 400" }}
          >
            {c === " " ? " " : c}
          </span>
        ))}
      </div>
    </div>
  );
}
