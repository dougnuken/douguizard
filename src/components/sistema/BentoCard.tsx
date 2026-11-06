import Link from "next/link";
import "./sistema.css";
import Flecha from "./Flecha";
import Losa, { type RadioLosa, type Superficie } from "./Losa";

type Props = {
  href: string;
  /** Título visible. Es también el nombre accesible del enlace (`aria-labelledby`). */
  titulo: React.ReactNode;
  /** id del título, único en la página. */
  tituloId: string;
  ceja?: React.ReactNode;
  superficie?: Superficie;
  radio?: RadioLosa;
  flecha?: "blanca" | "tinta" | "osc" | false;
  /** Solo el lab: fuerza el aspecto de hover o foco para verlo en reposo. */
  forzar?: "hover" | "foco";
  className?: string;
  children?: React.ReactNode;
};

/**
 * `Losa` + capa de enlace a tamaño de card. La capa es un `<a>` real del tamaño
 * de la losa (no un `::after` de un enlace de 20 px: `a11y 3.6` mide la caja del
 * `<a>`), nombrado por el título visible. Los enlaces secundarios van dentro de
 * `.bento-sobre`, por encima de la capa. Hover, foco y pressed con `translate` y
 * `scale` (propiedades individuales: no chocan con los `transform` de GSAP).
 */
export default function BentoCard({
  href,
  titulo,
  tituloId,
  ceja,
  superficie = "losa",
  radio,
  flecha = "blanca",
  forzar,
  className,
  children,
}: Props) {
  return (
    <Losa
      as="article"
      superficie={superficie}
      radio={radio}
      className={className ? `bento ${className}` : "bento"}
      data-forzar={forzar}
    >
      <div>
        {ceja && <p className="ceja">{ceja}</p>}
        <h3 id={tituloId} className="t-losa" style={ceja ? { marginTop: 8 } : undefined}>
          {titulo}
        </h3>
      </div>
      {children}
      {flecha && <Flecha variante={flecha} />}
      <Link href={href} className="bento-capa" aria-labelledby={tituloId} />
    </Losa>
  );
}
