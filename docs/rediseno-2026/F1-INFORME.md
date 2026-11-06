# F1 · Informe del ejecutor (sistema de diseño en código)

> 6 nov 2026 · rama `claude/douguizard-portfolio-redesign-9ivnau` · Node 22.23.4 · Chromium de `/opt/pw-browsers`.
> Fuente: `07-PLAN-IMPLEMENTACION.md` §F1 en su versión del 6 nov (lockup «corte láser» decidido) y las
> «Correcciones del 6 nov». F1 es **aditiva**: las rutas públicas no cambian. La sesión se cortó una vez por límite de uso;
> el trabajo seguía en disco y se subió apenas se reanudó.

## Qué quedó

| Pieza | Archivos | Notas |
|---|---|---|
| Tokens B | `src/app/globals.css` (bloque nuevo **después** del `:root` de la escala fluida) | Color, espacio estructural, `--t-12…--t-120`, radios 48/36·32/28·24/20·16·pill, sombras, `--curva-*` y `--d-*`. `@theme inline` con `bg-losa`, `text-tinta-2`, `font-dot`, etc. `@property --m/--mt/--dw/--desp/--rendija`. Vidrios sólidos con `prefers-reduced-transparency`. **No se redefinió `--ease-out`** ni nada de casos/CV. |
| Fuentes | `src/app/fonts/{urbanist,instrument,doto,lockup}.ts`, `licencias/OFL-*.txt` (Urbanist, Instrument Sans, Doto, Geologica) | `lockup.ts` = Geologica (`latin`, `axes: ["SHRP"]`, `--font-nombre`). Variables de Urbanist/Instrument/Doto en `<html>` desde `RootDocument`. |
| Datos | `src/data/{decisiones,home,hero,perfil}.ts`; `site.ts` + `availability.modo` | `decisiones.nombreLockup = { fuente: "geologica", construccion: "corte" }`. `perfil.ts` recibe el oficio y los pasos de `Craft.tsx` **sin cambiar una palabra** (Craft los lee de ahí) + bio, contexto, logros por hito y portada de `/experience` (04 §6). |
| Microcopy B | `src/i18n/sistema.ts` | nav, idioma, pie, escena, dock (5 destinos + «Secciones»), hoja, carrusel. Ver desvío 2. |
| Muelle | `src/lib/spring.ts` + `stepCritical` | Forma cerrada, ζ = 1; `stepSpring` intacto. |
| Corte | `src/lib/corte.ts` | `corteDesdeMetricas`, `desplazamientos`, `aperturaDesdeProgreso`, `fijarCorte`, `bezier`, `topSobreLaser`, `CONSULTA_CORTE`, `ENTRADA`. |
| Marca | `src/components/marca/{NameLockup,NameLockupCorte,Wordmark}.tsx`, `marca.css` | Ver abajo. |
| Primitivas | `src/components/sistema/{Losa,BentoCard,DotMatrix,Estado,Boton,Flecha,Etiqueta,Iconos}.tsx`, `sistema.css` | `BentoCard` = capa `<a>` del tamaño de la losa con `aria-labelledby` del título. `DotMatrix` con `span.punto` para el punto de miles. |
| Lab | `src/app/(es)/lab/{page.tsx,LabCorte.tsx,lab.css}` | `notFound()` salvo `DG_LAB=1` en el build; `noindex`; fuera del sitemap. |
| Capturas | `docs/rediseno-2026/F1-capturas/lab-{390,1024,1440}[-pliegue].jpg` | DPR 1, JPG 82, tras recarga (Doto es `display: optional`). |

### `NameLockup` «corte láser»

- HTML: raíz `[data-lockup]` (`div` u `h1/h2/p` con `as`) → `span.sr-only` «Doug Vargas» (de `site.name`) + `.linea.l1` y
  `.linea.l2` `aria-hidden`; con `corte` (solo `xl`), `.l2` lleva `.m.sup`, `.m.inf` (copia) y `.hilo`.
- **Estado de partida cerrado** en el HTML (`data-corte="cerrado"`, `--desp: 0`, sin `clip-path`, copia e hilo ocultos):
  sin JS, con movimiento reducido, a < 1024 px y en `losa`/`movil` el nombre es una palabra entera. El CSS lo vuelve a
  forzar con `@media (max-width: 1023px), (prefers-reduced-motion: reduce)` por si un resize deja el atributo.
- Isla `NameLockupCorte` (solo con `CONSULTA_CORTE`): `fonts.load` → mide `--corte` con `measureText` → coloca el
  nombre sobre el láser si recibe `laser` (dos pases: cálculo y corrección con `getBoundingClientRect`) → entrada
  **una sola vez** a los 880 ms, 520 ms con `--curva-salida` vía `requestAnimationFrame` (al terminar no queda
  ninguna animación viva) → `fijarCorte(el, t)` queda para el dueño del scroll (F2 `/about`, F5 acto 1) con
  `t = aperturaDesdeProgreso(p)`. Recalcula con `ResizeObserver` y `fonts.ready`.
- Con `laser`, el nombre espera con `visibility: hidden` hasta quedar colocado, solo bajo
  `(scripting: enabled) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)`: así el lab da CLS 0 y
  sin JS se ve desde el primer cuadro.
- `xl` = `--t-120` (×0,8 con alto ≤ 800 px); el acto 1 del home lo sube a 128 px con `--lockup-xl` desde fuera.

## Pruebas

| Paso | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run lint` | verde (0 avisos) |
| `npm test` (vitest) | **17 archivos, 197/197** (base 149 + 48 nuevas: `decisiones`, `home`, `hero`, `copy.sinMarcadores`, `sistema.parity`, `spring.critical`, `corte`). `theme.tokens`, `data.singleSource` e `i18n.parity` sin tocar y verdes. |
| `npm run build` (sin `DG_LAB`) | verde; mismo y único aviso de F0 (`Cache-Control` en `/_next/static`); `/lab` → **404** |
| `npx playwright test` (build normal) | **270/270** = 269 de base + `lockup.spec` «sin DG_LAB, /lab da 404 y no está en el sitemap». Dos corridas: 13,5 min y, sobre el código final (tras el arreglo de peso), 13,2 min; sin fallos ni reintentos. |
| `DG_LAB=1 npm run build` + `DG_LAB=1 npx playwright test lockup` | **11/11**, dos corridas seguidas |

`lockup.spec.ts` define un bloque u otro según el build (no usa `test.skip`, así que no hay pruebas saltadas en ninguno
de los dos informes). Con `DG_LAB=1` cubre todos los criterios de `NameLockup` de 07:

- Fuente: `fonts.check('600 16px "Geologica"')`, `font-variation-settings` con `"SHRP" 100`, **un solo woff2 de
  Geologica, 29,2 KB** (≤ 50), CLS del lab **0**.
- Medida a 1440×900 y 1280×720: `--corte` = base − 0,52 × altura de x de `measureText` (±1 px); tras un resize
  1440 → 1280×720 se recalcula en proporción al `font-size` (120 → 96 px) ±1 px. Medido: 64,3 px a 120 px, 51,7 a 96.
- Abierto: rendija 3 ± 0,5 px, `translate` −0,10 em / +0,06 em (±0,5 px), y `getAnimations({subtree})` vacío tras 1,5 s.
- Cerrado (rango a 0): `data-corte="cerrado"`, sin `clip-path`, copia e hilo ocultos, y la línea «Vargas» difiere
  **≤ 0,5 %** de píxeles de la misma palabra sin construcción.
- Movimiento reducido: cerrado desde el primer cuadro, sin isla, `--desp` 0, ninguna animación. 390×844: sin isla,
  sin copia ni hilo, sin desborde. Sin JS: cerrado, copia e hilo ocultos, sin `clip-path`.
- Accesibilidad: «Doug Vargas» una sola vez en el árbol de `main`; axe (wcag2a/aa, 21a/aa, 22aa) sin violaciones.
- Contraste de las 28+ muestras con `data-contraste-min` (fondo efectivo compuesto capa a capa) y párrafos > 40
  caracteres ≥ 7:1, a 390 y 1440. Doto ≥ 20 px en todo `[data-dot]` a 390 y 1440 (el mínimo del sistema es 24).

**Reversión (prueba local, sin commit):** `lockup.ts` → Big Shoulders Stencil (`axes: ["opsz"]`, opsz 72) y
`decisiones.nombreLockup = { fuente: "big-shoulders", construccion: "banda" }`: build verde, el lab pinta la banda en
una línea, las cajas se leen del DOM (xl 452×108, losa 113×28, móvil 249×59 a 1440) y no hay errores de consola.
Revertido con `git checkout`.

## Peso y rendimiento (`/`, `perf.spec`, mediana de 3 en frío, servidor solo)

Comparado contra la **base pre-F1** (commit `2b3a6ea`, worktree aparte) medida en la misma sesión y con el mismo
método, y contra `baseline-F0.json` («después del upgrade»):

| | JS inicial gz / transferido | LCP móvil (corridas) | LCP escritorio | CLS móvil / escritorio |
|---|---|---|---|---|
| `baseline-F0.json` (después) | 158,4 / — KB | 4.584 ms | 1.576 ms | 0 / 0 |
| Base pre-F1 (hoy) | 158,4 / 170,3 KB | 4.524 (4.524 · 4.540 · 4.424) | 1.524 | 0,0058 / 0 |
| **F1** | **158,4 / 170,3 KB** | **4.512** (4.424 · 4.512 · 4.540) | **1.524** | 0,0058 / 0 |

JS idéntico byte a byte en tamaño; LCP dentro del ruido (el elemento LCP sigue siendo el mismo `<p>`). Las páginas
actuales no piden ninguna fuente nueva (solo las dos precargas de siempre, Archivo y Geist Mono) y su CSS no lleva
el de `sistema.css`/`marca.css`, que viaja solo con las rutas que importan esos componentes.

## Capturas de las rutas públicas (F0 = F1)

`npm run shots:rediseno` (72 capturas por juego: `/`, `/work/olbo`, `/cv`, ES+EN, 390/1024/1440, con y sin RM, DPR 1)
sobre la base pre-F1 (`:3132`) y sobre F1 (`:3131`), con el mismo diff de píxeles de F0 (% distinto con umbral 0 /
con umbral > 8/255):

- **Movimiento reducido (36): las 36 idénticas píxel a píxel** (0,00 / 0,00). Es la comparación que F0 dejó como puerta.
- **Con animación (36):** 20 idénticas; 16 difieren, máximo **0,90 %** sobre el umbral (`/en/cv` a 390), el resto
  ≤ 0,34 %. En F0 el ruido «antes vs antes» llegó a 1,04 % con la misma forma (estado de las animaciones en curso).
  Mayores sobre umbral 0: el home a 1024/1440 (6–16 % / ≤ 0,01 %), que es el ruido conocido del héroe animado.

Resultado: **sin cambio visual en las rutas públicas.** Las capturas quedan en `tests/shots/rediseno/F1/{base,f1}/`
(ignorado por git).

## Desvíos del plan y por qué

1. **`preload: false` en Urbanist, Instrument Sans y Doto** (07 §1.7 pide preload en las dos primeras). Se cargan en
   `RootDocument`, así que con preload las pedirían todas las páginas actuales sin pintarlas (riesgo de LCP en móvil).
   F3 las pasa a `preload: true` cuando el home las use. Geologica sí va con preload: solo la importan `NameLockup` y
   `Wordmark`, así que se precarga solo donde se pinta (hoy, `/lab`).
2. **La microcopy B no entra aún en `dictionaries.ts`** (07 §1.5): el diccionario viaja entero al navegador y sumaba
   0,4 KB gz al JS de `/` sin que nadie lo usara. Vive en `src/i18n/sistema.ts` con su prueba de paridad y de no
   choque; F3 la fusiona (`{ ...en, ...sistemaEn }`) cuando cabecera y dock la consuman. Las claves de página
   (`home.*`, `trabajo.*`, `perfil.*`, `trayectoria.*`) tampoco se adelantaron: las crean F2/F3 junto a sus páginas;
   el copy de `/about` y `/experience` que 07 pone en `perfil.ts` sí está.
3. **`rolCorto` es `rolCorto()` en `src/lib/career.ts`, no un campo de `site.ts`.** `SiteHeader` (cliente) importa
   `site.ts`; derivar el cargo de `cv.ts` allí arrastraba `cv.ts` al navegador (**+5,1 KB gz medidos**). Devuelve
   «Head of Product · Barranquilla» y la prueba lo vigila.
4. **Contraste:** `--tinta-osc-2` pasa de `#55555F` (6,6:1 sobre claro) a **`#48484F`** (8,1:1 sobre claro, 7,1:1 sobre
   niebla) para que los párrafos largos cumplan `a11y 3.1` (07 §0 lo dejaba a elección). Sobre las losas jelly el
   blanco da 4,9:1 en el peor punto del azul (`--jelly-azul-peor #3F6BD9`, el color sólido que leen las pruebas): **ahí
   no caben párrafos de más de 40 caracteres**; `.losa--azul .apoyo` va en blanco y el lab usa apoyos cortos. La
   etiqueta azul `#E3EAFF` da 4,05:1 sobre ese punto (NOTAS no da cifra tras su corrección): se exige ≥ 4 y queda anotado.
5. **`.hilo` también en escritorio**, solo con el corte abierto (detrás de la rendija). 07 lo incluye en la
   construcción; `about.html` lo oculta. En el lab, sin foto, es la única luz del corte; en el home y `/about` lo puede
   ocultar el dueño si estorba con el láser de la foto.
6. **Colocación sobre el láser como prop `laser` (selector)** y espera con `visibility` hasta colocarse (CLS 0). 07 no
   decía cómo recibe la isla la y del láser; con `laser` + `topSobreLaser` F2/F5 solo pasan el selector.
7. `hero.ts`: parámetros del vidrio **provisionales** (F4 los ajusta al portar el shader); rutas con id y versión en el
   nombre, sin anchos mayores que el máster de 880 px. Chub no tiene logro en 04 §6.2: `perfil.logros` lo omite.
8. `copy.sinMarcadores` ignora comentarios: los `⚠️ CONFIRMAR DOUG` de `cv.ts`/`work.ts`/`testimonials.ts` son notas
   en comentarios, no texto visible.

## Pendientes

- F2/F3: fusionar `i18n/sistema.ts` en el diccionario; `preload: true` en Urbanist/Instrument; crear `lib/cuentas.ts`
  y `lib/trayectoria.ts` y su prueba de logros por hito; claves de página.
- F2 (`/about`) y F5 (acto 1): usar `NameLockup escala="xl" corte laser="…"` y escribir `fijarCorte(el,
  aperturaDesdeProgreso(p))` desde su scroll; sumar `/about` y el home a `lockup.spec.ts`.
- QA visual del lab contra `propuestas/B/shot_B_1440_os.jpg` por superficie (sesión de QA).
- Doto es `display: optional`: en la primera visita en frío las cifras pueden salir con la de respaldo (es lo que
  pide 07 §1.7; las capturas se tomaron tras una recarga).
- `docs/rediseno-2026/baseline-F0.json` no se tocó; las mediciones de F1 están en este informe.

## Arreglos tras la crítica (`06-CRITICA-F1.md`)

Un commit por punto, en orden. Todas las pruebas nuevas viven en `tests/e2e/lockup.spec.ts`, en el bloque `DG_LAB=1`
(el build normal sigue con su única prueba de 404, así que el total de Playwright no cambia).

| Punto | Cambio | Prueba |
|---|---|---|
| **P0-1** Doto no pintaba | `--font-display-b`, `--font-texto` y `--font-dot` salen de `@theme inline` y pasan al `:root` de tokens B (`globals.css`). Ninguna clase Tailwind usaba `font-dot`/`font-texto`/`font-display-b`, así que no hace falta `@theme static`. | «toda var() de sistema, marca y lab resuelve en :root»: lee las tres hojas, saca cada `var(--x)` (menos las locales `--corte`, `--lockup-*`, `--font-nombre`, `--fin-nombre`) y exige un valor no vacío en `<html>`. «Doto pinta las cifras» a 390 y 1440 en segunda visita: los ≥ 7 `[data-dot]` tienen familia que empieza por `Doto` y `fonts.check('700 48px Doto')` da `true`. |
| **P1-1** nombre invisible sin isla | Dentro del mismo `@media (scripting: enabled)…`, `.lockup[data-espera-laser]:not([data-colocado])` lleva `animation: lockup-mostrar 0s 1200ms forwards` (`to { visibility: visible }`). Al colocarse, la regla deja de aplicar: «ninguna animación viva tras 1,5 s» sigue verde. | «si los chunks JS no llegan, el nombre XL se ve entero a los 1,5 s»: `route(/_next/static/chunks/*.js, abort)`, 1440×900; XL y sus dos líneas `visible`, `data-corte="cerrado"`, sin isla ni `clip-path`. Falla sobre el build anterior (`hidden`). |
| **P1-2** el corte no se leía | `.hilo` queda en 1 px de `--laser-nucleo` **sin** `box-shadow`. En el lab, el filo de 1 px de la escena pasa detrás del nombre (va antes en el DOM) y el halo rojo pasa a un `::before` con `mask-image` que se apaga hasta `--fin-nombre` + 24 px (borde derecho del lockup; lo escribe `LabCorte` con el `ResizeObserver` que ya tenía). Comparado con `tipo_4_1440.jpg` a 1440×900 y 1280×720 (DPR 2): se leen dos mitades desplazadas y una rendija oscura con un filo claro; el rojo vive a la derecha, lejos de las letras. | «filo legible»: `.hilo` con `box-shadow: none` y, en una franja de 24 px centrada en el corte a lo ancho de «Vargas», ≤ 1 % de píxeles rojos saturados. |
| **P1-3** el corte no seguía al láser | `NameLockupCorte` observa con el mismo `ResizeObserver` el lockup, el láser y `lockup.offsetParent`, y escucha `resize`; todo pasa por un solo `requestAnimationFrame`. La escena del lab pasa a `min-height: max(340px, 40svh)`. **P2-4** (trivial, en la misma rama del código): al salir de `CONSULTA_CORTE` también se quita `lockup.style.top`. | «resize vertical 1440×900 → 1440×1100»: el `font-size` no cambia, el láser se mueve > 10 px y \|y láser − y corte\| ≤ 1 px antes y después. |

Los demás P2 no se tocaron (van con F2/F3, según la crítica). Tampoco se tocó §3 «Lo que está bien»: los dos pases de
colocación, el cierre exacto, la ruta sin JS, móvil y movimiento reducido, y la accesibilidad siguen igual y en verde.

**Capturas** `F1-capturas/lab-{390,1024,1440}[-pliegue].jpg` rehechas igual que antes (DPR 1, JPG 82), en **segunda
visita**: en las tres medidas, `[data-dot]` da `Doto, "Doto Fallback", …` y `fonts.check` da `true`. El «647» y la
sección Doto ya salen en matriz de puntos.
