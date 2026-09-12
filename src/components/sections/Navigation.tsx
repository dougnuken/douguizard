"use client";

import { motion, useScroll, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Document order matters: the scroll-spy keeps the LAST section whose top has
 * been passed, so this array must mirror the order of the sections in the page.
 * `#work` now exists (SelectedWork); `#about` (T5) does not exist in the DOM
 * yet — the spy skips missing nodes instead of assuming a position.
 */
const navItems: NavItem[] = [
  { label: "HOME", href: "#hero" },
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

const sectionIdOf = (item: NavItem) => item.href.slice(1);

function DesktopNavLink(props: { item: NavItem; isActive: boolean; reduceMotion: boolean }) {
  const { item, isActive, reduceMotion } = props;

  return (
    <a
      href={item.href}
      className="kicker relative py-2 no-underline transition-colors duration-200 hover:text-[var(--ink)]"
      style={{
        color: isActive ? "var(--ink)" : "var(--ink-muted)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      {item.label}
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-0 -bottom-px block h-px"
          style={{ background: "var(--ink)" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 36 }
          }
        />
      )}
    </a>
  );
}

function MobileNavLink(props: { item: NavItem; isActive: boolean; onClose: () => void }) {
  const { item, isActive, onClose } = props;

  return (
    <a
      href={item.href}
      onClick={onClose}
      className="hairline-b text-display block py-6 no-underline transition-colors duration-200"
      style={{
        color: isActive ? "var(--ink)" : "var(--ink-muted)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      {item.label}
    </a>
  );
}

export default function Navigation() {
  const [activeSection, setActiveSection] = useState(sectionIdOf(navItems[0]));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      let current = sectionIdOf(navItems[0]);

      for (const item of navItems) {
        const el = document.getElementById(sectionIdOf(item));
        if (!el) continue; // null-safe: #work and #about land in T3/T5
        if (scrollY >= el.offsetTop) current = sectionIdOf(item);
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left"
        style={{ scaleX: scrollYProgress, background: "var(--ink)" }}
      />

      <header
        className="hairline-b fixed inset-x-0 top-0 z-[55] h-16 md:h-[72px]"
        style={{ background: "var(--paper)" }}
      >
        <div className="relative mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-12">
          <a href="#hero" className="flex items-baseline gap-1 no-underline">
            <span className="font-display text-base font-medium tracking-[-0.02em] text-[var(--ink)] md:text-lg">
              Douguizard
            </span>
            <span
              className="font-display text-base leading-none font-light md:text-lg"
              style={{ color: "var(--ink)" }}
            >
              *
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex"
          >
            {navItems.map((item) => (
              <DesktopNavLink
                key={item.href}
                item={item}
                isActive={activeSection === sectionIdOf(item)}
                reduceMotion={reduceMotion}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <span
              className="kicker hidden lg:block"
              style={{ color: "var(--ink-dim)" }}
            >
              BCN · UTC-5
            </span>
            <a
              href="#contact"
              className="btn-pill btn-solid"
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.8125rem" }}
            >
              Let&apos;s talk
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 -mr-2 cursor-pointer items-center justify-center md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className="flex w-5 flex-col items-end gap-[5px]">
              <motion.span
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 3 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="block h-px w-5 origin-center bg-[var(--ink)]"
              />
              <motion.span
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -3 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="block h-px w-5 origin-center bg-[var(--ink)]"
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
            style={{ background: "var(--paper)" }}
          >
            <nav
              aria-label="Mobile navigation"
              className="flex h-full flex-col px-6 pt-24 pb-10"
            >
              <div className="flex-1">
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    item={item}
                    isActive={activeSection === sectionIdOf(item)}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              <span className="kicker" style={{ color: "var(--ink-dim)" }}>
                BCN · UTC-5
              </span>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
