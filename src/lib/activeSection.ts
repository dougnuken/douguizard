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
