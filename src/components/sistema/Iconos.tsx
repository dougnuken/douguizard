import "./sistema.css";

/** Trazos de 20×20 de la maqueta B (`propuestas/B/index.html`). */
const TRAZOS = {
  flecha: <path d="M6 14 14 6M7.5 6H14v6.5" />,
  cerrar: <path d="M5 5l10 10M15 5 5 15" />,
  izq: <path d="M12 5 7 10l5 5" />,
  der: <path d="M8 5l5 5-5 5" />,
  correo: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="2" />
      <path d="m3.5 6 6.5 5 6.5-5" />
    </>
  ),
  bajar: <path d="M10 3.5v9M6 9l4 4 4-4M4 16.5h12" />,
  arriba: <path d="M10 16V5M5.5 9.5 10 5l4.5 4.5" />,
  trabajo: (
    <>
      <rect x="3" y="6.5" width="14" height="10" rx="2" />
      <path d="M7.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12.5 5v1.5" />
    </>
  ),
  perfil: (
    <>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4 16.5c1.2-3 3.4-4.3 6-4.3s4.8 1.3 6 4.3" />
    </>
  ),
  cv: (
    <>
      <path d="M5.5 2.5h6l3.5 3.5v11.5h-9.5z" />
      <path d="M11.5 2.5V6H15M8 10.5h5M8 13.5h5" />
    </>
  ),
  copiar: (
    <>
      <rect x="7" y="7" width="9.5" height="9.5" rx="2" />
      <path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v6a1.5 1.5 0 0 0 1.5 1.5H7" />
    </>
  ),
} as const;

export type NombreIcono = keyof typeof TRAZOS;
export const NOMBRES_ICONO = Object.keys(TRAZOS) as NombreIcono[];

/** El sprite: una vez por página (lo monta la página que usa `Icono`). */
export function IconosSprite() {
  return (
    <svg className="icono-sprite" aria-hidden="true" focusable="false">
      {NOMBRES_ICONO.map((n) => (
        <symbol key={n} id={`i-${n}`} viewBox="0 0 20 20">
          {TRAZOS[n]}
        </symbol>
      ))}
    </svg>
  );
}

/** Un icono del sprite. Siempre decorativo: el nombre accesible lo pone quien lo usa. */
export function Icono({ nombre, className }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg className={className ? `icono ${className}` : "icono"} aria-hidden="true" focusable="false">
      <use href={`#i-${nombre}`} />
    </svg>
  );
}
