import type { Metadata, Viewport } from "next";
import "../globals.css";
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
  colorScheme: "dark",
  themeColor: "#060608",
};

export const metadata: Metadata = rootMetadata("es");

/**
 * `modal` es el slot de la hoja de casos (F6, 07 §1.2): `(es)` y `@modal` no son
 * segmentos, así que `@modal/(.)work/[slug]` intercepta `/work/[slug]`.
 */
export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <RootDocument locale="es">
      {children}
      {modal}
    </RootDocument>
  );
}
