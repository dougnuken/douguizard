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
  { id: "intro", num: "01", label: "Manifesto" },
  { id: "work", num: "02", label: "Work" },
  { id: "capabilities", num: "03", label: "Capabilities" },
  { id: "experience", num: "04", label: "Experience" },
  { id: "stats", num: "05", label: "Numbers" },
  { id: "testimonials", num: "06", label: "Trusted" },
  { id: "about", num: "07", label: "About" },
  { id: "contact", num: "08", label: "Contact" },
];

/** Sections whose panel renders on a dark background (see HorizontalShell). */
const DARK_IDS = new Set(["hero", "contact"]);

export default function SectionIndex() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    // Paint the correct chrome on first load before the observer fires
    // (the first panel, hero, renders on a dark background).
    document.documentElement.setAttribute(
      "data-panel-theme",
      DARK_IDS.has("hero") ? "dark" : "light",
    );

    // Observe within the horizontal scroller: a panel is "active" while it
    // crosses the horizontal middle band of the shell (desktop). Falls back to
    // the viewport if the shell is not present.
    const scroller = document.querySelector<HTMLElement>("[data-hshell]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            document.documentElement.setAttribute(
              "data-panel-theme",
              DARK_IDS.has(entry.target.id) ? "dark" : "light",
            );
          }
        }
      },
      { root: scroller ?? null, rootMargin: "0px -49% 0px -49%", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
