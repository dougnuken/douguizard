import SectionIndex from "@/components/SectionIndex";
import HorizontalShell from "@/components/HorizontalShell";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import SelectedWork from "@/components/sections/SelectedWork";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      {/* Brand mark — the only top-level element; navigation is the lateral index. */}
      <a
        href="#hero"
        className="fixed left-6 top-6 z-[60] flex items-baseline gap-1 no-underline md:left-12 md:top-8"
      >
        <span className="font-display text-lg font-semibold tracking-[-0.02em] text-[var(--ink)] transition-colors duration-500">
          Douguizard
        </span>
        <span
          className="font-display text-lg leading-none"
          style={{ color: "var(--ink)" }}
        >
          *
        </span>
      </a>

      <SectionIndex />

      {/* Five panels — present · about · what I do + tools · work + experience · contact */}
      <HorizontalShell>
        <Hero />
        <About />
        <Capabilities />
        <SelectedWork />
        <Footer />
      </HorizontalShell>
    </>
  );
}
