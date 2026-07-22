"use client";

import { useEffect } from "react";
import { motion, MotionConfig } from "framer-motion";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudy, getNextCaseStudy, type Kpi } from "@/data/work";
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

/** Section eyebrow — hairline tick + mono label, sticky on desktop. */
function Eyebrow({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <FadeIn>
      <div
        className={`font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] ${
          sticky ? "md:sticky md:top-32" : ""
        }`}
      >
        <span className="inline-block w-6 h-px bg-[var(--color-ink)] mr-3 align-middle" />
        {children}
      </div>
    </FadeIn>
  );
}

/** Single KPI — big figure (mask reveal), label, optional accent delta chip. */
function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <div className="flex flex-col">
      <RevealText
        as="div"
        variant="mask"
        delay={index * 0.07}
        className="font-display font-black text-[clamp(30px,3.2vw,46px)] leading-[1.02] tracking-[-0.03em] text-[var(--color-ink-strong)]"
      >
        {kpi.value}
      </RevealText>
      <RevealText
        as="div"
        variant="fade"
        delay={index * 0.07 + 0.08}
        className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)] leading-[1.5]"
      >
        {kpi.label}
      </RevealText>
      {kpi.delta && (
        <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-accent)]">
          <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
          {kpi.delta}
        </span>
      )}
    </div>
  );
}

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const study = getCaseStudy(params.slug);

  // Detail pages are a normal vertical document. Clear any chrome-theme state
  // left on <html> by the home shell and start at the top, so scroll is never
  // locked when arriving via client-side navigation from the horizontal home.
  useEffect(() => {
    document.documentElement.removeAttribute("data-panel-theme");
    // Defensive: clear any leaked scroll-lock so the detail page always scrolls.
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
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
      <section className="relative min-h-[78vh] flex flex-col justify-end px-6 md:px-12 pb-20 pt-36 md:pt-40 overflow-hidden bg-[var(--color-bg-deep)]">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
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

          <motion.h2
            className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--color-accent)] mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            {study.client}
          </motion.h2>

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

      {/* ============ Impact + KPIs (the market-facing star) ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--color-bg-deep)]">
        <div className="max-w-[1100px] mx-auto">
          <Eyebrow>The impact</Eyebrow>

          <RevealText
            as="p"
            variant="mask"
            className="mt-8 font-display font-medium text-[clamp(28px,4vw,54px)] leading-[1.14] tracking-[-0.025em] text-[var(--color-ink)] max-w-[960px]"
          >
            {study.impact}
          </RevealText>

          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-[var(--color-line)] pt-12 md:grid-cols-4">
            {study.kpis.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ Context ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--color-bg-mid)] border-y border-[var(--color-line)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <Eyebrow sticky>Context</Eyebrow>
          <RevealText
            as="p"
            variant="fade"
            className="font-display text-[clamp(20px,2.4vw,30px)] leading-[1.4] tracking-[-0.01em] text-[var(--color-ink)] max-w-[780px]"
          >
            {study.context}
          </RevealText>
        </div>
      </section>

      {/* ============ What I did ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--color-bg-deep)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <Eyebrow sticky>What I did</Eyebrow>
          <div className="border-y border-[var(--color-line)]">
            {study.contributions.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-[48px_1fr] gap-5 md:gap-8 border-b border-[var(--color-line)] py-6 last:border-b-0 md:py-7"
              >
                <RevealText
                  as="div"
                  variant="mask"
                  delay={i * 0.04}
                  className="section-num text-[clamp(22px,2.2vw,32px)] leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </RevealText>
                <RevealText
                  as="p"
                  variant="fade"
                  delay={i * 0.04 + 0.06}
                  className="text-[clamp(15px,1.35vw,19px)] leading-[1.55] text-[var(--color-ink)]"
                >
                  {renderBold(c)}
                </RevealText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Technologies + external link ============ */}
      {(study.technologies || study.externalLink) && (
        <section className="relative z-[2] px-6 md:px-12 py-24 bg-[var(--color-bg-soft)] border-t border-[var(--color-line)]">
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
