# 04 · Copy deck del rediseño 2026 (ES / EN)

> Autor: UX writer senior del rediseño. Lee antes `00-BRIEF.md` (gana si algo choca), `02-ESTRATEGIA-UX.md`
> (§4 cards, §5 recorrido y plantilla de caso, §6 encargo de mensaje) y `01-FUNDAMENTOS-VISUALES.md` §4 y §6.
> Reemplaza como fuente de copy a `docs/specs/07-copy-deck.md` **solo en lo que cambia**: lo que aquí no aparece
> (alt de galerías, captions de imágenes, capítulos largos de `story`) se queda como está en `src/data/`.
>
> **Regla de origen.** Ninguna cifra, cliente, cargo, fecha ni cita es nueva. Todo sale de `src/data/work.ts`,
> `src/data/es/work.ts`, `src/data/cv.ts`, `src/data/es/cv.ts`, `src/data/site.ts`, `src/data/testimonials.ts`,
> `src/i18n/dictionaries.ts` y `src/components/sections/{Craft,About}.tsx`. Donde una pieza mejoraría con un dato que
> no existe, va `[DATO A CONFIRMAR CON DOUG]` y la pregunta está en la §7.
>
> **Ajuste del 4 nov (orquestador):** el héroe es Doug **sin lentes**, con la **línea/halo de láser rojo** sobre los
> ojos, **gorra NY**, chaqueta de cuero negra y muro de concreto (provisional: `retratos-hf/199598aa.jpg`). La foto
> definitiva con máscara (que cubre la boca y se retira por capas) llega después. El alt y las pistas de la §2.4 están
> escritos para esa imagen.

---

## 0. Convenciones de este documento

| Marca | Significa |
|---|---|
| `{dot: 130+}` | Se compone en **Doto** (dot-matrix, `ROND 100`, `wght 700`). Solo cifras, fechas y contadores. **Nunca por debajo de 20 px** (01 §4.2) ni en frases. Siempre texto real con su `aria-label`. |
| `{derivado: fn()}` | La cifra la calcula el código (`yearsOfExperience()`, `caseStudies.length`, `formatPeriod()`…). **No se escribe a mano**: el test `data.singleSource` lo vigila. |
| `≤ N` | Límite de caracteres con espacios, medido sobre el **ES** (el más largo). El EN debe quedar en ±15 %. |
| `↗` | Enlace externo (nueva pestaña). Lleva `aria-label` que lo diga. |
| `[DATO A CONFIRMAR CON DOUG]` | Hueco honesto. No se publica con el marcador visible: o Doug da el dato o la línea se quita. |

### 0.1 Capacidad de cada tamaño de card (de dónde salen los límites)

Rejilla de 02 §4.3: contenedor de 1376 px, 12 columnas de 100 px, gap 16 px, fila de 112 px. Padding interno 32 px
(escritorio) y 24 px (móvil, losa de 358 px → 310 px útiles). Anchos medios de carácter estimados: Urbanist 600
≈ 0,52 em; texto ≈ 0,5 em; Doto ≈ 0,56 em con el tracking de 01 §4.2.

| Card | Útil (px) | Título losa 24 px | Texto 16 px | Etiqueta 14 px | Doto L 48 px | Doto XL 72 px |
|---|---|---|---|---|---|---|
| 3 col (K3–K6) | 268 | ~21 car./línea | ~33 | ~38 | ~10 car. | ~6 car. |
| 4 col (K7–K10, K12–K15) | 368 | ~29 | ~46 | ~52 | ~13 | ~9 |
| 6 col (K1, K2, K16, K17) | 632 | ~50 | ~79 | ~90 | ~23 | ~15 |
| 8 col (K11) | 832 | ~66 | ~104 | — | — | — |
| Móvil, ancho completo | 310 | ~29 (a 20 px) | ~38 | ~44 | ~11 (36 px) | ~11 (48 px) |
| Móvil, carrusel 80 % | 238 | ~22 | ~29 | ~34 | ~8 | ~8 |

Regla práctica que aplico abajo: **título ≤ 2 líneas, línea de apoyo ≤ 2 líneas, eyebrow ≤ 1 línea** en el tamaño más
estrecho donde vive la card (normalmente el carrusel móvil o la columna de 3).

### 0.2 Reglas de escritura (las que el QA puede verificar)

- Caja de oración en todo, también en EN (01 §4.4: las referencias no usan mayúsculas sostenidas ni Title Case).
- `…` y no `...`; comillas «» en ES y “ ” en EN; espacio fino o duro entre cifra y unidad cuando se parta (`12 años`).
- ES con separador de miles de punto (`2.000+`, `~1.200`); EN con coma (`2,000+`, `~1,200`). Ya lo hacen los datos.
- Cargos en inglés en los dos idiomas (decisión vigente de `site.ts`: así están en contratos, LinkedIn y CV).
- Sin signos de exclamación. Sin raya decorativa: en ES se prefieren dos puntos; la raya solo separa incisos.
- Primera persona en todo lo que dice Doug. Segunda persona (tuteo) en los CTA y en lo que le pide al visitante.

---

## 1. Voz y tono de douguizard

La marca tiene dos capas: **la imagen juega** (máscara, láser rojo, vidrio estriado) y **el texto no juega**. La
personalidad está en la cara y en el movimiento; la información, en frases cortas que se pueden verificar
(02 §3.5). Si el texto también se disfraza de cyberpunk, el sitio se vuelve un videojuego y pierde al reclutador.

| # | Rasgo | Sí | No |
|---|---|---|---|
| 1 | **Verbo propio, primera persona.** Cada frase dice qué hizo Doug, con un verbo que se puede comprobar. | «Mantuve la librería de iOS, Android y Web.» · «I direct the product. Then I build it.» | «Apasionado por crear experiencias significativas.» · «Driving innovative solutions.» |
| 2 | **Cifra con fuente, o ninguna.** Un número solo entra si está en los datos; si no hay, se dice lo que pasó sin medirlo. | «{dot: 400+} diseñadores en el sistema.» · Royal Caribbean sin cifra. | «Millones de clientes.» · «~40 % menos retrabajo.» (los dos ya se retiraron por no tener fuente) |
| 3 | **Corto y en calma.** Una idea por frase, ≤ 20 palabras en cuerpo, ≤ 8 en líneas de card. El dato va al principio. | «Los saldos se leen, no se suman.» · «Two layers of navigation, and no more.» | «En un mundo donde la tecnología avanza cada vez más rápido, el diseño debe…» |
| 4 | **Honesto sobre quién hizo qué.** Se separa lo mío, lo del equipo y lo de los agentes de IA. El NDA se dice sin disculpas. | «El código lo escribió un equipo de agentes de IA que dirigí fase por fase.» · «Las pantallas son de Mercadolibre; el sistema te lo muestro en una llamada.» | «Desarrollé la app» (cuando la escribieron agentes). · «Lo siento, por confidencialidad no puedo…» |
| 5 | **Con carácter, sin disfraz.** Un guiño por pantalla, ligado a la máscara o al oficio; nunca jerga de ciencia ficción. | «Doug, sin máscara.» · «Detrás de esta máscara no hay nada.» (404) | «Hackeando la matrix del UX.» · «Neural», «glitch», «2077», «modo bestia». |

**Glosario corto.** ES: *sistema de diseño* (no «design system» en la prosa del sitio; el CV lo conserva), *caso* (no
«case study»), *producto propio*, *prototipo en código*, *squads* (término del sector en Colombia), *celular*, *carro*.
EN: *design system*, *case study*, *own product* → mejor *product of my own*, *prototype in code*, *squads*.
La palabra *IA / AI* se usa donde describe un hecho (auditorías con IA, agentes de IA), nunca como adjetivo de titular
(02 §6.1).

---

## 2. Héroe (K1 + K2)

El H1 vive en **K2** (losa blanca, 6×2): ahí está el texto real que lee el lector de pantalla y que indexa Google
(02 §7.4). **K1** lleva la cara, el nombre en display y el control de la máscara. Para no duplicar el nombre para
lectores de pantalla, el nombre grande de K1 va con `aria-hidden="true"` (es la versión gráfica del mismo dato) o, si
la dirección de arte prefiere el wordmark, K1 lleva «douguizard» y el nombre solo en K2 (pregunta P20).

### 2.1 Titular: tres opciones

| | ES | EN | Car. ES/EN |
|---|---|---|---|
| **A · recomendada** | **Dirijo el producto. Después, lo construyo.** | **I direct the product. Then I build it.** | 42 / 38 |
| B | Diseño producto y lo construyo en código. | I design products and build them in code. | 41 / 41 |
| C | Sistemas para 2.000+ ingenieros. Productos que lanzo yo. | Systems for 2,000+ engineers. Products I ship myself. | 56 / 53 |

**Por qué A (test de 5 s del reclutador).** En una lectura dice los dos tercios del nivel en el orden en que Doug los
hace: *dirijo* = Head of Product, *construyo* = Design Engineer; la línea de nivel de abajo lo confirma con los cargos
exactos. Es primera persona, tiene verbo, se puede decir en voz alta y no usa ninguna palabra que sea de todos
(«humano», «IA», «era», 02 §6.1). Parte limpio en dos líneas a 48 px en K2 (21 + 20 caracteres caben en 632 px) y en
tres a 36–40 px en móvil, sin viudas. Viene de la línea recomendada en `specs/10`, que Doug ya había visto.

- **B** es más llana y más buscable («diseño producto»), pero describe un servicio y no a una persona con nivel: no
  dice que dirige.
- **C** es la más fuerte en datos (las dos pruebas del bento: escala y producto propio) y por eso no la descarto:
  **sirve como línea del OG y de K12**. Como H1 obliga a leer una cifra antes que el nombre y envejece con el dato.

### 2.2 K2 · Claim + rol (losa blanca, 6×2; móvil: ancho completo)

| Pieza | Límite | ES | EN |
|---|---|---|---|
| H1 · línea 1 (nombre, 18–24 px, peso 500) | — | Doug Vargas | Doug Vargas |
| H1 · línea 2 (display, 48 px · móvil 36–40) | ≤ 44 | Dirijo el producto. Después, lo construyo. | I direct the product. Then I build it. |
| Línea de nivel (14–16 px) | `site.headline`, 67 | Head of Product · Senior Product Designer (UX/UI) · Design Engineer | ídem |
| Subtítulo (16 px, 1 línea en escritorio) | ≤ 80 | Hoy, Naowee. Antes, Andes: el sistema de diseño de Mercadolibre en 18 países. | Now at Naowee. Before that, Andes: Mercadolibre's design system in 18 countries. |
| CTA primario (pill sólida) → `/work` | ≤ 18 | Ver casos | See case studies |
| CTA secundario → PDF del idioma | ≤ 20 | Descargar CV (PDF) | Download CV (PDF) |
| `aria-label` del CTA secundario | — | Descargar mi hoja de vida en PDF | Download my CV as a PDF |

Notas:
- El H1 se marca como `<h1><span>Doug Vargas</span><span>Dirijo el producto…</span></h1>`: se oye «Doug Vargas.
  Dirijo el producto. Después, lo construyo.», nombre + posicionamiento como pide 02 §7.4.
- **Altura de K2.** En 6×2 (176 px útiles) caben H1 en 2 líneas + nivel + CTA. El subtítulo cabe solo si el H1 baja a
  40 px. Si la dirección de arte lo mantiene en 48, el subtítulo se va a la losa de texto que monta sobre el pecho en
  K1 (01 §6.1) o desaparece en escritorio: Mercadolibre ya está en K4, al lado. En móvil sí va.
- «Head of Product» no se repite en el subtítulo: ya está en la línea de nivel. «18 países» se interpola del KPI de
  Andes (`{derivado}`), como hoy.
- El CTA secundario descarga el PDF directamente (el reclutador quiere el archivo, no otra página). El header sigue
  llevando a `/cv`. Cuál PDF por idioma: pregunta P3.
- Se retira «LinkedIn» como CTA primario (02 D3). LinkedIn vive en K17 y en `/about`.

### 2.3 K1 · Héroe · Doug (6×6; móvil 4:5 a lo ancho)

| Pieza | Límite | ES | EN |
|---|---|---|---|
| Nombre en display (visual, `aria-hidden`) | — | Doug Vargas | Doug Vargas |
| Indicador de disponibilidad (punto + texto, 14 px) | ≤ 30 | Disponible para consultoría | Open to consulting |
| Tooltip / `title` del indicador (`site.availability.note`) | — | Consultoría puntual en sistemas de diseño y producto nativo de IA | Selected consulting on design systems and AI-native product |
| Botón de la máscara (estado cubierto) | ≤ 16 | Quitar máscara | Take off the mask |
| Botón de la máscara (estado descubierto) | ≤ 16 | Poner máscara | Put the mask on |
| Enlace de la card (stretched link) → `/about` | — | Doug Vargas · ver perfil | Doug Vargas · view profile |

- El texto del indicador depende de la decisión de disponibilidad (P1). Variante si Doug abre la puerta a roles:
  «Abierto a roles y consultoría» / «Open to roles and consulting».
- El nombre accesible del enlace **empieza por el texto visible** («Doug Vargas»), para cumplir WCAG 2.5.3 (label in
  name) con quien navega por voz.

### 2.4 Microcopy del revelado de la máscara

Escrito para la imagen decidida el 4 nov: Doug sin lentes, halo de láser rojo sobre los ojos, gorra NY, chaqueta de
cuero negra, muro de concreto; la máscara futurista le cubre la boca y se retira por capas (visor, placa de la boca,
piezas laterales, de fuera hacia dentro, 02 §5.2).

**Principio.** La pista principal es la animación automática de una sola vez (1,6 s, 02 §5.2): enseña sin texto. El
texto es la red de seguridad: aparece **solo si, 4 s después de la pista automática, la persona no ha tocado la cara**,
y se va al primer gesto. Nunca en bucle, nunca encima del vidrio ni de los ojos (02 §7.1: el texto no va sobre el
vidrio estriado).

| Contexto | Pista (chip pequeño junto al botón) | Límite | ES | EN |
|---|---|---|---|---|
| Puntero fino (`hover: hover`) | Tras la pista automática, si no hay interacción | ≤ 32 | Pasa el cursor por la cara | Move your cursor over the face |
| Táctil | ídem; el gesto es arrastrar en horizontal o diagonal (02 §5.2) | ≤ 32 | Arrastra sobre la cara | Drag across the face |
| Táctil, segunda línea (opcional) | Explica el toque corto | ≤ 32 | Un toque abre el perfil | A tap opens the profile |
| Teclado (al enfocar el botón) | `aria-describedby` del botón | ≤ 60 | Quita la máscara por completo, capa por capa. | Takes the mask off, layer by layer. |
| Reduced motion | No hay pista automática ni chip. Solo el botón. Su descripción cambia: | ≤ 60 | Quita la máscara de una vez, sin animación. | Takes the mask off at once, without animation. |
| WebGL no disponible / falla | **Ningún mensaje.** Queda el póster estático y el botón hace el fundido (02 §7.2). | — | — | — |

Estados del botón: `aria-pressed="false"` con «Quitar máscara» / «Take off the mask»; `aria-pressed="true"` con
«Poner máscara» / «Put the mask on». No hace falta región `aria-live`: el cambio de nombre y de `aria-pressed` ya lo
anuncia el lector. El botón va **antes** del enlace al perfil en el orden de tabulación (02 §5.2).

**Alt text.** Describe a Doug y lo que lleva, no el efecto (el vidrio estriado y la distorsión no se nombran). La
máscara sí se nombra porque es parte de la imagen, y el estado lo da el botón. Una sola imagen accesible para el par
A/B: la capa B (con máscara) y las capas de la máscara van con `alt=""` y `aria-hidden="true"`.

| Imagen | Límite | ES | EN |
|---|---|---|---|
| K1 · retrato del héroe (figura compuesta) | ≤ 160 | Doug Vargas con gorra de Nueva York y chaqueta de cuero negra frente a un muro de concreto; una línea de luz roja le cruza los ojos y una máscara futurista le cubre la boca. | Doug Vargas in a New York cap and a black leather jacket against a concrete wall, a red line of light across his eyes and a futuristic mask over his mouth. |
| K1 · imagen provisional (`199598aa.jpg`, sin máscara todavía) | ≤ 130 | Doug Vargas con gorra de Nueva York y chaqueta de cuero negra frente a un muro de concreto, con una línea de luz roja sobre los ojos. | Doug Vargas in a New York cap and a black leather jacket against a concrete wall, a red line of light across his eyes. |
| K13 y portada de `/about` (sin máscara) | ≤ 130 | Doug Vargas sin máscara, con gorra de Nueva York y chaqueta de cuero negra, mirando a cámara. | Doug Vargas without the mask, in a New York cap and a black leather jacket, looking at the camera. |
| Fondo con blur de movimiento (01 §6.2) | — | `alt=""` (decorativa) | `alt=""` |
| Imagen OG | ≤ 120 | Retrato de Doug Vargas con el texto «Head of Product · Senior Product Designer (UX/UI) · Design Engineer». | Portrait of Doug Vargas with the text “Head of Product · Senior Product Designer (UX/UI) · Design Engineer”. |

Revisar el alt contra la foto final: si la gorra, la ropa o el fondo cambian, el alt cambia con ellos. «Mirando a
cámara» se escribe solo si la foto lo hace.

---

## 3. Cards del bento (K3–K17)

Formato de cada card: **eyebrow** (14 px) · **título** (24 px, es el `<a>` del stretched link) · **apoyo** (16 px) ·
**cifra** (`{dot}`) con su etiqueta · **acción** (texto de la pastilla `↗`, visible al hover/foco o como texto en
móvil) · **nombre accesible** del enlace (empieza por el título visible) y `aria-label` de la cifra.

La pastilla de flecha no lleva texto visible en escritorio; su texto de acción se usa como sufijo del nombre accesible
y como etiqueta visible en móvil. Acciones fijas en todo el bento:

| Destino | ES | EN |
|---|---|---|
| Página de caso | Leer el caso | Read the case |
| `/about` | Ver el perfil | View the profile |
| `/experience` | Ver la trayectoria | See the timeline |
| `/work` | Ver todo el trabajo | See all work |
| `#contact` | Escríbeme | Get in touch |

### K3 · Naowee (3×3, cargo actual) → `/work/naowee-suid`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 28 | Ahora · Head of Product | Now · Head of Product |
| Título | ≤ 21 | Naowee | Naowee |
| Apoyo | ≤ 60 | Los 30 trámites del deporte colombiano, fuera de Word. | Colombia's 30 sports procedures, out of Word and email. |
| Cifra | Doto L | {dot: 130+} | {dot: 130+} |
| Etiqueta de la cifra | ≤ 30 | pantallas en 8 módulos | screens across 8 modules |
| Acción | — | Leer el caso | Read the case |
| Nombre accesible | — | Naowee, leer el caso | Naowee, read the case |
| `aria-label` cifra | — | 130 o más pantallas en 8 módulos | 130-plus screens across 8 modules |

Fuente: KPIs `30` y `130+` de `naowee-suid`. «Fuera de Word» resume «antes en Word y correo».

### K4 · Andes · Mercadolibre (3×3, NDA, gradiente azul) → `/work/mercadolibre-andes`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 28 | Mercadolibre · {derivado: 2024–2026} | Mercadolibre · {derivado: 2024–2026} |
| Título | ≤ 21 | Andes Design System | Andes Design System |
| Apoyo | ≤ 60 | Líder técnico del sistema de diseño de Mercadolibre. | Tech lead on Mercadolibre's design system. |
| Cifras (la cifra es la imagen) | Doto L | {dot: 400+} diseñadores · {dot: 2.000+} ingenieros · {dot: 18} países | {dot: 400+} designers · {dot: 2,000+} engineers · {dot: 18} countries |
| Chip | ≤ 24 | NDA · Caso a solicitud | NDA · Case on request |
| Acción | — | Leer el caso | Read the case |
| Nombre accesible | — | Andes Design System, leer el caso | Andes Design System, read the case |
| `aria-label` cifras | — | 400 o más diseñadores, 2.000 o más ingenieros, 18 países | 400-plus designers, 2,000-plus engineers, 18 countries |

`2.000+` (6 caracteres) cabe en Doto L en 268 px, no en XL. Las tres cifras van en L; si la dirección de arte quiere
una XL, que sea `18` o `400+`.

### K5 · Disponibilidad (3×1) → `#contact`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Estado (punto + texto) | ≤ 30 | Abierto a consultoría puntual | Open to selected consulting |
| Línea secundaria (si cabe; si no, va al tooltip) | ≤ 34 | Head of Product en Naowee | Head of Product at Naowee |
| Botón / título del enlace | ≤ 12 | Escríbeme | Get in touch |
| Nombre accesible | — | Escríbeme: abierto a consultoría puntual | Get in touch: open to selected consulting |

Fuente: `site.availability.label` y `note` (versión corta). La nota completa (64 car.) no cabe en 3×1. Variante si
cambia la disponibilidad (P1): «Abierto a roles y consultoría» / «Open to roles and consulting».

### K6 · Hora local + idioma (3×1) → `#contact`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Reloj | Doto M | {dot: BAQ 14:32} | {dot: BAQ 2:32} + «PM» en texto 14 px |
| Línea | ≤ 30 | Barranquilla, Colombia · UTC-5 | Barranquilla, Colombia · UTC-5 |
| Tooltip (opcional, solo EN) | — | — | Same time as New York from November to March. |
| Segmento de idioma | — | ES · EN (ver §4.3) | ES · EN |
| Título del enlace (visualmente oculto o la línea) | — | Barranquilla, hora local | Barranquilla, local time |
| `aria-label` del reloj | — | Hora local en Barranquilla: 2:32 p. m. | Local time in Barranquilla: 2:32 PM |
| Sin JavaScript | — | El reloj no se muestra; queda «Barranquilla, Colombia · UTC-5». | ídem |

ES usa reloj de 24 h (`14:32`) porque cabe mejor en dot-matrix y es habitual en Colombia en contextos técnicos; EN usa
12 h, como lo lee un reclutador de EE. UU. El tooltip de EN es un hecho de calendario (Colombia no tiene horario de
verano; Nueva York vuelve a UTC-5 de noviembre a marzo), no un dato de Doug.

### K7 · olbo (4×4, losa perla) → `/work/olbo`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 40 | Producto propio · Design Engineer | Product of my own · Design Engineer |
| Título | ≤ 29 | olbo | olbo |
| Apoyo | ≤ 60 | Mide tu ritmo de gasto, no tu saldo. | Reads your spending pace, not your balance. |
| Cifra | Doto XL | {dot: 647} | {dot: 647} |
| Etiqueta | ≤ 30 | pruebas en verde | tests passing |
| Acción | — | Leer el caso | Read the case |
| Nombre accesible | — | olbo, leer el caso | olbo, read the case |
| `aria-label` cifra | — | 647 pruebas en verde | 647 tests passing |

«App en vivo ↗» no va en la card (02 §4.5): solo en la página del caso. El verde de la cifra es el del semáforo de
olbo, no un verde de marca.

### K8 · Banco de Occidente (4×4) → `/work/banco-de-occidente`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 40 | Aval Digital Labs · {derivado: 2018–2024} | Aval Digital Labs · {derivado: 2018–2024} |
| Título | ≤ 29 | Banco de Occidente | Banco de Occidente |
| Apoyo | ≤ 60 | Un portal más liviano y Velocity, su sistema de diseño. | A lighter portal, and Velocity, its design system. |
| Cifra | Doto L | {dot: 12+} | {dot: 12+} |
| Etiqueta | ≤ 30 | squads en un solo sistema | squads on one system |
| Fragmento de testimonio (verbatim, `lang="en"` también en ES) | ≤ 70 | “He doesn't just design — he architects how products should feel.” | ídem |
| Firma | ≤ 50 | Francesca Steri · Directora de Diseño, Aval Digital Labs | Francesca Steri · Design Director, Aval Digital Labs |
| Marca de idioma (solo ES, 12 px) | — | Cita original en inglés | — |
| Acción / nombre accesible | — | Banco de Occidente, leer el caso | Banco de Occidente, read the case |
| `aria-label` cifra | — | Más de 12 squads en un solo sistema | 12-plus squads on one system |

La cita es una oración completa y textual de `testimonials.ts` (la última); no se edita ni se traduce. Excerptar
oraciones completas necesita el visto bueno de Doug (P4).

### K9 · DC Medical (4×2) → `/work/dc-medical`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 40 | Producto propio · Socio y constructor | Product of my own · Co-owner and builder |
| Título | ≤ 29 | DC Medical | DC Medical |
| Apoyo | ≤ 50 | Una clínica en tres ciudades, desde un celular. | A three-city clinic, run from one phone. |
| Cifra | Doto L | {dot: 14} | {dot: 14} |
| Etiqueta | ≤ 46 | días del primer commit a la versión del 2 oct | days from first commit to the Oct 2 version |
| Acción / nombre accesible | — | DC Medical, leer el caso | DC Medical, read the case |
| `aria-label` cifra | — | 14 días del primer commit a la versión del 2 de octubre | 14 days from first commit to the October 2 version |

La etiqueta nombra la fecha porque el KPI la tiene (`19 sep → 2 oct 2026`) y el producto sigue cambiando: «versión de
hoy» envejece mal. Si hay una cifra más reciente, P12.

### K10 · MakeaPet (4×2, gradiente magenta) → `/work/makeapet`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 40 | Producto propio · iOS, Android y web | Product of my own · iOS, Android, web |
| Título | ≤ 29 | MakeaPet | MakeaPet |
| Apoyo | ≤ 50 | De cinco pantallas en Figma a una app real. | From five Figma screens to a real app. |
| Cifra | Doto L | {dot: 680+} | {dot: 680+} |
| Etiqueta | ≤ 30 | pruebas automatizadas | automated tests |
| Acción / nombre accesible | — | MakeaPet, leer el caso | MakeaPet, read the case |
| `aria-label` cifra | — | Más de 680 pruebas automatizadas | 680-plus automated tests |

### K11 · Experiencia (8×2) → `/experience`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 30 | Trayectoria | Experience |
| Título | ≤ 50 | 2010 → hoy: de freelance a Head of Product | 2010 → now: from freelance to Head of Product |
| Nodos (año en Doto M ≥ 24 px + empresa 14 px + cargo corto 12–14 px) | empresa ≤ 14, cargo ≤ 16 | ver tabla abajo | ver tabla abajo |
| Acción | — | Ver la trayectoria | See the timeline |
| Nombre accesible | — | Trayectoria, ver la línea de tiempo completa | Experience, see the full timeline |

| Año | Empresa (corta) | Cargo corto (igual en ES y EN) | ¿Punto relleno (tiene caso)? |
|---|---|---|---|
| {dot: 2010} | Freelance | Gráfico e interfaces · *EN: Graphic & UI* | No |
| {dot: 2014} | Smartbiz | Junior UI | No |
| {dot: 2016} | Ideaware · Qrvey | Senior UX/UI → Lead UI | Sí (dos casos) |
| {dot: 2017} | Globant | Senior PD | Sí |
| {dot: 2018} | Aval Digital Labs | Senior PD · DS Gatekeeper | Sí |
| {dot: 2024} | Mercadolibre | Tech Lead · DS | Sí |
| {dot: 2026} | Naowee | Head of Product | Sí |

Siete nodos en 832 px dan ~119 px por nodo: cabe un año de 4 dígitos en Doto a 24–30 px. «Aval Digital Labs» (17)
pasa de 14: se parte en dos líneas o se usa «Aval · BdO». Los años salen de `experiences[].start` (`{derivado}`).

### K12 · Cifras de carrera (4×2, losa blanca) → `/experience`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 30 | En cifras | By the numbers |
| Cifra 1 + etiqueta | Doto L · ≤ 22 | {dot: 12} {derivado: yearsOfExperience()} años en producto digital | {dot: 12} years in digital product |
| Cifra 2 + etiqueta | ≤ 22 | {dot: 10} {derivado: caseStudies.length} casos publicados | {dot: 10} case studies |
| Cifra 3 + etiqueta | ≤ 22 | {dot: 3} {derivado: kind === "personal"} productos propios | {dot: 3} products of my own |
| Título del enlace (visualmente oculto si no hay título visible) | — | Mi trayectoria en cifras | My career in numbers |
| Acción | — | Ver la trayectoria | See the timeline |
| `aria-label` cifras | — | 12 años en producto digital, 10 casos publicados, 3 productos propios | 12 years in digital product, 10 case studies, 3 products of my own |

«Años en producto digital» es la frase del CV (`profile.summary`: «12 años en diseño de producto digital»). El 12 depende
del ancla de carrera (P5).

### K13 · Perfil (4×3) → `/about`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 30 | Perfil | About |
| Título | ≤ 29 | Doug, sin máscara | Doug, unmasked |
| Apoyo (2 líneas) | ≤ 80 | Diseñador de producto que construye. Barranquilla, Colombia · ES / EN. | A product designer who builds. Barranquilla, Colombia · ES / EN. |
| Acción | — | Ver el perfil | View the profile |
| Nombre accesible | — | Doug, sin máscara: ver el perfil | Doug, unmasked: view the profile |
| Alt del retrato | — | ver §2.4 | ver §2.4 |

El título cierra la narrativa de 02 §5.2 («quitar la máscara es conocer a Doug») sin explicarla. Es el único guiño
del bento.

### K14 · Cómo trabajo (4×3) → `/about#craft`

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow / título | ≤ 29 | Cómo trabajo | How I work |
| Paso 1 | {dot: 01} + ≤ 34 | Leer el dominio antes de dibujar | Read the domain before drawing |
| Paso 2 | {dot: 02} + ≤ 34 | El lenguaje antes que las pantallas | The language before the screens |
| Paso 3 | {dot: 03} + ≤ 34 | El prototipo es la especificación | The prototype is the spec |
| Paso 4 | {dot: 04} + ≤ 34 | Lanzar, y después escuchar | Ship, then listen |
| Acción | — | Leer cómo trabajo | Read how I work |
| Nombre accesible | — | Cómo trabajo, leer los cuatro pasos | How I work, read the four steps |

Los números van en Doto M (24 px). El paso 2 se acorta de «Construir el lenguaje, no las pantallas» (39) para que
quepa en una línea al lado del número.

### K15 · Testimonio (4×3, losa blanca, rotación manual) → caso de origen

Las citas no se traducen ni se editan; en la card va **una oración completa** de cada una (≤ 25 palabras). La cita
entera vive en su caso y en `/about`. Orden propuesto: el CEO primero (Qrvey), porque Francesca ya aparece en K8.

| Slide | Cita (verbatim, `lang="en"`) | Palabras | Firma ES | Firma EN | Enlace |
|---|---|---|---|---|---|
| 1/3 | “His ability to translate complex data into clear interfaces transformed our entire dashboard experience.” | 15 | Arman Eshraghi · Fundador y CEO, Qrvey | Arman Eshraghi · Founder & CEO, Qrvey | `/work/qrvey` |
| 2/3 | “He elevated the entire team's standard of craft.” | 8 | Nicolas Polverino · Director Técnico, Globant | Nicolas Polverino · Technical Director, Globant | `/work/royal-caribbean` |
| 3/3 | “We've done 8 projects with him and every single one delivered above expectations.” | 14 | Francesca Steri · Directora de Diseño, Aval Digital Labs | Francesca Steri · Design Director, Aval Digital Labs | `/work/banco-de-occidente` |

| Pieza | ES | EN |
|---|---|---|
| Eyebrow | En sus palabras | In their words |
| Marca de idioma (solo ES) | Cita original en inglés | — |
| Botón anterior (`aria-label`) | Testimonio anterior | Previous testimonial |
| Botón siguiente (`aria-label`) | Testimonio siguiente | Next testimonial |
| Contador (texto, 14 px; no Doto: es menor de 20 px) | 1 de 3 | 1 of 3 |
| Región (`aria-roledescription="carrusel"`, `aria-label`) | Testimonios | Testimonials |
| Enlace (sobre la firma) | Leer el caso de Qrvey · de Royal Caribbean · del Banco de Occidente | Read the Qrvey case · the Royal Caribbean case · the Banco de Occidente case |

Sin autoplay (02 §5.5). El «8 projects» es dicho por Francesca, no por Doug: entra porque está dentro de la cita.

### K16 · Más trabajo / archivo (6×2) → `/work` (cabecera) y cada fila a su caso

| Campo | Límite | ES | EN |
|---|---|---|---|
| Eyebrow | ≤ 30 | Archivo | Archive |
| Título (enlace de la cabecera) | ≤ 30 | Más trabajo | More work |
| Acción de la cabecera | — | Ver todo el trabajo | See all work |

Filas (año en Doto a 20–24 px; ningún KPI, porque estos casos no lo tienen):

| Año | Proyecto | Línea ES (≤ 50) | Línea EN (≤ 50) |
|---|---|---|---|
| {dot: 2018} | Chub | Alquiler de carros por minuto, para iOS. | Per-minute car rental, for iOS. |
| {dot: 2017} | Royal Caribbean | Reservas y vida a bordo, con Globant. | Booking and life aboard, with Globant. |
| {dot: 2016} | Qrvey | AutomatiQ: encuestas que actúan solas. | AutomatiQ: surveys that act on their own. |
| {dot: 2016} | Ideaware | Diseño para clientes de EE. UU. y LATAM. | Design for US and LATAM clients. |

Nombre accesible de cada fila: «{Proyecto}, {año}, leer el caso» / «{Project}, {year}, read the case». Año de la fila:
el de inicio, de `getCaseMeta()` (`{derivado}`). Chub queda sujeto a P15 (marca Tesla).

### K17 · Contacto + CV (6×2, losa blanca grande) = sección `#contact`

| Pieza | Límite | ES | EN |
|---|---|---|---|
| H2 | ≤ 20 | Hablemos | Let's talk |
| Lead | ≤ 90 | Un rol, una consultoría o el caso de Andes en una llamada: escríbeme. | A role, a consulting project, or the Andes case on a call: write to me. |
| Lead (variante si no busca roles, P1) | ≤ 90 | Una consultoría o el caso de Andes en una llamada: escríbeme. | A consulting project, or the Andes case on a call: write to me. |
| Correo (grande, seleccionable) | — | hello@douguizard.com | hello@douguizard.com |
| Botón copiar (reposo / hecho / error) | ≤ 16 | Copiar correo · Copiado · No se pudo copiar. Selecciónalo a mano. | Copy email · Copied · Couldn't copy. Select it instead. |
| Enlaces | — | LinkedIn ↗ · Behance ↗ · GitHub ↗ | ídem |
| `aria-label` de externos | — | LinkedIn (se abre en otra pestaña) | LinkedIn (opens in a new tab) |
| CV | ≤ 20 | Descargar CV (PDF) | Download CV (PDF) |
| Carta | ≤ 24 | Carta de presentación | Cover letter |
| Teléfono (si se mantiene, P17) | — | +57 300 351 8299 | +57 300 351 8299 |
| Disponibilidad (línea pequeña) | ≤ 90 | Lidero producto en Naowee y tomo consultorías puntuales en paralelo. | I lead product at Naowee and take on selected consulting alongside it. |

---

## 4. Navegación, footer, idioma, estados y SEO

### 4.1 Header (pastilla flotante, 64 px)

| Pieza | ES | EN | Nota |
|---|---|---|---|
| Wordmark (→ `/`) | douguizard | douguizard | Nombre accesible: «douguizard, inicio» / «douguizard, home» (`meta.homeLabel`). |
| Enlace 1 | Trabajo | Work | `/work` |
| Enlace 2 | Perfil | About | `/about`. En EN «About» es lo que se busca; «Profile» suena a red social. |
| Enlace 3 | Experiencia | Experience | `/experience` |
| Enlace 4 | CV | CV | `/cv` |
| Pastilla (acción) | Hablemos | Let's talk | `/#contact` |
| Saltar al contenido | Ir al contenido | Skip to content | Primer tabulador (ya existe). |
| `aria-label` del `<nav>` | Principal | Main | |
| Menú móvil (si hace falta) | Abrir menú · Cerrar menú | Open menu · Close menu | Ya existen en el diccionario. |

### 4.2 Dock móvil (inferior, ≤ 5 destinos)

| ES | EN |
|---|---|
| Trabajo · Perfil · CV · Contacto | Work · About · CV · Contact |

`aria-label` del dock: «Navegación rápida» / «Quick navigation». Contacto lleva a `#contact`. Etiquetas ≤ 10 caracteres
para caber bajo un ícono de 24 px en 1/4 de 358 px.

### 4.3 Switch de idioma (segmento siempre visible)

| Pieza | ES (página en español) | EN (página en inglés) |
|---|---|---|
| Visible | ES · EN | ES · EN |
| `aria-label` del grupo | Idioma | Language |
| Opción ES | texto «ES», `aria-label="Español"`, `lang="es"`, `aria-current="true"` | texto «ES», `aria-label="Español"`, `lang="es"`, `hreflang="es"` |
| Opción EN | texto «EN», `aria-label="English"`, `lang="en"`, `hreflang="en"` | texto «EN», `aria-label="English"`, `lang="en"`, `aria-current="true"` |
| Tooltip de la opción inactiva | Read in English | Ver en español |

Cada idioma se nombra en su propio idioma (así lo encuentra quien no lee el otro). Conserva ruta y hash (02 §7.3).

### 4.4 Footer

| Pieza | ES | EN |
|---|---|---|
| Legal | © 2026 Doug Vargas | © 2026 Doug Vargas |
| Lugar | Barranquilla · UTC-5 | Barranquilla · UTC-5 |
| Colofón (opción A) | Diseñado por mí; construido con Next.js y agentes de IA que dirijo. | Designed by me; built with Next.js and AI agents I direct. |
| Colofón (opción B) | Diseñado y construido por Doug Vargas. | Designed and built by Doug Vargas. |
| Volver arriba | Volver arriba | Back to top |

El colofón convierte el sitio en prueba de design engineering (02 §2, punto 5). Recomiendo A porque es el mismo
estándar de honestidad que olbo y MakeaPet; B solo si Doug escribió el código él mismo (P16).

### 4.5 Estados vacíos, errores y 404

| Lugar | ES | EN |
|---|---|---|
| 404 · kicker | 404 · Página no encontrada | 404 · Page not found |
| 404 · título | Detrás de esta máscara no hay nada. | Nothing behind this mask. |
| 404 · cuerpo | La dirección que seguiste no existe en douguizard.com. Puede que se haya movido. Todo lo que sí existe está a un clic. | The address you followed doesn't exist on douguizard.com. It may have moved. Everything that does exist is one click away. |
| 404 · enlaces | Ir al inicio · Ver casos · CV | Go home · See case studies · CV |
| Caso no encontrado · kicker | 404 · Caso no encontrado | 404 · Case study not found |
| Caso no encontrado · título | Este caso no existe, o todavía no está publicado. | This case study doesn't exist, or isn't published yet. |
| Caso no encontrado · enlace | Ver todos los casos | See all case studies |
| `/work` · filtro sin resultados | No hay casos con este filtro. | No case studies match this filter. |
| `/work` · acción del vacío | Ver todos | Show all |
| Video que no carga | El video no cargó. Las capturas de abajo muestran el mismo recorrido. | The video didn't load. The screenshots below show the same walkthrough. |
| Cargando (si una isla tarda) | Cargando… | Loading… |
| Copiar correo, error | No se pudo copiar. Selecciónalo a mano. | Couldn't copy. Select it instead. |

Se retira el «¿Perdido en el espacio?» del 404 de casos: es el mismo chiste en dos sitios y no ayuda a seguir. El
nuevo 404 es el único guiño de máscara fuera del héroe.

### 4.6 SEO: `title` y `description`

| Ruta | Límite | ES | EN |
|---|---|---|---|
| `/` title | ≤ 60 | Doug Vargas — Head of Product · Product Designer (UX/UI) | Doug Vargas — Head of Product · Product Designer (UX/UI) |
| `/` description | ≤ 160 | Doug Vargas, Head of Product en Naowee y diseñador de producto que construye en código. Antes, líder técnico de Andes, el sistema de diseño de Mercadolibre. | Doug Vargas is Head of Product at Naowee and a product designer who builds in code. Before that, tech lead on Andes, Mercadolibre's design system. |
| `/work` title | ≤ 60 | Trabajo · Doug Vargas | Work · Doug Vargas |
| `/work` description | ≤ 160 | {derivado: 10} casos de Doug Vargas: sistemas de diseño en Mercadolibre y Banco de Occidente, la plataforma del deporte en Colombia y tres productos propios. | {derivado: 10} case studies by Doug Vargas: design systems at Mercadolibre and Banco de Occidente, Colombia's sports platform and three products of my own. |
| `/about` title | ≤ 60 | Perfil · Doug Vargas | About · Doug Vargas |
| `/about` description | ≤ 160 | Diseñador de producto que construye: Head of Product en Naowee, antes Andes en Mercadolibre. Cómo trabajo, qué hago y cómo contactarme. | A product designer who builds: Head of Product at Naowee, previously Andes at Mercadolibre. How I work, what I do and how to reach me. |
| `/experience` title | ≤ 60 | Experiencia · Doug Vargas | Experience · Doug Vargas |
| `/experience` description | ≤ 160 | De freelance en Barranquilla a Head of Product: la trayectoria de Doug Vargas, con Mercadolibre, Aval Digital Labs, Globant, Qrvey e Ideaware. | From freelance work in Barranquilla to Head of Product: Doug Vargas's career, through Mercadolibre, Aval Digital Labs, Globant, Qrvey and Ideaware. |
| `/work/*` | — | Se conserva `{project} — {client}` y la descripción = gancho nuevo del caso (§5). | ídem |

- El `title` del home se queda con `site.titleHeadline` (decisión de Doug de oct 2026: lleva «UX/UI», la palabra que
  buscan los reclutadores). Alternativa ES más buscable en español: «Doug Vargas — Head of Product y diseñador de
  producto» (52). P19.
- La description de `/` pasa de «lidera producto en Naowee y lo construye: … la IA en el proceso» a nombrar el cargo
  y Mercadolibre en las primeras 100 letras, que es lo que se ve en el móvil. ES: 156 car.; EN: 146.
- La description de `/work` y la de `/experience` se componen en código con los datos (número de casos, empresas),
  como ya hace la de `/cv`.

---

## 5. Casos

### 5.0 Rótulos fijos de la plantilla (02 §5.3)

Los **H2 son propios de cada caso** (02 §6.6). El **índice lateral** (y la hoja del móvil) usa rótulos fijos, porque
es navegación: así el reclutador aprende una vez dónde está cada cosa.

| Bloque | Índice lateral ES | EN | Ficha / rótulos ES | EN |
|---|---|---|---|---|
| Ficha | — | — | Rol · Equipo · Duración · Plataformas | Role · Team · Duration · Platforms |
| Tablero | Impacto | Impact | (sin rótulo; las cifras se nombran solas) | — |
| Problema | Problema | Problem | H2 propio | H2 propio |
| Mi parte | Mi parte | My part | H2 propio | H2 propio |
| Decisiones | Decisiones | Decisions | H2 propio; cada decisión: **Tensión · Elección · Por qué** | **Tension · Choice · Why** |
| Producto | Producto | Product | H2 propio | H2 propio |
| Proceso | Proceso | Process | H2 propio | H2 propio |
| Testimonio | En sus palabras | In their words | — | — |
| Colofón | — | — | Herramientas y métodos · Enlaces · Autoría | Tools & methods · Links · Authorship |
| Siguiente | — | — | Siguiente caso · Hablemos | Next case study · Let's talk |
| Índice móvil (pastilla) | Secciones | Sections | | |
| Breadcrumb | Trabajo / {proyecto} | Work / {project} | | |

Límites de la plantilla: **gancho ≤ 90**, **problema ≤ 60 palabras**, **cada ítem de Mi parte ≤ 25 palabras**,
**cada decisión ≤ 55 palabras** (tensión + elección + por qué), **etiqueta de KPI ≤ 30** y nota (`delta`) ≤ 40. Las
cifras del tablero van en Doto L (escritorio) / M (móvil).

Lo que cambia en todos los casos respecto al texto actual, para no repetirlo en cada uno:

1. **El gancho dice el resultado para alguien**, no la categoría ni la herramienta («diseñadas y construidas con IA»
   deja de ser protagonista).
2. **Mi parte separa lo mío de lo del equipo**, usando lo que ya dicen `credits` y `cv.ts`. Hoy eso está al final, en
   el colofón.
3. **Las decisiones suben y se escriben en tres tiempos** (tensión → elección → por qué). Donde el caso no traía
   bloque de decisiones pero sí las tenía escritas en `contributions` o en un capítulo, se extraen de ahí.
4. **Los H2 dejan de ser rótulos** («Contexto», «Qué hice», «Cómo se hizo») y pasan a ser afirmaciones del caso.

---

### C1 · Naowee — Plataforma del sector deportivo (`naowee-suid`)

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Ahora · Head of Product | Now · Head of Product |
| H1 | Naowee | Naowee |
| Gancho (≤ 90) | El deporte de Colombia salió de Word y correo: 30 trámites en una sola plataforma. | Colombia's sports system, off Word and email: 30 procedures on one platform. |

**Ficha**
| | ES | EN |
|---|---|---|
| Rol | Head of Product | Head of Product |
| Equipo | Producto: 2 personas, con un diseñador que lidero; analistas de negocio e ingeniería. | Product: a team of 2, including a designer I lead; business analysts and engineering. |
| Duración | {derivado: Ene 2026 — Hoy} | {derivado: Jan 2026 — Now} |
| Plataformas | Web | Web |

**Tablero de impacto**
| Cifra | Etiqueta ES | Nota ES | Etiqueta EN | Nota EN |
|---|---|---|---|---|
| {dot: 30} | trámites digitalizados | antes en Word y correo | procedures digitized | Word and email before |
| {dot: ~1.200} / {dot: ~1,200} | organizaciones deportivas en alcance | — | sports organizations in scope | — |
| {dot: 130+} | pantallas entregadas | en 8 de 13 módulos | screens shipped | across 8 of 13 modules |
| {dot: 38+} | componentes compartidos | un solo sistema de diseño | shared components | one design system |

**Problema** — H2 ES: «Un sector que funcionaba con archivos» · EN: «A sector that ran on files»

> ES (52 palabras): Los 30 trámites del sistema deportivo colombiano se movían por Word, correo y un gestor documental,
> GESDOC. Ningún sistema hablaba con otro. Dibujar pantallas era la parte fácil: antes había que entender más de 45
> estados, 15 roles y una jerarquía real de comités, federaciones, ligas, clubes y deportistas.
>
> EN: Colombia's 30 sports procedures moved through Word, email and a document manager, GESDOC. No system talked to
> another. Drawing screens was the easy part: first came 45+ states, 15 roles and a real hierarchy of committees,
> federations, leagues, clubs and athletes.

**Mi parte** — H2 ES: «Dirijo el producto y construyo el prototipo» · EN: «I set the direction and build the prototype»

| ES | EN |
|---|---|
| Marco la dirección de 8 módulos de negocio, entre ellos la inspección y vigilancia de ~1.200 organizaciones. | I set direction across 8 business modules, including inspection and oversight of ~1,200 organizations. |
| Construí el sistema de diseño: 38+ componentes, un shell canónico y una sola receta de asistente para 130+ pantallas. | I built the design system: 38+ components, one canonical shell and a single wizard recipe for 130+ screens. |
| Modelé la jerarquía del sector con aprobación en cascada: 45+ estados y 15 roles. | I modeled the sector's hierarchy with cascading approval: 45+ states and 15 roles. |
| Construyo en código, con Claude Code, Cursor y Gemini, los prototipos que los analistas aprueban historia por historia. | I build the prototypes in code, with Claude Code, Cursor and Gemini, and analysts sign them off story by story. |
| Con quién: analistas de negocio, un diseñador que lidero y los equipos de ingeniería. [DATO A CONFIRMAR CON DOUG: qué parte del producto final construye ingeniería a partir del prototipo] | With: business analysts, a designer I lead and the engineering teams. [DATO A CONFIRMAR CON DOUG] |

**Decisiones** — H2 ES: «Tres reglas que sostienen la plataforma» · EN: «Three rules the platform stands on»

| # | ES | EN |
|---|---|---|
| 1 | **Un sistema, no ocho dialectos.** *Tensión:* ocho módulos, ocho fechas, ocho tentaciones de bifurcar. *Elección:* nada a la medida; se extienden los 38+ componentes compartidos. *Por qué:* lo que se ve distinto en revisión es un error, no una preferencia. | **One system, not eight dialects.** *Tension:* eight modules, eight deadlines, eight temptations to fork. *Choice:* no custom components; the 38+ shared ones get extended. *Why:* anything off in review is a bug, not a preference. |
| 2 | **La demo es el requisito.** *Tensión:* cada quien lee distinto una especificación. *Elección:* lo que se firma es un prototipo que funciona, con roles y estados reales. *Por qué:* los desacuerdos salen cuando todavía son baratos e ingeniería recibe un objetivo resuelto. | **The demo is the requirement.** *Tension:* everyone reads a spec differently. *Choice:* what gets signed is a working prototype with real roles and states. *Why:* disagreement surfaces while it's cheap, and engineering gets a resolved target. |
| 3 | **La jerarquía es el producto.** *Tensión:* una tabla plana de deportistas habría salido meses antes. *Elección:* vínculos reales, con aprobación en cascada del Ministerio al club. *Por qué:* un deportista aprobado hereda la liga y la federación de su club, y las medallas por liga solo significan algo si esos vínculos son reales. | **The hierarchy is the product.** *Tension:* a flat athlete table would have shipped months earlier. *Choice:* real links, with approval cascading from the Ministry down to the club. *Why:* an approved athlete inherits the club's league and federation, and medals by league only mean something if those links are real. |

**Producto** — H2 ES: «Así se despeja hoy un trámite vencido» · EN: «Clearing an overdue filing, today». Video y galería
actuales sin cambios de caption.

**Proceso** — H2 ES: «Del archivo al prototipo firmado» · EN: «From files to a signed prototype». Riel de 3 fases
(títulos actuales, cuerpo ≤ 25 palabras):
01 «Mapear antes de dibujar» / «Map before drawing» · 02 «Modelar construyendo» / «Model by building» (plantillas
.xlsx en 83 deportes) · 03 «Firmar el prototipo» / «Sign the prototype».

**Testimonio:** no hay. [DATO A CONFIRMAR CON DOUG: ¿alguien de Naowee o del cliente podría dar una cita?]

**Qué cambió y por qué.** El gancho pasa de «diseñadas y construidas con IA» (la herramienta) a 30 trámites fuera de
Word (el resultado). La línea de impacto «una sola plataforma reemplaza una pila de herramientas» era vaga y la
sustituye el tablero. La ficha nombra el equipo real (`cv.ts`: «equipo de 2») en vez de «Producto, diseño e
ingeniería». No hay métricas de uso (organizaciones activas, tiempo por trámite): no se escriben (P6).

---

### C2 · Andes Design System · Mercadolibre (`mercadolibre-andes`, NDA)

**Portada = tablero de cifras sobre el gradiente azul** (la card K4 ampliada).

| | ES | EN |
|---|---|---|
| Eyebrow | Mercadolibre · {derivado: Ene 2024 — Ene 2026} | Mercadolibre · {derivado: Jan 2024 — Jan 2026} |
| H1 | Andes Design System | Andes Design System |
| Gancho (≤ 90) | El sistema de diseño con el que Mercadolibre construye en 18 países. | The design system Mercadolibre builds with, across 18 countries. |
| Chip | NDA · Caso a solicitud | NDA · Case on request |

**Tablero**
| Cifra | ES | EN |
|---|---|---|
| {dot: 400+} | diseñadores en el sistema | designers on the system |
| {dot: 2.000+} / {dot: 2,000+} | ingenieros en el sistema | engineers on the system |
| {dot: 18} | países | countries |
| {dot: 3} | plataformas en paridad · iOS, Android, Web | platforms in parity · iOS, Android, Web |

**Bloque NDA (sube junto al tablero)**
| | ES | EN |
|---|---|---|
| Título | Las pantallas son de Mercadolibre | The screens belong to Mercadolibre |
| Cuerpo | Por eso no van en un sitio público. El sistema, su modelo de gobierno y el flujo de auditoría te los muestro en una llamada. | So they don't go on a public site. I'll walk you through the system, its governance model and the audit workflow on a call. |
| CTA 1 → `mailto:` | Pídelo por correo | Ask by email |
| CTA 2 → LinkedIn | Pídelo por LinkedIn ↗ | Ask on LinkedIn ↗ |
| Enlace público | Visitar ux.mercadolibre.com ↗ | Visit ux.mercadolibre.com ↗ |

**Ficha**
| | ES | EN |
|---|---|---|
| Rol | Tech Lead · Design Systems | Tech Lead · Design Systems |
| Quién lo usa (antes «Equipo») | 400+ diseñadores y 2.000+ ingenieros | 400+ designers and 2,000+ engineers |
| Mi equipo directo | [DATO A CONFIRMAR CON DOUG] | [DATO A CONFIRMAR CON DOUG] |
| Duración | ~2 años | ~2 years |
| Plataformas | iOS · Android · Web | iOS · Android · Web |

**Problema** — H2 ES: «Una librería, tres plataformas, miles de manos» · EN: «One library, three platforms, thousands of hands»

> ES (49 palabras): Andes es la fuente de verdad de los productos de comercio, fintech y envíos de Mercadolibre.
> Cientos de diseñadores la abren a diario y más de 2.000 ingenieros construyen con ella en iOS, Android y Web. A esa
> escala, el riesgo es la desviación: un componente que en Figma no es el que sale.
>
> EN: Andes is the source of truth for Mercadolibre's commerce, fintech and shipping products. Hundreds of designers
> open it every day and 2,000+ engineers build with it on iOS, Android and Web. At that scale the risk is drift: a
> component in Figma that isn't the one that ships.

**Mi parte** — H2 ES: «Lo que sostuve como líder técnico» · EN: «What I held as tech lead»

| ES | EN |
|---|---|
| Definí los fundamentos: tokens, espaciado, tipografía y movimiento, que rigen toda la suite. | I defined the foundations: tokens, spacing, type and motion, governing the whole suite. |
| Acordé con ingeniería una sola API por componente para iOS, Android y Web. | I agreed one API per component with engineering, for iOS, Android and Web. |
| Mantuve la librería: adiciones, deprecaciones y migraciones. | I maintained the library: additions, deprecations and migrations. |
| Llevé la IA a la práctica: auditorías con prompts que detectan desviaciones en Figma antes de producción. | I brought AI into the practice: prompt-driven audits that catch drift in Figma before it ships. |

**Decisiones** — H2 ES: «Dos decisiones, sin pantallas» · EN: «Two decisions, no screens». Ilustradas con la viñeta
actual de tokens → componente (02 §5.3).

| # | ES | EN |
|---|---|---|
| 1 | **Una API por componente, no tres.** *Tensión:* tres plataformas tienden a tres versiones del mismo componente. *Elección:* una API acordada con ingeniería y lanzada igual en las tres. *Por qué:* [DATO A CONFIRMAR CON DOUG: qué se ganó; sin cifra, se escribe en cualitativo]. | **One API per component, not three.** *Tension:* three platforms drift into three versions of the same component. *Choice:* one API agreed with engineering, shipped the same on all three. *Why:* [DATO A CONFIRMAR CON DOUG]. |
| 2 | **La auditoría, antes del lanzamiento.** *Tensión:* en una librería que cientos abren a diario, la desviación se encuentra tarde. *Elección:* auditorías con IA en Figma. *Por qué:* detectan la desviación antes de que salga a producción. | **Audit before release.** *Tension:* in a library hundreds open daily, drift is found late. *Choice:* AI-driven audits in Figma. *Why:* they catch drift before it ships. |

**Testimonio:** no hay. **Producto:** no hay (NDA); el bloque NDA ocupa su lugar.

**Qué cambió y por qué.** La portada deja de ser un H1 de tres líneas y pasa a ser el tablero: sin capturas, la cifra
es la imagen. El NDA sube al lado de las cifras y se escribe como señal («te lo muestro en una llamada»), no como
ausencia. «Equipo: 400+ diseñadores» se renombra «Quién lo usa», porque mezclaba usuarios del sistema con el equipo de
Doug. Se nombran dos decisiones a partir de `contributions`; la que no tiene «por qué» escrito queda marcada.
No se revela nada que el caso actual no diga.

---

### C3 · olbo (`olbo`)

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Producto propio · Design Engineer | Product of my own · Design Engineer |
| H1 | olbo | olbo |
| Gancho (≤ 90) | Una app de finanzas que te dice si vas a buen ritmo, no cuánto te queda. | A finance app that tells you if you're on pace, not how much is left. |
| Enlaces de portada | App en vivo ↗ · Código ↗ | Live app ↗ · Source ↗ |

**Ficha**
| | ES | EN |
|---|---|---|
| Rol | Design Engineer, de punta a punta | Design Engineer, end to end |
| Equipo | Yo, dirigiendo agentes de IA especializados (2.0) | Me, directing specialised AI agents (2.0) |
| Duración | Semanas, y sigue en marcha | Weeks, and still shipping |
| Plataformas | PWA instalable, para celular | Installable PWA, for the phone |

**Tablero**
| Cifra | ES (etiqueta · nota) | EN |
|---|---|---|
| {dot: 647} | pruebas en verde · la matemática del presupuesto, intacta | tests passing · budget math untouched |
| {dot: 0} | dependencias · sin bundler, sin framework | dependencies · no bundler, no framework |
| {dot: 24} | vistas rediseñadas · en vidrio claro | views redrawn · in light glass |
| {dot: 1} | color de acento · lila, una vez por pantalla | accent colour · lilac, once per screen |

Cambio de KPI propuesto: «5 sesiones encadenadas» → «24 vistas rediseñadas» (dato verificado en `contributions`),
porque al lector le dice más el alcance que la logística. P14.

**Problema** — H2 ES: «La 1.0 funcionaba; la interfaz le estorbaba» · EN: «The 1.0 worked; the interface got in its way»

> ES (55 palabras): Las apps de presupuesto responden «cuánto te queda», la pregunta que angustia. olbo responde si el
> mes va a buen ritmo: el gasto contra la parte del mes que ya pasó. La 1.0 funcionaba, pero su interfaz oscura y
> multicolor gritaba, y el único color que importa, el del semáforo, competía con el degradado de la marca.
>
> EN: Budgeting apps answer “how much is left”, the anxious question. olbo answers whether the month is on pace:
> spending against the share of the month already gone. The 1.0 worked, but its dark, multicolour interface shouted,
> and the one colour that matters, the traffic light, was competing with the brand gradient.

**Mi parte** — H2 ES: «Marca, interfaz y quién escribió qué» · EN: «Brand, interface, and who wrote what»

| ES | EN |
|---|---|
| Diseñé la marca 2.0: claro, tinta y un solo acento lila, Urbanist y Manrope, y el símbolo «Anillo y centro». | I designed brand 2.0: light, ink and one lilac accent, Urbanist and Manrope, and the Ring and Centre mark. |
| Rediseñé las 24 vistas en vidrio claro, con un bento casi sin espacios y el FAB como esfera de IA. | I redrew all 24 views in light glass, with a near-gapless bento and the FAB as an AI sphere. |
| Programé la 1.0 de punta a punta. | I engineered 1.0 end to end. |
| La 2.0 la ejecutaron agentes de IA especializados (branding, UI, ejecución, QA) que dirigí y revisé fase por fase. | 2.0 was carried out by specialised AI agents (branding, UI, execution, QA) that I directed and reviewed phase by phase. |

**Decisiones** — H2 ES: «Lo que se quedó, y lo que se fue» · EN: «What stayed, and what went»

| # | ES | EN |
|---|---|---|
| 1 | **Lila, porque no choca con el semáforo.** *Tensión:* verde, ámbar y rojo ya significan estado; un acento lima se lee «vas bien» y uno naranja «cuidado». *Elección:* un lila claro, una vez por pantalla y siempre con tinta encima. *Por qué:* el azul es de todos los bancos y, en Colombia, Nu tiene el morado profundo y Nequi el magenta; el lila claro no es de nadie. | **Lilac, because it can't collide with the traffic light.** *Tension:* green, amber and red already mean state; lime reads “on track”, orange reads “careful”. *Choice:* a light lilac, once per screen, always with ink on top. *Why:* blue belongs to every bank, and in Colombia Nu owns deep purple and Nequi magenta; light lilac belongs to nobody. |
| 2 | **La matemática no se toca.** *Tensión:* cambiar casi toda la piel sin romper el núcleo. *Elección:* el módulo del presupuesto quedó fuera de límites durante todo el rediseño. *Por qué:* es lo que permitió cambiar tanto la interfaz; las 647 pruebas siguieron en verde. | **The math is off limits.** *Tension:* changing almost all of the skin without breaking the core. *Choice:* the budget module stayed off limits for the whole redesign. *Why:* that's what let the interface change this much; all 647 tests stayed green. |
| 3 | **Un rediseño también resta.** *Tensión:* cada brillo de la 1.0 tenía su razón. *Elección:* se fueron el fondo oscuro, los brillos, el multicolor y tres tipografías; el degradado sobrevive solo en el FAB. *Por qué:* juntos gritaban, y el semáforo tenía que volver a ser lo único con color. | **A redesign can subtract.** *Tension:* every glow in 1.0 had a reason. *Choice:* out went the dark background, the glows, the multicolour and three typefaces; the gradient survives only on the FAB. *Why:* together they shouted, and the traffic light had to be the only colour again. |

**Producto** — H2 ES: «Cuatro formas de registrar un gasto» · EN: «Four ways to log an expense» (foto del recibo, voz,
SMS del banco, extracto en PDF; capítulos actuales debajo).

**Proceso** — H2 ES: «Agentes con un rol cada uno» · EN: «Agents with one role each» (riel: Branding · UI · Ejecución ·
QA · Orquestación; 5 sesiones encadenadas).

**Testimonio:** no hay (producto propio).

**Qué cambió y por qué.** El gancho deja la mitad técnica («la versión 2.0 cambia una interfaz oscura…») para el
problema y abre con el beneficio. Las tres decisiones estaban dentro de los capítulos de marca y aprendizajes: se
extraen al frente. Mi parte dice explícitamente qué programó Doug (1.0) y qué ejecutaron los agentes (2.0), algo que
hoy solo está en el colofón. La nota «lila, con avaricia» se cambia por «una vez por pantalla»: es la regla real y se
entiende sin guiño.

---

### C4 · Banco de Occidente (`banco-de-occidente`)

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Aval Digital Labs · {derivado: Nov 2018 — Ene 2024} | Aval Digital Labs · {derivado: Nov 2018 — Jan 2024} |
| H1 | Banco de Occidente | Banco de Occidente |
| Gancho (≤ 90) | Un portal bancario más liviano y el sistema de diseño que compartían 12+ squads. | A lighter banking portal, and the design system 12+ squads shared. |

**Ficha**
| | ES | EN |
|---|---|---|
| Rol | Senior Product Designer · Design System Gatekeeper | Senior Product Designer · Design System Gatekeeper |
| Equipo | Equipos del banco y de Aval Digital Labs | The bank's and Aval Digital Labs' teams |
| Duración | 5 años y 2 meses | 5 years, 2 months |
| Plataformas | Escritorio · tableta · celular | Desktop · tablet · mobile |

**Tablero**
| Cifra | ES | EN |
|---|---|---|
| {dot: 12+} | squads alineados · un solo sistema | squads aligned · one system |
| {dot: 20+} | áreas del sistema documentadas · de fundamentos a organismos | documented system areas · foundations to organisms |
| {dot: 15} | íconos ilustrados · dibujados para el sistema | illustrated icons · drawn for the system |
| {dot: 3} | dispositivos, un portal | devices, one portal |

**Problema** — H2 ES: «Un portal denso, y cada squad resolviendo lo mismo a su manera» · EN: «A dense portal, and every squad
solving the same problem its own way»

> ES (45 palabras): La banca digital del Banco de Occidente era visualmente densa y difícil de recorrer: la gente se
> perdía en páginas anidadas. Además, cada squad resolvía los mismos problemas a su manera, así que cada pantalla
> nueva costaba lo mismo que la anterior.
>
> EN: Banco de Occidente's digital banking was visually dense and hard to move through: people got lost in nested
> pages. And every squad solved the same problems its own way, so each new screen cost as much as the last one.

**Mi parte** — H2 ES: «Mío: el sistema, la dirección de arte y la UI» · EN: «Mine: the system, the art direction and the UI»

| ES | EN |
|---|---|
| Rediseñé el portal transaccional: ingreso y registro, cuentas y tarjetas, transferencias, pagos y bloqueo de productos. | I redesigned the transactional portal: login and registration, accounts and cards, transfers, payments and product blocking. |
| Construí Velocity, el sistema de diseño del banco: documentación, fundamentos y componentes con diseño atómico. | I built Velocity, the bank's design system: documentation, foundations and components on atomic design. |
| Como guardián del sistema, aprobé adiciones, deprecaciones y patrones en 12+ squads, y dirigí talleres y críticas. | As the system's gatekeeper I approved additions, deprecations and patterns across 12+ squads, and ran workshops and crits. |
| Dibujé los 15 íconos ilustrados y mentoré a diseñadores junior y semi senior. | I drew the 15 illustrated icons and mentored junior and mid-level designers. |
| Del banco y del laboratorio: la dirección de producto y la investigación UX. | The bank's and the lab's teams owned product direction and UX research. |

**Decisiones** — H2 ES: «Menos profundidad, más igualdad» · EN: «Less depth, more sameness»

| # | ES | EN |
|---|---|---|
| 1 | **Dos capas de navegación, y no más.** *Tensión:* el portal anterior enterraba a la gente en páginas anidadas. *Elección:* un sistema de popups: página, fondo desenfocado, componente y popup. *Por qué:* dos capas alcanzan para cada tarea bancaria y nadie se pierde en algo de dos niveles. | **Two layers of navigation, and no more.** *Tension:* the old portal buried people in nested pages. *Choice:* a popup system: page, blurred background, component, popup. *Why:* two layers cover every banking task, and nobody gets lost two layers deep. |
| 2 | **Idéntico entre dispositivos, no parecido.** *Tensión:* el brief pedía una experiencia similar. *Elección:* la hicimos idéntica: mismos nombres, mismo orden. *Por qué:* quien aprende el portal en el computador no debería volver a aprenderlo en el bus. | **Identical across devices, not similar.** *Tension:* the brief asked for a similar experience. *Choice:* we made it identical: same names, same order. *Why:* someone who learns the portal on a laptop shouldn't have to relearn it on the bus. |
| 3 | **Diseño atómico, porque el front end también piensa así.** *Tensión:* un sistema se puede organizar de muchas formas. *Elección:* átomos, moléculas y organismos. *Por qué:* ingeniería construía componentes con esa misma granularidad, así que documentación e implementación compartían vocabulario. | **Atomic design, because the front end thinks that way too.** *Tension:* a system can be organized many ways. *Choice:* atoms, molecules and organisms. *Why:* engineering built components at that same granularity, so documentation and code shared one vocabulary. |

La decisión 3 viene de `specs/07` §g y de `contributions` («on atomic design so the front end mirrors it»); hoy no
está en `decisions`.

**Producto** — H2 ES: «El portal, del inicio al bloqueo de una tarjeta» · EN: «The portal, from home to blocking a card»
(galería actual).

**Proceso** — H2 ES: «Flujos antes que pantallas» · EN: «Flows before screens»: 01 Investigación y descubrimiento · 02
Seis flujos con sus excepciones («en la banca, la excepción es el producto») · 03 Prototipos probados con personas (el
registro pasó por varias rondas).

**Testimonio** (cita completa, verbatim, `lang="en"`; en ES con «Cita original en inglés»):
“Extremely professional and fast service. Doug is a master of detail and very creative. We've done 8 projects with him
and every single one delivered above expectations. He doesn't just design — he architects how products should feel.”
— Francesca Steri · Directora de Diseño / Design Director, Aval Digital Labs.

**Qué cambió y por qué.** El gancho deja «uno de los bancos más grandes de Colombia» (cierto, pero dice del cliente,
no del trabajo) y nombra los dos entregables. La línea del colofón «Sistema de diseño, dirección de arte y diseño UI:
míos» sube a Mi parte: es la respuesta exacta a «¿quién era yo aquí?». Se recupera la decisión de diseño atómico, que
ya estaba escrita. «Millones de clientes» sigue fuera por no tener fuente (P8).

---

### C5 · DC Medical Aesthetics (`dc-medical`)

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Producto propio · Socio y constructor | Product of my own · Co-owner and builder |
| H1 | DC Medical | DC Medical |
| Gancho (≤ 90) | Una clínica en tres ciudades, manejada desde el celular de la secretaria. | A three-city clinic, run from the secretary's phone. |
| Segunda línea | Ningún procedimiento empieza sin estar pagado. | No procedure starts until it's paid for. |
| Enlace | Panel en vivo (acceso del personal) ↗ | Live panel (staff sign-in) ↗ |

**Ficha**
| | ES | EN |
|---|---|---|
| Rol | Diseñador de producto e ingeniero de diseño, de punta a punta | Product designer and design engineer, end to end |
| Equipo | Solo: producto, diseño y código | Solo: product, design and code |
| Duración | En vivo desde el 21 sep 2026 | Live since Sep 21, 2026 |
| Plataformas | Web instalable (PWA): escritorio y celular | Installable web app (PWA): desktop and phone |

**Tablero**
| Cifra | ES | EN |
|---|---|---|
| {dot: 14} | días del primer commit a la versión del 2 oct | days from first commit to the Oct 2 version |
| {dot: 3} | fases con candado · valoración, pago, procedimiento | phases with locks · valuation, payment, procedure |
| {dot: 0} | bases de datos nuevas · Drive y Calendar siguen mandando | new databases · Drive and Calendar stay the source of truth |
| {dot: 12} | suites de pruebas · dominio, contabilidad, worker, navegador | test suites · domain, ledger, worker, browser |

Línea de impacto (display, debajo del tablero): ES «Saber cuánto debía una paciente tomaba unos diez minutos; ahora
está en cada caso, junto al siguiente paso.» · EN «Finding what a patient owed took about ten minutes; now every case
shows it beside the next step.»

**Problema** — H2 ES: «Todo escrito, nada conectado» · EN: «Everything written down, nothing connected»

> ES (50 palabras): Las pacientes llegan por WhatsApp, las citas viven en el calendario de la clínica y los pagos,
> consentimientos y controles, en hojas de Drive llevadas a mano. Para saber cuánto debía una paciente, la
> secretaria abría archivo tras archivo: unos diez minutos por pregunta. Y trabaja desde el celular, muchas veces en
> el carro.
>
> EN: Patients arrive on WhatsApp, appointments live in the clinic's calendar, and payments, consents and follow-ups
> in Drive sheets kept by hand. To find what a patient owed, the secretary opened file after file: about ten minutes
> per question. And she works from her phone, often from the car.

**Mi parte** — H2 ES: «Socio de la clínica, y el que construyó el panel» · EN: «Co-owner of the clinic, and the one who built
the panel»

| ES | EN |
|---|---|
| Soy socio de la clínica con el médico: puse el brief y construí el panel de punta a punta. | I co-own the clinic with the doctor: I set the brief and built the panel end to end. |
| Diseñé las tres fases con candado: la luz verde exige el pago completo, su recibo y el consentimiento firmado. | I designed the three locked phases: the green light needs full payment, its receipt and the signed consent. |
| Escribí las reglas de dinero como funciones con pruebas: saldos, comisiones de tarjeta, fechas y cruce de nombres. | I wrote the money rules as tested functions: balances, card fees, dates and name matching. |
| El protocolo médico es del médico; el uso diario de la secretaria moldeó los flujos. | The medical protocol is the doctor's; the secretary's daily use shaped the flows. |

**Decisiones** — H2 ES: «Tres decisiones que protegen la plata y a las personas» · EN: «Three decisions that protect the money and
the people»

| # | ES | EN |
|---|---|---|
| 1 | **La hoja de cálculo sigue siendo la fuente de verdad.** *Tensión:* lo obvio era una base de datos. *Elección:* el panel lee y escribe sobre Drive y Calendar. *Por qué:* quien lleva la contabilidad trabaja en Drive todos los días y la clínica no debe depender de mí: si el panel se apaga mañana, no se pierde nada. | **The spreadsheet stays the source of truth.** *Tension:* a database was the obvious build. *Choice:* the panel reads and writes Drive and Calendar. *Why:* the person who keeps the books lives in Drive, and the clinic shouldn't depend on me: switch the panel off tomorrow and nothing is lost. |
| 2 | **Los saldos se leen, no se suman.** *Tensión:* cada fila de ingresos lleva el saldo que queda después de ese pago. *Elección:* manda la fila más reciente. *Por qué:* sumar contaba la deuda otra vez con cada abono; una versión temprana reportó un saldo fantasma de treinta y ocho millones de pesos. | **Balances are read, not summed.** *Tension:* each income row carries the balance left after that payment. *Choice:* the latest row wins. *Why:* summing counted the debt again with every deposit; an early version reported a phantom thirty-eight million pesos. |
| 3 | **Un color por ciudad, nunca solo.** *Tensión:* el médico trabaja en tres ciudades y hay que distinguirlas de un vistazo. *Elección:* naranja Barranquilla, azul Bogotá, verde azulado Medellín, validados para daltonismo, y el nombre siempre junto al punto. *Por qué:* nadie tiene que distinguir el verde azulado del azul. | **A colour per city, never on its own.** *Tension:* the doctor works in three cities, and they must read at a glance. *Choice:* orange Barranquilla, blue Bogotá, teal Medellín, checked for colour blindness, with the name always beside the dot. *Why:* nobody has to tell teal from blue. |

**Producto** — H2 ES: «El día de la clínica en una pantalla» · EN: «The clinic's day on one screen» (capítulos actuales).

**Proceso** — H2 ES: «Primero se atacó el plan» · EN: «The plan was attacked first»: 01 Mapear cómo trabaja la clínica ·
02 Revisión adversarial de datos, seguridad y factibilidad (solo la tercera versión llegó al código) · 03 Solo lectura
desde el primer día · 04 Edición con acceso por persona, tras una auditoría de seguridad.

**Testimonio:** no hay. [DATO A CONFIRMAR CON DOUG: ¿una cita de la secretaria o del médico? P12]

**Qué cambió y por qué.** El gancho nombra la escala real (tres ciudades) y a la usuaria; el «ningún procedimiento
empieza sin estar pagado» pasa a segunda línea porque es la regla, no el beneficio. El antes medido (diez minutos)
sube del contexto a la línea de impacto. Mi parte dice de entrada que Doug es socio: es su propio negocio, y decirlo
evita que parezca un cliente.

---

### C6 · MakeaPet (`makeapet`)

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Producto propio · iOS, Android y web | Product of my own · iOS, Android, web |
| H1 | MakeaPet | MakeaPet |
| Gancho (≤ 90) | Tinder para mascotas: de cinco pantallas en Figma a una app en iOS, Android y web. | Tinder for pets: from five Figma screens to a real app on iOS, Android and the web. |
| Enlace | Demo en vivo ↗ | Live demo ↗ |

**Ficha**
| | ES | EN |
|---|---|---|
| Rol | Diseño UX/UI y dirección de producto | UX/UI design and product direction |
| Equipo | Yo, dirigiendo un equipo de 10 agentes de IA | Me, directing a team of 10 AI agents |
| Duración | Octubre de 2026 | October 2026 |
| Plataformas | iOS · Android · PWA | iOS · Android · PWA |

**Tablero**
| Cifra | ES | EN |
|---|---|---|
| {dot: 680+} | pruebas automatizadas · 60 suites, en verde | automated tests · 60 suites, green |
| {dot: 10} | agentes de IA dirigidos · un rol cada uno | AI agents directed · one role each |
| {dot: 1} | código · iOS, Android y PWA | codebase · iOS, Android and PWA |
| AA (en display, no Doto: son letras) | contraste en cada pantalla · corregido en los tokens | contrast on every screen · fixed in the tokens |

**Problema** — H2 ES: «Encontrarle compañía a tu mascota depende de la suerte» · EN: «Finding your pet a playmate comes down to
luck»

> ES (48 palabras): Quien busca compañía para su perro o su gato depende del parque al que va, a la hora en que va. No
> hay una forma simple de ver quién está cerca y si se llevarían bien. El reto, además, era llevar cinco pantallas de
> Figma a una app completa, igual en iOS y Android.
>
> EN: Owners looking for company for their dog or cat depend on the park they go to, at the hour they go. There's no
> simple way to see who is nearby and whether they'd get along. The challenge was also turning five Figma screens
> into a complete app, identical on iOS and Android.

**Mi parte** — H2 ES: «Diseñé y dirigí; los agentes escribieron el código» · EN: «I designed and directed; agents wrote the code»

| ES | EN |
|---|---|
| Investigación y UX: el problema, los usuarios, la arquitectura de información y todos los flujos más allá de las cinco pantallas. | Research and UX: the problem, the users, the information architecture and every flow beyond the five screens. |
| Sistema de diseño: tokens, movimiento físico, una capa de vidrio y AA, escritos como reglas que un agente puede verificar. | Design system: tokens, physical motion, a glass layer and AA, written as rules an agent can check. |
| No escribí el código: dirigí a 10 agentes con roles separados y cada fase cerró con revisión de diseño, código y seguridad. | I didn't write the code: I directed 10 agents with separate roles, and each phase closed with a design, code and security review. |

**Decisiones** — H2 ES: «Cuatro decisiones de producto» · EN: «Four product decisions» (vienen del capítulo «Decisiones
clave, y por qué»)

| # | ES | EN |
|---|---|---|
| 1 | **Foto obligatoria.** *Tensión:* dejar entrar mascotas sin foto facilita el registro. *Elección:* no se puede agregar una mascota sin foto. *Por qué:* en una app de swipe la foto es el producto, y exigirla elimina los estados sin foto del selector, los avatares y el mazo. | **A photo is required.** *Tension:* letting pets in without a photo makes sign-up easier. *Choice:* a pet can't be added without one. *Why:* in a swipe app the photo is the product, and requiring it removes every no-photo state from the switcher, the avatars and the deck. |
| 2 | **Un mapa que no delata a nadie.** *Tensión:* nadie comparte dónde vive por un juego. *Elección:* cada dueño se ubica en una cuadrícula de unos 400 m y solo él puede leer sus coordenadas exactas. *Por qué:* sin esa garantía, nadie aparecería en el mapa. | **A map that gives nobody away.** *Tension:* nobody shares where they live for a game. *Choice:* each owner snaps to a grid of about 400 m, and only they can read their exact coordinates. *Why:* without that, nobody would show up on the map. |
| 3 | **Varias mascotas, un swipe claro.** *Tensión:* los matches son de la mascota y el chat es de los dueños. *Elección:* una pastilla con la mascota activa abre «Swipe as…»; quien tiene una sola nunca la ve. *Por qué:* siempre sabes como quién estás haciendo swipe. | **Several pets, one clear swipe.** *Tension:* matches belong to the pet, the chat to the owners. *Choice:* a pill with the active pet opens Swipe as…; owners with one pet never see it. *Why:* you always know who you're swiping as. |
| 4 | **AA se arregla en el token, no en la pantalla.** *Tensión:* dos colores del diseño original no pasaban AA. *Elección:* se oscureció el gris secundario y el texto de los botones naranja pasó a café oscuro; el degradado de Figma quedó igual. *Por qué:* cambiar dos tokens arregló todas las pantallas a la vez. | **Fix AA in the token, not the screen.** *Tension:* two colours in the original design failed AA. *Choice:* the secondary grey was darkened and text on orange buttons became dark brown; the Figma gradient stayed. *Why:* changing two tokens fixed every screen at once. |

**Producto** — H2 ES: «Un gesto que ya conoces» · EN: «A gesture you already know».
**Proceso** — H2 ES: «Diez agentes, un rol cada uno» · EN: «Ten agents, one role each» (58 commits pequeños; modo demo
sin backend).

**Qué cambió y por qué.** El rol de la IA queda claro desde la ficha y Mi parte («no escribí el código»), en vez de
aparecer en el capítulo de desarrollo. Las decisiones salen del capítulo de diseño al frente y se escriben en tres
tiempos. «AA» se compone en display y no en dot-matrix: Doto es para cifras, no para letras.

---

### C7 · Royal Caribbean Cruises (`royal-caribbean`, caso corto)

Página de una pantalla y media: portada, ficha, problema, mi parte, testimonio, siguiente (02 §5.3). Sin tablero ni
decisiones: no hay datos para ninguno de los dos, y no se rellenan.

| | ES | EN |
|---|---|---|
| Eyebrow | Globant · {derivado: Ago 2017 — Nov 2018} | Globant · {derivado: Aug 2017 — Nov 2018} |
| H1 | Royal Caribbean | Royal Caribbean |
| Gancho (≤ 90) | Reservar un crucero y vivirlo a bordo, con una conexión que va y viene. | Booking a cruise and living it aboard, on a connection that comes and goes. |
| Rol | Senior Product Designer | Senior Product Designer |
| Equipo | Equipo multifuncional EE. UU. + LATAM | Cross-functional team, US + LATAM |
| Duración | {derivado: formatPeriod()} (hoy dice «1 año», ver P9) | ídem |
| Plataformas | iOS · Android · web | iOS · Android · web |
| Impacto (display, sin cifra) | Un solo recorrido móvil, de la reserva al desembarque, hecho para aguantar en altamar. | One mobile journey, from booking to disembarkation, built to hold up at sea. |

**Problema** — H2 ES: «Una semana a bordo con wifi irregular» · EN: «A week aboard on patchy wifi»
> ES: Huéspedes de todas las edades, unos más cómodos con la tecnología que otros, pasan una semana en el barco con una
> conexión que va y viene. Necesitan reservar, ver horarios, restaurantes, excursiones y su saldo sin depender de ella.
>
> EN: Guests of every age, some more at ease with technology than others, spend a week at sea on a connection that
> comes and goes. They need to book, check schedules, dining, excursions and their balance without relying on it.

**Mi parte** — H2 ES: «Reserva y vida a bordo, desde Medellín» · EN: «Booking and life aboard, from Medellín»
- ES: Diseñé los flujos móviles y web de reserva: destinos y tipos de camarote. / EN: I designed the mobile and web booking
  flows: destinations and stateroom types.
- ES: Diseñé horarios, restaurantes, excursiones y saldos para funcionar con conexión intermitente. / EN: I designed
  schedules, dining, excursions and balances to work on intermittent connectivity.
- ES: Trabajé desde el estudio de Globant en Medellín con producto e ingeniería de Royal Caribbean en EE. UU. / EN: I
  worked from Globant's Medellín studio with Royal Caribbean's product and engineering in the US.
- [DATO A CONFIRMAR CON DOUG: qué decisión concreta tomó para la conexión intermitente; con eso nace un bloque de
  decisión de dos líneas.]

**Testimonio:** “We were fortunate to work with Doug on our latest product launch. His creativity, expertise, and
passion for design shone through in every detail. He elevated the entire team's standard of craft.” — Nicolas
Polverino · Director Técnico / Technical Director, Globant.

**Qué cambió y por qué.** El gancho pasa de describir el encargo («reservas móviles y experiencias a bordo…») a la
condición que lo hace difícil (la conexión). La duración deja de escribirse a mano («1 año») y sale de `cv.ts`, que
dice 15 meses. Se asume corto: no se inventan cifras ni decisiones.

---

### C8 · Qrvey — AutomatiQ (`qrvey`)

| | ES | EN |
|---|---|---|
| Eyebrow | Qrvey · vía Ideaware · {derivado: Oct 2016 — Ago 2017} | Qrvey · through Ideaware · {derivado: Oct 2016 — Aug 2017} |
| H1 | Qrvey — AutomatiQ | Qrvey — AutomatiQ |
| Gancho (≤ 90) | Que una respuesta negativa dispare su propio seguimiento, sin nadie pendiente. | So a negative answer triggers its own follow-up, with nobody watching. |
| Rol | Lead UI Designer | Lead UI Designer |
| Equipo | Producto e ingeniería | Product and engineering |
| Duración | 11 meses (ver P11) | 11 months |
| Plataformas | Web y móvil | Web and mobile |
| Impacto (display, sin cifra) | Una respuesta negativa podía disparar una nueva encuesta una semana después y mandar los resultados al equipo. | A negative answer could trigger a new survey a week later and email the results to the team. |

**Problema** — H2 ES: «Las respuestas llegaban; alguien tenía que actuar» · EN: «The answers came in; someone still had to act»
> ES: Qrvey era una plataforma de encuestas y NPS, pero alguien todavía tenía que hacer algo con cada respuesta. Y
> quienes iban a automatizarlo nunca habían dibujado un diagrama de flujo.
>
> EN: Qrvey was a survey and NPS platform, but someone still had to act on every answer. And the people who would
> automate it had never drawn a flow chart.

**Mi parte** — H2 ES: «AutomatiQ, de punta a punta» · EN: «AutomatiQ, end to end»
- ES: Promovido a liderar la UI de Qrvey: definí su lenguaje visual en móvil y web. / EN: Promoted to lead UI on Qrvey: I
  defined its visual language across mobile and web.
- ES: Diseñé AutomatiQ: procesos, disparadores, condiciones y acciones. / EN: I designed AutomatiQ: processes, triggers,
  conditions and actions.
- ES: Prototipé mejoras de UX/UI que llegaron a producción. / EN: I prototyped UX/UI improvements that shipped.

**Decisiones** — H2 ES: «Automatizar sin dibujar un diagrama» · EN: «Automation without drawing a diagram» (hoy están
escritas como `contributions`; son decisiones)

| # | ES | EN |
|---|---|---|
| 1 | **Tarjetas, no un lienzo.** *Tensión:* los usuarios nunca habían dibujado un flujo. *Elección:* disparadores y condiciones se abren en su sitio, con las palabras del producto («If Answer Is», «# of Responses»); no hay conectores que dibujar. *Por qué:* se configura leyendo, no diagramando. | **Cards, not a canvas.** *Tension:* users had never drawn a flow. *Choice:* triggers and conditions open in place, in the product's words (“If Answer Is”, “# of Responses”); no connectors to draw. *Why:* you set it up by reading, not by diagramming. |
| 2 | **Una lista que informa sobre sí misma.** *Elección:* cada proceso muestra su estado, las encuestas que cubre, el tiempo promedio de ciclo y los ciclos ejecutados. *Por qué:* lo que corre solo tiene que rendir cuentas sin que haya que abrirlo. | **A list that reports on itself.** *Choice:* each process shows its status, the surveys it covers, average cycle time and cycles run. *Why:* something that runs on its own should report without being opened. |
| 3 | **El seguimiento es la siguiente encuesta.** *Elección:* los correos llevan los resultados y un enlace activo a una encuesta en el cuerpo. *Por qué:* cerrar el ciclo es preguntar otra vez. | **The follow-up is the next survey.** *Choice:* emails carry the results and a live survey link in the body. *Why:* closing the loop means asking again. |

Los «por qué» de las decisiones 1–3 son la lectura directa de lo que ya dicen las `contributions` y el `tagline`; si
Doug recuerda otra razón, gana la suya.

**Testimonio:** “Working with Doug was an absolute pleasure. He consistently delivered designs that were not only
beautiful but highly functional. His ability to translate complex data into clear interfaces transformed our entire
dashboard experience.” — Arman Eshraghi · Fundador y CEO / Founder & CEO, Qrvey.

**Qué cambió y por qué.** Las tres `contributions` eran decisiones de diseño disfrazadas de tareas: se escriben como
tales. El gancho pasa de describir el constructor a lo que logra para el usuario. La ficha dice «vía Ideaware»
(`employer` en `cv.ts`), para que el CV y el caso digan lo mismo.

---

### C9 · Ideaware — Diseño UX multicliente (`ideaware`, caso corto)

| | ES | EN |
|---|---|---|
| Eyebrow | Ideaware · {derivado: Mar 2016 — Oct 2016} | Ideaware · {derivado: Mar 2016 — Oct 2016} |
| H1 | Diseño UX multicliente | Multi-client UX design |
| Gancho (≤ 90) | Aprender rápido el dominio de cada cliente y entregar diseño listo para desarrollo. | Learning each client's domain fast, and handing over developer-ready design. |
| Rol | Senior UX/UI Designer | Senior UX/UI Designer |
| Equipo | Agencia distribuida | Distributed agency |
| Duración | {derivado} (hoy dice «1 año», ver P10) | ídem |
| Plataformas | Web y móvil | Web and mobile |
| Impacto (display) | Diseño listo para desarrollo en fintech, marketplaces y B2B, y la soltura entre dominios que después hizo natural el trabajo en sistemas. | Developer-ready design across fintech, marketplaces and B2B, and the fluency across domains that later made systems work feel natural. |

**Problema** — H2 ES: «Un dominio nuevo en cada encargo» · EN: «A new domain every engagement»
> ES: En una agencia remota, cada cliente traía un dominio distinto: fintech, consumo, B2B. El trabajo era entenderlo
> rápido y entregar un diseño limpio que desarrollo pudiera construir sin preguntar.
>
> EN: At a remote-first agency, each client brought a different domain: fintech, consumer, B2B. The job was to learn
> it fast and hand over clean design that developers could build without asking.

**Mi parte** — H2 ES: «Wireframes, UI kits y una promoción» · EN: «Wireframes, UI kits and a promotion»
- ES: Entregué wireframes, UI kits y prototipos de alta fidelidad a clientes de EE. UU. y Latinoamérica. / EN: I delivered
  wireframes, UI kits and high-fidelity prototypes to US and Latin American clients.
- ES: Diseñé Pool Botball, una app de iOS para monitorear la química de piscinas. / EN: I designed Pool Botball, an iOS app
  for monitoring pool chemistry.
- ES: Apliqué patrones reutilizables entre clientes y los ajusté a cada uno. / EN: I applied reusable patterns across
  clients and tailored them to each.
- ES: Me promovieron a liderar la cuenta de Qrvey (siguiente caso). / EN: I was promoted to lead the Qrvey account (next
  case).

**Qué cambió y por qué.** Se nombra un proyecto concreto que ya está en el CV (Pool Botball) en lugar de solo
«productos fintech, de consumo y B2B». El caso se cuenta como el puente a Qrvey, que es lo que fue. La duración sale de
`cv.ts`. Ninguna cifra.

---

### C10 · Chub (`chub`, proyecto paralelo)

| | ES | EN |
|---|---|---|
| Eyebrow | Proyecto freelance paralelo · 2018 | Freelance side project · 2018 |
| H1 | Chub | Chub |
| Gancho (≤ 90) | Reserva un carro por minuto, conoce el costo antes y después controla la cabina. | Book a car by the minute, see the cost up front, then control the cabin. |
| Rol | Diseñador de producto, de punta a punta | Product designer, end to end |
| Equipo | Diseño en solitario, entregado a un equipo de desarrollo | Solo designer, handed off to a dev team |
| Estado (en la ficha, no escondido en el colofón) | Nunca se lanzó | Never released |
| Plataforma | iOS | iOS |
| Bloque de impacto: rótulo `case.idea` | La idea | The idea |
| Texto | Un flujo de reserva que responde lo que las apps de alquiler suelen esconder, qué carro es y cuánto cuesta el viaje, antes de comprometerte. | A booking flow that answers what rental apps usually hide, what the car is and what the trip costs, before you commit. |

**Decisiones** — H2 ES: «Nada de sorpresas en la última pantalla» · EN: «No surprises on the last screen»
| # | ES | EN |
|---|---|---|
| 1 | **La decisión en una sola tarjeta:** autonomía, aceleración, puestos y tarifa por minuto, encima del botón. | **The decision on one card:** range, acceleration, seats and the per-minute rate, above the button. |
| 2 | **Una ruta con precio:** recogida, destino, tiempo estimado y rango de tarifa antes de empezar. | **A priced route:** pickup, destination, estimated time and a fare range before you start. |
| 3 | **De la reserva a la cabina:** en pleno viaje, la app controla el aire y los asientos ventilados. | **From booking to cabin:** mid-trip, the app runs climate and the ventilated seats. |

**Qué cambió y por qué.** «Nunca se lanzó» sube del colofón a la ficha: decirlo arriba es más honesto y quita la
pregunta. Las `contributions` se presentan como decisiones. Publicación sujeta a P15 (marca Tesla en las pantallas).

---

### 5.11 Cierre de cada caso (bloque «Siguiente»)

| Pieza | ES | EN |
|---|---|---|
| Rótulo | Siguiente caso | Next case study |
| Card | Card bento del siguiente caso, con su eyebrow, título y cifra (las de §3) | ídem |
| Línea de contacto | ¿Quieres verlo en detalle? Te lo cuento en una llamada. | Want the details? I'll walk you through it on a call. |
| CTA | Hablemos | Let's talk |
| Volver | Todo el trabajo | All work |

---

## 6. Perfil (`/about`), trayectoria (`/experience`) e índice de trabajo (`/work`)

### 6.1 `/about`

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Perfil | About |
| H1 | Doug Vargas | Doug Vargas |
| Línea de nivel | Head of Product · Senior Product Designer (UX/UI) · Design Engineer | ídem |
| Lugar | Barranquilla, Colombia · UTC-5 | Barranquilla, Colombia · UTC-5 |
| Alt del retrato | §2.4 | §2.4 |

**Bio (3 frases; reescribe `site.summary`)**
> ES: Soy diseñador de producto y construyo lo que diseño. Hoy dirijo el producto de Naowee, la plataforma del sistema
> deportivo de Colombia, y hago en código los prototipos que lo definen. Antes fui líder técnico de Andes, el sistema
> de diseño de Mercadolibre en 18 países, y durante 5 años y 2 meses guardián del sistema de diseño del Banco de
> Occidente.
>
> EN: I'm a product designer who builds what he designs. Today I lead product at Naowee, the platform for Colombia's
> sports system, and build the prototypes in code that define it. Before that I was tech lead on Andes, Mercadolibre's
> design system across 18 countries, and for 5 years and 2 months the gatekeeper of Banco de Occidente's design system.

Cambio: `site.summary` hablaba de «un solo sistema de diseño, código que funciona y la IA en el proceso» (tres ideas
en una cola de frase). La nueva bio mete el tercer hito de carrera (Banco de Occidente) y deja la IA para «Lo que
hago», donde se explica.

**Dos párrafos de contexto** (reescriben `About.tsx`)
> ES 1: Lo que me ha mantenido aquí no es una pantalla en particular: son los sistemas de abajo. Los tokens, el
> gobierno y el lenguaje compartido que permite que cientos de diseñadores y miles de ingenieros entreguen un solo
> producto.
>
> ES 2: Hace rato dejé de separar diseñar de construir. Prototipo en código, entrego interfaces reales y dejo que el
> sistema y los modelos carguen el trabajo repetitivo. olbo y DC Medical son la prueba: una app de finanzas y el panel
> de una clínica que diseñé, construí y lancé, los dos en uso diario.
>
> EN 1: What has kept me here isn't any single screen. It's the systems underneath: the tokens, the governance and the
> shared language that let hundreds of designers and thousands of engineers ship one product.
>
> EN 2: I stopped separating designing from building a while ago. I prototype in code, ship real interfaces and let
> the system and the models carry the repetitive work. olbo and DC Medical are the proof: a finance app and a clinic's
> operating panel I designed, built and shipped, both in daily use.

**Lo que hago** — H2 ES: «Lo que hago» · EN: «What I do» (3 cards; cuerpo ≤ 45 palabras)

| | ES | EN |
|---|---|---|
| {dot: 01} Dirección de producto / Product direction | Decido qué debe ser un producto y respondo por él hasta que sale. En Naowee: ocho módulos de negocio, sus estados y roles, y una revisión donde lo construido tiene que coincidir con la demo. | I decide what a product should be and stay accountable until it ships. At Naowee: eight business modules, their states and roles, and a review where what gets built has to match the demo. |
| {dot: 02} Sistemas de diseño / Design systems | Tokens, componentes, gobierno y la documentación aburrida que hace repetible el buen diseño. Construí uno para un banco y mantuve otro que usan 400+ diseñadores y 2.000+ ingenieros en 18 países. | Tokens, components, governance and the boring documentation that makes good design repeatable. I built one for a bank and maintained one used by 400+ designers and 2,000+ engineers in 18 countries. |
| {dot: 03} Ingeniería de diseño con IA / Design engineering with AI | Prototipo en código con Claude Code, Cursor y Gemini haciendo el trabajo repetitivo. Lo que entrego es un producto que funciona, no un mockup, y el negocio aprueba contra él, no contra un documento. | I prototype in code, with Claude Code, Cursor and Gemini doing the repetitive work. What I hand over is a running product, not a mockup, and business signs off against it, not against a document. |

**Cómo trabajo** (`#craft`) — H2 ES: «Cómo trabajo» · EN: «How I work» (diagrama de 4 nodos; cuerpo ≤ 45 palabras)

| | ES | EN |
|---|---|---|
| {dot: 01} | **Leer el dominio antes de dibujar.** Antes de que exista una pantalla, mapeo cómo funciona la cosa de verdad. En la inspección de Naowee fueron más de 45 estados y 15 roles: los estados eran el producto. | **Read the domain before drawing.** Before a screen exists, I map how the thing actually works. For Naowee's inspection flow that was 45+ states and 15 roles: the states were the product. |
| {dot: 02} | **El lenguaje antes que las pantallas.** La falla típica son ocho módulos con ocho dialectos. Construyo primero el sistema y hago que todos lo respeten, yo incluido: si le falta algo, se extiende el sistema. | **The language before the screens.** The usual failure is eight modules with eight dialects. I build the system first and hold everyone to it, me included: if something's missing, the system gets extended. |
| {dot: 03} | **El prototipo es la especificación.** Lo que el negocio firma es un prototipo con roles y estados reales, recorrido una historia a la vez. Los desacuerdos salen cuando todavía son baratos. | **The prototype is the spec.** What business signs is a working prototype with real roles and states, walked one story at a time. Disagreement surfaces while it's still cheap. |
| {dot: 04} | **Lanzar, y después escuchar.** El uso diario muestra lo que ninguna especificación mostró. En olbo fue un error de zona horaria que dañaba el color de noche: se volvió una decisión, una prueba y una versión nueva. | **Ship, then listen.** Daily use shows what no spec did. In olbo it was a timezone bug that broke the colour after dark: it became a decision, a test and a new version. |

**Datos** — H2 ES: «Datos» · EN: «Facts» (sin rótulos donde el dato se explica solo, refactoring-ui)

| Rótulo ES | Valor ES | Rótulo EN | Valor EN |
|---|---|---|---|
| Base | Barranquilla, Colombia | Based in | Barranquilla, Colombia |
| Zona horaria | UTC-5, sin horario de verano | Time zone | UTC-5, no daylight saving (same as New York in winter) |
| Actualmente | Head of Product · Naowee | Currently | Head of Product · Naowee |
| Disponible para | Consultoría puntual en sistemas de diseño y producto nativo de IA | Open to | Selected consulting on design systems and AI-native product |
| Idiomas | Español (nativo) · Inglés (B1, competencia profesional) | Languages | Spanish (native) · English (B1, working proficiency) |

**Testimonios** — H2 ES: «Lo que dicen quienes trabajaron conmigo» · EN: «From people I've worked with». Las tres citas
completas, verbatim, con «Cita original en inglés» en ES y enlace al caso de cada una.

**Herramientas** — H2 ES: «Con qué trabajo» · EN: «What I work with» (de `cv.tools`). **Empresas** — rótulo ES «Dónde he
trabajado» · EN «Where I've worked» (`getWordmarks()`).

**Cierre**
| | ES | EN |
|---|---|---|
| Línea | Lo demás está en el trabajo. | The rest is in the work. |
| CTA primario | Ver casos | See case studies |
| CTA secundario | Descargar CV (PDF) | Download CV (PDF) |

### 6.2 `/experience`

**Portada**
| | ES | EN |
|---|---|---|
| Eyebrow | Trayectoria | Experience |
| H1 | De freelance a Head of Product | From freelance to Head of Product |
| Intro (≤ 160) | {derivado: 12} años en producto digital, seis empresas y un sistema de diseño en 18 países. Cada etapa con caso se abre. | {derivado: 12} years in digital product, six companies and a design system in 18 countries. Every stage with a case study opens it. |
| Rótulo del enlace de cada hito | Ver caso | See case |
| Rótulo del caso con NDA | Ver caso · NDA | See case · NDA |
| Lista (`<ol>`, `aria-label`) | Etapas de mi trayectoria, de la más antigua a la actual | Stages of my career, oldest to current |
| Cierre | Descargar CV (PDF) | Download CV (PDF) |

«Seis empresas» = Smartbiz, Ideaware (Qrvey incluida), Globant, Aval Digital Labs, Mercadolibre y Naowee: las
experiencias desde el ancla de carrera. Se deriva en código (`{derivado}`), como los años.

**Eras** (nombre en display, años en Doto; las fechas salen de `formatPeriod()`)

| Era | ES | EN | Años |
|---|---|---|---|
| 1 | Base | Groundwork | {dot: 2006} → {dot: 2014} |
| 2 | Producto | Product | {dot: 2014} → {dot: 2018} |
| 3 | Sistemas | Systems | {dot: 2018} → {dot: 2024} |
| 4 | Escala | Scale | {dot: 2024} → {dot: 2026} |
| 5 | Dirección | Direction | {dot: 2026} → Hoy / Now |

Cambio respecto a 02 §5.5: «Origen» → «Base» (suena menos a mito), «Ahora» → «Dirección» (dice el salto de nivel; el
chip «Ahora / Now» marca el nodo actual).

**Hitos** (logro ≤ 140 caracteres, condensado de `impact[]` / `summary` de `cv.ts`; cargo tal como figura en el CV)

| Periodo | Empresa · cargo | Logro ES | Logro EN | Caso |
|---|---|---|---|---|
| 2006 — 2009 | Universidad Autónoma del Caribe · Diseñador Gráfico Profesional | Formación en diseño gráfico, en Barranquilla. | Graphic design degree, in Barranquilla. | — |
| Feb 2010 — Oct 2014 | Freelance · Diseñador gráfico y de interfaces / Graphic & Interface Designer | Sistemas de marca, impresos y los primeros trabajos web para clientes locales. | Brand systems, print and early web work for local clients. | — |
| Oct 2014 — Feb 2016 | Smartbiz Solutions · Junior UI Designer | Primer rol de UI, y la primera vez dentro de una librería de componentes compartida. | First UI role, and the first time inside a shared component library. | — |
| Mar 2016 — Oct 2016 | Ideaware · Senior UX/UI Designer | Wireframes, UI kits y prototipos para clientes internacionales; Pool Botball para iOS. | Wireframes, UI kits and prototypes for international clients; Pool Botball for iOS. | Ver caso |
| Oct 2016 — Ago 2017 | Qrvey (vía Ideaware) · Lead UI Designer | Promovido a liderar la UI: el lenguaje visual de Qrvey y AutomatiQ, de punta a punta. | Promoted to lead UI: Qrvey's visual language and AutomatiQ, end to end. | Ver caso |
| Ago 2017 — Nov 2018 | Globant · Royal Caribbean · Senior Product Designer | Reserva y vida a bordo en móvil y web, con producto e ingeniería en EE. UU. | Booking and life aboard on mobile and web, with product and engineering in the US. | Ver caso |
| Nov 2018 — Ene 2024 | Aval Digital Labs · Banco de Occidente · Senior Product Designer · Design System Gatekeeper | Construí Velocity y goberné el sistema de 12+ squads; rediseñé la banca digital en tres dispositivos. | Built Velocity and governed the system for 12+ squads; redesigned digital banking on three devices. | Ver caso |
| Ene 2024 — Ene 2026 | Mercadolibre · Andes · Tech Lead · Design Systems | Líder técnico del sistema que usan 400+ diseñadores y 2.000+ ingenieros en 18 países. | Tech lead on the system used by 400+ designers and 2,000+ engineers in 18 countries. | Ver caso · NDA |
| Ene 2026 — Hoy | Naowee · Head of Product | Dirijo SUID: 8 módulos de negocio, ~1.200 organizaciones y 130+ pantallas en un solo sistema. | I lead SUID: 8 business modules, ~1,200 organizations and 130+ screens on one system. | Ver caso |

**Pista paralela (opcional): productos propios.** Una segunda línea fina bajo la principal, con sus propios nodos.
Rótulo ES «Productos propios» · EN «Products of my own»: {dot: 2018} Chub (proyecto paralelo, no lanzado) · {dot: 2026}
olbo · {dot: 2026} DC Medical · {dot: 2026} MakeaPet. Muestra que la etapa «Dirección» coincide con tres productos
lanzados, sin decirlo con adjetivos.

### 6.3 `/work` (índice nuevo)

| Pieza | ES | EN |
|---|---|---|
| H1 | Trabajo | Work |
| Intro (`dict.work.intro`, reescrita; cifras `{derivado}`) | {12} años de sistemas, productos y equipos: de Mercadolibre a un banco, una naviera y startups, y {tres} productos propios, diseñados, construidos y lanzados de punta a punta. | {12} years of systems, products and teams: from Mercadolibre to a bank, a cruise line and startups, plus {three} products of my own, designed, built and shipped end to end. |
| Filtros (`role="group"`, `aria-label` «Filtrar casos» / «Filter case studies») | Todos · Escala · Productos propios · Anteriores | All · At scale · Products of my own · Earlier |
| Marca de visitado (mono, 12 px) | Leído | Read |
| Chip NDA | NDA · Caso a solicitud | NDA · Case on request |
| Fila | {num} · {proyecto} · {cliente} · {año} · Leer el caso | {num} · {project} · {client} · {year} · Read the case |

«Del marketplace más grande de Latinoamérica» se cambia por «Mercadolibre»: el nombre es más fuerte que el superlativo
y no necesita fuente.

---

## 7. Preguntas para Doug

**Decisiones de mensaje**
- **P1 · Disponibilidad.** ¿«Consultoría puntual» (lo de hoy) o «abierto a roles y consultoría»? Cambia K1, K5, K17 y
  `/about`. Las dos variantes están escritas.
- **P2 · Orden de los casos en el bento:** Naowee → Andes → olbo → BdO → DC Medical → MakeaPet (02 §4.2). ¿De acuerdo?
- **P3 · PDF del CTA del héroe.** Propongo ES → con foto y EN → sin foto (estilo EE. UU.). ¿O los dos con foto?
- **P4 · Fragmentos de testimonios.** En K8 y K15 uso una oración completa y textual de cada cita (no se edita nada).
  ¿Lo apruebas? Sigue abierto el «⚠️ CONFIRMAR DOUG» de publicar verbatim la de Francesca.
- **P16 · Colofón del footer.** ¿«Diseñado por mí; construido con Next.js y agentes de IA que dirijo» o «Diseñado y
  construido por Doug Vargas»? Depende de quién escribió el código.
- **P18 · Titular.** ¿Apruebas «Dirijo el producto. Después, lo construyo.» / «I direct the product. Then I build it.»?
  En EN, ¿«direct» o «lead»? «Lead» es más común, pero «direct» es lo que dice el CV en ES («Dirijo») y suena a decisión.
- **P19 · `title` del home en ES:** ¿se queda en inglés («Head of Product · Product Designer (UX/UI)») o en español
  («Head of Product y diseñador de producto»)?
- **P20 · K1:** ¿el nombre grande sobre la foto es «Doug Vargas» o el wordmark «douguizard»?
- **P21 · «Tinder para mascotas»** usa una marca ajena como comparación. ¿Se queda (es claro) o pasa a «swipe para
  mascotas»?

**Datos que faltan** (cada uno mejora una pieza; sin respuesta, la línea se quita)
- **P5 · Ancla de años.** K12 y `/experience` dicen 12 (desde Smartbiz, oct 2014). Desde el freelance serían 16.
  Sigue el «⚠️ CONFIRMAR» de `cv.ts`.
- **P6 · Naowee:** ¿hay alguna métrica de uso o de tiempo (trámites procesados, organizaciones activas, tiempo por
  trámite)? ¿Quién es el «equipo de 2» y qué construye ingeniería a partir de tu prototipo? ¿Alguien de Naowee daría
  una cita?
- **P7 · Andes:** tamaño de tu equipo directo; y qué ganó Mercadolibre con la API única y las auditorías con IA (aunque
  sea cualitativo). El «~40 % menos retrabajo» sigue fuera mientras no haya medición.
- **P8 · Banco de Occidente:** «millones de clientes» sigue sin fuente. ¿Hay una cifra que puedas citar?
- **P9 · Royal Caribbean:** el caso dice «1 año»; `cv.ts` dice ago 2017 – nov 2018 (15 meses). Uso las fechas del CV.
  ¿Qué decisión concreta tomaste para la conexión intermitente (qué quedaba en el teléfono sin red)?
- **P10 · Ideaware:** el caso dice «1 año»; el CV, mar – oct 2016 (y luego Qrvey hasta ago 2017 con Ideaware de
  empleador). ¿Cuál es la duración correcta del caso? ¿Algún cliente se puede nombrar?
- **P11 · Qrvey:** el caso dice «11 meses»; oct 2016 – ago 2017 son 10. ¿Hay algún dato de uso de AutomatiQ?
- **P12 · DC Medical:** ¿hay una cifra más reciente que «14 días al 2 oct» (versiones, días en vivo, casos
  gestionados)? ¿La secretaria o el médico darían una cita?
- **P13 · MakeaPet:** sin preguntas de dato; confirma que «No escribí el código» es como quieres decirlo.
- **P14 · olbo:** ¿cambio el KPI «5 sesiones encadenadas» por «24 vistas rediseñadas»? Y el repo se llama `bolsillo`:
  quien abre «Código» llega a otro nombre (pendiente heredado).
- **P15 · Chub:** las pantallas muestran un Tesla y su nombre. ¿Se deja, se recorta o se usan solo mapa y clima?
- **P17 · Teléfono:** ¿sigue público en el home (K17) o queda solo en el CV?
