"use client";

import { Band, FadeIn, SlashLabel, type BandProps } from "./primitives";
import CaseLinks from "./CaseLinks";
import type { CaseMeta as CaseMetaType } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * Role · Duration · Team · Year — and, when the case has any, where to open it.
 *
 * The case at a glance, directly under the showcase: once the reader has seen
 * the product, the next question is who made it, in what role, and when.
 *
 * Every cell comes off `getCaseMeta(slug)`, which derives it from the employer
 * in `cv.ts`. The case page reads none of these fields off the study any more,
 * so a role or a period can only ever be wrong in one place.
 */
export default function CaseMeta({
  meta,
  links,
  tone,
  wide = true,
}: {
  meta: CaseMetaType;
  links?: { label: string; href: string }[];
  tone?: BandProps["tone"];
  wide?: boolean;
}) {
  const t = useDict().case.meta;
  // A duration that only repeats the year ("Duration 2018" beside "Year 2018")
  // says nothing the year does not, so the cell goes rather than stutter. The
  // grid keeps its four tracks, so the cells that remain stay on the columns
  // the walkthrough caption above them is aligned to.
  const cells = [
    { label: t.role, value: meta.role.replace(/ · /g, " ·\u00a0") },
    meta.duration.trim() !== meta.year.trim() && { label: t.duration, value: meta.duration },
    { label: t.team, value: meta.team },
    { label: t.year, value: meta.year },
  ].filter((cell) => cell !== false);

  return (
    <Band tone={tone} rule="t" wide={wide} className="py-10 md:py-12">
      <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {cells.map((cell, i) => (
          <FadeIn key={cell.label} delay={i * 0.06}>
            <dt>
              <SlashLabel className="mb-2">{cell.label}</SlashLabel>
            </dt>
            <dd className="text-[15px] leading-[1.4] text-[var(--ink)]">{cell.value}</dd>
          </FadeIn>
        ))}
      </dl>

      {links && links.length > 0 && <CaseLinks links={links} />}
    </Band>
  );
}
