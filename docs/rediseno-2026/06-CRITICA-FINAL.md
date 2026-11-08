# 06 · Crítica final (QA de todo el sitio, propuesta B «Cine → OS»)

> Crítico / QA final · 8 nov 2026 · objeto: la rama `claude/douguizard-portfolio-redesign-9ivnau` en `ff5e761`
> (F0–F8 cerradas, más el pulido de Doug: vidrio en losas y cromo, ES/EN circular, `/cv` en el cromo B, selección que
> se desliza y «Desliza» animado; `08-ENTREGA.md`, `F8-INFORME.md`, `09-MOTION-CONTROLES.md`).
> Método: `npm ci` + `npm run build` + `next start`, Chromium de `/opt/pw-browsers` con WebGL por swiftshader, a 1440×900
> y 390×844 (táctil). Se recorrieron `/` (acto 1, a mitad del ancla, OS y fin), `/work`, la hoja de Naowee desde `/work`,
> `/work/naowee-suid` completa, `/about`, `/experience`, `/cv`, la 404 del sitio y la del caso, `/en` y `/en/work`, y
> `/` con reduced-motion. Se midió por DOM: desborde horizontal, `h1`, tamaños de letra < 12 px, blancos táctiles
> < 24 px, orden y estilo del foco con Tab, foco al abrir y cerrar la hoja, animaciones vivas con RM, errores de
> consola, y la posición de la píldora cuadro a cuadro (rAF) en 8 navegaciones reales (dock y pills). Contraste del
> vidrio con píxeles de la captura y con la mezcla alfa calculada a partir de los tokens. Video de la navegación con
> el dock y con las pills.
> Lentes: `refactoring-ui` (jerarquía, superficies, coherencia de escala), `web-design-guidelines` (contraste, foco,
> blancos táctiles, i18n, móvil) y `motion-design` (continuidad, duración, curva, RM).
>
> Evidencia en `QA-final/`: capturas `<vista>-{1440,390}.jpg` (las `-entera-` son de página entera; las de
> `/about` y del caso a 1440 se tomaron **después de recorrer la página**: sin recorrerla, las secciones con revelado al
> scroll salen vacías en una captura de página entera, que es un efecto de la herramienta y no un error), `metricas.json`,
> `pildora-muestreo.json`, `navegacion-dock-390.webm`, `navegacion-pills-1440.webm`.
>
> **Fuera de alcance (no cuenta):** Safari, Firefox y VoiceOver reales, fps en hardware real y PageSpeed tras el
> deploy (de Doug, `08` §5); titulares «borrador para Doug»; la imagen del héroe; el TBT local de Lighthouse sin GPU.

---

## 1. Veredicto por vista

| Vista | Nota | Veredicto |
|---|---|---|
| Inicio, acto 1 (1440 / 390) | **8,9** | El cine se sostiene: foto `960e1d8c` con vidrio a 12°, láser a la altura de los ojos que parte «Vargas», K2 en losa de vidrio legible sobre la foto y «Desliza» discreto. A 390 la K2 entra completa sobre el pliegue, con los dos botones de 44 px. EN («I direct the product. Then I build it.») cabe igual. |
| Inicio, a mitad del ancla | **8,2** | El morph es continuo y el snap lleva a 0 o al OS en ~1 s, así que el estado intermedio dura poco. A 45 % la K2 se vuelve una losa gris clara translúcida y «Descargar CV» queda a ~1,6:1 (P2-5). |
| Inicio, OS (tablero) | **8,5** | El bento es el de la referencia: Andes en jelly azul, Doto en las cifras, Naowee con captura, BAQ con la hora, trayectoria y cifras. El punto débil es el cromo de vidrio al pasar sobre losas claras (P1-1). |
| `/work` (ES / EN) | **8,7** | Titular, «En cifras» y filtro con la píldora que se desliza; tarjetas con jerarquía clara. EN sin textos sin traducir. |
| Hoja del caso (1440 / 390) | **8,7** | Abre con URL real, el foco va al cuerpo (`div.hoja-cuerpo`), `Esc` vuelve a `/work` y el foco regresa a la tarjeta de origen. A 390 el botón flotante «Secciones» tapa una línea de texto (P2-7, viene de F7). |
| Caso completo `/work/naowee-suid` | **8,6** | Los P1 de F7 están resueltos: «Naowee» a 120 px, ficha 2 × 2, cubierta en losa a sangre, decisiones en losas, película en caja normal. Ritmo vertical bueno. En 390 el dock pierde contraste sobre la cubierta clara (P1-1) y no marca «Trabajo» (P2-2). |
| `/about` | **8,6** | Mismo cine que el inicio con el lockup a 120 px; `h1` con nombre accesible limpio (`sr-only` + líneas `aria-hidden`). Lo demás («Lo que hago», marcas, testimonios, cierre) sigue el sistema. |
| `/experience` | **8,2** | La línea de tiempo animada funciona y el odómetro en Doto es la pieza más «OS» del sitio. El primer cuadro muestra tres losas de acumulados con «—» (estado 2006): en 10 s se lee como dato faltante (P2-4). |
| `/cv` | **6,8** | El cromo B (cabecera, rail, dock, fondo oscuro) ya está, pero el cuerpo sigue siendo el CV de F0: 102 textos en Geist Mono, rótulos de 11 px en mayúsculas espaciadas, grises cálidos que no son tokens B y enlaces «Ver caso →» de 79 × 18 px (P1-2). Es la única página que no parece del mismo sitio. |
| 404 (sitio y caso) | **8,8** | Lienzo B, «Aquí no hay nada.» grande, tres salidas con jerarquía, estado HTTP 404 real en ambas. |
| Cromo y controles (motion) | **8,3** | La selección **ya no salta**: en las 8 navegaciones medidas la píldora pasa por 19–22 cuadros intermedios en ~340 ms con curva de salida, sin rebote, y termina sin capa ni animación viva (fondo blanco devuelto a la opción con `aria-current`). Lo que baja la nota es el contraste del vidrio (P1-1) y el texto blanco sobre blanco durante el viaje (P2-1). |
| Reduced motion | **9,0** | 0 animaciones `running` en `/` en el acto 1 y en el OS; el cine se muestra estático. |
| **Conjunto** | **8,4** | Sin desborde horizontal en ninguna vista, sin errores de consola (solo los 404 esperados), skip link, foco de 2 px visible en todo el cromo, hoja con foco atrapado y devuelto, ES/EN completos. Con P1-1 y P1-2 resueltos el conjunto sube a **≈ 8,7** (objetivo de `07` §5: ≥ 8,6). |

---

## 2. Arreglos priorizados

### P0 · bloquea

Ninguno. No hay pérdida de contenido, rutas rotas, foco perdido ni regresiones funcionales frente a F7/F8.

### P1 · importantes

**P1-1 · El vidrio translúcido del cromo pierde contraste sobre losas y capturas claras.**
- **Evidencia.**
  - El pulido bajó el tinte del vidrio de ~0,97 a 0,5 (`globals.css:239-241`, `--vidrio-plano: rgba(14,15,18,.5)`) y lo
    aplica igual a losas y al cromo (`chrome.css:45-48` pills, `:96-97`, `:198-199`, `:412-413`; `.dock`; `.idioma`;
    `.cab-menu`).
  - Sobre una superficie blanca (`--tinta` #f5f5f7: K2 del OS, olbo, «En cifras», capturas de los casos) el vidrio
    queda en ~rgb(132,132,134). Píxel medido detrás de «douguizard» en `home-os2-1440.jpg`: **(132,131,140)** → texto
    blanco **3,7:1**; las opciones inactivas (`--tinta-2-vidrio` #c2c2ca) quedan en **≈ 2,2:1**. AA pide 4,5:1.
  - En `caso-completa-390.jpg` el dock sobre la cubierta blanca de Naowee se lee gris claro sobre gris claro
    (≈ 1,5–2:1): «Trabajo… Secciones» casi desaparecen. También pasa en el OS a 390 con la cabecera sobre la captura
    de Naowee y sobre olbo (`home-os-390.jpg`, `home-os2-390.jpg`).
  - A 1440, en el OS, el texto de las losas («…cto propio · Design Engineer») se ve a través de la píldora de la
    marca y compite con «douguizard».
  - El barrido de contraste de la suite no lo detecta porque mide las opciones sobre el fondo de la página, no sobre
    lo que pasa por debajo.
- **Arreglo.**
  1. Separar el vidrio del cromo del de las losas: `--vidrio-cromo: rgba(14,15,18,.74)` para `.cab-pills`,
     `.cab-marca .wordmark`, `.idioma`, `.cab-menu`, `.cab-menu-panel` y `.dock`. Las losas sobre la foto conservan
     0,5, que es donde Doug quería ver la foto difuminada. Cálculo sobre blanco: tinte 0,72 → blanco **7,7:1** y
     #c2c2ca **4,6:1**; 0,8 → 10,2:1 y 6,2:1. Con `blur(28px) saturate(170%)` el cromo se sigue leyendo como cristal.
  2. Opcional, si se quiere conservar 0,5: un segundo plano oscuro solo bajo el texto (`text-shadow: 0 0 12px
     rgba(0,0,0,.6)`) no basta para AA; no se recomienda.
  3. Prueba en `controles.spec` o `a11y.spec`: a 390 en `/work/naowee-suid` con el dock sobre la cubierta, y a 1440
     en `/` con la cabecera sobre la K2 del OS, muestrear el píxel bajo cada etiqueta y exigir ≥ 4,5:1.

**P1-2 · `/cv` está en el cromo B, pero su cuerpo sigue siendo el CV de F0.**
- **Evidencia.**
  - `cv-1440.jpg`, `cv-390.jpg`, `cv-entera-1440.jpg`: 102 textos en Geist Mono dentro de `main`; rótulos «CARTA DE
    PRESENTACIÓN», «EXPERIENCIA», «ACTUALIZADA EN…», «VER CASO →» a **11 px** en mayúsculas espaciadas; fechas y
    lugares a 11–12 px en mono; grises cálidos `rgb(138,137,133)` y `rgb(163,162,158)` y blanco `rgb(242,241,238)`
    (paleta de F0), no `--tinta-2` #a1a1ab ni `--tinta-3` #8a8a95.
  - F7 P1-4 dejó la regla de **no** usar mayúsculas espaciadas ni mono dentro del sistema B; el brief §6 pide
    «tipografía display estilizada» y Doto solo en cifras. `/cv` es hoy la única página donde el visitante cambia de
    sitio al entrar.
  - «Ver el caso de …» mide **79 × 18 px** (6 enlaces): por debajo de 24 px (WCAG 2.2 · 2.5.8) y de los 44 px táctiles
    que el resto del sitio cumple.
  - A 1440 el cuerpo es una columna de ~500 px pegada a la izquierda con la columna lateral muy chica; el resto de las
    páginas usa la retícula de 12 columnas.
- **Arreglo.**
  1. Pasar el cuerpo de `/cv` a los componentes y tokens B: nombre y rol en Urbanist (como la portada de `/about`, sin
     el lockup grande), cejas con el estilo `.ceja` del sistema, prosa en Instrument Sans 16/1,6 con `--tinta-2`,
     fechas en Instrument Sans tabular (o Doto ≥ 20 px solo si son cifras de cabecera, D20).
  2. Experiencia como losas o filas con divisores B; «Ver caso» como `Boton` secundario o enlace con
     `min-block-size: 44px` en táctil (24 px mínimo en escritorio).
  3. Retícula de 12 columnas: contenido en col 2–8 y la columna lateral (educación, cursos, idiomas) en col 9–12.
  4. Conservar la hoja de estilo de impresión y los PDF tal como están (el PDF es otro producto); el cambio es solo en
     pantalla.
  5. Prueba: en `/cv`, ningún texto de `main` < 13 px ni en `font-family` mono, y blancos ≥ 24 px (44 a 390).

### P2 · pulido

**P2-1 · Durante el viaje de la píldora, las etiquetas que cruza se ven blancas sobre blanco ~2–3 cuadros.**
Ya está registrado en `09` §7. En `navegacion-dock-390.webm` (de Perfil a Trabajo) «Perfil» y «Trabajo» quedan
ilegibles unos 150–200 ms: la píldora tarda 340 ms y el color 240 ms, con distinto arranque. No es un salto, pero se
nota en un control que Doug pidió pulir. Arreglo: la técnica de la lista duplicada (una copia de las etiquetas en
`--tinta-osc` recortada por la misma transformación de la píldora, `aria-hidden`), o al menos arrancar el cambio de
color de origen y destino en el mismo cuadro que el viaje y con 340 ms.

**P2-2 · En la página completa de un caso el dock no marca ninguna opción.** `aria-current` vacío en las cinco
(`/work/naowee-suid`, 390). Visualmente el usuario pierde «dónde estoy». Arreglo: marcar «Trabajo» en `/work/*` con
`aria-current="true"` (no `page`) y la misma píldora.

**P2-3 · La etiqueta «Experiencia» llena la píldora del dock de borde a borde** (74 px a 390; recorte en
`experience-390.jpg`). Arreglo: `padding-inline` ≥ 8 px en la opción activa o permitir que la píldora sea más ancha que
el blanco táctil; revisar a 360 px.

**P2-4 · `/experience` abre con tres acumulados en «—».** Es el estado 2006 del odómetro (diseño de
`06-CRITICA-PAGINAS`), pero en el primer cuadro, sin scroll, se lee como dato faltante. Arreglo: «0» en Doto a
`--tinta-3` en lugar de «—», o un rótulo «en 2006» sobre las losas mientras el eje está al inicio.

**P2-5 · La K2 a mitad del ancla pasa por un gris claro translúcido** con «Ver casos» y «Descargar CV» a ~1,6:1
(`home-ancla-1440.jpg`). Dura poco gracias al snap; si se quiere pulir, que el fondo de la K2 cruce a blanco con
`opacity` del contenido a 0 en el tramo 30–60 % en vez de mezclar los dos colores.

**P2-6 · Revelado al scroll sin respaldo en captura de página entera.** No afecta al usuario (con RM y sin JS el
contenido está, según la suite), pero cualquier captura completa o herramienta que no haga scroll ve secciones vacías
en `/about` y en el caso. Si Doug va a sacar capturas de página entera para Behance, conviene un `?estatico` o
imprimir con RM.

**P2-7 · Arrastrados de F7, sin tocar** (`F8-INFORME` desvío 4): botón «Secciones» flotante que tapa una línea a 390
(se ve en `hoja-390.jpg`), virgulilla en Doto, cifra huérfana a 390, bordes dentados, pie del caso, línea EN del 404,
«En curso», dos tintas.

---

## 3. Lo que está bien (no tocar)

- **La transición de la selección** (pedido de Doug): sin salto en dock, pills ni filtro; 19–22 cuadros intermedios
  por navegación, relevo limpio en el mismo cuadro, sin animaciones vivas al terminar, y nada con RM
  (`pildora-muestreo.json`, videos).
- Cine → OS: foto, vidrio oblicuo, láser y lockup «corte láser» coherentes entre `/` y `/about`.
- Hoja de caso: URL real, `Esc`, foco al cuerpo y de vuelta a la tarjeta.
- Accesibilidad de base: skip link, foco de 2 px en `--foco` en todo el cromo, `h1` únicos y con nombre limpio, 404
  con estado real, `lang` correcto en ES y EN, sin desborde a 390.
- Reduced-motion: 0 animaciones en `/`.
- `prefers-reduced-transparency` ya devuelve el cromo a sólido (`chrome.css:507-516`): el arreglo de P1-1 debe
  respetarlo.

## 4. Brief §6 (estado al cierre)

Héroe con foto + vidrio oblicuo ✓ · vidrio que reacciona al cursor y al scroll con equivalente táctil ✓ · estética
coherente sin neón genérico ✓ · oscuro + blanco, Doto en cifras, display estilizada ✓ (salvo `/cv`, P1-2) · bento con
puertas a trabajo, perfil, experiencia y contacto/CV ✓ · motion definido (`09`) ✓ · ES y EN ✓ · móvil diseñado ✓ ·
imagen del héroe: decidida por Doug (`960e1d8c`) · jerarquía y spacing: 8,4 hoy, ≈ 8,7 con P1.

## 5. Arreglar antes de entregar a Doug (P0 + P1)

1. **P1-1** Vidrio del cromo con tinte propio (≈ 0,74) en cabecera, ES/EN, menú y dock; las losas siguen en 0,5.
   Prueba de contraste por píxel sobre superficies claras (390 caso, 1440 OS).
2. **P1-2** Cuerpo de `/cv` al sistema B: sin mono ni mayúsculas espaciadas, ≥ 13 px, tokens B, retícula de 12
   columnas y enlaces «Ver caso» con blanco táctil ≥ 44 px (≥ 24 en escritorio). Impresión y PDF sin cambios.

Después de arreglar, rehacer en `QA-final/`: `home-os2-{1440,390}`, `caso-completa-390`, `cv-{1440,390}` y
`cv-entera-1440`.

## 6. Arreglos (P1 cerrados)

| Punto | Cambio | Prueba |
| --- | --- | --- |
| **P1-1** vidrio del cromo | Token nuevo `--vidrio-cromo: rgba(14,15,18,.8)` (`globals.css`), con su equivalente sólido en `prefers-reduced-transparency`. Lo usan `.cab-marca .wordmark`, `.cab-pills`, `.idioma`, `.cab-menu` y `.dock` (`chrome.css`); `.cab-menu-panel` ya era sólido (`--losa-alta`). Las losas siguen en `--vidrio-plano` 0,5. Se probó 0,76: el dock a 390 quedaba en 4,54:1, sin margen; 0,8 deja ≥ 5,1:1 y se sigue leyendo como cristal. | `tests/e2e/cromo-contraste.spec.ts`: oculta el texto, toma una captura de cada etiqueta y mide el percentil 90 de luminancia del fondo real. A 390, dock sobre la cubierta clara de `/work/naowee-suid`: «Trabajo» y «Secciones» 5,17:1 y el resto ≥ 5,59:1. A 1440, cabecera sobre cada losa clara del OS (olbo, «En cifras», k15): «douguizard» 11,1:1 y ES/EN 5,77:1. Antes, con 0,5: 3,7:1 y ≈ 2,2:1. |
| **P1-2** cuerpo de `/cv` | `src/components/cv/cv-b.css`, solo bajo `@media screen` y fuera de capas (gana a las utilidades sin `!important` y nunca llega al papel). Lleva Instrument Sans en el cuerpo y Urbanist en nombre, empresas y carta; quita mono y mayúsculas espaciadas; nada baja de 14 px; las `--ink*` de F0 se redefinen a las tintas B (`--tinta`, `--tinta-2`, `--tinta-3`, con equivalentes oscuros en tema claro); los rótulos usan el estilo `.ceja`. Retícula de 12 con subgrid desde 1024: contenido en col 2–8 y lateral en col 9–12, con la columna de 1320 de las páginas B. «Ver caso» mide 44 px en táctil y 32 px con puntero fino. El marcado y las clases que lee la hoja de impresión no cambian. | `tests/e2e/cv-b.spec.ts`: a 1440 y 390 hay 0 textos mono, 0 por debajo de 13 px y 0 en mayúsculas; «Ver caso» mide 32 y 44 px; no hay desborde horizontal; la retícula es de 12 columnas, con experiencia en 2/9 y lateral en 9/13. Con `media: print`, la hoja conserva la mono y su flujo de bloque. `print.spec` sigue en verde: A4 en 3 páginas, Letter en 4 y todas las experiencias en la capa de texto del PDF. |

Capturas rehechas con `npm run build` + `next start`: `QA-final/home-os2-{1440,390}.jpg`,
`caso-completa-390.jpg`, `cv-{1440,390}.jpg` y `cv-entera-1440.jpg`.

---

## 7. Pulido P2

| Punto | Cambio | Prueba |
| --- | --- | --- |
| **P2-1** blanco sobre blanco en el viaje | Durante `data-moviendo`, todas las etiquetas del grupo (dock, pills, filtro) van en `--tinta-2-vidrio` con `mix-blend-mode: difference` (`globals.css`): sobre el vidrio oscuro se ven como siempre y, en el tramo que cubre la píldora blanca, se invierten a oscuro (≈ #3d3d35) con el borde exacto de la píldora, cuadro a cuadro y sin duplicar las opciones en el DOM. El grupo ya aísla la mezcla (`isolation: isolate`). El color deja de fundir (240 ms frente a 340 ms del viaje): el relevo con la opción activa cae en el mismo cuadro. | `tests/e2e/pildora-contraste.spec.ts`: congela las animaciones WAAPI de la píldora en el cruce (40 ms, también las del dock que se vuelve a montar con la ruta) y, por cada etiqueta, compara la captura con texto y sin él; mide el p80 del contraste de los píxeles de texto en el **peor tercio** de la caja. Dock 390 (Perfil → Trabajo) y filtro de `/work`: antes 1,09:1 («Trabajo») y 1,02:1 («Escala»); ahora todas ≥ 4,5:1. |
| **P2-2** el dock no marca nada en un caso | `DockMovil`: en `/work/*` «Trabajo» lleva `aria-current="true"` (sección, no página) y la misma píldora. | `tests/e2e/dock-pulido.spec.ts`: en `/work/naowee-suid` y `/en/work/naowee-suid` a 390 hay una sola opción marcada, es «Trabajo», con `true` y fondo blanco. |
| **P2-3** «Experiencia» de borde a borde | `chrome.css`: `padding-inline: 8px` y mínimo de 62 px por opción; a < 360, 11 px y 52 px para que el dock siga cabiendo a 320. A 390 y 360 el dock mide 352 px. | `dock-pulido.spec.ts` (con barras de scroll superpuestas, como en un teléfono): a 390, 360 y 320, ES y EN, cada etiqueta tiene ≥ 8 px a cada lado y el dock no se sale de la ventana. |
| **P2-4** acumulados en «—» | La losa sin valor dice «aún no» / «not yet» (`::before` con `attr(data-vacio)`, Instrument Sans 14 px, 12 px en móvil, sin partir) en lugar del guion. Sigue sin ceros (P1-8) y la losa a 0,6; el HTML y el lector llevan los totales finales. | `experience.spec.ts`: en p = 0, además de «sin ceros», cada `dd` vacío dice «aún no»; prueba nueva para EN («not yet»). |
| **P2-5** K2 gris a mitad del ancla | `frameEscena` da `k2c`: el contenido de K2 (`.k2-cont`, `.k2-cta`) se funde a 0 entre 0,30 y 0,35 y vuelve entre 0,47 y 0,52; el fondo cruza a blanco mientras no hay texto y el cambio de tinta (0,41) cae con el contenido oculto (`escena.css`, `useScrollScene`). | `escena-f5.test.ts`: `k2c = 1` solo con `m ≤ 0,15` o `m ≥ 0,85` y es 0 alrededor de 0,41. `escena.spec.ts`: de 0,30 a 0,60 cada 0,02, la opacidad es 0, 1 o está en un fundido; donde es 1, «Ver casos» y «Descargar CV» miden ≥ 4,5:1 en píxeles (mismo medidor que P2-1, ahora en `tests/e2e/contraste-pixel.ts`). |
| **P2-6** revelado sin respaldo | `?estatico` en la URL (`src/lib/estatico.ts`) marca `html[data-estatico]`: `RevelarLosas` no esconde nada y `useInView` revela de entrada; el CSS fuerza las losas a la vista. Al imprimir, las losas en espera también se ven. Sin el parámetro no cambia nada para el usuario. | `tests/e2e/estatico.spec.ts`: `/about` y `/work/naowee-suid` a 1440 y 390, sin scroll, 0 losas en espera y todas opacas (con control: sin el parámetro sí hay losas esperando); captura de página entera; en impresión, 0 ocultas. Las capturas `*-entera-*` de esta tanda se hicieron con `?estatico`. |
| **P2-7** arrastrados de F7 | **«Secciones» (F7 P2-4):** en la hoja pasa a la cabecera como círculo con icono y etiqueta accesible (solo < 1024); los tres círculos bajan a 48 px en móvil para que la miga quepa. Ya no flota sobre el texto. **Virgulilla (P2-1):** «~» en Urbanist a 0,6 em en las cifras Doto (`DotMatrix`); `anchoCifras` cuenta 0,36 em (k de «~1.200» ≈ 2,88). **Cifra huérfana (P2-2):** a < 1024 el siguiente caso muestra dos cifras en una línea. **Bordes dentados (P2-3):** `align-items: stretch` en el tablero, contenido arriba, sin `min-height`. **Pie del caso (P2-5):** el colofón ya no es `<footer>` ni lleva ©; la página completa cierra con el pie B del sitio debajo de «Siguiente caso» (sigue habiendo un solo `footer`). **404 (P2-6):** ya estaba a 12 px en `--tinta-3` con `lang="en"`; queda probado. **«En curso» (P2-7):** Naowee toma su periodo («Ene 2026 — Hoy» / «Jan 2026 — Now»). **Dos tintas (P2-8):** los `li` de «Mi parte» en `--tinta-2` como la prosa; solo el `strong` en `--tinta`. | `tests/e2e/f7-arrastrados.spec.ts` (9): botón en la cabecera, nada flotante en el cuerpo de la hoja, miga sin desborde, oculto a 1440; virgulilla en Urbanist a 0,6 em con el texto «~1.200»; un solo `footer` (el pie B) después del siguiente caso y sin © en el colofón; periodo de Naowee en ES y EN; misma tinta en «Mi parte» y «Problema»; a 390, en todos los casos, ≤ 2 cifras en una línea; 404 a 12 px, `--tinta-3`, `lang=en`. Ajustes justificados: `caso.spec` «losa a su medida» pasa a «filas parejas» (alto = el de la fila y ≥ su contenido, como pide F7 P2-3) y abre «Secciones» desde la cabecera; `caso.test` usa el k nuevo. |
