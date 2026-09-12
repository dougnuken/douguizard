import VignetteFrame, { type VignetteProps } from "./VignetteFrame";

const ROWS: { name: string; tone: number; usage: string }[] = [
  { name: "ink.900", tone: 92, usage: "Text" },
  { name: "ink.600", tone: 62, usage: "Body" },
  { name: "ink.300", tone: 34, usage: "Meta" },
  { name: "line.200", tone: 20, usage: "Rules" },
  { name: "surface.50", tone: 10, usage: "Cards" },
  { name: "surface.00", tone: 4, usage: "Page" },
];

/** Five columns of component glyphs: foundations → atoms → … → organisms. */
const GLYPHS = ["bar", "pill", "dot", "square", "split"] as const;

function Glyph({ kind }: { kind: (typeof GLYPHS)[number] }) {
  const base = "border border-[var(--line-strong)]";
  if (kind === "pill") return <span className={`${base} block h-[8px] w-full rounded-full`} />;
  if (kind === "dot")
    return <span className={`${base} mx-auto block h-[8px] w-[8px] rounded-full`} />;
  if (kind === "square") return <span className={`${base} block h-[8px] w-full rounded-[2px]`} />;
  if (kind === "split")
    return (
      <span className="flex w-full gap-[3px]">
        <span className={`${base} block h-[8px] flex-1 rounded-[1px]`} />
        <span className={`${base} block h-[8px] w-[8px] rounded-[1px]`} />
      </span>
    );
  return <span className="block h-[8px] w-full bg-[var(--line-strong)]" />;
}

export default function VignetteBanco({ className }: VignetteProps) {
  return (
    <VignetteFrame
      className={className}
      label="A design-system grid: foundations, atoms, molecules and organisms."
    >
      <ul className="flex flex-col">
        {ROWS.map((r) => (
          <li
            key={r.name}
            className="flex items-center gap-2 border-b border-[var(--line)] py-[3px] font-mono text-[9px] tracking-[0.04em] text-[var(--ink-dim)]"
          >
            <span
              className="block h-[8px] w-[8px] shrink-0 rounded-[2px] border border-[var(--line-strong)]"
              style={{ background: `color-mix(in srgb, var(--ink) ${r.tone}%, transparent)` }}
            />
            <span className="flex-1">{r.name}</span>
            <span>{r.usage}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto grid grid-cols-5 gap-x-2 gap-y-[6px] pt-2">
        {Array.from({ length: 20 }, (_, i) => (
          <Glyph key={i} kind={GLYPHS[i % GLYPHS.length]} />
        ))}
      </div>
    </VignetteFrame>
  );
}
