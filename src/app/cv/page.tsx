import CvExperience from "@/components/cv/CvExperience";
import CvHeader from "@/components/cv/CvHeader";
import CvLetter from "@/components/cv/CvLetter";
import CvSidebar from "@/components/cv/CvSidebar";
import CvSkills from "@/components/cv/CvSkills";
import { site } from "@/data/site";
import { cvFingerprint } from "@/lib/cvFingerprint";

/** Read by `scripts/build-cv-pdf.mjs`; see `lib/cvFingerprint`. */
export const metadata = { other: { "cv-fingerprint": cvFingerprint() } };

/**
 * The CV, rendered from `cv.ts` + `site.ts`. A server component end to end —
 * the only client code on the route is `PrintButton`. No WebGL, no scroll
 * hijack, no cursor: the page has to survive a printer and a text browser.
 */
export default function CvPage() {
  return (
    <>
      {/* Print only — see the `@media print` block. Fixed, so Chrome repeats
          it on every sheet, and outside `#main` so nothing it does can move a
          line of type. The purple wash that used to sit beside it now rides
          the root background instead: only the root reaches the margin box. */}
      <div aria-hidden className="cv-print-grain hidden" />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1100px] px-6 pb-28 pt-24 md:px-12 md:pt-28 print:px-0 print:pb-0 print:pt-0"
      >
        <CvHeader />

        {/* The letter, then the record. On the sheet the letter is not there
            at all — see `CvLetter`. */}
        <CvLetter />

        <div className="cv-grid mt-4 grid grid-cols-1 gap-x-16 gap-y-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <CvExperience />
          </div>
          <CvSidebar />
        </div>

        {/*
          Skills and Tools close the document at full measure rather than inside
          the left column: the sidebar has run out by then, and a dense three-up
          block reads better than two narrow ones beside 3,000 px of empty rail.
          Print collapses everything to one flow, so `05 §6` is unaffected.
        */}
        <CvSkills />

        {/* The route had no footer, which is also the only landmark the rest
            of the site closes with. Kept on the sheet: the last page of a CV
            should say whose it is and where it came from. */}
        <footer className="cv-colophon hairline-t mt-14 flex flex-wrap items-center justify-between gap-3 pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-dim)]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <a
            href={`https://${site.domain}`}
            className="inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-muted)] no-underline hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
          >
            {site.domain}
          </a>
        </footer>
      </main>
    </>
  );
}
