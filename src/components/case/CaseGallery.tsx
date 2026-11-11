"use client";

import MockupGallery from "@/components/work/MockupGallery";
import { useDict } from "@/i18n/LocaleProvider";
import type { FrameKind, Shot } from "@/lib/caseMedia";
import { GaleriaLosas, PlainGallery, toMockupItems } from "./caseFrames";
import { Band, EyebrowHeading } from "./primitives";

/**
 * The stills the showcase did not take, after the argument they illustrate.
 *
 * Wider than the prose bands: four phones, or two browser windows side by
 * side, need real room. Numbers continue from the showcase — when "01" opened
 * the page, this band starts at "02".
 */
export default function CaseGallery({
  project,
  shots,
  kind,
}: {
  project: string;
  shots: Shot[];
  kind: FrameKind;
}) {
  const t = useDict().case;
  if (shots.length === 0) return null;
  const ariaLabel = t.productScreens(project);

  return (
    <Band>
      <EyebrowHeading>{t.gallery}</EyebrowHeading>

      <div className="mt-10 md:mt-12">
        {/* Las capturas de escritorio van en losas B, sin barra de ventana
            (F7 P1-4): la primera a todo el ancho si son impares, el resto por
            pares, así las de un mismo módulo comparten fila. */}
        {kind === "browser" && <GaleriaLosas shots={shots} ariaLabel={ariaLabel} />}

        {kind === "plain" && <PlainGallery shots={shots} ariaLabel={ariaLabel} />}

        {kind === "phone" && <MockupGallery ariaLabel={ariaLabel} hint={t.swipe} items={toMockupItems(shots)} />}
      </div>
    </Band>
  );
}
