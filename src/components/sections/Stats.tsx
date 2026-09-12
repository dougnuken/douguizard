"use client";

import { MotionConfig, motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

interface Stat {
  num: number | string;
  suffix?: string;
  label: string;
  isInfinite?: boolean;
}

const stats: Stat[] = [
  { num: 12, label: "Years in product design" },
  { num: 18, label: "Countries Andes ships to" },
  { num: 400, suffix: "+", label: "Designers on the system" },
  { num: 2, suffix: "K+", label: "Engineers on the system" },
];

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return controls.stop;
  }, [isInView, to]);

  return <span ref={ref}>{value}</span>;
}

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative z-[3] px-6 md:px-12 py-[120px] md:py-[160px]"
    >
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1400px]">
          {/* Section header — hairline-introduced, 12-col grid */}
          <div className="hairline-t grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="kicker col-span-12 flex items-center gap-3 md:col-span-3"
            >
              <span className="h-px w-8 bg-[var(--line-strong)]" />/ 05 — By the numbers
            </motion.div>
          </div>

          {/* Content — one stat numeral per column at lg */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-20 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="group hairline-t flex flex-col gap-3 pt-6 transition-colors duration-500 hover:border-[var(--line-strong)]"
              >
                <div className="font-display text-[clamp(48px,7vw,96px)] font-medium tracking-[-0.03em] leading-[0.9] text-[var(--ink)]">
                  {stat.isInfinite ? (
                    <span className="text-[var(--ink)]">{stat.num}</span>
                  ) : (
                    <>
                      <Counter to={stat.num as number} />
                      {stat.suffix && (
                        <span className="text-[var(--ink)]">
                          {stat.suffix}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--ink-muted)] leading-[1.6]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
