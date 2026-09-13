"use client";

import React, { useEffect, useRef } from "react";

const SHELL_CLASS = [
  "flex flex-col",
  "lg:h-svh lg:w-screen lg:flex-row lg:snap-x lg:snap-mandatory",
  "lg:overflow-x-auto lg:overflow-y-hidden",
  "lg:[overscroll-behavior-y:contain]",
  "lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
].join(" ");

const PANEL_CLASS = [
  "relative",
  "pt-14 lg:pt-16",
  "lg:flex lg:h-svh lg:w-screen lg:shrink-0 lg:snap-start lg:flex-col lg:overflow-y-auto lg:pr-24",
  // Inset, because the panel is its own scroll container: an outset ring would
  // be clipped by the very overflow that makes the panel focusable.
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
].join(" ");

/**
 * Editorial horizontal shell.
 *
 * The desktop/mobile decision lives entirely in class names, so the server HTML
 * is already horizontal at ≥ 1024 and nothing re-lays-out after hydration.
 * Vertical wheel maps to horizontal scroll; native horizontal gestures and tall
 * panels pass through. Arrow keys, PageUp/PageDown, Home and End move panels.
 */
export default function HorizontalShell({
  children,
  labels = [],
}: {
  children: React.ReactNode;
  /**
   * One accessible name per panel, in child order. Each panel is a focusable
   * scroll container, and a scroll container a screen reader can land on needs
   * a name to announce.
   */
  labels?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Intrinsic desktop test: no horizontal overflow means the mobile stack.
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const panel = (e.target as HTMLElement)?.closest<HTMLElement>("[data-panel]");
      if (panel) {
        const down =
          e.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
        const up = e.deltaY < 0 && panel.scrollTop > 0;
        if (down || up) return;
      }
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const go = (index: number) => {
    const el = ref.current;
    if (!el) return;
    const count = el.children.length;
    const clamped = Math.min(Math.max(index, 0), count - 1);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    // Derived, never stored, so a resize can't desynchronise it.
    const current = Math.round(el.scrollLeft / el.clientWidth);

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        e.preventDefault();
        go(current + 1);
        break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        go(current - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(el.children.length - 1);
        break;
      default:
        // ArrowUp / ArrowDown are deliberately not intercepted: they scroll
        // inside a tall panel.
        break;
    }
  };

  return (
    <div
      ref={ref}
      data-hshell
      tabIndex={0}
      role="group"
      aria-label="Sections — use the arrow keys to move between panels"
      onKeyDown={onKeyDown}
      className={SHELL_CLASS}
    >
      {React.Children.map(children, (child, i) => (
        /* tabIndex 0, not -1: a panel taller than the viewport scrolls, and a
           scrollable region that only the mouse wheel can reach is unusable by
           keyboard (WCAG 2.1.1). "How I work" runs 1125px in a 900px window. */
        <div
          data-panel
          tabIndex={0}
          role="group"
          aria-label={labels[i]}
          className={PANEL_CLASS}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
