"use client";

import Link from "next/link";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { useState } from "react";
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
function ProjectRow(props: {
  study: CaseStudy;
  index: number;
  onEnter: (i: number) => void;
  onLeave: () => void;
}) {
  const { study, index, onEnter, onLeave } = props;

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
        onMouseEnter={() => onEnter(index)}
        onMouseLeave={onLeave}
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
          <span className="text-[var(--color-accent)]">
            <RowArrow />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Cursor-following project preview — desktop + fine-pointer only, decorative. */
function HoverPreview(props: {
  active: CaseStudy | null;
  show: boolean;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const { active, show, springX, springY } = props;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[40] hidden h-[220px] w-[320px] overflow-hidden rounded-[4px] lg:block"
      style={{ x: springX, y: springY }}
    >
      <AnimatePresence>
        {show && active && (
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.32, ease }}
            className="absolute inset-0 flex flex-col justify-end p-5"
            style={{
              background: `linear-gradient(135deg, ${active.colors[0]}, ${active.colors[1]})`,
            }}
          >
            <span className="font-display text-lg font-medium leading-tight tracking-[-0.02em] text-[#0A0A0A]">
              {active.project}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0A0A]/70">
              {active.client} · {active.year}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SelectedWork() {
  const reduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    // Trail the card just below-right of the cursor.
    x.set(e.clientX + 24);
    y.set(e.clientY + 24);
  };

  const active = activeIndex !== null ? caseStudies[activeIndex] : null;

  return (
    <section id="work" className="relative px-6 py-[120px] md:px-12 md:py-[160px]">
      {/* reducedMotion="user" collapses transform-based entrance motion for
          visitors who opted out, while keeping opacity fades. */}
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
              <span className="text-[var(--color-accent)]">work.</span>
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
          <div
            className="hairline-b mt-16 md:mt-20"
            onMouseMove={handleMove}
            onMouseLeave={() => setShow(false)}
          >
            {caseStudies.map((study, i) => (
              <ProjectRow
                key={study.slug}
                study={study}
                index={i}
                onEnter={(idx) => {
                  setActiveIndex(idx);
                  setShow(true);
                }}
                onLeave={() => setShow(false)}
              />
            ))}
          </div>
        </div>

        {!reduceMotion && (
          <HoverPreview
            active={active}
            show={show}
            springX={springX}
            springY={springY}
          />
        )}
      </MotionConfig>
    </section>
  );
}
