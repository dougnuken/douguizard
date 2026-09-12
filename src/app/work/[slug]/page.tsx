"use client";

import { notFound, useParams } from "next/navigation";
import { getCaseMeta, getCaseStudy, getNextCaseStudy } from "@/data/work";

import CaseHeader from "@/components/case/CaseHeader";
import CaseMeta from "@/components/case/CaseMeta";
import CaseLinks from "@/components/case/CaseLinks";
import CaseImpact from "@/components/case/CaseImpact";
import CaseNarrative from "@/components/case/CaseNarrative";
import CaseProcess from "@/components/case/CaseProcess";
import CaseDecisions from "@/components/case/CaseDecisions";
import CaseTestimonial from "@/components/case/CaseTestimonial";
import CaseFeatures from "@/components/case/CaseFeatures";
import CaseProduct from "@/components/case/CaseProduct";
import CaseNda from "@/components/case/CaseNda";
import CaseColophon from "@/components/case/CaseColophon";
import CaseNext from "@/components/case/CaseNext";

/**
 * Stands in for the gallery on a case whose screens belong to the client.
 * Kept here, beside the composition, because it is a property of how this page
 * handles an NDA rather than a fact about the work — `work.ts` sets the flag.
 */
const NDA_BODY =
  "The screens are Mercadolibre's, so they don't go on a public site. I'm happy to walk through the system, the governance model and the audit workflow directly.";

/**
 * One case study, composed.
 *
 * Every section is optional and guarded exactly as it was in the 782-line
 * version this replaces: a case with only a hero, a meta strip and a paragraph
 * renders precisely those, and gains no empty headings. What changed is that
 * each block now lives in its own file, and that role, year, client and
 * duration come from `getCaseMeta` — derived from the career data — instead of
 * being repeated on every case.
 */
export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const study = getCaseStudy(params.slug);

  if (!study) notFound();

  const meta = getCaseMeta(study.slug);
  const next = getNextCaseStudy(study.slug);

  // `links` supersedes `externalLink`: when a case lists its destinations up
  // top, repeating one of them in the colophon is noise.
  const showExternalLink = Boolean(study.externalLink) && !study.links?.length;

  // A video needs something to show before it plays. Falling back to the first
  // gallery frame means a case can ship a clip without also authoring a poster.
  const videoPoster = study.video?.poster ?? study.gallery?.[0]?.src;
  const video = videoPoster && study.video ? study.video : undefined;
  const hasGallery = Boolean(study.gallery && study.gallery.length > 0);

  const galleryKind = study.galleryKind ?? "phone";
  const videoKind = study.videoKind ?? (galleryKind === "plain" ? "browser" : galleryKind);

  return (
    <main id="main" tabIndex={-1}>
      <CaseHeader study={study} meta={meta} />
      <CaseMeta meta={meta} />

      {study.links && study.links.length > 0 && <CaseLinks links={study.links} />}

      <CaseImpact impact={study.impact} kpis={study.kpis} />
      <CaseNarrative context={study.context} contributions={study.contributions} />

      {study.process && study.process.length > 0 && <CaseProcess process={study.process} />}
      {study.decisions && study.decisions.length > 0 && (
        <CaseDecisions decisions={study.decisions} />
      )}

      {study.testimonialId && <CaseTestimonial id={study.testimonialId} />}

      {study.features && study.features.length > 0 && (
        <CaseFeatures intro={study.featuresIntro} features={study.features} />
      )}

      {(hasGallery || video) && (
        <CaseProduct
          project={study.project}
          video={video}
          videoPoster={videoPoster}
          videoKind={videoKind}
          gallery={study.gallery}
          galleryKind={galleryKind}
        />
      )}

      {study.nda && !hasGallery && <CaseNda body={NDA_BODY} />}

      {(study.technologies || showExternalLink || study.credits) && (
        <CaseColophon
          technologies={study.technologies}
          externalLink={showExternalLink ? study.externalLink : undefined}
          credits={study.credits}
        />
      )}

      <CaseNext next={next} />
    </main>
  );
}
