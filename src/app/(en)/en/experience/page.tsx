import type { Metadata } from "next";
import ExperiencePage from "@/components/pages/ExperiencePage";
import { experienceMetadata } from "@/lib/metadata";

export const metadata: Metadata = experienceMetadata("en");

export default function Page() {
  return <ExperiencePage locale="en" />;
}
