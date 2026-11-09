"use client";

import { useSyncExternalStore } from "react";

/**
 * G1 · La primera interacción de la visita (toque, scroll, tecla, rueda o
 * puntero). Lo que no hace falta para pintar ni para la primera lectura (el
 * WebGL del vidrio en móvil, los prefetch de los enlaces) espera a este momento
 * y no compite con la hidratación: es el trabajo que subía el TBT móvil.
 * Un solo juego de escuchas, en captura y pasivas, para toda la página.
 */
const GESTOS = ["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"] as const;

let ocurrio = false;
const avisos = new Set<() => void>();

function gesto() {
  ocurrio = true;
  GESTOS.forEach((g) => window.removeEventListener(g, gesto, true));
  const pendientes = [...avisos];
  avisos.clear();
  pendientes.forEach((cb) => cb());
}

/** Llama a `cb` en la primera interacción (o ya, si ocurrió). Devuelve la baja. */
export function alInteractuar(cb: () => void): () => void {
  if (ocurrio) {
    cb();
    return () => {};
  }
  if (avisos.size === 0) GESTOS.forEach((g) => window.addEventListener(g, gesto, { capture: true, passive: true }));
  avisos.add(cb);
  return () => {
    avisos.delete(cb);
    if (avisos.size === 0 && !ocurrio) GESTOS.forEach((g) => window.removeEventListener(g, gesto, true));
  };
}

let libre = false;
let iniciado = false;
const avisosLibre = new Set<() => void>();

function marcarLibre() {
  libre = true;
  avisosLibre.forEach((cb) => cb());
  avisosLibre.clear();
}

/**
 * `true` cuando ya se puede hacer trabajo secundario (prefetch): en escritorio
 * (≥ 1024) desde la hidratación, como antes; por debajo, tras la primera
 * interacción y un hueco libre (`requestIdleCallback`, ≤ 1,5 s), para no caer
 * encima de la hidratación ni del primer gesto. `false` en el servidor.
 */
export function useTrabajoSecundario(): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (libre) return () => {};
      avisosLibre.add(cb);
      if (!iniciado) {
        iniciado = true;
        if (window.matchMedia("(min-width: 1024px)").matches) queueMicrotask(marcarLibre);
        else
          alInteractuar(() => {
            const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1));
            ric(marcarLibre, { timeout: 1500 } as IdleRequestOptions);
          });
      }
      return () => avisosLibre.delete(cb);
    },
    () => libre,
    () => false,
  );
}
