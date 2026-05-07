"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShinyBorder } from "@/components/ui/ShinyBorder";

const navItems = [
  { num: "01", label: "HOME", href: "#hero" },
  { num: "02", label: "ABOUT", href: "#manifesto" },
  { num: "03", label: "WORK", href: "#work" },
  { num: "04", label: "CONTACT", href: "#contact" },
];

interface NavItem {
  num: string;
  label: string;
  href: string;
}

const navLinkClass = "group relative flex items-center gap-2.5 px-5 py-3 text-[11px] font-mono tracking-[0.22em] uppercase no-underline transition-all duration-300";

function NavLink(props: { item: NavItem; isActive: boolean }) {
  const { item, isActive } = props;
  const linkStyle = {
    color: isActive ? "var(--color-ink-strong)" : "var(--color-ink-muted)",
  };
  return (
    <a href={item.href} data-cursor="hover" className={navLinkClass} style={linkStyle}>
      <span className="relative opacity-50 group-hover:opacity-100 transition-opacity z-10" style={{ color: "var(--color-accent)" }}>{item.num}</span>
      <span className="relative group-hover:text-[var(--color-ink-strong)] transition-colors z-10">{item.label}</span>
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 pointer-events-none"
          style={{ width: "70%", height: "16px" }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        >
          <svg viewBox="0 0 100 16" preserveAspectRatio="none" width="100%" height="100%">
            <defs>
              <linearGradient id="halo-soft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(167,139,250,0)" />
                <stop offset="50%" stopColor="rgba(167,139,250,0.55)" />
                <stop offset="100%" stopColor="rgba(167,139,250,0)" />
              </linearGradient>

              <linearGradient id="halo-mid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="10%" stopColor="rgba(196,181,253,0)" />
                <stop offset="50%" stopColor="rgba(196,181,253,0.95)" />
                <stop offset="90%" stopColor="rgba(196,181,253,0)" />
              </linearGradient>

              <linearGradient id="halo-core" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="30%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,1)" />
                <stop offset="70%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>

              <filter id="halo-blur-soft" x="-50%" y="-200%" width="200%" height="500%">
                <feGaussianBlur stdDeviation="3.5" />
              </filter>

              <filter id="halo-blur-mid" x="-50%" y="-200%" width="200%" height="500%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            <ellipse cx="50" cy="6" rx="48" ry="2.5" fill="url(#halo-soft)" filter="url(#halo-blur-soft)" />
            <rect x="0" y="5.4" width="100" height="1.2" fill="url(#halo-mid)" filter="url(#halo-blur-mid)" />
            <rect x="0" y="5.7" width="100" height="0.5" fill="url(#halo-core)" />
          </svg>
        </motion.span>
      )}
    </a>
  );
}

function MobileMenuLink(props: { item: NavItem; isActive: boolean; onClose: () => void }) {
  const { item, isActive, onClose } = props;
  const linkStyle = { color: isActive ? "var(--color-accent)" : "var(--color-ink-strong)" };
  const linkClass = "flex items-baseline gap-4 py-5 border-b border-[var(--color-line)] no-underline transition-all duration-300 active:opacity-60";
  return (
    <a href={item.href} data-cursor="hover" onClick={onClose} className={linkClass} style={linkStyle}>
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase opacity-50" style={{ color: "var(--color-accent)" }}>
        {item.num}
      </span>
      <span className="font-display text-3xl font-light tracking-[-0.02em]">
        {item.label}
      </span>
    </a>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const heroEl = document.getElementById("hero");
      const manifestoEl = document.getElementById("manifesto");
      const workEl = document.getElementById("work");
      const contactEl = document.getElementById("contact");

      const scrollY = window.scrollY + 200;

      const heroTop = heroEl?.offsetTop ?? 0;
      const manifestoTop = manifestoEl?.offsetTop ?? Infinity;
      const workTop = workEl?.offsetTop ?? Infinity;
      const contactTop = contactEl?.offsetTop ?? Infinity;

      let current = "hero";

      if (scrollY >= contactTop) {
        current = "contact";
      } else if (scrollY >= workTop) {
        current = "work";
      } else if (scrollY >= manifestoTop) {
        current = "manifesto";
      } else if (scrollY >= heroTop) {
        current = "hero";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const progressBarStyle = {
    scaleX: scrollYProgress,
    background: "linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-cool) 100%)",
  };

  const navWrapperStyle = {
    padding: scrolled ? "8px 16px" : "10px 20px",
    transition: "padding 0.4s var(--ease-quart-out)",
  };

  const dockClass = "rounded-full px-2.5 py-1 flex items-center gap-1";
  const dockStyle = {
    background: "rgba(7, 6, 15, 0.92)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 8px 32px -8px rgba(0,0,0,0.4)",
    transition: "all 0.4s var(--ease-quart-out)",
  };

  // Mobile glass top bar — wraps logo and hamburger so content has readable backing
  const mobileTopBarStyle = {
    background: "rgba(7, 6, 15, 0.65)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 4px 20px -8px rgba(0, 0, 0, 0.4)",
  };

  // Bloom layers — desktop only (mobile gets a clean glass top bar instead)
  const bloomCenterStyle = {
    background: "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(196,181,253,0.85) 0%, rgba(167,139,250,0.55) 18%, rgba(167,139,250,0.25) 40%, rgba(167,139,250,0.08) 65%, transparent 85%)",
    filter: "blur(20px)",
  };

  const bloomWideStyle = {
    background: "radial-gradient(ellipse 90% 100% at 50% -10%, rgba(167,139,250,0.4) 0%, rgba(125,90,200,0.2) 35%, transparent 75%)",
    filter: "blur(40px)",
  };

  const bloomCoreStyle = {
    background: "radial-gradient(ellipse 25% 100% at 50% 0%, rgba(255,255,255,0.4) 0%, rgba(196,181,253,0.6) 30%, transparent 70%)",
    filter: "blur(8px)",
  };

  const mobileOverlayStyle = {
    background: "rgba(7, 6, 15, 0.98)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
  };

  return (
    <>
      {/* Bloom decoration — desktop only, hidden on mobile to prevent the cropped-edge look */}
      <div className="hidden md:block fixed top-0 left-0 right-0 h-[280px] z-[38] pointer-events-none overflow-hidden" style={bloomWideStyle} />
      <div className="hidden md:block fixed top-0 left-0 right-0 h-[220px] z-[39] pointer-events-none overflow-hidden" style={bloomCenterStyle} />
      <div className="hidden md:block fixed top-0 left-0 right-0 h-[140px] z-[40] pointer-events-none overflow-hidden" style={bloomCoreStyle} />

      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left" style={progressBarStyle} />

      {/* Mobile glass top bar — full-width container backing logo + hamburger */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 h-[64px] z-[45] pointer-events-none"
        style={mobileTopBarStyle}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-5 left-5 md:top-8 md:left-12 z-[55] flex items-center gap-2"
      >
        <span className="font-display text-lg md:text-xl font-medium tracking-[-0.02em] text-[var(--color-ink-strong)]">
          Douguizard
        </span>
        <span
          className="font-display text-lg md:text-xl font-light leading-none animate-pulse-soft"
          style={{ color: "var(--color-accent)" }}
        >
          *
        </span>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-32px)]"
        style={navWrapperStyle}
      >
        <ShinyBorder borderRadius="9999px" duration={4}>
          <div className={dockClass} style={dockStyle}>
            {navItems.map((item, i) => {
              const sectionId = item.href.replace("#", "").replace("/", "");
              const isActive = activeSection === sectionId;
              return <NavLink key={i} item={item} isActive={isActive} />;
            })}
          </div>
        </ShinyBorder>
      </motion.nav>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3.5 right-5 z-[60] w-11 h-11 rounded-full glass-nav flex items-center justify-center cursor-pointer"
        aria-label="Toggle menu"
      >
        <div className="w-5 h-5 flex flex-col items-center justify-center gap-1">
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 4 : 0 }}
            className="w-5 h-px bg-[var(--color-ink-strong)] origin-center"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            className="w-5 h-px bg-[var(--color-ink-strong)]"
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -4 : 0 }}
            className="w-5 h-px bg-[var(--color-ink-strong)] origin-center"
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[55]"
            style={mobileOverlayStyle}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full pt-28 px-8 pb-8"
            >
              <div className="flex-1">
                {navItems.map((item, i) => {
                  const sectionId = item.href.replace("#", "").replace("/", "");
                  const isActive = activeSection === sectionId;
                  return (
                    <MobileMenuLink
                      key={i}
                      item={item}
                      isActive={isActive}
                      onClose={() => setMobileOpen(false)}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-muted)]">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full animate-pulse-glow" style={{ background: "var(--color-accent)" }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
                </span>
                <span>BCN · UTC-5 · Available 2026</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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