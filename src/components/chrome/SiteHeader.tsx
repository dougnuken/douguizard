"use client";

import "./chrome.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { getSite } from "@/data/site";
import { localePath, splitLocale } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitch, { LanguageMenuLink } from "@/components/LanguageSwitch";
import {
  getActiveSection,
  getServerActiveSection,
  setActiveSection,
  subscribeActiveSection,
} from "@/lib/activeSection";
import { irASeccion } from "@/lib/irASeccion";

/** Pills de la pastilla (04 §4.1). En el home, anclas con scroll-spy; fuera, rutas. */
const PILLS = [
  { clave: "trabajo", seccion: "work", ruta: "/work" },
  { clave: "perfil", seccion: "about", ruta: "/about" },
  { clave: "experiencia", seccion: "experience", ruta: "/experience" },
] as const;

/**
 * Scroll-spy del home: la sección activa es la última cuyo borde superior ya
 * cruzó el 35 % del viewport; antes de la primera, «home». Es el **único** que
 * escribe `setActiveSection` (lo leen las pills, el dock y `LanguageSwitch`, que
 * así conserva el `#ancla` al cambiar de idioma: `i18n I3`).
 */
function useEspiaSecciones(activo: boolean) {
  useEffect(() => {
    if (!activo) return;
    const secciones = Array.from(document.querySelectorAll<HTMLElement>("[data-seccion]"));
    if (!secciones.length) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const corte = window.innerHeight * 0.35;
      let id = "home";
      for (const s of secciones) if (s.getBoundingClientRect().top <= corte) id = s.dataset.seccion!;
      // 06-CRITICA-F3 P2-1: con el tablero a la vista (K3 en el pliegue), «Trabajo»
      // ya está activa; en el acto 1 del home (F5, antes de llegar al OS), ninguna.
      const html = document.documentElement;
      const enActo1 = html.classList.contains("cine") && html.dataset.escenaFase !== "os";
      if (id === "home" && !enActo1 && secciones[0].getBoundingClientRect().top < window.innerHeight) {
        id = secciones[0].dataset.seccion!;
      }
      // Al fondo de la página, la última sección (contacto) aunque no llegue al corte.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        id = secciones[secciones.length - 1].dataset.seccion!;
      }
      setActiveSection(id);
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      setActiveSection("home");
    };
  }, [activo]);
}

/**
 * Cabecera B (04 §4.1, NOTAS §1): pastilla con wordmark · pills · ES/EN ·
 * «Hablemos». Las pills van centradas al viewport (P2-1 de B). A < 1024 quedan
 * el wordmark, el idioma y un botón de menú (`button[aria-expanded]` +
 * `nav[data-menu]`, que usan `I4` y `6.6`); la navegación de las páginas B la
 * lleva el dock. El conmutador de tema solo vive en `/cv` (D4).
 */
export default function SiteHeader({ marca }: { marca: React.ReactNode }) {
  const locale = useLocale();
  const t = useDict();
  const s = t.sistema.nav;
  const site = getSite(locale);
  const pathname = usePathname();
  const { path } = splitLocale(pathname || "/");
  const isHome = path === "/";
  const isCv = path === "/cv" || path.startsWith("/cv/");
  // La navegación en el cliente no vuelve a ejecutar el script de tema: /cv marca el <html>.
  useEffect(() => {
    const r = document.documentElement;
    if (isCv) r.setAttribute("data-ruta", "cv");
    else r.removeAttribute("data-ruta");
  }, [isCv]);
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, getServerActiveSection);
  useEspiaSecciones(isHome);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const contacto = localePath(locale, "/#contact");
  const enlaces = [
    ...PILLS.map((p) => ({
      clave: p.clave,
      texto: s[p.clave],
      href: isHome ? `#${p.seccion}` : localePath(locale, p.ruta),
      seccion: isHome ? p.seccion : undefined,
      actual: isHome ? (active === p.seccion ? ("true" as const) : undefined) : path === p.ruta ? ("page" as const) : undefined,
    })),
    {
      clave: "cv",
      texto: s.cv,
      href: site.cv.path,
      seccion: undefined,
      actual: isCv ? ("page" as const) : undefined,
    },
  ];

  const pinta = (e: (typeof enlaces)[number], clase: string, alNavegar?: () => void) =>
    e.seccion ? (
      <a
        key={e.clave}
        href={e.href}
        className={clase}
        aria-current={e.actual}
        onClick={(ev) => {
          alNavegar?.();
          irASeccion(ev, e.seccion!);
        }}
      >
        {e.texto}
      </a>
    ) : (
      <Link key={e.clave} href={e.href} className={clase} aria-current={e.actual} onClick={alNavegar}>
        {e.texto}
      </Link>
    );

  return (
    <header className="site-header cab-b">
      <div className="cab-marca">{marca}</div>

      <nav aria-label={s.label} className="cab-pills">
        {enlaces.map((e) => pinta(e, "pill"))}
      </nav>

      <div className="cab-acciones">
        {isCv && <ThemeToggle />}
        <LanguageSwitch />
        <a
          href={isHome ? "#contact" : contacto}
          className="boton hablemos"
          onClick={(ev) => isHome && irASeccion(ev, "contact")}
        >
          {s.hablemos}
        </a>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t.header.closeMenu : t.header.openMenu}
          onClick={() => setOpen((v) => !v)}
          className="cab-menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" data-abierto={open || undefined}>
            <path d="M4 7h12M4 13h12" />
          </svg>
        </button>
      </div>

      <nav id={menuId} data-menu="" aria-label={t.header.menu} hidden={!open} className="cab-menu-panel">
        <ul>
          {enlaces.map((e) => (
            <li key={e.clave}>{pinta(e, "cab-menu-fila", () => setOpen(false))}</li>
          ))}
          <li>
            <a href={isHome ? "#contact" : contacto} className="cab-menu-fila" onClick={(ev) => {
              setOpen(false);
              if (isHome) irASeccion(ev, "contact");
            }}>
              {s.hablemos}
            </a>
          </li>
          {isCv && (
            <li className="cab-menu-tema">
              <ThemeToggle />
            </li>
          )}
          <li>
            <LanguageMenuLink onNavigate={() => setOpen(false)} className="cab-menu-fila" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
