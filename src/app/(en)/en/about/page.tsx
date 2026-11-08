import type { Metadata } from "next";
import AboutPage from "@/components/pages/AboutPage";
import { aboutMetadata } from "@/lib/metadata";

export const metadata: Metadata = aboutMetadata("en");

export default function Page() {
  return <AboutPage locale="en" />;
}
