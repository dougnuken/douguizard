import Link from "next/link";
import { site } from "@/data/site";

/**
 * The site-wide 404.
 *
 * There was none, so an unknown URL fell through to the framework's own — an
 * unstyled page with none of the site's chrome, which reads as a broken deploy
 * rather than as a wrong address. The case-study 404 already existed and this
 * is its sibling, one level up.
 *
 * The `noindex` is belt to the 404 status' braces: the status alone is enough
 * for a crawler, but a soft-404 served by a misconfigured host is not, and the
 * meta tag costs nothing. React hoists it into `<head>`.
 */
export default function NotFound() {
  return (
    <>
      <meta name="robots" content="noindex, follow" />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex min-h-svh w-full max-w-[900px] flex-col justify-center px-6 py-24 md:px-12"
      >
        <p className="kicker mb-6">404 · Page not found</p>

        <h1 className="mb-8 max-w-[14ch] text-balance font-display text-[length:var(--step-display)] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--ink)]">
          This one went nowhere.
        </h1>

        <p className="hairline-t max-w-[52ch] pt-8 text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-muted)]">
          The address you followed doesn&apos;t exist on {site.domain} — it may have
          moved, or it may never have been here. Everything that does exist is one
          click away.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/" className="btn-pill btn-pill--solid justify-center">
            Home
          </Link>
          <Link href="/#work" className="btn-pill justify-center">
            Selected work
            <span aria-hidden>→</span>
          </Link>
          <Link href={site.cv.path} className="btn-pill justify-center">
            CV
          </Link>
        </div>
      </main>
    </>
  );
}
