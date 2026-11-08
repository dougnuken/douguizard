/** La consulta del acto 1 «cine»: escritorio y con movimiento (y con JS: es un script). */
export const CONSULTA_CINE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Red de seguridad: si a los 8 s del primer pintado ningún JS de escena tomó el
 * control (la isla o GSAP no llegaron), el acto 1 se retira solo y queda el OS.
 */
export const RED_MS = 8000;

/**
 * Script en línea (07 F5 · `sceneInit`): antes del primer pintado, solo en el
 * home (lo monta `Escena`, que solo vive en `/` y `/en`), a ≥ 1024 px y sin
 * movimiento reducido, marca `html.cine` (la foto a pantalla completa, p = 0)
 * y deja el rail `inert` (P0-3 de B: invisible en el acto 1, fuera del Tab).
 * Sin JS, en móvil o con RM no se marca: el OS de F3 desde el primer píxel.
 * Con la red de seguridad (`RED_MS`) marca `data-escena-retirada`.
 * `<html>` ya tolera atributos de scripts (`suppressHydrationWarning`).
 */
export const SCENE_INIT = `try{if(matchMedia(${JSON.stringify(CONSULTA_CINE)}).matches){var d=document.documentElement,r=document.querySelector(".rail-acciones");d.classList.add("cine");if(r)r.inert=true;setTimeout(function(){if(!d.dataset.escenaFase&&d.classList.contains("cine")){d.classList.remove("cine");d.dataset.escenaRetirada="";if(r)r.inert=false}},${RED_MS})}}catch(e){}`;
