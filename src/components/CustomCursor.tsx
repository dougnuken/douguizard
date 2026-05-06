"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const ringX = useSpring(cursorX, { stiffness: 250, damping: 28, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 250, damping: 28, mass: 0.5 });

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia("(hover: none)").matches) return;
    setIsVisible(true);

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverIn = () => setIsHovering(true);
    const handleHoverOut = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMove);

    // Delegate hover for any data-cursor="hover" element
    const observer = new MutationObserver(() => {
      const targets = document.querySelectorAll('[data-cursor="hover"]');
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverIn);
        el.removeEventListener("mouseleave", handleHoverOut);
        el.addEventListener("mouseenter", handleHoverIn);
        el.addEventListener("mouseleave", handleHoverOut);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
      el.addEventListener("mouseenter", handleHoverIn);
      el.addEventListener("mouseleave", handleHoverOut);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          left: cursorX,
          top: cursorY,
          width: 12,
          height: 12,
          x: "-50%",
          y: "-50%",
          background: "var(--color-accent)",
          mixBlendMode: "difference",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border"
        style={{
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          borderColor: isHovering
            ? "var(--color-accent)"
            : "rgba(245, 243, 255, 0.4)",
        }}
        animate={{
          width: isHovering ? 64 : 36,
          height: isHovering ? 64 : 36,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
      />
    </>
  );
}
