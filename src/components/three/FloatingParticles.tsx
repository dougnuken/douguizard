"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = [0xff8b5e, 0x8b7fff, 0x5eb8ff];

export default function FloatingParticles() {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      isOcta: i % 2 === 0,
      color: COLORS[i % 3],
      basePos: [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 100 + 50,
      ] as [number, number, number],
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const p = particles[i];
        child.rotation.x += p.rx;
        child.rotation.y += p.ry;
        child.position.y = p.basePos[1] + Math.sin(t + p.offset) * 4;
        child.position.x = p.basePos[0] + Math.cos(t * 0.7 + p.offset) * 3;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.basePos}>
          {p.isOcta ? (
            <octahedronGeometry args={[0.8, 0]} />
          ) : (
            <tetrahedronGeometry args={[0.9, 0]} />
          )}
          <meshBasicMaterial
            color={p.color}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
