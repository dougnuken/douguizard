import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-12 bg-[var(--paper)] text-center">
      <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-6">
        404 · Case study not found
      </div>
      <h1 className="font-display text-[clamp(64px,10vw,140px)] leading-[0.92] tracking-[-0.04em] mb-12">
        Lost in <span className="italic text-[var(--ink)]">space</span>?
      </h1>
      <p className="text-lg text-[var(--ink-muted)] mb-12 max-w-md">
        The case study you&apos;re looking for doesn&apos;t exist — or hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink)] no-underline border border-[var(--ink)] px-6 py-3 rounded-full hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all"
      >
        ← Back to all work
      </Link>
    </div>
  );
}
