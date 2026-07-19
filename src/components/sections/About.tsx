"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { site } from "@/data/site";
import BlurText from "@/components/text/BlurText";
import Spark from "@/components/Spark";

const ease = [0.16, 1, 0.3, 1] as const;

interface Fact {
  label: string;
  value: string;
}

const facts: Fact[] = [
  { label: "Based", value: `${site.location} · ${site.timezone}` },
  { label: "Currently", value: "Tech Lead, Andes Design System · Mercadolibre" },
  { label: "Focus", value: "Design engineering · AI-native product" },
  { label: "Availability", value: "Open to select work · 2026" },
  { label: "Languages", value: "Spanish (native) · English" },
];

/** Short rise + fade. Collapses to a plain fade under MotionConfig reducedMotion. */
function rise(y = 24, delay = 0, duration = 0.6) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration, delay, ease },
  };
}

export default function About() {
  return (
    <section id="about" className="relative px-6 py-[120px] md:px-12 md:py-[160px]">
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* Section header — hairline-introduced, 12-col grid */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-2.5 md:col-span-3"
            >
              <Spark size={12} />/ 01 — About
            </motion.div>

            <BlurText
              as="h2"
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              The <span className="font-black text-[var(--color-ink-strong)]">human</span>
              <br />
              behind the systems.
            </BlurText>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="col-span-12 self-end text-[15px] leading-[1.6] text-[var(--color-ink-muted)] md:col-span-3"
            >
              I&apos;m a product designer from {site.location.split(",")[0]} — now
              working as a design engineer. Twelve years from agencies to analytics
              platforms, cruise-line apps and national banking, most recently leading
              Andes, the design system behind Mercadolibre across eighteen countries.
            </motion.p>
          </div>

          {/* Content — bio narrative (cols 1–8) + facts spec-sheet (cols 10–12) */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-12 md:gap-8">
            {/* Bio narrative */}
            <div className="col-span-12 flex flex-col gap-6 md:col-span-8">
              <motion.p
                {...rise(24, 0, 0.7)}
                className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] tracking-[-0.01em] text-[var(--color-ink-muted)]"
              >
                <span className="font-bold text-[var(--color-ink)]">
                  What&apos;s kept me here isn&apos;t any single screen — it&apos;s the
                  systems underneath.
                </span>{" "}
                The tokens, the governance, the shared language that lets hundreds of
                designers and thousands of engineers ship as one product. I care about
                the unglamorous scaffolding that makes good design repeatable.
              </motion.p>

              <motion.p
                {...rise(24, 0.08, 0.7)}
                className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] tracking-[-0.01em] text-[var(--color-ink-muted)]"
              >
                This past year I&apos;ve gone AI-native — my day-to-day now runs on
                Claude Code, Cursor and Gemini. So I&apos;ve stopped drawing a line
                between design and engineering: I prototype in code, ship real
                interfaces, and let the system and the AI carry the repetitive weight.
              </motion.p>

              <motion.div
                {...rise(20, 0.16, 0.7)}
                className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-4"
              >
                <Link href={site.cvPath} className="btn-pill btn-outline group">
                  Read the full CV
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-1"
                    style={{ transitionTimingFunction: "var(--ease-quart-out)" }}
                  >
                    <path
                      d="M5 12h13M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {site.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)] no-underline transition-colors duration-300 hover:text-[var(--color-ink)]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Facts spec sheet + concentric-rings figure */}
            <motion.div
              {...rise(24, 0.12, 0.7)}
              className="col-span-12 flex flex-col gap-10 self-start md:col-span-3 md:col-start-10"
            >
              {/* Concentric rings — monochrome geometric figure (B&W photo substitute) */}
              <div
                aria-hidden
                className="relative hidden aspect-square w-full max-w-[200px] items-center justify-center md:flex"
              >
                <div className="absolute inset-0 rounded-full border border-[var(--color-line-strong)]" />
                <div className="absolute inset-[26%] rounded-full border border-[var(--color-line)]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink-dim)]" />
              </div>

              <dl className="hairline-b">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="hairline-t flex flex-col gap-1 py-4"
                  >
                    <dt className="kicker">{f.label}</dt>
                    <dd className="text-[14px] leading-[1.5] text-[var(--color-ink)]">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
