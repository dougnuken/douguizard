import { getCv, type Experience, type YearMonth } from "@/data/cv";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { yearsOfExperience } from "@/lib/career";

/**
 * The downloadable CV, as one HTML document per language, rendered from the
 * same `cv.ts` + `site.ts` that feed `/cv`. `scripts/build-cv-pdf.ts` prints it
 * to `public/cv/*.pdf` and stamps it with `cvFingerprint`, so the file and the
 * site cannot disagree.
 *
 * Built for applicant trackers first and people second: one column, no tables,
 * no CSS columns, dates inline (a right-aligned date column is read as a second
 * column and scrambles the text order), standard section titles, real list
 * bullets, ligatures off. Black on white, the site's light-theme ink. The fonts
 * arrive as static TrueType: variable fonts print as Type 3, which some
 * trackers cannot read.
 */

export interface SheetAssets {
  /** `@font-face` rules with the fonts inlined. */
  fontCss: string;
  /** Square portrait as a data URI. Omitted, the header has no photo. */
  photo?: string;
}

const LABELS = {
  es: {
    summary: "Resumen profesional",
    experience: "Experiencia laboral",
    earlier: "Experiencia anterior",
    skills: "Habilidades",
    tools: "Herramientas",
    education: "Educación",
    certifications: "Certificaciones",
    languages: "Idiomas",
    present: "Presente",
    mode: { remote: "Remoto", hybrid: "Híbrido", onsite: "Presencial" },
  },
  en: {
    summary: "Professional summary",
    experience: "Work experience",
    earlier: "Earlier experience",
    skills: "Skills",
    tools: "Tools",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
    present: "Present",
    mode: { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" },
  },
} as const;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** `**bold**` is a site convention; the sheet prints the words only. */
const plain = (s: string) => s.replace(/\*\*/g, "");

/** Ends a list with one full stop, not two after "EE. UU.". */
const stop = (s: string) => (s.endsWith(".") ? s : `${s}.`);

/** MM/YYYY: the one date shape every tracker parses. */
const ym = (d: YearMonth) => (d.month ? `${String(d.month).padStart(2, "0")}/${d.year}` : String(d.year));

const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function where(e: Experience, locale: Locale): string {
  const { city, country, region, mode } = e.location;
  const place = city ? [city, country].filter(Boolean).join(", ") : (region ?? "");
  return `${place} (${LABELS[locale].mode[mode]})`;
}

/**
 * "Aval Digital Labs (Banco de Occidente)". With an employer of record the
 * employer leads and the product goes in brackets: "Ideaware (Qrvey)".
 */
function org(e: Experience): string {
  if (e.employer) return `<strong>${esc(e.employer)}</strong> (${esc(e.company.name)})`;
  const client = e.client ? ` (${esc(e.client)})` : "";
  return `<strong>${esc(e.company.name)}</strong>${client}`;
}

function job(e: Experience, locale: Locale): string {
  const t = LABELS[locale];
  const dates = `${ym(e.start)} – ${e.end ? ym(e.end) : t.present}`;
  const line = `<p class="org">${org(e)} – ${esc(where(e, locale))} <span class="dates">| ${dates}</span>`;
  if (e.era === "earlier" || !e.impact?.length) {
    return `<article class="job"><h3>${esc(e.role)}</h3>${line}<br>${esc(plain(e.summary))}</p></article>`;
  }
  const bullets = e.impact.map((b) => `<li>${esc(plain(b))}</li>`).join("");
  return `<article class="job"><h3>${esc(e.role)}</h3>${line}</p><ul>${bullets}</ul></article>`;
}

export function renderCvSheet(locale: Locale, assets: SheetAssets): string {
  const site = getSite(locale);
  const cv = getCv(locale);
  const t = LABELS[locale];

  const profiles = site.social
    .filter((s) => s.onCv)
    .map((s) => `<a href="${esc(s.href)}">${esc(bare(s.href))}</a>`);
  const contact = [
    `${esc(site.location.city)}, ${esc(site.location.country)} (${esc(site.location.timezone)})`,
    `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a> – ${esc(site.phone.replace(/\./g, " "))}`,
    [profiles[0], `<a href="https://${esc(site.domain)}">${esc(site.domain)}</a>`, ...profiles.slice(1)].join(" – "),
  ].join("<br>");

  const core = cv.experiences.filter((e) => e.era !== "earlier").map((e) => job(e, locale)).join("");
  const earlier = cv.experiences.filter((e) => e.era === "earlier").map((e) => job(e, locale)).join("");

  const skills = cv.skills
    .map((g) => `<p><strong>${esc(g.label)}:</strong> ${stop(g.items.map((i) => esc(i.label)).join(", "))}</p>`)
    .join("");
  const tools = cv.tools.flatMap((g) => g.items).map(esc).join(", ");

  const education = cv.education
    .map(
      (e) =>
        `<p><strong>${esc(e.program)}</strong> – ${esc(e.institution)}${e.location ? `, ${esc(e.location)}` : ""} <span class="yr">${e.start.year}${e.end ? ` – ${e.end.year}` : ""}</span></p>`,
    )
    .join("");
  const certifications = cv.certifications
    .map((c) => `<p><strong>${esc(c.name)}</strong> – ${esc(c.issuer)} <span class="yr">${c.year}</span></p>`)
    .join("");
  const languages = cv.languages.map((l) => `<strong>${esc(l.name)}:</strong> ${stop(esc(l.level))}`).join(" ");

  const photo = assets.photo ? `<img class="photo" src="${assets.photo}" alt="">` : "";

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(`${site.name} – ${site.headline} – CV`)}</title>
<meta name="author" content="${esc(site.name)}">
<style>
${assets.fontCss}
${STYLE}
</style>
</head>
<body>
<header>
  <div class="id">
    <h1>${esc(site.name)}</h1>
    <p class="headline">${esc(site.headline)}</p>
    <p class="contact">${contact}</p>
  </div>
  ${photo}
</header>
<section>
  <h2>${t.summary}</h2>
  <p class="summary">${esc(cv.profile.summary(yearsOfExperience()))}</p>
  <p class="facts">${cv.profile.highlights.map(esc).join(" – ")}</p>
</section>
<section>
  <h2>${t.experience}</h2>
  ${core}
</section>
<section>
  <h2>${t.earlier}</h2>
  ${earlier}
</section>
<section class="skills">
  <h2>${t.skills}</h2>
  ${skills}
  <p><strong>${t.tools}:</strong> ${stop(tools)}</p>
</section>
<section class="list">
  <h2>${t.education}</h2>
  ${education}
</section>
<section class="list">
  <h2>${t.certifications}</h2>
  ${certifications}
</section>
<section class="list">
  <h2>${t.languages}</h2>
  <p>${languages}</p>
</section>
</body>
</html>
`;
}

const STYLE = `
:root {
  --paper: #ffffff;
  --ink: #0a0a0a;
  --ink-muted: #4f4e4b;
  --ink-dim: #6f6e6a;
  --line: #dcdcd9;
  --sans: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --mono: "Geist Mono", ui-monospace, Menlo, monospace;
  color-scheme: light;
}
@page { size: A4; margin: 13mm 16mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { background: #ededeb; }
body {
  background: var(--paper);
  color: var(--ink);
  font: 400 9.4pt/1.4 var(--sans);
  font-variant-ligatures: none;
  font-kerning: normal;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  width: 210mm;
  margin: 24px auto;
  padding: 15mm 17mm;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
@media print {
  html { background: none; }
  body { width: auto; margin: 0; padding: 0; box-shadow: none; }
}
@media screen and (max-width: 820px) {
  body { width: auto; margin: 0; padding: 24px 16px; box-shadow: none; }
}

header { display: flex; align-items: flex-start; gap: 7mm; }
.id { flex: 1 1 auto; min-width: 0; }
h1 { font-size: 25pt; line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; }
.headline { margin-top: 2.2mm; font-size: 11.5pt; line-height: 1.3; font-weight: 500; }
.contact { margin-top: 3.4mm; font-size: 8.8pt; line-height: 1.6; color: var(--ink-muted); }
.contact a { color: inherit; text-decoration: none; }
/* Grey, like the rest of the sheet. */
.photo { flex: 0 0 27mm; width: 27mm; height: 27mm; border-radius: 1.5mm; object-fit: cover; filter: grayscale(1); }

section { margin-top: 5mm; }
h2 {
  font: 600 8pt/1 var(--sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 1.8mm;
  border-bottom: 1.2pt solid var(--ink);
  margin-bottom: 3mm;
}
.summary { font-size: 10.2pt; line-height: 1.5; max-width: 165mm; }
.facts { margin-top: 2.6mm; font: 500 8.4pt/1.4 var(--mono); color: var(--ink-muted); }

h3, .org { break-after: avoid; }
li { break-inside: avoid; }
.job:not(:last-child) { margin-bottom: 3.6mm; padding-bottom: 3.6mm; border-bottom: 0.6pt solid var(--line); }
h3 { font-size: 10.8pt; line-height: 1.3; font-weight: 600; }
.dates { font: 400 8.4pt/1.3 var(--mono); color: var(--ink-muted); white-space: nowrap; margin-left: 1mm; }
.org { margin-top: 0.6mm; font-size: 9.4pt; color: var(--ink-muted); }
.org strong { color: var(--ink); font-weight: 600; }
ul { margin-top: 1.8mm; padding-left: 4.2mm; }
li { padding-left: 1mm; color: #262624; }
li + li { margin-top: 0.7mm; }
li::marker { content: "•  "; color: var(--ink-dim); font-size: 8pt; }

.skills p + p { margin-top: 1.5mm; }
.skills strong, .list strong { font-weight: 600; }
.list p + p { margin-top: 1mm; }
.list .yr { font: 400 8.4pt/1 var(--mono); color: var(--ink-muted); }
`;
