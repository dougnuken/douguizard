import CvExperience from "@/components/cv/CvExperience";
import CvHeader from "@/components/cv/CvHeader";
import CvSidebar from "@/components/cv/CvSidebar";
import CvSkills from "@/components/cv/CvSkills";
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
      {/* Print only — see the `@media print` block. They live outside `#main`
          so they sit outside its padding and can reach every edge of the
          sheet, and they are fixed, so Chrome repeats them on every page. */}
      <div aria-hidden className="cv-print-surface hidden" />
      <div aria-hidden className="cv-print-grain hidden" />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1100px] px-6 pb-28 pt-24 md:px-12 md:pt-28 print:px-0 print:pb-0 print:pt-0"
      >
        <CvHeader />

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
      </main>
    </>
  );
}
