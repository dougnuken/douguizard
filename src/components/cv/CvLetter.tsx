import CopyLetterButton from "@/components/cv/CopyLetterButton";
import { coverLetter } from "@/data/coverLetter";
import { site } from "@/data/site";

const [lede, ...rest] = coverLetter.paragraphs;

/**
 * The cover letter, on the page and off the sheet.
 *
 * `print:hidden` is deliberate. The PDF is generated from this route, stamped
 * against the data and held to a page budget, and it is a CV — a frozen
 * letter bolted to the front of it would be worse than no letter at all,
 * because the one thing a cover letter has to be is about the reader. Here it
 * costs nothing and gives the record a voice; there it would cost a page and
 * a tailoring.
 *
 * It reuses the same two-column grid as the experience section below, so the
 * letter's right-hand rail lines up with Education rather than floating.
 */
export default function CvLetter() {
  return (
    <section
      aria-labelledby="cv-letter"
      className="cv-letter hairline-t mt-12 grid grid-cols-1 gap-x-16 gap-y-8 pt-10 lg:grid-cols-[minmax(0,1fr)_320px] print:hidden"
    >
      <div className="min-w-0">
        <h2 id="cv-letter" className="cv-h2">
          {coverLetter.kicker}
        </h2>

        <div className="flex max-w-[64ch] flex-col gap-6">
          <p className="font-display text-[length:var(--step-lead)] leading-[1.25] tracking-[-0.02em] text-[var(--ink)]">
            {coverLetter.salutation}
          </p>

          {/* The opening paragraph carries the claim, so it is set one step up
              and in full ink; the rest supports it and is set as body. */}
          <p className="text-[length:var(--step-lead)] leading-[1.5] text-pretty text-[var(--ink)]">
            {lede}
          </p>

          {rest.map((p) => (
            <p
              key={p.slice(0, 32)}
              className="text-[length:var(--step-body)] leading-[1.7] text-pretty text-[var(--ink-muted)]"
            >
              {p}
            </p>
          ))}

          <div className="mt-2 flex flex-col gap-1">
            <p className="text-[length:var(--step-body)] leading-[1.6] text-[var(--ink-muted)]">
              {coverLetter.signoff}
            </p>
            <p className="font-display text-[length:var(--step-lead)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--ink)]">
              {site.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-5 lg:pt-[3.4rem]">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
          Updated {coverLetter.updated}
        </p>
        <CopyLetterButton />
        <p className="max-w-[34ch] text-[length:var(--step-small)] leading-[1.6] text-[var(--ink-muted)]">
          {coverLetter.note}
        </p>
      </div>
    </section>
  );
}
