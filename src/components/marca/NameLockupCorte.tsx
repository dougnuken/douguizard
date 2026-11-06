"use client";

import { useEffect, useRef } from "react";
import { bezier, CONSULTA_CORTE, corteDesdeMetricas, ENTRADA, fijarCorte, topSobreLaser } from "@/lib/corte";

/**
 * Isla del «corte láser». No pinta nada: busca su `[data-lockup]` y, **solo a
 * ≥ 1024 px y sin movimiento reducido**:
 * 1. mide `--corte` con `measureText` sobre la fuente real (tras `fonts.load`);
 * 2. si hay `laser`, coloca el nombre para que el láser pase por el corte (dos
 *    pases: el cálculo y una corrección con la posición medida);
 * 3. hace la entrada **una sola vez**: a los 880 ms abre de t = 0 a 1 en 520 ms
 *    `--curva-salida`, con `requestAnimationFrame` (al terminar no queda ninguna
 *    animación viva: nada de bucles ni rebote, que sería glitch, 01 §8);
 * 4. deja `--desp` al dueño del scroll (`fijarCorte`), y vuelve a medir con
 *    `ResizeObserver` y `document.fonts.ready`.
 * Marca `data-corte-isla="activa"` mientras trabaja; fuera de su consulta deja
 * el nombre cerrado y quita lo que puso.
 */
export default function NameLockupCorte({ laser, entrada = true }: { laser?: string; entrada?: boolean }) {
  const ancla = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = ancla.current?.closest<HTMLElement>("[data-lockup]");
    const l2 = raiz?.querySelector<HTMLElement>(".l2");
    const sup = raiz?.querySelector<HTMLElement>(".m.sup");
    if (!raiz || !l2 || !sup) return;
    const lockup: HTMLElement = raiz;
    const mq = window.matchMedia(CONSULTA_CORTE);
    let vivo = true;
    let raf = 0;
    let temporizador = 0;
    let entro = false;

    const medir = () => {
      const cs = getComputedStyle(sup);
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || fs * 0.9;
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx || !fs) return 0;
      ctx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const m = ctx.measureText(sup.textContent ?? "");
      const x = ctx.measureText("x");
      const corte = corteDesdeMetricas({
        interlineado: lh,
        ascendente: m.fontBoundingBoxAscent,
        descendente: m.fontBoundingBoxDescent,
        alturaX: x.actualBoundingBoxAscent,
      });
      lockup.style.setProperty("--corte", `${corte}px`);
      return corte;
    };

    const colocar = (corte: number) => {
      const linea = laser ? document.querySelector<HTMLElement>(laser) : null;
      const padre = lockup.offsetParent as HTMLElement | null;
      if (!linea || !padre) return;
      const yLaser = () => {
        const r = linea.getBoundingClientRect();
        return r.top + r.height / 2 - padre.getBoundingClientRect().top;
      };
      lockup.style.top = `${topSobreLaser(yLaser(), l2.offsetTop, corte)}px`;
      // Segundo pase: la y real del corte contra la del láser (redondeos, swap).
      const yCorte = l2.getBoundingClientRect().top + corte - padre.getBoundingClientRect().top;
      const delta = yLaser() - yCorte;
      if (Math.abs(delta) > 0.25) lockup.style.top = `${parseFloat(lockup.style.top) + delta}px`;
      lockup.dataset.colocado = "";
    };

    const abrir = () => {
      const [x1, y1, x2, y2] = ENTRADA.curva;
      let t0 = 0;
      const paso = (ahora: number) => {
        if (!vivo || !mq.matches) return;
        if (!t0) t0 = ahora;
        const x = Math.min(1, (ahora - t0) / ENTRADA.duracionMs);
        fijarCorte(lockup, bezier(x1, y1, x2, y2, x));
        if (x < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    };

    const preparar = () => {
      const corte = medir();
      if (corte) colocar(corte);
    };

    const aplicar = () => {
      if (!mq.matches) {
        cancelAnimationFrame(raf);
        clearTimeout(temporizador);
        // Solo deshace lo que puso: sin isla activa, el HTML ya está cerrado.
        if (lockup.dataset.corteIsla) {
          delete lockup.dataset.corteIsla;
          lockup.style.removeProperty("--corte");
          fijarCorte(lockup, 0);
        }
        return;
      }
      const familia = getComputedStyle(sup).fontFamily;
      document.fonts
        .load(`600 1em ${familia}`)
        .catch(() => undefined)
        .then(() => {
          if (!vivo || !mq.matches) return;
          lockup.dataset.corteIsla = "activa";
          preparar();
          lockup.dataset.colocado = "";
          if (entrada && !entro) {
            entro = true;
            temporizador = window.setTimeout(abrir, ENTRADA.retrasoMs);
          }
        });
    };

    aplicar();
    mq.addEventListener("change", aplicar);
    const ro = new ResizeObserver(() => mq.matches && lockup.dataset.corteIsla && preparar());
    ro.observe(lockup);
    document.fonts.ready.then(() => vivo && mq.matches && lockup.dataset.corteIsla && preparar());
    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      clearTimeout(temporizador);
      mq.removeEventListener("change", aplicar);
      ro.disconnect();
    };
  }, [laser, entrada]);

  return <span ref={ancla} hidden />;
}
