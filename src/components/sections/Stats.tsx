"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Stat {
  num: number | string;
  suffix?: string;
  label: string;
  isInfinite?: boolean;
}

const stats: Stat[] = [
  { num: 12, suffix: "+", label: "Years\nof practice" },
  { num: 40, suffix: "M+", label: "Users impacted\nacross products" },
  { num: 9, label: "Companies\nshipped with" },
  { num: "∞", label: "Components\nstill in production", isInfinite: true },
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
    return () => controls.stop();
  }, [isInView, to]);

  return <span ref={ref}>{value}</span>;
}

export default function Stats() {
  return (
    <section className="relative z-[2] py-[200px] px-12 bg-[var(--color-bg-mid)] border-y border-[var(--color-line)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-display text-[clamp(56px,8vw,120px)] leading-none tracking-[-0.04em] text-[var(--color-ink)] mb-3">
              <span className="italic text-[var(--color-accent)]">
                {stat.isInfinite ? stat.num : <Counter to={stat.num as number} />}
              </span>
              {stat.suffix}
            </div>
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] leading-[1.6] whitespace-pre-line">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
