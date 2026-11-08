"use client";

import Link from "next/link";
import { useState } from "react";
import { Icono } from "@/components/sistema/Iconos";

export interface Cita {
  oracion: string;
  firma: string;
  enlace: { href: string; texto: string };
}

/**
 * K15 · Testimonio con rotación **manual** (sin autoplay, 02 §5.5): una oración
 * literal de cada cita, `lang="en"`, con su firma y el enlace al caso. La región
 * es un carrusel (`aria-roledescription`) y el cambio se anuncia (`aria-live`).
 */
export default function CardTestimonio({
  citas,
  textos,
}: {
  citas: Cita[];
  textos: { ceja: string; region: string; anterior: string; siguiente: string; marcaIdioma: string; contador: string[]; rol: string };
}) {
  const [i, setI] = useState(0);
  const c = citas[i];
  const ir = (d: number) => setI((i + d + citas.length) % citas.length);
  return (
    <section className="losa losa--clara tarjeta k15" aria-roledescription={textos.rol} aria-label={textos.region}>
      <p className="ceja">{textos.ceja}</p>
      <div aria-live="polite" className="k15-cita">
        <blockquote lang="en">{c.oracion}</blockquote>
        <p className="firma">
          <span>{c.firma}</span>
          <br />
          <Link href={c.enlace.href}>{c.enlace.texto}</Link>
          {textos.marcaIdioma && <span> · {textos.marcaIdioma}</span>}
        </p>
      </div>
      <div className="k15-ctrl">
        <span className="contador">{textos.contador[i]}</span>
        <div className="botones">
          <button type="button" className="circulo circulo--tinta" aria-label={textos.anterior} onClick={() => ir(-1)}>
            <Icono nombre="izq" />
          </button>
          <button type="button" className="circulo circulo--tinta" aria-label={textos.siguiente} onClick={() => ir(1)}>
            <Icono nombre="der" />
          </button>
        </div>
      </div>
    </section>
  );
}
