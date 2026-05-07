"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const linkClass =
  "block text-[var(--color-ink)] text-sm mb-2 no-underline hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300";

function CtaLink() {
  const cls =
    "text-[var(--color-ink)] no-underline border-b-4 border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors duration-500 inline-block";
  return (
    <a href="mailto:hello@douguizard.com" data-cursor="hover" className={cls}>
      {"Let's talk →"}
    </a>
  );
}

const elsewhereLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/dougvargasco" },
  { label: "Behance", href: "https://behance.net/dougvargas" },
  { label: "Dribbble", href: "https://dribbble.com/douguizard" },
];

function ElsewhereLink({ link }: { link: { label: string; href: string } }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={linkClass}>
      {link.label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-[3] pt-[120px] pb-12 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.h2
          className="font-display font-light text-[clamp(56px,11vw,180px)] leading-[0.92] tracking-[-0.06em] mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
        >
          <span className="text-[var(--color-accent)]">Have</span>
          <span> a project?</span>
          <br />
          <CtaLink />
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 md:gap-5 pt-12 md:pt-16 border-t border-[var(--color-line)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / The signal
            </h4>
            <p className="text-sm text-[var(--color-ink-muted)] leading-[1.55] max-w-xs">
              I take on selected freelance and consulting engagements alongside my role at Mercadolibre. Especially keen on AI-native product work and design systems at scale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / Direct
            </h4>
            <a href="mailto:hello@douguizard.com" data-cursor="hover" className={linkClass}>
              hello@douguizard.com
            </a>
            <a href="tel:+573003518299" data-cursor="hover" className={linkClass}>
              +57 300.351.8299
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
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
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-5 font-normal">
              / Documents
            </h4>
            <a href="/cv" data-cursor="hover" className={linkClass}>
              View CV
            </a>
            <a href="/cv" data-cursor="hover" className={linkClass}>
              Download PDF
            </a>
          </motion.div>
        </div>

        <div className="mt-16 md:mt-20 pt-8 border-t border-[var(--color-line)] flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.15em] text-[var(--color-ink-dim)] uppercase">
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