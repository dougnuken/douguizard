# Lighthouse en producción tras el pulido E

Medido el 2026-11-09 sobre https://douguizard.com con Lighthouse 12 (CLI, Chromium headless del entorno, `--headless=new --no-sandbox`).
Móvil: predeterminado de Lighthouse (simulado, Slow 4G, CPU x4), 3 corridas, se reporta la mediana por Perf. Escritorio: `--preset=desktop`, 1 corrida.
JSON de la mediana en `pulido-F/lighthouse/` (`home`=`/`, `exp`=`/experience`).

| Página | Formato | Perf | A11y | BP | SEO | LCP (ms) | TBT (ms) | CLS | FCP (ms) | Perf de las 3 corridas |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | móvil | 86 | 100 | 100 | 100 | 2580 | 446 | 0 | 1160 | 81 / 86 / 86 |
| `/` | escritorio | 99 | 100 | 100 | 100 | 648 | 67 | 0,001 | 390 | |
| `/about` | móvil | 80 | 100 | 100 | 100 | 2678 | 680 | 0 | 1101 | 76 / 80 / 83 |
| `/about` | escritorio | 100 | 100 | 100 | 100 | 551 | 42 | 0 | 310 | |
| `/work` | móvil | 98 | 100 | 100 | 100 | 2355 | 36 | 0 | 1080 | 98 / 98 / 98 |
| `/work` | escritorio | 100 | 100 | 100 | 100 | 521 | 0 | 0 | 310 | |
| `/experience` | móvil | 98 | 100 | 100 | 100 | 2280 | 39 | 0 | 1080 | 98 / 98 / 98 |
| `/experience` | escritorio | 100 | 100 | 100 | 100 | 506 | 0 | 0 | 310 | |
| `/en` | móvil | 73 | 100 | 100 | 100 | 2655 | 1144 | 0 | 1158 | 72 / 73 / 83 |
| `/en` | escritorio | 98 | 100 | 100 | 100 | 673 | 115 | 0,001 | 390 | |

## Comparación con F8

- F8 (local, sin GPU): A11y, BP y SEO 100; Perf móvil simulado 65–86; escritorio `/` 98. En producción se mantiene 100/100/100 en todas las páginas y la Perf móvil queda en 73–98 (`/` 86, igual al techo de F8; `/work` y `/experience` 98).
- LCP: F8 midió `/` móvil en 1.040 ms y `/about` en 1.920 ms con el throttling de Playwright (Slow 4G, CPU x4, medición real). Los LCP de esta tabla (2,3–2,7 s) son el LCP **simulado** de Lantern, que no es comparable con el de F8 (F8 ya documentaba 3,3–4,0 s simulados en local). Comparado en simulado, producción es mejor: 2,58 s en `/` frente a 3,3–4,0 s.
- LCP escritorio `/`: 648 ms (F8 local: 807 ms con Lighthouse, 348 ms con Playwright). CLS 0 en móvil, igual que F8.
- Las páginas con Perf < 90 son `/`, `/about` y `/en`, todas por TBT (446 / 680 / 1.144 ms), el mismo desvío 1 de F8. `/en` es la peor y tiene la mayor variación entre corridas (72–83).

## Oportunidades principales de Perf móvil

1. **Reducir TBT (hilo principal):** el chunk `_next/static/immutable/chunks/2rls3gpdhdjo7.js` consume 298 ms de scripting en `/en` (257 ms en `/about`); es el trabajo del héroe (Three.js/shaders). Trabajo total del hilo principal: 3,5 s en `/en`, 2,7 s en `/about`. Es la causa de que Perf baje de 90.
2. **JavaScript sin usar:** ahorro estimado 150 ms y ~100 KiB en `/` y `/en` (29 KiB en `/about`). Diferir/dividir el código del héroe 3D que no se ejecuta en la carga inicial.
3. **Imágenes con tamaño mayor al necesario:** ~52 KiB en `/` y `/en` (ahorro de tiempo 0 ms; reducir bytes en móvil).
4. **JavaScript heredado (legacy):** ~14 KiB en `/`, `/en` y `/about` (150 ms estimados en `/about`). Ajustar `browserslist`/target para no transpilar polyfills.
5. **LCP:** en `/about` el elemento LCP es el póster `movil-880.avif`; en `/en` es el texto del claim (`span.claim`), retrasado por el bloqueo del hilo principal más que por la red (FCP 1,1 s, LCP 2,6 s).

Sin cambios de código en esta tarea.
