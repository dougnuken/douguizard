# Pulido G · G1 · TBT móvil del héroe

Rama `pulido-g/g1-tbt` (desde `46f77d9`). Objetivo: TBT móvil < 200 ms y Perf ≥ 90 en `/`, `/about` y `/en` sin perder el aspecto, el póster horneado (LCP) ni `prefers-reduced-motion`.

## Medición

Lighthouse 12.8 (CLI), móvil por defecto (simulado: Slow 4G, CPU ×4), Chromium de `/opt/pw-browsers` con `--headless=new --no-sandbox`, contra `next build` + `next start -p 3201`. 3 corridas por página; se da la mediana de Perf y de cada métrica.

**Antes y después se midieron en la misma ventana y con la máquina en reposo** (carga < 2; la base es `46f77d9` construida aparte). Una primera medición de la base con otros agentes en paralelo dio Perf 74/78/81 y TBT 584/585/364: con carga, la simulación de Lighthouse sube el TBT (multiplica la duración observada de cada tarea) y la varianza es grande, así que esa tabla no se usa para comparar.

| Página | Perf antes | Perf después | TBT antes (ms) | TBT después (ms) | LCP antes (ms) | LCP después (ms) | SI antes → después (ms) | Corridas después (Perf/TBT) |
|---|---|---|---|---|---|---|---|---|
| `/` | 67 | **90** | 955 | **172** | 3.759 | 3.242 | 1.622 → 1.224 | 86/182 · 91/149 · 90/172 |
| `/about` | 73 | **90** | 978 | **160** | 3.336 | 3.320 | 1.437 → 1.058 | 90/160 · 91/159 · 90/169 |
| `/en` | 75 | **87** | 538 | **143** | 3.829 | 3.727 | 1.530 → 1.209 | 87/143 · 87/164 · 88/143 |

Corridas de la base: `/` 65/1354 · 70/802 · 67/955; `/about` 79/525 · 70/978 · 73/1161; `/en` 69/856 · 76/494 · 75/538. FCP sin cambio (1,06–1,22 s); CLS 0.

Otros datos (corrida mediana):

| | Antes | Después |
|---|---|---|
| Trabajo del hilo principal `/` · `/about` · `/en` | 2,9 · 3,2 · 2,5 s | 1,2 · 1,0 · 1,2 s |
| JS transferido en la carga `/` y `/en` | 277 KB | 179 KB |
| Imágenes sobredimensionadas `/` y `/en` | 51 KiB | 14 KiB (el retrato de K13; solo hay 640/880) |

**TBT < 200 ms en las tres.** Perf ≥ 90 en `/` y `/about`; `/en` queda en 87 por el **LCP simulado**, no por el TBT (ver «Límites»).

## Causa

Trazo con CPU ×4 (CDP) del héroe en móvil, antes:

1. **`texImage2D` re-decodificaba la foto en el hilo principal** (`ImageDecoder::DecodeFrameBufferAtIndex`, ~75 ms con CPU ×4): con un `<img>`, Chromium vuelve a extraer los píxeles sin premultiplicar aunque ya se hubiera llamado a `decode()`.
2. **Cada cuadro de WebGL costaba una lectura síncrona de píxeles en el commit** (`Commit → GLES2::ReadPixels → WaitForCmd`, 115–140 ms por cuadro). Sin GPU (SwiftShader, igual que en Lighthouse y en PageSpeed Insights) el compositor copia el canvas a CPU y espera a que la GPU termine la compilación perezosa del shader, los mipmaps y el rasterizado. Al montar se pintaban **3 cuadros iguales** (la lente, el `ResizeObserver` y el `IntersectionObserver` pedían uno cada uno).
3. En Lighthouse esas esperas cuentan ×4 (la simulación multiplica la duración observada): de ahí las tareas de 257–369 ms del chunk del vidrio.
4. **El prefetch de los enlaces visibles** (losas de casos, cabecera, dock, logo) pedía el RSC de `/`, `/cv` y `/work/naowee-suid` y evaluaba el JS de la hoja del caso (~85 KB, el «JS sin usar» de `/` y `/en`) dentro de la ventana del TBT.
5. Lo que queda es la hidratación de React (`2qwy…js`, 150–210 ms simulados) y el parseo del HTML (CSS en línea + carga RSC); no se tocó (ver «Límites»).

## Cambios

| Commit | Qué |
|---|---|
| `8f06619` | `lib/gl/textura.ts`: la textura se carga con `fetch` + `createImageBitmap` (decodifica fuera del hilo; respaldo al `<img>`). `lib/gl/programa.ts`: compilación con `KHR_parallel_shader_compile` (se sondea `COMPLETION_STATUS_KHR` cediendo el hilo antes de preguntar el estado); **`prepintar`**: el primer cuadro se pinta en un framebuffer fuera de pantalla y se espera a la GPU con `fenceSync` sondeado sin bloquear; el cuadro visible es un `blitFramebuffer`. `VidrioGL.tsx`: la subida de la textura va en su propia tarea y **no se repinta si el estado no cambió** (firma de uniformes + tamaño): 3 cuadros al montar → 1. |
| `1114c36` | `VidrioDiferido.tsx`: **por debajo de 1024** el WebGL espera a la primera interacción (toque, puntero, scroll, tecla, rueda) y a un hueco libre, en vez de al `load`. Ahí el vidrio en reposo es idéntico al póster horneado (estado `movil`, lente cerrada, sin escena): WebGL solo aporta la lente al arrastrar. Escritorio sigue entrando tras el `load` (la escena del home lo necesita). Con RM, como antes: póster solo. |
| `bc60f32` | `CardCaso.tsx`: `sizes` medidos de 320 a 1920 por contexto (`tablero` en el home, `indice` en `/work`): el teléfono de Olbo (~30 % del ancho) y el panel de BdO (~68 %) bajaban la de 640 con `100vw`. |
| `48198b8`, `797e4ca`, último | `LinkDiferido` (`components/sistema/`) + `lib/primeraInteraccion.ts`: en móvil el prefetch de `next/link` queda apagado hasta el primer **gesto de avance** (scroll, rueda, tecla) y un hueco libre; desde ahí es un `Link` normal (prefetch por viewport, así que al llegar a una losa la hoja abre sin pedir nada). En escritorio, como antes. Se usa en `BentoCard`, `CardArchivo`, `SiteHeader`, `DockMovil`, `Wordmark` y `Boton`. El primer toque no dispara el prefetch para que no caiga encima del primer arrastre de la lente. |

Descartados:
- **`browserslist` moderno**: Next 16 ya compila para su objetivo moderno (Chrome/Edge/Firefox 111, Safari 16.4); los ~13 KiB de «JS heredado» son `polyfill-module` que Next incluye siempre en su chunk. No se puede quitar sin parchear Next.
- **Quitar `inlineCss`**: el CSS va duplicado en el HTML y en la carga RSC (~125 KB sin comprimir en `/`), pero quitarlo devuelve un viaje de red antes del primer pintado (F4: LCP móvil 2,94 → 1,00 s con él).
- **Bajar `dprMax` del vidrio**: abarataría el rasterizado sin GPU pero cambia la nitidez de las estrías.

## Límites

- **LCP simulado (3,2–3,7 s).** En local, todo el JS se descarga antes del LCP observado (~190 ms en localhost), y Lantern lo cuenta como dependencia del LCP en Slow 4G. En producción el LCP observado llega antes que los scripts y el simulado era 2,58 s en `/` (`pulido-F/LIGHTHOUSE.md`). Con el TBT nuevo, `/en` debería pasar de 90 en producción como `/`; hay que medirlo tras el deploy.
- **Hidratación.** Es el TBT que queda (dos o tres tareas de 100–200 ms simuladas de `react-dom`). Bajarlo pide menos componentes cliente en el home: es una refactorización, fuera de G1.
- El «JS sin usar» de `/about` sube de 28 a 53 KiB sin que se descargue más: el código de prefetch del router (`2b23…js`) ya se descarga, pero ya no corre en la carga, así que Lighthouse lo cuenta como sin usar. El JS transferido baja (`/` 277 → 179 KB).
- Sin GPU, la lente sigue costando una lectura de píxeles por cuadro mientras se arrastra. En un móvil real con GPU no hay lectura.
- La primera vez, si el primer gesto es arrastrar la foto en móvil, la lente no sigue ese arrastre (el WebGL se monta durante él); desde el siguiente gesto, sí.

## Verificación

- `npm run lint` ✓ · `tsc --noEmit` ✓ · `vitest` 258/258 ✓ · `npm run build` ✓.
- Playwright (Chromium, puerto 3201 con una config temporal ya borrada, `--trace off`): `vidrio`, `hero320`, `perf`, `layout`, `hoja`, `tablero`, `escena`, `controles`, `dock-pulido`, `i18n` y `motion`: **212/212** ✓. Repetidas ×3: táctil de `vidrio` y snap de `escena` 6/6 ✓.
- `vidrio.spec` (d) táctil: ahora comprueba que en móvil antes de tocar solo está el póster (sin canvas) y toca antes de esperar el WebGL.
- Con la máquina cargada (carga 7–13, otros agentes) fallaron pruebas de tiempo (snap de `escena`, cierre de la lente) y Lighthouse dio corridas atípicas (una de 3,3 s de TBT); en reposo todo pasa y las medianas de arriba son de reposo.
- Consola en móvil (`/`, `/about`, `/en`, con scroll): sin errores ni avisos de hidratación. Solo queda el aviso del driver «GPU stall due to ReadPixels», que es del compositor sin GPU.
