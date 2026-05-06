"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { caseStudies, getCaseStudy, getNextCaseStudy } from "@/data/work";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="text-[var(--color-ink)] font-medium italic">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const study = getCaseStudy(params.slug);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroY = useTransform(heroProgress, [0, 1], [0, -100]);

  if (!study) {
    notFound();
  }

  const next = getNextCaseStudy(study.slug);

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <div className="grain-overlay" />

      {/* ============ Top bar ============ */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-[rgba(5,4,7,0.5)] border-b border-[var(--color-line)] px-8 py-4 flex justify-between items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <Link
          href="/"
          data-cursor="hover"
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors"
        >
          ← All work
        </Link>
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hidden md:block">
          {study.num} · {study.project}
        </div>
        <Link
          href="/#work"
          data-cursor="hover"
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
        >
          Doug × Vargas
        </Link>
      </motion.div>

      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end px-12 pb-24 pt-48 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top, ${study.colors[0]}22, transparent 60%), radial-gradient(ellipse at bottom right, ${study.colors[1]}15, transparent 50%), var(--color-bg-deep)`,
        }}
      >
        {/* Animated cover gradient */}
        <motion.div
          className="absolute inset-0 z-0 mix-blend-overlay opacity-[0.15]"
          style={{
            scale: heroScale,
            y: heroY,
            background: `linear-gradient(135deg, ${study.colors[0]}, ${study.colors[1]})`,
          }}
        />

        {/* Decorative noise */}
        <div
          className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          {/* Meta */}
          <motion.div
            className="flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] mb-12 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            <span>Case study {study.num}</span>
            <span className="text-[var(--color-ink-dim)]">·</span>
            <span>{study.category}</span>
            <span className="text-[var(--color-ink-dim)]">·</span>
            <span>{study.year}</span>
          </motion.div>

          {/* Client */}
          <motion.h2
            className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--color-accent)] mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            {study.client}
          </motion.h2>

          {/* Project name (huge) */}
          <h1 className="font-display text-[clamp(56px,11vw,180px)] leading-[0.92] tracking-[-0.04em] mb-12 max-w-[1100px]">
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block italic"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.7, ease }}
              >
                {study.project}
              </motion.span>
            </span>
          </h1>

          {/* Tagline */}
          <motion.p
            className="font-display text-[clamp(20px,2vw,28px)] text-[var(--color-ink)] max-w-[720px] leading-[1.4] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease }}
          >
            {study.tagline}
          </motion.p>
        </div>
      </section>

      {/* ============ Project meta strip ============ */}
      <section className="relative z-[2] px-12 py-12 bg-[var(--color-bg-deep)] border-y border-[var(--color-line)]">
        <FadeIn>
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Role", value: study.role },
              { label: "Duration", value: study.duration },
              { label: "Team", value: study.team },
              { label: "Year", value: study.year },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-2">
                  / {item.label}
                </div>
                <div className="text-[var(--color-ink)] text-[15px] leading-[1.4]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ============ The Challenge ============ */}
      <section className="relative z-[2] px-12 py-32 bg-[var(--color-bg-deep)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] md:sticky md:top-32">
              <span className="inline-block w-6 h-px bg-[var(--color-accent-warm)] mr-3 align-middle" />
              The challenge
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h3 className="font-display text-[clamp(28px,3vw,42px)] leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)]">
              {study.challenge}
            </h3>
          </FadeIn>
        </div>
      </section>

      {/* ============ Approach (numbered list) ============ */}
      <section className="relative z-[2] px-12 py-32 bg-[var(--color-bg-mid)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 mb-16 items-baseline">
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)]">
                <span className="inline-block w-6 h-px bg-[var(--color-accent)] mr-3 align-middle" />
                The approach
              </div>
              <h3 className="font-display text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.03em]">
                How we <span className="italic text-[var(--color-accent)]">shipped</span> it
              </h3>
            </div>
          </FadeIn>

          <div className="space-y-px bg-[var(--color-line)] border-y border-[var(--color-line)]">
            {study.approach.map((step, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="grid grid-cols-[60px_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-12 px-6 py-10 bg-[var(--color-bg-mid)] hover:bg-[var(--color-bg-soft)] transition-colors duration-500">
                  <div className="font-display italic text-[clamp(40px,5vw,64px)] leading-none text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-[clamp(16px,1.4vw,20px)] leading-[1.55] text-[var(--color-ink)] pt-2">
                    {renderBold(step)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Outcome + metrics ============ */}
      <section
        className="relative z-[2] px-12 py-32 overflow-hidden"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${study.colors[0]}10, transparent 60%), radial-gradient(circle at 70% 70%, ${study.colors[1]}08, transparent 60%), var(--color-bg-deep)`,
        }}
      >
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] md:sticky md:top-32">
              <span className="inline-block w-6 h-px bg-[var(--color-accent-cool)] mr-3 align-middle" />
              The outcome
            </div>
          </FadeIn>

          <div>
            <FadeIn>
              <h3 className="font-display text-[clamp(36px,6vw,72px)] leading-[0.95] tracking-[-0.03em] mb-8">
                <span className="italic text-[var(--color-accent)]">{study.outcome.headline}</span>
              </h3>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-[var(--color-ink-muted)] leading-[1.6] max-w-[680px] mb-16">
                {study.outcome.description}
              </p>
            </FadeIn>

            {study.outcome.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[var(--color-line)]">
                {study.outcome.metrics.map((m, i) => (
                  <FadeIn key={i} delay={0.2 + i * 0.08}>
                    <div>
                      <div className="font-display text-[clamp(40px,5vw,72px)] leading-none tracking-[-0.04em] mb-2">
                        <span className="italic text-[var(--color-accent)]">{m.value}</span>
                      </div>
                      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)]">
                        {m.label}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ Technologies + external link ============ */}
      {(study.technologies || study.externalLink) && (
        <section className="relative z-[2] px-12 py-24 bg-[var(--color-bg-deep)] border-t border-[var(--color-line)]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            {study.technologies && (
              <FadeIn>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-4">
                  / Tools & Methods
                </div>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink)] px-4 py-2 border border-[var(--color-line)] rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </FadeIn>
            )}

            {study.externalLink && (
              <FadeIn delay={0.1}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-4">
                  / Live link
                </div>
                <a
                  href={study.externalLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="font-display text-2xl italic text-[var(--color-accent)] no-underline border-b border-[rgba(139,127,255,0.3)] hover:border-[var(--color-accent)] inline-block transition-colors"
                >
                  {study.externalLink.label} →
                </a>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ============ Next project ============ */}
      <section
        className="relative z-[2] px-12 py-32 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, var(--color-bg-deep) 0%, ${next.colors[0]}15 100%)`,
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] mb-8">
              / Next case study
            </div>
          </FadeIn>

          <Link
            href={`/work/${next.slug}`}
            data-cursor="hover"
            className="block group no-underline text-inherit"
          >
            <FadeIn>
              <div className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--color-accent)] mb-6 group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {next.client}
              </div>
              <h2 className="font-display italic text-[clamp(56px,11vw,160px)] leading-[0.92] tracking-[-0.04em] text-[var(--color-ink)] mb-8 group-hover:text-[var(--color-accent)] transition-colors duration-500">
                {next.project}
                <span className="not-italic group-hover:translate-x-4 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {" "}→
                </span>
              </h2>
              <p className="text-lg text-[var(--color-ink-muted)] max-w-[720px] leading-[1.5]">
                {next.tagline}
              </p>
            </FadeIn>
          </Link>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="relative z-[2] px-12 py-16 bg-[var(--color-bg-deep)] border-t border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink-dim)]">
          <Link
            href="/"
            data-cursor="hover"
            className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)] transition-colors"
          >
            ← Back to all work
          </Link>
          <span>© 2026 Doug Vargas</span>
        </div>
      </footer>
    </SmoothScrollProvider>
  );
}
