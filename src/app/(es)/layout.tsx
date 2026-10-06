import type { Metadata, Viewport } from "next";
import "../globals.css";
import themeColors from "../theme-colors.json";
import RootDocument from "@/components/pages/RootDocument";
import { rootMetadata } from "@/lib/metadata";

/**
 * The Spanish root layout. Spanish and English are two root layouts, one per
 * route group, so each document is served with its own `<html lang>` — see
 * `src/i18n/config.ts` for how the two trees map onto each other.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
  ],
};

export const metadata: Metadata = rootMetadata("es");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
