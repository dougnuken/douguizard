"use client";

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { caseStudies } from "@/data/work";

export default function Portfolio() {
  const [hovered, setHovered] = useState<number | null>(null);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const x = useSpring(previewX, { stiffness: 300, damping: 28 });
  const y = useSpring(previewY, { stiffness: 300, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent) => {
    previewX.set(e.clientX);
    previewY.set(e.clientY);
  };

  return (
    <section
      id="work"
      onMouseMove={handleMouseMove}
      className="relative z-[2] px-12 pt-[120px] pb-[200px] bg-[var(--color-bg-deep)] border-t border-[var(--color-line)]"
    >
      <motion.div
        className="max-w-[1200px] mx-auto mb-20 flex justify-between items-baseline"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-[11px] tracking-[0.25em] text-[var(--color-ink-muted)]">
          / 02 — Selected Work
        </span>
        <h2 className="font-display text-[clamp(40px,6vw,88px)] tracking-[-0.03em] leading-[0.95]">
          Twelve <span className="italic text-[var(--color-accent)]">years</span>
          ,<br />
          nine companies
        </h2>
      </motion.div>

      <div className="max-w-[1200px] mx-auto">
        {caseStudies.map((study, i) => (
          <motion.div
            key={study.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/work/${study.slug}`}
              data-cursor="hover"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="grid items-center gap-6 py-9 border-b border-[var(--color-line)] cursor-pointer relative no-underline text-inherit grid-cols-[40px_1fr_1fr_120px_40px] md:grid-cols-[60px_1fr_1fr_200px_60px] transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:px-6"
            >
              <div className="font-mono text-[11px] text-[var(--color-ink-dim)] tracking-[0.2em]">
                {study.num}
              </div>
              <div className="font-display text-2xl md:text-[32px] tracking-tight leading-[1.1]">
                <span className="italic text-[var(--color-accent)]">{study.client}</span>
              </div>
              <div className="text-[13px] text-[var(--color-ink-muted)] leading-[1.5] hidden md:block">
                {study.project}
              </div>
              <div className="font-mono text-xs text-[var(--color-ink-muted)] tracking-[0.15em] text-right hidden md:block">
                {study.year}
              </div>
              <motion.div
                className="text-right text-[var(--color-ink-muted)] hidden md:block"
                animate={{
                  x: hovered === i ? 8 : 0,
                  color: hovered === i ? "var(--color-accent)" : "var(--color-ink-muted)",
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                →
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Floating preview */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            className="fixed pointer-events-none z-50 rounded-md overflow-hidden border border-[var(--color-line)] hidden md:block"
            style={{
              left: x,
              top: y,
              x: "-50%",
              y: "-50%",
              width: 320,
              height: 220,
              background: `linear-gradient(135deg, ${caseStudies[hovered].colors[0]}, ${caseStudies[hovered].colors[1]})`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
                mixBlendMode: "overlay",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center font-display italic text-[var(--color-bg-deep)] text-center px-4 z-10">
              <div className="text-3xl mb-2">{caseStudies[hovered].client}</div>
              <div className="font-mono not-italic text-[10px] tracking-[0.2em] uppercase opacity-70">
                {caseStudies[hovered].category}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
