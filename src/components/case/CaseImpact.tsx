"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import DotMatrix from "@/components/sistema/DotMatrix";
import { Band } from "./primitives";
import type { CaseStudy, Kpi } from "@/data/work";
import { useDict } from "@/i18n/LocaleProvider";

/**
 * Avance de un carácter de Doto en em, ya con el tracking de −0,06 em de la
 * cifra. Medido a ojo sobre el subconjunto y redondeado hacia arriba, para que
 * la estimación se equivoque del lado de caber. El punto de miles del ES es el
 * `span.punto` de 0,32 em (NOTAS §6).
 */
function avance(ch: string, punto: boolean): number {
  if (ch === "." && punto) return 0.32;
  if (ch === " ") return 0.3;
  return 0.56;
}

/**
 * k de P1-6: el ancho en em de la cifra más larga del caso. Las cuatro losas
 * usan el mismo k, así todas las cifras de un caso salen al mismo tamaño:
 * `min(72px, 100cqi / k)` (48 a < 1024). Para «~1.200», k ≈ 3,05.
 */
export function anchoCifras(kpis: Pick<Kpi, "value">[]): number {
  const k = Math.max(
    1,
    ...kpis.map((kpi) => {
      const punto = /\d\.\d/.test(kpi.value);
      return [...kpi.value].reduce((em, ch) => em + avance(ch, punto), 0);
    }),
  );
  return Math.round(k * 100) / 100;
}

/**
 * Tablero de impacto (P1-6): una losa por KPI, la primera clara, la cifra en
 * Doto que se «enciende» (100 → 700) al entrar al 40 %, la etiqueta debajo y el
 * `delta` como nota. Después, la frase que lee las cifras (`impact`), que es
 * contenido del caso y no se pierde.
 *
 * Un producto propio que no salió (`kind: "side"`) tiene una premisa, no
 * resultados: el `h2` (oculto) dice «La idea».
 */
export default function CaseImpact({
  impact,
  kpis,
  kind,
  id,
}: {
  impact: string;
  kpis?: Kpi[];
  kind?: CaseStudy["kind"];
  id?: string;
  tone?: unknown;
}) {
  const t = useDict().case;
  const figures = kpis && kpis.length > 0 ? kpis : undefined;
  const tablero = useRef<HTMLUListElement>(null);
  const [encendido, setEncendido] = useState(false);

  useEffect(() => {
    const el = tablero.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setEncendido(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEncendido(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tituloId = id ? `${id}-h` : undefined;
  return (
    <Band id={id} labelledBy={tituloId}>
      <h2 id={tituloId} className="sr-only">
        {kind === "side" ? t.idea : t.impact}
      </h2>

      {figures && (
        <ul
          ref={tablero}
          className="tablero-caso"
          data-encendido={encendido ? "" : undefined}
          style={{ "--k": anchoCifras(figures) } as CSSProperties}
        >
          {figures.map((kpi, i) => (
            <li
              key={kpi.label}
              className={i === 0 ? "kpi-caso clara" : "kpi-caso"}
              style={{ "--i": i } as CSSProperties}
            >
              <DotMatrix valor={kpi.value} tamano="xl" />
              <span className="kpi-et">{kpi.label}</span>
              {kpi.delta && <span className="micro">{kpi.delta}</span>}
            </li>
          ))}
        </ul>
      )}

      <p className="impacto-lectura">{impact}</p>
    </Band>
  );
}
