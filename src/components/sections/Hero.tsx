"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import SplitText from "@/components/text/SplitText";
import ShinyText from "@/components/text/ShinyText";
import TextPressure from "@/components/text/TextPressure";

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
      className="relative flex min-h-svh w-full flex-col justify-between px-6 pt-24 pb-10 md:px-12 md:pt-28 md:pb-12"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-y-8">
        <motion.p {...rise(0)} className="kicker col-span-12 flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
          <ShinyText>{site.availability.label}</ShinyText>
        </motion.p>

        <SplitText
          as="h1"
          by="words"
          trigger="mount"
          delay={0.12}
          className="text-display-xl col-span-12 font-medium text-[var(--color-ink)] lg:col-span-10"
          segments={[
            { text: "Designing the " },
            { text: "human", className: "text-[var(--color-accent)]" },
            { text: " side of an AI era" },
          ]}
        />

        <motion.p {...rise(0.14)} className="kicker col-span-12">
          {site.name} — {site.role}
        </motion.p>

        <motion.div {...rise(0.21)} className="col-span-12 flex flex-wrap items-center gap-4 pt-4">
          <a href="#contact" className="btn-pill btn-solid">
            Let&apos;s talk
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a href="#work" className="btn-pill btn-glass">
            View work
          </a>
        </motion.div>
      </div>

      <motion.div
        {...rise(0.3)}
        className="mx-auto mt-10 w-full max-w-[1400px] border-t border-[var(--color-line)] pt-6 md:pt-8"
      >
        <TextPressure text={site.brand} />
      </motion.div>
    </section>
  );
}
