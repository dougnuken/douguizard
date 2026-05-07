"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Capability {
  num: string;
  title: { plain: string; accent: string; order: "before" | "after" };
  desc: string;
  tags: string[];
}

const capabilities: Capability[] = [
  {
    num: "01",
    title: { plain: "Product", accent: "Design", order: "after" },
    desc: "End-to-end product thinking — from research and journeys to UI craft and prototypes that ship. Mobile, web, dashboards, marketplaces.",
    tags: ["UX Strategy", "Wireframes", "Prototyping", "UI Design"],
  },
  {
    num: "02",
    title: { plain: "Design", accent: "Systems", order: "after" },
    desc: "Building, scaling, and maintaining design libraries used by hundreds of designers and engineers. Tokens, components, governance.",
    tags: ["Tokens", "Components", "Governance", "Documentation"],
  },
  {
    num: "03",
    title: { plain: "AI ", accent: "× Interface", order: "before" },
    desc: "Designing with and for generative systems. Prompt-driven UX, conversational interfaces, AI agent flows, and ethical guardrails.",
    tags: ["Prompt Design", "Generative UI", "Agent Flows", "LLM UX"],
  },
  {
    num: "04",
    title: { plain: "Tech", accent: "Leadership", order: "after" },
    desc: "Leading design systems orgs across cross-functional engineering teams. Mentorship, design ops, and shipping at platform scale.",
    tags: ["Mentorship", "Design Ops", "Cross-platform", "Strategy"],
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Capabilities() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="capabilities"
      className="relative z-[3] px-6 md:px-12 py-[140px] md:py-[180px]"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-16 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 03 — Capabilities
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease }}
          className="font-display font-light text-[clamp(40px,6vw,84px)] leading-[0.95] tracking-[-0.05em] mb-16 md:mb-24 max-w-3xl"
        >
          Four ways<br />
          <span className="text-[var(--color-accent)]">I work</span>
          <span className="text-[var(--color-ink-dim)]">.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: (i % 2) * 0.1,
                ease,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="glass rounded-2xl md:rounded-3xl p-7 md:p-10 group relative overflow-hidden cursor-default transition-all duration-500"
            >
              {/* Spotlight glow on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
                animate={{ opacity: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(184,164,255,0.12) 0%, transparent 60%)",
                }}
              />

              {/* Number row */}
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-6 flex items-center gap-3 relative z-10">
                <span>{cap.num}</span>
                <span className="flex-1 h-px bg-[var(--color-line)]" />
                <motion.span
                  animate={{
                    color:
                      hovered === i
                        ? "var(--color-accent)"
                        : "var(--color-ink-dim)",
                  }}
                >
                  /04
                </motion.span>
              </div>

              {/* Title */}
              <h3 className="relative z-10 font-display text-[clamp(28px,3.5vw,48px)] font-light tracking-[-0.04em] leading-[1.05] mb-5">
                {cap.title.order === "before" ? (
                  <>
                    {cap.title.plain}
                    <span className="text-[var(--color-accent)]">
                      {cap.title.accent}
                    </span>
                  </>
                ) : (
                  <>
                    {cap.title.plain}{" "}
                    <span className="text-[var(--color-accent)]">
                      {cap.title.accent}
                    </span>
                  </>
                )}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-[14px] leading-[1.55] text-[var(--color-ink-muted)] mb-6 max-w-[420px]">
                {cap.desc}
              </p>

              {/* Tags — using glass-pressed style */}
              <div className="relative z-10 flex flex-wrap gap-2">
                {cap.tags.map((tag, ti) => (
                  <span
                    key={ti}
                    className="glass-pressed font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-[var(--color-ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}