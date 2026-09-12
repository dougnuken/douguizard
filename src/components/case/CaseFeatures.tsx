"use client";

import RevealText from "@/components/text/RevealText";
import { Band, EyebrowHeading, renderBold } from "./primitives";

export interface Feature {
  title: string;
  body: string;
  kind?: "ai" | "product";
}

/**
 * Micro-label separating a model-powered capability from product depth.
 *
 * It used to say "AI" in ink with an ink dot, and "Product" in dim with
 * nothing — the difference between the two was carried by colour and by a dot,
 * which is exactly what WCAG 1.4.1 rules out. Both now render identically apart
 * from the word itself and the AI label's wider tracking, so the distinction is
 * in the text where anyone can read it.
 */
function FeatureKind({ kind }: { kind?: Feature["kind"] }) {
  if (!kind) return null;
  const isAi = kind === "ai";
  return (
    <div
      className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--ink-dim)]"
      style={{ letterSpacing: isAi ? "0.3em" : "0.25em" }}
    >
      <span aria-hidden className="inline-block h-px w-2.5 shrink-0 bg-[var(--ink-dim)]" />
      {isAi ? "AI" : "Product"}
    </div>
  );
}

/** What the product can do — between the decisions and the screens. */
export default function CaseFeatures({
  intro,
  features,
}: {
  intro?: string;
  features: Feature[];
}) {
  return (
    <Band tone="raised" rule="t">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
        <EyebrowHeading sticky>What it can do</EyebrowHeading>
        <div>
          {intro && (
            <RevealText
              as="p"
              variant="fade"
              className="max-w-[780px] font-display text-[clamp(19px,1.9vw,26px)] leading-[1.4] tracking-[-0.01em] text-[var(--ink)]"
            >
              {intro}
            </RevealText>
          )}

          {/* Two-up on desktop with real rules between the cells: the grid
              carries no gap, the padding does the spacing, so the hairlines
              meet instead of floating. Collapses to a single column. */}
          <ul
            className={`hairline-t m-0 grid list-none grid-cols-1 p-0 md:grid-cols-2 ${
              intro ? "mt-12 md:mt-16" : ""
            }`}
          >
            {features.map((feature, i) => {
              const delay = Math.min(i * 0.05, 0.25);
              return (
                <li
                  key={feature.title}
                  className="hairline-b py-8 md:py-10 md:odd:border-r md:odd:border-[var(--line)] md:odd:pr-10 md:odd:last:border-r-0 md:even:pl-10"
                >
                  <FeatureKind kind={feature.kind} />
                  <RevealText
                    as="h3"
                    variant="mask"
                    delay={delay}
                    className={`font-display text-[clamp(19px,1.8vw,25px)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--ink)] ${
                      feature.kind ? "mt-3" : ""
                    }`}
                  >
                    {feature.title}
                  </RevealText>
                  <RevealText
                    as="p"
                    variant="fade"
                    delay={delay + 0.06}
                    className="mt-3.5 max-w-[540px] text-[clamp(14.5px,1.2vw,17px)] leading-[1.65] text-[var(--ink-muted)]"
                  >
                    {renderBold(feature.body)}
                  </RevealText>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Band>
  );
}
