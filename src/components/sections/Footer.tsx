"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-[2] pt-[120px] pb-12 px-12 bg-[var(--color-bg-deep)] overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          className="font-display text-[clamp(56px,11vw,180px)] leading-[0.92] tracking-[-0.04em] mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="italic text-[var(--color-accent)]">Have</span> a project?
          <br />
          <a
            href="mailto:dougvargas72@gmail.com"
            data-cursor="hover"
            className="text-[var(--color-ink)] no-underline border-b-4 border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors duration-500 inline-block"
          >
            Let&apos;s talk →
          </a>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pt-16 border-t border-[var(--color-line)]">
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / The signal
            </h4>
            <p className="text-sm text-[var(--color-ink-muted)] leading-[1.5] max-w-xs">
              I take on selected freelance and consulting engagements alongside my role at
              Mercadolibre. Especially keen on AI-native product work and design systems
              at scale.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / Direct
            </h4>
            <a
              href="mailto:dougvargas72@gmail.com"
              data-cursor="hover"
              className="block text-[var(--color-ink)] text-sm mb-2 no-underline hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300"
            >
              dougvargas72@gmail.com
            </a>
            <a
              href="tel:+573003518299"
              data-cursor="hover"
              className="block text-[var(--color-ink)] text-sm mb-2 no-underline hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300"
            >
              +57 300.351.8299
            </a>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / Elsewhere
            </h4>
            {[
              { label: "LinkedIn", href: "https://linkedin.com/in/dougvargasco" },
              { label: "Behance", href: "https://behance.net/dougvargas" },
              { label: "Old portfolio", href: "https://douguizard.webflow.io" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="block text-[var(--color-ink)] text-sm mb-2 no-underline hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / Documents
            </h4>
            <a
              href="/cv"
              data-cursor="hover"
              className="block text-[var(--color-ink)] text-sm mb-2 no-underline hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300"
            >
              View CV
            </a>
            <a
              href="/cv"
              data-cursor="hover"
              className="block text-[var(--color-ink)] text-sm mb-2 no-underline hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300"
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[var(--color-line)] flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.15em] text-[var(--color-ink-dim)] uppercase">
          <span>© 2026 Doug Vargas — All rights reserved</span>
          <span>
            Crafted in Barranquilla ·{" "}
            <span className="text-[var(--color-accent)]">●</span> Online
          </span>
        </div>
      </div>
    </footer>
  );
}
