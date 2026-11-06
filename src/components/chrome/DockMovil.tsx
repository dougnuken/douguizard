"use client";

import "./chrome.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icono, type NombreIcono } from "@/components/sistema/Iconos";
import { localePath, splitLocale } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { getActiveSection, getServerActiveSection, subscribeActiveSection } from "@/lib/activeSection";
import { irASeccion } from "@/lib/irASeccion";

type Destino = { clave: "trabajo" | "perfil" | "experiencia" | "cv" | "contacto"; icono: NombreIcono; seccion?: string; ruta: string };

/** 5 destinos (6 nov, NOTAS §1): Trabajo · Perfil · Experiencia · CV · Contacto. */
const DESTINOS: Destino[] = [
  { clave: "trabajo", icono: "trabajo", seccion: "work", ruta: "/work" },
  { clave: "perfil", icono: "perfil", seccion: "about", ruta: "/about" },
  { clave: "experiencia", icono: "experiencia", seccion: "experience", ruta: "/experience" },
  { clave: "cv", icono: "cv", ruta: "/cv" },
  { clave: "contacto", icono: "contacto", seccion: "contact", ruta: "/#contact" },
];

/**
 * Dock móvil (< 1024). En el home sus destinos son las secciones (anclas, con
 * el scroll-spy de la cabecera) y aparece al salir del héroe; en las páginas B,
 * rutas con `aria-current="page"` en la propia, visible desde el inicio.
 * Mientras está escondido es `inert` (ni foco ni lector). Sin JS se ve siempre
 * (`@media (scripting: none)` en `chrome.css`).
 */
export default function DockMovil() {
  const locale = useLocale();
  const t = useDict().dock;
  const { path } = splitLocale(usePathname() || "/");
  const isHome = path === "/";
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, getServerActiveSection);
  const [arriba, setArriba] = useState(true);
  const escondido = isHome && arriba;

  useEffect(() => {
    if (!isHome) return;
    // «Salir del héroe»: la foto a sangre del móvil mide un viewport.
    const medir = () => setArriba(window.scrollY < window.innerHeight * 0.6);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [isHome]);

  return (
    <nav className="dock" aria-label={t.label} data-escondido={escondido ? "" : undefined} inert={escondido || undefined}>
      {DESTINOS.map((d) => {
        const contenido = (
          <>
            <Icono nombre={d.icono} />
            <span>{t[d.clave]}</span>
          </>
        );
        if (isHome && d.seccion) {
          return (
            <a
              key={d.clave}
              href={`#${d.seccion}`}
              aria-current={active === d.seccion ? "true" : undefined}
              onClick={(ev) => irASeccion(ev, d.seccion!)}
            >
              {contenido}
            </a>
          );
        }
        const actual = d.ruta === "/cv" ? path === "/cv" : path === d.ruta;
        return (
          <Link key={d.clave} href={localePath(locale, d.ruta)} aria-current={actual ? "page" : undefined}>
            {contenido}
          </Link>
        );
      })}
    </nav>
  );
}
