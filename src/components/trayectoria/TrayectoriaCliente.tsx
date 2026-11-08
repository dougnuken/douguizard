"use client";

import { useEffect, useRef } from "react";

const CONSULTA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface DatosTrayectoria {
  hoy: number;
  t0: number;
  hitos: { inicio: number; fin: number; paralelo: boolean }[];
  /** Acumulados [años, empresas, casos] mes a mes desde `t0` (de `acumuladosEn`). */
  acumulados: (readonly [number, number, number])[];
  /** Año de inicio de cada era. */
  eras: number[];
  /** Año de cada producto propio. */
  propios: number[];
}

/**
 * Isla de `/experience` (07 F2). Mismas cuentas que `lib/trayectoria.ts`
 * (`yDe`, `pDe`, `activoEn`), sin importar los datos: llegan como números.
 * - ≥ 1024 sin RM, con GSAP (`import()` tras `load`): pin de 3,6 viewports,
 *   scrub 0,5; el año es `yDe(p)` (scroll por hito, P1-9). `focusin` en un
 *   hito lleva la escena a su tramo (P0-1).
 * - < 1024 sin RM: activo = el hito que cruza el 55 % del viewport.
 * - RM / sin GSAP: quita `html.exp-cine` y deja el estado final del HTML.
 */
export default function TrayectoriaCliente({ datos }: { datos: DatosTrayectoria }) {
  const ancla = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = ancla.current?.closest<HTMLElement>(".exp");
    const escena = raiz?.querySelector<HTMLElement>(".escena-t");
    if (!raiz || !escena) return;
    const html = document.documentElement;
    const mq = window.matchMedia(CONSULTA);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const { hoy, t0, hitos } = datos;
    const n = hitos.length;
    const $$ = <T extends Element>(s: string) => Array.from(raiz.querySelectorAll<T>(s));
    const lis = $$<HTMLLIElement>(".hito");
    const tiras = $$<HTMLElement>(".odometro .tira");
    const tramos = $$<HTMLElement>("[data-tramo]");
    const erasEje = $$<HTMLElement>(".eras [data-era]");
    const erasTxt = $$<HTMLElement>(".era [data-era]");
    const propios = $$<HTMLElement>(".propio");
    const dd = $$<HTMLElement>("[data-ac]");
    const ddFinal = dd.map((el) => el.textContent ?? "");
    const chip = raiz.querySelector<HTMLElement>(".hoy-chip");
    const recorrido = raiz.querySelector<HTMLElement>(".recorrido");
    const cabezal = raiz.querySelector<HTMLElement>(".cabezal");
    const ol = raiz.querySelector<HTMLElement>(".hitos");
    const x = (y: number) => (y - t0) / (hoy - t0);
    const yDe = (p: number) => {
      const k = clamp(p) * n;
      const i = Math.min(n - 1, Math.floor(k));
      return lerp(hitos[i].inicio, i < n - 1 ? hitos[i + 1].inicio : hoy, k - i);
    };
    const pDe = (i: number) => (i + 0.08) / n;
    const activoEn = (y: number) => {
      let a = 0;
      hitos.forEach((h, i) => {
        if (y >= h.inicio - 1e-6) a = i;
      });
      return a;
    };

    let ultimoAnio = -1;
    let ultimoActivo = -1;
    const ponerAcumulado = (el: HTMLElement, v: number) => {
      const txt = v >= 1 ? String(v) : "";
      el.parentElement?.classList.toggle("cero", !txt);
      if (el.textContent === txt) return;
      el.textContent = txt;
      if (txt && !rm.matches) {
        el.classList.remove("sube");
        void el.offsetWidth;
        el.classList.add("sube");
      }
    };

    /** Estado de la escena en el año y. `activoForzado`: el del móvil (por posición). */
    const enAnio = (y: number, activoForzado?: number) => {
      const anio = Math.min(Math.floor(hoy), Math.floor(y + 1e-6));
      if (anio !== ultimoAnio) {
        ultimoAnio = anio;
        String(anio)
          .split("")
          .forEach((d, i) => tiras[i] && (tiras[i].style.transform = `translateY(${-Number(d)}em)`));
      }
      chip?.classList.toggle("on", y >= Math.floor(hoy));
      let era = 0;
      datos.eras.forEach((d, i) => {
        if (y >= d) era = i;
      });
      erasEje.forEach((s, i) => s.classList.toggle("activa", i === era));
      erasTxt.forEach((s, i) => s.classList.toggle("hoy", i === era));
      const activo = activoForzado ?? activoEn(y);
      tramos.forEach((t) => {
        const i = Number(t.dataset.tramo);
        const h = hitos[i];
        const f = clamp((y - h.inicio) / (h.fin - h.inicio));
        t.style.setProperty("--f", f.toFixed(3));
        t.classList.toggle("activo", i === activo);
        t.classList.toggle("hecho", f >= 1);
      });
      if (activo !== ultimoActivo) {
        ultimoActivo = activo;
        lis.forEach((li, i) => li.classList.toggle("activo", i === activo));
      }
      recorrido?.style.setProperty("--p", clamp(x(y)).toFixed(4));
      if (cabezal) cabezal.style.left = `${(clamp(x(y)) * 100).toFixed(3)}%`;
      const k = Math.max(0, Math.min(datos.acumulados.length - 1, Math.floor((y - t0) * 12 + 1e-6)));
      // F3: medio mes de tolerancia. En p = 1, `y` puede quedar una fracción por debajo de
      // `hoy` y caer en el mes anterior; si el ancla de carrera es este mes (noviembre),
      // eso restaba un año (11 en vez de 12).
      const ac = y >= hoy - 1 / 24 ? datos.acumulados[datos.acumulados.length - 1] : datos.acumulados[k];
      dd.forEach((el, i) => ponerAcumulado(el, ac[i]));
      propios.forEach((p, i) => p.classList.toggle("on", y >= datos.propios[i] - 1e-6));
      raiz.dataset.anio = y.toFixed(3);
      raiz.dataset.activo = String(activo);
    };

    let limpiar: (() => void) | null = null;
    let vivo = true;

    const restaurar = () => {
      limpiar?.();
      limpiar = null;
      html.classList.remove("exp-cine");
      // Solo lo que escribe la isla: la posición de los tramos y el --dur de cada hito vienen del HTML.
      tiras.forEach((el) => el.style.removeProperty("transform"));
      tramos.forEach((el) => el.style.removeProperty("--f"));
      recorrido?.style.removeProperty("--p");
      cabezal?.style.removeProperty("left");
      ol?.style.removeProperty("--fill");
      lis.forEach((li) => li.classList.remove("activo", "paso", "fuera"));
      tramos.forEach((t) => t.classList.remove("activo", "hecho"));
      dd.forEach((el, i) => {
        el.parentElement?.classList.remove("cero");
        el.classList.remove("sube");
        el.textContent = ddFinal[i];
      });
      erasTxt.forEach((s, i) => s.classList.toggle("hoy", i === erasTxt.length - 1));
      erasEje.forEach((s) => s.classList.remove("activa"));
      propios.forEach((p) => p.classList.remove("on"));
      chip?.classList.remove("on");
      ultimoAnio = -1;
      ultimoActivo = -1;
      delete raiz.dataset.montado;
    };

    const escritorio = async () => {
      html.classList.add("exp-cine");
      let gsap: typeof import("gsap").gsap;
      let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
      try {
        [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      } catch {
        restaurar();
        enAnio(hoy);
        return;
      }
      if (!vivo || !mq.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const estado = { p: 0 };
      let st: ScrollTrigger | undefined;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: escena,
            pin: true,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3.6)}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
          onUpdate: () => enAnio(yDe(estado.p)),
        });
        tl.to(estado, { p: 1, ease: "none", duration: 1 });
        st = tl.scrollTrigger;
      }, raiz);
      raiz.dataset.montado = "";
      enAnio(yDe(0));
      // P0-1: el foco en un hito lleva la escena a su tramo, al instante.
      const alFoco = (e: FocusEvent) => {
        const li = (e.target as HTMLElement).closest<HTMLLIElement>(".hito");
        if (!li || !st) return;
        const i = lis.indexOf(li);
        const top = st.start + pDe(i) * (st.end - st.start);
        window.scrollTo({ top: Math.round(top), behavior: "instant" as ScrollBehavior });
        st.update();
        st.getTween?.()?.progress(1);
        estado.p = pDe(i);
        enAnio(yDe(estado.p));
      };
      ol?.addEventListener("focusin", alFoco);
      document.fonts.ready.then(() => vivo && ScrollTrigger.refresh());
      Object.assign(window, { __exp: { st: () => st, yDe, pDe, n } });
      limpiar = () => {
        ol?.removeEventListener("focusin", alFoco);
        ctx.revert();
      };
    };

    const movil = () => {
      raiz.dataset.montado = "";
      let raf = 0;
      const f = () => {
        raf = 0;
        const c = window.innerHeight * 0.55;
        let activo = 0;
        let y = t0;
        lis.forEach((li, i) => {
          const r = li.getBoundingClientRect();
          if (r.top < c) {
            activo = i;
            y = hitos[i].inicio + clamp((c - r.top) / r.height) * (hitos[i].fin - hitos[i].inicio);
          }
        });
        if (window.scrollY > document.documentElement.scrollHeight - window.innerHeight - 4) y = hoy;
        lis.forEach((li, i) => {
          li.classList.toggle("paso", i < activo);
          li.classList.toggle("fuera", li.getBoundingClientRect().top > window.innerHeight * 0.9);
        });
        if (ol) {
          const ro = ol.getBoundingClientRect();
          ol.style.setProperty("--fill", `${clamp(c - ro.top, 0, ro.height)}px`);
        }
        enAnio(y, activo);
      };
      const alScroll = () => {
        if (!raf) raf = requestAnimationFrame(f);
      };
      window.addEventListener("scroll", alScroll, { passive: true });
      window.addEventListener("resize", alScroll);
      f();
      limpiar = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", alScroll);
        window.removeEventListener("resize", alScroll);
      };
    };

    const aplicar = () => {
      restaurar();
      if (rm.matches) return;
      if (mq.matches) void escritorio();
      else movil();
    };

    const iniciar = () => vivo && aplicar();
    if (document.readyState === "complete") iniciar();
    else window.addEventListener("load", iniciar, { once: true });
    mq.addEventListener("change", aplicar);
    rm.addEventListener("change", aplicar);
    return () => {
      vivo = false;
      window.removeEventListener("load", iniciar);
      mq.removeEventListener("change", aplicar);
      rm.removeEventListener("change", aplicar);
      restaurar();
    };
  }, [datos]);

  return <span ref={ancla} hidden />;
}
