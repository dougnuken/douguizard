import VignetteFrame, { type VignetteProps } from "./VignetteFrame";

const BARS = [0.35, 0.6, 0.95, 0.5, 0.8, 1, 0.45, 0.7, 0.9, 0.4, 0.65, 0.85, 0.5, 0.3];

export default function VignetteOlbo({ className }: VignetteProps) {
  return (
    <VignetteFrame
      className={className}
      label="A captured expense: spoken text becomes an amount, a merchant and a category."
    >
      <div className="flex items-end gap-[3px] h-10">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="vignette-bar block w-[3px] rounded-full bg-[var(--ink-muted)]"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>

      <p className="mt-3 font-mono text-[10px] leading-relaxed text-[var(--ink-muted)]">
        &ldquo;veinte mil en el super&rdquo;
      </p>

      <div className="mt-auto flex items-end justify-between gap-3">
        <span className="font-display text-[22px] font-semibold tracking-[-0.03em] tabular-nums text-[var(--ink)]">
          $20.000
        </span>
        <span className="vignette-chip inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
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
          Mercado
        </span>
      </div>
    </VignetteFrame>
  );
}
