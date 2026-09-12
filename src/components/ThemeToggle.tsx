"use client";

import { useRef } from "react";

/**
 * Appearance switch. It holds **no** React state: which glyph shows is decided
 * by CSS off `:root[data-theme]` (see `globals.css`), so the server and the
 * first client render emit identical markup and there is no hydration
 * mismatch and no first-paint flash.
 */
export default function ThemeToggle() {
  const statusRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("dg-theme", next);
    } catch {
      // Safari private mode throws on write. The attribute still flipped, so
      // the choice holds for this session — that is the whole contract here.
    }
    buttonRef.current?.setAttribute(
      "aria-label",
      next === "light" ? "Switch to dark theme" : "Switch to light theme",
    );
    if (statusRef.current) {
      statusRef.current.textContent = next === "light" ? "Light theme" : "Dark theme";
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="theme-toggle"
        aria-label="Switch theme"
      >
        <svg
          data-glyph="moon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5Z" />
        </svg>
        <svg
          data-glyph="sun"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
      <span ref={statusRef} role="status" className="sr-only" />
    </>
  );
}
