"use client";

import { useEffect, useRef } from "react";
import { getFotoActiva, vidrio, type EstadoVidrio } from "@/data/hero";
import { cubrir, vidrioEnEscena } from "@/lib/escena";
import { barridoDe } from "./barridoDom";
import { montarLente } from "./useLente";

/** El borde de la zona nítida llega a 1,2 × el radio (como en el shader). */
const BORDE = 1.2;
const ARRIBA: [number, number] = [0.5, 0];

/**
 * Activa la zona nítida en CSS (`VidrioCss`): la foto limpia vista por un disco
 * de borde suave que se mueve con `transform` (solo compositor: ni layout ni
 * repintado por cuadro). La foto va en un `<canvas>` pintado una vez: un canvas
 * no es candidato a LCP (una imagen de fondo sí lo sería, y en móvil desplazaba
 * al póster). Dos usos:
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
  // Se lee en cada gesto: cambiarlo no reinicia la lente (el barrido sigue donde iba).
  const solo = useRef(soloBarrido);
  useEffect(() => {
    solo.current = soloBarrido;
  }, [soloBarrido]);
  useEffect(() => {
    if (sale) return;
    const foto = getFotoActiva();
    const ojo = capa.querySelector<HTMLElement>("i");
    if (!ojo) return;
    const limpia = document.createElement("canvas");
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
    // La caja de la foto pintada en `cover` dentro de la capa (la misma del póster).
    let ox = 0;
    let oy = 0;
    const medir = () => {
      const c = cubrir({ w: capa.clientWidth, h: capa.clientHeight }, foto.tamano.w / foto.tamano.h, pos);
      ox = c.Ox;
      oy = c.Oy;
      limpia.style.width = `${c.Dx.toFixed(2)}px`;
      limpia.style.height = `${c.Dy.toFixed(2)}px`;
    };
    // La foto limpia se decodifica antes de abrir nada: la lente nunca se abre sobre una capa vacía.
    const img = new Image();
    img.decoding = "async";
    img.src = foto.rutas.textura;
    img
      .decode()
      .catch(() => {})
      .then(() => {
        if (!vivo || !img.naturalWidth) return;
        delete capa.dataset.sale;
        limpia.width = img.naturalWidth;
        limpia.height = img.naturalHeight;
        limpia.getContext("2d")?.drawImage(img, 0, 0);
        limpia.dataset.foto = foto.rutas.textura;
        ojo.replaceChildren(limpia);
        copiar();
        medir();
        capa.setAttribute("data-activo", "");
        const auto = barridoDe(capa, foto, pos, () => {
          medir();
          l.pedir();
        });
        const l = montarLente(
          capa,
          (s) => {
            // El mismo radio que el WebGL: en el acto 1 del home va de `cine` a `losa` con `--vidrio-p`.
            const pe = parseFloat(capa.style.getPropertyValue("--vidrio-p"));
            const base = vidrio[escritorio.matches ? estados.escritorio : estados.movil].lente;
            const r = (escritorio.matches && Number.isFinite(pe) ? vidrioEnEscena(pe, vidrio.cine, vidrio.losa).lente : base) * BORDE;
            const lr = `${r}px`;
            const lente = s.abierta.toFixed(3);
            if (propias["--lr"] !== lr) poner("--lr", lr);
            if (propias["--lente"] !== lente) poner("--lente", lente);
            ojo.style.transform = `translate3d(${(s.mx - r).toFixed(2)}px,${(s.my - r).toFixed(2)}px,0)`;
            limpia.style.transform = `translate3d(${(r - s.mx + ox).toFixed(2)}px,${(r - s.my + oy).toFixed(2)}px,0)`;
          },
          {
            barrido: auto.barrido,
            get soloBarrido() {
              return solo.current;
            },
          },
        );
        const mo = espejo
          ? new MutationObserver(() => {
              copiar();
              l.pedir();
            })
          : null;
        if (espejo) mo?.observe(espejo, { attributes: true, attributeFilter: ["style"] });
        l.pedir();
        soltar = () => {
          l.destruir();
          auto.soltar();
          mo?.disconnect();
        };
      });
    return () => {
      vivo = false;
      soltar();
      // Se va con un fundido (`vidrio.css`): el WebGL entra a la vez. El canvas de la foto se retira al acabar.
      capa.dataset.sale = "";
      capa.removeAttribute("data-activo");
      window.setTimeout(() => limpia.remove(), 450);
    };
  }, [capa, espejo, estados, pos, sale]);
  return null;
}
