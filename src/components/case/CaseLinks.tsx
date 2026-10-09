"use client";

import { FadeIn, SlashLabel } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * "Open it" — the case's public destinations, as the last row of the meta
 * strip, so a live product is one click away right under the showcase. It is a
 * row inside that band rather than a band of its own: a second full-width strip
 * of padding for two links cost a quarter of a screen.
 *
 * The leading accent dot is gone. Emphasis comes from order and from the
 * hairline under each link, which thickens to 2px in ink on hover — a change of
 * weight, not of colour, so it reads the same to anyone who cannot tell the two
 * colours apart. `text-decoration` rather than a border: it cannot shift the
 * layout by the pixel it grows.
 */
export default function CaseLinks({ links }: { links: { label: string; href: string }[] }) {
  const t = useDict().case;
  return (
    <div className="hairline-t mt-8 grid grid-cols-1 gap-4 pt-6 md:mt-10 md:grid-cols-4 md:items-baseline md:gap-8 md:pt-8">
      <FadeIn>
        <SlashLabel>{t.openIt}</SlashLabel>
      </FadeIn>
      <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 md:col-span-3">
        {links.map((link, i) => (
          <FadeIn key={link.href} delay={i * 0.06}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block min-h-11 font-display text-[clamp(20px,2vw,28px)] leading-[1.6] text-[var(--ink)] underline decoration-[var(--line-strong)] decoration-1 underline-offset-[10px] hover:decoration-[var(--ink)] hover:decoration-2"
            >
              {link.label.slice(0, link.label.lastIndexOf(" ") + 1)}
              <span className="whitespace-nowrap">
                {link.label.slice(link.label.lastIndexOf(" ") + 1)}
                <span
                  aria-hidden
                  className="ml-2.5 inline-block transition-transform duration-500 group-hover:translate-x-1"
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                >
                  →
                </span>
              </span>
            </a>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
