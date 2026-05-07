"use client";

import { useEffect, useState } from "react";
import InterstellarShader from "./GalaxyField";

export default function Scene3D() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nebulaStyle = {
    background: `
      radial-gradient(ellipse 65% 45% at 15% 25%, rgba(167, 139, 250, 0.42) 0%, transparent 65%),
      radial-gradient(ellipse 55% 40% at 85% 75%, rgba(125, 90, 200, 0.38) 0%, transparent 65%),
      radial-gradient(ellipse 50% 35% at 70% 20%, rgba(196, 181, 253, 0.25) 0%, transparent 65%),
      radial-gradient(ellipse 45% 30% at 30% 80%, rgba(149, 110, 230, 0.32) 0%, transparent 60%)
    `,
    transform: `translateY(${scrollY * 0.1}px)`,
    willChange: "transform",
  };

  const shaderWrapperStyle = {
    opacity: 0.4,
  };

  const vignetteStyle = {
    background: "radial-gradient(ellipse at center, transparent 65%, rgba(21, 17, 45, 0.45) 100%)",
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none animate-nebula-drift" style={nebulaStyle} />

      <DecorativeStars scrollY={scrollY} />

      <div className="fixed inset-0 z-[1] pointer-events-none" style={shaderWrapperStyle}>
        <InterstellarShader speed={0.7} opacity={1} />
      </div>

      <div className="fixed inset-0 z-[2] pointer-events-none" style={vignetteStyle} />
    </>
  );
}

function DecorativeStars({ scrollY }: { scrollY: number }) {
  const farStarsStyle = {
    backgroundImage: `
      radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.85), transparent),
      radial-gradient(1px 1px at 28% 42%, rgba(255,255,255,0.65), transparent),
      radial-gradient(1.5px 1.5px at 45% 8%, rgba(255,255,255,0.95), transparent),
      radial-gradient(1px 1px at 62% 55%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1.5px 1.5px at 78% 25%, rgba(255,255,255,0.85), transparent),
      radial-gradient(1px 1px at 88% 70%, rgba(255,255,255,0.65), transparent),
      radial-gradient(1.5px 1.5px at 35% 88%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 5% 65%, rgba(255,255,255,0.65), transparent),
      radial-gradient(1.5px 1.5px at 95% 40%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 18% 78%, rgba(255,255,255,0.7), transparent),
      radial-gradient(1.5px 1.5px at 72% 92%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 8% 30%, rgba(255,255,255,0.55), transparent),
      radial-gradient(1px 1px at 92% 88%, rgba(255,255,255,0.6), transparent)
    `,
    backgroundSize: "100% 100%",
    transform: `translateY(${scrollY * 0.08}px)`,
    willChange: "transform",
  };

  const midStarsStyle = {
    backgroundImage: `
      radial-gradient(2px 2px at 22% 30%, rgba(196, 181, 253, 1), transparent),
      radial-gradient(2px 2px at 68% 15%, rgba(167, 139, 250, 0.9), transparent),
      radial-gradient(2px 2px at 85% 50%, rgba(196, 181, 253, 1), transparent),
      radial-gradient(2px 2px at 40% 65%, rgba(167, 139, 250, 0.85), transparent),
      radial-gradient(2px 2px at 10% 50%, rgba(196, 181, 253, 0.85), transparent),
      radial-gradient(2px 2px at 55% 35%, rgba(167, 139, 250, 0.95), transparent)
    `,
    backgroundSize: "100% 100%",
    transform: `translateY(${scrollY * 0.15}px)`,
    willChange: "transform",
  };

  const closeStarsStyle = {
    backgroundImage: `
      radial-gradient(3px 3px at 30% 22%, rgba(255,255,255,1), rgba(167,139,250,0.5) 50%, transparent),
      radial-gradient(3px 3px at 75% 60%, rgba(255,255,255,1), rgba(196,181,253,0.5) 50%, transparent),
      radial-gradient(3px 3px at 15% 80%, rgba(255,255,255,1), rgba(167,139,250,0.5) 50%, transparent),
      radial-gradient(3px 3px at 90% 15%, rgba(255,255,255,1), rgba(196,181,253,0.5) 50%, transparent)
    `,
    backgroundSize: "100% 100%",
    transform: `translateY(${scrollY * 0.25}px)`,
    willChange: "transform",
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none" style={farStarsStyle} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={midStarsStyle} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={closeStarsStyle} />
    </>
  );
}