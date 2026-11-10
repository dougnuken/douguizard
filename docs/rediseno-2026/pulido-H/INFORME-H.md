# Pulido H · los 7 P2 de `pulido-G/06-CRITICA-G.md`

10 nov 2026. Rama `claude/douguizard-portfolio-redesign-9ivnau` (PR #20). Un commit por arreglo.

| # | Causa | Arreglo | Prueba | Números |
|---|---|---|---|---|
| P2-1 | `Secciones.tsx:102` elegía la bandera con `i === 0 ? "co" : "us"`: reordenar la lista cambiaba la bandera. | `Language.code` (`"es" \| "en"`) en `cv.ts` y `es/cv.ts`; `banderaDeIdioma` en `perfil.ts` (es → co, en → us); `getDatos` da `codigo` y `pais`; `Secciones.tsx` usa `l.pais` y `key={l.codigo}`. (db61ca9) | `src/data/__tests__/pulidoH.test.ts`: ES y EN dan `[es,co],[en,us]`; con la lista invertida, `[us,co]`. | vitest 2/2 |
| P2-2 | No era el tinte. El `view-transition-name` **permanente** de `.cab-b`, `.dock` y `.rail-acciones` (G4) convierte el elemento en *backdrop root*: el `backdrop-filter` de las pastillas, ES/EN, menú y dock no veía la página y el texto de debajo pasaba nítido a 0,8 de tinte. | El nombre solo existe con `:root:active-view-transition` (se activa al llamar a `startViewTransition`, antes de capturar el estado viejo); respaldo con nombre fijo en `@supports not selector(:active-view-transition)`. `--vidrio-cromo` se queda en 0,8: con el blur de vuelta no hace falta subirlo. (3b6dcbb) | `cromo-contraste.spec`: nueva prueba a 390 con el párrafo de entrada de /about bajo la cabecera; mide `veta` = p90/p10 de luminancia detrás de cada etiqueta (≤ 1,6) y AA (≥ 4,5). `g4-motion.spec`: el nombre `cabecera` existe durante la transición y vuelve a `none` al acabar. | veta **1,79–1,82 → 1,01**; contraste wordmark 9,67 → 17,21, EN 5,51 → 9,94, menú 9,52 → 17,21; dock 390 ≥ 5,25; cabecera 1440 sobre losas claras ≥ 5,25 |
| P2-3 | Banco de Occidente apila emblema y nombre; el nombre ocupa 16,3 de 71 unidades: a 46 px su «B» medía 10,6 px (8,3 en móvil). | `alto: 60` → «B» 13,8 px (10,7 en móvil), la mayúscula de los wordmarks (500/20 ≈ 14 px). `.marcas li` con `min-height: max(48px, 60px × --esc)` para que la rejilla de movimiento reducido no desalinee su fila. (20fff68, 7e4f16a) | `about.spec`: «B» ≥ 0,62 × cuerpo de los wordmarks a 1440 y 390; la de «sin fila huérfana» sigue en verde. | 13,8 ≥ 12,4 · 10,7 ≥ 9,9 |
| P2-4 | `TRAMO` 640 ms × 3 + cola → ≈ 2,75 s. | `pasosCraft.ts`: `TRAMO` 400, `TRAMO_SIN_LASER` 320, `COLA` 380, `TEXTO` 480. Misma secuencia (láser → nodo → número/título/texto a 0/70/150 ms). (3b85199) | `g4-motion.test.ts`: total con láser entre 1,8 y 2 s, sin láser ≤ 2 s y más corto, el pulso cabe en el texto. e2e: 1,4–3 s entre `anima` y `listo`. | **1.950 ms** con láser, 1.710 sin él (antes ≈ 2.750) |
| P2-5 | `blur(3px)` sobre las dos capturas de página completa en cada navegación. | `--filtro-pagina: blur(3px)` en escritorio y `none` < 1024 px; los keyframes `pag-sale`/`pag-entra` leen el token (quedan 8 px + fundido). (b9a7ea2) | `g4-motion.spec`: a 1440 los keyframes llevan `blur(3px)`; nueva prueba a 390 (dock → /cv): todos `none`, 250 ms. | — |
| P2-6 | La pista corría `infinite` (36 s) fuera de la vista. | `MarqueeVivo.tsx` (cliente): IntersectionObserver marca `data-fuera`; `.marquee[data-fuera] .marquee-pista { animation-play-state: paused }`. Sin JS corre siempre. (2df7946) | `about.spec`: a 390, arriba `paused`, centrado `running`, de vuelta arriba `paused`. | — |
| P2-7 | El latido pintaba `box-shadow` en `.estado::before`. | El punto (`::before`) es estático; el halo es `.estado::after` (misma caja: `order: -1`, `margin-inline-end: -16px` = ancho + gap, se pinta debajo) y `estado-pulso` solo anima `opacity` y `transform`. Los `translate` de `.lista-datos` y `.k2` se aplican a los dos; `.hoy-chip` oculta el halo. (4883fef) | `about.spec`: animaciones `estado-pulso` solo en `::after`, propiedades `[opacity, transform]`, caja 8 × 8, y 0 animaciones vivas tras los 2 latidos. | — |

## Verificación

| Paso | Resultado |
|---|---|
| `npm run lint` | 0 errores |
| `npx tsc --noEmit` | 0 |
| vitest | 267/267 (27 archivos) |
| `npm run build` | OK |
| Suites afectadas (about, tablero, g4-motion, cromo-contraste, a11y, perf) | **152/152** |
| Suite completa | RESULTADO_COMPLETA |

Capturas de comprobación (no versionadas): punto verde alineado en la ficha Datos y en K2 a 390; marquee con «Banco de Occidente» a la altura de «Aval Digital Labs».
