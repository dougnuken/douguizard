import VignetteFrame, { type VignetteProps } from "./VignetteFrame";
import { getDict } from "@/i18n/dictionaries";

/** The pass and like glyphs, drawn rather than typed so both themes get the same marks. */
function Cross() {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M3 3l6 6M9 3 3 9" />
    </svg>
  );
}

function Heart() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 10.4 1.7 6.3A2.6 2.6 0 0 1 6 3a2.6 2.6 0 0 1 4.3 3.3L6 10.4Z" />
    </svg>
  );
}

/**
 * MakeaPet's swipe, in one loop: the top card tilts right, the LIKE stamp
 * comes in, and the card leaves — the card behind it is already waiting.
 * `vignette-swipe` and `vignette-stamp` run on the same 3 s clock as the
 * other vignettes; under reduced motion it stops on the decided frame, the
 * card tilted with LIKE on it.
 *
 * Monochrome like the rest of the index: the product's purple and pink
 * belong to the case page, where the real screens are.
 */
export default function VignetteMakeapet({ className, locale }: VignetteProps) {
  const t = getDict(locale).work.vignettes.makeapet;
  return (
    <VignetteFrame className={className} label={t.label}>
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">{t.forYou}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">1.0 km</span>
      </div>

      <div className="relative mx-auto mt-1 aspect-[3/4] min-h-0 flex-1">
        {/* The next card, already in place. */}
        <span className="absolute inset-0 translate-x-[-7%] rotate-[-4deg] rounded-lg border border-[var(--line)] bg-[var(--paper-raised)]" />
        <div className="vignette-swipe absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-[var(--line-strong)] bg-[var(--paper)]">
          {/* The photo: the card is mostly picture, as in the app. */}
          <span className="block flex-1 bg-[var(--line)]" />
          <span className="vignette-stamp absolute left-1.5 top-1.5 z-[1] -rotate-[10deg] rounded-[3px] border border-[var(--ink)] bg-[var(--paper)] px-1 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
            Like
          </span>
          <span className="flex flex-col gap-1 p-1.5">
            <span className="block h-[4px] w-[60%] rounded-full bg-[var(--ink-muted)]" />
            <span className="block h-[3px] w-[38%] rounded-full bg-[var(--line-strong)]" />
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--ink-muted)]">
          <Cross />
        </span>
        <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
          <Heart />
        </span>
      </div>
    </VignetteFrame>
  );
}
