# Propuesta B · «Cine → Sistema operativo»

**Concepto en una frase:** la línea láser que cruza los ojos de Doug es el hilo del sitio: corta el retrato a pantalla
completa, lo encoge hasta volverlo una losa y se queda cosiendo el tablero.

Archivo: `index.html` (autocontenido; fuentes en `../fonts/`; GSAP 3.12.5 y ScrollTrigger desde cdnjs). Hay que servirlo
con un servidor estático (`npx http-server .` desde la raíz del repo, y abrir `/docs/rediseno-2026/propuestas/B/`).
Con `file://`, Chrome no deja subir la foto a WebGL y se ve el respaldo CSS. Parámetros de prueba: `?lang=en`, `?rm=1`
(simula movimiento reducido) y `?captura=1` (sin snap y sin entrada).

**Cambio de Doug aplicado (4–5 nov):** la máscara y su revelado se quitaron del todo. No hay botón, ni pista, ni copy de
«quitar la máscara». El cursor solo abre y aclara el vidrio. El título de K13 («Doug, sin máscara») dependía de esa
narrativa, así que se cambió por la frase de apoyo de la misma card en 04-COPY: «Diseñador de producto que construye.»
Hay que confirmarlo con el writer.

---

## 1. Decisiones de dirección

| Decisión | Por qué |
|---|---|
| **Acto 1 = la cara, y además el test de 5 s.** El primer pliegue trae el nombre en display (120 px), el H1 (04 §2.1 A), la línea de nivel, Mercadolibre, la disponibilidad y dos CTA (Ver casos · Descargar CV). Todo va en el panel K2, de vidrio oscuro, que monta sobre la chaqueta. | Responde a la crítica central de 02 §8: B fallaba el test de 5 s si el acto 1 era solo cara y nombre. |
| **El claim es K2 y cambia de material.** El panel del acto 1 es la misma losa K2 del OS: viaja a su celda y pasa de vidrio oscuro a losa blanca con una sola variable (`--m`, de 0 a 1, `color-mix`). | Continuidad real: no hay dos copias del H1, y la losa blanca (el respiro de 01 §2.4) nace de la transición. |
| **El nombre XL aterriza en la losa del retrato.** «Doug / Vargas» pasa de 120 px a 30 px por FLIP (translate + scale) hasta el panel de K1, como el «Bank Account» de ref-3. | El nombre y la cara se encogen juntos: la marca se vuelve parte del sistema. |
| **El vidrio estriado es parte de la transición.** De 12° oblicuo a 0° vertical, de 64 px a 30 px por franja, y la fuerza sube a mitad del viaje (las franjas «se cierran») y baja al llegar. | Disimula la baja resolución mientras la foto se reescala y termina en el vidrio vertical de ref-2 y ref-3. |
| **Rojo láser = luz, nunca material.** El rojo solo aparece como línea de 1 px con halo: el haz de la foto, el hilo del tablero, el indicador de scroll, el progreso de la hoja y el nodo «hoy» del timeline. Nunca es relleno, texto ni botón. | Así convive con el azul eléctrico y el magenta, que son **materiales** (rellenos jelly y la acción principal). Al tener un papel distinto no compite con ellos, y por eso no se lee gamer. El vidrio de 1 px no cuenta como neón. |
| **El hilo del tablero.** En el OS, la línea queda a la altura de los ojos de la losa K1 y pasa por detrás de las losas. Solo se ve en las calles de 16 px, en el margen y sobre la foto. | Es como un haz que atraviesa un rack. Es sutil y solo se nota en un segundo vistazo. |
| **Pills = dónde estoy, rail = qué hago.** Arriba, las pills de secciones (Trabajo · Perfil · Experiencia · CV) siguen el scroll (activa = pill blanca). A la izquierda, el rail es de acciones (Escríbeme en azul eléctrico, CV, LinkedIn, Behance, GitHub, Volver arriba) y no navega. | 02 §8 critica que «el dock lateral duplica el header». Aquí cada uno tiene un trabajo distinto. |
| **Spotlight de grupo.** Al tocar una pill o un CTA, el tablero baja a 60 % las losas de otros grupos durante 1,4 s (con un velo en `::before`, sin tocar la opacidad que maneja GSAP). | Es el «filtra o resalta» del OS de 02 §8, sin un estado de filtro que haya que recordar quitar. |
| **Los casos se abren en hoja** (Naowee implementado), con URL real (`#/work/naowee-suid` en la maqueta; en Next sería una ruta interceptada `@modal/(.)work/[slug]`). Con cmd, ctrl o clic medio se abre la página completa en otra pestaña. | Resuelve «abrir en pestañas para comparar». |
| **Tipografía.** Urbanist (display, 600), Instrument Sans (texto y UI, 400 y 500) y Doto (ROND 100, wght 700) solo para cifras, fechas y el reloj, nunca por debajo de 20 px. | 01 §4.3, par A. |
| **Proporción.** En el OS, una losa clara por bloque (K2, K7 niebla, K12, K15, K17), una sola azul (K4) y una sola magenta (K10). | 01 §2.2 y §2.4. |

### Rejilla
- **Escritorio (≥ 1024):** cabecera de 88 px (24 + pill de 40 + 24) y rail de 64 px (la rejilla empieza en x = 112).
  12 columnas, calle de 16 px y `--fila` = la sexta parte del pliegue útil, entre 96 y 128 px. Las seis primeras filas son
  el OS armado y caben justas en el viewport. Orden del DOM: K2, K1, K3, K4, K5, K6, K7… Es el orden visual de izquierda
  a derecha y de arriba abajo, sin `order` ni `dense`. K2 va antes que K1 para que el H1 sea lo primero que se lee.
- **Móvil (< 1024): el OS se vuelve app.** El héroe es la foto a sangre (100 svh) con K2 encima, abajo. Después vienen las
  secciones con título («Trabajo», «Experiencia», «Perfil», «Contacto», los mismos rótulos de la nav), un carrusel con
  scroll-snap para K7–K10 con contador y botones, el dock inferior (Trabajo · Perfil · CV · Contacto, que aparece al salir
  del héroe, donde ya están los CTA) y las hojas desde abajo con arrastre para cerrar.

---

## 2. Motion

| Qué | Cómo | Duración y curva |
|---|---|---|
| **Entrada al cargar** (una vez, solo en el acto 1) | Los ítems de la barra se materializan (opacidad, y −8 px, blur 8 → 0), con 40 ms de escalonado. Las dos líneas del nombre suben con una máscara (yPercent 105 → 0), con 80 ms de escalonado. El láser se enciende desde la cara hacia afuera (scaleX 0 → 1 con origen en la cara). K2 se materializa (opacidad, escala .96 → 1, blur 12 → 0). | Arranca a los 120 ms. Barra 360 ms; nombre 600 ms `expo.out` (≈ `--ease-out`); láser 700 ms `power3.inOut`; K2 600 ms. Todo termina antes de 1,1 s y el escalonado total es < 600 ms. El LCP (póster) no se anima. |
| **Scroll anclado** (acto 2) | `ScrollTrigger` con pin en la escena, recorrido de **1 viewport** y `scrub: 0.6`. Snap a 0 o a 1 solo después de 120 ms de inactividad (direccional, 250–600 ms, `power2.inOut`). | Timeline de 0 a 1 (abajo). |
| — Foto | El rectángulo pasa de pantalla completa a la celda de K1 (radio 0 → 48). Se reencuadra con cover y foco en la cara. | 0 → 0,72, cúbica in-out. |
| — Vidrio | Ángulo 12° → 0°, franja 64 → 30 px, fuerza .62 → .55 más una joroba de +.30 a mitad (`sin π·t`), fase +140 px. | Ligado a la foto. |
| — K2 | Viaja de abajo a la izquierda a su celda (x, y) y cambia de material (`--m` 0 → 1). El blur sube a 2 px y vuelve durante el cambio, para tapar el cruce de colores (emil · blur). | Viaje 0 → 0,6 `power2.inOut`; material 0,30 → 0,52. |
| — Nombre XL | FLIP hasta el panel de K1 (escala 0,25). Pasa por detrás de K2 (capas) y al final se cruza con el nombre real. | 0 → 0,72; fundido 0,66 → 0,8. |
| — Losas | Opacidad, escala .94 → 1, y 24 → 0, blur 8 → 0, y las cifras Doto «se encienden» (`--dw` 100 → 700). Entran como una onda radial desde K1: el retraso es proporcional a la distancia al centro de K1. | Cada una dura 0,3, y empiezan entre 0,2 y 0,62. `power2.out`. |
| — Rail | Entra desde la izquierda (x −112 → 0). | 0,5 → 0,8. |
| — Velo izquierdo e indicador | El velo se va (0 → 0,4). El indicador (un track de 1 px que se llena de rojo) se apaga al final. | — |
| **Cursor → vidrio** | Una lente sigue al puntero con muelles X/Y independientes, críticamente amortiguados (respuesta 0,35 s, sub-pasos de 1/240 s). Dentro de un disco de radio 0,5R a 1,2R la fuerza del vidrio va a 0, los filos de luz y sombra desaparecen y la imagen se aclara un 6 %. R es 240 px en el acto 1 y 150 px en la losa. La lente nace bajo el cursor (no viaja desde una esquina). | Entra con una exponencial de k = 7 (≈ 140 ms) y sale con k = 4 (≈ 250 ms). |
| **Táctil** | Al arrastrar sobre la foto, la lente sigue al dedo 1:1, sin inercia. `touch-action: pan-y`: el arrastre vertical sigue siendo scroll. Al entrar hay una deriva leve de fase que se asienta sola en menos de 9 s (WCAG 2.2.2). | — |
| **Hover / foco / pressed** | Hover (solo con puntero fino): la losa sube 2 px (`translate`), la media escala a 1,03, la flecha gira 45° y Doto pasa a peso 900. Foco: anillo de 2 px en `--electrico-texto` con 3 px de offset y el radio de la losa (`:has(:focus-visible)`). Pressed: losa a escala .98 y botones a .97. | 200 ms hover, 120 ms press, `--ease-out`. Se usan `translate` y `scale` (propiedades individuales) para no chocar con el `transform` de GSAP. |
| **Hoja** | Sube desde abajo con el velo (blur 8). Las cifras se encienden (`--dw` 100 → 700, 60 ms de escalonado). Cierra con Esc, con la X, al tocar el velo, con Atrás o arrastrando la cabecera (más de 120 px o más de 0,5 px/ms; banda elástica hacia arriba). Una línea láser de progreso acompaña el scroll interno. | Entra 420 ms `--ease-drawer`, sale 280 ms. |
| **Reduced motion** | Sin ancla, sin entrada, sin lente y sin deriva: el tablero aparece armado desde el primer píxel (K2 ya blanca y la foto ya en su losa). La hoja hace un fundido de 150 ms. | 150 ms lineal. |

---

## 3. Tokens (todos en `:root`)

- **Color:** `--vacio #060608`, `--losa #111214`, `--losa-alta #1A1B1F`, `--claro #F2F2F4`, `--niebla #E4E2EC`;
  textos `--tinta`, `--tinta-2`, `--tinta-3`, `--tinta-osc`, `--tinta-osc-2`. Acentos: `--electrico #2B56F3` (relleno),
  `--electrico-texto #5B7CFF` (foco), `--laser #FF3344` y `--laser-nucleo #FFE4E6` (solo luz), `--verde-osc #0E6B3D`
  (647 de olbo) y `--verde` (punto de estado). Etiquetas tintadas: `--azul-etiqueta #E3EAFF`, `--magenta-etiqueta`,
  `--magenta-etiqueta-base`.
- **Espacio:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. **Tipo:** 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 72 · 120.
- **Radios:** losa 48/36, M 32/28, S 24/20, XS 16, pill 999. Los anidados son concéntricos (radio de la losa − inset).
- **Sombras:** el bloom azul y el magenta (del color de la losa), `--sombra-flota` (lo que flota sobre la foto), `--sombra-hoja`
  y los filos internos `--filo` y `--filo-jelly`. Sin sombras grises genéricas.
- **Motion:** `--ease-out (.23,1,.32,1)`, `--ease-in-out (.77,0,.175,1)`, `--ease-drawer (.32,.72,0,1)`; duraciones
  `--d-press 120`, `--d-hover 200`, `--d-ui 240`, `--d-hoja 420`, `--d-hoja-salida 280`, `--d-entrada 600`.
- **Opacidades:** .05 · .1 · .2 · .4 · .6 · .8. **Toques:** `--toque 44`, `--boton-s 48`, `--boton 56`.

**Contraste medido sobre las capturas** (los píxeles de fondo, en el peor punto):

| Par | Resultado |
|---|---|
| Nombre XL sobre la foto con velo | 12,1:1 |
| Línea de nivel de K2 sobre vidrio oscuro | 6,6:1 |
| Rol del panel de K1 | 5,4:1 |
| Blanco sobre K4 en la zona de títulos | ≥ 5,9:1 |
| Chip NDA | 11,9:1 |
| `--tinta-osc-2` sobre claro | 6,6:1 |
| `--tinta-osc-2` sobre niebla | 5,8:1 |
| 647 verde sobre niebla | 5,1:1 |
| Foco sobre claro | 3,3:1 (no texto) |

Dos colores se corrigieron después de medir: las etiquetas de K4 (`#9DB4F5` daba 2,7:1 sobre el aro, ahora `#E3EAFF`) y
la etiqueta de K10 sobre la base lavanda (3,5:1, ahora `#FCE6F1`).

---

## 4. Cómo se resolvieron los riesgos de B (02 §8)

| Riesgo | Solución |
|---|---|
| Falla el test de 5 s | Nombre, H1, nivel, Mercadolibre, disponibilidad y los dos CTA están en el acto 1, en el primer pliegue, a 1440 y a 390. |
| Scroll secuestrado y largo | El ancla dura **un solo viewport** y la rueda siempre mueve la página (scrub). El snap solo actúa después de que el usuario suelta. «Ver casos», el skip link y Tab saltan directo al tablero armado. |
| Teclado y lectores de pantalla | El DOM está completo y en orden desde el principio. Las losas «ocultas» usan opacidad (no `visibility`), así que siguen en el árbol accesible. Si el foco entra a una losa sin armar, la página salta al final del ancla. Mientras están invisibles no reciben clics (`pointer-events`). El H1 es texto real. Las cifras Doto son texto con `aria-label` en el grupo. |
| Hoja modal | `<dialog>` con `showModal()` (foco atrapado y fondo inerte nativos), `overflow: clip` para que el foco no desplace el panel, foco inicial en Cerrar, Esc, Atrás y devolución del foco al enlace de origen. |
| LCP | El LCP es el `<img>` del retrato con `preload` y `fetchpriority="high"`, sin animar. El WebGL se monta en `requestIdleCallback` y aparece con un fundido de 200 ms. Sin WebGL queda el póster con franjas CSS. Sin el CDN de GSAP, el tablero aparece armado (probado con el CDN bloqueado). En producción: póster AVIF con el vidrio horneado (01 §3.1). |
| Baja resolución de la foto (880×1168) | A 1440×900 la foto se muestra a escala ≈ 1:1 (alto = 1,3 × viewport) y no se estira. El resto del ancho es el borde de la foto estirado, con mip borroso (bias de LOD) y oscurecido. El haz láser de la foto queda continuo de lado a lado. Las franjas y el blur de las estrías tapan el resto. |
| Rendimiento | Un solo pase de shader. Fuera de la losa redondeada se descarta el píxel. DPR máximo 1,5. El bucle solo corre mientras algo cambia (scroll, muelle, deriva). |
| Longitud en móvil | Sin ancla en móvil. Los cuatro casos de producto propio van en un solo carrusel y el timeline se reduce a 4 nodos. La página mide ≈ 5.600 px (≈ 6,6 pantallas a 844). Es medio pliegue más que la meta de 02, porque el héroe ocupa una pantalla. |
| Se diseña dos veces | Es el mismo código con dos geometrías: en escritorio, el rectángulo de cine pasa a la celda de K1; en móvil, la foto a sangre pasa a una losa con inset 12 y radio 36 al hacer scroll (sin ancla). |

---

## 5. Qué quedó simulado o pendiente

- **Foto provisional** `retratos-hf/199598aa.jpg`. La definitiva entra cambiando una sola línea
  (`IMG = { w, h, eye, face }`: tamaño, altura de la línea láser y elipse de la cara en coordenadas 0–1).
- **Solo el caso Naowee abre en hoja** (cabecera, ficha, tablero de 4 cifras, captura y problema). Las demás cards
  enlazan a las rutas de producción (`/work/…`, `/about`, `/experience`, `/cv`), que no existen en la maqueta.
- **Enlaces externos y PDF:** `/cv/doug-vargas-cv.pdf`, `/cv/carta` y los usuarios de LinkedIn y Behance son de relleno;
  el GitHub sale del repo.
- **Cifras** (12 años, 10 casos, 3 productos) escritas a mano. En producción son `{derivado}`.
- **Microcopy que no está en 04-COPY** y hay que validar: «Cerrar» / «Close» (hoja) y «Anterior» / «Siguiente» con
  «n de 4» (carrusel móvil); «Head of Product · Barranquilla» bajo el nombre de K1; el título nuevo de K13.
  Se omitió el apoyo de K8 (la cita ya cuenta la historia y la card no admitía tres protagonistas).
- **El retrato de K13** es `98153a04.jpg` (de la misma serie del láser), mostrado en tonos fríos.
- En la maqueta, GSAP se pide a cdnjs. Para las capturas se sirvió la misma versión, 3.12.5 (bajada de npm), porque cdnjs
  está bloqueado en este entorno.

## 6. Capturas

| Archivo | Qué muestra |
|---|---|
| `shot_B_1440_pliegue.jpg` | Acto 1 |
| `shot_B_1440_scroll_25.jpg`, `_60`, `_100` | Fotogramas del ancla |
| `shot_B_1440_os.jpg` | OS armado |
| `shot_B_1440_hoja.jpg` | Caso Naowee abierto en hoja |
| `shot_B_1440_cursor.jpg` | Vidrio abierto bajo el cursor |
| `shot_B_1440_en.jpg`, `shot_B_1440_en_os.jpg` | Versión EN |
| `shot_B_1440_completa_rm.jpg` | Tablero completo con movimiento reducido |
| `shot_B_390_pliegue.jpg` | Móvil, primer pliegue |
| `shot_B_390_completa.jpg` | Móvil, página completa |
| `shot_B_390_hoja.jpg` | Móvil, hoja abierta |

Todas a DPR 1, en JPG de calidad 82, con las fuentes reales cargadas (sin la de respaldo) y sin desborde horizontal.
