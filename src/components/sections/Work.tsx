import Link from "next/link";
import type { ComponentType } from "react";
import { caseStudies, getCaseMeta, type CaseStudy } from "@/data/work";
import { sections } from "@/data/sections";
import { site } from "@/data/site";
import { yearsOfExperience } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import VignetteOlbo from "@/components/vignettes/VignetteOlbo";
import VignetteNaowee from "@/components/vignettes/VignetteNaowee";
import VignetteMercadolibre from "@/components/vignettes/VignetteMercadolibre";
import VignetteBanco from "@/components/vignettes/VignetteBanco";
import type { VignetteProps } from "@/components/vignettes/VignetteFrame";

const panel = sections[1];

/** The four cases that carry a live vignette, with the caption under each. */
const VIGNETTES: Record<string, { Component: ComponentType<VignetteProps>; caption: string }> = {
  olbo: {
    Component: VignetteOlbo,
    caption: "Say it out loud; the category is inferred.",
  },
  "naowee-suid": {
    Component: VignetteNaowee,
    caption: "Assign a filing; the queue recounts in place.",
  },
  "mercadolibre-andes": {
    Component: VignetteMercadolibre,
    caption: "One component, its tokens and its variants.",
  },
  "banco-de-occidente": {
    Component: VignetteBanco,
    caption: "Foundations first, then atoms, then organisms.",
  },
};

const NDA_LABEL = "Case study available on request";

const featured = caseStudies.filter((c) => VIGNETTES[c.slug]);
const compact = caseStudies.filter((c) => !VIGNETTES[c.slug] && c.kind !== "side");
/** Their own group: work taken on outside a job, not a shorter version of it. */
const side = caseStudies.filter((c) => c.kind === "side");

function MetaLine({ study }: { study: CaseStudy }) {
  const meta = getCaseMeta(study.slug);
  // Two ways this line can stutter, both suppressed here rather than in the
  // data: a case whose project and client are the same word ("Qrvey · Qrvey"),
  // and a personal one, whose client is the literal "Personal product" and
  // whose category already opens with it.
  const clientIsRedundant =
    study.project === meta.client ||
    (study.kind === "personal" && study.category.toLowerCase().startsWith(meta.client.toLowerCase()));

  const parts = [clientIsRedundant ? null : meta.client, meta.year, study.category].filter(Boolean);
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
      {parts.join(" · ")}
    </span>
  );
}

function ReadAffordance() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)]">
      Read
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        →
      </span>
    </span>
  );
}

function FeaturedRow({ study, index }: { study: CaseStudy; index: number }) {
  const { Component, caption } = VIGNETTES[study.slug];
  return (
    <li className="hairline-b">
      <Link
        href={`/work/${study.slug}`}
        aria-label={`${study.project} — ${study.tagline}`}
        className="group grid items-center gap-6 py-7 no-underline outline-none lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10"
      >
        <div className="flex flex-col gap-2">
          <span className="section-num text-sm">{study.num}</span>
          <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.25rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[6px] group-focus-visible:underline">
            {study.project}
          </h3>
          <MetaLine study={study} />
          <p className="max-w-[52ch] text-[var(--step-small)] leading-[1.5] text-[var(--ink-muted)]">
            {study.tagline}
          </p>
          {study.nda && (
            <span className="mt-1 inline-flex w-fit rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
              {NDA_LABEL}
            </span>
          )}
          <span className="mt-2">
            <ReadAffordance />
          </span>
        </div>

        <RevealText
          as="div"
          variant="fade"
          delay={Math.min(index * 0.06, 0.25)}
          className="w-full max-w-[420px] transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 lg:max-w-none"
        >
          <Component />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
            {caption}
          </p>
        </RevealText>
      </Link>
    </li>
  );
}

function CompactRow({ study }: { study: CaseStudy }) {
  return (
    <li className="hairline-b">
      <Link
        href={`/work/${study.slug}`}
        aria-label={`${study.project} — ${study.tagline}`}
        className="group flex flex-wrap items-baseline gap-x-5 gap-y-1.5 py-[18px] no-underline outline-none"
      >
        <span className="section-num text-sm">{study.num}</span>
        <h3 className="font-display text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--ink)] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[6px] group-focus-visible:underline">
          {study.project}
        </h3>
        <MetaLine study={study} />
        <span className="ml-auto">
          <ReadAffordance />
        </span>
      </Link>
    </li>
  );
}

export default function Work() {
  return (
    <section
      id={panel.id}
      aria-labelledby="work-title"
      className="mx-auto flex w-full max-w-[1400px] shrink-0 flex-col gap-10 px-6 py-16 md:px-12 lg:py-20"
    >
      <header className="flex flex-col gap-4">
        <p className="kicker">
          {panel.num} — {panel.title}
        </p>
        <h2
          id="work-title"
          className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]"
        >
          {panel.title}
        </h2>
        <p className="max-w-[62ch] text-[length:var(--step-body)] leading-[1.6] text-[var(--ink-muted)]">
          <span className="text-[var(--ink)]">
            {yearsOfExperience()} years of systems, products and teams —
          </span>{" "}
          from LATAM&apos;s largest marketplace to national banks, cruise lines and
          early-stage startups, plus one product I designed, built and shipped on my
          own. Seven that shaped how I work, and two I took on for the pleasure of
          it.
        </p>
      </header>

      <ul className="hairline-t flex flex-col">
        {featured.map((study, i) => (
          <FeaturedRow key={study.slug} study={study} index={i} />
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        <p className="kicker">Earlier work</p>
        <ul className="hairline-t flex flex-col">
          {compact.map((study) => (
            <CompactRow key={study.slug} study={study} />
          ))}
        </ul>
      </div>

      {side.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="kicker">Freelance side projects</p>
          <ul className="hairline-t flex flex-col">
            {side.map((study) => (
              <CompactRow key={study.slug} study={study} />
            ))}
          </ul>
        </div>
      )}

      <Link
        href={site.cv.path}
        className="w-fit font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] underline-offset-4 hover:underline"
      >
        Full CV →
      </Link>
    </section>
  );
}
