"use client";

import type { ReactNode } from "react";
import { getSite } from "@/data/site";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import Boton from "@/components/sistema/Boton";
import { FadeIn } from "./primitives";

/**
 * What stands in for the showcase when the screens belong to the client.
 *
 * Stated plainly, once, with a way to continue the conversation. No padlock
 * glyph, no "confidential" stamp, no apology: a designer who respects an NDA is
 * demonstrating something, not confessing to a gap.
 *
 * It sits where the product would — straight under the hero — so the reader
 * learns why there are no screens before looking for them, and the way to ask
 * for the walkthrough is in the first screen instead of at the foot. When the
 * case has a home-page vignette it leads with that: a drawing of the system's
 * idea, not a screenshot of the client's product, so nothing is shown that the
 * NDA covers and the page still opens on something to look at.
 */
export default function CaseNda({
  body,
  visual,
  visualCaption,
}: {
  body: string;
  /** An illustration of the work that is not the work itself — a vignette. */
  visual?: ReactNode;
  visualCaption?: string;
}) {
  const t = useDict().case;
  const site = getSite(useLocale());
  const linkedin = site.social.find((s) => s.primary) ?? site.social[0];

  const notice = (
    <>
      <h2 className="t-titular">{t.nda}</h2>

      <FadeIn>
        <p className="mt-6 max-w-[34em] text-[18px] leading-[1.55] text-[var(--blanco)] md:mt-8">
          {body}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
          <Boton variante="blanco" href={linkedin.href} target="_blank" rel="noopener noreferrer">
            {t.askOn(linkedin.label)}
          </Boton>
          <Boton variante="linea" href={`mailto:${site.email}`}>
            {t.email}
          </Boton>
        </div>
      </FadeIn>
    </>
  );

  if (!visual) {
    return (
      <section className="losa losa--azul losa--r-m caso-nda" data-superficie="azul">
        {notice}
      </section>
    );
  }

  return (
    <section className="losa losa--azul losa--r-m caso-nda" data-superficie="azul">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <FadeIn>
          <figure className="m-0 w-full max-w-[640px]">
            {/* The vignette is drawn for a 380px slot on the home page, in 9px
                type. Scaling it with `zoom` keeps every proportion of that
                drawing — type, marks, padding — instead of reflowing it into
                a wider, emptier box. Desktop only: on a phone the column is
                already the size it was drawn at. */}
            <div className="lg:[zoom:1.6]">{visual}</div>
            {visualCaption && (
              <figcaption className="mt-3 font-mono text-[12px] text-[var(--blanco)]">
                {visualCaption}
              </figcaption>
            )}
          </figure>
        </FadeIn>
        <div>{notice}</div>
      </div>
    </section>
  );
}
