"use client";

import { useEffect, useState } from "react";

interface SectionRef {
  id: string;
  num: string;
  label: string;
}

/** Every scrollable section, in document order. Drives the right-rail index. */
const SECTIONS: SectionRef[] = [
  { id: "hero", num: "00", label: "Home" },
  { id: "about", num: "01", label: "About" },
  { id: "capabilities", num: "02", label: "Craft" },
  { id: "work", num: "03", label: "Work" },
  { id: "contact", num: "04", label: "Contact" },
];

/** Sections whose panel renders on a dark background (see HorizontalShell). */
const DARK_IDS = new Set(["hero", "contact"]);

export default function SectionIndex() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!els.length) return;

    const scroller = document.querySelector<HTMLElement>("[data-hshell]");
    let raf = 0;
    let current = "";

    const apply = (id: string) => {
      if (id === current) return;
      current = id;
      setActive(id);
      document.documentElement.setAttribute(
        "data-panel-theme",
        DARK_IDS.has(id) ? "dark" : "light",
      );
    };

    // The active panel is the one whose centre sits closest to the viewport
    // centre. This works for both the desktop horizontal shell (X varies) and
    // the mobile vertical stack (Y varies) — no fragile initial-observer race.
    const compute = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      let bestId = els[0].id;
      let best = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          bestId = el.id;
        }
      }
      apply(bestId);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute(); // deterministic initial state (Home at rest)
    requestAnimationFrame(compute); // re-check once layout settles
    window.addEventListener("scroll", onScroll, { passive: true });
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleJump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  return (
    <nav
      aria-label="Section index"
      className="fixed right-6 top-1/2 z-[45] hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => handleJump(e, s.id)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`${s.label} — section ${s.num}`}
            className="group relative flex items-center justify-end gap-3 py-0.5 outline-none"
          >
            {/* Label — visible when active or hovered/focused, doesn't shift layout */}
            <span
              className="pointer-events-none absolute right-full mr-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300"
              style={{
                color: isActive ? "var(--color-accent)" : "var(--color-ink-muted)",
                opacity: isActive ? 1 : 0,
                transitionTimingFunction: "var(--ease-quart-out)",
              }}
            >
              {s.label}
            </span>
            <span
              className="absolute right-full mr-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--chrome-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            >
              {!isActive && s.label}
            </span>

            {/* Rail line — grows and turns accent on active */}
            <span
              className="h-px transition-all duration-500"
              style={{
                width: isActive ? "2rem" : "1rem",
                background: isActive
                  ? "var(--color-accent)"
                  : "color-mix(in srgb, var(--chrome-ink) 35%, transparent)",
                transitionTimingFunction: "var(--ease-quart-out)",
              }}
            />

            {/* Numeral */}
            <span
              className="w-5 text-right font-mono text-[10px] tabular-nums transition-colors duration-300"
              style={{
                color: isActive
                  ? "var(--chrome-ink)"
                  : "color-mix(in srgb, var(--chrome-ink) 45%, transparent)",
              }}
            >
              {s.num}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
