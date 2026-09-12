import PrintButton from "@/components/cv/PrintButton";
import LinkedInMark from "@/components/icons/LinkedInMark";
import { site } from "@/data/site";

const linkedin = site.social.find((s) => s.primary) ?? site.social[0];

/** `https://linkedin.com/in/dougvargasco` → `linkedin.com/in/dougvargasco`. */
const linkedinLabel = linkedin.href.replace(/^https?:\/\//, "");

const dot = <span aria-hidden="true">·</span>;

/**
 * The masthead of the document. A CV is not a poster: the name sits at
 * `--step-title`, not `--step-display`, and the only decorative surface on the
 * route is the single glow behind it — dropped in print.
 */
export default function CvHeader() {
  return (
    <header className="cv-header-pad relative isolate pb-10">
      <div className="glow-corner cv-glow print:hidden" aria-hidden="true" />

      <div className="relative z-[1] flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="cv-name font-display text-[length:var(--step-title)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]">
              {site.name}
            </h1>
            <p className="cv-headline text-[length:var(--step-lead)] leading-[1.3] tracking-[-0.01em] text-[var(--ink-muted)]">
              {site.headline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden max-sm:w-full max-sm:[&>*]:flex-1">
            <a
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill--solid h-11 min-h-11 px-5 text-[14px]"
            >
              <LinkedInMark />
              {linkedin.label}
            </a>
            <PrintButton />
          </div>
        </div>

        <address className="cv-meta flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] not-italic leading-[1.7] text-[var(--ink-muted)]">
          <span>
            {site.location.city}, {site.location.country}
          </span>
          {dot}
          <span>{site.location.timezone}</span>
          {dot}
          <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
            {site.email}
          </a>
          {dot}
          <a
            href="https://douguizard.com"
            className="underline-offset-4 hover:underline"
          >
            douguizard.com
          </a>
          {/* Printed on the sheet, never on the public page: a CV handed to a
              recruiter carries a phone number, a scraped web page should not. */}
          <span className="cv-phone cv-print-only">{dot}</span>
          <span className="cv-phone cv-print-only">{site.phone}</span>
          <span className="cv-print-only">{dot}</span>
          <span className="cv-print-only">{linkedinLabel}</span>
        </address>

        <p className="cv-summary cv-summary-lead hairline-t max-w-[70ch] pt-6 text-[length:var(--step-body)] leading-[1.65] text-pretty text-[var(--ink-muted)]">
          {site.summaryLong}
        </p>
      </div>
    </header>
  );
}
