import type { Metadata } from "next";
import CvPage from "@/components/pages/CvPage";
import { cvMetadata } from "@/lib/metadata";
import { cvFingerprint } from "@/lib/cvFingerprint";

/** `cv-fingerprint` is read by `scripts/build-cv-pdf.mjs`; see `lib/cvFingerprint`. */
export const metadata: Metadata = {
  ...cvMetadata("en"),
  other: { "cv-fingerprint": cvFingerprint("en") },
};

export default function Page() {
  return <CvPage locale="en" />;
}
