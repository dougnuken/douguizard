import { getSections } from "@/data/sections";
import type { Locale } from "@/i18n/config";
import SectionIndex from "@/components/SectionIndex";
import HorizontalShell from "@/components/HorizontalShell";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Craft from "@/components/sections/Craft";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

/**
 * Five panels, in the order `src/data/sections.ts` declares:
 * home · work · craft · about · contact. The same page in both languages;
 * `app/(es)/page.tsx` and `app/(en)/en/page.tsx` only say which.
 *
 * Keep one element per line with no trailing text: the shell maps over its
 * children, so a stray JSX whitespace node would become an empty sixth panel.
 */
export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <main id="main" tabIndex={-1}>
      <SectionIndex />
      <HorizontalShell labels={getSections(locale).map((s) => s.label)}>
        <Hero locale={locale} />
        <Work locale={locale} />
        <Craft locale={locale} />
        <About locale={locale} />
        <Contact locale={locale} />
      </HorizontalShell>
    </main>
  );
}
