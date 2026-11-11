# Pulido I · INFORME O (optimizador de código)

Rama `worktree-agent-a71efa1e98a04d81f`, un commit por hallazgo. Regla: mismo render, mismas pruebas en verde.

## Hallazgos

| # | Estado | Qué se hizo / por qué se omite |
|---|---|---|
| 1 P0 | aplicado | `CaseHeader`/`CaseNext` ya no importan valores de `@/data/work`; `CaseBody` (servidor) calcula `corto` y la ficha del siguiente. |
| 2 P1 | aplicado | Al cliente solo viajan los campos que se pintan (`Pick<CaseStudy,…>`, 3 KPI del siguiente). |
| 4 P1 | aplicado | Borrados `BrowserGallery`, `BrowserShot`, `toBrowserShots` y constantes (~115 líneas). |
| 5 P1 | aplicado | `measure`/`frames`/`contrast-detail` a `tests/medidas/` con `playwright.medidas.config.ts` (7 tests, listados OK). |
| 6 P1 | aplicado | `PW_PORT` (3131 por defecto) en `baseURL`, `command` y `port`. |
| 8 P2 | aplicado | Fuera `Eyebrow`, `SlashLabel`, `numberWord`+listas, `isLocale`, `TAMANOS_DOT`, `PILDORA_CURVA`, `type Seccion`. |
| 9 P2 | aplicado | Borradas las variantes CSS sin uso y estrechados los tipos (`Superficie`, `RadioLosa`, `VarianteBoton`, `Flecha`, `Etiqueta` sin `tono`). |
| 10 P2 | aplicado con matiz | Los dos `renderBold` no eran idénticos (el del CV pinta `<strong>` con clases): `src/lib/renderBold.tsx` con parámetro `strongClassName`. |
| 11 P2 | aplicado | Quitados `tone`/`rule`/`wide` (no hacían nada) y sus usos. Se simplificó el filtro `py-` de `Band` (solo lo ejercía un `className` que se descartaba). |
| 12 P2 | parcial | `src/lib/mates.ts` y `src/lib/movimiento.ts`: 3 `clamp/lerp` y 12 `matchMedia(reduced)` unificados. Omitidos `lerpN` (`lib/escena.ts`), `useScrollScene` y `FotoContinua` (frontera de otros agentes) y `useInView` (suscripción en vivo). |
| 15 P2 | aplicado | `CopiarCorreo`: un solo temporizador, se cancela al reiniciar y al desmontar. Único cambio de conducta (el aviso ya no se corta con doble clic). |
| 16 P2 | aplicado | Sin `!` en `CaseShowcase`, `PrintButton`, `DockMovil`, `SiteHeader` (guardas/const locales). |
| 17 P2 | aplicado | Fuera `--dur-slow`, `--resplandor-b`, `--d-entrada`, `--s6`. |
| 18 P2 | aplicado | Borrados `scripts/shots-f6.ts` y `shots-f7.ts`. |
| 20 P2 | aplicado | `vitest.config.mts`; el aviso de Vite desapareció. |
| 21 P2 | aplicado | Comentario de la CSP corregido. |
| 3, 7, 13, 14, 19, 22 | omitidos | «QA visual», «tarea aparte», «Doug» o «revalidar tras el vidrio», según la consigna. |

## Medidas (`next build`, mismo equipo)

Método: tras `next build`, para cada HTML prerenderizado de `.next/server/app` se suman los `<script src>` de `/_next/static` y se comprime cada uno con gzip -9 (no incluye `import()` perezosos). Base = `f7cb9ba` (build propio en el scratchpad).

| Página | Antes (gzip / raw) | Después | Δ |
|---|---|---|---|
| `/work/[slug]` (olbo) | 266,3 KB / 836,3 KB | 217,6 KB / 692,9 KB | -48,7 KB gz (-18 %), -143 KB raw |
| `/` | 203,9 KB / 646,2 KB | 204,5 KB / 646,0 KB | ≈ 0 (+0,6 KB gz es ruido de hashes; raw -0,2 KB) |
| `/work`, `/about`, `/cv` | 195,7 / 196,9 / 197,4 KB | 196,3 / 197,5 / 198,0 KB | ≈ 0 |

HTML de `/work/olbo`: 394,7 KB -> 382,4 KB (sin el texto del caso siguiente en el payload RSC).
Render: el `<body>` prerenderizado (sin scripts, rutas `_next` normalizadas) es **idéntico byte a byte** antes/después en `/`, `/work`, `/about`, `/cv`, `/experience`, `/en/cv` y 5 casos (ES y EN). Eso cubre HTML, no CSS.

## Pruebas

PRUEBAS_PENDIENTES

## Desvíos y no verificado

- Sin capturas ni QA visual: el CSS borrado (#9, #17) se comprobó con grep, no a ojo.
- Un `next start -p 3105` lanzado por Playwright quedó vivo (no pude matarlo: el permiso por PID se denegó). Es de mi puerto y sirve mi build.
