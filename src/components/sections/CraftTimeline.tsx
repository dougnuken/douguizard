"use client";

import { useInView, usePrefersReducedMotion } from "@/components/text/useInView";

export interface Step {
  title: string;
  body: string;
}

/** Node diameter, px. The rails align to its centre. */
const NODE = 11;

/** Seconds one segment takes to draw. They run one after another. */
const SEGMENT = 0.34;

/**
 * The four steps as what they actually are: a sequence.
 *
 * Four equal columns said "here are four things". These four are ordered — you
 * cannot ship before you have read the domain — and a rail with nodes on it
 * says so before a word is read.
 *
 * The rail is drawn as one segment per step rather than one line across the
 * whole row, for two reasons. A single line has to stop somewhere, and a full
 * width one left 270px of empty rail past the last node, which reads as a
 * fifth step that failed to load. And segments can draw in turn: the line
 * travels from step to step instead of appearing all at once, which is the
 * point being made.
 *
 * Everything moving is `transform` and `opacity`, so none of it can cost a
 * layout pass. Under `prefers-reduced-motion` the rail is simply drawn and the
 * nodes are simply lit — a motion preference must never become missing
 * structure.
 */
export default function CraftTimeline({ steps }: { steps: Step[] }) {
  const reduce = usePrefersReducedMotion();
  const [ref, shown] = useInView<HTMLOListElement>();
  const on = reduce || shown;

  /** Each segment waits for the one before it. */
  const draw = (i: number, axis: "x" | "y") => ({
    transform: on ? "scale(1)" : axis === "x" ? "scaleX(0)" : "scaleY(0)",
    transition: reduce ? "none" : `transform ${SEGMENT}s linear ${i * SEGMENT}s`,
  });

  return (
    // One column until the row fits, never two. At two columns the reading
    // order is 1,2 / 3,4, so a vertical connector would join 1 to 3 and draw
    // the wrong sequence. A timeline that lies about its order is worse than
    // no timeline.
    <ol className="relative grid gap-x-12 gap-y-10 lg:grid-cols-4" ref={ref}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex flex-col gap-3 pl-8 lg:pl-0 lg:pt-9">
            {/* Stacked: the segment drops from this node to the next one.
                `gap-y-10` is 2.5rem, so it has to cross its own height plus that. */}
            {!last && (
              <span
                aria-hidden
                className="absolute left-[5px] top-0 h-[calc(100%+2.5rem)] w-px origin-top bg-[var(--line)] lg:hidden"
                style={draw(i, "y")}
              />
            )}
            {/* One row: the segment runs from this node to the next column's,
                which is this column's width plus the 3rem gutter. */}
            {!last && (
              <span
                aria-hidden
                className="absolute left-0 top-[5px] hidden h-px w-[calc(100%+3rem)] origin-left bg-[var(--line)] lg:block"
                style={draw(i, "x")}
              />
            )}

            <span
              aria-hidden
              className="absolute left-0 top-0 block rounded-full border border-[var(--line-strong)] bg-[var(--paper)]"
              style={{
                width: NODE,
                height: NODE,
                opacity: on ? 1 : 0,
                // Lit as the line arrives, not all four at once.
                transition: reduce ? "none" : `opacity 0.3s var(--ease-out) ${i * SEGMENT}s`,
              }}
            />

            <span className="section-num text-[11px] tracking-[0.2em]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-[1.0625rem] font-semibold leading-[1.25] tracking-[-0.015em] text-[var(--ink)]">
              {step.title}
            </h3>
            <p className="max-w-[34ch] text-[length:var(--step-small)] leading-[1.6] text-[var(--ink-muted)]">
              {step.body}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
