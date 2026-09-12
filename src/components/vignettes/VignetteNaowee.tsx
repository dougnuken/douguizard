import VignetteFrame, { type VignetteProps } from "./VignetteFrame";

/**
 * A digit that rolls from `from` to `to`. Both digits live inside a clipped
 * 1lh column with tabular figures, so the roll can never shift layout.
 */
function RollingDigit({ from, to }: { from: string; to: string }) {
  return (
    <span className="inline-block h-[1lh] overflow-hidden align-bottom">
      <span className="vignette-roll block tabular-nums">
        <span className="block">{from}</span>
        <span className="block">{to}</span>
      </span>
    </span>
  );
}

function Counter({ label, from, to }: { label: string; from: string; to: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
        {label}
      </span>
      <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.03em] text-[var(--ink)]">
        <RollingDigit from={from} to={to} />
      </span>
    </div>
  );
}

export default function VignetteNaowee({ className }: VignetteProps) {
  return (
    <VignetteFrame
      className={className}
      label="A work queue recounting: six pending becomes five, three assigned becomes four."
    >
      <div className="flex items-start gap-8">
        <Counter label="Pending" from="6" to="5" />
        <Counter label="Assigned" from="3" to="4" />
      </div>

      <ul className="mt-auto flex flex-col gap-[6px]">
        {[0, 1, 2, 3].map((i) => (
          <li
            key={i}
            className={`flex items-center gap-2 ${i === 1 ? "vignette-chip" : ""}`}
          >
            <span
              className={`block h-[7px] w-[7px] shrink-0 rounded-full border border-[var(--line-strong)] ${
                i === 1 ? "bg-[var(--ink-muted)]" : ""
              }`}
            />
            <span className="block h-px flex-1 bg-[var(--line)]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
              {i === 1 ? "Assigned" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </VignetteFrame>
  );
}
