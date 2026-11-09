"use client";

import { useEffect, useRef, useState } from "react";
import { getFotoActiva } from "@/data/hero";

/**
 * Pulido D · la foto sigue a lo ancho (acto 1 del home y portada de `/about`).
 *
 * Detrás de la foto nítida, la misma foto escalada a cubrir todo el ancho, en
 * tres capas cada vez más borrosas y oscuras hacia los lados (máscaras en
 * `vidrio.css`, ligadas a los bordes de la foto nítida: `--pl`, `--pr`). Se
 * pinta en `<canvas>` desde la `<img>` ya decodificada del póster: ninguna
 * petición nueva y nada que compita por el LCP (un canvas no es candidato).
 * La escala se elige para cubrir la caja con la línea de los ojos fija (el
 * láser sigue recto) y la cara tan centrada como deje la cobertura. Sigue a la
 * foto cuando la escena la mueve (`style` en línea → MutationObserver).
 * Solo ≥ 1024: en móvil la foto ya va a sangre. Con RM o sin JS no se pinta.
 */
const CAPAS = [
  // [ancho del canvas, desenfoque (px CSS), brillo]
  [360, 4, 0.9],
  [180, 16, 0.78],
  [90, 40, 0.64],
] as const;
/** Ancho de referencia para hornear el desenfoque en píxeles del canvas. */
const REF = 1440;

export default function FotoContinua({ foto }: { foto: string }) {
  const raiz = useRef<HTMLDivElement>(null);
  // Los canvas solo existen donde se pintan (≥ 1024 sin RM): sin JS, en móvil y con RM no hay ninguno.
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const cambio = () => setActiva(mq.matches);
    cambio();
    mq.addEventListener("change", cambio);
    return () => mq.removeEventListener("change", cambio);
  }, []);

  useEffect(() => {
    if (!activa) return;
    const el = raiz.current;
    const caja = el?.parentElement;
    const img = caja?.querySelector<HTMLImageElement>(foto);
    if (!el || !caja || !img) return;
    const f = getFotoActiva();
    const lienzos = Array.from(el.querySelectorAll("canvas"));
    let vivo = true;

    const dibujar = () => {
      if (!vivo || !img.naturalWidth) return;
      const ar = img.naturalHeight / img.naturalWidth;
      lienzos.forEach((c, i) => {
        const [w, blur, brillo] = CAPAS[i];
        const h = Math.round(w * ar);
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        const r = (blur * w) / REF;
        const filtro = `blur(${r.toFixed(2)}px) brightness(${brillo})`;
        // Desenfoque horneado si el navegador lo admite; si no, por CSS en el canvas.
        ctx.filter = filtro;
        const horneado = ctx.filter === filtro;
        if (!horneado) c.style.filter = `blur(${blur}px) brightness(${brillo})`;
        // Un margen de 2r fuera del canvas: el desenfoque no oscurece el borde.
        const m = horneado ? 2 * r : 0;
        ctx.drawImage(img, -m, -m * ar, w + 2 * m, h + 2 * m * ar);
      });
      colocar();
      el.dataset.listo = "";
    };

    const colocar = () => {
      if (!vivo) return;
      const rc = caja.getBoundingClientRect();
      const ri = img.getBoundingClientRect();
      const W = rc.width;
      const H = rc.height;
      if (!W || !H || !ri.width || !ri.height) return;
      const Ox = ri.left - rc.left;
      const Oy = ri.top - rc.top;
      const Dx = ri.width;
      const Dy = ri.height;
      // Escala mínima que cubre la caja, con un 6 % de holgura para poder centrar la cara.
      const k = Math.max(1, W / Dx, H / Dy) * 1.06;
      const fx = Ox + f.cara[0] * Dx;
      const ey = Oy + f.ojo * Dy;
      const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
      const x = clamp(fx - k * (fx - Ox), W - k * Dx, 0);
      const y = clamp(ey - k * (ey - Oy), H - k * Dy, 0);
      const s = el.style;
      s.setProperty("--fc-x", `${x.toFixed(1)}px`);
      s.setProperty("--fc-y", `${y.toFixed(1)}px`);
      s.setProperty("--fc-w", `${(k * Dx).toFixed(1)}px`);
      s.setProperty("--fc-h", `${(k * Dy).toFixed(1)}px`);
      s.setProperty("--pl", `${Math.max(0, Ox).toFixed(1)}px`);
      s.setProperty("--pr", `${Math.min(W, Ox + Dx).toFixed(1)}px`);
    };

    const mo = new MutationObserver(colocar);
    mo.observe(img, { attributes: true, attributeFilter: ["style"] });
    const ro = new ResizeObserver(colocar);
    ro.observe(caja);
    if (img.complete && img.naturalWidth) dibujar();
    else img.addEventListener("load", dibujar, { once: true });
    return () => {
      vivo = false;
      mo.disconnect();
      ro.disconnect();
      img.removeEventListener("load", dibujar);
      delete el.dataset.listo;
    };
  }, [foto, activa]);

  return (
    <div ref={raiz} className="foto-continua" aria-hidden="true" data-foto-continua="">
      {activa &&
        CAPAS.map((_, i) => (
          <i key={i} className={`fc-${i + 1}`}>
            <canvas />
          </i>
        ))}
    </div>
  );
}
