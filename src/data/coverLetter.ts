import { site } from "@/data/site";

export interface CoverLetter {
  /** Mono eyebrow above the block. */
  kicker: string;
  /** When this text was last rewritten. Hand-set, so the page is not dated daily. */
  updated: string;
  /** Deliberately not "Dear Sir or Madam": nobody writes that and means it. */
  salutation: string;
  /** Body, in order. The first is set as the lede. Plain text — no markup. */
  paragraphs: string[];
  signoff: string;
  /** Sets the reader's expectation about what this letter is. */
  note: string;
}

/**
 * The letter that opens `/cv`.
 *
 * It exists to do the one thing the record below it cannot: say how the work
 * is done and what it is for. So it deliberately does NOT restate
 * `site.summaryLong` — that paragraph is directly above it on the page, and a
 * letter that repeats the summary is a letter nobody finishes.
 *
 * Every figure here is one the case data already carries. Nothing is written
 * up for the occasion, because the reader can click through and check.
 */
export const coverLetter: CoverLetter = {
  kicker: "A letter",
  updated: "September 2026",
  salutation: "Hello —",
  paragraphs: [
    "I'm a product designer who learned to build, and it changed what I'm able to be responsible for. I don't hand over a specification and wait to see what comes back — I hand over something that runs, and then I keep answering for it.",
    "At Naowee that looks like this: rather than write a document describing how inspection and control should work across ~1,200 sports organizations and their 30 regulatory procedures, I build it, and walk it story by story with the analysts who have to sign it off. A prototype that runs settles the arguments a specification can only postpone.",
    "The habit came from design systems. When one decision about a token reaches 400+ designers and 2,000+ engineers, you stop designing screens and start designing constraints — and the constraints that hold are the ones you can execute, not the ones you can only describe.",
    "I work with AI the same way I'd work with anyone fast and new: give it room, then verify. On olbo I let it write quickly and let 634 tests decide what survived. Nothing ships here because it sounded right.",
    "If you're building something where design and engineering can't afford to be two separate handoffs, I'd like to talk.",
  ],
  signoff: "Thanks for reading,",
  note: "This is the general letter. Tell me what you're building and I'll write you a specific one.",
};

/**
 * The same letter as plain text, for the copy button — a recruiter's form or
 * an email body, not a screenshot of a web page.
 */
export function coverLetterText(): string {
  const { salutation, paragraphs, signoff } = coverLetter;
  return [
    salutation,
    "",
    paragraphs.join("\n\n"),
    "",
    signoff,
    site.name,
    `${site.email} · ${site.domain}`,
  ].join("\n");
}
