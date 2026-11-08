"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * «Leído» (04 §6.3): una comodidad por visitante. `RegistrarLeido` lo escribe
 * al abrir un caso; `MarcaLeido` lo muestra en su losa de `/work`. Todo en
 * `try/catch`: sin almacenamiento (privado, bloqueado) simplemente no aparece.
 */
const clave = (slug: string) => `leido:${slug}`;

function leer(slug: string): boolean {
  try {
    return window.localStorage.getItem(clave(slug)) === "1";
  } catch {
    return false;
  }
}

const sinSuscripcion = () => () => {};

export function MarcaLeido({ slug, texto }: { slug: string; texto: string }) {
  const leido = useSyncExternalStore(
    sinSuscripcion,
    () => leer(slug),
    () => false,
  );
  if (!leido) return null;
  return (
    <span className="leido" data-leido={slug}>
      {texto}
    </span>
  );
}

export function RegistrarLeido({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(clave(slug), "1");
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  }, [slug]);
  return null;
}
