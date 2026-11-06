import { setActiveSection } from "./activeSection";

/**
 * Ir a una sección del home desde una pill, el dock o un CTA (`6.5`): baja a
 * ella (suave salvo reduced-motion), **lleva el foco** a la sección (con
 * `tabindex="-1"`, sin volver a desplazar) y deja el `#ancla` en la URL. Sin
 * JS, el `href="#id"` hace lo mismo menos el foco.
 */
export function irASeccion(ev: { preventDefault(): void } | null, id: string): void {
  const destino = document.getElementById(id);
  if (!destino) return;
  ev?.preventDefault();
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  destino.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" });
  if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
  destino.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
  setActiveSection(id);
}
