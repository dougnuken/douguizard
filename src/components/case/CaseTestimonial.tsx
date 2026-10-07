"use client";

import RevealText from "@/components/text/RevealText";
import { getTestimonial } from "@/data/testimonials";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { Band, EyebrowHeading, type BandProps } from "./primitives";

/**
 * One endorsement, placed straight after "what I did" — so it lands on the
 * claim it vouches for, and inside the part of the page a reader skimming for
 * a minute actually reaches. At the foot of a long case it was social proof
 * that only the most patient reader ever saw.
 *
 * Returns `null` when the id resolves to nothing: a stale `testimonialId` left
 * behind in `work.ts` must never be able to break a build or render an empty
 * quotation mark.
 *
 * No avatar, no glyph, no card, no carousel. A rule on the inline-start edge is
 * the whole treatment — which is also why it still reads as a quote when the
 * theme flips.
 */
export default function CaseTestimonial({ id, tone }: { id: string; tone?: BandProps["tone"] }) {
  const locale = useLocale();
  const t = useDict().case;
  const testimonial = getTestimonial(id, locale);
  if (!testimonial) return null;

  const { quote, quoteLang, author, context } = testimonial;
  // The quote is printed as it was given, never translated: on a page in
  // another language it carries its own `lang` and a line saying so.
  const foreign = quoteLang !== locale;

  return (
    <Band tone={tone} rule="t">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
        <EyebrowHeading sticky>{t.inTheirWords}</EyebrowHeading>
        <figure className="m-0">
          <blockquote
            lang={foreign ? quoteLang : undefined}
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
            {foreign && t.quoteOriginal && (
              <span className="mt-3 block text-[13px] italic text-[var(--ink-dim)]">{t.quoteOriginal}</span>
            )}
          </figcaption>
        </figure>
      </div>
    </Band>
  );
}
