# 06 · Crítica de las páginas internas de B (Trabajo, caso, Perfil, Experiencia)

> Crítico de UI · 6 nov 2026 · objeto: `propuestas/B-paginas/` (`work.html` 759 líneas, `caso.html` 1.098, `about.html`
> 912, `experience.html` 837), `NOTAS.md` y las capturas `shot_P_*`.
> Método: refactoring-ui (escalas, jerarquía, reglas duras) y web-design-guidelines (copia local), más coherencia con la
> landing B aprobada, el lockup «corte láser» y la tipografía decidida (Geologica / Urbanist / Instrument Sans / Doto
> solo cifras). Además de las capturas, se midió en Chromium (Playwright) sirviendo la raíz del repo, con GSAP 3.12.5
> desde npm (cdnjs está bloqueado), DPR 1, a 1440×900, 1366×768, 1280×720 y 390×844 táctil. El contraste se calculó
> con los tokens reales (`work.html` L42–49). Los números de línea son los de cada archivo tal como está hoy.
>
> Capturas de esta crítica (scratchpad, no versionadas): Tab en `/experience` a 1440, `/work` con scroll a 1440 y 390,
> las 4 páginas a 1366×768 y 1280×720, y `/experience` a 390 con scroll. Se citan por lo que muestran.

---

## 1. Veredicto por página

| Página | Nota | Veredicto (escritorio · móvil) |
|---|---|---|
| `/work` | **7,5** | El sistema de B se reconoce al instante: losas con un protagonista, una jelly azul y una magenta, archivo en filas. Fallan el orden de la numeración (/02, /03, /01…), la barra de filtros fija que flota sobre las losas sin fondo y, en móvil, el pliegue sin ningún caso a la vista. |
| `/work/naowee-suid` | **7,5** | La mejor pieza de las cuatro en contenido: plantilla completa, decisiones con evidencia, proceso cosido por el láser. Pierde en el pliegue: la ficha queda en escalera (2 + 1 ancha + 1 suelta) y el tablero de impacto, que es el remate, tiene cifras chicas y 80 px muertos por losa. |
| `/about` | **8,0** | La portada con el lockup «corte láser» alineado con el haz de la foto es la firma del sitio y funciona a 1440 y a 1280. En móvil se rompe la idea (dos láseres) y la mitad baja tiene descuidos de alineación (títulos de «Lo que hago», «Citas originales en inglés», «Ideaware» huérfano). |
| `/experience` | **6,5** | La idea (odómetro Doto + eje láser + tramos proporcionales) es la correcta y el modo reducido está bien resuelto. Pero tiene un fallo de teclado bloqueante, abre con «0 · 0 · 0», gasta el 42 % del scroll en 2006–2014 y a 1280×720 la escena anclada no cabe. En móvil los hitos inactivos quedan ilegibles (1,9:1). |
| **Conjunto** | **7,4** | Coherente con la landing: misma cabecera, rail, tokens, pill blanca activa, Doto solo en cifras, láser como luz. Con los P0 y P1 resueltos sube a ≈ 8,5. |

Conteo: **1 P0 · 13 P1 · 14 P2**.

---

## 2. Arreglos priorizados

**P0** bloquea (no se presenta así). **P1** importante. **P2** pulido. Cada arreglo trae: evidencia → zona y línea →
valor exacto → por qué.

### P0 · bloquea

**P0-1 · `/experience` (escritorio): 6 paradas de Tab caen en enlaces invisibles.**
- **Evidencia.** Medido con Tab desde arriba, sin scroll: las paradas 15 a 20 son «Ver caso: Ideaware», «Qrvey», «Royal
  Caribbean», «Banco de Occidente», «Andes» y «Naowee», todas con opacidad acumulada **0,00** y `scrollY` = 0. El
  foco está ahí pero no se ve y la página no se mueve. Causa: `.cine .hito { opacity: 0; pointer-events: none }`
  (L348) quita el puntero pero no el foco, y no hay un `focusin` que lleve el scroll al año del hito (L795–L822).
- **Zona y valor.**
  1. En el bloque de escritorio (después de L802): `hitos.forEach(h => h.li.addEventListener("focusin", () => {
     const st = tl.scrollTrigger; const y = st.start + (h.ini - T0) / (T1 - T0) * (st.end - st.start);
     window.scrollTo({ top: y + 2, behavior: "instant" }); st.getTween()?.progress(1); }))`. Así, tabular a un «Ver
     caso» lleva la escena a ese año y el hito se activa.
  2. Mientras un hito no esté activo, `inert` en su `<li>` (lo pone y lo quita `enAnio`, L774) **solo si** se elige no
     hacer el paso 1. Recomiendo el paso 1: el `<ol>` completo debe seguir navegable.
  3. Verificar con la misma prueba: ninguna parada con opacidad < 1.
- **Por qué.** WCAG 2.4.7 (foco visible) y 2.4.11. Es el mismo defecto que ya se marcó en la landing (P1-14 de
  `06-CRITICA-B.md`), aquí agravado: son 6 enlaces seguidos y ninguno se ve.

### P1 · importantes

**P1-1 · `/work`: la numeración de las losas no sigue el orden visual.**
- **Evidencia.** `shot_P_work_1440_completa.jpg`: Naowee /02, Andes /03, olbo /01, Banco /04, DC /05, MakeaPet /06.
  El lector ve «02, 03, 01». Markup L498, L513, L528.
- **Zona y valor.** Numerar en el orden del DOM: Naowee /01, Andes /02, olbo /03 (el resto ya sigue). Si /01 de olbo
  viene de la home de B, la numeración es por página y no se hereda.
- **Por qué.** Un índice numerado que salta parece un error y hace dudar del resto del oficio.

**P1-2 · `/work` (1440 y 390): la barra de filtros fija flota sobre las losas sin fondo y choca con la cabecera.**
- **Evidencia.** Con scroll a 1300 (1440): la pill de filtros (y 72–120) queda junto a la marca, tapa el título de
  Banco de Occidente y se monta sobre la foto de olbo. A 390, scroll 1200: marca + filtros + dock = ~210 px de cromo
  de 844 y el texto de Andes asoma entre la marca y los filtros. `.filtros { position: sticky; top: 72px }` (L406) y
  `top: 68px` en móvil (L415).
- **Zona y valor.**
  - Escritorio: quitar el `sticky`. El índice cabe en 2 pantallas y los filtros se alcanzan con un scroll corto.
  - Móvil: si se quiere fija, debe ser una banda: `.filtros { position: sticky; top: 0; z-index: 30; margin-inline:
    calc(-1 * var(--e-16)); padding: var(--e-8) var(--e-16); background: rgba(6,6,8,.72); backdrop-filter: blur(16px) }`,
    y ocultar la marca mientras está pegada. Si no, sin `sticky` también en móvil.
- **Por qué.** Hoy es cromo flotante sobre contenido, sin material. En la landing la cabecera nunca tapa una losa.

**P1-3 · `/work` (390): el pliegue no muestra ningún caso.**
- **Evidencia.** `shot_P_work_390_pliegue.jpg`: título + intro de 4 líneas + losa «En cifras» de 190 px + filtros; la
  primera losa (Naowee) apenas asoma 120 px bajo el dock.
- **Zona y valor.** En `@media (max-width: 1023px)`: `.w-cifras` pasa a una fila compacta (padding `var(--e-16)`,
  `dot-l` a `var(--t-30)`, etiquetas en 1 línea a `var(--t-12)`) o se mueve después de la primera losa. Intro a
  `var(--t-16)`. Meta: la captura de Naowee entera en el pliegue.
- **Por qué.** En `/work` el contenido es el trabajo. Los números de K12 ya están en la home.

**P1-4 · `/work` vs `/experience`: el sitio cuenta los productos propios de dos maneras.**
- **Evidencia.** `/work` dice «3 productos propios» (L473, L475) y pone Chub en el archivo como «Proyecto paralelo
  freelance» (L579), en el filtro Anteriores. `/experience` pone Chub en la pista «Productos propios» (L740) y suma
  «10 casos = 6 hitos + 4 propios» (`NOTAS.md` §1).
- **Zona y valor.** Decidir una fuente. Recomiendo la de `/work`: `PROPIOS = [olbo, DC Medical, MakeaPet]` en
  `experience.html` L740, Chub como hito «Freelance · Chub (2018)» en el tramo freelance, y rehacer la cuenta de
  «casos publicados» para que dé 10 por el mismo camino que en `/work`.
- **Por qué.** Un reclutador que pasa de una página a otra encuentra cifras que no cuadran. Es un dato, no un estilo.

**P1-5 · `/work/naowee-suid`: la ficha del pliegue queda en escalera.**
- **Evidencia.** `shot_P_caso_1440_pliegue.jpg`, `shot_P_caso_1440_hoja.jpg` y `shot_P_caso_390_pliegue.jpg`: Rol y
  Duración (2 celdas), Equipo (ancha) y Plataformas sola a la izquierda con el hueco de una celda a la derecha. En
  móvil la ficha ocupa 290 px y empuja la captura fuera del pliegue. `.ficha` L414–L418, markup L695–L700.
- **Zona y valor.** Ficha como lista de definición sin cajas: `.ficha { grid-template-columns: repeat(2, 1fr); gap:
  var(--e-24) var(--e-32) } .ficha div { padding: 0; background: none; box-shadow: none; border-top: 1px solid
  var(--losa-borde); padding-top: var(--e-12) }`, en el orden Rol · Duración · Plataformas · Equipo (Equipo ancha al
  final). En móvil: `dd` a `var(--t-16)`, gap `var(--e-16)`. Así cierra en rectángulo y gana ~120 px en móvil.
- **Por qué.** 4 cajas con bordes para 4 datos es «label: value» pesado (refactoring-ui, «labels are a last resort»).
  La escalera es el primer detalle que ve un director de diseño.

**P1-6 · `/work/naowee-suid`: el tablero de impacto no remata.**
- **Evidencia.** Recorte de `shot_P_caso_1440_completa.jpg` (y ≈ 1230–1440): las cifras Doto se ven más chicas que la
  etiqueta blanca que llevan debajo, y cada losa tiene ~80 px vacíos abajo. `.kpi { min-height: 208px; align-content:
  start }` (L439), `.dot-l` = 48 px (L115).
- **Zona y valor.** `.kpi .dot { font-size: var(--t-72) }` (y `var(--t-48)` en móvil); `.kpi { align-content:
  space-between; min-height: 0 }`; `.kpi-et { color: var(--tinta-2) }` en las oscuras (`--tinta-osc-2` en la blanca).
- **Por qué.** Jerarquía por tamaño y color: la cifra es el primario, la etiqueta el secundario. Hoy compiten. Es el
  bloque que el reclutador escanea primero.

**P1-7 · `/about` (390): dos láseres; el corte del nombre ya no lo hace el haz de la foto.**
- **Evidencia.** `shot_P_about_390_pliegue.jpg`: el haz de la foto cruza los ojos en y ≈ 185 y el hilo del nombre
  corta «Vargas» en y ≈ 672. Son dos líneas rojas sin relación. `.laser { display: none }` y `.lockup .l2 .hilo {
  display: block; width: 100vw }` (L404, L406).
- **Zona y valor.** En móvil, una de dos:
  - (a) Recomendada: sin hilo propio en el nombre (`.lockup .l2 .hilo { display: none }`) y el corte de «Vargas»
    cerrado desde el inicio (`--desp: 0`). El láser queda solo en la foto.
  - (b) Encuadrar la foto (`placement(r, "movil")`) para que el haz caiga en la línea del corte; exige recolocar el
    nombre sobre la cara y hoy no hay sitio.
- **Por qué.** Lo aprobado es «el láser parte Vargas». Dos haces lo convierten en decoración y rompen la regla «el
  láser es luz, uno solo».

**P1-8 · `/experience`: abre con «0 · 0 · 0».**
- **Evidencia.** `shot_P_experience_1440_pliegue.jpg` y `experience_1280`: las tres losas de acumulados muestran 0
  (años en producto digital, empresas, casos publicados) justo al lado de un subtítulo que dice «12 años… seis
  empresas».
- **Zona y valor.** En el estado inicial, el dígito no se pinta: `dd:empty` o un guion largo en Doto a `--tinta-3`, y
  la losa a opacidad .6 hasta que el valor sea ≥ 1 (lo pone `enAnio`, L774). Alternativa: mover los acumulados debajo
  del eje, donde se leen como resultado del recorrido.
- **Por qué.** El primer número que ve el visitante es un cero. Se lee como «datos sin cargar».

**P1-9 · `/experience`: el 42 % del recorrido se gasta en 2006–2014.**
- **Evidencia.** El progreso es lineal en años (L737–L738, `T0 = 2006`, pin de 4,2 viewports, L801). 2006 → oct 2014 =
  8,8 de 20,8 años = 42 % del scroll para dos hitos (UAC, Freelance). Los 6 hitos con caso caen en el 58 % restante;
  2016–2018 tiene 3 hitos en ~0,4 viewports (pasan sin leerse).
- **Zona y valor.** Mapear el scroll por hito, no por año: cada hito recibe el mismo tramo de scroll (`1 / n`) y el
  año interpola dentro del tramo. El eje sigue dibujando duraciones proporcionales: solo cambia la velocidad del
  cabezal. Bajar el pin a `innerHeight * 3.6`.
- **Por qué.** El motion debe dar tiempo a lo que importa (Mercadolibre, Banco, Naowee), no a la universidad.

**P1-10 · `/experience` (escritorio de poca altura): la escena anclada no cabe.**
- **Evidencia.** A 1280×720 la fila de años queda cortada en y = 703–720 y la pista «Productos propios» no se ve
  nunca, porque la escena está anclada. La regla `@media (max-height: 820px)` (L405–L409) solo achica el odómetro y
  oculta el subtítulo.
- **Zona y valor.** En esa misma media: `.exp-izq` y `.hito` con `max-height: calc(100svh - 360px)`; `.eje` con
  `margin-top: var(--e-24)`; pista de productos propios a la derecha de la fila de años (misma línea, `--t-12`) en vez
  de debajo. Probar 1366×768 y 1280×720: el eje completo dentro del viewport.
- **Por qué.** Igual que P0-1 de la landing: 1366×768 y 1280×720 son los portátiles de los reclutadores.

**P1-11 · `/experience` (390): los hitos inactivos son ilegibles.**
- **Evidencia.** `.js:not(.rm) .hito.fuera { opacity: .35 }` (L438). Medido: texto `--tinta` al 35 % sobre `--losa` =
  **3,03:1**; `--tinta-2` (rol, fechas) = **1,93:1**. `shot_P_experience_390_completa.jpg`: todo lo que no es el
  hito activo se ve apagado.
- **Zona y valor.** `opacity: .6` en el `<li>` y, en vez de bajar el texto, bajar el material: `.hito.fuera { opacity:
  1; background: transparent; box-shadow: inset 0 0 0 1px var(--losa-borde) }`. El activo conserva la losa llena. Así
  el texto queda ≥ 4,5:1 y el foco se sigue leyendo.
- **Por qué.** Es contenido, no decoración: el visitante en móvil hace scroll leyendo. Regla 8 de refactoring-ui.

**P1-12 · `/experience`: la pista de productos propios choca con la fila de años.**
- **Evidencia.** `shot_P_experience_1440_pliegue.jpg`, x ≈ 1270–1370, y ≈ 800–850: «olbo 2026 ○» se monta sobre el
  «2026» de la fila de años, y «○ 2018 Chub» queda pegado bajo el «2018» del eje. Las tres de 2026 se apilan con
  `top: -6 + off * 20` (L757).
- **Zona y valor.** La pista lleva su propio año solo si no coincide con un año del eje; si coincide, solo el punto y
  el nombre. Apilar hacia abajo desde `top: var(--e-12)` con 20 px entre filas y `.propios { height: var(--e-96) }`
  (L380). Alinear los nombres a la derecha del punto, nunca a la izquierda.
- **Por qué.** Dos textos superpuestos en un eje de datos se leen como error de maquetación.

**P1-13 · `/about`: la mitad baja pierde alineación en tres puntos.**
- **Evidencia.** `shot_P_about_1440_completa.jpg`:
  - «Lo que hago»: el título de la losa 1 queda 24 px más abajo que los de la 2 y la 3, porque `.hago .t-losa {
    margin-top: auto }` (L357) empuja según el largo del párrafo.
  - «Citas originales en inglés» flota a media altura entre el H2 y las losas, en x ≈ 880, sin alinearse a nada (L554).
  - «Dónde he trabajado»: «Ideaware» cae sola en la segunda línea (L378).
- **Zona y valor.**
  - `.hago > li { display: grid; grid-template-rows: auto 1fr auto auto }` con el número en la fila 1, el título en
    la 3 y el párrafo en la 4: los títulos alinean por arriba.
  - `.seccion-cab { display: flex; justify-content: space-between; align-items: end }` para que la marca de idioma
    se alinee a la base del H2, a la derecha.
  - `.marcas { gap: var(--e-12) var(--e-24); font-size: var(--t-18) }`, o en 2 filas de 4 con `grid-template-columns:
    repeat(4, auto)`.
- **Por qué.** Regla de oro de refactoring-ui: el ojo detecta antes una desalineación de 24 px que una sombra mal
  puesta.

### P2 · pulido

| # | Evidencia | Zona y línea | Valor exacto | Por qué |
|---|---|---|---|---|
| P2-1 | `/work` 1440: en el pliegue la losa de Naowee queda cortada a la mitad de su cifra «130+» (`shot_P_work_1440_pliegue.jpg`, y = 870). | `.h1` de `/work`; `.w-cifras` | `h1` a `var(--t-96)` y `margin-top` de filtros `var(--e-32)`: la cifra de Naowee entra en el pliegue. | Una losa partida justo en su dato invita a no seguir. |
| P2-2 | Andes: «400+» a la izquierda y «18 países» a la derecha; el ojo zigzaguea y queda un vacío al centro (`shot_P_work_1440_completa.jpg`). | `.c-andes` L333 | Las tres cifras en una sola columna a la izquierda, o una fila de 3 como en móvil. | Un solo eje de lectura por losa. |
| P2-3 | Banco de Occidente y Naowee: ~200 px muertos entre subtítulo y cifra. | `.c-bdo` L346, `.c-naowee` | `.c-bdo { justify-content: space-between }`; en Naowee subir la cifra a `var(--t-72)`. | Más espacio alrededor del grupo que dentro. |
| P2-4 | DC Medical: «14 días del primer commit a la versión del 2 oct» no se entiende. | Copy `k9` | Para el writer: «14 días de primer commit a producción». | Una cifra sin unidad clara no prueba nada. |
| P2-5 | MakeaPet: la ceja queda a 8 px del título (en las otras, 16 px), porque la losa es de 2 filas. | `.c-dc, .c-mp` L350 | `gap: var(--e-16)` y el título con `margin-top: var(--e-8)`. | Ritmo igual entre losas hermanas. |
| P2-6 | La regla de `NOTAS.md` («azul o magenta en una sola losa por página») no se cumple: `/work` y `/about` llevan una de cada. Lo hecho es lo correcto (una azul, una magenta, una clara por bloque, como la landing). | `NOTAS.md` §intro | Corregir la nota, no las páginas. | La documentación es la que hereda el ejecutor. |
| P2-7 | `/caso`: el texto de «Problema» va en `--tinta-2` y la lista de «Mi parte» en `--tinta`. La narración principal queda más apagada que la lista. | `caso.html` L730–L744 | Párrafo de Problema en `--tinta`, a `var(--t-18)`; dejar `--tinta-2` para la línea «Con quién». | Primario oscuro, secundario gris: una sola regla en el caso. |
| P2-8 | `/caso`: desde el tablero el borde izquierdo salta de x = 112 a x = 332, porque el índice ocupa las columnas 1–2 (L424). La portada y la captura siguen en x = 112. | `.indice` L424 | Mantener el índice, pero el H2 de cada sección y el tablero siguen en col 3. Basta con documentarlo: la captura a sangre (col 1–12) es la excepción. Alternativa: índice en el rail izquierdo (x 24–88) a partir del tablero. | Dos bordes izquierdos en una página larga. |
| P2-9 | `/about`, losa final: el vidrio a .08 deja estrías **verticales** sobre la foto; en la portada son oblicuas (`shot_P_about_1440_losa.jpg`). | Shader, `frame(p)` | Mantener el ángulo oblicuo hasta que la fuerza llegue a 0, o llevarla a 0 al final. | El vidrio estriado oblicuo es la firma; vertical se lee como persiana. |
| P2-10 | `/about`: con el corte abierto, la «V» de «Vargas» queda a 12 px del rail (x = 100 contra 88), a 1440 y a 1280. | `.lockup .m.sup` L245, `DESP` L872 | `--desp-max: -0.06em`, o `padding-left: var(--e-8)` en `.heroe-texto`. | El rail y el nombre no deben tocarse. |
| P2-11 | `/about`, «Cómo trabajo»: los títulos 01 y 02 parten en 2 líneas y los 03 y 04 en 1; además, el haz rojo sobre la losa blanca se ve rosa y pierde su lectura de luz. | `.pasos` L361; títulos L520–L523 | `text-wrap: balance` y el mismo `max-width` en los 4. Hilo sobre blanco: `--laser` sin halo (`box-shadow: none`), 1 px. | Consistencia; el láser es luz sobre lo oscuro. |
| P2-12 | `/about` móvil mide 6.742 px (8 pantallas). | `about.html` móvil | Contexto en 1 párrafo, «Con qué trabajo» colapsado en 2 filas de chips, citas en carrusel horizontal (como el de la landing). | Meta de la landing: ≤ 6 pantallas. |
| P2-13 | `/experience` escritorio: la losa del hito mide 370 px y el contenido 180; quedan ~170 px vacíos (`shot_P_experience_1440_050.jpg`). | `.hito` L347 | `align-content: space-between` con «Ver caso» abajo, o alto `auto` con `min-height: 280px`. | Un vacío dentro de la losa protagonista. |
| P2-14 | `/experience`: los años del eje van en Doto a 18 px en `--tinta-3`; con los puntos finos de Doto el contraste efectivo cae bastante por debajo de 5,9:1. Los tramos cortos (Ideaware, Qrvey, Royal) no llevan rótulo, justo cuando son el hito activo. | `.anios` L376–L379 | Años en Instrument Sans `var(--t-12)` `--tinta-2` con `tabular-nums` (Doto queda para el odómetro). Rótulo del tramo activo siempre visible encima de la barra. | Doto solo donde la cifra es la imagen. |

---

## 3. Lo que está muy bien y no se toca

- **Sistema compartido.** Cabecera, rail, tokens, pill blanca activa y dock salen de las mismas piezas
  (`build.py`): las 4 páginas son idénticas donde deben. Escala de tipo en 12…120 y espacios en tokens, sin valores
  sueltos. Sin desborde horizontal a 1440, 1366, 1280 ni 390.
- **El lockup en `/about`.** A 1440 y a 1280 el haz de la foto pasa exactamente por el corte de «Vargas» (medido y
  corregido tras el primer layout, L743–L748), y el corte se cierra con el scroll. Es la decisión de Doug
  bien ejecutada.
- **La hoja del caso.** Mismo `<article>` en página y en `<dialog>`, Cerrar / Esc / velo / arrastre, «Abrir como
  página completa» y cmd/ctrl/clic medio a pestaña nueva. URL real, como pidió Doug.
- **Decisiones del caso** con tensión, elección y por qué, más su evidencia al lado: es el formato que un head de
  diseño quiere leer.
- **Proceso cosido por el láser** (`caso`) y **diagrama de 4 nodos** (`about`): el hilo vuelve a ser estructura, no
  adorno.
- **Accesibilidad de base.** Salto al contenido, `:focus-visible` global con `--foco`, losas-enlace con foco en la
  tarjeta (`:has(.enlace-tarjeta:focus-visible)`), `aria-pressed` + `aria-live` en filtros, `<ol>` completo de hitos,
  citas con `lang="en"`, `prefers-reduced-motion` y `prefers-reduced-transparency` con variantes reales.
- **Movimiento reducido de `/experience`** (`shot_P_experience_1440_rm.jpg`): eje completo, 2026, acumulados en 12 ·
  6 · 10 y todos los hitos en rejilla. Es una versión digna, no un apagado.
- **Datos honestos.** Fechas de `cv.ts`, sin «países» sumados, punto de miles en Doto corregido, sin huecos
  `[DATO A CONFIRMAR]` publicados.

---

## 4. Arreglar antes de mostrar a Doug (P0 + P1, en orden)

1. **P0-1** `/experience`: el foco por Tab lleva la escena al hito (o `inert` en los inactivos). Repetir la prueba de Tab.
2. **P1-4** Una sola cuenta de productos propios (Chub) en `/work` y `/experience`.
3. **P1-8** `/experience` no abre en «0 · 0 · 0».
4. **P1-9** Scroll por hito, no por año; pin a 3,6 viewports.
5. **P1-10** Escena de `/experience` completa a 1366×768 y 1280×720.
6. **P1-11** Hitos inactivos legibles en móvil (≥ 4,5:1).
7. **P1-12** Pista de productos propios sin choques con la fila de años.
8. **P1-7** `/about` móvil con un solo láser.
9. **P1-5** Ficha del caso sin escalera (y captura en el pliegue móvil).
10. **P1-6** Tablero de impacto: cifra a 72, etiqueta secundaria, sin vacío.
11. **P1-1** Numeración de `/work` en orden visual.
12. **P1-2** Filtros de `/work` sin flotar sobre las losas.
13. **P1-3** Pliegue de `/work` en móvil con un caso a la vista.
14. **P1-13** Alineaciones de `/about` («Lo que hago», marca de idioma, marcas).

Después de aplicar: regenerar `shot_P_*` (incluidas 1366×768 y 1280×720, que hoy no existen) y repetir la prueba de
Tab en las 4 páginas.
