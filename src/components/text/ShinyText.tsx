import type { ReactNode } from "react";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * Subtle accent shimmer sweeping across the text. Pure CSS (see `.shiny-text`
 * in globals.css); the animation is disabled under prefers-reduced-motion.
 * Intended for a single small accent — e.g. the availability badge.
 */
export default function ShinyText({ children, className = "" }: ShinyTextProps) {
  return <span className={`shiny-text ${className}`}>{children}</span>;
}
