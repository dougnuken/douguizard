# Pulido E2 · tarjetas (Cómo trabajo ×2, Trayectoria, Más trabajo)

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Sin cambios en `src/components/chrome/` ni en `/experience`.

## Causa común de §1 y §2

`perfil.css` declaraba `.pasos`, `.pasos li`, `.pasos .nodo`… **sin ámbito**. Cuando la hoja de `/about` estaba
cargada (navegación cliente o chunk compartido), K14 del home heredaba la rejilla de 4 columnas, el
`padding-top` de 32 px y el láser de `/about`: de ahí los pasos apeñuscados y los números montados en los
títulos. Ahora todo lo de `/about` va con `.craft` delante y K14 define su propia rejilla de una columna.

## 1 · «Cómo trabajo» en `/about` → losa oscura

- **Decisión: losa oscura (`superficie="losa"`, con `--filo`)**, no clara con borde/sombra. Motivos: (a) era
  la única losa blanca a sangre sobre el negro de la página en ese tramo, el salto de contraste la hacía
  parecer un pegote; (b) el láser (`--laser-nucleo` + halo) solo brilla sobre oscuro; sobre blanco se veía
  como una línea roja plana; (c) «Lo que hago» y «Datos» ya son losas oscuras, así que la página lee como
  una sola familia (las citas siguen claras como acento).
- Ritmo: `padding 48/48/56`, título → nodos 40 px, nodo → número 24 px, 12 px entre número, título y texto;
  texto a 34 ch para que no llegue al borde de la columna.
- Alineación: `--nodo: 13px`; el eje del láser está en `top: nodo/2 − 0,5 px` (horizontal) y
  `left: nodo/2 − 0,5 px` (vertical, móvil): el centro de cada nodo cae en el eje. Nodos huecos con anillo
  de 4 px del color de la losa que «corta» la línea; el primero, lleno en láser (punto de partida).
  Números Doto alineados a la izquierda con el nodo.
- Capturas: `E2-about-como-1440.png`, `E2-about-como-390.png`.

## 2 · K14 «Cómo trabajo» (home) → lista vertical

- Una columna; cada fila: número Doto (20 px, 44 px de ancho, el 01 en láser) + título completo; filas de
  ≥ 44 px con filete `--losa-borde`. El título envuelve si hace falta (nunca se corta ni se monta).
  La flecha a `/about#craft` se mantiene.
- Prueba (`tablero.spec.ts`, 1440/1280/390): sin intersección entre cajas de número y título, sin
  título cortado (`scrollWidth` ni desborde de la fila), una sola columna.
- Capturas: `E2-k14-1440.png`, `E2-k14-390.png`.

## 3 · Trayectoria

- Antes: `ol::before` a 42 px fijos; la altura del año en Doto varía y los puntos quedaban 4,5 px (escritorio)
  y 3,1 px (móvil) por debajo del eje.
- Ahora el eje lo dibuja cada punto (`.nodo i::before`, `top: 4,5px` = (10 − 1)/2), recortado al ancho del
  `ol` con `clip-path: inset(-24px 0)` (no corta el halo de «hoy»). Color opaco
  (`color-mix(tinta 40 %, losa)`) para que los segmentos solapados no sumen alfa.
- Prueba: |centro del punto − eje| ≤ 0,5 px y todos los puntos a la misma altura, a 1440/1280/390.
- Captura: `E2-trayectoria-1440-zoom.png` (×2).

## 4 · «Más trabajo» (K16)

- Columna del nombre de `160px` → `13.5em` (≈ 216 px) con `white-space: nowrap`; la línea de apoyo cede.
  < 1024: `72px minmax(max-content, 1fr)` (el año Doto ya no invade el nombre).
- Prueba: cada nombre en 1 línea, sin `scrollWidth` mayor que la caja y sin pasar el borde de la losa, a
  1440/1280/390.
- Capturas: `E2-mas-trabajo-1440.png`, `E2-mas-trabajo-390.png`.

## Verificación

Lint ✓, `tsc` ✓, vitest 258/258 ✓, build ✓, Playwright completo **582 passed** (base 571 + 11 nuevas), `--trace off`.
