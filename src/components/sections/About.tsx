"use client";

import { motion, MotionConfig } from "framer-motion";
import { site } from "@/data/site";
import RevealText from "@/components/text/RevealText";
import Spark from "@/components/Spark";
import { OrbitRings } from "@/components/figures/GeoFigures";

const ease = [0.16, 1, 0.3, 1] as const;

interface Fact {
  label: string;
  value: string;
}

const facts: Fact[] = [
  { label: "Based", value: `${site.location.city}, ${site.location.country} · ${site.location.timezone}` },
  { label: "Currently", value: site.availability.label },
  { label: "Focus", value: "Design engineering · AI-native product" },
  { label: "Open to", value: site.availability.note ?? "" },
  { label: "Languages", value: "Spanish (native) · English (B1)" },
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

            <RevealText
              as="h2"
              variant="mask"
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              The <span className="font-black text-[var(--ink)]">human</span>
              <br />
              behind the systems.
            </RevealText>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="col-span-12 self-end text-[15px] leading-[1.6] text-[var(--ink-muted)] md:col-span-3"
            >
              I&apos;m a product designer from {site.location.city} — now
              working as a design engineer. Years from agencies to analytics
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
                className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] tracking-[-0.01em] text-[var(--ink-muted)]"
              >
                <span className="font-bold text-[var(--ink)]">
                  What&apos;s kept me here isn&apos;t any single screen — it&apos;s the
                  systems underneath.
                </span>{" "}
                The tokens, the governance, the shared language that lets hundreds of
                designers and thousands of engineers ship as one product. I care about
                the unglamorous scaffolding that makes good design repeatable.
              </motion.p>

              <motion.p
                {...rise(24, 0.08, 0.7)}
                className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55] tracking-[-0.01em] text-[var(--ink-muted)]"
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
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {site.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)] no-underline transition-colors duration-300 hover:text-[var(--ink)]"
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
              {/* Concentric rings — animated monochrome geometric figure */}
              <OrbitRings className="hidden aspect-square w-full max-w-[200px] md:block" />

              <dl className="hairline-b">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="hairline-t flex flex-col gap-1 py-4"
                  >
                    <dt className="kicker">{f.label}</dt>
                    <dd className="text-[14px] leading-[1.5] text-[var(--ink)]">
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
