"use client";

import { useRef } from "react";
import { useScrollScene } from "./useScrollScene";

/**
 * Isla del acto 1 del home (07 F5). No pinta nada: ancla `useScrollScene` a la
 * pista de la escena. GSAP se pide con `import()` tras el `load` y un hueco
 * libre, solo a ≥ 1024 px sin RM; en móvil, con RM o sin JS no se pide nunca.
 */
export default function EscenaCliente() {
  const ancla = useRef<HTMLSpanElement>(null);
  useScrollScene(ancla);
  return <span ref={ancla} hidden />;
}
