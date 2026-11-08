# Propuesta A · «Tablero»

**Concepto en una frase:** el home es un tablero bento oscuro con luz blanca, y lo cruza una sola línea roja: el láser
de la foto de Doug, la única línea que el vidrio estriado no logra doblar.

Archivo: `index.html` (autocontenido: CSS y JS dentro; fuentes en `../fonts/` con gstatic de respaldo).
Servir desde la raíz del repo (la foto y los assets viven en `docs/…/retratos-hf` y en `public/`):
`npx http-server /home/user/douguizard -p 8080` → `/docs/rediseno-2026/propuestas/A/index.html`.
Parámetros de prueba: `?lang=en` · `?modo=css` (sin WebGL) · `?rm=1` (movimiento reducido) · `#/work/naowee-suid`
(abre el caso directamente).

> **Cambio de Doug aplicado (4 nov):** se retiraron la máscara, su revelado por capas, el botón «Quitar máscara» y
> todas las pistas de copy de 04 §2.4. El héroe es la foto `199598aa.jpg` con vidrio estriado oblicuo. El cursor solo
> abre y aclara el vidrio.

---

## 1. Decisiones de dirección

### Rejilla: 5 + 7, no 6 + 6
- Escritorio de 12 columnas, máximo 1376 px, gutter de 16, fila de 112 (02 §4.3). El primer pliegue a 1440×900
  termina en 848 px.
- **K1 ocupa 5 columnas × 6 filas (564 × 752 px), exactamente 3:4, la proporción de la foto.** La imagen se pinta
  completa al 0,64× de su tamaño nativo: sin recorte y sin ampliar (la foto es de baja resolución). Con 6 columnas
  habría que recortarla y K2 se quedaría sin ancho.
- **K2 recibe 7 columnas (796 px).** Así el titular (48 px) cabe en dos líneas exactas («Dirijo el producto.» /
  «Después, lo construyo.»), la línea de nivel completa cabe en una y los dos CTA van apilados a la derecha.
  El nombre, el nivel y «Ver casos» se leen en el pliegue (test de 5 s).
- Debajo, K3 (3 col., Naowee) + K4 (4 col., Andes): Andes recibe la columna extra porque su imagen son tres cifras
  en dot-matrix L en una rejilla de 2×2. K5 / K6 repiten el 3 + 4, así las columnas se alinean.
- **El orden del DOM es el orden visual en los dos layouts** (y el orden de tabulación): K1–K10, **K16**, K11, K12,
  K15, K13, K14, K17. K16 (archivo) va pegado a los casos para que el carrusel móvil (K9 · K10 · K16, 02 §5.6) sea
  contiguo sin usar `order`. En escritorio también es la lectura lógica: primero todo el trabajo, después la carrera.
  Ninguna card usa `grid-auto-flow: dense`.
- Tableta (768–1279): 6 columnas con colocación automática en el orden del DOM. Móvil: una columna, diseñada aparte.

### Equilibrio oscuro / blanco (01 §2.4)
- Hay **una losa clara en cada banda horizontal**: K2 (pliegue), K7 olbo (casos), K11 trayectoria (carrera),
  K15 testimonio en `--niebla` (prueba social) y K17 contacto (cierre). En el pliegue el reparto es ~62 % oscuro,
  ~25 % claro y ~10 % color.
- **Color solo dos veces**: K4 jelly azul (Andes, NDA: la cifra es la imagen) y K10 jelly magenta (MakeaPet).
  Las dos llevan el borde interno brillante, el grano `feTurbulence` al 5 % y el bloom de su propio color.
- El blanco puro solo aparece en lo que se toca: el círculo ↗ de cada losa (sobre losa clara o captura clara es tinta),
  la pastilla activa y el ES/EN activo.

### Cómo entra el rojo y cómo convive con el azul
Hay una regla semántica y se cumple en todo el tablero: **azul = tu acción, rojo = mi presencia.**
- **Azul eléctrico** (`#2B56F3`) es lo que hace la persona que visita: el CTA primario, «Hablemos», el anillo de foco y
  el relleno del círculo ↗ al hover y al foco.
- **Rojo láser** (`#FF3B47`, muestreado de la foto) es lo que está vivo de Doug, y nunca ocupa más de 8 px:
  1. el láser de la foto: el shader desplaza en horizontal, así la línea cruza todas las estrías entera (es el «hilo»);
  2. el punto de «disponible» (K1, K5) y el de «Ahora · Head of Product» (K3 y portada del caso);
  3. el último tramo de 1 px de la trayectoria y el nodo «2026» en K11 (en losa clara, `--laser-osc #D0202E`, 4,8:1);
  4. el punto del wordmark.
- Lo que evita el aire gamer: el rojo no tiene glow en texto ni rellena superficies, y el azul y el rojo nunca se
  tocan. K13 usa el retrato en blanco y negro de la misma serie (`98153a04`), donde el láser es el único color: la
  regla, escrita en imagen.

### Tipografía
- **Funnel Display 600** para display y títulos: tiene más marca que Urbanist, que queda para la propuesta B y para olbo.
  **Funnel Sans 400/500** para texto y UI. **Doto ROND 100 · wght 700** solo para cifras, fechas, años, el reloj y
  la numeración 01–04 (que sí es una secuencia). Nunca baja de 20 px.
- Caja de oración en todo, sin mayúsculas sostenidas. Las etiquetas de las losas de color van en su propio tono
  aclarado, nunca en gris.

---

## 2. Tokens (en `:root`)

| Grupo | Valores |
|---|---|
| Superficies | `--vacio #060608` · `--losa #111214` · `--losa-alta #1A1B1F` · `--losa-borde rgba(255,255,255,.08)` · `--claro #F2F2F4` · `--niebla #E4E2EC` · `--blanco #FFF` |
| Tinta | `--tinta #F5F5F7` · `--tinta-2 #A1A1AB` · `--tinta-3 #8A8A95` · `--tinta-osc #0E0E12` · `--tinta-osc-2 #55555F` |
| Acentos | `--electrico #2B56F3` · `--laser #FF3B47` · `--laser-osc #D0202E` · `--azul-etq #B4C6F8` · `--magenta-etq #F6CBE1` · `--verde-olbo #1B7442` (semáforo de olbo) |
| Espacio | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (`--s-1…--s-32`) |
| Tipo | 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60 · 72 (`--t-*`); Doto XL 72 / L 48 / M 30 / S 24 / XS 20 (en móvil, XL 48 · L 36 · M 24) |
| Radios | `--r-xl 48` (36 en móvil) · `--r-l 32` (28) · `--r-m 24` · `--r-s 16` · `--r-xs 8` · pill. Lo anidado es concéntrico: radio exterior − inset (p. ej., el panel del héroe usa 48 − 16) |
| Rejilla | `--ancho 1376` · `--margen 32/16` · `--gutter 16/12` · `--fila 112` · `--pad 32/24` · `--header 64/56` |
| Tamaños | `--boton 56/48` (círculo ↗) · `--toque 44` |
| Sombras | `--sh-azul` y `--sh-magenta` (bloom del color de la losa) · `--sh-flota` (pastillas de vidrio) · `--jelly` (filo y brillo internos). Las losas oscuras no llevan sombra: se separan por el filo de 1 px |
| Motion | `--ease-out (.23,1,.32,1)` · `--ease-in-out (.77,0,.175,1)` · `--ease-drawer (.32,.72,0,1)` · `--d-press 120` · `--d-hover 200` · `--d-ui 240` · `--d-salida 280` · `--d-pagina 420` · `--d-entrada 560` · `--stagger 40` |

**Contraste AA, medido en el peor píxel.** El script oculta el texto, captura el fondo real bajo cada elemento y
compara con su color, en 1440 ES, 1440 EN y 390. Pasan todos los textos medidos (~80 por vista). Mínimos: etiquetas de la losa azul
5,2:1 · magenta 7,9:1 · panel de K13 sobre la foto clara 5,0:1 · pie de cita de K8 5,5:1 · «2026» en rojo sobre
blanco 4,8:1. Tuve que oscurecer el aro de las dos losas jelly: el gradiente de 01 dejaba el eyebrow y «países» en
2,7–3,5:1. La luz clara ahora queda en el último 8 % del borde (01 §2.3, regla 2).
**Objetivos táctiles en 390:** ningún control mide menos de 44 px (auditado por script).

---

## 3. Especificación de motion

| Qué | Cómo | Duración · curva |
|---|---|---|
| **Entrada (una sola vez)** | El header baja 8 px. K1 se materializa: escala .96 → 1, blur 12 → 0 y opacidad. Después K2 a +80 ms y K3–K6 en ondas de 40 ms (stagger total 240 ms, < 500). El resto del tablero no anima: frontend-design pide un solo momento orquestado. | 560 ms · `--ease-out` |
| Cifras que se encienden | En las losas del pliegue, Doto va de `wght 300` a `700` con opacidad .6 → 1, 160 ms después de su losa. | 400 ms · `--ease-out` |
| Estrías que se asientan | Durante la entrada, la fase del vidrio se desliza 48 px hasta su sitio. | muelle exponencial, ~0,6 s |
| **Vidrio bajo el cursor** | Donde está el cursor, el vidrio se abre en un radio gaussiano de 210 px y deja la cara nítida. El punto sigue al cursor con muelles X/Y críticamente amortiguados (~0,35 s, sin rebote). La apertura sube más rápido de lo que se cierra (k = 7 / 4). Las estrías se corren un poco con el cursor (0,04×) y con el scroll (0,25×); con el scroll aumenta la fuerza (+50 %) y el goteo inferior. Cuando no hay cambios, no hay bucle de render. | spring |
| Vidrio en táctil | Un arrastre horizontal o diagonal abre el vidrio bajo el dedo (`touch-action: pan-y`: lo vertical sigue siendo scroll). Un toque corto abre el perfil y un arrastre nunca dispara el clic. No hay deriva continua (WCAG 2.2.2). | 1:1 con el dedo |
| Hover de losa | Sube 2 px, la media escala 1,03 dentro del recorte, el ↗ gira a → y se rellena de azul, y las cifras se reencienden. Solo con `hover: hover` y `pointer: fine`. El foco muestra lo mismo que el hover, con un anillo azul de 2 px separado 3 px. | 200 ms · `--ease-out` |
| Pressed | `scale(.98)` en la losa y `.97` en los botones. | 120 ms |
| **Card → caso** (K3 Naowee, y cualquier card de caso) | FLIP con WAAPI. La captura de la card se vuelve la portada: `clip-path: inset(…round 24px)` → `inset(0 round 48px)`, más un translate + scale exactos de la imagen (las dos se maquetan con tamaño explícito, así que no hay distorsión). El título viaja a la posición del H1 (translate + scale por tamaño de fuente). El tablero funde a negro y el resto del caso entra 80 ms después (fade + 8 px, ondas de 40 ms). La URL cambia (`#/work/naowee-suid`; en producción `/work/naowee-suid`). Atrás y Esc la revierten. | 420 ms entrada · 280 ms salida · `--ease-out` |
| Dock móvil | Aparece solo cuando K2 (nombre, nivel y CTA) ya salió de pantalla. Se esconde al bajar y vuelve al subir; escondido queda `visibility: hidden`, fuera del orden de tabulación. | 240 ms · `--ease-drawer` |
| **Movimiento reducido** | Sin entrada con desplazamiento: solo un fundido de 150 ms. Sin seguimiento del cursor: el vidrio se pinta una vez, estático. Sin escala al hover y con la transición de página como fundido de 150 ms. | 150 ms lineal |

---

## 4. Qué funciona en la maqueta

- Héroe con vidrio estriado oblicuo de 12° en WebGL2: anchos irregulares (cada celda queda entera o se parte en dos
  con una semilla fija), lente cilíndrica, filo de luz y sombra por estría, aberración ≤ 1,5 px solo en el filo, goteo
  en el 25 % inferior y la cara con fuerza .32. **El respaldo CSS** (`?modo=css`, o automático si falla WebGL o en
  `file://`) muestra el póster con estrías de luz pintadas encima. El póster se pinta primero (LCP) y el canvas entra
  con un fundido de 200 ms.
- Corregí un fallo de los prototipos: ahí el ángulo y la fuerza no se enviaban al shader (la línea quedaba dentro de
  un comentario), así que las estrías salían verticales y, en `revelado-mascara.html`, sin vidrio.
- Switch ES/EN funcional en el header y en K6. Cambia todo el copy de 04, los `aria-label`, los `alt`, el `lang` del
  documento, el `title`, la description, los PDF por idioma y el reloj (24 h en ES, 12 h + PM en EN).
- Reloj de Barranquilla en vivo (cambia una vez por minuto), testimonios con controles manuales, copiar correo con
  sus tres estados, carrusel móvil con contador y botones, y dock móvil.
- Stretched link en cada losa (`::after`); los enlaces secundarios (filas de K16, ES/EN, firma de K15) quedan encima.
- La página del caso Naowee tiene portada, ficha (Rol · Equipo · Duración · Plataformas), tablero de impacto con 4
  cifras Doto L (una losa clara y una jelly azul) y el bloque «Problema». Las demás cards de caso abren la misma
  plantilla con los datos de su propia card. No inventé texto.
- No hay desborde horizontal (`scrollWidth == clientWidth` en 390, 1024 y 1440) ni errores de consola, y no se usa
  ninguna fuente de respaldo (`document.fonts.check` da true en las tres familias).

## 5. Qué quedó simulado o pendiente

- **La foto del héroe es provisional** (`199598aa.jpg`, 880×1168). Toda la geometría del shader está en coordenadas
  0–1 de la foto (`PHOTO = { fx, fy, face, line }`): para una foto nueva 3:4 solo cambian esas cuatro cifras, y si no
  tiene láser, `line: null`.
- **Rutas:** perfil, experiencia y `/work` apuntan a anclas del propio tablero (K13, K11, K16). La página de caso se
  superpone con una URL `#/work/…` en vez de una ruta de Next.
- **Atmósfera:** el blur de movimiento de fondo se pinta en runtime con canvas (la misma foto barrida en diagonal).
  En producción sería un AVIF pre-renderizado.
- **K13:** el título de 04 («Doug, sin máscara») dependía de la narrativa de la máscara, que se descartó. Usé
  «Doug Vargas» con el eyebrow «Perfil». Falta que el writer lo reemplace.
- **Copy omitido por capacidad:** en las losas de 4×2 (K9, K10) se cae el «apoyo»: en 176 px útiles solo caben el
  eyebrow, el título y la cifra con su etiqueta. El subtítulo de K2 solo aparece en móvil (04 §2.2 ya lo preveía).
- Microcopy de UI que no estaba en 04: «Anterior / Siguiente» (Previous / Next) en el carrusel móvil y «Más trabajo»
  como nombre de su región.
- Los cargos del CV y las cifras derivadas (12 años, 10 casos, 3 productos) están escritos a mano. En producción salen
  de `yearsOfExperience()` y de los datos.

## 6. Capturas (1× DPR, JPG 82)

| Archivo | Qué es |
|---|---|
| `shot_A_1440_pliegue.jpg` | 1440×900, primer pliegue |
| `shot_A_1440_completa.jpg` | 1440, página completa |
| `shot_A_1440_cursor_vidrio.jpg` | 1440 con el cursor al borde de la cara: el vidrio se abre y la cara queda nítida |
| `shot_A_1440_en.jpg` | 1440 en inglés |
| `shot_A_390_pliegue.jpg` | 390×844, primer pliegue (nombre, nivel y «Ver casos» visibles) |
| `shot_A_390_completa.jpg` | 390, página completa |
| `shot_A_transicion_1…4.jpg` | Card Naowee → caso a los 0, 140, 260 y 420 ms |
| `shot_A_caso_naowee.jpg` | Página de caso ya asentada |
| `shot_A_1024.jpg` | 1024, página completa (tableta con colocación explícita) |
| `shot_A_390x664_pliegue.jpg` | 390×664, Safari con barras: el test de 5 s pasa entero y «Ver casos» asoma |

---

## 7. Cambios tras la crítica (06-CRITICA-A.md, 7,4/10)

Apliqué **todos los P0 y P1** como estaban especificados y casi todos los P2. Después medí de nuevo: contraste en el
píxel peor a 1440 ES, 1440 EN, 1024 y 390, sin fallos (el único «falla» que devuelve el script es la esquina
redondeada de `.btn-pri`, que se mide contra la losa blanca: blanco sobre `#2B56F3` da 5,6:1). Toques ≥ 44 px a 390,
sin desborde horizontal y sin errores de consola en `?rm=1` ni en `?modo=css`.

| # | Qué cambió | Medido después |
|---|---|---|
| P0-1 | El «Doug Vargas» de K2 queda solo para lectores, **dentro del H1**. El nombre visible es el de K1. | Un solo nombre en el pliegue. K2 centrado en vertical. |
| P0-2 | Disponibilidad: un sitio por breakpoint (K5 en ≥ 1280; K1 en tableta y móvil, donde K5 se oculta) y un solo texto: «Abierto a consultoría puntual» / «Open to selected consulting». | — |
| P0-3 | Tableta (768–1279): colocación explícita en 6 columnas, en el orden del DOM. | Sin huecos ni corte en K2. Página de 4.364 → 4.236 px a 1024. |
| P0-4 | Vidrio del header `.82` → `.94` en la parada central. | Nav 7,3:1 · EN inactivo 5,8:1. |
| P1-1 | Móvil: héroe 1:1 y CTA con `margin-top: 16px`. | A 390×664, el claim queda en 474–536, el nivel en 548–585 y «Ver casos» en 661–709 (ES) / 685–733 (EN). |
| P1-2 · P2-6 | K6 pierde su segundo ES/EN, gana un ↗ y pasa a **losa clara** (gemela de K5). «ES / EN» queda como dato en la línea del lugar. | Sube el claro del pliegue. |
| P1-3 | La pill NDA se alinea arriba, centrada en el «18». | — |
| P1-4 | Eyebrows de K4 y K8 en un solo hijo flex (sin espacio doble). | — |
| P1-5 | K5, K6, K9 y K10 con padding izquierdo de 32 y el ↗ en 24/24: la columna de texto queda alineada. | — |
| P1-6 | Móvil más corto: K5 oculto, héroe 1:1, K13 de 320, teléfono de olbo de 240, medias de K3 y K8 en 2:1, footer de 76. | 5.961 → 5.437 px (6,4 pantallas). |
| P1-7 | La nav del header se ve hasta 1024. Por debajo de 1024 aparece el dock. | — |
| P1-8 | `scroll-padding-top` de 96 px (16 en móvil, más 88 abajo para el dock). | — |
| P1-9 | «Hablemos» pasa a secundario (`--losa-alta`; azul solo al hover). La única primaria del home es «Ver casos». | 9,5:1 |
| P1-10 | El radio XL (48) queda solo en K1. K7, K8 y K17 pasan a 32: K8 queda concéntrico (32 − 8 = 24) y las filas comparten silueta. | — |
| P1-11 | K16: filas de 8 px de padding y sin padding arriba. | Ya no se desborda. |
| P2-1 | `text-wrap: balance` en títulos, claim, nivel, etiquetas y pasos; `pretty` en apoyos y lead. | — |
| P2-2 | UI de 14 px: `.005em / 1.3`; etiquetas: `.01em`. | — |
| P2-3 | Doto de 20–24 px (años de K16, 01–04 de K14) en `--tinta`. | — |
| P2-4 | Controles de 40 px en el header y de 48 en K2 desde 768. En móvil, el grupo ES/EN mide 48 dentro de un header de 56. | — |
| P2-5 | Pie de cita de K8: «Francesca Steri · Aval Digital Labs». | — |
| P2-7 | Los títulos de losa pasan de h3 a h2 (sin salto h1 → h3). | — |
| P2-8 | `role="region"` y el «carrusel» del carril solo con `max-width: 767px` (por JS). | — |
| P2-9 | `-webkit-tap-highlight-color: transparent; touch-action: manipulation` en enlaces y botones. | — |
| P2-10 | `translate="no"` en el wordmark, el nombre y los nombres de producto. | — |
| P2-11 | Círculo ↗ en tinta sobre las miniaturas claras de K9 y K10. | — |
| Motion | Se quita el re-encendido de `wght` en cada hover (se queda solo en la entrada). `:active` pasa a .99, y a nada en K1. `materializar` usa `blur(4px)` y escala .98. Se añade una red de seguridad: si el JS falla, `.enter` aparece a los 2 s. | — |

**No aplicado y por qué**
- **Plegar K12 dentro de K11 en móvil** (≈ −260 px para llegar a ≤ 6 pantallas): es una decisión de contenido y la
  crítica misma dice «preguntar a Doug». El móvil queda en 6,4 pantallas.
- **«Cita original en inglés» en K8 (P2-5):** con el pie corto se cae la marca de idioma que pedía 04 para K8. La cita
  conserva `lang="en"` y la marca sigue visible en K15. Elegí el pie corto porque es el arreglo explícito de la crítica.
- **La rejilla 5 + 7, la escala, las losas jelly, la regla azul/rojo, la base de accesibilidad, el movimiento reducido
  y el dock** no se tocaron: la crítica los marcó como «muy bien, no tocar».
