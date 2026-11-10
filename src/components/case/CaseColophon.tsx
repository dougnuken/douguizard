"use client";

import { renderBold } from "@/lib/renderBold";
import { FadeIn } from "./primitives";
import { useDict } from "@/i18n/LocaleProvider";

export interface CaseColophonProps {
  technologies?: string[];
  /** Los destinos del caso (`links`, o `externalLink` si no hay lista): salen de la ficha y viven aquí. */
  links?: { label: string; href: string }[];
  credits?: string;
  enHoja?: boolean;
  tone?: unknown;
}

/**
 * Colofón (02 §5.3, punto 11): herramientas, enlaces y autoría en tres
 * columnas. Es el `<footer>` del caso en la página completa y un `<div>` en la
 * hoja, donde el documento de debajo ya tiene su pie (§1.2).
 */
export default function CaseColophon({ technologies, links, credits }: CaseColophonProps) {
  const t = useDict().case;
  // P2-7 (F7 P2-5): el colofón ya no es el pie ni lleva el ©: la página completa
  // cierra con el pie B del sitio (`SiteFooter`), debajo de «Siguiente caso».
  return (
    <div className="bloque" data-colofon="">
      <FadeIn className="colofon-caso">
        {technologies && technologies.length > 0 && (
          <div>
            <h2>{t.tools}</h2>
            <ul className="chips">
              {technologies.map((x) => (
                <li key={x} className="chip chip--losa">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        )}
        {links && links.length > 0 && (
          <div>
            <h2>{t.links}</h2>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <a className="enlace-texto" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                    <span aria-hidden="true">&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {credits && (
          <div>
            <h2>{t.authorship}</h2>
            <p className="apoyo">{renderBold(credits)}</p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
