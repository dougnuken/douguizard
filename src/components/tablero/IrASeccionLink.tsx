"use client";

import { irASeccion } from "@/lib/irASeccion";

/**
 * Enlace a una sección del home que además lleva el foco a ella («Ver casos»
 * de K2, «Escríbeme» de K5). Sin JS es un `href="#id"` normal.
 */
export default function IrASeccionLink({
  seccion,
  className,
  children,
  ...resto
}: { seccion: string; className?: string; children: React.ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children" | "onClick"
>) {
  return (
    <a href={`#${seccion}`} className={className} onClick={(ev) => irASeccion(ev, seccion)} {...resto}>
      {children}
    </a>
  );
}
