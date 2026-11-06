# F4 · Informe del ejecutor — vidrio estriado WebGL2, respaldos y póster horneado

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Fuente: `07-PLAN-IMPLEMENTACION.md` §F4 (+ §1.3, §1.8), F3 P2-3.

## Paso 0 · `experience.spec.ts:173` («una sola cuenta»)

La prueba leía los acumulados una sola vez, 900 ms después de llevar el scroll a p = 1. El scrub (0,5) asienta a su
ritmo y, bajo carga, todavía estaba en el mes anterior (11 años en vez de 12). Ahora espera el estado final real con
`expect.poll(() => totales(page))` (8 s), tanto en p = 1 como en la recarga con RM. Sin `skip`, sin tolerancias ni
`retries`. Verificada 4 de 4 con cuatro núcleos ocupados a propósito (`--repeat-each 4`) y en las dos corridas
completas de abajo.

## Qué quedó

- **`src/lib/gl/`** — `vidrioShader.ts` (VS/FS de un pase portados de `propuestas/B/index.html`: estrías con perfil
  de lente cilíndrica, cara protegida, banda láser legible de lado a lado, lente del cursor, borde estirado + mip
  borroso fuera de la foto y **sin aberración cromática fuera de la foto**, P2-11), `programa.ts` (compilar, enlazar,
  dibujar, liberar) y `textura.ts` (subida con mipmaps, mismo origen, sin `blob:`).
- **`src/lib/escena.ts`** — `cubrir()` (`object-fit: cover` + `object-position`) y `uniformesVidrio()` (pura). Las
  estrías viven **en el espacio de la foto** (origen y ancho relativos a la foto pintada): el póster horneado
  (canvas = foto) y el WebGL en vivo (canvas = caja, foto en `cover`) dan la misma franja en el mismo sitio, así el
  fundido no salta (riesgo de 07 resuelto por diseño).
- **`src/components/hero/`**
  - `VidrioDiferido.tsx` (isla pequeña, única pieza en el JS inicial): espera `load` + `requestIdleCallback` y solo
    entonces hace `import("./VidrioGL")`. Con RM no pide nada.
  - `VidrioGL.tsx`: canvas WebGL2 con `failIfMajorPerformanceCaveat: true`; fundido de 400 ms tras el primer cuadro;
    **sin bucle en reposo** (solo pinta mientras la lente se mueve, al redimensionar o si su `espejo` cambia); DPR ≤ 1,5;
    no pinta fuera de vista (`IntersectionObserver`) ni con la pestaña oculta; `webglcontextlost` → respaldo.
    Cuenta cuadros en `data-cuadros` y expone `data-lente`.
  - `useLente.ts`: muelles X/Y críticamente amortiguados (respuesta 0,35 s; abre k = 7, cierra k = 4), sub-pasos de
    1/240 s; ratón: solo dentro de la foto; táctil: arrastre 1:1 sin inercia, con `touch-action: pan-y pinch-zoom` en
    K1 móvil y la portada de `/about` (vertical = scroll; el zoom no se bloquea).
  - `VidrioCss.tsx` + `LenteCss.tsx`: el respaldo sin WebGL (ver desvío 1).
  - `HeroPoster.tsx`: `<picture>` del póster horneado, un juego por consulta (`escritorio` ≥ 1024 / `movil`), AVIF →
    WebP, `fetchPriority="high"` y dos `preload` con `media`.
  - Se borran `HeroField.tsx` y `Velaris.tsx` (su ciclo de vida está en `VidrioGL`).
- **`src/data/hero.ts`** — foto `199598aa` **v2**; rutas derivadas por `foto()` en `/hero/<id>-v<version>/`
  (`{cine,losa,movil}-{440,640,880}.{avif,webp}`, `textura.webp`, `manifest.json`); `anchosPoster()` nunca pasa del
  ancho del máster; parámetros del vidrio por estado (`cine` 12°, `losa` vertical como ref-8, `movil` 12° → **F3 P2-3
  resuelto**: el home móvil ya va oblicuo, también con RM porque va horneado); `varsFoto()` lleva el ojo y la
  proporción al CSS (`--foto-ojo`, `--foto-ar`, `--foto-ar-inv`).
- **`npm run hero:poster`** (`scripts/build-hero-poster.ts`) — Chromium (SwiftShader) abre un arnés con **el mismo
  FS** y la foto de `hero.ts`, pinta a tamaño nativo con la lente cerrada en los tres estados y `sharp` saca AVIF
  q 58 / WebP q 78 a 440/640/880 + la textura limpia (WebP q 84) + `manifest.json`. Comprueba que el máster mida lo
  que dice `hero.ts`. `HERO_FOTO=<jpg> HERO_SALIDA=<dir>` hornea otra foto 3:4 sin tocar nada.
- **K1** (`K1Retrato.tsx`) monta `VidrioDiferido` (`losa`/`movil`); la línea láser usa `--foto-ojo`.
- **`/about`** (`PortadaPerfil.tsx`): póster `cine`/`movil`; el canvas y la lente CSS llevan la clase `poster` y
  copian el estilo en línea de la foto con un `MutationObserver` (la isla de F2 la mueve con GSAP), así siguen el morph
  al píxel; la isla pone `--vidrio-f` = .62 → .08 en p 0–0,85 y el shader lo lee. `perfil.css` sin números de la foto.
- **Rendimiento** — `experimental.inlineCss` en `next.config.ts` (desvío 3).

## Pruebas

| | Resultado |
|---|---|
| vitest | **236/236** (227 de base + 9: `hero.test` reescrito — manifest = `hero.ts`, archivos horneados, anchos, P2-3, cambio de foto — y `escena.test` — `cubrir`, estrías en espacio de foto, cara/láser, fuerza, muelle de la lente) |
| lint · tsc · build | en verde |
| Playwright completo | ver «Verificación final» |
| `vidrio.spec.ts` (nuevo, 9) | (a) home 1440: LCP = `img.k1-poster` (póster `losa` AVIF), canvas insertado **después** de `loadEventEnd`, textura pedida después del `load`, fundido 0,4 s, sin errores; 0 cuadros en 1,2 s de reposo; el cursor abre (`data-lente` 1,00) sobre la foto y cierra fuera, y el bucle se detiene; `/about`: canvas = caja de la foto antes y después del scroll y `--vidrio-f` .62 → .08 · (b) Chromium lanzado con `--disable-webgl --disable-webgl2 --disable-3d-apis`, `/` y `/about`: sin canvas, póster horneado visible, `VidrioCss` activo con la textura y el cursor lo abre, sin errores · (c) RM en `/` y `/about`: sin canvas, sin `data-cuadros`, lente inactiva, `getAnimations({subtree})` vacío en el héroe, póster visible · (d) `hasTouch` 390: `touch-action` = `pan-y pinch-zoom`, arrastre horizontal (CDP) abre la lente y la cierra al soltar, arrastre vertical hace scroll · (e) `WEBGL_lose_context` → el canvas se desmonta y `VidrioCss` queda activo, sin errores · cambio de foto: con `a4ef948f` (fixture en `tests/fixtures/`) servida en las rutas de `hero.ts`, póster y canvas pintan sin errores |
| `tablero.spec` | la prueba de F3 «sin WebGL» se reescribe a lo que es: con RM, `VidrioCss` presente e inactivo y 0 canvas |

En el contenedor, Chromium da WebGL2 por SwiftShader **y `failIfMajorPerformanceCaveat` lo acepta** (07 esperaba que
no): por eso (a), (d) y (e) corren de verdad; si en otro entorno no hubiera WebGL2, se saltan con el motivo.
**Pendiente en hardware real** (MacBook de Doug, Android medio): ≥ 55 fps p50 con la lente en movimiento.

## Peso y LCP (`perf.spec`, mediana de 3 en frío, servidor solo; `perf-F4.json`)

| Ruta · perfil | F3 | F4 | Elemento LCP F4 |
|---|---|---|---|
| `/` móvil | 2.972 ms | **1.004 ms** ✓ (< 2,0 s) | `span.claim` (K2) |
| `/` escritorio | 448 ms | **364 ms** | `img.k1-poster` (`losa-640.avif`) |
| `/about` móvil | 3.424 ms (medido en `9b6e76d`; F2 dio 2.560) | **2.952 ms** ✗ | `img.poster` (`movil-880.avif`) |
| `/about` escritorio | 588 ms | **548 ms** | `img.poster` (`cine-880.avif`) |

- **JS inicial de `/`: 151,9 KB gz** (F3 151,5; base F0 157,6; presupuesto ≤ 172,6). Lo único nuevo en el JS
  inicial es `VidrioDiferido`; `VidrioGL`, `lib/gl`, `useLente` y `LenteCss` llegan después del `load` (lo
  comprueba `vidrio.spec` (a) con la textura y el momento del canvas). CLS 0 en las cuatro.
- Sin `inlineCss` (misma rama): `/` móvil 2.936 ms y `/about` móvil 3.540 ms (`perf-F4.json`, `F4-sin-inlineCss`).
- Pósters: `losa` 13–32 KB AVIF, `movil`/`cine` 18–53 KB (las franjas oblicuas comprimen peor que la foto limpia: el
  880 móvil pasó de 32 a 53 KB). Textura 56 KB, después del `load`.

## Verificación final

lint y `tsc` en verde; vitest **236/236**; `next build` en verde; Playwright completo **424/424 en dos corridas
completas seguidas** (14,3 min cada una; 415 de base + 9 de `vidrio.spec`), con `experience.spec.ts:173` en verde
en las dos.

## Capturas (`F4-capturas/`, `next build` + `next start`, DPR 1, JPG 82)

`home-1440x900-cursor-cara`, `-cursor-hombro`, `-cursor-fuera`, `home-1280x720-cursor-fuera`,
`home-1024x768-cursor-fuera`, `home-390x844-reposo`, `home-390x844-arrastre` (dedo a media cara), `about-1440x900-p0-cursor`,
`about-1440x900-losa` (fuerza .08), `about-390x844`, `home-1440x900-rm-poster` (RM: póster solo). Ojos limpios, láser
continuo de lado a lado en `losa`/`movil` (en `/about` el láser es su elemento propio y el horneado `cine` no lleva
banda), sin aberración fuera de la foto. La lente es sobria: aclara y endereza, no deforma.

## Desvíos del plan y por qué

1. **`VidrioCss` ya no dibuja franjas: es la lente en CSS.** El póster ya trae el vidrio horneado; franjas CSS encima
   lo duplicaban (dos rejillas de periodos distintos → moaré). Sin WebGL2 (o con el contexto perdido) `LenteCss` le
   pone la foto limpia de fondo bajo una máscara circular que sigue al cursor o al dedo: el cursor sigue abriendo y
   aclarando el vidrio, sin refracción. Con RM no se activa: **póster solo** (07 pedía «un solo cuadro» de WebGL con
   RM; el póster horneado es ese cuadro y no cuesta GPU ni JS).
2. **Póster a 440/640/880, no a 640/1080/1600/1920.** El máster provisional mide 880 px; no se inventan anchos.
   `anchosPoster()` sube solo cuando llegue el máster final (≥ 1920, D7, anotado en `hero.ts`). El estado `cine` se
   hornea también a tamaño nativo (en `/about` la foto se pinta a ≈ 1,0×).
3. **`experimental.inlineCss`** (no estaba en 07). Con 562 ms por viaje, el `<link rel=stylesheet>` costaba un viaje
   completo antes del primer pintado: el LCP móvil de `/` baja de 2,94 a 1,00 s. Coste: el CSS ya no se cachea entre
   páginas (cada HTML lo trae; `/about` pesa 57 KB gz). Si en F8 hay CDN con HTTP/2-3 y caché, se puede reconsiderar.
4. **LCP móvil de `/about` 2,95 s, no < 2,0 s → F8.** Es transferencia, no render: en Slow 4G (1,6 Mb/s) el póster
   (53 KB, el 880 porque el DPR 3 pide ≥ 1.800 px) compite con el HTML (57 KB) y ≈ 160 KB de JS; con `preload` y
   `fetchPriority` ya puestos, quedan ≈ 3 viajes + ≈ 1,5 s de bytes. Bajar el AVIF a q 45 ahorra ≈ 16 KB (≈ 0,1 s) y
   ensucia las franjas: no se hizo. Va a F8 (CDN cerca del usuario, `103 Early Hints` o póster inline de baja calidad).
   La meta de `/` sí se cumple.
5. **Fuerza de `/about` por variable CSS.** La isla de F2 pone `--vidrio-f` en la foto y el canvas la copia (con el
   resto del estilo) por `MutationObserver`: el canvas no necesita conocer el `ScrollTrigger` ni escuchar el scroll.
6. **Grep de números de la foto**: `0.418`, `880`, `1168` fuera de `hero.ts` = 0 en componentes y CSS. Quedan `880`
   como **ms** de la entrada del lockup (`corte.ts`, F1) y en pruebas de `anchosPoster`; no son de la foto.
   `CardPerfil` ya no indexa `[880]` (usa `tamano.w`).

## Pendientes

- QA visual y crítica de F4 (1440/1024/390, cursor, arrastre, RM, sin WebGL; legibilidad de cara y láser, material).
- fps en hardware real (≥ 55 p50) — MacBook de Doug y un Android medio.
- LCP móvil de `/about` (desvío 4) → F8.
- Safari: `mask-image` de la lente CSS y WebGL2 en iOS → F8.
- Imagen final del héroe (D7): con el máster ≥ 1920, nuevo objeto en `hero.ts`, `version` + 1 y `npm run hero:poster`.
- `lib/spring.ts` sigue huérfano (F3) → F8.
- `ESTADO.md` no se tocó (lo cierra el orquestador).
