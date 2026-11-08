# Propuesta B · Páginas internas

Doug aprobó B: la vista del OS (`referencias/ref-8-landing-elegido-B-os.jpg`) con el lockup «corte láser» de
`B-tipo` (opción 4). Estas son las páginas que siguen, con el mismo sistema de B: tokens, rejilla de 12 columnas,
rail de acciones, pills (la activa es la pill blanca), Doto solo para cifras y fechas, rojo láser = presencia (luz,
nunca relleno) y, como en la landing, como mucho una losa azul, una magenta y una clara por bloque (P2-6).

| Archivo | Qué es |
|---|---|
| `work.html` | `/work`: índice de los 10 casos, con filtros |
| `caso.html` | `/work/naowee-suid`: el caso completo. Con `?modo=hoja`, la misma pieza abierta como hoja sobre el índice |
| `about.html` | `/about`: perfil, con la foto a pantalla completa al entrar |
| `experience.html` | `/experience`: la trayectoria como motion graphics ligados al scroll |

Hay que servir la **raíz del repo** (`python3 -m http.server` en `/home/user/douguizard`) y abrir
`/docs/rediseno-2026/propuestas/B-paginas/work.html`.

- Parámetros: `?lang=en`, `?rm=1` (movimiento reducido), `?captura=1` (sin entrada ni suavizado del scrub) y
  `?modo=hoja` (solo en `caso.html`).
- Los cuatro archivos son autocontenidos (CSS y JS dentro). Se generan con
  `scratchpad/B/pag/build.py` a partir de piezas compartidas (`common.css`, `common.js`, la cabecera, el rail, el dock
  y el pie). Por eso la cabecera, el rail y los tokens son idénticos en las cuatro páginas.
- Las fuentes salen de `../fonts/`: Urbanist, Instrument Sans, Doto y Geologica. GSAP 3.12.5 y ScrollTrigger se cargan
  desde cdnjs. En este entorno cdnjs está bloqueado, así que para las capturas se sirvió la misma versión desde npm.

---

## 1. Decisiones

### Navegación común

- La pill activa es la de la página (`aria-current="page"`). La marca «douguizard» va en Geologica 600 con SHRP 100
  (la voz del lockup) y lleva a la home de B.
- El rail es el mismo de B: Escríbeme, CV, LinkedIn, Behance, GitHub y Volver arriba.
- El switch ES/EN reescribe todos los textos, los `aria-label`, los `alt`, el `title` y la `description`, y cambia
  `lang`. Los enlaces internos conservan el idioma (`?lang=en`). En producción serían `/` ↔ `/en` con la misma ruta y
  el mismo hash.
- **Dock móvil con 5 destinos:** Trabajo · Perfil · Experiencia · CV · Contacto. Experiencia es una página, así que
  entra en el dock (04 §4.2 tenía 4 destinos sin ella). En `caso.html`, «Contacto» deja su lugar a «Secciones», porque
  el cierre del caso ya trae «Hablemos».

### `/work`

- Arriba, «Trabajo» a 120 px con el intro de 04 §6.3 y una losa blanca «En cifras» (12 · 10 · 3, copy de K12): es el
  respiro claro del pliegue.
- Filtros (Todos · Escala · Productos propios · Anteriores). Es un grupo de botones con `aria-pressed`, en el flujo
  (sin `sticky`, ver §7), con anuncio en `aria-live`. El reflujo usa la View Transitions API (cada losa tiene `view-transition-name`).
  Sin la API, el cambio es directo.
- **Los largos van como losas protagonistas**, cada una con un solo protagonista (captura o cifra):
  - Naowee (7 × 4, oscura con captura)
  - Andes (5 × 4, jelly azul: la cifra es la imagen del caso NDA)
  - olbo (niebla con el teléfono)
  - Banco de Occidente
  - DC Medical
  - MakeaPet (la única magenta)
- **Los cortos van al archivo**, en filas `{num} · {proyecto} · {cliente} · {año} · Leer el caso`: Royal Caribbean,
  Qrvey, Ideaware y Chub.
- La rejilla se coloca sola por spans, sin `grid-template-areas`. Así, al filtrar, las losas refluyen sin huecos y el
  orden del DOM sigue siendo el orden visual.
- **«Leído»** (04 §6.3) se guarda por visitante en `localStorage` y aparece en Naowee después de abrir el caso.

### `/work/naowee-suid`: una pieza, dos contenedores

- **Plantilla de 02 §5.3**, en orden:
  1. Portada: ceja, H1 de 120 px, gancho y ficha (Rol · Duración · Equipo · Plataformas).
  2. Captura a sangre.
  3. Tablero de impacto: 30 · ~1.200 · 130+ · 38+ en Doto, con la primera cifra en losa blanca.
  4. Problema.
  5. Mi parte.
  6. Decisiones: cada una con tensión, elección y por qué, y su evidencia al lado.
  7. Producto: video con póster, sin autoplay, y una galería con los captions de `es/work.ts`.
  8. Proceso: un riel de 3 fases cosido por el hilo láser.
  9. Colofón: herramientas, enlaces y autoría.
  10. Siguiente caso (Andes, `getNextCaseStudy`) y «Hablemos».

  No hay testimonio, porque el caso no tiene.
- **Índice lateral fijo** (Impacto · Problema · Mi parte · Decisiones · Producto · Proceso). Es un hilo de 1 px que se
  llena de luz láser con la lectura, y la sección actual lleva el punto de presencia. En móvil, «Secciones» en el dock
  abre una hoja corta con los mismos rótulos.
- **Dos contenedores para el mismo `<article>`:**
  - Por defecto, `caso.html` es la página completa.
  - Con un clic simple en la losa de Naowee (en `/work`, o en el fondo del índice) se abre `caso.html?modo=hoja`: el
    índice queda debajo y el mismo `<article>` se muda a un `<dialog>` modal.
  - Dentro de la hoja no hay índice lateral (el progreso va en el hilo láser de la cabecera de la hoja), la columna es
    única y el H1 baja a 72 px.
  - La hoja tiene Cerrar, Esc, velo, arrastre hacia abajo (por velocidad o por más de 120 px), foco atrapado nativo y
    el botón «Abrir como página completa».
  - Al cerrar vuelve al índice (Atrás si veníamos de ahí).
  - Con cmd, ctrl o clic medio se abre la página completa en otra pestaña.

### `/about`

- **Portada:** la foto a pantalla completa con el vidrio estriado (el motor WebGL de B: un pase, lente que sigue al
  cursor y respaldo CSS). El lockup «Doug / Vargas» va en Geologica, partido por el haz. El nombre se coloca para que el
  láser de la foto pase justo por el corte de «Vargas». La posición se mide y se corrige después del primer layout.
- **Con el scroll** (sticky de 210 svh y scrub, sin pin, así que la rueda siempre mueve la página), en este orden:
  - el corte se cierra (p de 0 a 0,3);
  - el vidrio **se abre** (fuerza de .62 a .08: conocer a Doug es verlo sin estrías);
  - la foto se acomoda como losa en las columnas 8–12 (p de 0 a 0,7);
  - entra la bio de tres frases (p de 0,5 a 0,8).

  El hilo deja de cruzar el nombre (se recorta hacia la losa).
- Después vienen, en este orden:
  - contexto (2 párrafos);
  - «Lo que hago»: 3 losas, la de Sistemas en jelly azul;
  - «Cómo trabajo»: losa blanca con un diagrama de 4 nodos cosidos por el hilo;
  - «Datos» y «Con qué trabajo» (de `cv.tools`);
  - «Dónde he trabajado» (`getWordmarks()`, en la voz Geologica);
  - las tres citas verbatim con `lang="en"` (la del centro en magenta);
  - el cierre «Lo demás está en el trabajo.» con Ver casos y Descargar CV.

### `/experience`: motion graphics de la trayectoria

- **La línea láser es el eje.** La escena se ancla (`pin`) durante 3,6 viewports con `scrub: 0.5`. El scroll se reparte
  por hito (cada uno recibe 1/10 del recorrido) y el año interpola dentro del tramo, de 2006,0 a 2026,83 (hoy, nov 2026).
  - Un **odómetro Doto de 120 px** rueda año a año: cuatro columnas de dígitos, y cada cambio es un giro de 260 ms
    `--ease-out`.
  - La **era** (Base · Producto · Sistemas · Escala · Dirección, de 04 §6.2) cambia de nombre y se ilumina en el eje.
  - Cada **hito** (empresa, cargo del CV, periodo y logro de 04 §6.2) entra cuando el contador llega a su inicio:
    fundido + 12 px en 240 ms.
  - Cada **tramo** se dibuja sobre el eje con su duración proporcional (`scaleX` ligado al año).
  - El recorrido del eje es luz láser y el cabezal es el punto de presencia.
  - Los **acumulados** suben en Doto con un «encendido» de peso: años en producto digital (desde Smartbiz, oct 2014),
    empresas (las 6 de 04 §6.2) y casos publicados (los 7 hitos con caso, Chub incluido, más 3 productos propios = 10,
    la misma cuenta que `/work`). Antes del primer valor muestran un guion, no «0».
  - A la derecha del eje va la **pista de productos propios**: olbo, DC Medical y MakeaPet, de 2026. Chub es un hito
    («Freelance · Chub», 2018, en paralelo), como en el archivo de `/work`.
- **Móvil:** la línea es vertical y no hay ancla. Arriba hay una barra fija con el contador de 48 px y los acumulados.
  El hito que cruza el 55 % de la pantalla es el activo y fija el año. La línea se llena de láser con el scroll y cada
  hito lleva una barra de duración (40 px por año).
- **Movimiento reducido o sin GSAP:** la línea completa y estática, todos los tramos dibujados, el contador en 2026 y
  todos los hitos visibles en rejilla.
- El `<ol>` de hitos está siempre completo en el DOM, en orden, para teclado y lectores de pantalla. Las losas que no
  están activas siguen en el árbol accesible.

---

## 2. Motion

| Qué | Disparo | Duración y curva |
|---|---|---|
| Hover de losa: sube 2 px, la media escala a 1,03, la flecha gira 45° y Doto pasa a 900 | Puntero fino | 200 ms `--ease-out` |
| Pressed | `:active` | Losa a escala .98 y botón a .97, 120 ms |
| Filtros de `/work` | Clic | View Transition del navegador (unos 250 ms), sin animación con movimiento reducido |
| Hoja | Abrir / cerrar | 420 / 280 ms `--ease-drawer`. Velo con blur 8. Arrastre con banda elástica |
| Tablero de impacto | Entrar en vista (40 %) | Doto de peso 100 a 700, 400 ms `--ease-out`, 60 ms de escalonado |
| Índice del caso | Scroll | El hilo se llena (`scaleY`) y el punto de presencia salta de sección (sin transición) |
| `/about`: entrada | Carga | Textos con opacidad y +16 px, 600 ms `expo.out`, 60 ms de escalonado. Láser con `scaleX`, 700 ms `power3.inOut`. Corte de «Vargas» a los 880 ms, en 520 ms `--ease-out` |
| `/about`: portada a losa | Scroll (sticky, scrub 0,3) | Foto en cúbica in-out entre p 0 y 0,7. Vidrio de .62 a .08 entre p 0 y 0,85. Corte cerrado entre 0 y 0,3. Bio entre 0,5 y 0,8 |
| Lente del vidrio | Cursor o arrastre | Muelles X/Y críticamente amortiguados (respuesta 0,35 s). Entra con k = 7 y sale con k = 4 |
| `/experience`: año | Scroll (pin de 3,6 vh, scrub 0,5) | Por hito (1/n del recorrido cada uno), lineal en años dentro del tramo. Odómetro en 260 ms `--ease-out`. Hito en 240 ms. Acumulados con encendido de 360 ms |
| Movimiento reducido | — | Sin pin, sin sticky, sin lente ni entrada. Fundidos de 150 ms |

---

## 3. Datos y dónde se apartan de la fuente

- **Fechas:** todas salen de `src/data/cv.ts`.
  - Royal Caribbean dura 15 meses (ago 2017 – nov 2018), no «1 año».
  - Ideaware va de mar a oct de 2016.
  - Qrvey va de oct de 2016 a ago de 2017.

  Es lo mismo que marcan P9–P11 de 04 §7.
- **Ancla de años:** 12, contados desde Smartbiz (oct 2014 → nov 2026), igual que `CAREER_ANCHOR`. El comentario de
  `cv.ts` («11 years today») quedó viejo. P5 sigue abierta: desde el freelance serían 16.
- **Universidad** (2006–2009): `cv.ts` da solo años; el tramo se dibuja hasta fin de 2009.
- **Productos propios** de 2026: solo tienen año, así que se colocan en ene 2026. No se inventaron meses.
- **Naowee · «Mi parte»:** se quitó el `[DATO A CONFIRMAR CON DOUG]` de la última línea. Se publica sin el hueco, como
  manda 04 §0.
- **Proceso:** los cuerpos son los de `es/work.ts` (≈ 30 palabras). 04 pedía ≤ 25 y queda para el writer.
- **Acumulados:** no se sumaron «equipos» ni «países». La cifra de 18 países aparece en el hito de Mercadolibre, que es
  su fuente. Sumarla como acumulado sería inventar un dato.
- **Formato de cifras:** el ES usa punto de miles (`2.000+`, `~1.200`) y el EN usa coma (`2,000+`, `~1,200`). El
  switch reescribe también las cifras Doto.

## 4. Qué quedó simulado o pendiente

- Solo el caso de Naowee existe. Las demás losas y filas enlazan a las rutas de producción (`/work/<slug>`), que no
  existen en la maqueta.
- El PDF del CV, `/cv` y los perfiles de LinkedIn y Behance son de relleno (como en B).
- La foto del héroe es la provisional `199598aa.jpg`.
- **Microcopy nuevo, a validar con el writer:**
  - «Desliza» / «Scroll»
  - «Abrir como página completa» / «Open as a full page»
  - «Cerrar» / «Close»
  - «Hoy» / «Now» (es el chip de 04)
  - el anuncio de filtro «N casos» / «N case studies»
  - «Secciones» / «Sections» (este sí está en 04 §5.0)
- La View Transition de los filtros se probó en Chromium. En navegadores sin la API el filtro cambia sin animación.

## 5. Capturas (`shot_P_*`, DPR 1, JPG 82)

| Página | Capturas |
|---|---|
| work | `work_1440_pliegue`, `work_1440_completa`, `work_390_pliegue`, `work_390_completa`, `work_1440_en` |
| caso | `caso_1440_pliegue`, `caso_1440_completa`, `caso_390_pliegue`, `caso_390_completa`; hoja: `caso_1440_hoja`, `caso_1440_hoja_tablero`, `caso_390_hoja`; `caso_1440_en` |
| about | `about_1440_pliegue`, `about_1440_losa` (el estado final del scroll), `about_1440_cursor`, `about_1440_completa` (con movimiento reducido), `about_390_pliegue`, `about_390_completa`, `about_1440_en` |
| experience | escritorio: `experience_1440_000`, `_025`, `_050`, `_075`, `_100`, `experience_1440_pliegue`; movimiento reducido: `experience_1440_rm`, `experience_1440_completa`; móvil: `experience_390_pliegue`, `experience_390_000`, `_050`, `_100`, `experience_390_completa`; `experience_1440_en` |

En todas las capturas cargaron Urbanist, Instrument Sans, Doto y Geologica (estado `loaded`), sin desborde horizontal
ni errores de consola. Se esperó a que no hubiera ninguna corrida de Playwright del ejecutor de F0.

## 6. Corrección del punto de miles en Doto (6 nov)

En el subconjunto de Doto, el glifo «.» tiene cola y se lee como coma: «~1.200» se veía como «~1,200» en ES. El texto
siempre fue correcto. Ahora `puntosDoto()` envuelve el «.» de miles de cada cifra Doto en un `span.punto`. El glifo
queda transparente y un `::after` dibuja un solo punto redondo, del tamaño de los de la matriz, sobre la línea base.
El «.» real sigue en el texto, así que copiar y los lectores de pantalla no cambian. Se aplica después de cada cambio
de idioma; el EN usa coma y no se toca.

El mismo arreglo (unas líneas de CSS y JS) se aplicó en `propuestas/B/index.html`, donde K4 mostraba «2.000+» como
«2,000+». Las capturas `shot_B_*` de B no se regeneraron.

## 7. Cambios tras la crítica (`06-CRITICA-PAGINAS.md` §4, 6 nov)

Los 14 puntos de §4 (P0-1 y los 13 P1), en el orden de la lista. Se respetó §3 y las decisiones de Doug: lockup
«corte láser» en escritorio, Geologica / Urbanist / Instrument Sans / Doto solo en cifras, héroe sin máscara. Los
archivos se editaron a mano (el `build.py` del scratchpad ya no existe): las piezas comunes no cambiaron.

| # | Arreglo | Qué cambió | Archivo |
|---|---|---|---|
| 1 | **P0-1** Tab en hitos invisibles | `focusin` en cada `<li>` del `<ol>`: el foco lleva la escena al tramo de ese hito (`scrollTo` instantáneo + `progress(1)` del scrub), el hito se activa y el foco se ve. El `<ol>` sigue completo para teclado y lectores; no hizo falta `inert`. | `experience.html` (JS de `montar`) |
| 2 | **P1-4** Una sola cuenta de propios | `PROPIOS` = olbo, DC Medical, MakeaPet (3, como `/work`). Chub pasa a ser un hito «Freelance · Chub» (2018, en paralelo, con «Ver caso»), sin tramo propio en el eje para no pisar a Globant. «Casos publicados» = 7 hitos con caso + 3 propios = 10, el mismo total que `/work`. | `experience.html` |
| 3 | **P1-8** No abre en «0 · 0 · 0» | Mientras el valor es 0 el `dd` va vacío y dibuja un guion largo (barra en `--tinta-3`, no depende del subconjunto de Doto); la losa queda a opacidad .6 hasta el primer valor ≥ 1. | `experience.html` (`ponerAc`, CSS de `.acumulados`) |
| 4 | **P1-9** Scroll por hito | `yDe(p)`: cada hito recibe 1/n del recorrido y el año interpola dentro de su tramo. El eje sigue con duraciones proporcionales; solo cambia la velocidad del cabezal. Pin de 4,2 → 3,6 viewports. | `experience.html` |
| 5 | **P1-10** Escena completa en portátiles | En `max-height: 820px`: `.exp-izq` y `.hitos` a `calc(100svh - 360px)`, eje sin `padding-top`, tramos y años más bajos, y la pista de propios a la derecha del eje (misma franja) en vez de debajo. Medido: el eje acaba en y = 868/900 (1440), 744/768 (1366) y 696/720 (1280), y la losa del hito no desborda. | `experience.html` |
| 6 | **P1-11** Hitos inactivos legibles en móvil | `.hito.fuera`: opacidad 1; baja el material (fondo transparente + filo `--losa-borde`), no el texto. Medido sobre el vacío: rol y periodo **7,91:1**, título y logro **18,59:1** (antes 1,93:1 y 3,03:1). | `experience.html` (móvil) |
| 7 | **P1-12** Pista sin choques | La pista es una columna de 140 px a la derecha del eje («Productos propios · 2026»): punto + nombre a la derecha del punto, apilados hacia abajo, sin año propio (2026 ya está en el eje). Nada se monta sobre la fila de años. | `experience.html` |
| 8 | **P1-7** Un solo láser en `/about` móvil | Opción (a): en móvil, sin hilo en el nombre y «Vargas» entero (sin `clip-path` ni mitad inferior); el láser queda solo en la foto. Escritorio intacto. | `about.html` (móvil) |
| 9 | **P1-5** Ficha sin escalera | Lista de definición sin cajas: 2 × 2 con filete superior, orden Rol · Duración · Plataformas · Equipo (ancha al final). Cierra en rectángulo. En móvil `gap` 12/16 y `dd` a 16: la portada del caso entra en el pliegue (y = 575 de 844; antes quedaba fuera). | `caso.html` |
| 10 | **P1-6** Tablero que remata | Cifra a 72 px (`min(72px, 100cqi / 3,05)` para que «~1.200» no se parta: 69 px a 1440, igual en las cuatro), etiqueta en `--tinta-2` (`--tinta-osc-2` en la blanca), `min-height: 0`: la losa mide lo que lleva. En móvil 48 px con el mismo tope. | `caso.html` |
| 11 | **P1-1** Numeración en orden | Naowee /01, Andes /02, olbo /03; el resto ya seguía (/04…/10). | `work.html` |
| 12 | **P1-2** Filtros sin flotar | Sin `sticky` en escritorio ni en móvil: los filtros van en el flujo bajo «En cifras». Con P2-1 (misma línea): `h1` a 96 y filtros a 32 px del bloque. | `work.html` |
| 13 | **P1-3** Un caso en el pliegue móvil | «En cifras» en fila compacta (padding 12/16, cifras a 30, etiquetas a 12, sin ceja visible; el `aria-label` del grupo sigue), `h1` a 60 y filtros a 16. La captura de Naowee entra entera sobre el dock (`shot_P_work_390_pliegue`). | `work.html` (móvil) |
| 14 | **P1-13** Alineaciones de `/about` | «Lo que hago»: rejilla `auto · 64 px · título · párrafo`, los tres títulos a la misma altura (medido: los tres en y = 1421). Marca «Citas originales en inglés» a la derecha, en la línea base del H2 (`flex` + `last baseline`). Marcas en 2 filas de 4 a 18 px (2 columnas en móvil): ninguna huérfana. | `about.html` |

**P2 aplicados de paso:** P2-1 (h1 de `/work` a 96, en la misma regla que P1-2) y P2-6 (la nota de la intro de este
archivo, corregida). El resto de P2 queda pendiente.

**Lo que no quedó al pie de la letra y por qué:**
- P1-3 pedía etiquetas de «En cifras» en una línea: a 390 «años en producto digital» no cabe en un tercio a 12 px.
  Quedan en 2 líneas; aun así la captura de Naowee entra entera.
- P1-6 pedía 72 px exactos: «~1.200» mide ≈ 3 em y a 72 no cabe en una losa de 211 px sin partirse en dos líneas
  (se vio en la revisión). Se dejó el tope por ancho de contenedor, igual para las cuatro cifras.
- P1-13 proponía `grid-template-rows: auto 1fr auto auto`: con párrafos de largo distinto eso no alinea los títulos
  (el `1fr` absorbe la diferencia). Se usó una distancia fija (64 px; 32 en móvil) entre número y título.

**Verificación (Chromium, DPR 1, GSAP 3.12.5 desde npm):**
- Prueba de Tab en las 4 páginas a 1440×900, 1280×720 y 390×844 táctil: **291 paradas, 0 en elementos invisibles**
  (opacidad acumulada 1, visibles, dentro del viewport; 420 ms tras cada Tab). La misma prueba sobre el
  `experience.html` anterior reproduce el P0: 6 paradas con opacidad 0.
- Sin desborde horizontal ni errores de consola en ninguna captura; las cuatro familias en `loaded`.

Capturas nuevas o regeneradas en esta ronda (todas las `shot_P_*` de §5, más): `work_1440_scroll` (scroll 1300, donde
antes flotaban los filtros), `work_1366_pliegue`, `work_1280_pliegue`, `caso_1440_tablero`, `caso_1366_pliegue`,
`caso_1280_pliegue`, `about_1440_hago`, `about_1366_pliegue`, `about_1280_pliegue`, `experience_1366_000/050/100` y
`experience_1280_000/050/100`.
