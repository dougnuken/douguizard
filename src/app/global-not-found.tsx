import type { Metadata } from "next";
import "./globals.css";
import RootDocument from "@/components/pages/RootDocument";
import NotFoundContent from "@/components/pages/NotFoundContent";
import { getDict } from "@/i18n/dictionaries";

/**
 * The 404 for an address no route matches.
 *
 * The site has two root layouts — one per language — so there is no single
 * layout a plain `not-found.tsx` could render inside. This file is Next's
 * answer to exactly that (`experimental.globalNotFound`): a whole document of
 * its own. It reuses the same `RootDocument`, so it has the header, the theme
 * and the fonts of every other page, in Spanish, with the way into English
 * one line further down.
 */
export const metadata: Metadata = {
  title: getDict("es").notFound.kicker,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootDocument locale="es" lost>
      <NotFoundContent locale="es" />
    </RootDocument>
  );
}
