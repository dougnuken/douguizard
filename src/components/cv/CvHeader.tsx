import { Fragment } from "react";
import Image from "next/image";
import PrintButton from "@/components/cv/PrintButton";
import LinkedInMark from "@/components/icons/LinkedInMark";
import { site } from "@/data/site";

const linkedin = site.social.find((s) => s.primary) ?? site.social[0];

/** `https://www.behance.net/dougvargas` → `behance.net/dougvargas`. */
const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "");

/**
 * The profiles Doug picked for the CV. Printed, not linked as labels: on paper
 * an address has to be typable, and a page that cannot be clicked should not
 * pretend otherwise.
 */
const cvProfiles = site.social.filter((s) => s.onCv);

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
          {/* Circular, as on the reference sheet, and the one round corner in
              the document. It survives print: a CV that arrives as a PDF is
              read on a screen, and a face at the top of it is the difference
              between a record and a person. */}
          <div className="flex min-w-0 items-end gap-6">
            <Image
              src="/portrait/doug-avatar-256.webp"
              alt=""
              aria-hidden
              width={256}
              height={256}
              priority
              className="cv-portrait h-[92px] w-[92px] shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="cv-name font-display text-[length:var(--step-title)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]">
                {site.name}
              </h1>
              <p className="cv-headline text-[length:var(--step-lead)] leading-[1.3] tracking-[-0.01em] text-[var(--ink-muted)]">
                {site.headline}
              </p>
            </div>
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
            href={`https://${site.domain}`}
            className="underline-offset-4 hover:underline"
          >
            {site.domain}
          </a>
          {/* Printed on the sheet, never on the public page: a CV handed to a
              recruiter carries a phone number, a scraped web page should not. */}
          <span className="cv-phone cv-print-only">{dot}</span>
          <span className="cv-phone cv-print-only">{site.phone}</span>
          {cvProfiles.map((p) => (
            // Two siblings, not a wrapper: `.cv-print-only` forces
            // `display: inline` in print, which would collapse a wrapper into
            // one unbreakable flex item and stop the line wrapping cleanly.
            <Fragment key={p.href}>
              <span className="cv-print-only">{dot}</span>
              <span className="cv-print-only">{bare(p.href)}</span>
            </Fragment>
          ))}
        </address>

        <p className="cv-summary cv-summary-lead hairline-t max-w-[70ch] pt-6 text-[length:var(--step-body)] leading-[1.65] text-pretty text-[var(--ink-muted)]">
          {site.summaryLong}
        </p>
      </div>
    </header>
  );
}
