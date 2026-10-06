import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

/** A case slug that does not exist — inside its language's tree, so it knows which. */
export default function CaseNotFound({ locale }: { locale: Locale }) {
  const t = getDict(locale).case.notFound;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-12 bg-[var(--paper)] text-center">
      <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-6">
        {t.kicker}
      </div>
      <h1 className="font-display text-[clamp(64px,10vw,140px)] leading-[0.92] tracking-[-0.04em] mb-12">
        {t.title.pre} <span className="italic text-[var(--ink)]">{t.title.em}</span>
        {t.title.post}
      </h1>
      <p className="text-lg text-[var(--ink-muted)] mb-12 max-w-md">{t.body}</p>
      <Link
        href={localePath(locale, "/#work")}
        className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink)] no-underline border border-[var(--ink)] px-6 py-3 rounded-full hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all"
      >
        ← {t.back}
      </Link>
    </div>
  );
}
