"use client";

import Link from "next/link";
import RevealText from "@/components/text/RevealText";
import type { CaseMeta, CaseStudy } from "@/data/work";

function Dot() {
  return (
    <span aria-hidden className="text-[var(--ink-dim)]">
      ·
    </span>
  );
}

/**
 * The case hero: breadcrumb, client, project, tagline.
 *
 * The breadcrumb is **in the flow**, not a second fixed bar. The global header
 * already carries the way back to the site; what a case needs on top of that is
 * its coordinates — which case, in what category, when — and those belong in the
 * document, where they scroll away with the rest of the hero.
 *
 * The client line is a `<p class="kicker">` rather than the `<h2>` it used to
 * be. An `h2` above the `h1` inverted the outline on every case page; the line
 * is a label, not a section, so demoting it fixes the outline without changing
 * a pixel of what the reader sees.
 */
export default function CaseHeader({ study, meta }: { study: CaseStudy; meta: CaseMeta }) {
  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden bg-[var(--paper)] px-6 pb-20 md:px-12"
      style={{ minBlockSize: "62svh", paddingBlockStart: "calc(var(--header-h) + 48px)" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <nav
          aria-label="Breadcrumb"
          className="mb-12 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]"
        >
          <Link
            href="/#work"
            className="text-[var(--ink)] no-underline underline-offset-4 hover:underline"
          >
            ← All work
          </Link>
          <Dot />
          <span>{study.num}</span>
          <Dot />
          <span>{study.category}</span>
          <Dot />
          <span>{meta.year}</span>
        </nav>

        <p className="kicker mb-6 tracking-[0.3em]">{meta.client}</p>

        <RevealText
          as="h1"
          variant="mask"
          delay={0.05}
          className="mb-12 max-w-[1100px] font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-[var(--ink)] text-[length:var(--step-display)]"
        >
          {study.project}
        </RevealText>

        <RevealText
          as="p"
          variant="fade"
          delay={0.2}
          className="max-w-[46ch] font-display leading-[1.4] tracking-tight text-[var(--ink)] text-[length:var(--step-lead)]"
        >
          {study.tagline}
        </RevealText>
      </div>
    </section>
  );
}
