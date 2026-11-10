"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { localePath } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { devolverFoco, guardarOrigen, olvidarOrigen } from "./origen";
import { useArrastreHoja } from "./useArrastreHoja";
import { Icono } from "@/components/sistema/Iconos";
import { EVENTO_SECCIONES_HOJA } from "@/components/case/eventos";
import { prefiereQuieto } from "@/lib/movimiento";

type Estado = "entrando" | "abierta" | "cerrando";

const SELECTOR_FOCO =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"]), video[controls]';

/**
 * La hoja de B (F6, 07 §1.2): el caso sube sobre la página con su URL real.
 *
 * La pinta el slot `@modal` cuando la navegación a `/work/[slug]` es blanda;
 * la carga directa o la recarga dan la página completa (el slot cae en
 * `default.tsx`). Es un `<dialog>` modal: `showModal()` deja inerte lo de
 * debajo, el foco empieza en el cuerpo (↓, AvPág y Espacio leen el caso; APG
 * para diálogos con mucho contenido), Cerrar es la primera parada de Tab y Tab no sale (trampa propia además de la
 * del navegador, que en Chromium deja escapar a la barra de direcciones).
 *
 * Cerrar (X, Esc, velo, arrastre) anima la salida y hace `router.back()`; Atrás
 * del navegador la quita sin animación (aceptado en el plan). Se auto-oculta
 * si la URL deja de ser la del caso: el slot puede quedar «rancio» tras una
 * navegación blanda a otra ruta (no hay catch-all, para no romper los 404).
 */
export default function CaseSheet({
  slug,
  proyecto,
  tituloId,
  children,
}: {
  slug: string;
  proyecto: string;
  tituloId: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  const dict = useDict();
  const t = dict.hoja;
  const ruta = localePath(locale, `/work/${slug}`);
  const pathname = usePathname();
  const activa = pathname === ruta;
  if (!activa) return null;
  return (
    <Dialogo slug={slug} ruta={ruta} proyecto={proyecto} tituloId={tituloId} t={t} trabajo={dict.dock.trabajo} secciones={dict.dock.secciones}>
      {children}
    </Dialogo>
  );
}

function Dialogo({
  slug,
  ruta,
  proyecto,
  tituloId,
  t,
  trabajo,
  secciones,
  children,
}: {
  slug: string;
  ruta: string;
  proyecto: string;
  tituloId: string;
  t: { cerrar: string; verCompleta: string; progreso: string };
  trabajo: string;
  secciones: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cab = useRef<HTMLDivElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const [estado, setEstado] = useState<Estado>("entrando");
  const cerrando = useRef(false);

  // Abrir: el origen del foco se guarda antes de `showModal()` (que mueve el foco).
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    guardarOrigen(ruta);
    if (!d.open) d.showModal();
    // «Siguiente» reemplaza el caso en la misma hoja: se empieza arriba.
    if (cuerpo.current) cuerpo.current.scrollTop = 0;
    // El foco va al cuerpo que se desplaza, no a Cerrar: así ↓, AvPág y
    // Espacio leen el caso (en un botón, Espacio lo activaría y cerraría).
    cuerpo.current?.focus({ preventScroll: true });
    // Dos cuadros: el primero pinta la hoja abajo, el segundo dispara la transición.
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setEstado("abierta"));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      if (d.open) d.close();
      // Desmontar = la URL dejó de ser la del caso. Si se volvió atrás (o se
      // cambió de caso con «Siguiente»), el foco vuelve a la card de origen;
      // `devolverFoco` no hace nada si el origen ya no está en el documento.
      devolverFoco();
    };
  }, [ruta]);

  const cerrar = useCallback(() => {
    if (cerrando.current) return;
    cerrando.current = true;
    setEstado("cerrando");
    const rm = prefiereQuieto();
    window.setTimeout(() => router.back(), rm ? 150 : 280);
  }, [router]);

  useArrastreHoja(cab, panel, cerrar);

  // Esc: el `cancel` nativo cerraría el dialog sin animación ni historial.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const cancel = (e: Event) => {
      e.preventDefault();
      cerrar();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      // «Secciones» (móvil) es un dialog modal propio dentro de la hoja: su foco lo atrapa el navegador.
      if ((e.target as Element | null)?.closest?.("dialog.secciones")) return;
      const focos = Array.from(d.querySelectorAll<HTMLElement>(SELECTOR_FOCO)).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );
      if (focos.length === 0) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      const activo = document.activeElement;
      // Desde el cuerpo (foco inicial), el primer Tab va a Cerrar.
      if (!e.shiftKey && activo === cuerpo.current && botonCerrar.current) {
        e.preventDefault();
        botonCerrar.current.focus();
        return;
      }
      if (e.shiftKey && (activo === primero || !d.contains(activo))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (activo === ultimo || !d.contains(activo))) {
        e.preventDefault();
        primero.focus();
      }
    };
    d.addEventListener("cancel", cancel);
    d.addEventListener("keydown", tecla);
    return () => {
      d.removeEventListener("cancel", cancel);
      d.removeEventListener("keydown", tecla);
    };
  }, [cerrar]);

  // Progreso de lectura: la línea láser de la cabecera, en `--p` (0…1).
  useEffect(() => {
    const c = cuerpo.current;
    const p = panel.current;
    if (!c || !p) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const max = c.scrollHeight - c.clientHeight;
      p.style.setProperty("--p", max > 0 ? (c.scrollTop / max).toFixed(4) : "0");
    };
    const alDesplazar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    c.addEventListener("scroll", alDesplazar, { passive: true });
    medir();
    return () => {
      c.removeEventListener("scroll", alDesplazar);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <dialog ref={dialogo} className="hoja" aria-labelledby={tituloId} data-estado={estado} data-slug={slug}>
      <div className="hoja-velo" onClick={cerrar} aria-hidden="true" />
      <div ref={panel} className="hoja-panel">
        <div ref={cab} className="hoja-cab">
          <span className="hoja-asa" aria-hidden="true" />
          <p className="hoja-miga">
            {/* Navegación blanda a `/work`: el slot queda rancio y la hoja se
                auto-oculta por `pathname` (07 §1.2, punto 6). */}
            <Link href={localePath(locale, "/work")} onClick={olvidarOrigen}>
              {trabajo}
            </Link>
            <span aria-hidden="true">/</span>
            <b translate="no">{proyecto}</b>
          </p>
          <div className="hoja-acciones">
            {/* P2-7 (F7 P2-4): «Secciones» (< 1024) va en la cabecera, no flotando sobre el texto. */}
            <button
              type="button"
              className="hoja-secciones"
              aria-haspopup="dialog"
              aria-label={secciones}
              title={secciones}
              onClick={() => window.dispatchEvent(new Event(EVENTO_SECCIONES_HOJA))}
            >
              <Icono nombre="secciones" />
            </button>
            {/* Documento, no `<Link>`: la página completa, sin hoja encima. */}
            <a className="hoja-circulo" href={ruta} aria-label={t.verCompleta} title={t.verCompleta}>
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M11.5 4H16v4.5M16 4l-5 5M8.5 16H4v-4.5M4 16l5-5" />
              </svg>
            </a>
            <button
              ref={botonCerrar}
              type="button"
              className="hoja-circulo"
              onClick={cerrar}
              aria-label={t.cerrar}
              title={t.cerrar}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
          <span className="hoja-progreso" aria-hidden="true" />
        </div>
        <div ref={cuerpo} className="hoja-cuerpo" tabIndex={-1}>
          {children}
        </div>
      </div>
    </dialog>
  );
}
