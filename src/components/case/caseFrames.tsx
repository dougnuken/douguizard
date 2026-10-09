"use client";

import Image from "next/image";
import type { BrowserShot } from "@/components/work/BrowserFrame";
import { BrowserVideo } from "@/components/work/BrowserFrame";
import DeviceVideo from "@/components/work/DeviceVideo";
import type { MockupItem } from "@/components/work/MockupGallery";
import { useDict } from "@/i18n/LocaleProvider";
import { balanceColumns, shotNumber, type CaseMediaPlan, type Shot } from "@/lib/caseMedia";
import { FadeIn } from "./primitives";

/**
 * The pieces the showcase and the gallery band share: how a still becomes a
 * frame, how a walkthrough is framed, and how a capture that brings its own
 * device is shown. One definition each, so a screen looks the same whether it
 * opens the page or turns up further down.
 */

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
  // A walkthrough is filed as "recorrido-<module>"; its label is the module.
  const tokens = parts.at(-1)?.replace(/\.\w+$/, "").split("-") ?? [];
  const moduleName = tokens[0] === "recorrido" ? tokens[1] : tokens[0];
  if (!product || !moduleName) return undefined;
  return `${product} · ${moduleName}`.toUpperCase();
}

/** Stills for `MockupGallery`, each carrying its number in the case's gallery. */
export function toMockupItems(shots: Shot[]): MockupItem[] {
  return shots.map(({ item, num }) => ({
    id: item.src,
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    eyebrow: shotNumber(num),
  }));
}

/** Stills for `BrowserGallery` / `BrowserFrame`, with their address-bar label. */
export function toBrowserShots(shots: Shot[]): BrowserShot[] {
  return shots.map(({ item, num }) => ({
    id: item.src,
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    eyebrow: shotNumber(num),
    label: browserLabel(item.src),
  }));
}

function PlainCaption({ shot }: { shot: Shot }) {
  if (!shot.item.caption) return null;
  return (
    <figcaption className="mt-3 flex gap-3 text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">
      <span className="kicker shrink-0 pt-[3px]">{shotNumber(shot.num)}</span>
      <span>{shot.item.caption}</span>
    </figcaption>
  );
}

/**
 * Screens that already contain their own device.
 *
 * The Banco de Occidente captures are presentation artboards: each one ships a
 * tablet, a phone or an isometric board drawn inside it. Wrapping those in a
 * browser window would render a browser containing a tablet containing the
 * product, so `plain` gives them the same 1px card as every other frame and
 * nothing else. Ratios differ per item (0.56 → 3.43), so nothing is forced into
 * a shared aspect box; each card is as tall as its screen.
 *
 * Which is why the two columns are CSS columns rather than grid rows. A grid
 * row is as tall as its taller card, so a 2000×3543 scenario left ~1,150px of
 * empty column beside it, and a short card under a tall one left a hole.
 * Columns stack each card straight under the one before.
 *
 * Which card goes in which column is `balanceColumns`' call, not the
 * browser's: left to itself a multicol fills one column and then the other,
 * and with cards this uneven no single cut comes out even. The list is
 * written left column first, a forced column break opens the right one, and
 * `break-inside-avoid` keeps each card with its caption. On a phone it is one
 * column again, and `order` puts the cards back in their authored sequence —
 * the "01/02" numbers read in order at every width.
 */
export function PlainGallery({ shots, ariaLabel }: { shots: Shot[]; ariaLabel: string }) {
  const [left, right] = balanceColumns(shots);
  return (
    <ul aria-label={ariaLabel} className="flex list-none flex-col gap-8 md:block md:columns-2 md:gap-6">
      {[...left, ...right].map((shot, i) => (
        <li
          key={shot.item.src}
          style={{ order: shot.num }}
          className={`break-inside-avoid ${
            i === left.length - 1 || i === shots.length - 1 ? "" : "md:mb-6"
          } ${i === left.length ? "md:break-before-column" : ""}`}
        >
          <FadeIn delay={Math.min(i * 0.05, 0.25)}>
            <figure className="m-0">
              <div className="overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--paper-raised)]">
                <Image
                  src={shot.item.src}
                  alt={shot.item.alt}
                  width={shot.item.width ?? 1238}
                  height={shot.item.height ?? 836}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
              <PlainCaption shot={shot} />
            </figure>
          </FadeIn>
        </li>
      ))}
    </ul>
  );
}

/**
 * One artboard at showcase size.
 *
 * Its width is solved from its own ratio so the card is never taller than most
 * of a screen: a landscape board runs wide, a portrait one (Qrvey's end-to-end
 * scenario is 2000×3543) stands narrower instead of pushing everything after
 * it a whole viewport down. The caption shares the card's width, so it starts
 * on the card's edge rather than the band's.
 */
export function PlainLead({ shot, sizes }: { shot: Shot; sizes: string }) {
  const width = shot.item.width ?? 1238;
  const height = shot.item.height ?? 836;
  return (
    <figure className="m-0">
      <div className="mx-auto" style={{ width: `min(100%, calc(78svh * ${(width / height).toFixed(4)}))` }}>
        <div className="overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--paper-raised)]">
          <Image
            src={shot.item.src}
            alt={shot.item.alt}
            width={width}
            height={height}
            sizes={sizes}
            priority
            className="block h-auto w-full"
          />
        </div>
        <PlainCaption shot={shot} />
      </div>
    </figure>
  );
}

type Walkthrough = NonNullable<CaseMediaPlan["video"]>;

/**
 * The walkthrough, in the frame its capture was made in.
 *
 * One pass through the app, not a cycle: it opens on one screen and ends on
 * another, so looping would read as a glitch. The control under it is how you
 * replay it, and how anyone stops it — which is what WCAG 2.2.2 asks of an
 * autoplaying clip longer than five seconds.
 */
export function WalkthroughVideo({ video, kind }: { video: Walkthrough; kind: "phone" | "browser" }) {
  const t = useDict().case;
  if (kind === "browser") {
    return (
      <BrowserVideo
        mp4Src={video.mp4}
        webmSrc={video.webm}
        poster={video.poster}
        width={video.width}
        height={video.height}
        label={video.label}
        chromeLabel={browserLabel(video.mp4)}
        playLabel={t.play}
        pauseLabel={t.pause}
        loop={false}
      />
    );
  }
  return (
    <DeviceVideo
      mp4Src={video.mp4}
      webmSrc={video.webm}
      poster={video.poster}
      width={video.width}
      height={video.height}
      label={video.label}
      playLabel={t.play}
      pauseLabel={t.pause}
      loop={false}
    />
  );
}

/**
 * What the clip shows, under the whole showcase row rather than under the clip:
 * beside a 300px handset a three-line caption becomes a ten-line column.
 *
 * Label in the first quarter, prose across the other three — the same four
 * columns as the meta strip directly beneath it, so the caption starts on the
 * line "Duration" and the first link start on, instead of a few pixels off it.
 */
export function WalkthroughCaption({ caption }: { caption?: string }) {
  const t = useDict().case;
  return (
    <FadeIn>
      <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 lg:grid-cols-4 lg:gap-8">
        <div className="kicker text-[var(--ink-dim)] lg:pt-1.5">{t.walkthrough}</div>
        {caption && (
          <p className="max-w-[62ch] text-[16px] leading-[1.6] text-[var(--ink)] md:text-[18px] lg:col-span-3">
            {caption}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
