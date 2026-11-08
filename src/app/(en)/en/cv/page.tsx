import type { Metadata, Viewport } from "next";
import themeColors from "@/app/theme-colors.json";
import CvPage from "@/components/pages/CvPage";
import { cvMetadata } from "@/lib/metadata";
import { cvFingerprint } from "@/lib/cvFingerprint";

/** The same digest `scripts/build-cv-pdf.ts` stamps on the PDF; see `lib/cvFingerprint`. */
export const metadata: Metadata = {
  ...cvMetadata("en"),
  other: { "cv-fingerprint": cvFingerprint("en") },
};

/** /cv conserva su tema: esquema y color de barra dependen del sistema. */
export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
  ],
};

export default function Page() {
  return <CvPage locale="en" />;
}
