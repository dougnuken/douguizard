import "./sistema.css";

export type TamanoDot = "s" | "m" | "l" | "xl";

/** px de cada tamaño. El mínimo es 24: Doto nunca baja de 20 px (D20). */
export const TAMANOS_DOT: Record<TamanoDot, number> = { s: 24, m: 30, l: 48, xl: 72 };

/**
 * El punto de miles de las cifras en ES («2.000») en Doto es un cuadro de
 * puntos que se lee como «2·000». Se envuelve en `span.punto`: el glifo queda
 * transparente (el texto real no cambia: se copia y se lee «2.000») y un punto
 * redondo con `::after` ocupa su lugar (NOTAS de B-paginas §6).
 */
function conPuntos(valor: string): React.ReactNode {
  // P2-7 (F7 P2-1): la virgulilla de Doto se lee como dos puntos altos («˙˙1.200»);
  // va en la fuente de los titulares, más pequeña y en la línea media.
  if (valor.startsWith("~")) {
    return [
      <span key="v" className="virgulilla">
        ~
      </span>,
      conPuntos(valor.slice(1)),
    ];
  }
  if (!/\d\.\d/.test(valor)) return valor;
  return valor.split(/(?<=\d)\.(?=\d)/).flatMap((trozo, i) =>
    i === 0
      ? [trozo]
      : [
          <span key={`p${i}`} className="punto">
            .
          </span>,
          trozo,
        ],
  );
}

/**
 * Cifra o fecha en Doto (matriz de puntos, `ROND 100`, `tabular-nums`). Con
 * `etiqueta`, el lector de pantalla oye la frase completa («12 años») y no la
 * cifra suelta; sin ella, la cifra es texto real y se lee tal cual.
 */
export default function DotMatrix({
  valor,
  etiqueta,
  tamano = "m",
  className,
}: {
  valor: string;
  etiqueta?: string;
  tamano?: TamanoDot;
  className?: string;
}) {
  const clases = ["dot", `dot--${tamano}`, className].filter(Boolean).join(" ");
  const cifra = conPuntos(valor);
  if (!etiqueta) {
    return (
      <span className={clases} data-dot>
        {cifra}
      </span>
    );
  }
  return (
    <span>
      <span className="sr-only">{etiqueta}</span>
      <span className={clases} data-dot aria-hidden="true">
        {cifra}
      </span>
    </span>
  );
}
