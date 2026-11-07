"use client";

import { useEffect, type RefObject } from "react";

/** Distancia (px) o velocidad (px/ms) a partir de la cual soltar cierra la hoja. */
export const UMBRAL_PX = 120;
export const UMBRAL_VEL = 0.5;

/**
 * Arrastre para cerrar (móvil, 07 §1.2): se arrastra la cabecera de la hoja
 * hacia abajo. Por debajo del umbral, la hoja vuelve a su sitio; por encima,
 * `cerrar()`. Hacia arriba hay banda elástica (un tercio del gesto, como iOS).
 * La posición va en `--arrastre` del panel; mientras dura el gesto, el panel
 * lleva `data-arrastrando` para que no haya transición entre cuadros.
 */
export function useArrastreHoja(
  asa: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
  cerrar: () => void,
) {
  useEffect(() => {
    const cab = asa.current;
    const pan = panel.current;
    if (!cab || !pan) return;
    let inicio: { y: number; t: number; id: number } | null = null;
    let ultimo = { y: 0, t: 0 };
    let vel = 0;

    const abajo = (e: PointerEvent) => {
      // Los botones y enlaces de la cabecera siguen siendo botones.
      if ((e.target as Element).closest("a, button")) return;
      if (e.button !== 0) return;
      inicio = { y: e.clientY, t: e.timeStamp, id: e.pointerId };
      ultimo = { y: e.clientY, t: e.timeStamp };
      vel = 0;
      cab.setPointerCapture?.(e.pointerId);
      pan.dataset.arrastrando = "";
    };
    const mueve = (e: PointerEvent) => {
      if (!inicio || e.pointerId !== inicio.id) return;
      const dy = e.clientY - inicio.y;
      const dt = e.timeStamp - ultimo.t;
      if (dt > 0) vel = (e.clientY - ultimo.y) / dt;
      ultimo = { y: e.clientY, t: e.timeStamp };
      pan.style.setProperty("--arrastre", `${dy >= 0 ? dy : dy / 3}px`);
    };
    const suelta = (e: PointerEvent) => {
      if (!inicio || e.pointerId !== inicio.id) return;
      const dy = e.clientY - inicio.y;
      inicio = null;
      delete pan.dataset.arrastrando;
      if (dy > UMBRAL_PX || (dy > 0 && vel > UMBRAL_VEL)) {
        cerrar();
      } else {
        pan.style.removeProperty("--arrastre");
      }
    };

    cab.addEventListener("pointerdown", abajo);
    cab.addEventListener("pointermove", mueve);
    cab.addEventListener("pointerup", suelta);
    cab.addEventListener("pointercancel", suelta);
    return () => {
      cab.removeEventListener("pointerdown", abajo);
      cab.removeEventListener("pointermove", mueve);
      cab.removeEventListener("pointerup", suelta);
      cab.removeEventListener("pointercancel", suelta);
    };
  }, [asa, panel, cerrar]);
}
