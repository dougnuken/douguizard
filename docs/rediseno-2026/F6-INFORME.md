# F6 · Casos en hoja con URL real (rutas interceptadas + paralelas) · informe del ejecutor

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Fuente: `07-PLAN-IMPLEMENTACION.md` §1.2 y §F6, decisión de
`ESTADO.md` (casos = hoja sobre el tablero con URL real). `06-CRITICA-F5.md` no asigna P2 a F6. `ESTADO.md` no se tocó.

## Qué quedó

- **Rutas.** `src/app/(es)/@modal/{default.tsx,(.)work/[slug]/page.tsx}` y, para inglés, el layout anidado
  `src/app/(en)/en/layout.tsx` (`{children}{modal}`) con `src/app/(en)/en/@modal/{default.tsx,(.)work/[slug]/page.tsx}`.
  `(es)/layout.tsx` recibe `{ children, modal }`. Las dos páginas del slot tienen `generateStaticParams` desde
  `caseStudies` (el build las prerenderiza como `/(.)work/[slug]` y `/en/(.)work/[slug]`, SSG) y llaman `notFound()`
  si el slug no existe. Sin catch-all en el slot: los 404 siguen iguales.
- **`CaseBody`** (`src/components/case/CaseBody.tsx`): el cuerpo del caso extraído de `CasePage`, sin `<main>` ni
  JSON-LD. Prop `enHoja`: título `h2` con el id que usa `aria-labelledby` (`hoja/ids.ts`), sin la miga de
  `CaseHeader` (la hoja trae la suya) ni el hueco de la cabecera fija, colofón con `<div>` en vez de `<footer>`,
  todo dentro de `<article>`. `CasePage` queda como envoltorio: `notFound()`, `<main id="main">` y JSON-LD.
- **`CaseSheet`** (`src/components/hoja/CaseSheet.tsx`, cliente): `<dialog>` con `showModal()`, velo con blur 8,
  panel de `min(1120px, 100vw − 2·112)` y alto `100svh − 48`; en móvil (< 1024) ancho completo y `100svh − 16`.
  Cabecera con asa, miga «Trabajo / Proyecto», «Ver página completa» (`<a>` de documento) y Cerrar; línea láser de
  progreso de lectura (`--p`). Foco inicial en Cerrar; trampa de Tab propia (Chromium deja salir a la barra de
  direcciones). Esc (evento `cancel`), X, velo y arrastre animan la salida (280 ms; 150 ms con RM) y hacen
  `router.back()`; Atrás la quita sin animación (aceptado en §1.2). Se auto-oculta si `usePathname()` deja de ser la
  ruta del caso (slot rancio). Al desmontar devuelve el foco al enlace de origen (`hoja/origen.ts`).
- **Arrastre** (`hoja/useArrastreHoja.ts`): sobre la cabecera, > 120 px o > 0,5 px/ms cierra; por debajo vuelve;
  hacia arriba, banda elástica (⅓).
- **CSS** (al final de `globals.css`): entra 420 ms con `--curva-hoja`, sale 280 ms; RM → fundido de 150 ms sin
  desplazamiento; `html:has(dialog.hoja[open]) { overflow: hidden; scrollbar-gutter: stable }` (la página de debajo
  no se mueve y el pin no salta); `prefers-reduced-transparency` → velo opaco.
- **`CaseNext`**: `enHoja` → `<Link replace scroll={false}>` (cambia de caso dentro de la hoja; Cerrar vuelve al
  tablero); página completa → `<a>` (si no, la interceptación del nivel raíz abriría una hoja encima).
- **Enlaces a casos.** `/cv`: «Ver caso» pasa de `<Link>` a `<a>` (D22, sin cambio visual; `print`, `I6` y capturas
  de `/cv` siguen verdes). `/about` (`perfil/Secciones.tsx`) y `/experience` (`trayectoria/Trayectoria.tsx`): de `<a>`
  a `<Link>` para que la hoja se abra también desde ahí (D21, `hojaDesdeIndices: true`). El tablero y `/work` ya
  usaban `<Link>`.

## Pruebas

| | Resultado |
|---|---|
| vitest | **255/255** (250 de base + 5 en `src/components/hoja/__tests__/hoja.test.ts`: ids únicos, umbrales del arrastre, un `@modal` por idioma con `default.tsx` y sin catch-all, D21/D22 en los enlaces, `<main>` y JSON-LD solo en la página completa) |
| lint · tsc · build | en verde |
| Playwright completo | **464/464 en dos corridas completas** con el código final (15,6 min cada una). Base 440 + 23 de `hoja.spec` + 1 (X2 se parte en X2a/X2b). Una corrida anterior dio 463/464: la prueba Ctrl/Cmd+clic esperaba que Chromium headless abriera la pestaña y bajo carga no siempre lo hace; se reescribió (ver desvío 3) y pasó 3/3 suelta y en las dos corridas. |

`tests/e2e/hoja.spec.ts` (23):
- **Las cinco comprobaciones de §1.2 repetidas en la versión instalada** (next 16.4.5): (a) navegación blanda `/` →
  `/work/olbo` pinta la hoja sobre el home con 1 `main#main`, 1 `h1`, 1 `<footer>` y el título del dialog es `H2`;
  Atrás la quita; recarga → página completa. (b) desde `/work`, `/about` y `/experience` también abre. (c)
  `default.tsx` → `null` no cambia los 404 (`/this-page-was-never-here`, `/en/…`, `/work/not-a-case`,
  `/en/work/not-a-case`) ni `/cv`; (c′) slug inexistente por navegación blanda → 404 de caso sin hoja. (d)
  «Siguiente» en la hoja reemplaza y Cerrar vuelve a `/`. (e) cambio de idioma → página completa ES.
- Foco inicial en Cerrar; Tab y Shift+Tab ×60 sin salir de la hoja.
- Esc, X, velo y Atrás (4 pruebas): cierran, devuelven el foco al enlace de la card, `scrollY` del tablero intacto y
  `overflow` del documento restaurado.
- Rueda sobre la hoja: desplaza el cuerpo (> 300 px), no la ventana; el progreso láser avanza.
- Ctrl/Cmd+clic no lo intercepta la app; la pestaña con ese enlace da la página completa.
- «Ver página completa» → documento sin hoja. «Siguiente» en la página completa → sin hoja.
- Miga «Trabajo» → `/work` sin hoja pintada (slot rancio oculto).
- `/cv` «Ver caso» → página completa sin `dialog` (D22).
- EN: `/en` → `/en/work/olbo` en hoja con su copy (`Close`, miga a `/en/work`); Atrás → `/en`; directa → completa.
- axe (wcag2a/aa, 21a/aa) sin violaciones con la hoja abierta, ES y EN.
- Sin peticiones RSC a la ruta del caso al abrir (prerenderizada y prefetcheada).
- Movimiento: sin RM, `translate` en 0,42 s; con RM, solo `opacity` en 0,15 s y sin desplazamiento.
- Con el ancla (1440 sin RM): abrir y cerrar deja `scrollY`, fase de la escena y `cine` iguales (pin y lente intactos).
- Móvil 390: la hoja ocupa el ancho del dialog y empieza a 16 px; arrastre de 60 px vuelve, de 140 px cierra.

`content X2` reescrita como **X2a** (clic en la card de olbo → hoja; la rueda desplaza el cuerpo y no la ventana) y
**X2b** (carga directa de `/work/olbo` → página completa; la rueda desplaza la ventana). `a11y 3.2–3.4`, `seo E5`,
`print 8.x`, `i18n I6`, `escena`, `vidrio`, `tablero` y el resto pasan sin cambios.

## Peso y LCP de `/` (`perf.spec`, mediana de 3 en frío, servidor solo; `perf-F6.json`)

| Perfil | F5 tras arreglos (`perf-F5-arreglos.json`) | **F6** | Corridas F6 | Elemento LCP |
|---|---|---|---|---|
| Móvil | 1.040 ms | **1.036 ms** | 1.028 / 1.048 / 1.036 | `span.claim` (K2) |
| Escritorio | 400 ms | **376 ms** | 376 / 376 / 420 | `img.k1-poster` |

- **JS inicial de `/`: 157,9 KB gz, igual que F5** (presupuesto ≤ 172,6). `CaseSheet` y `CaseBody` viajan con la ruta
  del slot, no con el home.
- CLS sin cambios (móvil 0,0655, el pendiente conocido de F5; escritorio 0,0005).

## Capturas (`F6-capturas/`, `next build` + `next start`, DPR 1, JPG 82, RM)

- `hoja-{naowee-suid,mercadolibre-andes,olbo,dc-medical}-{es,en}-{1440,390}.jpg`: hoja abierta desde el home.
- `completa-{…}-{es,en}-{1440,390}.jpg`: la página completa de los mismos por URL directa.
- `hoja-1440.webm`: abrir desde el tablero (Naowee), leer con la rueda y cerrar con la X, a 1440 con movimiento.
- Script: `scripts/shots-f6.ts` (`npx tsx scripts/shots-f6.ts`).

## Desvíos del plan y por qué

1. **El origen del foco no se guarda en el `onClick` de `BentoCard`.** Las cards son de servidor (`BentoCard`,
   `CardArchivo`, `Trayectoria`, `Secciones`); hacerlas cliente solo para eso sumaba JS al home. `origen.ts` lo toma
   al abrir la hoja (el enlace pulsado sigue enfocado en Chromium/Firefox y siempre con teclado) y, si no lo está
   (Safari no enfoca enlaces con el ratón), busca el primer enlace visible al caso en `#main`. Probado con Esc, X,
   velo y Atrás.
2. **La miga de `CaseHeader` no se muestra dentro de la hoja**, como en la maqueta (`caso.html`: `.hoja .caso-miga
   { display: none }`); la cabecera de la hoja trae «Trabajo / Proyecto». La prueba del slot rancio usa esa miga
   (`/work`) en vez de `CaseHeader` → `/#work`; es el mismo mecanismo.
3. **Ctrl/Cmd+clic**: comprobar que el navegador abre la pestaña dependía de la carga de la máquina (1 fallo en 464).
   La prueba ahora mide lo que es nuestro: el clic con modificador llega a `window` sin `defaultPrevented` (la app no
   lo intercepta) y esa URL en una pestaña nueva da la página completa.
4. **Ancho de la hoja en móvil en headless**: Chromium headless pinta barra clásica y `scrollbar-gutter: stable`
   reserva 15 px, así que a 390 la hoja mide 375. La prueba compara con el ancho del dialog (≥ 374); en un teléfono
   (barras superpuestas) es 390.
5. **La hoja no anima con `@starting-style`** sino con un atributo `data-estado` puesto dos cuadros después de
   `showModal()`: la salida necesita esperar la transición antes de `router.back()` y así ambos sentidos van por el
   mismo camino. Mismo resultado (420/280 ms, RM 150 ms).
6. Iconos de la cabecera de la hoja en SVG en línea: la hoja también puede abrirse sobre páginas sin
   `IconosSprite`.

## Pendientes

- QA visual y crítica de F6 (4 casos × 2 anchos × ES/EN × RM; tiempos, velo, progreso láser, arrastre).
- Lector de pantalla (VoiceOver en Safari) y Safari/Firefox reales de la hoja → F8.
- Sin verificar: si alguna banda del caso tiene efectos ligados al scroll de la ventana, dentro de la hoja no
  seguirían el scroll del cuerpo (los reveals por `IntersectionObserver` sí funcionan: axe y X2a lo recorren).
  Revisar en F7 al pasar el caso a B.
- CLS móvil 0,066 de F5 sigue abierto (no es de F6).
- `ESTADO.md` no se tocó (lo cierra el orquestador).

## Arreglos tras la crítica (`06-CRITICA-F6.md`, P1-1 a P1-5)

| Punto | Cambio | Prueba (`tests/e2e/hoja.spec.ts`) |
|---|---|---|
| **P1-1** foco inicial | `CaseSheet` enfoca `.hoja-cuerpo` (`preventScroll`) en vez de Cerrar. Desde el cuerpo, el primer Tab va a Cerrar (la trampa lo fuerza); Shift+Tab cae en Cerrar por orden del DOM. El anillo de `.hoja-cuerpo` sigue solo con `:focus-visible` (no sale al abrir con el ratón). | «foco inicial en el cuerpo»: `activeElement` = `.hoja-cuerpo`; Espacio, ↓ y AvPág suben `scrollTop`, el foco sigue en el cuerpo, la hoja sigue abierta y la URL es la del caso; el primer Tab llega a Cerrar. «Tab atrapado» (×60 adelante y atrás) sigue. |
| **P1-2** canal de la barra | `html:has(dialog.hoja[open]) { background-color: rgb(6 6 8) }` (en claro, el velo sobre el papel con `color-mix`): con fondo propio en `html`, `body` deja de propagar el suyo al lienzo y el canal toma el color del velo; lo de debajo no cambia. El panel se centra en la ventana (`left: 50vw`) y no en el dialog; en < 1024 sigue `left: 50%`. | «1440 con barras clásicas»: Δlum entre x = 1432 y x = 1410 ≤ 3 en y = 24, 200 y 450 (antes 99 contra 6 en claro, 16 contra 6 en oscuro); centro del panel a ±1 px de 720. Se salta si el navegador no reserva canal. |
| **P1-3** salida | Sin cambio de código: el CSS de salida funciona. En headless un cuadro dura ≈ 55 ms y la transición arranca un cuadro después del cambio de estado; con `--curva-hoja` el panel recorre la mayor parte en ese primer cuadro (48 → 567 → 853 → 926 px, sin hoja a ≈ 310 ms). Eso explica el «salto» del vídeo de F6. | «sin RM, X / Esc / velo» (3): desde que la hoja pasa a `cerrando`, se anota cada cuadro pintado; cerca de los 100 ms (±60) la hoja sigue abierta, el panel ha bajado más de 20 px sin salir y el velo está entre 0 y 1; a los 400 ms no queda hoja y la URL es la de origen. |
| **P1-4** entrada en dos tiempos | `CaseHeader` con `enHoja`: el `h2` y el lead son elementos normales, sin `RevealText`. El texto sube con el panel. La página completa conserva su revelado. | «el encabezado entra con el panel»: a los 420 ms de abrir, el `h2`, el lead y sus ancestros dentro del cuerpo tienen opacidad 1 y sin `clip-path`, `transform` ni `translate`. |
| **P1-5** miga | Campo `shortName` en `caseStudies` (Andes, DC Medical, Royal Caribbean; es una marca y no se traduce) y `getShortName()` (si falta, la parte de `project` antes de « — »). Los dos slots `@modal` (ES y EN) lo pasan a la miga. El `ellipsis` se queda como red de seguridad. | «móvil 390 / y /en» (2): la miga dice Naowee, Andes, olbo y DC Medical, con `scrollWidth ≤ clientWidth`. |

**Pendiente para F7 (P1-4):** el cuerpo B del caso hereda la regla: dentro de la hoja el contenido de la primera
pantalla viaja con el panel, sin revelado propio. Los reveals solo van en contenido que entra por scroll.
