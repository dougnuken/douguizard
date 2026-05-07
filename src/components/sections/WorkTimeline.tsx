"use client";

import { motion } from "framer-motion";

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

function ExperienceRow(props: { item: ExperienceItem; index: number }) {
  const { item, index } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
      className="grid grid-cols-12 gap-6 md:gap-10 py-8 md:py-10 border-t border-[var(--color-line)] group"
    >
      <div className="col-span-12 md:col-span-3 flex items-start gap-3">
        {item.current && (
          <span className="relative flex h-2 w-2 mt-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full animate-pulse-glow" style={{ background: "var(--color-accent)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--color-accent)" }} />
          </span>
        )}
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)] leading-[1.5]">
          {item.period}
        </span>
      </div>

      <div className="col-span-12 md:col-span-9 flex flex-col gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="font-display text-2xl md:text-3xl font-light tracking-[-0.03em] text-[var(--color-ink-strong)] group-hover:text-[var(--color-accent)] transition-colors duration-500">
            {item.company}
          </h3>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-dim)]">
            {item.location}
          </span>
        </div>
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)]">
          {item.role}
        </div>
        <p className="text-[14px] md:text-[15px] leading-[1.6] text-[var(--color-ink-muted)] max-w-[640px]">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function EducationRow(props: { item: EducationItem; index: number }) {
  const { item, index } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease }}
      className="flex items-baseline gap-6 py-4 border-t border-[var(--color-line)]"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-dim)] w-[110px] shrink-0">
        {item.year}
      </span>
      <div className="flex-1">
        <div className="text-[14px] text-[var(--color-ink-strong)] mb-0.5">
          {item.title}
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)]">
          {item.institution}
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkTimeline() {
  return (
    <section id="work" className="relative z-[3] px-6 md:px-12 py-[140px] md:py-[180px]">
      <div className="relative z-[2] max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-16 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 04 — Experience
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 mb-20 md:mb-28">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(40px,6vw,84px)] font-light leading-[0.95] tracking-[-0.05em]"
          >
            Twelve years,<br />
            <span className="text-[var(--color-accent)]">five chapters.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="text-[14px] md:text-[15px] leading-[1.65] text-[var(--color-ink-muted)] max-w-[420px] self-end"
          >
            From wireframing for early-stage startups in Barranquilla to leading design systems at LATAM&apos;s largest marketplace. Each chapter built on the last.
          </motion.p>
        </div>

        <div className="mb-24">
          {experience.map((item, i) => (
            <ExperienceRow key={i} item={item} index={i} />
          ))}
          <div className="border-t border-[var(--color-line)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease }}
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-20 pt-16 md:pt-20 border-t border-[var(--color-line-strong)]"
        >
          <div>
            <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-line-strong)]" />
              / Education
            </div>
            <h3 className="font-display text-[clamp(28px,4vw,48px)] font-light leading-[1.05] tracking-[-0.04em]">
              Always<br />
              <span className="text-[var(--color-accent)]">learning.</span>
            </h3>
          </div>

          <div>
            {education.map((item, i) => (
              <EducationRow key={i} item={item} index={i} />
            ))}
            <div className="border-t border-[var(--color-line)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}