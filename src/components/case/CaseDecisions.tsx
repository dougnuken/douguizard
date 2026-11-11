"use client";

import { renderBold } from "@/lib/renderBold";
import { Band, CabBloque, FadeIn } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

export interface Decision {
  title: string;
  body: string;
}

/**
 * Decisiones (02 §5.3, punto 7): una losa por decisión, título en Urbanist y
 * su porqué al lado. Los datos traen título y cuerpo; la maqueta separaba
 * tensión / elección / por qué con copy propio que el caso no tiene, así que
 * no se inventa: el cuerpo va entero.
 */
export default function CaseDecisions({ decisions, id, titular }: { decisions: Decision[]; id?: string; titular?: string }) {
  const t = useDict().case;
  const h = id && `${id}-h`;
  return (
    <Band id={id} labelledBy={h}>
      <CabBloque id={h} rotulo={t.decisions} titular={titular} />
      <ol className="decisiones-caso">
        {decisions.map((d) => (
          <li key={d.title}>
            <FadeIn className="decision-caso">
              <h3 className="t-losa">{d.title}</h3>
              <p className="apoyo">{renderBold(d.body)}</p>
            </FadeIn>
          </li>
        ))}
      </ol>
    </Band>
  );
}
