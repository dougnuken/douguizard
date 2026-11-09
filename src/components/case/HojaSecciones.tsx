"use client";

import { useEffect, useRef } from "react";
import type { EntradaIndice } from "./CaseIndice";
import { useDict } from "@/i18n/LocaleProvider";

import { EVENTO_SECCIONES, EVENTO_SECCIONES_HOJA } from "./eventos";

/**
 * «Secciones» en móvil (07 F7): una hoja corta con los rótulos del índice.
 * En la página completa la abre el dock (que cambia «Contacto» por
 * «Secciones» en las rutas de caso); dentro de la hoja del caso, el dock queda
 * bajo el velo, así que la abre un botón de la cabecera de la hoja
 * (`.hoja-secciones`, solo < 1024; P2-7: antes flotaba sobre el texto). Al elegir una sección se va a ella y el foco pasa a su `h2`.
 */
export default function HojaSecciones({ entradas, enHoja = false }: { entradas: EntradaIndice[]; enHoja?: boolean }) {
  const dict = useDict();
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const evento = enHoja ? EVENTO_SECCIONES_HOJA : EVENTO_SECCIONES;
    const abrir = () => dialogo.current?.showModal();
    window.addEventListener(evento, abrir);
    return () => window.removeEventListener(evento, abrir);
  }, [enHoja]);

  const ir = (id: string) => {
    dialogo.current?.close();
    const seccion = document.getElementById(id);
    if (!seccion) return;
    const titulo = seccion.querySelector<HTMLElement>("h2") ?? seccion;
    if (!titulo.hasAttribute("tabindex")) titulo.setAttribute("tabindex", "-1");
    seccion.scrollIntoView({ block: "start" });
    titulo.focus({ preventScroll: true });
  };

  return (
    <>
      <dialog
        ref={dialogo}
        className="secciones"
        aria-labelledby={enHoja ? "secciones-hoja-h" : "secciones-h"}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="secciones-cab">
          <h2 id={enHoja ? "secciones-hoja-h" : "secciones-h"}>{dict.dock.secciones}</h2>
          <button
            type="button"
            className="secciones-cerrar"
            aria-label={dict.hoja.cerrar}
            onClick={() => dialogo.current?.close()}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <ol className="lista-secciones">
          {entradas.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                onClick={(ev) => {
                  ev.preventDefault();
                  ir(e.id);
                }}
              >
                {e.label}
              </a>
            </li>
          ))}
        </ol>
      </dialog>
    </>
  );
}
