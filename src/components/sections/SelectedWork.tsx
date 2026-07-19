"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { caseStudies, type CaseStudy } from "@/data/work";
import BlurText from "@/components/text/BlurText";

const ease = [0.16, 1, 0.3, 1] as const;

/** SVG arrow: subtle on mobile, slides in on hover/focus on desktop. */
function RowArrow() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 opacity-50 transition-[transform,opacity] duration-500 md:-translate-x-1 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-focus-visible:translate-x-0 md:group-focus-visible:opacity-100"
      style={{ transitionTimingFunction: "var(--ease-quart-out)" }}
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full-width work row aligned to the 12-col grid: num · title · category · year. */
function ProjectRow({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className="hairline-t"
    >
      <Link
        href={`/work/${study.slug}`}
        aria-label={`${study.project} — ${study.client}, ${study.category}, ${study.year}`}
        className="group grid grid-cols-12 items-center gap-x-4 gap-y-3 rounded-[2px] py-7 no-underline outline-none transition-transform duration-500 focus-visible:translate-x-2 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--color-bg-deep)] md:py-9 md:hover:translate-x-2"
        style={{ transitionTimingFunction: "var(--ease-quart-out)" }}
      >
        <span className="section-num col-span-2 text-lg md:col-span-1 md:text-xl">
          {study.num}
        </span>

        <div className="col-span-10 flex flex-col gap-1.5 md:col-span-6">
          <h3 className="font-display text-[clamp(1.7rem,4.4vw,2.9rem)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--color-ink)] transition-colors duration-500 group-hover:text-[var(--color-accent)] group-focus-visible:text-[var(--color-accent)]">
            {study.project}
          </h3>
          <span className="kicker text-[var(--color-ink-muted)]">
            {study.client}
          </span>
        </div>

        <span className="kicker col-span-6 col-start-3 self-center text-[var(--color-ink-dim)] md:col-span-3 md:col-start-auto">
          {study.category}
        </span>

        <div className="col-span-4 col-start-9 flex items-center justify-end gap-3 self-center md:col-span-2 md:col-start-auto">
          <span className="kicker whitespace-nowrap text-[var(--color-ink-muted)]">
            {study.year}
          </span>
          <span className="text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            <RowArrow />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" className="relative px-6 py-[120px] md:px-12 md:py-[160px]">
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* Section header — canonical 12-col shape, introduced by a top hairline */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
            >
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />/ 02 — Selected Work
            </motion.div>

            <BlurText
              as="h2"
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              Selected
              <br />
              work.
            </BlurText>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="col-span-12 self-end text-[15px] leading-[1.6] text-[var(--color-ink-muted)] md:col-span-3"
            >
              A decade of systems, products, and teams — from LATAM&apos;s largest
              marketplace to national banks, cruise lines, and early-stage
              startups. Five that shaped how I work.
            </motion.p>
          </div>

          {/* Work rows — full-width, fields aligned to the 12-col grid, hairline between */}
          <div className="hairline-b mt-16 md:mt-20">
            {caseStudies.map((study, i) => (
              <ProjectRow key={study.slug} study={study} index={i} />
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
