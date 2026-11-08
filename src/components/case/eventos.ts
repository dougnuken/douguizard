/**
 * Lo dispara «Secciones» del dock en la página completa del caso (< 1024) y lo
 * escucha `HojaSecciones`. Vive aparte para que el dock (que viaja con el home)
 * no arrastre el módulo de la lista.
 */
export const EVENTO_SECCIONES = "caso:secciones";

/** «Secciones» de la cabecera de la hoja del caso (< 1024, P2-7): lo escucha la `HojaSecciones` de la hoja. */
export const EVENTO_SECCIONES_HOJA = "caso:secciones-hoja";
