"use client";

import RevealText from "@/components/text/RevealText";
import { Band, EyebrowHeading, renderBold } from "./primitives";

export interface Decision {
  title: string;
  body: string;
}

/**
 * The calls worth defending.
 *
 * The bullet used to be a filled ink dot; it is now a short rule on the
 * baseline. Same weight, but it reads as a typographic mark rather than as the
 * page's one loud dot repeated in three unrelated meanings.
 */
export default function CaseDecisions({ decisions }: { decisions: Decision[] }) {
  return (
    <Band>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
        <EyebrowHeading sticky>Decisions I&apos;d defend</EyebrowHeading>
        <ul className="hairline-t m-0 list-none p-0">
          {decisions.map((decision, i) => (
            <li key={decision.title} className="hairline-b py-8 md:py-11">
              <div className="flex items-baseline gap-3.5">
                <span
                  aria-hidden
                  className="inline-block h-px w-2.5 shrink-0 -translate-y-[0.35em] bg-[var(--ink)]"
                />
                <RevealText
                  as="h3"
                  variant="mask"
                  delay={i * 0.05}
                  className="font-display text-[clamp(20px,2vw,28px)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--ink)]"
                >
                  {decision.title}
                </RevealText>
              </div>
              <RevealText
                as="p"
                variant="fade"
                delay={i * 0.05 + 0.08}
                className="mt-4 max-w-[680px] pl-[1.4rem] text-[clamp(15px,1.3vw,18px)] leading-[1.65] text-[var(--ink-muted)]"
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
