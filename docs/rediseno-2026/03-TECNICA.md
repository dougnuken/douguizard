# 03 · Técnica: auditoría, stack de motion, prototipos del héroe y plan

> Frontend / design engineer · 4 nov 2026. Lee primero `00-BRIEF.md`. Prototipos en `prototipos/` (abrir con
> `npx http-server docs/rediseno-2026 -p 8080` → `http://localhost:8080/prototipos/…`; con doble clic caen solos al
> respaldo CSS, ver §3.4). Medidas tomadas con Playwright 1.63 + Chromium 153 en este contenedor.

## 0. Decisiones en una tabla

| Tema | Decisión | Por qué, en una línea |
|---|---|---|
| Card → página | **React `<ViewTransition>`** de Next 16.4 / React 19.3 (0 KB) | Morph de elemento compartido nativo del navegador, sin montar/desmontar a mano. Sin soporte: navegación instantánea. |
| Coreografía de scroll | **GSAP 3.15 + ScrollTrigger** (45 KB gz), solo en `/` y `/experience`, cargado después del LCP | Pin y scrub del timeline y del paso héroe → bento. Es la herramienta probada para eso, y ahora es gratis. |
| Microinteracción, estados, entradas | **CSS** (transiciones, `@starting-style`, scroll-driven como mejora) | 0 KB. Se puede interrumpir y la CSP no cambia. |
| Movimiento físico (cursor, revelado) | **Muelles propios** (`src/lib/spring.ts`, ampliado a 2D) | Ya existen y tienen tests. Motion añadiría 31–51 KB solo por esto. |
| Vidrio estriado + revelado | **WebGL2 crudo**, dos pasadas, ~5 KB de código | Una sola pasada compone vidrio y tres capas. three, R3F u OGL no aportan nada a un triángulo a pantalla completa. |
| Sin WebGL / GPU por software | **Imagen estática pre-renderizada** del mismo shader + revelado con `mask-image` | Es el LCP y el respaldo a la vez. El prototipo de cada respaldo está medido. |
| Smooth scroll | **No** (ni Lenis ni nada parecido) | ScrollTrigger funciona con el scroll nativo. Secuestrar el scroll empeora la a11y y el trackpad. |
| Imagen del héroe | La foto final llega después. **Cualquier foto 3:4 entra cambiando solo datos normalizados** (§4.6) | Hoy se usa una provisional (`199598aa.jpg`, 880×1168). |

---

## 1. Auditoría técnica del repo

### 1.1 Qué hay de verdad (package.json vs README)

El **README está desactualizado**. Dice «Framer Motion · React Three Fiber · Lenis» y lista `Loader`, `CustomCursor`,
`SmoothScroll`, `three/Scene3D`, `Starfield`… **Nada de eso existe** en `src/` ni en `package.json`.

| | Declarado (`package.json`) | Instalado (`package-lock.json`) |
|---|---|---|
| Dependencias | `next ^16.2.0` · `react ^19.0.0` · `react-dom ^19.0.0` · `tailwind-merge ^3.5.0` | next **16.3.5** · react **19.2.6** |
| Dev | tailwind 4 (+ `@tailwindcss/postcss`), vitest 4, `@playwright/test` 1.63, `@axe-core/playwright`, tsx, eslint 9 + `eslint-config-next`, TS 5.7 | tailwind 4.2.4 · vitest 4.1.11 |

Cómo se mueve hoy el sitio: **CSS a mano** (keyframes de las viñetas, `--ease-out`, `--dur-*`), **muelles en rAF** propios
(`src/lib/spring.ts`, ζ ≈ 0,61, con subpaso fijo de 1/240 s, usados por el rail) y **WebGL crudo** (`hero/Velaris.tsx`:
ruido simplex en un fragment shader, con DPR limitado a 1,75, `IntersectionObserver`, `visibilitychange` y reduced-motion
bien resueltos). Ese patrón de Velaris es la base que se reutiliza (§5).

### 1.2 Rutas e i18n

- **Dos root layouts**: `src/app/(es)/layout.tsx` y `src/app/(en)/layout.tsx`. Los dos renderizan `RootDocument` con su
  `<html lang>`. Español en la raíz (`/`, `/work/[slug]`, `/cv`) e inglés en `/en/…`. `experimental.globalNotFound`
  para el 404 que no cae en ningún árbol.
- Consecuencia para las transiciones: **es ↔ en es una navegación dura** (cambia el root layout) y **card → caso
  dentro de un idioma es blanda**. `<ViewTransition>` solo actúa en la blanda. Para la dura se puede añadir
  `@view-transition { navigation: auto; }` (fundido entre documentos, Chromium 126+ y Safari 18.2+).
- `src/i18n/config.ts` (`localePath`, `splitLocale`, `alternatesFor`), `dictionaries.ts` (438 líneas, todo el texto de la
  interfaz) y `LocaleProvider`. La URL es la única fuente del idioma: sin cookie ni redirección.
- Redirección `makeappet → makeapet` en `next.config.ts`.

### 1.3 Dónde vive el contenido

`src/data/`: `work.ts` (1.860 líneas, EN, tipos `CaseStudy`, `StoryChapter`, `Kpi`, `FilmSource`…) + `es/work.ts` (1.127),
`cv.ts` + `es/cv.ts`, `site.ts` (identidad), `sections.ts` (los 5 paneles actuales), `testimonials.ts`, `coverLetter.ts`.
Hay tests que lo protegen (`data.singleSource`: ningún componente escribe a mano un rol, un año ni una empresa;
`i18n.parity`: las dos lenguas tienen la misma forma). **Se reutiliza tal cual.** El bento lee de los mismos datos.

### 1.4 Tema

`data-theme` en `<html>`, que pone un script inline antes del primer pintado (`THEME_INIT`, `localStorage dg-theme`, con
`prefers-color-scheme` de respaldo). Los tokens están en `globals.css`: `:root` oscuro por defecto, `:root[data-theme=light]`
y `@custom-variant light`. `theme-colors.json` se refleja en `viewport.themeColor`. `HeroField` observa `data-theme` con
un `MutationObserver` para cambiar la paleta del shader. Hay un test que obliga a que el acento exista **solo como tokens
`signal`** (`theme.tokens.test.ts`). **Al añadir el magenta del brief, ese test se rompe a propósito y hay que
actualizarlo.**

> Decisión pendiente para Doug: el brief pide «oscuro con losas blancas». La losa clara ya da el blanco dentro del
> tema oscuro. Mantener además el tema claro completo duplica el QA visual de cada card y del shader. Recomiendo un landing
> solo oscuro (las losas claras son parte del diseño) y conservar el tema claro en `/cv` y en la impresión.

### 1.5 Fuentes

`next/font/google` autoaloja **Archivo** (400/600/800) y **Geist Mono** (400/500) en el build, sin host externo, y eso la
CSP lo exige (`font-src 'self'`). Las fuentes nuevas de `01 §4` (display + **Doto** con eje `ROND`) entran igual:
`next/font/google` acepta `axes: ["ROND"]` en fuentes variables. No hace falta CDN.

### 1.6 Pruebas

- **vitest** (`src/**/__tests__`): 9 archivos sobre datos, i18n, tokens y helpers de carrera y CV. No tocan la interfaz.
  Siguen valiendo, salvo `theme.tokens` (§1.4).
- **Playwright** (`tests/e2e`, 17 specs, `next start -p 3131`, 2 workers): a11y con axe, contraste, teclado, i18n,
  layout, motion, impresión, SEO, seguridad, sticky y visual. Muchas dependen del **shell horizontal** (§5.5).
- Un detalle que manda sobre el héroe: `motion.spec 7.1` exige que, con reduced-motion, `document.getAnimations()`
  devuelva **cero animaciones**. El rAF de WebGL no cuenta, pero cualquier `@keyframes` en bucle sí. El héroe no puede
  dejar CSS animándose en reduced-motion.

### 1.7 `next.config.ts` y `vercel.json`

- **CSP estricta**: `default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `img-src 'self' data:`,
  `connect-src 'self'`, `worker-src 'self'`. Esto implica que:
  - **GSAP va empaquetado** con el build, no desde cdnjs. `security.spec S2/S4` fallaría con un CDN.
  - **No se pueden usar URLs `blob:`** para las texturas (`img-src` no incluye `blob:`): se cargan desde el mismo
    origen. El selector de archivo de los prototipos usa `blob:`, pero solo en el prototipo.
  - WebGL no necesita nada más.
- **Permissions-Policy** con `gyroscope=()` y `accelerometer=()`. **El revelado por giroscopio está bloqueado por
  política**, y en iOS además pide permiso. Recomiendo no usarlo: en táctil van arrastre y toque (§3.2).
- `images`: AVIF/WebP, con `deviceSizes` recortados (640…2048) y `minimumCacheTTL` de un año. `/portrait` y `/work` con
  caché de un día + SWR, a propósito (los nombres no llevan hash): las fotos del héroe deben ir con **nombre versionado**
  (`hero-v3-…avif`) o quedarán un día pegadas.
- `vercel.json`: mínimo (`iad1`, comandos por defecto). Las cabeceras viven en `next.config` para que los tests las vean.

### 1.8 Reutilizar o reescribir

| Pieza | Veredicto |
|---|---|
| `src/data/*`, `src/lib/career`, `caseMedia`, `metadata`, `personJsonLd`, `caseJsonLd`, `sitemap`, `robots` | **Reutilizar** |
| `i18n/*` (config, diccionarios, provider), `LanguageSwitch` | **Reutilizar** (se añaden claves) |
| `RootDocument`, `SiteHeader`, skip link, `next.config` (CSP, cabeceras) | **Reutilizar**, con ajustes de nav y fuentes |
| `lib/spring.ts`, el patrón de `Velaris` (ciclo de vida del GL) | **Reutilizar** como base del héroe |
| CV (`/cv`, `components/cv/*`, PDFs, `scripts/build-cv-pdf.ts`) | **No tocar** (brief §4) |
| Plantilla de caso (`components/case/*`, `work/*`, `vignettes/*`) | Re-maquetar encima de los mismos componentes de datos (`02 §6`) |
| `HorizontalShell`, `SectionIndex`, `RailLabel`, `FocusWords`, `sections/*` del home, `HeroField` | **Reescribir**: el bento vertical reemplaza el shell horizontal |

---

## 2. Stack de motion: decisión y pesos

### 2.1 Pesos medidos

Lo medí empaquetando con esbuild 0.28 (`--bundle --minify`, ESM, React externo, `NODE_ENV=production`) y `gzip -9`.
Solo se importa lo que se usaría; el tree-shaking es real.

| Opción | min | **gzip** | Nota |
|---|---:|---:|---|
| **View Transitions** (`<ViewTransition>` de React + API del navegador) | 0 | **0 KB** | Ya viene en React 19.3 / Next 16.4 |
| CSS (transiciones, `@starting-style`, `animation-timeline`) | 0 | **0 KB** | |
| `motion/mini` (`animate` sobre WAAPI) | 8,4 | 3,3 KB | Sin muelles en JS |
| `motion` vainilla (`animate`, `scroll`, `inView`, `spring`) | 76,7 | 28,2 KB | |
| `motion/react` con `LazyMotion` + `domAnimation` + `m` | 87,4 | 31,5 KB | Sin layout animations |
| `motion/react` con `domMax` + `LayoutGroup` (para `layoutId`) | 135,0 | 45,5 KB | |
| `motion/react` completo (`motion`, `AnimatePresence`, `useScroll`…) | 149,5 | 51,2 KB | |
| **GSAP core** 3.15.1 | 71,1 | 27,7 KB | |
| **GSAP + ScrollTrigger** | 115,8 | **45,3 KB** | |
| GSAP + ScrollTrigger + Flip + `@gsap/react` (`useGSAP`) | 142,1 | 54,7 KB | |
| Lenis 1.3.27 | 18,7 | 5,4 KB | Se descarta |
| **WebGL crudo** (código propio del héroe) | ~14 | **~5 KB** | Los dos prototipos completos, con CSS y markup, pesan 11,7 y 13,4 KB gz |
| OGL 1.0.11 (Renderer, Program, Mesh, Triangle, Texture, RenderTarget) | 53,1 | 14,5 KB | |
| Paper Shaders `FlutedGlass` 0.0.82 | 34,1 | 10,2 KB | Licencia **Apache-2.0** según su `package.json` (`01 §3.1` dice MIT) |
| three 0.187 (renderer + escena + cámara orto + plano + ShaderMaterial + loader) | 533,8 | **132,6 KB** | three apenas se deja recortar |
| three + @react-three/fiber 9.8 | 937,8 | **249,8 KB** | Incluye el reconciliador |

### 2.2 Transición card → página

| Opción | Cómo funciona en App Router | Veredicto |
|---|---|---|
| **React `<ViewTransition name>`** | La card y el héroe del caso comparten `name={"case-"+slug}`. `Link` navega dentro de una transition y el navegador captura antes y después y hace el morph. `share="morph" default="none"` y CSS sobre `::view-transition-group(.morph)`. `Link transitionTypes={["forward"]}` para dar dirección. | **Elegida.** 0 KB, interrumpible por el navegador, respeta el back del navegador (el morph se mantiene; la dirección no) |
| Motion `layoutId` | El elemento compartido tiene que existir en un árbol que sobreviva a la navegación (un `template` o un layout común). En App Router, el árbol de la página vieja se desmonta antes de que monte la nueva. | Frágil + 45 KB |
| GSAP Flip | `Flip.getState()` antes de `router.push` y `Flip.from()` al montar el destino. Hay que clonar el nodo viejo porque se desmonta. | Funciona con trabajo a mano, +9 KB. Respaldo si VT falla en Safari |
| FLIP manual | Medir el rect de la card, guardarlo (sessionStorage o un store), montar el destino con `transform` inverso y animar a identidad con WAAPI. | Alternativa de 0 KB si hiciera falta. ~60 líneas |

Datos verificados en la guía que trae el paquete de Next 16.4.5 (`next/dist/docs/01-app/02-guides/view-transitions.md`):
«View transitions work in the App Router with no configuration. React 19.3 includes the `<ViewTransition>` component»,
con `import { ViewTransition } from 'react'`. El React que lleva Next ya incluye `ViewTransition`, y el esquema de
configuración de 16.4.5 ya no trae el flag experimental. El morph solo se forma si el destino se pinta en el mismo
commit, es decir, si está prefetcheado. Los casos son estáticos (`generateStaticParams`), así que se cumple.
**Requisito: subir el lock de next 16.3.5 / react 19.2.6 a next ≥ 16.4 / react ≥ 19.3.** En navegadores sin la API, la
navegación es instantánea (mejora progresiva). Para reduced-motion se cambia el morph por un fundido de 200 ms (la guía
lo recomienda: quitar el movimiento de posición, no toda la transición).

Duraciones (de `emil-design-eng` y `motion-design`): morph card → héroe **400 ms**, `cubic-bezier(.77,0,.175,1)`, con
`blur(3px)` al 30 % para tapar la interpolación de píxeles. Salida del resto **150 ms** ease-out y entrada del contenido
**210 ms** con 150 ms de retardo (asimétrico, como la guía).

### 2.3 Scroll y coreografía

- **GSAP + ScrollTrigger** para lo que de verdad necesita scrub o pin: el paso del héroe al bento (la foto se encoge
  hasta su card) y el timeline de `/experience` (pin + progreso). Con `useGSAP({ scope })` de `@gsap/react`, que limpia
  con `gsap.context()` al desmontar, y `gsap.matchMedia()` con `(prefers-reduced-motion: no-preference)`, que deja el
  estado final si no coincide. Se importa con `import()` dinámico **después del LCP**, solo en esas dos rutas.
  Licencia: desde 3.13 (Webflow) todo GSAP, plugins incluidos, es gratis también para uso comercial, con la «Standard
  no-charge license» (no es OSI). Solo prohíbe usarlo en herramientas que compitan con Webflow. Un portafolio entra.
- **Entradas de cards al aparecer**: CSS + `IntersectionObserver` (ya hay `useInView`), con stagger de 40–60 ms y
  400 ms ease-out (`--ease-out: cubic-bezier(.23,1,.32,1)`). `animation-timeline: view()` como mejora donde exista
  (Chromium y Safari 26; Firefox todavía tras flag).
- **Motion (framer-motion) no entra.** Sus ventajas reales (muelles declarativos, `layoutId`) las cubren `spring.ts` y
  View Transitions, y costaría 31–51 KB encima de GSAP.

### 2.4 WebGL para el vidrio

| Opción | Peso | Veredicto |
|---|---:|---|
| **WebGL2 crudo** | ~5 KB | **Elegida.** El efecto es un triángulo a pantalla completa más un FBO ping-pong. El repo ya tiene el patrón (Velaris) |
| OGL | 14,5 KB | Correcto, pero no ahorra nada real aquí |
| Paper Shaders `FlutedGlass` | 10,2 KB | Muy buena referencia de parámetros. No compone las 3 capas ni el campo de revelado en la misma pasada, y está en 0.0.x (la API cambia) |
| three / R3F | 133 / 250 KB | Desproporcionado para un plano 2D |
| CSS puro (rebanadas o SVG) | 0 KB | **Respaldo**, medido en §3.3. Sin aberración ni ondulación real |

---

## 3. Prototipos

Archivos en `prototipos/`: `vidrio-estriado.html` y `revelado-mascara.html`. Son autocontenidos, sin librerías ni
CDN, y la imagen va por ruta relativa. Los dos tienen un panel de controles con fps en vivo y
`window.__proto.bench(ms)`, que mueve un cursor virtual en Lissajous y devuelve fps, p50 y p95.

**Imagen de prueba (cambio de Doug, 4 nov):** el héroe va **sin lentes, con el láser rojo y la gorra NY**. Los dos
prototipos usan la provisional `../retratos-hf/199598aa.jpg` (880×1168, baja resolución). **La foto definitiva llega
después** y entra sin rehacer nada (§4.6). `vidrio-estriado.html?img=40fe7690` conserva el retrato anterior para comparar.

### 3.1 `vidrio-estriado.html`: vidrio estriado oblicuo

Hay tres implementaciones del mismo efecto, que se eligen en el panel o con `?modo=`:

- **`webgl`** (fragment shader WebGL2). Cada estría es una lente cilíndrica. `u = dot(p, dir)` y `t = fract(u/ancho)`,
  con un perfil `0,75·s + 0,45·s³` (`s = 2t−1`): lineal = minifica la franja ~1,7–3× y cúbico = los bordes comprimen más.
  A eso se suma una variación por estría (hash) para que ninguna sea igual. Encima van la aberración cromática R/B a
  lo ancho de la estría, el esmerilado (5 muestras a lo largo de la estría, el «goteo» de ref-2), un labio brillante al
  empezar cada estría y un pliegue oscuro antes de la siguiente, sombreado hacia los bordes y un especular que viaja con
  la X del cursor. Mipmaps en la textura, porque sin ellos la minificación hace aliasing.
- **`dom`** (CSS «rebanadas»). Unas 15–40 franjas rotadas con `overflow:hidden`. Cada una muestra la foto contra-rotada y
  con `scaleX()` alrededor de su centro (la misma minificación media que el shader) y un `linear-gradient` de brillo y
  sombra por franja. Solo `transform`: el compositor lo hace todo.
- **`svg`** (`feDisplacementMap`). Un mapa de desplazamiento generado en canvas con el mismo perfil (R/G =
  dirección·perfil, `color-interpolation-filters="sRGB"`), más una capa de brillos. El movimiento desplaza `feImage x`.

Interacción, igual en los tres modos donde se puede:

- Las estrías se desplazan con la X del cursor y con el scroll (fase con resorte).
- Cerca del cursor aparece una ondulación local (gaussiana de 170 px). Solo en `webgl` y `dom`.
- La foto hace parallax y la fuerza sube con el scroll.
- El cursor sigue a dos **muelles X/Y críticamente amortiguados** (respuesta 0,35 s, como en `apple-design`).
- **Se pinta solo cuando algo cambia**: en reposo son 0 fps.
- Con reduced-motion (`?rm=1` o la media query) se pinta una vez y no reacciona.

Controles: modo, ancho (40–90 px), ángulo (−20…20°, por defecto 11°), fuerza, aberración, esmerilado, **cara nítida** y
**proteger la línea láser**.

**Legibilidad de los ojos y de la línea roja (verificado).** Ver `shot_vidrio_legible_protegido.jpg` frente a
`shot_vidrio_legible_sin_proteger.jpg`:

- **Sin protección**, los ojos se duplican y la línea láser se rompe en escalones. La causa es que, con 11° de
  inclinación, la refracción también desplaza en Y (≈ sen 11° × desplazamiento, hasta ~11 px) y cada estría corre la
  línea a una altura distinta.
- **Con protección**:
  - **Zona nítida**: una elipse en coordenadas normalizadas que cubre la gorra y la cara, con borde suave (0,78→1,08).
  - **Banda del láser**: el desplazamiento se vuelve **solo horizontal**, y una línea horizontal desplazada en X sigue
    entera. Dentro de la banda se apagan el esmerilado y la aberración, que la ensancharían y la teñirían.
  - Resultado: ojos limpios y la línea continua de lado a lado, atravesando el vidrio.
- En los respaldos CSS no se puede bajar la fuerza por píxel. Ahí se superpone **una copia nítida de la foto con
  `mask-image`** (elipse de la cara ∪ banda del láser). Probado en `dom` y `svg`.
- Para producción conviene que el láser sea **su propia capa** (la foto sin láser y la línea dibujada en el shader como
  luz aditiva): así se mantiene perfecta y se puede animar como un escaneo. Se puede pedir a Higgsfield un par sin y con
  láser, con el mismo método de §4.2.

### 3.2 `revelado-mascara.html`: revelado por capas

La mecánica, con la **máscara simulada** (dibujada en canvas y alineada a mano con la boca de `199598aa`):

1. Capas (de arriba a abajo):
   - **1 · Carcasa del respirador**: placas grafito con un baño rojo del láser arriba, rejilla, filtros laterales con
     aro azul, LED magenta, matriz de puntos «DG·01», correas y la sombra que proyecta sobre la piel (va dentro de la
     capa y se va con ella).
   - **2 · Malla y circuito**: panal azul, pistas con nodos y el borde con brillo.
   - **3 · Piel**: la foto.
2. **Campo de revelado**: una textura RGBA8 a ⅓ de resolución, en ping-pong. En cada cuadro decae
   (`campo −= cierre·dt·(0,6 + 0,8·ruido)`, de modo que se cierra de forma irregular) y el cursor lo repinta con un
   pincel en **cápsula** entre la posición anterior y la actual, para que no queden huecos con movimientos rápidos.
3. **Anillos escalonados**: la composición compara el campo contra dos umbrales. Por encima de 0,14 se quita la carcasa
   (anillo ancho) y por encima de 0,52 se quita la malla (anillo interior). Como el pincel es un degradado, los dos
   cortes salen con radios distintos, y al decaer **vuelve primero la malla y después la carcasa**.
4. **Borde en semitono**: rejilla de puntos de 5 px cuyo radio crece con el avance del corte, con ruido de valor
   encima. Hay además un **borde «caliente»** azul donde se corta la carcasa. Encaja con el dot-matrix de la marca.
5. **Inercia**: el pincel sigue al cursor con muelles X/Y críticamente amortiguados (slider «Inercia», por defecto
   0,2 s). El radio se abre con resorte al entrar en la elipse de la cara y se cierra al salir.
6. **Táctil**:
   - Un área sobre la cara con `touch-action: none`: arrastrar pinta a 1:1, sin inercia, porque el dedo manda.
   - El resto de la card mantiene `pan-y` y hace scroll.
   - **Un toque** (menos de 250 ms y menos de 10 px) revela todo **por capas**: un frente radial desde la boca en
     1.100 ms con ease-out cúbico, que cruza los dos umbrales en momentos distintos. Otro toque cierra en 600 ms.
   - El botón **«Quitar la máscara / Poner la máscara»** (`aria-pressed`) hace lo mismo y es la vía de teclado.
7. **Reduced-motion**: sin estela, sin ondas y sin vidrio animado. El botón alterna con un **fundido lineal de 200 ms**.
   Verificado: `document.getAnimations().length === 0`, así que `motion.spec 7.1` sigue verde.
8. **Combinado con el vidrio, en la misma pasada.** Se calcula **una sola** coordenada de muestreo refractada para las
   tres capas, con fuerza 0 dentro de la elipse de la cara. Fuera de la cara las estrías refractan piel, malla y carcasa
   de forma coherente. Dentro, el revelado sale nítido y su borde no se deforma. La banda del láser va protegida igual
   que en §3.1. **Es viable y es lo recomendado**: no hace falta un segundo canvas ni otra pasada.
9. **Capas reales (`?capas=t2`)**: el mismo shader con el trío alineado de Higgsfield
   (`heroe/t2-base`, `t2-estructura`, `t2-mascara`, 1195×1600, JPEG opacos). Como las capas son idénticas fuera de la
   máscara, el corte es invisible ahí sin necesidad de alfa. El borde caliente se limita a donde la capa 1 difiere de la
   piel (`|capa1 − piel| > 0,1`). Ver `shot_mascara_t2real_desktop_cursor.jpg`: el anillo deja ver la estructura y, en
   el centro, la piel, **sin fantasmas** de desalineación. El registro queda validado con fotos reales.
10. **Respaldo CSS (`?modo=css`)**: tres `<img>` apiladas. Cada capa superior lleva tres capas de `mask-image`:
    `fuera(r_ext) ∪ (fuera(r_int) ∩ puntos)`, con `mask-composite: add, intersect`. Eso da un anillo de semitono sin
    JS de píxel. Los radios siguen a los mismos muelles. No hay estela ni vidrio.

### 3.3 Mediciones

Contexto que hay que leer antes de las cifras: **este contenedor no tiene GPU**. Chromium usa **SwiftShader**
(WebGL2 emulado en CPU, 4 núcleos). Es el peor caso posible, el de una máquina con la GPU en lista negra. Las cifras de
CSS sí se parecen a las reales en Chromium. Todas son a DPR 1, durante 3 s de movimiento continuo del cursor
(`__proto.bench(3000)`).

| Prototipo · modo | 1440×900 (card 700×804) | 390×844 (card 358×540–557) | JS por cuadro |
|---|---|---|---|
| Vidrio · **WebGL** | 16,7 fps (p50 66,6 ms) | 46,7 fps (p50 16,7, p95 33,4) | 0,03 ms |
| Vidrio · CSS rebanadas | 38,7 fps (p50 33,2, p95 49,9) | 60,3 fps | 0,13 ms |
| Vidrio · SVG `feDisplacementMap` | 60 fps | 60,3 fps | 0,05 ms |
| Revelado · **WebGL** (vidrio incluido) | 30 fps (p50 33,3, p95 50) | 60,3 fps | 0,11 ms |
| Revelado · CSS mask | 51 fps (p50 16,7, p95 33,4) | 60,3 fps | 0,08 ms |

Cómo leerlo:

- **El costo de WebGL depende solo de los píxeles × las lecturas de textura.** El vidrio hace 15 lecturas por píxel
  (5 de esmerilado × 3 canales, y el bucle es fijo: ponerlo a 0 no ahorra nada, medido). El revelado hace 6 lecturas más
  la pasada del campo a ⅑ de los píxeles. En SwiftShader eso da ~15 y ~30 fps en desktop. En una GPU real, 700×804 a
  DPR 1,5 son 1,27 Mpx × 15 ≈ 19 M lecturas por cuadro, que una GPU integrada (varios Gtexel/s) hace en menos de 3 ms.
  **Falta la confirmación en hardware real**: el MacBook de Doug y un Android de gama media, con el contador del panel.
- **No se puede dejar que corra en software.** En producción va `getContext("webgl2", { failIfMajorPerformanceCaveat:
  true })`: si el navegador solo ofrece render por software, devuelve `null` y queda la imagen estática con el respaldo
  CSS. Y en producción el esmerilado se compila como variante: 1 lectura si está a 0, o 3 en vez de 5.
- El JS por cuadro es despreciable (≤ 0,13 ms): el costo está todo en el pintado.
- **CSS rebanadas** paga un recálculo de estilo y la composición de N capas del tamaño de la card: unas 40 capas con
  `will-change` ocupan bastante GPU (se estima ~50 MB a 700×804; no medido). **SVG** rinde sorprendentemente bien en
  Chromium, pero no lo probé en Safari ni en Firefox, donde `filter: url()` sobre HTML es más lento o parcial. El modo
  SVG tampoco ondula.
- **Peso del prototipo**: vidrio 33,6 KB (11,7 KB gz) y revelado 38,2 KB (13,4 KB gz), incluidos CSS, markup y panel.
  El componente de producción quedaría en ~5 KB gz de JS.
- Memoria de texturas: 3 capas × 1600×2133×4 B × 1,33 (mipmaps) ≈ **54 MB** de GPU en desktop. En móvil van texturas de
  1024 px de ancho: ≈ 22 MB.

### 3.4 Capturas (`prototipos/shot_*.jpg`, 1440×900 y 390×844, deviceScaleFactor 1)

| Archivo | Qué muestra |
|---|---|
| `shot_vidrio_{webgl,dom,svg}_{desktop,movil}.jpg` | Los tres modos con el cursor sobre la foto (en móvil se ve la ondulación) |
| `shot_vidrio_legible_protegido.jpg` / `…_sin_proteger.jpg` | Ojos y láser con y sin protección |
| `shot_mascara_webgl_desktop.jpg` | Estado inicial: máscara puesta, vidrio fuera de la cara |
| `shot_mascara_webgl_desktop_cursor.jpg` | **Cursor sobre la cara**: estela, anillo de malla, piel en el centro, borde en semitono |
| `shot_mascara_webgl_desktop_boton_{mitad,final}.jpg` | Revelado por capas con el botón: a 160 ms y al final |
| `shot_mascara_webgl_movil.jpg` / `…_movil_toque.jpg` | Móvil antes y después de un toque |
| `shot_mascara_css_{desktop,desktop_cursor,movil}.jpg` | Respaldo CSS con anillos de semitono |
| `shot_mascara_t2real_desktop{,_cursor}.jpg` | Mecánica de 3 capas con el trío **real** alineado (T2) |
| `shot_mascara_rm_desktop_fundido.jpg` | Reduced-motion: fundido con el botón |

Con doble clic (`file://`), Chrome no deja subir la foto a WebGL. Los dos prototipos lo detectan, pasan solos al modo
CSS y muestran un aviso con un selector para cargar la foto a mano. Verificado sin errores de consola.

### 3.5 Límites de los prototipos

- Probados solo en **Chromium**. Faltan Safari (iOS y macOS) y Firefox, en especial `mask-composite`, `feDisplacementMap`
  y WebGL2 en iOS con Low Power Mode.
- El arrastre táctil no está automatizado: el toque sí se probó con `touchscreen.tap`. La lógica de `pointerdown`,
  `pointermove` y la captura está, pero hay que probarla en un teléfono.
- La máscara simulada es dibujo vectorial: sirve para la mecánica, no como arte final.
- Las elipses de la cara y la boca se midieron a mano sobre cada foto. Con la foto definitiva se miden otra vez (§4.6).

---

## 4. Cómo entregar las imágenes del héroe

### 4.1 Tamaños y formatos

- **Máster 3:4**: generar a 2k (1792×2400) y hacer **upscale a 2400×3200**. La provisional (880×1168) se ve blanda en una
  card de ~700 px CSS a DPR 2, que pide ≥ 1400 px de ancho.
- **Para `<img>` (LCP y respaldo)**: `next/image` con `sizes="(min-width: 1024px) 50vw, 100vw"` y anchos de la escalera
  actual (640, 828, 1080, 1200, 1920). **AVIF** (calidad ~55–60) primero, **WebP** (q 78) de respaldo. Las genera Next.
- **Para texturas WebGL**: un solo archivo por clase de dispositivo, **1600 px de ancho en desktop y 1024 px en móvil**
  (nunca más de 2048). AVIF o WebP, decodificados con `<img>` del mismo origen: `texImage2D` acepta cualquier imagen
  que el navegador decodifique. Comprimir en GPU (KTX2/Basis) no compensa con tres texturas.
- **Capas 1 y 2**: no hace falta servirlas a pantalla completa. Se recorta la zona de la máscara (+ 24 px de margen),
  con **alfa** (AVIF o WebP con alfa) y un offset normalizado en los datos. En la T2 el recorte sería ~1000×1470 →
  bastante menos peso que dos fotos completas.
- Nombres versionados (`hero-v1-base-1600.avif`), por la caché no inmutable de `/portrait` (§1.7).

### 4.2 Pares alineados: cómo generarlos

1. **Primero la imagen SIN máscara.** Es la cara que Doug aprueba por parecido, y es el LCP si no hay WebGL.
2. **Después se edita esa misma imagen para AÑADIR la máscara**, con un modelo de edición (nano_banana_pro o
   seedream-edit en Higgsfield), y la instrucción de «no cambiar nada fuera de la boca y la mandíbula». Para tres capas
   se encadena: base → **+estructura** (capa 2) → desde la capa 2, **+placas** (capa 1). Así las placas descansan
   sobre la estructura.
3. **No hacerlo al revés.** Quitar una máscara obliga al modelo a **inventar** boca y barba, y ahí es donde se pierde
   el parecido y el registro. Los pares de `heroe/` se hicieron así (añadir) y quedaron alineados: diferencia media de
   2,2–3,4 sobre 255 en el tercio superior.

### 4.3 Verificar y forzar el registro

Hay que hacerlo antes de publicar, con un script de Python (numpy + Pillow):

1. **Desplazamiento global**: correlación de fase (FFT) entre la base y cada capa, en la zona de fuera de la máscara.
   Si |shift| > 0,5 px, se corrige con una traslación subpíxel.
2. **Diferencia fuera de la máscara** (máscara dilatada 24 px): media < 3/255 y menos del 1 % de píxeles > 28/255.
   Medido en T2: media 2,07 en las 300 filas de arriba y 4,8 en las 200 de abajo (la chaqueta se regeneró un poco).
   El 4,5 % y el 6,7 % de los píxeles superan el umbral, sobre todo ruido de la chaqueta.
3. **«Hornear» la identidad**: `capa_i = base·(1−m_i) + gen_i·m_i`, con `m_i` = |gen_i − base| umbralizado, con cierre
   morfológico y **difuminado 8–12 px**. Así **fuera de la máscara las capas son bit a bit la base**, y el ruido de
   regeneración (chaqueta, fondo) desaparece. De paso, `m_i` es el alfa del recorte de §4.1.
4. Revisión visual: el modo `?capas=…` del prototipo con el cursor sobre la cara. Si hay fantasmas en el anillo,
   falla el registro.

### 4.4 Recortes por breakpoint

Un máster 3:4 sirve con `object-fit: cover` y un **punto focal** normalizado (`fx`, `fy`):

- Card móvil ≈ 0,64 → recorta a lo ancho y queda el 85 % central.
- Card desktop ≈ 0,87 → recorta a lo alto y queda el 86 % central.

**Zona segura**: cabeza, ojos y láser dentro del **85 % × 86 % central**. Si el layout de `05-PROPUESTAS` pone el
héroe **a sangre en 16:10**, un 3:4 solo conserva el 47 % del alto: hace falta un segundo máster 16:10 (con outpaint
desde el mismo) y sus capas alineadas.

### 4.5 LCP y respaldo

1. **Primero se pinta un `<Image priority fetchPriority="high">`** con el **fotograma de reposo horneado**: vidrio + máscara
   puesta, renderizados con el mismo shader en el build. Un script de Playwright abre el prototipo, toma el canvas y
   pasa por sharp o ffmpeg a AVIF. Es idéntico al primer cuadro de WebGL, así que el cambio no se nota.
2. El componente WebGL se carga con `import()` dinámico en `requestIdleCallback` o tras el `load`. Sube las texturas
   desde las mismas URLs (ya en caché) y el canvas entra con un **fundido de 400 ms** después del primer cuadro (así está
   hecho en los prototipos).
3. **Sin WebGL, en software (`failIfMajorPerformanceCaveat`) o al perder el contexto** → se queda el estático + el
   revelado CSS de `mask-image` (o solo el botón con fundido).
4. **Reduced-motion** → estático, y el botón alterna con un fundido de 200 ms. Pausa con `IntersectionObserver` fuera de
   pantalla y con `visibilitychange`, como Velaris.

### 4.6 La foto final llega después: qué tiene que aceptar el sistema

**La imagen definitiva todavía no existe**, y el sistema tiene que aceptar **cualquier foto 3:4 sin rehacer nada**. En los
prototipos ya es así:

- El tamaño de la imagen se lee del archivo (`naturalWidth/Height`); no está escrito en el código.
- Todo lo que depende de la foto son **cinco datos normalizados** (0–1) en un preset:
  `focus [fx, fy]`, `face [cx, cy, rx, ry]` (elipse nítida), `mouth [cx, cy, alcance]` (centro y alcance del revelado
  global), `line y` (láser, opcional) y, si las hay, las rutas de las capas 1 y 2.
- En producción viven en `src/data/hero.ts` (un objeto por foto). Cambiar de foto es cambiar archivos y esos números.
- El ancho de la estría se escala con el ancho de la card (×0,65–1), no con la foto.

---

## 5. Plan técnico de alto nivel

### 5.1 Componentes nuevos

| Componente | Tipo | Qué hace |
|---|---|---|
| `hero/HeroPortrait.tsx` | server | `<picture>`/`next/image` con el fotograma horneado (LCP), alt por idioma, botón y pista. Monta `GlassReveal` en diferido |
| `hero/GlassReveal.tsx` | client, `dynamic(…, { ssr: false })` | WebGL2 de dos pasadas (campo + composición) portado de `revelado-mascara.html`. Props: preset de `data/hero.ts`, `onReady`. Ciclo de vida como Velaris |
| `hero/MaskRevealCss.tsx` | client | Respaldo con `mask-image` (sin WebGL o en software) |
| `lib/gl/` (`program.ts`, `texture.ts`, `pingpong.ts`) | lib | ~1 KB. Compartido con Velaris si se queda alguna losa animada |
| `lib/spring.ts` + `spring2D` | lib | Muelle críticamente amortiguado por eje, con test en vitest |
| `bento/BentoGrid.tsx`, `bento/BentoCard.tsx` | server | Rejilla de `02 §4.3`. Cada card es un `Link` envuelto en `<ViewTransition name>` |
| `bento/Card{Case,Profile,Experience,Contact,Cv}.tsx` | server | Leen de `src/data` (single source) |
| `type/DotMatrix.tsx` | server | Cifras y fechas en Doto (`ROND 100`, ≥ 20 px, `tabular-nums`) |
| `motion/useScrollScene.ts` | client | `useGSAP` + `gsap.matchMedia()` con `import()` de GSAP y ScrollTrigger solo donde se usa |
| `app/(es)/work/page.tsx`, `about`, `experience` (+ `(en)/en/…`) | rutas | Las rutas nuevas de `02 §4.1` |

### 5.2 Tokens (`globals.css`)

Añadir los de `01 §2`: azul eléctrico, magenta, gradientes de losa «jelly», losa clara, radios (card y pill), escala de
espaciado y las curvas de emil (`--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-in-out: cubic-bezier(.77,0,.175,1)`,
`--ease-drawer: cubic-bezier(.32,.72,0,1)`) con duraciones (`--dur-press 160ms`, `--dur-card 350ms`, `--dur-morph 400ms`).
Los parámetros del vidrio (ancho, ángulo, fuerza) van como **datos** en `hero.ts`, no como tokens CSS: los lee un
shader.

### 5.3 i18n

Todo texto nuevo va a `dictionaries.ts`: pista del héroe («Pasa el cursor por la cara» / «Hover over the face»; en táctil,
«Arrastra el dedo… · toca para revelar»), el botón (`aria-pressed` + etiqueta por estado), el alt de cada capa, los
rótulos de las cards y las rutas nuevas. `i18n.parity` cubre la paridad, y `localePath` las rutas.

### 5.4 Rendimiento y a11y

- El héroe no bloquea el LCP (§4.5).
- GSAP fuera del bundle inicial.
- Canvas con `aria-hidden`. El contenido accesible es la imagen con su alt y el botón.
- El área táctil de la cara es solo la elipse (~35 % de la card): el resto hace scroll.
- Sin animaciones CSS en bucle con reduced-motion.
- `prefers-reduced-transparency` endurece los vidrios oscuros de las pills.

### 5.5 Pruebas que hay que actualizar

| Spec | Qué se rompe | Acción |
|---|---|---|
| `keyboard.spec` 6.2–6.5 | Flechas, PageDown y Home/End del shell horizontal | Reescribir para el bento: orden de tabulación por card y Enter navega |
| `recheck` R4/R5, `recheck2` R4b | `SectionIndex` y paneles | Retirar o adaptar al índice nuevo |
| `i18n` I3 | «el switch conserva el panel» | Conservar el **ancla** de la sección del bento |
| `visual`, `layout`, `measure` M3 | Capturas y geometría del home | Regenerar las referencias |
| `motion` 7.1/7.2/7.5 | Siguen valiendo | El héroe debe cumplirlas (verificado en el prototipo) |
| `seo` E3, `sitemap.ts` | Rutas nuevas | Añadir `/work`, `/about`, `/experience` en los dos idiomas |
| `security` S2/S4 | Cualquier CDN | GSAP y fuentes empaquetados. Sin `blob:` |
| `theme.tokens` (vitest) | El magenta rompe «solo tokens signal» | Actualizar la regla de forma explícita |
| `content` 10.1, `a11y` | Identidad y landmarks del home nuevo | Revisar con axe |
| **Nuevas** | — | Héroe con `--disable-webgl` → estático visible. Reduced-motion → botón con fundido. `hasTouch` → toque revela. Card → caso con `document.startViewTransition` presente. Ningún error de consola en los modos |

### 5.6 Riesgos

| Riesgo | Mitigación |
|---|---|
| GPU débil o render por software (en este contenedor: 16 fps) | `failIfMajorPerformanceCaveat`, DPR ≤ 1,5, pintar solo cuando cambia, esmerilado en variante barata, estático horneado |
| Registro de las capas generadas | Método «añadir» + correlación de fase + horneado de identidad (§4.3) |
| La foto final llega tarde o a otra escala | Presets normalizados (§4.6). El prototipo ya acepta cualquier 3:4 |
| View Transitions en navegadores viejos o el back del navegador | Mejora progresiva. El morph funciona con back; la dirección no |
| Safari: `mask-composite`, filtros SVG, WebGL2 con Low Power | Probar en dispositivo. El respaldo final es la imagen estática |
| Pérdida del contexto WebGL | Escuchar `webglcontextlost` → modo CSS (ya está en los prototipos) |
| Giroscopio bloqueado por Permissions-Policy | No usarlo: arrastre, toque y botón |
| Memoria GPU en móvil | Texturas de 1024 px y capas recortadas con alfa |
| Bloqueo del scroll táctil sobre la cara | Área de captura = solo la elipse; vertical libre en el resto |
| README desactualizado (induce a error a otros agentes) | Reescribirlo en la fase de implementación con el stack real |
