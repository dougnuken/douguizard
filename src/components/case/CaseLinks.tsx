"use client";

import { Band, FadeIn, SlashLabel } from "./primitives";

/**
 * "Open it" — the case's public destinations, directly under the meta strip so
 * a live product is one click away before the reader commits to the long read.
 *
 * The leading accent dot is gone. Emphasis comes from order and from the
 * hairline under each link, which thickens to 2px in ink on hover — a change of
 * weight, not of colour, so it reads the same to anyone who cannot tell the two
 * colours apart. `text-decoration` rather than a border: it cannot shift the
 * layout by the pixel it grows.
 */
export default function CaseLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <Band rule="b" wide className="py-10 md:py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:items-baseline md:gap-8">
        <FadeIn>
          <SlashLabel>Open it</SlashLabel>
        </FadeIn>
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 md:col-span-3">
          {links.map((link, i) => (
            <FadeIn key={link.href} delay={i * 0.06}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-baseline gap-2.5 font-display text-[clamp(20px,2vw,28px)] leading-none text-[var(--ink)] underline decoration-[var(--line-strong)] decoration-1 underline-offset-[10px] hover:decoration-[var(--ink)] hover:decoration-2"
              >
                {link.label}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                >
                  →
                </span>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </Band>
  );
}
