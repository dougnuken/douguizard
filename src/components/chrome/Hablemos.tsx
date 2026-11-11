"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { MetalFxProps } from "metal-fx";
import { prefiereQuieto } from "@/lib/movimiento";

/**
 * «Hablemos» de la cabecera (pulido G2: «muy crudo visualmente»).
 *
 * Material: el vidrio oscuro del cromo con su canto, un reflejo superior y el
 * canto inferior encendido en láser (QA de G: antes, relleno azul, fuera del
 * sistema B), y un LED verde que dice «disponible», como el punto de `.estado`. Micro-interacción con física, solo con puntero fino y sin
 * `prefers-reduced-motion`: el botón se deja atraer ≤ 3 px por el cursor (imán)
 * y el brillo del canto sigue al puntero; al soltar o salir vuelve con un muelle
 * (`--muelle`, `linear()` de CSS). Todo `translate`/`scale` y variables CSS en
 * el propio botón: nada en el hilo principal por cuadro salvo un `rAF` por
 * movimiento del ratón.
 *
 * Mejora progresiva: en escritorio con WebGL2 y sin movimiento reducido, cuando
 * el cursor se acerca a la esquina de la cabecera, se carga en diferido `metal-fx` (anillo de metal líquido WebGL2 con el
 * `liquidMetal` de Paper Shaders) y envuelve el mismo enlace. Una sola
 * instancia; el shader solo corre mientras el puntero está encima o el botón
 * tiene el foco (en reposo queda congelado: coste cero), y con movimiento
 * reducido no se carga. Sin WebGL2, en móvil (el botón no existe < 1024) o
 * si la carga falla, queda el botón de CSS.
 */
type Metal = ComponentType<MetalFxProps>;

const ESCRITORIO = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** El componente de metal-fx, una vez cargado (módulo: sobrevive a los montajes). */
let metalCargado: Metal | null = null;
let recuperarFoco = false;

function useMetal(): boolean {
  const [metal, setMetal] = useState(() => metalCargado !== null);
  useEffect(() => {
    if (metalCargado || !window.matchMedia(ESCRITORIO).matches || prefiereQuieto()) return;
    let vivo = true;
    const cargar = () =>
      import("metal-fx")
        .then((m) => {
          if (!m.isMetalFxSupported()) return;
          metalCargado = m.MetalFx;
          // El enlace se vuelve a montar dentro del metal: si tenía el foco, lo recupera.
          recuperarFoco = !!document.activeElement?.classList.contains("hablemos");
          if (vivo) setMetal(true);
        })
        .catch(() => {});
    // Sin coste hasta que haga falta: se carga cuando el cursor se acerca a la
    // esquina de la cabecera, nunca en el arranque.
    const cerca = (e: PointerEvent) => {
      if (e.clientY > 140 || e.clientX < window.innerWidth - 640) return;
      window.removeEventListener("pointermove", cerca);
      cargar();
    };
    window.addEventListener("pointermove", cerca, { passive: true });
    return () => {
      vivo = false;
      window.removeEventListener("pointermove", cerca);
    };
  }, []);
  return metal;
}

export default function Hablemos({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Metal = useMetal();
  const [vivo, setVivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el && recuperarFoco) {
      recuperarFoco = false;
      el.focus({ preventScroll: true });
    }
    if (!el || !window.matchMedia(ESCRITORIO).matches) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const pintar = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const nx = (px - r.left) / r.width; // 0…1
      const ny = (py - r.top) / r.height;
      el.style.setProperty("--brillo-x", `${Math.round(nx * 100)}%`);
      if (prefiereQuieto()) return;
      const dx = Math.max(-1, Math.min(1, nx * 2 - 1));
      const dy = Math.max(-1, Math.min(1, ny * 2 - 1));
      el.style.translate = `${(dx * 3).toFixed(2)}px ${(dy * 2).toFixed(2)}px`;
    };
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      el.dataset.iman = "";
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    const salir = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      delete el.dataset.iman;
      el.style.translate = "";
      el.style.removeProperty("--brillo-x");
      setVivo(false);
    };
    const entrar = () => setVivo(true);
    el.addEventListener("pointerenter", entrar);
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", salir);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", entrar);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", salir);
    };
  }, [Metal]);

  const enlace = (
    <a
      ref={ref}
      href={href}
      className="boton hablemos"
      data-metal={Metal ? "" : undefined}
      onClick={onClick}
      onFocus={() => setVivo(true)}
      onBlur={() => setVivo(false)}
    >
      <span className="hablemos-luz" aria-hidden="true" />
      {children}
    </a>
  );

  if (!Metal) return enlace;
  if (!metalCargado) return enlace;
  return createElement(
    metalCargado,
    {
      className: "hablemos-metal",
      variant: "button",
      preset: "silver",
      theme: "dark",
      strength: 0.85,
      glowGain: 0.6,
      innerShadow: true,
      normalizeHostStyles: false,
      paused: !vivo || prefiereQuieto(),
    } as MetalFxProps,
    enlace,
  );
}
