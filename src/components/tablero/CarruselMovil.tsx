"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icono } from "@/components/sistema/Iconos";

/**
 * K7–K10 en móvil (< 1024): scroll-snap horizontal con contador («1 de 4») y
 * botones anterior / siguiente (NOTAS de B §1). En escritorio el contenedor es
 * `display: contents` y las cards vuelven a la rejilla; los controles no se
 * pintan. Sin JS queda el scroll nativo con snap.
 */
export default function CarruselMovil({
  total,
  textos,
  children,
}: {
  total: number;
  textos: { anterior: string; siguiente: string; contador: string[]; rol: string; label: string };
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  // El número del contador entra desde el lado hacia el que se va (09-MOTION-CONTROLES).
  const [dir, setDir] = useState<"sig" | "ant" | null>(null);
  const previo = useRef(0);
  const cambiar = useCallback((k: number) => {
    if (k !== previo.current) setDir(k > previo.current ? "sig" : "ant");
    previo.current = k;
    setI(k);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const hijos = Array.from(el.children) as HTMLElement[];
      if (!hijos.length) return;
      const x = el.scrollLeft + 1;
      let k = 0;
      hijos.forEach((h, n) => {
        if (h.offsetLeft - hijos[0].offsetLeft <= x) k = n;
      });
      // Al final del recorrido, la última (puede no llegar a alinearse).
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) k = hijos.length - 1;
      cambiar(k);
    };
    el.addEventListener("scroll", medir, { passive: true });
    return () => el.removeEventListener("scroll", medir);
  }, [cambiar]);

  const ir = (d: number) => {
    const el = ref.current;
    if (!el) return;
    const hijos = Array.from(el.children) as HTMLElement[];
    const k = Math.max(0, Math.min(hijos.length - 1, i + d));
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: hijos[k].offsetLeft - hijos[0].offsetLeft, behavior: rm ? "auto" : "smooth" });
    cambiar(k);
  };

  return (
    <>
      <div className="carrusel" ref={ref} role="group" aria-roledescription={textos.rol} aria-label={textos.label}>
        {children}
      </div>
      <div className="carrusel-ctrl">
        <span className="contador" aria-live="polite">
          <span key={i} className="contador-n" data-dir={dir ?? undefined}>
            {textos.contador[i] ?? textos.contador[0]}
          </span>
        </span>
        <div className="botones">
          <button type="button" className="circulo" aria-label={textos.anterior} onClick={() => ir(-1)} disabled={i === 0}>
            <Icono nombre="izq" />
          </button>
          <button type="button" className="circulo" aria-label={textos.siguiente} onClick={() => ir(1)} disabled={i === total - 1}>
            <Icono nombre="der" />
          </button>
        </div>
      </div>
    </>
  );
}
