# 06 · Crítica F1 «Sistema de diseño en código» (QA visual del `/lab`)

> Crítico / QA visual · 6 nov 2026 · objeto: `/lab` (build con `DG_LAB=1`, `next start -p 3131`), `F1-INFORME.md`,
> `F1-capturas/lab-*.jpg`, `src/components/{marca,sistema}/`, `src/app/(es)/lab/`, tokens de `globals.css`.
> Referencias: `propuestas/B/shot_B_1440_os.jpg` y `propuestas/B-tipo/tipo_4_1440.jpg` (opción 4 «corte láser»).
> Método: refactoring-ui (escalas, jerarquía, radios concéntricos, profundidad) y web-design-guidelines (foco,
> contraste, movimiento reducido, fallos sin JS). Chromium de `/opt/pw-browsers`, Playwright `--trace off`,
> 390×844, 1024×768/900 y 1440×900. Estilos calculados leídos con CDP (`CSS.getMatchedStylesForNode`); contraste
> calculado con la fórmula WCAG sobre los tokens. Scripts de medición en el scratchpad de la sesión (no se suben).
> **No se tocó código.**

---

## 1. Veredicto

**No se cierra F1 todavía: 1 P0 y 3 P1.** El oficio es alto y casi todo está donde debe: tokens completos y en su
sitio (`theme.tokens` intacto), radios concéntricos, losas y jelly fieles a la landing B, foco visible, movimiento
reducido y «sin JS» bien resueltos, y el `NameLockup` coloca el corte **exactamente** sobre el láser (Δ = 0,001 px
a 1440 y 0,014 px a 1024). Pero **Doto no se pinta en ninguna parte**: el token `--font-dot` no llega al CSS
compilado y todas las cifras del lab caen en Instrument Sans negrita. Las capturas de F1 lo muestran
(«2026 18 2.000+ 12» y «647» sin puntos) y las pruebas no lo detectan porque miden el tamaño, no la familia. Tampoco
se lee el corte del nombre al mirarlo: se ve una raya roja sobre «Vargas», no un corte.

| Eje | Nota | Una línea |
|---|---|---|
| Tokens y escalas | 8,5 | Color, espacio, tipo 12…120, radios 48/36·32/28·24/20·16 y curvas como §1.6. Falla un alias (P0-1). |
| Fidelidad de superficies | 8,5 | Losa, clara, niebla y jelly azul/magenta con bloom del color de la losa, como en `shot_B_1440_os`. El vidrio no se puede juzgar sin foto detrás (P2-6). |
| Tipografía | 6,0 | Urbanist e Instrument Sans están bien, y la medida del apoyo es 34 em, 16/24. **Doto ausente** (P0-1), y Doto a 24 px queda débil (P2-1). |
| `NameLockup` | 7,0 | Corte alineado, cierre exacto, entero a < 1024, nombre accesible una vez. Pero el corte no se lee (P1-2), se oculta para siempre si falla el JS (P1-1) y no se reubica si el láser se mueve (P1-3). |
| Contraste | 8,5 | `--tinta-osc-2 #48484F` da 8,11 sobre clara y 7,08 sobre niebla (el #55555F daba 6,59). Hay dos bordes por vigilar (P2-2, P2-3). |
| Foco / RM / sin JS | 8,0 | El anillo de 2 px `--foco` con offset 3 es visible en cards y botones. RM: cerrado, sin isla y sin animaciones. Sin JS: el nombre se ve cerrado. |
| Móvil 390 | 8,0 | Sin desborde (`scrollWidth` = ancho útil), losas a una columna, lockup entero. El catálogo de tipos se corta desde 48 px (está recortado a propósito, ver P2-5). |

---

## 2. Hallazgos

**P0** bloquea el cierre de F1. **P1** se arregla antes de F2. **P2** es pulido y puede ir con F2/F3.
Formato: evidencia → dónde → arreglo concreto.

### P0 · bloquea

**P0-1 · Doto no se aplica: `--font-dot` se poda del CSS y todas las cifras salen en Instrument Sans.**
- Evidencia: en `/lab`, `getComputedStyle(.dot).getPropertyValue('--font-dot')` da `""` y el `font-family`
  calculado de los 7 `[data-dot]` es `"Instrument Sans", …` a 390, 1024 y 1440. `--font-doto` sí existe en `<html>`
  (`"Doto", "Doto Fallback"`). En los CSS de `.next/static/chunks/*.css` aparecen `--font-display-b` y
  `--font-texto`, pero **no** `--font-dot`. Capturas: `F1-capturas/lab-1440.jpg`, sección «Doto» y losa «647»: las
  cifras son sans negrita, no matriz de puntos. Las dos cards de la referencia que viven de Doto («400+», «2.000+»,
  «08:03», «130+» en `shot_B_1440_os.jpg`) saldrían igual.
- Causa: `src/app/globals.css:187` declara `--font-dot` dentro de `@theme inline { … }` (bloque de la línea 168).
  Tailwind v4 solo emite una variable de `@theme` si algo que Tailwind procesa la usa. `sistema.css` y `marca.css` se
  importan desde los componentes y no pasan por Tailwind, así que `var(--font-dot)` (`sistema.css:47`) queda sin
  definir. `--font-display-b` y `--font-texto` sobreviven por suerte, porque alguna regla procesada los usa.
- Por qué no lo vieron las pruebas: `lockup.spec` mide `font-size ≥ 20` en `[data-dot]` y el contraste del «647».
  Las dos cosas pasan con la fuente de respaldo.
- Arreglo:
  1. Mover `--font-display-b`, `--font-texto` y `--font-dot` al bloque `:root {` de tokens B (`globals.css:190`).
     Es un `:root` nuevo, posterior al de la línea 86, así que no rompe `theme.tokens`. Si además hace falta la
     utilidad `font-dot` de Tailwind, declararla en `@theme static` (que siempre emite la variable) en lugar de
     `@theme inline`.
  2. Revisar con el mismo criterio el resto del bloque `@theme inline` de la línea 168. Ya se comprobó que las 64
     variables que usan `sistema.css`, `marca.css` y `lab.css` existen en tiempo de ejecución, salvo `--font-dot` y
     las locales del lockup (`--corte`, `--lockup-*`, `--font-nombre`), que son correctas. Hay que repetir esa
     prueba para lo que añadan F2–F7.
  3. Añadir a `lockup.spec` (con `DG_LAB=1`): todo `[data-dot]` tiene `font-family` que empieza por `Doto`, y en
     una segunda carga `document.fonts.check('700 48px Doto')` da `true`. Añadir también una prueba general: cada
     `var(--x)` de `sistema.css` y `marca.css` resuelve a un valor no vacío en `:root`.
- Verificado: inyectando `:root{--font-dot: var(--font-doto), monospace}`, en la segunda carga Doto pinta con
  `"ROND" 100, "wght" 700`, como la maqueta.

### P1 · antes de F2

**P1-1 · Si el JS falla, el nombre XL queda invisible para siempre.**
- Evidencia: si se bloquean los chunks JS (`route(/_next\/static\/chunks\/.*\.js/, abort)`), `[data-escala=xl]`
  queda en `visibility: hidden` a 1440×900 pasados 2,5 s. Sin JS de verdad sí se ve, porque `scripting: none`.
  Origen: `marca.css:83-87`. La regla `(scripting: enabled) … .lockup[data-espera-laser]:not([data-colocado])`
  esconde el nombre hasta que la isla (`NameLockupCorte.tsx:67`, `:108`) pone `data-colocado`. Si el chunk falla,
  hay un error de hidratación o `fonts.load` no resuelve nunca, eso no pasa. En F5 es el nombre del héroe: el
  elemento más importante de la página desaparecería.
- Arreglo: añadir una salida de emergencia en CSS dentro del mismo `@media`:
  `animation: lockup-mostrar 0s 1200ms forwards` con `@keyframes lockup-mostrar { to { visibility: visible } }`. Así
  se ve entero y cerrado aunque la isla no llegue. Agregar a `lockup.spec` el caso «chunks bloqueados → visible a
  los 1,5 s».

**P1-2 · El corte no se lee: el halo del láser tapa la rendija y el desplazamiento parece un borrón.**
- Evidencia: recorte a DPR 2 de la línea «Vargas» a 1440 (abierto, `--desp: -0.1em`, `--rendija: 1.5px`). Las mitades
  sí se desplazan (−12 px arriba, +7,2 px abajo), pero el láser del lab (`lab.css:128-139`: núcleo de 1 px más
  `0 0 4px 1px` y `0 0 16px 3px` de halo, a todo el ancho) cae justo sobre los 3 px de rendija y la pinta de rojo. Además,
  el `.hilo` (`marca.css:67-79`) repite el mismo halo detrás. Lo que se ve es una raya roja con brillo cruzando una
  palabra entera (`F1-capturas/lab-1440-pliegue.jpg`). En `tipo_4_1440.jpg`, en cambio, el filo es una línea
  **blanca** de 1 px, el resplandor rojo vive en la foto (lejos de las letras) y la rendija negra se lee como
  cuchillo.
- Arreglo:
  1. `.hilo` pasa a `--laser-nucleo` sin halo, o con un halo ≤ 2 px. La luz roja la pone la escena, no el lockup.
  2. En el lab, el láser de la escena se dibuja con el halo enmascarado sobre la caja del nombre (`mask-image` lineal
     que se apaga entre `left` y `right` del lockup) o se pinta **detrás** del lockup (`z-index` menor que el nombre
     y la rendija con el color del fondo). Así se comporta como en el home, donde el láser es la foto.
  3. Repetir la captura junto a `tipo_4_1440.jpg` a 1440 y 1280×720. Criterio: a 1 m de distancia se distinguen
     dos mitades, no una raya.

**P1-3 · El corte solo se recoloca cuando cambia la caja del lockup, no cuando se mueve el láser.**
- Evidencia: `NameLockupCorte.tsx:118-119` observa únicamente `lockup`. `colocar()` (`:54-68`) lee la `y` del láser
  una sola vez por medición. En el lab no se nota porque el láser está al 62 % de una escena de alto fijo. En F5,
  en cambio, la `y` del láser sale de la foto (`hero.ts` → `laser.y`) y cambia con el alto del viewport y el recorte
  `object-position` sin que el nombre cambie de tamaño (entre 801 y 1200 px de alto, `--t-120` no varía). Al
  redimensionar en vertical el corte se despegaría del láser.
- Arreglo: observar también `linea` y `lockup.offsetParent` con el mismo `ResizeObserver`, y escuchar `resize`
  (con rAF) mientras la isla está activa. Agregar a `lockup.spec` un caso 1440×900 → 1440×1100 (cambia el alto de
  la escena) con |Δ| ≤ 1 px. Para eso el lab necesita una escena de alto relativo, por ejemplo `min-height: 40svh`.

### P2 · pulido (puede ir con F2/F3)

**P2-1 · Doto a 24 px se queda sin cuerpo.** Con Doto ya cargado, «2026» (`dot--s`, 24 px) tiene puntos de ≈ 2 px y
se lee como textura (ver la captura de la sección Doto tras el arreglo de P0). La landing B no usa Doto por debajo
de 36 px. → `dot--s` a `--t-30` como mínimo real del sistema. Si hace falta una fecha de 24 px, que vaya en
Instrument Sans con `tabular-nums`. D20 (≥ 20) se cumple, pero el mínimo útil es más alto.

**P2-2 · El anillo de foco no llega a 3:1 sobre niebla.** `--foco #5B7CFF` da 5,15 sobre losa y 3,25 sobre clara,
pero **2,84 sobre niebla** (y 1,34 sobre el peor azul jelly). Hoy el anillo de las cards cae por fuera, sobre el
vacío, así que no falla en el lab. Sí fallaría en cualquier control que viva **dentro** de una losa niebla o jelly
(como el botón de K-contacto). → en `.losa--clara` y `.losa--niebla` usar `--foco: var(--electrico)`
(#2B56F3: 5,04 sobre clara, 4,40 sobre niebla). En jelly, anillo blanco (`--foco: var(--blanco)`).

**P2-3 · `--tinta-2` sobre `--losa-alta` da 6,72:1.** Cumple AA, pero queda por debajo del 7:1 que §0 exige a los
párrafos de más de 40 caracteres. Hoy ningún párrafo cae ahí (las superficies del lab son losa, 7,32). Conviene
dejarlo escrito: sobre `losa-alta` y `chip--losa`, solo texto corto, o `--tinta-2-vidrio`.

**P2-4 · Al pasar de ≥ 1024 a < 1024, la isla deja el `top` en línea.** `NameLockupCorte.tsx:89-97` quita
`--corte` y cierra el corte, pero no borra `lockup.style.top` (puesto en `:62`). Medido a 1024×768: `top: 73.19px`.
En F5 el nombre móvil quedaría desplazado hasta recargar. → `lockup.style.removeProperty("top")` y
`delete lockup.dataset.colocado` en esa rama.

**P2-5 · La escala 48…120 no tiene versión móvil en los tokens.** A 390, el catálogo de tipos recorta «Dirijo el
producto» desde 48 px (`lab.css:107-113`, `overflow: hidden`). En el lab es aceptable, pero muestra que `--t-*` es
fija. → En F2/F3, definir los titulares por **rol** (`.t-titular`, `.t-losa`…) con su tamaño móvil en la misma
escala (titular 36/48 a 390), y no usar `--t-72+` sin consulta.

**P2-6 · El lab no permite juzgar el vidrio ni la cabecera B.** La losa «vidrio» está sobre el vacío, así que se ve
igual que «losa»: sin foto detrás, `backdrop-filter` no tiene qué difuminar. La cabecera que se ve es la actual
(Archivo, banda gris, conmutador de tema), no la de B. → Añadir al lab una escena con `retratos-hf/199598aa` de
fondo y el vidrio y el wordmark encima. La cabecera B se juzga en F3.

**P2-7 · Copiar el nombre duplica el texto.** Con el corte abierto, seleccionar y copiar el XL da
«Doug VargasDougVargasVargas» (`sr-only` + `.l1` + `.m.sup` + `.m.inf`). → `user-select: none` en `.m.inf` y en
las `.linea` cuando el nombre no es `decorativo`, y dejar seleccionable solo el `sr-only` (o al revés: `.linea`
seleccionable y `sr-only` con `user-select: none`).

**P2-8 · Doto `display: optional` sin precarga.** La primera visita en frío cae en `ui-monospace` negrita, una forma
muy distinta a la matriz de puntos. Lo pide 07 §1.7 y el informe lo anota, pero en K3 (Andes) las cifras son el
contenido. → En F3, `preload: true` solo en la ruta del home, o un `size-adjust`/`ascent-override` en el respaldo
para que el cambio no mueva la card.

---

## 3. Lo que está bien (no tocar)

- Corte alineado con el láser al subpíxel en dos pases (`NameLockupCorte.tsx:62-66`). Cierre exacto con el rango a 0:
  `data-corte="cerrado"`, `clip-path: none`, `--desp: 0em`.
- A < 1024, con RM y sin JS, el nombre está entero y no hay isla ni animaciones. El `@media` de `marca.css:91-100`
  lo vuelve a forzar.
- Nombre accesible: `sr-only` una vez y líneas `aria-hidden`; `decorativo` oculta todo.
- Radios concéntricos (`lab-concentrico`: 48 − 16), wordmark 36 px dentro de una pill de 44 px con 4 px de inset,
  flecha de 56 px dentro de una losa de 48 px. Los bloom tienen el color de su losa (azul y magenta), nunca gris.
- `--tinta-osc-2 #48484F`: el cambio está justificado y medido (8,11 sobre clara, 7,08 sobre niebla).
- Peso: el CSS de `sistema`/`marca` viaja solo con quien lo importa; el JS de `/` no cambia (158,4 KB gz).

---

## Arreglar antes de F2 (P0 + P1)

1. **P0-1** Sacar `--font-dot` (y `--font-display-b` y `--font-texto`) de `@theme inline` al `:root` de tokens B.
   Agregar pruebas: familia `Doto` en `[data-dot]` y «toda `var()` de sistema/marca resuelve».
2. **P1-1** Mostrar el nombre en CSS a los 1,2 s si la isla no llega. Agregar la prueba con chunks bloqueados.
3. **P1-2** Filo blanco sin halo en `.hilo` y láser del lab sin halo sobre la caja del nombre. Comparar contra
   `tipo_4_1440.jpg` hasta que el corte se lea.
4. **P1-3** Observar también el láser y su contenedor. Agregar la prueba de resize vertical (|Δ| ≤ 1 px).

Tras los arreglos: rehacer `F1-capturas/lab-*.jpg` (con Doto cargado, segunda visita) y correr
`DG_LAB=1 … playwright test lockup`.
