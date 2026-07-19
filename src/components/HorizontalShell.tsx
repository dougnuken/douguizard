"use client";

import React, { useEffect, useRef, useState } from "react";

// Dark full-bleed panels — only the dramatic bookends: 0 Hero and 10 Footer/Contact.
// Everything in between stays on the light bone canvas (no choppy alternation).
const DARK_PANELS = new Set([0, 10]);

/**
 * Editorial Horizontal shell.
 * - Desktop (lg+): lays each child out as a full-viewport panel in a horizontal,
 *   snap-based scroller. Vertical wheel is mapped to horizontal scrolling; native
 *   trackpad horizontal gestures pass through. Tall panels scroll vertically inside.
 * - Mobile (<lg): falls back to a normal vertical stack.
 * The scroller carries `data-hshell` so SectionIndex can observe/drive it.
 */
export default function HorizontalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Map vertical wheel → horizontal scroll (desktop only).
  useEffect(() => {
    const el = ref.current;
    if (!el || !isDesktop) return;

    const onWheel = (e: WheelEvent) => {
      // Let native horizontal-intent gestures (trackpad) pass through untouched.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // If the hovered panel can still scroll vertically, let it (tall panels).
      const panel = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-panel]",
      );
      if (panel) {
        const canScrollDown =
          e.deltaY > 0 &&
          panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
        const canScrollUp = e.deltaY < 0 && panel.scrollTop > 0;
        if (canScrollDown || canScrollUp) return;
      }
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isDesktop]);

  return (
    <div
      ref={ref}
      data-hshell
      className={
        isDesktop
          ? "flex h-svh w-screen snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-col"
      }
    >
      {React.Children.map(children, (child, i) => (
        <div
          data-panel
          className={
            (isDesktop
              ? "relative flex h-svh w-screen shrink-0 snap-start flex-col justify-center overflow-y-auto pt-16 lg:pr-28"
              : "relative") + (DARK_PANELS.has(i) ? " theme-dark" : "")
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
