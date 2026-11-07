"use client";

import { useEffect, type RefObject } from "react";
import { getFotoActiva } from "@/data/hero";
import { aperturaDesdeProgreso, ENTRADA, fijarCorte } from "@/lib/corte";
import { cubrir, frameEscena, placement, type Colocacion, type Rect } from "@/lib/escena";
import { CONSULTA_CINE } from "./sceneInit";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Si GSAP no llega en este tiempo (o lanza), el acto 1 se retira: OS de F3. */
const ESPERA_GSAP_MS = 4000;
/** Evento que piden «Ver casos», las pills y el skip link (`lib/irASeccion`). */
export const EVENTO_FIN = "escena:fin";

/** Offset de `el` hasta `ancestro` por la cadena de `offsetParent` (sin transformaciones). */
function offset(el: HTMLElement, ancestro: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== ancestro; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

/**
 * El acto 1 «cine» → OS del home (07 F5). Solo a ≥ 1024 px sin RM (la misma
 * consulta que `sceneInit`), tras el `load` y un hueco libre: pide GSAP +
 * ScrollTrigger (`import()`, fuera del JS inicial) y liga un progreso p ∈ [0, 1]
 * al recorrido de la pista (1 viewport; la escena es `sticky`, así que el
 * espacio ya estaba reservado desde el primer pintado: sin CLS).
 * - `scrub: 0.3`, snap no direccional a 0 o 1 (NOTAS §7 P1-3).
 * - `pintar(p)` escribe en línea foto, vidrio (`--vidrio-p`), láser, velo, K2
 *   (viaje, `--m`, `--mt`), nombre XL (FLIP a K1 y corte: `fijarCorte`), losas,
 *   rail (`inert` con p < 0,5) y «Desliza»; en p = 1 lo borra todo y el OS es el
 *   de F3 tal cual (`html[data-escena-fase="os"]`).
 * - Robustez: `invalidateOnRefresh`, `onRefresh` resincroniza p,
 *   `ResizeObserver` → `refresh()` con debounce, `matchMedia` revierte al OS al
 *   cruzar 1024 o activar RM; el foco fuera de K2 con p < 1 salta al final.
 */
export function useScrollScene(ancla: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const pista = ancla.current?.closest<HTMLElement>("[data-escena-pista]");
    const escena = pista?.querySelector<HTMLElement>(".escena");
    const q = <T extends HTMLElement>(sel: string) => escena?.querySelector<T>(sel) ?? null;
    const k1 = q(".k1");
    const foto = q(".k1-foto");
    const poster = q<HTMLImageElement>("img.k1-poster");
    const laser = q(".k1-laser");
    const velo = q(".k1-velo");
    const panel = q(".k1-panel");
    const k1Nombre = q(".k1-nombre");
    const k2 = q(".k2");
    const losas = { k3: q(".k3"), k4: q(".k4"), k5: q(".k5") };
    const lockup = q("[data-lockup].escena-nombre");
    const l2 = lockup?.querySelector<HTMLElement>(".l2") ?? null;
    const indicador = q(".escena-indicador");
    const osLaser = q(".os-laser");
    const main = document.getElementById("main");
    if (!pista || !escena || !k1 || !foto || !poster || !laser || !velo || !panel || !k1Nombre || !k2 || !lockup || !l2 || !indicador) return;
    const html = document.documentElement;
    const rail = document.querySelector<HTMLElement>(".rail-acciones");
    const mq = window.matchMedia(CONSULTA_CINE);
    const f = getFotoActiva();
    const fotoDatos = { w: f.tamano.w, h: f.tamano.h, ojo: f.ojo };
    const tarjetas = [losas.k3, losas.k4, losas.k5].filter(Boolean) as HTMLElement[];
    const enLinea: HTMLElement[] = [foto, poster, laser, velo, panel, k2, indicador, ...tarjetas, ...(osLaser ? [osLaser] : [])];
    // Algunos traen estilo del servidor (`varsFoto`): se restaura tal cual, no se borra.
    const originales = new Map(enLinea.map((el) => [el, el.getAttribute("style")] as const));

    let vivo = true;
    let p = 0;
    let corteListo = false;
    let geo: {
      A: Rect;
      B: Rect;
      pa: Colocacion;
      pb: Colocacion;
      radio: number;
      k2: { dx: number; dy: number };
      nombre: { x0: number; y0: number; dx: number; dy: number; s: number };
    } | null = null;
    let limpiarGsap: (() => void) | null = null;
    let irAlFin: (() => void) | null = null;
    const temporizadores: number[] = [];

    const fase = (v: "anim" | "os" | null) => {
      if (v) html.dataset.escenaFase = v;
      else delete html.dataset.escenaFase;
    };
    const setInert = (v: boolean) => {
      if (rail) rail.inert = v;
    };

    const limpiarEstilos = () => {
      for (const [el, v] of originales) {
        if (v === null) el.removeAttribute("style");
        else if (el.getAttribute("style") !== v) el.setAttribute("style", v);
      }
      // El lockup trae su estilo de servidor (tamaños y fuente): se restaura sin `top`/`transform`.
      for (const k of ["top", "transform", "opacity"]) lockup.style.removeProperty(k);
      rail?.style.removeProperty("opacity");
      rail?.style.removeProperty("translate");
    };

    const corteActual = () => {
      const v = parseFloat(lockup.style.getPropertyValue("--corte"));
      return Number.isFinite(v) && v > 0 ? v : parseFloat(getComputedStyle(lockup).fontSize) * 0.45;
    };

    /** Geometría en coordenadas de la escena (su borde superior = el del viewport mientras dura el ancla). */
    const medir = () => {
      const W = escena.clientWidth;
      const H = window.innerHeight;
      const o1 = offset(k1, escena);
      const B: Rect = { x: 0, y: 0, w: k1.offsetWidth, h: k1.offsetHeight };
      const A: Rect = { x: -o1.x, y: -o1.y, w: W, h: H };
      const cine = placement({ x: 0, y: 0, w: W, h: H }, "cine", fotoDatos);
      const pa = { ...cine, Ox: cine.Ox - o1.x, Oy: cine.Oy - o1.y };
      const pb = cubrir(B, f.tamano.w / f.tamano.h, [0.5, 0]);
      const o2 = offset(k2, escena);
      // El nombre: su corte sobre el láser (ojo al 41 % del alto), nunca bajo la cabecera.
      const lineaA = cine.Oy + f.ojo * cine.Dy;
      const y0 = Math.max(88, lineaA - l2.offsetTop - corteActual());
      lockup.style.top = `${y0}px`;
      const on = offset(k1Nombre, escena);
      const fsXL = parseFloat(getComputedStyle(lockup).fontSize) || 120;
      const fsK1 = parseFloat(getComputedStyle(k1Nombre).fontSize) || 30;
      const x0 = lockup.offsetLeft;
      geo = {
        A,
        B,
        pa,
        pb,
        radio: parseFloat(getComputedStyle(k1).borderTopLeftRadius) || 48,
        k2: { dx: 24 - o2.x, dy: H - 24 - k2.offsetHeight - o2.y },
        nombre: { x0, y0, dx: on.x - x0, dy: on.y - y0, s: fsK1 / fsXL },
      };
      pista.dataset.escenaFin = String(Math.round(pista.getBoundingClientRect().top + window.scrollY + H));
    };

    const pintar = () => {
      if (!geo) return;
      escena.dataset.p = p.toFixed(3);
      setInert(p < 0.5);
      if (p >= 0.999) {
        if (html.dataset.escenaFase !== "os") {
          limpiarEstilos();
          lockup.style.top = `${geo.nombre.y0}px`;
          fase("os");
        }
        if (corteListo) fijarCorte(lockup, 0);
        return;
      }
      fase("anim");
      const fr = frameEscena(p);
      const { A, B, pa, pb } = geo;
      const r = { x: lerp(A.x, B.x, fr.q), y: lerp(A.y, B.y, fr.q), w: lerp(A.w, B.w, fr.q), h: lerp(A.h, B.h, fr.q) };
      const pl = { Ox: lerp(pa.Ox, pb.Ox, fr.q), Oy: lerp(pa.Oy, pb.Oy, fr.q), Dx: lerp(pa.Dx, pb.Dx, fr.q), Dy: lerp(pa.Dy, pb.Dy, fr.q) };
      Object.assign(foto.style, {
        position: "absolute",
        inset: "auto",
        left: `${r.x}px`,
        top: `${r.y}px`,
        width: `${r.w}px`,
        height: `${r.h}px`,
        borderRadius: `${lerp(0, geo.radio, fr.radio)}px`,
      });
      foto.style.setProperty("--atm", (1 - fr.q).toFixed(3));
      Object.assign(poster.style, {
        position: "absolute",
        left: `${pl.Ox - r.x}px`,
        top: `${pl.Oy - r.y}px`,
        width: `${pl.Dx}px`,
        height: `${pl.Dy}px`,
        maxWidth: "none",
      });
      poster.style.setProperty("--vidrio-p", p.toFixed(4));
      laser.style.top = `${pl.Oy + f.ojo * pl.Dy - r.y}px`;
      velo.style.opacity = fr.velo.toFixed(3);
      k2.style.translate = `${lerp(geo.k2.dx, 0, fr.k2).toFixed(2)}px ${lerp(geo.k2.dy, 0, fr.k2).toFixed(2)}px`;
      k2.style.setProperty("--m", fr.m.toFixed(3));
      k2.style.setProperty("--mt", String(fr.mt));
      const n = geo.nombre;
      lockup.style.transform = `translate(${(n.dx * fr.nombre).toFixed(2)}px, ${(n.dy * fr.nombre).toFixed(2)}px) scale(${lerp(1, n.s, fr.nombre).toFixed(4)})`;
      lockup.style.opacity = fr.nombreOpacidad.toFixed(3);
      panel.style.opacity = fr.panel.toFixed(3);
      for (const [k, el] of Object.entries(losas)) {
        if (!el) continue;
        const t = fr[k as "k3" | "k4" | "k5"];
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translateY(${(24 * (1 - t)).toFixed(2)}px) scale(${(0.96 + 0.04 * t).toFixed(4)})`;
      }
      if (rail) {
        rail.style.opacity = fr.rail.toFixed(3);
        rail.style.translate = `${(-112 * (1 - fr.rail)).toFixed(2)}px 0`;
      }
      if (osLaser) osLaser.style.opacity = fr.laserOs.toFixed(3);
      indicador.style.setProperty("--p", Math.min(1, p / 0.17).toFixed(3));
      indicador.style.opacity = fr.indicador.toFixed(3);
      if (corteListo) fijarCorte(lockup, aperturaDesdeProgreso(p));
    };

    const salir = () => {
      limpiarGsap?.();
      limpiarGsap = null;
      irAlFin = null;
      html.classList.remove("cine");
      fase(null);
      setInert(false);
      limpiarEstilos();
      delete pista.dataset.escenaFin;
      delete escena.dataset.p;
      fijarCorte(lockup, 0);
    };

    const montar = async () => {
      if (!mq.matches) return salir();
      if (!html.classList.contains("cine")) {
        // Vuelve a 1024+ desde el OS (o se quitó RM): se entra en p = 1, sin saltos.
        const y = window.scrollY;
        html.classList.add("cine");
        if (y > 0) window.scrollTo(0, y + window.innerHeight);
      }
      setInert(true);
      type Gsap = typeof import("gsap").gsap;
      type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
      let gsap: Gsap;
      let ScrollTrigger: ST;
      try {
        const carga = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        const plazo = new Promise<never>((_, no) => temporizadores.push(window.setTimeout(() => no(new Error("gsap-plazo")), ESPERA_GSAP_MS)));
        const [a, b] = await Promise.race([carga, plazo]);
        gsap = a.gsap;
        ScrollTrigger = b.ScrollTrigger;
      } catch {
        return salir();
      }
      if (!vivo || !mq.matches) return salir();
      try {
        gsap.registerPlugin(ScrollTrigger);
        await document.fonts.ready.catch(() => undefined);
        // Espera a que la isla del nombre mida `--corte` (1,2 s como mucho).
        const t0 = performance.now();
        while (vivo && !lockup.style.getPropertyValue("--corte") && performance.now() - t0 < 1200) {
          await new Promise((r) => requestAnimationFrame(r));
        }
        if (!vivo || !mq.matches) return salir();

        const captura = html.hasAttribute("data-escena-captura") || "__escenaCaptura" in window;
        const estado = { p: 0 };
        let st: InstanceType<ST> | undefined;
        const ctx = gsap.context(() => {
          const tween = gsap.to(estado, {
            p: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pista,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight)}`,
              // `html[data-escena-captura]` o `window.__escenaCaptura` (solo pruebas y capturas): sin snap ni suavizado.
              scrub: captura ? true : 0.3,
              invalidateOnRefresh: true,
              snap: captura ? undefined : { snapTo: [0, 1], directional: false, delay: 0.05, duration: { min: 0.2, max: 0.45 }, ease: "power2.out" },
              // Las medidas van por `offsetTop/Left`: las transformaciones de la escena no las tocan.
              onRefreshInit: () => medir(),
              onRefresh: (self) => {
                p = self.progress;
                estado.p = p;
                pintar();
              },
            },
            onUpdate: () => {
              p = estado.p;
              pintar();
            },
          });
          st = tween.scrollTrigger;
        }, escena);
        medir();
        p = st ? st.progress : 0;
        estado.p = p;
        pintar();

        irAlFin = () => {
          if (!st) return;
          if (p >= 0.999) {
            // Ya en el OS (p. ej. desde más abajo): al final del ancla, que es donde está el tablero.
            if (Math.abs(window.scrollY - st.end) > 1) window.scrollTo({ top: st.end, behavior: "smooth" });
            return;
          }
          window.scrollTo({ top: st.end, behavior: "instant" as ScrollBehavior });
          st.getTween()?.progress(1);
          estado.p = 1;
          p = 1;
          pintar();
        };
        // El corte lo abre la isla del nombre (880 + 520 ms); después es del scroll.
        const restante = Math.max(0, ENTRADA.retrasoMs + ENTRADA.duracionMs + 40 - performance.now());
        temporizadores.push(
          window.setTimeout(() => {
            corteListo = true;
            pintar();
          }, restante),
        );
        let deb = 0;
        const ro = new ResizeObserver(() => {
          clearTimeout(deb);
          deb = window.setTimeout(() => ScrollTrigger.refresh(), 120);
        });
        ro.observe(document.body);
        limpiarGsap = () => {
          clearTimeout(deb);
          ro.disconnect();
          ctx.revert();
        };
      } catch {
        salir();
      }
    };

    // El ancla nunca atrapa: el foco fuera de K2 (Tab, skip link) salta al OS armado.
    const alFoco = (e: FocusEvent) => {
      const t = e.target as Node | null;
      if (!irAlFin || p >= 0.999 || !t) return;
      if (k2.contains(t)) return;
      if (escena.contains(t) || t === main) irAlFin();
    };
    const alFin = (e: Event) => {
      if (!irAlFin) return;
      irAlFin();
      e.preventDefault();
    };
    document.addEventListener("focusin", alFoco);
    document.addEventListener(EVENTO_FIN, alFin);

    const alCambiar = () => (mq.matches ? void montar() : salir());
    let idle = 0;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const iniciar = () => {
      idle = ric(() => void montar(), { timeout: 1500 } as IdleRequestOptions);
    };
    if (mq.matches) {
      if (document.readyState === "complete") iniciar();
      else window.addEventListener("load", iniciar, { once: true });
    } else if (html.classList.contains("cine")) salir();
    mq.addEventListener("change", alCambiar);

    return () => {
      vivo = false;
      cic(idle);
      temporizadores.forEach(clearTimeout);
      window.removeEventListener("load", iniciar);
      mq.removeEventListener("change", alCambiar);
      document.removeEventListener("focusin", alFoco);
      document.removeEventListener(EVENTO_FIN, alFin);
      salir();
    };
  }, [ancla]);
}
