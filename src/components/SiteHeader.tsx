"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/data/site";
import { sections } from "@/data/sections";
import ThemeToggle from "@/components/ThemeToggle";
import LinkedInMark from "@/components/icons/LinkedInMark";
import {
  getActiveSection,
  getServerActiveSection,
  subscribeActiveSection,
} from "@/lib/activeSection";

const linkedin = site.social.find((s) => s.primary) ?? site.social[0];

/** Panels the header links to. The Home panel is the brand's own target. */
const navSections = sections.filter((s) => s.num !== "00");

const linkClass =
  "no-underline transition-colors duration-200 hover:text-[var(--ink)] hover:underline hover:underline-offset-4 hover:decoration-1";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const active = useSyncExternalStore(
    subscribeActiveSection,
    getActiveSection,
    getServerActiveSection,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center gap-4 px-6 md:px-12">
        <div className="flex shrink-0 items-center gap-2.5">
          {/* The one circle in a system with no rounded corners, and a face is
              the reason it gets one. `aria-hidden`: the link beside it already
              says whose site this is, and a second announcement of the same
              name is noise. */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 no-underline"
            aria-label={`${site.brand} — home`}
          >
            <Image
              src="/portrait/doug-avatar-256.webp"
              alt=""
              aria-hidden
              width={256}
              height={256}
              priority
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
              {site.brand}
            </span>
          </Link>

          {/* Status, not decoration. `title` carries what the word actually
              offers, so the badge is never a claim on its own. */}
          {/* Below `sm` the header has no room for the word, so the dot carries
              the status alone — hence the accessible name on the wrapper. */}
          <span
            title={site.availability.note}
            className="inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span aria-hidden className="status-dot" />
            {/* Below `sm` the header has no room for the word, so it goes to the
                screen-reader layer rather than out of the document: `aria-label`
                on a span with no role is prohibited, and the dot alone says
                nothing. */}
            <span className="kicker kicker-ok sr-only sm:not-sr-only sm:inline">
              {site.availability.badge}
            </span>
          </span>
        </div>

        <nav
          aria-label="Sections"
          className="ml-auto hidden items-center gap-7 lg:flex"
        >
          {isHome &&
            navSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`kicker ${linkClass} ${
                  active === s.id ? "font-medium text-[var(--ink)]" : ""
                }`}
              >
                {s.label}
              </a>
            ))}
          {!isHome && (
            <Link href="/#work" className={`kicker ${linkClass}`}>
              Work
            </Link>
          )}
          <Link href={site.cv.path} className={`kicker ${linkClass}`}>
            CV
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-8">
          {/* Icon-only on a phone. The word costs ~60px the wordmark needs —
              it was what truncated the brand to "Dou…" at 320 — and LinkedIn is
              still spelled out in the hero and in the mobile menu. */}
          <a
            href={linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={linkedin.label}
            className="btn-pill h-10 min-h-10 px-3 text-[13px] sm:px-4"
          >
            <LinkedInMark />
            <span className="hidden sm:inline">{linkedin.label}</span>
          </a>
          <ThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="theme-toggle lg:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
              style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform var(--dur) var(--ease-out)" }}
            >
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Menu"
        hidden={!open}
        className="hairline-b absolute inset-x-0 top-full bg-[var(--paper)] px-6 pb-3 lg:hidden"
      >
        <ul className="flex flex-col">
          {isHome &&
            navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={`hairline-b flex min-h-12 items-center text-[15px] no-underline ${
                    active === s.id ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          {!isHome && (
            <li>
              <Link
                href="/#work"
                onClick={() => setOpen(false)}
                className="hairline-b flex min-h-12 items-center text-[15px] text-[var(--ink-muted)] no-underline"
              >
                Work
              </Link>
            </li>
          )}
          <li>
            <Link
              href={site.cv.path}
              onClick={() => setOpen(false)}
              className="hairline-b flex min-h-12 items-center text-[15px] text-[var(--ink-muted)] no-underline"
            >
              CV
            </Link>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center text-[15px] text-[var(--ink-muted)] no-underline"
            >
              Email
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
