"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { EstadoVidrio } from "@/data/hero";
import { alInteractuar } from "@/lib/primeraInteraccion";
import type { PropsVidrioGL } from "./VidrioGL";

type Lente = typeof import("./LenteCss").default;

const ESCRITORIO = "(min-width: 1024px)";

/**
 * Monta el vidrio vivo **después** del LCP (07 F4): espera al `load` (en móvil,
 * además, a la primera interacción; G1) y a un hueco libre
 * (`requestIdleCallback`), y solo entonces pide el código de WebGL (fuera del JS
 * inicial). Con RM no pide nada: queda el póster horneado solo.
 * Pulido I: en móvil, mientras no hay interacción, el barrido automático lo lleva
 * `LenteCss` sobre el póster (sin WebGL: unas líneas de JS y `transform`); al
 * primer gesto entra el WebGL, sigue el barrido en el mismo punto y la capa CSS
 * se funde. Si el barrido en WebGL va lento (por software), vuelve a la capa CSS.
 * Si WebGL falla, `LenteCss` queda de respaldo (`VidrioCss` = `children`).
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
  const [glListo, setGlListo] = useState(false);
  const [glLento, setGlLento] = useState(false);
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
    const pedir = () => {
      idle = ric(() => {
        import("./VidrioGL").then((m) => vivo && setGL(() => m.default));
      }, { timeout: 2000 } as IdleRequestOptions);
    };
    let idleCss = 0;
    const pedirCss = () => {
      idleCss = ric(() => {
        import("./LenteCss").then((m) => vivo && setCss(() => m.default));
      }, { timeout: 2000 } as IdleRequestOptions);
    };
    // G1: por debajo de 1024 el vidrio en reposo es idéntico al póster horneado
    // (estado `movil`, lente cerrada, sin escena): WebGL solo aporta la lente al
    // arrastrar. Ahí se espera a la primera interacción (toque, scroll, tecla,
    // puntero) en vez del `load`: el contexto, la textura y el primer cuadro dejan
    // de competir con la hidratación (TBT móvil). En escritorio, como siempre.
    const movil = !window.matchMedia(ESCRITORIO).matches;
    let soltarGesto = () => {};
    const ir = () => {
      if (!movil) return pedir();
      pedirCss();
      soltarGesto = alInteractuar(pedir);
    };
    if (document.readyState === "complete") ir();
    else window.addEventListener("load", ir, { once: true });
    return () => {
      vivo = false;
      window.removeEventListener("load", ir);
      soltarGesto();
      cic(idle);
      cic(idleCss);
    };
  }, [espejo]);

  const fallo = () => {
    setGL(null);
    setGlListo(false);
    setGlLento(false);
    import("./LenteCss").then((m) => setCss(() => m.default));
  };
  // WebGL por software (o GPU muy justa): el barrido pasa a la capa CSS, que solo usa el compositor.
  const lento = () => {
    setGlLento(true);
    import("./LenteCss").then((m) => setCss(() => m.default));
  };

  const { capa, foto } = nodos;
  return (
    <>
      <span ref={ancla} hidden />
      {/* El canvas va antes que `children` en el DOM: con el mismo z-index, la capa CSS
          (`VidrioCss`) queda encima y puede llevar el barrido si el WebGL va lento. */}
      {GL && (
        <GL
          estados={estados}
          className={className}
          pos={pos}
          laser={laser}
          espejo={foto}
          onFallo={fallo}
          onListo={() => setGlListo(true)}
          onLento={lento}
        />
      )}
      {children}
      {Css && capa && <Css capa={capa} estados={estados} espejo={foto} pos={pos} sale={glListo && !glLento} soloBarrido={glLento} />}
    </>
  );
}
