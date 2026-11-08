"use client";

import { useRef, useState } from "react";
import type { GrupoCaso } from "@/lib/cuentas";
import { usePildora } from "@/components/sistema/usePildora";
import Pildora from "@/components/sistema/Pildora";

export type Filtro = "todos" | GrupoCaso;

/**
 * Filtro de `/work` (07 F2, P1-2): `role="group"` con `aria-pressed` y un
 * anuncio `aria-live` («N casos»). Oculta con `hidden` lo que no pertenece
 * (`[data-grupo]` dentro de `#casos-trabajo`); el reflujo usa View Transitions
 * si existen y no hay movimiento reducido. **En el flujo, sin `sticky`.**
 * Sin JS no se ve (`@media (scripting: none)`): todo queda visible.
 */
export default function FiltroCasos({
  etiquetas,
  anuncio,
  label,
}: {
  etiquetas: Record<Filtro, string>;
  /** «N casos» ya formateado para cada N posible (de 0 a 10). */
  anuncio: string[];
  label: string;
}) {
  const [activo, setActivo] = useState<Filtro>("todos");
  const [mensaje, setMensaje] = useState("");
  const vivo = useRef<HTMLParagraphElement>(null);
  const grupo = useRef<HTMLDivElement>(null);
  // La selección se desliza al botón pulsado (09-MOTION-CONTROLES); el grupo
  // queda fuera del fundido del View Transition (`trabajo.css`).
  const mover = usePildora(grupo, "filtros", activo);

  const aplicar = (f: Filtro, boton: HTMLElement) => {
    mover(boton);
    const raiz = document.getElementById("casos-trabajo");
    if (!raiz) return;
    const cambiar = () => {
      let n = 0;
      raiz.querySelectorAll<HTMLElement>("[data-grupo]").forEach((el) => {
        const ver = f === "todos" || el.dataset.grupo === f;
        el.hidden = !ver;
        if (ver) n++;
      });
      raiz.querySelectorAll<HTMLElement>("[data-contenedor-filtro]").forEach((c) => {
        c.hidden = !c.querySelector("[data-grupo]:not([hidden])");
      });
      setActivo(f);
      setMensaje(anuncio[n] ?? String(n));
    };
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (!rm && typeof doc.startViewTransition === "function") {
      const html = document.documentElement;
      html.classList.add("vt-filtro");
      doc
        .startViewTransition(cambiar)
        .finished.catch(() => {})
        .finally(() => html.classList.remove("vt-filtro"));
    } else cambiar();
  };

  return (
    <div className="filtros-zona">
      <div className="filtros" role="group" aria-label={label} ref={grupo}>
        <Pildora />
        {(Object.keys(etiquetas) as Filtro[]).map((f) => (
          <button
            key={f}
            type="button"
            className="filtro"
            aria-pressed={activo === f}
            data-filtro={f}
            onClick={(ev) => aplicar(f, ev.currentTarget)}
          >
            {etiquetas[f]}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite" ref={vivo} data-anuncio-filtro>
        {mensaje}
      </p>
    </div>
  );
}
