"use client";

import { useEffect, useRef } from "react";
import { getFotoActiva, vidrio, type EstadoVidrio } from "@/data/hero";
import { uniformesVidrio, vidrioEnEscena } from "@/lib/escena";
import { copiar as copiarCuadro, crearPrograma, dibujar, guardar, liberar, prepintar, soltar, volcar, type Prepintado } from "@/lib/gl/programa";
import type { EstadoLente } from "./useLente";
import { cargarImagen, subirTextura } from "@/lib/gl/textura";
import { barridoDe } from "./barridoDom";
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
  /** El primer cuadro ya está en pantalla (el respaldo CSS que venía barriendo se retira). */
  onListo?: () => void;
  /** El barrido va lento en este equipo (WebGL por software): lo sigue la capa CSS; el canvas se queda con el vidrio y el cursor. */
  onLento?: () => void;
}

/**
 * El vidrio estriado en WebGL2 (07 F4), encima del póster horneado. Lo monta
 * `VidrioDiferido` tras el `load` y en `requestIdleCallback` (nunca antes del
 * LCP; nunca con RM). Entra con un fundido de 400 ms tras el primer cuadro.
 * Pulido I: mientras el héroe está a la vista y sin desplazar, la zona nítida
 * barre sola (`barrido.ts`; el cursor manda al moverse); fuera de eso no hay
 * bucle (0 fps). DPR ≤ `dprMax`; deja de pintar fuera de vista y con la pestaña
 * oculta. La fuerza se puede sobrescribir con `--vidrio-f` en el
 * estilo en línea del canvas (o de su `espejo`).
 */
export default function VidrioGL({ estados, className, style, pos = [0.5, 0], laser, espejo, onFallo, onListo, onLento }: PropsVidrioGL) {
  const ref = useRef<HTMLCanvasElement>(null);
  const falloRef = useRef(onFallo);
  const listoRef = useRef(onListo);
  const lentoRef = useRef(onLento);
  useEffect(() => {
    falloRef.current = onFallo;
    listoRef.current = onListo;
    lentoRef.current = onLento;
  }, [onFallo, onListo, onLento]);

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

    (async () => {
      let prog: Awaited<ReturnType<typeof crearPrograma>>;
      let tex: WebGLTexture;
      // G1: la foto se descarga y decodifica fuera del hilo principal mientras el
      // driver compila; la subida va en su propia tarea, después de un respiro.
      const imagen = cargarImagen(foto.rutas.textura);
      imagen.catch(() => {});
      try {
        prog = await crearPrograma(gl);
        const img = await imagen;
        await new Promise((r) => setTimeout(r, 0));
        if (!vivo) return;
        tex = subirTextura(gl, img);
        if ("close" in img) img.close();
      } catch (e) {
        fallar(e instanceof Error ? e.message : "init");
        return;
      }
      let primero = true;
      /** Parámetros del cuadro para el estado actual; ajusta el búfer del canvas. */
      const cuadro = (s: Pick<EstadoLente, "mx" | "my" | "abierta">, paralaje = 1) => {
        // F5: con `--vidrio-p` (el progreso del ancla del home, copiado de la foto)
        // los parámetros van de `cine` a `losa`; sin él, los del estado.
        const pe = parseFloat(canvas.style.getPropertyValue("--vidrio-p"));
        const enEscena = escritorio.matches && Number.isFinite(pe);
        const base = vidrio[escritorio.matches ? estados.escritorio : estados.movil];
        const mezcla = enEscena ? vidrioEnEscena(pe, vidrio.cine, vidrio.losa) : null;
        const p = mezcla ? { ...base, ...mezcla } : base;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return null;
        const dpr = Math.min(window.devicePixelRatio || 1, p.dprMax);
        const bw = Math.round(w * dpr);
        const bh = Math.round(h * dpr);
        if (canvas.width !== bw || canvas.height !== bh) {
          canvas.width = bw;
          canvas.height = bh;
        }
        const f = parseFloat(canvas.style.getPropertyValue("--vidrio-f"));
        const v = uniformesVidrio({
          caja: { w, h },
          foto: { ...foto.tamano, cara: foto.cara, ojo: foto.ojo, laser: foto.laser },
          params: p,
          pos,
          laser,
          fuerza: Number.isFinite(f) ? f : undefined,
          mx: s.mx,
          lente: s.abierta * paralaje,
          fase: mezcla?.fase,
        });
        // Todo lo que no es la zona nítida: si no cambia entre cuadros, el fondo se guarda.
        const firmaFondo = JSON.stringify([bw, bh, w, h, dpr, v]);
        const firma = firmaFondo + JSON.stringify([s.mx, s.my, s.abierta]);
        const dib = (abierta = s.abierta) => dibujar(gl, prog, v, { w, h, dpr }, { x: s.mx, y: s.my, abierta });
        // La zona nítida en px del búfer (origen abajo), con 2 px de margen.
        const r = (v.lensR * 1.2 + 2) * dpr;
        const zona = [Math.floor(s.mx * dpr - r), Math.floor(bh - s.my * dpr - r), Math.ceil(2 * r), Math.ceil(2 * r)] as const;
        return { bw, bh, firma, firmaFondo, dib, zona };
      };

      // G1: el primer cuadro (lente cerrada, el estado inicial de `montarLente`)
      // se pinta fuera de pantalla y se espera a la GPU sin bloquear; el cuadro
      // visible solo lo copia (ver `prepintar`).
      if (espejo) canvas.style.cssText = espejo.style.cssText;
      let pre: { firma: string; p: Prepintado } | null = null;
      const c0 = cuadro({ mx: 0, my: 0, abierta: 0 });
      if (c0) {
        const p = await prepintar(gl, c0.bw, c0.bh, c0.dib);
        if (p) pre = { firma: c0.firma, p };
      }
      if (!vivo) {
        if (pre) soltar(gl, pre.p);
        if (!gl.isContextLost()) liberar(gl, prog, tex);
        return;
      }

      // G1: cada cuadro nuevo de WebGL cuesta una copia al compositor (sin GPU,
      // como en Lighthouse/PSI, una lectura de píxeles síncrona). Al montar llegan
      // tres pedidos (lente, ResizeObserver, IntersectionObserver) con el mismo
      // estado: si nada cambió, no se repinta.
      let ultimo = "";
      // Pulido I: con la zona nítida moviéndose sobre un vidrio que no cambia (el
      // barrido), el vidrio cerrado se guarda una vez y cada cuadro es una copia más
      // el sombreado de la zona (recorte): ~10× menos píxeles que la pantalla entera.
      let fondo: { firma: string; p: Prepintado } | null = null;
      let fondoPrevio = "";
      const soltarFondo = () => {
        if (fondo && !gl.isContextLost()) soltar(gl, fondo.p);
        fondo = null;
      };
      const pintar = () => {
        if (!auto.visible() || gl.isContextLost()) return;
        const s = lente.estado();
        const c = cuadro(s, lente.paralaje());
        if (!c || c.firma === ultimo) return;
        ultimo = c.firma;
        const estable = c.firmaFondo === fondoPrevio;
        fondoPrevio = c.firmaFondo;
        if (fondo && fondo.firma !== c.firmaFondo) soltarFondo();
        if (estable && s.abierta > 0 && !fondo) {
          const p = guardar(gl, c.bw, c.bh, () => c.dib(0));
          if (p) fondo = { firma: c.firmaFondo, p };
        }
        if (pre && pre.firma === c.firma) volcar(gl, pre.p);
        else if (fondo && s.abierta > 0) {
          copiarCuadro(gl, fondo.p);
          gl.enable(gl.SCISSOR_TEST);
          gl.scissor(...c.zona);
          c.dib();
          gl.disable(gl.SCISSOR_TEST);
        } else c.dib();
        if (pre) {
          if (pre.firma !== c.firma) soltar(gl, pre.p);
          pre = null;
        }
        if (primero) {
          primero = false;
          canvas.classList.add("on");
          canvas.parentElement?.setAttribute("data-gl", "on");
          listoRef.current?.();
        }
      };
      // Pulido I: el barrido automático (a la vista y con el héroe sin desplazar).
      const auto = barridoDe(canvas, foto, pos, () => lente.pedir());
      const lente = montarLente(canvas, pintar, {
        barrido: auto.barrido,
        alIrLento: () => {
          if (!lentoRef.current) return;
          lente.ceder();
          lentoRef.current();
        },
      });
      const ro = new ResizeObserver(() => lente.pedir());
      ro.observe(canvas);
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
        auto.soltar();
        escritorio.removeEventListener("change", mq);
        mo?.disconnect();
        canvas.removeEventListener("webglcontextlost", perdido);
        canvas.parentElement?.removeAttribute("data-gl");
        if (pre && !gl.isContextLost()) soltar(gl, pre.p);
        soltarFondo();
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
