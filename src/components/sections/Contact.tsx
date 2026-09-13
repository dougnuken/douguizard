import { sections } from "@/data/sections";
import { site } from "@/data/site";
import { currentExperience } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import LinkedInMark from "@/components/icons/LinkedInMark";

const panel = sections[4];
const linkedin = site.social.find((s) => s.primary) ?? site.social[0];
const elsewhere = site.social.filter((s) => !s.primary);

const current = currentExperience();

const LEAD = "The fastest way to reach me is LinkedIn. Email works too.";

const SIGNAL = `I lead product at ${current.company.name} and take on selected consulting alongside it. Most interested in design systems at scale and AI-native product work.`;

export default function Contact() {
  return (
    <section
      id={panel.id}
      aria-labelledby="contact-title"
      className="mx-auto flex w-full max-w-[1400px] shrink-0 flex-col gap-10 px-6 py-16 md:px-12 lg:min-h-full lg:justify-center lg:py-20"
    >
      <header className="flex flex-col gap-4">
        <p className="kicker">
          {panel.num} — {panel.label}
        </p>
        <h2
          id="contact-title"
          className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]"
        >
          {panel.title}
        </h2>
        <RevealText
          as="p"
          variant="fade"
          className="max-w-[44ch] text-[length:var(--step-lead)] leading-[1.45] tracking-[-0.01em] text-[var(--ink-muted)]"
        >
          {LEAD}
        </RevealText>
      </header>

      <ul className="hairline-t flex flex-col">
        <li className="hairline-b py-5">
          <a
            href={linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill--solid w-fit"
          >
            <LinkedInMark />
            {linkedin.label}
          </a>
        </li>
        <li className="hairline-b py-5">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center text-[length:var(--step-lead)] tracking-[-0.01em] text-[var(--ink)] no-underline underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
        </li>
        {elsewhere.map((s) => (
          <li key={s.label} className="hairline-b">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
            >
              {s.label}
              <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="kicker text-[var(--ink-dim)]">/ The signal</p>
          <p className="max-w-[38ch] text-[var(--step-small)] leading-[1.6] text-[var(--ink-muted)]">
            {SIGNAL}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="kicker text-[var(--ink-dim)]">/ Direct</p>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 w-fit items-center text-[var(--step-small)] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
          >
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex min-h-11 w-fit items-center text-[var(--step-small)] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
          >
            {site.phone}
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <p className="kicker text-[var(--ink-dim)]">/ Elsewhere</p>
          <ul className="flex flex-col gap-1">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--step-small)] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="hairline-t flex flex-wrap items-center justify-between gap-3 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex items-center gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
            {site.location.city} · {site.location.timezone}
          </p>
          <a
            href={`#${sections[0].id}`}
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
