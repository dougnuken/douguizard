"use client";

import Image from "next/image";
import { useDict } from "@/i18n/LocaleProvider";
import type { CaseScene, planScenes } from "@/lib/caseScenes";
import { Band, FadeIn } from "./primitives";

const SIZES_FULL = "(max-width: 767px) 92vw, (max-width: 1479px) 92vw, 1344px";
const SIZES_HALF = "(max-width: 767px) 92vw, (max-width: 1479px) 44vw, 660px";

function SceneFigure({ scene, sizes, priority }: { scene: CaseScene; sizes: string; priority?: boolean }) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--paper-raised)] md:rounded-[28px]">
        <Image
          src={scene.src}
          alt={scene.alt}
          width={scene.width}
          height={scene.height}
          sizes={sizes}
          priority={priority}
          draggable={false}
          className="block h-auto w-full select-none"
        />
      </div>
      <figcaption className="mt-3 max-w-[68ch] text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">
        {scene.caption}
      </figcaption>
    </figure>
  );
}

/** The case's hero scene, straight under the header (same paper tone: no seam). */
export function SceneHero({ scene }: { scene: CaseScene }) {
  return (
    <Band tone="paper" wide className="py-0 pb-12 md:py-0 md:pb-16">
      <SceneFigure scene={scene} priority sizes={SIZES_FULL} />
    </Band>
  );
}

export default function CaseScenes({
  tone,
  scenes,
}: {
  tone: "paper" | "raised";
  scenes: ReturnType<typeof planScenes>["band"];
}) {
  const t = useDict().case;
  return (
    <Band tone={tone} rule="t" wide className="py-10 md:py-14">
      <h2 className="sr-only">{t.scenes}</h2>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
        {scenes.map(({ scene, span, offset }, i) => (
          <li
            key={scene.id}
            className={`${span === 12 ? "md:col-span-12" : "md:col-span-6"}${offset ? " md:col-start-4" : ""}`}
          >
            <FadeIn delay={Math.min(i * 0.06, 0.25)}>
              <SceneFigure scene={scene} sizes={span === 12 ? SIZES_FULL : SIZES_HALF} />
            </FadeIn>
          </li>
        ))}
      </ul>
    </Band>
  );
}
