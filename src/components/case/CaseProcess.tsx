"use client";

import RevealText from "@/components/text/RevealText";
import { Band, EyebrowHeading, renderBold } from "./primitives";

export interface ProcessPhase {
  phase: string;
  title: string;
  body: string;
}

/** How the work actually happened, phase by phase — the how after the what. */
export default function CaseProcess({ process }: { process: ProcessPhase[] }) {
  return (
    <Band tone="raised" rule="y">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
        <EyebrowHeading sticky>How it happened</EyebrowHeading>
        <ol className="hairline-t m-0 list-none p-0">
          {process.map((phase, i) => (
            <li
              key={phase.phase}
              className="hairline-b grid grid-cols-1 gap-4 py-8 md:grid-cols-[64px_1fr] md:gap-8 md:py-11"
            >
              <RevealText
                as="div"
                variant="mask"
                delay={i * 0.04}
                className="section-num text-[clamp(24px,2.5vw,36px)] leading-none"
              >
                {phase.phase}
              </RevealText>
              <div>
                <RevealText
                  as="h3"
                  variant="mask"
                  delay={i * 0.04 + 0.05}
                  className="font-display text-[clamp(21px,2.1vw,30px)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink)]"
                >
                  {phase.title}
                </RevealText>
                <RevealText
                  as="p"
                  variant="fade"
                  delay={i * 0.04 + 0.1}
                  className="mt-4 max-w-[680px] text-[clamp(15px,1.3vw,18px)] leading-[1.65] text-[var(--ink-muted)]"
                >
                  {renderBold(phase.body)}
                </RevealText>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Band>
  );
}
