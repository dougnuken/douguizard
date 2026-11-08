/**
 * A module-scope store for the id of the home panel currently in view.
 *
 * `SectionIndex` computes it; `SiteHeader` reads it with `useSyncExternalStore`
 * to mark its own links. A store rather than context because the horizontal
 * shell is not a provider and the header lives outside it, in the layout.
 */
type Listener = (id: string) => void;

const listeners = new Set<Listener>();
let active = "home";

export function getActiveSection(): string {
  return active;
}

/** Server snapshot: the first panel, so SSR and hydration agree. */
export function getServerActiveSection(): string {
  return "home";
}

export function setActiveSection(id: string): void {
  if (id === active) return;
  active = id;
  for (const listener of listeners) listener(id);
}

export function subscribeActiveSection(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Mientras un `irASeccion` baja en suave hasta su destino, el scroll-spy no
 * escribe: la selección (que se desliza, 09-MOTION-CONTROLES) va directa al
 * destino en vez de ir y volver por las secciones intermedias. Se suelta con
 * `scrollend` (o a los 1,5 s si el navegador no lo emite) y el espía mide otra vez.
 */
let fijadaHasta = 0;
let turno = 0;
export function fijarSeccionDuranteScroll(): void {
  if (typeof window === "undefined") return;
  fijadaHasta = performance.now() + 1500;
  const mio = ++turno;
  const soltar = () => {
    window.removeEventListener("scrollend", soltar);
    if (mio !== turno || !fijadaHasta) return;
    fijadaHasta = 0;
    // El espía escucha `scroll`: una medida más, ya con el scroll quieto.
    window.dispatchEvent(new Event("scroll"));
  };
  window.addEventListener("scrollend", soltar);
  window.setTimeout(soltar, 1500);
}
export function seccionFijada(): boolean {
  return fijadaHasta > 0 && performance.now() < fijadaHasta;
}
