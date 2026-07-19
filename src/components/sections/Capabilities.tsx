"use client";

import { motion, MotionConfig } from "framer-motion";
import BlurText from "@/components/text/BlurText";

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
  return (
    <section
      id="capabilities"
      className="relative px-6 md:px-12 py-[120px] md:py-[160px]"
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* Section header — 12-col editorial grid introduced by a top hairline */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
            >
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />
              / 04 — Capabilities
            </motion.div>

            <BlurText
              as="h2"
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              Four ways<br />
              <span className="text-[var(--color-accent)]">I work</span>
              <span className="text-[var(--color-ink-dim)]">.</span>
            </BlurText>
          </div>

          {/* Content — one capability per column on a 4-col grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-20 md:gap-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="group hairline-t flex flex-col gap-3 pt-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="section-num text-[clamp(28px,2.4vw,38px)] leading-none">
                    {cap.num}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                    /04
                  </span>
                </div>

                <h3 className="font-display text-[clamp(20px,1.6vw,26px)] font-medium tracking-[-0.01em] leading-[1.15] text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {cap.title.order === "before" ? (
                    <>
                      {cap.title.plain}
                      <span className="text-[var(--color-accent)]">{cap.title.accent}</span>
                    </>
                  ) : (
                    <>
                      {cap.title.plain}{" "}
                      <span className="text-[var(--color-accent)]">{cap.title.accent}</span>
                    </>
                  )}
                </h3>

                <p className="text-[14px] leading-[1.55] text-[var(--color-ink-muted)]">
                  {cap.desc}
                </p>

                <div className="mt-1 flex flex-wrap gap-2">
                  {cap.tags.map((tag, ti) => (
                    <span
                      key={ti}
                      className="glass-subtle font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-[var(--color-ink-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
