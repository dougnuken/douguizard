"use client";

const items = [
  "Product Design",
  "AI-Driven Interfaces",
  "Design Systems",
  "UX Architecture",
  "Prototyping",
  "Mobile & Web",
  "Generative UI",
  "Component Libraries",
];

export default function Marquee() {
  const tracks = [...items, ...items];

  const containerStyle = {
    background: "linear-gradient(135deg, rgba(240,238,230,0.04) 0%, rgba(240,238,230,0.01) 100%)",
    backdropFilter: "blur(20px) saturate(120%)",
    WebkitBackdropFilter: "blur(20px) saturate(120%)",
    borderTop: "1px solid var(--color-line)",
    borderBottom: "1px solid var(--color-line)",
    boxShadow: "inset 1px 0 0 0 rgba(240,238,230,0.04), inset -1px 0 0 0 rgba(0,0,0,0.15), 0 8px 32px -8px rgba(0,0,0,0.4)",
  };

  const fadeLeftStyle = {
    background: "linear-gradient(90deg, rgba(21,17,45,0.85) 0%, transparent 100%)",
  };

  const fadeRightStyle = {
    background: "linear-gradient(270deg, rgba(21,17,45,0.85) 0%, transparent 100%)",
  };

  return (
    <div className="relative z-[3] py-8 md:py-12 w-full max-w-full overflow-hidden">
      <div className="relative w-full max-w-full overflow-hidden py-4 md:py-5" style={containerStyle}>
        <div className="absolute left-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none" style={fadeLeftStyle} />
        <div className="absolute right-0 top-0 h-full w-16 md:w-32 z-10 pointer-events-none" style={fadeRightStyle} />

        <div className="whitespace-nowrap overflow-hidden">
          <div className="inline-flex gap-8 md:gap-16 animate-marquee will-change-transform">
            {tracks.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-8 md:gap-16 shrink-0 font-mono text-[10px] md:text-[12px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-[var(--color-ink-muted)]"
              >
                {item}
                <span className="text-[var(--color-accent)] opacity-50 text-[7px] md:text-[8px]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}