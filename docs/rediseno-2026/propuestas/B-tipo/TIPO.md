# B-tipo · El lockup del nombre (director de tipografía)

**Pedido de Doug:** «la tipografía de mi nombre me parece muy sencilla, sin personalidad, genérica». Hoy el nombre XL
del acto 1 de B está en Urbanist 600 a 120 px. Esa fuente es la misma del claim, de los títulos y de olbo, así que el
nombre no se distingue del resto: es un título más.

**Regla que seguí:** solo cambia la **voz del nombre**, que aparece en cuatro sitios: el XL del acto 1, el nombre de K1
(donde aterriza el FLIP), la marca de la barra («douguizard») y el nombre en móvil. El resto del sistema no se toca
(Urbanist para claim y títulos, Instrument Sans para texto, Doto para cifras). Así el nombre funciona como logotipo y
no compite con la jerarquía de las losas (frontend-design: «spend your boldness in one place»).

## Cómo verlo

- `especimen.html` es una copia de `propuestas/B/index.html` con un bloque de CSS y JS marcado «B-tipo». El original
  no se modificó. Hay que servir la **raíz del repo** (`python3 -m http.server` en `/home/user/douguizard`) y abrir
  `/docs/rediseno-2026/propuestas/B-tipo/especimen.html`.
- Para elegir la opción: `?tipo=1…6`, el selector de abajo a la derecha o las teclas 1–6. `?limpio=1` oculta el
  selector. Siguen funcionando los parámetros de B: `?lang=en`, `?rm=1` y `?captura=1`.
- Capturas: `tipo_N_1440.jpg` y `tipo_N_390.jpg` (DPR 1, JPG 82). Hay extras: `tipo_N_390_en.jpg` (las seis),
  `tipo_3/4_1440_en.jpg`, `tipo_3/4_1440_scroll_25/55.jpg` y `tipo_3/4_1440_os.jpg` (el ancla y el OS),
  y `tipo_6_1440_reposo.jpg` (sin cursor). En cada captura se esperó a `document.fonts.ready` y se comprobó que la
  familia del nombre estuviera en estado `loaded` y que `fonts.check()` diera verdadero. Ninguna cayó a la fuente de
  respaldo y en ninguna hay desborde horizontal ni errores de consola.

## Fuentes y red

Todas son **SIL Open Font License 1.1** y se pueden incrustar en la web. Los woff2 (subconjunto latín) están en
`propuestas/fonts/`:

| Archivo | Familia | Ejes | Origen |
|---|---|---|---|
| `mona-sans-latin.woff2` | Mona Sans (GitHub) | wdth 75–125 · wght 200–900 | Google Fonts |
| `instrument-serif-italic-latin.woff2` | Instrument Serif Italic (Instrument) | — | Google Fonts |
| `big-shoulders-stencil-latin.woff2` | Big Shoulders Stencil (Patric King) | wght 100–900 · opsz 10–72 | Google Fonts |
| `geologica-latin.woff2` | Geologica (Monokrom) | wght · SHRP 0–100 · CRSV · slnt | Google Fonts |
| `anybody-latin.woff2` | Anybody (Etcetera Type Co.) | wdth 50–150 · wght 100–900 | Google Fonts |
| `doto-latin.woff2` (ya estaba) | Doto (Óliver Lalán) | ROND · wght | Google Fonts |

Google Fonts y gstatic cargaron sin problema. **Fontshare** (Clash Display, Cabinet Grotesk, Panchang) y
**velvetyne.fr** respondieron 403 en el proxy, así que no pude bajarlas ni probarlas. Para llevar alguna de esas a la
mesa hay que bajarla fuera de este entorno. Fontshare tiene su propia licencia gratuita (ITF FFL), no OFL: hay que
leerla antes de usarla.

El script de pares de `ui-ux-pro-max` propuso Orbitron + Exo 2, Syncopate + Space Mono y Space Grotesk + DM Sans
(«futuristic tech»), y Playfair o Cormorant para lo editorial. Los descarté todos. Orbitron y Syncopate son justo el
«gamer/neón genérico» de 01 §8. Space Grotesk y Playfair son los defaults más gastados de la web actual. También
descarté, después de una hoja de contacto con 18 candidatas: Unbounded y Syne (demasiado web3), Tektur (gamer),
Major Mono Display (ciencia ficción de los 2000), Bitcount y Handjet (pixel cuadrado: chocan con los puntos redondos
de Doto), Roboto Flex (neutra) y Bodoni Moda (sus filetes a 160 px sobre el vidrio estriado se rompen).

---

## Las seis opciones

Los valores de escritorio se midieron a 1440×900. Con un alto ≤ 800 px el tamaño se multiplica por 0,8 (la misma regla
que B). En móvil, el nombre pasa a la foto: se apoya sobre K2, encima de la chaqueta. Antes era una etiqueta de 18 px
dentro de K2. Su borde de arriba nunca sube de la barbilla. Lo calcula el JS con la misma colocación de foto que usa B
(`barbilla = 0,25·h + 0,197·Dy`). Si K2 crece (en EN los dos CTA pasan a dos filas), el nombre se achica hasta un 14 %.
Si ni así cabe, se pasa a **una sola línea a todo el ancho** (ver `tipo_N_390_en.jpg`). Detrás hay un degradé local
(radial, 55 % de `--vacio`) que sostiene el contraste, porque en móvil no hay velo. La marca de la barra usa la misma
voz en todas las opciones.

### 1 · Grotesca extendida — «Doug Vargas en ancho de cartel»

- **Concepto:** el nombre como una losa más, ancho y pesado como un rótulo de hangar. El peso visual equilibra la cara.
- **Fuente:** Mona Sans (OFL), wdth 125 (Expanded).
- **Especificación:** escritorio 128 px / móvil 72 px. Peso 800. Tracking −0,055 em. Leading 0,86. Marca: 700,
  wdth 125, 15 px, −0,03 em.
- **Entrada:** mantiene el ascenso con máscara de B (yPercent 105 → 0, 600 ms `expo.out`, 80 ms entre líneas) y le
  suma un **ensanche** de wdth 100 → 125 en 900 ms `--ease-out` (180 ms y 260 ms de retraso). Las letras «se abren»
  mientras suben.
- **Scroll anclado:** el FLIP de B sin cambios (escala 0,23 hacia K1, fundido de 0,66 a 0,8). K1 ya está en Mona
  Expanded, así que aterriza en la misma forma.
- **Riesgos:** es la estética Monument Extended que dominó Dribbble entre 2021 y 2024. Tiene presencia, pero es la
  menos propia de las seis. La «g» de Doug besa la «r» de Vargas (es intencional, pero ojo si el leading baja de 0,86).

### 2 · Contraste editorial — «Doug, en voz baja; Vargas, en firme»

- **Concepto:** una itálica de display para el nombre de pila (lo personal) y una grotesca ancha para el apellido (la
  firma). Es la voz «cine» de B: créditos de título, no de app.
- **Fuentes:** Instrument Serif Italic (OFL) para «Doug». Es de la misma casa que Instrument Sans, la voz de texto del
  sistema, y por eso hay parentesco. Mona Sans (OFL) a wdth 112 y 700 para «Vargas».
- **Especificación:** cuerpo de 124 px. «Doug» va a 1,22 em (≈ 151 px), tracking −0,035 em y leading 0,78. «Vargas» va
  a 124 px, tracking −0,05 em y leading 0,9. La «g» itálica cae dentro del ojo de «Vargas». En móvil, 64 px. Marca:
  «douguizard» en Instrument Serif Italic a 21 px.
- **Entrada:** la de B (las líneas suben con 80 ms de escalonado). «Doug» llega primero y «Vargas» lo asienta.
- **Scroll anclado:** el FLIP de B. K1 replica la mezcla (itálica + grotesca) a 30 px.
- **Riesgos:** frontend-design marca «una palabra en itálica» como un tic de página generada. Aquí se defiende porque
  son dos palabras con dos papeles, pero el riesgo está. En pantalla convivirían 4 familias (Instrument Serif, Mona,
  Urbanist e Instrument Sans): si se elige, conviene pasar el claim a Mona para bajar a 3. Es la opción más «elegante»
  y la menos «futurista».

### 3 · Display técnica — «La banda del título»

- **Concepto:** el nombre en **una sola línea condensada con cortes de esténcil**, paralela al haz. Las astas verticales
  y los puentes del esténcil repiten las estrías del vidrio. El nombre parece fabricado: cortado en lámina, no tecleado.
- **Fuente:** Big Shoulders Stencil (OFL), opsz 72 (corte Display).
- **Especificación:** escritorio 148 px en una línea (24 → 641 px de ancho, con ~100 px de aire hasta la visera) y
  descendentes a 7 px del láser. Peso 640. Tracking −0,01 em. Leading 0,84. Espacio entre palabras de 0,2 em. Móvil:
  dos líneas a 84 px (74,5 px al ajustarse a la barbilla); en EN, una línea a 80 px. Marca: 700, 20 px, +0,01 em.
- **Entrada:** sube con máscara y se **rellena**: wght 200 → 640 en 800 ms `--ease-out`. Los trazos del esténcil
  engordan hasta cerrar los puentes justos.
- **Scroll anclado:** el FLIP de B, en una línea, hasta K1 (`tipo_3_1440_scroll_55.jpg`, `tipo_3_1440_os.jpg`). En
  K1 queda «Doug Vargas» en una línea de 30 px, que se lee mejor que el par apilado.
- **Riesgos:** el esténcil condensado puede leerse como algo industrial o militar si sube de peso (no pasar de 700).
  Se aleja de la geometría redonda de RonDesignLab, a propósito: aquí el nombre es la única pieza que no es Urbanist.
  Es la opción más «tipográfica» por sí sola.

### 4 · Corte láser — «El haz parte el nombre»

- **Concepto:** un wordmark construido. La línea láser de la foto (el hilo de B) **atraviesa «Vargas» por el ojo
  medio**: la mitad de arriba se desliza hacia afuera y la de abajo hacia la cara, con 3 px de luz entre las dos. Al
  encogerse la foto, el corte **se cierra** y el nombre llega entero a K1. Es la única opción que no puede ser de nadie
  más: depende de la foto y de la narrativa de B.
- **Fuente:** Geologica (OFL) con SHRP 100. Los remates en bisel («afilados») refuerzan la idea de corte. Es sutil a
  esta escala: la personalidad la pone la construcción, no la fuente.
- **Especificación:** escritorio 128 px. Peso 600. Tracking −0,05 em. Leading 0,9. El JS coloca el nombre para que el
  láser pase justo por el corte. Mide el ojo medio con `measureText` y corta a 0,52 de la altura de la x sobre la línea
  base (`__tipoY0`). Desplazamiento: mitad superior −0,10 em y mitad inferior +0,06 em (≈ 20 px en total a 128 px).
  Rendija de ±1,5 px. Móvil 66 px. Allí el haz de la foto queda lejos (en los ojos), así que el corte trae su propio
  hilo de 1 px con el mismo núcleo y halo, que se enciende desde la derecha (`scale` 0 → 1, 700 ms).
- **Entrada:** el nombre sube entero. Cuando el láser de B termina de encenderse hacia la izquierda (~880 ms), las
  mitades se separan en 520 ms `--ease-out`. Primero aparece el haz y después corta.
- **Scroll anclado:** el corte se cierra entre p = 0 y p = 0,3 (`--desp` → 0) mientras el FLIP lleva el nombre a K1
  (`tipo_4_1440_scroll_25.jpg`). En el OS, K1 muestra «Doug Vargas» entero en Geologica.
- **Riesgos:** si el desplazamiento crece o se anima en bucle, se lee como glitch, que está prohibido en 01 §8. Tiene
  que ser una sola vez y quedarse quieto. En móvil hay dos haces en pantalla (el de la foto y el del nombre): es
  aceptable, pero se puede probar sin el hilo propio. Accesibilidad: la mitad duplicada lleva `aria-hidden`; el nombre
  real es el `sr-only` del H1, como en B.

### 5 · Matriz de puntos — «El nombre en el mismo LED que las cifras»

- **Concepto:** el nombre escrito con el mismo dot-matrix de las cifras de las losas. Es el pedido original de Doug
  (los puntos tipo dado de RonDesignLab), llevado a escala de cartel.
- **Fuente:** Doto (OFL), ROND 100.
- **Especificación:** escritorio 134 px. Peso 800. Tracking −0,075 em (Doto es monoespaciada y hay que cerrarla).
  Leading 0,9. Móvil 74 px (69,6 px al ajustarse); a menos de ~60 px los puntos se separan y la palabra se desarma.
  Marca: Doto 900 a 22 px.
- **Entrada:** los puntos **se encienden** letra por letra (`wght` 100 → 800 en 6 pasos, 420 ms, 45 ms por letra). Es
  el mismo gesto de `--dw` que usan las cifras de B.
- **Scroll anclado:** el FLIP de B. Al llegar a K1 (30 px) los puntos ya están al límite de legibilidad (01 §4.2: nunca
  por debajo de 20 px).
- **Riesgos:** rompe la regla de 01 §4.2 («Doto solo para cifras y fechas, nunca para frases»). El nombre pasa a
  competir con «400+» y «08:37», que pierden su rareza. Se lee como reloj o marcador de estadio más que como firma. Es
  la de mayor coherencia de sistema y la de menor jerarquía.

### 6 · Variable viva — «El nombre que respira»

- **Concepto:** cada letra tiene ancho y peso propios. Las que están cerca del cursor se ensanchan y engordan, y las
  lejanas se condensan, de modo que **la medida de la línea casi no cambia** y nunca crece hacia la cara. Con el scroll
  anclado el nombre se comprime hacia la losa.
- **Fuente:** Anybody (OFL), wdth 50–150 · wght 100–900.
- **Especificación:** reposo a 128 px, wdth 112, 700, tracking −0,04 em y leading 0,88. Cerca del cursor, gaussiana de
  R = 170 px (el eje Y pesa ×1,6). A cada letra se le resta el 85 % de la media de su línea y se la limita a wdth 60–150
  y wght 300–900. Un muelle críticamente amortiguado con respuesta de 0,3 s. Móvil 66 px.
- **Entrada:** de condensada a la forma de reposo letra por letra (wdth 50 → 112, wght 250 → 700, 760 ms `easeOutQuart`,
  55 ms por letra).
- **Scroll anclado:** el efecto del cursor se apaga (p > 0,02) y el wdth baja a 100 entre p = 0 y p = 0,6. K1 está en
  wdth 100, así que el FLIP aterriza en la misma forma. En táctil no hay cursor: queda la entrada y la compresión con el
  scroll.
- **Riesgos:** **choca con una decisión de Doug** (brief, 4 nov): «la única interacción del cursor es el vidrio». Esta
  opción suma una segunda. Si se elige, el cursor solo debería afectar al nombre cuando está sobre él, y nunca al mismo
  tiempo que la lente. Fotografiada, la variación parece irregular (`tipo_6_1440.jpg` y `_reposo`): lo que la vende es
  el movimiento. Costo: un `getBoundingClientRect` por letra en cada cuadro (son 10 letras; es barato, pero hay que
  pausarlo fuera del acto 1).

---

## Recomendación (top 2)

**1.º · Opción 4, «Corte láser».** Es la única que responde de verdad a «sin personalidad». La personalidad no viene de
una fuente de moda, que alguien más puede tener mañana, sino de una idea que solo existe en este sitio: el haz de la
foto, que ya es el hilo conductor de B, corta el nombre y el ancla lo cierra al llegar a K1. Así la tipografía cuenta la
transición «cine → OS» en lugar de decorarla. Respeta 01 §8: el rojo sigue siendo luz de 1 px, no relleno ni texto, y
no hay glitch porque el corte ocurre una vez y se queda quieto. Funciona en EN porque el nombre no se traduce, y en
móvil con su propio hilo. **Ajuste que propongo** si Doug quiere más presencia en la letra: hacer el mismo corte sobre
Mona Sans a wdth 112 y 700 en vez de Geologica. Gana peso de cartel y la idea no cambia.

**2.º · Opción 3, «La banda del título».** Es la de más carácter tipográfico propio. La banda de una línea, paralela al
láser, se lee como un crédito de película (el «cine» de B), y el esténcil condensado repite las estrías del vidrio sin
caer en lo gamer (nada de Orbitron, ni esquinas biseladas, ni glow). Contrasta de verdad con Urbanist, así que el nombre
deja de ser «un título más». Además resuelve mejor K1: una línea a 30 px. Hay que cuidar el peso (≤ 700) para que no se
vea militar.

Alternativa segura si Doug prefiere elegancia a filo: **la 2 (editorial)**, siempre que el claim pase a Mona para no
llegar a 4 familias. Descarto como principales la 5 (le quita rareza al dot-matrix de las cifras), la 6 (contradice
«solo el vidrio reacciona al cursor») y la 1 (correcta, pero de tendencia).

## Pendientes y notas

- **EN en móvil:** en inglés, K2 crece porque «See case studies» y «Download CV (PDF)» no caben en una fila, y el
  nombre pasa a una sola línea más chica (≈ 52–80 px según la opción). Si el writer acorta el CTA en EN (por ejemplo,
  «See work»), el nombre recupera las dos líneas.
- En producción: precargar solo el woff2 de la opción elegida (`font-display: swap` con `size-adjust` contra la de
  respaldo, para no tener CLS). En el espécimen se usa `block` para medir bien el FLIP.
- La recomendación sale de las capturas a DPR 1. Antes de cerrar, conviene que Doug vea la opción 4 animada (la
  entrada y el ancla), porque la idea está en el movimiento.
