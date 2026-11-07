# 06 · Crítica de F6 (casos en hoja con URL real)

> Crítico / QA visual · 7 nov 2026 · objeto: el código de F6 en la rama `claude/douguizard-portfolio-redesign-9ivnau`
> (`F6-INFORME.md`, desvíos 1–6) y sus capturas `F6-capturas/`, frente a `07` §1.2 y §F6 (criterios y línea **QA.**) y
> a la maqueta aprobada `propuestas/B-paginas/shot_P_caso_1440_hoja{,_tablero}.jpg` y `shot_P_caso_390_hoja.jpg`.
> Método: refactoring-ui (superficie, borde, jerarquía de la cabecera), web-design-guidelines (foco, teclado, RM,
> móvil) y motion-design (entrada/salida, coreografía, curvas).
> Se compararon `hoja-{naowee-suid,mercadolibre-andes}-es-{1440,390}`, `hoja-naowee-suid-en-390` y las páginas
> completas; del vídeo `hoja-1440.webm` (25 fps, 13,7 s) se extrajeron todos los cuadros y se midió la luminancia del
> velo y la diferencia entre cuadros; perfiles de píxel con PIL en el borde derecho de las capturas.
> Código leído solo donde lo pedía un hallazgo: `src/components/hoja/{CaseSheet.tsx,origen.ts}`,
> `src/app/globals.css:1363-1571`, `src/components/case/CaseHeader.tsx:112-122`, `src/app/(es)/@modal/(.)work/[slug]/page.tsx:22`.
>
> **Fuera de alcance (esperado, no cuenta):** la tipografía, el orden y el contenido del cuerpo del caso, que siguen
> en el sistema viejo y pasan a B en **F7**; VoiceOver, Safari y Firefox reales (F8); el CLS móvil de 0,066, que viene
> de F5; el ancho de 375 px de la hoja a 390, que es un artefacto de la barra clásica de headless (desvío 4), salvo en
> lo que toca P1-2.

---

## 1. Veredicto por vista

| Vista | Nota | Veredicto |
|---|---|---|
| Hoja 1440 (Naowee, Andes) | **8,4** | Calca la maqueta: el panel empieza en y = 48 y mide 1120 de ancho, con radio de losa arriba, filo de 1 px y asa de 36×4. La cabecera trae miga, «Ver página completa» y Cerrar (círculos de 56 px), y el cuerpo arranca en x = 48 desde el borde del panel, alineado con la miga. El velo (62 % + blur 8) deja leer el tablero, pero muy apagado, como en `shot_P_caso_1440_hoja_tablero`. Fallan dos cosas: la miga repite el título largo justo encima del `h2` (P1-5) y a la derecha queda una franja de 15 px sin velo (P1-2). |
| Hoja 390 (ES y EN) | **7,6** | Va a pantalla completa menos 16 px, con el asa, los círculos de 56 px y el tablero asomando arriba, como en la maqueta. La miga se trunca en los 8 casos móviles («Naowee — Plata…», «Andes Design S…», «Naowee — Sports …») y la maqueta dice solo «Naowee» (P1-5). |
| Entrada (vídeo 5,44 → 6,32 s) | **7,2** | El panel sube con `--curva-hoja` y el velo funde a la vez: bien. Pero llega **vacío**: en 5,64–5,72 s solo se ve el antetítulo. Después el `RevealText` del título se abre línea a línea hasta ≈ 6,30 s, así que pasan ≈ 0,9 s hasta poder leer (P1-4). |
| Lectura y progreso láser | **8,8** | La rueda mueve el cuerpo y no la ventana. El hilo láser de 1 px con halo avanza bajo la cabecera, como en la maqueta (≈ ⅛ en 11,04 s). |
| Salida (vídeo 11,16 → 11,20 s) | **— (sin evidencia)** | Entre esos dos cuadros consecutivos se pasa de la hoja entera al tablero, sin ningún cuadro intermedio. El velo se queda en 17,1 de luminancia hasta 11,16 s y salta a 35,6 en 11,20 s. A 25 fps, 280 ms deberían dejar unos 7 cuadros. El CSS parece correcto, pero no hay prueba de la salida (P1-3). |
| Origen intacto | **9,5** | El cuadro de 11,40 s es idéntico al de 5,36 s (scroll, ancla, láser, vidrio). Con eso y `hoja.spec` (scrollY, fase, `cine`) queda cumplido el criterio «la hoja no rompe el pin ni la lente». |
| Teclado y foco | **7,0** | La trampa de Tab, Esc por `cancel`, el foco devuelto a la card y axe en verde están bien. El problema es el foco inicial en Cerrar: con el teclado no se puede leer el caso, y Espacio, la tecla con la que se avanza página, cierra la hoja (P1-1). |
| RM / transparencia reducida | **9,0** | Con RM es un fundido de 150 ms sin desplazamiento. Con transparencia reducida, el velo pasa a ser opaco. Correcto. |
| **Conjunto** | **8,1** | La ingeniería es de nivel alto: 464/464 dos veces, las 5 comprobaciones de §1.2 repetidas, 1 `main`/`h1`/`footer`, sin RSC extra y el JS de `/` igual. Los fallos están en los bordes de la experiencia: el teclado, la franja sin velo, la coreografía de entrada y una salida que nadie ha probado. Con los P1 resueltos sube a ≈ 8,9. |

---

## 2. Arreglos priorizados

### P0 · bloquea

Ninguno.

### P1 · importantes

**P1-1 · El foco inicial en Cerrar deja al teclado sin poder leer, y Espacio cierra la hoja.**
- **Evidencia.**
  - `CaseSheet.tsx:89` hace `botonCerrar.current?.focus()`.
  - El foco queda en un botón de la cabecera, fuera del contenedor que se desplaza (`.hoja-cuerpo`). Así, ↓, AvPág y
    Espacio no desplazan nada: el documento tiene `overflow: hidden`.
  - Espacio sobre un `<button>` lo activa, así que quien pulsa Espacio para avanzar, como en cualquier página, cierra
    la hoja.
  - `.hoja-cuerpo` tiene `tabIndex={-1}` y un estilo `:focus-visible` (globals.css:1536), pero nunca recibe el foco.
  - La maqueta muestra el anillo en Cerrar, pero eso es estado visual, no una decisión de foco.
- **Arreglo.**
  1. Al abrir, `cuerpo.current.focus({ preventScroll: true })` en vez de Cerrar. Es la pauta de APG para diálogos
     con mucho contenido: enfocar el inicio del contenido. Así ↓, AvPág y Espacio leen el caso.
  2. Cerrar sigue siendo la primera parada de Tab: hoy la trampa ya da la vuelta a la cabecera. Esc sigue cerrando.
  3. Para que el anillo de `.hoja-cuerpo` no aparezca al abrir con el ratón, usar el `outline` solo con
     `:focus-visible`, como ya está. Si Chromium lo mostrara tras un `focus()` programático, quitarlo con
     `outline-offset: -2px; outline-color: transparent` hasta la primera tecla.
  4. Prueba en `hoja.spec`: tras abrir, `activeElement` es `.hoja-cuerpo`. Espacio aumenta `scrollTop` y la hoja sigue
     abierta. El primer Tab llega a la miga o a Cerrar.

**P1-2 · En escritorio con barras clásicas, el canal de la barra queda sin velo (15 px a la derecha) y el panel queda descentrado.**
- **Evidencia.**
  - `hoja-naowee-suid-es-1440.jpg`: de x = 1426 a 1439, a cualquier altura, el color es (16,16,16) plano. Justo a la
    izquierda, el velo está en (6,6,8).
  - Es el canal que reserva `html:has(dialog.hoja[open]) { scrollbar-gutter: stable }`: el `dialog` fijo no lo cubre.
    Se ve como una franja más clara y sin blur.
  - El panel queda centrado en 1425 px (x 153–1272) y no en 1440 (maqueta: 160–1279).
  - En Windows (Chrome y Edge, barras clásicas) esto lo ve un público real, no solo headless. A 390 pasa lo mismo en
    headless (desvío 4).
- **Arreglo.**
  1. Pintar el lienzo del color del velo mientras la hoja está abierta:
     `html:has(dialog.hoja[open]) { background-color: #060608 }`. El canal muestra el fondo del lienzo. Verificar que
     `body` conserve su fondo propio para que el tablero no cambie.
  2. Alternativa: probar `.hoja { width: 100vw }`. Hay que medir si pinta sobre el canal en Chromium.
  3. Prueba de píxel: con la hoja abierta a 1440, Δlum entre x = 1432 y x = 1410 ≤ 3.
  4. El descentrado de 7,5 px es aceptable.

**P1-3 · La salida (X, Esc, velo) no aparece en el vídeo y ninguna prueba la cubre.**
- **Evidencia.**
  - `hoja-1440.webm`: el cierre con la X pasa de la hoja al tablero entre 11,16 s y 11,20 s, en un solo cuadro.
  - En 10,24–11,16 s ningún cuadro difiere del anterior más del umbral, y el velo se mantiene en 17,1 hasta el corte.
  - Al abrir hay unos 10 cuadros de transición.
  - `hoja.spec` «Movimiento» solo mide la entrada (`translate` 0,42 s).
  - El CSS de salida parece correcto: estado `cerrando` → `translate: -50% var(--sale)` en 280 ms. Puede ser el
    grabador, que pierde cuadros, o un `router.back()` que se adelanta. Hoy no se sabe.
- **Arreglo.**
  1. Prueba nueva: clic en la X, y a los 100 ms `getComputedStyle(panel).translate` está entre 0 y `--sale`, y
     `dialog[open]` sigue presente. A los 400 ms ya no hay hoja.
  2. Lo mismo con Esc y con el velo.
  3. Volver a grabar `hoja-1440.webm` con un cierre de cada tipo. Si el grabador pierde cuadros, sacar los
     fotogramas con `page.screenshot` cada 40 ms durante la salida.

**P1-4 · Entrada en dos tiempos: la hoja llega vacía y luego el título se revela por su cuenta (≈ 0,9 s hasta leer).**
- **Evidencia.**
  - Cuadros de 5,64 y 5,72 s: el panel ya está casi en su sitio y solo se ve «NAOWEE · HEAD OF PRODUCT».
  - 5,80–6,24 s: el `h2` se abre línea a línea, con recorte («sector deportivo» cortado a 5,88 s), y después baja el
    lead.
  - Causa: `CaseHeader.tsx:112-122` usa `RevealText` también con `enHoja`.
  - Son dos coreografías en serie: la de la hoja (420 ms) y la del cuerpo (≈ 500 ms después). Motion-design: el
    contenido debe viajar **con** su contenedor. Un reveal propio solo se justifica en contenido que entra por
    scroll.
- **Arreglo.**
  1. Si `enHoja`, `RevealText` del título y del lead en estado final, sin animación: el texto sube con el panel.
  2. Si se quiere conservar un acento, un único `opacity` 0 → 1 de 200 ms con `delay` de 120 ms, solapado con la
     subida.
  3. F7 rehará el cuerpo en B. Este ajuste es de F6 porque nace de meter el caso en la hoja, y F7 debe heredarlo
     (anotarlo en el plan).
  4. Prueba: a los 420 ms de abrir, el `h2` tiene opacidad 1 y ningún `clip-path` ni `transform` activo.

**P1-5 · La miga usa el título largo: se trunca en móvil y repite el `h2` en escritorio.**
- **Evidencia.**
  - El slot pasa `proyecto={study.project}` (`(es)/@modal/(.)work/[slug]/page.tsx:22`, igual en EN).
  - A 390 sale «Naowee — Plata…», «Andes Design S…» y «Naowee — Sports …»: 8 de 8 capturas móviles truncadas.
  - A 1440 se lee «Naowee — Plataforma del sector deportivo» a 15 px y, 50 px más abajo, el mismo texto a ≈ 110 px.
  - La maqueta usa el nombre corto: «Trabajo / Naowee».
- **Arreglo.**
  1. Pasar el nombre corto del caso: el campo de cliente o nombre corto que ya usan las cards (`Naowee`, `Andes`,
     `olbo`, `DC Medical`). Si no existe, añadir `nombreCorto` en `caseStudies`.
  2. Mantener el `ellipsis` como red de seguridad.
  3. Prueba: a 390, `b.scrollWidth ≤ b.clientWidth` en los 4 casos, ES y EN.

### P2 · pulido

**P2-1 · `origen.ts` puede devolver el foco a una card anterior.**
- `guardarOrigen` hace `if (origen?.isConnected) return;` y `devolverFoco` no limpia `origen`.
- En Safari (el clic no enfoca enlaces), abrir Naowee, cerrar y abrir Andes con el ratón devuelve el foco a Naowee.
- Arreglo: `origen = null` al final de `devolverFoco()`, y en `guardarOrigen` buscar siempre el enlace a la `ruta`
  actual cuando el activo es `body`.

**P2-2 · Un cierre nativo del `dialog` deja la URL del caso sin hoja.**
- Si Chromium fuerza el cierre (CloseWatcher: dos peticiones de cierre sin activación de usuario entre ellas, el
  segundo `cancel` no es cancelable), el `dialog` se cierra sin pasar por `cerrar()`. Queda `/work/x` en la barra con
  el tablero a la vista.
- Arreglo: escuchar `close` en el `dialog` y, si `!cerrando.current` y la ruta sigue siendo la del caso, llamar a
  `router.back()`.

**P2-3 · El velo se va antes que el panel.**
- En la salida, el velo usa `--curva-salida` (ease-out fuerte) y el panel `--curva-hoja`. A los ≈ 100 ms el velo ya
  casi no está y el tablero aparece nítido detrás de una hoja que todavía baja.
- Arreglo: la misma curva para los dos en la salida, o el velo en `linear` 280 ms. Se juzgará cuando P1-3 deje ver
  la salida.

**P2-4 · Sin área segura abajo en móvil.**
- `.hoja-cuerpo` no reserva `env(safe-area-inset-bottom)`, así que el final del caso (colofón, «Siguiente») queda bajo
  el indicador de inicio del iPhone.
- Arreglo: `padding-bottom: env(safe-area-inset-bottom)` en `.hoja-cuerpo`, con `viewport-fit=cover` si no está ya.

**P2-5 · Arrastre solo desde la cabecera.**
- Es correcto y seguro. Las hojas nativas de iOS también cierran al tirar desde el contenido cuando `scrollTop = 0`.
- Opcional en F8: extender `useArrastreHoja` al cuerpo solo si `scrollTop === 0` y el gesto empieza hacia abajo.

**P2-6 · No hay captura del estado con teclado.**
- La maqueta muestra el anillo eléctrico en el control enfocado.
- Añadir a `shots-f6.ts` una captura abriendo con Enter, para comprobar el anillo de `:focus-visible`. Tras P1-1, el
  anillo estará en el cuerpo o en Cerrar tras un Tab.

---

## 3. Arreglar antes de F7 (P0 + P1)

1. **P1-1** Foco inicial en `.hoja-cuerpo` (↓, AvPág y Espacio leen; Espacio ya no cierra). Cerrar sigue como
   primera parada de Tab. Con su prueba.
2. **P1-2** Canal de la barra cubierto: lienzo del color del velo mientras la hoja está abierta. Prueba de Δlum en
   x = 1432.
3. **P1-3** Probar la salida (X, Esc, velo): estado intermedio a los 100 ms y sin hoja a los 400 ms. Volver a grabar
   el vídeo con cierres visibles.
4. **P1-4** El texto del encabezado del caso viaja con el panel: sin `RevealText` cuando `enHoja`, o un único fundido
   corto solapado. Anotarlo en F7 para que el cuerpo B lo herede.
5. **P1-5** Miga con el nombre corto del caso (ES y EN), sin truncar a 390.

Después de arreglar, rehacer `hoja-*-{1440,390}` de Naowee y Andes (ES y una EN) y `hoja-1440.webm`.
