"use client";

import RevealText from "@/components/text/RevealText";
import { Band, EyebrowHeading, renderBold, type BandProps } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

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
  const labels = useDict().case.featureKind;
  if (!kind) return null;
  const isAi = kind === "ai";
  return (
    <div
      className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--ink-dim)]"
      style={{ letterSpacing: isAi ? "0.3em" : "0.25em" }}
    >
      <span aria-hidden className="inline-block h-px w-2.5 shrink-0 bg-[var(--ink-dim)]" />
      {isAi ? labels.ai : labels.product}
    </div>
  );
}

/**
 * Columns by feature count, so the last row is never one card alone. Static
 * strings — Tailwind scans source text.
 *
 * Four is two pairs at every width, not a row of three with an orphan under
 * it. Three is one row on a desktop and a stack below it, since a tablet's two
 * columns would strand the third. Counts that split cleanly into neither (five,
 * seven) take three across, where the short row at least holds two.
 */
function columnsFor(count: number): string {
  if (count <= 1) return "";
  if (count === 3) return "lg:grid-cols-3";
  if (count % 2 === 0 && count % 3 !== 0) return "md:grid-cols-2";
  return "md:grid-cols-2 lg:grid-cols-3";
}

/**
 * What the product can do, as a grid of cards a reader can skim by title.
 *
 * Up to three across on a desktop, two on a tablet, one on a phone — with the
 * eyebrow on top rather than in a sticky gutter, because a grid needs the
 * whole measure. Titles carry the weight; bodies drop to the caption step, so
 * a reader who only reads titles still gets the list.
 */
export default function CaseFeatures({
  intro,
  features,
  tone,
}: {
  intro?: string;
  features: Feature[];
  tone?: BandProps["tone"];
}) {
  const t = useDict().case;
  return (
    <Band tone={tone} rule="t">
      <EyebrowHeading>{t.features}</EyebrowHeading>

      {intro && (
        <RevealText
          as="p"
          variant="fade"
          className="mt-6 max-w-[62ch] font-display text-[clamp(18px,1.6vw,22px)] leading-[1.45] tracking-[-0.01em] text-[var(--ink)] md:mt-8"
        >
          {intro}
        </RevealText>
      )}

      <ul
        className={`mt-10 grid list-none grid-cols-1 gap-x-10 gap-y-8 p-0 md:mt-12 md:gap-y-10 ${columnsFor(features.length)}`}
      >
        {features.map((feature, i) => {
          const delay = Math.min(i * 0.05, 0.25);
          return (
            <li key={feature.title} className="hairline-t pt-5 md:pt-6">
              <FeatureKind kind={feature.kind} />
              <RevealText
                as="h3"
                variant="mask"
                delay={delay}
                className={`font-display text-[clamp(18px,1.5vw,21px)] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--ink)] ${
                  feature.kind ? "mt-3" : ""
                }`}
              >
                {feature.title}
              </RevealText>
              <RevealText
                as="p"
                variant="fade"
                delay={delay + 0.06}
                className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-muted)]"
              >
                {renderBold(feature.body)}
              </RevealText>
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
