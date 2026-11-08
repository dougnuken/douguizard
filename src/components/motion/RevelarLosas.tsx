"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./revelar.css";

/**
 * Capa de movimiento de las losas (pulido tras F8, pedido de Doug): cada losa
 * que entra en pantalla sube 24 px, crece de 0,97 a 1 y aparece, con un
 * escalonado de 70 ms dentro de la misma tanda.
 *
 * Reglas para no romper nada de lo medido:
 * - Solo se esconden las losas que al montar están **debajo** del borde inferior
 *   de la ventana: nunca se oculta algo que ya se pintó (sin parpadeo, sin tocar
 *   el LCP, que es K2 o el póster, ambos arriba).
 * - Con movimiento reducido no hace nada. Sin JS, todo se ve (el oculto lo pone
 *   este script).
 * - En el acto 1 del home (`html.cine`, ≥ 1024) el OS ya lo arma GSAP: se salta.
 * - Al terminar, la losa pasa a `listo` y se queda sin animación (0 en reposo).
 * - Animación (`transform` + `opacity`), no transición: no pisa el `translate`
 *   del hover ni el `scale` del toque.
 */
const SELECTOR = "#main .losa, dialog.hoja .losa";

export default function RevelarLosas() {
  const ruta = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const raiz = document.documentElement;

    let tanda = 0;
    let reloj = 0;
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.style.setProperty("--retraso", `${Math.min(tanda, 5) * 70}ms`);
          tanda += 1;
          el.dataset.revelar = "entra";
          el.addEventListener(
            "animationend",
            () => {
              el.dataset.revelar = "listo";
              el.style.removeProperty("--retraso");
            },
            { once: true },
          );
        }
        clearTimeout(reloj);
        reloj = window.setTimeout(() => (tanda = 0), 120);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const montar = () => {
      if (raiz.classList.contains("cine")) return;
      const alto = window.innerHeight;
      for (const el of document.querySelectorAll<HTMLElement>(SELECTOR)) {
        if (el.dataset.revelar) continue;
        // Una losa dentro de otra losa se mueve con su madre.
        if (el.parentElement?.closest(".losa[data-revelar]")) continue;
        const r = el.getBoundingClientRect();
        // Ya pintada (arriba) o fuera de pantalla a los lados (carruseles): se queda como está.
        if (r.top < alto || r.left >= window.innerWidth - 1 || r.right <= 1) {
          el.dataset.revelar = "listo";
          continue;
        }
        el.dataset.revelar = "espera";
        io.observe(el);
      }
    };

    montar();
    // La hoja de un caso monta su contenido después de la navegación.
    let cuadro = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(montar);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(cuadro);
      io.disconnect();
      clearTimeout(reloj);
      for (const el of document.querySelectorAll<HTMLElement>('[data-revelar="espera"]')) el.dataset.revelar = "listo";
    };
  }, [ruta]);

  return null;
}
