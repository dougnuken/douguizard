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
    num: "01 / 04",
    title: { plain: "Design", accent: "Product", order: "after" },
    desc: "End-to-end product thinking — from research and journeys to UI craft and prototypes that ship. Mobile, web, dashboards, marketplaces.",
    tags: ["UX Strategy", "Wireframes", "Prototyping", "UI Design"],
  },
  {
    num: "02 / 04",
    title: { plain: "Systems", accent: "Design", order: "after" },
    desc: "Building, scaling, and maintaining design libraries used by hundreds of designers and engineers. Tokens, components, governance.",
    tags: ["Tokens", "Components", "Governance", "Documentation"],
  },
  {
    num: "03 / 04",
    title: { plain: "AI ", accent: "× Interface", order: "before" },
    desc: "Designing with and for generative systems. Prompt-driven UX, conversational interfaces, AI agent flows, and ethical guardrails.",
    tags: ["Prompt Design", "Generative UI", "Agent Flows", "LLM UX"],
  },
  {
    num: "04 / 04",
    title: { plain: " & Craft", accent: "Mentorship", order: "before" },
    desc: "Workshops, design crits, and 1:1 mentorship. Helping teams sharpen visual craft, systems thinking, and AI fluency.",
    tags: ["Workshops", "Design Crits", "1:1", "Speaking"],
  },
];

function CapCard({ cap, index }: { cap: Capability; index: number }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      className="bg-[var(--color-bg-deep)] p-12 relative overflow-hidden cursor-default group"
      data-cursor="hover"
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hover spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(139, 127, 255, 0.08), transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="font-mono text-[11px] text-[var(--color-ink-dim)] tracking-[0.2em] mb-8">
          {cap.num}
        </div>
        <h3 className="font-display text-4xl tracking-tight mb-4 leading-[1.1]">
          {cap.title.order === "before" ? (
            <>
              <span className="italic text-[var(--color-accent)]">{cap.title.accent}</span>
              {cap.title.plain}
            </>
          ) : (
            <>
              {cap.title.plain}{" "}
              <span className="italic text-[var(--color-accent)]">{cap.title.accent}</span>
            </>
          )}
        </h3>
        <p className="text-sm leading-[1.6] text-[var(--color-ink-muted)] max-w-[380px]">
          {cap.desc}
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {cap.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-ink-muted)] border border-[var(--color-line)] px-2.5 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section className="relative z-[2] px-12 pt-[120px] pb-[200px] bg-[var(--color-bg-deep)] border-t border-[var(--color-line)]">
      <motion.div
        className="max-w-[1200px] mx-auto mb-20 flex justify-between items-baseline"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-[11px] tracking-[0.25em] text-[var(--color-ink-muted)]">
          / 01 — Capabilities
        </span>
        <h2 className="font-display text-[clamp(40px,6vw,88px)] tracking-[-0.03em] leading-[0.95]">
          What I <span className="italic text-[var(--color-accent)]">do</span>
        </h2>
      </motion.div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
        {capabilities.map((cap, i) => (
          <CapCard key={cap.num} cap={cap} index={i} />
        ))}
      </div>
    </section>
  );
}
