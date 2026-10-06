"use client";

import { getSite } from "@/data/site";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

/**
 * The only client component on `/cv`. No state, no effect: if a static PDF is
 * ever added to `site.cv.pdf` it becomes a plain download link and the browser
 * dialog is never opened.
 */
export default function PrintButton() {
  const site = getSite(useLocale());
  const t = useDict().cv;
  const LABEL = t.download;
  if (site.cv.pdf) {
    return (
      <a
        href={site.cv.pdf}
        // Named, not left to the URL: a recruiter's downloads folder should say
        // whose CV this is.
        download={t.downloadName(site.name)}
        className="btn-pill h-11 min-h-11 px-5 text-[14px] print:hidden"
      >
        {LABEL}
      </a>
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
