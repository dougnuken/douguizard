import { getCv } from "@/data/cv";
import { yearsOfExperience } from "@/lib/career";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";

/**
 * A stable digest of everything the CV actually prints.
 *
 * It exists to stop one specific failure: the PDF Doug hands to a recruiter
 * drifting behind the page it was made from. The CV he was still sending in
 * 2026 had him at Mercadolibre "Present" and no Naowee at all, because the
 * file and the facts had no way of noticing each other.
 *
 * So the digest covers content and nothing else — no comments, no formatting,
 * no source layout. `scripts/build-cv-pdf.ts` records it beside each PDF it
 * prints from `lib/cvSheet` (and `/cv` renders it into a meta tag). A test
 * compares the stamp with the data, and any change to a date, a role, a bullet
 * or a profile fails the build until the PDF is regenerated.
 */
function payload(locale: Locale) {
  const site = getSite(locale);
  const { certifications, education, experiences, languages, profile, skills, tools } = getCv(locale);
  return {
    name: site.name,
    headline: site.headline,
    email: site.email,
    phone: site.phone,
    domain: site.domain,
    location: site.location,
    // The sheet's own paragraph, with the year count already in it: when the
    // count ticks over, the PDF is stale and this says so.
    summary: profile.summary(yearsOfExperience()),
    highlights: profile.highlights,
    profiles: site.social.filter((s) => s.onCv).map((s) => s.href),
    experiences: experiences.map((e) => ({
      id: e.id,
      company: e.company.name,
      client: e.client ?? null,
      employer: e.employer ?? null,
      role: e.role,
      start: e.start,
      end: e.end ?? null,
      location: e.location,
      summary: e.summary,
      impact: e.impact ?? [],
    })),
    education: education.map((e) => [e.start, e.end, e.program, e.institution]),
    certifications: certifications.map((c) => [c.year, c.name, c.issuer]),
    languages: languages.map((l) => [l.name, l.level]),
    skills: skills.map((g) => [g.id, g.label, g.items.map((i) => i.label)]),
    tools: tools.map((g) => [g.id, g.label, g.items]),
  };
}

/**
 * FNV-1a, 64-bit, hex. Not a security hash — it only has to change when the
 * content changes, and it has to produce the same answer in Node and in the
 * browser without importing anything.
 */
export function cvFingerprint(locale: Locale = "en"): string {
  const text = JSON.stringify(payload(locale));
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash ^ BigInt(text.charCodeAt(i) & 0xff)) * prime) & mask;
  }
  return hash.toString(16).padStart(16, "0");
}
