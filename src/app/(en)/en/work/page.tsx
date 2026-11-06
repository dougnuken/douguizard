import type { Metadata } from "next";
import WorkIndexPage from "@/components/pages/WorkIndexPage";
import { workMetadata } from "@/lib/metadata";

export const metadata: Metadata = workMetadata("en");

export default function Page() {
  return <WorkIndexPage locale="en" />;
}
