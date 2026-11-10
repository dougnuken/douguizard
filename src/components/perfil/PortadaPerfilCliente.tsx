"use client";

import { useEffect, useRef } from "react";
import { getFotoActiva } from "@/data/hero";
import { aperturaDesdeProgreso, ENTRADA, fijarCorte } from "@/lib/corte";
import { eio, losaPerfil, placement, type Colocacion, type Rect } from "@/lib/escena";
import { clamp, lerp } from "@/lib/mates";

const CONSULTA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Isla de la portada de `/about` (07 F2). Solo a ≥ 1024 px sin movimiento
 * reducido y con GSAP (`import()` tras `load`): liga un `ScrollTrigger` **sin
 * pin** (scrub 0,3) al escenario sticky de 210 svh.
 * - corte del nombre: abierto en p = 0, cerrado desde p = 0,3 (`fijarCorte`);
 * - foto: de pantalla completa a la losa de las columnas 8–12 entre p 0 y 0,7;
 * - bio: entra entre p 0,5 y 0,8; el láser se recorta hacia la losa.
 * Coloca el bloque de texto para que el láser pase por el corte de «Vargas»
 * (dos pases: cálculo y corrección medida). Si GSAP no llega o la consulta deja
 * de cumplirse, quita `html.perfil-cine` y la portada queda en su estado final.
 */
export default function PortadaPerfilCliente() {
  const ancla = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const seccion = ancla.current?.closest<HTMLElement>(".portada");
    const escenario = seccion?.querySelector<HTMLElement>(".escenario");
    const clip = seccion?.querySelector<HTMLElement>(".foto-clip");
    const poster = seccion?.querySelector<HTMLImageElement>(".poster");
    const laser = seccion?.querySelector<HTMLElement>(".laser");
    const texto = seccion?.querySelector<HTMLElement>(".heroe-texto");
    const lockup = seccion?.querySelector<HTMLElement>("[data-lockup]");
    const l2 = lockup?.querySelector<HTMLElement>(".l2");
    const bio = seccion?.querySelector<HTMLElement>(".bio");
    const velo = seccion?.querySelector<HTMLElement>(".velo");
    const indicador = seccion?.querySelector<HTMLElement>(".indicador");
    if (!seccion || !escenario || !clip || !poster || !laser || !texto || !lockup || !l2 || !bio || !velo || !indicador) return;

    const html = document.documentElement;
    const mq = window.matchMedia(CONSULTA);
    const f = getFotoActiva();
    const foto = { w: f.tamano.w, h: f.tamano.h, ojo: f.ojo };
    let vivo = true;
    let corteListo = false;
    let p = 0;
    let geo: { A: Rect; B: Rect; pa: Colocacion; pb: Colocacion } | null = null;
    let limpiarGsap: (() => void) | null = null;
    const temporizadores: number[] = [];

    const limpiarEstilos = () => {
      for (const el of [poster, laser, texto, bio, velo, indicador]) el.removeAttribute("style");
      for (const k of ["left", "top", "width", "height", "border-radius"]) clip.style.removeProperty(k);
      delete texto.dataset.colocado;
      fijarCorte(lockup, 0);
    };

    const salir = () => {
      limpiarGsap?.();
      limpiarGsap = null;
      html.classList.remove("perfil-cine");
      limpiarEstilos();
    };

    const corteActual = () => {
      const v = parseFloat(lockup.style.getPropertyValue("--corte"));
      return Number.isFinite(v) && v > 0 ? v : parseFloat(getComputedStyle(lockup).fontSize) * 0.5;
    };

    /** Geometría del escenario y colocación del texto sobre el láser. */
    const medir = () => {
      const W = escenario.clientWidth;
      const H = escenario.clientHeight;
      const A = { x: 0, y: 0, w: W, h: H };
      const B = losaPerfil(W, H);
      geo = { A, B, pa: placement(A, "cine", foto), pb: placement(B, "losa", foto) };
      const lineaA = geo.pa.Oy + foto.ojo * geo.pa.Dy;
      const corte = corteActual();
      // Por la cadena de `offsetParent` (sin transformaciones): la entrada de
      // +16 px no puede contaminar la medida.
      let off = 0;
      for (let n: HTMLElement | null = l2; n && n !== texto; n = n.offsetParent as HTMLElement | null) off += n.offsetTop;
      texto.style.top = `${Math.max(88, lineaA - off - corte)}px`;
      texto.dataset.colocado = "";
    };

    const pintar = () => {
      if (!geo) return;
      const { A, B, pa, pb } = geo;
      const q = eio(clamp(p / 0.7));
      const r = { x: lerp(A.x, B.x, q), y: lerp(A.y, B.y, q), w: lerp(A.w, B.w, q), h: lerp(A.h, B.h, q) };
      const pl = { Ox: lerp(pa.Ox, pb.Ox, q), Oy: lerp(pa.Oy, pb.Oy, q), Dx: lerp(pa.Dx, pb.Dx, q), Dy: lerp(pa.Dy, pb.Dy, q) };
      Object.assign(clip.style, {
        left: `${r.x}px`,
        top: `${r.y}px`,
        width: `${r.w}px`,
        height: `${r.h}px`,
        borderRadius: `${lerp(0, 48, q)}px`,
      });
      Object.assign(poster.style, {
        left: `${pl.Ox - r.x}px`,
        top: `${pl.Oy - r.y}px`,
        width: `${pl.Dx}px`,
        height: `${pl.Dy}px`,
        translate: "none",
      });
      poster.style.setProperty("--pluma", `${(18 * (1 - clamp(p / 0.6))).toFixed(2)}%`);
      // F4: el vidrio (WebGL) se aclara al llegar a la losa: .62 → .08 en p 0–0,85.
      poster.style.setProperty("--vidrio-f", lerp(0.62, 0.08, clamp(p / 0.85)).toFixed(3));
      laser.style.top = `${pl.Oy + foto.ojo * pl.Dy}px`;
      laser.style.opacity = String(lerp(1, 0.6, q));
      laser.style.clipPath = `inset(-12px 0 -12px ${Math.max(0, lerp(0, r.x - 24, q))}px)`;
      const b = clamp((p - 0.5) / 0.3);
      bio.style.opacity = String(b);
      bio.style.translate = `0 ${16 * (1 - b)}px`;
      velo.style.opacity = String(1 - 0.4 * clamp(p / 0.7));
      indicador.style.setProperty("--p", clamp(p).toFixed(3));
      indicador.style.opacity = String(1 - clamp((p - 0.15) / 0.2));
      seccion.dataset.p = p.toFixed(3);
      if (corteListo) fijarCorte(lockup, aperturaDesdeProgreso(p));
    };

    const montar = async () => {
      if (!mq.matches) return salir();
      html.classList.add("perfil-cine");
      let gsap: typeof import("gsap").gsap;
      let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
      try {
        [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      } catch {
        return salir();
      }
      if (!vivo || !mq.matches) return salir();
      gsap.registerPlugin(ScrollTrigger);
      await document.fonts.ready.catch(() => undefined);
      // Espera a que la isla del nombre haya medido `--corte` (o 1,2 s como mucho).
      const t0 = performance.now();
      while (vivo && !lockup.style.getPropertyValue("--corte") && performance.now() - t0 < 1200) {
        await new Promise((r) => requestAnimationFrame(r));
      }
      if (!vivo || !mq.matches) return salir();

      const ctx = gsap.context(() => {
        const estado = { p: 0 };
        gsap.to(estado, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: seccion,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
            onRefreshInit: () => medir(),
            onRefresh: () => pintar(),
          },
          onUpdate: () => {
            p = estado.p;
            pintar();
          },
        });
        medir();
        pintar();
        if (window.scrollY < 4) {
          gsap.from(Array.from(texto.children).filter((el) => el !== bio), { opacity: 0, y: 16, duration: 0.6, ease: "expo.out", stagger: 0.06, delay: 0.12 });
          gsap.from(laser, { scaleX: 0, duration: 0.7, ease: "power3.inOut", delay: 0.24 });
        }
      }, seccion);
      // El corte lo abre la isla del nombre (880 + 520 ms); después es del scroll.
      temporizadores.push(
        window.setTimeout(() => {
          corteListo = true;
          pintar();
        }, ENTRADA.retrasoMs + ENTRADA.duracionMs + 40),
      );
      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(escenario);
      limpiarGsap = () => {
        ro.disconnect();
        ctx.revert();
      };
    };

    const alCambiar = () => (mq.matches ? void montar() : salir());
    const iniciar = () => void montar();
    if (document.readyState === "complete") iniciar();
    else window.addEventListener("load", iniciar, { once: true });
    mq.addEventListener("change", alCambiar);

    return () => {
      vivo = false;
      temporizadores.forEach(clearTimeout);
      window.removeEventListener("load", iniciar);
      mq.removeEventListener("change", alCambiar);
      salir();
    };
  }, []);

  return <span ref={ancla} hidden />;
}
