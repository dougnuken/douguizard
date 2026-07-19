"use client";

import { motion, MotionConfig } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  description: string;
  location: string;
  current?: boolean;
}

const experience: ExperienceItem[] = [
  {
    period: "2024 — Jan 2026",
    company: "Mercadolibre",
    role: "Technical Lead — Andes Design System",
    description: "Advanced leadership at Andes. Building and maintaining components and the design library, establishing new foundational definitions, and collaborating cross-platform with engineering teams across LATAM.",
    location: "Remote · LATAM",
  },
  {
    period: "2018 — 2024",
    company: "Aval Digital Labs",
    role: "Senior Product Designer · Design System Gatekeeper",
    description: "Mentorship, workshops, classes and design system advocacy for Banco de Occidente — one of the biggest banks in Colombia. Mobile and web interfaces at scale.",
    location: "Bogotá, Colombia",
  },
  {
    period: "2017 — 2018",
    company: "Globant",
    role: "Senior Product Designer",
    description: "Mobile and web design interfaces for Royal Caribbean Cruises. Cross-functional collaboration with engineering and product teams.",
    location: "Medellín, Colombia",
  },
  {
    period: "2017 — 2018",
    company: "Qrvey",
    role: "Lead UI Designer",
    description: "Mobile and web design lead for Qrvey's analytics platform. Focused on UX/UI improvement for dashboards, charts and platform features.",
    location: "Barranquilla, Colombia",
  },
  {
    period: "2016 — 2017",
    company: "Ideaware",
    role: "Senior UX/UI Designer",
    description: "Wireframes, UI Kits, prototypes for websites and applications. Foundation years of design systems thinking and product craft.",
    location: "Barranquilla, Colombia",
  },
];

interface EducationItem {
  year: string;
  title: string;
  institution: string;
}

const education: EducationItem[] = [
  { year: "2022", title: "Introduction to UI", institution: "Coursera" },
  { year: "2020", title: "Design System Essentials", institution: "Aval Digital Labs" },
  { year: "2018", title: "Design Foundations", institution: "Globant" },
  { year: "2006 — 2009", title: "Professional Graphic Designer", institution: "Universidad Autónoma del Caribe" },
];

/** Full-width experience row aligned to the 12-col grid: period (3) + main (9). */
function ExperienceRow(props: { item: ExperienceItem; index: number }) {
  const { item, index } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className="hairline-t group grid grid-cols-1 gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10"
    >
      {/* Period — col-span-3 */}
      <div className="col-span-12 flex items-start gap-3 md:col-span-3">
        {item.current && (
          <span className="relative mt-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full animate-pulse-glow" style={{ background: "var(--color-accent)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--color-accent)" }} />
          </span>
        )}
        <span className="font-mono text-[11px] uppercase leading-[1.5] tracking-[0.18em] text-[var(--color-ink-muted)]">
          {item.period}
        </span>
      </div>

      {/* Company + role + description — col-span-9 */}
      <div className="col-span-12 flex flex-col gap-3 md:col-span-9">
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="font-display text-2xl font-medium tracking-[-0.02em] text-[var(--color-ink-strong)] transition-colors duration-500 group-hover:text-[var(--color-accent)] md:text-3xl">
            {item.company}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-dim)]">
            {item.location}
          </span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          {item.role}
        </div>
        <p className="max-w-[640px] text-[14px] leading-[1.6] text-[var(--color-ink-muted)] md:text-[15px]">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

/** Editorial column item for the 4-col education grid: red year numeral + title + institution. */
function EducationColumn(props: { item: EducationItem; index: number }) {
  const { item, index } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className="hairline-t flex flex-col gap-3 pt-6"
    >
      <span className="section-num text-[clamp(18px,1.4vw,22px)] leading-none">
        {item.year}
      </span>
      <h4 className="font-medium text-[clamp(20px,1.6vw,26px)] leading-[1.15] tracking-[-0.01em] text-[var(--color-ink-strong)]">
        {item.title}
      </h4>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
        {item.institution}
      </span>
    </motion.div>
  );
}

export default function WorkTimeline() {
  return (
    <section id="experience" className="relative z-[3] px-6 md:px-12 py-[120px] md:py-[160px]">
      <MotionConfig reducedMotion="user">
        <div className="relative z-[2] mx-auto max-w-[1400px]">
          {/* ── Section header — 12-col grid ── */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
            >
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />
              / 05 — Experience
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              Twelve years,<br />
              <span className="text-[var(--color-accent)]">five chapters.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="col-span-12 self-end text-[15px] leading-[1.6] text-[var(--color-ink-muted)] md:col-span-3"
            >
              From wireframing for early-stage startups in Barranquilla to leading design systems at LATAM&apos;s largest marketplace. Each chapter built on the last.
            </motion.p>
          </div>

          {/* ── Experience rows — full-width, 12-col aligned ── */}
          <div className="mt-16 md:mt-20">
            {experience.map((item, i) => (
              <ExperienceRow key={i} item={item} index={i} />
            ))}
            <div className="hairline-t" />
          </div>

          {/* ── Education — heading block + 4-col row ── */}
          <div className="mt-24 md:mt-28">
            <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease }}
                className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
              >
                <span className="h-px w-8 bg-[var(--color-line-strong)]" />
                / Education
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease }}
                className="col-span-12 font-display text-[clamp(28px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.02em] md:col-span-9"
              >
                Always<br />
                <span className="text-[var(--color-accent)]">learning.</span>
              </motion.h3>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-16 md:gap-8">
              {education.map((item, i) => (
                <EducationColumn key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
