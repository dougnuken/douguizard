import Link from "next/link";
import { getSite } from "@/data/site";
import { localePath, otherLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

/**
 * The 404 for an address that matches nothing at all.
 *
 * It cannot know which language the reader came in — an unmatched URL has no
 * tree to belong to — so it answers in Spanish, the site's first language, and
 * says the same thing once more in English underneath, with a way into each.
 */
export default function NotFoundContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).notFound;
  const site = getSite(locale);
  const other = otherLocale(locale);
  const o = getDict(other).notFound;
  return (
    <>
      <meta name="robots" content="noindex, follow" />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex min-h-svh w-full max-w-[900px] flex-col justify-center px-6 py-24 md:px-12"
      >
        <p className="kicker mb-6">{t.kicker}</p>

        <h1 className="mb-8 max-w-[14ch] text-balance font-display text-[length:var(--step-display)] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--ink)]">
          {t.title}
        </h1>

        <p className="hairline-t max-w-[52ch] pt-8 text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-muted)]">
          {t.body(site.domain)}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={localePath(locale, "/")} className="btn-pill btn-pill--solid justify-center">
            {t.home}
          </Link>
          <Link href={localePath(locale, "/#work")} className="btn-pill justify-center">
            {t.work}
            <span aria-hidden>→</span>
          </Link>
          <Link href={site.cv.path} className="btn-pill justify-center">
            {t.cv}
          </Link>
        </div>

        <p lang={other} className="mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          {o.kicker} ·{" "}
          <a href={localePath(other, "/")} hrefLang={other} className="text-[var(--ink-muted)] underline underline-offset-4">
            {o.home}
          </a>
        </p>
      </main>
    </>
  );
}
