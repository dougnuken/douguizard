import Link from "next/link";
import { site } from "@/data/site";
import { sections } from "@/data/sections";
import { getCaseStudy } from "@/data/work";
import { currentExperience, getExperience, getWordmarks } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import LinkedInMark from "@/components/icons/LinkedInMark";
import FocusWords from "@/components/FocusWords";
import HeroField from "@/components/hero/HeroField";

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
         which is exactly where the employer strip fell off the bottom.

         The phone hero is one screen tall, so the wordmark rail lands ON the
         fold instead of floating 166px above it with the next panel's padding
         stacked underneath. Four things about how that is written:

         `min-h`, never `h`. This element carries `overflow-hidden`, and a
         landscape phone holds 458px of content in a 334px box — a definite
         height would clip the top of the headline with nothing to scroll to.
         A floor self-neutralises: when the content is taller, free space goes
         to zero and the distribution below simply has nothing to hand out.

         `svh`, never `vh`/`lvh`/`dvh`. svh is measured with the browser
         toolbar EXPANDED, so the bottom edge clears it on first paint and
         never moves again. `vh` and `lvh` are the same as each other on iOS
         and Android and both put the rail behind the toolbar at load; `dvh`
         makes it chase the toolbar as that animates.

         The header is subtracted once — it is `position: fixed`, so the only
         thing reserving room for it is the panel's own `pt-14`, which is
         outside this box. As `var(--header-h)`, not `3.5rem`: the token is
         56px here and 64px from 1024, mirroring `pt-14 lg:pt-16` exactly,
         whereas a rem tracks the reader's font size and a px header does not.

         And it stops at `md`. A tablet has ~293px of slack and nothing to
         put in it — `.hero-field` is `hidden lg:block` — so pinning there
         buys a band of bare paper rather than a composition. */
      className="relative mx-auto flex min-h-[calc(100svh_-_var(--header-h))] w-full max-w-[1400px] flex-col justify-center overflow-hidden px-6 pb-[calc(3.5rem_+_env(safe-area-inset-bottom))] pt-14 md:min-h-0 md:px-12 md:pb-14 lg:min-h-full lg:shrink-0 lg:justify-end lg:pb-14 lg:pt-10 [@media(max-height:780px)]:lg:pb-7 [@media(max-height:780px)]:lg:pt-6"
    >
      {/*
        The one image on the home page, and it is computed rather than drawn:
        three octaves of simplex noise churning through the site's violet. It
        sits in the right band, where the copy does not go, behind everything,
        and is masked to nothing at its edges so it reads as light on the page
        rather than as a rectangle of video.

        Desktop only. A phone has no room beside the headline and no business
        paying for a full-frame fragment shader; below `lg` it is not mounted,
        so no context is created at all. `prefers-reduced-motion` is honoured
        inside the component — it draws one frame and stops.
      */}
      <div
        aria-hidden
        className="hero-field pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[46%] lg:block"
      >
        <HeroField />
      </div>

      {/* `52%` from `lg`, because the right 46% now has a picture in it. The
          sub-paragraph is set at 86ch and was running its last third over the
          shadow, where dark type on a dark disc is not type. The cap is a
          percentage, not a character count: at 1024 a 640px column would still
          have crossed the line.

          `grow` + `justify-between` is how the leftover height gets spent, and
          that choice is the whole change. Sending it all to one `mt-auto` seam
          pins the rail just as well, but it opens a single 150–200px void in
          the middle of the column — and on a phone there is nothing behind
          that void, because the shader layer above is desktop-only, so it
          reads as a missing element rather than as air. Split across all four
          seams instead, the column breathes as a unit: the headline keeps its
          full `pt-14` above it, every line gains room, and the rail still
          lands on the floor. Where there is no slack — every phone at or under
          414, and landscape — free space is zero and this degrades to exactly
          today's stack. */}
      <div className="relative z-[1] flex grow flex-col justify-between gap-7 md:grow-0 md:justify-normal lg:max-w-[52%] lg:gap-5 [@media(max-height:780px)]:gap-3">
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
