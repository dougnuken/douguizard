"use client";

import { motion } from "framer-motion";

const navItems = [
  { num: "01", label: "Work", href: "#work" },
  { num: "02", label: "About", href: "#about" },
  { num: "03", label: "Contact", href: "#contact" },
  { num: "04", label: "CV", href: "/cv" },
];

export default function Navigation() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 px-12 py-7 z-[100] flex justify-between items-center"
      style={{ mixBlendMode: "difference" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href="/"
        className="font-display italic text-[22px] text-[var(--color-ink)] tracking-tight"
        data-cursor="hover"
      >
        doug<span className="text-[var(--color-accent)]">×</span>vargas
      </a>

      <ul className="hidden md:flex gap-9 list-none">
        {navItems.map((item) => (
          <li key={item.num}>
            <a
              href={item.href}
              data-cursor="hover"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)] no-underline relative pb-1 group"
            >
              <span className="text-[var(--color-ink-dim)] mr-1.5">{item.num}</span>
              {item.label}
              <span className="absolute left-0 bottom-0 w-0 h-px bg-[var(--color-accent)] transition-all duration-500 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
