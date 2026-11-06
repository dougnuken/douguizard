# F3 · Informe del ejecutor (tablero OS + cromo nuevo; se retira el shell horizontal)

> Rama `claude/douguizard-portfolio-redesign-9ivnau`. Sin despliegue. `ESTADO.md` no se tocó (lo cierra el orquestador).
> Commits: `ed1d1df` (tablero + cromo + retiro del shell) · `test(f3)` (pruebas reescritas + `tablero.spec`) ·
> `600ccc7` (arreglos y P2) · `perf(f3)` (póster de K1 y capturas) · este informe.

## Qué quedó

- **Home = OS de B en su estado final** (el mismo con RM, sin JS y al final del futuro acto 1):
  `components/escena/Escena.tsx` (solo estado OS) + `components/tablero/Tablero.tsx` con orden DOM = visual = Tab
  K2, K1, K3, K4, K5, [K7–K10], K11, K12, K13, K14, K15, K16, K17 y `grid-template-areas` en tres anchos (≥ 1280,
  1024–1279 de P0-1, < 1024 «app»). Copy en `i18n/tablero.ts` (solo servidor, como `paginas.ts`).
  - K1 `K1Retrato`: `HeroPoster` (LCP) + `VidrioCss` (franjas verticales, cara y banda láser nítidas por máscara) +
    láser de 1 px + panel de vidrio con el nombre → `/about`. En móvil, foto a sangre (100svh) con K2 de vidrio encima.
  - K2 `K2Claim`: `h1` «Doug Vargas. Dirijo el producto. Después, lo construyo.», nivel, sub con los países del KPI de
    Andes, disponibilidad una vez (según `decisiones.disponibilidad`), «Ver casos» (lleva el foco a `#work`) y CV del
    idioma (`pdfCv`). Nombre visible solo en móvil (P1-4).
  - K3/K4/K7–K10: **`CardCaso` de F2 reutilizada** (prop `como="div"`, área, sin `/NN`, `seccion`, `chipNda`,
    `prioridad`). K3 con flecha en tinta (y blanca a 1024–1279, como la maqueta); K9 con flecha.
  - K5 `CardContacto` = K5 + K6 fusionadas: reloj BAQ (isla `RelojBaq`, 24 h ES / 12 h + AM/PM EN, `role="img"` con
    `aria-label` con la hora; sin JS no se pinta), lugar, cargo y «Escríbeme» → `#contact`.
  - K11 `CardExperiencia` (nodos de `home.nodosK11` sobre `lib/trayectoria`), K12 = **`CardCifras` de F2** con enlace
    a `/experience` (mismos valores que «En cifras» de `/work`), K13 `CardPerfil` con `83a47bc7`
    (`public/portrait/perfil-83a47bc7-v1-{640,880}.{avif,webp}`, horneado por `npm run hero:poster`), K14 `CardOficio`
    (pasos de `getOficioPerfil`), K15 `CardTestimonio` (isla, rotación manual, oración literal de Arman y Nicolas;
    Francesca no va en el home: `10.7`), K16 = **`CardArchivo` de F2** compacta, K17 `Contacto` (correo,
    `CopiarCorreo` con los estados de 04 §4.5, redes, CV y carta).
  - Carrusel móvil `CarruselMovil` (scroll-snap, «1 de 4», anterior/siguiente; en escritorio `display: contents`).
- **Cromo nuevo** (`components/chrome/`): `SiteHeader` reescrito (pastilla: wordmark Geologica · pills · ES/EN 44×44
  con `background-clip: content-box` · «Hablemos»; pills centradas al viewport; en el home anclas con scroll-spy, fuera
  rutas con `aria-current="page"`; a < 1024 menú `button[aria-expanded]` + `nav[data-menu]`; tema solo en `/cv`, y en
  el menú a < 1024), `RailAcciones` (≥ 1024, gris salvo el correo), `DockMovil` (< 1024, 5 destinos, escondido e
  `inert` en el héroe del home y visible desde el inicio en las páginas B; sin JS siempre visible), `chrome.css`.
  `lib/irASeccion.ts`: pills, dock y CTA bajan a la sección, **llevan el foco** y dejan el `#ancla`.
  `LanguageSwitch` reescrito: conserva ruta **y hash** (home: `activeSection`; fuera: `location.hash`).
- **Páginas de F2 con el cromo**: rail + dock en `/work`, `/about`, `/experience`; `VidrioCss` en la portada de
  `/about` (12°, cara protegida en la losa).
- **Retirado** (§1.4): `HorizontalShell`, `SectionIndex`, `RailLabel`, `FocusWords`, `sections/{Hero,Work,Craft,
  CraftTimeline,About,Contact}`, `components/SiteHeader.tsx` (→ `chrome/`), `data/sections.ts` (paridad →
  `home.secciones`), CSS del picker/rail viejo, `.site-header` viejo y `.lang-switch` de `globals.css`; claves `shell`,
  `index`, `hero`, `craft`, `about`, `contact` y `work.intro…` del diccionario; `getOficio()` (versión larga, sin uso).
  Se conservan `HeroField`/`Velaris` (F4), viñetas (`CaseNda`), `RevealText`, `ThemeToggle`, `activeSection`.
- **Pendientes de F1/F2 hechos**: `i18n/sistema.ts` fusionado en el diccionario; `preload: true` en Urbanist e
  Instrument (la cabecera las usa en todas las rutas); Doto con preload **solo en el home** (`dotoHome`, P2-8).

## Pruebas

| Paso | Resultado |
|---|---|
| `npx tsc --noEmit` | verde |
| `npm run lint` | verde (0 avisos) |
| `npm test` (vitest) | **22 archivos, 227/227** (base 222: −1 de la paridad de `sections.ts` reescrita y fusionada, +6 `tablero.test.ts`) |
| `npm run build` | verde |
| `npx playwright test` (build normal) | **404/404** en 13,9 min (corrida completa al cierre); sin fallos, reintentos ni pruebas saltadas |
| Corrida completa intermedia | 402/404 → los 2 fallos se arreglaron (`a11y 3.6` en `/` @375: enlace de K14 de 29 px; `experience` «una sola cuenta»: 11 en vez de 12 en p = 1, ver desvío 5) y se re-corrieron verdes (37/37 de `experience`, `tablero`, `a11y 3.6`) |

**Cuenta de Playwright: 389 + 15 − 0 = 404.** Nuevas o reemplazadas (sin `skip` ni pruebas desactivadas):

| Prueba | Cambio | Motivo |
|---|---|---|
| `keyboard 6.2–6.5` (4) | → 6.2 orden de Tab = DOM (K2, K1, K3…K17), 6.3 Enter en una card navega, 6.4 cada sección tiene un tabulable, 6.5 pills con Enter llevan el foco (y `aria-current`) | sin shell no hay flechas, paneles ni `SectionIndex`; el viejo 6.3 (ArrowDown en el panel Work) se retira con ellas |
| `layout 5.3–5.4` (2) | → `5.3` el OS a 1440×900 cabe en el pliegue con 6 filas (×2 temas) + `5.4` ninguna `.tarjeta` recorta a 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080 (7) | geometría del shell; 5.4 exceptúa lo que sangra a propósito (`aria-hidden`, el teléfono de olbo) y mide además que ningún texto quede bajo el borde |
| `recheck R4, R5`, `recheck2 R4b` (3) | retiradas | cubiertas por los nuevos 6.x; `R1` sigue registrando landmarks |
| `measure M2` (2) | retirada | resplandor del héroe viejo; `M3` queda informativa |
| `i18n I3` | reescrita: pills/«Hablemos» → el switch apunta a `/en#experience`, `#about`, `#contact` y llega | `SectionIndex` ya no existe |
| `motion 7.2` | reescrita sobre `/work/mercadolibre-andes` (viñeta de `CaseNda`: sin animaciones, nada a medio aparecer) | en el home nuevo pasaría por casualidad |
| `hero320` | + aserciones: foto a sangre y K2 sin desborde a 320 | lo pide 07 |
| `settle.ts` | sin la caminata de `[data-hshell]` | — |
| `tablero.spec.ts` (15, nuevas) | test de 5 s a 1440 y 390; CTA < 664 a 390×664; alto móvil ≤ 5.064; un nombre y una disponibilidad (ES/EN); K5 fusionada + reloj; scroll-spy + «Ver casos» + skip link; carrusel + dock; K12 = `/work`; cromo en `/work`, `/about`, `/experience` (dock 5 con `aria-current="page"`, pill activa, rail); Naowee sobre el dock; `VidrioCss` en `/about` y K1 sin `canvas` | 07 F3 |

Sin cambios y verdes: `i18n I2/I4` (con los selectores de §1.3), `a11y 3.1–3.6` y axe en `/` y `/en` (matriz),
`keyboard 6.1/6.6` (el header conserva el botón de menú), `content 10.1/10.5/10.7`, `X2`, `print 8.1–8.3`, `R3`,
`work/about/experience/lockup.spec`. `visual.spec` regenera sus capturas (sin línea base comprometida).

## Peso y rendimiento de `/` (`perf.spec`, mediana de 3 en frío, servidor solo; `perf-F3.json`)

| Perfil | LCP | Elemento LCP | CLS | JS inicial gz | Imágenes |
|---|---|---|---|---|---|
| Base F0 móvil | 4.456 ms | párrafo del héroe viejo | — | 157,6 KB | — |
| **F3 móvil** | **2.972 ms** (2.996 · 2.972 · 2.420) | `span.claim` (K2) | 0 | **151,5 KB** (8 archivos) | 142,7 KB |
| Base F0 escritorio | 1.576 ms | — | — | 157,6 KB | — |
| **F3 escritorio** | **448 ms** | `img.k1-poster` (`199598aa-v1-640.avif`) | 0 | **151,5 KB** | 76,9 KB |

- **JS inicial −6,1 KB gz respecto a la base** (presupuesto de 07: ≤ base + 15 KB). Sale el shell y entran cabecera,
  dock y cuatro islas pequeñas (reloj, carrusel, testimonio, copiar).
- Escritorio cumple (LCP = póster, < 1,2 s, CLS 0). Póster: 32,5 KB en su ancho mayor (880), ≤ 120 KB.
- **Móvil no llega a < 2,0 s** (desvío 1).

## Capturas (`F3-capturas/`)

`home-390x844-pliegue`, `home-390-completa`, `home-1280x720-pliegue`, `home-1440x900-pliegue`,
`home-1440-completa`, y lo mismo de `/work` (página de F2 con el cromo nuevo). Con RM, tras cargar lo diferido.
A ojo contra `shot_B_1440_os.jpg` y `shot_B_390_completa.jpg`: misma rejilla, superficies y jerarquía; la altura móvil
es 4.797 px (maqueta 5.062).

## Desvíos del plan y por qué

1. **LCP móvil de `/` 2,97 s, no < 2,0 s, y el elemento es el claim de K2, no el póster.** Mejora 1,5 s sobre la base,
   pero con 562 ms por viaje el HTML + CSS + fuente ya consumen ≈ 2,4 s. Chrome no toma el póster como LCP en móvil
   (la foto ocupa todo el viewport detrás de K2). Mismo caso que `/about` (F2, desvío 9): pasa a **F4** (póster horneado
   con el vidrio, quizá `<link rel=preload>` del primer pintado a 440) y **F8** (CDN y presupuesto en `perf.spec`).
2. **El pliegue a 1280×720 y 1024×768 no cierra en 6 filas exactas**: con `--fila` ≥ 96 px y el copy real (Andes con
   tres cifras y chip, K2 con nivel + sub) las filas crecen (`minmax(var(--fila), auto)`); nada recorta (`5.4` verde).
   A 1024–1279 se aplicó lo de P0-1 (claim `--t-30`, K3 sin captura, chip NDA oculto, título de Andes a 20 px).
3. **El chip NDA del home dice «NDA · Caso disponible a solicitud»** (el texto de los casos), no «NDA · Caso a
   solicitud»: `content 10.5` exige esa frase una vez en el home y había que dejarla verde sin cambiarla.
4. **`RailAcciones` es de servidor**, no isla: en F3 nunca está inerte (no hay escena); F5 lo vuelve isla para el
   `inert` mientras p < 0,5 (P0-3). Menos JS.
5. **Arreglo en `/experience` (F2) fuera de alcance pero necesario**: en p = 1 el acumulado de años daba 11 en vez de
   12 porque el ancla de carrera es noviembre y `y` quedaba una fracción por debajo de hoy (mes anterior). Tolerancia
   de medio mes en `TrayectoriaCliente`. Solo falla en el mes del ancla, por eso F2 salió verde.
6. **Scroll-spy al 35 % del viewport** (no al 60 %): con 60 % la sección siguiente ya «ganaba» al llegar a una ancla.
   Al cargar el home ninguna pill está activa (la maqueta marcaba «Trabajo»): K3 está en el pliegue pero por debajo.
7. **Cabecera en `/cv`**: el conmutador de tema pasa al menú a < 1024 (a 375 la fila no cabía: `5.2`).
8. **El retrato K13 y el copy**: K13 usa el título de la maqueta aprobada («Diseñador de producto que construye.»), no
   «Doug, sin máscara» de 04 (la decisión «sin máscara» del 6 nov lo dejó sin sentido).
9. **K15 con 2 citas, no 3**: Francesca no va en el home (`decisiones.citaFrancescaEnHome = false`, `10.7`).
10. **`VidrioCss` es una sola capa de franjas con máscara** (cara ∪ banda láser nítidas), sin copia nítida de la foto:
    menos peso y sin `backdrop-filter` por rebanada; F4 lo deja como respaldo del WebGL.

## P2 asignados a F3

| P2 | Estado |
|---|---|
| F1 P2-1 (Doto ≥ 30 px) | ✓ en el tablero (`.tablero-home .dot--s` a `--t-30`); `/NN` y años del eje ya iban en Instrument desde F2 |
| F1 P2-4 (`top` del lockup al bajar de 1024) | ya estaba arreglado en `NameLockupCorte` (F2); verificado |
| F1 P2-6 (cabecera B en el lab) | la cabecera B ya sale en el lab (va en `RootDocument`); la escena con foto del lab, no (el lab se borra en F8) |
| F1 P2-8 (Doto sin precarga) | ✓ `dotoHome` con preload solo en `/` y `/en` |
| F2 P2-3 («Leer el caso del Banco…») | ✓ `leerCasoDe` con artículo en ES (prueba en `tablero.test.ts`); lo usan `/about` y K15 |
| F2 P2-5 (cifras de Andes en `/work`) | ✓ cifras con 48 px tras el texto y el chip NDA al fondo |
| F2 P2-6 («Datos» de `/about`) | ✓ «Español (nativo)» en minúscula (sin tocar `cv.ts`). **Pendiente** la columna `max-content` del `dl`: vive en `perfil.css`, que otra sesión estaba editando |

## Pendientes

- QA visual y crítica de F3 (matriz completa: 5 anchos + 390, ES/EN, RM y sin RM; objetivo ≥ 8,5).
- LCP móvil de `/` (desvío 1) → F4/F8.
- F2 P2-6: `dl` de «Datos» a `max-content` en `perfil.css`.
- Las viñetas `olbo`, `naowee`, `banco`, `dc`, `makeapet` quedan sin uso (solo vive la de Andes en `CaseNda`) → F8.
  `lib/spring.ts` (`stepSpring`) también queda huérfano → F8. `HeroField`/`Velaris` → F4.
- Doug: título de K13 (desvío 8) y si el chip NDA del home puede ser el corto (desvío 3, cambiaría `10.5`).

## Arreglos tras la crítica

| Punto | Cambio | Prueba |
|---|---|---|
| **P1-1** cabecera | `.cab-b` con `align-items: center`; wordmark, pills, idioma y «Hablemos» a 40 px visibles (`--pill-alto`), `y 24` común; destino táctil de 44 px por `::before { inset: -2px 0 }` (`chrome.css`). | `f3-arreglos.spec.ts` · «P1-1 cabecera alineada» mide cajas (mismo `y`, alto 40) en `/`, `/about`, `/cv`. |
| **P1-2** `color-scheme` | `:root:not(:has([data-ruta-cv])) { color-scheme: dark }` (`globals.css`), el script de tema ya no fija `color-scheme` inline, `viewport.colorScheme: "dark"` y `themeColor: #060608` en ambos layouts; `/cv` (es/en) lo sobrescribe con `"dark light"` y sus dos `themeColor`. | «P1-2» en `/`, `/work`, `/about`, `/experience`, `/en`: `colorScheme === "dark"` y `<meta name="color-scheme">` sin preferencia; en `/cv` sigue su tema. |
| **P1-3** rejilla 1280–1439 | `.os-top` con columnas `5×0.9fr · 4×1fr · 3×1.2fr` y `white-space: nowrap` en `.ceja` (años y eyebrow). K4 (Andes): 270 → 316 px a 1280 y 341 px a 1366; el título ya no choca con la flecha. | «P1-3» K4 ≥ 300 px y cejas en una línea a 1280×720 y 1366×768; `layout 5.4` en verde; capturas nuevas `F3-capturas/home-1280x720-pliegue.jpg` y `home-1366x768-pliegue.jpg`. |
