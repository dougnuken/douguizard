# Pulido I · QA visual de cierre (11 nov)

Alcance corto, a propósito: `/` y `/about` a 390 y 1440 (`capturas/I-home-*.png`, `capturas/I-about-*.png`), build de producción local. Sin errores de consola y sin desborde horizontal en las 4 vistas.

**Veredicto: 0 P0, 0 P1.** No hubo arreglos de código en el cierre.

## Qué se ve bien
- Héroe a 390 y 1440: vidrio con estrías, láser «Cíclope» alineado con las retinas, losa legible, punto verde de disponibilidad, CTA claros.
- `/about` a 390: nombre grande legible sobre el degradado, dock con «Perfil» activo, sin solapes con la cabecera.

## P2 (no bloquean)
1. **1440 `/`: el láser cruza el nombre «Vargas».** Se ve en el instante del barrido. Parece intencional (línea a la altura de los ojos), pero confirmar con Doug si el trazo debe quedar detrás del texto.
2. **`/about` móvil, LCP simulado 3,6 s** (Perf 87). Es el póster del héroe (mismo que `/`, que da 1,2 s); el desglose real suma ~160 ms. Mirar al medir en producción.
3. **Prueba `hoja.spec.ts:376` variante «X»** falla de forma estable en headless (5 cuadros en 400 ms, ninguno a medio camino); Esc y velo pasan. Ya figuraba como fallo de tiempo antes de G. La hoja se cierra bien. Reescribir la medición con reloj de transición en vez de cuadros.
4. Solo se revisaron 4 vistas; losas, `/work` y casos quedan cubiertos por Playwright (visual.spec, layout.spec), no a ojo.

## Cambios pedidos por Doug tras la QA (11 nov)

1. **«Hablemos» en escritorio: sombra que se salía del borde.** Causa: el reset de Tailwind (`canvas { max-width: 100% }`) encogía los lienzos del halo y del canto de metal-fx (más anchos que el botón, con `left` negativo): el halo quedaba aplastado y corrido 43 px a la izquierda, como un rectángulo. Arreglo: `.hablemos-metal canvas { max-width: none }` (`chrome.css`).
2. **Ojos «Cíclope»: prenden, se apagan y sale la línea.** El destello ya no late en bucle: una sola vez al cargar (150 ms → pico a ~0,5 s → apagado a ~1,65 s) y la línea láser entra a los 1,4 s, de izquierda a derecha, cortando el nombre (escritorio y móvil). Reposo = ojos apagados + línea fina; con reduced motion, directamente ese reposo. `destello.css`, `escena.css`.
3. **Barrido del vidrio por toda la foto.** La trayectoria pasa de la cara a toda la foto (0,2–0,8 en los dos ejes, misma vuelta de 30 s; tope de velocidad de la prueba 0,16 → 0,22 anchos/s). Además, mover el ratón fuera de la foto ya no pausa el barrido (antes cualquier movimiento por la página lo paraba 3 s y en escritorio casi nunca se veía). `barrido.ts`, `useLente.ts`.

Pruebas: vitest 279/279, tsc, lint; Playwright de escena, vidrio, cromo, i18n, héroe y motion en verde (67/67). `escena.spec`: el reposo ya no tiene el pulso del destello (0 animaciones vivas, ojos en 0) y el snap se mide con la entrada terminada (6/6). Lighthouse `/` móvil, 6 corridas: Perf 89–97 (mediana 95), TBT 187–446 ms (mediana ~235), LCP ~1,2 s, CLS 0.
