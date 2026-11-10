"use client";

import "./chrome.css";
// G1: prefetch tras la primera interacción (ver LinkDiferido).
import Link from "@/components/sistema/LinkDiferido";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { getSite } from "@/data/site";
import { localePath, splitLocale } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { decisiones } from "@/data/decisiones";
import LanguageSwitch, { LanguageMenuLink } from "@/components/LanguageSwitch";
import {
  getActiveSection,
  getServerActiveSection,
  seccionFijada,
  setActiveSection,
  subscribeActiveSection,
} from "@/lib/activeSection";
import { irASeccion } from "@/lib/irASeccion";
import { esClicSimple } from "@/lib/clicSimple";
import { usePildora } from "@/components/sistema/usePildora";
import Pildora from "@/components/sistema/Pildora";
import Hablemos from "./Hablemos";

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
      if (seccionFijada()) return;
      const corte = window.innerHeight * 0.35;
      let id = "home";
      for (const s of secciones) if (s.getBoundingClientRect().top <= corte) id = s.dataset.seccion!;
      // 06-CRITICA-F3 P2-1: con el tablero a la vista (K3 en el pliegue), «Trabajo»
      // ya está activa; en el acto 1 del home (F5, antes de llegar al OS), ninguna.
      const html = document.documentElement;
      const enActo1 = html.classList.contains("cine") && html.dataset.escenaFase !== "os";
      // Solo en escritorio (las pills); en móvil el dock aparece al salir del héroe.
      const escritorio = window.matchMedia("(min-width: 1024px)").matches;
      if (id === "home" && escritorio && !enActo1 && secciones[0].getBoundingClientRect().top < window.innerHeight) {
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
    // Pulido E: al llegar al home desde otra página con `#ancla` (p. ej. «Contacto»
    // del dock en /about → `/#contact`), el `scroll-behavior: smooth` de `html`
    // bajaba desde el scroll heredado recorriendo Trabajo → Experiencia → Perfil
    // y el espía iba marcando cada una. Se marca el destino de inmediato y se salta
    // a él sin animación: ni viaje largo ni ida y vuelta de la selección.
    const ancla = decodeURIComponent(window.location.hash.slice(1));
    const destino = ancla && secciones.some((s) => s.dataset.seccion === ancla) ? document.getElementById(ancla) : null;
    if (destino) {
      setActiveSection(ancla);
      destino.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }
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
  // D4: el conmutador de tema solo existe si el CV conserva el tema claro.
  const conTema = isCv && decisiones.temaClaroEn !== "ninguna";
  // La navegación en el cliente no vuelve a ejecutar el script de tema: /cv marca el <html>.
  // En la fase de layout (G4): antes de que la transición de página capture la nueva.
  useLayoutEffect(() => {
    const r = document.documentElement;
    if (isCv) r.setAttribute("data-ruta", "cv");
    else r.removeAttribute("data-ruta");
  }, [isCv]);
  const menuId = useId();
  const [open, setOpen] = useState(false);
  // La salida del panel se ve (160 ms) antes de `hidden`; inerte mientras sale.
  // Se deriva en el render (no en un efecto): así `hidden` nunca llega antes que la salida.
  const [saliendo, setSaliendo] = useState(false);
  const [abiertoAntes, setAbiertoAntes] = useState(open);
  if (abiertoAntes !== open) {
    setAbiertoAntes(open);
    setSaliendo(!open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  useEffect(() => {
    if (!saliendo) return;
    const t = window.setTimeout(() => setSaliendo(false), 160);
    return () => window.clearTimeout(t);
  }, [saliendo]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, getServerActiveSection);
  useEspiaSecciones(isHome);
  // La selección de las pills se desliza (09-MOTION-CONTROLES): la cabecera no se
  // vuelve a montar entre rutas; cambia su `aria-current` y la píldora viaja.
  const pillsRef = useRef<HTMLElement>(null);
  const moverPill = usePildora(pillsRef, "pills", `${path}|${isHome ? active : ""}`);

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

  const pinta = (
    e: (typeof enlaces)[number],
    clase: string,
    alNavegar?: () => void,
    adelantar?: (el: HTMLElement) => void,
  ) =>
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
      <Link
        key={e.clave}
        href={e.href}
        className={clase}
        aria-current={e.actual}
        onClick={(ev) => {
          // Respuesta al pulsar: la píldora sale antes de que llegue la ruta.
          if (adelantar && esClicSimple(ev)) adelantar(ev.currentTarget);
          alNavegar?.();
        }}
      >
        {e.texto}
      </Link>
    );

  return (
    <header className="site-header cab-b">
      <div className="cab-marca">{marca}</div>

      <nav ref={pillsRef} aria-label={s.label} className="cab-pills">
        <Pildora />
        {enlaces.map((e) => pinta(e, "pill", undefined, moverPill))}
      </nav>

      <div className="cab-acciones">
        {conTema && <ThemeToggle />}
        <LanguageSwitch />
        <Hablemos href={isHome ? "#contact" : contacto} onClick={(ev) => isHome && irASeccion(ev, "contact")}>
          {s.hablemos}
        </Hablemos>
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

      <nav id={menuId} data-menu="" aria-label={t.header.menu} hidden={!open && !saliendo}
        inert={saliendo || undefined}
        data-saliendo={saliendo ? "" : undefined}
        className="cab-menu-panel"
      >
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
          {conTema && (
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
