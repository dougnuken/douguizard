"use client";

import { useEffect, useRef } from "react";
import { getFotoActiva, vidrio, type EstadoVidrio } from "@/data/hero";
import { uniformesVidrio, vidrioEnEscena } from "@/lib/escena";
import { crearPrograma, dibujar, liberar } from "@/lib/gl/programa";
import { cargarImagen, subirTextura } from "@/lib/gl/textura";
import { montarLente } from "./useLente";

export interface PropsVidrioGL {
  /** Estado del vidrio a ≥ 1024 y por debajo. */
  estados: { escritorio: EstadoVidrio; movil: EstadoVidrio };
  className?: string;
  style?: React.CSSProperties;
  /** `object-position` de la foto en la caja del canvas (la misma del póster). */
  pos?: [number, number];
  /** Banda láser legible de lado a lado (por defecto, si la foto la trae). */
  laser?: boolean;
  /** La foto cuyo estilo en línea copia el canvas (`/about`: la isla la mueve y le pone `--vidrio-f`). */
  espejo?: HTMLElement | null;
  /** Sin WebGL2, `failIfMajorPerformanceCaveat`, shader roto o contexto perdido. */
  onFallo: (motivo: string) => void;
}

/**
 * El vidrio estriado en WebGL2 (07 F4), encima del póster horneado. Lo monta
 * `VidrioDiferido` tras el `load` y en `requestIdleCallback` (nunca antes del
 * LCP; nunca con RM). Entra con un fundido de 400 ms tras el primer cuadro; en
 * reposo no hay bucle (0 fps). DPR ≤ `dprMax`; deja de pintar fuera de vista y
 * con la pestaña oculta. La fuerza se puede sobrescribir con `--vidrio-f` en el
 * estilo en línea del canvas (o de su `espejo`).
 */
export default function VidrioGL({ estados, className, style, pos = [0.5, 0], laser, espejo, onFallo }: PropsVidrioGL) {
  const ref = useRef<HTMLCanvasElement>(null);
  const falloRef = useRef(onFallo);
  useEffect(() => {
    falloRef.current = onFallo;
  }, [onFallo]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let vivo = true;
    let limpiar = () => {};
    const fallar = (motivo: string) => {
      if (!vivo) return;
      vivo = false;
      limpiar();
      canvas.classList.remove("on");
      falloRef.current(motivo);
    };
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) {
      fallar("sin-webgl2");
      return;
    }
    const foto = getFotoActiva();
    const escritorio = window.matchMedia("(min-width: 1024px)");
    let visible = true;

    (async () => {
      let prog: ReturnType<typeof crearPrograma>;
      let tex: WebGLTexture;
      try {
        prog = crearPrograma(gl);
        const img = await cargarImagen(foto.rutas.textura);
        if (!vivo) return;
        tex = subirTextura(gl, img);
      } catch (e) {
        fallar(e instanceof Error ? e.message : "init");
        return;
      }
      let primero = true;
      const pintar = () => {
        if (!visible || gl.isContextLost()) return;
        // F5: con `--vidrio-p` (el progreso del ancla del home, copiado de la foto)
        // los parámetros van de `cine` a `losa`; sin él, los del estado.
        const pe = parseFloat(canvas.style.getPropertyValue("--vidrio-p"));
        const enEscena = escritorio.matches && Number.isFinite(pe);
        const base = vidrio[escritorio.matches ? estados.escritorio : estados.movil];
        const mezcla = enEscena ? vidrioEnEscena(pe, vidrio.cine, vidrio.losa) : null;
        const p = mezcla ? { ...base, ...mezcla } : base;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        const dpr = Math.min(window.devicePixelRatio || 1, p.dprMax);
        const bw = Math.round(w * dpr);
        const bh = Math.round(h * dpr);
        if (canvas.width !== bw || canvas.height !== bh) {
          canvas.width = bw;
          canvas.height = bh;
        }
        const s = lente.estado();
        const f = parseFloat(canvas.style.getPropertyValue("--vidrio-f"));
        const v = uniformesVidrio({
          caja: { w, h },
          foto: { ...foto.tamano, cara: foto.cara, ojo: foto.ojo, laser: foto.laser },
          params: p,
          pos,
          laser,
          fuerza: Number.isFinite(f) ? f : undefined,
          mx: s.mx,
          lente: s.abierta,
          fase: mezcla?.fase,
        });
        dibujar(gl, prog, v, { w, h, dpr }, { x: s.mx, y: s.my, abierta: s.abierta });
        if (primero) {
          primero = false;
          canvas.classList.add("on");
          canvas.parentElement?.setAttribute("data-gl", "on");
        }
      };
      const lente = montarLente(canvas, pintar);
      const ro = new ResizeObserver(() => lente.pedir());
      ro.observe(canvas);
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) lente.pedir();
      });
      io.observe(canvas);
      const mq = () => lente.pedir();
      escritorio.addEventListener("change", mq);
      const copiar = () => {
        if (!espejo) return;
        canvas.style.cssText = espejo.style.cssText;
        lente.pedir();
      };
      copiar();
      const mo = espejo ? new MutationObserver(copiar) : null;
      if (espejo) mo?.observe(espejo, { attributes: true, attributeFilter: ["style"] });
      const perdido = (e: Event) => {
        e.preventDefault();
        fallar("contexto-perdido");
      };
      canvas.addEventListener("webglcontextlost", perdido);
      limpiar = () => {
        lente.destruir();
        ro.disconnect();
        io.disconnect();
        escritorio.removeEventListener("change", mq);
        mo?.disconnect();
        canvas.removeEventListener("webglcontextlost", perdido);
        canvas.parentElement?.removeAttribute("data-gl");
        if (!gl.isContextLost()) liberar(gl, prog, tex);
      };
      lente.pedir();
    })();

    return () => {
      vivo = false;
      limpiar();
    };
    // Los props de geometría no cambian durante la vida del canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className={className ? `vidrio-gl ${className}` : "vidrio-gl"} style={style} aria-hidden="true" data-vidrio="gl" />;
}
