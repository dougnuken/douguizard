 "use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import LiveStatusBadge from "@/components/LiveStatusBadge";

const ease = [0.16, 1, 0.3, 1] as const;

function LettersPullUp({
  text,
  showAsterisk = false,
  delay = 0,
}: {
  text: string;
  showAsterisk?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const letters = text.split("");

  return (
    <span ref={ref} className="inline-flex">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ y: 80, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: delay + i * 0.05, ease }}
          className="inline-block relative"
        >
          {letter}
          {showAsterisk && i === letters.length - 1 ? (
            <motion.span
              className="absolute top-[0.18em] -right-[0.42em] text-[0.32em] text-[var(--color-accent)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: delay + letters.length * 0.05 + 0.2, duration: 0.5 }}
            >
              *
            </motion.span>
          ) : null}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen w-full z-[3] flex flex-col">
      <div className="flex-1" />

      <div className="relative z-10 px-6 md:px-12 pb-10 md:pb-16">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <LiveStatusBadge>Available 2026</LiveStatusBadge>
            </motion.div>

            <h1 className="font-display font-medium leading-[0.82] tracking-[-0.07em] text-[20vw] md:text-[15vw] lg:text-[13vw] xl:text-[12vw] text-[var(--color-ink)]">
              <LettersPullUp text="Douguizard" showAsterisk delay={0.4} />
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 pb-2 md:pb-4">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.5, ease }}
              className="text-[13px] md:text-sm text-[var(--color-ink-muted)] leading-[1.55] max-w-[320px]"
            >
              Senior Product Designer x Design Systems Architect. Twelve years translating ambiguity into interfaces, currently shaping{" "}
              {"Andes Mercadolibre's component library across LATAM."}
            </motion.p>

            <motion.a
              href="#contact"
              data-cursor="hover"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.7, ease }}
              whileHover={{ x: 4 }}
              className="group inline-flex items-center gap-3 self-start rounded-full py-1.5 pl-6 pr-1.5 text-sm font-medium text-[var(--color-bg-deep)] no-underline w-fit transition-all"
              style={{ background: "var(--color-ink)", boxShadow: "0 4px 16px -4px rgba(235,233,224,0.3), inset 0 1px 0 0 rgba(255,255,255,0.6)" }}
            >
              {"Let's talk"}
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                style={{ background: "var(--color-bg-deep)", color: "var(--color-ink)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}