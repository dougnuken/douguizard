"use client";

import RevealText from "@/components/text/RevealText";
import { Band, Eyebrow, renderBold, type BandProps } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * Context, then what I did — side by side, as one spread.
 *
 * These used to be two full bands, each with a sticky eyebrow in a 200px
 * gutter: the problem on one tone, the answer on the other, a screen and a
 * half between them. Read together they are one thought — here is the
 * situation, here is my part in it — so they share a band and a row on a
 * desktop: the context set large on the left, the numbered list on the right.
 * On a phone they stack in reading order.
 */
export default function CaseNarrative({
  context,
  contributions,
  tone,
}: {
  context: string;
  contributions: string[];
  tone?: BandProps["tone"];
}) {
  const t = useDict().case;
  return (
    <Band tone={tone} rule="t">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <Eyebrow>{t.context}</Eyebrow>
          <RevealText
            as="p"
            variant="fade"
            className="mt-6 max-w-[34ch] font-display text-[clamp(19px,1.9vw,25px)] leading-[1.4] tracking-[-0.01em] text-[var(--ink)] md:mt-8"
          >
            {context}
          </RevealText>
        </div>

        <div>
          <Eyebrow>{t.whatIDid}</Eyebrow>
          <ol className="hairline-t mt-6 list-none p-0 md:mt-8">
            {contributions.map((contribution, i) => (
              <li
                key={contribution}
                /* The rule between rows only — the list's own top hairline
                   opens it and the band's end closes it, so the last row must
                   not draw a second one. */
                className={`grid grid-cols-[40px_1fr] gap-4 py-5 md:gap-6 ${
                  i < contributions.length - 1 ? "hairline-b" : ""
                }`}
              >
                <RevealText
                  as="div"
                  variant="mask"
                  delay={i * 0.04}
                  className="section-num text-[clamp(18px,1.6vw,22px)] leading-[1.25]"
                >
                  {String(i + 1).padStart(2, "0")}
                </RevealText>
                <RevealText
                  as="p"
                  variant="fade"
                  delay={i * 0.04 + 0.06}
                  className="text-[clamp(15px,1.2vw,17px)] leading-[1.55] text-[var(--ink)]"
                >
                  {renderBold(contribution)}
                </RevealText>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Band>
  );
}
