"use client";

import { Band, FadeIn, renderBold } from "./primitives";
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
}: {
  context: string;
  contributions: string[];
  idProblema?: string;
  idParte?: string;
  tone?: unknown;
}) {
  const t = useDict().case;
  return (
    <>
      <Band id={idProblema} labelledBy={idProblema && `${idProblema}-h`} className="dos">
        <div className="bloque-cab">
          <h2 id={idProblema && `${idProblema}-h`} className="t-bloque">
            {t.context}
          </h2>
        </div>
        <FadeIn>
          <p className="prosa">{renderBold(context)}</p>
        </FadeIn>
      </Band>

      {contributions.length > 0 && (
        <Band id={idParte} labelledBy={idParte && `${idParte}-h`} className="dos">
          <div className="bloque-cab">
            <h2 id={idParte && `${idParte}-h`} className="t-bloque">
              {t.whatIDid}
            </h2>
          </div>
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
