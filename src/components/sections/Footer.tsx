"use client";

import { motion, MotionConfig } from "framer-motion";
import { site } from "@/data/site";
import Spark from "@/components/Spark";

const ease = [0.16, 1, 0.3, 1] as const;

/** Editorial link — hairline rhythm, nudges + warms to accent on hover. */
const linkClass =
  "block text-[15px] leading-[1.5] text-[var(--color-ink)] no-underline mb-2.5 transition-all duration-300 hover:text-[var(--color-accent)] hover:translate-x-1";

const elsewhereLinks = site.social;

function ElsewhereLink({ link }: { link: { label: string; href: string } }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className={linkClass}
    >
      {link.label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-[3] overflow-hidden px-6 pt-[120px] pb-12 md:px-12"
    >
      {/* Giant clipped wordmark — KINETIC signature, sits behind as texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-16 select-none overflow-hidden md:bottom-20"
      >
        <span className="block translate-y-[0.14em] whitespace-nowrap font-display text-[20vw] font-black leading-[0.72] tracking-[-0.05em] text-[var(--color-ink-strong)] opacity-[0.05]">
          Let&apos;s talk
        </span>
      </div>

      <MotionConfig reducedMotion="user">
        <div className="relative z-[1] mx-auto max-w-[1400px]">
          {/* Section header — 12-col editorial grid introduced by a top hairline */}
          <div className="hairline-t grid grid-cols-12 gap-6 pt-8 md:gap-8">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-2.5 md:col-span-3"
            >
              <Spark size={12} />/ 04 — Contact
            </motion.p>

            {/* Two-tone statement — weight + tone carry the hierarchy (no red) */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="col-span-12 text-balance font-display text-[clamp(44px,7vw,112px)] leading-[0.9] tracking-[-0.03em] md:col-span-6"
            >
              <span className="font-black text-[var(--color-ink)]">
                Let&apos;s talk.
              </span>{" "}
              <span className="font-medium text-[var(--color-ink-muted)]">
                Got something worth building?
              </span>
            </motion.h2>

            {/* Geometric figure — monochrome concentric rings fill the negative space */}
            <div
              aria-hidden
              className="col-span-12 hidden items-center justify-end md:col-span-3 md:flex"
            >
              <div className="relative aspect-square w-[clamp(96px,10vw,168px)]">
                <div className="absolute inset-0 rounded-full border border-[var(--color-line-strong)]" />
                <div className="absolute inset-[20%] rounded-full border border-[var(--color-line)]" />
                <div className="absolute inset-[42%] rounded-full border border-[var(--color-line)]" />
              </div>
            </div>
          </div>

          {/* Primary CTA — echoes the Hero pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-10 flex flex-wrap items-center gap-4 md:mt-12"
          >
            <a
              href={`mailto:${site.email}`}
              data-cursor="hover"
              className="btn-pill btn-solid"
            >
              Write to me
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href={site.cvPath} data-cursor="hover" className="btn-pill btn-glass">
              View CV
            </a>
          </motion.div>

          {/* Four hairline-topped editorial columns */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="hairline-t pt-6"
            >
              <h4 className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-[var(--color-ink-dim)]">
                / The signal
              </h4>
              {/* Two-tone paragraph — lead in ink, continuation in muted */}
              <p className="max-w-xs text-[14px] leading-[1.55]">
                <span className="text-[var(--color-ink)]">
                  I take on selected freelance and consulting engagements alongside my role at Mercadolibre.
                </span>{" "}
                <span className="text-[var(--color-ink-muted)]">
                  Especially keen on AI-native product work and design systems at scale.
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="hairline-t pt-6"
            >
              <h4 className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-[var(--color-ink-dim)]">
                / Direct
              </h4>
              <a
                href={`mailto:${site.email}`}
                data-cursor="hover"
                className={linkClass}
              >
                {site.email}
              </a>
              <a href={site.phoneHref} data-cursor="hover" className={linkClass}>
                {site.phone}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease }}
              className="hairline-t pt-6"
            >
              <h4 className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-[var(--color-ink-dim)]">
                / Elsewhere
              </h4>
              {elsewhereLinks.map((link) => (
                <ElsewhereLink key={link.label} link={link} />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24, ease }}
              className="hairline-t pt-6"
            >
              <h4 className="mb-5 font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-[var(--color-ink-dim)]">
                / Documents
              </h4>
              <a href={site.cvPath} data-cursor="hover" className={linkClass}>
                View CV
              </a>
              <a href={site.cvPath} data-cursor="hover" className={linkClass}>
                Download PDF
              </a>
            </motion.div>
          </div>

          {/* Legal row */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-line)] pt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-dim)] md:mt-20 md:flex-row">
            <span>© 2026 Doug Vargas — All rights reserved</span>
            <span>
              Crafted in Barranquilla ·{" "}
              <span className="text-[var(--color-accent)]">●</span> Online
            </span>
          </div>
        </div>
      </MotionConfig>
    </footer>
  );
}
