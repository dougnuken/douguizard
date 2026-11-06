# F2 · Informe del ejecutor (rutas `/work`, `/about`, `/experience`)

> 6 nov 2026 · rama `claude/douguizard-portfolio-redesign-9ivnau` · Node 22.23.4 · Chromium de `/opt/pw-browsers`.
> Fuente: `07-PLAN-IMPLEMENTACION.md` §F2, las «Correcciones del 6 nov», las maquetas aprobadas
> `propuestas/B-paginas/{work,about,experience}.html` con NOTAS §7, los pendientes de `F1-INFORME.md` y los P2 de
> `06-CRITICA-F1.md`. F2 es **aditiva**: el home y los casos se ven igual (el JS de `/` no cambió).

## Qué quedó

| Pieza | Archivos | Notas |
|---|---|---|
| La única cuenta | `src/lib/cuentas.ts` | `aniosEnProducto()` (= `yearsOfExperience()`), `casosPublicados()`, `productosPropios()` (`kind: "personal"`), `empleadores()` / `empresas()` (empleador de registro, sin freelance) y `grupoCaso(slug)`. Hoy: **12 · 10 · 3 · 6**. La usan «En cifras», la descripción de `/work`, la intro de `/experience` y sus acumulados. |
| Trayectoria | `src/lib/trayectoria.ts` | 10 hitos en orden (UAC → Naowee, con «Freelance · Chub» en paralelo), años decimales, `yDe(p)` por hito (P1-9), `pDe(i)`, `activoEn(y)`, `acumuladosEn(y)` (en y = hoy = `cuentas.ts`), `eraEn(y)`. Fechas, cargos y empresas de `cv.ts`; logros de `perfil.ts` (+ el de Chub, de 04 §3 K16). |
| Escena | `src/lib/escena.ts` | `placement()` (`cine` / `losa` / `movil`), `losaPerfil()` (columnas 8–12) y `eio()`. F4 añade `frame(p)`. |
| Copy | `src/i18n/paginas.ts` | `trabajo.*`, `perfil.*`, `trayectoria.*` (04 §3, §4.6, §6 y NOTAS §4). **Solo servidor** (desvío 1). |
| Datos | `src/data/home.ts` (`cifrasCaso` por índice de KPI; K3 → `130+`), `src/data/perfil.ts` (`getOficioPerfil`, `getMarcasPerfil`, logro de Chub) | |
| Póster | `scripts/build-hero-poster.ts` (`npm run hero:poster`), `public/hero/199598aa-v1-{440,640,880}.{avif,webp}` | Sin hornear (sharp). AVIF 10,6 / 18,5 / 32,5 KB. F4 lo cambia por el horneado. |
| Cromo | `src/components/chrome/SiteFooter.tsx` | © · Barranquilla · UTC-5 · colofón A · Volver arriba (≥ 44 px). Solo en las páginas B. |
| `/work` | `pages/WorkIndexPage.tsx`, `tablero/{CardCaso,CardCifras,CardArchivo}.tsx`, `trabajo/{FiltroCasos,Leido}.tsx`, `trabajo/trabajo.css` | Cabecera de 12 columnas (h1 96 / 60), «En cifras» en losa clara (fila compacta en móvil), filtro en el flujo (`role="group"`, `aria-pressed`, `aria-live`, View Transitions; oculto con `@media (scripting: none)`), 6 losas protagonistas por `span` y archivo `/07…/10`. «Leído» con `localStorage` (`RegistrarLeido` en `CasePage`). |
| `/about` | `pages/AboutPage.tsx`, `perfil/{PortadaPerfil,PortadaPerfilCliente,Secciones}.tsx`, `perfil/perfil.css`, `hero/HeroPoster.tsx` | Portada: foto activa, velo, láser, `NameLockup escala="xl" corte as="h1"`; ≥ 1024 con GSAP: sticky de 210 svh + scrub 0,3 **sin pin** (corte p 0–0,3, foto a losa p 0–0,7, bio p 0,5–0,8, láser recortado hacia la losa). Contexto, «Lo que hago», «Cómo trabajo», «Datos» + «Con qué trabajo», «Dónde he trabajado», citas verbatim, cierre con «Ver casos» y el PDF de `decisiones.pdfPorIdioma`. |
| `/experience` | `pages/ExperiencePage.tsx`, `trayectoria/{Trayectoria,TrayectoriaCliente}.tsx`, `trayectoria/trayectoria.css` | Odómetro Doto de 120 px (96 con alto ≤ 820), era, `<dl>` de acumulados con guion en 0 (P1-8), `<ol>` completo de 10 hitos, eje con eras, tramos proporcionales, recorrido láser con cabezal y pista de propios de 168 px. ≥ 1024: pin de 3,6 vh, scrub 0,5, scroll por hito, `focusin` → `scrollTo` + `progress(1)` (P0-1). Móvil: línea vertical, barra fija (contador 48 px + acumulados), activo = el hito que cruza el 55 %, inactivos con opacidad 1 (P1-11). |
| Rutas y SEO | `app/(es)/{work,about,experience}/page.tsx`, `app/(en)/en/…`, `lib/metadata.ts` (`workMetadata`, `aboutMetadata`, `experienceMetadata`), `lib/personJsonLd.ts` (`aboutJsonLd` = `ProfilePage` con el mismo `@id` de Person, `workIndexJsonLd` = `ItemList`), `app/sitemap.ts` (+6) | Títulos y descripciones de 04 §4.6; las de `/work` y `/experience` se componen con `cuentas.ts` y `cv.ts`. |

**Estado de partida = estado final.** Las tres páginas salen del servidor terminadas (sin JS, sin GSAP, con RM y en
móvil se ven completas). Para que la escena de escritorio no salte al cargar, un script inline pone
`html.perfil-cine` / `html.exp-cine` antes del primer pintado solo a ≥ 1024 px sin RM (igual que el tema; `<html>` ya
tolera atributos de scripts) y el CSS trae los valores de p = 0 (odómetro en 2006 por `--d0`, tramos a 0, guiones,
primer hito). Las islas cargan GSAP con `import()` tras `load`; si falla, quitan la clase y queda el estado final.
CLS medido: 0,0002 (móvil) y 0 (escritorio) en `/about`; 0,0001 / 0,0008 en `/experience`.

## Pruebas

| Paso | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run lint` | verde (0 avisos) |
| `npm test` (vitest) | **21 archivos, 222/222** (base 197 + 25: `cuentas`, `trayectoria`, `escena`, `paginas.parity`, `home` +1) |
| `npm run build` | verde (mismo y único aviso de `Cache-Control` de F0); 6 rutas nuevas estáticas |
| `npx playwright test` (build normal) | PENDIENTE_PW |

**Pruebas nuevas** (todas sin `test.skip`):

- **Matriz** (`matrix.ts`): `/work`, `/about` y `/experience` entran en `ROUTES`, así que pasan axe (oscuro y claro),
  `3.1` (≥ 7:1 en párrafos), `3.2–3.4` (1 `h1`, 1 `main#main`, 1 `footer`), `3.5`, `3.6` (≥ 44 px a 375), `3.8`,
  `5.1–5.2` (sin desborde a 320, 375, 768, 1024, 1440, 1920), `visual` (12 capturas por ruta), `S1`, `R1/R2` y `E1` en
  ES y EN (title, description, canonical, `hreflang`, OG, `lang`). `seo.spec`: E2 (`ProfilePage` y Person en `/about`,
  `ItemList` en `/work`, ES y EN) y E3 con las 6 URLs.
- **`work.spec.ts` (9):** la captura de Naowee entra entera a 390×844 y h1, «En cifras» y filtros en el pliegue a
  1440×900; filtros ni `sticky` ni `fixed` y fuera del viewport tras `scrollTo(0, 1300)`; propios → 3 losas (los slugs
  de `productosPropios()`), solo ese botón con `aria-pressed="true"` y «3 casos» / «3 case studies» en el `aria-live`;
  anteriores → 4 filas; todos → 10 (ES y EN); sin JS → 10 visibles y ningún botón; `/01…/10` en orden del DOM, cada
  card a `/work/<slug>`, Andes con «NDA», card nombrada por su título; «En cifras» = `cuentas.ts`; «Leído» tras abrir
  un caso.
- **`about.spec.ts` (10):** «Doug Vargas» se nombra una sola vez (el `h1`); a 1280×720, 1440×900 y 1920×1080, en p = 0
  tras la entrada el láser cae en la rendija (medido: |Δ| ≤ 0,5 px), `data-corte="cerrado"` en p 0,35, la foto es la
  losa de `losaPerfil()` en p 0,7 (±2 px) y la bio a opacidad 1 en p 0,85; sin `.pin-spacer` y `scrollY` crece en cada
  paso de rueda; 390×844: un solo láser visible, sin `.m.inf` ni `clip-path` en el nombre; «Lo que hago» con los tres
  títulos a la misma altura y marcas sin fila huérfana a 1440 y 390; citas verbatim con `lang="en"`; RM → estado final
  sin sticky; **axe de las 6 rutas con y sin RM**.
- **`experience.spec.ts` (11):** Tab a 1440×900, 1280×720 y 390×844 hasta dar la vuelta: **0 paradas** con opacidad
  acumulada < 1, invisibles o fuera del viewport, 420 ms después de cada Tab, y al enfocar el «Ver caso» del hito i el
  activo es i (los 7); contraste de rol, periodo, título y logro de cada hito inactivo a 390×844 con su color efectivo
  contra su fondo real (≥ 4,5:1, en tres posiciones de scroll) + axe `color-contrast`; la escena cabe a 1280×720,
  1366×768 y 1440×900 en p = 0, 0,5 y 1 (eje dentro del viewport y la losa del hito sin desbordar); pasos de 1/10
  activan 0 → 9 en orden; en p = 0 ningún acumulado dice «0» y sus losas van a .6; en p = 1 y con RM los acumulados
  son 12 · 6 · 10 y la pista tiene los mismos 3 nombres que el filtro de `/work`, sin pisar la fila de años; RM sin
  `.pin-spacer`, 10 hitos visibles y el odómetro en el año actual; sin JS, el `<ol>` con 10 `li` visibles.
- **`lockup.spec.ts` (+2, en los dos builds):** en `/about` a 1440×900 `--corte` = base − 0,52 × altura de x (±1 px),
  entrada a «abierto» y cierre exacto al bajar (sin `clip-path`, copia ni hilo); a 390 y con RM, cerrado y sin isla.

## Peso y rendimiento (`perf.spec`, mediana de 3 en frío, servidor solo)

| Ruta | Perfil | LCP | CLS | JS gz (archivos) | Imágenes | Elemento LCP |
|---|---|---|---|---|---|---|
| `/` | móvil | 4.520 ms | 0,0058 | **158,4 KB** (9) | 2,5 KB | el párrafo del héroe actual |
| `/` | escritorio | 1.556 ms | 0 | **158,4 KB** (9) | 2,5 KB | ídem |
| `/about` | móvil | 2.560 ms | 0,0002 | 154,0 KB (9) | 35,5 KB | `img.poster` (`199598aa-v1-880.avif`) |
| `/about` | escritorio | 400 ms | 0 | 154,0 KB (9) | 48,7 KB | `img.poster` |
| `/work` | móvil | 2.020 ms | 0,0002 | 151,0 KB (9) | 20,5 KB | la captura de Naowee |
| `/work` | escritorio | 284 ms | 0 | 151,0 KB (9) | 45,0 KB | ídem |
| `/experience` | móvil | 1.724 ms | 0,0001 | 152,4 KB (9) | 2,5 KB | la intro |
| `/experience` | escritorio | 276 ms | 0,0008 | 152,4 KB (9) | 2,5 KB | el `h1` |

- **El JS de `/` no cambió** (158,4 KB gz, 9 archivos, igual que F1) y su LCP está dentro del ruido (4.520 / 1.556 ms).
- Las páginas nuevas pesan **menos** JS que `/` (no cargan el shell horizontal). GSAP + ScrollTrigger no cuentan aquí:
  llegan por `import()` después de `load`.
- Perfil móvil = Slow 4G de `perf.spec` (562 ms de latencia, 1,6 Mb/s, CPU × 4). Ver desvío 9 sobre el LCP de `/about`.

## Capturas

`docs/rediseno-2026/F2-capturas/` (DPR 1, JPG 82, **segunda visita**: Doto es `display: optional` y en frío pinta el
respaldo). Por página: `{pagina}-390-pliegue`, `-390-completa` (RM), `-1280x720-pliegue`, `-1440-pliegue`,
`-1440-completa` (RM). Además: `work-1440-scroll` (filtros fuera tras 1300 px), `work-1440-en`,
`about-1440-p{030,070,100}`, `about-1440-en`, `experience-1440-{000,025,050,075,100}`, `experience-1280x720-{000,050,100}`,
`experience-390-scroll` y `experience-1440-en`.

**Comparación con las `shot_P_*` aprobadas:** COMPARACION_CAPTURAS

## Desvíos del plan y por qué

1. **El copy de las páginas va en `i18n/paginas.ts`, no en `dictionaries.ts`.** El diccionario viaja entero al
   navegador con `LocaleProvider`; meter allí `trabajo.*`, `perfil.*` y `trayectoria.*` subía el JS de `/`, que debía
   quedar igual. Ninguna isla los lee (el filtro recibe sus rótulos por props). Misma forma ES/EN y sin choques con el
   diccionario: `paginas.parity.test.ts`. **Por la misma razón no se fusionó `i18n/sistema.ts`** (pendiente de F1): lo
   hace F3, cuando la cabecera y el dock lo consuman.
2. **`preload: true` en Urbanist e Instrument queda para F3.** Las fuentes se declaran en `RootDocument`: precargarlas
   cargaría `/` y los casos con dos fuentes que todavía no usan (ya lo decía `instrument.ts`: «hasta F3»).
3. **Números `/NN` de las losas y años del eje en Instrument Sans con `tabular-nums`, no en Doto.** Es P2-1 de
   `06-CRITICA-F1` y P2-14 de `06-CRITICA-PAGINAS` (Doto a ≤ 24 px se lee como textura y en `--tinta-3` pierde
   contraste). Doto queda donde la cifra es la imagen: «En cifras», cifras de las losas, odómetro, acumulados, números
   de «Lo que hago» / «Cómo trabajo» y años del archivo.
4. **«Lo que hago» y «Cómo trabajo» usan el texto de 04 §6.1** (`getOficioPerfil`, cuerpos ≤ 45 palabras, como la
   maqueta). `getOficio()` sigue dando el texto largo al panel del home actual, que F2 no toca.
5. **«Dónde he trabajado» tiene 8 marcas, no las 7 de `getWordmarks()`.** `getMarcasPerfil()` = la misma tira más el
   cliente final de Globant (Royal Caribbean, con caso propio), como en la maqueta aprobada. Con 7, el criterio «ninguna
   fila con una sola marca» no se puede cumplir en 2 columnas a 390. La tira del home no cambia. ⚠️ Doug confirma.
6. **Jelly con texto largo.** La losa de Andes en `/work` y «Sistemas de diseño» en `/about` llevan un `<p>` de más de
   40 caracteres en blanco, y `a11y 3.1` exige ≥ 7:1 contra el peor punto (`--jelly-azul-peor` #3F6BD9 da 4,9:1). En
   esas dos losas el radial se recentra para que el texto viva en la parte honda y el color sólido de la losa es el
   peor punto **bajo el texto** (#1A2FB8, blanco 9,8:1). Las etiquetas de Andes van en blanco (4,9:1 en el peor punto
   del borde) y el apoyo de MakeaPet también (8,5:1; el rosa daba 5,1).
7. **K3 pasa a la cifra `130+` (índice 2)** en `home.cardsCaso`, como pide 04 §3 K3; antes apuntaba a los 30 trámites.
   Solo lo usa F3. Las cifras de `/work` están en `home.cifrasCaso` (Andes con tres).
8. **«La losa de Naowee entera a 390×844» se prueba sobre la captura.** NOTAS §7 (P1-3) y `shot_P_work_390_pliegue`
   dicen «la captura de Naowee entra entera en el pliegue»; en la maqueta aprobada la card sigue bajo el pliegue (título
   y cifra). La captura queda en y = 487–679 de 844.
9. **LCP móvil de `/about`: 2.560 ms, no < 2,0 s.** Con 562 ms por viaje, el póster necesita HTML + conexión +
   descarga: ≈ 3 viajes. Se añadió `preload()` del póster en el `<head>` (con `imageSrcSet`/`imageSizes`) y la
   atmósfera borrosa solo se pide en la escena de escritorio; las corridas quedaron igual (2.408–2.580 ms). Bajar de 2 s
   en ese perfil pide servir el póster desde un CDN o inline (F4 hornea el póster definitivo). En escritorio, 400 ms.
   CLS < 0,02 sí se cumple (0,0002).
10. **La barra fija de `/experience` en móvil son dos `sticky`** (contador y `<dl>`) en vez de mover el `<dl>` en el
    DOM con JS como la maqueta: el árbol de React no se toca y sin JS la barra también funciona.
11. **La isla de `/experience` recibe números, no datos.** Los acumulados se precalculan mes a mes en el servidor con
    `acumuladosEn()`: la isla no importa `cv.ts` ni `work.ts` (las cuentas siguen siendo las de `lib/trayectoria.ts`).
12. **Hito con foco siempre visible.** Además del `focusin` → `scrollTo` + `progress(1)` de P0-1, `.hito:focus-within`
    queda a opacidad 1 sin transición: mientras el scrub (0,5) llega, el hito intermedio que activa al pasar ya no
    reinicia el fundido del enfocado (la primera corrida medía 0,995 a los 420 ms).
13. **El láser de `/about` es una línea de 1 px sin máscara alrededor de la cara**, alineado con el haz que ya trae la
    foto. El vidrio es un hueco en F2 (F3 `VidrioCss`, F4 `VidrioGL`), como dice el plan. En móvil ese es el único láser
    (P1-7). La foto a pantalla completa deja a los lados una atmósfera borrosa de la misma foto (440 px), como la maqueta.
14. **Título de la losa de DC Medical = «DC Medical Aesthetics»** (el `project` de `work.ts`), no el «DC Medical» de
    04 §3 K9; mismo nombre en la pista de `/experience`, que la prueba compara con el filtro de `/work`.
15. P2 de F1 aplicados en las páginas B: **P2-2** (anillo `--electrico` en clara/niebla, blanco en jelly) en
    `paginas-b.css`; **P2-5** (titulares por rol `.t-pagina`, `.t-seccion`, `.t-sub` con su tamaño móvil); **P2-7**
    (`user-select: none` en las líneas del nombre de `/about`: se copia «Doug Vargas» una vez). P2-3 se respeta (sin
    párrafos largos sobre `losa-alta`). P2-6 y P2-8 son de F3.

## Pendientes

- **QA visual y crítica de F2** (sesión nueva): 6 rutas × 4 anchos × ES/EN × RM y los fotogramas de `/about` y
  `/experience`, contra las `shot_P_*`.
- La cabecera sigue siendo la actual (`SiteHeader`, con el tema claro si el sistema lo pide): la pastilla B, el rail y el
  dock llegan con **F3**, que también fusiona `sistema.ts` en el diccionario y pone `preload` en Urbanist/Instrument.
- LCP móvil de `/about` (desvío 9) → F4 (póster horneado) / F8 (CDN, presupuesto en `perf.spec`).
- Doto `display: optional`: en la primera visita en frío el odómetro y las cifras salen con el respaldo (P2-8 de F1, F3).
- Doug: marcas de `/about` (desvío 5), título de DC Medical (desvío 14), Chub (P15 de 04).
- `docs/rediseno-2026/baseline-F0.json` no se tocó; `ESTADO.md` tampoco (lo cierra el orquestador).
