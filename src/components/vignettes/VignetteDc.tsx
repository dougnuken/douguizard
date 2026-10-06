import VignetteFrame, { type VignetteProps } from "./VignetteFrame";
import { RollingDigit } from "./VignetteNaowee";
import { getDict } from "@/i18n/dictionaries";

/** A drawn tick, the same glyph the olbo vignette uses for its category chip. */
function Tick() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6.5 4.6 9 10 3.5" />
    </svg>
  );
}

/**
 * DC Medical's lock, in one loop: two of the three requirements are already
 * in, the consent arrives, the case rolls from phase 2 to 3 and the green light
 * comes on. Built from the same three animations as the other vignettes —
 * `vignette-roll` for the phase, `vignette-chip` for what arrives — so it
 * moves on the same clock and stops on the same final frame under reduced
 * motion: everything in, phase 3, go-ahead.
 *
 * Monochrome on purpose. The panel's own green belongs to the panel; here the
 * "green light" is a word and a tick, which reads in both themes and to anyone.
 */
export default function VignetteDc({ className, locale }: VignetteProps) {
  const t = getDict(locale).work.vignettes.dc;
  return (
    <VignetteFrame className={className} label={t.label}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
            {t.phase}
          </span>
          <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.03em] text-[var(--ink)]">
            <RollingDigit from="2" to="3" />
            <span className="text-[var(--ink-dim)]">/3</span>
          </span>
        </div>
        <span className="vignette-chip inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink)]">
          <Tick />
          {t.go}
        </span>
      </div>

      <ul className="mt-auto flex flex-col gap-[6px]">
        {t.checks.map((label, i) => {
          const arrives = i === t.checks.length - 1;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`inline-flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] ${
                  arrives ? "vignette-chip" : ""
                }`}
              >
                <Tick />
              </span>
              <span className="block h-px flex-1 bg-[var(--line)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </VignetteFrame>
  );
}
