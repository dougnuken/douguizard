import type { Metadata } from "next";
import CvPage from "@/components/pages/CvPage";
import { cvMetadata } from "@/lib/metadata";
import { cvFingerprint } from "@/lib/cvFingerprint";

/** `cv-fingerprint` is read by `scripts/build-cv-pdf.mjs`; see `lib/cvFingerprint`. */
export const metadata: Metadata = {
  ...cvMetadata("es"),
  other: { "cv-fingerprint": cvFingerprint("es") },
};

export default function Page() {
  return <CvPage locale="es" />;
}
