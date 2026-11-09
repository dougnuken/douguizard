"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useInteraccion } from "@/lib/primeraInteraccion";

/**
 * `next/link` cuyo prefetch espera a la primera interacción (G1). Al cargar, el
 * prefetch de las losas visibles traía y evaluaba la hoja del caso (~85 KB de
 * JS y el parseo del RSC) dentro de la ventana del TBT móvil. Desde el primer
 * scroll o toque se comporta como un `Link` normal (prefetch por viewport), así
 * que al llegar a la losa la hoja sigue abriendo sin pedir nada.
 */
export default function LinkDiferido(props: ComponentProps<typeof Link>) {
  const listo = useInteraccion();
  return <Link {...props} prefetch={listo ? props.prefetch : false} />;
}
