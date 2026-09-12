import Link from "next/link";
import { sections } from "@/data/sections";
import { site } from "@/data/site";
import { education, experiences, languages } from "@/data/cv";
import { currentExperience, formatPeriod } from "@/lib/career";
import RevealText from "@/components/text/RevealText";

const panel = sections[3];
const current = currentExperience();

const BIO_2 =
  "What has kept me here is not any single screen. It is the systems underneath: the tokens, the governance, the shared language that lets hundreds of designers and thousands of engineers ship as one product.";

const BIO_3 =
  "The line between designing and building stopped being useful to me. I prototype in code, ship real interfaces, and let the system and the model carry the repetitive weight. olbo is the clearest proof: a finance app I designed, engineered and shipped on my own, still running every day.";

/**
 * Every value is derived from `site` / `cv` — only `Focus` is a literal, which
 * is what the copy deck designates. No fact on this panel is typed twice.
 */
const FACT_ROWS: { label: string; value: string }[] = [
  {
    label: "Based",
    value: `${site.location.city}, ${site.location.country} · ${site.location.timezone}`,
  },
  { label: "Currently", value: `${current.role} · ${current.company.name}` },
  { label: "Focus", value: "Design systems · AI-native product" },
  { label: "Open to", value: site.availability.note ?? "" },
  {
    label: "Languages",
    value: languages
      .map((l) => `${l.name} (${l.cefr === "Native" ? "native" : l.cefr})`)
      .join(" · "),
  },
];

const earlierStart = experiences.findIndex((e) => e.era === "earlier");

export default function About() {
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
          <p className="kicker">/ Experience</p>
          <ul className="hairline-t flex flex-col">
            {experiences.map((e, i) => (
              <li key={e.id}>
                {i === earlierStart && (
                  <p className="hairline-b py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-dim)]">
                    Earlier
                  </p>
                )}
                <div className="hairline-b grid items-baseline gap-x-6 gap-y-1 py-3 md:grid-cols-[170px_170px_minmax(0,1fr)_auto]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]">
                    {e.company.name}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {formatPeriod(e)}
                  </span>
                  <span className="text-[var(--step-small)] leading-[1.5] text-[var(--ink-muted)]">
                    {e.roleShort ?? e.role}
                  </span>
                  {e.caseSlug ? (
                    <Link
                      href={`/work/${e.caseSlug}`}
                      className="flex min-h-11 items-center justify-start font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)] underline-offset-4 hover:underline md:justify-end"
                    >
                      See case →
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
            / Education —{" "}
            <span className="text-[var(--ink)]">
              {education[0].program}, {education[0].institution} (
              {education[0].start.year} — {education[0].end?.year})
            </span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            / Languages —{" "}
            <span className="text-[var(--ink)]">
              {languages.map((l) => `${l.name} ${l.level}`).join(" · ")}
            </span>
          </p>
        </div>

        <Link href={site.cv.path} className="btn-pill w-fit">
          Full CV
          <span aria-hidden>→</span>
        </Link>
      </div>

      <dl className="hairline-t grid h-fit grid-cols-2 gap-x-6 gap-y-5 pt-6 lg:grid-cols-1 lg:border-t-0 lg:pt-0">
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
    </section>
  );
}
