import { site } from "@/data/site";

const linkedin = site.social.find((s) => s.primary) ?? site.social[0];

/**
 * Placeholder. The cosmic clone of the old home that used to live here is
 * gone; the real CV — built from `cv.ts`, printable, with "Download PDF" —
 * is Build B's job (`docs/specs/05-cv-page.md`).
 */
export default function CvPage() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-[68ch] flex-col gap-6 px-6 pb-24 pt-28 md:px-12"
    >
      <h1 className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]">
        {site.name}
      </h1>
      <p className="kicker">{site.headline}</p>
      <p className="text-[length:var(--step-lead)] leading-[1.45] tracking-[-0.01em] text-[var(--ink-muted)]">
        {site.summary}
      </p>
      <a
        href={linkedin.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-pill w-fit"
      >
        {linkedin.label}
      </a>
    </main>
  );
}
