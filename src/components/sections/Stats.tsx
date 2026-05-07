"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Stat {
  num: number | string;
  suffix?: string;
  label: string;
  isInfinite?: boolean;
}

const stats: Stat[] = [
  { num: 12, suffix: "+", label: "Years of practice" },
  { num: 40, suffix: "M+", label: "Users impacted" },
  { num: 9, label: "Companies shipped with" },
  { num: "∞", label: "Components in production", isInfinite: true },
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
    <section className="relative z-[3] px-6 md:px-12 py-[140px] md:py-[180px]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--color-ink-muted)] mb-12 md:mb-16 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-[var(--color-line-strong)]" />
          / 05 — By the numbers
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass rounded-2xl p-6 md:p-8 group hover:border-[var(--color-line-strong)] transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(184,164,255,0.14) 0%, transparent 60%)",
                }}
              />

              <div className="relative font-display text-[clamp(48px,7vw,96px)] font-light tracking-[-0.05em] leading-[0.9] mb-3">
                {stat.isInfinite ? (
                  <span className="text-[var(--color-accent)]">{stat.num}</span>
                ) : (
                  <>
                    <Counter to={stat.num as number} />
                    {stat.suffix && (
                      <span className="text-[var(--color-accent)]">
                        {stat.suffix}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="relative font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)] leading-[1.6]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}