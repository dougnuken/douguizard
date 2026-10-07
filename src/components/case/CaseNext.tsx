"use client";

import Link from "next/link";
import { getCaseMeta, type CaseStudy } from "@/data/work";
import { localePath } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { Band, FadeIn, SlashLabel, type BandProps } from "./primitives";

/**
 * The way onward.
 *
 * Hover changes weight and underline, never hue: in a two-colour system a
 * colour shift has nowhere to go, and the type is large enough that a change of
 * weight reads from across the room.
 */
export default function CaseNext({ next, tone }: { next: CaseStudy; tone?: BandProps["tone"] }) {
  const t = useDict().case;
  const locale = useLocale();
  return (
    <Band tone={tone} rule="t">
      <FadeIn>
        <SlashLabel className="mb-8 text-[11px] text-[var(--ink-muted)]">{t.next}</SlashLabel>
      </FadeIn>

      <Link href={localePath(locale, `/work/${next.slug}`)} className="group block text-inherit no-underline">
        <FadeIn>
          <div
            className="mb-6 font-mono text-sm uppercase tracking-[0.3em] text-[var(--ink-muted)] transition-transform duration-500 group-hover:translate-x-2"
            style={{ transitionTimingFunction: "var(--ease-out)" }}
          >
            {getCaseMeta(next.slug, locale).client}
          </div>

          <h2
            className="mb-8 font-display text-[clamp(56px,11vw,160px)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--ink)] transition-[font-weight] duration-300 group-hover:font-extrabold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[12px]"
          >
            {next.project}
            <span
              className="inline-block transition-transform duration-500 group-hover:translate-x-4"
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            >
              {" "}
              →
            </span>
          </h2>

          <p className="max-w-[720px] text-lg leading-[1.5] text-[var(--ink-muted)]">
            {next.tagline}
          </p>
        </FadeIn>
      </Link>
    </Band>
  );
}
