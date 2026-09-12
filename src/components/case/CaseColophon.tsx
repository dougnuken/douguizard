"use client";

import { Band, FadeIn, SlashLabel, renderBold } from "./primitives";

export interface CaseColophonProps {
  technologies?: string[];
  externalLink?: { label: string; href: string };
  credits?: string;
}

/**
 * Tools, the live link, and who did what — plus the page's `contentinfo`.
 *
 * The old template closed with a separate footer that repeated a "back to all
 * work" link the global header already carries. That footer is gone; the
 * copyright line it existed for lives here, at the foot of the colophon, which
 * is where a colophon line belongs anyway.
 */
export default function CaseColophon({
  technologies,
  externalLink,
  credits,
}: CaseColophonProps) {
  return (
    <Band tone="paper" rule="t" className="py-20 md:py-24">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {technologies && technologies.length > 0 && (
          <FadeIn>
            <SlashLabel className="mb-4">Tools &amp; methods</SlashLabel>
            <ul className="flex list-none flex-wrap gap-2">
              {technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--line)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        {externalLink && (
          <FadeIn delay={0.1}>
            <SlashLabel className="mb-4">Live link</SlashLabel>
            <a
              href={externalLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-b border-[var(--line-strong)] font-display text-2xl text-[var(--ink)] no-underline transition-colors duration-300 hover:border-[var(--ink)]"
            >
              {externalLink.label} →
            </a>
          </FadeIn>
        )}
      </div>

      {credits && (
        <div className="mt-14 border-t border-[var(--line)] pt-10">
          <FadeIn>
            <SlashLabel className="mb-4">Authorship</SlashLabel>
            <p className="max-w-[760px] text-[15px] leading-[1.65] text-[var(--ink-muted)]">
              {renderBold(credits)}
            </p>
          </FadeIn>
        </div>
      )}

      <footer className="mt-14 border-t border-[var(--line)] pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-dim)]">
          © {new Date().getFullYear()} Doug Vargas
        </p>
      </footer>
    </Band>
  );
}
