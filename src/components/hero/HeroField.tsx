"use client";

import { useEffect, useState } from "react";
import Velaris from "@/components/hero/Velaris";

type Theme = "dark" | "light";

/**
 * One palette per theme.
 *
 * The field is opaque — it mixes its colours INTO a ground rather than over
 * one — so the ground has to be the page's own paper or the seam shows no
 * matter how softly it is masked. Everything else is the site's violet: the
 * same hue the CV sheet is washed in, arriving at near-white at its brightest.
 */
const FIELD: Record<Theme, { bg: string; colors: string[] }> = {
  dark: { bg: "#101010", colors: ["#241a5c", "#5b3fd6", "#a08bf8", "#f2f1ee"] },
  light: { bg: "#fafaf8", colors: ["#d7ccfb", "#a98cf2", "#6d46ee", "#ffffff"] },
};

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * The hero's field, in the theme the page is actually wearing.
 *
 * A shader takes numbers, not custom properties, so the palette cannot come
 * from CSS and something has to watch the toggle. `data-theme` on the root is
 * where `ThemeToggle` writes, so that is what this observes — one attribute,
 * one observer, no context and no provider.
 */
export default function HeroField() {
  // Dark on the server, which is what the pre-paint script falls back to.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
    const mo = new MutationObserver(() => setTheme(readTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const { bg, colors } = FIELD[theme];
  return <Velaris bg={bg} colors={colors} speed={1.15} grain={0.35} resolution={0.55} />;
}
