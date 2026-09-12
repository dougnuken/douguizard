"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * One-way "has this entered the viewport" flag, backed by a self-owned
 * IntersectionObserver rooted at the viewport.
 *
 * Fail-safe by design, and deliberately so: it fires as soon as any part of the
 * element crosses the edge (threshold 0), fires immediately when the element is
 * already on screen at mount, and never flips back to false. A reveal that can
 * get stuck invisible is worse than no reveal at all, and every consumer of this
 * hook hides real content behind it.
 *
 * Environments with no IntersectionObserver (jsdom, very old engines) report
 * `true` straight away, so the content is simply always visible there.
 */
export function useInView<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    let io: IntersectionObserver | null = null;
    const reveal = () => {
      setInView(true);
      io?.disconnect();
      io = null;
    };

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal();
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);

    // Already within (or above) the viewport at mount: reveal now rather than
    // waiting for a scroll that may never come.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) reveal();

    return () => io?.disconnect();
  }, []);

  return [ref, inView];
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `prefers-reduced-motion: reduce`, read through `matchMedia` and kept live.
 *
 * Returns `false` during SSR and on the very first client render — the value is
 * unknowable before mount, and rendering the motion-on branch on both sides is
 * what keeps hydration byte-identical. Consumers must therefore treat `false` as
 * "not yet known", which they do: every animation here starts from its hidden
 * state, so a reduced-motion viewer sees the settled frame rather than a flash.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
