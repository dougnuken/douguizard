# Pulido I · AUDITORÍA de código (agente A, 10 nov 2026)

Solo lectura de `src/`, `tests/`, `scripts/`; todo comprobado con grep («sin uso» = ninguna referencia fuera de su
archivo). `hero/**` y `lib/gl/**`, por encima: **revalidar tras integrar el vidrio**.

**Base:** `npm run lint` 0 errores/0 avisos · `tsc --noEmit` 0 errores · vitest 271/271 en 4 s (aviso de Vite, #20).

O: **sí** = seguro para O (ni aspecto ni conducta cambian; pruebas actuales lo cubren) · **QA** = solo con QA visual · **Doug** = no sin Doug.

| # | P | Ámbito | Dónde | Riesgo | Esfuerzo | O |
|---|---|---|---|---|---|---|
| 1 | P0 | Peso JS | `case/CaseHeader.tsx:6`, `case/CaseNext.tsx:4` | bajo | S | sí |
| 2 | P1 | Peso payload | `case/CaseBody.tsx:91,153` | bajo | S | sí |
| 3 | P1 | Límite cliente | `case/*` (18 archivos `"use client"`) | medio | L | QA |
| 4 | P1 | Código muerto | `work/BrowserFrame.tsx:461-572`, `case/caseFrames.tsx:48-58` | bajo | S | sí |
| 5 | P1 | Pruebas lentas | `tests/e2e/measure.spec.ts`, `frames.spec.ts`, `contrast-detail.spec.ts` | bajo | S | sí |
| 6 | P1 | Pruebas / infra | `playwright.config.ts:21,33-34` | bajo | S | sí |
| 7 | P1 | Pruebas frágiles | 92 `waitForTimeout` en 27 archivos de `tests/e2e` | medio | L | QA |
| 8 | P2 | Exports muertos | `primitives.tsx:46,104`, `dictionaries.ts:13-21`, `config.ts:29`… | bajo | S | sí |
| 9 | P2 | CSS huérfano | `sistema/sistema.css:10,112,116,173,268,330,350,426-434` | bajo | S | sí |
| 10 | P2 | Duplicado | `cv/CvExperience.tsx:12` ↔ `case/primitives.tsx:29` | bajo | S | sí |
| 11 | P2 | Props vestigiales | `primitives.tsx:46,61,75-77`, `tone?: unknown` ×6 | bajo | S | sí |
| 12 | P2 | Duplicado | `clamp`/`lerp` ×6, `matchMedia(reduced)` ×14 | bajo | M | sí |
| 13 | P2 | Peso JS | `tailwind-merge` en 6 archivos cliente | medio | M | QA |
| 14 | P2 | Peso JS | `i18n/LocaleProvider.tsx:5` (diccionario de los dos idiomas) | medio | M | QA |
| 15 | P2 | Efectos | `tablero/CopiarCorreo.tsx:26` | bajo | S | sí |
| 16 | P2 | Tipos | `!` no nulos: `CaseShowcase.tsx:78`, `PrintButton.tsx:43`, `DockMovil.tsx:95`, `SiteHeader.tsx:193` | bajo | S | sí |
| 17 | P2 | CSS sin uso | `app/globals.css:115,221,331,1091` | bajo | S | sí |
| 18 | P2 | Restos de fase | `scripts/shots-f6.ts`, `scripts/shots-f7.ts` | bajo | S | sí |
| 19 | P2 | Restos (D4) | `components/ThemeToggle.tsx`, `chrome/SiteHeader.tsx:11,224,262` | medio | M | Doug |
| 20 | P2 | Config | `vitest.config.ts` | bajo | S | sí |
| 21 | P2 | Comentario falso | `next.config.ts:14` | nulo | S | sí |
| 22 | P2 | Héroe | `hero/VidrioGL.tsx:205`, `hero/useLente.ts:25` | — | S | revalidar |

Recuento: **P0 1 · P1 6 · P2 15** (22 hallazgos).

## P0

**1 · El JS del caso arrastra todos los datos de casos y del CV.** `CaseHeader.tsx:6` (`getShortName`) y
`CaseNext.tsx:4` (`getCaseMeta`) son `"use client"` e importan valores de `@/data/work`, que a su vez importa
`data/es/work`, `data/cv` y `data/es/cv`: ~200 KB de fuente (102 + 77 + 16 + 8 KB) entran al bundle cliente de
`/work/[slug]` y de la hoja modal. *Por qué:* es el mayor peso evitable del sitio y pega en TBT/LCP de los casos.
*Arreglo:* calcular en `CaseBody.tsx` (servidor) `corto = getShortName(study)` y `metaSiguiente =
getCaseMeta(next.slug, locale)` y pasarlos como props; borrar ambos imports de valor (dejar `import type`).
*Medir:* tamaño de los chunks de `/work/[slug]` antes/después en el `next build`. Lo cubren `caso.spec` y `hoja.spec`.

## P1

**2 · Casos completos serializados en el payload RSC.** `CaseBody.tsx:91` pasa `study` entero a `CaseHeader`
(usa `project`, `slug`, `tagline`, `platforms`) y `:153` pasa `next` entero a `CaseNext` (usa `slug`, `project`,
`kpis`): el texto completo del caso **siguiente** viaja en el HTML de cada caso. *Arreglo:* pasar solo esos campos
(`Pick<CaseStudy, …>`). Junto con #1, mismo PR. Riesgo bajo, cubierto por `caso.spec`/`hoja.spec`.

**3 · La plantilla del caso entera es cliente.** 18 archivos de `components/case/` llevan `"use client"`; la
mayoría solo por `useDict()`/`useLocale()` (p. ej. `CaseColophon.tsx:21`, `CaseNda.tsx:33-34`), y
`primitives.tsx`, `work/MockupGallery.tsx`, `work/PhoneFrame.tsx` no usan ningún hook. *Arreglo:* que `CaseBody`
(servidor) pase `t = getDict(locale).case` y `locale` por props y dejar cliente solo lo interactivo (`CaseImpact`,
`CaseIndice`, `StoryMedia`, vídeos, `RevealText`). *Riesgo medio:* cambia el árbol de hidratación y el orden de
revelado; pide QA visual de casos y hoja.

**4 · `BrowserGallery` y `toBrowserShots` sin uso.** `BrowserFrame.tsx:461-572` (`BrowserShot`,
`BrowserGalleryLayout`, `BrowserGalleryProps`, `SIZES_FULL`, `SIZES_HALF`, `MAX_DELAY`, `BrowserGallery`) y
`caseFrames.tsx:48-58` (`toBrowserShots` y su `import type { BrowserShot }` en `:4`): ~120 líneas que nadie
importa. *Arreglo:* borrarlas. Seguro.

**5 · Tres specs sin una sola aserción.** `measure.spec.ts` (3 tests), `frames.spec.ts` (3) y
`contrast-detail.spec.ts` (1) tienen 0 `expect`: solo escriben JSON en `tests/out/` (medidas de fases viejas) y
corren en cada suite completa. *Arreglo:* sacarlos de `testDir` (p. ej. `tests/medidas/` con un
`playwright.medidas.config.ts`) o etiquetarlos `@medida` y añadir `grepInvert: /@medida/` en la config. Seguro.
`recheck.spec.ts`/`recheck2.spec.ts` sí afirman: se quedan.

**6 · Puerto de Playwright fijo.** `playwright.config.ts:21,33-34` clava `3131`; el PLAN §0 da un puerto por
agente y `reuseExistingServer: true` puede reutilizar el servidor de otro (lo frena `servidorAlDia.ts`, pero
falla en vez de arrancar). *Arreglo:* `const PUERTO = Number(process.env.PW_PORT ?? 3131)` y usarlo en
`baseURL`, `command` y `port`. Seguro (por defecto queda igual).

**7 · 92 esperas fijas (`waitForTimeout`).** Las más cargadas: `escena.spec.ts` 16, `hoja.spec.ts` 15
(300–800 ms, p. ej. `:113,:122,:124`), `experience.spec.ts` 7, `vidrio.spec.ts` 6, `about.spec.ts` 6. Son la
causa probable de lentitud y de fallos por carga de CPU. *Arreglo:* sustituir por esperas de estado:
`expect.poll`, `toHaveAttribute('data-revelar','listo')`, `data-escena-fase`, `animationend`. Por tandas, un spec
por commit con la suite de ese spec 3× en verde. No para O en esta ola salvo `hoja.spec`.

## P2

**8 · Exports sin uso.** `case/primitives.tsx:46` `Eyebrow` y `:104` `SlashLabel`; `i18n/dictionaries.ts:13-21`
`numberWord` + `SMALL_EN`/`SMALL_ES`; `i18n/config.ts:29` `isLocale`; `sistema/DotMatrix.tsx:6` `TAMANOS_DOT`;
`lib/pildora.ts:20` `PILDORA_CURVA`; `data/home.ts:26` `type Seccion`. Borrar. (Hay además ~60 tipos exportados que
solo se usan dentro de su archivo; no vale la pena tocarlos.)

**9 · Variantes de CSS del sistema B que nadie pinta.** Comprobado contra todos los valores que llegan a
`Boton`, `Losa`, `Etiqueta`, `Flecha`: sin uso `.b-texto` (`sistema.css:10`), `.losa--r-s` (`:112`),
`.losa--vacio` (`:116`), `.losa--vidrio` (`:173-182` y su entrada en el `:is()` de `globals.css:751`),
`.flecha--osc` (`:268`), `.boton--electrico` (`:330`, hover `:350`), `.etiqueta--azul/--magenta/--osc`
(`:426-434`). Las uniones de tipos también los ofrecen (`data/home.ts:28`, `Boton.tsx:6`, `Etiqueta.tsx:3`,
`Flecha.tsx:5`). *Arreglo:* borrar reglas y estrechar tipos. Seguro; si el orquestador quiere conservar el
catálogo del sistema, dejarlo y solo documentar.

**10 · `renderBold` duplicado.** `CvExperience.tsx:12` copia el de `primitives.tsx:29` porque `primitives` es
`"use client"`. *Arreglo:* mover `renderBold` a `src/lib/renderBold.tsx` (sin directiva) y que ambos lo importen.

**11 · Props vestigiales.** `tone?: unknown` en `CaseDecisions.tsx:17`, `CaseProcess.tsx:17`,
`CaseNarrative.tsx:24`, `CaseNext.tsx:21`, `CaseColophon.tsx:12`, `CaseImpact.tsx:59`; `BandProps.tone/rule/wide`
(`primitives.tsx:75-77`, «se conserva por compatibilidad») y `sticky` (`:46`, `:61`). `CaseBody.tsx` aún pasa
`tone=` en 6 sitios (`:98,133,135,138,141,149`). *Arreglo:* quitar props y usos. `Band` también filtra clases
`py-` (`:96`) que ya nadie le pasa: revisar y simplificar.

**12 · Utilidades repetidas.** `clamp`/`lerp` en `TrayectoriaCliente.tsx:6-7`, `PortadaPerfilCliente.tsx:9-10`,
`lib/trayectoria.ts:126-127`, `useScrollScene.ts:10`, `lib/escena.ts:171` (`lerpN`) y `hero/FotoContinua.tsx:90`;
`matchMedia("(prefers-reduced-motion: reduce)")` escrito 14 veces (p. ej. `usePildora.ts:32`, `irASeccion.ts:13`).
*Arreglo:* `src/lib/mates.ts` (`clamp`, `lerp`) y `src/lib/movimiento.ts` (`prefiereQuieto()`). `FotoContinua`:
revalidar tras el vidrio.

**13 · `tailwind-merge` solo para la plantilla del caso.** Se usa en 6 archivos cliente (`primitives.tsx`,
`BrowserFrame.tsx` ×8, `DeviceMockup`, `DeviceVideo`, `PhoneFrame`, `MockupGallery`). Son varios KB gz (medir en el
build). *Arreglo:* donde las clases no chocan, unir con `[a, b].filter(Boolean).join(" ")`. Riesgo medio: twMerge
resuelve conflictos (p. ej. un `className` que pisa un `rounded-*`), así que pide QA visual de los casos.

**14 · Diccionario de los dos idiomas en todas las páginas.** `LocaleProvider.tsx:5` importa `getDict`, que
mete `en` + `es` (13 KB + `sistema.ts`) en el bundle compartido. *Arreglo:* que cada layout pase al provider el
diccionario de su idioma. Ojo: el diccionario tiene funciones (`homeLabel: (brand) => …`), que no cruzan
servidor→cliente; hay que convertirlas en plantillas antes. No para O.

**15 · Temporizador sin limpiar en «Copiar correo».** `CopiarCorreo.tsx:26` lanza `setTimeout(…, 2400)` en cada
clic sin cancelar el anterior: un doble clic devuelve el botón a «reposo» antes de tiempo (y `aria-live` corta el
aviso). *Arreglo:* `useRef` del temporizador, `clearTimeout` antes de crear otro y en el desmontaje. El resto de
efectos, listeners, observers y rAF revisados (34 archivos) sí limpian o tienen guarda (`vivo`, `turno`).

**16 · Aserciones no nulas.** `CaseShowcase.tsx:78` (`video!` ×3), `PrintButton.tsx:43` (`letterPdf!`, `pdf!`),
`DockMovil.tsx:95` y `SiteHeader.tsx:193` (`seccion!`). No hay `any` ni `as unknown` en `src/` (fuera de tests).
*Arreglo:* estrechar con una guarda o con el tipo de la unión. Seguro.

**17 · Variables CSS definidas y nunca leídas.** `--dur-slow` (`globals.css:115`), `--resplandor-b` (`:221`),
`--d-entrada` (`:331`), `--s6` (`:1091`). Borrar.

**18 · Scripts de capturas de fases cerradas.** `scripts/shots-f6.ts` (119 líneas) y `shots-f7.ts` (75) no
están en `package.json` y solo los citan informes de F6/F7. *Arreglo:* borrarlos (la historia de git los guarda).

**19 · Conmutador de tema inalcanzable.** Con D4 `temaClaroEn: "ninguna"` (`data/decisiones.ts:84`), `conTema`
(`SiteHeader.tsx:113`) es siempre falso: `ThemeToggle.tsx` (81 líneas) y las reglas `[data-theme="light"]`
(10 en `globals.css` y `cv-b.css`) no se usan. Pero D4 está pensada para cambiarse con una línea. **No tocar sin
Doug**; si confirma «ninguna» para siempre, cargar `ThemeToggle` con `next/dynamic` o borrarlo.

**20 · Aviso de Vite al correr vitest.** `vitest.config.ts` usa ESM en un archivo que Vite carga como CJS
(«unsupported by configLoader native»). *Arreglo:* renombrar a `vitest.config.mts`. Seguro.

**21 · Comentario de la CSP desactualizado.** `next.config.ts:14` dice que `next/font` aloja «Archivo and Geist
Mono»; hoy son Urbanist, Instrument Sans, Doto y Geologica. Corregir el texto.

**22 · Héroe (revalidar tras integrar el vidrio).** `VidrioGL.tsx:205` silencia `exhaustive-deps` suponiendo
props de geometría fijos; `useLente.ts:25` exporta `RESPUESTA` sin uso externo. La limpieza de efectos de
`VidrioGL`, `useLente`, `FotoContinua`, `VidrioDiferido` y `lib/gl/programa.ts` está bien hoy. `LenteCss.tsx`
**no** es código muerto: se importa en diferido desde `VidrioDiferido.tsx:82`.

**Sin hallazgo:** `<img>` con `alt`; cada `outline: none` tiene anillo sustituto; el `onClick` del velo
(`CaseSheet.tsx:189`) tiene Esc y botón; `gsap`/`metal-fx` van con `import()`; rutas `(es)`/`(en)` son envoltorios.

## Orden sugerido para O

#1+#2 (medir chunks) → #4, #8, #17, #18, #21 → #10, #11, #12, #15, #16 → #9 → #5, #6, #20. Tras cada paso: `npm test` +
`caso`/`hoja`/`tablero.spec`. Fuera de O: #3, #7, #13, #14, #19, #22.
