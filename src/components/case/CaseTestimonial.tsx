"use client";

import RevealText from "@/components/text/RevealText";
import { getTestimonial } from "@/data/testimonials";
import { Band, EyebrowHeading } from "./primitives";

/**
 * One endorsement, placed after the decisions and before the screens — so it
 * lands on the argument rather than on the screenshots.
 *
 * Returns `null` when the id resolves to nothing: a stale `testimonialId` left
 * behind in `work.ts` must never be able to break a build or render an empty
 * quotation mark.
 *
 * No avatar, no glyph, no card, no carousel. A rule on the inline-start edge is
 * the whole treatment — which is also why it still reads as a quote when the
 * theme flips.
 */
export default function CaseTestimonial({ id }: { id: string }) {
  const testimonial = getTestimonial(id);
  if (!testimonial) return null;

  const { quote, author, context } = testimonial;

  return (
    <Band tone="raised" rule="y">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
        <EyebrowHeading sticky>In their words</EyebrowHeading>
        <figure className="m-0">
          <blockquote
            className="m-0 max-w-[56ch] border-0 border-l pl-6 font-display leading-[1.45] text-[var(--ink)] text-[length:var(--step-lead)]"
            style={{ borderInlineStartWidth: "1px", borderColor: "var(--line-strong)" }}
          >
            <RevealText as="p" variant="fade">
              {quote}
            </RevealText>
          </blockquote>
          <figcaption className="mt-6 pl-6">
            <span className="block font-medium text-[var(--ink)]">{author.name}</span>
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {author.role} · {author.company}
            </span>
            {context && (
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                {context}
              </span>
            )}
          </figcaption>
        </figure>
      </div>
    </Band>
  );
}
