"use client";

import type { CSSProperties } from "react";
import RevealText from "@/components/text/RevealText";
import { Band, Eyebrow, type BandProps } from "./primitives";
import type { CaseStudy, Kpi } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * How wide a glyph of the figures' face is, in em — Archivo ExtraBold at the
 * figures' -0.035em tracking, measured, then rounded UP per class so the
 * estimate errs on the side of fitting: digits and lowercase measure ≤0.61,
 * capitals ≤0.78, and only M, W, m, w and % run wider.
 */
function advance(ch: string): number {
  if (/[MWmw%]/.test(ch)) return 0.95;
  if (/[A-HJ-Z]/.test(ch)) return 0.78;
  if (/[.,:;'’!|\-fijlrtI]/.test(ch)) return 0.4;
  return 0.62;
}

/**
 * The figures' size: up to 72px, and never wider than their column.
 *
 * The figures are the loudest thing on the page after the product, but the
 * copy is free text — "~1,200" and "1:2.5" share a band with "End-to-end" and
 * "Sin conexión" — and a column is 124px wide on a 320px phone. So each card
 * is a size container, and the type is capped at the width the row's widest
 * unbreakable word needs: a long value scales down instead of spilling into
 * the next column (or being clipped by its reveal mask). One cap for the whole
 * row, because the columns are equal — a "2" beside "End-to-end" is set at
 * the same size, not twice as loud.
 */
function figureSize(kpis: Kpi[]): string {
  // A number and its unit ("6 años") count as one word: split, the figure
  // would end a line and what it counts would start the next.
  const words = (value: string) => (/^[~<>+]?\d/.test(value) ? [value] : value.split(/\s+/));
  const widest = Math.max(
    1,
    ...kpis.flatMap((k) =>
      words(k.value).map((word) => [...word].reduce((em, ch) => em + advance(ch), 0)),
    ),
  );
  return `min(clamp(40px, 5vw, 72px), ${(100 / widest).toFixed(2)}cqi)`;
}

/**
 * One KPI: the figure, what it measures, and an optional context chip.
 *
 * The chip's leading mark used to be a filled ink dot, the same mark the
 * decisions list and the AI feature label also used — three different meanings
 * on one page, told apart by nothing. Here it is a short rule instead, and the
 * text drops to `--ink-dim`, which is where the type scale puts a caption.
 *
 * The rule hangs from the top of the chip, not its middle: a chip that wraps
 * to two lines would otherwise centre the mark between them and point at
 * neither. 0.7em down is the middle of the first line's capitals at 1.5
 * leading.
 */
function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <div className="@container flex min-w-0 flex-col">
      <RevealText
        as="div"
        variant="mask"
        delay={index * 0.07}
        className="font-display text-[length:var(--kpi-size)] font-extrabold leading-[0.95] tracking-[-0.035em] text-[var(--ink)]"
      >
        {kpi.value}
      </RevealText>
      <RevealText
        as="div"
        variant="fade"
        delay={index * 0.07 + 0.08}
        className="mt-3 font-mono text-[11px] uppercase leading-[1.5] tracking-[0.18em] text-[var(--ink-muted)]"
      >
        {kpi.label}
      </RevealText>
      {kpi.delta && (
        <span className="mt-2 flex gap-2 font-mono text-[10px] uppercase leading-[1.5] tracking-[0.15em] text-[var(--ink-dim)]">
          <span aria-hidden className="mt-[0.7em] h-px w-2 shrink-0 bg-[var(--ink-dim)]" />
          {kpi.delta}
        </span>
      )}
    </div>
  );
}

/**
 * The market-facing star: the numbers, then the one sentence that reads them.
 *
 * Figures first. They are the proof, they are what a reader scanning the page
 * stops on, and set at 72px they are the loudest thing after the product — so
 * they open the band, right under its eyebrow, instead of waiting below a
 * five-line sentence set larger than they were. The sentence follows at the
 * lead step as their reading: a reader who stops at the figures has the
 * result, one who reads on gets what it meant.
 *
 * A side project that never shipped has a premise rather than results, so its
 * band is titled as one ("The idea") — the sentence is the same slot, but it
 * is not dressed as an outcome.
 */
export default function CaseImpact({
  impact,
  kpis,
  kind,
  tone,
}: {
  impact: string;
  kpis?: Kpi[];
  kind?: CaseStudy["kind"];
  tone?: BandProps["tone"];
}) {
  const t = useDict().case;
  // No grid at all when a case has no verified figures. An empty rule across
  // the page reads as something that failed to load.
  const figures = kpis && kpis.length > 0 ? kpis : undefined;
  return (
    <Band tone={tone} rule="t">
      <Eyebrow>{kind === "side" ? t.idea : t.impact}</Eyebrow>

      {figures && (
        <div
          className="hairline-b mt-8 grid grid-cols-2 gap-x-6 gap-y-10 pb-10 md:mt-10 md:grid-cols-4 md:gap-x-8 md:pb-12"
          style={{ "--kpi-size": figureSize(figures) } as CSSProperties}
        >
          {figures.map((kpi, i) => (
            <KpiCard key={kpi.label} kpi={kpi} index={i} />
          ))}
        </div>
      )}

      <RevealText
        as="p"
        variant="mask"
        className="mt-8 max-w-[760px] font-display text-[clamp(1.25rem,2.2vw,2rem)] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink)] md:mt-10"
      >
        {impact}
      </RevealText>
    </Band>
  );
}
