/**
 * Iconos del dock móvil (pulido D): un solo juego, caja de 24 px, trazo de
 * 1,75 px con puntas y uniones redondeadas. Cada icono tiene tres capas:
 * - `trazo`: el contorno (reposo, outline);
 * - `relleno`: la misma silueta rellena, que entra al quedar seleccionado;
 * - `detalle`: las líneas interiores, que sobre el relleno pasan al color de la
 *   píldora y se leen como recortes.
 * En línea (no en el sprite) para que el CSS alcance cada capa.
 */
export type NombreIconoDock = "trabajo" | "perfil" | "experiencia" | "cv" | "contacto" | "secciones";

type Capas = { relleno: React.ReactNode; trazo: React.ReactNode; detalle?: React.ReactNode };

const MALETIN = <rect x="3" y="7" width="18" height="13" rx="2.5" />;
const CABEZA = <circle cx="12" cy="8" r="3.75" />;
const CUERPO = <path d="M4.75 20c.8-3.6 3.6-5.75 7.25-5.75s6.45 2.15 7.25 5.75z" />;
const PARADAS = (
  <>
    <circle cx="6" cy="18" r="2.25" />
    <circle cx="18" cy="5" r="2.25" />
  </>
);
const HOJA = <path d="M6.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z" />;
const GLOBO = (
  <path d="M6 4.5h12A2.5 2.5 0 0 1 20.5 7v7.5A2.5 2.5 0 0 1 18 17h-6.5L7 20.5V17H6a2.5 2.5 0 0 1-2.5-2.5V7A2.5 2.5 0 0 1 6 4.5z" />
);
const PANEL = <rect x="3.5" y="4" width="17" height="16" rx="2.5" />;

const ICONOS: Record<NombreIconoDock, Capas> = {
  // Maletín con su asa y la costura.
  trabajo: {
    relleno: MALETIN,
    trazo: (
      <>
        {MALETIN}
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      </>
    ),
    detalle: <path d="M3.5 12.5h17" />,
  },
  perfil: {
    relleno: (
      <>
        {CABEZA}
        {CUERPO}
      </>
    ),
    trazo: (
      <>
        {CABEZA}
        {CUERPO}
      </>
    ),
  },
  // Trayectoria: una ruta de una parada a otra (se rellenan las paradas).
  experiencia: {
    relleno: PARADAS,
    trazo: (
      <>
        {PARADAS}
        <path d="M8.25 18H15a3.25 3.25 0 0 0 0-6.5H9A3.25 3.25 0 0 1 9 5h6.75" />
      </>
    ),
  },
  // Documento con la esquina doblada y dos líneas de texto.
  cv: {
    relleno: HOJA,
    trazo: HOJA,
    detalle: <path d="M14 3v3.5A1.5 1.5 0 0 0 15.5 8H19M8.5 12.5h7M8.5 16h4.5" />,
  },
  contacto: { relleno: GLOBO, trazo: GLOBO, detalle: <path d="M8.5 10.75h.01M12 10.75h.01M15.5 10.75h.01" /> },
  secciones: { relleno: PANEL, trazo: PANEL, detalle: <path d="M7.5 9h9M7.5 12h9M7.5 15h5.5" /> },
};

/** Decorativo: el nombre accesible es la etiqueta del destino. */
export function IconoDock({ nombre }: { nombre: NombreIconoDock }) {
  const c = ICONOS[nombre];
  return (
    <svg className="icono-dock" data-icono={nombre} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <g className="icono-dock__relleno">{c.relleno}</g>
      <g className="icono-dock__trazo">{c.trazo}</g>
      {c.detalle ? <g className="icono-dock__detalle">{c.detalle}</g> : null}
    </svg>
  );
}
