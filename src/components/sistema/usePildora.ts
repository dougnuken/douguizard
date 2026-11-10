"use client";

import { useCallback, useEffect, useLayoutEffect, type RefObject } from "react";
import {
  PILDORA_MS,
  cajasLiquidas,
  cajaVista,
  guardarHuella,
  leerHuella,
  misma,
  piezas,
  restante,
  traslacion,
  type Caja,
} from "@/lib/pildora";
import { prefiereQuieto } from "@/lib/movimiento";

/**
 * La selección que se desliza (09-MOTION-CONTROLES §3). El contenedor lleva un
 * primer hijo `<Pildora />` (`<span class="pildora">` con tres piezas); la
 * opción activa es la que tiene `aria-current` o `aria-pressed="true"`.
 *
 * En reposo la píldora no se ve: la selección es el fondo de la propia opción
 * (lo de siempre: sin JS, axe y el contraste ven lo mismo). Solo durante el
 * viaje el contenedor lleva `data-moviendo`: las opciones sueltan el fondo y la
 * píldora viaja de la caja de origen a la de destino (WAAPI sobre `transform`,
 * en el compositor; 340 ms, `--curva-salida`). Es interrumpible: un cambio a
 * medio camino arranca desde lo que se ve. Al terminar no queda ninguna
 * animación viva. Con `prefers-reduced-motion`, el cambio es instantáneo.
 */

const ACTIVA = ':scope > [aria-current], :scope > [aria-pressed="true"]';

const cajaDe = (el: HTMLElement): Caja => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

/**
 * Un contenedor sin caja (una ruta anterior que Next guarda oculta con
 * `display: none`, o ya desmontado) no mide ni escribe la memoria: sus cajas
 * serían 0 × 0 y el siguiente viaje saldría de la esquina.
 */
const visible = (nav: HTMLElement) => nav.isConnected && nav.offsetWidth > 0;

function partes(nav: HTMLElement) {
  const p = nav.querySelector<HTMLElement>(":scope > .pildora");
  const t = p ? (Array.from(p.children) as HTMLElement[]) : [];
  return p && t.length === 3 ? { capa: p, t } : null;
}

const vivas = (t: HTMLElement[]) => t.flatMap((e) => e.getAnimations());

function parar(nav: HTMLElement, t: HTMLElement[]) {
  for (const a of vivas(t)) a.cancel();
  delete nav.dataset.moviendo;
}

/** Lo que se ve ahora (si hay un viaje en curso), leído de los `transform` de los círculos. */
function vista(t: HTMLElement[]): Caja | null {
  if (!vivas(t).some((a) => a.playState === "running")) return null;
  const izq = traslacion(getComputedStyle(t[0]).transform);
  const der = traslacion(getComputedStyle(t[2]).transform);
  return izq && der ? cajaVista(izq, der, t[0].offsetHeight) : null;
}

function viajar(nav: HTMLElement, t: HTMLElement[], desde: Caja, hasta: Caja, yaPasado = 0) {
  for (const a of vivas(t)) a.cancel();
  // Pulido G2: viaje líquido (cada borde con su muelle; `cajasLiquidas`).
  const fotos = cajasLiquidas(desde, hasta).map(piezas);
  const a = piezas(hasta);
  nav.dataset.moviendo = "";
  let ultima: Animation | null = null;
  t.forEach((el, i) => {
    el.style.height = `${hasta.h}px`;
    if (i !== 1) el.style.width = `${hasta.h}px`;
    // El valor base es el destino: el cuadro en que termina la animación ya es el bueno.
    el.style.transform = a[i];
    ultima = el.animate(
      fotos.map((f) => ({ transform: f[i] })),
      { duration: PILDORA_MS, easing: "linear" },
    );
    if (yaPasado > 0) ultima.currentTime = yaPasado;
  });
  (ultima as Animation | null)?.finished
    .then(() => {
      if (!vivas(t).length) delete nav.dataset.moviendo;
    })
    .catch(() => {});
}

/** Lleva la píldora de `nav` hasta `destino` (o la deja quieta si ya va hacia allí). */
function moverA(nav: HTMLElement, clave: string, destino: HTMLElement | null) {
  const p = partes(nav);
  if (!p || !visible(nav)) return;
  const h = leerHuella(clave);
  const nueva = destino ? cajaDe(destino) : null;
  if (!nueva || !h?.hasta || prefiereQuieto()) {
    // Sin origen (primera vez, o venía de «ninguna»), sin destino o con RM: sin viaje.
    parar(nav, p.t);
    guardarHuella(clave, { hasta: nueva, viaje: null });
    return;
  }
  if (misma(h.hasta, nueva)) return;
  // Interrumpible: desde lo que se ve, no desde donde «debería» estar.
  const desde = vista(p.t) ?? h.hasta;
  viajar(nav, p.t, desde, nueva);
  guardarHuella(clave, { hasta: nueva, viaje: { desde, hasta: nueva, t0: performance.now() } });
}

/**
 * @param clave  la memoria compartida entre montajes («dock», «pills», «filtros»).
 * @param firma  cambia cuando cambia la opción activa (ruta + sección, filtro…).
 * @returns `mover(el)`: adelanta el viaje al pulsar, antes de que llegue la ruta.
 */
export function usePildora(ref: RefObject<HTMLElement | null>, clave: string, firma: unknown) {
  useLayoutEffect(() => {
    const nav = ref.current;
    if (!nav || !visible(nav)) return;
    const p = partes(nav);
    if (!p) return;
    const activa = nav.querySelector<HTMLElement>(ACTIVA);
    const h = leerHuella(clave);
    if (activa && h?.hasta && misma(h.hasta, cajaDe(activa))) {
      // Ya iba hacia aquí (pulsación adelantada, o el contenedor se acaba de montar
      // a medio viaje): si este montaje no lo está animando, se retoma donde iba.
      if (!vivas(p.t).length && !prefiereQuieto() && h.viaje) {
        const queda = restante(h, performance.now());
        if (queda > 0) viajar(nav, p.t, h.viaje.desde, h.viaje.hasta, PILDORA_MS - queda);
      }
      return;
    }
    moverA(nav, clave, activa);
  }, [ref, clave, firma]);

  // Un cambio de tamaño (fuentes, rotación, ancho) corrige la memoria sin viaje.
  useEffect(() => {
    const nav = ref.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const p = partes(nav);
      if (!p || !visible(nav) || vivas(p.t).length) return;
      const activa = nav.querySelector<HTMLElement>(ACTIVA);
      guardarHuella(clave, { hasta: activa ? cajaDe(activa) : null, viaje: null });
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, [ref, clave]);

  return useCallback(
    (destino: HTMLElement | null) => {
      const nav = ref.current;
      if (nav && destino) moverA(nav, clave, destino);
    },
    [ref, clave],
  );
}
