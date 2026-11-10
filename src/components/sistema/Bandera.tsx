import "./sistema.css";

/**
 * Bandera inline de 16 × 12 para la ficha «Datos» (Colombia, EE. UU.). Decorativa:
 * el texto de al lado ya nombra el idioma, así que va `aria-hidden`. Las esquinas
 * de 2 px las da el CSS (`.bandera`), sin `clipPath` ni ids que se repitan.
 */
export default function Bandera({ pais }: { pais: "co" | "us" }) {
  return (
    <svg className="bandera" width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" focusable="false">
      {pais === "co" ? (
        <>
          <rect width="16" height="6" fill="#FCD116" />
          <rect y="6" width="16" height="3" fill="#003893" />
          <rect y="9" width="16" height="3" fill="#CE1126" />
        </>
      ) : (
        <>
          <rect width="16" height="12" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={(i * 12) / 13} width="16" height={12 / 13} fill="#B22234" />
          ))}
          <rect width="7" height={(7 * 12) / 13} fill="#3C3B6E" />
          {[
            [1.5, 1.4],
            [3.5, 1.4],
            [5.5, 1.4],
            [2.5, 3.1],
            [4.5, 3.1],
            [1.5, 4.8],
            [3.5, 4.8],
            [5.5, 4.8],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r=".55" fill="#fff" />
          ))}
        </>
      )}
    </svg>
  );
}
