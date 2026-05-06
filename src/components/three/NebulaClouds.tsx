"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NEBULA_COLORS = [0x8b7fff, 0xff8b5e, 0x5eb8ff, 0xff5e9f];

export default function NebulaClouds() {
  const groupRef = useRef<THREE.Group>(null);

  const nebulae = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      color: NEBULA_COLORS[i % NEBULA_COLORS.length],
      size: 80 + Math.random() * 60,
      position: [
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400,
        -100 - Math.random() * 200,
      ] as [number, number, number],
      speed: Math.random() * 0.2 + 0.1,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
      groupRef.current.children.forEach((child, i) => {
        const n = nebulae[i];
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.position.y += Math.sin(t * n.speed + n.offset) * 0.05;
          child.material.opacity = 0.04 + Math.sin(t * 0.5 + n.offset) * 0.02;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {nebulae.map((n, i) => (
        <mesh key={i} position={n.position}>
          <sphereGeometry args={[n.size, 32, 32]} />
          <meshBasicMaterial
            color={n.color}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
