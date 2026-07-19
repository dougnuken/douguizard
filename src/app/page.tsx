import SectionIndex from "@/components/SectionIndex";
import HorizontalShell from "@/components/HorizontalShell";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Marquee from "@/components/sections/Marquee";
import SelectedWork from "@/components/sections/SelectedWork";
import Capabilities from "@/components/sections/Capabilities";
import ToolsMarquee from "@/components/sections/ToolsMarquee";
import WorkTimeline from "@/components/sections/WorkTimeline";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      {/* Brand mark — the only top-level element; navigation is the lateral index. */}
      <a
        href="#hero"
        className="fixed left-6 top-6 z-[60] flex items-baseline gap-1 no-underline md:left-12 md:top-8"
      >
        <span className="font-display text-lg font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          Douguizard
        </span>
        <span
          className="font-display text-lg leading-none"
          style={{ color: "var(--color-accent)" }}
        >
          *
        </span>
      </a>

      <SectionIndex />

      <HorizontalShell>
        <Hero />
        <Intro />
        <Marquee />
        <SelectedWork />
        <Capabilities />
        <ToolsMarquee />
        <WorkTimeline />
        <Stats />
        <TestimonialsCarousel />
        <About />
        <Footer />
      </HorizontalShell>
    </>
  );
}
