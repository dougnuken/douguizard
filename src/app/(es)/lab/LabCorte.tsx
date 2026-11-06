"use client";

import { useEffect, useState } from "react";
import { fijarCorte } from "@/lib/corte";

/**
 * Solo el lab: un control de rango 0–1 que escribe la apertura del corte del XL
 * (`--desp` y `--rendija` vía `fijarCorte`), y la caja de cada `[data-lockup]`
 * leída del DOM (lo que medirá el FLIP). El rango no toca nada hasta que se
 * mueve: la entrada única del lockup corre sola.
 */
export default function LabCorte() {
  const [apertura, setApertura] = useState(1);
  const [medidas, setMedidas] = useState<string[]>([]);

  useEffect(() => {
    const leer = () =>
      setMedidas(
        [...document.querySelectorAll<HTMLElement>("[data-lockup]")].map((el) => {
          const r = el.getBoundingClientRect();
          // El halo del láser de la escena se apaga sobre la caja del nombre.
          const escena = el.closest<HTMLElement>(".lab-escena");
          if (escena) escena.style.setProperty("--fin-nombre", `${r.right - escena.getBoundingClientRect().left}px`);
          const corte = el.style.getPropertyValue("--corte");
          return `${el.dataset.escala}: ${Math.round(r.width)}×${Math.round(r.height)} px${corte ? ` · corte ${parseFloat(corte).toFixed(1)} px` : ""}`;
        }),
      );
    document.fonts.ready.then(leer);
    const ro = new ResizeObserver(leer);
    document.querySelectorAll("[data-lockup]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const mover = (valor: number) => {
    setApertura(valor);
    const xl = document.querySelector<HTMLElement>('[data-lockup][data-escala="xl"][data-corte-isla]');
    if (xl) fijarCorte(xl, valor);
  };

  return (
    <div className="lab-controles">
      <label className="lab-deslizador">
        <span className="ceja">Apertura del corte (solo ≥ 1024 px y sin movimiento reducido)</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={apertura}
          onChange={(e) => mover(Number(e.target.value))}
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
