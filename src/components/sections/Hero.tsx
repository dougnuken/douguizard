import Link from "next/link";
import { site } from "@/data/site";
import { sections } from "@/data/sections";
import { getCaseStudy } from "@/data/work";
import { currentExperience, getExperience, getWordmarks } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import LinkedInMark from "@/components/icons/LinkedInMark";

const panel = sections[0];
const linkedin = site.social.find((s) => s.primary) ?? site.social[0];
const current = currentExperience();

/**
 * The sub-paragraph is composed, never typed: the first sentence comes from
 * the current role, the last from the Andes case's own figures, so no number
 * on this page can drift from the data behind it.
 */
const andes = getCaseStudy("mercadolibre-andes");
const andesEmployer = getExperience("mercadolibre");
const countries = andes?.kpis.find((k) => k.label === "Countries shipped to")?.value ?? "";
const andesScale = (andes?.team ?? "").replace(", ", " and ");

const SUB = `${current.role} at ${current.company.name}. I set direction across the platform and build the prototypes that define it. Before that, Andes at ${andesEmployer.company.name} — the design system behind ${countries} countries, ${andesScale}.`;

export default function Hero() {
  return (
    <section
      id={panel.id}
      aria-labelledby="home-title"
      className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-7 overflow-hidden px-6 py-16 md:px-12 lg:min-h-full lg:shrink-0 lg:justify-center lg:py-20"
    >
      <span aria-hidden className="glow-corner" />

      <div className="relative z-[1] flex flex-col gap-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="kicker">Product × Systems × Code</p>
          <span aria-hidden className="hidden h-3 w-px bg-[var(--line-strong)] sm:block" />
          <p className="kicker text-[var(--ink-dim)]">{site.availability.label}</p>
        </div>

        <h1
          id="home-title"
          className="max-w-[22ch] font-display text-[length:var(--step-display)] font-extrabold leading-[0.92] tracking-[-0.035em] text-[var(--ink)]"
        >
          <RevealText as="span" variant="mask" className="block">
            I direct the product,
          </RevealText>
          <RevealText as="span" variant="mask" delay={0.08} className="block">
            then I build it.
          </RevealText>
        </h1>

        <RevealText as="p" variant="fade" delay={0.12} className="kicker">
          {site.name} — {site.headline}
        </RevealText>

        <RevealText
          as="p"
          variant="fade"
          delay={0.18}
          className="max-w-[58ch] text-[length:var(--step-lead)] font-normal leading-[1.45] tracking-[-0.01em] text-[var(--ink-muted)]"
        >
          {SUB}
        </RevealText>

        <RevealText
          as="div"
          variant="fade"
          delay={0.24}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href={linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill--solid btn-pill--signal justify-center"
          >
            <LinkedInMark />
            LinkedIn
          </a>
          <Link href={`#${sections[1].id}`} className="btn-pill justify-center">
            See work
            <span aria-hidden>→</span>
          </Link>
        </RevealText>

        <section aria-labelledby="wordmarks-label" className="hairline-t mt-4 pt-6">
          <h2 id="wordmarks-label" className="sr-only">
            Where I&apos;ve worked
          </h2>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {getWordmarks().map((w) => (
              <li
                key={w}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-dim)]"
              >
                {w}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
