"use client";

import { Icono } from "@/components/sistema/Iconos";

/**
 * «Volver arriba» del pie (pulido E): un botón circular, no un enlace más. Sube
 * (suave salvo reduced-motion) y deja el foco en `#main` sin volver a desplazar.
 */
export default function BotonArriba({ label }: { label: string }) {
  const subir = () => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
    const main = document.getElementById("main");
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  };
  return (
    <button type="button" className="pie-b-arriba" onClick={subir} aria-label={label} data-tip={label}>
      <Icono nombre="arriba" />
    </button>
  );
}
