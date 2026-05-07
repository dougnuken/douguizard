"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { caseStudies } from "@/data/work";

const ease = [0.16, 1, 0.3, 1] as const;

export default function PortfolioCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = caseStudies.length;

  // How many cards to show at once based on viewport
  const cardsPerView = 3; // we'll handle responsive via CSS

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="work"
      className="relative z-[3] px-6 md:px-12 py-[140px] md:py-[180px]"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-16 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 04 — Selected Work
        </motion.div>

        {/* Title + Controls row */}
        <div className="flex items-end justify-between mb-12 md:mb-20 flex-wrap gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(40px,6vw,84px)] font-light leading-[0.95] tracking-[-0.05em] max-w-3xl"
          >
            Twelve years,{" "}
            <span className="text-[var(--color-accent)]">shipping</span>{" "}
            at scale.
          </motion.h2>

          {/* Navigation arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={prevSlide}
              data-cursor="hover"
              aria-label="Previous project"
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
              onClick={nextSlide}
              data-cursor="hover"
              aria-label="Next project"
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

        {/* Carousel viewport */}
        <div
          ref={containerRef}
          className="relative overflow-hidden -mx-2"
          style={{ touchAction: "pan-y" }}
        >
          <motion.div
            className="flex"
            animate={{
              x: `calc(-${currentIndex * (100 / cardsPerView)}% + 0px)`,
            }}
            transition={{ duration: 0.8, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) nextSlide();
              else if (info.offset.x > 100) prevSlide();
            }}
          >
            {caseStudies.map((study, i) => (
              <div
                key={study.slug}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2"
              >
                <Link
                  href={`/work/${study.slug}`}
                  data-cursor="hover"
                  className="block group no-underline"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.4, ease }}
                    className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] aspect-[4/5] mb-5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(20,20,28,0.5) 0%, rgba(10,10,15,0.3) 100%)",
                      backdropFilter: "blur(20px)",
                      boxShadow:
                        "inset 1px 1px 0 0 rgba(235,233,224,0.04), 0 8px 32px -8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Thumbnail or gradient fallback */}
                    {study.thumbnail ? (
                      <Image
                        src={study.thumbnail}
                        alt={study.project}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${study.colors[0]}, ${study.colors[1]})`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display italic text-3xl text-white/90">
                            {study.client}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Number badge top-left */}
                    <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.25em] uppercase text-white/70">
                      {study.num}
                    </div>

                    {/* Year top-right */}
                    <div className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white/70">
                      {study.year.split(" ")[0]}
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/60 mb-1">
                        {study.category}
                      </div>
                      <div className="font-display text-2xl font-light text-white leading-tight tracking-tight">
                        {study.client}
                      </div>
                    </div>

                    {/* Hover arrow */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-bg-deep)]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3 7h8M7 3l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  {/* Card meta below image */}
                  <div className="px-1">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-dim)] mb-2">
                      {study.role}
                    </div>
                    <div className="text-[14px] text-[var(--color-ink-muted)] leading-snug">
                      {study.tagline}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {caseStudies.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              data-cursor="hover"
              aria-label={`Go to slide ${i + 1}`}
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