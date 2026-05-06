"use client";

import { motion } from "framer-motion";

const heroLines = [
  { text: "Designing", italic: false },
  { text: "human products", italic: true, prefix: "" },
  { text: "for an AI era", italic: true, hasC: true },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative min-h-screen z-[2] px-12 flex flex-col justify-center" id="hero">
      <div className="max-w-[1400px] mx-auto w-full relative z-[3]">
        {/* Meta line */}
        <motion.div
          className="flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] mb-16 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-warm)] animate-pulse-dot shadow-[0_0_12px_var(--color-accent-warm)]" />
          <span>Available for selected projects · 2026</span>
          <span className="text-[var(--color-ink-dim)] ml-auto">
            Barranquilla, Colombia · UTC-5
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(64px,11vw,180px)] leading-[0.92] tracking-[-0.04em]">
          {/* Line 1 */}
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease }}
            >
              Designing
            </motion.span>
          </span>

          {/* Line 2 */}
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.92, ease }}
            >
              <span className="italic text-[var(--color-accent)]">human</span> products
            </motion.span>
          </span>

          {/* Line 3 */}
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 1.04, ease }}
            >
              for an <span className="italic text-[var(--color-accent)]">AI</span> era
              <sup className="text-[0.45em] italic text-[var(--color-ink-muted)] tracking-tight">©</sup>
            </motion.span>
          </span>
        </h1>

        {/* Bottom info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-20 items-end">
          {[
            {
              label: "/01 — The role",
              text: (
                <>
                  Senior Product Designer × Design Systems Architect.
                  Currently shaping{" "}
                  <a
                    href="https://ux.mercadolibre.com"
                    target="_blank"
                    rel="noopener"
                    data-cursor="hover"
                    className="text-[var(--color-accent)] no-underline border-b border-[rgba(139,127,255,0.3)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    Andes — Mercadolibre
                  </a>
                  &apos;s component library across LATAM.
                </>
              ),
            },
            {
              label: "/02 — The practice",
              text: "Twelve years translating ambiguity into interfaces — from banking dashboards to e-commerce systems used by millions.",
            },
            {
              label: "/03 — The edge",
              text: "Bridging classical product craft with AI-native workflows: prompt design, generative UI, and intelligent systems.",
            },
          ].map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 + i * 0.12, ease }}
            >
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-3">
                {info.label}
              </div>
              <p className="text-sm leading-[1.55] text-[var(--color-ink)] max-w-[340px]">
                {info.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-[var(--color-ink-dim)] uppercase flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        Scroll
        <span
          className="w-px h-8 animate-scroll-pulse"
          style={{
            background:
              "linear-gradient(180deg, var(--color-ink-dim), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
