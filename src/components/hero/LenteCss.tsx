"use client";

import { useEffect } from "react";
import { getFotoActiva, vidrio, type EstadoVidrio } from "@/data/hero";
import { barridoDe } from "./barridoDom";
import { montarLente } from "./useLente";

/** El borde de la zona nítida llega a 1,2 × el radio (como en el shader). */
const BORDE = 1.2;
const ARRIBA: [number, number] = [0.5, 0];

/**
 * Activa la zona nítida en CSS (`VidrioCss`): la foto limpia vista por un disco
 * de borde suave que se mueve con `transform` (solo compositor: ni layout ni
 * repintado por cuadro). Dos usos:
 * - respaldo sin WebGL2 (o con el contexto perdido), como hasta ahora;
 * - pulido I: en móvil, antes de la primera interacción, lleva el barrido
 *   automático sobre el póster (el WebGL espera al primer gesto y lo continúa
 *   en el mismo punto: `relojBarrido`).
 * El cursor o el dedo mandan igual que en WebGL. No pinta nada propio.
 */
export default function LenteCss({
  capa,
  estados,
  espejo,
  pos = ARRIBA,
  sale = false,
  soloBarrido = false,
}: {
  capa: HTMLElement;
  estados: { escritorio: EstadoVidrio; movil: EstadoVidrio };
  espejo?: HTMLElement | null;
  pos?: [number, number];
  /** El WebGL ya está en pantalla: la capa se funde y deja de barrer. */
  sale?: boolean;
  /** El WebGL lleva el cursor y esta capa solo el barrido (cuando el WebGL va lento). */
  soloBarrido?: boolean;
}) {
  useEffect(() => {
    if (sale) return;
    const foto = getFotoActiva();
    const ojo = capa.querySelector<HTMLElement>("i");
    const limpia = capa.querySelector<HTMLElement>("b");
    if (!ojo || !limpia) return;
    const escritorio = window.matchMedia("(min-width: 1024px)");
    let vivo = true;
    let soltar = () => {};
    // Lo que esta capa pone en su estilo y debe sobrevivir a la copia del espejo.
    const propias: Record<string, string> = { "--v-pos": capa.style.getPropertyValue("--v-pos") };
    const poner = (k: string, v: string) => {
      propias[k] = v;
      capa.style.setProperty(k, v);
    };
    const copiar = () => {
      if (!espejo) return;
      capa.setAttribute("style", espejo.getAttribute("style") ?? "");
      for (const [k, v] of Object.entries(propias)) if (v) capa.style.setProperty(k, v);
    };
    const medir = () => {
      poner("--cw", `${capa.clientWidth}px`);
      poner("--ch", `${capa.clientHeight}px`);
    };
    // La foto limpia se decodifica antes de abrir nada: la lente nunca se abre sobre una capa vacía.
    const img = new Image();
    img.decoding = "async";
    img.src = foto.rutas.textura;
    img
      .decode()
      .catch(() => {})
      .then(() => {
        if (!vivo) return;
        delete capa.dataset.sale;
        poner("--v-img", `url(${foto.rutas.textura})`);
        copiar();
        medir();
        capa.setAttribute("data-activo", "");
        const auto = barridoDe(capa, foto, pos, () => l.pedir());
        const l = montarLente(
          capa,
          (s) => {
            const r = vidrio[escritorio.matches ? estados.escritorio : estados.movil].lente * BORDE;
            const lr = `${r}px`;
            const lente = s.abierta.toFixed(3);
            if (propias["--lr"] !== lr) poner("--lr", lr);
            if (propias["--lente"] !== lente) poner("--lente", lente);
            ojo.style.transform = `translate3d(${(s.mx - r).toFixed(2)}px,${(s.my - r).toFixed(2)}px,0)`;
            limpia.style.transform = `translate3d(${(r - s.mx).toFixed(2)}px,${(r - s.my).toFixed(2)}px,0)`;
          },
          { barrido: auto.barrido, soloBarrido },
        );
        const mo = espejo
          ? new MutationObserver(() => {
              copiar();
              l.pedir();
            })
          : null;
        if (espejo) mo?.observe(espejo, { attributes: true, attributeFilter: ["style"] });
        const ro = new ResizeObserver(() => {
          medir();
          l.pedir();
        });
        ro.observe(capa);
        l.pedir();
        soltar = () => {
          l.destruir();
          auto.soltar();
          mo?.disconnect();
          ro.disconnect();
        };
      });
    return () => {
      vivo = false;
      soltar();
      // Se va con un fundido (`vidrio.css`): el WebGL entra encima a la vez.
      capa.dataset.sale = "";
      capa.removeAttribute("data-activo");
    };
  }, [capa, espejo, estados, pos, sale, soloBarrido]);
  return null;
}
