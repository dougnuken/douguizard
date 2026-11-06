import { getSections } from "@/data/sections";
import { getOficio } from "@/data/perfil";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import RevealText from "@/components/text/RevealText";
import CraftTimeline from "@/components/sections/CraftTimeline";

/**
 * Rules instead of cards: a hairline between cells, on the axis the grid
 * actually splits at each breakpoint. Stacked below md, two columns at md,
 * one row at lg.
 *
 * Each range is scoped to itself with `md:max-lg:`, and nothing undoes
 * anything. The previous version layered lg rules over md ones and cancelled
 * the leftovers with `pl-0` / `pr-0` — but an arbitrary variant carries a
 * pseudo-class of specificity, so `lg:[&:nth-child(2n)]:pl-0` and
 * `lg:[&:not(:first-child)]:pl-12` tie at (0,2,0) and source order decides.
 * The reset won: column two shipped with a rule flush against its text and
 * column three with 48px of trailing air it had no use for.
 *
 * The air around a rule is 48px. At 32, beside a 34ch measure, a rule reads as
 * a border drawn around the paragraph rather than a division between two.
 */
const CELL_3 = [
  // Stacked: a rule above every cell but the first.
  "border-[var(--line)] border-t pt-6 first:border-t-0 first:pt-0",
  // Two columns: no rule above the first row, one rule down the middle.
  "md:max-lg:[&:nth-child(-n+2)]:border-t-0 md:max-lg:[&:nth-child(-n+2)]:pt-0",
  "md:max-lg:[&:nth-child(2n)]:border-l md:max-lg:[&:nth-child(2n)]:pl-12",
  "md:max-lg:[&:nth-child(2n+1)]:pr-12",
  // One row: no rule above anything, a rule before every cell but the first.
  "lg:border-t-0 lg:pt-0",
  "lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-12",
  "lg:[&:not(:last-child)]:pr-12",
].join(" ");

export default function Craft({ locale }: { locale: Locale }) {
  const t = getDict(locale).craft;
  const panel = getSections(locale)[2];
  const { oficio: EXPERTISE, pasos: STEPS } = getOficio(locale);
  return (
    <section
      id={panel.id}
      aria-labelledby="craft-title"
      className="mx-auto flex w-full max-w-[1400px] shrink-0 flex-col gap-14 px-6 py-16 md:px-12 lg:min-h-full lg:justify-center lg:py-20"
    >
      <header className="flex flex-col gap-4">
        <p className="kicker">
          {panel.num} — {t.kicker}
        </p>
        <h2
          id="craft-title"
          className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]"
        >
          {panel.title}
        </h2>
      </header>

      <div className="flex flex-col gap-6">
        <p className="kicker text-[var(--ink-dim)]">{t.expertise}</p>
        <div className="grid gap-6 md:grid-cols-2 md:gap-0 lg:grid-cols-3">
          {EXPERTISE.map((item, i) => (
            <RevealText
              key={item.title}
              as="div"
              variant="fade"
              delay={Math.min(i * 0.06, 0.25)}
              className={`flex flex-col gap-3 ${CELL_3}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-dim)]">
                <span aria-hidden className="mb-2 block h-px w-6 bg-[var(--line-strong)]" />
                FIG 0.{i + 1}
              </span>
              <h3 className="font-display text-[length:var(--step-lead)] font-semibold leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="max-w-[34ch] text-[length:var(--step-body)] leading-[1.6] text-[var(--ink-muted)]">
                {item.body}
              </p>
            </RevealText>
          ))}
        </div>
      </div>

      <div className="hairline-t flex flex-col gap-8 pt-14">
        <p className="kicker text-[var(--ink-dim)]">{t.howIWork}</p>
        <CraftTimeline steps={STEPS} />
      </div>
    </section>
  );
}
