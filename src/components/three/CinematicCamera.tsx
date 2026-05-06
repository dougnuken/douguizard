"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

interface CinematicCameraProps {
  scrollProgress: number;
}

export default function CinematicCamera({ scrollProgress }: CinematicCameraProps) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const p = scrollProgress;

    // Camera dolly in/out
    const targetZ = 300 - Math.sin(p * Math.PI) * 80;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    // FOV breathing
    const targetFov = 50 + Math.sin(p * Math.PI * 2) * 4;
    camera.fov += (targetFov - camera.fov) * 0.08;
    camera.updateProjectionMatrix();

    // Smooth mouse parallax
    mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.04;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.04;

    // Vertical pan
    const targetY = -p * 80 + mouse.current.y * 8;
    camera.position.y += (targetY - camera.position.y) * 0.08;

    // X parallax from mouse
    const targetX = mouse.current.x * 12;
    camera.position.x += (targetX - camera.position.x) * 0.08;

    // Look at drift
    lookAtTarget.current.set(
      mouse.current.x * 4,
      -p * 40 + mouse.current.y * 4,
      0
    );
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
