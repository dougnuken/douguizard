/**
 * Brand marks for the tools worth showing a logo for.
 *
 * Only marks that can be drawn faithfully are here. Figma's is five known
 * shapes on a known grid; Claude's is a radial burst; Gemini's is a
 * four-pointed star. OpenAI's interlocking knot is a specific path that cannot
 * be reproduced from memory without getting it visibly wrong, so ChatGPT stays
 * in the text list below rather than appearing as a bad copy of someone's
 * trademark. Drop an official SVG in and it joins this file.
 *
 * Used nominatively — these say which tools Doug works in, which is what a
 * tools list on a CV is for.
 */

type MarkProps = { className?: string };

/** Canonical Figma geometry: two columns, three rows, one full circle. */
function Figma({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 38 57" className={className} role="img" aria-label="Figma">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

/** Claude's burst: tapered rays around a centre, alternating length. */
function Claude({ className }: MarkProps) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 360) / 12;
    const long = i % 2 === 0;
    return { angle, len: long ? 21 : 14, w: long ? 3.1 : 2.3 };
  });
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Claude">
      <g fill="#D97757">
        {rays.map(({ angle, len, w }) => (
          <path
            key={angle}
            d={`M${24 - w} 24 L24 ${24 - len} L${24 + w} 24 Z`}
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="3.4" />
      </g>
    </svg>
  );
}

/** Gemini's four-pointed star: straight points, concave sides. */
function Gemini({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Gemini">
      <defs>
        <linearGradient id="gemini-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4796E3" />
          <stop offset="52%" stopColor="#8F75E8" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M24 2c0 12.15 9.85 22 22 22-12.15 0-22 9.85-22 22 0-12.15-9.85-22-22-22 12.15 0 22-9.85 22-22z"
        fill="url(#gemini-mark)"
      />
    </svg>
  );
}

const MARKS = {
  Figma,
  Claude,
  Gemini,
} as const;

export type ToolMarkName = keyof typeof MARKS;

/** The order they read in. */
export const MARKED_TOOLS: ToolMarkName[] = ["Figma", "Claude", "Gemini"];

export default function ToolMarks({ names = MARKED_TOOLS }: { names?: ToolMarkName[] }) {
  return (
    <ul className="cv-marks flex list-none flex-wrap items-center gap-x-6 gap-y-3">
      {names.map((name) => {
        const Mark = MARKS[name];
        return (
          <li key={name} className="flex items-center gap-2">
            <Mark className="h-[18px] w-[18px] shrink-0" />
            <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--ink-muted)]">
              {name}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
