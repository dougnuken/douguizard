// G1: prefetch tras la primera interacción (ver LinkDiferido).
import Link from "@/components/sistema/LinkDiferido";
import "./sistema.css";
import { Icono, type NombreIcono } from "./Iconos";

export type VarianteBoton = "blanco" | "tinta" | "linea" | "linea-osc";

type Comun = {
  variante?: VarianteBoton;
  grande?: boolean;
  icono?: NombreIcono;
  className?: string;
  children: React.ReactNode;
};

type ComoEnlace = Comun & { href: string; descargar?: boolean } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;
type ComoBoton = Comun & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

/**
 * Botón pastilla (≥ 48 px de alto; `grande` = 56). Con `href` es un enlace
 * (`<Link>` si es interno, `<a>` si es externo o una descarga); sin él, un
 * `<button type="button">`.
 */
export default function Boton(props: ComoEnlace | ComoBoton) {
  const { variante = "blanco", grande, icono, className, children } = props;
  const clases = ["boton", `boton--${variante}`, grande && "boton--grande", className]
    .filter(Boolean)
    .join(" ");
  const contenido = (
    <>
      {children}
      {icono && <Icono nombre={icono} />}
    </>
  );
  if (props.href !== undefined) {
    const { variante: _v, grande: _g, icono: _i, className: _c, children: _ch, href, descargar, ...resto } = props;
    const externo = /^(https?:|mailto:|tel:)/.test(href) || descargar || /\.pdf$/.test(href);
    if (externo) {
      return (
        <a href={href} className={clases} download={descargar || undefined} {...resto}>
          {contenido}
        </a>
      );
    }
    return (
      <Link href={href} className={clases} {...resto}>
        {contenido}
      </Link>
    );
  }
  const { variante: _v, grande: _g, icono: _i, className: _c, children: _ch, href: _h, ...resto } = props;
  return (
    <button type="button" className={clases} {...resto}>
      {contenido}
    </button>
  );
}
