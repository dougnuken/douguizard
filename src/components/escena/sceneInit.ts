/** La consulta del acto 1 «cine»: escritorio y con movimiento (y con JS: es un script). */
export const CONSULTA_CINE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Script en línea (07 F5 · `sceneInit`): antes del primer pintado, solo en el
 * home (lo monta `Escena`, que solo vive en `/` y `/en`), a ≥ 1024 px y sin
 * movimiento reducido, marca `html.cine` (la foto a pantalla completa, p = 0)
 * y deja el rail `inert` (P0-3 de B: invisible en el acto 1, fuera del Tab).
 * Sin JS, en móvil o con RM no se marca: el OS de F3 desde el primer píxel.
 * `<html>` ya tolera atributos de scripts (`suppressHydrationWarning`).
 */
export const SCENE_INIT = `try{if(matchMedia(${JSON.stringify(CONSULTA_CINE)}).matches){document.documentElement.classList.add("cine");var r=document.querySelector(".rail-acciones");if(r)r.inert=true}}catch(e){}`;
