"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import Spark from "@/components/Spark";
import TrueFocus from "@/components/TrueFocus";

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

export default function Hero() {
  const reduceMotion = useReducedMotion() ?? false;
  const rise = useRise(reduceMotion);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden px-6 pt-24 pb-20 md:justify-end md:px-12 md:pt-28 md:pb-28"
    >
      {/* Giant clipped wordmark — KINETIC signature, sits behind as texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 w-screen -translate-x-1/2 select-none overflow-hidden"
      >
        <span className="block translate-y-[0.14em] whitespace-nowrap font-display text-[19vw] font-black leading-[0.72] tracking-[-0.05em] text-[var(--color-ink-strong)] opacity-[0.05]">
          Douguizard
        </span>
      </div>

      <div className="relative z-[1] mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-y-8">
        <motion.p
          {...rise(0)}
          className="kicker col-span-12 flex items-center gap-2.5"
        >
          <Spark size={13} />
          {site.availability.label}
        </motion.p>

        <motion.h1
          {...rise(0.07)}
          className="text-display-xl col-span-12 text-balance font-medium text-[var(--color-ink)] lg:col-span-10"
        >
          Designing the{" "}
          <span className="font-black text-[var(--color-ink-strong)]">human</span>{" "}
          side of an AI era
        </motion.h1>

        <motion.div {...rise(0.12)} className="col-span-12 pt-1">
          <TrueFocus
            sentence="Design Build Ship"
            className="justify-start font-display text-[clamp(24px,3.2vw,48px)] font-medium tracking-[-0.02em] text-[var(--color-ink)]"
          />
        </motion.div>

        <motion.p {...rise(0.16)} className="kicker col-span-12">
          {site.name} — {site.role}
        </motion.p>

        <motion.div
          {...rise(0.21)}
          className="col-span-12 flex flex-wrap items-center gap-4 pt-4"
        >
          <a href="#contact" className="btn-pill btn-solid">
            Let&apos;s talk
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

          <a href="#work" className="btn-pill btn-glass">
            View work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
