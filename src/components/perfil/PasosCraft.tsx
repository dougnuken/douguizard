"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { esEstatico } from "@/lib/estatico";
import { coreografiaPasos, type Coreografia } from "@/lib/pasosCraft";
import { prefiereQuieto } from "@/lib/movimiento";

/**
 * «Cómo trabajo» en secuencia (G4, pedido de Doug). El láser es una carga que
 * viaja: se enciende el nodo 01 y su paso aparece; la línea se llena hasta el
 * nodo 02, que se enciende y revela el suyo, y así hasta el 04. Una vez por
 * visita a la página, ~2,7 s (`coreografiaPasos`).
 *
 * - Sin JS, con movimiento reducido, `?estatico` o al imprimir: todo visible y
 *   quieto (el estado final es el de siempre; el oculto lo pone este script).
 * - Sin CLS: el texto ocupa su sitio desde el principio; solo cambian
 *   `opacity`, `transform` y `filter` (WAAPI, en el compositor).
 * - Si la lista ya se pintó al hidratar (llegada directa a `/about#craft`), no
 *   se esconde lo que ya se vio: se queda quieta. Por navegación en el cliente
 *   (K14 del home → `/about#craft`) se monta antes de pintar y sí se anima.
 * - Al terminar no queda ninguna animación viva (`fill` solo hacia atrás).
 */

const sinSuscripcion = () => () => {};

export default function PasosCraft({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  // `true` solo en el render de la hidratación (instantánea del servidor).
  const hidratando = useSyncExternalStore(
    sinSuscripcion,
    () => false,
    () => true,
  );
  const alMontar = useRef(hidratando);

  useLayoutEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    if (prefiereQuieto() || esEstatico()) return;
    if (!("IntersectionObserver" in window) || typeof ol.animate !== "function") return;
    const r = ol.getBoundingClientRect();
    if (alMontar.current && r.top < window.innerHeight && r.bottom > 0) return;

    ol.dataset.pasos = "espera";
    // Una sola entrada por contenedor (skill `choreograph`): la losa no hace
    // su revelado (`RevelarLosas`); la entrada es la secuencia de los pasos.
    const losa = ol.closest<HTMLElement>(".losa");
    if (losa && !losa.dataset.revelar) losa.dataset.revelar = "listo";
    const vivas: Animation[] = [];
    let reloj = 0;

    const correr = () => {
      const c = medir(ol);
      ol.dataset.pasos = "anima";
      lanzar(ol, c, vivas);
      Promise.all(vivas.map((a) => a.finished))
        .then(() => {
          ol.dataset.pasos = "listo";
        })
        .catch(() => {});
    };

    const io = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        io.disconnect();
        reloj = window.setTimeout(correr, 0);
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.15 },
    );
    io.observe(ol);

    return () => {
      io.disconnect();
      clearTimeout(reloj);
      for (const a of vivas) a.cancel();
      delete ol.dataset.pasos;
    };
  }, []);

  return (
    <ol className="pasos" ref={ref}>
      {children}
    </ol>
  );
}

/** Dónde cae cada nodo sobre el láser (0–1) y si el láser es horizontal, vertical o no se ve. */
function medir(ol: HTMLOListElement) {
  const o = ol.getBoundingClientRect();
  const cs = getComputedStyle(ol, "::before");
  const nodos = [...ol.querySelectorAll<HTMLElement>(":scope > li > .nodo")].map((n) => n.getBoundingClientRect());
  if (cs.display === "none" || cs.content === "none") return coreografiaPasos({ eje: "ninguno", paradas: [], pasos: nodos.length });
  const ancho = parseFloat(cs.width);
  const alto = parseFloat(cs.height);
  const vertical = alto > ancho;
  const inicio = vertical ? o.top + parseFloat(cs.top) : o.left + parseFloat(cs.left);
  const largo = vertical ? alto : ancho;
  const paradas = nodos.map((n) => ((vertical ? n.top + n.height / 2 : n.left + n.width / 2) - inicio) / largo);
  return coreografiaPasos({ eje: vertical ? "y" : "x", paradas, pasos: nodos.length });
}

function lanzar(ol: HTMLOListElement, c: Coreografia, vivas: Animation[]) {
  const pasos = [...ol.querySelectorAll<HTMLElement>(":scope > li")];
  if (c.laser) {
    vivas.push(
      ol.animate(c.laser.keyframes, {
        duration: c.laser.duracion,
        delay: c.inicio,
        fill: "backwards",
        pseudoElement: "::before",
      }),
    );
  }
  pasos.forEach((li, i) => {
    const t = c.inicio + c.encendidos[i];
    const nodo = li.querySelector<HTMLElement>(".nodo");
    if (nodo) {
      vivas.push(
        nodo.animate(
          [
            { opacity: 0, transform: "scale(0.4)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: c.nodo, delay: t, easing: c.curva, fill: "backwards", pseudoElement: "::after" },
        ),
        nodo.animate(
          [
            { opacity: 0.7, transform: "scale(1)" },
            { opacity: 0, transform: "scale(2.8)" },
          ],
          // Sin `fill`: antes de su turno manda el CSS (invisible) y al acabar no queda nada.
          { duration: c.pulso, delay: t, easing: c.curva, pseudoElement: "::before" },
        ),
      );
    }
    const piezas = [...li.children].filter((el) => !el.classList.contains("nodo")) as HTMLElement[];
    piezas.forEach((el, j) => {
      vivas.push(
        el.animate(
          [
            { opacity: 0, transform: `translateY(${c.subida}px)`, filter: `blur(${c.blur}px)` },
            { opacity: 1, transform: "none", filter: "blur(0px)" },
          ],
          { duration: c.texto, delay: t + (c.escalon[j] ?? c.escalon[c.escalon.length - 1]), easing: c.curva, fill: "backwards" },
        ),
      );
    });
  });
}
