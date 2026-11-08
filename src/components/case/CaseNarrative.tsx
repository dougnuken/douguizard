"use client";

import { Band, CabBloque, FadeIn, renderBold } from "./primitives";
import type { CaseHeads } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * Problema (`context`) y Mi parte (`contributions`): dos bloques de dos
 * columnas, rótulo a la izquierda y prosa de 18 px (≤ 34 em) a la derecha
 * (02 §5.3, puntos 5 y 6). Cada uno es su propia sección para el índice.
 */
export default function CaseNarrative({
  context,
  contributions,
  idProblema,
  idParte,
  heads,
}: {
  context: string;
  contributions: string[];
  idProblema?: string;
  idParte?: string;
  heads?: CaseHeads;
  tone?: unknown;
}) {
  const t = useDict().case;
  return (
    <>
      <Band id={idProblema} labelledBy={idProblema && `${idProblema}-h`} className="dos">
        <CabBloque id={idProblema && `${idProblema}-h`} rotulo={t.context} titular={heads?.context} />
        <FadeIn>
          <p className="prosa">{renderBold(context)}</p>
        </FadeIn>
      </Band>

      {contributions.length > 0 && (
        <Band id={idParte} labelledBy={idParte && `${idParte}-h`} className="dos">
          <CabBloque id={idParte && `${idParte}-h`} rotulo={t.whatIDid} titular={heads?.contributions} />
          <FadeIn>
            <ul className="lista-parte">
              {contributions.map((c) => (
                <li key={c}>{renderBold(c)}</li>
              ))}
            </ul>
          </FadeIn>
        </Band>
      )}
    </>
  );
}
