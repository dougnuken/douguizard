"use client";

import Image from "next/image";
import type { CaseStudy } from "@/data/work";
import MockupGallery from "@/components/work/MockupGallery";
import { BrowserGallery, BrowserVideo } from "@/components/work/BrowserFrame";
import DeviceVideo from "@/components/work/DeviceVideo";
import { Band, EyebrowHeading, FadeIn } from "./primitives";

type GalleryItem = NonNullable<CaseStudy["gallery"]>[number];
type FrameKind = NonNullable<CaseStudy["galleryKind"]>;

/**
 * `/work/naowee/ivc-bandeja.png` → `NAOWEE · IVC`.
 *
 * The chrome bar of a browser frame is an address bar, and an address bar that
 * says nothing is a decoration. The path already encodes product and module, so
 * the label is derived rather than authored — a new capture named after its
 * module gets a correct label for free.
 */
export function browserLabel(src: string): string | undefined {
  const parts = src.split("/").filter(Boolean);
  const product = parts.at(-2);
  const moduleName = parts.at(-1)?.replace(/\.\w+$/, "").split("-")[0];
  if (!product || !moduleName) return undefined;
  return `${product} · ${moduleName}`.toUpperCase();
}

const WALKTHROUGH_LABEL = "/ Walkthrough — no sound";

/**
 * Screens that already contain their own device.
 *
 * The Banco de Occidente captures are presentation artboards: each one ships a
 * tablet, a phone or an isometric board drawn inside it. Wrapping those in a
 * browser window would render a browser containing a tablet containing the
 * product, so `plain` gives them the same 1px card as every other frame and
 * nothing else. Ratios differ per item (0.92 → 2.16), so nothing is forced into
 * a shared aspect box; each card is as tall as its screen.
 */
function PlainGallery({ items, ariaLabel }: { items: GalleryItem[]; ariaLabel: string }) {
  return (
    <ul aria-label={ariaLabel} className="grid list-none grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
      {items.map((item, i) => (
        <li key={item.src} className="self-start">
          <FadeIn delay={Math.min(i * 0.05, 0.25)}>
            <figure className="m-0">
              <div className="overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--paper-raised)]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width ?? 1238}
                  height={item.height ?? 836}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
              {item.caption && (
                <figcaption className="mt-3 flex gap-3 text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">
                  <span className="kicker shrink-0 pt-[3px]">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item.caption}</span>
                </figcaption>
              )}
            </figure>
          </FadeIn>
        </li>
      ))}
    </ul>
  );
}

export interface CaseProductProps {
  project: string;
  video?: CaseStudy["video"];
  videoPoster?: string;
  videoKind: FrameKind;
  gallery?: GalleryItem[];
  galleryKind: FrameKind;
}

/**
 * "The product" — the moving image first, then the stills.
 *
 * Placed straight after the argument so the screens read as evidence for it,
 * not as decoration at the end. Wider than the prose bands: four phones, or a
 * full-measure browser window, need real room.
 */
export default function CaseProduct({
  project,
  video,
  videoPoster,
  videoKind,
  gallery,
  galleryKind,
}: CaseProductProps) {
  const hasGallery = Boolean(gallery && gallery.length > 0);
  const showVideo = Boolean(video && videoPoster);
  const ariaLabel = `${project} — product screens`;

  return (
    <Band tone="raised" rule="y" wide>
      <EyebrowHeading>The product</EyebrowHeading>

      <div className="mt-12 md:mt-16">
        {showVideo && video && videoPoster && (
          <div
            className={
              hasGallery ? "mb-14 border-b border-[var(--line)] pb-14 md:mb-16 md:pb-16" : ""
            }
          >
            {videoKind === "browser" ? (
              /* Landscape capture (16:10). It cannot live in the 400px column a
                 phone uses — at that width a desktop UI stops being legible — so
                 the window runs the full measure and the caption sits beneath it
                 in the eyebrow-left / prose-right rhythm the page reads in. */
              <>
                <BrowserVideo
                  mp4Src={video.mp4}
                  webmSrc={video.webm}
                  poster={videoPoster}
                  width={video.width}
                  height={video.height}
                  label={video.label}
                  chromeLabel={browserLabel(video.mp4)}
                  /* One pass through the app, not a cycle: it opens on one screen
                     and ends on another, so looping would read as a glitch. The
                     control below is how you replay it, and how anyone stops it —
                     which is what WCAG 2.2.2 asks of a 12s autoplay. */
                  loop={false}
                />

                <FadeIn>
                  <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                    <div className="kicker text-[var(--ink-dim)] lg:pt-2">{WALKTHROUGH_LABEL}</div>
                    {video.caption && (
                      <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink)] md:text-[19px]">
                        {video.caption}
                      </p>
                    )}
                  </div>
                </FadeIn>
              </>
            ) : (
              /* Two columns on desktop: a phone is only ~400px wide, and left
                 alone it leaves two thirds of the canvas empty. Label and caption
                 move beside it. Back to one column on mobile. */
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-16">
                <DeviceVideo
                  mp4Src={video.mp4}
                  webmSrc={video.webm}
                  poster={videoPoster}
                  width={video.width}
                  height={video.height}
                  label={video.label}
                  loop={false}
                />

                <FadeIn>
                  <div className="lg:pt-2">
                    <div className="kicker mb-6 text-[var(--ink-dim)]">{WALKTHROUGH_LABEL}</div>
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

        {gallery && gallery.length > 0 && galleryKind === "browser" && (
          <BrowserGallery
            ariaLabel={ariaLabel}
            /* Two full-bleed leaders instead of the component's default of one.
               The screens arrive in same-product pairs, and a single leader
               would offset the grid so every row straddled two different
               systems — inviting a comparison that does not exist. */
            featureCount={2}
            items={gallery.map((g, i) => ({
              id: g.src,
              src: g.src,
              alt: g.alt,
              caption: g.caption,
              eyebrow: String(i + 1).padStart(2, "0"),
              label: browserLabel(g.src),
            }))}
          />
        )}

        {gallery && gallery.length > 0 && galleryKind === "plain" && (
          <PlainGallery items={gallery} ariaLabel={ariaLabel} />
        )}

        {gallery && gallery.length > 0 && galleryKind === "phone" && (
          <MockupGallery
            ariaLabel={ariaLabel}
            hint="Swipe →"
            items={gallery.map((g, i) => ({
              id: g.src,
              src: g.src,
              alt: g.alt,
              caption: g.caption,
              eyebrow: String(i + 1).padStart(2, "0"),
            }))}
          />
        )}
      </div>
    </Band>
  );
}
