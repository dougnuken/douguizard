import type { ReactNode } from "react";

export interface VignetteProps {
  className?: string;
}

/**
 * The shared shell for the four live vignettes: a flat 1 px frame at 16:10,
 * the same language as the case device frames. `role="img"` with a sentence
 * for a label — the marks are illustrative, so letting a reader speak the
 * loose numerals inside would be noise; everything within is aria-hidden.
 */
export default function VignetteFrame({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3.5 ${className}`}
    >
      <div aria-hidden className="flex h-full w-full flex-col">
        {children}
      </div>
    </div>
  );
}
