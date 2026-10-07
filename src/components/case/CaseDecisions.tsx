"use client";

import RevealText from "@/components/text/RevealText";
import { Band, EyebrowHeading, renderBold, type BandProps } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

export interface Decision {
  title: string;
  body: string;
}

/**
 * The calls worth defending, as a two-column ledger: the call on the left, the
 * reasoning on the right, one hairline per row.
 *
 * Titles line up in a single column, so the decisions can be read top to
 * bottom as a list of positions in a few seconds; the reasoning is beside each
 * one rather than under it, which halves the band's height without hiding a
 * word. Below `lg` the pair stacks again.
 *
 * The section keeps its sticky eyebrow in the left gutter — the one band that
 * still does. It is the deepest read on the page, and the label is what tells
 * a reader halfway down it what they are reading.
 *
 * The bullet is a short rule on the baseline rather than a filled dot: the
 * same weight, but a typographic mark rather than the page's one loud dot
 * repeated in three unrelated meanings.
 */
export default function CaseDecisions({ decisions, tone }: { decisions: Decision[]; tone?: BandProps["tone"] }) {
  const t = useDict().case;
  return (
    <Band tone={tone} rule="t">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] md:gap-12">
        <EyebrowHeading sticky>{t.decisions}</EyebrowHeading>
        <ul className="hairline-t list-none p-0">
          {decisions.map((decision, i) => (
            <li
              key={decision.title}
              className="hairline-b grid grid-cols-1 gap-3 py-6 md:py-7 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"
            >
              <div className="flex items-baseline gap-3.5">
                <span
                  aria-hidden
                  className="inline-block h-px w-2.5 shrink-0 -translate-y-[0.35em] bg-[var(--ink)]"
                />
                <RevealText
                  as="h3"
                  variant="mask"
                  delay={i * 0.05}
                  className="font-display text-[clamp(18px,1.5vw,21px)] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--ink)]"
                >
                  {decision.title}
                </RevealText>
              </div>
              <RevealText
                as="p"
                variant="fade"
                delay={i * 0.05 + 0.08}
                className="pl-6 text-[15px] leading-[1.6] text-[var(--ink-muted)] lg:pl-0"
              >
                {renderBold(decision.body)}
              </RevealText>
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}
