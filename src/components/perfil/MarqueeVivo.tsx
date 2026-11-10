"use client";

import { useEffect, useRef } from "react";

/**
 * Contenedor del marquee de «Dónde he trabajado» (pulido H, P2-6). La pista corre
 * `infinite`; fuera de la vista no tiene por qué gastar cuadros: un
 * IntersectionObserver marca `data-fuera` y el CSS pone
 * `animation-play-state: paused` (como hover y foco). Sin JS, corre siempre.
 */
export default function MarqueeVivo({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) delete el.dataset.fuera;
      else el.dataset.fuera = "";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
