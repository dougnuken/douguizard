"use client";

import "./chrome.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { IconoDock, type NombreIconoDock } from "./IconosDock";
import { localePath, splitLocale } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { getActiveSection, getServerActiveSection, setActiveSection, subscribeActiveSection } from "@/lib/activeSection";
import { irASeccion } from "@/lib/irASeccion";
import { EVENTO_SECCIONES } from "@/components/case/eventos";
import { usePildora } from "@/components/sistema/usePildora";
import Pildora from "@/components/sistema/Pildora";
import { esClicSimple } from "@/lib/clicSimple";

type Destino = { clave: "trabajo" | "perfil" | "experiencia" | "cv" | "contacto"; icono: NombreIconoDock; seccion?: string; ruta: string };

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
  // En la página de un caso, «Contacto» deja su sitio a «Secciones» (07 F7):
  // abre la lista de secciones del caso (`HojaSecciones`).
  const enCaso = /^\/work\/[^/]+$/.test(path);
  // La selección se desliza entre destinos, también al cambiar de ruta (cada
  // página monta su dock: la memoria de la píldora vive en el módulo).
  const navRef = useRef<HTMLElement>(null);
  const mover = usePildora(navRef, "dock", `${path}|${isHome ? active : ""}`);

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
    <nav ref={navRef} className="dock" aria-label={t.label} data-escondido={escondido ? "" : undefined} inert={escondido || undefined}>
      <Pildora />
      {DESTINOS.map((d) => {
        if (enCaso && d.clave === "contacto") {
          return (
            <button
              key="secciones"
              type="button"
              aria-haspopup="dialog"
              data-secciones=""
              onClick={() => window.dispatchEvent(new Event(EVENTO_SECCIONES))}
            >
              <IconoDock nombre="secciones" />
              <span>{t.secciones}</span>
            </button>
          );
        }
        const contenido = (
          <>
            <IconoDock nombre={d.icono} />
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
        // P2-2: en la página de un caso, «Trabajo» sigue marcado (es su sección,
        // no la página: `true`, no `page`).
        const seccion = enCaso && d.clave === "trabajo";
        return (
          <Link
            key={d.clave}
            href={localePath(locale, d.ruta)}
            aria-current={actual ? "page" : seccion ? "true" : undefined}
            onClick={(ev) => {
              if (!esClicSimple(ev)) return;
              mover(ev.currentTarget);
              // Pulido E: «Contacto» desde una página B lleva a `/#contact`; el
              // dock del home nace ya con el destino marcado (sin fotograma vacío).
              if (d.ruta.startsWith("/#") && d.seccion) setActiveSection(d.seccion);
            }}
          >
            {contenido}
          </Link>
        );
      })}
    </nav>
  );
}
