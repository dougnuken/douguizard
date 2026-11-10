import type { FotoHeroe } from "@/data/hero";
import { cubrir } from "@/lib/escena";
import { actividad, trayectoria } from "./barrido";

/**
 * El barrido automático para un elemento que pinta la foto en `cover` (el canvas
 * de `VidrioGL` o la capa de `LenteCss`): traduce la trayectoria a px de su caja
 * y decide si toca barrer (a la vista, héroe sin desplazar; ver `actividad`).
 * `alCambiar` se llama cuando cambia lo que se ve (para pedir un cuadro).
 */
export function barridoDe(el: HTMLElement, foto: FotoHeroe, pos: [number, number], alCambiar: () => void) {
  const escritorio = window.matchMedia("(min-width: 1024px)");
  let visible = true;
  /** Fracción del elemento a la vista, sobre lo máximo que cabe en pantalla. */
  let aLaVista = 1;
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      const r = e.boundingClientRect;
      const v = e.rootBounds;
      const tope = Math.min(r.width, v?.width ?? r.width) * Math.min(r.height, v?.height ?? r.height);
      aLaVista = tope > 0 ? (e.intersectionRect.width * e.intersectionRect.height) / tope : 0;
      if (visible) alCambiar();
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
  );
  io.observe(el);
  const num = (v: string) => parseFloat(el.style.getPropertyValue(v));
  return {
    visible: () => visible,
    /** Destino en el segundo `t`, en px de `el`; `null` = ahora no toca. */
    barrido: (t: number) => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!visible || !w || !h) return null;
      const a = actividad({ visible: aLaVista, p: escritorio.matches ? num("--vidrio-p") : undefined, fuerza: num("--vidrio-f") });
      if (a <= 0) return null;
      const c = cubrir({ w, h }, foto.tamano.w / foto.tamano.h, pos);
      const [x, y] = trayectoria(t, foto);
      return { x: c.Ox + x * c.Dx, y: c.Oy + y * c.Dy, a };
    },
    soltar: () => io.disconnect(),
  };
}
