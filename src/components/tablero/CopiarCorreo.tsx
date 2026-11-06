"use client";

import { useState } from "react";
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
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(correo);
      setEstado("hecho");
    } catch {
      setEstado("error");
    }
    window.setTimeout(() => setEstado("reposo"), 2400);
  };
  return (
    <button type="button" className="boton boton--linea-osc copiar" onClick={copiar}>
      <Icono nombre="copiar" />
      <span aria-live="polite">{textos[estado]}</span>
    </button>
  );
}
