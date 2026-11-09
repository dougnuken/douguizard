# Pulido D1 · héroe continuo a lo ancho + nombre con fundido

Rama `claude/douguizard-portfolio-redesign-9ivnau` · 9 nov 2026 · commits `8bdaca7` (foto) y `7b57555` (nombre).

## 1. La foto sigue a lo ancho (acto 1 del home y `/about`)
- Nuevo `src/components/hero/FotoContinua.tsx`: detrás de la foto nítida, la **misma foto** escalada a cubrir la caja, en **3 capas `<canvas>`** cada vez más borrosas y oscuras hacia los lados (4 px · 0,90 → 16 px · 0,78 → 40 px · 0,64). Las máscaras (`vidrio.css`) van ligadas a los bordes de la foto nítida (`--pl`, `--pr`), que conserva su fundido lateral: no hay costura.
- Escala mínima para cubrir (+6 % de holgura) con la **línea de los ojos fija** (el láser sigue recto) y la cara tan centrada como lo permite la cobertura. Sigue a la foto mientras la escena la mueve (MutationObserver sobre el `style` del póster) y se apaga con la atmósfera (`--atm`, 0 en p = 0,35).
- **Sin peticiones nuevas**: dibuja desde la `<img>` del póster ya decodificada. Además retira la atmósfera `::before`, que pedía otro póster (`cine-*.webp`). Un canvas no puede ser candidato a LCP.
- Solo ≥ 1024 sin RM: en móvil la foto ya va a sangre; con RM o sin JS no se crea ningún canvas.
- El vidrio estriado queda solo sobre la parte nítida (va horneado en el póster y en el WebGL).

## 2. El nombre «Doug Vargas» al hacer scroll
- Fuera el FLIP diagonal con escala hacia K1. Ahora el nombre XL **se funde en su sitio y sube 20 px** (`power1.inOut`) entre p 0,04 y 0,30. El **corte láser se cierra en p 0,20**, cuando el nombre aún se ve (opacidad ≈ 0,3).
- El nombre de K1 **entra con fundido y 12 px de subida** (`power2.out`) entre p 0,70 y 0,84, cuando la losa ya llegó (q = 1 en 0,72).
- RM, móvil y sin JS: estado final directo, como antes (no hay acto 1).
- Constantes en `src/lib/escena.ts` (`ESCENA.nombre`, `corteFin`, `k1Nombre`, `NOMBRE_SUBE`, `K1_NOMBRE_SUBE`).

## Pruebas
- vitest: 258/258 (nuevos: fundido del nombre, corte antes de la salida, entrada de K1).
- Playwright completo: **563/563** (base 556 + las de las otras sesiones + 1 nueva del nombre: sin escala ni desplazamiento en x, sube 16–24 px, corte cerrado en 0,2 con el nombre visible, K1 entra entre 0,7 y 0,84). La prueba del lockup comprueba el cierre en 0,2. La de K2 sobre el nombre (0,1…0,7) sigue en verde. `vidrio.spec` apunta ahora al canvas WebGL (`canvas[data-vidrio='gl']`), y P1-1 comprueba la nueva capa.
- lint, tsc y build en verde.

## Rendimiento (`perf.spec`, mediana de 3 corridas)
| | LCP | elemento | CLS |
|---|---|---|---|
| `/` móvil | **1.024 ms** (antes 1.004 ms, dentro del ruido) | `span.claim` | 0 |
| `/` escritorio | **400 ms** | `img.k1-poster` (losa-640.avif) | 0,0005 |

## Capturas (`next start`)
`home-1440-p0.png`, `home-1440-p040.png`, `about-1440.png`, `home-390.png`, `ancla-1440.webm` (ida y vuelta por el ancla a 1440).
