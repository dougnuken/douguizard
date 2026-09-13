"use client";

import { site } from "@/data/site";

const LABEL = "Download PDF";

/**
 * The only client component on `/cv`. No state, no effect: if a static PDF is
 * ever added to `site.cv.pdf` it becomes a plain download link and the browser
 * dialog is never opened.
 */
export default function PrintButton() {
  if (site.cv.pdf) {
    return (
      <a
        href={site.cv.pdf}
        // Named, not left to the URL: a recruiter's downloads folder should say
        // whose CV this is.
        download={`${site.name} — CV.pdf`}
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
