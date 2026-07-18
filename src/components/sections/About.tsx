"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { site } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

interface Fact {
  label: string;
  value: string;
}

const facts: Fact[] = [
  { label: "Based", value: `${site.location} · ${site.timezone}` },
  { label: "Currently", value: "Tech Lead, Andes Design System · Mercadolibre" },
  { label: "Focus", value: "Design systems · AI-native product design" },
  { label: "Availability", value: "Open to select work · 2026" },
  { label: "Languages", value: "Spanish (native) · English" },
];

function rise(y = 24) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
  };
}

export default function About() {
  return (
    <section id="about" className="relative px-6 py-[140px] md:px-12 md:py-[180px]">
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="mb-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-muted)] md:mb-16"
          >
            <span className="h-px w-8 bg-[var(--color-line-strong)]" />/ 08 — About
          </motion.div>

          {/* Header: statement + lead paragraph */}
          <div className="mb-16 grid grid-cols-1 gap-10 md:mb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <motion.h2
              {...rise(30)}
              transition={{ duration: 0.9, ease }}
              className="font-display text-[clamp(40px,6vw,84px)] font-light leading-[0.95] tracking-[-0.05em]"
            >
              The <span className="text-[var(--color-accent)]">human</span>
              <br />
              behind the systems.
            </motion.h2>

            <motion.p
              {...rise(20)}
              transition={{ duration: 0.9, delay: 0.15, ease }}
              className="max-w-[440px] self-end text-[15px] leading-[1.65] text-[var(--color-ink-muted)] md:text-base"
            >
              I&apos;m a product designer from {site.location.split(",")[0]}. Over
              twelve years I&apos;ve moved from agency work to analytics platforms,
              cruise-line apps, and national banking — and, most recently, to Andes,
              the design system that powers Mercadolibre across eighteen countries.
            </motion.p>
          </div>

          {/* Body: narrative + facts */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div className="flex flex-col gap-6">
              <motion.p
                {...rise(24)}
                transition={{ duration: 0.8, ease }}
                className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] tracking-[-0.01em] text-[var(--color-ink)]"
              >
                What&apos;s kept me here isn&apos;t any single screen — it&apos;s the
                systems underneath. The tokens, the governance, the shared language
                that lets hundreds of designers and thousands of engineers ship as
                one product. I care about the unglamorous scaffolding that makes
                good design repeatable.
              </motion.p>

              <motion.p
                {...rise(24)}
                transition={{ duration: 0.8, delay: 0.08, ease }}
                className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] tracking-[-0.01em] text-[var(--color-ink-muted)]"
              >
                Now I&apos;m most interested in what happens when that scaffolding
                meets AI — designing with generative tools and LLMs as collaborators,
                without letting the human on the other side of the screen disappear.
                That&apos;s the work I want to do next.
              </motion.p>

              <motion.div
                {...rise(20)}
                transition={{ duration: 0.8, delay: 0.16, ease }}
                className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-4"
              >
                <Link
                  href={site.cvPath}
                  className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)] no-underline"
                >
                  Read the full CV
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-1"
                    style={{ transitionTimingFunction: "var(--ease-quart-out)" }}
                  >
                    <path
                      d="M5 12h13M13 6l6 6-6 6"
                      stroke="var(--color-accent)"
                      strokeWidth="1.4"
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

            {/* Facts spec sheet */}
            <motion.dl
              {...rise(24)}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="hairline-b self-start"
            >
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="hairline-t grid grid-cols-[100px_1fr] gap-4 py-4 md:grid-cols-[120px_1fr]"
                >
                  <dt className="kicker pt-0.5">{f.label}</dt>
                  <dd className="text-[14px] leading-[1.5] text-[var(--color-ink)]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
