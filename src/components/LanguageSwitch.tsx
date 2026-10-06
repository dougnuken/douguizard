"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { localeName, localePath, otherLocale, splitLocale, type Locale } from "@/i18n/config";
import { useDict, useIsLost, useLocale } from "@/i18n/LocaleProvider";
import {
  getActiveSection,
  getServerActiveSection,
  subscribeActiveSection,
} from "@/lib/activeSection";

const CODE: Record<Locale, string> = { es: "ES", en: "EN" };

/**
 * Where the same page lives in the other language — plus, on the home page,
 * the panel the reader is on, so switching mid-scroll does not throw them
 * back to the top. Section ids are the same in both languages.
 */
function useCounterpart(): { to: Locale; href: string } {
  const locale = useLocale();
  const pathname = usePathname();
  const active = useSyncExternalStore(
    subscribeActiveSection,
    getActiveSection,
    getServerActiveSection,
  );
  const lost = useIsLost();
  const { path } = splitLocale(pathname || "/");
  const to = otherLocale(locale);
  // An address that matches nothing has no other-language twin either, so
  // the switch on the 404 goes to the other language's home instead.
  if (lost) return { to, href: localePath(to, "/") };
  const hash = path === "/" && active && active !== "home" ? `#${active}` : "";
  return { to, href: `${localePath(to, path)}${hash}` };
}

/**
 * The language switch.
 *
 * Plain `<a>`, never `<Link>`: each language is its own root layout with its
 * own `<html lang>`, so crossing between them is a full document load by
 * definition — and a real link is what a crawler follows to the other version.
 *
 * Two shapes from one component. `segmented` is the header's "ES | EN" pill,
 * with the current language marked and not clickable. `compact` is the single
 * circle a narrow header has room for: it names only the way out.
 */
export default function LanguageSwitch({
  variant = "segmented",
  className = "",
}: {
  variant?: "segmented" | "compact";
  className?: string;
}) {
  const locale = useLocale();
  const t = useDict();
  const { to, href } = useCounterpart();

  if (variant === "compact") {
    return (
      <a
        href={href}
        hrefLang={to}
        lang={to}
        aria-label={t.header.switchTo}
        className={`lang-switch-compact ${className}`}
      >
        <span aria-hidden>{CODE[to]}</span>
      </a>
    );
  }

  return (
    <nav aria-label={t.header.language} className={`lang-switch ${className}`}>
      {(["es", "en"] as const).map((l) =>
        l === locale ? (
          <span key={l} aria-current="true" className="lang-switch__item lang-switch__item--current">
            <span aria-hidden>{CODE[l]}</span>
            <span className="sr-only">{localeName[l]}</span>
          </span>
        ) : (
          <a
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-label={t.header.switchTo}
            className="lang-switch__item"
          >
            <span aria-hidden>{CODE[l]}</span>
          </a>
        ),
      )}
    </nav>
  );
}

/** The menu row: the same destination, spelled out, for the narrowest phones. */
export function LanguageMenuLink({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useDict();
  const { to, href } = useCounterpart();
  return (
    <a href={href} hrefLang={to} lang={to} onClick={onNavigate} className={className}>
      {t.header.switchTo}
    </a>
  );
}
