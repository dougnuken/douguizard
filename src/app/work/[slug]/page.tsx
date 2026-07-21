"use client";

import { useEffect } from "react";
import { motion, MotionConfig } from "framer-motion";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudy, getNextCaseStudy } from "@/data/work";
import Spark from "@/components/Spark";
import RevealText from "@/components/text/RevealText";

const ease = [0.16, 1, 0.3, 1] as const;

/** Container-level fade + rise, on scroll into view. For eyebrows and groups. */
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
        <strong key={i} className="font-bold text-[var(--color-ink)]">
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

  // Detail pages are a normal vertical document. Clear any chrome-theme state
  // left on <html> by the home shell and start at the top, so scroll is never
  // locked when arriving via client-side navigation from the horizontal home.
  useEffect(() => {
    document.documentElement.removeAttribute("data-panel-theme");
    window.scrollTo(0, 0);
  }, []);

  if (!study) {
    notFound();
  }

  const next = getNextCaseStudy(study.slug);

  return (
    <MotionConfig reducedMotion="user">
      {/* ============ Top bar — light glass, ink text ============ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-[var(--color-bg-glass)] hairline-b px-6 md:px-12 py-4 flex justify-between items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] no-underline hover:text-[var(--color-accent)] transition-colors"
        >
          ← All work
        </Link>
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hidden md:block">
          {study.num} · {study.project}
        </div>
        <Link
          href="/#work"
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)] transition-colors"
        >
          Doug × Vargas
        </Link>
      </motion.header>

      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 pb-24 pt-40 md:pt-48 overflow-hidden bg-[var(--color-bg-deep)]">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          {/* Meta — the one Spark lives here */}
          <motion.div
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] mb-12 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            <Spark size={12} />
            <span>Case study {study.num}</span>
            <span className="text-[var(--color-ink-dim)]">·</span>
            <span>{study.category}</span>
            <span className="text-[var(--color-ink-dim)]">·</span>
            <span>{study.year}</span>
          </motion.div>

          {/* Client — the one red label kicker */}
          <motion.h2
            className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--color-accent)] mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            {study.client}
          </motion.h2>

          {/* Project name (huge · upright · weight-driven) */}
          <h1 className="font-display font-black text-[clamp(56px,11vw,180px)] leading-[0.9] tracking-[-0.04em] text-[var(--color-ink-strong)] mb-12 max-w-[1100px]">
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block"
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
      <section className="relative z-[2] px-6 md:px-12 py-12 bg-[var(--color-bg-deep)] border-y border-[var(--color-line)]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Role", value: study.role },
            { label: "Duration", value: study.duration },
            { label: "Team", value: study.team },
            { label: "Year", value: study.year },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.06}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-2">
                / {item.label}
              </div>
              <div className="text-[var(--color-ink)] text-[15px] leading-[1.4]">
                {item.value}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============ The Challenge ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-32 bg-[var(--color-bg-deep)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] md:sticky md:top-32">
              <span className="inline-block w-6 h-px bg-[var(--color-ink)] mr-3 align-middle" />
              The challenge
            </div>
          </FadeIn>

          <RevealText
            as="h3"
            variant="mask"
            delay={0.1}
            className="font-display text-[clamp(28px,3vw,42px)] leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)]"
          >
            {study.challenge}
          </RevealText>
        </div>
      </section>

      {/* ============ Approach (numbered list) ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-32 bg-[var(--color-bg-mid)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 mb-16 items-baseline">
            <FadeIn>
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)]">
                <span className="inline-block w-6 h-px bg-[var(--color-ink)] mr-3 align-middle" />
                The approach
              </div>
            </FadeIn>
            <RevealText
              as="h3"
              variant="mask"
              className="font-display font-medium text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.03em] text-[var(--color-ink)]"
            >
              How we{" "}
              <span className="font-black text-[var(--color-ink-strong)]">
                shipped
              </span>{" "}
              it
            </RevealText>
          </div>

          <div className="space-y-px bg-[var(--color-line)] border-y border-[var(--color-line)]">
            {study.approach.map((step, i) => (
              <div
                key={i}
                className="grid grid-cols-[60px_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-12 px-6 py-10 bg-[var(--color-bg-mid)] hover:bg-[var(--color-bg-soft)] transition-colors duration-500"
              >
                <RevealText
                  as="div"
                  variant="mask"
                  delay={i * 0.04}
                  className="section-num text-[clamp(40px,5vw,64px)] leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </RevealText>
                <RevealText
                  as="p"
                  variant="fade"
                  delay={i * 0.04 + 0.06}
                  className="text-[clamp(16px,1.4vw,20px)] leading-[1.55] text-[var(--color-ink)] pt-2"
                >
                  {renderBold(step)}
                </RevealText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Outcome + metrics ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-32 bg-[var(--color-bg-soft)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] md:sticky md:top-32">
              <span className="inline-block w-6 h-px bg-[var(--color-ink)] mr-3 align-middle" />
              The outcome
            </div>
          </FadeIn>

          <div>
            <RevealText
              as="h3"
              variant="mask"
              className="font-display font-black text-[clamp(36px,6vw,72px)] leading-[0.95] tracking-[-0.03em] text-[var(--color-ink-strong)]"
            >
              {study.outcome.headline}
            </RevealText>

            <RevealText
              as="p"
              variant="fade"
              delay={0.1}
              className="text-lg text-[var(--color-ink-muted)] leading-[1.6] max-w-[680px] mb-16 mt-8"
            >
              {study.outcome.description}
            </RevealText>

            {study.outcome.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[var(--color-line)]">
                {study.outcome.metrics.map((m, i) => (
                  <div key={i}>
                    <RevealText
                      as="div"
                      variant="mask"
                      delay={0.15 + i * 0.08}
                      className="font-display font-black text-[clamp(40px,5vw,72px)] leading-none tracking-[-0.04em] mb-2 text-[var(--color-ink-strong)]"
                    >
                      {m.value}
                    </RevealText>
                    <RevealText
                      as="div"
                      variant="fade"
                      delay={0.22 + i * 0.08}
                      className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)]"
                    >
                      {m.label}
                    </RevealText>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ Technologies + external link ============ */}
      {(study.technologies || study.externalLink) && (
        <section className="relative z-[2] px-6 md:px-12 py-24 bg-[var(--color-bg-deep)] border-t border-[var(--color-line)]">
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
                  className="font-display text-2xl text-[var(--color-ink)] no-underline border-b border-[var(--color-line-strong)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] inline-block transition-colors"
                >
                  {study.externalLink.label} →
                </a>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ============ Next project ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-32 bg-[var(--color-bg-mid)] border-t border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] mb-8">
              / Next case study
            </div>
          </FadeIn>

          <Link href={`/work/${next.slug}`} className="block group no-underline text-inherit">
            <FadeIn>
              <div className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--color-accent)] mb-6 group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {next.client}
              </div>
              <h2 className="font-display font-black text-[clamp(56px,11vw,160px)] leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)] mb-8 group-hover:text-[var(--color-accent)] transition-colors duration-500">
                {next.project}
                <span className="inline-block group-hover:translate-x-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
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
      <footer className="relative z-[2] px-6 md:px-12 py-16 bg-[var(--color-bg-deep)] border-t border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink-dim)]">
          <Link
            href="/"
            className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)] transition-colors"
          >
            ← Back to all work
          </Link>
          <span>© 2026 Doug Vargas</span>
        </div>
      </footer>
    </MotionConfig>
  );
}
