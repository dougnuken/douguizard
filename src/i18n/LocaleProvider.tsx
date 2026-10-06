"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./config";
import { getDict, type Dict } from "./dictionaries";

const LocaleContext = createContext<Locale>(defaultLocale);
/** True on the 404 for an unmatched address, which has no counterpart page. */
const LostContext = createContext(false);

/**
 * The page's language, for the client components underneath it.
 *
 * Server components never read this: they are handed `locale` as a prop by the
 * route that renders them. It exists for the interactive pieces — the header,
 * the section rail, the case template — which sit below a client boundary and
 * would otherwise each need the locale threaded through every parent.
 *
 * Set once, by the root layout of each language, and never changes while a
 * page is open: switching language is a navigation to the other tree.
 */
export function LocaleProvider({
  locale,
  lost = false,
  children,
}: {
  locale: Locale;
  lost?: boolean;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <LostContext.Provider value={lost}>{children}</LostContext.Provider>
    </LocaleContext.Provider>
  );
}

/** Whether this page is the 404 for an address that exists in neither language. */
export function useIsLost(): boolean {
  return useContext(LostContext);
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useDict(): Dict {
  return getDict(useContext(LocaleContext));
}
