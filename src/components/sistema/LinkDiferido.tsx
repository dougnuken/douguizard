"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useTrabajoSecundario } from "@/lib/primeraInteraccion";

/**
 * `next/link` cuyo prefetch, en móvil, espera al primer scroll/tecla y a un
 * hueco libre (G1; `useTrabajoSecundario`). Al cargar, el prefetch de los
 * enlaces visibles traía y evaluaba la hoja del caso (~85 KB de JS) y el RSC de
 * `/` y `/cv` dentro de la ventana del TBT móvil. Desde ahí es un `Link` normal
 * (prefetch por viewport): al llegar a la losa, la hoja abre sin pedir nada. En
 * escritorio, como siempre.
 */
export default function LinkDiferido(props: ComponentProps<typeof Link>) {
  const listo = useTrabajoSecundario();
  return <Link {...props} prefetch={listo ? props.prefetch : false} />;
}
