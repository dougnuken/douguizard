"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface EntradaIndice {
  id: string;
  label: string;
}

/**
 * Índice lateral de la página completa (≥ 1280; el CSS lo oculta por debajo y
 * no existe en la hoja): rótulos de las secciones presentes, un hilo de 1 px
 * que se llena de láser con la lectura y el punto de presencia en la sección
 * actual (`aria-current="true"`, sin transición).
 *
 * La sección actual es la última cuyo borde superior ya pasó el centro de la
 * ventana; el hilo es la fracción leída de `.caso-secciones` (de su borde
 * superior al centro de la ventana), así que solo crece al bajar.
 */
export default function CaseIndice({ entradas, label }: { entradas: EntradaIndice[]; label: string }) {
  const nav = useRef<HTMLElement>(null);
  const [actual, setActual] = useState<string | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      const centro = window.innerHeight / 2;
      let cual: string | null = null;
      for (const e of entradas) {
        const el = document.getElementById(e.id);
        if (el && el.getBoundingClientRect().top <= centro) cual = e.id;
      }
      setActual(cual);
      const zona = nav.current?.parentElement?.querySelector<HTMLElement>(".caso-secciones");
      if (zona) {
        const r = zona.getBoundingClientRect();
        const leido = (centro - r.top) / Math.max(1, r.height);
        setP(Math.min(1, Math.max(0, leido)));
      }
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [entradas]);

  return (
    <nav ref={nav} className="caso-indice" aria-label={label} data-indice="">
      <span className="indice-hilo" aria-hidden="true">
        <i style={{ "--p": p } as CSSProperties} />
      </span>
      <ol>
        {entradas.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} aria-current={actual === e.id ? "true" : undefined}>
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
