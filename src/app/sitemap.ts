import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/work";

const BASE = "https://douguizard.com";

/**
 * Every indexable URL, and nothing else.
 *
 * No `priority` and no `changeFrequency`: Google states plainly that it
 * ignores both, and a file full of values nobody reads is a file nobody
 * maintains. No `lastModified` either — it used to be `new Date()`, which made
 * every build announce that every page had changed. Google uses lastmod only
 * where it judges it accurate, and a build timestamp never is. An honest
 * omission beats a field that trains a crawler to distrust the file.
 *
 * Worth adding back the day each case study carries a real `updated` date in
 * `work.ts` — then it would be true, and it would be worth something.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE },
    { url: `${BASE}/cv` },
    ...caseStudies.map((c) => ({ url: `${BASE}/work/${c.slug}` })),
  ];
}
