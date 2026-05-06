"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsHidden(true);
            onComplete?.();
          }, 400);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          className="fixed inset-0 bg-[var(--color-bg-deep)] z-[10000] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="font-mono text-[11px] tracking-[0.3em] text-[var(--color-ink-muted)] uppercase mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Initializing experience
          </motion.div>

          <div className="w-[200px] h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-accent), var(--color-accent-cool))",
                width: `${progress}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.div
            className="font-mono text-[11px] text-[var(--color-ink)] mt-4 tracking-[0.2em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {String(Math.floor(progress)).padStart(3, "0")}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
