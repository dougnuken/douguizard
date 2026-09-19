"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sections } from "@/data/sections";
import { setActiveSection } from "@/lib/activeSection";
import { stepSpring, type Spring } from "@/lib/spring";
import RailLabel from "./RailLabel";

/* ── Wheel geometry ─────────────────────────────────────────────────────────
   The rail is a picker drum seen edge-on: its detents sit at equal ANGLES on
   the rim of a cylinder, so their spacing on screen compresses toward the
   ends. That compression — not the shading — is what makes it read as a wheel
   rather than as a list that happens to fade.

   Both constants are an accessibility budget before they are a look. A real
   iOS picker turns its far rows edge-on and unreadable, which it can afford
   because you can always spin them to the middle. This wheel cannot: all five
   rows are navigation, and every one of them has to stay clickable and
   legible at all times. So the wheel is shallow — 10° a detent, and 40° at
   the far end, where a glyph is still 77% of its height.

   The radius then falls out of the hit boxes. At 10° / 235px the tightest
   gap between neighbours (the outermost pair, when the wheel is parked at
   either end) is 33.6px, which is what lets every row be a fixed 32px-tall
   target: clear of WCAG 2.2's 24px floor, and never overlapping the next
   one. Change either number and re-check that gap. */
const STEP = 10;
const RADIUS = 235;
const HIT_H = 32;
const LAST = sections.length - 1;

const rad = (d: number) => (d * Math.PI) / 180;
/** Pixels per detent at the centre of the wheel. The scale drag and wheel use. */
const PITCH = RADIUS * Math.sin(rad(STEP));
/** The widest a row ever sits from the centre: the wheel parked at one end. */
const MAX_OFF = (sections.length - 1) * STEP;
/* How much of its opacity the outermost row gives up. It stops at 0.62 and
   the numerals are set in full `--ink` rather than `--ink-dim`, because that
   is the floor where a 13px numeral still clears 4.5:1 in BOTH themes once
   the fade has blended it into the paper. Dim ink plus a fade fails. */
const DIM = 0.38;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function SectionIndex() {
  const [active, setActive] = useState(0);
  /** Which row the pointer is over, so the standing label can preview it. */
  const [peek, setPeek] = useState<number | null>(null);

  const drumRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  /** Spring state, in detents. Never React state: it moves every frame. */
  const spring = useRef<Spring>({ pos: 0, vel: 0 });
  const goal = useRef(0);
  const raf = useRef(0);
  const reduce = useRef(false);
  /** `active` for the imperative handlers, which must not re-bind to read it. */
  const activeRef = useRef(0);

  /** Paints one frame. Transform and opacity only — nothing here reflows. */
  const paint = useCallback((p: number) => {
    for (let i = 0; i <= LAST; i++) {
      const row = rowsRef.current[i];
      if (!row) continue;
      const phi = (i - p) * STEP;
      const y = RADIUS * Math.sin(rad(phi));
      const face = row.firstElementChild as HTMLElement | null;
      row.style.transform = `translateY(${y.toFixed(2)}px)`;
      const off = Math.abs(phi);
      row.style.opacity = (1 - DIM * clamp(off / MAX_OFF, 0, 1)).toFixed(3);
      if (face) {
        // Perspective per row rather than on the drum: the anchor itself must
        // stay axis-aligned, because a rotated box is a foreshortened box and
        // the target-size rule measures what `getBoundingClientRect` returns.
        face.style.transform = `perspective(520px) rotateX(${(-phi).toFixed(2)}deg) scale(${(
          0.86 +
          0.14 * Math.cos(rad(off))
        ).toFixed(3)})`;
      }
    }
  }, []);

  /** Runs the spring until it is asleep, then stops asking for frames. */
  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const done = stepSpring(spring.current, goal.current, dt);
      paint(spring.current.pos);
      if (!done) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [paint]);

  /** Points the wheel at a detent. Reduced motion gets the answer, not the trip. */
  const spinTo = useCallback(
    (index: number) => {
      goal.current = index;
      if (reduce.current) {
        spring.current.pos = index;
        spring.current.vel = 0;
        cancelAnimationFrame(raf.current);
        paint(index);
        return;
      }
      run();
    },
    [paint, run],
  );

  // ── The wheel follows the page ───────────────────────────────────────────
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint(0);

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const scroller = document.querySelector<HTMLElement>("[data-hshell]");
    let frame = 0;
    let current = -1;

    // The active panel is the one whose centre sits closest to the viewport
    // centre — correct for both the desktop horizontal shell (X varies) and
    // the mobile vertical stack (Y varies), with no initial-observer race.
    const compute = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      let best = Infinity;
      let bestIndex = 0;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          bestIndex = i;
        }
      });
      if (bestIndex === current) return;
      current = bestIndex;
      activeRef.current = bestIndex;
      setActive(bestIndex);
      setActiveSection(sections[bestIndex].id);
      spinTo(bestIndex);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    compute();
    requestAnimationFrame(compute);
    window.addEventListener("scroll", onScroll, { passive: true });
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [paint, spinTo]);

  /** Scrolls to a panel and leaves focus inside it — the rail's whole contract. */
  const jump = useCallback((index: number) => {
    const el = document.getElementById(sections[index].id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
    (el.closest("[data-panel]") as HTMLElement | null)?.focus({ preventScroll: true });
  }, []);

  // ── The page follows the wheel: drag it, or spin it with the wheel ───────
  useEffect(() => {
    const drum = drumRef.current;
    if (!drum) return;

    let drag: { id: number; y0: number; from: number; moved: boolean } | null = null;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      cancelAnimationFrame(raf.current);
      spring.current.vel = 0;
      drag = { id: e.pointerId, y0: e.clientY, from: spring.current.pos, moved: false };
    };

    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dy = e.clientY - drag.y0;
      if (!drag.moved && Math.abs(dy) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        drum.setPointerCapture(drag.id);
      }
      // Dragging down brings earlier sections to the centre, exactly as
      // dragging a physical drum down rolls its earlier faces into view.
      const raw = drag.from - dy / PITCH;
      // Past either end the wheel still moves, at a quarter rate: the give is
      // what tells you there is nothing more, without a hard stop.
      const over = raw < 0 ? raw : raw > LAST ? raw - LAST : 0;
      spring.current.pos = clamp(raw - over * 0.75, -0.6, LAST + 0.6);
      paint(spring.current.pos);
    };

    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const moved = drag.moved;
      if (drum.hasPointerCapture(drag.id)) drum.releasePointerCapture(drag.id);
      drag = null;
      if (!moved) return; // A tap is a click; let the anchor handle it.
      const index = clamp(Math.round(spring.current.pos), 0, LAST);
      activeRef.current = index;
      setActive(index);
      setActiveSection(sections[index].id);
      spinTo(index);
      jump(index);
    };

    // Over the rail the wheel becomes a detented selector: one notch per
    // gesture, not a free scroll. The page's own wheel-to-horizontal mapping
    // lives on the shell, and the rail is a sibling of it, so nothing here
    // is fighting that handler for the same event.
    let acc = 0;
    let cooling = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooling) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 40) return;
      const next = clamp(activeRef.current + Math.sign(acc), 0, LAST);
      acc = 0;
      if (next === activeRef.current) return;
      cooling = true;
      window.setTimeout(() => {
        cooling = false;
      }, 320);
      activeRef.current = next;
      setActive(next);
      setActiveSection(sections[next].id);
      spinTo(next);
      jump(next);
    };

    drum.addEventListener("pointerdown", onDown);
    drum.addEventListener("pointermove", onMove);
    drum.addEventListener("pointerup", onUp);
    drum.addEventListener("pointercancel", onUp);
    drum.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      drum.removeEventListener("pointerdown", onDown);
      drum.removeEventListener("pointermove", onMove);
      drum.removeEventListener("pointerup", onUp);
      drum.removeEventListener("pointercancel", onUp);
      drum.removeEventListener("wheel", onWheel);
    };
  }, [jump, paint, spinTo]);

  return (
    <nav
      aria-label="Section index"
      /* No plate, no capsule. The old rail was a glass pill whose labels hung
         off its left edge, ~90px into the panel's text column — which is
         precisely where they crossed the Contact rows in the light theme. The
         label now stands on end INSIDE the gutter, so nothing the rail draws
         reaches past the content's right margin. */
      className="fixed right-3 top-1/2 z-[45] hidden -translate-y-1/2 items-center gap-3 lg:flex"
    >
      <RailLabel index={peek ?? active} />

      <div
        ref={drumRef}
        className="rail-drum relative h-[344px] w-16 [touch-action:none]"
        onPointerLeave={() => setPeek(null)}
      >
        {sections.map((s, i) => {
          const isActive = active === i;
          return (
            <a
              key={s.id}
              ref={(el) => {
                rowsRef.current[i] = el;
              }}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                activeRef.current = i;
                setActive(i);
                setActiveSection(s.id);
                spinTo(i);
                jump(i);
              }}
              onPointerEnter={() => setPeek(i)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${s.label} — section ${s.num}`}
              style={{ height: HIT_H, marginTop: -HIT_H / 2 }}
              className="group absolute inset-x-0 top-1/2 flex items-center justify-end gap-2 outline-none"
            >
              {/* One face per row, and the only thing that rotates. */}
              <span
                aria-hidden
                className="flex origin-center items-center justify-end gap-2"
              >
                {/* A fixed 1.25rem rule scaled on X — never a width animation,
                    so nothing reflows. The only permitted signal use here. */}
                <span
                  className={`block h-px w-5 origin-right transition-[transform,background-color] duration-500 ${
                    isActive
                      ? "scale-x-100 bg-[var(--signal)]"
                      : "scale-x-50 bg-[color-mix(in_srgb,var(--ink)_34%,transparent)] group-hover:scale-x-100 group-hover:bg-[var(--ink)] group-focus-visible:scale-x-100 group-focus-visible:bg-[var(--ink)]"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                />
                <span
                  className={`w-6 text-right font-mono text-[13px] tabular-nums text-[var(--ink)] ${
                    isActive ? "font-medium" : ""
                  }`}
                >
                  {s.num}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
