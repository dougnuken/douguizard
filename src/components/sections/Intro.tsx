"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useRef } from "react";
import Spark from "@/components/Spark";

const ease = [0.16, 1, 0.3, 1] as const;

/* Letter-by-letter reveal preserving the © superscript on accent words */
function AnimatedHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Two-tone hierarchy (KINETIC white-then-gray): strong-ink lead clause,
  // muted continuation. Emphasis carried by weight, never red — the single
  // Spark in the kicker is this section's only red mark.
  const segments: { text: string; className?: string }[] = [
    { text: "Designing ", className: "text-[var(--color-ink)]" },
    { text: "human ", className: "text-[var(--color-ink-strong)] font-black" },
    { text: "products", className: "text-[var(--color-ink)]" },
    { text: "\n" },
    { text: "for an ", className: "text-[var(--color-ink-muted)]" },
    { text: "AI ", className: "text-[var(--color-ink-muted)] font-bold italic" },
    { text: "era", className: "text-[var(--color-ink-muted)] relative" },
  ];

  return (
    <h2
      ref={ref}
      className="font-display font-medium leading-[0.92] tracking-[-0.02em] text-[clamp(48px,9vw,140px)]"
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
                  {ch === " " ? " " : ch}
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

const INFO = [
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
];

export default function Intro() {
  return (
    <section
      id="intro"
      className="relative z-[3] px-6 md:px-12 py-[120px] md:py-[160px]"
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* SECTION HEADER — top hairline, 12-col grid */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-2.5 md:col-span-3"
            >
              <Spark size={12} />
              / 01 — The Manifesto
            </motion.div>

            {/* Geometric figure — monochrome concentric rings occupying the
                header's negative space (photo substitute). Decorative only. */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="col-span-12 hidden items-start justify-end md:col-span-9 md:flex"
            >
              <div className="relative aspect-square w-[68px] rounded-full border border-[var(--color-line-strong)]">
                <div className="absolute inset-[9px] rounded-full border border-[var(--color-line)]" />
              </div>
            </motion.div>

            {/* The big statement line — h2 heading (spans full width) */}
            <div className="col-span-12 md:mt-2">
              <AnimatedHeadline />
            </div>
          </div>

          {/* CONTENT — three info columns aligned to the 12-col (multiple-of-4) grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 md:mt-20 md:gap-8">
            {INFO.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="hairline-t flex flex-col gap-3 pt-6 lg:col-span-4"
              >
                <span className="section-num text-[clamp(26px,2.2vw,36px)] leading-none">
                  {card.num}
                </span>
                <h3 className="font-display font-medium text-[clamp(20px,1.6vw,26px)] tracking-[-0.01em] text-[var(--color-ink)]">
                  {card.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-[var(--color-ink-muted)]">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
