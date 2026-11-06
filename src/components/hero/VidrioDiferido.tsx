"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { EstadoVidrio } from "@/data/hero";
import type { PropsVidrioGL } from "./VidrioGL";

type Lente = typeof import("./LenteCss").default;

/**
 * Monta el vidrio vivo **después** del LCP (07 F4): espera al `load` y a un
 * hueco libre (`requestIdleCallback`), y solo entonces pide el código de WebGL
 * (fuera del JS inicial). Con RM no pide nada: queda el póster horneado solo.
 * Si WebGL falla, pide `LenteCss` y activa el respaldo `VidrioCss` (`children`).
 * `espejo`: selector (dentro del contenedor) de la foto cuyo estilo en línea
 * siguen el canvas y la lente (`/about`, donde la isla mueve la foto).
 */
export default function VidrioDiferido({
  children,
  estados,
  className,
  pos,
  laser,
  espejo,
}: {
  children: ReactNode;
  estados: { escritorio: EstadoVidrio; movil: EstadoVidrio };
  className?: string;
  pos?: [number, number];
  laser?: boolean;
  espejo?: string;
}) {
  const ancla = useRef<HTMLSpanElement>(null);
  const [GL, setGL] = useState<ComponentType<PropsVidrioGL> | null>(null);
  const [Css, setCss] = useState<Lente | null>(null);
  const [nodos, setNodos] = useState<{ capa: HTMLElement | null; foto: HTMLElement | null }>({ capa: null, foto: null });

  useEffect(() => {
    const caja = ancla.current?.parentElement;
    if (caja) {
      setNodos({
        capa: caja.querySelector<HTMLElement>("[data-vidrio='css']"),
        foto: espejo ? caja.querySelector<HTMLElement>(espejo) : null,
      });
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let vivo = true;
    let idle = 0;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const ir = () => {
      idle = ric(() => {
        import("./VidrioGL").then((m) => vivo && setGL(() => m.default));
      }, { timeout: 2000 } as IdleRequestOptions);
    };
    if (document.readyState === "complete") ir();
    else window.addEventListener("load", ir, { once: true });
    return () => {
      vivo = false;
      window.removeEventListener("load", ir);
      cic(idle);
    };
  }, [espejo]);

  const fallo = () => {
    setGL(null);
    import("./LenteCss").then((m) => setCss(() => m.default));
  };

  const { capa, foto } = nodos;
  return (
    <>
      <span ref={ancla} hidden />
      {children}
      {GL && (
        <GL
          estados={estados}
          className={className}
          pos={pos}
          laser={laser}
          espejo={foto}
          onFallo={fallo}
        />
      )}
      {Css && capa && <Css capa={capa} estados={estados} espejo={foto} />}
    </>
  );
}
