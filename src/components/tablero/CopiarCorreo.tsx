"use client";

import { useEffect, useRef, useState } from "react";
import { Icono } from "@/components/sistema/Iconos";

/**
 * K17 · Copiar el correo (04 §3 K17, §4.5): «Copiar correo» → «Copiado» o el
 * error de 04 («No se pudo copiar. Selecciónalo a mano.»). El estado se anuncia
 * con `aria-live`. Sin JS el botón no se pinta: el correo es seleccionable.
 */
export default function CopiarCorreo({
  correo,
  textos,
}: {
  correo: string;
  textos: { reposo: string; hecho: string; error: string };
}) {
  const [estado, setEstado] = useState<"reposo" | "hecho" | "error">("reposo");
  // Un solo temporizador de vuelta al reposo: un segundo clic reinicia la cuenta
  // en vez de dejar que el primero devuelva el botón antes de tiempo.
  const temporizador = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(temporizador.current), []);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(correo);
      setEstado("hecho");
    } catch {
      setEstado("error");
    }
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setEstado("reposo"), 2400);
  };
  return (
    <button type="button" className="boton boton--linea-osc copiar" onClick={copiar}>
      <span className="copiar-ico" data-hecho={estado === "hecho" ? "" : undefined} aria-hidden="true">
        <Icono nombre="copiar" />
        <Icono nombre="hecho" />
      </span>
      <span aria-live="polite">
        <span key={estado} className="copiar-txt" data-anim={estado === "reposo" ? undefined : ""}>
          {textos[estado]}
        </span>
      </span>
    </button>
  );
}
