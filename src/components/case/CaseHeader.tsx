"use client";

import Link from "next/link";
import RevealText from "@/components/text/RevealText";
import type { CaseMeta, CaseStudy } from "@/data/work";
import { localePath } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

function Dot({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`text-[var(--ink-dim)] ${className}`}>
      ·
    </span>
  );
}

const fold = (s: string) => s.trim().toLowerCase();

/**
 * The case hero: breadcrumb, client and role, project, tagline.
 *
 * The breadcrumb is **in the flow**, not a second fixed bar. The global header
 * already carries the way back to the site; what a case needs on top of that is
 * its coordinates — which case, in what category, when — and those belong in the
 * document, where they scroll away with the rest of the hero.
 *
 * On a phone the breadcrumb is two clean lines — the way back, then number and
 * year — instead of one row that wrapped wherever it ran out and left a "·"
 * hanging at the end of a line. The category waits for `md`: it is the longest
 * item and the one the first screen needs least, since the tagline under the
 * h1 already says what the product is.
 *
 * The kicker is who the work was for and what Doug was there — "NAOWEE · HEAD
 * OF PRODUCT": a recruiter's first two questions, answered above the title. It
 * is a `<p class="kicker">` rather than the `<h2>` it used to be: an `h2` above
 * the `h1` inverted the outline on every case page, and the line is a label,
 * not a section.
 *
 * No minimum height. The hero used to hold 62% of the viewport open whatever
 * it contained, which pushed the product below the fold on every screen size.
 * It is as tall as its words now, so the showcase under it starts inside the
 * first screen: the reader sees what was made before reading about it.
 */
export default function CaseHeader({ study, meta }: { study: CaseStudy; meta: CaseMeta }) {
  const t = useDict().case;
  const locale = useLocale();

  // Two ways the client could repeat what is already on screen. It IS the
  // project ("Banco de Occidente" over "Banco de Occidente"): drop it. Or the
  // category opens with it ("Personal product × …"): drop it from `md` up,
  // where the breadcrumb prints the category — but not on a phone, where the
  // category is hidden and the kicker is the only place it is said.
  const showClient = fold(meta.client) !== fold(study.project);
  const clientInCategory = fold(study.category).startsWith(fold(meta.client));

  return (
    <section
      className="relative overflow-hidden bg-[var(--paper)] px-6 pb-12 md:px-12 md:pb-16"
      style={{ paddingBlockStart: "calc(var(--header-h) + 32px)" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <nav
          aria-label={t.breadcrumb}
          className="mb-6 flex flex-col items-start font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)] md:mb-10 md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:gap-y-1"
        >
          <Link
            href={localePath(locale, "/#work")}
            className="inline-flex min-h-11 items-center text-[var(--ink)] no-underline underline-offset-4 hover:underline"
          >
            ← {t.allWork}
          </Link>
          <Dot className="hidden md:inline" />
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{study.num}</span>
            <Dot />
            <span className="hidden md:inline">{study.category}</span>
            <Dot className="hidden md:inline" />
            <span>{meta.year}</span>
          </span>
        </nav>

        {/* The client takes the ink and the role keeps the kicker's grey: some
            contract titles carry a "·" of their own (the Mercado Libre and
            Banco de Occidente ones do), and the change of tone is what keeps
            the brand from reading as the first third of a three-part title. */}
        <p className="kicker mb-4 tracking-[0.3em]">
          {showClient && (
            <span className={clientInCategory ? "md:hidden" : undefined}>
              <span className="text-[var(--ink)]">{meta.client}</span>
              <Dot className="mx-[0.5em]" />
            </span>
          )}
          {meta.role.replace(/ · /g, " ·\u00a0")}
        </p>

        <RevealText
          as="h1"
          variant="mask"
          delay={0.05}
          className="mb-6 max-w-[1100px] font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-[var(--ink)] text-[length:var(--step-display)] md:mb-8"
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
