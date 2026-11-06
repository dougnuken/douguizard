# 06 · Crítica de F3 (tablero OS + cromo nuevo)

> Crítico / QA visual · 6 nov 2026 · objeto: el código de F3 en la rama `claude/douguizard-portfolio-redesign-9ivnau`
> (`F3-INFORME.md`, desvíos 1–10) y sus capturas `F3-capturas/`, frente al landing de referencia
> `referencias/ref-8-landing-elegido-B-os.jpg` y `propuestas/B/shot_B_390_pliegue.jpg`. Método: refactoring-ui
> (jerarquía, alineación, espaciado, profundidad) y web-design-guidelines (foco, RM, contraste, `color-scheme`, móvil),
> con el criterio de aceptación y la línea **QA.** de `07` §F3. Se compararon a pares los pliegues del home a 1440×900,
> 1280×720 y 390×844 y los de `/work` a 1440 y 390. Para ver el cromo en las otras páginas B se levantó el sitio
> (`next build` + `next start`, Chromium, RM) y se capturaron `/about` 1440 y 390 y `/experience` 1440, midiendo en el
> DOM las cajas de la cabecera, `aria-current` y `color-scheme` (capturas fuera del repo, en el scratchpad de la sesión).
>
> **Fuera de alcance (esperado, no cuenta):** el vidrio es CSS hasta F4 (las franjas no refractan la foto como en la
> referencia); el LCP móvil de `/` en 2,97 s (desvío 1, ya asignado a F4/F8); la escena y el acto 1 (F5); el texto del
> chip NDA y el título de K13 están en manos de Doug (desvíos 3 y 8).

---

## 1. Veredicto por vista

| Vista | Nota | Veredicto |
|---|---|---|
| Home 1440×900 | **8,7** | Casi calcado de ref-8: misma rejilla de tres columnas, K2 en losa clara con el claim en dos líneas, K1 con el panel de vidrio «Doug Vargas» y su botón, Andes en jelly azul con halo, Naowee con captura que sangra, BAQ con reloj en Doto, rail gris con el correo destacado. Radios, sombras y jerarquía coinciden. Falta la pill activa y la cabecera no está alineada (P1-1). |
| Home 1280×720 | **7,7** | La columna de Andes se queda en 268 px: la fecha se parte en «2024–/2026», el título ocupa tres líneas y el chip NDA dos, mientras K2, al lado, deja ≈ 120 px vacíos sobre los CTA. Es el ancho de portátil más común y lo primero que se ve. |
| Home 390×844 | **8,4** | Foto a sangre, láser sobre los ojos, K2 de vidrio con nombre, disponibilidad, claim, nivel, sub y los dos CTA dentro del pliegue: la prueba de 5 s pasa. Diferencia con `shot_B_390`: franjas verticales (la maqueta y `/about` las llevan oblicuas) y un botón de menú que la maqueta no tiene. |
| Cromo en `/work`, `/about`, `/experience` | **8,4** | Coherente: la misma pastilla con pill activa blanca (`aria-current="page"` medido en las tres), rail idéntico, dock de 5 con el activo en blanco. `/about` estrena `VidrioCss` a 12° y se ve bien. Heredan el desalineado de la cabecera y el `color-scheme: light`. |
| **Conjunto** | **8,3** | F3 entrega el OS de B con mucha fidelidad. Con los tres P1 resueltos sube a ≈ 8,6 (objetivo de 07: ≥ 8,5). |

Conteo: **0 P0 · 3 P1 · 7 P2**.

**Lo que se comprobó y está bien:** Doto solo en cifras (400+, 18, 2.000+, 130+, BAQ/hora, 12/10/3, 2026); un solo
nombre visible por pantalla en escritorio (en K1) y disponibilidad una vez en el pliegue; foco visible con `outline`
de 2 px en pills, idioma, menú, «Hablemos» y rail (`chrome.css:107-111`, `:262`); bloques de RM en `chrome.css:379`
y `tablero.css:1056`; toques ≥ 44 px en el idioma (44×44 con `background-clip`) y en el dock; contraste del claim y de
los textos de losa sin problemas a ojo (las pruebas `a11y 3.1` ya miden ≥ 7:1).

---

## 2. Arreglos priorizados

**P0** bloquea. **P1** importante. **P2** pulido. Evidencia → zona y línea → valor → por qué.

### P0 · bloquea

Ninguno.

### P1 · importantes

**P1-1 · La cabecera no está alineada: cuatro alturas y tres ejes distintos en una sola fila.**
- **Evidencia.** Cajas medidas en el DOM a 1440 (iguales en `/`, `/about`, `/experience`): wordmark `y 20 · 44 px`
  (centro 42), pastilla de pills `y 24 · 40 px` (centro 44), idioma `y 18 · 44 px` (centro 40), «Hablemos»
  `y 16 · 48 px` (centro 40). En `home-1440x900-pliegue.jpg` se ve: «Hablemos» y el ES/EN suben respecto a las pills.
  En ref-8 las cuatro piezas miden 40 px y comparten `y 24`.
- **Zona.** `src/components/chrome/chrome.css:13-24` (`.cab-b` con `align-items: flex-end`), `:28-31`, `:80-91`
  (idioma 44), `:114-116` (`.hablemos` 44, que otra regla lleva a 48).
- **Arreglo.** `.cab-b { align-items: center; }` con una franja de 40 px de alto visual para las cuatro piezas
  (`--pill-alto`); el destino táctil de 44 px se consigue con un `::before` absoluto `inset: -2px` (o `padding` +
  `background-clip: content-box`, como ya hace el idioma), nunca con la caja visible. «Hablemos» a 40 px visibles.
- **Por qué.** Es la primera línea que se lee en todas las páginas B; un desfase de 2–4 px entre pastillas vecinas se
  percibe como descuido (refactoring-ui: alinear por un eje común) y rompe la fidelidad al cromo de ref-8.

**P1-2 · Las superficies B se pintan con `color-scheme: light` cuando el sistema no pide oscuro.**
- **Evidencia.** En el sitio levantado (Chromium sin preferencia), `/`, `/about` y `/experience` dan
  `data-theme="light"` y `getComputedStyle(html).colorScheme = "light"`. En `home-1440x900-pliegue.jpg` y
  `work-1440x900-pliegue.jpg` se ve la barra de desplazamiento clara (x 1425–1440) junto al OS negro.
- **Zona.** `src/app/globals.css:66` y `:83` (`color-scheme` depende de `data-theme`); las superficies B ignoran el tema
  (07 §F7) pero el navegador no lo sabe.
- **Arreglo.** Forzar `color-scheme: dark` en las rutas B: clase en `<html>` desde el layout de las rutas B (o
  `:root:has(.tablero-home, [data-superficie="b"]) { color-scheme: dark; }`) y `<meta name="color-scheme"
  content="dark">` en esas rutas; `/cv` sigue con su tema. Adelantar aquí el `themeColor` `#060608` de D4 si es trivial.
- **Por qué.** En Windows y Linux la barra blanca es una franja de 15 px de luz al lado del tablero oscuro, y los
  controles nativos (scrollbar del carrusel, autocompletar, `select`) salen claros: web-design-guidelines pide que el
  `color-scheme` coincida con el fondo.

**P1-3 · A 1280×720 la columna de Andes se aprieta y el texto se rompe; K2 sobra.**
- **Evidencia.** `home-1280x720-pliegue.jpg`: K2 mide ≈ 460 px de ancho, K1 ≈ 365 y K3 (Andes) ≈ 268. En K3, la fecha
  se parte «Mercadolibre · 2024– / 2026», el título va en tres líneas («Andes / Design / System») y el chip NDA en dos.
  En K2, entre el sub y los CTA quedan ≈ 120 px vacíos. En Naowee, «Ahora · Head of / Product» también se parte.
- **Zona.** `src/components/tablero/tablero.css`, rejilla ≥ 1280 (`grid-template-columns` de `.tablero`), y el
  eyebrow de `CardCaso`.
- **Arreglo.** (a) Entre 1280 y 1439, columnas `1.35fr 1.1fr 1fr` (o `minmax(300px, 1fr)` para K3) en vez de la
  proporción de 1440; (b) `white-space: nowrap` en el rango de años (`2024–2026`) y en el eyebrow «Ahora · Head of
  Product»; (c) si aún no cabe, aplicar ya a 1280–1365 lo de P0-1 (título de Andes a 20 px, chip NDA oculto en el home).
  Verificar con `layout 5.4` a 1280×720 y 1366×768.
- **Por qué.** 1280–1366 es el ancho más común en portátiles de reclutadores; una fecha partida por el guion y un
  chip en dos líneas en la card más importante (Andes) son lo que más «amateur» se ve del pliegue, justo al lado de una
  losa con aire de sobra (refactoring-ui: repartir el espacio según el contenido, no a partes iguales).

### P2 · pulido

**P2-1 · Sin pill activa al cargar el home.** `home-1440x900-pliegue.jpg` vs ref-8 («Trabajo» en blanco). Es el
desvío 6. Con K3 y Naowee en el pliegue, activar «Trabajo» cuando `scrollY < alto del héroe` (o cuando cualquier card
de `#work` interseca el viewport) devuelve el gesto más reconocible de la pastilla. `SiteHeader.tsx` + scroll-spy.

**P2-2 · El láser no cruza el tablero.** En ref-8 el haz es una línea de 1 px que atraviesa toda la página por los
huecos entre losas (y ≈ 326, de x 0 a 1440); en el código vive solo dentro de K1 (`tablero.css:254-266`). En `/about`
sí sale de la foto. Una `.os-laser` absoluta a la altura de `.k1-laser`, detrás de las losas (`z-index` bajo), lo
devuelve; F5 la puede animar.

**P2-3 · Vidrio del home móvil en vertical.** `home-390x844-pliegue.jpg` tiene franjas verticales; `shot_B_390_pliegue`
y `/about` (390 y 1440) las llevan oblicuas (12°). En escritorio el vertical es fiel a ref-8. Usar el ángulo de `/about`
en `VidrioCss` del home a < 1024, para que el respaldo de F4 (RM, sin WebGL) ya sea el bueno.

**P2-4 · Menú y dock a la vez en móvil.** En `/work`, `/about` a 390 hay botón de menú en la cabecera **y** dock con los
mismos destinos. La maqueta B no tiene menú. Si `keyboard 6.6` lo permite (07 lo prevé), ocultar el botón donde el dock
está visible y dejarlo solo en `/cv` y en el héroe del home (donde el dock está escondido).

**P2-5 · El dock tapa contenido del primer pliegue de `/about` 390.** La línea «Barranquilla, Colombia · UTC-5» queda
detrás del dock (y ≈ 783). Reservar `padding-block-end: calc(dock + 16px + env(safe-area-inset-bottom))` en el
`main` de las páginas B o subir la portada para que el pliegue termine encima del dock.

**P2-6 · Doto por debajo de 30 px en «En cifras» de `/work` 390.** `work-390x844-pliegue.jpg`: 12 · 10 · 3 a ≈ 24 px,
donde los puntos se empastan. F1 P2-1 se aplicó solo en el tablero (`.tablero-home .dot--s`); llevarlo a
`CardCifras` en todas las superficies.

**P2-7 · Tinte del fondo.** Las capturas tienen un resplandor violeta arriba al centro; ref-8 es un negro neutro con
retícula de puntos tenue. No molesta, pero compite con el azul de Andes y el rojo del láser (el sistema dice un solo
acento por zona). Bajarlo a ≤ 50 % o neutralizarlo hacia `--fondo`, y probar la retícula de puntos a 4 % sobre el
fondo del OS.

---

## 3. Lo que está muy bien y no se toca

- La rejilla del OS a 1440 y su orden DOM = visual = Tab (K2, K1, K3…), probado por `keyboard 6.2`.
- K2 como losa clara contra un tablero oscuro: el contraste de superficies hace el trabajo de jerarquía sin agrandar
  la tipografía.
- Reutilización real de `CardCaso`, `CardCifras` y `CardArchivo` de F2: `/work` y el home se ven del mismo sistema.
- Dock móvil: cinco destinos con iconos y etiquetas, activo en blanco, escondido en el héroe del home.
- `VidrioCss` en `/about`: las franjas a 12° con la cara nítida resuelven el P1-1 de F2 (costuras del póster).
- JS inicial 6,1 KB gz por debajo de la base y LCP de escritorio en 448 ms.

---

## 4. Arreglar antes de F4 (P0 + P1, en orden)

1. **P1-1** · Cabecera alineada: `.cab-b` centrada y las cuatro piezas a 40 px visibles; 44 px táctiles por `::before`
   o `content-box`. Verificar cajas en el DOM (mismo `y` y alto) en `/`, `/about`, `/cv`.
2. **P1-2** · `color-scheme: dark` (y `meta color-scheme`) en las rutas B; `/cv` conserva su tema. Prueba: en Chromium
   sin preferencia, `colorScheme === "dark"` en `/`, `/work`, `/about`, `/experience`.
3. **P1-3** · Rejilla 1280–1439: K3 ≥ 300 px, años y eyebrow sin partir; capturas nuevas a 1280×720 y 1366×768 y
   `layout 5.4` verde.

Con eso, F3 queda en ≈ 8,6 y puede cerrarse. Los P2 pueden ir con F4 (P2-3) y F5 (P2-1, P2-2) o en una ronda de pulido.
