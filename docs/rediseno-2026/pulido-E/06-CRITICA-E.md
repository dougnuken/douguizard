# Crítica del pulido E (E1 cromo y pie · E2 tablero · E3 timeline móvil)

QA visual a 390 y 1440 sobre build de producción (`next start`), movimiento reducido salvo en /experience.
Capturas en `qa/` (8): `qa-pie-390`, `qa-pie-1440`, `qa-cabecera-1440`, `qa-dock-contacto-390`,
`qa-k11-390` (ya arreglada), `qa-k14-k16-390`, `qa-about-como-390`, `qa-experience-390`.

> Nota de medida: Chromium sin cabeza en Linux pinta barra de desplazamiento clásica y `html` tiene
> `scrollbar-gutter: stable`, así que «390» en Playwright son **375 px útiles** (lo mismo que un iPhone SE/mini).

## Nota: **8,3 / 10**

El pulido E sube el oficio: el pie en losa con wordmark, cierre y «Volver arriba» circular se lee como parte
del sistema B (no como el pie de F0); la burbuja ES/EN es un círculo limpio y concéntrico; «Contacto» desde
/about aterriza en `/#contact` con la píldora del dock ya en Contacto; K14 como lista numerada con el 01 en
láser tiene jerarquía clara; «Más trabajo» con nombres en una línea alinea la columna de años; «Cómo trabajo»
en /about (losa oscura, hilo láser por los nodos) y la timeline de /experience (círculo que se enciende con la
punta del hilo) se sienten precisos. Restan puntos un P0 de presupuesto que se coló entre sesiones y un año
cortado en la Trayectoria a 375.

## P0

1. **Home móvil por encima del presupuesto (5.085 px > 5.064).** `src/components/tablero/tablero.css:527-538`
   (K14 de E2: filas `min-height: 44px` + `padding: 8px 0`). Inyectando el CSS anterior de K14 el home vuelve a
   5.056: K14 pasó de 307 a 336 px (+29). «Más trabajo» y la Trayectoria no cambian de alto; los 5.034 que
   anotó E1 no incluían todo E2 (las sesiones corrieron en paralelo).
   → **Arreglado** (`a7775a5`).

## P1

1. **Trayectoria (K11) con el último año cortado a ≤ 375 px («202»).** `tablero.css:415` (`clip-path` del eje,
   E2) + `tablero.css:1078` (cuatro columnas `auto`): 4 años en Doto de 30 px + «Mercadolibre» piden 302 px y la
   losa da 295 a 375 (280 a 360). Antes de E2 el año se salía al relleno de la losa; con el recorte se mutila.
   → **Arreglado** (`f12450c`).

## P2 (solo se listan)

1. **Fila base del pie a 1440 con dos cuerpos**: © a 14 px y colofón a 12 px en la misma línea
   (`src/components/pages/paginas-b.css:232`); se ve como dos notas pegadas. Unificar a 12 o 14.
2. **`#contact` sin `scroll-margin-top`**: al llegar desde el dock, el rótulo «Contacto» queda a ~8 px bajo la
   cabecera fija (`src/components/tablero/Contacto.tsx:18`; los casos ya usan 128 px en `case/caso.css:307`).
3. **K14 en móvil**: tres de los cuatro títulos parten en dos líneas; la columna del número (44 + 16 de gap,
   `tablero.css:530-532`) es generosa para «01». Con 32 + 12 seguirían partiendo: el arreglo real es de copy
   (`src/data/perfil.ts:182-194`), decisión de Doug.
4. **K11 a 360–375 muestra tres hitos** (2010 · 2024 · hoy; Aval · BdO se oculta por consulta de contenedor).
   Si Doug quiere siempre cuatro, la única salida es bajar Doto por debajo del mínimo de 30 px del tablero
   (06-CRITICA-F1 P2-1) o años de dos cifras.
5. **/experience móvil**: la cifra fija del año marca «2018» mientras la tarjeta activa dice «Ago 2017 — Nov
   2018» (sigue el fin del periodo); puede leerse como desfase. Revisar si debe seguir el inicio
   (`src/components/trayectoria/TrayectoriaCliente.tsx`).
6. **Presupuesto del home con 15 px de margen** (5.049 / 5.064): cualquier línea más en móvil lo rompe; conviene
   decidir si el presupuesto se mide a 375 útiles (como hoy) o a 390 reales.

## Arreglos y verificación

- **P0 · alto del home** (`a7775a5`): en < 1024 px K14 mantiene la lista vertical (número Doto, filetes, títulos
  completos) con ritmo más corto: `padding: 6px 0`, interlínea 1,25, sin `min-height` (las filas no son blancos
  táctiles; el enlace es el título) y 16 px entre título y lista. K14 336 → 300 px. **Home a 390: 5.049 px**
  (ES; EN 5.006). Prueba existente `tablero.spec.ts:55` en verde, sin tocar el límite.
- **P1 · Trayectoria** (`f12450c`): `.k11` es contenedor de tamaño en línea; con < 302 px útiles la rejilla pasa
  a 3 columnas y el nodo `prescindible` (Aval · BdO, `src/data/home.ts`) se oculta; gap 8 px. La cifra sigue a
  30 px. Prueba nueva en `tablero.spec.ts` («ningún año ni rótulo cortado ni montado sobre el vecino») a
  1440/414/390/360; falló a 390 y 360 antes del arreglo.
- Verificación (tras los dos arreglos): lint ✔ · `tsc --noEmit` ✔ · vitest **258/258** ✔ · build ✔ ·
  Playwright completo (`--trace off`, sin `retries`): **594/594** ✔ en 26,8 min (590 anteriores + 4 nuevas de
  K11). Sin fallos, así que no hubo que repetir nada por intermitencia. Home a 390: **5.049 px** (≤ 5.064).
