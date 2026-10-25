"use client";

import { useEffect, useState } from "react";
import type { FilmSource, StoryFigure, StoryFilm } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";
import { PosterButton, VideoControlRow, useSilentVideo } from "@/components/work/videoChrome";

/**
 * The media of a long-form case. Unlike the gallery frames, these stills and
 * clips bring their own device — they are composed mockups — so they are shown
 * bare, on the same 1px card every other frame sits on.
 */

/**
 * One still as a `<picture>`: WebP at half and full size, chosen by `sizes`,
 * and a JPEG for anything that cannot read WebP. Plain markup rather than
 * `next/image`, because the files are already encoded at the sizes the layout
 * asks for — the optimizer would only re-encode them.
 */
export function StoryPicture({
  figure,
  sizes,
  priority = false,
  className = "",
}: {
  figure: StoryFigure;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const half = Math.round(figure.width / 2);
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${figure.src}-${half}.webp ${half}w, ${figure.src}.webp ${figure.width}w`}
        sizes={sizes}
      />
      <img
        src={`${figure.src}.jpg`}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`block h-auto w-full ${className}`}
      />
    </picture>
  );
}

/** Below this width the art-directed 4:5 cut replaces the 16:9 one. */
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * A silent, looping clip — muted, inline, autoplaying only while on screen.
 *
 * Under `prefers-reduced-motion` nothing moves on its own: the poster stands
 * behind a play button. Either way the play/pause control under it is there,
 * as WCAG 2.2.2 asks of anything that moves for more than five seconds.
 *
 * Which cut plays depends on the viewport, which the server cannot know, so
 * the `<video>` is only rendered after mount; until then the box is held by
 * the poster at the right ratio, art-directed the same way with `<picture>`.
 */
export function StoryFilmPlayer({ film, className = "" }: { film: StoryFilm; className?: string }) {
  const t = useDict().case;
  const { ref, autoAllowed, isPlaying, hasStarted, toggle, onPlay, onPause } = useSilentVideo(true);
  const [source, setSource] = useState<FilmSource | null>(null);

  useEffect(() => {
    const small = film.mobile && window.matchMedia(MOBILE_QUERY).matches;
    setSource(small ? film.mobile! : film.source);
  }, [film]);

  const ratioBox = (s: FilmSource) => `${s.width} / ${s.height}`;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--paper-raised)]">
        {source ? (
          <>
            <video
              key={source.mp4}
              ref={ref}
              className="block h-auto w-full"
              style={{ aspectRatio: ratioBox(source) }}
              width={source.width}
              height={source.height}
              poster={source.poster}
              muted
              loop
              playsInline
              preload="metadata"
              autoPlay={autoAllowed}
              aria-label={film.label}
              onPlay={onPlay}
              onPause={onPause}
            >
              <source src={source.webm} type="video/webm" />
              <source src={source.mp4} type="video/mp4" />
            </video>
            {!hasStarted && !isPlaying && <PosterButton onClick={toggle} label={`${t.play}: ${film.label}`} />}
          </>
        ) : (
          <picture>
            {film.mobile && <source media={MOBILE_QUERY} srcSet={film.mobile.poster} />}
            <img
              src={film.source.poster}
              alt=""
              width={film.source.width}
              height={film.source.height}
              className="block h-auto w-full"
            />
          </picture>
        )}
      </div>
      <VideoControlRow isPlaying={isPlaying} onToggle={toggle} playLabel={t.play} pauseLabel={t.pause} />
      {film.caption && (
        <figcaption className="mt-3 text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">{film.caption}</figcaption>
      )}
    </figure>
  );
}
