import { certifications, education, experiences, languages, skills, tools } from "@/data/cv";
import { site } from "@/data/site";

/**
 * A stable digest of everything the CV actually prints.
 *
 * It exists to stop one specific failure: the PDF Doug hands to a recruiter
 * drifting behind the page it was made from. The CV he was still sending in
 * 2026 had him at Mercadolibre "Present" and no Naowee at all, because the
 * file and the facts had no way of noticing each other.
 *
 * So the digest covers content and nothing else — no comments, no formatting,
 * no source layout — and two things read it: the page renders it into a meta
 * tag, and `scripts/build-cv-pdf.mjs` records it beside the generated PDF. A
 * test compares the two, and any change to a date, a role, a bullet or a
 * profile fails the build until the PDF is regenerated.
 */
function payload() {
  return {
    name: site.name,
    headline: site.headline,
    email: site.email,
    phone: site.phone,
    domain: site.domain,
    location: site.location,
    summary: site.summaryLong,
    profiles: site.social.filter((s) => s.onCv).map((s) => s.href),
    experiences: experiences.map((e) => ({
      id: e.id,
      company: e.company.name,
      client: e.client ?? null,
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
export function cvFingerprint(): string {
  const text = JSON.stringify(payload());
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash ^ BigInt(text.charCodeAt(i) & 0xff)) * prime) & mask;
  }
  return hash.toString(16).padStart(16, "0");
}
