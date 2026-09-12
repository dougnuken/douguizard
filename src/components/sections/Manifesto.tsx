"use client";

import { motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import BlurText from "@/components/text/BlurText";

const ease = [0.16, 1, 0.3, 1] as const;

const manifestoText =
  "I design products at the boundary between {craft} and [computation] — where typography meets intent, where systems become language, and where AI stops being a feature and starts being a collaborator. After years inside banks, marketplaces, and cruise lines, I've learned that good interfaces are not drawn — they are negotiated.";

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
      ? "text-[var(--color-accent)] font-normal"
      : word.type === "warm"
        ? "text-[var(--color-accent-warm)] font-normal"
        : "";

  return (
    <motion.span style={{ opacity }} className={`inline-block mr-[0.2em] ${className}`}>
      {word.text}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.15"],
  });

  const words = parseManifesto(manifestoText);

  return (
    <section
      ref={ref}
      id="manifesto"
      className="relative z-[3] px-6 py-[120px] md:px-12 md:py-[160px]"
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* Section header — top hairline + kicker on the 12-col grid */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
            >
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />/ 03 — Working
              principles
            </motion.div>
          </div>

          {/* Statement — heading in the left columns (sticky), word-reveal on the right */}
          <div className="mt-16 grid grid-cols-1 items-start gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
            <div className="flex flex-col md:col-span-4 md:sticky md:top-[120px] md:self-start">
              <BlurText
                as="h2"
                className="font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em]"
              >
                How I<br />
                <span className="text-[var(--color-accent)]">approach</span>
                <br />
                the work.
              </BlurText>

              <motion.div
                className="glass mt-12 hidden max-w-[280px] rounded-2xl p-6 lg:block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
              >
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-dim)]">
                  Note
                </div>
                <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted)]">
                  The work is the manifesto. Everything else is wallpaper.
                </p>
              </motion.div>
            </div>

            <div className="relative md:col-span-7 md:col-start-6">
              <div
                className="pointer-events-none absolute -left-2 -top-12 select-none font-display text-[120px] leading-none text-[var(--color-line-strong)]"
                aria-hidden
              >
                &ldquo;
              </div>

              <p className="relative font-display text-[clamp(22px,2.6vw,38px)] font-normal leading-[1.35] tracking-[-0.02em]">
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

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
                className="mt-10 flex items-center gap-3 border-t border-[var(--color-line)] pt-6"
              >
                <span className="font-display text-2xl italic text-[var(--color-ink)]">
                  Doug
                </span>
                <span className="h-px flex-1 bg-[var(--color-line)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-dim)]">
                  Barranquilla, 2026
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
