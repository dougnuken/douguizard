"use client";

import { Band, FadeIn, SlashLabel } from "./primitives";
import type { CaseMeta as CaseMetaType } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * Role · Duration · Team · Year.
 *
 * Every cell comes off `getCaseMeta(slug)`, which derives it from the employer
 * in `cv.ts`. The case page reads none of these fields off the study any more,
 * so a role or a period can only ever be wrong in one place.
 */
export default function CaseMeta({ meta }: { meta: CaseMetaType }) {
  const t = useDict().case.meta;
  const cells = [
    { label: t.role, value: meta.role },
    { label: t.duration, value: meta.duration },
    { label: t.team, value: meta.team },
    { label: t.year, value: meta.year },
  ];

  return (
    <Band rule="y" wide className="py-12 md:py-12">
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
    </Band>
  );
}
