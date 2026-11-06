"use client";

import { useEffect, type RefObject } from "react";

/**
 * Lente del cursor sobre el vidrio (07 §1.3): muelles X/Y críticamente
 * amortiguados (respuesta 0,35 s; la apertura entra con k = 7 y sale con k = 4).
 * Táctil: arrastrar en horizontal sobre la foto la mueve 1:1 (el contenedor
 * lleva `touch-action: pan-y pinch-zoom`: el arrastre vertical hace scroll y el
 * navegador cancela el puntero). El bucle rAF solo corre mientras algo se mueve:
 * en reposo, 0 cuadros. Cuenta cuadros en `data-cuadros` del elemento.
 */
export interface EstadoLente {
  mx: number;
  my: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  abierta: number;
  objetivo: number;
  arrastre: boolean;
}

export const RESPUESTA = 0.35;

/** Avanza el muelle `dt` segundos (sub-pasos de 1/240 s: estable aunque el cuadro tarde). Puro. */
export function pasoLente(s: EstadoLente, dt: number): EstadoLente {
  const n = { ...s };
  if (n.arrastre) {
    n.mx = n.tx;
    n.my = n.ty;
    n.vx = n.vy = 0;
  } else {
    const w0 = (2 * Math.PI) / RESPUESTA;
    for (let r = dt; r > 0; r -= 1 / 240) {
      const h = Math.min(r, 1 / 240);
      n.vx += (w0 * w0 * (n.tx - n.mx) - 2 * w0 * n.vx) * h;
      n.vy += (w0 * w0 * (n.ty - n.my) - 2 * w0 * n.vy) * h;
      n.mx += n.vx * h;
      n.my += n.vy * h;
    }
  }
  n.abierta += (n.objetivo - n.abierta) * (1 - Math.exp(-dt * (n.objetivo > n.abierta ? 7 : 4)));
  if (Math.abs(n.objetivo - n.abierta) < 0.002) n.abierta = n.objetivo;
  return n;
}

export const enMovimiento = (s: EstadoLente) =>
  Math.abs(s.tx - s.mx) > 0.3 || Math.abs(s.ty - s.my) > 0.3 || Math.abs(s.vx) + Math.abs(s.vy) > 1 || s.abierta !== s.objetivo;

export interface Lente {
  estado: () => EstadoLente;
  /** Pide un cuadro (redimensión, scroll, fuerza nueva). */
  pedir: () => void;
  destruir: () => void;
}

/** Engancha la lente a `el` (sus coordenadas son las de su caja). `pintar` se llama en cada cuadro. */
export function montarLente(el: HTMLElement, pintar: (s: EstadoLente) => void): Lente {
  let s: EstadoLente = { mx: 0, my: 0, vx: 0, vy: 0, tx: 0, ty: 0, abierta: 0, objetivo: 0, arrastre: false };
  let raf = 0;
  let ultimo = 0;
  let cuadros = 0;
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - ultimo) / 1000);
    ultimo = now;
    s = pasoLente(s, dt);
    pintar(s);
    el.dataset.cuadros = String(++cuadros);
    el.dataset.lente = s.abierta.toFixed(2);
    if (enMovimiento(s) && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const pedir = () => {
    if (raf || document.hidden) return;
    ultimo = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const local = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return { x, y, dentro: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
  };
  const mover = (e: PointerEvent) => {
    if (e.pointerType === "touch") {
      if (!s.arrastre) return;
      const p = local(e);
      s.tx = p.x;
      s.ty = p.y;
      pedir();
      return;
    }
    const p = local(e);
    const objetivo = p.dentro ? 1 : 0;
    if (!p.dentro && s.objetivo === 0) return;
    s.tx = p.x;
    s.ty = p.y;
    s.objetivo = objetivo;
    // La lente nace bajo el cursor; no viaja desde una esquina.
    if (s.abierta < 0.05) Object.assign(s, { mx: p.x, my: p.y, vx: 0, vy: 0 });
    pedir();
  };
  const bajar = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    const p = local(e);
    if (!p.dentro) return;
    Object.assign(s, { arrastre: true, tx: p.x, ty: p.y, mx: p.x, my: p.y, vx: 0, vy: 0, objetivo: 1 });
    pedir();
  };
  const soltar = (e: PointerEvent) => {
    if (e.pointerType === "touch" && s.arrastre) {
      s.arrastre = false;
      s.objetivo = 0;
      pedir();
    }
  };
  const salir = () => {
    if (s.objetivo === 0) return;
    s.objetivo = 0;
    pedir();
  };
  const vis = () => {
    if (!document.hidden) return pedir();
    cancelAnimationFrame(raf);
    raf = 0;
  };
  window.addEventListener("pointermove", mover, { passive: true });
  window.addEventListener("pointerdown", bajar, { passive: true });
  window.addEventListener("pointerup", soltar, { passive: true });
  window.addEventListener("pointercancel", soltar, { passive: true });
  document.documentElement.addEventListener("pointerleave", salir);
  window.addEventListener("blur", salir);
  document.addEventListener("visibilitychange", vis);
  return {
    estado: () => s,
    pedir,
    destruir: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerdown", bajar);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
      document.documentElement.removeEventListener("pointerleave", salir);
      window.removeEventListener("blur", salir);
      document.removeEventListener("visibilitychange", vis);
    },
  };
}

/** Hook: monta la lente sobre `ref` mientras `activa`. */
export function useLente(ref: RefObject<HTMLElement | null>, pintar: (s: EstadoLente) => void, activa = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !activa) return;
    const l = montarLente(el, pintar);
    l.pedir();
    return () => l.destruir();
  }, [ref, pintar, activa]);
}
