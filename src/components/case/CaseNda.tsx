"use client";

import { getSite } from "@/data/site";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { Band, EyebrowHeading, FadeIn } from "./primitives";

/**
 * What stands in for the gallery when the screens belong to the client.
 *
 * Stated plainly, once, with a way to continue the conversation. No padlock
 * glyph, no "confidential" stamp, no apology: a designer who respects an NDA is
 * demonstrating something, not confessing to a gap.
 */
export default function CaseNda({ body }: { body: string }) {
  const t = useDict().case;
  const site = getSite(useLocale());
  const linkedin = site.social.find((s) => s.primary) ?? site.social[0];

  return (
    <Band tone="raised" rule="y">
      <EyebrowHeading>{t.nda}</EyebrowHeading>

      <FadeIn>
        <p className="mt-10 max-w-[56ch] text-[19px] leading-[1.55] text-[var(--ink)] md:text-[22px]">
          {body}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            className="btn-pill btn-pill--solid"
            href={linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.askOn(linkedin.label)}
          </a>
          <a className="btn-pill" href={`mailto:${site.email}`}>
            {t.email}
          </a>
        </div>
      </FadeIn>
    </Band>
  );
}
