"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const manifestoText =
  "I design products at the boundary between {craft} and [computation] — where typography meets intent, where systems become language, and where AI stops being a feature and starts being a collaborator. After twelve years inside banks, marketplaces, and cruise lines, I've learned that good interfaces are not drawn — they are negotiated.";

interface WordToken {
  text: string;
  type: "normal" | "accent" | "warm";
}

function parseManifesto(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  const regex = /\{([^}]+)\}|\[([^\]]+)\]|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m[1]) tokens.push({ text: m[1], type: "accent" });
    else if (m[2]) tokens.push({ text: m[2], type: "warm" });
    else if (m[3]) tokens.push({ text: m[3], type: "normal" });
  }
  return tokens;
}

function Word({
  word,
  progress,
  range,
}: {
  word: WordToken;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const className =
    word.type === "accent"
      ? "text-[var(--color-accent)] font-light"
      : word.type === "warm"
        ? "text-[var(--color-accent-warm)] font-light"
        : "";

  return (
    <motion.span style={{ opacity }} className={`inline-block mr-[0.2em] ${className}`}>
      {word.text}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.15"],
  });

  const words = parseManifesto(manifestoText);

  return (
    <section
      ref={ref}
      id="manifesto"
      className="relative z-[3] py-[160px] md:py-[220px] px-6 md:px-12"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-20 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 02 — Working principles
        </motion.div>

        {/* Two-column layout: title + text */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 items-start">
          {/* Title column with neumorphism background mark */}
          <div className="lg:sticky lg:top-[120px]">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(40px,6vw,84px)] font-light leading-[0.95] tracking-[-0.05em]"
            >
              How I<br />
              <span className="text-[var(--color-accent)] italic">approach</span>
              <br />
              the work.
            </motion.h2>

            {/* Decorative neumorphic block underneath */}
            <motion.div
              className="mt-12 neu-surface-soft rounded-2xl p-6 hidden lg:block max-w-[280px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-3">
                Note
              </div>
              <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted)]">
                The work is the manifesto. Everything else is wallpaper.
              </p>
            </motion.div>
          </div>

          {/* Manifesto paragraph — large body text with scroll-reveal */}
          <div className="relative">
            {/* Quote mark decoration */}
            <div
              className="absolute -top-12 -left-2 font-display text-[120px] leading-none text-[var(--color-line-strong)] pointer-events-none select-none"
              aria-hidden
            >
              &ldquo;
            </div>

            <p className="relative font-display font-light text-[clamp(22px,2.6vw,38px)] leading-[1.35] tracking-[-0.02em]">
              {words.map((w, i) => {
                const start = i / words.length;
                const end = (i + 1) / words.length;
                return (
                  <Word
                    key={i}
                    word={w}
                    progress={scrollYProgress}
                    range={[start, end]}
                  />
                );
              })}
            </p>

            {/* Signature line */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 pt-6 border-t border-[var(--color-line)] flex items-center gap-3"
            >
              <span className="font-display italic text-2xl text-[var(--color-ink)]">
                Doug
              </span>
              <span className="flex-1 h-px bg-[var(--color-line)]" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)]">
                Barranquilla, 2026
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
