import "./sistema.css";

/**
 * Punto de disponible en luz láser (núcleo claro, aro y halo rojos; P1-6) +
 * texto. El punto es decorativo: el texto dice el estado.
 */
export default function Estado({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className ? `estado ${className}` : "estado"}>{children}</span>;
}
