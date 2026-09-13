"use client";

import { useEffect, useState } from "react";
import { sections } from "@/data/sections";
import { setActiveSection } from "@/lib/activeSection";

export default function SectionIndex() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const scroller = document.querySelector<HTMLElement>("[data-hshell]");
    let raf = 0;
    let current = "";

    const apply = (id: string) => {
      if (id === current) return;
      current = id;
      setActive(id);
      setActiveSection(id);
    };

    // The active panel is the one whose centre sits closest to the viewport
    // centre. Correct for both the desktop horizontal shell (X varies) and the
    // mobile vertical stack (Y varies) — no fragile initial-observer race.
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

    compute();
    requestAnimationFrame(compute);
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
    // Focusing the panel keeps the following Tab presses inside the panel the
    // user just chose — this is what makes the rail usable with a reader.
    (el.closest("[data-panel]") as HTMLElement | null)?.focus({ preventScroll: true });
  };

  return (
    <nav
      aria-label="Section index"
      /* Glass, so the rail reads as a layer floating over the panel rather
         than as marks printed on it — and so whatever passes underneath stays
         legible instead of being cut by an opaque plate. `backdrop-blur`
         degrades to plain translucency where it is unsupported, which is the
         right failure: still see-through, just not frosted. */
      className="fixed right-4 top-1/2 z-[45] hidden -translate-y-1/2 flex-col items-end gap-4 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_55%,transparent)] px-3 py-5 backdrop-blur-[14px] lg:flex"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => handleJump(e, s.id)}
            aria-current={isActive ? "true" : undefined}
            aria-label={`${s.label} — section ${s.num}`}
            className="group relative flex min-h-11 items-center justify-end gap-3 py-2 outline-none"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute right-full mr-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity duration-300 ${
                isActive
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            >
              {s.label}
            </span>

            {/* Rail: a fixed 2rem rule scaled on X — never a width animation,
                so nothing reflows. The only permitted signal use here. */}
            <span aria-hidden className="block w-8 shrink-0">
              <span
                className={`block h-px origin-right transition-transform duration-500 ${
                  isActive
                    ? "scale-x-100 bg-[var(--signal)]"
                    : "scale-x-50 bg-[color-mix(in_srgb,var(--ink)_30%,transparent)] group-hover:scale-x-75 group-hover:bg-[var(--ink)] group-focus-visible:scale-x-75 group-focus-visible:bg-[var(--ink)]"
                }`}
                style={{ transitionTimingFunction: "var(--ease-out)" }}
              />
            </span>

            <span
              aria-hidden
              className={`w-5 text-right font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                isActive
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-dim)] group-hover:text-[var(--ink)]"
              }`}
            >
              {s.num}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
