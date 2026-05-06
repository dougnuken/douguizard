"use client";

const items = [
  { text: "Product Design", muted: false },
  { text: "AI-Driven Interfaces", muted: true },
  { text: "Design Systems", muted: false },
  { text: "UX Architecture", muted: true },
  { text: "Prototyping", muted: false },
  { text: "Mobile & Web", muted: true },
];

export default function Marquee() {
  // Duplicate the items so the marquee loops seamlessly
  const tracks = [...items, ...items];

  return (
    <div className="relative z-[2] py-6 border-y border-[var(--color-line)] overflow-hidden bg-[var(--color-bg-deep)] whitespace-nowrap">
      <div className="inline-flex gap-20 animate-marquee font-display text-4xl italic">
        {tracks.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-20 shrink-0">
            <span className={item.muted ? "text-[var(--color-ink-dim)]" : "text-[var(--color-ink)]"}>
              {item.text}
            </span>
            <span className="text-[var(--color-accent)] not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
