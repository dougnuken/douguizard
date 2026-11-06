# 07 · Plan de implementación de la Propuesta B «Cine → OS»

> Planificador técnico · 5 nov 2026 · rama `claude/douguizard-portfolio-redesign-9ivnau`.
> Fuentes: `00-BRIEF.md` (gana si algo choca), `02-ESTRATEGIA-UX.md` §4–§7, `03-TECNICA.md`, `04-COPY.md`,
> `05-PROPUESTAS.md`, `propuestas/B/index.html` + `propuestas/B/NOTAS.md` (§7 manda sobre el resto de NOTAS),
> `06-CRITICA-B.md`, y el código de `src/`, `tests/`, `next.config.ts`, `package.json`.
> Este documento no cambia código. Lo revisa el orquestador y otro agente lo contrasta con el repo antes de ejecutar.
> En cada fase, la columna **«Verificar antes»** lista lo que este plan no pudo comprobar (en el contenedor no hay
> `node_modules`: no se corrió `npm test` ni Playwright al escribirlo). **Actualizado por el revisor:** lo verificable
> ya se verificó; ver la sección siguiente.
> **Actualizado el 6 nov 2026** con lo aprobado por Doug: lockup «corte láser» (F1) y páginas internas
> `propuestas/B-paginas/` (F2 y F7). Ver «Correcciones del 6 nov 2026».

---

## Revisión contra el código (5 nov 2026)

> Revisor del plan. Se instaló el repo (`npm ci`, `node_modules` queda instalado y está en `.gitignore`), se midió la
> línea de base **antes de cualquier cambio** y se contrastó cada ruta, archivo y prueba citada. Las correcciones ya
> están hechas en el cuerpo; esta sección dice qué cambió y por qué. No se tocó `src/` ni se hizo commit.

### Línea de base medida (next 16.3.5, react 19.2.6, Node 22.23.4, npm 10.9.9)

| Paso | Resultado |
|---|---|
| `npm ci` | OK, 422 paquetes en ~1 min (npm audit informa 17 vulnerabilidades; no se tocan en este plan). |
| `npm run lint` | Verde, sin avisos. |
| `npm test` (vitest 4.1.11) | **10 archivos, 149 pruebas, todas verdes** (el plan decía 9 archivos). Solo un aviso de Vite por `configLoader`. |
| `npx tsc --noEmit` | Verde. |
| `npm run build` | **Verde.** `next/font/google` **sí** alcanza Google Fonts desde el contenedor (Archivo y Geist Mono se bajan). 30 páginas estáticas/SSG. Único aviso: `Cache-Control` propio en `/_next/static/:path*` (preexistente). No imprime «First Load JS». |
| `npx playwright test` (Chromium 1243 de `/opt/pw-browsers`, que es el de `@playwright/test` 1.63.0; `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) | **261 de 267 verdes, 6 rojas**, 18,8 min con 2 workers. Las 6 son el mismo síntoma: `page.goto("/work/qrvey", { waitUntil: "networkidle" })` supera 90 s (`layout 5.1-5.2 @1024`, `security S4`, `seo E1` ES y EN, `visual qrvey 1024` dark y light). Reejecutadas aisladas, **las 29 pruebas de qrvey pasan** (45,8 s), y una carga en frío de `/work/qrvey` llega a `networkidle` en 1,3–2 s a 1024/1280/1440. Parte de la corrida coincidió con el build de la prueba mínima de §1.2 en el mismo contenedor de 4 núcleos → se tratan como **intermitentes por carga**, no como defecto; F0 lo confirma con dos corridas limpias. |

### Versiones reales en npm (5 nov)

`next` 16.4.5 (latest; existe toda la serie 16.4.0–16.4.5) · `react`/`react-dom` 19.3.1 · `@types/react(-dom)` 19.3.0 ·
`eslint-config-next` 16.4.5 · `gsap` 3.15.1 · `@gsap/react` 2.1.2 (el plan no lo añade; correcto) · `sharp` 0.35.5 ·
`@playwright/test` 1.64.1 (se queda en 1.63.0 por el navegador del contenedor). `<ViewTransition>` es **estable** en
React 19.3.1 y la guía de Next 16.4.5 lo da por soportado sin configuración. `experimental.globalNotFound` sigue
experimental en 16.4.5 con la misma forma. Detalle en §1.9.

### Prueba mínima de rutas interceptadas + paralelas (copia temporal, borrada)

Con los dos layouts raíz reales: `(es)/@modal` en el layout raíz ES y `(en)/en/layout.tsx` anidado con su
`@modal`. **Funciona**: build verde, hoja en navegación blanda, página completa en carga directa/recarga, Atrás
cierra, `router.replace` cambia de caso, los cuatro 404 de E5 y `global-not-found` intactos, `/cv` y `/en/cv` sin
hoja. Hace falta un `default.tsx` en **cada** `@modal`. Hallazgos que cambian el plan: el slot se queda «rancio» tras
navegar a otra ruta (el auto-ocultado por pathname es obligatorio), `/cv` intercepta, y `notFound()` en el slot basta
para el slug inexistente. Detalle en §1.2.

### Correcciones al plan

1. **§0 conteos:** vitest 10 archivos/149 pruebas; Playwright 267 pruebas. Se marca qué specs solo registran (`R1`,
   `R6`, `F2`, `F3`, `M1–M4`, `hero320`, `visual`, `contrast-detail`): no pueden ser criterio de aceptación sin añadirles
   aserción. El plan usaba «`R1` verde» como criterio en F6 → cambiado a `a11y 3.2–3.4` + aserción en `hoja.spec`.
2. **§0 `data.singleSource`:** «Dribbble» está prohibido en todo `src/` y en `README.md` (también en `src/data`); los
   años en palabras que vigila son solo en inglés; también prohíbe `company: "…"` literal en componentes.
3. **§0 nuevas reglas que el plan no listaba:** `a11y 3.2–3.4` exige **un solo `<footer>`** por documento (hoy:
   `Contact.tsx`, `CaseColophon`, `.cv-colophon`) → `SiteFooter` **no** va en `RootDocument`, solo en las páginas B;
   la primera parada de Tab es siempre el skip link (`3.5`, `R2`, `R2b`, `6.1`); `print 8.1`/`R3` ocultan todo
   `[class*='glow']`; `content 10.5` pide el chip NDA **exactamente una vez** en el home; `I2/I4/6.6` leen la cabecera
   por selectores concretos (también en `/cv` a 320 px).
4. **§1.2 hoja:** verificado lo que el plan pedía verificar (se reemplaza el «Verificar antes» por los resultados).
   Slug inexistente → `notFound()` en la página del slot (no `window.location.replace`). **Nuevo:** `CvExperience`
   enlaza los casos con `<Link>` y abriría la hoja sobre el CV → D22: pasan a `<a>` (única excepción al «no se toca»
   de `/cv`, sin cambio visual). **Nuevo:** `CaseBody` en la hoja daría 2 `h1` y 2 `<footer>` en el documento → prop
   `enHoja` (título `h2` con id, colofón sin `<footer>`, `<article>`).
5. **§1.3 `NameLockup`:** las dos tipografías recomendadas (00-BRIEF → `B-tipo/TIPO.md`) no son «cambiar una línea»:
   la 4 «corte láser» (Geologica, SHRP 100) necesita una construcción partida con copia `aria-hidden` y medida en
   cliente; la 3 «banda» (Big Shoulders Stencil, opsz 72) es de una línea. `decisiones.nombreLockup` pasa a
   `{ fuente, construccion }` y el FLIP mide `[data-lockup]` del DOM. **§1.7:** se corrige la lista de opciones (Bodoni
   Moda fue descartada) y se confirma que Geologica, Big Shoulders Stencil, Mona Sans y Doto existen en
   `next/font/google` con sus ejes.
6. **§1.3/§1.4 dependencias ocultas:** `SectionIndex` es hoy el único que escribe `setActiveSection` (el scroll-spy
   nuevo debe hacerlo o `I3` cae); `stepSpring` queda huérfano al retirar `SectionIndex`/`RailLabel`; `CaseNda` solo
   usa la viñeta de Andes (las otras cinco viven en el home viejo); `/#craft` deja de existir.
7. **§1.9 upgrade:** versiones exactas y comando; la verificación `require('react').ViewTransition` mira el React
   equivocado (el App Router usa el de `next/dist/compiled/react`, que en 16.3.5 **ya** trae `ViewTransition`) →
   se verifica con tsc + build de un componente de prueba.
8. **F0:** `tests/out/` y `tests/shots/` están en `.gitignore` → la línea de base se copia a
   `docs/rediseno-2026/baseline-F0.json`; dos corridas limpias para despejar los 6 rojos intermitentes de qrvey.
9. **F1:** `/lab` es estática: `DG_LAB` se lee en el **build**, no en `next start`; el primer `:root {` está en la
   línea 48 (no 87) y los tokens nuevos van después del bloque de la 86.
10. **F2/F3/F4 imágenes:** las fotos de `retratos-hf/` miden **880×1168** → no hay 1080/1600/1920 de la foto; el
    retrato de K13 sale a 640/880; el póster se mide en su ancho mayor; el estado `cine` a pantalla completa amplía
    la provisional ×1,6–2,2 (aceptado; la imagen final, D7, debe traer máster ≥ 1920 px).
11. **F3 pruebas que faltaban en la lista:** `keyboard 6.3` y `6.6`, `motion 7.2` (mide viñetas en `/`), `i18n I2/I4`,
    `a11y 3.2–3.4` (footer único), `content 10.1/10.5`, y las de solo registro.
12. **F8:** `playwright.config.ts` no tiene `projects` y en el contenedor solo hay Chromium → hay que añadir los
    proyectos e instalar WebKit/Firefox (o dejar el smoke a Doug); `perf.spec` (CDP) solo en Chromium.
13. **§4:** se añade **D22** (enlaces a casos desde `/cv` → página completa).

**Orden de fases:** se mantiene. Las dependencias reales coinciden con §3 (F2 necesita `sharp` de F0, ya implícito;
F6 depende de `BentoCard` de F3 y de `CaseBody`; F7 de F6). Cada fase deja el sitio funcionando: F1–F2 son aditivas,
F3 reemplaza el home de una vez con sus pruebas, F4–F7 se montan sobre un OS ya completo sin JS.

**¿Listo para F0?** Sí. F0 no depende de ninguna decisión pendiente; lo único a vigilar es despejar los rojos
intermitentes de `/work/qrvey` antes de dar la línea de base por buena.

---

## Correcciones del 6 nov 2026 · lockup «corte láser» y páginas internas aprobadas

> Planificador. Fuentes: `ESTADO.md` (decisiones vigentes), `propuestas/B-paginas/NOTAS.md` §1–§6 y **§7** (los 14
> arreglos tras `06-CRITICA-PAGINAS.md`; maquetas **aprobadas por Doug el 6 nov**), `propuestas/B-tipo/TIPO.md`
> (opción 4) y el código de `src/` (cada nombre citado se verificó con `grep`; lo que no existe va marcado **NUEVO**).
> No cambia código. Los 12 P2 de la crítica no entran salvo P2-1 y P2-6, que ya están en las maquetas.

**Decisiones que el plan da por tomadas** (dejan de ser valores por defecto):

1. **Lockup = opción 4 «corte láser»**: Geologica (`next/font/google`, `axes: ["SHRP"]`, SHRP 100, peso 600).
   `decisiones.nombreLockup = { fuente: "geologica", construccion: "corte" }`. D6 queda como decidida en §4. Especificación,
   medida y criterios en F1 (`NameLockup`).
2. **Un solo láser en móvil** (P1-7, opción a): por debajo de 1024 px el nombre va **entero**, sin corte, sin copia
   y sin hilo propio; el único láser es el de la foto. Vale para todas las páginas (también el home: se descarta el
   hilo propio de móvil que proponía `TIPO.md` §4).
3. **Páginas internas** = `B-paginas/{work,about,experience}.html` (F2) y `caso.html` (F7), con los arreglos de
   NOTAS §7. Lo que antes era «opcional, separable» en F7 (reordenar la plantilla, índice lateral fijo) pasa a ser
   alcance de F7.
4. **Una sola cuenta** (P1-4): años, casos publicados, productos propios y empresas salen de funciones puras de
   `src/lib/cuentas.ts` (**NUEVO**) que leen `cv.ts` y `work.ts`. Las usan «En cifras» de `/work`, K12 del home y los
   acumulados de `/experience`. Valores de hoy: **12 · 10 · 3** y **6 empresas**.
5. **Dock móvil de 5 destinos**: Trabajo · Perfil · Experiencia · CV · Contacto (NOTAS §1). En el caso, «Contacto»
   cede su lugar a «Secciones», que abre una hoja corta con el índice.
6. **Numeración visible de `/work` = posición en `home.ordenCasos` + `home.archivo`** (P1-1: /01 Naowee, /02 Andes,
   /03 olbo… /10 Chub). `CaseStudy.num` no cambia y sigue mandando en `getNextCaseStudy` (D19).
7. **Filtros de `/work` en el flujo**, sin `sticky` (P1-2). **Ficha del caso** en 2 columnas sin cajas ni escalera
   (P1-5). **Tablero de impacto** con la cifra a `min(72px, 100cqi / k)` (P1-6).
8. `/about` reutiliza el héroe de B (foto, vidrio, lente, corte) con **sticky + scrub, sin pin** (la rueda siempre
   mueve la página). `/experience` **sí** ancla (pin de 3,6 viewports) y reparte el scroll **por hito** (P1-9).

**Qué cambió en este documento:** §1.1 (`app/fonts/`), §1.3 (fila `NameLockup` reescrita, `NameLockupCorte` y
carpetas `trabajo/`, `perfil/`, `trayectoria/` nuevas, filas nuevas en `case/`, `DockMovil` con 5 destinos,
`Wordmark` en Geologica), §1.5 (`cuentas.ts`, `trayectoria.ts`, `perfil.ts` con logros por hito, campo opcional
`platforms`), §1.7 (lockup fijo), F1, F2 y F7 (especificación y criterios por página), F3 (reutiliza lo que crea F2),
§3 (F2 → F3/F4 para el vidrio de `/about`; F7 depende de F2) y §4 (D6 decidida; D17 con el microcopy de NOTAS §4).

**Reversión del lockup (una línea):** `decisiones.nombreLockup = { fuente: "big-shoulders", construccion: "banda" }`
(opción 3) + reexportar su definición en `app/fonts/lockup.ts`; nada más cambia (el FLIP mide el DOM).

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
| Pruebas | vitest: **10 archivos, 149 pruebas** (`data.integrity`, `data.singleSource`, `i18n.parity`, `theme.tokens`, `work.getCaseMeta`, `career.formatPeriod`, `career.yearsOfExperience`, `caseMedia`, `cvFingerprint`, `cvSheet`). Playwright: 17 specs, **267 pruebas** en `tests/e2e`, `next start -p 3131` (requiere `npm run build` antes). Varias specs solo **registran** (no afirman nada): `R1`, `R6`, `F2`, `F3`, `M1–M4`, `hero320`, `visual`, `contrast-detail`. |

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
  Designer», «Tech Lead», «Technical Lead», «Design System Gatekeeper» ni años en palabras **en inglés**
  (`Twelve|Eleven|Ten years`, `A decade`); ningún componente puede tener `company: "…"` literal. «Dribbble»
  está prohibido **en todo `src/` y en `README.md`**, también en `src/data`. **`dictionaries.ts` está fuera** →
  «Head of Product · Barranquilla» (K1) y «Head of Product en Naowee» (K5) salen de `site.ts`, no del diccionario ni
  del JSX. (`content 10.1` además exige que el texto del home contenga «Head of Product».)
- `a11y 3.2–3.4`: en **cada** ruta de `ROUTES` hay exactamente **un `h1`**, un `<header>` de nivel superior (fuera de
  `article, aside, main, nav, section`), **un `main#main`** y **un solo `<footer>` en todo el documento**
  (`querySelectorAll("footer").length === 1`, sin importar dónde esté). Hoy ese footer es: `Contact.tsx` en el home,
  `CaseColophon` en los casos y `.cv-colophon` en `/cv`. → `SiteFooter` **no** va en `RootDocument` (daría 2 footers
  en casos y en `/cv`); va solo en las páginas B (home, `/work`, `/about`, `/experience`), y K17 no lleva `<footer>`.
- `a11y 3.5`, `R2`, `R2b`, `keyboard 6.1`: la **primera** parada de Tab en todas las rutas es el skip link `a[href="#main"]`
  y es visible al enfocarse. Nada (rail, `sceneInit`, escena) puede ir antes en el orden de foco.
- `print 8.1` y `recheck R3`: en impresión, todo `.glow-corner, [data-glow], [class*='glow']` queda `display: none` →
  ninguna clase nueva de B contiene «glow» (o se oculta en `@media print`).
- `theme.tokens`: el primer bloque `:root {` debe declarar `--paper` igual a `theme-colors.json`; no puede existir
  `--color-accent` ni las clases `.glass`, `.cosmic-`, `.btn-accent`, `.btn-outline`, `theme-dark`. → El vidrio de B
  se llama **`.vidrio`** (nunca `.glass`) y los tokens nuevos se añaden **después** del primer `:root {`.
- `content 10.5`: «Caso disponible a solicitud» / «Case study available on request» aparece **exactamente una vez**
  en el `innerText` del home (ES y EN) y una vez en `/work/mercadolibre-andes` → es el chip NDA de K4, y ningún otro
  texto del home (rail, carrusel, `sr-only` visible) puede repetirlo. `content 10.7`: «Francesca Steri» solo en el
  caso BdO y en `/cv` → **K8 no muestra su cita** (ver decisión D10).
- `i18n I2/I4` leen la cabecera por selector: `header a[hreflang="en|es"]` (con el `href` de la otra versión),
  `header [aria-current="true"]` con el código del idioma, y en `/cv` a < 360 px `header button[aria-expanded]` que
  abre `nav[data-menu]` con el enlace de idioma. `keyboard 6.6` exige en `/` a 375 px un `header button[aria-expanded]`
  con `aria-controls`, que Esc cierra devolviendo el foco. El `SiteHeader` reescrito **conserva esos selectores** o la
  fase que lo cambie reescribe esas pruebas con motivo (ver F3).
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
├─ fonts/                           ← NUEVO (F1): urbanist, instrument, doto, lockup (Geologica SHRP) + licencias/
├─ global-not-found.tsx             ← sin cambios (copy 404 nuevo en F7 vía diccionario)
├─ sitemap.ts                       ← + /work, /about, /experience (F2)
├─ (es)/
│  ├─ layout.tsx                    ← recibe { children, modal } y pinta {modal} (F6)
│  ├─ page.tsx                      ← HomePage nuevo (F3)
│  ├─ @modal/
│  │  ├─ default.tsx                ← null (carga directa / recarga de cualquier ruta)
│  │  └─ (.)work/[slug]/page.tsx    ← <CaseSheet slug> + generateStaticParams (F6)
│  ├─ work/
│  │  ├─ page.tsx                   ← NUEVA: índice de casos con filtros y archivo (F2)
│  │  └─ [slug]/{page,not-found}.tsx← página completa existente (CasePage → CaseBody, F6)
│  ├─ about/page.tsx                ← NUEVA: perfil con portada de vidrio + corte (F2)
│  ├─ experience/page.tsx           ← NUEVA: trayectoria anclada por hito (F2)
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
  4. Slug inexistente en navegación blanda: la página del slot llama `notFound()` (como `CasePage`). **Verificado** en
     la prueba mínima: la navegación blanda a `/work/not-a-case` pinta el mismo 404 de caso que la carga directa
     (h1 de `CaseNotFound`, sin hoja). `window.location.replace(href)` queda solo como respaldo si eso cambiara.
  5. **`/cv` también intercepta** (verificado): `CvExperience.tsx` enlaza cada caso con `<Link>`, así que desde `/cv`
     un clic abriría la hoja (oscura, B) encima del CV. Por defecto (D22) esos enlaces pasan a `<a href>` (navegación
     de documento → página completa); es un cambio de una etiqueta en `src/components/cv/CvExperience.tsx`, sin
     cambio visual, y es la **única** excepción al «no se toca» de `/cv` (se hace en F6 y se anota el motivo).
  6. Los demás `<Link>` que salen de una página con hoja posible y **no** van a un caso (`CaseHeader` → `/#work`,
     `NotFoundContent`, `CaseNotFound`) no interceptan, pero dejan el slot rancio: verificado que tras hoja → `/` o
     hoja → `/cv` por navegación blanda el slot **sigue pintando la hoja**. El auto-ocultado por `usePathname()` de
     arriba es obligatorio, no opcional.
- **Cierre**: X, Esc, clic en el velo, arrastre (móvil) → animación de salida 280 ms → `router.back()`. Atrás del
  navegador → la hoja desaparece (sin animación de salida, aceptado). El foco vuelve al enlace de origen (guardado en
  `hoja/origen.ts` en el `onClick` de la card). Cmd/Ctrl/clic medio → pestaña nueva con la página completa (nativo).
- **Una sola `<main>`**: `CasePage` se parte en `CaseBody` (sin `<main>`, sin JSON-LD) + envoltorio. La hoja es
  `<dialog aria-labelledby>` con `CaseBody` dentro; JSON-LD del caso solo en la página completa.
- **Ni dos `h1` ni dos `<footer>` con la hoja abierta.** `CaseBody` trae el `h1` de `CaseHeader` (vía
  `RevealText as="h1"`) y el `<footer>` de `CaseColophon`; dentro de la hoja, sobre el home, darían 2 `h1` y 2
  footers (rompe la idea de `a11y 3.2–3.4` y axe marca el `contentinfo` duplicado). → `CaseBody` recibe
  `enHoja: boolean`: en la hoja el título es `h2` con el `id` que usa `aria-labelledby`, el colofón es `<div>`, y todo
  va dentro de `<article>`. En la página completa no cambia nada.

**Verificado (revisor, 5 nov, next 16.3.5 y docs/código de 16.4.5)** con una prueba mínima en una copia temporal del
repo (borrada): `(es)/layout.tsx` con `{children, modal}`, `(es)/@modal/{default.tsx,(.)work/[slug]/page.tsx}`,
`(en)/en/layout.tsx` anidado y `(en)/en/@modal/{…}`. `next build` verde (las rutas salen como `/(.)work/[slug]` y
`/en/(.)work/[slug]`, SSG con `generateStaticParams`). Resultados en Chromium:
(a) `(.)` atraviesa `(es)` y `@modal`: blanda `/` → `/work/olbo` pinta la hoja y conserva el home (1 `main#main`);
Atrás la quita; recarga → página completa sin hoja. (b) La regla del nivel raíz usa `Next-Url` `/.*` (código de
`generate-interception-routes-rewrites.js`): blanda caso → caso abre hoja sobre la página completa, y `/cv` → caso
también (ver 5). La de `/en` usa `/en(?:/.*)?`. (c) `default.tsx` → `null` **no** cambia los 404: `/this-page-was-never-here`
y `/en/this-page-was-never-here` → 404 con `global-not-found`; `/work/not-a-case` y `/en/work/not-a-case` → 404 con
`CaseNotFound`; `/cv` y `/en/cv` → 200 sin hoja. (d) `router.replace` dentro de la hoja cambia de caso y Atrás vuelve
al home. (e) El cambio de idioma desde `/en/work/olbo` (`<a>`) cae en la página completa ES. Hace falta **un
`default.tsx` en cada `@modal`** (ES y EN); `children` no necesita `default.tsx` propio.

### 1.3 Componentes nuevos

| Carpeta | Componente | Tipo | Qué hace |
|---|---|---|---|
| `components/marca/` | `NameLockup.tsx` | server | **Único lugar** donde se compone «Doug / Vargas». **Decidido (6 nov): opción 4 «corte láser»**, Geologica SHRP 100, 600, tracking −0,05 em, leading 0,9. Props `escala: "xl" \| "losa" \| "movil"` y `corte?: boolean` (solo `xl`: acto 1 del home y portada de `/about`). Lee `decisiones.nombreLockup = { fuente: "geologica", construccion: "corte" }` y la variable `--font-nombre` de `app/fonts/lockup.ts`. Marcado con corte: raíz `[data-lockup][data-corte]` = `h1` (o `div aria-hidden` en el home, donde el `h1` es K2) con `<span class="sr-only">Doug Vargas</span>` + dos líneas `aria-hidden`; la segunda lleva `.m.sup` («Vargas»), `.m.inf` (copia) y `.hilo`. **El estado de partida en el HTML es «cerrado»** (`--desp: 0`, sin `clip-path`, `.m.inf` oculta): sin JS, sin GSAP, con RM, a < 1024 px y en `losa`/`movil` el nombre es una palabra entera. Contrato del FLIP: se mide `[data-lockup]` del DOM, nunca constantes. Detalle y criterios en F1. |
| | `NameLockupCorte.tsx` (**NUEVO**) | client (isla) | Solo con `corte` y ≥ 1024 px sin RM. Mide `--corte` (`lib/corte.ts`), coloca el nombre para que el láser de la foto pase por el corte (y corrige tras el primer layout), hace la entrada **una sola vez** (separa las mitades a los 880 ms en 520 ms `--curva-salida`) y deja `--desp` en manos del dueño del scroll (`EscenaCliente` en F5, `PortadaPerfilCliente` en F2), que lo lleva a 0 entre p 0 y 0,3. Vuelve a medir con `ResizeObserver` y `document.fonts.ready`. |
| | `Wordmark.tsx` | server | «douguizard» de la cabecera, en Geologica 600 SHRP 100 (la voz del lockup, NOTAS §1), con el disco «d»; nombre accesible `meta.homeLabel`. |
| `components/sistema/` | `Losa.tsx` | server | Superficie (`vacio`, `losa`, `clara`, `niebla`, `azul`, `magenta`, `vidrio`) con radio, padding y filo de 1 px. |
| | `BentoCard.tsx` | server | `Losa` + capa de enlace a tamaño de card (`aria-labelledby` del título, nombre que empieza por el texto visible) + `Flecha`; enlaces secundarios encima con `z-index`. Hover/foco/pressed de NOTAS §2 con `translate`/`scale` (propiedades individuales, no chocan con GSAP). |
| | `DotMatrix.tsx` | server | Cifras/fechas en Doto (`ROND 100`, ≥ 20 px, `tabular-nums`, `data-dot`), texto real con `aria-label` por grupo. |
| | `Estado.tsx` | server | Punto de disponible en **luz láser** (núcleo claro + aro y halo rojos; P1-6) + texto. |
| | `Boton.tsx`, `Flecha.tsx`, `Etiqueta.tsx`, `Iconos.tsx` (sprite SVG) | server | Botones (≥ 48 px), flecha circular (blanca / `.flecha-tinta`), etiquetas tintadas. |
| `components/chrome/` | `SiteHeader.tsx` (reescrito) | client | Pastilla de B: wordmark · pills · ES/EN (44×44, `background-clip: content-box`) · «Hablemos». En el home, pills = anclas con scroll-spy (`lib/activeSection.ts`); fuera, rutas. Pills centradas al viewport (P2-1). Hoy el **único que escribe** `setActiveSection` es `SectionIndex` (se retira en F3): el scroll-spy nuevo tiene que llamarlo, o `LanguageSwitch` pierde el `#ancla` (`i18n I3`). Conserva `header a[hreflang]`, `[aria-current="true"]` y, a < 1024 px, un `button[aria-expanded][aria-controls]` con `nav[data-menu]` (lo usan `I4` en `/cv` y `6.6`). |
| | `RailAcciones.tsx` | client | Rail de escritorio (Escríbeme, CV, LinkedIn, Behance, GitHub, Volver arriba). `inert` mientras p < 0,5 del ancla (P0-3); nunca inerte sin GSAP o con RM. |
| | `DockMovil.tsx` | client | **5 destinos** (6 nov, NOTAS §1): Trabajo · Perfil · Experiencia · CV · Contacto, con `aria-current="page"` en el de la página; en el caso, «Contacto» → «Secciones» (abre `HojaSecciones`). Aparece al salir del héroe (en las páginas internas, desde el inicio), `env(safe-area-inset-bottom)`, toques ≥ 44 px. |
| | `SiteFooter.tsx` (lo crea **F2**) | server | © · Barranquilla · UTC-5 · colofón (D11) · Volver arriba (≥ 44 px). Se monta en `HomePage`, `WorkIndexPage`, `AboutPage`, `ExperiencePage` — **no** en `RootDocument` (casos y `/cv` ya tienen su `<footer>`; `a11y 3.4` exige uno solo). |
| `components/tablero/` | `Tablero.tsx` | server | Orden del DOM = orden visual = Tab: K2, K1, K3, K4, K5, [carrusel K7–K10], K11, K12, K13, K14, K15, K16, K17. `grid-template-areas` por breakpoint (≥ 1280, 1024–1279 de P0-1, < 1024). Filas `minmax(var(--fila), auto)`. |
| | `K1Retrato.tsx`, `K2Claim.tsx`, `CardCaso.tsx` (variantes K3/K4/K7–K10), `CardContacto.tsx` (K5+K6 fusionadas, P1-5), `CardExperiencia.tsx` (K11), `CardCifras.tsx` (K12), `CardPerfil.tsx` (K13), `CardOficio.tsx` (K14), `CardArchivo.tsx` (K16), `Contacto.tsx` (K17) | server | Leen de `src/data` (single source). **`CardCaso`, `CardCifras` y `CardArchivo` los crea F2** (son las losas de `/work`, «En cifras» y el archivo); F3 los reutiliza en el tablero. `CardCaso` acepta `variante` (`oscura-captura`, `jelly-azul-cifras`, `niebla-telefono`, `oscura`, `magenta`) y `numero` visible (lo calcula la página, P1-1). |
| | `CardTestimonio.tsx` (K15), `CarruselMovil.tsx`, `RelojBaq.tsx`, `CopiarCorreo.tsx` | client (islas) | Rotación manual · scroll-snap con contador y botones · reloj por minuto (`suppressHydrationWarning`) · copiar correo con error de 04 §4.5. |
| `components/escena/` | `Escena.tsx` | server | Contenedor del acto 1 + OS: `data-escena`, póster, velo, láser, `NameLockup` XL (`aria-hidden`), indicador «Desliza». |
| | `EscenaCliente.tsx` + `useScrollScene.ts` | client | `import("gsap")` + `ScrollTrigger` diferido; timeline de NOTAS §2 corregido por §7; `gsap.context()` + `gsap.matchMedia()`; limpieza al desmontar. |
| | `sceneInit.ts` | lib | Script inline (string) que pone `html.cine` antes del primer pintado solo si `/` o `/en`, ≥ 1024 px, sin RM y con JS. |
| `components/hero/` | `HeroPoster.tsx` | server | `<picture>` con AVIF/WebP horneados (`fetchPriority="high"`, `sizes`), alt por idioma. Es el LCP. |
| | `VidrioGL.tsx` | client (`dynamic`, `ssr:false`) | WebGL2 de un pase portado de `propuestas/B/index.html` (FS del vidrio, SDF de losa, cara protegida, banda láser, lente). Monta en `requestIdleCallback`/`load`, fundido de 200–400 ms tras el primer cuadro. |
| | `VidrioCss.tsx` | server | Respaldo de franjas CSS (rebanadas) + copia nítida con `mask-image` (cara ∪ banda láser). |
| | `useLente.ts` | client | Lente del cursor con muelles X/Y críticamente amortiguados (respuesta 0,35 s; entra k = 7, sale k = 4); táctil 1:1 con `touch-action: pan-y`. |
| `components/trabajo/` (**NUEVO**, F2) | `FiltroCasos.tsx` | client | Grupo `role="group"` (Todos · Escala · Productos propios · Anteriores) con `aria-pressed` y anuncio `aria-live="polite"` («N casos»). Oculta con `hidden` lo que no pertenece; reflujo con `document.startViewTransition` (`view-transition-name: caso-<slug>` por losa); sin la API o con RM, cambio directo. **En el flujo, sin `sticky`** (P1-2). Sin JS no se pinta (todo visible). |
| | `Leido.tsx` | client | `MarcaLeido` (chip «Leído» en la losa si `localStorage["leido:<slug>"]`) y `RegistrarLeido` (lo escribe al montar `CaseBody`). `try/catch`; es solo una comodidad por visitante (04 §6.3). |
| `components/perfil/` (**NUEVO**, F2) | `PortadaPerfil.tsx` + `PortadaPerfilCliente.tsx` | server + client | Portada de `/about`: escenario sticky de 210 svh con la foto de `hero.ts` (`HeroPoster`), velo, láser, `NameLockup escala="xl" corte` (es el `h1`) y bio de tres frases. El cliente (`import("gsap")` diferido, ≥ 1024, sin RM) liga a un `ScrollTrigger` **sin pin** (scrub 0,3): corte p 0–0,3, foto a losa col 8–12 p 0–0,7 (cúbica in-out), vidrio .62 → .08 p 0–0,85, bio p 0,5–0,8. El material del vidrio es un hueco: F3 monta `VidrioCss`, F4 `VidrioGL`. |
| | `LoQueHago.tsx`, `ComoTrabajo.tsx`, `DatosPerfil.tsx`, `Marcas.tsx`, `Citas.tsx` | server | «Lo que hago» (3 losas, Sistemas en jelly azul; rejilla `auto · 64px · título · párrafo`, P1-13), «Cómo trabajo» (losa clara, 4 nodos cosidos por el hilo), «Datos» + «Con qué trabajo» (`getCv(locale).tools`), «Dónde he trabajado» (`getWordmarks()` en Geologica, 2 filas de 4), citas verbatim de `testimonials.ts` con `lang="en"`. |
| `components/trayectoria/` (**NUEVO**, F2) | `Trayectoria.tsx` | server | `<section>` con ceja, `h1`, intro, contador `aria-hidden` (`Odometro`), era `aria-hidden`, `<dl>` de acumulados, `<ol>` **completo** de hitos (`Hito`: `h2` empresa, rol del CV, periodo `formatPeriod`, logro, «Ver caso» con `sr-only` de la empresa) y eje `aria-hidden` (eras, línea láser + cabezal, tramos con duración proporcional, años en Doto, pista «Productos propios» de 140 px a la derecha). |
| | `TrayectoriaCliente.tsx`, `Odometro.tsx` | client | Pin de 3,6 viewports con scrub 0,5 (≥ 1024, sin RM, con GSAP); año = `yDe(p)` de `lib/trayectoria.ts`; `focusin` en un hito → `scrollTo` instantáneo a su tramo + `progress(1)` (P0-1); móvil: activo = el hito que cruza el 55 % del viewport, barra fija con contador de 48 px. Odómetro de 4 columnas, giro de 260 ms `--curva-salida`; acumulados con «encendido» de 360 ms. |
| `components/hoja/` | `CaseSheet.tsx` | client | `<dialog>` + `showModal()`, `overflow: clip`, foco inicial en Cerrar, línea láser de progreso, «Abrir como página completa» (NOTAS §1), auto-oculta por pathname. |
| | `useArrastreHoja.ts`, `origen.ts` | client | Arrastre para cerrar (> 120 px o > 0,5 px/ms, banda elástica) · enlace de origen para devolver el foco. |
| `components/case/` | `CaseBody.tsx` | server | Cuerpo del caso extraído de `CasePage` (sin `<main>`, sin JSON-LD; el `notFound()` se queda en `CasePage` y en la página del slot). Prop `enHoja`: título `h2` con `id`, colofón sin `<footer>`, envoltorio `<article>` (§1.2). En F7 sigue el orden de `caso.html` (ver F7). |
| | `CaseIndice.tsx` (**NUEVO**, F7) | client | Índice lateral fijo (≥ 1280, solo página completa): `<nav aria-label>` + `<ol>` de las secciones **presentes**; hilo de 1 px que se llena de láser (`scaleY` = progreso de lectura) y `aria-current="true"` con el punto de presencia en la actual. |
| | `HojaSecciones.tsx` (**NUEVO**, F7) | client | < 1024: «Secciones» del dock abre un `<dialog>` corto con los mismos rótulos; elegir uno cierra y lleva el foco al `h2`. |
| `components/pages/` | `HomePage.tsx` (reescrito), `WorkIndexPage.tsx`, `AboutPage.tsx`, `ExperiencePage.tsx` | server | Páginas por idioma, como las actuales. |
| `lib/` | `gl/{programa,textura}.ts`, `gl/vidrioShader.ts` | lib | Compilar/enlazar, subir textura con mipmaps, fuentes GLSL. `failIfMajorPerformanceCaveat: true`, `webglcontextlost` → respaldo. |
| | `escena.ts` | lib (pura) | `placement()`, `frame(p)`, `eio()` y el layout de NOTAS (sin DOM) → testeable en vitest. |
| | `corte.ts` (**NUEVO**, F1) | lib (pura) | `corteDesdeMetricas({ lineHeight, fontAscent, fontDescent, xHeight })` = base − 0,52 × altura de x; `desplazamientos(t)` → `{ sup: −0,10 em × t, inf: +0,06 em × t, rendija: 1,5 px × t }`. La isla le pasa las métricas de `measureText`. |
| | `cuentas.ts` (**NUEVO**, F2) | lib (pura) | **La única cuenta** (P1-4): `aniosEnProducto()` (= `yearsOfExperience()`), `casosPublicados()` (= `caseStudies.length`), `productosPropios()` (`kind === "personal"`), `empresas()` (empleador de registro distinto, `employer ?? company.name`, sin `freelance`) y `grupoCaso(slug)` (`propio` / `anterior` si está en `home.archivo` / `escala`). |
| | `trayectoria.ts` (**NUEVO**, F2) | lib (pura) | Hitos en orden desde `education` + `experiences` de `cv.ts` + el hito paralelo «Freelance · Chub» (`work.ts`, `kind: "side"`, sin tramo propio), con año decimal de inicio/fin; eras (de `perfil.ts`); `yDe(p)` (cada hito recibe 1/n del recorrido; el año interpola dentro de su tramo), `pDe(i)` = (i + 0,08)/n, `acumuladosEn(y)` (en y = hoy da lo mismo que `cuentas.ts`). |
| | `spring.ts` (+ `stepCritical`) | lib | Muelle críticamente amortiguado por eje, aditivo: no cambia `stepSpring` ni sus constantes. |

### 1.4 Componentes que se retiran (F3, salvo indicación)

`components/HorizontalShell.tsx`, `SectionIndex.tsx`, `RailLabel.tsx`, `FocusWords.tsx`,
`components/sections/{Hero,Work,Craft,CraftTimeline,About,Contact}.tsx`, `components/hero/HeroField.tsx` y
`hero/Velaris.tsx` (en F4, cuando su ciclo de vida ya esté portado a `lib/gl`), `src/data/sections.ts` (lo reemplaza
`home.secciones`). **Antes de borrar `Craft.tsx` y `About.tsx`, su copy se mueve a `src/data/perfil.ts`** (04 §0 los
cita como fuente). Se conservan: `text/RevealText.tsx` y `text/useInView.ts` (los usan los casos y `work/*`),
`ThemeToggle.tsx` (solo en `/cv`, D4), `LanguageSwitch.tsx`, `lib/activeSection.ts` (scroll-spy de las pills),
`vignettes/*`. Ojo: `CaseNda` solo pinta la viñeta del **único** caso NDA (`mercadolibre-andes`); las otras cinco
(`olbo`, `naowee`, `banco`, `dc`, `makeapet`) hoy solo viven en el home (`sections/Work.tsx`) → si el tablero no las
reutiliza, quedan muertas tras F3 y se borran en F8 (y `motion 7.2`, que las mide en `/`, se reescribe en F3).
`lib/spring.ts`: `stepSpring` solo lo usan `SectionIndex` y `RailLabel` (se retiran en F3) y no tiene prueba propia;
`stepCritical` se añade al lado y en F8 se borra lo que quede huérfano. Del CSS: el bloque `.rail-*`/shell de
`globals.css` se borra en F3 (el rail nuevo usa `.rail-acciones` para no chocar). Los ids de sección pasan de
`home, work, craft, about, contact` a `work, about, experience, contact`: `/#craft` deja de llegar (aceptado; nadie lo
enlaza fuera del shell).

### 1.5 Capa de datos

| Archivo | Contenido | Pruebas |
|---|---|---|
| `src/data/decisiones.ts` (nuevo) | **Todas** las decisiones pendientes de Doug con su valor por defecto (§4), tipadas y comentadas: `disponibilidad`, `ordenCasos`, `rutasPerfil`, `temaClaroEn`, `titularEn`, `nombreLockup`, `pdfPorIdioma`, `colofon`, `telefonoEnHome`, `nombreK1`, `citaFrancescaEnHome`, `hojaDesdeIndices`. Cambiar una decisión = cambiar una línea. `nombreLockup` ya no es un valor por defecto sino la decisión tomada el 6 nov (`{ fuente: "geologica", construccion: "corte" }`); se queda aquí para que la reversión sea de una línea. | `decisiones.test.ts`: valores dentro de su unión de tipos; `nombreLockup` igual a la decisión del 6 nov. |
| `src/data/home.ts` (nuevo) | `ordenCasos` (slugs), `archivo` (RC · Qrvey · Ideaware · Chub), mapeo K → slug/superficie/KPI (por **índice o id del KPI** de `work.ts`, nunca la cifra escrita), ids de sección **en inglés en los dos idiomas** (`work`, `about`, `experience`, `contact`) para que `/#work` y `/#contact` de hoy sigan llegando. | `home.test.ts`: cada slug existe; el KPI referido existe en ES y EN; los ids no cambian por idioma. |
| `src/data/hero.ts` (nuevo) | Un objeto por foto: `id`, `version`, `rutas` (master, póster AVIF/WebP por ancho, texturas 1600/1024), `tamano` (w, h), `foco [fx, fy]`, `cara [cx, cy, rx, ry]`, `laser { y, h }` (opcional), `alt` por idioma (o clave de diccionario). Parámetros del vidrio por estado (`cine`, `losa`, `movil`): ángulo, ancho de estría, fuerza, joroba, radio de lente, protección de cara, DPR máx. **Provisional:** `199598aa` con `{ w: 880, h: 1168, eye: 0.418, face: [0.5, 0.41, 0.19, 0.205] }` de la maqueta. | `hero.test.ts`: todo normalizado en [0, 1]; la foto activa tiene todas las rutas; `version` en el nombre de archivo. |
| `src/data/perfil.ts` (nuevo) | Oficio (3), pasos de «Cómo trabajo» (4), datos (base, zona, idiomas), contexto (2 párrafos) y bio de tres frases de `/about`, eras de `/experience` (Base · Producto · Sistemas · Escala · Dirección con su año de inicio, 04 §6.2), **logro por hito** (`logros: Record<ExperienceId \| "uac" \| "chub", string>`, 04 §6.2) y textos de `h1`/intro de `/experience`, migrados de `sections/{Craft,About}.tsx` y 04 §6. ES/EN. Fechas, roles y empresas **no** van aquí: salen de `cv.ts` (`data.singleSource`). | `i18n.parity` extendido; `trayectoria.test.ts`: cada hito de `lib/trayectoria.ts` tiene logro en ES y EN. |
| `src/lib/cuentas.ts` + `src/lib/trayectoria.ts` (**NUEVOS**, F2) | Derivados puros (§1.3). Ningún componente cuenta casos, propios, años ni empresas por su cuenta. | `cuentas.test.ts`: 12 · 10 · 3 · 6 con la fecha fija de hoy (nov 2026); `productosPropios()` = slugs con `kind: "personal"`; la suma de los grupos de `grupoCaso` = `casosPublicados()`. `trayectoria.test.ts`: hitos en orden, `acumuladosEn(hoy)` = `cuentas`, `yDe`/`pDe` (F2). |
| `src/data/work.ts` (+ `es/work.ts`) | **Campo opcional NUEVO** `platforms?: string` (p. ej. «Web», «iOS · Android») para la ficha del caso (F7). Sin dato, la celda no se pinta: no se inventa. | `data.integrity`: si existe, no vacío y con su par ES. |
| `src/data/site.ts` | + `rolCorto` («Head of Product · Barranquilla», derivado del cargo actual de `cv.ts` si se puede) y `availability.modo`. | `data.singleSource` sigue verde. |
| `src/i18n/dictionaries.ts` | + `home.*`, `hoja.*`, `trabajo.*`, `perfil.*`, `trayectoria.*`, `carrusel.*`, `dock.*`; − `shell.*`, `index.*` al retirar el shell. Copy de 04 (ES/EN). Sin roles ni años. | `i18n.parity` (misma forma); **nuevo** `copy.sinMarcadores.test.ts`: ningún `[DATO A CONFIRMAR`, `⚠️ CONFIRMAR` ni `TODO` en diccionario ni datos visibles. |

### 1.6 Tokens en `globals.css`

Capa **aditiva** con los nombres en español de B (NOTAS §3), en un `:root` posterior al primero (regla de
`theme.tokens`), independiente de `data-theme` (B es solo oscuro; D4):

- **Color:** `--vacio #060608`, `--losa #111214`, `--losa-alta #1A1B1F`, `--claro #F2F2F4`, `--niebla #E4E2EC`, `--tinta`,
  `--tinta-2`, `--tinta-2-vidrio #C2C2CA` (P1-7), `--tinta-3`, `--tinta-osc`, `--tinta-osc-2` (≥ 7:1 sobre claro, ver §0),
  `--electrico #2B56F3`, `--electrico-texto #5B7CFF`, `--laser #FF3344`, `--laser-nucleo #FFE4E6`, `--laser-halo`,
  `--verde-osc #0E6B3D` (solo el 647 de olbo), `--azul-etiqueta #E3EAFF`, `--magenta-etiqueta #FCE6F1`,
  `--magenta-etiqueta-base`, gradientes `--jelly-azul`, `--jelly-magenta`, `--vidrio-oscuro` (P1-7), `--losa-borde`
  (filete de 1 px de la ficha, el archivo y los hitos inactivos; páginas internas, 6 nov). **Sin `--verde`.**
- **Espacio:** la escala 4…128 coincide con la de Tailwind v4 (`--spacing: .25rem`): `p-1…p-32`. Estructurales:
  `--cabecera 88px`, `--rail 64px`, `--os-izq 112px`, `--gap 16px`, `--fila clamp(96px, …, 128px)`.
- **Tipo:** `--t-12 … --t-120` (+ `--t-96` para alto ≤ 800, P0-1). **Radios:** `--r-losa 48/36`, `--r-m 32/28`,
  `--r-s 24/20`, `--r-xs 16`, pill 999 (concéntricos: radio interno = externo − inset).
- **Sombras:** `--bloom-azul`, `--bloom-magenta`, `--sombra-flota`, `--sombra-hoja`, `--filo`, `--filo-jelly`, `--haz`
  (núcleo + halo del hilo láser de 1 px: lockup, índice del caso, eje de `/experience`).
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
| **Geologica** (variable `wght` + eje `SHRP`) · lockup «corte láser» (**decidido 6 nov**) | `NameLockup` y `Wordmark` (cabecera: está en todas las páginas B) | SIL OFL 1.1 | `app/fonts/lockup.ts`: `Geologica({ subsets: ["latin"], axes: ["SHRP"], variable: "--font-nombre", display: "swap" })` (con `axes`, sin `weight`; `adjustFontFallback` por defecto para no tener CLS), preload; en CSS `font-variation-settings: "SHRP" 100, "CRSV" 0, "slnt" 0` y `font-weight: 600`. Existe así en `next/font/google` de 16.4.5. Reversión: `lockup.ts` reexporta Big Shoulders Stencil (`axes: ["opsz"]`) y `decisiones.nombreLockup` pasa a `banda`. | ~48 KB (`propuestas/fonts/geologica-latin.woff2`, latin con todos los ejes); el de Google con `axes: ["SHRP"]` debe quedar ≤ 50 KB (se mide en F1) |
| Archivo + Geist Mono | **solo /cv y su PDF** (y casos hasta F7) | OFL (ya en `scripts/cv-fonts/OFL-*.txt`) | sin cambios | — |

- Se copia el texto OFL de cada familia nueva a `src/app/fonts/licencias/` (requisito de redistribución al autoalojar).
- **Verificado (5 nov):** el `npm run build` del contenedor baja Archivo y Geist Mono de Google Fonts sin error (build
  verde). Vercel ya lo hace hoy. **Plan B** (si un día falla la red del build): `next/font/local` con woff2 variables (latin + latin-ext) en `src/app/fonts/`, comprobando el eje
  `ROND` de Doto con fontTools (`fvar`). Los woff2 de `propuestas/fonts/` no se reutilizan sin esa comprobación.

### 1.8 Dependencias nuevas y su peso

| Paquete | Tipo | Peso | Dónde carga |
|---|---|---|---|
| `gsap@^3.15` (incluye ScrollTrigger; en npm hoy **3.15.1**) | dependencia | **45,3 KB gz** (core + ScrollTrigger, medido en 03 §2.1) | `import()` diferido **solo** en `/` y `/en`, ≥ 1024 px, sin RM, tras el LCP. Licencia «Standard no-charge» de GSAP (uso comercial gratis; no OSI). Empaquetado (CSP: nada de CDN). |
| `sharp` (hoy **0.35.5**) | devDependency | 0 KB en cliente | `scripts/build-hero-poster.ts` (AVIF/WebP del póster horneado y del retrato de K13). |
| Código propio WebGL (`VidrioGL` + `lib/gl`) | — | ~5 KB gz | diferido (`dynamic`, `ssr: false`). |
| `@gsap/react` | **no se añade** | — | `gsap.context()` + `gsap.matchMedia()` en `useScrollScene` cubren lo mismo. |
| framer-motion / three / R3F / Lenis / OGL | **no** | — | Descartados en 03 §2. |

Presupuesto de JS inicial de `/`: **≤ baseline de F0 + 15 KB gz** (las islas K15, reloj, carrusel, header, rail,
dock). GSAP y WebGL no cuentan porque no se piden antes del LCP; se verifica en la prueba de rendimiento.

### 1.9 Upgrade de next / react

- Versiones **verificadas en npm (5 nov)**: `next` latest **16.4.5** (existen 16.4.0–16.4.5), `react`/`react-dom`
  latest **19.3.1**, `@types/react` y `@types/react-dom` **19.3.0**, `eslint-config-next` **16.4.5**. Comando exacto:
  `npm i next@16.4.5 react@19.3.1 react-dom@19.3.1 && npm i -D eslint-config-next@16.4.5 @types/react@19.3.0 @types/react-dom@19.3.0`.
  `next@16.4.5` pide `react ^18.2 || ^19` (peer OK). `@playwright/test` se queda en **1.63.0**: el Chromium del
  contenedor (`/opt/pw-browsers/chromium-1243`) es el de 1.63; 1.64.1 pediría otro navegador.
- `<ViewTransition>` **está estable**: `react@19.3.1` exporta `ViewTransition` (y `addTransitionType`), y la guía de
  16.4.5 (`next/dist/docs/01-app/02-guides/view-transitions.md`) dice que funciona en el App Router «sin
  configuración» con `import { ViewTransition } from 'react'`. Matiz: el App Router usa **el React que trae Next**
  (`next/dist/compiled/react`), no el de `node_modules/react`; el de 16.3.5 (19.3.0-canary) **ya exporta
  `ViewTransition`**, así que el upgrade no es estrictamente necesario para el runtime; sí para los tipos
  (`@types/react` 19.2 solo lo declara en `react/canary`) y para alinear el lock. Motivo del upgrade, igual: el morph
  de página y los fundidos (03 §2.2). **La hoja no depende del upgrade** (anima con CSS, B no usa morph).
- Riesgos: (1) `experimental.globalNotFound` **sigue siendo experimental en 16.4.5** con la misma forma (está en su
  `config-schema`): no hay que tocar `next.config.ts`; E5 y los dos 404 lo vigilan; (2) `next/image`: `priority`
  deprecado a favor de `preload` (confirmado en la doc de 16.4.5) → revisar avisos del build; (3) cambios de lint de
  `eslint-config-next`; (4) `next build` ya no imprime «First Load JS» (confirmado en 16.3.5) → el presupuesto se mide
  en Playwright.
- **Verificar tras el upgrade** (no basta `require('react').ViewTransition`, que mira el React equivocado):
  `npx tsc --noEmit` y `npm run build` verdes con un componente de prueba que haga
  `import { ViewTransition } from "react"` y lo renderice (se borra después), más
  `grep -c "exports.ViewTransition" node_modules/next/dist/compiled/react/cjs/react.production.js` = 1.
- **Plan B:** quedarse en 16.3.5/19.2.6 y usar `ViewTransition` del React de Next con
  `/// <reference types="react/canary" />`, o sin `<ViewTransition>`: navegación instantánea + `@view-transition
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
  `/hero/:rest*` → `public, max-age=31536000, immutable`, porque los nombres irán versionados;
  `experimental.globalNotFound` no cambia en 16.4.5, ver §1.9).
- Crear: `scripts/shots-rediseno.ts` (matriz de capturas; se corre con `tsx`, ya instalado, e importa `chromium` de
  `@playwright/test`), `tests/e2e/perf.spec.ts` (mide LCP con `PerformanceObserver`, elemento LCP, CLS, bytes de
  JS/imagen transferidos antes de `load`, con CDP —solo Chromium—: Slow 4G y CPU ×4 en móvil). El resultado se escribe
  en `tests/out/baseline-F0.json` **y se copia a `docs/rediseno-2026/baseline-F0.json`**: `tests/out/` y
  `tests/shots/` están en `.gitignore`, así que lo que quede ahí no llega al commit (las capturas siguen siendo
  artefactos de QA; la línea de base medida sí tiene que versionarse).
- No se borra nada.

**Criterios de aceptación.**
- `npm test` (vitest, 10 archivos / 149 pruebas) y los 17 specs / 267 pruebas de Playwright **verdes antes y después
  del upgrade** (si alguno ya estaba rojo en la rama, se documenta en `docs/rediseno-2026/baseline-F0.json` y no cuenta
  como regresión). Línea de base del revisor: 261/267, con 6 *timeouts* de `networkidle` en `/work/qrvey` que pasan
  aislados (ver «Revisión contra el código»). F0 hace **dos** corridas completas limpias (sin otros procesos): si qrvey
  vuelve a fallar, se diagnostica (trace de `test-results/`) y se corrige la espera en la prueba con motivo, antes del
  upgrade, para que la línea de base sea verde de verdad.
- Capturas «antes» de `/`, `/en`, `/work/olbo`, `/cv` a 390/1024/1440.
- Baseline registrado: LCP de `/` móvil y escritorio, JS inicial de `/` (KB gz), CLS.
- `<ViewTransition>` compila y renderiza con el componente de prueba de §1.9 (tsc + build verdes) y el React de Next
  lo exporta (o se activa el plan B y se anota).
- `npm run lint`, `npx tsc --noEmit` y `npm run build` verdes tras el upgrade, sin avisos nuevos (hoy el build solo
  avisa del `Cache-Control` propio de `/_next/static`, preexistente).

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
- Crear: `src/app/fonts/{urbanist,instrument,doto,lockup}.ts` (`lockup.ts` = Geologica SHRP, §1.7; ya no hace falta
  `lockup-urbanist.ts`), `src/app/fonts/licencias/*.txt` (incluida la OFL de Geologica),
  `src/components/marca/{NameLockup,NameLockupCorte,Wordmark}.tsx`, `src/components/sistema/{Losa,BentoCard,DotMatrix,Estado,Boton,Flecha,Etiqueta,Iconos}.tsx`
  (`DotMatrix` trae el arreglo del punto de miles de NOTAS §6: el «.» de las cifras ES va envuelto en `span.punto`,
  glifo transparente + punto redondo con `::after`; el texto real no cambia), `src/data/{decisiones,home,hero,perfil}.ts`,
  `src/lib/spring.ts` (+ `stepCritical`), `src/lib/corte.ts`,
  `src/app/(es)/lab/page.tsx` (catálogo: superficies, tipos, Doto, botones, card en reposo/hover/foco, `NameLockup` en
  sus tres escalas y, en `xl`, con un control de rango 0–1 que escribe `--desp` para ver el corte abierto/cerrado;
  `notFound()` salvo `process.env.DG_LAB === "1"`; `robots: noindex`; fuera del sitemap). Ojo: la
  página es estática, así que `DG_LAB` se lee **en el build**, no en `next start`: el QA corre
  `DG_LAB=1 npm run build && npx next start -p 3131` (o `npm run dev` con `DG_LAB=1`), y el build normal de la puerta
  común se hace **sin** `DG_LAB` (comprobar que `/lab` da 404 ahí).
- Pruebas: `src/data/__tests__/{decisiones,home,hero,copy.sinMarcadores}.test.ts`,
  `src/lib/__tests__/{spring.critical,corte}.test.ts`, `tests/e2e/lockup.spec.ts` (**NUEVO**, contra `/lab` con
  `DG_LAB=1`; en F2 se le suma `/about` y en F5 el acto 1 del home).

**`NameLockup` · opción 4 «corte láser» (decidida el 6 nov).** Fuente de verdad: `B-tipo/TIPO.md` §4,
`B-tipo/especimen.html` (`corte()`, `__tipoY0`) y `B-paginas/about.html` (`medirCorte`, `aplicarTexto`, P1-7).
- **Tipo.** Geologica 600, SHRP 100 (CRSV 0, slnt 0), tracking −0,05 em, leading 0,9. Escalas: `xl` = `--t-120`
  (portada de `/about`; acto 1 del home a 128 px como en TIPO) · `losa` = la de K1 (una sola palabra por línea, sin
  corte) · `movil` = la del héroe móvil (sin corte). El `Wordmark` usa la misma familia a 16 px/600.
- **Construcción.** «Doug» en la línea 1; «Vargas» en la 2 como `.m.sup` (original) + `.m.inf` (copia exacta,
  `aria-hidden`, `position: absolute; inset: 0`) + `.hilo` (1 px `--laser-nucleo` con `--haz`, `z-index: -1`).
  Abierto: `.m.sup { clip-path: inset(-1em -1em calc(100% - var(--corte) + var(--rendija)) -1em); translate: var(--desp) 0 }`
  y `.m.inf { clip-path: inset(calc(var(--corte) + var(--rendija)) -1em -1em -1em); translate: calc(var(--desp) * -.6) 0 }`.
- **Cómo se mide el corte.** En la isla, tras `document.fonts.load('600 1em "Geologica"')`: un `<canvas>` 2D con la
  fuente computada del elemento; `measureText("Vargas")` da `fontBoundingBoxAscent/Descent` y `measureText("x")`
  la altura de x (`actualBoundingBoxAscent`). Línea base dentro de la caja = (lineHeight − (asc + desc)) / 2 + asc;
  **`--corte` = base − 0,52 × altura de x** (un pelo por encima de la mitad del ojo medio). Es `corteDesdeMetricas()`
  de `lib/corte.ts`, en px, y se recalcula en cada `ResizeObserver` del lockup.
- **Cómo se coloca sobre el láser.** El dueño de la escena da la y del láser en la foto (`lineaLaser = Oy + eye × Dy`,
  con `eye`/`laser.y` de `hero.ts` y `placement()` de `lib/escena.ts`). Primer pase: `top = lineaLaser − offsetTop(l2)
  − --corte` (mínimo 88 px, la cabecera). **Segundo pase, tras el primer layout:** se mide la y real del corte con
  `getBoundingClientRect()` y se suma la diferencia (corrige redondeos y el `swap` de la fuente).
- **Cómo se abre y se cierra.** `desplazamientos(t)` con t ∈ [0, 1]: `--desp = −0,10 em × t` (la mitad de arriba sale
  hacia afuera, la de abajo +0,06 em hacia la cara), `--rendija = 1,5 px × t` (3 px de luz en total). Entrada **una
  sola vez**: el nombre sube entero, el láser de la foto se enciende (700 ms) y a los **880 ms** t va de 0 a 1 en
  **520 ms** `--curva-salida`. Con el scroll, el dueño escribe **t = 1 − clamp(p / 0,3)**: a p ≥ 0,3 el corte está
  cerrado y la isla pone `data-corte="cerrado"` (quita los `clip-path`, oculta `.m.inf` y `.hilo`): el nombre que
  llega a K1 es la palabra entera, no dos mitades juntas. Nunca en bucle ni con rebote (sería glitch, 01 §8).
- **Variante móvil sin corte (P1-7).** A < 1024 px (y en `losa`/`movil`) no se monta la isla y el CSS deja
  `.m.inf`, `.hilo` y los `clip-path` fuera: «Vargas» entero y un solo láser en pantalla, el de la foto. Lo mismo
  sin JS, sin GSAP y con RM (el HTML ya sale «cerrado»).
- **Accesibilidad.** El nombre accesible es el `sr-only` «Doug Vargas» (una sola vez por página); las dos líneas
  visibles y la copia son `aria-hidden`. En el acto 1 del home todo el lockup XL es `aria-hidden` (el `h1` es K2).

**Criterios de aceptación.**
- Rutas públicas **sin cambio visual** (capturas F0 = F1 en `/`, `/work/olbo`, `/cv`).
- `/lab` con `DG_LAB=1` a 390/1024/1440: tokens y escalas iguales a la maqueta (QA compara contra
  `propuestas/B/shot_B_1440_os.jpg` por superficie); sin `DG_LAB` → 404.
- Contraste medido en el lab: todos los pares de NOTAS §3 ≥ lo que dicen; párrafos > 40 car. ≥ 7:1 (§0).
- Doto nunca < 20 px (`[data-dot]` medido en el lab a 390 y 1440).
- `NameLockup` (`lockup.spec.ts` en `/lab` a 1440×900 y 1280×720, y `corte.test.ts`):
  - Fuente: `document.fonts.check('600 16px "Geologica"')` es `true`; el `font-variation-settings` computado del
    lockup contiene `"SHRP" 100`; un solo woff2 de Geologica en la red, ≤ 50 KB; CLS del lab = 0 con la carga de la
    fuente (fallback ajustado).
  - Medida: `--corte` = base − 0,52 × altura de x calculada en la página con `measureText`, ±1 px; tras un resize
    1440 → 1280 `--corte` se recalcula (cambia en proporción al `font-size`, ±1 px).
  - Abierto (t = 1): rendija de 3 ± 0,5 px (distancia entre el borde visible de `.m.sup` y el de `.m.inf`);
    `translate` de `.m.sup` = −0,10 em y de `.m.inf` = +0,06 em, ±0,5 px.
  - Cerrado (t = 0): `data-corte="cerrado"`, sin `clip-path`, `.m.inf` y `.hilo` no visibles, y una captura de la
    línea «Vargas» difiere ≤ 0,5 % de los píxeles de la misma palabra pintada sin construcción.
  - Entrada: tras 1,5 s, `--desp` = −0,10 em y `getAnimations()` del lockup vacío (no hay bucle). Con RM: cerrado
    desde el primer cuadro y ninguna animación.
  - 390×844: sin isla montada, `.m.inf`/`.hilo` no visibles, ningún `clip-path`, nombre entero.
  - Sin JS (`javaScriptEnabled: false`): nombre entero, sin rendija.
  - Accesibilidad: el nombre accesible «Doug Vargas» aparece una vez; axe limpio.
  - Reversión: cambiar `lockup.ts` + `decisiones.nombreLockup` a la opción 3 (prueba local, sin commit) no rompe el
    lab ni la medida del FLIP (alto y ancho se leen del DOM).
- vitest: `theme.tokens`, `data.singleSource` e `i18n.parity` verdes sin cambiarlos; nuevas verdes.

**Riesgos / plan B.** El primer `:root {` (línea 48 de `globals.css`, el que declara `--paper`) cambia por accidente y
rompe `theme.tokens` → los tokens van en un bloque `:root {` nuevo **después** del de la línea 86 (escala fluida),
nunca antes del de la 48; `theme.tokens` busca la cadena exacta `:root {` y `:root[data-theme="light"] {`. Descarga de Google Fonts bloqueada en el build → `next/font/local` (§1.7).

**QA.** Visual: lab a 390/1024/1440 (ES). Crítico: escala tipográfica, radios concéntricos, contraste, materiales.

---

### F2 · Rutas nuevas: `/work`, `/about`, `/experience` (ES/EN)

**Objetivo.** Que existan y sean buenas las puertas del tablero antes de construirlo, con el sistema de F1 y según las
maquetas **aprobadas por Doug el 6 nov** (`propuestas/B-paginas/{work,about,experience}.html`, con los arreglos de
NOTAS §7). El home actual sigue intacto; las páginas nuevas ya se pueden visitar por URL.

**Archivos.**
- Crear: `src/app/(es)/{work,about,experience}/page.tsx`, `src/app/(en)/en/{work,about,experience}/page.tsx`
  (`(es)/work/` y `(en)/en/work/` ya existen con `[slug]`; se añade solo `page.tsx`),
  `src/components/pages/{WorkIndexPage,AboutPage,ExperiencePage}.tsx`,
  `src/components/trabajo/{FiltroCasos,Leido}.tsx`, `src/components/perfil/*` y `src/components/trayectoria/*` (§1.3),
  `src/components/tablero/{CardCaso,CardCifras,CardArchivo}.tsx` (F3 los reutiliza), `src/components/chrome/SiteFooter.tsx`,
  `src/components/hero/HeroPoster.tsx` (`<picture>` de la foto activa de `hero.ts`, **sin hornear**: `sharp` → AVIF/WebP
  640/880 en `public/hero/199598aa-v1/`; F4 lo cambia por el póster horneado), `src/lib/{cuentas,trayectoria}.ts`,
  `src/lib/escena.ts` (solo `placement()` para `cine`/`losa`/`movil`, lo que necesita la portada de `/about`; F4 lo
  completa con `frame(p)` y su prueba; si F4 llega antes, F2 lo reutiliza).
- Modificar: `src/lib/metadata.ts` (`workMetadata`, `aboutMetadata`, `experienceMetadata` con títulos/descripciones de
  04 §4.6; las descripciones de `/work` y `/experience` se componen con `cuentas.ts`), `src/lib/personJsonLd.ts`
  (+ `ProfilePage` para `/about`, `ItemList` para `/work`; mismo `@id` de Person), `src/app/sitemap.ts`,
  `src/data/perfil.ts` (logros por hito, eras, bio, contexto), `src/i18n/dictionaries.ts` (`trabajo.*`, `perfil.*`,
  `trayectoria.*`; microcopy de NOTAS §4 en D17), `src/components/case/CasePage.tsx` (monta `RegistrarLeido`).
  El retrato `perfil-83a47bc7-v1-{640,880}` de `public/portrait/` pasa a **F3** (lo usa K13, no `/about`).
- Pruebas: `tests/e2e/matrix.ts` (+ `/work`, `/about`, `/experience` a `ROUTES`), `tests/e2e/seo.spec.ts` (E3
  esperado + 6 URLs; E1 por ruta; E2 `ProfilePage` en `/about`, `ItemList` en `/work`), **nuevas**
  `tests/e2e/{work,about,experience}.spec.ts`, `lockup.spec.ts` (+ `/about`), `src/lib/__tests__/{cuentas,trayectoria}.test.ts`.

**Común a las tres páginas.**
- Un `<main id="main">`, un `h1`, un `<footer>` (`SiteFooter`) por documento (`a11y 3.2–3.4`). La cabecera es aún el
  `SiteHeader` actual; la pastilla de B, el rail y el dock de 5 destinos llegan con F3 (que los verifica aquí también).
- Todo de datos: años, roles, periodos, empresas y cifras desde `cv.ts`/`work.ts`/`perfil.ts`/`cuentas.ts`; ningún
  literal en componentes (`data.singleSource`). Cifras Doto con miles por idioma (ES `2.000+`, EN `2,000+`).
- Movimiento: GSAP solo por `import("gsap")` tras `load`, solo ≥ 1024 px, sin RM. Sin JS, sin GSAP o con RM, cada página
  se pinta en su **estado final estático** (no hay contenido que dependa de una animación para verse).
- Las cards de caso son `BentoCard` y enlazan a `/work/[slug]` (página completa; la hoja llega en F6, D21).

**`/work` · `WorkIndexPage` (`work.html`).**
- Orden (DOM = visual = Tab): cabecera de 12 columnas → `h1` «Trabajo» (96 px, P2-1) + intro de 04 §6.3 en col 1–7 y
  `CardCifras` «En cifras» (losa clara: `aniosEnProducto()` · `casosPublicados()` · `productosPropios()`, copy de K12) en
  col 8–12 → `FiltroCasos` en el flujo a 32 px del bloque (P1-2) → `<ul>` de **losas protagonistas** (los 6 de
  `home.ordenCasos`, un solo protagonista cada una: Naowee 7 × 4 oscura con captura; Andes 5 × 4 jelly azul con las cifras
  y el chip «NDA · Caso a solicitud»; olbo niebla con el teléfono; Banco de Occidente; DC Medical; MakeaPet, la única
  magenta) → `<section>` **archivo** con los 4 de `home.archivo` (Royal Caribbean, Qrvey, Ideaware, Chub) en filas
  `{número} · proyecto · cliente · año · Leer el caso` (`CardArchivo`, el mismo de K16).
- Rejilla por `grid-column/row: span` (sin `grid-template-areas`) para que el filtro refluya sin huecos.
  1024–1279: Naowee a 12 columnas y el resto a 6. < 1024: una columna.
- Numeración visible = posición en `ordenCasos` ++ `archivo` (/01 … /10, P1-1). Grupo de filtro = `grupoCaso(slug)`.
- «Leído» = `MarcaLeido` (aparece en la losa del caso abierto antes, en este navegador).
- **Móvil:** «En cifras» en fila compacta (padding 12/16, cifras a 30 px, etiquetas a 12, sin ceja visible: el
  `aria-label` del grupo se queda), `h1` a 60, filtros a 16 (P1-3). La captura de Naowee entra entera en el pliegue.

**`/about` · `AboutPage` (`about.html`).**
- Portada (`PortadaPerfil`): la foto activa de `hero.ts` a pantalla completa con velo y láser; el `h1` es
  `NameLockup escala="xl" corte`, colocado para que el láser pase por el corte de «Vargas» (F1). ≥ 1024: escenario
  sticky de 210 svh + `ScrollTrigger` scrub 0,3 **sin pin**: corte cerrado p 0–0,3; foto a losa en col 8–12 (radio 48)
  p 0–0,7; vidrio .62 → .08 p 0–0,85 (conocer a Doug es verlo sin estrías); bio de tres frases p 0,5–0,8; el hilo deja de
  cruzar el nombre y se recorta hacia la losa. Entrada: textos +16 px en 600 ms `expo.out` (60 ms de escalonado), láser
  `scaleX` 700 ms, corte a 880 ms. El vidrio es un hueco en F2 (foto limpia); F3 monta `VidrioCss` y F4 `VidrioGL`.
- Luego, en este orden: contexto (2 párrafos) → «Lo que hago» (3 losas, Sistemas en jelly azul; rejilla
  `auto · 64px · título · párrafo`, 32 px en móvil, P1-13) → «Cómo trabajo» (losa clara, 4 nodos cosidos por el hilo) →
  «Datos» y «Con qué trabajo» (`getCv(locale).tools`) → «Dónde he trabajado» (`getWordmarks()` en Geologica, 2 filas de 4
  a 18 px; 2 columnas en móvil) → «Lo que dicen…» (las 3 citas verbatim de `testimonials.ts` con `lang="en"`, la del
  centro en magenta; «Citas originales en inglés» solo en ES, en la línea base del H2) → cierre «Lo demás está en el
  trabajo.» con «Ver casos» y «Descargar CV (PDF)» (`decisiones.pdfPorIdioma`).
- **Móvil (< 1024):** sin sticky ni scrub; foto a 100 svh con velo inferior; nombre entero, **un solo láser** (P1-7);
  la lente del vidrio sigue el arrastre (F4).
- **RM:** estado final (foto en losa, corte cerrado, bio visible), sin lente ni entrada.

**`/experience` · `ExperiencePage` (`experience.html`).**
- Estructura: ceja «Trayectoria», `h1` «De freelance a Head of Product», intro con años derivados; contador
  (`Odometro` Doto 120 px, 4 columnas, chip «Hoy») y era, ambos `aria-hidden`; `<dl>` de acumulados (años en producto
  digital · empresas · casos publicados); `<ol>` con los **10 hitos** de `lib/trayectoria.ts` (UAC 2006–2009, Freelance,
  Smartbiz, Ideaware, Qrvey vía Ideaware, Globant · Royal Caribbean, Freelance · Chub en paralelo, Aval Digital Labs ·
  Banco de Occidente, Mercadolibre · Andes, Naowee), **siempre completo en el DOM**; eje `aria-hidden` con eras,
  tramos proporcionales (`scaleX` ligado al año), años en Doto, recorrido láser con cabezal y la pista «Productos
  propios · 2026» como columna de 140 px a la derecha del eje (punto + nombre, sin año propio, P1-12).
- **Una sola cuenta (P1-4):** los propios de la pista son `productosPropios()` (olbo, DC Medical, MakeaPet) y Chub es
  un hito, no un propio; «casos publicados» al final = 7 hitos con caso + 3 propios = `casosPublicados()` = el 10 de
  `/work`; «empresas» = `empresas()` = 6; años = `aniosEnProducto()` = 12.
- **Escritorio ≥ 1024 (con GSAP, sin RM):** `pin` de **3,6 viewports**, scrub 0,5. **Scroll por hito** (P1-9): el año
  es `yDe(p)` (1/n del recorrido por hito); el eje sigue dibujando duraciones reales, solo cambia la velocidad del
  cabezal. El hito activo entra con fundido + 12 px en 240 ms; los demás quedan apilados con opacidad 0 pero en el árbol
  accesible. **Foco por Tab (P0-1):** `focusin` en un hito → `scrollTo` instantáneo a `st.start + pDe(i) × (st.end −
  st.start)` + `progress(1)` del scrub: la escena llega a ese hito y el foco se ve. **Odómetro sin «0 · 0 · 0»**
  (P1-8): mientras un acumulado vale 0, su `dd` va vacío y dibuja un guion largo (`--tinta-3`), y la losa queda a
  opacidad .6 hasta el primer valor ≥ 1. **Cabe a 1280×720** (P1-10): con `max-height: 820px`, `.exp-izq` y `.hitos`
  a `calc(100svh − 360px)`, eje sin `padding-top`, tramos y años más bajos y la pista a la derecha del eje.
- **Móvil:** línea vertical sin pin; barra fija con el contador a 48 px y los acumulados; activo = el hito que cruza
  el 55 % del viewport, que fija el año; barra de duración de 40 px por año (mínimo 8). Hitos inactivos (`.fuera`):
  **opacidad 1**; baja el material (fondo transparente + filo `--losa-borde`), no el texto (P1-11).
- **RM / sin GSAP / sin JS:** línea completa y estática, todos los tramos dibujados, contador en el año actual,
  acumulados en su total y todos los hitos visibles en rejilla.

**Criterios de aceptación.**
- **Comunes:** las 6 rutas responden 200 con `<html lang>` correcto, `title`/`description` de 04 §4.6, `hreflang` y
  canonical; sitemap con las 6; JSON-LD de E2; 1 `main#main`, 1 `h1`, 1 `<footer>` en cada una; ningún marcador
  (`copy.sinMarcadores`); axe sin violaciones (ES y EN, con y sin RM); `a11y 3.1` (≥ 7:1 en párrafos) y `3.6` (≥ 44 px)
  verdes; sin desborde 320–1920; capturas 390/1024/1280×720/1440 ES y EN, con y sin RM, comparadas con las `shot_P_*`.
  `cuentas.test.ts` y `trayectoria.test.ts` verdes.
- **`/work` (`work.spec.ts`):**
  - a 390×844 la losa de Naowee está entera dentro del viewport (`bottom ≤ 844`; desde F3, ≤ 844 − alto del dock);
    a 1440×900, `h1`, «En cifras» y los filtros están en el primer pliegue;
  - los filtros **no** son `sticky`/`fixed` (estilo computado) y tras `scrollTo(0, 1300)` no están en el viewport;
  - «Productos propios» → `productosPropios().length` (3) losas visibles, `aria-pressed="true"` solo en ese botón y el
    `aria-live` dice «3 casos»; «Anteriores» → solo el archivo (4 filas); «Todos» → 10; sin JS → 10 visibles y ningún
    botón de filtro;
  - los `/NN` visibles, en orden del DOM, son `/01 … /10` consecutivos; cada card enlaza a `/work/<slug>` y la de Andes
    muestra «NDA»;
  - «En cifras» muestra exactamente `aniosEnProducto()`, `casosPublicados()` y `productosPropios().length`
    (la prueba importa `src/lib/cuentas.ts`, como `seo.spec` importa de `src/data`).
- **`/about` (`about.spec.ts` + `lockup.spec.ts`):**
  - nombre accesible «Doug Vargas» una sola vez (el `h1`);
  - ≥ 1024 (1280×720, 1440×900, 1920×1080), en p = 0 tras la entrada: la y del `.laser` de la foto cae dentro de la
    rendija del corte (±2 px); en p ≥ 0,3, `data-corte="cerrado"`;
  - la rueda siempre mueve la página: no existe `.pin-spacer` y `scrollY` crece en cada paso de rueda;
  - en p = 0,7 la foto ocupa el rectángulo de col 8–12 (±2 px); en p ≥ 0,8 la bio tiene opacidad 1;
  - 390×844: hay **un** solo elemento láser visible (el de la foto), `.m.inf` no visible y ningún `clip-path` en el
    nombre;
  - «Lo que hago»: los tres títulos con el mismo `top` (±1 px) a 1440; marcas: ninguna fila con una sola marca a
    1440 y a 390;
  - citas con `lang="en"` y texto idéntico a `testimonials.ts`;
  - `perf.spec`: LCP (la foto) < 2,0 s móvil, CLS < 0,02 incluida la carga de Geologica; RM → estado final sin sticky.
- **`/experience` (`experience.spec.ts`):**
  - **Tab sin focos invisibles:** a 1440×900, 1280×720 y 390×844, se pulsa Tab hasta volver al inicio; en cada parada,
    420 ms después, el elemento enfocado tiene opacidad acumulada 1, es visible y está dentro del viewport (la prueba
    de NOTAS §7: 0 paradas invisibles); al enfocar el «Ver caso» del hito i, ese hito es el activo;
  - **contraste de hitos inactivos ≥ 4,5:1** a 390×844: para cada `li` no activo, rol, periodo, título y logro medidos
    con su color efectivo (opacidad acumulada incluida) contra el fondo real (`contrast-detail` + axe `color-contrast`);
  - **la escena cabe:** a 1280×720, 1366×768 y 1440×900, en p = 0, 0,5 y 1, `eje.getBoundingClientRect().bottom ≤
    innerHeight` y la losa del hito no desborda (`scrollHeight ≤ clientHeight + 1`);
  - **scroll por hito:** avanzar el scroll en pasos de 3,6 × vh / 10 activa los hitos 0 → 9 en orden, sin saltarse
    ninguno (vitest: `yDe((i + 0,5)/n)` cae dentro del tramo del hito i y `pDe(i)` lo activa, para todo i);
  - **odómetro sin ceros:** en p = 0 ningún `dd` de acumulados contiene el texto «0» y su losa está a opacidad .6;
  - **una sola cuenta:** en p = 1 (y con RM) los acumulados son `aniosEnProducto()` · `empresas()` · `casosPublicados()`
    (12 · 6 · 10); la pista tiene `productosPropios().length` (3) nombres, los mismos que el filtro «Productos propios»
    de `/work`; ningún nombre de la pista se monta sobre la fila de años (sin intersección de cajas);
  - RM: sin `.pin-spacer`, los 10 hitos visibles, el contador en el año actual; sin JS: el `<ol>` con 10 `li` visibles.

**Riesgos / plan B.** Duplicar `ProfilePage` (`/cv` ya lo tiene, E2) → mantener los dos con el mismo `mainEntity`. Si
Doug prefiere `/experience` dentro de `/about` (D3): la ruta pasa a `redirect` permanente a `/about#experience`. El pin
de `/experience` y el sticky de `/about` conviven con la cabecera fija: si `ScrollTrigger` calcula mal tras la carga de
Geologica, `ScrollTrigger.refresh()` en `document.fonts.ready` (como la maqueta). Sin GSAP en una red lenta, la página
ya está completa (estado final).

**Paralelo.** Puede correr a la vez que **F4** (archivos disjuntos: F4 no toca `perfil/`; F2 no toca `lib/gl`).

**QA.** Visual: 6 rutas × 4 anchos × ES/EN × RM, y los fotogramas 0/25/50/75/100 % de `/experience` y de la portada de
`/about`. Crítico: jerarquía de `/about`, legibilidad y ritmo del timeline, filtro, contra las `shot_P_*` aprobadas.

---

### F3 · Tablero OS estático + cromo nuevo (reemplaza el shell horizontal)

**Objetivo.** El home es el OS de B **en su estado final** (el mismo que verán reduced-motion y sin JS), con cabecera
pill, rail, dock, footer y móvil «app». El retrato es el póster provisional con franjas CSS (sin WebGL todavía). Es la
fase que retira el shell y reescribe sus pruebas.

**Archivos.**
- Crear: `src/components/tablero/*` (§1.3; **reutiliza** `CardCaso`, `CardCifras` y `CardArchivo` de F2),
  `src/components/chrome/{RailAcciones,DockMovil}.tsx` (`SiteFooter` ya existe desde F2),
  `src/components/hero/VidrioCss.tsx` (`HeroPoster` ya existe desde F2, con la foto `199598aa` en AVIF/WebP en
  `public/hero/199598aa-v1/`, sin hornear aún), `src/components/escena/Escena.tsx` (solo estado OS),
  `public/portrait/perfil-83a47bc7-v1-{640,880}.avif/webp` (K13, con `sharp`; la foto mide 880×1168: no hay 1080).
- Integrar en las páginas de F2: cromo nuevo (pastilla con pill activa `aria-current="page"`, rail, dock de 5
  destinos) en `/work`, `/about`, `/experience`, y `VidrioCss` en la portada de `/about`.
- Reescribir: `src/components/pages/HomePage.tsx`, `src/components/SiteHeader.tsx` → `components/chrome/SiteHeader.tsx`
  (actualizar import en `RootDocument`), `src/components/LanguageSwitch.tsx` (conserva ruta **y hash**; usa
  `activeSection`).
- Borrar: lo de §1.4 salvo Velaris/HeroField (F4); el CSS del shell y del rail viejo en `globals.css`;
  `src/data/sections.ts` (migrar `i18n.parity` a `home.secciones`).
- Pruebas que se reescriben (motivo: el shell horizontal ya no existe):
  - `keyboard 6.2–6.5` → nuevas `6.2` orden de Tab = orden del DOM (K2, K1, K3…), `6.3` Enter en una card navega,
    `6.4` cada sección tiene un tabulable, `6.5` las pills con Enter llevan el foco a su sección.
  - `recheck R4/R5`, `recheck2 R4b` → retirados (cubiertos por los nuevos 6.x); `R1` conserva el conteo de landmarks
    (solo lo registra; quien lo afirma es `a11y 3.2–3.4`).
  - `i18n I3` → «el switch conserva el **ancla** de la sección» (`/#work` → `/en#work`) usando las pills.
  - `layout 5.3–5.4` (geometría del shell) → `5.3` el OS a 1440×900 cabe en el pliegue (6 filas), `5.4` ninguna
    `.tarjeta` recorta (`scrollHeight ≤ clientHeight + 1`) a 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080.
  - `measure M2` (resplandor del héroe viejo) → retirada; `M3` (rojos) se queda como medida informativa.
  - `hero320.spec` (hoy solo toma capturas) → se le añaden aserciones: foto a sangre + K2 sin desborde a 320.
  - `settle.ts` → quitar la caminata de `[data-hshell]`.
  - `content X2` → se mantiene en F3 (la card de olbo lleva a la página completa); se reescribe en F6.
  - `visual.spec` → regenerar (no tiene línea base comprometida).
  - `keyboard 6.3` (ArrowDown dentro del panel Work, usa `[data-hshell]`/`[data-panel]`) → retirada con las 6.2–6.5.
  - `keyboard 6.6` (menú móvil en `/` a 375: `header button[aria-expanded]` + Esc) → se conserva si el header B
    mantiene un botón de menú a < 1024; si el dock lo reemplaza en el home, se reescribe como «el dock y el menú de
    `/cv` responden a Esc y devuelven el foco» (motivo: el home móvil navega por dock).
  - `motion 7.2` (viñeta de Naowee con «5» y «4» en `/`) → se reescribe sobre `/work/mercadolibre-andes` (la viñeta
    de `CaseNda`, estado final con RM), salvo que el tablero reutilice las viñetas; con el home nuevo pasaría por
    casualidad («n de 4»), que es peor que fallar.
  - `i18n I2` y `I4` (selectores de la cabecera, también en `/cv`) → verdes **sin cambiarlas** si el header conserva
    los selectores de §1.3; si no, se reescriben con motivo (y es un cambio en la cabecera de `/cv`).
  - `a11y 3.2–3.4` (un `h1`, un banner, un `main#main`, **un** `<footer>`) en `/` → verde sin cambiarla:
    `SiteFooter` es el único `<footer>` del home y el `Contact.tsx` viejo se va con el shell.
  - `content 10.1` y `10.5` → verdes sin cambiarlas («Head of Product» en el texto del home; el chip NDA una vez).
  - `frames F2/F3`, `measure M3/M4`, `R1`, `hero320` solo registran: se dejan, y donde el plan les pide un criterio
    («R1 verde», «hero320 sin desborde») se les **añade** la aserción con motivo.
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
  baseline + 15 KB gz; póster ≤ 120 KB en su ancho mayor (880 px con la foto provisional de 880×1168).
- `/cv` y los PDFs sin cambios (el header nuevo se oculta al imprimir: `print 8.1–8.3`, `recheck R3`).
- Páginas de F2 con el cromo nuevo: a 390×844 el dock tiene 5 destinos (Trabajo · Perfil · Experiencia · CV ·
  Contacto) con `aria-current="page"` en el de la página; la losa de Naowee de `/work` sigue entera sobre el dock; los
  criterios de `work/about/experience.spec` siguen verdes; `/about` sin WebGL muestra `VidrioCss` en la portada.
- K12 del home usa `CardCifras` con `cuentas.ts`: mismos valores que «En cifras» de `/work` (misma prueba).

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
  `cine`/`losa`/`movil`, `frame(p)`; si F2 ya creó `placement()`, F4 lo completa), `src/components/hero/{VidrioGL,useLente}.ts(x)`,
  `scripts/build-hero-poster.ts` (Playwright abre un arnés con el mismo shader y la foto de `hero.ts`, toma el canvas
  en estado `losa`/`movil` y `cine` a 1440×900; `sharp` → AVIF q 55–60 y WebP q 78 en 640/1080/1600/1920, sin pasar
  del ancho nativo de la foto; escribe `public/hero/<id>-<version>/…` y un `manifest.json`). **Medido:** las fotos
  de `retratos-hf/` (`199598aa`, `83a47bc7`, `a4ef948f`) miden **880×1168**: con la provisional solo salen 640 y 880
  de la foto; el póster del **estado `cine`** (canvas horneado a 1440/1920, con las estrías) sí puede salir a esos
  anchos, pero es la foto de 880 ampliada ×1,6–2,2 → aceptado mientras sea provisional; la imagen final (D7) debe
  llegar con un máster ≥ 1920 px de ancho (se anota en `hero.ts` y en 08-ENTREGA).
  `src/lib/__tests__/escena.test.ts`.
- Modificar: `HeroPoster.tsx` (usa el póster horneado), `K1Retrato.tsx`, la cabecera móvil del tablero y
  `PortadaPerfil` de `/about` (montan `VidrioGL` diferido; en `/about` la fuerza va de .62 a .08 con el `p` del
  sticky, F2), `src/data/hero.ts` (rutas reales del manifest). `vidrio.spec` cubre también `/about`.
- Borrar: `src/components/hero/{HeroField,Velaris}.tsx` (su ciclo de vida —DPR ≤ 1,5, `IntersectionObserver`,
  `visibilitychange`, RM— queda en `VidrioGL`).
- Pruebas nuevas: `tests/e2e/vidrio.spec.ts` con proyectos de lanzamiento: (a) Chromium normal (canvas visible tras el
  fundido, póster sigue siendo el LCP); (b) `--disable-webgl` → póster + `VidrioCss` visibles, sin errores; (c) RM → un
  solo cuadro, sin bucle rAF tras 1 s (contador expuesto en `data-cuadros` del canvas), `getAnimations()` vacío;
  (d) `hasTouch` → arrastre vertical hace scroll, horizontal mueve la lente; (e) `webglcontextlost` simulado
  (`WEBGL_lose_context`) → respaldo CSS. Una prueba de **cambio de foto**: un preset de prueba con otra imagen 3:4 del
  repo (`docs/rediseno-2026/retratos-hf/a4ef948f.jpg` copiada a un fixture de `tests/`) renderiza sin tocar
  componentes.

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
  K2 viaja 0 → 0,6 y cambia material con `--m` 0,30 → 0,52 y `--mt` de golpe en 0,41 (P1-2); nombre XL
  (`NameLockup escala="xl" corte` + `NameLockupCorte` de F1, colocado sobre el láser de la foto; el corte se cierra
  entre p 0 y 0,3 y llega entero) por FLIP a K1, escala medida, `y0 = max(88, …)` y 96 px con alto ≤ 800 (P0-1); losas solo con opacidad, `y 24 → 0`, escala
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
- `lockup.spec` en el acto 1 a 1280×720, 1440×900 y 1920×1080: en p = 0 el láser cae en la rendija (±2 px); en
  p ≥ 0,3 `data-corte="cerrado"`; en K1 la palabra entera; a 390 sin corte (P1-7).
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
  `src/components/cv/CvExperience.tsx` (**solo** `<Link>` → `<a>` en «Ver caso», D22; sin cambio visual: `print`,
  `I6` y la captura de `/cv` lo vigilan), `CaseBody` con `enHoja` (§1.2: `h2`, colofón sin `<footer>`, `<article>`),
  las dos páginas del slot con `notFound()` para slug inexistente,
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
  Más, por lo verificado en §1.2: con la hoja abierta sobre el home hay **1** `main#main`, **1** `h1` y **1**
  `<footer>` en el documento (el dialog no aporta ninguno); hoja → enlace del caso a `/#work` → no queda hoja pintada
  (slot rancio oculto); desde `/cv`, clic en «Ver caso» → página completa, sin `dialog`.

**Criterios de aceptación.**
- Capturas: hoja de Naowee, Andes (NDA), olbo, DC Medical a 1440 y 390, ES y EN (comparar con `shot_B_1440_hoja.jpg`,
  `shot_B_390_hoja.jpg`); página completa de los mismos por URL directa sin cambios frente a F5.
- `hoja.spec` y X2a/X2b verdes; axe sin violaciones con la hoja abierta; `a11y 3.2–3.4` verde en página completa y la
  aserción equivalente de `hoja.spec` en el home con hoja abierta (1 `main#main`, 1 `h1`, 1 `<footer>`; la hoja no
  tiene `<main>`). (`R1` solo registra: no sirve de criterio.)
- `/cv` con «Ver caso» → página completa; `print 8.x`, `I6` y la captura de `/cv` idénticos a F5.
- La hoja no rompe el pin ni la lente (al cerrar, el tablero sigue en el mismo progreso).
- Sin peticiones extra al abrir (la ruta del slot está prerenderizada; prefetch de `Link`).

**Riesgos / plan B.** Conducta de la interceptación distinta a §1.2 en la versión instalada: §1.2 quedó verificado
en 16.3.5 (código de reescrituras idéntico en 16.4.5); el ejecutor de F6 repite las cinco comprobaciones de §1.2 como
primeras pruebas de `hoja.spec` tras el upgrade de F0. Plan B: la hoja como **componente cliente** abierto por el `onClick` de la card con `history.pushState` a
`/work/[slug]` (URL real y compartible; recarga → página completa) y `popstate` para cerrar; el contenido de la hoja se
pide con el payload RSC de la ruta o con un `fetch` a un JSON estático generado en build. Peor que el patrón de Next,
pero sin dependencias de su router.

**QA.** Visual: hoja en 4 casos × 2 anchos × ES/EN × RM. Crítico: hoja (tiempos, velo, progreso láser, arrastre),
teclado y lector de pantalla (VoiceOver en Safari en F8).

---

### F7 · Casos, páginas y transiciones al sistema B

**Objetivo.** Que la página completa del caso y la hoja sean **la misma pieza** de `propuestas/B-paginas/caso.html`
(aprobada por Doug el 6 nov, con P1-5 y P1-6 de NOTAS §7), con los tokens y la tipografía de B, sin perder contenido de
la plantilla actual, y que las navegaciones tengan sus transiciones. Aplica las decisiones de tema y 404.

**Plantilla del caso (orden de 02 §5.3; es el orden del DOM y del Tab).** Un bloque sin datos no se pinta, y su
entrada del índice tampoco.
1. **Miga** `Trabajo / {proyecto}` (`<nav aria-label>`): `CaseHeader` enlaza a `localePath(locale, "/work")` en vez de
   `"/#work"` (hoy línea 67).
2. **Portada** (`CaseHeader` + `CaseMeta`): ceja (estado · rol), `h1` a 120 px (72 a < 1024), gancho (`tagline`) en
   col 1–7 y **ficha** en col 8–12 (ver abajo).
3. **Captura a sangre** (`CaseShowcase`/`CaseCover`, 16:8, radio `--r-losa`, `fetchpriority="high"`: es el LCP de la
   página completa). Caso NDA → `CaseNda` con el jelly azul de K4, sin galería.
4. **Tablero de impacto** (`CaseImpact`, ver abajo; `h2` «Impacto» `sr-only`).
5. **Problema** (`context`) y 6. **Mi parte** (`contributions`): bloques de dos columnas (ceja + `h2` | prosa 18 px,
   ≤ 34 em).
7. **Decisiones** (`CaseDecisions`): cada una con su título y cuerpo (y su evidencia al lado si el caso trae figura).
8. **Producto**: `video` con póster, `controls`, `muted playsinline`, **sin autoplay**, `preload="none"`, y la galería
   con los captions de `work.ts` (`CaseGallery`). Los capítulos `story`/`film` y las `features` de los casos largos van
   en este bloque, en su orden actual.
9. **Proceso** (`CaseProcess`): riel de 3 fases cosido por el hilo láser.
10. **Testimonio** (`CaseTestimonial`) solo si `testimonialId` (Naowee no tiene).
11. **Colofón** (`CaseColophon`): herramientas (`technologies`), enlaces (`links`/`externalLink`: salen de la ficha) y
    autoría (`credits`). `<footer>` en página completa, `<div>` en la hoja (§1.2).
12. **Siguiente caso** (`CaseNext`, `getNextCaseStudy`, D19) + «Hablemos».

**Ficha 2 × 2 sin escalera (P1-5, `CaseMeta`).** `<dl>` en 2 columnas, **sin cajas**: cada celda es `dt` (12 px,
`--tinta-3`) + `dd` (18 px, `--tinta`) con un filete superior de 1 px `--losa-borde`. Orden: **Rol · Duración ·
Plataformas · Equipo**, con Equipo a todo el ancho y al final. Todas las celdas caen en las dos columnas (nunca se
desplazan en escalera) y el bloque se alinea abajo con el gancho. «Año» sale de la ficha (Duración ya lo lleva; si la
duración es solo el año, se muestra el año, como hoy). Plataformas viene del campo opcional **NUEVO** `platforms` de
`work.ts` (§1.5); si falta, no se pinta. Móvil: `gap` 12/16, `dd` a 16 px, y la portada entra en el pliegue.

**Tablero de impacto con tope por ancho (P1-6, `CaseImpact`).** `<ul>` de 4 columnas ≥ 1280 y 2 por debajo; cada KPI
es una losa (`--losa-alta`, `--filo`, radio `--r-m`, `min-height: 0`: mide lo que lleva) con `container-type:
inline-size`. La cifra va en `DotMatrix` (Doto, `white-space: nowrap`, tracking −0,06 em) a
**`font-size: min(72px, 100cqi / k)`** (48 px en lugar de 72 a < 1024), donde **k es el ancho en em de la cifra más larga
del caso**, el mismo para las cuatro losas. Se reutiliza `figureSize()` de `CaseImpact.tsx` (hoy calcula
`min(clamp(…), 100/ancho cqi)` con los avances de Archivo) recalibrado con los avances de Doto: para «~1.200», k ≈ 3,05
(69 px a 1440). La primera losa es la **clara** (`--claro`, etiqueta en `--tinta-osc-2`); en las demás la etiqueta va
en `--tinta-2` a 16 px y el `delta` como nota pequeña. Encendido al entrar al 40 %: Doto de 100 a 700 en 400 ms
`--curva-salida` con 60 ms de escalonado; con RM, 700 sin transición. Punto de miles con el arreglo de NOTAS §6.

**Índice lateral (página completa, ≥ 1280).** `CaseIndice` en col 1–2, sticky a 128 px: rótulos Impacto · Problema ·
Mi parte · Decisiones · Producto · Proceso (solo los presentes), hilo de 1 px que se llena de láser con la lectura y
punto de presencia en la sección actual (`aria-current="true"`, sin transición). Ni en la hoja ni a < 1280.

**Hoja (sobre F6, URL real de §1.2).** El mismo `CaseBody` con `enHoja`: sin índice lateral, una sola columna, título
`h2` a 72 px (48 a < 1024), progreso en el hilo láser de la cabecera de la hoja, «Abrir como página completa»
(`aria-label`, `href` = `/work/<slug>`) y Cerrar. En móvil, el dock del caso cambia «Contacto» por «Secciones»
(`HojaSecciones`).

**Archivos.**
- Modificar: `src/components/case/*` (migrar `--paper/--ink/--signal/--ease-out` a los tokens B; títulos en Urbanist,
  texto en Instrument Sans, KPIs en `DotMatrix`; `CaseHeader` con miga a `/work`; `CaseMeta` como ficha; `CaseImpact`
  como tablero; `CaseColophon` con los enlaces; `CaseNda` con el jelly azul de K4), `src/components/pages/CasePage.tsx`
  y `CaseBody.tsx` (orden de arriba), `src/components/work/*` (marcos sobre losas),
  `src/data/work.ts` + `src/data/es/work.ts` (`platforms`, solo donde Doug lo confirme o ya se desprenda del caso:
  Web / iOS / Android; sin dato, se omite), `src/components/pages/{CaseNotFound,NotFoundContent}.tsx`
  + diccionario (copy 404 de 04 §4.5; el chiste de la máscara se retira porque ya no hay máscara → «Aquí no hay nada.»
  / «Nothing here.» como valor por defecto, D17), `globals.css` (`@view-transition { navigation: auto; }` para es ↔ en
  y para el `<a>` de `CaseNext`; `::view-transition-*` para `<ViewTransition>`), `WorkIndexPage.tsx` (card → página
  completa con `<ViewTransition name={"caso-" + slug}>` en la media cuando la hoja no aplica: Cmd+clic no, solo
  enlaces «Abrir como página completa» de la hoja), `components/chrome/SiteHeader.tsx` (D4: `ThemeToggle` solo en
  `/cv`), `DockMovil.tsx` (variante «Secciones» en casos), `src/app/(es)/layout.tsx` y `src/app/(en)/layout.tsx`
  (`themeColor` `#060608` en rutas B si D4 se confirma; actualizar `theme.tokens` con motivo).
- Crear: `src/components/case/{CaseIndice,HojaSecciones}.tsx`.
- **No se toca:** `src/components/cv/*` (salvo D22, F6), `CvPage.tsx`, `public/cv/*`, `scripts/build-cv-pdf.ts`,
  `scripts/cv-fonts/*`, el bloque de impresión de `globals.css`.
- Pruebas: **nueva** `tests/e2e/caso.spec.ts` (abajo); `layout 5.5` y `sticky S1` (ojo sticky de «Decisiones clave»)
  → revisar con la plantilla nueva; `frames F1–F3`, `measure M1` (marcos de `/work/chub`) → actualizar medidas si cambian
  radio/sombra, con motivo; `motion 7.4` verde; `visual` regenerada; `theme.tokens` actualizada si cambia `themeColor`
  o el primer `:root`; `data.integrity` con `platforms`.

**Criterios de aceptación.**
- **Ficha** (`caso.spec`, los 10 casos a 1440, 1024 y 390): las celdas no tienen fondo ni sombra y sí `border-top` de
  1 px; sus bordes izquierdos toman **solo 2 valores** de x (las dos columnas); las celdas de una misma fila comparten
  `top` (±1 px); Equipo es la última y ocupa el ancho de la ficha (±1 px); el orden de los `dt` es Rol · Duración ·
  Plataformas · Equipo (sin los ausentes); a 390×844 el borde inferior de la ficha ≤ 844 − alto del dock.
- **Tablero** (los 10 casos a 1440, 1280, 1024 y 390, ES y EN): cada cifra en **una línea** (alto ≤ 1,1 × `font-size`)
  y sin desborde (`scrollWidth ≤ clientWidth`); todas las cifras de un caso con el **mismo** `font-size`, ≤ 72 px
  (≤ 48 a 390); ninguna losa con alto mayor que su contenido + padding (±1 px); la primera losa es la clara;
  etiquetas ≥ 4,5:1 (axe); en Naowee, «~1.200» (ES) y «~1,200» (EN) con `span.punto` solo en ES.
- **Índice** (≥ 1280): al llevar cada sección al centro del viewport, su enlace tiene `aria-current="true"` y el
  `scaleY` del hilo crece de forma monótona; cada `href="#id"` existe en la página; no está en la hoja ni a 1024/390.
- **Hoja** (sobre `hoja.spec` de F6): mismo conteo de `h2`, imágenes y KPIs en la hoja y en la página completa; sin
  índice lateral; título a 72 px (48 a 390); «Abrir como página completa» con `href` = URL real del caso; dock a 390
  con «Secciones», que abre `HojaSecciones` y, al elegir una sección, lleva el foco a su `h2`.
- **Contenido:** capturas de `ROUTES` completas (los 5 casos de la matriz + `/work`, `/about`, `/experience`) a
  390/1024/1280×720/1440, ES/EN, RM, comparadas con `shot_P_caso_*`; ningún caso pierde contenido frente a F0 (conteo
  de `h2`, imágenes y KPIs por caso igual al baseline); el vídeo no se reproduce solo (`paused` tras 2 s).
- `/cv` a 1440 en tema claro y oscuro y su impresión: idénticos a F0 salvo la cabecera; `print 8.0–8.5` verdes.
- Morph de la media al pasar de `/work` a un caso (Chromium) en 400 ms `--curva-io`; RM → fundido 200 ms; navegador
  sin API → navegación instantánea.
- `a11y` completo verde en tema `dark` y `light` (las superficies B ignoran `data-theme`; `/cv` sigue respondiendo).

**Riesgos / plan B.** Es la fase más larga en archivos: se divide en **F7a** (tokens, tipografía, ficha y tablero, sin
mover bloques) y **F7b** (orden de 02 §5.3, índice lateral, «Secciones» del dock, colofón con enlaces), cada una con
sus criterios de arriba. El orden ya no es opcional: está aprobado. Si `<ViewTransition>` no está (plan B de §1.9),
se omite el morph. Casos sin `platforms` confirmado: la ficha queda en Rol · Duración · Equipo (sigue sin escalera).

**QA.** Visual: matriz completa de `ROUTES` y la hoja de 4 casos. Crítico: plantilla de caso con la lente de
reclutador (02 §2) y director de diseño, contra `shot_P_caso_*`.

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
  Hoy `playwright.config.ts` no declara `projects` (solo Chromium) y en `/opt/pw-browsers` **solo está Chromium 1243**:
  hay que añadir los proyectos y correr `npx playwright install webkit firefox` (WebKit 2359, Firefox 1543 para 1.63);
  si el proxy no deja bajarlos, el smoke de WebKit/Firefox queda en el checklist de Doug. `perf.spec` usa CDP:
  se limita al proyecto Chromium.

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
| F2 | F1 (y `sharp` de F0) | **F4** | F3 enlaza a sus rutas: F3 empieza cuando F2 está aprobada. F2 crea `HeroPoster`, `SiteFooter`, `CardCaso`, `CardCifras`, `CardArchivo` y `lib/cuentas.ts`, que F3 reutiliza. La portada de `/about` sale en F2 sin vidrio (foto limpia + corte). |
| F4 | F1 (y `HeroPoster` de F2) | **F2**, y F3 en su tramo final | Archivos disjuntos (`hero/VidrioGL`, `lib/gl`, `scripts/`). Se integra en K1 al cerrar F3 y en la portada de `/about`. |
| F3 | F1, F2 | F4 | Fase que reescribe las pruebas del shell. Monta el cromo nuevo (dock de 5) y `VidrioCss` también en las páginas de F2. |
| F5 | F3, F4 | **F6** (con dueños de archivos de §F5) | F5 se integra primero. |
| F6 | F3 | F5 | — |
| F7 | F6 (y F5 integrada), F2 (`RegistrarLeido`, numeración y `/work` de destino de la miga) | — | Divisible en F7a/F7b; el orden de 02 §5.3 ya no es opcional. |
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
| ~~D6~~ | Tipografía del nombre | **Decidida el 6 nov:** opción 4 «corte láser» (Geologica SHRP 100), sin corte en móvil (P1-7). Ya no es un valor por defecto; reversión de una línea en «Correcciones del 6 nov» | `src/app/fonts/lockup.ts` + `decisiones.nombreLockup` | `NameLockup`, `Wordmark` |
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
| D17 | Microcopy nuevo de B no validado | «Cerrar/Close», «Anterior/Siguiente», «n de 4 / n of 4», «Desliza/Scroll», K13 «Diseñador de producto que construye.», 404 sin máscara «Aquí no hay nada.»; de las páginas internas (NOTAS §4): «Abrir como página completa / Open as a full page», «Hoy / Now», «N casos / N case studies», «Secciones / Sections», «Leído / Read» | diccionario | varias |
| D18 | KPI de olbo (P14) | se mantiene el actual | `work.ts` | K7, caso |
| D19 | «Siguiente caso» | sigue `num` (no `ordenCasos`) | `getNextCaseStudy` | casos |
| D20 | Doto mínimo | 20 px (B) en vez de 32 (02 §7.1) | token `--t-*` + prueba | cifras |
| D21 | Hoja desde `/work`, `/about`, `/experience` | sí, abre hoja | `decisiones.hojaDesdeIndices` | navegación |
| D22 | Enlaces a casos desde `/cv` (hoy `<Link>`, que interceptaría) | página completa (`<a>` en `CvExperience.tsx`); la hoja oscura no se abre sobre el CV | `cv/CvExperience.tsx` | `/cv`, F6 |

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
