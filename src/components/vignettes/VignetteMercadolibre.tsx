import VignetteFrame, { type VignetteProps } from "./VignetteFrame";

const TOKENS = ["color.bg.primary", "space.16", "radius.8"];

export default function VignetteMercadolibre({ className }: VignetteProps) {
  return (
    <VignetteFrame
      className={className}
      label="The anatomy of a design-system component: tokens resolving into variants."
    >
      <div className="flex h-full items-center gap-3">
        <ul className="flex w-[42%] shrink-0 flex-col gap-2">
          {TOKENS.map((t) => (
            <li
              key={t}
              className="flex items-center gap-1.5 border-b border-[var(--line)] pb-1.5 font-mono text-[9px] tracking-[0.04em] text-[var(--ink-dim)]"
            >
              <span className="block h-[7px] w-[7px] shrink-0 rounded-[2px] border border-[var(--line-strong)]" />
              {t}
            </li>
          ))}
        </ul>

        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-[var(--ink-dim)]"
        >
          <path d="M0 5h16M12 1l4 4-4 4" />
        </svg>

        <div className="flex flex-1 flex-col items-start gap-2">
          <span className="rounded-full bg-[var(--ink)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--paper)]">
            Solid
          </span>
          <span className="rounded-full border border-[var(--ink-muted)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ink)]">
            Outline
          </span>
          <span className="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Ghost
          </span>
        </div>
      </div>
    </VignetteFrame>
  );
}
