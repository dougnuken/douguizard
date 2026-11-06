import "./sistema.css";

export type TamanoDot = "s" | "m" | "l" | "xl";

/** px de cada tamaño. El mínimo es 24: Doto nunca baja de 20 px (D20). */
export const TAMANOS_DOT: Record<TamanoDot, number> = { s: 24, m: 30, l: 48, xl: 72 };

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
  if (!etiqueta) {
    return (
      <span className={clases} data-dot>
        {valor}
      </span>
    );
  }
  return (
    <span>
      <span className="sr-only">{etiqueta}</span>
      <span className={clases} data-dot aria-hidden="true">
        {valor}
      </span>
    </span>
  );
}
