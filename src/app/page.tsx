import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Marquee from "@/components/sections/Marquee";
import SelectedWork from "@/components/sections/SelectedWork";
import Manifesto from "@/components/sections/Manifesto";
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
      <Navigation />

      <main className="relative">
        <Hero />
        <Intro />
        <Marquee />
        <SelectedWork />
        <Manifesto />
        <Capabilities />
        <ToolsMarquee />
        <WorkTimeline />
        <Stats />
        <TestimonialsCarousel />
        <About />
        <Footer />
      </main>
    </>
  );
}
