"use client";

import RevealText from "@/components/text/RevealText";
import type { StoryChapter, StoryFigure, StoryFilm, StorySection } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";
import { Band, FadeIn, renderBold, type BandProps } from "./primitives";
import { StoryFilmPlayer, StoryPicture } from "./StoryMedia";

/**
 * A long-form case, told chapter by chapter: research, design, development,
 * results. It stands in for the gallery, process and decisions bands — the
 * screens appear inside the argument they illustrate instead of in a grid of
 * their own.
 */

/** The 16:9 cover, straight under the hero, at the full media measure. */
export function CaseCover({ cover }: { cover: StoryFigure }) {
  return (
    <Band tone="raised" rule="t" wide className="py-10 md:py-14">
      <h2 className="sr-only">{useDict().case.product}</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--line-strong)]">
        <StoryPicture figure={cover} sizes="(max-width: 1479px) 92vw, 1344px" priority />
      </div>
    </Band>
  );
}

/** The walkthrough, after the case at a glance: label in a quarter, clip across the rest. */
export function CaseFilm({ film, tone }: { film: StoryFilm; tone?: BandProps["tone"] }) {
  const t = useDict().case;
  return (
    <Band tone={tone} rule="t" wide>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <FadeIn className="kicker text-[var(--ink-dim)] lg:pt-1.5">{t.walkthrough}</FadeIn>
        <div className="mx-auto w-full max-w-[520px] md:max-w-none lg:col-span-3">
          <StoryFilmPlayer film={film} />
        </div>
      </div>
    </Band>
  );
}

const SIZES_ONE = "(max-width: 767px) 92vw, (max-width: 1479px) 44vw, 640px";
const SIZES_TWO = "(max-width: 639px) 92vw, (max-width: 1100px) 46vw, 480px";

function Figure({ figure, sizes }: { figure: StoryFigure; sizes: string }) {
  return (
    <FadeIn>
      <figure className="m-0">
        <div className="overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--paper-raised)]">
          <StoryPicture figure={figure} sizes={sizes} />
        </div>
        {figure.caption && (
          <figcaption className="mt-3 text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">
            {figure.caption}
          </figcaption>
        )}
      </figure>
    </FadeIn>
  );
}

function SectionText({ section }: { section: StorySection }) {
  return (
    <div>
      <RevealText
        as="h3"
        variant="mask"
        className="font-display text-[clamp(20px,1.9vw,26px)] font-medium leading-[1.2] tracking-[-0.015em] text-[var(--ink)]"
      >
        {section.title}
      </RevealText>
      {section.body?.map((p, i) => (
        <RevealText
          key={i}
          as="p"
          variant="fade"
          delay={0.05 + i * 0.04}
          className="mt-4 max-w-[62ch] text-[16px] leading-[1.65] text-[var(--ink-muted)] md:text-[17px]"
        >
          {renderBold(p)}
        </RevealText>
      ))}
      {section.points && (
        <ul className="hairline-t mt-6 list-none p-0">
          {section.points.map((point, i) => (
            <li key={i} className="hairline-b flex items-start gap-3.5 py-4">
              <span aria-hidden className="mt-[0.8em] h-px w-2.5 shrink-0 bg-[var(--ink)]" />
              <RevealText
                as="p"
                variant="fade"
                delay={Math.min(i * 0.04, 0.2)}
                className="max-w-[62ch] text-[15px] leading-[1.6] text-[var(--ink-muted)] md:text-[16px]"
              >
                {renderBold(point)}
              </RevealText>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * One section of a chapter. Its layout follows its media:
 *
 * - one still or a clip — text and media side by side from `md`, alternating
 *   sides down the chapter so the eye zig-zags instead of running one column;
 * - two stills — the text across the measure, the pair under it;
 * - nothing — the text alone, in the prose column.
 *
 * On a phone everything stacks, text first.
 */
function Section({ section, flip }: { section: StorySection; flip: boolean }) {
  const figures = section.figures ?? [];
  const single = section.film || figures.length === 1;

  if (single) {
    return (
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
        <div className={flip ? "md:order-2" : ""}>
          <SectionText section={section} />
        </div>
        <div className={`mx-auto w-full max-w-[560px] ${flip ? "md:order-1" : ""}`}>
          {section.film ? <StoryFilmPlayer film={section.film} /> : <Figure figure={figures[0]} sizes={SIZES_ONE} />}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[760px]">
        <SectionText section={section} />
      </div>
      {figures.length > 0 && (
        <div className="mt-10 grid max-w-[1000px] grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
          {figures.map((f) => (
            <Figure key={f.src} figure={f} sizes={SIZES_TWO} />
          ))}
        </div>
      )}
    </div>
  );
}

/** A chapter band: its number and title, a one-line framing, then its sections. */
export function CaseChapter({
  chapter,
  index,
  tone,
}: {
  chapter: StoryChapter;
  index: number;
  tone?: BandProps["tone"];
}) {
  // Consecutive text-only sections share a row of two columns, so a short
  // list never leaves half the measure empty beside it. Single-media sections
  // alternate sides; the counter skips the others so the zig-zag is unbroken.
  const groups: StorySection[][] = [];
  for (const section of chapter.sections) {
    const textOnly = !section.film && !section.figures?.length;
    const last = groups.at(-1);
    if (textOnly && last && !last[0].film && !last[0].figures?.length && last.length < 2) last.push(section);
    else groups.push([section]);
  }
  let singles = 0;
  return (
    <Band tone={tone} rule="t" wide>
      <div id={chapter.id} className="scroll-mt-[calc(var(--header-h)+1rem)]">
        <header className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-12">
          <RevealText as="div" variant="mask" className="section-num text-[clamp(28px,3vw,44px)] leading-none">
            {String(index + 1).padStart(2, "0")}
          </RevealText>
          <div>
            <RevealText
              as="h2"
              variant="mask"
              className="font-display text-[clamp(32px,4.4vw,64px)] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--ink)]"
            >
              {chapter.title}
            </RevealText>
            <RevealText
              as="p"
              variant="fade"
              delay={0.08}
              className="mt-5 max-w-[56ch] text-[17px] leading-[1.55] text-[var(--ink)] md:text-[19px]"
            >
              {chapter.intro}
            </RevealText>
          </div>
        </header>

        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
          {groups.map((group) => {
            if (group.length > 1) {
              return (
                <div key={group[0].title} className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
                  {group.map((section) => (
                    <SectionText key={section.title} section={section} />
                  ))}
                </div>
              );
            }
            const [section] = group;
            const isSingle = Boolean(section.film) || section.figures?.length === 1;
            const flip = isSingle && singles++ % 2 === 1;
            return <Section key={section.title} section={section} flip={flip} />;
          })}
        </div>
      </div>
    </Band>
  );
}
