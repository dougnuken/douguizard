# Pulido G · G4 · Motion: transiciones entre páginas y «Cómo trabajo»

Rama `pulido-g/g4-motion` (desde `claude/douguizard-portfolio-redesign-9ivnau`). Skills: `motion-design`,
`emil-design-eng`, `transitions-dev`, `choreograph`, `animate-text`, `animation-performance`. Sin dependencias
nuevas: React `<ViewTransition>`, CSS y WAAPI (GSAP no hizo falta).

## 1. Transiciones entre páginas

**Pedido:** «de /experience a /cv (o a otra pantalla) se ve tosco, no hay transición suave».

**Técnica elegida: React `<ViewTransition>` (React 19.3 + Next 16.4).** En Next 16.4.5 ya no hay bandera
`experimental.viewTransition`: el router hace cada navegación dentro de `startTransition` y el `ViewTransition`
de React (incluido en el React que trae Next) lanza `document.startViewTransition` por sí solo. Se evaluó la
alternativa manual (interceptar clics, `startViewTransition` + `router.push` y esperar la ruta): es la técnica de
`next-view-transitions`, pero congela la pantalla mientras llega la ruta y se rompe con prefetch lento. React, en
cambio, captura la página vieja justo antes de confirmar la nueva, espera fuentes e imágenes visibles (≤ 500 ms) y
**deja la raíz sin capturar**, así que lo que no está dentro de un límite sigue vivo.

| Pieza | Qué hace |
| --- | --- |
| `TransicionPagina` (`src/components/motion/`) | `<ViewTransition enter="pag-entra" exit="pag-sale" update="none" default="none">` alrededor de cada página B (Home, Trabajo, caso completo, Perfil, Experiencia, CV, en ES y EN). Al cambiar de página, la vieja sale y la nueva entra en la misma transición. |
| `globals.css` § «Transición entre páginas (G4)» | Patrón **page side-by-side** de transitions.dev: 250 ms (`--d-abrir`), `cubic-bezier(0.22, 1, 0.36, 1)` (`--curva-suave`), 8 px (`--dist-pagina`) + blur 3 px (`--blur-pagina`), simétrico. Sale hacia un lado y entra desde el otro. |
| `DireccionTransicion` + `lib/transicionRuta.ts` | Marca `<html data-vt="adelante|atras">` antes de navegar (clic o «atrás») según el orden del dock: Inicio · Trabajo · caso · Perfil · Experiencia · CV. Hacia delante, la página nueva entra desde la derecha; hacia atrás, desde la izquierda: el cambio de página y la píldora del dock cuentan el mismo viaje. Sin orden: sube 8 px. |
| Cabecera, dock y rail | `view-transition-name` propio (`cabecera`, `dock`, `rail`), sin animación y con la copia vieja oculta: **no parpadean** y la píldora que se desliza sigue viva encima (la copia nueva es en vivo). Si una página no tiene dock visible, el dock entra o sale con un fundido. |
| Losas de caso | Su `caso-<slug>` en línea es para el reflujo del filtro de /work; fuera de él se anula (`!important`) para que no vuelen solas entre el home y /work. |
| `SiteHeader` | `data-ruta="cv"` pasa de `useEffect` a `useLayoutEffect`: el estilo de /cv ya está puesto cuando la transición captura la página nueva. |

**Lo que no se rompe:**
- **Hoja de casos** (`@modal/(.)work/[slug]`): abrir, cambiar de caso y cerrar no cambian la página de debajo, así
  que el límite no se entera y no hay transición; la hoja conserva su entrada de 420 ms. Probado: 0 View Transitions al abrir.
- **Anclas** (`/#contact`, `/about#craft`): el scroll de Next ocurre en la fase de layout, antes de capturar la
  página nueva; la transición entra ya en el ancla.
- **Cambio de idioma y documentos completos**: siguen con el `@view-transition` de F7 (cross-document); la
  cabecera, ahora con nombre, tampoco se funde ahí.
- **LCP y CLS**: la primera carga no pasa por la transición (solo navegaciones en el cliente); los pseudo-elementos
  no mueven el layout. Cero JS de librerías: dos componentes cliente pequeños.

**Movimiento reducido:** solo un fundido de 150 ms (`--d-cerrar`), lineal, sin desplazamiento ni blur.
**Sin la API** (Safari < 18, Firefox < 144): React cambia al instante y `DireccionTransicion` hace un fundido WAAPI
de 150 ms del `main` nuevo antes de pintar (nada con movimiento reducido).

Vídeo: `pulido-G/g4/transicion-experience-cv-1440.webm` (ida, vuelta atrás y la ida a ¼ de velocidad).

## 2. «Cómo trabajo» en secuencia

**Pedido:** que la timeline de /about se anime paso a paso al entrar en vista: nodo 1 encendido y su paso; el
láser se llena hasta el 2, que se enciende y revela el suyo, y así hasta el 4. Una vez, ~2,5–3,5 s.

**K14 del tablero no comparte componente** (es una lista de número + título, sin láser ni nodos): no se tocó.

**Coreografía** (`src/lib/pasosCraft.ts`, pura y probada; `PasosCraft.tsx` la lanza con WAAPI):

| Papel (skill `choreograph`) | Elemento | Movimiento |
| --- | --- | --- |
| Protagonista | El láser (`ol.pasos::before`) | `scaleX` (vertical en móvil: `scaleY`) de nodo a nodo; tramos de 640 ms `cubic-bezier(0.65, 0, 0.35, 1)`: la carga acelera al salir de un nodo y frena al llegar. Tras el 04, cola de 420 ms hasta el borde. |
| Secundario | Cada nodo | Al llegar la carga: luz (`::after`) de 0,4 → 1 de escala y opacidad, 300 ms `--curva-suave`; pulso de halo (`::before`) que se abre ×2,8 y se apaga en 560 ms. |
| Apoyo | Número Doto, título y texto | `soft-blur-in` de `animate-text` a escala de bloque: opacidad 0 → 1, 12 px de subida, blur 4 → 0, 560 ms `--curva-suave`; escalón decreciente 0 / 70 / 150 ms (no de metrónomo). |

El texto de un paso se solapa con el viaje al siguiente: se lee como una ola, no como una cola. Tiempos: nodos a
0 / 640 / 1 280 / 1 920 ms (+120 ms de arranque); **total ≈ 2,75 s**. A 1024–1279 (dos columnas, sin láser
visible) la misma secuencia sin trazo, con tramos de 460 ms.

**Reglas:**
- **Sin JS** todo se ve (el oculto lo pone el script). **Movimiento reducido**, `?estatico` e **impresión**: todo
  visible y quieto.
- **Una vez por visita** a la página (`IntersectionObserver` que se desconecta al disparar; margen −18 % abajo).
- **Una sola entrada por contenedor**: la losa de «Cómo trabajo» ya no hace el revelado de `RevelarLosas`; su
  entrada es la secuencia.
- **Sin CLS**: el texto ocupa su caja desde el principio; solo `opacity`, `transform` y `filter` (compositor).
- **Sin parpadeo al llegar directo a `/about#craft`**: si la lista ya estaba pintada al hidratar, se queda quieta.
  Por navegación en el cliente (K14 del home → `/about#craft`) se monta antes de pintar y sí se anima.
- **0 animaciones en reposo**: `fill: backwards`; al terminar `data-pasos="listo"` y `getAnimations()` vacío.
- **Estado final = estado estático**: ahora los **cuatro nodos quedan encendidos** (antes solo el 01): la carga ya
  pasó por todos. Es el único cambio visible sin animación.

Vídeos: `pulido-G/g4/timeline-como-trabajo-1440.webm` y `-390.webm`.

## 3. Pruebas y verificación

- **Vitest** `src/lib/__tests__/g4-motion.test.ts` (5): orden y dirección de rutas; coreografía (orden de
  encendidos, total 2,5–3,5 s, el láser llega a cada nodo cuando se enciende y termina lleno, eje Y, sin láser).
- **Playwright** `tests/e2e/g4-motion.spec.ts` (8): timeline a 1440 y 390 (a media secuencia el 01 está y el 04
  no; termina con los 4 visibles, láser lleno, misma caja antes y después, 0 animaciones); reduced-motion todo
  visible al instante; /experience → /cv con `pag-sale`/`pag-entra` de 250 ms, sin animación en la cabecera, y
  atrás; reduced-motion solo `pag-fundido-*` de 150 ms; la hoja de casos sin transición y con Esc; Contacto del
  dock → `/#contact` en pantalla; K14 → `/about#craft` con la secuencia entera.

| Verificación | Resultado |
| --- | --- |
| `eslint .` | 0 errores |
| `tsc --noEmit` | limpio |
| Vitest | 263/263 (5 nuevas) |
| `next build` | ✓ |
| `g4-motion.spec` | 8/8 |
| Suites relacionadas (about, experience, hoja, caso, dock-pulido, keyboard, a11y, layout, perfil-pasos, controles, motion, work, i18n, cv-b, tablero; el filtro arrastró casi toda la suite), `--trace off`, puerto 3204 | 614/619 en la corrida conjunta (31 min, 2 workers). Las 5 rojas eran de tiempo: repetidas solas, 4 pasan a la primera (`about:87` rueda, `escena:421`, `vidrio:127`, `vidrio:235`) y `escena:163` «snap ≤ 1,2 s» falla 1 de 5 (4/4 con `--repeat-each=4`): es la intermitente que ya fallaba igual en la base (`09-MOTION-CONTROLES.md` §7). |

Rendimiento (`perf.spec`, `PERF_ASSERT=1 PERF_RUNS=3`, mediana; comparado con `09-MOTION-CONTROLES.md` §6):

| Ruta | Móvil LCP | Móvil CLS | Escritorio LCP | Escritorio CLS | JS gzip |
| --- | --- | --- | --- | --- | --- |
| `/` | 1 084 ms | 0 | 400 ms | 0,0005 | 163,5 KB |
| `/about` | 1 904 ms | 0,0004 | 360 ms | 0 | 156,7 KB |

LCP dentro del ruido entre corridas y `/about` bajo la meta de 2,0 s; CLS sin cambio. El JS sube ~2 KB en `/` y
~3 KB en `/about` (dos componentes cliente y la coreografía), sin librerías.

## 4. Archivos

`src/components/motion/TransicionPagina.tsx` · `src/components/motion/DireccionTransicion.tsx` ·
`src/lib/transicionRuta.ts` · `src/components/perfil/PasosCraft.tsx` · `src/lib/pasosCraft.ts` ·
`src/components/perfil/Secciones.tsx` · `src/components/perfil/perfil.css` · `src/app/globals.css` (tokens
`--curva-suave`, `--d-abrir`, `--d-cerrar`, `--dist-pagina`, `--blur-pagina` y el bloque G4) ·
`src/components/pages/*Page.tsx` (envoltura) · `src/components/pages/RootDocument.tsx` ·
`src/components/chrome/SiteHeader.tsx` · pruebas.
