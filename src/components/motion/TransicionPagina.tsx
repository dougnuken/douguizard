"use client";

import { ViewTransition } from "react";

/**
 * Transición entre páginas (G4, pedido de Doug: «de /experience a /cv se ve
 * tosco»). Envuelve el contenido de cada página B (rail, `main`, pie, dock).
 *
 * Las navegaciones del App Router corren dentro de `startTransition`, así que
 * React, al cambiar de página, desmonta este límite en la vieja (exit) y lo
 * monta en la nueva (enter) dentro de un solo `document.startViewTransition`.
 * React deja la raíz sin capturar: la cabecera (fija, en el layout) sigue viva
 * y solo las páginas se animan (patrón «page side-by-side» de transitions.dev:
 * 8 px + blur 3 px, 250 ms, `--curva-suave`; CSS en `globals.css`).
 *
 * Abrir la hoja de un caso (`@modal/(.)work/[slug]`) no toca la página de
 * debajo: este límite no cambia y no hay transición (la hoja tiene la suya).
 *
 * Sin la API (navegador viejo), React cambia la página al instante: el
 * respaldo ligero está en `DireccionTransicion`.
 */
export default function TransicionPagina({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="pag-entra" exit="pag-sale" update="none" share="none" default="none">
      {children}
    </ViewTransition>
  );
}
