import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { getCaseMeta, getCaseStudy, getNextCaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { caseJsonLd } from "@/lib/caseJsonLd";
import { hasShowcase, planCaseMedia } from "@/lib/caseMedia";
import { VIGNETTES } from "@/components/vignettes/registry";

import CaseHeader from "@/components/case/CaseHeader";
import CaseShowcase from "@/components/case/CaseShowcase";
import CaseNda from "@/components/case/CaseNda";
import CaseMeta from "@/components/case/CaseMeta";
import CaseImpact from "@/components/case/CaseImpact";
import CaseNarrative from "@/components/case/CaseNarrative";
import CaseTestimonial from "@/components/case/CaseTestimonial";
import CaseGallery from "@/components/case/CaseGallery";
import CaseFeatures from "@/components/case/CaseFeatures";
import CaseProcess from "@/components/case/CaseProcess";
import CaseDecisions from "@/components/case/CaseDecisions";
import CaseColophon from "@/components/case/CaseColophon";
import CaseNext from "@/components/case/CaseNext";
import type { BandProps } from "@/components/case/primitives";

type Tone = NonNullable<BandProps["tone"]>;

/**
 * One case study, composed, in one language.
 *
 * A server component: the study is resolved here, in the route's language, and
 * each band receives its words as props. The bands themselves stay client
 * components for their reveals; what they no longer do is look anything up.
 *
 * Show, then tell. The order is the order a reader skims in:
 *
 *   hero → the product → the case at a glance → impact → context and what I
 *   did → in their words → the rest of the screens → features → how it
 *   happened → decisions → colophon → next
 *
 * The first screen carries the hero and the top of the product; the first
 * three carry everything a recruiter scanning for a minute needs — what it is,
 * what it looks like, who did what, what it changed, and someone else saying
 * so. The deep read (process, decisions) follows for whoever stays.
 *
 * Every section is optional and guarded: a case with only a hero, a meta strip
 * and a paragraph renders precisely those, and gains no empty headings. Role,
 * year, client and duration come from `getCaseMeta` — derived from the career
 * data — instead of being repeated on every case.
 */
export default function CasePage({ slug, locale }: { slug: string; locale: Locale }) {
  const study = getCaseStudy(slug, locale);
  if (!study) notFound();

  const dict = getDict(locale);
  const meta = getCaseMeta(study.slug, locale);
  const next = getNextCaseStudy(study.slug, locale);
  const media = planCaseMedia(study);
  const showcase = hasShowcase(media);

  // `links` supersedes `externalLink`: when a case lists its destinations up
  // top, repeating one of them in the colophon is noise.
  const showExternalLink = Boolean(study.externalLink) && !study.links?.length;

  // A confidential case has no screens to lead with, so it leads with the
  // notice instead — and with its home-page vignette when it has one, which
  // draws the idea of the work rather than showing the client's product.
  // `work.ts` only sets the flag; the words live with the interface's.
  const nda = study.nda && !study.gallery?.length;
  const vignette = nda ? VIGNETTES[study.slug] : undefined;

  /*
   * The bands after the showcase alternate paper and raised by position, not
   * by name. Which bands a case has varies — Qrvey has no process, Royal
   * Caribbean has no screens — and a fixed tone per band left two of the same
   * tone touching wherever one was missing between them. Counting instead
   * means a missing band can never leave a seam.
   */
  const bands: { key: string; render: (tone: Tone) => ReactNode }[] = [
    { key: "meta", render: (tone) => <CaseMeta tone={tone} meta={meta} links={study.links} /> },
    {
      key: "impact",
      render: (tone) => <CaseImpact tone={tone} impact={study.impact} kpis={study.kpis} />,
    },
    {
      key: "narrative",
      render: (tone) => (
        <CaseNarrative tone={tone} context={study.context} contributions={study.contributions} />
      ),
    },
  ];
  if (study.testimonialId) {
    const id = study.testimonialId;
    bands.push({ key: "testimonial", render: (tone) => <CaseTestimonial tone={tone} id={id} /> });
  }
  if (media.rest.length > 0) {
    bands.push({
      key: "gallery",
      render: (tone) => (
        <CaseGallery tone={tone} project={study.project} shots={media.rest} kind={media.galleryKind} />
      ),
    });
  }
  if (study.features?.length) {
    const features = study.features;
    bands.push({
      key: "features",
      render: (tone) => <CaseFeatures tone={tone} intro={study.featuresIntro} features={features} />,
    });
  }
  if (study.process?.length) {
    const process = study.process;
    bands.push({ key: "process", render: (tone) => <CaseProcess tone={tone} process={process} /> });
  }
  if (study.decisions?.length) {
    const decisions = study.decisions;
    bands.push({ key: "decisions", render: (tone) => <CaseDecisions tone={tone} decisions={decisions} /> });
  }
  if (study.technologies || showExternalLink || study.credits) {
    bands.push({
      key: "colophon",
      render: (tone) => (
        <CaseColophon
          tone={tone}
          technologies={study.technologies}
          externalLink={showExternalLink ? study.externalLink : undefined}
          credits={study.credits}
        />
      ),
    });
  }
  bands.push({ key: "next", render: (tone) => <CaseNext tone={tone} next={next} /> });

  return (
    <div className="min-h-svh">
      <main id="main" tabIndex={-1}>
        <CaseHeader study={study} meta={meta} />

        {/* The showcase sits on the raised tone, so the first band after it
            opens on paper. */}
        {showcase && <CaseShowcase project={study.project} plan={media} />}
        {nda && (
          <CaseNda
            body={dict.case.ndaBody}
            visual={vignette && <vignette.Component locale={locale} />}
            visualCaption={vignette && dict.work.vignettes[vignette.key].caption}
          />
        )}

        {bands.map((band, i) => (
          <Fragment key={band.key}>{band.render(i % 2 === 0 ? "paper" : "raised")}</Fragment>
        ))}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(study, locale)) }}
      />
    </div>
  );
}
