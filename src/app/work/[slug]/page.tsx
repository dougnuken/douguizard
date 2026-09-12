"use client";

import { motion, MotionConfig } from "framer-motion";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getCaseMeta, getCaseStudy, getNextCaseStudy, type Kpi } from "@/data/work";
import Spark from "@/components/Spark";
import RevealText from "@/components/text/RevealText";
import MockupGallery from "@/components/work/MockupGallery";
import { BrowserGallery, BrowserVideo } from "@/components/work/BrowserFrame";
import DeviceVideo from "@/components/work/DeviceVideo";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Address-bar text for a desktop screen, derived from its own file path.
 *
 * Screenshots live at `/work/<slug>/<module>-<screen>.png`, so the leading
 * segment of the filename is the sub-product the screen belongs to. That is
 * worth surfacing: a browser gallery can hold screens from several systems
 * (Naowee's runs IVC, Project and Escenarios back to back) and the captions
 * describe what a screen *does*, never which product it is part of. Without
 * this the six screens read as one app.
 *
 * It is a label, not a URL — no domain is claimed, and every part of it comes
 * from the path itself, so nothing is hardcoded to one case. Returns
 * `undefined` when the path yields nothing, and the frame renders bare chrome.
 */
function browserLabel(src: string): string | undefined {
  const parts = src.split("/").filter(Boolean);
  const product = parts.at(-2);
  const moduleName = parts.at(-1)?.replace(/\.\w+$/, "").split("-")[0];
  if (!product) return moduleName;
  if (!moduleName || moduleName === product) return product;
  return `${product} · ${moduleName}`;
}

/** Container-level fade + rise, on scroll into view. For eyebrows and groups. */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-[var(--ink)]">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

/** Section eyebrow — hairline tick + mono label, sticky on desktop. */
function Eyebrow({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <FadeIn>
      <div
        className={`font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink-muted)] ${
          sticky ? "md:sticky md:top-32" : ""
        }`}
      >
        <span className="inline-block w-6 h-px bg-[var(--ink)] mr-3 align-middle" />
        {children}
      </div>
    </FadeIn>
  );
}

/**
 * Same visual language as `Eyebrow`, but a real `<h2>`.
 * Used by the optional narrative sections so the document keeps a genuine
 * heading outline (h1 project → h2 section → h3 phase/decision) without
 * introducing a second, louder header style.
 */
function EyebrowHeading({
  children,
  sticky = false,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <FadeIn>
      <h2
        className={`font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink-muted)] ${
          sticky ? "md:sticky md:top-32" : ""
        }`}
      >
        <span className="inline-block w-6 h-px bg-[var(--ink)] mr-3 align-middle" />
        {children}
      </h2>
    </FadeIn>
  );
}

/**
 * Micro-label that separates a model-powered capability from product depth.
 * Deliberately quiet: same mono/uppercase register as every other label on the
 * page, with the accent reserved for the AI ones — the dot is the only extra
 * mark, and it is the same dot the decisions and KPI deltas already use.
 * Renders nothing when a feature declares no `kind`, so nothing is mislabelled.
 */
function FeatureKind({ kind }: { kind?: "ai" | "product" }) {
  if (!kind) return null;
  const isAi = kind === "ai";
  return (
    <div
      className={`flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase ${
        isAi ? "text-[var(--ink)]" : "text-[var(--ink-dim)]"
      }`}
    >
      {isAi && (
        <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-[var(--ink)]" />
      )}
      {isAi ? "AI" : "Product"}
    </div>
  );
}

/** Single KPI — big figure (mask reveal), label, optional accent delta chip. */
function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <div className="flex flex-col">
      <RevealText
        as="div"
        variant="mask"
        delay={index * 0.07}
        className="font-display font-black text-[clamp(30px,3.2vw,46px)] leading-[1.02] tracking-[-0.03em] text-[var(--ink)]"
      >
        {kpi.value}
      </RevealText>
      <RevealText
        as="div"
        variant="fade"
        delay={index * 0.07 + 0.08}
        className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-muted)] leading-[1.5]"
      >
        {kpi.label}
      </RevealText>
      {kpi.delta && (
        <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--ink)]">
          <span className="h-1 w-1 rounded-full bg-[var(--ink)]" />
          {kpi.delta}
        </span>
      )}
    </div>
  );
}

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const study = getCaseStudy(params.slug);

  if (!study) {
    notFound();
  }

  const meta = getCaseMeta(study.slug);

  const next = getNextCaseStudy(study.slug);

  // `links` supersedes `externalLink`: when a case lists its destinations up
  // top, repeating the same URL in the colophon is noise. Client cases have no
  // `links`, so their "Live link" block is untouched.
  const showExternalLink = Boolean(study.externalLink) && !study.links?.length;

  // A poster is what keeps the clip from being a blank box before it decodes,
  // so it is a precondition for rendering the video at all. `video.poster` is
  // optional in the data, so fall back to the first screenshot of the same
  // product; with neither, the video block simply does not render.
  const videoPoster = study.video?.poster ?? study.gallery?.[0]?.src;
  const video = videoPoster && study.video ? study.video : undefined;
  const hasGallery = Boolean(study.gallery && study.gallery.length > 0);

  // Which frame the screens render in. The data layer declares it per case
  // (`galleryKind`), because only the case knows whether its product is a phone
  // or a desktop platform — no filename or aspect-ratio heuristic can tell a
  // tall screenshot of a web app from a handset capture. Absent, it falls back
  // to the phone mockup: that is what every case shipped with before this field
  // existed, so olbo — whose data says nothing — renders exactly as it did.
  const galleryKind = study.galleryKind ?? "phone";

  // The walkthrough follows the gallery unless the case says otherwise: a clip
  // of the same product belongs in the same frame as its stills. naowee gets a
  // browser window from its `galleryKind: "browser"` alone, and olbo — which
  // declares neither field — stays on the handset.
  const videoKind = study.videoKind ?? galleryKind;

  return (
    <MotionConfig reducedMotion="user">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[78vh] flex flex-col justify-end px-6 md:px-12 pb-20 pt-36 md:pt-40 overflow-hidden bg-[var(--paper)]">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <motion.div
            className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-12 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            <Spark size={12} />
            <span>Case study {study.num}</span>
            <span className="text-[var(--ink-dim)]">·</span>
            <span>{study.category}</span>
            <span className="text-[var(--ink-dim)]">·</span>
            <span>{meta.year}</span>
          </motion.div>

          <motion.h2
            className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--ink)] mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            {meta.client}
          </motion.h2>

          <h1 className="font-display font-black text-[clamp(56px,11vw,180px)] leading-[0.9] tracking-[-0.04em] text-[var(--ink)] mb-12 max-w-[1100px]">
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.7, ease }}
              >
                {study.project}
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="font-display text-[clamp(20px,2vw,28px)] text-[var(--ink)] max-w-[720px] leading-[1.4] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease }}
          >
            {study.tagline}
          </motion.p>
        </div>
      </section>

      {/* ============ Project meta strip ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-12 bg-[var(--paper)] border-y border-[var(--line)]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Role", value: meta.role },
            { label: "Duration", value: meta.duration },
            { label: "Team", value: study.team },
            { label: "Year", value: meta.year },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.06}>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)] mb-2">
                / {item.label}
              </div>
              <div className="text-[var(--ink)] text-[15px] leading-[1.4]">
                {item.value}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============ Open it — prominent destinations (optional) ============
          Sits directly under the meta strip so a live product is one click away
          before the reader commits to the long read. Only cases that ship
          something public carry `links`. */}
      {study.links && study.links.length > 0 && (
        <section className="relative z-[2] px-6 md:px-12 py-10 bg-[var(--paper)] border-b border-[var(--line)]">
          {/* Same 4-col grid as the meta strip above, so the label and the
              links land on the columns the reader's eye already learned. */}
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-6 md:grid-cols-4 md:items-baseline md:gap-8">
            <FadeIn>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)]">
                / Open it
              </div>
            </FadeIn>
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 md:col-span-3">
              {study.links.map((l, i) => (
                <FadeIn key={l.href} delay={i * 0.06}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-baseline gap-2.5 font-display text-[clamp(20px,2vw,28px)] leading-none text-[var(--ink)] no-underline border-b border-[var(--line-strong)] pb-1 hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
                  >
                    {i === 0 && (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ink)]"
                      />
                    )}
                    {l.label}
                    <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ Impact + KPIs (the market-facing star) ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)]">
        <div className="max-w-[1100px] mx-auto">
          <Eyebrow>The impact</Eyebrow>

          <RevealText
            as="p"
            variant="mask"
            className="mt-8 font-display font-medium text-[clamp(28px,4vw,54px)] leading-[1.14] tracking-[-0.025em] text-[var(--ink)] max-w-[960px]"
          >
            {study.impact}
          </RevealText>

          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-[var(--line)] pt-12 md:grid-cols-4">
            {study.kpis.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ Context ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)] border-y border-[var(--line)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <Eyebrow sticky>Context</Eyebrow>
          <RevealText
            as="p"
            variant="fade"
            className="font-display text-[clamp(20px,2.4vw,30px)] leading-[1.4] tracking-[-0.01em] text-[var(--ink)] max-w-[780px]"
          >
            {study.context}
          </RevealText>
        </div>
      </section>

      {/* ============ What I did ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
          <Eyebrow sticky>What I did</Eyebrow>
          <div className="border-y border-[var(--line)]">
            {study.contributions.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-[48px_1fr] gap-5 md:gap-8 border-b border-[var(--line)] py-6 last:border-b-0 md:py-7"
              >
                <RevealText
                  as="div"
                  variant="mask"
                  delay={i * 0.04}
                  className="section-num text-[clamp(22px,2.2vw,32px)] leading-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </RevealText>
                <RevealText
                  as="p"
                  variant="fade"
                  delay={i * 0.04 + 0.06}
                  className="text-[clamp(15px,1.35vw,19px)] leading-[1.55] text-[var(--ink)]"
                >
                  {renderBold(c)}
                </RevealText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Process — how the work actually happened (optional) ====
          After "What I did" (the what) comes the narrative (the how). */}
      {study.process && study.process.length > 0 && (
        <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)] border-y border-[var(--line)]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            <EyebrowHeading sticky>How it happened</EyebrowHeading>
            <ol className="m-0 list-none p-0 border-t border-[var(--line)]">
              {study.process.map((p, i) => (
                <li
                  key={p.phase}
                  className="grid grid-cols-1 gap-4 border-b border-[var(--line)] py-8 md:grid-cols-[64px_1fr] md:gap-8 md:py-11"
                >
                  <RevealText
                    as="div"
                    variant="mask"
                    delay={i * 0.04}
                    className="section-num text-[clamp(24px,2.5vw,36px)] leading-none"
                  >
                    {p.phase}
                  </RevealText>
                  <div>
                    <RevealText
                      as="h3"
                      variant="mask"
                      delay={i * 0.04 + 0.05}
                      className="font-display font-medium text-[clamp(21px,2.1vw,30px)] leading-[1.2] tracking-[-0.02em] text-[var(--ink)]"
                    >
                      {p.title}
                    </RevealText>
                    <RevealText
                      as="p"
                      variant="fade"
                      delay={i * 0.04 + 0.1}
                      className="mt-4 max-w-[680px] text-[clamp(15px,1.3vw,18px)] leading-[1.65] text-[var(--ink-muted)]"
                    >
                      {renderBold(p.body)}
                    </RevealText>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ============ Decisions — the calls worth defending (optional) ====== */}
      {study.decisions && study.decisions.length > 0 && (
        <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            <EyebrowHeading sticky>Decisions I&apos;d defend</EyebrowHeading>
            <ul className="m-0 list-none p-0 border-t border-[var(--line)]">
              {study.decisions.map((d, i) => (
                <li
                  key={d.title}
                  className="border-b border-[var(--line)] py-8 md:py-11"
                >
                  <div className="flex items-baseline gap-3.5">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-0.35em] rounded-full bg-[var(--ink)]"
                    />
                    <RevealText
                      as="h3"
                      variant="mask"
                      delay={i * 0.05}
                      className="font-display font-medium text-[clamp(20px,2vw,28px)] leading-[1.25] tracking-[-0.02em] text-[var(--ink)]"
                    >
                      {d.title}
                    </RevealText>
                  </div>
                  <RevealText
                    as="p"
                    variant="fade"
                    delay={i * 0.05 + 0.08}
                    className="mt-4 max-w-[680px] pl-[1.4rem] text-[clamp(15px,1.3vw,18px)] leading-[1.65] text-[var(--ink-muted)]"
                  >
                    {renderBold(d.body)}
                  </RevealText>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============ Capabilities — what the product can do (optional) =====
          Sits between the decisions and the screens: first why the calls were
          made, then what the thing actually does, then what it looks like doing
          it. Shares the mid band with "The product" so the two read as one
          block of evidence, cut off from the prose above by the band change. */}
      {study.features && study.features.length > 0 && (
        <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)] border-t border-[var(--line)]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            <EyebrowHeading sticky>What it can do</EyebrowHeading>
            <div>
              {study.featuresIntro && (
                <RevealText
                  as="p"
                  variant="fade"
                  className="max-w-[780px] font-display text-[clamp(19px,1.9vw,26px)] leading-[1.4] tracking-[-0.01em] text-[var(--ink)]"
                >
                  {study.featuresIntro}
                </RevealText>
              )}

              {/* Two-up on desktop with real rules between the cells: the grid
                  carries no gap, the padding does the spacing, so the hairlines
                  meet instead of floating. Collapses to a single column. */}
              <ul
                className={`m-0 grid list-none grid-cols-1 border-t border-[var(--line)] p-0 md:grid-cols-2 ${
                  study.featuresIntro ? "mt-12 md:mt-16" : ""
                }`}
              >
                {study.features.map((f, i) => {
                  const d = Math.min(i * 0.05, 0.25);
                  return (
                    <li
                      key={f.title}
                      className="border-b border-[var(--line)] py-8 md:py-10 md:odd:border-r md:odd:pr-10 md:odd:last:border-r-0 md:even:pl-10"
                    >
                      <FeatureKind kind={f.kind} />
                      <RevealText
                        as="h3"
                        variant="mask"
                        delay={d}
                        className={`font-display font-medium text-[clamp(19px,1.8vw,25px)] leading-[1.25] tracking-[-0.02em] text-[var(--ink)] ${
                          f.kind ? "mt-3" : ""
                        }`}
                      >
                        {f.title}
                      </RevealText>
                      <RevealText
                        as="p"
                        variant="fade"
                        delay={d + 0.06}
                        className="mt-3.5 max-w-[540px] text-[clamp(14.5px,1.2vw,17px)] leading-[1.65] text-[var(--ink-muted)]"
                      >
                        {renderBold(f.body)}
                      </RevealText>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ============ The product — device gallery (optional) ===============
          Placed straight after the decisions so the screens read as evidence
          for the argument just made, not as decoration at the end. Wider
          container than the prose sections so four phones — or a full-bleed
          browser window — get real room. */}
      {(hasGallery || video) && (
        <section className="relative z-[2] px-6 md:px-12 py-28 md:py-32 bg-[var(--paper)] border-y border-[var(--line)]">
          <div className="max-w-[1400px] mx-auto">
            <EyebrowHeading>The product</EyebrowHeading>
            <div className="mt-12 md:mt-16">
              {/* Moving image first: it wins the attention, and the stills below
                  are then something to stop on. A rule separates the two so the
                  clip is not mistaken for a fifth screenshot. */}
              {video && videoPoster && (
                <div
                  className={
                    hasGallery
                      ? "mb-14 border-b border-[var(--line)] pb-14 md:mb-16 md:pb-16"
                      : ""
                  }
                >
                  {videoKind === "browser" ? (
                    /* Landscape capture (16:10, 1920×1200). It cannot go in the
                       400px column the phone uses — at that width a desktop UI
                       stops being legible — so the window runs the full measure
                       of the section and the caption sits underneath it, in the
                       eyebrow-left / prose-right rhythm the page reads in. */
                    <>
                      <BrowserVideo
                        mp4Src={video.mp4}
                        webmSrc={video.webm}
                        poster={videoPoster}
                        width={video.width}
                        height={video.height}
                        label={video.label}
                        // Chrome bar names the module, the way the gallery's
                        // frames do. `label` stays the accessible name.
                        chromeLabel={browserLabel(video.mp4)}
                        // Caption moves below the window rather than into the
                        // frame's own figcaption, so it can be set at prose
                        // size instead of the 13.5px gallery caption.
                        // The capture is a single pass through the app, not a
                        // cycle: it opens on one screen and ends on another, so
                        // looping would read as a glitch. It plays once, and the
                        // control below it is how you replay — and how anyone
                        // can stop it, which is what WCAG 2.2.2 asks of a 12s
                        // autoplay.
                        loop={false}
                      />

                      <FadeIn>
                        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)] lg:pt-2">
                            / Walkthrough — no sound
                          </div>
                          {video.caption && (
                            <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink)] md:text-[19px]">
                              {video.caption}
                            </p>
                          )}
                        </div>
                      </FadeIn>
                    </>
                  ) : (
                  /* Two columns on desktop: the phone is only ~400px wide, so
                      left-aligning it alone left two thirds of the canvas empty.
                      The label and caption move beside it — the same phone-left,
                      prose-right rhythm the rest of the page reads in. Stacks
                      back to one column on mobile. */
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-16">
                    <DeviceVideo
                      mp4Src={video.mp4}
                      webmSrc={video.webm}
                      poster={videoPoster}
                      width={video.width}
                      height={video.height}
                      label={video.label}
                      // Caption moves to the right column so it is not trapped
                      // in a 400px measure; the video keeps `label` for a11y.
                      // The capture is a single pass through the app, not a cycle:
                      // it opens on one screen and ends on another, so looping
                      // would read as a glitch. It plays once, and the control
                      // below it is how you replay — and how anyone can stop it,
                      // which is what WCAG 2.2.2 asks of a 12s autoplay.
                      loop={false}
                    />

                    <FadeIn>
                      <div className="lg:pt-2">
                        <div className="mb-6 font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)]">
                          / Walkthrough — no sound
                        </div>
                        {video.caption && (
                          <p className="max-w-[46ch] text-[17px] leading-[1.6] text-[var(--ink)] md:text-[19px]">
                            {video.caption}
                          </p>
                        )}
                      </div>
                    </FadeIn>
                  </div>
                  )}
                </div>
              )}

              {study.gallery &&
                study.gallery.length > 0 &&
                (galleryKind === "browser" ? (
                  /* Desktop platform: a browser window, not a handset. The
                     captures are 16:10 at 2880×1800 — one is 2160×1350, which
                     shares the ratio, so the grid does not move and the frame's
                     defaults cover both. */
                  <BrowserGallery
                    ariaLabel={`${study.project} — product screens`}
                    /* Two full-bleed leaders instead of the component's default
                       of one. The screens arrive in same-product pairs, and a
                       single leader would offset the grid so each row straddled
                       two different systems — inviting a comparison that does
                       not exist. Two leaders leave the remainder to pair inside
                       its own product. */
                    featureCount={2}
                    items={study.gallery.map((g, i) => ({
                      id: g.src,
                      src: g.src,
                      alt: g.alt,
                      caption: g.caption,
                      eyebrow: String(i + 1).padStart(2, "0"),
                      label: browserLabel(g.src),
                    }))}
                  />
                ) : (
                  <MockupGallery
                    ariaLabel={`${study.project} — product screens`}
                    hint="Swipe →"
                    items={study.gallery.map((g, i) => ({
                      id: g.src,
                      src: g.src,
                      alt: g.alt,
                      caption: g.caption,
                      eyebrow: String(i + 1).padStart(2, "0"),
                    }))}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ Technologies + external link ============ */}
      {(study.technologies || showExternalLink || study.credits) && (
        <section className="relative z-[2] px-6 md:px-12 py-24 bg-[var(--paper-raised)] border-t border-[var(--line)]">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            {study.technologies && (
              <FadeIn>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)] mb-4">
                  / Tools & Methods
                </div>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--ink)] px-4 py-2 border border-[var(--line)] rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </FadeIn>
            )}

            {showExternalLink && study.externalLink && (
              <FadeIn delay={0.1}>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)] mb-4">
                  / Live link
                </div>
                <a
                  href={study.externalLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl text-[var(--ink)] no-underline border-b border-[var(--line-strong)] hover:text-[var(--ink)] hover:border-[var(--ink)] inline-block transition-colors"
                >
                  {study.externalLink.label} →
                </a>
              </FadeIn>
            )}
          </div>

          {/* Authorship note — closes the colophon, same band, no extra section. */}
          {study.credits && (
            <div className="max-w-[1100px] mx-auto mt-14 border-t border-[var(--line)] pt-10">
              <FadeIn>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--ink-dim)] mb-4">
                  / Authorship
                </div>
                <p className="max-w-[760px] text-[15px] leading-[1.65] text-[var(--ink-muted)]">
                  {renderBold(study.credits)}
                </p>
              </FadeIn>
            </div>
          )}
        </section>
      )}

      {/* ============ Next project ============ */}
      <section className="relative z-[2] px-6 md:px-12 py-32 bg-[var(--paper)] border-t border-[var(--line)]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-8">
              / Next case study
            </div>
          </FadeIn>

          <Link href={`/work/${next.slug}`} className="block group no-underline text-inherit">
            <FadeIn>
              <div className="font-mono text-sm tracking-[0.3em] uppercase text-[var(--ink)] mb-6 group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {getCaseMeta(next.slug).client}
              </div>
              <h2 className="font-display font-black text-[clamp(56px,11vw,160px)] leading-[0.9] tracking-[-0.04em] text-[var(--ink)] mb-8 group-hover:text-[var(--ink)] transition-colors duration-500">
                {next.project}
                <span className="inline-block group-hover:translate-x-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {" "}→
                </span>
              </h2>
              <p className="text-lg text-[var(--ink-muted)] max-w-[720px] leading-[1.5]">
                {next.tagline}
              </p>
            </FadeIn>
          </Link>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="relative z-[2] px-6 md:px-12 py-16 bg-[var(--paper)] border-t border-[var(--line)]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--ink-dim)]">
          <Link
            href="/"
            className="text-[var(--ink)] no-underline hover:text-[var(--ink)] transition-colors"
          >
            ← Back to all work
          </Link>
          <span>© 2026 Doug Vargas</span>
        </div>
      </footer>
    </MotionConfig>
  );
}
