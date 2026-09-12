"use client";

import { Band, FadeIn, SlashLabel } from "./primitives";
import type { CaseMeta as CaseMetaType } from "@/data/work";

/**
 * Role · Duration · Team · Year.
 *
 * Every cell comes off `getCaseMeta(slug)`, which derives it from the employer
 * in `cv.ts`. The case page reads none of these fields off the study any more,
 * so a role or a period can only ever be wrong in one place.
 */
export default function CaseMeta({ meta }: { meta: CaseMetaType }) {
  const cells = [
    { label: "Role", value: meta.role },
    { label: "Duration", value: meta.duration },
    { label: "Team", value: meta.team },
    { label: "Year", value: meta.year },
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
