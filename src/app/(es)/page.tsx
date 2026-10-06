import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { homeMetadata } from "@/lib/metadata";

export const metadata: Metadata = homeMetadata("es");

export default function Page() {
  return <HomePage locale="es" />;
}
