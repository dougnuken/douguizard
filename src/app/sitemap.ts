import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/work";

const BASE = "https://douguizard.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // One build-time timestamp. Calling new Date() per entry would make every
  // build claim every page changed, which trains crawlers to ignore it.
  const lastModified = new Date();

  return [
    { url: BASE, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/cv`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...caseStudies.map((c) => ({
      url: `${BASE}/work/${c.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
