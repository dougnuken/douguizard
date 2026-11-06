import "./sistema.css";
import { Icono } from "./Iconos";

/** Flecha circular de las cards: blanca (por defecto), `tinta` u `osc`. Decorativa. */
export default function Flecha({ variante = "blanca" }: { variante?: "blanca" | "tinta" | "osc" }) {
  return (
    <span className={variante === "blanca" ? "flecha" : `flecha flecha--${variante}`} aria-hidden="true">
      <Icono nombre="flecha" />
    </span>
  );
}
