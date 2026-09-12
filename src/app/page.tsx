import SectionIndex from "@/components/SectionIndex";
import HorizontalShell from "@/components/HorizontalShell";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Craft from "@/components/sections/Craft";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

/**
 * Five panels, in the order `src/data/sections.ts` declares:
 * home · work · craft · about · contact.
 *
 * Keep one element per line with no trailing text: the shell maps over its
 * children, so a stray JSX whitespace node would become an empty sixth panel.
 */
export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <SectionIndex />
      <HorizontalShell>
        <Hero />
        <Work />
        <Craft />
        <About />
        <Contact />
      </HorizontalShell>
    </main>
  );
}
