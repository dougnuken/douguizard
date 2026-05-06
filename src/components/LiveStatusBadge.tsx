 "use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LiveStatusBadgeProps {
  children?: ReactNode;
  variant?: "available" | "busy" | "offline";
  className?: string;
}

const variants = {
  available: {
    color: "rgb(94, 219, 142)",
    label: "Available for Selected Projects",
  },
  busy: {
    color: "rgb(255, 166, 94)",
    label: "Currently Booked",
  },
  offline: {
    color: "rgb(155, 149, 184)",
    label: "Offline",
  },
};

export default function LiveStatusBadge({
  children,
  variant = "available",
  className = "",
}: LiveStatusBadgeProps) {
  const { color, label } = variants[variant];

  return (
    <motion.div
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "border border-white/[0.06]",
        "bg-white/[0.02] backdrop-blur-xl",
        "font-mono text-[9px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)]",
        className,
      ].join(" ")}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.3, 0, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
      <span>{children ?? label}</span>
    </motion.div>
  );
}