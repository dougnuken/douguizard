"use client";

import RevealText from "@/components/text/RevealText";
import { Band, EyebrowHeading, renderBold, type BandProps } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

export interface ProcessPhase {
  phase: string;
  title: string;
  body: string;
}

/**
 * Columns by phase count. Static strings — Tailwind scans source text. Four
 * phases run as one row; five or six fold into rows of three rather than
 * leaving a single phase stranded on a second row of four.
 */
function columnsFor(count: number): string {
  if (count <= 1) return "";
  if (count === 2) return "md:grid-cols-2";
  if (count === 3) return "md:grid-cols-3";
  if (count === 4) return "md:grid-cols-2 lg:grid-cols-4";
  return "md:grid-cols-2 lg:grid-cols-3";
}

/**
 * How the work actually happened — as a timeline, not an essay.
 *
 * It used to be one phase per full-width row, numeral in a gutter, a paragraph
 * per row: four screens of reading for something whose shape is "four steps".
 * The phases now sit side by side, each on a segment of one hairline with a
 * short ink tick where it begins, so the sequence is legible before a word of
 * it is: number, title, and the short account under it for whoever wants it.
 */
export default function CaseProcess({ process, tone }: { process: ProcessPhase[]; tone?: BandProps["tone"] }) {
  const t = useDict().case;
  return (
    <Band tone={tone} rule="t">
      <EyebrowHeading>{t.howItHappened}</EyebrowHeading>

      <ol className={`mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 md:mt-12 ${columnsFor(process.length)}`}>
        {process.map((phase, i) => (
          <li key={phase.phase} className="hairline-t relative pt-5 md:pt-6">
            {/* The tick marks where a phase starts on the shared line. */}
            <span aria-hidden className="absolute -top-px left-0 h-px w-6 bg-[var(--ink)]" />
            <RevealText
              as="div"
              variant="mask"
              delay={i * 0.04}
              className="section-num text-[clamp(18px,1.6vw,22px)] leading-none"
            >
              {phase.phase}
            </RevealText>
            <RevealText
              as="h3"
              variant="mask"
              delay={i * 0.04 + 0.05}
              className="mt-4 font-display text-[clamp(18px,1.5vw,21px)] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink)]"
            >
              {phase.title}
            </RevealText>
            <RevealText
              as="p"
              variant="fade"
              delay={i * 0.04 + 0.1}
              className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-muted)]"
            >
              {renderBold(phase.body)}
            </RevealText>
          </li>
        ))}
      </ol>
    </Band>
  );
}
