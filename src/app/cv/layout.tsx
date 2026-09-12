import type { Metadata } from "next";
import { site } from "@/data/site";
import { experiences } from "@/data/cv";
import { yearsOfExperience } from "@/lib/career";

// Computed, so adding an employer to cv.ts updates the description with no
// second edit. That is the whole point of the field.
const companies = experiences
  .filter((e) => e.era !== "earlier")
  .map((e) => e.company.name)
  .join(", ");

export const metadata: Metadata = {
  title: `CV — ${site.headline}`,
  description: `Curriculum vitae of ${site.name}. ${yearsOfExperience()} years of product design and design engineering across ${companies}.`,
  alternates: { canonical: site.cv.path },
  openGraph: {
    type: "profile",
    url: `https://douguizard.com${site.cv.path}`,
    title: `${site.name} — CV`,
    description: `${site.headline}. ${site.seo.description}`,
    images: [
      { url: site.seo.ogImage, width: 1200, height: 630, alt: `${site.name} — CV` },
    ],
  },
  robots: { index: true, follow: true },
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
