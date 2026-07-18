"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

/** Short rise + fade. Collapses to a plain fade under prefers-reduced-motion. */
function useRise(reduceMotion: boolean) {
  return (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.2 : 0.5,
      delay: reduceMotion ? 0 : delay,
      ease,
    },
  });
}

const ctaTransition = {
  transition:
    "background-color 200ms var(--ease-quart-out), color 200ms var(--ease-quart-out), border-color 200ms var(--ease-quart-out), transform 200ms var(--ease-quart-out)",
};

const ctaBase =
  "inline-flex items-center rounded-[2px] px-7 py-3.5 text-sm font-medium no-underline hover:-translate-y-px";

export default function Hero() {
  const reduceMotion = useReducedMotion() ?? false;
  const rise = useRise(reduceMotion);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh w-full flex-col justify-center px-6 pt-24 pb-20 md:justify-end md:px-12 md:pt-28 md:pb-24"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-y-8">
        <motion.p {...rise(0)} className="kicker col-span-12 flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
          {site.availability.label}
        </motion.p>

        <motion.h1
          {...rise(0.07)}
          className="text-display-xl col-span-12 text-balance font-medium text-[var(--color-ink)] lg:col-span-10"
        >
          Designing the <span style={{ color: "var(--color-accent)" }}>human</span> side
          of an AI era
        </motion.h1>

        <motion.p {...rise(0.14)} className="kicker col-span-12">
          {site.name} — {site.role}
        </motion.p>

        <motion.div {...rise(0.21)} className="col-span-12 flex flex-wrap gap-3 pt-2">
          <a
            href="#contact"
            className={`${ctaBase} bg-[var(--color-ink)] text-[#0A0A0A] hover:bg-[var(--color-ink-strong)]`}
            style={ctaTransition}
          >
            Let&apos;s talk
          </a>

          <a
            href="#work"
            className={`${ctaBase} border border-[var(--color-line-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)]`}
            style={ctaTransition}
          >
            View work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
