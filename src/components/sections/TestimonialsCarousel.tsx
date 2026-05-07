"use client";

import { motion, AnimatePresence } from "framer-motion";
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
      className="relative z-[3] px-6 md:px-12 py-[140px] md:py-[180px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-16 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 06 — Trusted by
        </motion.div>

        <div className="flex items-end justify-between mb-12 md:mb-16 flex-wrap gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(40px,6vw,84px)] font-light leading-[0.95] tracking-[-0.05em] max-w-3xl"
          >
            Words from{" "}
            <span className="text-[var(--color-accent)]">teammates</span>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={prev}
              data-cursor="hover"
              aria-label="Previous testimonial"
              className="group flex h-12 w-12 items-center justify-center rounded-full neu-button transition-all"
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
              className="group flex h-12 w-12 items-center justify-center rounded-full neu-button transition-all"
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

        {/* Glass card with testimonial */}
        <div
          className="relative rounded-3xl overflow-hidden p-8 md:p-14 lg:p-16 min-h-[380px] md:min-h-[420px] flex flex-col justify-between"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,20,28,0.5) 0%, rgba(10,10,15,0.3) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--color-line)",
            boxShadow:
              "inset 1px 1px 0 0 rgba(235,233,224,0.04), inset -1px -1px 0 0 rgba(0,0,0,0.2), 0 16px 60px -16px rgba(0,0,0,0.5)",
          }}
        >
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
              className="relative z-10 flex flex-col justify-between h-full gap-10"
            >
              {/* Quote */}
              <p className="font-display font-light text-[clamp(20px,2.4vw,32px)] leading-[1.4] tracking-[-0.02em] text-[var(--color-ink)] max-w-3xl">
                {current.quote}
              </p>

              {/* Author block */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Avatar with initials */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full font-mono text-sm tracking-[0.1em] text-[var(--color-ink)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(184,164,255,0.2) 0%, rgba(127,197,255,0.1) 100%)",
                    border: "1px solid var(--color-line-strong)",
                  }}
                >
                  {current.author.initials}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="font-display text-lg text-[var(--color-ink)] tracking-tight">
                    {current.author.name}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)] mt-1">
                    {current.author.role} · {current.author.company}
                  </div>
                </div>

                {/* Right meta */}
                {current.context && (
                  <div className="text-right">
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
      </div>
    </section>
  );
}