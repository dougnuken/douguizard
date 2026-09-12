"use client";

import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import RevealText from "@/components/text/RevealText";

/**
 * Container-level fade + rise, on scroll into view. For eyebrows and groups.
 * One implementation of the reveal for the whole template: `RevealText` owns
 * the observer and the transition, this only names the container case.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <RevealText as="div" variant="fade" delay={delay} duration={0.9} className={className}>
      {children}
    </RevealText>
  );
}

/** `**bold**` → `<strong>`. The only markup the case copy carries. */
export function renderBold(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-[var(--ink)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Sticky offset for the left-hand eyebrows. The header is fixed, so an eyebrow
 * pinned at `top-0` would slide under it; this clears `--header-h` plus 2rem of
 * air. Written as an arbitrary value because Tailwind scans source text.
 */
const STICKY = "md:sticky md:top-[calc(var(--header-h)+2rem)]";

const EYEBROW_CLASS =
  "font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink-muted)]";

function EyebrowTick() {
  return <span aria-hidden className="mr-3 inline-block h-px w-6 bg-[var(--ink)] align-middle" />;
}

/** Section eyebrow — hairline tick + mono label, sticky on desktop. */
export function Eyebrow({ children, sticky = false }: { children: ReactNode; sticky?: boolean }) {
  return (
    <FadeIn>
      <div className={twMerge(EYEBROW_CLASS, sticky && STICKY)}>
        <EyebrowTick />
        {children}
      </div>
    </FadeIn>
  );
}

/**
 * Same visual language as `Eyebrow`, but a real `<h2>`, so the document keeps a
 * genuine outline (h1 project → h2 section → h3 phase/decision/feature) without
 * introducing a second, louder header style.
 */
export function EyebrowHeading({
  children,
  sticky = false,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <FadeIn>
      <h2 className={twMerge(EYEBROW_CLASS, sticky && STICKY)}>
        <EyebrowTick />
        {children}
      </h2>
    </FadeIn>
  );
}

const RULES = {
  t: "hairline-t",
  b: "hairline-b",
  y: "hairline-t hairline-b",
  none: "",
} as const;

export interface BandProps {
  children: ReactNode;
  /** `raised` is ~4% off `paper` — a band change, not a card. */
  tone?: "paper" | "raised";
  rule?: keyof typeof RULES;
  /** Swap the 1100px prose measure for the 1400px media measure. */
  wide?: boolean;
  /** Overrides the default vertical rhythm (twMerge, so `py-*` wins). */
  className?: string;
}

/**
 * One horizontal band of the case. Replaces the `section` + max-width +
 * padding triplet that the monolith repeated thirteen times, so the page's
 * rhythm lives in one place and a band can never drift half a step.
 */
export function Band({ children, tone = "paper", rule = "none", wide = false, className }: BandProps) {
  return (
    <section
      className={twMerge(
        "relative z-[2] px-6 py-24 md:px-12 md:py-32",
        tone === "raised" ? "bg-[var(--paper-raised)]" : "bg-[var(--paper)]",
        RULES[rule],
        className,
      )}
    >
      <div className={twMerge("mx-auto w-full", wide ? "max-w-[1400px]" : "max-w-[1100px]")}>
        {children}
      </div>
    </section>
  );
}

/** The `/ Label` mono caption used by the meta strip, the links row and the colophon. */
export function SlashLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={twMerge(
        "font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)]",
        className,
      )}
    >
      / {children}
    </div>
  );
}
