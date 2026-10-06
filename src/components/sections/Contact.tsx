import { getSections } from "@/data/sections";
import { getSite } from "@/data/site";
import { currentExperience } from "@/lib/career";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import RevealText from "@/components/text/RevealText";
import LinkedInMark from "@/components/icons/LinkedInMark";

export default function Contact({ locale }: { locale: Locale }) {
  const t = getDict(locale).contact;
  const panel = getSections(locale)[4];
  const site = getSite(locale);
  const linkedin = site.social.find((s) => s.primary) ?? site.social[0];
  const elsewhere = site.social.filter((s) => !s.primary);
  const LEAD = t.lead;
  const SIGNAL = t.signal(currentExperience().company.name);
  const home = getSections(locale)[0];
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
          <p className="kicker text-[var(--ink-dim)]">{t.signalLabel}</p>
          <p className="max-w-[38ch] text-[var(--step-small)] leading-[1.6] text-[var(--ink-muted)]">
            {SIGNAL}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="kicker text-[var(--ink-dim)]">{t.direct}</p>
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
          <p className="kicker text-[var(--ink-dim)]">{t.elsewhere}</p>
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
            href={`#${home.id}`}
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
          >
            {t.backToTop} ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
