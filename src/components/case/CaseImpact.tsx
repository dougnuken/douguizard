"use client";

import RevealText from "@/components/text/RevealText";
import { Band, Eyebrow } from "./primitives";
import type { Kpi } from "@/data/work";

/**
 * One KPI: the figure, what it measures, and an optional context chip.
 *
 * The chip's leading mark used to be a filled ink dot, the same mark the
 * decisions list and the AI feature label also used — three different meanings
 * on one page, told apart by nothing. Here it is a short rule instead, and the
 * text drops to `--ink-dim`, which is where the type scale puts a caption.
 */
function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <div className="flex flex-col">
      <RevealText
        as="div"
        variant="mask"
        delay={index * 0.07}
        className="font-display text-[clamp(30px,3.2vw,46px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]"
      >
        {kpi.value}
      </RevealText>
      <RevealText
        as="div"
        variant="fade"
        delay={index * 0.07 + 0.08}
        className="mt-2 font-mono text-[11px] uppercase leading-[1.5] tracking-[0.18em] text-[var(--ink-muted)]"
      >
        {kpi.label}
      </RevealText>
      {kpi.delta && (
        <span className="mt-2.5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-dim)]">
          <span aria-hidden className="inline-block h-px w-2 shrink-0 bg-[var(--ink-dim)]" />
          {kpi.delta}
        </span>
      )}
    </div>
  );
}

/** The market-facing star: one results-first sentence, then the numbers. */
export default function CaseImpact({ impact, kpis }: { impact: string; kpis?: Kpi[] }) {
  return (
    <Band>
      <Eyebrow>The impact</Eyebrow>

      <RevealText
        as="p"
        variant="mask"
        className="mt-8 max-w-[960px] font-display text-[clamp(1.75rem,4vw,3.375rem)] font-medium leading-[1.14] tracking-[-0.025em] text-[var(--ink)]"
      >
        {impact}
      </RevealText>

      {/* No grid at all when a case has no verified figures. An empty rule
          across the page reads as something that failed to load. */}
      {kpis && kpis.length > 0 && (
        <div className="hairline-t mt-16 grid grid-cols-2 gap-x-8 gap-y-12 pt-12 md:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.label} kpi={kpi} index={i} />
          ))}
        </div>
      )}
    </Band>
  );
}
