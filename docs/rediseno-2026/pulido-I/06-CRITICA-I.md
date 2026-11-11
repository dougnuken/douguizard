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
