# 09 · Motion de los controles

> Pedido de Doug: «el navbar no me gusta, la selección no tiene transición suave o animada, se ve un salto
> brusco… que se audite y mejore todos los controladores de mi página, así como el "desliza", que también sea
> animado». Criterios: `motion-design`, `emil-design-eng` y `apple-design` (curvas propias, duraciones cortas,
> interrumpible, solo `transform`/`opacity`/`clip-path`, respuesta al presionar, coherencia espacial, RM).

## 1. Sistema de motion de los controles

Una sola familia, con los tokens de `globals.css`:

| Uso | Duración | Curva | Propiedad |
| --- | --- | --- | --- |
| Presionar (todo lo que se pulsa) | `--d-press` 120 ms | `--curva-salida` | `scale` 0,97 (botones y pills) · 0,96 (círculos, dock, ES/EN, menú, filtro) |
| Hover (solo `hover: hover` y puntero fino) | `--d-hover` 200 ms | `--curva-salida` | `background-color`, `color` |
| Color del texto al cambiar de selección | `--d-ui` 240 ms | `--curva-salida` | `color` |
| Selección que se desliza | 340 ms | `--curva-salida` (0.23, 1, 0.32, 1) | `clip-path: inset(… round r)` |
| Burbuja ES/EN | 160 ms | `--curva-salida` | `translate` |
| Panel del menú móvil | entra `--d-ui` 240 ms · sale 160 ms | `--curva-salida` | `opacity`, `scale` 0,96, `translate` −6 px, origen en el botón |
| Hojas (casos, «Secciones») | entra `--d-hoja` 420 ms · sale 280 ms | `--curva-hoja` | `translate` (+ velo `opacity`) |
| «Desliza» | 1 200 ms × 2, a los 1 000 ms | `--curva-io` | `transform: scaleY`, `opacity` |

Nada de `transition: all`. Con `prefers-reduced-motion: reduce` todo es instantáneo (≤ 1 ms, lo exige `motion 7.5`),
sin `scale` al presionar, sin viaje de la píldora ni de la burbuja y sin «Desliza».

## 2. Auditoría: control → problema → arreglo

| Control | Problema | Arreglo |
| --- | --- | --- |
| **Dock móvil** (`DockMovil.tsx`, `.dock`) | La píldora blanca salta de un destino a otro: es el fondo de la opción con `aria-current` y cada página monta su propio dock, así que ni siquiera había algo que animar. `:active` a 0,95. | Píldora que se desliza (`usePildora`, §3) 340 ms `--curva-salida` sobre `clip-path`. Arranca al pulsar (antes de que llegue la ruta) y la memoria vive en el módulo: el dock nuevo retoma el viaje a medio camino. `:active` 0,96 / 120 ms; texto `color` 240 ms. |
| **Pills de la cabecera** (`.cab-pills .pill`) | Mismo salto. Sin respuesta al presionar. En el home, al pulsar una pill el scroll-spy pasaba por las secciones intermedias. | Píldora que se desliza (misma pieza). `:active` 0,97 / 120 ms. `irASeccion` fija la sección mientras baja en suave (`fijarSeccionDuranteScroll`, se suelta con `scrollend` o a 1,5 s): la píldora va directa al destino. |
| **ES / EN** (`LanguageSwitch.tsx`, `.idioma`) | La burbuja no se movía; el cambio de idioma es otro documento (otro layout raíz). Hover sin compuerta de puntero. Sin `:active`. | Al pulsar, `data-yendo`: la burbuja (`.idioma::before`) se desliza 44 px en 160 ms y se navega a los 140 ms (bajo el tope de ~180). Con «atrás» (bfcache) se limpia en `pageshow`. Con modificadores o RM navega al instante. `:active` 0,96; hover solo con puntero fino. |
| **Botón de menú** (`.cab-menu`) | Sin respuesta al presionar. | `:active` 0,96 / 120 ms (el ícono ya rotaba 90° en 240 ms). |
| **Panel del menú** (`.cab-menu-panel`) | Aparecía y desaparecía de golpe (`hidden`). | Entra desde el botón (`transform-origin` arriba a la derecha) con `@starting-style`, 240 ms; sale 160 ms con `data-saliendo` (inerte) y solo después recibe `hidden` (el `[hidden]{display:none !important}` de Tailwind impide la salida con `allow-discrete`). Filas con `:active`. |
| **Rail de acciones** (`RailAcciones.tsx`) | `:active` a 0,94 (más fuerte que el resto). Tooltip bien (125 ms). | `:active` 0,96. |
| **«Hablemos» / `Boton`** (`sistema.css`) | Correcto: 0,97 / 120 ms, hover con color. | Sin cambios. |
| **Filtros de `/work`** (`FiltroCasos.tsx`) | El blanco saltaba; además el View Transition del reflujo hacía un fundido de **toda** la página, filtro incluido (la píldora vieja se desvanecía encima de la nueva). | Píldora que se desliza al botón pulsado. El View Transition ahora solo captura `#casos-trabajo` (`html.vt-filtro`, el `root` sin nombre mientras dura): el filtro de vidrio sigue vivo. |
| **Carrusel del tablero móvil** (`CarruselMovil.tsx`) | «1 de 4» cambiaba de golpe; el `disabled` saltaba de opacidad; el `:active` escalaba también deshabilitado. | El número entra desde el lado hacia el que se va (6 px + `opacity`, 200 ms, finito). `opacity` en la transición del círculo; `:active` 0,96 solo si está habilitado. |
| **Hoja de casos** (`CaseSheet`, `globals.css`) | Bien resuelta (420 / 280 ms, `--curva-hoja`, arrastre). Hover del círculo sin compuerta de puntero; `:active` 0,94. | Hover solo con puntero fino; `:active` 0,96. |
| **«Secciones»** (`HojaSecciones.tsx`, `dialog.secciones`) | El diálogo aparecía y se iba de golpe; la «×» sin respuesta al presionar. | Sube desde abajo como la hoja (420 ms `--curva-hoja`, `@starting-style`) y baja por el mismo camino (280 ms, `display`/`overlay` discretos); velo con fundido. «×» con `:active` 0,96; filas con `color` al presionar. |
| **«Desliza / Scroll»** (`Escena.tsx`, `PortadaPerfil.tsx`) | Estático: un riel gris que solo se llenaba con el scroll. | Un trazo (`::after`, degradado a blanco en la punta) recorre el riel hacia abajo y se apaga: **2 ciclos de 1,2 s a partir de 1 s**, y queda quieto. Con el primer scroll (`data-p` ≠ `0.000`) se retira y el riel vuelve a ser el progreso (`--p`). |

## 3. La píldora que se desliza (`usePildora`)

- **Qué se anima:** una capa blanca (`.pildora`, primer hijo del grupo) del tamaño del grupo, recortada con
  `clip-path: inset(t r b l round r)` a la caja de la opción. Animar el recorte no toca el layout (ni `width` ni
  `left`) y las esquinas quedan redondas todo el viaje. WAAPI, 340 ms, `--curva-salida`.
- **En reposo no hay capa:** la selección sigue siendo el fondo de la opción activa, como antes (sin JS, axe y el
  barrido de contraste ven lo mismo). Solo durante el viaje el grupo lleva `data-moviendo`: las opciones sueltan su
  fondo y la capa viaja. El relevo es en el mismo cuadro y en la misma caja (sin fundido de `background-color`).
- **Interrumpible:** un cambio a medio camino arranca desde el recorte que se ve (`getComputedStyle`), no desde el
  destino anterior.
- **Entre rutas:** la memoria (caja actual + viaje en curso) vive en el módulo (`src/lib/pildora.ts`). Al pulsar un
  destino del dock o una pill, la píldora sale de inmediato; si la ruta llega y el dock se vuelve a montar, el nuevo
  retoma la animación en el mismo punto (`currentTime`). Un grupo sin caja (Next guarda la ruta anterior con
  `display: none`) no mide ni escribe la memoria.
- **Sin animación viva al terminar:** `fill: none` con el valor base ya en el destino; `document.getAnimations()`
  queda vacío.

## 4. «Desliza» y la regla de 0 animaciones en reposo

La regla de fondo de `escena.spec` (0 animaciones `running` en reposo), `vidrio.spec (c)` (RM: 0 animaciones en el
héroe) y `motion 7.1` (RM: 0 animaciones en `/`) **no se tocó**: el trazo es finito (termina a los ~3,4 s desde que
aparece la escena; `escena.spec` mide al menos 4 s después de que la escena está lista), se retira con el primer
scroll y no existe con RM ni fuera del acto 1 de escritorio. Ninguna prueba existente cambió.

## 5. Pruebas nuevas (`tests/e2e/controles.spec.ts`, 7)

1. Dock a 390: de Perfil a Trabajo por una navegación real, hay cuadros con la píldora a medio camino; al terminar,
   sin `data-moviendo`, sin animaciones y con el fondo blanco en la opción.
2. Dock con RM: ningún cuadro con viaje ni animación.
3. Pills a 1440: de Perfil a Experiencia, posición intermedia.
4. ES/EN: `data-yendo` al pulsar y llega a `/en/about` con EN marcado.
5. Filtro de `/work`: posición intermedia y fin limpio.
6. «Desliza»: una sola animación con iteraciones finitas; se retira con el scroll.
7. Menú móvil: origen en el botón, `data-saliendo` y luego `hidden`.

Vitest suma 3 (`src/lib/__tests__/pildora.test.ts`): recorte, comparación de cajas y memoria del viaje.
