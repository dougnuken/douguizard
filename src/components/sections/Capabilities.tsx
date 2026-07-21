"use client";

import { motion, MotionConfig } from "framer-motion";
import BlurText from "@/components/text/BlurText";
import Spark from "@/components/Spark";
import { ColumnMark } from "@/components/figures/GeoFigures";

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
    title: { plain: "AI-native", accent: "Build", order: "after" },
    desc: "Design and engineering in one motion — prototyping in code with AI in the loop: generative UI, LLM-driven flows, and real shipped interfaces. Claude Code, Cursor, Gemini.",
    tags: ["Code Prototyping", "Generative UI", "LLM UX", "Ship"],
  },
  {
    num: "04",
    title: { plain: "Tech", accent: "Leadership", order: "after" },
    desc: "Leading design systems orgs across cross-functional engineering teams. Mentorship, design ops, and shipping at platform scale.",
    tags: ["Mentorship", "Design Ops", "Cross-platform", "Strategy"],
  },
];

/** Daily kit — names pulled from the retired ToolsMarquee, shown as a static inline list. */
const tools = [
  "Figma",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Notion",
  "Webflow",
  "Framer",
  "GitHub",
  "Cursor",
  "Claude Code",
  "Gemini",
  "ChatGPT",
  "v0",
  "Midjourney",
];

interface Proof {
  num: string;
  suffix?: string;
  label: string;
}

/** Key figures pulled from the retired Stats section — proof of scale. */
const proof: Proof[] = [
  { num: "12", label: "Years in product design" },
  { num: "18", label: "Countries Andes ships to" },
  { num: "400", suffix: "+", label: "Designers on the system" },
  { num: "2", suffix: "K+", label: "Engineers on the system" },
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
              className="kicker col-span-12 flex items-center gap-2.5 md:col-span-3"
            >
              <Spark size={12} />
              / 02 — Capabilities
            </motion.div>

            <BlurText
              as="h2"
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              <span className="font-bold text-[var(--color-ink)]">Four ways</span><br />
              <span className="text-[var(--color-ink-muted)]">I work</span>
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
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="section-num text-[clamp(28px,2.4vw,38px)] leading-none">
                      {cap.num}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                      /04
                    </span>
                  </div>
                  <ColumnMark index={i} />
                </div>

                <h3 className="font-display text-[clamp(20px,1.6vw,26px)] font-medium tracking-[-0.01em] leading-[1.15] text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {cap.title.order === "before" ? (
                    <>
                      {cap.title.plain}
                      <span className="text-[var(--color-ink-muted)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">{cap.title.accent}</span>
                    </>
                  ) : (
                    <>
                      {cap.title.plain}{" "}
                      <span className="text-[var(--color-ink-muted)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">{cap.title.accent}</span>
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

          {/* Merged sub-block — TOOLS: static inline kit (was ToolsMarquee) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="mt-20 md:mt-28"
          >
            <div className="kicker mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />/ Tools — Daily kit
            </div>
            <ul className="hairline-t flex flex-wrap gap-x-6 gap-y-2.5 pt-6">
              {tools.map((tool) => (
                <li
                  key={tool}
                  className="font-mono text-[12px] tracking-[0.08em] text-[var(--color-ink-muted)] transition-colors duration-300 hover:text-[var(--color-ink)] md:text-[13px]"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Merged sub-block — PROOF: key figures (was Stats) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="mt-16 md:mt-20"
          >
            <div className="kicker mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />/ Proof — By the numbers
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 md:gap-8">
              {proof.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease }}
                  className="hairline-t flex flex-col gap-2 pt-5"
                >
                  <div className="font-display text-[clamp(40px,5vw,72px)] font-medium tracking-[-0.03em] leading-[0.9] text-[var(--color-ink)]">
                    {stat.num}
                    {stat.suffix && (
                      <span className="text-[var(--color-ink-dim)]">{stat.suffix}</span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)] leading-[1.6]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  );
}
