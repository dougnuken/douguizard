# Pulido G2 · vidrio con canto, ES/EN de dos círculos y «Hablemos»

Rama `pulido-g/g2-vidrio` (desde `claude/douguizard-portfolio-redesign-9ivnau`, 82fbe50). Capturas antes/después
a 390 y 1440 en `pulido-G/g2/` (+ un detalle de la cabecera con el cursor sobre «Hablemos»).

## 1. Qué pidió Doug y qué se hizo

| Pedido | Resultado |
|---|---|
| ES/EN: «en teoría son dos círculos pegados» | Cápsula de 72 × 40 = 4 + 32 + 32 + 4: dos círculos de 32 px **contiguos** (costura en el centro, sin hueco), inset de 4 px en los cuatro lados (radio 20 = 16 + 4). El inactivo se insinúa como un hueco de vidrio (filo de 1 px), el activo es la burbuja blanca con volumen. Cada opción mide 44 × 44: la de ES sobresale 8 px por la izquierda y la de EN por la derecha (márgenes negativos). El foco rodea el círculo, no la caja táctil. La burbuja viaja como una gota: se estira hasta el otro círculo (cápsula de 64 px), se recoge con un rebote de 1 px; 200 ms, se navega a los 170. |
| Vidrio más pro (cromo, dock, pastillas, losas de vidrio) | Canto de vidrio en CSS en las 8 superficies de vidrio (cabecera: wordmark, pills, ES/EN, menú; dock; `losa--vidrio`; panel de K1; K2 móvil; filtro de /work solo con el grosor). Tres capas: **grosor** (`--filo-vidrio`: cara superior que recoge la luz, sombra interior abajo, banda de refracción de 10 px arriba y su rebote abajo, contorno exterior de 0,5 px que separa el vidrio de fondos claros), **bisel de 1 px** (`--vidrio-canto`, brillante arriba, apagado en los costados, rebote abajo) y **especular** (`--vidrio-especular`: punto de luz arriba a la izquierda y su reflejo abajo a la derecha). El bisel y el especular viven en un `::after` con máscara de borde (`mask-composite: exclude`, con prefijo `-webkit-` para Safari). |
| Selección que viaja (dock, pills, filtro) | Viaje líquido: la técnica «move» de liquid-gooey sin el paquete. Cada borde de la cápsula lleva su muelle (el delantero rápido y subamortiguado, rebote ≤ 4 px; el trasero críticamente amortiguado): la cápsula se estira hacia donde va y se recoge al llegar. Los muelles se muestrean a 19 fotogramas WAAPI lineales (lo mismo que hace liquid-gooey al compilar a `linear()`): sigue siendo solo `transform`, en el compositor, 340 ms, interrumpible. `src/lib/pildora.ts` (`cajasLiquidas`). |
| «Hablemos» «muy crudo» | Vidrio eléctrico: relleno con volumen (más claro arriba, más hondo abajo), canto de 1 px, reflejo especular en el tercio superior que sigue al cursor en x, sombra del color del material y un **LED de luz láser** (núcleo claro, aro rojo, halo) que dice «disponible», como el `.estado` del sistema. Física: imán de ≤ 3 px hacia el cursor, prensado a 0,95 y vuelta con muelle (`--muelle`, `linear()` ζ 0,5, con `cubic-bezier` de respaldo). Hover: brillo, sombra más larga, el halo del LED crece. Foco: anillo de 2 px a 3 px. Encima, el **anillo de metal líquido de `metal-fx`** (abajo). Con `prefers-reduced-motion`: sin imán, sin muelles, sin metal. |

## 2. Librerías evaluadas (catálogo de crafthings + otras)

Medido sobre los paquetes publicados (`npm pack`, gzip -9 del ESM):

| Opción | Técnica | Peso | Safari / Firefox | Rendimiento | Decisión |
|---|---|---|---|---|---|
| **metal-fx 2.0.11** | WebGL2, `liquidMetal` de Paper Shaders; anillo sobre el botón real | 41,8 KB gz el paquete; **36,5 KB gz** el chunk en el build. Sin dependencias (solo `react`) | WebGL2 en ambos; sin WebGL2 pinta el hijo tal cual | Un contexto y un rAF compartidos; con `paused` el rAF **se detiene** (medido: 0 rAF/s en reposo) | **Sí, para «Hablemos»**, una instancia, diferido (ver §3) |
| liquid-gooey 0.2.2 | Silueta SVG con filtro goo + springs a `linear()`; DOM nítido encima | 25,9 KB gz | Sí (filtros sobre SVG, no `url()` sobre HTML) | Coste cero en reposo | **Técnica sí, paquete no.** Nuestra píldora ya es una cápsula de tres piezas en el compositor, persistente entre rutas y con 6 pruebas de viaje; envolver dock/pills en `<Liquid>` obligaba a rehacerla y a meter 26 KB en el JS **inicial** (el dock está en la primera pintura del móvil). Se copió lo que da el «liquid»: muelles por borde compilados a fotogramas (estiramiento + rebote), en ~60 líneas y 0 KB de dependencia |
| Tactile Glass UI 0.1.1 | WebGL2 por componente (Snell, bisel SDF, dispersión) | 543 KB desempaquetado | Sin verificar | Shader activo por pieza | No en cromo persistente (como dice el catálogo). Solo referencia óptica: de ahí el bisel brillante arriba + rebote abajo |
| liquid-glass-react / `@specy/liquid-glass` | `backdrop-filter: url(#svg)` con `feDisplacementMap` / captura del DOM a WebGL | — | El filtro SVG de backdrop **no funciona** en Safari ni Firefox | Recalcula el desplazamiento del fondo en cada cuadro de scroll bajo cromo fijo | No |
| `feDisplacementMap` propio (mejora progresiva en Chromium) | Igual que arriba, sin paquete | 0 | Solo Chromium | El cromo es `position: fixed` sobre contenido que hace scroll: el filtro se recalcula en cada cuadro (y el mapa depende del tamaño de cada pieza) | **Descartado** por la regla de «nada de jank / sin filtros caros en scroll». La lectura de refracción la da la banda de 10 px del `--filo-vidrio` en los tres navegadores |
| **CSS propio** (catálogo §Recomendación G2.1) | `backdrop-filter` + bisel con máscara + especular + radios concéntricos | ~1 KB de CSS | Igual en los tres (máscara con prefijo) | Capa estática pintada una vez; nada animado | **Sí, para todo el vidrio** |

## 3. Impacto en JS y rendimiento

- **JS inicial**: `/about` 197,7 → 198,9 KB gz (+1,2 KB: el componente `Hablemos` y los muelles de la píldora). `metal-fx` va en su propio chunk (36,5 KB gz) que **no** está en el JS inicial de ninguna ruta.
- **Cuándo se carga metal-fx**: solo en escritorio (`min-width: 1024px`, `hover: hover`, `pointer: fine`), sin `prefers-reduced-motion`, y solo cuando el cursor se acerca a la esquina de la cabecera (y < 140 px, x en los últimos 640 px). Quien no se acerca no lo descarga. En móvil el botón no existe (< 1024) y nunca se carga.
- **Coste en reposo**: el shader solo corre con el cursor encima o con el foco; fuera, `paused` congela el último cuadro y el rAF se detiene (medido con un contador de `requestAnimationFrame`: 0/s en reposo y tras salir). Sin WebGL2 (`isMetalFxSupported()` falso) queda el botón de CSS, que ya está completo.
- metal-fx esconde su envoltura hasta su primer cuadro; se fuerza visible para que el botón no parpadee al montar. El enlace se vuelve a montar dentro del metal: si tenía el foco, lo recupera.
- Vidrio: sin `backdrop-filter` nuevo, sin filtros SVG, nada animado en scroll. El `::after` del canto es estático. La gota de ES/EN anima el ancho de un pseudo de 32 px durante 200 ms una sola vez (antes de navegar).
- `prefers-reduced-transparency`: el vidrio ya pasa a sólido (tokens de F8); el canto se mantiene.

## 4. Verificación

- `eslint .` ✓ · `tsc --noEmit` ✓ · `vitest` 259/259 ✓ (+1: `cajasLiquidas`: arranque y final exactos, el borde delantero va delante, nunca más estrecha que un círculo, rebote ≤ 4 px) · `next build` ✓.
- Playwright (Chromium, `next start -p 3202`, config temporal con `trace: off`): `cromo-contraste`, `dock-pulido`,
  `controles`, `i18n`, `f3-arreglos`, `a11y`, `contrast-detail`, `pildora-contraste`, `keyboard` → **141/141** ✓ (contraste
  en AA). Tras el último ajuste (envoltura de metal-fx siempre visible): `f3-arreglos`, `controles`, `cromo-contraste`,
  `i18n`, `dock-pulido`, `vidrio` (c, RM sin canvas) → 52/53; el que falló (`controles` «ES/EN: la burbuja va al otro
  idioma») pasa 3/3 al repetirlo solo y pasó en la corrida de 141: intermitente por la carga de la máquina.
- Pruebas nuevas/actualizadas: `f3-arreglos` «pulido G2 · ES/EN dos círculos contiguos» (@1440 y @390: círculos de 32, sin hueco ≤ 0,5 px, cajas ≥ 44 × 44, cápsula de 72); `cromo-contraste` mide la etiqueta de ES/EN sobre su círculo (la caja táctil de 44 px ahora sobresale de la cápsula y metía en la muestra píxeles de la losa clara de fuera). EN sobre la losa clara: 194/194/202 sobre ≈ 70/71/73 → 5,3:1 (AA).
- `vidrio.spec` (a) y (d) (la lente de K1 debe cerrar a «0.00» en 3 s) fallan con «0.01–0.02» **igual en la base 82fbe50** (construida y servida aparte en el mismo puerto): es la carga de la máquina (load ≈ 7–11 con otros agentes y WebGL por software), no este cambio; metal-fx ni se carga en esas pruebas.

## 5. Para Doug

- Probar en Safari y Firefox: el canto (máscara con `-webkit-mask-composite: xor`) y el metal de «Hablemos» (WebGL2).
- Dependencia nueva: `metal-fx@2.0.11` (MIT, peer `react >= 18`, compatible con React 19 / Next 16; sin dependencias propias). Si no la quieres, borrar el bloque de `useMetal` en `Hablemos.tsx` deja el botón de CSS completo.
