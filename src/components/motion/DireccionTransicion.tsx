"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { direccionRuta } from "@/lib/transicionRuta";

/**
 * Pieza sin pintura de la transición entre páginas (G4).
 *
 * 1. Dirección: antes de que la ruta cambie (clic en un enlace interno o
 *    «atrás/adelante»), marca `<html data-vt="adelante|atras">` según el orden
 *    de `transicionRuta.ts`. El CSS de `::view-transition-*` lee esa marca para
 *    deslizar hacia el lado al que se va. Sin marca: sube 8 px.
 * 2. Respaldo: sin View Transitions, la página nueva aparece con un fundido de
 *    150 ms (WAAPI, antes de pintar). Con movimiento reducido, nada.
 */
export default function DireccionTransicion() {
  const ruta = usePathname();
  const previa = useRef(ruta);
  // La ruta que se ve (con `/en`): `popstate` la compara con la nueva URL.
  const vista = useRef("");
  useEffect(() => {
    vista.current = location.pathname;
  }, [ruta]);

  useEffect(() => {
    const raiz = document.documentElement;
    const marcar = (hasta: string) => {
      const dir = direccionRuta(location.pathname, hasta);
      if (dir) raiz.dataset.vt = dir;
      else delete raiz.dataset.vt;
    };
    const alClic = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      marcar(url.pathname);
    };
    // `popstate` llega con la URL nueva y antes de que el router pinte la
    // ruta: se compara con la que se ve.
    const alHistorial = () => {
      const dir = direccionRuta(vista.current || location.pathname, location.pathname);
      if (dir) raiz.dataset.vt = dir;
      else delete raiz.dataset.vt;
    };
    document.addEventListener("click", alClic, true);
    window.addEventListener("popstate", alHistorial, true);
    return () => {
      document.removeEventListener("click", alClic, true);
      window.removeEventListener("popstate", alHistorial, true);
    };
  }, []);

  // Respaldo sin la API: fundido corto de la página nueva, antes de pintar.
  useLayoutEffect(() => {
    if (previa.current === ruta) return;
    previa.current = ruta;
    if (typeof document.startViewTransition === "function") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.getElementById("main")?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 150,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  }, [ruta]);

  return null;
}
