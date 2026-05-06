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
  // Split preserving the marker tokens {x} (accent) and [x] (warm)
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
  const opacity = useTransform(progress, range, [0.15, 1]);
  const className =
    word.type === "accent"
      ? "italic text-[var(--color-accent)]"
      : word.type === "warm"
        ? "italic text-[var(--color-accent-warm)]"
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
      id="about"
      className="relative z-[2] py-[200px] px-12 bg-[var(--color-bg-deep)]"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-20 items-start">
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] md:sticky md:top-[100px]">
          <span
            className="inline-block w-6 h-px bg-[var(--color-accent)] mr-3 align-middle"
            aria-hidden
          />
          Manifesto
        </div>

        <p className="font-display text-[clamp(28px,3.4vw,52px)] leading-[1.2] tracking-[-0.02em]">
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
      </div>
    </section>
  );
}
