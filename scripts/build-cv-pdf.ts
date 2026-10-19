// Print each language's CV to the PDFs that its `site.cv` hands out, with and
// without the photo, and stamp each language with the content digest of the
// data it was printed from, so a stale file cannot survive a test run. Spanish and English are separate sheets
// with separate stamps: changing a Spanish bullet must fail the Spanish check.
//
//   npm run cv:pdf
//
// The sheet is `src/lib/cvSheet.ts`, rendered straight from `cv.ts` + `site.ts`:
// no server, no build. Chrome does the printing, with the Playwright Chromium
// when it is installed, Doug's Chrome on a Mac, or `CHROME=/path/to/chrome`.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { Locale } from "@/i18n/config";
import { cvFingerprint } from "@/lib/cvFingerprint";
import { renderCvSheet } from "@/lib/cvSheet";

// Two sheets per language, same content: with the photo and without it. The
// paths are the ones `site.cv` hands out. One stamp per language covers both.
const SHEETS: { locale: Locale; withPhoto: string; noPhoto: string; stamp: string }[] = [
  {
    locale: "es",
    withPhoto: "public/cv/doug-vargas-cv-es.pdf",
    noPhoto: "public/cv/doug-vargas-cv-es-sin-foto.pdf",
    stamp: "public/cv/cv.stamp.es.json",
  },
  {
    locale: "en",
    withPhoto: "public/cv/doug-vargas-cv.pdf",
    noPhoto: "public/cv/doug-vargas-cv-no-photo.pdf",
    stamp: "public/cv/cv.stamp.json",
  },
];

/** Two A4 pages is the target; the test still allows three. */
const PAGE_TARGET = 2;

const CHROME =
  process.env.CHROME ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/opt/pw-browsers/chromium"].find((p) =>
    existsSync(p),
  ) ??
  "google-chrome";

// Static TrueType, vendored (OFL): printing must not depend on the network,
// and Google's variable fonts would print as Type 3.
const FONTS: [family: string, weight: number, file: string][] = [
  ["Archivo", 400, "Archivo-400.ttf"],
  ["Archivo", 500, "Archivo-500.ttf"],
  ["Archivo", 600, "Archivo-600.ttf"],
  ["Archivo", 700, "Archivo-700.ttf"],
  ["Geist Mono", 400, "GeistMono-400.ttf"],
  ["Geist Mono", 500, "GeistMono-500.ttf"],
];
const fontCss = FONTS.map(([family, weight, file]) => {
  const data = readFileSync(resolve("scripts/cv-fonts", file)).toString("base64");
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};src:url(data:font/ttf;base64,${data}) format("truetype");}`;
}).join("\n");

const photo = `data:image/jpeg;base64,${readFileSync(resolve("public/portrait/doug-cv-photo.jpg")).toString("base64")}`;

const work = mkdtempSync(join(tmpdir(), "cv-pdf-"));

/** Prints one sheet and returns its page count and size. */
function print(locale: Locale, out: string, withPhoto: boolean) {
  const html = join(work, `cv-${locale}-${withPhoto ? "photo" : "plain"}.html`);
  writeFileSync(html, renderCvSheet(locale, { fontCss, photo: withPhoto ? photo : undefined }));
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${join(work, "profile")}`,
      // Chrome will not start as root without it — a CI container, not a Mac.
      ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
      `--print-to-pdf=${resolve(out)}`,
      `file://${html}`,
    ],
    { stdio: "ignore" },
  );
  const buf = readFileSync(out);
  // Chrome leaves the page tree readable enough to count without a parser.
  const pages = (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(JSON.stringify({ out, pages, bytes: buf.length }));
  if (pages > PAGE_TARGET) console.error(`WARNING: ${out} printed ${pages} pages. ${PAGE_TARGET} is the target.`);
  return { pages, bytes: buf.length };
}

try {
  for (const sheet of SHEETS) {
    const a = print(sheet.locale, sheet.withPhoto, true);
    const b = print(sheet.locale, sheet.noPhoto, false);
    const stamp = {
      fingerprint: cvFingerprint(sheet.locale),
      // The longer of the two, so the page budget covers both.
      pages: Math.max(a.pages, b.pages),
      bytes: a.bytes,
      bytesNoPhoto: b.bytes,
      paper: "A4",
    };
    writeFileSync(sheet.stamp, `${JSON.stringify(stamp, null, 2)}\n`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
