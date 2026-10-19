"use client";

import { getSite } from "@/data/site";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

/**
 * The only client component on `/cv`. No state, no effect: with a static PDF
 * in `site.cv.pdf` these are plain download links and the browser dialog is
 * never opened. The sheet with the photo leads; the one without it sits beside
 * it for hiring that expects no photo.
 */
export default function PrintButton() {
  const site = getSite(useLocale());
  const t = useDict().cv;
  const LABEL = t.download;
  if (site.cv.pdf) {
    return (
      <>
        <a
          href={site.cv.pdf}
          // Named, not left to the URL: a recruiter's downloads folder should say
          // whose CV this is.
          download={t.downloadName(site.name)}
          className="btn-pill h-11 min-h-11 px-5 text-[14px] print:hidden"
        >
          {LABEL}
        </a>
        {site.cv.pdfNoPhoto ? (
          <a
            href={site.cv.pdfNoPhoto}
            download={t.downloadName(site.name, false)}
            className="inline-flex h-11 min-h-11 items-center whitespace-nowrap px-2 text-[14px] max-sm:basis-full max-sm:justify-center text-[var(--ink-muted)] underline underline-offset-4 hover:text-[var(--ink)] print:hidden"
          >
            {t.downloadNoPhoto}
          </a>
        ) : null}
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-pill h-11 min-h-11 px-5 text-[14px] print:hidden"
    >
      {LABEL}
    </button>
  );
}
