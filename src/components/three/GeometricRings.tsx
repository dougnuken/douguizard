"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GeometricRings() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.3;
    if (ring2Ref.current) ring2Ref.current.rotation.y = -t * 0.2;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.15;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ring1Ref} position={[0, 0, 50]}>
        <torusGeometry args={[60, 0.4, 2, 200]} />
        <meshBasicMaterial color={0x8b7fff} transparent opacity={0.3} />
      </mesh>
      <mesh
        ref={ring2Ref}
        position={[0, 0, 30]}
        scale={[1.5, 1.5, 1.5]}
        rotation={[Math.PI / 4, 0, 0]}
      >
        <torusGeometry args={[60, 0.4, 2, 200]} />
        <meshBasicMaterial color={0xff8b5e} transparent opacity={0.2} />
      </mesh>
      <mesh
        ref={ring3Ref}
        position={[0, 0, 10]}
        scale={[2.2, 2.2, 2.2]}
        rotation={[0, Math.PI / 6, 0]}
      >
        <torusGeometry args={[60, 0.4, 2, 200]} />
        <meshBasicMaterial color={0x5eb8ff} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
