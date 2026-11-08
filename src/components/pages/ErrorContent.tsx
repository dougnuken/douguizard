"use client";

import "./paginas-b.css";
import "@/components/sistema/sistema.css";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

/**
 * F8 · Lo que se ve si una ruta falla al pintar (`error.tsx`): el mismo lienzo
 * del 404 B, sin detalles técnicos, con «Intentar de nuevo» (vuelve a pintar
 * el segmento) y la salida al inicio. El `digest` solo va al registro.
 */
export default function ErrorContent({
  locale,
  reset,
}: {
  locale: Locale;
  reset: () => void;
}) {
  const t = getDict(locale).error;
  return (
    <main id="main" tabIndex={-1} className="pagina-b min-h-svh" data-error="">
      <div className="resplandor" aria-hidden="true" />
      <div className="pagina">
        <div className="contenido flex min-h-[calc(100svh-var(--cabecera)-96px)] max-w-[900px] flex-col justify-center">
          <p className="ceja">{t.kicker}</p>
          <h1 className="t-pagina mt-4">{t.title}</h1>
          <p className="lead mt-6">{t.body}</p>
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              type="button"
              className="boton boton--blanco"
              onClick={reset}
            >
              {t.retry}
            </button>
            <a className="boton boton--linea" href={localePath(locale, "/")}>
              {t.home}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
