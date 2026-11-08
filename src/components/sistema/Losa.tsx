import "./sistema.css";
import type { Superficie } from "@/data/home";

export type { Superficie };

/** Radio de la losa: `losa` 48/36 (por defecto), `m` 32/28, `s` 24/20. */
export type RadioLosa = "losa" | "m" | "s";

type Props = {
  superficie?: Superficie;
  radio?: RadioLosa;
  as?: "div" | "article" | "section" | "aside" | "li";
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Superficie del sistema B: `vacio`, `losa`, `clara`, `niebla`, `azul`,
 * `magenta` o `vidrio`, con su radio, padding y filo de 1 px. El texto hereda la
 * tinta correcta para la superficie (`.ceja`, `.apoyo`, `.etiqueta`, `.t-losa`).
 */
export default function Losa({
  superficie = "losa",
  radio = "losa",
  as: Tag = "div",
  className,
  children,
  ...resto
}: Props) {
  const clases = ["losa", `losa--${superficie}`, radio !== "losa" && `losa--r-${radio}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={clases} data-superficie={superficie} {...resto}>
      {children}
    </Tag>
  );
}
