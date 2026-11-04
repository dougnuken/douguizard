import { getCoverLetter } from "@/data/coverLetter";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";

/**
 * The cover letter as a one-page document, per language, rendered from the
 * same `coverLetter.ts` + `site.ts` that feed `/cv`. `scripts/build-cv-pdf.ts`
 * prints it next to the CV and stamps it with `letterFingerprint`, so the PDF
 * and the page cannot say different things.
 *
 * Same paper, fonts and ink as the CV sheet, so the two read as one
 * application when they land in the same inbox. Plain text, one column, no
 * photo: a letter is read, not scanned.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const TITLE = { en: "Cover letter", es: "Carta de presentación" } as const;

export function renderLetterSheet(locale: Locale, assets: { fontCss: string }): string {
  const site = getSite(locale);
  const letter = getCoverLetter(locale);

  const profiles = site.social
    .filter((s) => s.onCv)
    .map((s) => `<a href="${esc(s.href)}">${esc(bare(s.href))}</a>`);
  const contact = [
    `${esc(site.location.city)}, ${esc(site.location.country)}`,
    `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a> – ${esc(site.phone.replace(/\./g, " "))}`,
    [`<a href="https://${esc(site.domain)}">${esc(site.domain)}</a>`, ...profiles].join(" – "),
  ].join("<br>");

  const body = letter.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n  ");

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(`${site.name} – ${TITLE[locale]}`)}</title>
<meta name="author" content="${esc(site.name)}">
<style>
${assets.fontCss}
${STYLE}
</style>
</head>
<body>
<header>
  <h1>${esc(site.name)}</h1>
  <p class="headline">${esc(site.headline)}</p>
  <p class="contact">${contact}</p>
</header>
<main>
  <p class="date">${esc(letter.updated)}</p>
  <p class="salutation">${esc(letter.salutation)}</p>
  ${body}
  <p class="signoff">${esc(letter.signoff)}</p>
  <p class="name">${esc(site.name)}</p>
</main>
</body>
</html>
`;
}

const STYLE = `
:root {
  --paper: #ffffff;
  --ink: #0a0a0a;
  --ink-muted: #4f4e4b;
  --sans: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --mono: "Geist Mono", ui-monospace, Menlo, monospace;
  color-scheme: light;
}
@page { size: A4; margin: 18mm 22mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { background: #ededeb; }
body {
  background: var(--paper);
  color: var(--ink);
  font: 400 10.4pt/1.55 var(--sans);
  font-variant-ligatures: none;
  font-kerning: normal;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  width: 210mm;
  margin: 24px auto;
  padding: 18mm 22mm;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
@media print {
  html { background: none; }
  body { width: auto; margin: 0; padding: 0; box-shadow: none; }
}
@media screen and (max-width: 820px) {
  body { width: auto; margin: 0; padding: 24px 16px; box-shadow: none; }
}

header { padding-bottom: 5mm; border-bottom: 1.2pt solid var(--ink); }
h1 { font-size: 22pt; line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; }
.headline { margin-top: 2mm; font-size: 11pt; line-height: 1.3; font-weight: 500; }
.contact { margin-top: 3mm; font-size: 8.8pt; line-height: 1.6; color: var(--ink-muted); }
.contact a { color: inherit; text-decoration: none; }

main { margin-top: 9mm; max-width: 158mm; }
.date { font: 400 8.6pt/1.4 var(--mono); color: var(--ink-muted); margin-bottom: 7mm; }
main p + p { margin-top: 3.6mm; }
.signoff { margin-top: 7mm !important; }
.name { margin-top: 1mm !important; font-weight: 600; }
`;
