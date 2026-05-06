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
  // Duplicate the items so the marquee loops seamlessly
  const tracks = [...items, ...items];

  return (
    <div className="relative z-[3] py-10 md:py-14 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        {/* Glass container */}
        <div
          className="relative overflow-hidden rounded-2xl py-5 border border-white/[0.06]"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,20,28,0.5) 0%, rgba(10,10,15,0.3) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "inset 1px 1px 0 0 rgba(235,233,224,0.04), inset -1px -1px 0 0 rgba(0,0,0,0.2), 0 8px 32px -8px rgba(0,0,0,0.4)",
          }}
        >
          {/* Edge fades */}
          <div
            className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(8,8,14,0.9) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, rgba(8,8,14,0.9) 0%, transparent 100%)",
            }}
          />

          {/* Marquee track */}
          <div className="whitespace-nowrap overflow-hidden">
            <div className="inline-flex gap-12 md:gap-16 animate-marquee">
              {tracks.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-12 md:gap-16 shrink-0 font-mono text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-[var(--color-ink-muted)]"
                >
                  {item}
                  <span className="text-[var(--color-accent)] opacity-50 text-[8px]">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}