"use client";

import { useEffect, useRef } from "react";
import { alturaCorte, CONSULTA_CORTE } from "@/lib/corte";

/**
 * Isla del «corte láser». No pinta nada: busca su `[data-lockup]`, mide con
 * `measureText` dónde cae el ojo medio de «Vargas» y, solo a ≥ 1024 px y sin
 * movimiento reducido, marca `data-corte="activo"` con `--corte` en px. Sin JS,
 * a < 1024 px o con movimiento reducido no hay corte: el nombre se ve entero.
 *
 * Activo no significa abierto: la apertura (`--apertura`, 0 por defecto) la
 * mueve la escena (F5) con `fijarApertura()`. El estado de partida es cerrado.
 */
export default function CorteLaser() {
  const ancla = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lockup = ancla.current?.closest<HTMLElement>("[data-lockup]");
    const linea = lockup?.querySelector<HTMLElement>(".lockup-sup");
    if (!lockup || !linea) return;
    const mq = window.matchMedia(CONSULTA_CORTE);
    let vivo = true;

    const medir = () => {
      const cs = getComputedStyle(linea);
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || fs * 0.9;
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx || !fs) return;
      ctx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const m = ctx.measureText("Vargas");
      const x = ctx.measureText("x");
      const corte = alturaCorte({
        interlineado: lh,
        ascendente: m.fontBoundingBoxAscent,
        descendente: m.fontBoundingBoxDescent,
        alturaX: x.actualBoundingBoxAscent,
      });
      lockup.style.setProperty("--corte", `${corte}px`);
      lockup.dataset.corte = "activo";
    };

    const aplicar = () => {
      if (!mq.matches) {
        delete lockup.dataset.corte;
        lockup.style.removeProperty("--corte");
        return;
      }
      // Medir con la fuente real, no con la de respaldo.
      document.fonts.ready.then(() => vivo && mq.matches && medir());
    };

    aplicar();
    mq.addEventListener("change", aplicar);
    const ro = new ResizeObserver(() => mq.matches && medir());
    ro.observe(lockup);
    return () => {
      vivo = false;
      mq.removeEventListener("change", aplicar);
      ro.disconnect();
    };
  }, []);

  return <span ref={ancla} hidden />;
}
