"use client";

import RevealText from "@/components/text/RevealText";
import { Band, Eyebrow, renderBold } from "./primitives";

/**
 * Context, then what I did.
 *
 * Two bands, not one: the problem sits on the raised tone and the answer on
 * paper, so the band change does the work an extra heading would otherwise
 * have to do. Both run the eyebrow-left / prose-right grid the rest of the
 * page reads in.
 */
export default function CaseNarrative({
  context,
  contributions,
}: {
  context: string;
  contributions: string[];
}) {
  return (
    <>
      <Band tone="raised" rule="y">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
          <Eyebrow sticky>Context</Eyebrow>
          <RevealText
            as="p"
            variant="fade"
            className="max-w-[780px] font-display text-[clamp(20px,2.4vw,30px)] leading-[1.4] tracking-[-0.01em] text-[var(--ink)]"
          >
            {context}
          </RevealText>
        </div>
      </Band>

      <Band>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
          <Eyebrow sticky>What I did</Eyebrow>
          <ol className="hairline-t hairline-b m-0 list-none p-0">
            {contributions.map((contribution, i) => (
              <li
                key={contribution}
                /* The rule between rows only — the band's own hairlines close
                   the list, so the last row must not draw a second one. */
                className={`grid grid-cols-[48px_1fr] gap-5 py-6 md:gap-8 md:py-7 ${
                  i < contributions.length - 1 ? "hairline-b" : ""
                }`}
              >
                <RevealText
                  as="div"
                  variant="mask"
                  delay={i * 0.04}
                  className="section-num text-[clamp(22px,2.2vw,32px)] leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </RevealText>
                <RevealText
                  as="p"
                  variant="fade"
                  delay={i * 0.04 + 0.06}
                  className="text-[clamp(15px,1.35vw,19px)] leading-[1.55] text-[var(--ink)]"
                >
                  {renderBold(contribution)}
                </RevealText>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </>
  );
}
