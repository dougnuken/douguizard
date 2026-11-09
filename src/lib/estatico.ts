/**
 * P2-6 (06-CRITICA-FINAL): `?estatico` en la URL apaga los revelados al scroll
 * para que una captura de página entera (Behance, herramientas que no hacen
 * scroll) vea todo el contenido. No cambia nada para quien navega sin el
 * parámetro. Marca `html[data-estatico]` para que el CSS también lo respete.
 */
export function esEstatico(): boolean {
  if (typeof window === "undefined") return false;
  const si = new URLSearchParams(window.location.search).has("estatico");
  if (si) document.documentElement.dataset.estatico = "";
  return si;
}
