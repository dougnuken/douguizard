import Link from "next/link";
import { site } from "@/data/site";
import { sections } from "@/data/sections";
import { getCaseStudy } from "@/data/work";
import { currentExperience, getExperience, getWordmarks } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import LinkedInMark from "@/components/icons/LinkedInMark";
import FocusWords from "@/components/FocusWords";

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
const countries = andes?.kpis?.find((k) => k.label === "Countries shipped to")?.value ?? "";
const andesScale = (andes?.team ?? "").replace(", ", " and ");

const SUB = `${current.role} at ${current.company.name}. I set direction across the platform and build the prototypes that define it. Before that, Andes at ${andesEmployer.company.name} — the design system behind ${countries} countries, ${andesScale}.`;

/**
 * The hero.
 *
 * Composition, hierarchy and weight come from the original: an oversized
 * headline whose one bold word carries the claim, the Design/Build/Ship focus
 * device under it, the wordmark sunk into the floor as texture, and content
 * that sits low on the page rather than floating in the middle of it.
 *
 * What is new is what it says next — the role, the scale of the work behind it,
 * and two ways to act on that. The old hero asserted a posture and stopped; this
 * one backs the posture with a sentence a recruiter can check.
 *
 * What did not survive the move is the red and the perpetual motion. The accent
 * appears once, on the brackets that mark the focused word, which is the one
 * job this theme reserves it for.
 */
export default function Hero() {
  return (
    <section
      id={panel.id}
      aria-labelledby="home-title"
      /* The compact rule is keyed to viewport HEIGHT, not width: a 1440x720
         laptop is as wide as a 1440x900 one and has 180px less to work with,
         which is exactly where the employer strip fell off the bottom. */
      className="relative mx-auto flex w-full max-w-[1400px] flex-col justify-center overflow-hidden px-6 py-14 md:px-12 lg:min-h-full lg:shrink-0 lg:justify-end lg:pb-14 lg:pt-10 [@media(max-height:780px)]:lg:pb-7 [@media(max-height:780px)]:lg:pt-6"
    >
      <div className="relative z-[1] flex flex-col gap-7 lg:gap-5 [@media(max-height:780px)]:gap-3">
        {/* One bold word inside a light line is the whole hierarchy: the eye lands
            on "human" before it reads anything, which is the point being made. */}
        <h1
          id="home-title"
          className="max-w-[16ch] text-balance font-display text-[length:var(--step-display-xl)] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--ink)]"
        >
          <RevealText as="span" variant="mask" className="block">
            Designing the
          </RevealText>
          <RevealText as="span" variant="mask" delay={0.07} className="block">
            <strong className="font-extrabold text-[1.12em] leading-[0.8]">human</strong> side
          </RevealText>
          <RevealText as="span" variant="mask" delay={0.14} className="block">
            of an AI era
          </RevealText>
        </h1>

        <RevealText as="div" variant="fade" delay={0.2} className="py-2 lg:py-1">
          <FocusWords
            sentence="Design Build Ship"
            className="justify-start font-display text-[clamp(22px,min(3.2vw,4.6vh),48px)] font-medium tracking-[-0.02em] text-[var(--ink)]"
          />
        </RevealText>

        <RevealText
          as="p"
          variant="fade"
          delay={0.3}
          /* Body size, not lead size. At lead the three lines were tall enough
             to push the employer strip off the bottom of a short laptop, and the
             headline above it already owns the scale. */
          className="max-w-[86ch] text-[length:var(--step-body)] font-normal leading-[1.55] text-[var(--ink-muted)]"
        >
          {SUB}
        </RevealText>

        <RevealText
          as="div"
          variant="fade"
          delay={0.36}
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

        <section aria-labelledby="wordmarks-label" className="hairline-t mt-2 pt-5">
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
