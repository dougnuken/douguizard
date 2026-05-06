"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Starfield from "./Starfield";
import NebulaClouds from "./NebulaClouds";
import GeometricRings from "./GeometricRings";
import FloatingParticles from "./FloatingParticles";
import CinematicCamera from "./CinematicCamera";

function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  const ringsRef = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Group>(null);

  // Scroll-driven layer transforms
  useEffect(() => {
    if (starsRef.current) starsRef.current.position.z = -scrollProgress * 200;
    if (ringsRef.current) {
      ringsRef.current.scale.setScalar(1 + scrollProgress * 0.6);
      ringsRef.current.position.z = -scrollProgress * 100;
    }
    if (nebulaRef.current) nebulaRef.current.position.z = -scrollProgress * 80;
    if (particlesRef.current) particlesRef.current.position.z = scrollProgress * 50;
  }, [scrollProgress]);

  return (
    <>
      <CinematicCamera scrollProgress={scrollProgress} />

      {/* Lighting setup */}
      <ambientLight intensity={0.4} color={0x1a1530} />
      <pointLight
        position={[-200, 150, 200]}
        intensity={1.2 + Math.sin(scrollProgress * Math.PI) * 0.4}
        color={0xff8b5e}
        distance={800}
      />
      <pointLight
        position={[200, -100, 200]}
        intensity={0.8 + Math.cos(scrollProgress * Math.PI) * 0.3}
        color={0x5eb8ff}
        distance={800}
      />
      <pointLight
        position={[0, 0, -200]}
        intensity={0.6}
        color={0x8b7fff}
        distance={600}
      />

      {/* Fog */}
      <fogExp2 attach="fog" args={[0x050407, 0.0008]} />

      {/* Layered scene groups */}
      <group ref={starsRef}>
        <Starfield count={3500} />
      </group>
      <group ref={nebulaRef}>
        <NebulaClouds />
      </group>
      <group ref={ringsRef}>
        <GeometricRings />
      </group>
      <group ref={particlesRef}>
        <FloatingParticles />
      </group>
    </>
  );
}

export default function Scene3D() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 300], fov: 50, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
