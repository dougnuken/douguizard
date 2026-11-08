# F0 · Informe del ejecutor (base técnica y línea de base)

> 5–6 nov 2026 · rama `claude/douguizard-portfolio-redesign-9ivnau` · Node 22.23.4 · Chromium 1243 (`/opt/pw-browsers`).
> Sin cambios de UI. El commit lo hace el orquestador. Hubo tres reinicios del contenedor durante la fase; ninguna
> medida quedó a medias (cada corrida citada terminó y su log está completo).

## Comandos y resultados

| Paso | Antes del upgrade (16.3.5 / 19.2.6) | Después (16.4.5 / 19.3.1) |
|---|---|---|
| `npm test` (vitest) | 10 archivos, 149/149 | 10 archivos, 149/149 |
| `npm run lint` | verde | verde (incluye `perf.spec.ts` y `shots-rediseno.ts`) |
| `npx tsc --noEmit` | verde | verde |
| `npm run build` | verde, 30 páginas; único aviso: `Cache-Control` en `/_next/static` | igual: 30 páginas, mismo y único aviso, nada de `priority`/`preload` |
| `npx playwright test` | corrida 1: **267/267** (13,8 min) · corrida 2: **267/267** (13,7 min) | **269/269** (14,4 min) = 267 + 2 de `perf.spec` |

Las dos corridas «antes» se hicieron sin otros procesos (`ps` sin `next-server`). Los 6 timeouts de `networkidle` en
`/work/qrvey` que vio el revisor **no se repitieron**: no hizo falta tocar ninguna espera (eran carga del contenedor).

## Versiones finales

`next` 16.4.5 · `react`/`react-dom` 19.3.1 · `@types/react`/`@types/react-dom` 19.3.0 · `eslint-config-next` 16.4.5 ·
`gsap` 3.15.1 · `@gsap/react` 2.1.2 · `sharp` 0.35.5 (dev; binario OK sin `npm rebuild`) · `@playwright/test` 1.63.0 (sin cambio).

## `<ViewTransition>` (§1.9)

Ruta temporal `src/app/(es)/vt-prueba/page.tsx` con `import { ViewTransition } from "react"`: tsc y build verdes, el HTML
prerenderizado trae `vt-name="vt-prueba"`, y en Chromium hidrata sin errores de consola. `grep -c "exports.ViewTransition"
node_modules/next/dist/compiled/react/cjs/react.production.js` = 1. Ruta borrada y build rehecho. **Plan B no hizo falta.**

## Cambios por archivo

- `package.json` / `package-lock.json`: upgrade de §1.9; `gsap`, `@gsap/react` (dependencias); `sharp` (dev); scripts
  `test:e2e` (`next build && playwright test`), `shots:rediseno` (`tsx scripts/shots-rediseno.ts`), `hero:poster`
  (`tsx scripts/build-hero-poster.ts`; **el script se crea en F4**, hoy el comando falla por archivo inexistente).
- `next.config.ts`: `/hero/:rest*` → `public, max-age=31536000, immutable`. Verificado con un archivo temporal en
  `public/hero/` (200 + esa cabecera; borrado). `experimental.globalNotFound` sin tocar.
- `scripts/shots-rediseno.ts` (nuevo): matriz 390×844 / 1024×768 / 1440×900, ES+EN, con y sin RM, DPR 1, JPG q 82,
  página completa y primer pliegue, tema oscuro por defecto (`--tema light|ambos`), `--anchos`, `--rutas`, `--base`.
  Congela vídeos en el cuadro 0 y usa `animations: "disabled"`. Define `globalThis.__name` en la página porque tsx
  envuelve las funciones de `settle` que van a `page.evaluate`.
- `tests/e2e/perf.spec.ts` (nuevo, solo mide): LCP + elemento LCP + CLS por `PerformanceObserver`; JS e imágenes
  terminados antes de `load` por CDP; móvil 390×844 DPR 3 con Slow 4G + CPU ×4, escritorio 1440×900 (40 ms, 10 Mbit/s);
  mediana de 3 cargas en frío. Escribe `tests/out/baseline-F0.json` (o `PERF_OUT`). Solo Chromium.
- `docs/rediseno-2026/baseline-F0.json` (nuevo, versionado): perf antes y después + resultados de las suites.

## Línea de base (`/`, mediana de 3)

| | LCP | Elemento LCP | CLS | JS inicial |
|---|---|---|---|---|
| Móvil, antes | **4.456 ms** | `<p>` de la bajada del héroe («Head of Product en Naowee…») | 0,0056 | **157,6 KB gz** (169,6 KB transferidos, 9 archivos) |
| Escritorio, antes | **1.576 ms** | el mismo `<p>` | 0 | igual |
| Móvil, después | 4.584 ms (4.932 / 4.584 / 4.496) | igual | 0 | 158,4 KB gz (+0,8) |
| Escritorio, después | 1.576 ms | igual | 0 | 158,4 KB gz |

El LCP es texto que entra con la revelación, no una imagen: por eso queda lejos del `load` (3,2 s móvil, 0,4 s escritorio).

## Capturas antes / después (72 por juego, `tests/shots/rediseno/F0/`)

Diff de píxeles con sharp: % de píxeles distintos con umbral 0 y con umbral > 8/255 por canal (ruido JPG). Para separar
el ruido de un cambio real se tomó un segundo juego «antes» (`antes-ruido`, mismo build 16.3.5).

- **Reduced-motion (36 capturas): 35 idénticas píxel a píxel antes→después.** La otra (`_-390-dark-rm-full`) difiere en
  1 px de alto en el juego «antes»; `antes-ruido` y `despues` son idénticas entre sí, así que es ruido de la toma.
- **Con animación (36):** 16 difieren, máximo 1,13 % de píxeles sobre el umbral (home 1440). El ruido «antes vs
  antes-ruido» da la misma forma: 14 distintas, máximo 1,04 %. Es el estado de las animaciones en curso, no el upgrade.
- Resultado: **sin diferencias atribuibles al upgrade.** Tabla completa (antes→después · antes→antes-ruido ·
  antes-ruido→después, % umbral 0 / % umbral 8):

| Captura | antes→después | antes→ruido | ruido→después |
|---|---|---|---|
| `_-1024-dark-anim-full` | 14.98 / 0.00 | 13.86 / 0.00 | 7.40 / 0.00 |
| `_-1024-dark-anim-pliegue` | 5.79 / 0.00 | 19.00 / 0.11 | 18.74 / 0.08 |
| `_-1024-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_-1024-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_-1440-dark-anim-full` | 22.55 / 1.13 | 15.66 / 0.00 | 21.84 / 0.97 |
| `_-1440-dark-anim-pliegue` | 8.46 / 0.00 | 16.28 / 0.02 | 15.34 / 0.01 |
| `_-1440-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_-1440-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_-390-dark-anim-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_-390-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_-390-dark-rm-full` | alto ±1 px | alto ±1 px | 0.00 / 0.00 |
| `_-390-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-1024-dark-anim-full` | 0.43 / 0.11 | 0.52 / 0.13 | 0.43 / 0.12 |
| `_cv-1024-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-1024-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-1024-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-1440-dark-anim-full` | 0.48 / 0.11 | 0.36 / 0.09 | 0.42 / 0.10 |
| `_cv-1440-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-1440-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-1440-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-390-dark-anim-full` | 1.06 / 0.48 | 1.41 / 0.73 | 1.37 / 0.77 |
| `_cv-390-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-390-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_cv-390-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-1024-dark-anim-full` | 15.44 / 0.00 | 20.79 / 0.01 | 21.79 / 0.02 |
| `_en-1024-dark-anim-pliegue` | 14.41 / 0.00 | 20.66 / 0.35 | 21.98 / 0.59 |
| `_en-1024-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-1024-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-1440-dark-anim-full` | 22.25 / 1.02 | 22.28 / 1.04 | 5.85 / 0.00 |
| `_en-1440-dark-anim-pliegue` | 9.43 / 0.00 | 11.29 / 0.00 | 6.52 / 0.00 |
| `_en-1440-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-1440-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-390-dark-anim-full` | 0.51 / 0.13 | 0.00 / 0.00 | 0.51 / 0.13 |
| `_en-390-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-390-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en-390-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-1024-dark-anim-full` | 0.32 / 0.10 | 0.40 / 0.11 | 0.44 / 0.12 |
| `_en_cv-1024-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-1024-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-1024-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-1440-dark-anim-full` | 0.27 / 0.09 | 0.00 / 0.00 | 0.27 / 0.09 |
| `_en_cv-1440-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-1440-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-1440-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-390-dark-anim-full` | 0.79 / 0.18 | 1.38 / 0.75 | 1.42 / 0.79 |
| `_en_cv-390-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-390-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_cv-390-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1024-dark-anim-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1024-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1024-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1024-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1440-dark-anim-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1440-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1440-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-1440-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-390-dark-anim-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-390-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-390-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_en_work_olbo-390-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1024-dark-anim-full` | 0.10 / 0.05 | 0.00 / 0.00 | 0.10 / 0.05 |
| `_work_olbo-1024-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1024-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1024-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1440-dark-anim-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1440-dark-anim-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1440-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-1440-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-390-dark-anim-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-390-dark-anim-pliegue` | 0.00 / 0.00 | 0.01 / 0.00 | 0.01 / 0.00 |
| `_work_olbo-390-dark-rm-full` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| `_work_olbo-390-dark-rm-pliegue` | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

## Desvíos y pendientes

- **`@gsap/react` añadido** porque lo pidió el orquestador; §1.8 del plan dice «no se añade». No se importa en ningún
  lado (0 KB en cliente). Si manda el plan: `npm uninstall @gsap/react`.
- `hero:poster` apunta a `scripts/build-hero-poster.ts`, que crea F4.
- El diff de píxeles se hizo con un script fuera del repo (sharp, raw RGB); si QA lo quiere por fase, se puede sumar
  como `--comparar` a `shots-rediseno.ts`.
- Las capturas «con animación» no son comparables al 100 % entre corridas (ver arriba): para las puertas de cada fase,
  comparar las de RM.
- `npm audit` sigue informando vulnerabilidades (fuera de F0). Servidores levantados durante la fase: todos detenidos.
