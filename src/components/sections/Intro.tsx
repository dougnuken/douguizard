"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/* Letter-by-letter reveal preserving the © superscript on accent words */
function AnimatedHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Each segment can have its own className for accent / weight / size
  const segments: { text: string; className?: string }[] = [
    { text: "Designing " },
    { text: "human ", className: "text-[var(--color-accent)] font-light italic" },
    { text: "products" },
    { text: "\n" },
    { text: "for an " },
    { text: "AI ", className: "text-[var(--color-accent-warm)] font-light italic" },
    { text: "era", className: "relative" },
  ];

  // Build a flat array of letters with style metadata
  let charIndex = 0;
  const allChars: { char: string; segIndex: number; segClass?: string; isLastChar?: boolean }[] = [];
  segments.forEach((seg, segIdx) => {
    const chars = seg.text.split("");
    chars.forEach((c) => {
      allChars.push({ char: c, segIndex: segIdx, segClass: seg.className });
      charIndex++;
    });
  });

  return (
    <h2
      ref={ref}
      className="font-display font-light leading-[0.92] tracking-[-0.05em] text-[clamp(48px,9vw,140px)]"
    >
      {segments.map((seg, segIdx) => {
        if (seg.text === "\n") return <br key={`br-${segIdx}`} />;
        const chars = seg.text.split("");
        return (
          <span key={`seg-${segIdx}`} className={`inline-block ${seg.className ?? ""}`}>
            {chars.map((ch, i) => {
              // Compute global delay across all segments
              const globalIndex = segments
                .slice(0, segIdx)
                .reduce((acc, s) => acc + (s.text === "\n" ? 0 : s.text.length), 0) + i;
              return (
                <motion.span
                  key={i}
                  initial={{ y: 80, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: globalIndex * 0.025,
                    ease,
                  }}
                  className="inline-block"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              );
            })}
            {/* Add © superscript after "era" */}
            {segIdx === segments.length - 1 && (
              <motion.span
                className="text-[0.25em] align-super ml-1 text-[var(--color-ink-muted)]"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                ©
              </motion.span>
            )}
          </span>
        );
      })}
    </h2>
  );
}

export default function Intro() {
  return (
    <section
      id="intro"
      className="relative z-[3] px-6 md:px-12 pt-[160px] pb-[140px] md:pt-[200px] md:pb-[180px]"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-20 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 01 — The Manifesto
        </motion.div>

        {/* The headline */}
        <AnimatedHeadline />

        {/* Subscript — three quick info columns with neumorphism cards */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              num: "/A",
              title: "The role",
              text: "Senior Product Designer × Design Systems Architect — currently leading components at Andes/Mercadolibre.",
            },
            {
              num: "/B",
              title: "The practice",
              text: "Twelve years translating ambiguity into interfaces — banking dashboards to e-commerce systems used by millions.",
            },
            {
              num: "/C",
              title: "The edge",
              text: "Bridging classical product craft with AI-native workflows: prompt design, generative UI, intelligent systems.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className="neu-surface-soft rounded-2xl p-6 md:p-8 group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)]">
                  {card.num}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)]">
                  {card.title}
                </span>
              </div>
              <p className="text-[14px] md:text-[15px] leading-[1.55] text-[var(--color-ink)]">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
