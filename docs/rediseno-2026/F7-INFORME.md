# F7 · Casos, páginas y transiciones al sistema B · informe del ejecutor

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Fuente: `07-PLAN-IMPLEMENTACION.md` §F7 (y §4: D4, D17, D19),
maqueta aprobada `propuestas/B-paginas/caso.html` con NOTAS §7 (P1-5 ficha, P1-6 tablero), `06-CRITICA-F6.md` P1-4
(el cuerpo B hereda «el encabezado entra con el panel»). `ESTADO.md` no se tocó.

## Qué quedó

- **La pieza del caso en B** (`src/components/case/caso.css`, nuevo; `CaseBody.tsx` reescrito). La página completa y
  la hoja pintan el mismo `CaseBody`, en el orden de 02 §5.3, que es el del DOM y del Tab: miga `Trabajo / {nombre
  corto}` (a `/work`, ya no a `/#work`) → portada → captura a sangre → impacto → problema → mi parte → decisiones →
  producto → proceso → testimonio → colofón → siguiente caso. Un bloque sin datos no se pinta ni sale en el índice.
- **Portada** (`CaseHeader`): ceja «cliente · rol», `h1` Urbanist 600 a 120 px (72 a < 1024), gancho de 20 px en
  `--tinta-2` en col 1–7 y la ficha en col 8–12, alineadas abajo. En la hoja: `h2` a 72 (48 a < 1024), sin miga y sin
  revelado (P1-4): el texto viaja con el panel.
- **Ficha 2 × 2 sin escalera** (`CaseMeta`, P1-5): `<dl>` sin cajas, filete superior de 1 px `--losa-borde`, `dt`
  12 px `--tinta-3` y `dd` 18 px (16 en móvil). Orden Rol · Duración · Plataformas · Equipo (Equipo a todo el ancho).
  «Año» sale de la ficha. Campo nuevo `platforms` en `work.ts`, solo donde el caso ya lo dice: olbo y DC Medical
  «PWA», Naowee «Web», Andes «iOS · Android · Web», MakeaPet «iOS · Android · PWA», Royal Caribbean «iOS · Android»,
  Chub «iOS». Banco de Occidente, Qrvey e Ideaware quedan sin la celda.
- **Tablero de impacto** (`CaseImpact`, P1-6): `<ul>` de 4 columnas ≥ 1280 y 2 por debajo; cada KPI una losa
  `--losa-alta` + `--filo`, radio `--r-m`, `min-height: 0`, `align-items: start` (mide lo que lleva) y
  `container-type: inline-size`. Cifra en `DotMatrix` a `min(72px, 100cqi / k)` (48 a < 1024) con `k` = ancho en em
  de la cifra más larga del caso (`anchoCifras()`, calibrado en Chromium: Doto es monoespaciada, 0,54 em por carácter
  con −0,06 em de tracking; se usa 0,55 y 0,32 para el `span.punto`; «~1.200» → k = 3,07). La primera losa es la
  clara. Encendido al 40 %: Doto `--dw` 100 → 700 en 400 ms `--curva-salida` con 60 ms de escalonado; con RM, 700 sin
  transición. El `h2` «Impacto» va `sr-only`; la frase `impact` del caso sigue debajo (no se pierde contenido).
- **Problema / Mi parte** (`CaseNarrative`): dos bloques de dos columnas (`h2` Urbanist 30 | prosa 18 px ≤ 34 em;
  lista con guion).
- **Decisiones** (`CaseDecisions`): una losa por decisión, título + cuerpo.
- **Producto**: película, capítulos (`story`), galería y funciones de los casos largos, en su orden, dentro de
  `#producto`. Esas bandas conservan su maquetación y reciben los tokens B por herencia (ver desvío 2).
- **Proceso** (`CaseProcess`): riel de fases cosido por el hilo láser, número en Doto; vertical en móvil.
- **Colofón** (`CaseColophon`): herramientas (chips `chip--losa`), **enlaces** (`links` o `externalLink`, salen de la
  ficha; `CaseLinks.tsx` se retira) y autoría, en 3 columnas. `<footer>` en página completa, `<div>` en la hoja.
- **Siguiente caso** (`CaseNext`, D19): losa azul jelly con cliente · periodo, nombre del proyecto y sus 3 primeras
  cifras en Doto (con `role="group"` y `aria-label`), junto a una losa clara «¿Quieres verlo en detalle? Te lo cuento
  en una llamada.» con «Hablemos» y «Todo el trabajo». En la hoja sigue siendo `<Link replace>`; en la página, `<a>`.
- **NDA** (`CaseNda`): el aviso y su viñeta dentro de una losa azul jelly (K4), botones `Boton`.
- **Índice lateral** (`CaseIndice.tsx`, nuevo): solo en la página completa ≥ 1280, sticky a 128 px, rótulos de las
  secciones presentes, hilo de 1 px que se llena de láser (`scaleY` = fracción leída de `.caso-secciones`, monótono)
  y punto de presencia con `aria-current="true"` sin transición.
- **«Secciones»** (`HojaSecciones.tsx`, nuevo): en la página completa el dock móvil cambia «Contacto» por
  «Secciones» en las rutas `/work/<slug>` y abre un `<dialog>` corto con los rótulos; dentro de la hoja (donde el dock
  queda bajo el velo) la hoja trae su botón «Secciones» al pie, solo < 1024. Elegir lleva a la sección y pone el foco
  en su `h2`. La trampa de Tab de `CaseSheet` deja pasar el foco del dialog anidado.
- **Página completa** (`CasePage`): rail de acciones, sprite de iconos y dock, como `/work`; lienzo `--vacio`.
- **404 nuevos** (`NotFoundContent`, `CaseNotFound`): en B (lienzo, resplandor, ceja, Urbanist), copy de 04 §4.5 con
  D17: «Aquí no hay nada.» / «Nothing here.», salidas «Ir al inicio · Ver casos · CV»; el de caso, «Este caso no
  existe, o todavía no está publicado.» + «Ver todos los casos» (a `/work`). Se retira «¿Perdido en el espacio?».
- **Diccionario**: rótulos B del caso (Impacto, Problema, Mi parte, Decisiones, Producto, Proceso, Enlaces,
  Plataformas, Secciones del caso), copy del siguiente caso, D17 «Abrir como página completa / Open as a full page»
  en la hoja.
- **Transiciones** (`globals.css`): `@view-transition { navigation: auto; }` y `.caso-cubierta` con
  `view-transition-name: caso-media`: «Abrir como página completa» (de la hoja a su página) transforma la media en su
  sitio en 400 ms `--curva-io`; el resto de documentos (siguiente caso, cambio de idioma) funde en 200 ms; con RM,
  solo fundido de 200 ms; sin la API, navegación instantánea. `/cv` no lleva nombre de transición.
- **D4** ya estaba: `ThemeToggle` solo en `/cv`. Las superficies del caso ignoran `data-theme` (`.caso-b` reasigna los
  tokens viejos a B); `/cv`, su tema y su PDF no se tocaron.

## Pruebas

| | Resultado |
|---|---|
| vitest | **257/257** (255 + 2 en `src/components/case/__tests__/caso.test.ts`: k de «~1.200» y mismo k para el caso; `platforms` con nombres conocidos, sin repetir, igual en ES y EN, y ausente donde el caso no lo dice) |
| lint · tsc · build | en verde |
| Playwright completo | PENDIENTE_PW |

`tests/e2e/caso.spec.ts` (30, nueva):
- **Ficha** ×3 (1440, 1024, 390; los 10 casos): sin fondo ni sombra, filete de 1 px, ≤ 2 bordes izquierdos, misma
  `top` por fila (±1), Equipo al final y a todo el ancho (±1), orden de los `dt`; a 390×844 la ficha acaba sobre el
  dock.
- **Tablero** ×8 (1440, 1280, 1024, 390 × ES/EN; los 6 casos con KPIs): una línea (alto ≤ 1,1 × `font-size`), sin
  desborde, mismo `font-size` en el caso, ≤ 72 (≤ 48 a < 1024), losa = contenido + padding (±1,5), primera clara.
  Más: Naowee «~1.200» con `span.punto` en ES y «~1,200» sin él en EN, axe AA del tablero; encendido 100 → 700 y RM.
- **Índice**: en Naowee, olbo y Banco de Occidente a 1440, cada `href` existe, al centrar cada sección su enlace
  tiene `aria-current="true"` y el `scaleY` del hilo no baja; oculto a 1024 y 390.
- **Hoja** ×4 (Naowee, Andes, olbo, DC Medical): mismos títulos, imágenes y KPIs que la página completa, sin índice,
  título a 72 (60 si el nombre es largo), «Abrir como página completa» con `href` = URL real. A 390: título a 48 y
  «Secciones» abre la lista y lleva el foco al `h2` de «Mi parte».
- **Dock**: en un caso, «Secciones» reemplaza a Contacto y lleva el foco al `h2` de «Decisiones»; en `/work`, no.
- **Contenido frente a F6** (ES y EN, los 10 casos): `tests/e2e/fixtures/caso-base-F6.json` se tomó de la página
  completa de F6 antes de tocar nada (`next build` + `next start`): cada bloque de texto de ≥ 40 caracteres de
  `main` sigue presente, y `h2`, imágenes y vídeos no bajan. El vídeo sigue en pausa a los 2 s. Tema `light`: el caso
  sigue en `--vacio`.
- **Transiciones y 404**: regla `@view-transition` presente y `caso-media` en la cubierta; los tres 404 dan 404,
  título y ceja nuevos, lienzo B con tema `light` y axe sin violaciones.

Pruebas existentes cambiadas, con motivo:
- `layout 5.5`: medía el `h2` «Decisiones clave» fijo en el canal izquierdo; la plantilla B ya no fija rótulos de
  banda. Ahora mide lo que acompaña la lectura, el índice lateral: `sticky`, fijado (no en flujo), `top` ≥ 64 y bajo
  la cabecera. `sticky S1` solo registra (sin aserciones) y queda igual.
- `i18n I5`: las palabras que no deben filtrarse al otro idioma pasan a los rótulos nuevos («Mi parte», «Secciones del
  caso», «Ver casos» / «My part», «Case study sections», «See case studies»).
- `frames F1–F3`, `measure M1`, `motion 7.4`, `visual`, `print 8.x`, `theme.tokens`: pasan sin cambios (ni radio ni
  sombra de los marcos de `/work/chub` cambiaron; `themeColor` y el primer `:root` tampoco).

## Peso y LCP de `/` (`perf.spec`, mediana de 3 en frío, servidor solo; `perf-F7.json`)

| Perfil | F6 informado (`perf-F6.json`) | **F6 medido hoy** (misma máquina, 5 corridas) | **F7** (`perf-F7.json`, 3) | F7, 5 corridas | Elemento LCP |
|---|---|---|---|---|---|
| Móvil | 1.036 ms | 1.036 ms (1.020–1.060) | **1.068 ms** (1.064–1.088) | 1.052 ms (1.040–1.056) | `span.claim` (K2) |
| Escritorio | 376 ms | 420 ms (400–436) | **432 ms** (428–452) | 420 ms (408–460) | `img.k1-poster` |

- **Sin regresión de LCP.** Como el número de F6 de escritorio (376) salió más bajo que lo que da hoy esta máquina,
  se reconstruyó F6 (`d6c7518`) en un worktree y se midió con el mismo `perf.spec`, a continuación y con el servidor
  solo: F6 da 1.036 / 420 y F7 1.052 / 420 (medianas de 5). Los rangos se solapan; el móvil queda +16 ms, dentro del
  ruido de F6 (1.020–1.060). El CSS del caso no viaja con `/` (comprobado en el HTML de `/`).
- **JS inicial de `/`: 158,2 KB gz** (F6 medido hoy: 158,1; presupuesto ≤ 172,6). El +0,1 KB es el botón
  «Secciones» del dock y su icono. Una primera versión subía 0,7 KB porque el dock importaba la constante del evento
  desde `HojaSecciones` y arrastraba ese módulo al home; ahora vive en `case/eventos.ts`.
- CLS sin cambios (móvil 0,0655, el pendiente de F5; escritorio 0,0005).

## Capturas (`F7-capturas/`, `next build` + `next start`, DPR 1, RM; `npx tsx scripts/shots-f7.ts`)

- `hoja-{naowee-suid,mercadolibre-andes,olbo,dc-medical}-es-{1440,390}.jpg`: la hoja abierta desde el home.
- `completa-…-es-{1440,390}.jpg` (pliegue) y `entera-…-es-{1440,390}.jpg` (página entera) por URL directa.
- `hoja-naowee-suid-en-*.jpg`, `completa-naowee-suid-en-*.jpg`, `entera-naowee-suid-en-*.jpg`: la versión en inglés.
- `404-es-1440.jpg` y `404-caso-es-1440.jpg`.

## Desvíos del plan y por qué

1. **Títulos largos bajan un paso.** El plan pide `h1` a 120 (72 en la hoja). La maqueta usaba «Naowee», pero el
   dato es `project` («Naowee — Plataforma del sector deportivo», «Banco de Occidente — Design System»): a 120 en 7
   columnas eran 4–5 líneas. Con más de 18 caracteres (`data-largo`) el título va a 72 en la página (48 a < 1024) y a
   60 en la hoja (36 a < 1024). Los nombres de una palabra (olbo, Chub, Qrvey…) van a 120 / 72. Cambiar el umbral es
   una línea en `CaseHeader.tsx`.
2. **Las bandas largas (capítulos, película, galería, funciones, vitrina, testimonio) no se reescribieron una por
   una.** Dentro de `.caso-b` los tokens viejos (`--paper`, `--ink`, `--signal`, `--font-display`, `--font-mono`…) y
   sus `--color-*` de Tailwind apuntan a los de B, y las cejas en mayúsculas espaciadas pasan a caja normal. Así quedan
   en el lienzo oscuro, en Urbanist / Instrument Sans y sin mirar `data-theme`, sin tocar su maquetación (la de olbo,
   DC Medical y MakeaPet es extensa y ya estaba probada). Rehacerlas como losas es pulido para la QA de F7 o F8.
3. **Decisiones sin «tensión / elección / por qué».** La maqueta los separa con copy propio que los datos no tienen
   (`decisions` es título + cuerpo). No se inventó texto: cada losa lleva el título y el cuerpo entero, y no lleva
   figura al lado porque los casos no asocian imagen a cada decisión.
4. **El gancho del siguiente caso sale de su losa.** En F6 la banda «Siguiente» mostraba el gancho del otro caso;
   sobre el jelly azul el blanco da 4,87:1 en su peor punto y `a11y 3.1` exige 7:1 al texto de párrafo. Es texto de
   ese otro caso y sigue en su portada; la prueba de contenido lo excluye de forma explícita (solo lo que también está
   en la línea base del caso siguiente).
5. **Morph sin `<ViewTransition>` de React.** Un clic en una card abre la hoja (D21), así que el único paso de
   «lista → página completa» sin hoja es un documento nuevo (Cmd+clic, «Abrir como página completa», recarga). Para
   eso basta la transición entre documentos de CSS (`@view-transition` + `caso-media`), sin JS ni la bandera
   experimental de Next; `WorkIndexPage` no cambió. La prueba comprueba la regla y el nombre; la animación en sí
   (400 ms) no se mide en headless.
6. **La hoja del caso tiene su botón «Secciones».** El plan dice que el dock cambia «Contacto» por «Secciones»; con la
   hoja abierta el dock queda bajo el velo modal (inerte), así que la hoja lleva su propio botón al pie (< 1024) que
   abre la misma lista.
7. **Índice: la sección actual es la última cuyo borde superior pasó el centro de la ventana**, y el hilo es la
   fracción de `.caso-secciones` por encima de ese centro (no la del documento): así crece solo con la lectura del
   cuerpo y llega a 1 al final del caso, no del pie.

## Pendientes

- QA visual y crítica de F7 (matriz de `ROUTES` y la hoja de 4 casos; lente de reclutador y de director de diseño
  contra `shot_P_caso_*`).
- Rehacer como losas B las bandas largas heredadas (desvío 2), si la crítica lo pide.
- Plataformas de Banco de Occidente, Qrvey e Ideaware: sin dato en el caso; se añaden cuando Doug las confirme
  (`platforms` en `work.ts`).
- Safari/Firefox reales (la transición entre documentos solo existe en Chromium) y VoiceOver → F8.
- CLS móvil 0,066 de F5 sigue abierto (no es de F7).
