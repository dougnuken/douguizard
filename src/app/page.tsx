import SectionIndex from "@/components/SectionIndex";
import HorizontalShell from "@/components/HorizontalShell";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import SelectedWork from "@/components/sections/SelectedWork";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <SectionIndex />
      <HorizontalShell>
        <Hero />
        <SelectedWork />
        <Capabilities />
        <About />
        <Footer />
      </HorizontalShell>
    </main>
  );
}
