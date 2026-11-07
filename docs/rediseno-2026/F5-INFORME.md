# F5 · Acto 1 «cine» y scroll anclado (escritorio ≥ 1024) · informe del ejecutor

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Fuente: `07-PLAN-IMPLEMENTACION.md` §F5 (+ §1.3, §1.8),
pendientes de F1 (`fijarCorte`/`aperturaDesdeProgreso` en el acto 1, `lockup` del home) y los P2 asignados a F5
(06-CRITICA-F3 P2-1 y P2-2, 06-CRITICA-F4 P2-2). `ESTADO.md` no se tocó.

## Qué quedó

- **Acto 1 «cine»** (solo `/` y `/en`, ≥ 1024 px, sin movimiento reducido): la foto de K1 llena la pantalla con
  su vidrio estriado oblicuo (12°), la atmósfera borrosa de la foto fuera de ella, el velo de la izquierda y el
  láser cruzando todo el ancho. El `NameLockup` XL (120 px; 96 px con alto ≤ 800) es decorativo (el `h1` sigue
  siendo K2) y tiene el **corte alineado al láser**. K2 es de vidrio oscuro abajo a la izquierda y nunca queda
  sobre el nombre. A la derecha, «Desliza» con su pista láser.
- **Entrada por tiempo** en CSS, una sola vez y sin JS. El nombre sube con 80 ms de escalonado, el láser se
  enciende desde el centro, K2 se materializa (opacidad, escala .96 → 1 y blur) y aparece el indicador. Todo
  termina en ≤ 1,0 s. Las animaciones usan `fill-mode: backwards`, así que al terminar no queda ninguna en efecto.
  El corte se abre a los 880 ms con la isla de F1.
- **Scroll anclado de 1 viewport** (`useScrollScene` con GSAP + ScrollTrigger diferidos): `scrub: 0.3` y snap no
  direccional a 0 o 1 (`delay` 0,05; 0,2–0,45 s; `power2.out`).
  - Foto pantalla completa → K1 (0 → 0,72, cúbica in-out; radio 0 → 48).
  - Vidrio de `cine` a `losa` con joroba de fuerza +0,30, fase +140 px y lente 240 → 150 (`--vidrio-p`).
  - K2 viaja a su celda (0 → 0,6) y cambia de material: `--m` 0,30 → 0,52 y `--mt` de golpe en 0,41.
  - El nombre hace FLIP al panel de K1 (0 → 0,72) y se funde (0,66 → 0,76) mientras entra el panel real
    (0,68 → 0,8).
  - **El corte se cierra entre p 0 y 0,3** (`fijarCorte(lockup, aperturaDesdeProgreso(p))`) y llega entero.
  - Losas con opacidad, `y` 24 → 0 y escala .96 → 1, sin blur, con inicios fijos: K3 0,30 · K4 0,36 · K5 0,42.
  - Rail 0,5 → 0,8, `inert` mientras p < 0,5.
  - En p = 1 la escena borra todos sus estilos en línea (`html[data-escena-fase="os"]`) y el OS es el de F3, píxel
    a píxel.
- **Robustez:**
  - `invalidateOnRefresh`; `onRefresh` resincroniza p; `ResizeObserver` → `refresh()` con debounce de 120 ms.
  - `matchMedia` revierte al OS al cruzar 1024 o activar RM. Al volver a ≥ 1024 desde abajo entra en p = 1 sin
    salto.
  - El foco fuera de K2 (Tab, skip link) salta al final del ancla y completa el tween. «Ver casos» y las pills
    hacen lo mismo con el evento `escena:fin` desde `irASeccion`.
  - Si GSAP no llega en 4 s o lanza, se quita `html.cine`.
  - **Red de seguridad en el script en línea:** si a los 8 s ningún JS de escena tomó el control, el acto 1 se
    retira solo. Cubre el caso de que no llegue la isla, no solo GSAP.
- **Móvil, RM y sin JS:** el estado OS final directo. No hay `html.cine`, ni pista, ni GSAP, ni nombre XL.
- **P2 de F5:**
  - F3 P2-1: «Trabajo» activa al cargar cuando el tablero está a la vista. Solo en escritorio y nunca durante el
    acto 1.
  - F3/F4 P2-2: `.os-laser`, una línea de 1 px a la altura de los ojos de K1 que cruza el tablero de borde a borde
    por detrás de las losas, sin desbordar. En el ancla entra entre 0,8 y 1.

Archivos: `components/escena/{Escena.tsx, EscenaCliente.tsx, useScrollScene.ts, sceneInit.ts, escena.css}`,
`lib/escena.ts` (`tramo`, `frameEscena`, `ESCENA`, `vidrioEnEscena`, fase en `uniformesVidrio`), `VidrioGL.tsx`
(`--vidrio-p`), `K1Retrato.tsx` (velo, espejo del vidrio, `--foto-atm`), `Tablero.tsx` (`.os-laser`), `tablero.css`
(`--os-x`), `SiteHeader.tsx` (P2-1), `irASeccion.ts`, `RailAcciones.tsx` (comentario), `fonts/lockup.ts`
(`preload: false`).

## Pruebas

| | Resultado |
|---|---|
| vitest | **247/247** (236 de base + 11 en `escena-f5.test.ts`: timeline en p 0/1, tinta en 0,41, inicios de las losas, corte 0 → 0,3, rail y láser, vidrio cine → losa con joroba y fase, `sceneInit`) |
| lint · tsc · build | en verde |
| Playwright completo | ver «Verificación final» (base 424 + 12 de `escena.spec` = 436) |
| `escena.spec.ts` (nuevo, 12) | 1440×900: acto 1 (nombre XL bajo y = 88, CTA en pantalla, foto a pantalla completa) → rueda → OS con K1–K5 iguales al OS de F3 (±1 px) y sin estilos en línea · resize en el OS 1440×900 → 1280×800 (foto = losa) y 1100 → 900 (móvil sin restos) · Tab: las 12 primeras paradas visibles · snap: 40 px vuelve a 0 en ≤ 1 s y desde 0,6 termina el viaje · contraste de K2 en p 0,36/0,41/0,46 ≥ 4,5:1 · **lockup del home** a 1280×720, 1440×900 y 1920×1080 (láser en la rendija ±2 px en p = 0, `data-corte="cerrado"` en p 0,3 y en K1 la palabra entera, K2 sin tapar el nombre) · CLS ≤ 0,02 y reposo (sin animaciones, vidrio sin cuadros) · GSAP bloqueado → OS armado sin errores · RM, sin JS y 390: OS desde el primer píxel, sin pista ni GSAP · el chunk de GSAP se pide **después** del LCP |
| Pruebas cambiadas | `settle.ts` deja el home al final del ancla. `vidrio.spec` «0 fps…» va primero al OS (la losa K1 del OS está al final del ancla; en el acto 1 la foto ocupa toda la pantalla). |

`motion`, `keyboard`, `a11y`, `tablero`, `lockup` y `about` pasan sin cambios.

## Peso y LCP (`perf.spec`, mediana de 3 en frío, servidor solo; `perf-F5.json`)

Para comparar en igualdad de condiciones medí también el commit de F4 (`0be187c`) **hoy, en esta máquina**:

| Ruta · perfil | F4 (informe) | F4 hoy | **F5** | Elemento LCP F5 |
|---|---|---|---|---|
| `/` móvil | 980 ms | 1.072 ms (1.060–1.092) | **1.096 ms** (1.064–1.132) | `span.claim` (K2) |
| `/` escritorio | 356 ms | 388 ms (372–400) | **400 ms** (368–412) | `img.k1-poster` (`losa-640.avif`) |

- **LCP sin regresión dentro del ruido** frente a F4 medido hoy: +24 ms en móvil y +12 ms en escritorio, con los
  rangos solapados. El pin no se monta antes del LCP y el póster del acto 1 es el LCP en escritorio.
- **JS inicial de `/`: 157,5 KB gz** (F4 151,9; presupuesto ≤ 172,6). Los +5,6 KB son la isla de la escena y
  `useScrollScene`. GSAP (core 71 KB + ScrollTrigger 43 KB sin comprimir) **no** está en el JS inicial: se pide tras
  el `load`, solo ≥ 1024 sin RM (`escena.spec`).
- CLS escritorio 0,0005. **CLS móvil 0,0655, igual en F4 hoy** (no es de F5): en Slow 4G la fila «Doug Vargas ·
  Disponible» de K2 ocupa dos líneas con la fuente de respaldo y una con Instrument Sans. Va a pendientes.

## Capturas (`F5-capturas/`, `next build` + `next start`, DPR 1, JPG 82)

`home-es-1440x900-p{0,03,06,1}`, `home-es-1280x720-p{0,03,06,1}`, primer pliegue `home-es-{1920x1080,1366x768,
1024x768}-p0`, `home-es-1024x768-p1`, `home-en-1440x900-p{0,1}`, `home-es-390x844` (móvil = OS) y
`home-es-1440x900-rm` (RM = OS). Las de p intermedio se tomaron con `window.__escenaCaptura` (sin snap ni
suavizado).

## Desvíos del plan y por qué

1. **«Pin» con `position: sticky` en lugar del `pin` de ScrollTrigger.** La pista suma 1 viewport con un `::after`
   y la escena queda pegada. El espacio está reservado desde el primer pintado (por el script en línea), así que no
   hay CLS. Es el mismo mecanismo que `/about` (F2) y aguanta el resize sin `pin-spacer`. ScrollTrigger sigue
   llevando el progreso, el scrub y el snap.
2. **Estrías a 12° de principio a fin** (07 decía 12° → 0°). F4 cerró su P0 con estrías oblicuas en los tres
   estados (`hero.ts`: `cine`, `losa` y `movil` a 12°). Interpolan la estría, la fuerza (con joroba), la lente y la
   fase.
3. **Entrada por tiempo en CSS y no en GSAP.** GSAP llega tras el `load`, y animar desde 0 algo ya pintado se vería
   como un parpadeo. En CSS corre desde el primer cuadro y no necesita JS.
4. **Póster de K1 a 640 px también en el acto 1.** Con 880 px el LCP de escritorio subía de ~390 a ~490 ms. El
   vidrio WebGL repinta la foto desde la textura tras el `load`, así que la falta de resolución solo se nota antes.
   La **atmósfera** (póster `cine` de 440 px borroso) se pide solo cuando la escena ya montó, por la misma razón.
5. **Geologica sin `preload`.** Con el nombre XL en el home, la precarga competía en móvil, donde el nombre ni se
   pinta. El corte espera a `document.fonts.load` antes de medir. `/about` no cambia: su `h1` ya esperaba la fuente
   igual.
6. **«0 fps en reposo»:** sin animaciones en efecto y el vidrio sin cuadros (prueba). ScrollTrigger deja vivo,
   mientras está registrado, un bucle de rAF **vacío** (`_rafBugFix`: no toca el DOM ni pinta). La prueba lo
   descuenta y exige ≤ 6 rAF por segundo de cualquier otro origen. Quitarlo supondría prescindir de ScrollTrigger.
7. **K2 no sube por encima del nombre + 16 px** (con alto ≤ 800 tapaba «Vargas»). Es la regla P0-1 de B aplicada a
   K2.
8. **Contraste de K2 en el cruce:** cumple en 0,36 / 0,41 / 0,46, que es lo que pide 07. Con una mezcla continua
   de material hay un instante, justo antes de 0,41, con ~4,4:1. Es inherente al cambio de tinta de golpe (P1-2) y
   solo se quitaría con un salto de material.
9. Modo de prueba `window.__escenaCaptura` / `html[data-escena-captura]` (sin snap ni suavizado) para medir
   fotogramas exactos. En producción no cambia nada.
10. Las cifras Doto de K3–K5 no hacen el «se encienden» (`--dw` 100 → 700). Es cosmético y queda para la QA si lo
    pide.

## Pendientes

- QA visual y crítica de F5 (coreografía, curvas, snap; vídeo del ancla a 1440 con `recordVideo`).
- CLS móvil 0,066 por el cambio de línea de la fila nombre/estado de K2 al llegar Instrument Sans (también en F4).
  Arreglo propuesto: fila sin `wrap` en móvil o ajuste de las métricas de respaldo.
- Hardware real: fps del ancla y de la lente en la MacBook de Doug (≥ 55 p50).
- Safari/WebKit y Firefox del acto 1 (sticky + `color-mix` en oklab + `inert`) → F8.
- Imagen final del héroe (D7). Con el máster ≥ 1920 se puede volver a `sizes` 880 sin coste.
- `ESTADO.md` no se tocó (lo cierra el orquestador).
