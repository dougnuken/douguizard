/**
 * El enlace que abrió la hoja, para devolverle el foco al cerrar (F6, 07 §1.2).
 *
 * Se guarda al abrir, no en el `onClick` de cada card: las cards son de
 * servidor (`BentoCard`, `CardArchivo`, `Trayectoria`…) y convertirlas en
 * cliente solo para esto añadiría JS al home. Al montar la hoja, el foco sigue
 * en el enlace pulsado (Chromium y Firefox enfocan el `<a>` al hacer clic; con
 * teclado siempre). Si no lo está (Safari no enfoca enlaces con el ratón), se
 * busca en la página el primer enlace visible a ese caso.
 *
 * «Siguiente» dentro de la hoja reemplaza el caso; el origen no cambia: Cerrar
 * vuelve al tablero y a la card con la que se entró.
 */
let origen: HTMLElement | null = null;

export function guardarOrigen(ruta: string) {
  const activo = document.activeElement as HTMLElement | null;
  if (activo && activo !== document.body && !activo.closest("dialog.hoja")) {
    origen = activo;
    return;
  }
  if (origen?.isConnected) return;
  origen =
    Array.from(document.querySelectorAll<HTMLAnchorElement>(`#main a[href="${ruta}"]`)).find(
      (a) => a.getClientRects().length > 0,
    ) ?? null;
}

export function devolverFoco() {
  const el = origen;
  if (el?.isConnected) el.focus({ preventScroll: true });
}

/** Al salir de la hoja a otra ruta (no de vuelta al origen): se olvida. */
export function olvidarOrigen() {
  origen = null;
}
