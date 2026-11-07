"use client";

import type { CSSProperties } from "react";
import { Band, FadeIn, renderBold } from "./primitives";
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
export default function CaseProcess({ process, id }: { process: ProcessPhase[]; id?: string; tone?: unknown }) {
  const t = useDict().case;
  const h = id && `${id}-h`;
  return (
    <Band id={id} labelledBy={h}>
      <div className="bloque-cab">
        <h2 id={h} className="t-bloque">
          {t.howItHappened}
        </h2>
      </div>
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
