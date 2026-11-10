"use client";

import type { CSSProperties } from "react";
import { renderBold } from "@/lib/renderBold";
import { Band, CabBloque, FadeIn } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

export interface ProcessPhase {
  phase: string;
  title: string;
  body: string;
}

/**
 * Proceso (02 §5.3, punto 9): un riel de fases cosido por el hilo láser, con el
 * número de cada fase en Doto sobre el hilo. En móvil el riel es vertical.
 */
export default function CaseProcess({ process, id, titular }: { process: ProcessPhase[]; id?: string; titular?: string; tone?: unknown }) {
  const t = useDict().case;
  const h = id && `${id}-h`;
  return (
    <Band id={id} labelledBy={h}>
      <CabBloque id={h} rotulo={t.howItHappened} titular={titular} />
      <FadeIn>
        <ol className="riel-caso" style={{ "--n": Math.min(process.length, 4) } as CSSProperties}>
          {process.map((p) => (
            <li key={p.phase}>
              <span className="dot dot--m" aria-hidden="true">
                {p.phase}
              </span>
              <h3 className="t-losa">{p.title}</h3>
              <p className="apoyo">{renderBold(p.body)}</p>
            </li>
          ))}
        </ol>
      </FadeIn>
    </Band>
  );
}
