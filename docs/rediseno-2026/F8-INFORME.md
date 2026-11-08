# F8 · Endurecimiento, SEO, rendimiento y limpieza — informe del ejecutor

> Rama `claude/douguizard-portfolio-redesign-9ivnau`. Sin deploy ni cambios de configuración de producción
> (`next.config.ts`, `vercel.json` intactos). `ESTADO.md` no se tocó. Entrega para Doug: `08-ENTREGA.md`.

## Resumen

| Criterio de F8 (07) | Resultado |
|---|---|
| LCP móvil ≤ 2,0 s (Slow 4G, CPU × 4) | `/` **1.040 ms** (claim de K2) · `/about` **1.920 ms** (póster; antes 2.950 en F4, 2.108 al empezar F8) |
| LCP escritorio ≤ 1,2 s | `/` **348 ms** · `/about` **516 ms** |
| CLS ≤ 0,02 | `/` móvil **0** (antes 0,066) · `/about` 0,0002 · escritorio ≤ 0,0005 |
| JS inicial `/` | 159,4 KB gz (F7: 158,2; +1,2 KB por los `error.tsx`) · `/about` 151,4 KB |
| Lighthouse | LIGHTHOUSE_RESUMEN |
| vitest · lint · tsc · build | VITEST_RESUMEN |
| Playwright completo (Chromium) | PW_RESUMEN |
| WebKit / Firefox | **no se pudo aquí**: el proxy responde 403 a `cdn.playwright.dev` y `playwright.download.prss.microsoft.com`. Los proyectos existen (`PW_NAVEGADORES=1`) y el smoke corre en Chromium; queda en el checklist de Doug |
| Sin `/lab`, `DG_LAB`, marcadores ni `console.log` en `src/` | ✓ (`grep` vacío; `/lab` da 404 y no está en el sitemap: prueba) |

Cifras de rendimiento: `perf-F8.json` (perf.spec, mediana de 5, servidor solo, `--workers=1`, con
`PERF_ASSERT=1` en verde para las dos rutas y los dos perfiles).

## Qué se hizo

### Rendimiento

1. **CLS móvil 0,066 → 0 (pendiente de F4–F7).** Medido con `layout-shift.sources`: la losa K2 bajaba 26 px a los
   ~2 s porque la fila nombre/estado pasaba de dos líneas (fuente de respaldo) a una (Instrument Sans). Y a 390 en ES
   la fila cabe o no según 6 px, así que dependía también del idioma. Arreglo: en móvil la fila se apila siempre
   (`tablero.css`, `.k2-fila` en columna). Mide 48 px con cualquier fuente.
2. **LCP móvil de `/about` 2,95 s → 1,92 s** (criterio heredado de F2/F3). El LCP es el póster `movil-880.avif` y la
   carga era de ancho de banda: el póster compartía la red con ~160 KB de fuentes. Cambios, todos medidos:
   - Archivo y Geist Mono (diseño anterior, solo `/cv`) sin `preload`; el skip link y los `sr-only` heredaban Archivo
     del `body` y la hacían bajar (35 KB) en cada ruta B: ahora van en `--font-texto`.
   - Instrument Sans y Urbanist solo con el subconjunto `latin` (cubre el español): `latin-ext` se precargaba en cada
     ruta sin usarse (27 KB). La única letra fuera de `latin` era la «ē» de la sigla de Behance del rail: pasa a «Be».
   - Una sola Doto con preload: la segunda instancia «solo home» tenía otra URL para el mismo archivo y `/about` lo
     bajaba dos veces.
   - Geologica (lockup) como **instancia estática local** (wght 600, SHRP 100, `next/font/local`): 14 KB en vez de
     29 KB, en todas las rutas (la marca de la cabecera la usa). Todos los usos son peso 600; el «d» del círculo de la
     marca pedía 700 y ahora se pinta en 600 (`font-synthesis: none`, sin negrita falsa).
   - Póster `movil` en AVIF q 40 (antes 58): 69 → 36 KB. Comparado a 1:1 sobre la cara, bajo el vidrio no se
     distingue. `960e1d8c` pasa a `v3` (la `v2` se retira; nunca se desplegó).
   - Lo que no está en mi mano: con `next start` local todo va por HTTP/1.1 y sin priorización; en Vercel (HTTP/2 y
     /3 con prioridades y CDN) el póster debería llegar antes. Doug lo confirma con PageSpeed tras el deploy.
     `experimental.inlineCss` (P2-5 de 06-CRITICA-F4) se deja: medido en F4, es la mayor ganancia de LCP del home;
     revisar con PageSpeed en producción si conviene volver a `<link>`.
3. `perf.spec` lleva ahora los umbrales finales (LCP 2,0 / 1,2 s, CLS 0,02), activos con `PERF_ASSERT=1` (dentro de
   la suite la CPU es compartida y la cifra no vale).

### SEO

- **OG por idioma** con la foto `960e1d8c`: `public/og.png` (ES) y `public/og-en.png` (EN), 1200 × 630, ~165 KB.
  `npm run og` (`scripts/og/build-og.ts`) las hornea con el póster `cine`, el nombre en la fuente del lockup, el láser
  a la altura de los ojos (`hero.ts` `ojo`) y el claim de K2 del diccionario. `site.ts` las asigna por idioma; todos
  los constructores de `metadata.ts` ya leían `site.seo.ogImage`. El script viejo (Chrome de macOS, HTML de 2025) se
  retira.
- Pruebas: `seo E1` exige la OG del idioma en todas las rutas de la matriz (ES y EN); `E1b` (nueva) comprueba que las dos existen, son PNG de
  1200 × 630 y pesan ≤ 300 KB. Sitemap, `hreflang`, canonical y JSON-LD (Person, ProfilePage, ItemList,
  BreadcrumbList de casos) ya estaban y siguen verdes (`E2` y siguientes).

### Endurecimiento

- `error.tsx` en cada idioma (`app/(es)`, `app/(en)/en`) con `ErrorContent` en el sistema B («Algo falló en esta
  página.», «Intentar de nuevo», «Ir al inicio»; ES/EN en el diccionario, `error`) y `global-error.tsx` como último
  recurso con estilos en línea. Antes no había límite de error: un fallo de render dejaba la pantalla de Next.
- Cabeceras y CSP sin cambios (S1–S6 en verde); 404 global y de caso como en F7.
- Accesibilidad: axe sigue limpio en la matriz de `a11y.spec` (ES/EN, hoja); el skip link ahora usa la fuente B.

### Navegadores

- `playwright.config.ts` declara el proyecto `chromium` y, con `PW_NAVEGADORES=1`, `webkit` y `firefox` limitados a
  `navegadores.spec.ts` (smoke de 07: `/` y `/en` sin errores, OS visible, la hoja abre y cierra; `/work/olbo` por
  URL directa sin hoja). En Chromium corre con la suite (3 pruebas). WebKit/Firefox: bloqueados por el proxy (arriba).

### Limpieza

- Retirados: `src/app/(es)/lab/` (página, `LabCorte`, `lab.css`), las pruebas del lab en `lockup.spec` (solo corrían
  con `DG_LAB=1`; no contaban en la suite normal), `src/lib/spring.ts` (huérfano desde F3) y su vitest (−6),
  `m-tmp.mjs` (script suelto en la raíz), `scripts/og/og.html` y `shot-og.mjs`, la carpeta `public/hero/960e1d8c-v2`.
- CSS muerto del diseño anterior en `globals.css`: `.status-dot` (+ su `@keyframes`), `.kicker-ok`,
  `.btn-pill--signal`, `.hero-field` (2,4 KB). Búsqueda de clases sin uso en todas las hojas: las que quedan se
  componen con plantillas (`losa--${s}`, `boton--${v}`, `k${7 + i}`).
- Lo que se conserva del lab: la prueba «toda `var()` de sistema y marca resuelve en `:root`» pasa a `/`; el resto
  del lockup ya se prueba en `/about`, el tablero, la escena y el vidrio.
- Comentarios que hablaban de `/lab` o `dotoHome` actualizados. `README.md` reescrito con el stack real.
- No se tocaron: `DEPLOY-GUIDE.md`, `deploy-step-1.sh`, `HANDOFF.md` (documentos de Doug de la primera puesta en
  línea; `08-ENTREGA.md` explica que ya no aplican), `vercel.json`, `next.config.ts`.

## Cuenta de pruebas

- **vitest: 258 → 252** (−6: `spring.critical.test.ts`, el módulo se borró). `decisiones.test` acepta Geologica local.
- **Playwright: 513 → 518** en la suite normal: +3 `navegadores.spec`, +1 `seo E1b`, +1 `lockup` (var() en `/`). Las
  pruebas del lab de `lockup.spec` se retiran, pero solo existían con `DG_LAB=1`, así que no estaban en los 513;
  la de «`/lab` da 404» se queda (ahora sin condición).

## Desvíos

1. **Lighthouse**: LIGHTHOUSE_DESVIO
2. **WebKit/Firefox** no corrieron (proxy). El smoke y los proyectos quedan listos para Doug.
3. **Capturas de la matriz final de §5** (`tests/shots/rediseno/final/`): no se hicieron en esta sesión (presupuesto de
   uso); son de la QA final. Las de F7 siguen siendo válidas salvo K2 en móvil (nombre y estado ahora apilados) y la
   «d» de la marca (600).
4. Los P2 de pulido de `06-CRITICA-F7` (virgulilla en Doto, cifra huérfana a 390, bordes dentados, botón
   «Secciones» a 390, pie del caso, línea EN del 404, «En curso», dos tintas) no estaban asignados a F8 y no se
   tocaron; quedan para la QA final si los pide.

## Pendientes

- Doug: titulares «borrador para Doug», decisiones §4, fps en la MacBook, Safari/Firefox/VoiceOver, PageSpeed tras el
  deploy (lista en `08-ENTREGA.md` §5).
- QA final: matriz de capturas de §5 y puntuación del crítico (objetivo ≥ 8,6).
