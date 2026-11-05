# 06 · Crítica de UI · Propuesta A «Tablero»

> Crítico de UI. Solo leí, medí y reporté: no toqué `propuestas/A/`, salvo para guardar mis capturas `crit_A_*.jpg`.
> Método: Playwright/Chromium a 1440×900, 1024×768 y 390×844 (más 390×664, el viewport real de Safari en iPhone con
> barras), en ES y EN, con `getComputedStyle` y `getBoundingClientRect`. El contraste lo medí en el píxel real: oculté
> el texto, capturé el fondo bajo cada glifo y calculé la razón WCAG contra el color del texto. Para comprobar los
> arreglos, inyecté el CSS propuesto en la página y volví a medir: las cifras «después» de este documento están medidas,
> no estimadas. Skills aplicadas: refactoring-ui (más `diagnose.md`), web-design-guidelines (copia local
> `guidelines.md`, sin red) y emil-design-eng.
>
> **Nota de servidor:** serví la **raíz del repo** y no `docs/rediseno-2026`. La propuesta carga capturas y PDF de
> `/public` con `../../../../public/…`, y sirviendo solo `docs/rediseno-2026` daban 404 y la medición salía falseada.
> URL usada: `/docs/rediseno-2026/propuestas/A/index.html`. Servidor detenido al terminar.

Capturas de la crítica (1× DPR, en `propuestas/A/`):

| Archivo | Qué muestra |
|---|---|
| `crit_A_1440_pliegue_duplicados.jpg` | Pliegue de 1440: el nombre dos veces, la disponibilidad dos veces, ES/EN dos veces, dos CTA azules y la nav sobre la atmósfera (3,5:1) |
| `crit_A_1440_k4_chip.jpg` | K4 Andes: la pill NDA flota entre el «18» y «países». También se ve el doble espacio en «Mercadolibre ·  2024–2026» |
| `crit_A_1024_huecos.jpg` | Tableta a 1024: «Doug Vargas» cortado arriba en K2, lectura en zigzag, un hueco a la derecha de MakeaPet y ninguna navegación en el header |
| `crit_A_390_safari_664.jpg` | 390×664 (Safari con barras): el claim entra con 9 px de margen; nivel, Mercadolibre y «Ver casos» quedan fuera |

---

## 1. Puntaje

| Eje | Nota | Justificación (una línea) |
|---|---|---|
| Jerarquía | **7,0** | La Z cara → losa blanca → casos funciona. La diluyen tres duplicados en el pliegue (nombre, disponibilidad, ES/EN) y dos acciones azules que compiten. |
| Tipografía | **8,0** | Todo cae en la escala (12…72; Doto 20/24/30/48/72), con solo 3 pesos y Doto nunca bajo 20 px. Restan 6 variantes distintas de 14 px, viudas sin `text-wrap` y el bug del espacio doble en los eyebrows. |
| Spacing / rejilla | **6,0** | En escritorio todo va en 4/8 y el gutter es 16 constante. Pero K5, K6, K9 y K10 se salen 8 px de la columna de texto, K16 se desborda y la tableta está rota (corte, huecos, zigzag). |
| Color y contraste | **7,0** | Tokens fieles y losas jelly que pasan (eyebrow azul 6,6:1, magenta 8,1:1). Falla la nav del header en reposo (3,50:1), y el pliegue queda con ~18 % de claro (meta 25–30 %) y ~13 % de color (meta ≤ 10 %). |
| Profundidad / materiales | **8,0** | Filo jelly, bloom del color de la losa, vidrio con cantos metálicos y radios concéntricos en K1, K3 y K13. Fallan K8 (48 con media de 24 e inset de 8) y la mezcla de 48 y 32 en una misma fila. |
| Motion | **8,0** | Curvas y duraciones de emil, springs críticos y reduced-motion verificado: 0 animaciones y transform `none`. Restan el re-encendido de `wght` en cada hover (propiedad que no compone), `scale(.98)` en losas enormes y el blur de 12 px animado sobre el WebGL. |
| Móvil | **6,5** | Está diseñado aparte (dock, carril, timeline-pastilla), sin desborde y con todos los toques ≥ 44 px. Pero mide 7,1 pantallas (meta ≤ 6), el CTA queda al filo del pliegue y en EN cae debajo. |
| Accesibilidad | **7,0** | Orden de foco = DOM, anillo visible en los 40 tabs, skip link, `sr` en cada cifra y `lang` en las citas. Fallan el contraste de la nav, la falta de `scroll-padding-top` bajo el header fijo, el salto h1 → h3 y el grupo «Idioma» duplicado. |
| Fidelidad a RonDesignLab | **8,5** | Vidrio estriado oblicuo sobre la cara, losas jelly, dot-matrix «cifra + etiqueta», círculos blancos ↗ y header en pastilla de vidrio. Es el gesto de ref-1/2/3, no una plantilla. |
| Impacto / personalidad | **8,0** | El láser que atraviesa las estrías es una idea de marca propia y la regla «azul = tu acción, rojo = mi presencia» se cumple. Los duplicados le restan aplomo al primer golpe. |
| **Total** | **7,4 / 10** | Muy buena base de sistema. Con los P0 y P1 llega a ~8,5. |

---

## 2. Las cinco observaciones del orquestador, resueltas

| # | Observación | Medido | Veredicto y decisión |
|---|---|---|---|
| 1 | «Doug Vargas» dos veces en el pliegue | K1 `.hero-name` 60/600 en y 753–808; K2 `.who` 18/500 en y 142–166. En 390 están a 100 px uno del otro (462 y 563). | **Confirmado, P0.** Se queda el de K1 (es la identidad sobre la foto). El de K2 pasa a solo lector de pantalla, **dentro del H1**, así no se pierde el nombre accesible ni el SEO. |
| 2 | Disponibilidad dos veces | K1 `.avail` «Disponible para consultoría» y K5 «Abierto a consultoría puntual», con dos textos distintos para lo mismo (EN: «Open to consulting» / «Open to selected consulting»). | **Confirmado, P0.** En escritorio (≥ 1280) K5 está en el pliegue (y 736–848): se esconde `.avail` de K1. En móvil, K1 es la que está en el pliegue (02 §3 lo exige): se esconde K5, que además ahorra 100 px. Se unifica el texto: «Abierto a consultoría puntual». |
| 3 | Switch ES/EN en el header y en K6 | Dos `role=group aria-label="Idioma"` (líneas 636 y 722), visibles a la vez a 1440 y a 1.120 px de distancia. El lector los anuncia dos veces y en el tab son 4 paradas para una sola decisión. | **Confirmado, P1.** Se queda el del header (02 §5.6: «el selector queda en el header»). K6 pasa a ser la gemela de K5: reloj + lugar + círculo ↗ de 48 px. |
| 4 | Pill «NDA · Caso a solicitud» desalineada respecto al 18 | La caja de línea del «18» mide 617,8–665,8 (tinta de los dígitos ≈ 626–657) y «países», 669,8–688. La pill ocupa 656–688: su borde superior toca el pie de los dígitos y su centro (672) no coincide con nada. | **Confirmado, P1.** La pill se centra en la línea de las cifras: con `align-self:start; margin-top:8px` queda en 625,8–657,8 (medido), centrada en el «18». |
| 5 | En móvil, ¿el claim queda bajo el pliegue? ¿Pasa el test de 5 s? | A 390×844 el claim está en y 592–655 (**dentro**) y «Ver casos» en 787–835 (dentro por 9 px), pero el CV ya queda fuera (843–891). **En EN «Ver casos» baja a 859: fuera.** A 390×664 (Safari real) entran el nombre y el claim; el nivel (703), Mercadolibre (763) y el CTA (835) quedan **fuera**. | **Pasa a medias, P1.** Con el arreglo 1 (−28,8 px), el héroe en 1:1 (−89,5 px) y `margin-top:16px` en los CTA, medido: claim 474–537, nivel 585, Mercadolibre 645 y «Ver casos» 661–709 (ES) o 685–733 (EN). A 664 px el test de 5 s pasa entero y el CTA asoma; en 844 entra todo en los dos idiomas. |

---

## 3. Arreglos priorizados

Formato: **evidencia (valor actual) · dónde · valor exacto · por qué.** Los números de línea son de `propuestas/A/index.html`.

### P0 · bloquean

**P0-1 · Nombre duplicado en el pliegue.**
- Evidencia: K1 `.hero-name` 60 px (y 753) y K2 `.who` 18 px (y 142), los dos dentro del pliegue de 1440 y de 390.
- Dónde: `.k2 .who` (línea 256) y `.k2 .claim` (línea 257, `margin-top: var(--s-2)`). HTML en la línea 667.
- Valor: en la línea 256, cambiar la regla por
  `.k2 .who { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }`
  (igual que `.sr`; el `<span>` sigue dentro del `<h1>`). En la línea 257, `margin-top: 0`.
- Por qué: es un solo protagonista por losa, y el nombre ya manda en K1. Además libera 31,4 px en escritorio y 28,8 px
  en móvil, que es justo lo que piden P0-3 y P1-1.

**P0-2 · Disponibilidad duplicada y con dos textos.**
- Evidencia: «Disponible para consultoría» (K1, línea 657) y «Abierto a consultoría puntual» (K5) a 1440, los dos en el
  pliegue.
- Dónde: nueva regla después de la línea 247 (`.avail`), más el bloque móvil (después de la línea 515).
- Valor:
  - `@media (min-width:1280px){ .hero-panel .avail{display:none} }`
  - `@media (max-width:767px){ .k5{display:none} }`
  - Texto de K1 (`k1.avail`) = el de K5 (`k5.st`): «Abierto a consultoría puntual» / «Open to selected consulting».
- Por qué: un dato, un sitio por breakpoint. Así se cumple 02 §3.1 (la disponibilidad está en el pliegue de 1440 y de
  390) sin repetirla. En móvil, ocultar K5 también ahorra 100 px (P1-6).

**P0-3 · Tableta (768–1279) rota.**
- Evidencia, a 1024:
  1. K2 se desborda: el contenido empieza en y 88,2 con la losa en y 96, así que «Doug Vargas» queda **cortado 8 px**
     y se come los 32 px de padding (`crit_A_1024_huecos.jpg`).
  2. Hay un **hueco** de 472×112 a la derecha de K10 (la columna derecha termina en 1744 y la izquierda en 1872).
  3. La lectura va en zigzag: K4 izquierda → K5 derecha → K6 derecha → K7 derecha → K8 izquierda → K9 derecha → K10
     izquierda.
- Dónde: bloque `@media (max-width:1279px)`, líneas 476–495. Añadir al final de ese bloque un
  `@media (min-width:768px) and (max-width:1279px)` con colocación explícita.
- Valor (6 columnas, fila de 112). Las clases `.kN` van después de `.board > *`, así que ganan:
  ```css
  .k1{grid-column:1/4;grid-row:1/7} .k2{grid-column:4/7;grid-row:1/4} .k3{grid-column:4/7;grid-row:4/7}
  .k4{grid-column:1/7;grid-row:7/10} .k5{grid-column:1/4;grid-row:10/11} .k6{grid-column:4/7;grid-row:10/11}
  .k7{grid-column:1/4;grid-row:11/15} .k8{grid-column:4/7;grid-row:11/15}
  .k9{grid-column:1/4;grid-row:15/17} .k10{grid-column:4/7;grid-row:15/17}
  .k16{grid-column:1/7;grid-row:17/20} .k11{grid-column:1/7;grid-row:20/23}
  .k12{grid-column:1/4;grid-row:23/26} .k15{grid-column:4/7;grid-row:23/26}
  .k13{grid-column:1/4;grid-row:26/29} .k14{grid-column:4/7;grid-row:26/29} .k17{grid-column:1/7;grid-row:29/32}
  ```
- Medido con el CSS inyectado (y P0-1): K2 pasa a 472×368 y sus CTA terminan 32 px antes del borde. No quedan huecos
  a 1024 ni a 768. El orden visual queda K1…K10, K16, K11, K12, K15, K13, K14, K17, idéntico al DOM. K4 Andes a todo
  el ancho (960×368) da a las tres cifras el aire de ref-1. La página baja de 4.364 a 4.236 px.
- Aviso: a 768, K1 mide 344×752 y la foto 3:4 se recorta al 61 % del ancho. La cara queda centrada, y lo acepto.
- Por qué: un 1024 roto es un iPad en horizontal, y es la mitad de los reclutadores que abren el link en tableta.
  Además, WCAG 1.3.2 y 2.4.3 piden que el orden de lectura sea el visual.

**P0-4 · La nav del header no pasa AA en reposo.**
- Evidencia: `.nav a` (`--tinta-2` #A1A1AB, 14/500) sobre el vidrio del header, que deja pasar la atmósfera de la foto:
  **peor 3,50:1, mediana 4,06:1**. El EN inactivo del switch da 4,49:1. Sobre losas de la página, al hacer scroll, sí
  pasa (4,56–5,56).
- Dónde: `.top-in`, línea 133, la parada central del gradiente: `rgba(18,19,20,.82) 14% 86%`.
- Valor: `rgba(18,19,20,.94) 14% 86%` (los cantos `rgba(58,59,63,.85)` no cambian, para conservar el metal).
  Respaldo si se quiere más vidrio: `.nav a` y `.lang a` en `#C4C4CC`, que da 5,1:1 sobre el peor fondo medido.
- Por qué: es texto de 14 px de la navegación principal en el primer pliegue, y le exige 4,5:1 (01 §2.3, regla 3:
  «el vidrio sobre foto necesita piso de oscuridad»).

### P1 · importantes

**P1-1 · Test de 5 s en móvil (observación 5).**
- Evidencia: «Ver casos» con su borde inferior en 835 de 844 px (ES) y en **859** (EN, fuera). A 664 px solo entran el
  nombre y el claim.
- Dónde: bloque móvil, línea 515 (`.hero { aspect-ratio: 4 / 5; }`) y línea 524 (`.k2 .ctas { margin-top: var(--s-6) … }`).
- Valor: `.hero { aspect-ratio: 1 / 1; }` (358×358, la cara queda dentro: `object-position 50% 42%`) y
  `.k2 .ctas { margin-top: var(--s-4); }`, más P0-1.
- Medido después: «Ver casos» en 661–709 (ES) y 685–733 (EN). A 664 entran nombre, disponibilidad, claim, nivel y
  Mercadolibre (645), y el CTA asoma. El dock aparece en cuanto K2 sale de la pantalla.
- Por qué: 02 §3.1. El reclutador en móvil es el caso más frecuente, y Safari con barras deja ~664 px, no 844.

**P1-2 · ES/EN duplicado en K6 (observación 3).**
- Dónde: HTML, líneas 722–725 (el `div.lang` de K6) y CSS en la línea 299.
- Valor: borrar el `div.lang` de K6 y en su lugar poner el mismo `<span class="go">` (svg ↗) que lleva K5. CSS: en la
  línea 292, la regla `.k5 .go, .k6 .go` ya cubre los 48 px y el centrado vertical, así que no hace falta nada más.
  Quitar `justify-content: space-between` de `.k6` (línea 295) y dejar `.k6 { flex-direction: column; justify-content: center; }`
  con `.head`, como K5. Añadir al final de `.place` « · ES / EN» como dato, no como control.
- Por qué: un control, una decisión. K5 y K6 quedan gemelos (cifra o estado + línea secundaria + ↗), y una fila de dos
  losas gemelas se lee como un par.

**P1-3 · Pill NDA (observación 4).**
- Dónde: `.chip`, línea 285 (`align-self: end`).
- Valor: `@media (min-width:768px){ .k4 .chip { align-self: start; margin-top: var(--s-2); } }`. En móvil se queda
  como está, en su propia fila.
- Medido: la pill pasa a 625,8–657,8, centrada en la tinta del «18» (626–657).
- Por qué: en ref-1 los pares van justificados a los extremos y comparten línea. Ahora la pill no se alinea ni con la
  cifra ni con la etiqueta, y parece un error.

**P1-4 · Espacio doble en los eyebrows de K4 y K8.**
- Evidencia: `.eyebrow` es `display:flex; gap:8px`. «Mercadolibre ·» y `<span>2024–2026</span>` son dos ítems flex,
  así que el espacio visible es de ≈ 12 px contra los 4 px de un espacio normal (`crit_A_1440_k4_chip.jpg`).
- Dónde: HTML, líneas 694 y 748.
- Valor: envolver todo el texto en un solo hijo:
  `<p class="eyebrow"><span>Mercadolibre · <span class="nums">2024–2026</span></span></p>`, y lo mismo en la línea 748.
- Por qué: es la primera línea que lee el reclutador en Andes. Se ve como un error de tipeo.

**P1-5 · Columna de texto rota en 8 px en K5, K6, K9 y K10 (escritorio).**
- Evidencia: el texto empieza en x 644 en K2 y K3 pero en **636** en K5, y en x 992 en K4 y K13 pero en **984** en K6,
  K9 y K10. En la misma fila, el título de K7 cae en y 918 y el de K9 en **910**. El círculo ↗ de K7 está en top 24 y
  el de K9 en top 16.
- Dónde: `.k5, .k6` (línea 291), `.side` (línea 322), `.side .thumb` (línea 325) y `.side .go` (línea 328).
- Valor:
  - `.k5, .k6 { padding: var(--s-6) var(--s-6) var(--s-6) var(--s-8); }`
  - `.side { padding: var(--s-8) var(--s-6) var(--s-6) var(--s-8); }`
  - `.side .thumb { margin: calc(-1*var(--s-8)) calc(-1*var(--s-6)) calc(-1*var(--s-6)) 0; }`
  - borrar la línea 328 (`.side .go`), para que herede `top:24px; right:24px`.
  - En móvil no cambia nada: las líneas 535 y 545 ya fijan sus valores.
- Por qué: las losas vecinas comparten una línea de texto a 32 px del borde. Esa línea invisible es lo que hace que un
  bento se vea «hecho» (refactoring-ui, alineación).

**P1-6 · Móvil en 7,1 pantallas (meta ≤ 6, 02 §3.7).**
- Evidencia: la página mide 5.961 px a 390 (ES) y 5.951 px (EN).
- Valor (bloque móvil):
  - P0-2 (K5 oculto): −100 px.
  - P1-1 (héroe 1:1): −89,5 px.
  - P0-1: −28,8 px.
  - Línea 567: `.k13 { min-height: 320px; }`. −100 px.
  - Línea 539: `.k7 .phone { height: 240px; }`. −60 px.
  - Líneas 527 y 529: `aspect-ratio: 2 / 1` en `.k3 .media` y `.k8 .media`. −86 px.
  - `.foot { padding-bottom: calc(var(--s-16) + var(--s-3) + env(safe-area-inset-bottom)); }`, que deja 76 px, justo
    el dock de 64 más su margen de 12. −32 px.
- Resultado: ≈ 5.465 px (6,5 pantallas). Para llegar a ≤ 6 falta una decisión de contenido que no me toca: plegar
  K12 (sus cifras repiten la trayectoria de K11) dentro de K11 en móvil, que ahorra ≈ 260 px. **Preguntar a Doug.**
- Por qué: 02 §3.7. El home de hoy mide 14 pantallas, y esta es la promesa del rediseño.

**P1-7 · Sin navegación entre 768 y 1279 px.**
- Evidencia: a 1024, `.nav { display:none }` y `.dock { display:none }`. Solo quedan el wordmark, ES/EN y «Hablemos».
- Dónde: la línea 492 (`.nav { display: none; }`) sale del bloque `max-width:1279px` y pasa a un bloque nuevo,
  `@media (max-width:1023px)`. Las reglas `.dock`, `.dock.hide`, `.dock a`, `.dock a svg` y `.dock a.on` (líneas
  581–590) salen del bloque móvil y pasan a ese mismo bloque `max-width:1023px`.
- Medido: a 1024 la nav entra holgada. Necesita ~727 px y la pastilla tiene 960.
- Por qué: en tableta no se llega al CV ni a Perfil sin hacer scroll hasta K17.

**P1-8 · Las anclas quedan bajo el header fijo.**
- Evidencia: no hay `scroll-padding-top` ni `scroll-margin` (grep vacío). «Perfil» (#k13), «Hablemos» (#k17) y «Ver
  casos» (#k3) dejan el borde superior de la losa bajo la pastilla de 16 + 64 px.
- Dónde: `html` (línea 106).
- Valor: `html { scroll-padding-top: calc(var(--s-4) + var(--header) + var(--s-4)); }` (96 px). En el bloque móvil,
  `html { scroll-padding-top: var(--s-4); scroll-padding-bottom: 88px; }`, porque ahí el header es absoluto y el dock
  ocupa 64 + 12 + 12.
- Por qué: guía de foco: «sticky headers must not cover the focused element».

**P1-9 · Dos acciones primarias azules en el pliegue.**
- Evidencia: «Hablemos» (`.cta-talk`, #2B56F3, 48 px de alto) y «Ver casos» (`.btn-pri`, #2B56F3, 44 px), a 160 px
  una de otra.
- Dónde: `.cta-talk`, línea 147.
- Valor: `.cta-talk { background: var(--losa-alta); color: var(--tinta); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }`
  y `.cta-talk:hover { background: var(--electrico); color: var(--blanco); }`. No la hago blanca porque el blanco es la
  pill activa de la nav (ref-3).
- Por qué: refactoring-ui pide una sola acción primaria por vista. En el home esa acción es «Ver casos».

**P1-10 · Radios incoherentes y K8 no concéntrico.**
- Evidencia: K8 tiene radio 48 con `.media` de 24 e inset de 8; lo concéntrico sería 40 (en móvil, 36 con 20, cuando
  lo correcto sería 28). En la fila de casos, K7 y K8 llevan 48 junto a K9 y K10 con 32. En la última fila, K14 lleva
  32 y K17 lleva 48, con el mismo tamaño (680×368).
- Dónde: HTML, líneas 729, 742 y 899: quitar la clase `xl` de K7, K8 y K17. `xl` (48 / 36 en móvil) queda **solo en
  K1**.
- Por qué: los radios concéntricos son «lo que hace que ref-2 se vea cuidado» (01 §5). Y en una fila, las losas
  vecinas comparten silueta.

**P1-11 · K16 se desborda.**
- Evidencia: el `ul.rows` termina 6,9 px **por debajo** del borde de la losa. La última línea («Diseño para clientes
  de EE. UU. y LATAM.») queda a 5,1 px del filo: se come los 32 px de padding. Pasa a 1440 y a 1024.
- Dónde: `.k16 .rows` (línea 339) y `.k16 .rows a` (línea 341).
- Valor: `.k16 .rows { padding-top: 0; }` y `.k16 .rows a { padding: var(--s-2) 0; }`.
- Medido: queda un margen inferior de 40 px.
- Por qué: es un texto tocando el borde de la losa, el defecto más visible en una revisión de oficio.

### P2 · pulido

| # | Evidencia (actual) | Dónde | Valor exacto | Por qué |
|---|---|---|---|---|
| P2-1 | Viudas: «(UX/UI) · Design Engineer» en 390, «2 oct» sola en K9, «pantallas» sola en K14, «Carta de presentación» sola en la segunda fila de K17 (1440 ES) | `.title`, `.k2 .claim`, `.k2 .level`, `.fig .lab`, `.k14 .steps span`, `.apoyo` (líneas 173, 257, 259, 187, 397, 174) | `text-wrap: balance` en títulos, claim, nivel y etiquetas; `text-wrap: pretty` en `.apoyo`, `.lead` y `.sub` | Guía de tipografía: evita viudas |
| P2-2 | 6 variantes de 14 px con tracking 0 / .005 / .01 em y leading 14 / 18,2 / 19,6 / 20,3 / 21 | `.eyebrow` (170), `.nav a` (139), `.avail` (247), `.k5 .state` (293), `.fig .lab` (187) | Texto de UI de 14 px: `letter-spacing:.005em; line-height:1.3` en todos. Etiquetas: `.01em`. Quitar el resto | Una decisión por rol, no por componente |
| P2-3 | Doto gris en 20–24 px (años de K16, 01–04 de K14): con poca tinta por punto se lee bastante por debajo de su razón nominal de 7,3:1 | `.k16 .rows a .dm` (línea 345), `.k14 .steps .dm` (línea 396) | `color: var(--tinta)` en reposo. El gris queda solo para Doto ≥ 30 px | La matriz de puntos pierde contraste efectivo en tamaños chicos (01 §4.2) |
| P2-4 | Alturas de control en el header: nav 40, grupo ES/EN 44, CTA 48. En K2: botones de 44. En móvil, el grupo ES/EN mide 52 dentro de un header de 56 (2 px de aire) | `.lang` (143), `.btn` (262), bloque móvil (502) | Desktop: `.lang { padding: 2px }` → 40. `.btn { height: 48px }` en ≥ 768, igual a `.cta-talk`. Móvil: `.lang { padding: 2px }` → 48 en un header de 56 | Una sola altura por nivel de control |
| P2-5 | K8 tiene tres protagonistas (captura, «12+» y cita) y el pie de cita a 12 px ocupa 3 líneas en 191 px | HTML, línea 753 (`footer`) | Pie: «Francesca Steri · Aval Digital Labs» (el cargo completo y «cita original en inglés» ya están en K15, slide 3) | Un solo protagonista por card (02 §2) |
| P2-6 | Claro en el pliegue ≈ 17,7 % (K2 + la tira de K3), con una meta de 25–30 % (01 §2.4). Color ≈ 12,7 % (solo K4) más dos botones azules | K6 | `class="card light k6"`. El reloj Doto en `--tinta-osc`: queda una losa clara en la fila inferior del pliegue, junto al panel oscuro del héroe, y sube el claro a ~21 %. Combina con P1-2 | Es el respiro blanco que pide el brief |
| P2-7 | Salto de encabezados h1 → h3 (no hay h2 entre K2 y K17) | Todas las `<h3 class="title">` (líneas 684, 695, 733, 749, 764, 778, 792, 813, 879, 888) | Cambiar a `<h2 class="title">`. El estilo va por la clase, así que no cambia nada visual | Guía: encabezados jerárquicos |
| P2-8 | `role=region aria-roledescription="carrusel"` en `.rail`, que en escritorio es `display: contents` y no es un carrusel | Línea 758 | Poner `role` y `aria-roledescription` por JS solo con `matchMedia('(max-width:767px)')` | El lector anuncia un carrusel que no existe |
| P2-9 | Sin `-webkit-tap-highlight-color` ni `touch-action: manipulation` | `a, button`, líneas 110–111 | `a, button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }` (los `:active` ya dan respuesta) | Sin esto, iOS pinta un rectángulo gris sobre el stretched link que ignora el radio |
| P2-10 | Marcas sin `translate="no"` | wordmark (629), `olbo`, `Naowee`, `Mercadolibre`, `douguizard` | Atributo `translate="no"` | Guía i18n: el traductor automático rompe nombres de marca |
| P2-11 | El círculo ↗ blanco de K9 y K10 cae sobre la miniatura clara (iPad, teléfono rosa) y casi desaparece | `.k9 .go, .k10 .go` | `background: var(--tinta-osc); color: var(--blanco); box-shadow: 0 0 0 1px rgba(255,255,255,.12)`, como ya hacen K3 y K8 (línea 195) | Regla propia: sobre captura clara, tinta |

**Motion (formato de emil-design-eng):**

| Antes | Después | Por qué |
|---|---|---|
| `.card:hover .dm { animation: encender 240ms }` (línea 208): anima `font-variation-settings` en cada hover | Solo en la entrada: borrar la regla de hover y dejar el foco en el ↗ (que gira y se rellena) | Es un hover que se ve decenas de veces, con una propiedad que no compone y repinta el texto. emil: «remove or drastically reduce» |
| `.card:active { transform: scale(.98) }` (línea 210) en K1 (564×752 se encoge ~15 px) | `.card:active { transform: scale(.99) }` y `.card.hero:active { transform: none }` | En una losa enorme, .98 se siente como un salto. 0,95–0,98 es escala de botón |
| `materializar`: `filter: blur(12px) → 0` en 560 ms sobre la losa con canvas WebGL (línea 430) | `blur(4px) → 0` y `scale(.98) → 1` | El blur solo tiene que tapar la imperfección. 12 px sobre un canvas a pantalla completa cuesta frames justo durante el LCP |
| `.js .enter { opacity: 0 }` sin red de seguridad | Añadir `@keyframes` de respaldo: `.js .enter { animation: aparecer 0s 2s forwards }`, o quitar `.js` si `choreo()` no corre en 1,5 s | Si el JS falla después de poner `.js`, el pliegue queda invisible |

**Web Interface Guidelines (formato `file:line`):**

```text
## docs/rediseno-2026/propuestas/A/index.html
index.html:133 - header glass .82 → nav 3,50:1 (AA) → .94
index.html:106 - no scroll-padding-top; fixed header covers anchor/focus targets
index.html:684… - h1 → h3 jump; card titles should be h2
index.html:722 - duplicate language group (second role=group "Idioma")
index.html:758 - aria-roledescription "carrusel" on desktop display:contents
index.html:208 - hover animates font-variation-settings (non-compositor)
index.html:110 - missing -webkit-tap-highlight-color / touch-action: manipulation
index.html:629,733,… - brand names need translate="no"
index.html:173,257,258 - headings without text-wrap: balance
✓ transition: all ausente · ✓ prefers-reduced-motion (verificado: 0 animaciones) · ✓ img con width/height
✓ lazy bajo el pliegue y fetchpriority en el héroe · ✓ color-scheme dark + theme-color = fondo · ✓ Intl.DateTimeFormat
✓ aria-label en botones de ícono · ✓ aria-live en copiar y en testimonios · ✓ sin user-scalable=no
```

---

## 4. Lo que está muy bien y no se toca

1. **La rejilla 5 + 7 con K1 a 564×752 (3:4 exacto).** La foto entra entera, sin escalar más de la cuenta, y el
   pliegue termina en 848 de 900 px. El gutter de 16 (no 24, como sugiere 01 para ≥ 1440) está justificado: es lo que
   cierra la proporción 3:4. No cambiarlo.
2. **La escala.** Todos los tamaños medidos caen en 12/14/16/18/20/24/30/48/60/72 y todos los espacios en 4/8/12/16/24/32
   (los únicos valores fuera de escala son `auto` y el derivado 56 + 12 de `.head`). Pesos 400/500/600 y Doto 700.
3. **Los radios concéntricos donde existen:** el panel del héroe (48 − 16 = 32), las medias de K3 y K13 (32 − 8 = 24)
   y su versión móvil (28 − 8 = 20).
4. **Las losas jelly.** Con el aro oscurecido, sus etiquetas pasan en el píxel peor: azul 6,63–7,29:1 y magenta
   8,10–9,51:1. Nunca hay gris sobre color: cada losa usa su propio tono aclarado (refactoring-ui, regla 1).
5. **La regla «azul = tu acción, rojo = mi presencia»**, con el rojo siempre ≤ 8 px, y el láser que cruza las estrías
   entero. Es la idea de marca de la propuesta.
6. **La accesibilidad de base:** el orden de tabulación es exactamente el del DOM (40 paradas verificadas), con anillo
   de 2 px #2B56F3 a 3 px en todas (3,6:1 sobre el vacío), el stretched link con el foco pintado en la losa, `sr` con
   frase completa para cada cifra Doto, `lang="en"` en las citas, y copiar correo y testimonios con `aria-live`.
7. **El movimiento reducido real:** con `prefers-reduced-motion` no queda ninguna animación (`getAnimations()` = 0),
   las losas no se mueven en hover y el vidrio se pinta una vez.
8. **Sin desborde horizontal** en 390, 1024 y 1440 (ES y EN), **sin errores de consola** (solo avisos del driver
   WebGL de Chromium headless) y **todos los toques ≥ 44 px en 390**.
9. **El dock móvil:** aparece solo cuando K2 sale de la pantalla y, escondido, queda en `visibility: hidden`, fuera
   del tab. Sus objetivos miden 76×56.
10. **El EN no rompe el layout:** el mismo orden y los mismos ids, con el claim en dos líneas exactas en los dos
    idiomas a 1440.
