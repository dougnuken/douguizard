# 07 · Plan de implementación de la Propuesta B «Cine → OS»

> Planificador técnico · 5 nov 2026 · rama `claude/douguizard-portfolio-redesign-9ivnau`.
> Fuentes: `00-BRIEF.md` (gana si algo choca), `02-ESTRATEGIA-UX.md` §4–§7, `03-TECNICA.md`, `04-COPY.md`,
> `05-PROPUESTAS.md`, `propuestas/B/index.html` + `propuestas/B/NOTAS.md` (§7 manda sobre el resto de NOTAS),
> `06-CRITICA-B.md`, y el código de `src/`, `tests/`, `next.config.ts`, `package.json`.
> Este documento no cambia código. Lo revisa el orquestador y otro agente lo contrasta con el repo antes de ejecutar.
> En cada fase, la columna **«Verificar antes»** lista lo que este plan no pudo comprobar (en el contenedor no hay
> `node_modules`: no se corrió `npm test` ni Playwright al escribirlo).

---

## 0. Estado de partida (verificado en el repo)

| Tema | Hoy |
|---|---|
| Versiones instaladas (`package-lock.json`) | next **16.3.5**, react / react-dom **19.2.6**, tailwindcss 4.2.4, TypeScript 5.9.3, Playwright 1.63, eslint-config-next 16.2.5 |
| Rutas | Dos root layouts: `src/app/(es)/layout.tsx` (`/`, `/work/[slug]`, `/cv`) y `src/app/(en)/layout.tsx` (`/en/…`). `app/global-not-found.tsx` con `experimental.globalNotFound`. Redirección `makeappet → makeapet`. |
| Home | `HomePage` = `SectionIndex` + `HorizontalShell` con 5 paneles (`sections/Hero, Work, Craft, About, Contact`). `HeroField` → `Velaris` (WebGL de ruido). |
| Caso | `components/pages/CasePage.tsx` compone bandas desde `src/data/work.ts`; envuelve todo en `<main id="main">` y emite JSON-LD del caso. |
| Datos | `src/data/{work,cv,site,sections,testimonials,coverLetter}.ts` + `es/`. Diccionario en `src/i18n/dictionaries.ts`. |
| Tokens | `src/app/globals.css` (1.357 líneas): `@theme` que reinicia colores/fuentes/sombras/easing, `:root` oscuro + `:root[data-theme="light"]`, `@custom-variant light`. El CV y los casos usan `--paper/--ink/--signal/--ease-out`. |
| Fuentes | `next/font/google`: Archivo + Geist Mono en `RootDocument`. El CV y su PDF usan Archivo/Geist (`scripts/cv-fonts/`). |
| CSP | `script-src 'self' 'unsafe-inline'`, `img-src 'self' data:` (sin `blob:`), `connect-src 'self'`, `font-src 'self'`. Permissions-Policy sin giroscopio. |
| Pruebas | vitest: 9 archivos (`data.*`, `i18n.parity`, `theme.tokens`, `career.*`, `caseMedia`, `cv*`). Playwright: 17 specs en `tests/e2e`, `next start -p 3131` (requiere `npm run build` antes). |

Reglas de prueba existentes que condicionan el diseño (no se relajan sin motivo escrito):

- `a11y 3.1`: todo `<p>` de más de 40 caracteres en `ROUTES` (incluye `/`) debe dar **≥ 7:1** contra el
  `background-color` efectivo. Ojo: B mide `--tinta-osc-2` sobre claro en 6,6:1 → los párrafos largos sobre losa
  clara van en `--tinta-osc`, o se oscurece `--tinta-osc-2` hasta ≥ 7:1. Las losas con gradiente o foto declaran un
  `background-color` sólido igual a su peor punto (la prueba lee el color, no la imagen).
- `a11y 3.6`: todo `a`/`button` visible fuera de `p, li` mide ≥ 44×44 a 375 px. El enlace de toda la card no puede
  ser un `<a>` de 20 px de alto con `::after`: va como **capa de enlace a tamaño de card** (`.enlace-tarjeta` de B).
- `motion 7.1/7.5`: con reduced-motion, `document.getAnimations()` vacío y **ninguna `transition-duration` > 1 ms** en
  `/`. Los «fundidos de 150 ms en reduced-motion» de 02 §4.4 y de NOTAS §2 **no caben en reposo**: en el tablero, los
  cambios de estado con RM son instantáneos; solo la hoja (que no está en el DOM en reposo) lleva su fundido.
- `data.singleSource`: fuera de `src/data` y `src/lib` no puede aparecer «Head of Product», «Senior Product
  Designer», «Tech Lead», años en palabras ni «Dribbble». **`dictionaries.ts` está fuera** → «Head of Product ·
  Barranquilla» (K1) y «Head of Product en Naowee» (K5) salen de `site.ts`, no del diccionario ni del JSX.
- `theme.tokens`: el primer bloque `:root {` debe declarar `--paper` igual a `theme-colors.json`; no puede existir
  `--color-accent` ni las clases `.glass`, `.cosmic-`, `.btn-accent`, `.btn-outline`, `theme-dark`. → El vidrio de B
  se llama **`.vidrio`** (nunca `.glass`) y los tokens nuevos se añaden **después** del primer `:root {`.
- `content 10.5`: «Caso disponible a solicitud» / «Case study available on request» aparece en el home → es el chip
  NDA de K4. `content 10.7`: «Francesca Steri» solo en el caso BdO → **K8 no muestra su cita** (ver decisión D10).
- `seo E3`: el sitemap lista exactamente las URLs indexables → se actualiza cuando entran `/work`, `/about`, `/experience`.
- `seo E5`: `/this-page-was-never-here` y `/en/…` dan 404 → condiciona el diseño del slot `@modal` (§1.2).

---

## 1. Resumen y arquitectura destino

**Qué se construye.** El home de B: la cara de Doug a pantalla completa tras vidrio estriado oblicuo (acto 1); con un
scroll anclado de un viewport la foto se encoge a su losa K1, el vidrio pasa de 12° a 0°, K2 cambia de vidrio oscuro a
losa blanca y el tablero (OS) aparece alrededor, con rail de acciones y pills de sección. En móvil, el OS es una app
(foto a sangre, secciones con título, carrusel, dock). Los casos se abren como **hoja sobre el tablero con URL real**
(`/work/[slug]`); con enlace directo o recarga se ve la página completa existente. Se suman `/work`, `/about` y
`/experience`. Sin JS, sin GSAP o con reduced-motion, el OS aparece armado desde el primer píxel.

### 1.1 Árbol de rutas destino

```
src/app/
├─ globals.css                      ← + capa de tokens B (aditiva), − CSS del shell horizontal (F3)
├─ global-not-found.tsx             ← sin cambios (copy 404 nuevo en F7 vía diccionario)
├─ sitemap.ts                       ← + /work, /about, /experience (F2)
├─ (es)/
│  ├─ layout.tsx                    ← recibe { children, modal } y pinta {modal} (F6)
│  ├─ page.tsx                      ← HomePage nuevo (F3)
│  ├─ @modal/
│  │  ├─ default.tsx                ← null (carga directa / recarga de cualquier ruta)
│  │  └─ (.)work/[slug]/page.tsx    ← <CaseSheet slug> + generateStaticParams (F6)
│  ├─ work/
│  │  ├─ page.tsx                   ← NUEVA: índice de casos (F2)
│  │  └─ [slug]/{page,not-found}.tsx← página completa existente (CasePage → CaseBody, F6)
│  ├─ about/page.tsx                ← NUEVA (F2)
│  ├─ experience/page.tsx           ← NUEVA (F2)
│  ├─ cv/page.tsx                   ← NO SE TOCA
│  └─ lab/page.tsx                  ← TEMPORAL F1–F7: catálogo del sistema; notFound() salvo DG_LAB=1; se borra en F8
└─ (en)/
   ├─ layout.tsx                    ← root EN, sin slot
   └─ en/
      ├─ layout.tsx                 ← NUEVO layout anidado: { children, modal } (F6)
      ├─ page.tsx
      ├─ @modal/{default.tsx, (.)work/[slug]/page.tsx}
      ├─ work/{page.tsx, [slug]/…}
      ├─ about/page.tsx · experience/page.tsx
      └─ cv/page.tsx                ← NO SE TOCA
```

### 1.2 Hoja con URL real: rutas interceptadas + paralelas dentro de los route groups

- **ES.** El slot vive en el root layout `(es)/layout.tsx`. `(.)` se resuelve por **segmentos de ruta**, no por
  carpetas: `(es)` y `@modal` no son segmentos, así que `(es)/@modal/(.)work/[slug]` intercepta `/work/[slug]`.
- **EN.** El root layout `(en)/layout.tsx` no es el nivel de `/en`; se añade `(en)/en/layout.tsx` (layout anidado
  que solo devuelve `<>{children}{modal}</>`) y `(en)/en/@modal/(.)work/[slug]` intercepta `/en/work/[slug]`. Así
  el slot inglés solo existe bajo `/en`.
- **Navegación blanda** (clic en una card dentro del idioma): `children` conserva el tablero montado (scroll, estado
  del ancla y del vidrio intactos) y `modal` pinta la hoja. **Carga directa o recarga** de `/work/x`: `children` es la
  página completa y `modal` cae en `default.tsx` → `null`. Entre idiomas cambia el root layout → navegación dura (ya
  es así hoy).
- **Cerrar la hoja sin catch-all.** El patrón de la documentación (`@modal/[...catchAll]/page.tsx` que devuelve
  `null`) se **descarta**: un catch-all en el slot del root layout puede hacer que una URL inexistente «coincida» con
  el árbol `(es)` y salga el 404 genérico en vez de `global-not-found` (rompería E5 y el 404 de diseño). En su lugar,
  `CaseSheet` es cliente y se **auto-oculta** si `usePathname()` deja de ser `localePath(locale, /work/${slug})`
  (el slot puede quedar «rancio» tras una navegación blanda a otra ruta; renderiza `null`).
- **Interceptación desde cualquier página del idioma.** En Next, una ruta interceptada al nivel raíz se aplica cuando
  la URL actual es cualquiera bajo `/` (la regla de reescritura usa el encabezado `Next-Url` con `/(.*)?`). Efecto: un
  `<Link>` a otro caso desde una **página completa de caso** abriría una hoja encima. Reglas:
  1. `CaseNext` en página completa navega como documento (`<a href>`, con `@view-transition` de F7 es un fundido).
  2. `CaseNext` dentro de la hoja usa `<Link replace>`: cambia de caso dentro de la hoja y «Cerrar» vuelve al tablero.
  3. Desde `/work` (índice), `/about` y `/experience` la hoja **sí** se abre (coherente con el OS) — decisión D21.
  4. Slug inexistente en navegación blanda: la página del slot hace `window.location.replace(href)` → 404 real.
- **Cierre**: X, Esc, clic en el velo, arrastre (móvil) → animación de salida 280 ms → `router.back()`. Atrás del
  navegador → la hoja desaparece (sin animación de salida, aceptado). El foco vuelve al enlace de origen (guardado en
  `hoja/origen.ts` en el `onClick` de la card). Cmd/Ctrl/clic medio → pestaña nueva con la página completa (nativo).
- **Una sola `<main>`**: `CasePage` se parte en `CaseBody` (sin `<main>`, sin JSON-LD) + envoltorio. La hoja es
  `<dialog aria-labelledby>` con `CaseBody` dentro; JSON-LD del caso solo en la página completa.

**Verificar antes (agente de contraste):** con next ≥ 16.4 instalado, leer
`node_modules/next/dist/docs/01-app/**/{parallel-routes,intercepting-routes}.md` y
`node_modules/next/dist/lib/generate-interception-routes-rewrites.js` y confirmar: (a) `(.)` con route groups como
arriba; (b) la regla `Next-Url` del nivel raíz; (c) que `default.tsx` en el slot del root layout no cambia el 404 de
una URL inexistente (E5).

### 1.3 Componentes nuevos

| Carpeta | Componente | Tipo | Qué hace |
|---|---|---|---|
| `components/marca/` | `NameLockup.tsx` | server | **Único lugar** donde se compone «Doug / Vargas». Props `escala: "xl" \| "losa" \| "movil"`. Lee `decisiones.nombreLockup`; aplica `data-lockup` y la variable de fuente del archivo `app/fonts/lockup.ts`. Estructura fija (`.linea > span`) para que el FLIP del acto 1 mida cualquier fuente. |
| | `Wordmark.tsx` | server | «douguizard» de la cabecera (nombre accesible `meta.homeLabel`). |
| `components/sistema/` | `Losa.tsx` | server | Superficie (`vacio`, `losa`, `clara`, `niebla`, `azul`, `magenta`, `vidrio`) con radio, padding y filo de 1 px. |
| | `BentoCard.tsx` | server | `Losa` + capa de enlace a tamaño de card (`aria-labelledby` del título, nombre que empieza por el texto visible) + `Flecha`; enlaces secundarios encima con `z-index`. Hover/foco/pressed de NOTAS §2 con `translate`/`scale` (propiedades individuales, no chocan con GSAP). |
| | `DotMatrix.tsx` | server | Cifras/fechas en Doto (`ROND 100`, ≥ 20 px, `tabular-nums`, `data-dot`), texto real con `aria-label` por grupo. |
| | `Estado.tsx` | server | Punto de disponible en **luz láser** (núcleo claro + aro y halo rojos; P1-6) + texto. |
| | `Boton.tsx`, `Flecha.tsx`, `Etiqueta.tsx`, `Iconos.tsx` (sprite SVG) | server | Botones (≥ 48 px), flecha circular (blanca / `.flecha-tinta`), etiquetas tintadas. |
| `components/chrome/` | `SiteHeader.tsx` (reescrito) | client | Pastilla de B: wordmark · pills · ES/EN (44×44, `background-clip: content-box`) · «Hablemos». En el home, pills = anclas con scroll-spy (`lib/activeSection.ts`); fuera, rutas. Pills centradas al viewport (P2-1). |
| | `RailAcciones.tsx` | client | Rail de escritorio (Escríbeme, CV, LinkedIn, Behance, GitHub, Volver arriba). `inert` mientras p < 0,5 del ancla (P0-3); nunca inerte sin GSAP o con RM. |
| | `DockMovil.tsx` | client | Trabajo · Perfil · CV · Contacto, aparece al salir del héroe, `env(safe-area-inset-bottom)`. |
| | `SiteFooter.tsx` | server | © · Barranquilla · UTC-5 · colofón (D11) · Volver arriba (≥ 44 px). |
| `components/tablero/` | `Tablero.tsx` | server | Orden del DOM = orden visual = Tab: K2, K1, K3, K4, K5, [carrusel K7–K10], K11, K12, K13, K14, K15, K16, K17. `grid-template-areas` por breakpoint (≥ 1280, 1024–1279 de P0-1, < 1024). Filas `minmax(var(--fila), auto)`. |
| | `K1Retrato.tsx`, `K2Claim.tsx`, `CardCaso.tsx` (variantes K3/K4/K7–K10), `CardContacto.tsx` (K5+K6 fusionadas, P1-5), `CardExperiencia.tsx` (K11), `CardCifras.tsx` (K12), `CardPerfil.tsx` (K13), `CardOficio.tsx` (K14), `CardArchivo.tsx` (K16), `Contacto.tsx` (K17) | server | Leen de `src/data` (single source). |
| | `CardTestimonio.tsx` (K15), `CarruselMovil.tsx`, `RelojBaq.tsx`, `CopiarCorreo.tsx` | client (islas) | Rotación manual · scroll-snap con contador y botones · reloj por minuto (`suppressHydrationWarning`) · copiar correo con error de 04 §4.5. |
| `components/escena/` | `Escena.tsx` | server | Contenedor del acto 1 + OS: `data-escena`, póster, velo, láser, `NameLockup` XL (`aria-hidden`), indicador «Desliza». |
| | `EscenaCliente.tsx` + `useScrollScene.ts` | client | `import("gsap")` + `ScrollTrigger` diferido; timeline de NOTAS §2 corregido por §7; `gsap.context()` + `gsap.matchMedia()`; limpieza al desmontar. |
| | `sceneInit.ts` | lib | Script inline (string) que pone `html.cine` antes del primer pintado solo si `/` o `/en`, ≥ 1024 px, sin RM y con JS. |
| `components/hero/` | `HeroPoster.tsx` | server | `<picture>` con AVIF/WebP horneados (`fetchPriority="high"`, `sizes`), alt por idioma. Es el LCP. |
| | `VidrioGL.tsx` | client (`dynamic`, `ssr:false`) | WebGL2 de un pase portado de `propuestas/B/index.html` (FS del vidrio, SDF de losa, cara protegida, banda láser, lente). Monta en `requestIdleCallback`/`load`, fundido de 200–400 ms tras el primer cuadro. |
| | `VidrioCss.tsx` | server | Respaldo de franjas CSS (rebanadas) + copia nítida con `mask-image` (cara ∪ banda láser). |
| | `useLente.ts` | client | Lente del cursor con muelles X/Y críticamente amortiguados (respuesta 0,35 s; entra k = 7, sale k = 4); táctil 1:1 con `touch-action: pan-y`. |
| `components/hoja/` | `CaseSheet.tsx` | client | `<dialog>` + `showModal()`, `overflow: clip`, foco inicial en Cerrar, línea láser de progreso, «Ver página completa», auto-oculta por pathname. |
| | `useArrastreHoja.ts`, `origen.ts` | client | Arrastre para cerrar (> 120 px o > 0,5 px/ms, banda elástica) · enlace de origen para devolver el foco. |
| `components/case/` | `CaseBody.tsx` | server | Cuerpo del caso extraído de `CasePage` (sin `<main>`, sin JSON-LD). |
| `components/pages/` | `HomePage.tsx` (reescrito), `WorkIndexPage.tsx`, `AboutPage.tsx`, `ExperiencePage.tsx` | server | Páginas por idioma, como las actuales. |
| `lib/` | `gl/{programa,textura}.ts`, `gl/vidrioShader.ts` | lib | Compilar/enlazar, subir textura con mipmaps, fuentes GLSL. `failIfMajorPerformanceCaveat: true`, `webglcontextlost` → respaldo. |
| | `escena.ts` | lib (pura) | `placement()`, `frame(p)`, `eio()` y el layout de NOTAS (sin DOM) → testeable en vitest. |
| | `spring.ts` (+ `stepCritical`) | lib | Muelle críticamente amortiguado por eje, aditivo: no cambia `stepSpring` ni sus constantes. |

### 1.4 Componentes que se retiran (F3, salvo indicación)

`components/HorizontalShell.tsx`, `SectionIndex.tsx`, `RailLabel.tsx`, `FocusWords.tsx`,
`components/sections/{Hero,Work,Craft,CraftTimeline,About,Contact}.tsx`, `components/hero/HeroField.tsx` y
`hero/Velaris.tsx` (en F4, cuando su ciclo de vida ya esté portado a `lib/gl`), `src/data/sections.ts` (lo reemplaza
`home.secciones`). **Antes de borrar `Craft.tsx` y `About.tsx`, su copy se mueve a `src/data/perfil.ts`** (04 §0 los
cita como fuente). Se conservan: `text/RevealText.tsx` y `text/useInView.ts` (los usan los casos y `work/*`),
`ThemeToggle.tsx` (solo en `/cv`, D4), `LanguageSwitch.tsx`, `lib/activeSection.ts` (scroll-spy de las pills),
`vignettes/*` (los usa `CaseNda`). Del CSS: el bloque `.rail-*`/shell de `globals.css` se borra en F3 (el rail nuevo
usa `.rail-acciones` para no chocar).

### 1.5 Capa de datos

| Archivo | Contenido | Pruebas |
|---|---|---|
| `src/data/decisiones.ts` (nuevo) | **Todas** las decisiones pendientes de Doug con su valor por defecto (§4), tipadas y comentadas: `disponibilidad`, `ordenCasos`, `rutasPerfil`, `temaClaroEn`, `titularEn`, `nombreLockup`, `pdfPorIdioma`, `colofon`, `telefonoEnHome`, `nombreK1`, `citaFrancescaEnHome`, `hojaDesdeIndices`. Cambiar una decisión = cambiar una línea. | `decisiones.test.ts`: valores dentro de su unión de tipos. |
| `src/data/home.ts` (nuevo) | `ordenCasos` (slugs), `archivo` (RC · Qrvey · Ideaware · Chub), mapeo K → slug/superficie/KPI (por **índice o id del KPI** de `work.ts`, nunca la cifra escrita), ids de sección **en inglés en los dos idiomas** (`work`, `about`, `experience`, `contact`) para que `/#work` y `/#contact` de hoy sigan llegando. | `home.test.ts`: cada slug existe; el KPI referido existe en ES y EN; los ids no cambian por idioma. |
| `src/data/hero.ts` (nuevo) | Un objeto por foto: `id`, `version`, `rutas` (master, póster AVIF/WebP por ancho, texturas 1600/1024), `tamano` (w, h), `foco [fx, fy]`, `cara [cx, cy, rx, ry]`, `laser { y, h }` (opcional), `alt` por idioma (o clave de diccionario). Parámetros del vidrio por estado (`cine`, `losa`, `movil`): ángulo, ancho de estría, fuerza, joroba, radio de lente, protección de cara, DPR máx. **Provisional:** `199598aa` con `{ w: 880, h: 1168, eye: 0.418, face: [0.5, 0.41, 0.19, 0.205] }` de la maqueta. | `hero.test.ts`: todo normalizado en [0, 1]; la foto activa tiene todas las rutas; `version` en el nombre de archivo. |
| `src/data/perfil.ts` (nuevo) | Oficio (3), pasos de «Cómo trabajo» (4), datos (base, zona, idiomas), eras de `/experience` (04 §6.2), migrados de `sections/{Craft,About}.tsx` y 04 §6. ES/EN. | `i18n.parity` extendido. |
| `src/data/site.ts` | + `rolCorto` («Head of Product · Barranquilla», derivado del cargo actual de `cv.ts` si se puede) y `availability.modo`. | `data.singleSource` sigue verde. |
| `src/i18n/dictionaries.ts` | + `home.*`, `hoja.*`, `trabajo.*`, `perfil.*`, `trayectoria.*`, `carrusel.*`, `dock.*`; − `shell.*`, `index.*` al retirar el shell. Copy de 04 (ES/EN). Sin roles ni años. | `i18n.parity` (misma forma); **nuevo** `copy.sinMarcadores.test.ts`: ningún `[DATO A CONFIRMAR`, `⚠️ CONFIRMAR` ni `TODO` en diccionario ni datos visibles. |

### 1.6 Tokens en `globals.css`

Capa **aditiva** con los nombres en español de B (NOTAS §3), en un `:root` posterior al primero (regla de
`theme.tokens`), independiente de `data-theme` (B es solo oscuro; D4):

- **Color:** `--vacio #060608`, `--losa #111214`, `--losa-alta #1A1B1F`, `--claro #F2F2F4`, `--niebla #E4E2EC`, `--tinta`,
  `--tinta-2`, `--tinta-2-vidrio #C2C2CA` (P1-7), `--tinta-3`, `--tinta-osc`, `--tinta-osc-2` (≥ 7:1 sobre claro, ver §0),
  `--electrico #2B56F3`, `--electrico-texto #5B7CFF`, `--laser #FF3344`, `--laser-nucleo #FFE4E6`, `--laser-halo`,
  `--verde-osc #0E6B3D` (solo el 647 de olbo), `--azul-etiqueta #E3EAFF`, `--magenta-etiqueta #FCE6F1`,
  `--magenta-etiqueta-base`, gradientes `--jelly-azul`, `--jelly-magenta`, `--vidrio-oscuro` (P1-7). **Sin `--verde`.**
- **Espacio:** la escala 4…128 coincide con la de Tailwind v4 (`--spacing: .25rem`): `p-1…p-32`. Estructurales:
  `--cabecera 88px`, `--rail 64px`, `--os-izq 112px`, `--gap 16px`, `--fila clamp(96px, …, 128px)`.
- **Tipo:** `--t-12 … --t-120` (+ `--t-96` para alto ≤ 800, P0-1). **Radios:** `--r-losa 48/36`, `--r-m 32/28`,
  `--r-s 24/20`, `--r-xs 16`, pill 999 (concéntricos: radio interno = externo − inset).
- **Sombras:** `--bloom-azul`, `--bloom-magenta`, `--sombra-flota`, `--sombra-hoja`, `--filo`, `--filo-jelly`.
- **Motion:** `--curva-salida (.23,1,.32,1)`, `--curva-io (.77,0,.175,1)`, `--curva-hoja (.32,.72,0,1)`;
  `--d-press 120ms`, `--d-hover 200ms`, `--d-ui 240ms`, `--d-hoja 420ms`, `--d-hoja-salida 280ms`, `--d-entrada 600ms`.
  **No se redefine `--ease-out`** (hoy `(.16,1,.3,1)`, lo usan casos y CV); en F7 los casos migran a `--curva-*`.
- **Fuentes:** `--font-urbanist`, `--font-instrument`, `--font-doto`, `--font-nombre` (lo fija `NameLockup`).
- `@theme inline`: `--color-vacio: var(--vacio)` y así para cada color B, `--font-display-b`, `--font-texto`,
  `--font-dot`, para tener utilidades (`bg-losa`, `text-tinta-2`, `font-dot`).
- `@property --m`, `--mt`, `--dw` (número, heredable) para el cambio de material de K2 y el «encendido» de Doto.
- `@media (prefers-reduced-transparency: reduce)`: los vidrios oscuros pasan a sólido.

### 1.7 Fuentes

| Familia | Uso | Licencia | Carga | Peso aprox. (woff2, latin) |
|---|---|---|---|---|
| Urbanist (variable, 600) | display de losas y titulares | SIL OFL 1.1 | `next/font/google`, `display: swap`, preload | ~28 KB |
| Instrument Sans (400/500) | texto y UI | SIL OFL 1.1 | `next/font/google`, `swap`, preload | ~30 KB |
| Doto (variable `wght` + eje `ROND`) | cifras, fechas, reloj (≥ 20 px) | SIL OFL 1.1 | `next/font/google` con `axes: ["ROND"]`, `display: optional`, sin preload | ~6–10 KB |
| Lockup del nombre (pendiente, D6) | solo `NameLockup` | todas las opciones de `B-tipo` son OFL (Mona Sans, Instrument Serif, Big Shoulders Stencil, Geologica, Doto, Anybody, Bodoni Moda) | `app/fonts/lockup.ts` reexporta **una** definición (`lockup-urbanist.ts` por defecto); cambiarla = una línea | 0 KB extra con Urbanist; Mona Sans ~98 KB (subconjunto/peso fijo si se elige) |
| Archivo + Geist Mono | **solo /cv y su PDF** (y casos hasta F7) | OFL (ya en `scripts/cv-fonts/OFL-*.txt`) | sin cambios | — |

- Se copia el texto OFL de cada familia nueva a `src/app/fonts/licencias/` (requisito de redistribución al autoalojar).
- **Verificar antes:** que el build del contenedor y de Vercel alcanza `fonts.googleapis.com` (hoy Archivo ya se baja
  así). **Plan B:** `next/font/local` con woff2 variables (latin + latin-ext) en `src/app/fonts/`, comprobando el eje
  `ROND` de Doto con fontTools (`fvar`). Los woff2 de `propuestas/fonts/` no se reutilizan sin esa comprobación.

### 1.8 Dependencias nuevas y su peso

| Paquete | Tipo | Peso | Dónde carga |
|---|---|---|---|
| `gsap@^3.15` (incluye ScrollTrigger) | dependencia | **45,3 KB gz** (core + ScrollTrigger, medido en 03 §2.1) | `import()` diferido **solo** en `/` y `/en`, ≥ 1024 px, sin RM, tras el LCP. Licencia «Standard no-charge» de GSAP (uso comercial gratis; no OSI). Empaquetado (CSP: nada de CDN). |
| `sharp` | devDependency | 0 KB en cliente | `scripts/build-hero-poster.ts` (AVIF/WebP del póster horneado y del retrato de K13). |
| Código propio WebGL (`VidrioGL` + `lib/gl`) | — | ~5 KB gz | diferido (`dynamic`, `ssr: false`). |
| `@gsap/react` | **no se añade** | — | `gsap.context()` + `gsap.matchMedia()` en `useScrollScene` cubren lo mismo. |
| framer-motion / three / R3F / Lenis / OGL | **no** | — | Descartados en 03 §2. |

Presupuesto de JS inicial de `/`: **≤ baseline de F0 + 15 KB gz** (las islas K15, reloj, carrusel, header, rail,
dock). GSAP y WebGL no cuentan porque no se piden antes del LCP; se verifica en la prueba de rendimiento.

### 1.9 Upgrade de next / react

- `next 16.3.5 → 16.4.x` (último parche), `react` y `react-dom 19.2.6 → 19.3.x`, `eslint-config-next → 16.4.x`,
  `@types/react(-dom)` al par. Motivo: `<ViewTransition>` de React 19.3 (03 §2.2) para el morph de página y los
  fundidos de entrada/salida de rutas. **La hoja no depende del upgrade** (anima con CSS, B no usa morph).
- Riesgos: (1) cambio de forma de `experimental.globalNotFound` (¿estable en 16.4?) → E5 y los dos 404 lo vigilan;
  (2) `next/image`: en Next 16 `priority` está deprecado a favor de `preload` → revisar avisos del build; (3) cambios
  de lint de `eslint-config-next`; (4) la salida de `next build` ya no imprime «First Load JS» → el presupuesto se mide
  en Playwright.
- **Verificar antes:** `node -e "console.log(typeof require('react').ViewTransition)"` ≠ `undefined` tras el upgrade.
- **Plan B:** quedarse en 16.3.5/19.2.6 sin `<ViewTransition>`: navegación instantánea + `@view-transition
  { navigation: auto }` para las duras. Nada de B depende de esto.

---

## 2. Fases

Convenciones para **todas** las fases:

- **Ejecuta:** ejecutor frontend (un agente). **QA después:** QA visual (capturas) y, luego, crítico
  (refactoring-ui + web-design-guidelines + emil/motion). El orquestador aprueba la fase antes de la siguiente.
- **Capturas** en `tests/shots/rediseno/F<n>/` con `scripts/shots-rediseno.ts` (nuevo en F0): 390×844, 1024×768,
  1440×900 (+ 1280×720 y 1920×1080 desde F3), ES y EN, con y sin reduced-motion, DPR 1, JPG q 82, página completa y
  primer pliegue.
- **Puerta común de cada fase** (además de sus criterios): `npm run lint` y `npm test` verdes; `npm run build` sin
  errores ni avisos nuevos; `npx playwright test` verde **o** con cada prueba cambiada/retirada listada en la fase con
  su motivo; axe sin violaciones (`wcag2a/aa, 21a/aa, 22aa`) en las rutas tocadas; sin errores de consola; sin desborde
  horizontal 320–1920; `/cv`, sus 6 PDFs de `public/cv/` y los dos 404 idénticos al baseline (`print.spec`, `i18n I6`,
  `seo E5`, captura de `/cv` a 1440 sin diferencias fuera del header).
- Commit por fase en la rama de trabajo cuando el orquestador lo apruebe. **Nada de push a `main` ni deploy.**

### F0 · Base técnica y línea de base

**Objetivo.** Dejar el repo listo para construir sin cambiar nada visible: upgrade, dependencias, scripts de QA y una
línea de base medida.

**Archivos.**
- Modificar: `package.json` y `package-lock.json` (upgrade §1.9; `gsap`; `sharp` dev; scripts `test:e2e`
  = `next build && playwright test`, `shots:rediseno`, `hero:poster`), `next.config.ts` (cabecera
  `/hero/:rest*` → `public, max-age=31536000, immutable`, porque los nombres irán versionados; revisar
  `experimental.globalNotFound` en 16.4).
- Crear: `scripts/shots-rediseno.ts` (matriz de capturas), `tests/e2e/perf.spec.ts` (mide LCP con
  `PerformanceObserver`, elemento LCP, CLS, bytes de JS/imagen transferidos antes de `load`, con CDP: Slow 4G y CPU ×4
  en móvil), `tests/out/baseline-F0.json` (resultado).
- No se borra nada.

**Criterios de aceptación.**
- `npm test` (vitest, 9 archivos) y los 17 specs de Playwright **verdes antes y después del upgrade** (si alguno ya
  estaba rojo en la rama, se documenta en `tests/out/baseline-F0.json` y no cuenta como regresión).
- Capturas «antes» de `/`, `/en`, `/work/olbo`, `/cv` a 390/1024/1440.
- Baseline registrado: LCP de `/` móvil y escritorio, JS inicial de `/` (KB gz), CLS.
- `typeof React.ViewTransition !== "undefined"` (o se activa el plan B y se anota).

**Pruebas nuevas.** `perf.spec.ts` (solo mide y escribe JSON en F0; aserciones desde F3).

**Riesgos / plan B.** Upgrade rompe build o pruebas → fijar 16.4 al parche anterior; si persiste, plan B de §1.9.
`sharp` sin binario en el contenedor → `npm rebuild sharp`; si falla, el póster se genera con el `<canvas>` →
`toDataURL("image/webp")` desde Playwright y AVIF se pospone (WebP q 78 cumple el presupuesto).

**QA.** Visual: comparar capturas antes/después del upgrade (deben ser idénticas). Crítico: no aplica (sin cambios de UI).

---

### F1 · Sistema de diseño en código (tokens, fuentes, `NameLockup`, primitivas, datos)

**Objetivo.** Tener el lenguaje de B como código reutilizable, verificable en una página de laboratorio, **sin tocar
las rutas públicas**.

**Archivos.**
- Modificar: `src/app/globals.css` (capa §1.6, aditiva), `src/components/pages/RootDocument.tsx` (variables de las
  fuentes nuevas en `<html>`; Archivo/Geist siguen), `src/data/site.ts` (`rolCorto`, `availability.modo`),
  `src/i18n/dictionaries.ts` (claves nuevas de §1.5, ES/EN).
- Crear: `src/app/fonts/{urbanist,instrument,doto,lockup,lockup-urbanist}.ts`, `src/app/fonts/licencias/*.txt`,
  `src/components/marca/{NameLockup,Wordmark}.tsx`, `src/components/sistema/{Losa,BentoCard,DotMatrix,Estado,Boton,Flecha,Etiqueta,Iconos}.tsx`,
  `src/data/{decisiones,home,hero,perfil}.ts`, `src/lib/spring.ts` (+ `stepCritical`),
  `src/app/(es)/lab/page.tsx` (catálogo: superficies, tipos, Doto, botones, card en reposo/hover/foco, `NameLockup` en
  sus tres escalas; `notFound()` salvo `process.env.DG_LAB === "1"`; `robots: noindex`; fuera del sitemap).
- Pruebas: `src/data/__tests__/{decisiones,home,hero,copy.sinMarcadores}.test.ts`,
  `src/lib/__tests__/spring.critical.test.ts`.

**Criterios de aceptación.**
- Rutas públicas **sin cambio visual** (capturas F0 = F1 en `/`, `/work/olbo`, `/cv`).
- `/lab` con `DG_LAB=1` a 390/1024/1440: tokens y escalas iguales a la maqueta (QA compara contra
  `propuestas/B/shot_B_1440_os.jpg` por superficie); sin `DG_LAB` → 404.
- Contraste medido en el lab: todos los pares de NOTAS §3 ≥ lo que dicen; párrafos > 40 car. ≥ 7:1 (§0).
- Doto nunca < 20 px (`[data-dot]` medido en el lab a 390 y 1440).
- `NameLockup`: cambiar `lockup.ts` a otra opción de `B-tipo` (prueba local, sin commit) no rompe el lab ni la medida
  del FLIP (alto y ancho se leen del DOM).
- vitest: `theme.tokens`, `data.singleSource` e `i18n.parity` verdes sin cambiarlos; nuevas verdes.

**Riesgos / plan B.** El primer `:root {` cambia por accidente y rompe `theme.tokens` → los tokens van en un bloque
nuevo después de la línea 87. Descarga de Google Fonts bloqueada en el build → `next/font/local` (§1.7).

**QA.** Visual: lab a 390/1024/1440 (ES). Crítico: escala tipográfica, radios concéntricos, contraste, materiales.

---

### F2 · Rutas nuevas: `/work`, `/about`, `/experience` (ES/EN)

**Objetivo.** Que existan y sean buenas las puertas del tablero antes de construirlo, con el sistema de F1. El home
actual sigue intacto; las páginas nuevas ya se pueden visitar por URL.

**Archivos.**
- Crear: `src/app/(es)/{work,about,experience}/page.tsx`, `src/app/(en)/en/{work,about,experience}/page.tsx`,
  `src/components/pages/{WorkIndexPage,AboutPage,ExperiencePage}.tsx`, `src/components/trabajo/FiltroCasos.tsx`
  (cliente: chips «Escala · Producto propio · Anteriores» con `aria-pressed`; sin JS se ven todos; sin query params),
  `src/components/trayectoria/{LineaTiempo,Era}.tsx` (`<ol>` accesible, línea `aria-hidden`, escritorio horizontal sin
  pin, móvil vertical con año sticky; 02 §5.5).
- Modificar: `src/lib/metadata.ts` (`workMetadata`, `aboutMetadata`, `experienceMetadata` con títulos/descripciones de
  04 §4.6, descripciones compuestas con datos), `src/lib/personJsonLd.ts` (+ `ProfilePage` para `/about`, `ItemList`
  para `/work`; mismo `@id` de Person), `src/app/sitemap.ts`, `public/portrait/` (+ `perfil-83a47bc7-v1-{640,1080}.avif/webp`
  generado con `sharp` desde `retratos-hf/83a47bc7.jpg`).
- Pruebas: `tests/e2e/matrix.ts` (+ `/work`, `/about`, `/experience` a `ROUTES`), `tests/e2e/seo.spec.ts` (E3
  esperado + 6 URLs; E1 por ruta; E2 `ProfilePage` en `/about`, `ItemList` en `/work`).

**Criterios de aceptación.**
- Las 6 rutas responden 200, con `<html lang>` correcto, `title`/`description` de 04 §4.6, `hreflang` y canonical.
- Contenido 100 % de datos: orden de casos = `home.ordenCasos` en `/work`; `/experience` = `cv.ts` con `formatPeriod`;
  ningún marcador (`copy.sinMarcadores`).
- Capturas 390/1024/1440 ES y EN, con y sin RM. axe sin violaciones en las 6. `a11y 3.1` (≥ 7:1) y `3.6` (≥ 44 px) verdes.
- Cada card de `/work` enlaza a `/work/[slug]` (página completa: aún no hay hoja); los casos NDA muestran «NDA».
- Lighthouse (o `perf.spec`) en `/about`: LCP < 2,0 s móvil, CLS < 0,02.

**Riesgos / plan B.** Duplicar `ProfilePage` (`/cv` ya lo tiene, E2) → mantener los dos con el mismo `mainEntity`. Si
Doug prefiere `/experience` dentro de `/about` (D3): la ruta pasa a `redirect` permanente a `/about#experience`.

**Paralelo.** Puede correr a la vez que **F4** (archivos disjuntos).

**QA.** Visual: 6 rutas × 3 anchos × ES/EN × RM. Crítico: jerarquía de `/about`, legibilidad del timeline, filtro.

---

### F3 · Tablero OS estático + cromo nuevo (reemplaza el shell horizontal)

**Objetivo.** El home es el OS de B **en su estado final** (el mismo que verán reduced-motion y sin JS), con cabecera
pill, rail, dock, footer y móvil «app». El retrato es el póster provisional con franjas CSS (sin WebGL todavía). Es la
fase que retira el shell y reescribe sus pruebas.

**Archivos.**
- Crear: `src/components/tablero/*` (§1.3), `src/components/chrome/{RailAcciones,DockMovil,SiteFooter}.tsx`,
  `src/components/hero/{HeroPoster,VidrioCss}.tsx` (póster = `199598aa` convertido a AVIF/WebP versionado en
  `public/hero/199598aa-v1/`, sin hornear aún), `src/components/escena/Escena.tsx` (solo estado OS).
- Reescribir: `src/components/pages/HomePage.tsx`, `src/components/SiteHeader.tsx` → `components/chrome/SiteHeader.tsx`
  (actualizar import en `RootDocument`), `src/components/LanguageSwitch.tsx` (conserva ruta **y hash**; usa
  `activeSection`).
- Borrar: lo de §1.4 salvo Velaris/HeroField (F4); el CSS del shell y del rail viejo en `globals.css`;
  `src/data/sections.ts` (migrar `i18n.parity` a `home.secciones`).
- Pruebas que se reescriben (motivo: el shell horizontal ya no existe):
  - `keyboard 6.2–6.5` → nuevas `6.2` orden de Tab = orden del DOM (K2, K1, K3…), `6.3` Enter en una card navega,
    `6.4` cada sección tiene un tabulable, `6.5` las pills con Enter llevan el foco a su sección.
  - `recheck R4/R5`, `recheck2 R4b` → retirados (cubiertos por los nuevos 6.x); `R1` conserva el conteo de landmarks.
  - `i18n I3` → «el switch conserva el **ancla** de la sección» (`/#work` → `/en#work`) usando las pills.
  - `layout 5.3–5.4` (geometría del shell) → `5.3` el OS a 1440×900 cabe en el pliegue (6 filas), `5.4` ninguna
    `.tarjeta` recorta (`scrollHeight ≤ clientHeight + 1`) a 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080.
  - `measure M2` (resplandor del héroe viejo) → retirada; `M3` (rojos) se queda como medida informativa.
  - `hero320.spec` → foto a sangre + K2 sin desborde a 320.
  - `settle.ts` → quitar la caminata de `[data-hshell]`.
  - `content X2` → se mantiene en F3 (la card de olbo lleva a la página completa); se reescribe en F6.
  - `visual.spec` → regenerar (no tiene línea base comprometida).
- Pruebas nuevas: `tests/e2e/tablero.spec.ts` (orden DOM, K5 fusionada, reloj con `aria-label`, carrusel móvil con
  contador y botones, dock aparece al salir del héroe, pills con `aria-current`, «Ver casos» y skip link llevan al OS).

**Criterios de aceptación.**
- Fidelidad a B: capturas 1440×900, 1280×720, 1024×768, 390×844 comparadas lado a lado con `shot_B_1440_os.jpg`,
  `shot_B_1280x720_os.jpg`, `shot_B_1024_os.jpg`, `shot_B_390_completa.jpg` (layout 1024–1279 de P0-1; K5+K6
  fusionadas; K13 con `83a47bc7`; K3 con flecha en tinta; K9 con flecha; rail en gris salvo «Hablemos»).
- Test de 5 s en el primer pliegue a 1440 y 390: nombre, H1 real «Doug Vargas. Dirijo el producto…», línea de nivel,
  Mercadolibre, disponibilidad y los dos CTA visibles; a 390×664 el CTA queda por encima de y = 664.
- Móvil: altura total ≤ 6 pantallas de 844 (≤ 5.064 px) a 390; 0 toques < 44 px (`a11y 3.6`).
- Un solo nombre visible por pantalla en escritorio (P1-4); disponibilidad una vez en el pliegue (P1-5).
- `motion 7.1/7.5` verdes; `a11y 3.1` ≥ 7:1; `content 10.1/10.5/10.7` verdes; axe limpio en `/` y `/en`.
- `perf.spec`: LCP = póster; LCP < 2,0 s móvil (Slow 4G, CPU ×4) y < 1,2 s escritorio; CLS < 0,02; JS inicial ≤
  baseline + 15 KB gz; póster ≤ 120 KB a 1080 px.
- `/cv` y los PDFs sin cambios (el header nuevo se oculta al imprimir: `print 8.1–8.3`, `recheck R3`).

**Riesgos / plan B.** Las pruebas del shell son muchas: el ejecutor entrega la lista de cada prueba cambiada con su
motivo. Si el layout 1024–1279 no cabe con el copy EN, se aplica el `--t-30` del claim y el K3 sin captura (P0-1).

**QA.** Visual: matriz completa (5 anchos de escritorio + 390, ES/EN, RM y sin RM). Crítico: puntuación con la plantilla
de 06; objetivo ≥ 8,5 en estado OS.

---

### F4 · Héroe: vidrio estriado WebGL2, respaldos y foto por configuración

**Objetivo.** El vidrio de B sobre la losa K1 (escritorio) y la foto a sangre (móvil): WebGL2 de un pase con lente al
cursor y equivalente táctil, respaldo CSS y póster horneado como LCP. La foto se cambia solo con `src/data/hero.ts`.

**Archivos.**
- Crear: `src/lib/gl/{programa,textura,vidrioShader}.ts`, `src/lib/escena.ts` (geometría pura: `placement` para
  `cine`/`losa`/`movil`, `frame(p)`), `src/components/hero/{VidrioGL,useLente}.ts(x)`,
  `scripts/build-hero-poster.ts` (Playwright abre un arnés con el mismo shader y la foto de `hero.ts`, toma el canvas
  en estado `losa`/`movil` y `cine` a 1440×900; `sharp` → AVIF q 55–60 y WebP q 78 en 640/1080/1600/1920, sin pasar
  del ancho nativo de la foto; escribe `public/hero/<id>-<version>/…` y un `manifest.json`),
  `src/lib/__tests__/escena.test.ts`.
- Modificar: `HeroPoster.tsx` (usa el póster horneado), `K1Retrato.tsx` y la cabecera móvil del tablero (montan
  `VidrioGL` diferido), `src/data/hero.ts` (rutas reales del manifest).
- Borrar: `src/components/hero/{HeroField,Velaris}.tsx` (su ciclo de vida —DPR ≤ 1,5, `IntersectionObserver`,
  `visibilitychange`, RM— queda en `VidrioGL`).
- Pruebas nuevas: `tests/e2e/vidrio.spec.ts` con proyectos de lanzamiento: (a) Chromium normal (canvas visible tras el
  fundido, póster sigue siendo el LCP); (b) `--disable-webgl` → póster + `VidrioCss` visibles, sin errores; (c) RM → un
  solo cuadro, sin bucle rAF tras 1 s (contador expuesto en `data-cuadros` del canvas), `getAnimations()` vacío;
  (d) `hasTouch` → arrastre vertical hace scroll, horizontal mueve la lente; (e) `webglcontextlost` simulado
  (`WEBGL_lose_context`) → respaldo CSS. Una prueba de **cambio de foto**: un preset de prueba con otra imagen 3:4 del
  repo (`retratos-hf/a4ef948f.jpg` en un fixture) renderiza sin tocar componentes.

**Criterios de aceptación.**
- Capturas 1440 (cursor sobre la cara y fuera), 1024, 390 (con arrastre): ojos limpios, láser continuo de lado a lado
  (zona nítida + banda horizontal), sin aberración fuera de la foto (P2-11).
- 0 fps en reposo (el bucle se detiene); en SwiftShader `failIfMajorPerformanceCaveat` deja el respaldo (comportamiento
  esperado en el contenedor). **Medición en hardware real pendiente** (MacBook de Doug, Android medio): ≥ 55 fps p50.
- LCP sigue siendo el `<img>` del póster; el canvas entra después (`perf.spec`), no antes del evento `load`.
- Cambiar de foto = editar `hero.ts` + correr `npm run hero:poster`; ningún número de la foto en componentes (grep de
  `0.418`, `880`, `1168` fuera de `src/data/hero.ts` = 0).
- Sin `blob:` (CSP `img-src`), texturas desde el mismo origen; S2/S4 verdes.

**Riesgos / plan B.** GPU débil o SwiftShader → respaldo CSS (ya diseñado). El póster horneado no coincide al píxel con
el primer cuadro WebGL (franjas en espacio de pantalla vs. imagen) → el fundido de 400 ms lo tapa; si se nota, el póster
es la foto limpia + `VidrioCss`. Safari/`mask-composite` → probar en F8; respaldo final: póster sin máscara nítida.

**Paralelo.** Puede correr a la vez que **F2**. Si F3 no ha terminado, se desarrolla contra `/lab` (F1).

**QA.** Visual: 1440/1024/390, con cursor, con arrastre, RM, sin WebGL. Crítico: legibilidad de la cara y del láser,
material del vidrio, que la lente no sea lúdica (decisión de Doug: sobria).

---

### F5 · Acto 1 «cine» y scroll anclado (escritorio ≥ 1024)

**Objetivo.** La apertura de B: cara a pantalla completa con nombre XL y K2 de vidrio oscuro; entrada por tiempo
(≤ 1,1 s); scroll anclado de 1 viewport que lleva al OS armado de F3. Robusto de 1024 a 1920 y al redimensionar.

**Archivos.**
- Crear: `src/components/escena/{EscenaCliente,useScrollScene}.ts(x)`, `src/components/escena/sceneInit.ts`.
- Modificar: `Escena.tsx` (estado `html.cine` en CSS: foto a pantalla completa, K2 en vidrio, nombre XL, velo,
  indicador «Desliza»), `HomePage.tsx` (script inline de `sceneInit` antes de la escena; `EscenaCliente` en
  `requestIdleCallback`), `RailAcciones.tsx` (`inert`), `K2Claim.tsx` (`--m`/`--mt`), `VidrioGL.tsx` (recibe `p` de la
  escena: ángulo 12° → 0°, estría 64 → 30 px, joroba de fuerza +0,30, fase +140 px, radio de lente 240 → 150),
  `tests/e2e/settle.ts` (si existe `[data-escena-fin]`, deja la página al final del ancla en vez de en 0).
- Timeline (NOTAS §2 con los cambios de §7, que mandan): pin de 1 viewport, `scrub: 0.3`, snap **no direccional**
  `{ snapTo: [0, 1], delay: 0.05, duration: { min: 0.2, max: 0.45 }, ease: "power2.out" }`; foto 0 → 0,72 `eio`;
  K2 viaja 0 → 0,6 y cambia material con `--m` 0,30 → 0,52 y `--mt` de golpe en 0,41 (P1-2); nombre XL por FLIP a
  K1, escala medida, `y0 = max(88, …)` y 96 px con alto ≤ 800 (P0-1); losas solo con opacidad, `y 24 → 0`, escala
  .96 → 1 y `--dw`, **sin blur**, inicios fijos K3 0,30, K4 0,36, K5 0,42 y todo antes de 0,72 (P1-1); rail 0,5 → 0,8.
- Robustez (P0-2, P1-14): `invalidateOnRefresh`, `onRefresh` sincroniza el progreso, `ResizeObserver` →
  `ScrollTrigger.refresh()` con debounce; `gsap.matchMedia("(min-width: 1024px) and (prefers-reduced-motion:
  no-preference)")` revierte al OS al cruzar 1024 o activar RM; foco dentro de una losa con p < 1 → salto al fin del
  ancla + `tween.progress(1)`; «Ver casos» y el skip link igual; si GSAP no carga en 4 s o lanza → quitar `html.cine`.
- Pruebas nuevas: `tests/e2e/escena.spec.ts`:
  - sin RM a 1440×900: acto 1 visible (nombre XL bajo y = 88, CTA en pantalla); rueda hasta el final → OS idéntico a
    F3 (comparación de rects de K1–K5 con tolerancia 1 px);
  - resize en el OS 1440×900 → 1280×800 → la foto queda en su losa (P0-2); 1100 → 900 px de ancho → layout móvil sin
    restos de transform;
  - Tab desde la carga: ninguna de las 12 primeras paradas es invisible (opacidad < 0,99 o fuera de pantalla);
  - rueda de 40 px → vuelve a 0 sin salto largo (scrollY final ≤ 40 en ≤ 1 s); desde la mitad termina el viaje;
  - contraste de K2 durante el cruce (p = 0,36, 0,41, 0,46) ≥ 4,5:1 (medido con el método de 06);
  - GSAP bloqueado (`page.route("**/gsap*", abort)` sobre el chunk) → OS armado, sin errores;
  - RM y JS desactivado (`javaScriptEnabled: false`) → OS armado desde el primer píxel, sin pin.
  - `perf.spec`: el chunk de GSAP **no** se pide antes del LCP, ni con RM, ni a < 1024 px.

**Criterios de aceptación.**
- Capturas de fotogramas 0 / 25 / 60 / 100 % a 1440 (como `shot_B_1440_scroll_*`), primer pliegue a 1920×1080,
  1440×900, 1366×768, 1280×720, 1024×768, ES y EN: sin recortes, nombre XL nunca bajo la cabecera.
- Todas las pruebas de `escena.spec` verdes; `motion 7.1/7.5`, `keyboard 6.x`, `a11y` verdes.
- LCP sin regresión frente a F4 (el pin no se monta antes del LCP; el póster del acto 1 es el LCP).

**Riesgos / plan B.** El pin es la parte frágil de B (06: robustez 6). Si a fin de fase no pasa la matriz de resize y
teclado: **plan B = recomendación «híbrido» de 05** (una sola transición foto → K1 sin cambio de material de K2, sin
FLIP del nombre), con el mismo código y menos pistas en el timeline. Plan C: sin ancla (OS de F3 con el acto 1 como
cabecera que se desplaza). Smooth scroll: no se añade nunca.

**Paralelo.** Puede desarrollarse a la vez que **F6** (dueños: F5 = `escena/*`, `hero/*`, `RailAcciones`, `K2Claim`;
F6 = `app/**/@modal`, `hoja/*`, `case/CaseBody`, `pages/CasePage`). Archivo compartido: `BentoCard.tsx` (F6 solo añade
el `onClick` de origen) → se integra F5 primero.

**QA.** Visual: fotogramas y matriz de anchos; un vídeo corto (Playwright `recordVideo`) del ancla a 1440 para el
crítico. Crítico: coreografía (≤ ⅓ de elementos moviéndose a la vez), curvas y duraciones, snap.

---

### F6 · Casos en hoja con URL real (rutas interceptadas + paralelas)

**Objetivo.** Desde el tablero (y desde `/work`, `/about`, `/experience`), una card de caso abre la hoja de B con la URL
`/work/[slug]`; Atrás la cierra; recargar o abrir el enlace muestra la página completa existente.

**Archivos.**
- Crear: `src/app/(es)/@modal/{default.tsx,(.)work/[slug]/page.tsx}`, `src/app/(en)/en/layout.tsx`,
  `src/app/(en)/en/@modal/{default.tsx,(.)work/[slug]/page.tsx}` (ambas páginas con `generateStaticParams` desde
  `caseStudies`), `src/components/hoja/{CaseSheet,useArrastreHoja,origen}.ts(x)`, `src/components/case/CaseBody.tsx`.
- Modificar: `src/app/(es)/layout.tsx` (`{ children, modal }`), `src/components/pages/CasePage.tsx` (envuelve
  `CaseBody` en `<main id="main">` + JSON-LD), `src/components/case/CaseNext.tsx` (prop `enHoja`: `<Link replace>` en
  hoja, `<a>` en página completa; §1.2), `src/components/sistema/BentoCard.tsx` (guarda el origen del foco),
  `globals.css` (hoja: entra 420 ms `--curva-hoja` con velo blur 8, sale 280 ms; `@starting-style` +
  `transition-behavior: allow-discrete`; RM → fundido 150 ms; `html:has(dialog[open]) { overflow: hidden }` con
  `scrollbar-gutter: stable` para no mover el pin; móvil: desde abajo con arrastre).
- Pruebas: `content X2` reescrita (motivo: desde el home el caso abre en hoja): `X2a` clic en la card de olbo → URL
  `/work/olbo`, `dialog[open]`, la rueda desplaza el cuerpo de la hoja; `X2b` carga directa de `/work/olbo` → página
  completa y la rueda desplaza la ventana. Nueva `tests/e2e/hoja.spec.ts`: foco inicial en Cerrar; Tab atrapado; Esc,
  X, velo y Atrás cierran y devuelven el foco a la card; `scrollY` del tablero intacto tras cerrar; recarga con la hoja
  abierta → página completa con una sola `<main>`; Ctrl/Cmd+clic abre pestaña con la página completa; «Siguiente» en la
  hoja reemplaza (Cerrar vuelve al tablero, no al caso anterior); «Siguiente» en página completa no abre hoja; EN igual
  bajo `/en`; slug inexistente → 404 real; `seo E5` verde; arrastre de 140 px en móvil cierra; RM → fundido.

**Criterios de aceptación.**
- Capturas: hoja de Naowee, Andes (NDA), olbo, DC Medical a 1440 y 390, ES y EN (comparar con `shot_B_1440_hoja.jpg`,
  `shot_B_390_hoja.jpg`); página completa de los mismos por URL directa sin cambios frente a F5.
- `hoja.spec` y X2a/X2b verdes; axe sin violaciones con la hoja abierta; `R1` (una `main#main`) verde en página completa
  y en el home con hoja abierta (la hoja no tiene `<main>`).
- La hoja no rompe el pin ni la lente (al cerrar, el tablero sigue en el mismo progreso).
- Sin peticiones extra al abrir (la ruta del slot está prerenderizada; prefetch de `Link`).

**Riesgos / plan B.** Conducta de la interceptación distinta a §1.2 en la versión instalada (ver «Verificar antes» de
§1.2). Plan B: la hoja como **componente cliente** abierto por el `onClick` de la card con `history.pushState` a
`/work/[slug]` (URL real y compartible; recarga → página completa) y `popstate` para cerrar; el contenido de la hoja se
pide con el payload RSC de la ruta o con un `fetch` a un JSON estático generado en build. Peor que el patrón de Next,
pero sin dependencias de su router.

**QA.** Visual: hoja en 4 casos × 2 anchos × ES/EN × RM. Crítico: hoja (tiempos, velo, progreso láser, arrastre),
teclado y lector de pantalla (VoiceOver en Safari en F8).

---

### F7 · Casos, páginas y transiciones al sistema B

**Objetivo.** Que la página completa del caso, la hoja y las páginas nuevas compartan el lenguaje de B (tokens,
tipografía, losas) sin perder la plantilla actual, y que las navegaciones tengan sus transiciones. Aplica las
decisiones de tema y 404.

**Archivos.**
- Modificar: `src/components/case/*` (migrar `--paper/--ink/--signal/--ease-out` a los tokens B; títulos en Urbanist,
  texto en Instrument Sans, KPIs en `DotMatrix`; `CaseImpact` como tablero de cifras en losas; `CaseNda` con el jelly
  azul de K4), `src/components/work/*` (marcos sobre losas), `src/components/pages/{CaseNotFound,NotFoundContent}.tsx`
  + diccionario (copy 404 de 04 §4.5; el chiste de la máscara se retira porque ya no hay máscara → «Aquí no hay nada.»
  / «Nothing here.» como valor por defecto, D17), `globals.css` (`@view-transition { navigation: auto; }` para es ↔ en
  y para el `<a>` de `CaseNext`; `::view-transition-*` para `<ViewTransition>`), `WorkIndexPage.tsx` (card → página
  completa con `<ViewTransition name={"caso-" + slug}>` en la media cuando la hoja no aplica: Cmd+clic no, solo
  enlaces «Ver página completa» de la hoja), `SiteHeader.tsx` (D4: `ThemeToggle` solo en `/cv`),
  `src/app/(es|en)/layout.tsx` (`themeColor` `#060608` en rutas B si D4 se confirma; actualizar `theme.tokens` con
  motivo).
- **Opcional, separable (02 §5.3):** reordenar la plantilla (decisiones antes de la galería, índice lateral fijo con
  progreso, pastilla con hoja en móvil). Se hace solo si el orquestador lo aprueba; si no, queda como fase posterior.
- **No se toca:** `src/components/cv/*`, `CvPage.tsx`, `public/cv/*`, `scripts/build-cv-pdf.ts`, `scripts/cv-fonts/*`,
  el bloque de impresión de `globals.css`.
- Pruebas: `layout 5.5` y `sticky S1` (ojo sticky de «Decisiones clave») → revisar con la plantilla re-maquetada;
  `frames F1–F3`, `measure M1` (marcos de `/work/chub`) → actualizar medidas si cambian radio/sombra, con motivo;
  `motion 7.4` verde; `visual` regenerada; `theme.tokens` actualizada si cambia `themeColor` o el primer `:root`.

**Criterios de aceptación.**
- Capturas de `ROUTES` completas (los 5 casos de la matriz + `/work`, `/about`, `/experience`) a 390/1024/1440,
  ES/EN, RM: mismo sistema que el tablero; ningún caso pierde contenido frente a F0 (conteo de `h2`, imágenes y KPIs
  por caso igual al baseline).
- `/cv` a 1440 en tema claro y oscuro y su impresión: idénticos a F0 salvo la cabecera; `print 8.0–8.5` verdes.
- Morph de la media al pasar de `/work` a un caso (Chromium) en 400 ms `--curva-io`; RM → fundido 200 ms; navegador
  sin API → navegación instantánea.
- `a11y` completo verde en tema `dark` y `light` (las superficies B ignoran `data-theme`; `/cv` sigue respondiendo).

**Riesgos / plan B.** La re-maquetación de casos es la fase más larga en archivos: si no cabe en una ronda, se divide en
F7a (tokens y tipografía, sin mover bloques) y F7b (orden de 02 §5.3). Si `<ViewTransition>` no está (plan B de §1.9),
se omite el morph.

**QA.** Visual: matriz completa de `ROUTES`. Crítico: plantilla de caso con la lente de reclutador (02 §2) y director
de diseño.

---

### F8 · Endurecimiento, SEO, rendimiento y limpieza

**Objetivo.** Cerrar: imagen OG nueva, rendimiento medido, navegadores reales, accesibilidad completa, documentación y
limpieza del andamiaje.

**Archivos.**
- Crear/actualizar: `public/og.png` y `public/og-en.png` (versión estática del héroe con nombre y claim, generada
  desde el póster con `scripts/og/`), `src/lib/metadata.ts` (OG por idioma), `README.md` (stack real: sin Framer,
  R3F ni Lenis; con GSAP diferido, WebGL propio, rutas interceptadas, `hero.ts`, `decisiones.ts`; sin «Dribbble» por
  `data.singleSource`), `docs/rediseno-2026/08-ENTREGA.md` (qué cambió, cómo cambiar foto/lockup/decisiones, pendientes).
- Borrar: `src/app/(es)/lab/page.tsx`, código muerto (grep de imports huérfanos), CSS sin uso.
- Pruebas: `seo E1/E2` con OG nuevo; `perf.spec` con aserciones finales; navegadores: proyectos de Playwright
  `webkit` y `firefox` para `/`, `/en`, hoja y `/work/olbo` (smoke: sin errores, OS visible, hoja abre/cierra).

**Criterios de aceptación.**
- Lighthouse móvil (Moto G Power, Slow 4G) en `/`, `/en`, `/work/naowee-suid`, `/about`: Performance ≥ 90,
  Accesibilidad 100, Buenas prácticas ≥ 95, SEO 100; **LCP ≤ 2,0 s**, CLS ≤ 0,02, TBT ≤ 200 ms. Escritorio: LCP ≤ 1,2 s.
  Si Lighthouse no está disponible en el contenedor, `perf.spec` con los mismos umbrales y Doug corre Lighthouse en su
  máquina (queda en el checklist).
- `npm test` + `npx playwright test` (chromium, webkit, firefox) verdes; axe limpio en todas las rutas ES/EN y con hoja.
- WebKit: `mask-composite`, `@starting-style`, `dialog` y el ancla funcionan o caen al respaldo documentado.
- Ningún `/lab`, ningún `DG_LAB`, ningún marcador de copy, ningún `console.log` en `src/`.

**QA.** Visual: matriz final completa (§5). Crítico: puntuación final con la plantilla de 06 (objetivo ≥ 8,6, el
estimado del crítico tras P0/P1).

---

## 3. Orden, dependencias y paralelización

```
F0 ──► F1 ──┬──► F2 ──┐
            │         ├──► F3 ──┬──► F5 ──┐
            └──► F4 ──┘(F4 usa /lab si F3 no está)   ├──► F7 ──► F8
                                └──► F6 ──┘
```

| Fase | Depende de | En paralelo con | Nota |
|---|---|---|---|
| F0 | — | — | Bloquea todo (upgrade y línea de base). |
| F1 | F0 | — | Bloquea todo lo visual. |
| F2 | F1 | **F4** | F3 enlaza a sus rutas: F3 empieza cuando F2 está aprobada. |
| F4 | F1 | **F2**, y F3 en su tramo final | Archivos disjuntos (`hero/*`, `lib/gl`, `scripts/`). Se integra en K1 al cerrar F3. |
| F3 | F1, F2 | F4 | Fase que reescribe las pruebas del shell. |
| F5 | F3, F4 | **F6** (con dueños de archivos de §F5) | F5 se integra primero. |
| F6 | F3 | F5 | — |
| F7 | F6 (y F5 integrada) | — | Divisible en F7a/F7b. |
| F8 | todas | — | Cierre. |

QA visual y crítico de F2 y F4 pueden correr a la vez. Cada integración vuelve a pasar la puerta común completa.

---

## 4. Decisiones pendientes de Doug (valor por defecto que usa el plan)

Todas viven en `src/data/decisiones.ts` (o en el dato que se indica) y ninguna bloquea una fase.

| # | Decisión | Por defecto | Dónde se cambia | Afecta |
|---|---|---|---|---|
| D1 | Disponibilidad (04 P1) | «Disponible para consultoría» / «Open to consulting» (consultoría puntual, lo de hoy) | `site.availability` + `decisiones.disponibilidad` | K2, K5, K17, `/about` |
| D2 | Orden de casos (P2) | Naowee → Andes → olbo → BdO → DC Medical → MakeaPet; `num` y `getNextCaseStudy` sin cambios | `home.ordenCasos` | tablero, `/work` |
| D3 | `/about` y `/experience` | dos páginas separadas | `decisiones.rutasPerfil` | rutas, sitemap |
| D4 | Toggle claro/oscuro | retirado de las superficies B (home, `/work`, `/about`, `/experience`, casos, hoja); `/cv` conserva claro/oscuro y su toggle | `decisiones.temaClaroEn` | header, `themeColor` |
| D5 | Titular EN (P18) | «I direct the product. Then I build it.» | diccionario `home.claim` | K2, OG |
| D6 | Tipografía del nombre | Urbanist 600 (la de B) hasta elegir una opción de `B-tipo` (1–6) | `src/app/fonts/lockup.ts` + `decisiones.nombreLockup` | `NameLockup` |
| D7 | Imagen del héroe | `199598aa` provisional; K13 `83a47bc7` | `src/data/hero.ts` + `npm run hero:poster` | K1, acto 1, OG |
| D8 | Datos faltantes (04 §7 P5–P15) | la línea se omite; años = 12 (derivado actual); sin cifras nuevas | `src/data/*` | casos, K12, `/experience` |
| D9 | PDF del CTA del héroe (P3) | ES → con foto; EN → sin foto | `decisiones.pdfPorIdioma` | K2, rail, K17 |
| D10 | Cita de Francesca en el home (P4) | no aparece en el home (K8 sin cita; `content 10.7` intacta) | `decisiones.citaFrancescaEnHome` | K8, K15 |
| D11 | Colofón (P16) | A: «Diseñado por mí; construido con Next.js y agentes de IA que dirijo.» | `decisiones.colofon` | footer |
| D12 | Teléfono (P17) | solo en el CV, no en el home | `decisiones.telefonoEnHome` | K17 |
| D13 | Nombre en K1 (P20) | «Doug Vargas» (no el wordmark) | `decisiones.nombreK1` | K1, acto 1 |
| D14 | `title` del home en ES (P19) | `site.titleHeadline` (en inglés, como hoy) | `site.ts` | SEO |
| D15 | «Tinder para mascotas» (P21) | se queda como está en los datos | `work.ts` | MakeaPet |
| D16 | Pills del header en el home | anclas con scroll-spy y spotlight (B); fuera del home, rutas | `SiteHeader` | nav |
| D17 | Microcopy nuevo de B no validado | «Cerrar/Close», «Anterior/Siguiente», «n de 4 / n of 4», «Desliza/Scroll», K13 «Diseñador de producto que construye.», 404 sin máscara «Aquí no hay nada.» | diccionario | varias |
| D18 | KPI de olbo (P14) | se mantiene el actual | `work.ts` | K7, caso |
| D19 | «Siguiente caso» | sigue `num` (no `ordenCasos`) | `getNextCaseStudy` | casos |
| D20 | Doto mínimo | 20 px (B) en vez de 32 (02 §7.1) | token `--t-*` + prueba | cifras |
| D21 | Hoja desde `/work`, `/about`, `/experience` | sí, abre hoja | `decisiones.hojaDesdeIndices` | navegación |

---

## 5. Checklist final antes de entregar a Doug

**Pruebas y build**
- [ ] `npm run lint`, `npm test` (vitest), `npm run build` sin errores ni avisos nuevos.
- [ ] `npx playwright test` verde en chromium (y smoke en webkit y firefox); lista de pruebas cambiadas o retiradas
      con su motivo en `08-ENTREGA.md`.
- [ ] axe sin violaciones en `/`, `/en`, `/work`, `/about`, `/experience`, 5 casos, `/cv` y con la hoja abierta; ES y EN.

**Visual (capturas en `tests/shots/rediseno/final/`)**
- [ ] 390×844, 1024×768, 1280×720, 1440×900, 1920×1080 · ES y EN · con y sin reduced-motion · sin desborde (320–1920).
- [ ] Fotogramas del ancla 0/25/60/100 % y vídeo corto a 1440; resize en el OS; cruce de 1024.
- [ ] Hoja abierta (4 casos) a 1440 y 390; página completa por URL directa.
- [ ] Lado a lado con las capturas de `propuestas/B/` y puntuación del crítico ≥ 8,6.

**Comportamiento**
- [ ] Sin JS, sin WebGL, sin GSAP y con reduced-motion: OS armado, contenido completo, cero animaciones en reposo.
- [ ] Teclado: skip link, orden de Tab = orden visual, rail inerte en el acto 1, foco nunca invisible, hoja con foco
      atrapado y devuelto.
- [ ] Táctil: arrastre sobre la foto no bloquea el scroll vertical; toques ≥ 44 px; dock y carrusel.
- [ ] URL de cada caso compartible; Atrás cierra la hoja; recarga → página completa; ES ↔ EN conserva ruta y ancla.

**Rendimiento**
- [ ] LCP = póster; LCP ≤ 2,0 s móvil (Slow 4G, CPU ×4) y ≤ 1,2 s escritorio; CLS ≤ 0,02; TBT ≤ 200 ms.
- [ ] GSAP no se pide antes del LCP, ni en móvil, ni con RM; WebGL diferido; 0 fps en reposo.
- [ ] Lighthouse móvil ≥ 90 / 100 / ≥ 95 / 100 (o pendiente explícito para que lo corra Doug).
- [ ] Medición de fps en hardware real (MacBook de Doug, Android medio) — **pendiente de Doug**.

**Contenido, SEO y seguridad**
- [ ] Ningún marcador `[DATO A CONFIRMAR]`; ninguna cifra sin fuente; roles y años solo desde `src/data`.
- [ ] Sitemap con `/work`, `/about`, `/experience` (ES/EN); `hreflang`, canonical, JSON-LD (Person, ProfilePage,
      ItemList, casos); OG nuevo por idioma.
- [ ] CSP y cabeceras sin cambios salvo la caché de `/hero/` (S1–S6 verdes); nada desde otro origen; sin `blob:`.
- [ ] `/cv`, sus 6 PDFs y los dos 404 funcionan como en F0.

**Configuración y entrega**
- [ ] Cambiar la foto = `src/data/hero.ts` + `npm run hero:poster`; cambiar el lockup = `src/app/fonts/lockup.ts`;
      cambiar una decisión = `src/data/decisiones.ts`. Probado una vez cada uno.
- [ ] Sin `/lab`, sin `DG_LAB`, sin código muerto; README con el stack real.
- [ ] Todo en la rama `claude/douguizard-portfolio-redesign-9ivnau`. **Sin push a `main` ni deploy**: lo hace Doug,
      con la lista de decisiones de §4 para que confirme o cambie.
