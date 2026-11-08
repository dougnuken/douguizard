"use client";

import { useSyncExternalStore } from "react";

const ZONA = "America/Bogota"; // Barranquilla: UTC-5 todo el año, sin horario de verano.

function subscribe(cb: () => void) {
  // Se despierta al cambiar el minuto, no cada segundo.
  let t = 0;
  const programar = () => {
    t = window.setTimeout(() => {
      cb();
      programar();
    }, 60_000 - (Date.now() % 60_000) + 50);
  };
  programar();
  return () => window.clearTimeout(t);
}

/** Minuto actual en Barranquilla, como clave estable para `useSyncExternalStore`. */
const minuto = () => String(Math.floor(Date.now() / 60_000));
const sinHora = () => "";

/**
 * K5 · Reloj de Barranquilla en Doto (04 §3 K6): 24 h en ES, 12 h + AM/PM en EN.
 * En el servidor no hay hora (el HTML es estático): la cifra se reserva con
 * `visibility: hidden` para que no salte el layout; sin JS no se muestra
 * (`@media (scripting: none)`), y queda la línea «Barranquilla, Colombia · UTC-5».
 */
export default function RelojBaq({
  iata,
  h12,
  aria,
  ariaSinHora,
}: {
  iata: string;
  h12: boolean;
  /** Nombre accesible con la hora; `{hora}` se reemplaza («Hora local en Barranquilla: {hora}»). */
  aria: string;
  ariaSinHora: string;
}) {
  const clave = useSyncExternalStore(subscribe, minuto, sinHora);
  const fecha = clave ? new Date(Number(clave) * 60_000) : null;
  const partes = fecha
    ? new Intl.DateTimeFormat(h12 ? "en-US" : "es-CO", {
        timeZone: ZONA,
        hour: "numeric",
        minute: "2-digit",
        hour12: h12,
        hourCycle: h12 ? "h12" : "h23",
      }).formatToParts(fecha)
    : [];
  const hora = partes.filter((p) => p.type === "hour" || p.type === "minute" || p.type === "literal").map((p) => p.value).join("").trim();
  const ampm = partes.find((p) => p.type === "dayPeriod")?.value.replace(/\./g, "").toUpperCase();
  return (
    <span
      className="dot reloj"
      role="img"
      aria-label={hora ? aria.replace("{hora}", `${hora}${ampm ? ` ${ampm}` : ""}`) : ariaSinHora}
      data-listo={hora ? "" : undefined}
    >
      <span aria-hidden="true">{iata}</span>{" "}
      <span className="reloj-hora" aria-hidden="true">
        {hora || "00:00"}
        {ampm && <span className="ampm">{ampm}</span>}
      </span>
    </span>
  );
}
