"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { localeName, localePath, otherLocale, splitLocale, type Locale } from "@/i18n/config";
import { useDict, useIsLost, useLocale } from "@/i18n/LocaleProvider";
import {
  getActiveSection,
  getServerActiveSection,
  subscribeActiveSection,
} from "@/lib/activeSection";

const CODE: Record<Locale, string> = { es: "ES", en: "EN" };

/** El `#hash` actual fuera del home (p. ej. `/about#craft`); vacío en el servidor. */
function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}
const getHash = () => window.location.hash;
const getServerHash = () => "";

/**
 * Dónde vive la misma página en el otro idioma, **con su ancla** (04 §4.3,
 * 02 §7.3): en el home, la sección en la que está el lector (`activeSection`,
 * la escribe el scroll-spy de la cabecera); fuera, el `#hash` de la URL. Los
 * ids de sección son los mismos en los dos idiomas (`home.secciones`).
 */
function useCounterpart(): { to: Locale; href: string } {
  const locale = useLocale();
  const pathname = usePathname();
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, getServerActiveSection);
  const urlHash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const lost = useIsLost();
  const { path } = splitLocale(pathname || "/");
  const to = otherLocale(locale);
  // Una dirección que no existe tampoco tiene gemela: el switch del 404 va al inicio.
  if (lost) return { to, href: localePath(to, "/") };
  const hash = path === "/" ? (active && active !== "home" ? `#${active}` : "") : urlHash;
  return { to, href: `${localePath(to, path)}${hash}` };
}

/**
 * El switch de idioma de la cabecera B: segmento ES · EN siempre visible
 * (04 §4.3), 44 × 44 por opción con el relleno recortado al contenido.
 *
 * `<a>` y nunca `<Link>`: cada idioma es su propio root layout con su `<html
 * lang>`, así que cruzar es una carga completa por definición, y un enlace real
 * es lo que sigue un rastreador. El idioma actual va marcado y no es enlace.
 */
export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useDict();
  const { href } = useCounterpart();
  return (
    <div role="group" aria-label={t.sistema.idioma.label} className={`idioma ${className}`}>
      {(["es", "en"] as const).map((l) =>
        l === locale ? (
          <span key={l} aria-current="true" className="idioma-op">
            <span aria-hidden="true">{CODE[l]}</span>
            <span className="sr-only">{localeName[l]}</span>
          </span>
        ) : (
          <a key={l} href={href} hrefLang={l} lang={l} title={t.sistema.idioma.leerEnOtro} className="idioma-op">
            <span aria-hidden="true">{CODE[l]}</span>
            <span className="sr-only">{localeName[l]}</span>
          </a>
        ),
      )}
    </div>
  );
}

/** La fila del menú: el mismo destino, escrito entero. */
export function LanguageMenuLink({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useDict();
  const { to, href } = useCounterpart();
  return (
    <a href={href} hrefLang={to} lang={to} onClick={onNavigate} className={className}>
      {t.header.switchTo}
    </a>
  );
}
