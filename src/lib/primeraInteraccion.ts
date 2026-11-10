"use client";

import { useSyncExternalStore } from "react";

/**
 * G1 · Primeras interacciones de la visita. Lo que no hace falta para pintar ni
 * para la primera lectura espera a ellas y no compite con la hidratación (el
 * trabajo que subía el TBT móvil):
 * - el WebGL del vidrio en móvil, a **cualquier** gesto (toque, puntero, scroll,
 *   tecla, rueda): la lente se arrastra con el dedo;
 * - los prefetch de los enlaces en móvil, a un gesto de **avance** (scroll,
 *   rueda, tecla) y a un hueco libre: quien va a las losas se desplaza, y así el
 *   prefetch no cae encima del primer arrastre de la lente.
 * Escuchas en captura y pasivas, un juego por tipo, para toda la página.
 */
function unaVez(gestos: readonly string[]) {
  let ocurrio = false;
  const avisos = new Set<() => void>();
  const gesto = () => {
    ocurrio = true;
    gestos.forEach((g) => window.removeEventListener(g, gesto, true));
    const pendientes = [...avisos];
    avisos.clear();
    pendientes.forEach((cb) => cb());
  };
  /** Llama a `cb` en el primer gesto (o ya, si ocurrió). Devuelve la baja. */
  return (cb: () => void): (() => void) => {
    if (ocurrio) {
      cb();
      return () => {};
    }
    if (avisos.size === 0) gestos.forEach((g) => window.addEventListener(g, gesto, { capture: true, passive: true }));
    avisos.add(cb);
    return () => {
      avisos.delete(cb);
      if (avisos.size === 0 && !ocurrio) gestos.forEach((g) => window.removeEventListener(g, gesto, true));
    };
  };
}

/** Cualquier primera interacción. */
export const alInteractuar = unaVez(["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"]);
/** El primer gesto de avance por la página. */
const alAvanzar = unaVez(["scroll", "wheel", "keydown"]);

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
 * (≥ 1024) desde la hidratación, como antes; por debajo, tras el primer gesto
 * de avance y un hueco libre (`requestIdleCallback`, ≤ 1,5 s). `false` en el
 * servidor y en la hidratación.
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
          alAvanzar(() => {
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
