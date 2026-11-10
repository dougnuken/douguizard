# 06 · Crítica del pulido G (QA visual)

Rama `claude/douguizard-portfolio-redesign-9ivnau`, sobre 2aac5e1. Skills: `better-interface` (accesibilidad, layout,
escritura, tipografía, color, UI) y `review-animations`. Build de producción (`next start`), Chromium, 390 × 844 y 1440 × 900,
DPR 2. Capturas en `pulido-G/qa/`.

**Nota: 7,5/10 antes de los arreglos · 8,5/10 después.** El vidrio con canto, la píldora líquida, ES/EN de dos círculos, la
timeline láser de «Cómo trabajo» y la transición de página tienen oficio. Lo que bajaba la nota era de coherencia de
sistema: «Hablemos» en azul relleno (lo único eléctrico relleno del sitio), su LED rojo contra el punto verde de G3, el
marquee con wordmarks más pesados que los logos y dos regresiones que la suite completa sacó (desborde de K2 a 320 y un
pulso infinito que rompía «0 animaciones en reposo»).

## Alcance revisado

| Pieza | Cómo | Resultado |
|---|---|---|
| «Hablemos» (G2) | `hablemos-antes-1440.png`, `cabecera-es-1440.png`, `hablemos-hover-1440.png`; color computado | P1-1, P1-2 (arreglados) |
| ES/EN, vidrio en cromo, dock y pastillas | `cabecera-es-1440.png`, `cromo-dock-390.png`; ES/EN en `/about` y `/en/about` | Bien: dos círculos de 32 contiguos, foco en el círculo, mismo canto en las 4 pastillas y el dock. P2-2 |
| Marquee (5 SVG + 3 wordmarks) | `datos-marcas-1440.png` (antes), `marcas-despues-1440.png`; cajas medidas por logo | P1-3 (arreglado), P2-3 |
| Ficha Datos (banderas, punto verde) | `datos-marcas-390.png`, `datos-marcas-1440.png` | Bien: punto alineado a la primera línea, banderas 16 × 12 con filo. P2-1 |
| Timeline «Cómo trabajo» (G4) | `craft-mitad-1440.png` a 1,3 s; `data-pasos` = `anima` → `listo` a 3,8 s, 0 animaciones vivas al acabar | Bien (WAAPI, solo `opacity`/`transform`/`filter`, sin CLS, RM y `?estatico` quietos). P2-4 |
| Transición de página (G4) | `/about` → `/experience` por las pills: `pag-sale`/`pag-entra` 250 ms, raíz 200 ms, cabecera sin fundir | Bien. P2-5 |
| Suite completa | ver «Arreglos y verificación» | P1-4, P1-5 (arreglados) |

## P0

Ninguno.

## P1 (todos arreglados)

| # | Hallazgo | Dónde | Arreglo |
|---|---|---|---|
| P1-1 | «Hablemos» con relleno azul `#2b56f3` y sombra azul: la única superficie eléctrica rellena del sitio (las acciones principales son blancas o tinta: `sistema.css` `.boton--blanco/--tinta`, K2 `.cta-1`) y la cabecera dejaba de ser una familia. El token permite el azul como relleno de acción (01-FUNDAMENTOS), pero B no lo usa en ningún otro sitio: no se justifica en la pieza más persistente del cromo. | `src/components/chrome/chrome.css:242` (antes `background-color: var(--electrico)` + degradado `#4d74ff→#2349dd`) | 18126af: `--vidrio-cromo` + `--vidrio-oscuro` + `--filo-vidrio` (como pills y ES/EN), `::after` con el bisel y el especular del sistema y el **canto inferior en láser** (1 px, la regla «láser solo línea»); texto blanco pleno (≥ 10:1 aun con losa blanca detrás). Hover: el vidrio se aclara y el láser echa luz abajo, sin `filter`. El anillo de metal-fx se mantiene. |
| P1-2 | El LED de «Hablemos» dice «disponible» en rojo láser, mientras G3 pasó el punto de disponible a verde (`.estado`). Dos señales para lo mismo en la misma pantalla. | `chrome.css` `.hablemos-luz` (antes `--laser-nucleo` / `--laser`) | 18126af: `--disp-nucleo` / `--disp` / `--disp-halo`. |
| P1-3 | Marquee: los wordmarks (Naowee, Aval Digital Labs, Qrvey) a 600/24 px y opacidad 1 pesaban más que los SVG (opacidad 0,9): «Aval Digital Labs» dominaba la fila. Con movimiento reducido los wordmarks bajaban a 18/16 px y los logos no. | `src/components/perfil/perfil.css:493` y `:520`, `:680` | 86744c0: 500/20 px (16 en móvil, = ×0,78 de los logos), opacidad 0,9 en el `li` para todos, sin cambio de tamaño en RM. |
| P1-4 | K2 desbordaba 5 px a 320: «Disponible para empezar de inmediato» (copy de G3) con `white-space: nowrap`. Disparador «contenido recortado a 320». | `src/components/tablero/tablero.css:199` | a164433: en K2 la disponibilidad se parte, punto alineado a la primera línea. |
| P1-5 | El punto verde latía `infinite` animando `box-shadow`: pintura en cada cuadro mientras se ve y 2 animaciones vivas en reposo en el home (rompe la regla de 0 fps de `escena.spec`). | `src/components/sistema/sistema.css:384` | a2d314d: dos latidos de 1,6 s al aparecer y quieto. |

## P2 (pendientes)

| # | Hallazgo | Dónde | Propuesta |
|---|---|---|---|
| P2-1 | La bandera sale del **índice** del idioma (`i === 0 ? "co" : "us"`): si se reordena la lista, cambia de bandera. Además, bandera ≠ idioma (convención discutible; la pidió Doug). | `src/components/perfil/Secciones.tsx:102` | Llevar `pais` en `perfil.ts` junto a cada idioma. |
| P2-2 | A 390, las pastillas de la cabecera (wordmark, ES/EN) sobre párrafos blancos grandes de /about: el texto de debajo se lee a través del vidrio y compite con «EN». | `src/app/globals.css:248` (`--vidrio-cromo` 0,8), `cromo-dock-390.png` | Subir a 0,86 solo < 1024 o reforzar el blur; medir con `cromo-contraste.spec`. |
| P2-3 | Banco de Occidente: el emblema se come la altura y su texto queda pequeño frente a Globant o Royal Caribbean. | `src/components/perfil/logosMarcas.ts:34` (`alto: 46`) | Probar 52 px (sube el `li` de 48 a 52) o recortar el `viewBox`. |
| P2-4 | Timeline: 4 pasos en ≈ 2,7 s; quien baja rápido ve columnas vacías (el 04 llega a ~2 s; ver `craft-mitad-1440.png`). Justificado como relato único, pero largo para UI. | `src/lib/pasosCraft.ts:14`, `:51` | Bajar `TRAMO` para cerrar en ≤ 1,8 s. |
| P2-5 | La transición de página desenfoca 3 px las dos capturas de página completa: coste en móviles modestos. | `src/app/globals.css:335` (`--blur-pagina`) | `--blur-pagina: 0` < 1024 (queda 8 px + fundido). |
| P2-6 | El marquee de /about corre `infinite` (36 s) aunque esté fuera de la vista; solo se pausa con hover/foco. | `src/components/perfil/perfil.css:486` | `animation-play-state: paused` fuera de viewport (IntersectionObserver), como el resto del sistema en reposo. |
| P2-7 | El pulso del punto verde sigue animando `box-shadow` (pintura) durante sus 3,2 s. | `src/components/sistema/sistema.css:431` | Halo en un pseudo con `opacity`/`scale`. |

## Respaldo del ancla tras una navegación dura

Una pestaña abierta antes de un despliegue que pulsa «Contacto» desde /about recibe un RSC de otro `buildId`; Next cae a una
navegación dura a `/` sin el hash. Vale la pena: es el caso de cualquier visitante con la pestaña abierta durante un merge de
Doug, el coste son ~70 líneas sin dependencias y no toca el camino normal. `src/lib/anclaPendiente.ts`: `vigilarAnclas`
(en `SiteHeader`, clic en captura) apunta la ruta y el id en `sessionStorage` 10 s; `restaurarAnclaPendiente` (donde
`useEspiaSecciones` ya leía el hash al montar) repone `#id` con `replaceState` y salta a la sección. Prueba en
`tests/e2e/tablero.spec.ts`: simula el otro `buildId`, comprueba que hubo navegación dura y que acaba en `/#contact` con
el rótulo a 24 px (de9e98d).

## Arreglos y verificación

_Pendiente de la corrida final._
