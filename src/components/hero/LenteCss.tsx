"use client";

import { useEffect } from "react";
import { getFotoActiva, vidrio, type EstadoVidrio } from "@/data/hero";
import { montarLente } from "./useLente";

/**
 * Activa el respaldo `VidrioCss` (sin WebGL): le pone la foto limpia de fondo y
 * mueve la máscara de la lente con el cursor o el dedo. No pinta nada propio.
 */
export default function LenteCss({
  capa,
  estados,
  espejo,
}: {
  capa: HTMLElement;
  estados: { escritorio: EstadoVidrio; movil: EstadoVidrio };
  espejo?: HTMLElement | null;
}) {
  useEffect(() => {
    capa.style.setProperty("background-image", `url(${getFotoActiva().rutas.textura})`);
    capa.setAttribute("data-activo", "");
    const copiar = () => {
      if (!espejo) return;
      const v = capa.style.getPropertyValue("--v-pos");
      capa.setAttribute("style", espejo.getAttribute("style") ?? "");
      capa.style.setProperty("--v-pos", v);
      capa.style.setProperty("background-image", `url(${getFotoActiva().rutas.textura})`);
    };
    copiar();
    const mo = espejo ? new MutationObserver(copiar) : null;
    if (espejo) mo?.observe(espejo, { attributes: true, attributeFilter: ["style"] });
    return () => {
      mo?.disconnect();
      capa.removeAttribute("data-activo");
    };
  }, [capa, espejo]);
  useEffect(() => {
    const escritorio = window.matchMedia("(min-width: 1024px)");
    const l = montarLente(capa, (s) => {
      const p = vidrio[escritorio.matches ? estados.escritorio : estados.movil];
      capa.style.setProperty("--lx", `${s.mx.toFixed(1)}px`);
      capa.style.setProperty("--ly", `${s.my.toFixed(1)}px`);
      capa.style.setProperty("--lr", `${p.lente}px`);
      capa.style.setProperty("--lente", s.abierta.toFixed(3));
    });
    l.pedir();
    return () => l.destruir();
  }, [capa, estados]);
  return null;
}
