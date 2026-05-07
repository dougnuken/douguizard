"use client";

import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { num: "01", label: "WORK", href: "#work" },
  { num: "02", label: "ABOUT", href: "#manifesto" },
  { num: "03", label: "CONTACT", href: "#contact" },
  { num: "04", label: "CV", href: "/cv" },
];

interface NavItem {
  num: string;
  label: string;
  href: string;
}

const navLinkClass = "group relative flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono tracking-[0.22em] uppercase no-underline transition-all duration-300";

function NavLink(props: { item: NavItem; isActive: boolean }) {
  const { item, isActive } = props;
  const linkStyle = {
    color: isActive ? "var(--color-ink-strong)" : "var(--color-ink-muted)",
    background: isActive ? "rgba(167, 139, 250, 0.15)" : "transparent",
  };
  return (
    <a href={item.href} data-cursor="hover" className={navLinkClass} style={linkStyle}>
      <span className="opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-accent)" }}>{item.num}</span>
      <span className="group-hover:text-[var(--color-ink-strong)] transition-colors">{item.label}</span>
    </a>
  );
} 

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["work", "manifesto", "contact"];
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progressBarStyle = {
    scaleX: scrollYProgress,
    background: "linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-cool) 100%)",
  };

  const navStyle = {
    padding: scrolled ? "8px 14px" : "10px 18px",
    transition: "padding 0.4s var(--ease-quart-out)",
  };

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left" style={progressBarStyle} />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-3"
      >
        <span className="font-display text-base md:text-lg font-medium tracking-tight text-[var(--color-ink-strong)]">doug</span>
        <span className="block w-1 h-1 rounded-full animate-pulse-soft" style={{ background: "var(--color-accent)" }} />
        <span className="font-display italic text-base md:text-lg font-light text-[var(--color-ink-muted)]">vargas</span>
      </motion.div>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
        style={navStyle}
      >
        <div className="glass-nav rounded-full px-2 py-1.5 flex items-center gap-1" style={{ transition: "all 0.4s var(--ease-quart-out)" }}>
          {navItems.map((item, i) => {
            const sectionId = item.href.replace("#", "").replace("/", "");
            const isActive = activeSection === sectionId;
            return <NavLink key={i} item={item} isActive={isActive} />;
          })}
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed top-8 right-12 z-50 items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)]"
      >
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full animate-pulse-glow" style={{ background: "var(--color-accent)" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
        </span>
        <span>BCN · UTC-5</span>
      </motion.div>
    </>
  );
}