/**
 * El `#ancla` de un enlace a otra página sobrevive a la navegación dura de
 * respaldo de Next (pulido G, tarea del dock).
 *
 * Cuando la navegación en el cliente no puede aplicarse (el RSC de la página
 * nueva trae otro `buildId`: pestaña abierta antes de un despliegue, o un
 * `next start` de una compilación anterior), Next cae a una navegación dura a
 * la URL **de la respuesta**, que no lleva el hash: «Contacto» del dock en
 * /about acababa en `/` arriba del todo, sin `#contact`. Al pulsar un enlace
 * con ancla hacia otra ruta se guarda el destino (`sessionStorage`, unos
 * segundos); si la página llega sin hash, se restaura la URL y se salta a la
 * sección. Si llega con hash (lo normal), solo se borra la nota.
 */

const CLAVE = "ancla-pendiente";
const VIGENCIA_MS = 10_000;

type Nota = { ruta: string; id: string; t: number };

const leer = (): Nota | null => {
  try {
    const crudo = sessionStorage.getItem(CLAVE);
    sessionStorage.removeItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Nota) : null;
  } catch {
    return null;
  }
};

/** Apunta el ancla de `href` si lleva a otra ruta de este origen. */
export function recordarAncla(href: string): void {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !url.hash || url.pathname === window.location.pathname) return;
    const nota: Nota = { ruta: url.pathname, id: decodeURIComponent(url.hash.slice(1)), t: Date.now() };
    sessionStorage.setItem(CLAVE, JSON.stringify(nota));
  } catch {
    /* sin almacenamiento: queda el comportamiento de Next */
  }
}

/**
 * Al montar una ruta: si llegó sin hash pero había una nota reciente para ella,
 * restaura `#id` en la URL (sin entrada de historial) y salta a la sección.
 * Devuelve el id restaurado, o `null`.
 */
export function restaurarAnclaPendiente(): string | null {
  const nota = leer();
  if (!nota || window.location.hash) return null;
  if (nota.ruta !== window.location.pathname || Date.now() - nota.t > VIGENCIA_MS) return null;
  const destino = document.getElementById(nota.id);
  if (!destino) return null;
  history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}#${encodeURIComponent(nota.id)}`);
  destino.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
  return nota.id;
}

/** Escucha (en captura, antes que el `onClick` de `next/link`) los clics simples en enlaces con ancla. */
export function vigilarAnclas(): () => void {
  const alClic = (ev: MouseEvent) => {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    const a = (ev.target as Element | null)?.closest?.("a[href*='#']");
    if (a instanceof HTMLAnchorElement && (!a.target || a.target === "_self")) recordarAncla(a.href);
  };
  document.addEventListener("click", alClic, true);
  return () => document.removeEventListener("click", alClic, true);
}
