"use client";

import { useEffect, useState } from "react";
import { fijarApertura } from "@/lib/corte";

/**
 * Solo el lab: deslizador de la apertura del corte del XL y lectura de la caja
 * de cada `[data-lockup]` (lo que medirá el FLIP), leída del DOM.
 */
export default function LabCorte() {
  const [apertura, setApertura] = useState(0);
  const [medidas, setMedidas] = useState<string[]>([]);

  useEffect(() => {
    const xl = document.querySelector<HTMLElement>('[data-lockup][data-escala="xl"]');
    if (xl) fijarApertura(xl, apertura);
  }, [apertura]);

  useEffect(() => {
    const leer = () =>
      setMedidas(
        [...document.querySelectorAll<HTMLElement>("[data-lockup]")].map((el) => {
          const r = el.getBoundingClientRect();
          const corte = el.dataset.corte === "activo" ? ` · corte ${el.style.getPropertyValue("--corte")}` : "";
          return `${el.dataset.escala}: ${Math.round(r.width)}×${Math.round(r.height)} px${corte}`;
        }),
      );
    document.fonts.ready.then(leer);
    const ro = new ResizeObserver(leer);
    document.querySelectorAll("[data-lockup]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div className="lab-controles">
      <label className="lab-deslizador">
        <span className="ceja">Apertura del corte (XL, ≥ 1024 px y sin movimiento reducido)</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={apertura}
          onChange={(e) => setApertura(Number(e.target.value))}
          data-lab="apertura"
        />
        <span className="dot dot--s" data-dot>
          {apertura.toFixed(2)}
        </span>
      </label>
      <ul className="micro" data-lab="medidas" aria-label="Medidas del lockup leídas del DOM">
        {medidas.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
