"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { caseStudies, getCaseMeta, type CaseStudy } from "@/data/work";
import { education, experiences } from "@/data/cv";
import { formatPeriod, yearsOfExperience } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import Spark from "@/components/Spark";
import { PulseCircle } from "@/components/figures/GeoFigures";

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
      style={{ transitionTimingFunction: "var(--ease-out)" }}
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
        aria-label={`${study.project} — ${getCaseMeta(study.slug).client}, ${study.category}, ${getCaseMeta(study.slug).year}`}
        className="group grid grid-cols-12 items-center gap-x-4 gap-y-3 rounded-[2px] py-7 no-underline outline-none transition-transform duration-500 focus-visible:translate-x-2 focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--paper)] md:py-9 md:hover:translate-x-2"
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        <span className="section-num col-span-2 text-lg md:col-span-1 md:text-xl">
          {study.num}
        </span>

        <div className="col-span-10 flex flex-col gap-1.5 md:col-span-6">
          <h3 className="font-display text-[clamp(1.7rem,4.4vw,2.9rem)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--ink)] transition-colors duration-500 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)]">
            {study.project}
          </h3>
          <span className="kicker text-[var(--ink-muted)]">
            {getCaseMeta(study.slug).client}
          </span>
        </div>

        <span className="kicker col-span-6 col-start-3 self-center text-[var(--ink-dim)] md:col-span-3 md:col-start-auto">
          {study.category}
        </span>

        <div className="col-span-4 col-start-9 flex items-center justify-end gap-3 self-center md:col-span-2 md:col-start-auto">
          <span className="kicker whitespace-nowrap text-[var(--ink-muted)]">
            {getCaseMeta(study.slug).year}
          </span>
          <span className="text-[var(--ink)] group-hover:text-[var(--ink)]">
            <RowArrow />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Career history — one source of truth: `cv.experiences`. */
interface ExperienceItem {
  period: string;
  company: string;
  role: string;
}

const experience: ExperienceItem[] = experiences
  .filter((e) => e.era !== "earlier")
  .map((e) => ({
    period: formatPeriod(e),
    company: e.company.name,
    role: e.roleShort ?? e.role,
  }));

/** Compact experience row aligned to the 12-col grid: period · company · role, one line each. */
function ExperienceRow({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease }}
      className="hairline-t grid grid-cols-12 items-baseline gap-x-4 gap-y-1.5 py-5 md:py-6"
    >
      <span className="section-num col-span-4 self-baseline text-sm md:col-span-3 md:text-base">
        {item.period}
      </span>
      <h4 className="col-span-8 font-display text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--ink)] md:col-span-4">
        {item.company}
      </h4>
      <span className="kicker col-span-12 col-start-1 self-baseline text-[var(--ink-muted)] md:col-span-5 md:col-start-auto md:text-right">
        {item.role}
      </span>
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
              className="col-span-12 flex flex-col gap-10 md:col-span-3"
            >
              <p className="kicker flex items-center gap-2.5">
                <Spark size={12} />/ 03 — Selected Work
              </p>

              {/* Animated outline mark — fills the header column's negative space */}
              <PulseCircle className="mt-auto hidden aspect-square w-16 md:block" />
            </motion.div>

            <RevealText
              as="h2"
              variant="mask"
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              Selected
              <br />
              work.
            </RevealText>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="col-span-12 self-end text-[15px] leading-[1.6] text-[var(--ink-muted)] md:col-span-3"
            >
              <span className="font-medium text-[var(--ink)]">
                {yearsOfExperience()} years of systems, products and teams —
              </span>{" "}
              from LATAM&apos;s largest marketplace to national banks, cruise
              lines and early-stage startups, plus one product I designed, built
              and shipped on my own. Seven that shaped how I work.
            </motion.p>
          </div>

          {/* Work rows — full-width, fields aligned to the 12-col grid, hairline between */}
          <div className="hairline-b mt-16 md:mt-20">
            {caseStudies.map((study, i) => (
              <ProjectRow key={study.slug} study={study} index={i} />
            ))}
          </div>

          {/* ── Experience — compact career list merged from the former timeline ── */}
          <div className="mt-24 md:mt-32">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker flex items-center gap-3"
            >
              <span className="h-px w-8 bg-[var(--line-strong)]" />
              / Experience
            </motion.p>

            <div className="hairline-b mt-8 md:mt-10">
              {experience.map((item, i) => (
                <ExperienceRow
                  key={`${item.company}-${item.period}`}
                  item={item}
                  index={i}
                />
              ))}
            </div>

            {/* Education folded to a single line — keeps the section lean */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="kicker mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--ink-dim)]"
            >
              <span className="text-[var(--ink-muted)]">/ Education</span>
              <span aria-hidden>—</span>
              {education[0].program}, {education[0].institution} (
              {education[0].start.year} — {education[0].end?.year})
            </motion.p>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
