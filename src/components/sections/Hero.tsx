"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import { LiquidMetalShader } from "@/components/ui/LiquidMetalShader";

const ease = [0.16, 1, 0.3, 1] as const;

const headlineClass = "font-display font-light text-[clamp(48px,9vw,140px)] leading-[0.92] tracking-[-0.045em] text-gradient-cosmic";

interface Company {
  initials: string;
  name: string;
  role: string;
  period: string;
}

const companies: Company[] = [
  {
    initials: "ML",
    name: "Mercadolibre",
    role: "Andes Design System · Tech Lead",
    period: "2024 — 2026",
  },
  {
    initials: "AD",
    name: "Aval Digital Labs",
    role: "Senior Product Designer · DS Gatekeeper",
    period: "2018 — 2024",
  },
  {
    initials: "GL",
    name: "Globant",
    role: "Senior Product Designer · Royal Caribbean",
    period: "2017 — 2018",
  },
  {
    initials: "QV",
    name: "Qrvey",
    role: "Lead UI Designer · Analytics Platform",
    period: "2017 — 2018",
  },
  {
    initials: "IW",
    name: "Ideaware",
    role: "Senior UX/UI Designer",
    period: "2016 — 2017",
  },
];

function CtaPrimary() {
  const innerStyle = { background: "var(--color-bg-deep)", color: "var(--color-ink-strong)" };

  const wrapperClass = "group relative inline-flex items-center gap-3 overflow-hidden rounded-full py-1.5 pl-6 pr-1.5 text-sm font-medium no-underline transition-all";

  const wrapperStyle = {
    background: "var(--color-ink-strong)",
    color: "var(--color-bg-deep)",
    boxShadow: "0 4px 16px -4px rgba(255,255,255,0.2), inset 0 1px 0 0 rgba(255,255,255,0.6)",
  };

  return (
    <a href="#contact" data-cursor="hover" className={wrapperClass} style={wrapperStyle}>
      {/* Liquid metal shader as a subtle base layer, below content */}
      <span className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
        <LiquidMetalShader
          speed={0.6}
          scale={6}
          shiftRed={-0.1}
          shiftBlue={0.3}
        />
      </span>

      <span className="relative z-10">{"Let's talk"}</span>
      <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110" style={innerStyle}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

function CtaSecondary() {
  const wrapperClass = "glass-button group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium no-underline text-[var(--color-ink)]";

  return (
    <a href="#work" data-cursor="hover" className={wrapperClass}>
      {/* Diagonal shimmer sweep — runs once on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />

      <span className="relative z-10">View work</span>
      <svg className="relative z-10" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 3v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function LiveWorkCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % companies.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const current = companies[index];

  const cardClass = "glass rounded-3xl p-6 w-full max-w-[360px] relative overflow-hidden";
  const initialsBoxClass = "relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 flex items-center justify-center";
  const initialsBoxStyle = {
    background: "linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.02) 100%)",
    border: "1px solid var(--color-line-strong)",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1.8, ease }} className={cardClass}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full animate-pulse-glow" style={{ background: "var(--color-accent)" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
          </span>
          Where I&apos;ve worked
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--color-ink-dim)]">
          {String(index + 1).padStart(2, "0")} / {String(companies.length).padStart(2, "0")}
        </span>
      </div>

      <motion.div key={current.initials + "-box"} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease }} className={initialsBoxClass} style={initialsBoxStyle}>
        <span className="font-display text-[clamp(56px,8vw,84px)] font-light tracking-[-0.05em] text-[var(--color-ink-strong)]">
          {current.initials}
        </span>
        <div className="absolute bottom-2 right-3 font-mono text-[8px] tracking-[0.2em] uppercase text-[var(--color-ink-dim)]">
          {current.period}
        </div>
      </motion.div>

      <motion.div key={current.initials + "-text"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }}>
        <div className="font-display text-xl text-[var(--color-ink-strong)] tracking-tight leading-tight mb-1.5">
          {current.name}
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)] leading-[1.5]">
          {current.role}
        </div>
      </motion.div>

      <div className="flex gap-1 mt-5">
        {companies.map((_, i) => (
          <span key={i} className="h-0.5 flex-1 rounded-full transition-all duration-500" style={{ background: i === index ? "var(--color-accent)" : "var(--color-line-strong)" }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen w-full z-[3] flex flex-col">
      <div className="flex-1" />

      <div className="relative z-10 px-6 md:px-12 pb-12 md:pb-20">
        <div className="grid grid-cols-12 gap-8 items-end max-w-[1400px] mx-auto">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-7 md:gap-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease }}>
              <LiveStatusBadge>Available 2026</LiveStatusBadge>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease }} className={headlineClass} style={{ maxWidth: "12ch" }}>
              Designing the human side of an AI era.
              <span className="text-[var(--color-accent)] font-normal text-[0.4em] align-super ml-2">TM</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.3, ease }} className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)]">
                ───
              </span>
              <span className="font-display italic text-base text-[var(--color-ink-strong)]">
                Doug Vargas
              </span>
              <span className="text-[var(--color-ink-dim)]">·</span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)]">
                Senior Product Designer × Mercadolibre Andes
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.5, ease }} className="flex items-center gap-3 flex-wrap">
              <CtaPrimary />
              <CtaSecondary />
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex justify-end">
            <LiveWorkCard />
          </div>
        </div>
      </div>
    </section>
  );
}