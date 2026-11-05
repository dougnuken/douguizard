# 06 · Crítica de la Propuesta B «Cine → Sistema operativo»

> Crítico de UI · 5 nov 2026 · objeto: `propuestas/B/index.html` (1.513 líneas), `NOTAS.md`, `shot_B_*.jpg`.
> Método: refactoring-ui (escalas, jerarquía, reglas duras), web-design-guidelines (copia local), emil-design-eng y
> motion-design (duraciones, curvas, coreografía). Se midió en Chromium (Playwright) sirviendo la raíz del repo, con
> GSAP 3.12.5 local (cdnjs está bloqueado aquí), WebGL por SwiftShader, DPR 1. Tamaños: 1920×1080, 1440×900,
> 1366×768, 1280×720, 1024×768 y 390×844 (táctil). El contraste se midió sobre píxeles reales: se oculta el texto, se
> captura su caja y se calcula el ratio contra cada píxel de fondo. Se reporta el **p5**, el 5 % más desfavorable.
> Los números de línea son de `index.html` tal como está hoy.
>
> Capturas propias en `propuestas/B/`: `crit_B_1440_ancla_60.jpg`, `crit_B_1440_ancla_41_k2.jpg`,
> `crit_B_resize_os.jpg`, `crit_B_1280x720_pliegue.jpg`, `crit_B_1280x720_os.jpg`, `crit_B_1024x768_pliegue.jpg`,
> `crit_B_1024_os.jpg`, `crit_B_detalles.jpg`.

---

## 1. Puntaje

| Eje | Nota | Justificación (una línea) |
|---|---|---|
| Jerarquía | **7,0** | El acto 1 pasa el test de 5 s a 1440 y a 390, y el OS tiene dos polos claros (cara + losa blanca). Pero el nombre sale 2 veces por pantalla, la disponibilidad 3 veces y K5 tiene 130 px vacíos. |
| Tipografía | **7,5** | Todos los tamaños están en la escala (12…120) y el trío Urbanist / Instrument Sans / Doto está bien usado. Fallan tres cosas: los años de K11 en Doto a 12 px, el `dot-xl` a 72 px en móvil y `.t-losa` sin `balance`. |
| Spacing / rejilla | **6,0** | Los tokens se cumplen (solo 88/112 estructurales fuera de escala) y los radios son concéntricos. Pero las filas dependen del alto del viewport y la rejilla se rompe a ≤ 768 px de alto: las CTA quedan cortadas. |
| Color y contraste | **7,0** | La paleta es fiel a 01 y casi todo pasa AA medido. Fallan las pills sobre la foto (4,09), la ceja de K13 (2,86) y el cruce de material de K2 (1,0:1). Además, el verde es un cuarto acento que no está en 01. |
| Profundidad / materiales | **8,5** | El vidrio WebGL con lente y muelle, la losa jelly, el vidrio oscuro y los filos de 1 px están al nivel de la referencia. Las sombras tienen el color de su losa. |
| Motion | **6,5** | La entrada (≤ 1,1 s), la lente y la hoja están muy bien. El scrub no: hay blur congelable, el texto desaparece al 41 %, el snap salta 860 px 1,8 s después y un resize rompe la escena. |
| Móvil | **7,0** | Pliegue excelente y dock correcto. Pero mide 6,64 pantallas (meta ≤ 6), el teléfono tapa el `647`, hay 9 toques < 44 px y el reloj con ES/EN está duplicado. |
| Accesibilidad | **6,0** | `<dialog>` nativo, orden del DOM, movimiento reducido y respaldo sin GSAP están bien. Pero hay 6 paradas de Tab invisibles (rail), foco sobre una losa a opacidad 0, toques chicos y tres fallos de contraste. |
| Fidelidad a RonDesignLab | **8,5** | Losas negras y blancas, jelly azul y magenta, pill blanca activa, rail con acción eléctrica y «Bank Account» que aterriza en la losa: es el lenguaje de ref-1/2/3. |
| Impacto / personalidad | **9,0** | Es la más memorable: el láser como hilo del sitio y el retrato que se vuelve losa son una idea propia, no una plantilla. |
| **Total** | **7,3 / 10** | Concepto y oficio de 9. Robustez de 6: se rompe fuera de 1440×900 y en el scroll anclado. Con los P0 y P1 resueltos sube a ≈ 8,6. |

---

## 2. Arreglos priorizados

**P0** bloquea (no se presenta así). **P1** importante. **P2** pulido. Cada arreglo trae: evidencia medida → zona y
línea → valor exacto → por qué.

### P0 · bloquean

**P0-1 · La rejilla de escritorio se rompe en portátiles y en tableta: las CTA del pliegue quedan cortadas.**
- **Evidencia.** `--fila` = (100svh − 184) / 6 con un mínimo de 96. Contenido que no cabe en su losa (`scrollHeight − clientHeight`):
  - 1366×768: K2 +20 y K17 +68 (la última línea queda cortada 36 px).
  - 1280×720: K2 +45 («Ver casos» y «Descargar CV» cortados 13 px, también en el acto 1) y K17 +72.
  - 1024×768: K2 +160 (las CTA no se ven, ver `crit_B_1024x768_pliegue.jpg`), K4 +49 / +53 a la derecha (el chip NDA mide 14 px de alto), K6 +68 a la derecha (el ES/EN se sale), K9 +108, K16 +117 y K17 +187 (ver `crit_B_1024_os.jpg`).
  - A 1280×720, el nombre XL arranca en y = 58 y choca con la cabecera, que termina en y = 64 (`crit_B_1280x720_pliegue.jpg`).
- **Zona y valor.**
  1. L239 `.os { grid-auto-rows: var(--fila) }` → `grid-auto-rows: minmax(var(--fila), auto)`. L247 `.os-top … grid-template-rows: repeat(6, var(--fila))` → `repeat(6, minmax(var(--fila), auto))`. Nada se recorta; a 1440×900 no cambia nada (medido: ahí todo cabe).
  2. Nuevo bloque `@media (min-width: 1024px) and (max-width: 1279px)`:
     - `.os-top { grid-template-areas: "k2 k2 k2 k2 k2 k2 k2 k1 k1 k1 k1 k1" ×3, luego "k3 k3 k3 k3 k4 k4 k4 k1 k1 k1 k1 k1" ×2 y "k3 k3 k3 k3 k4 k4 k4 k5 k5 k5 k5 k5" }`, con K5 ya fusionada con K6 (P1-5).
     - `.tarjeta { padding: var(--e-24) }`, `.k2 .claim { font-size: var(--t-30) }`, `.k4 .dot-l { font-size: var(--t-36) }`.
     - `.k3 { grid-template-columns: 1fr } .k3 .media { display: none }`. A 285 px de ancho la captura mide 120 px y no se lee.
  3. L1171 `G.nx = { x0: 24, y0: lineA - nh - 16 }` → `y0: Math.max(88, lineA - nh - 16)`. Además, `@media (max-height: 800px) { .nombre-xl { font-size: var(--t-96) } }` (L228).
- **Por qué.** 1366×768 y 1280×720 son los portátiles más comunes entre reclutadores. Una CTA cortada en el pliegue invalida el argumento con el que B resolvió su riesgo principal (NOTAS §4, «test de 5 s»). Regla 4 de refactoring-ui: un alto no puede depender de la pantalla si el contenido no cabe.

**P0-2 · Al cambiar el tamaño de la ventana en el OS, la foto vuelve a pantalla completa detrás del tablero y no se arregla sola.**
- **Evidencia.** En el OS (scrollY 901) se pasa de 1440×900 a 1280×800: `S.p = 0` aunque `st.progress = 1`. La foto se pinta a `[0,0,1440,800]` detrás de las losas (`crit_B_resize_os.jpg`). Una rueda de 10 px no la corrige, porque `onUpdate` no vuelve a dispararse con el progreso fijo en 1.
- **Zona y valor.** L1367–1370, en el `scrollTrigger` del timeline: añadir `onRefresh: (self) => { S.p = self.animation.progress(); esc.classList.toggle("oculta", S.p < 0.98); kick(); }`. En el `ResizeObserver` de la penúltima línea del script: `new ResizeObserver(() => { if (!cine) layout(); else ScrollTrigger.refresh(); })`.
- **Por qué.** Girar un iPad o pasar a pantalla dividida es habitual, y un director de diseño redimensiona la ventana para probar. Es un error visible y permanente en la pieza estrella.

**P0-3 · El rail es invisible en el acto 1 pero recibe el foco: 6 paradas de Tab sin nada en pantalla.**
- **Evidencia.** Tab 10–15 desde la carga: los 6 enlaces del rail tienen opacidad 0 y x = −80 (fuera de pantalla), con `scrollY 0`. Falla WCAG 2.4.7 y 2.4.11.
- **Zona y valor.** L655 `<nav class="rail">` y en `onUpdate` (L1370): `document.querySelector(".rail").inert = S.p < 0.5;`. En el arranque (`montarCine`), `rail.inert = true`. En movimiento reducido y sin GSAP, `inert = false`.
- **Por qué.** El foco tiene que verse siempre. Es la primera prueba de teclado que hará un director de diseño.

### P1 · importantes

**P1-1 · Al 60 % del ancla, las losas se ven borrosas y a media opacidad. Se lee como error de carga, no como intención** (observación 5 del orquestador).
- **Evidencia.** p = 0,6: K3 y K6 están a opacidad 0 (un agujero negro de 534×390 donde estaba K2), K4 0,48 con blur 4,2 px y K5 0,60 con blur 3,2 px (`crit_B_1440_ancla_60.jpg`). En scrub el fotograma se puede congelar sin límite: el blur deja de ser una transición y se vuelve un estado.
- **Zona y valor.** L1386–1388: quitar `filter` del `fromTo`. Desde `{ opacity: 0, y: 24, scale: 0.96, "--dw": 100 }` hasta `{ opacity: 1, y: 0, scale: 1, "--dw": 700, ease: "power2.out", duration: 0.2 }`, con un inicio fijo por losa en vez de la onda radial: K3 0,30 (sube por donde salió K2), K4 0,36, K5 0,42 y K6 0,48. Todo termina antes de 0,72, cuando aterriza la foto. Quitar también el blur de `.k2-cont, .k2-cta` (L1378). El blur se queda solo en la entrada por tiempo (L1394), que dura 360 ms y no se puede congelar.
- **Por qué.** emil: el blur sirve para disimular un cruce *breve*. motion-design: no más de un tercio de los elementos en movimiento a la vez (hoy se mueven foto, K2, nombre, cuatro losas, rail y velo).

**P1-2 · El texto de K2 desaparece en el cruce de vidrio a blanco.**
- **Evidencia.** p = 0,41 (`--m` 0,5): el claim, la línea de nivel y el sub dan **1,0–1,06:1**. K2 queda como una losa gris lisa (`crit_B_1440_ancla_41_k2.jpg`). A p = 0,36 el nivel da 3,42 y a p = 0,46 da 3,92: los dos están por debajo de 4,5.
- **Zona y valor.** Añadir `@property --mt { syntax: "<number>"; inherits: true; initial-value: 1; }` y `.cine .k2 { --mt: 0 }` (L310). Cambiar `var(--m)` por `var(--mt)` **solo en los colores de texto y botones**: L308 `color`, L316 `.nivel/.sub`, L321 `.cta-1` y L322 `.cta-2`. El fondo y los filos siguen con `--m`. En el timeline: `.to(k2, { "--mt": 1, duration: 0.001 }, 0.41)`.
- **Por qué.** Fondo y texto cruzan hacia el mismo gris. Con el cambio de texto en el punto medio, el contraste nunca baja de ≈ 4,5 (fondo efectivo ≈ #76767A).

**P1-3 · El snap direccional convierte un empujón de 40 px en un salto de 860 px, 1,8 s después.**
- **Evidencia.** Rueda de 40 px: scrollY se queda en 40 durante 1,4 s y luego salta a 900. Con 300 px salta a los 1,0 s. El retraso real es el scrub (0,6 s) más el delay (0,12 s) más la detección de fin de scroll. Al usuario le parece que la página «se mueve sola» mientras lee: es el scroll secuestrado que 02 §8 marca como riesgo.
- **Zona y valor.** L1367 `snap: { snapTo: [0, 1], directional: false, delay: 0.05, duration: { min: 0.2, max: 0.45 }, ease: "power2.out" }` y `scrub: 0.3` (misma línea del `scrollTrigger`). Sin dirección, 40 px vuelve a 0 con suavidad y desde la mitad termina el viaje.
- **Por qué.** La regla de 02 §3.3 es que la rueda siempre mueve la página. Un movimiento que el usuario no pidió, tarde y largo, rompe el control.

**P1-4 · «Doug Vargas» aparece dos veces por pantalla** (observación 2). En el acto 1, XL de 120 px y ceja de K2. En el OS, ceja de K2 y rótulo de K1. Durante el viaje hay tres instancias a la vez.
- **Zona y valor.** L687 `<span class="nombre">`: ocultarlo en escritorio con `@media (min-width: 1024px) { .k2 .nombre { display: none } }` (cerca de L313). En la fila de K2 queda solo el estado, alineado a la izquierda: `.k2-fila { justify-content: flex-start }`. En móvil se mantiene, porque allí no hay XL ni panel de K1 y es el único nombre visible.
- **Por qué.** «Cada card tiene un solo protagonista» (02 §2). El nombre ya es el protagonista del acto 1 (XL) y de K1 en el OS. En K2 compite con el H1.

**P1-5 · La disponibilidad aparece 3 veces y el ES/EN 2 veces** (observaciones 3 y 4).
- **Evidencia.** Disponibilidad en el estado de K2 (L688), en el estado de K5, «Abierto a consultoría puntual» (L745–751), y en la última línea de K17. K5 mide 314×255 con ≈ 130 px vacíos entre el texto y el botón. El ES/EN de K6 (L754–762) duplica el de la cabecera: son 2 paradas de Tab más y botones de 36×28 px. A 1280×720 en EN se sale 30 px por la derecha.
- **Zona y valor.** Fusionar K5 y K6 en **una losa «Contacto»** que ocupe `k5` en las filas 4–6 (L245–247: las tres filas de la columna derecha pasan a `k5`, y se borra el área `k6`). Contenido, de arriba abajo:
  - el reloj `BAQ 14:32` en `.dot-l` de 48 px;
  - «Barranquilla, Colombia · UTC-5» en `.etiqueta`;
  - «Head of Product en Naowee» en `.etiqueta`;
  - el botón blanco «Escríbeme» a todo el ancho.

  Se borran el estado «Abierto a consultoría puntual», el `<div class="idioma">` de K6 y el `<article class="k6">`. K17 conserva su línea final, porque es el contexto del contacto.
- **Por qué.** El estado de K2 basta para el test de 5 s. Repetirlo diluye la señal y deja la losa con un vacío. 02 §5.6 manda el idioma a la cabecera, nunca duplicado.

**P1-6 · El punto de disponibilidad es verde, un acento que no existe en 01** (observación 1).
- **Evidencia.** L56 `--verde: #3FD68C` y L319 `.estado::before { background: var(--verde) }`. En 01 §2.1 no hay verde. La regla de NOTAS §1 dice que el láser es la luz y la presencia de Doug: el nodo «hoy» de K11 ya es un punto rojo con halo. En el OS hay dos puntos verdes (K2 y K5), más el `647` en verde oscuro: el verde ya es un cuarto color. Se lee como «online» de Slack o como semáforo, que es justo el lenguaje genérico que 01 §8 evita.
- **Zona y valor.** L319: `.estado::before { width: 8px; height: 8px; background: var(--laser-nucleo); box-shadow: 0 0 0 1px var(--laser), 0 0 8px 2px var(--laser-halo); }`. Es el mismo tratamiento de *luz* que el nodo «hoy» (L399) y no un relleno rojo plano, que se leería como «ocupado». Borrar `--verde` (L56). `--verde-osc` se queda solo para el `647` de olbo, que es color de producto.
- **Por qué.** Un sistema: rojo láser = Doug, ahora (ojos, hilo, hoy, disponible). Además el texto «Disponible» al lado quita la ambigüedad.

**P1-7 · Las pills de la cabecera no pasan AA sobre la foto del acto 1.**
- **Evidencia.** «Trabajo» da p5 4,67 y mínimo 3,33. «CV» da **p5 4,09** y mínimo 2,82. El EN de la cabecera da mínimo 3,73, y a 390 px p5 4,68 y mínimo 3,15. El texto `#A1A1AB` a 14 px cae sobre los bordes claros del gradiente `--vidrio-oscuro` (L58: 0–18 % y 82–100 %).
- **Zona y valor.** L58 `--vidrio-oscuro: linear-gradient(90deg, rgba(58,59,63,.86) 0%, rgba(18,19,20,.86) 10% 90%, rgba(58,59,63,.86) 100%)`. Y nuevo token `--tinta-2-vidrio: #C2C2CA` para `.pill` (L179) e `.idioma a` (L186) en reposo.
- **Por qué.** Regla 8 de refactoring-ui: 4,5:1 a 14 px. 01 §2.3 pide un piso de oscuridad para el vidrio sobre foto.

**P1-8 · K13 repite la cara del láser y su ceja no se lee** (observación 6).
- **Evidencia.** La ceja «Perfil» `#A1A1AB` sobre el retrato da **p5 2,86** y mínimo 2,41. El retrato `98153a04` (L865) es la misma toma del láser que K1: en el OS la cara grande aparece dos veces y el láser deja de ser una firma única.
- **Zona y valor.** L865: `src="../../retratos-hf/83a47bc7.jpg"` (andén, gorra NY, chaqueta, sin lentes y sin láser: un plano medio distinto del primer plano de K1), con `object-position: 50% 30%` en L410. L411: gradiente `linear-gradient(0deg, rgba(6,6,8,.94) 0%, rgba(6,6,8,.80) 45%, rgba(6,6,8,0) 72%)`. Nuevo `.k13 .ceja { color: var(--tinta) }`, cerca de L413.
- **Jerarquía del OS.** A 1440 sigue clara. K1 mide 424×796 (proporción 0,53, alta y estrecha) y es la losa más grande. La vista entra por la cara, salta a la losa blanca K2 (H1 y CTA) y de ahí a la azul K4. No hace falta ensanchar K1 a 1440. A 1024 sí: P0-1 le da 5 columnas.

**P1-9 · El móvil mide 6,64 pantallas (5.608 px); la meta de 02 §3.7 es ≤ 6 (5.064 px)** (observación 7).
- **Evidencia.** Bloques a 390 px: K3 445, K5 162, K6 110, carrusel 499, K13 460, K16 407, K17 547, pie 277. `.os-resto` tiene 128 px de padding inferior y `.pie` otros 128: los dos reservan espacio para el mismo dock.
- **Zona y valor, con el ahorro de cada paso.**
  - L536 `.os-resto … padding-bottom: var(--e-128)` → `var(--e-32)`: −96.
  - L574 `.pie … padding-bottom: var(--e-128)` → `calc(var(--e-96) + env(safe-area-inset-bottom))`: −32.
  - Fusión K5 + K6 (P1-5): una losa de ≈ 160 px en lugar de 272 + 12: −124.
  - L561 `.k13 { min-height: 460px }` → `360px`: −100.
  - L525 `.k3 { grid-template-rows: 180px auto }` → `144px auto`: −36.
  - K17 en móvil: `.k17-enlaces { flex-direction: row }` con los tres externos en una fila de `flex: 1 1 0`: −56.
  - `.k16 .archivo span:last-child { display: none }` en móvil (la descripción vive en `/work`): −80.

  Total ≈ −524 → ≈ 5.084 px, **6,02 pantallas**. Para bajar de 6, `.seccion-titulo { margin-top: var(--e-24) }` (L524): −32.
- **Por qué.** Lo pide la estrategia, y en móvil es donde aterriza el reclutador que llega desde LinkedIn.

**P1-10 · Los años del timeline de K11 se pintan en Doto a 12 px (regla de 01 §4.2: nunca por debajo de 20).**
- **Evidencia.** Hay 7 nodos con `12px Doto 700` (`crit_B_detalles.jpg`). L400 `.nodo span { font-size: var(--t-12) }`, de especificidad 0-1-1, le gana a `.dot-s` (0-1-0).
- **Zona y valor.** L400 → `.nodo span:not(.dot) { … }`. Los años vuelven a 24 px en escritorio. El móvil ya los pone a 20 px.
- **Por qué.** A 12 px los puntos se funden y el timeline pierde su firma visual.

**P1-11 · En móvil, el teléfono de K7 tapa el `647`.**
- **Evidencia.** A 390 px, el `647` en `.dot-xl` de 72 px mide unos 150 px de ancho y el teléfono (46 %, `right: 24`) se monta sobre el «7» (`crit_B_detalles.jpg`). 01 §4.4 pide 48 px para el dot-matrix XL en móvil.
- **Zona y valor.** En el bloque `@media (max-width: 1023px)` (cerca de L545): `.dot-xl { font-size: var(--t-48); }` y `.k7 .telefono { width: 42%; bottom: calc(-1 * var(--e-96)); }`.

**P1-12 · Hay 9 toques por debajo de 44 px a 390.**
- **Evidencia.**
  - ES/EN de la cabecera: 40×32. ES/EN de K6: 36×28 (se borran con P1-5).
  - Marca: 143×40.
  - «Leer el caso de Qrvey»: 137×18.
  - «Más trabajo»: 127×29.
  - Correo: 232×26.
  - «Volver arriba» del pie: 81×21.
- **Zona y valor.**
  - L186 `.idioma a { height: 32px }` → en móvil `height: 36px` con `.idioma { height: 44px; padding: 4px }`.
  - L173 `.marca`: en móvil `height: 44px`.
  - L425 `.k15 .firma a`, L433 `.k16 .t-losa a`, L448 `.correo` y L946 `.ir-arriba`: `display: inline-flex; align-items: center; min-height: var(--toque)`.
- **Por qué.** 02 §5.6: toques de 44×44 con 8 px de separación.

**P1-13 · El círculo blanco de la flecha de K3 se pierde sobre la captura blanca.**
- **Evidencia.** La flecha de K3 está en (558, 476), dentro de la captura (x 393–630). Es un círculo blanco sobre una interfaz blanca: solo se ve la flecha (`crit_B_detalles.jpg`).
- **Zona y valor.** L344: `.k3 .flecha { background: var(--tinta-osc); color: var(--blanco); box-shadow: 0 0 0 1px rgba(255,255,255,.10); }`. Es el mismo trato que ya tienen K7 y K12. Llevar los `style=` de L781 y L859 a una clase `.flecha-tinta` y usarla también aquí.

**P1-14 · Al tabular a K1 durante el ancla, el foco cae sobre una losa a opacidad 0.**
- **Evidencia.** En la parada 18 de Tab, `K1 · ver perfil` tiene opacidad 0 con p = 0,17: el salto a `finDelAncla()` llega, pero el scrub de 0,6 s tarda en alcanzarlo.
- **Zona y valor.** L1413, dentro del `focusin`, después del `scrollTo`: `st.getTween() && st.getTween().progress(1);`. En `irAlOS` (antes del `requestAnimationFrame`), lo mismo.

### P2 · pulido

| # | Evidencia | Zona y línea | Valor exacto | Por qué |
|---|---|---|---|---|
| P2-1 | Las pills se centran en x = 686 (ni el viewport, 720, ni la rejilla, 764), porque `space-between` reparte entre bloques de ancho distinto. | L177 `.pills` | `position: absolute; left: 50%; translate: -50% 0;` dentro de `.barra` | Simetría de la cabecera. |
| P2-2 | K9 (DC Medical) es la única puerta de caso sin flecha. | L802, markup de K9 | Añadir `<span class="flecha circulo" aria-hidden="true">…</span>` y `.k9 .flecha { top: 24px; right: 24px }` (ya existe) | «Cada card es una puerta» con el mismo indicador (02 §4.4). |
| P2-3 | En móvil, la media anidada tiene radio 20 con inset de 12 dentro de una losa de 36: el radio concéntrico es 24. | L526, L553, L555 | `border-radius: calc(var(--r-xl) - var(--e-12))` en `.k3/.k8/.k9 .media` móvil | Radio interno = externo − inset (01 §5). |
| P2-4 | En la hoja, la miga empieza en x = 192 y el contenido en x = 208 (16 px de desfase). El anillo de foco de `.hoja-cuerpo` se sale del panel. | L468 `.hoja-cab`; `.hoja-cuerpo` | `padding: 16px 24px 16px 48px`; `.hoja-cuerpo:focus-visible { outline-offset: -2px }` | Alineación del borde izquierdo y foco contenido. |
| P2-5 | Títulos con viuda: «Diseñador de producto que / construye.» y «Andes Design / System». | L143 `.t-losa` | `text-wrap: balance;` | web-design-guidelines, tipografía. |
| P2-6 | Hay dos acciones primarias azules del mismo destino a la vista: el correo del rail y «Hablemos». Con K4 son tres manchas azules en el pliegue del OS (01 §2.4: color ≤ 10 %). | L200 `.rail .rail-accion` | `background: var(--losa-alta); color: var(--tinta)` | Una sola primaria por pantalla (refactoring-ui). |
| P2-7 | Hay estilos en línea en el markup. | L748, L781, L859, L891, L926 | Pasar a clases: `.mt-8`, `.flecha-tinta`, `.mt-12`, `.boton-toque` | Next con CSP; consistencia del sistema. |
| P2-8 | Falta `touch-action: manipulation` y no se fija el color del resaltado táctil. Las marcas no llevan `translate="no"`. | `html` (base, L109); spans de marca | `html { touch-action: manipulation; -webkit-tap-highlight-color: transparent }`; `translate="no"` en douguizard, Mercadolibre, Naowee, olbo y Andes | web-design-guidelines (táctil e i18n). |
| P2-9 | En K16 quedan 71 px muertos entre el título y la lista (`margin-top: auto`). | L434 `.archivo` | `margin-top: var(--e-24)` | Más espacio alrededor del grupo que dentro, no un vacío. |
| P2-10 | El indicador de scroll (1 px al 16 %, a la derecha) casi no se ve en el acto 1. | L232 `.indicador` | Pista de 2 px a `rgba(255,255,255,.24)`, y debajo un micro «Desliza» (12 px, `--tinta-2`) que se apaga a p > 0,05 | Pista de que el acto continúa, sin decorar. |
| P2-11 | Un artefacto verde apareció una vez en la zona estirada fuera de la foto (x < 60, y > 430) a 1280×720 con WebGL. No se reprodujo en tres intentos (probable SwiftShader). | Shader (`fuera`, `bias`, aberración `ca`) | Verificar en GPU real. Si aparece, poner `ca = 0` cuando `fuera > 0` | Higiene del shader. |

---

## 3. Lo que está muy bien y no se toca

- **La idea.** El láser es el hilo del sitio y es *luz, nunca material*. Corta el retrato, se queda cosiendo el tablero (y = 277 a 1440, visible solo en las calles) y reaparece en el nodo «hoy». Es la firma de la propuesta.
- **El acto 1 como test de 5 s.** Nombre XL, H1, nivel, Mercadolibre, disponibilidad y las dos CTA en el pliegue, a 1440 y a 390. Contraste medido: nombre XL p5 13,6; claim 15,2; nivel 6,55; sub 6,68.
- **K2 como una sola losa** que pasa de vidrio oscuro a blanca con una variable (`--m`). Solo hay que corregir el texto del cruce (P1-2), no la idea.
- **El vidrio WebGL.** Un pase, cara protegida (×0,32), banda del láser legible y lente con muelles críticamente amortiguados que nace bajo el cursor. Entra con k = 7 y sale con k = 4, lo que cumple la regla de salida más rápida que la entrada. DPR ≤ 1,5 y bucle solo mientras algo cambia.
- **La entrada al cargar.** 40 y 80 ms de escalonado, todo antes de 1,1 s, con el póster LCP sin animar.
- **El sistema de tokens.** Espacios en 4/8/…/128 sin excepciones de componente (solo 88 y 112 estructurales). Tipos en la escala de 01. Radios concéntricos medidos: panel de K1 de 32 dentro de 48 con inset 16; medias de 32 con inset 16; filas de K16 de 16 dentro de 48 con padding 32. Sombras del color de su losa.
- **La hoja.** `<dialog>` con `showModal()`, foco inicial en Cerrar, Esc, Atrás y velo. Arrastre con velocidad > 0,5 px/ms o distancia > 120 px y banda elástica. Devuelve el foco al enlace de origen y cmd/ctrl/clic medio abre la página completa. Entra en 420 ms y sale en 280 ms con `--ease-drawer`. Probado a 1440 y a 390.
- **Orden del DOM = orden visual** (K2, K1, K3…), sin `order` ni `dense`. H1 real y cifras Doto con `aria-label` por grupo.
- **Respaldos.** Sin GSAP, el tablero aparece armado (`cine` false, p = 1, sin errores de script). Con `prefers-reduced-motion` emulado: sin ancla, sin lente, sin deriva y hoja con fundido de 150 ms. En ningún caso hay desborde horizontal (1024–1920 y 390).
- **Los colores corregidos tras medir**: etiquetas azules `#E3EAFF` (p5 7,0–9,0) y magenta `#FCE6F1` (p5 5,97).
- **El móvil como app.** Foto a sangre con K2 encima, dock que aparece al salir del héroe (4 destinos de 72×52) y carrusel con contador y botones.
- **La dirección de arte de K4, K7, K10 y K12.** Jelly azul con cifras Doto como imagen del caso NDA, olbo en losa niebla con teléfono que sangra, y magenta con base lavanda: proporción una azul / una magenta / una clara por bloque.
