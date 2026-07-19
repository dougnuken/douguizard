"use client";

import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/testimonials";

const ease = [0.16, 1, 0.3, 1] as const;
const AUTO_ROTATE_MS = 7000;

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % total);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

  const current = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="relative z-[3] px-6 md:px-12 py-[120px] md:py-[160px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* Section header — 12-col grid introduced by a top hairline */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
            >
              <span className="h-px w-8 bg-[var(--color-line-strong)]" />/ 07 — Trusted by
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="col-span-12 font-display text-[clamp(40px,5.5vw,76px)] font-medium leading-[0.98] tracking-[-0.02em] md:col-span-6"
            >
              Words from{" "}
              <span className="text-[var(--color-accent)]">teammates</span>.
            </motion.h2>

            {/* Prev / next arrows fill the header's third column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="col-span-12 flex items-center gap-3 md:col-span-3 md:justify-end md:self-end"
            >
              <button
                onClick={prev}
                data-cursor="hover"
                aria-label="Previous testimonial"
                className="group btn-round btn-round--outline"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 4L6 8l4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-colors"
                  />
                </svg>
              </button>
              <button
                onClick={next}
                data-cursor="hover"
                aria-label="Next testimonial"
                className="group btn-round btn-round--outline"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-colors"
                  />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Carousel — active testimonial laid out on the 12-col grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="mt-16 md:mt-20"
          >
            {/* Glass card with testimonial */}
            <div className="glass-strong relative overflow-hidden rounded-3xl p-8 md:p-14 lg:p-16 min-h-[380px] md:min-h-[420px] flex flex-col justify-center">
              {/* Giant decorative quote mark */}
              <div
                className="absolute top-0 left-6 md:left-10 font-display text-[180px] md:text-[280px] leading-none text-[var(--color-line-strong)] pointer-events-none select-none opacity-50"
                aria-hidden
                style={{ transform: "translateY(-12%)" }}
              >
                &ldquo;
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease }}
                  className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8"
                >
                  {/* Quote — spans the left 3 big columns */}
                  <p className="col-span-12 self-center font-display font-normal text-[clamp(20px,2.4vw,32px)] leading-[1.4] tracking-[-0.02em] text-[var(--color-ink)] md:col-span-9">
                    {current.quote}
                  </p>

                  {/* Attribution — avatar + name + meta in the right column */}
                  <div className="col-span-12 flex flex-col gap-5 md:col-span-3 md:self-center md:border-l md:border-[var(--color-line)] md:pl-8">
                    {/* Avatar with initials */}
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full font-mono text-sm tracking-[0.1em] text-[var(--color-ink)]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-accent) 12%, var(--color-bg-soft))",
                        border: "1px solid var(--color-line-strong)",
                      }}
                    >
                      {current.author.initials}
                    </div>

                    <div>
                      <div className="font-display text-lg text-[var(--color-ink)] tracking-tight">
                        {current.author.name}
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)] mt-1">
                        {current.author.role} · {current.author.company}
                      </div>
                    </div>

                    {/* Project meta */}
                    {current.context && (
                      <div>
                        <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-ink-dim)] mb-1">
                          Project
                        </div>
                        <div className="text-[12px] text-[var(--color-ink-muted)]">
                          {current.context}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(i)}
                  data-cursor="hover"
                  aria-label={`Show testimonial from ${t.author.name}`}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: currentIndex === i ? "32px" : "8px",
                    background:
                      currentIndex === i
                        ? "var(--color-accent)"
                        : "var(--color-line-strong)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </MotionConfig>
    </section>
  );
}
