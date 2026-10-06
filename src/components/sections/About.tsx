import Image from "next/image";
import Link from "next/link";
import { getSections } from "@/data/sections";
import { getSite } from "@/data/site";
import { getCv } from "@/data/cv";
import { currentExperience, formatPeriod } from "@/lib/career";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import RevealText from "@/components/text/RevealText";

const BIO: Record<Locale, [string, string]> = {
  en: [
    "What has kept me here is not any single screen. It is the systems underneath: the tokens, the governance, the shared language that lets hundreds of designers and thousands of engineers ship as one product.",
    "The line between designing and building stopped being useful to me. I prototype in code, ship real interfaces, and let the system and the model carry the repetitive weight. olbo and DC Medical are the clearest proof: a finance app and a clinic's operating panel I designed, engineered and shipped on my own, both in daily use.",
  ],
  es: [
    "Lo que me ha mantenido aquí no es ninguna pantalla en particular. Son los sistemas de abajo: los tokens, el gobierno, el lenguaje compartido que permite que cientos de diseñadores y miles de ingenieros entreguen como un solo producto.",
    "La línea entre diseñar y construir dejó de servirme. Prototipo en código, entrego interfaces reales y dejo que el sistema y el modelo carguen el peso repetitivo. olbo y DC Medical son la prueba más clara: una app de finanzas y el panel de operación de una clínica que diseñé, implementé y lancé por mi cuenta, los dos en uso diario.",
  ],
};

export default function About({ locale }: { locale: Locale }) {
  const t = getDict(locale).about;
  const panel = getSections(locale)[3];
  const site = getSite(locale);
  const { education, experiences, languages } = getCv(locale);
  const current = currentExperience();
  const [BIO_2, BIO_3] = BIO[locale];
  const earlierStart = experiences.findIndex((e) => e.era === "earlier");

  /**
   * Every value is derived from `site` / `cv` — only `Focus` is a literal, which
   * is what the copy deck designates. No fact on this panel is typed twice.
   */
  const FACT_ROWS: { label: string; value: string }[] = [
    {
      label: t.facts.based,
      value: `${site.location.city}, ${site.location.country} · ${site.location.timezone}`,
    },
    { label: t.facts.currently, value: `${current.role} · ${current.company.name}` },
    { label: t.facts.focus, value: t.facts.focusValue },
    { label: t.facts.openTo, value: site.availability.note ?? "" },
    {
      label: t.facts.languages,
      value: languages
        .map((l) => `${l.name} (${l.cefr === "Native" ? t.facts.native : l.cefr})`)
        .join(" · "),
    },
  ];

  return (
    <section
      id={panel.id}
      aria-labelledby="about-title"
      className="mx-auto grid w-full max-w-[1400px] shrink-0 gap-10 px-6 py-16 md:px-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16 lg:py-20"
    >
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <p className="kicker">
            {panel.num} — {panel.title}
          </p>
          <h2
            id="about-title"
            className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]"
          >
            {panel.title}
          </h2>
        </header>

        <div className="flex max-w-[62ch] flex-col gap-4">
          <RevealText
            as="p"
            variant="fade"
            className="text-[length:var(--step-lead)] leading-[1.45] tracking-[-0.01em] text-[var(--ink)]"
          >
            {site.summary}
          </RevealText>
          <RevealText
            as="p"
            variant="fade"
            delay={0.06}
            className="text-[length:var(--step-body)] leading-[1.6] text-[var(--ink-muted)]"
          >
            {BIO_2}
          </RevealText>
          <RevealText
            as="p"
            variant="fade"
            delay={0.12}
            className="text-[length:var(--step-body)] leading-[1.6] text-[var(--ink-muted)]"
          >
            {BIO_3}
          </RevealText>
        </div>

        <div className="flex flex-col gap-4">
          <p className="kicker">{t.experience}</p>
          <ul className="hairline-t flex flex-col">
            {experiences.map((e, i) => (
              <li key={e.id}>
                {i === earlierStart && (
                  <p className="hairline-b py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-dim)]">
                    {t.earlier}
                  </p>
                )}
                <div className="hairline-b grid items-baseline gap-x-6 gap-y-1 py-3 md:grid-cols-[170px_170px_minmax(0,1fr)_auto]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]">
                    {e.company.name}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {formatPeriod(e, locale)}
                  </span>
                  <span className="text-[var(--step-small)] leading-[1.5] text-[var(--ink-muted)]">
                    {e.roleShort ?? e.role}
                  </span>
                  {e.caseSlug ? (
                    <Link
                      href={localePath(locale, `/work/${e.caseSlug}`)}
                      className="flex min-h-11 items-center justify-start font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)] underline-offset-4 hover:underline md:justify-end"
                    >
                      {t.seeCase} →
                    </Link>
                  ) : (
                    <span aria-hidden />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline-t flex flex-col gap-2 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            {t.education} —{" "}
            <span className="text-[var(--ink)]">
              {education[0].program}, {education[0].institution} (
              {education[0].start.year} — {education[0].end?.year})
            </span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            {t.languages} —{" "}
            <span className="text-[var(--ink)]">
              {languages.map((l) => `${l.name} ${l.level}`).join(" · ")}
            </span>
          </p>
        </div>

        <Link href={site.cv.path} className="btn-pill w-fit">
          {t.fullCv}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="flex h-fit flex-col gap-8">
        {/* The rail was empty above the facts, and the panel is the one place on
            the site that speaks in the first person. No rounded corner and no
            frame: the photograph is already ink on paper, which is the whole
            palette. */}
        <Image
          src="/portrait/doug-portrait-900.webp"
          alt={t.portraitAlt(site.name)}
          width={900}
          height={1130}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
          className="w-full max-w-[280px] object-cover lg:max-w-none"
        />

        <dl className="hairline-t grid grid-cols-2 gap-x-6 gap-y-5 pt-6 lg:grid-cols-1">
          {FACT_ROWS.map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-dim)]">
                {f.label}
              </dt>
              <dd className="text-[var(--step-small)] leading-[1.5] text-[var(--ink)]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
