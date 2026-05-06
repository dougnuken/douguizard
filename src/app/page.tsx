"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScroll";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Manifesto from "@/components/sections/Manifesto";
import Capabilities from "@/components/sections/Capabilities";
import Portfolio from "@/components/sections/Portfolio";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/sections/Footer";

// 3D scene loaded client-side only (Three.js needs window/canvas)
const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SmoothScrollProvider>
      <Loader onComplete={() => setLoaded(true)} />
      <CustomCursor />
      <Scene3D />
      <div className="grain-overlay" />

      <Navigation />

      <main className="relative">
        <Hero />
        <Marquee />
        <Manifesto />
        <Capabilities />
        <Portfolio />
        <Stats />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
