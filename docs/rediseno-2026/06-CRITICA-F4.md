# 06 · Crítica de F4 (vidrio estriado WebGL2, respaldos y póster horneado)

> Crítico / QA visual · 6 nov 2026 · objeto: el código de F4 en la rama `claude/douguizard-portfolio-redesign-9ivnau`
> (`F4-INFORME.md`, desvíos 1–6) y sus capturas `F4-capturas/`, frente a la decisión vigente de Doug en `ESTADO.md`
> («Héroe = foto + vidrio estriado **oblicuo**; el cursor solo abre/aclara el vidrio») y al landing de referencia
> `referencias/ref-8-landing-elegido-B-os.jpg`. Método: refactoring-ui (jerarquía, legibilidad, materiales) y
> web-design-guidelines (RM, respaldos, táctil, rendimiento percibido), con los criterios y la línea **QA.** de `07`
> §F4. Se compararon a pares `home-1440x900` cursor-cara / cursor-hombro / cursor-fuera / rm-poster,
> `home-390x844` reposo / arrastre y `about-1440x900-p0-cursor`; además una diferencia de píxeles (PIL, recorte de K1)
> entre las capturas con y sin cursor. Código leído solo donde lo pedía un hallazgo: `src/data/hero.ts:110-117`,
> `src/lib/gl/vidrioShader.ts:25-52`, `src/components/hero/vidrio.css:28-29`.
>
> **Fuera de alcance (esperado, no cuenta):** fps en hardware real (pendiente declarado); LCP móvil de `/about`
> 2,95 s (desvío 4, asignado a F8); Safari/iOS (F8); la imagen final del héroe (D7, en pausa); la escena y el acto 1
> (F5); el láser que parte «Vargas» en `/about` (es el lockup «corte láser» decidido por Doug, no un defecto).

---

## 1. Veredicto por vista

| Vista | Nota | Veredicto |
|---|---|---|
| Home 1440×900 (K1 `losa`) | **7,4** | Material creíble: las franjas refractan la foto de verdad, labio y pliegue con luz, banda láser continua de borde a borde de la foto, ojos legibles, panel «Doug Vargas» intacto encima. Pero las estrías son **verticales**: contradice la decisión vigente de Doug (P0-1). La lente no se percibe en ninguna captura (P1-1). |
| Home 390×844 (`movil`) | **8,0** | Oblicuas a 12°, foto a sangre, láser y K2 de vidrio dentro del pliegue: buena lectura en 5 s. Las aristas de las estrías salen dentadas (puntos blancos en escalera) y la gorra se «rasga» en tramos (P1-2). Arrastre: sin cambio visible (P1-1). |
| `/about` 1440 p0 (`cine`) | **8,1** | Es la imagen que mejor encarna la decisión: oblicuo 12°, el láser cruza todo el ancho y parte «Vargas», el texto queda sobre la zona oscura de la foto. Las aristas dentadas se ven más (franjas anchas, foto grande) y una costura cae en el eje de la nariz (P1-2, P2-1). |
| RM (póster solo) | **8,5** | El póster horneado es indistinguible del primer cuadro WebGL (diferencia media 3,1/255, casi todo ruido JPG): el fundido no salta. Correcto que RM no pida ni GPU ni JS. |
| Sin WebGL / contexto perdido | — | Sin captura (P1-3). Las pruebas (b) y (e) de `vidrio.spec` lo cubren y el desvío 1 (lente CSS sobre el póster, sin franjas duplicadas) es una buena decisión: evita el moaré. |
| **Conjunto** | **7,7** | Técnicamente sólido (un pase, sin bucle en reposo, LCP del póster, carga diferida tras `load`, 424/424). Lo que falla es de **dirección**: la orientación de K1 y que la interacción principal —el cursor que abre el vidrio— no se ve. Con P0 + P1 resueltos sube a ≈ 8,6. |

Conteo: **1 P0 · 3 P1 · 5 P2**.

**Lo que se comprobó y está bien:** nada del vidrio tapa texto ni tarjetas (el canvas vive dentro de la caja de la
foto de K1 y de `/about`; el panel «Doug Vargas» y K2 móvil quedan por encima); sin aberración cromática fuera de la
foto (`vidrioShader.ts:41`, `ca = 0` si `fuera > 0`); banda láser recta y legible (el desplazamiento se vuelve
horizontal dentro de la banda, `:37`); coherencia home ↔ `/about` en material, paleta y láser; `touch-action:
pan-y pinch-zoom` (no se roba el scroll ni el zoom); sin números de la foto en componentes; CLS 0.

---

## 2. Arreglos priorizados

**P0** bloquea. **P1** importante. **P2** pulido. Evidencia → zona → arreglo → por qué.

### P0 · bloquea

**P0-1 · K1 del home de escritorio va con estrías verticales; Doug decidió oblicuas.**
- **Evidencia.** `home-1440x900-cursor-fuera.jpg`, `-cara`, `-hombro`, `-rm-poster`: todas las franjas de K1 a 90°.
  `src/data/hero.ts:110-116`: `losa: { angulo: 0, … }` con el comentario «vertical, fiel a ref-8». `ESTADO.md` §Decisiones:
  «Héroe = foto + vidrio estriado **oblicuo**». ref-8 es vertical, pero es anterior; la decisión vigente manda, y además
  deja al home (vertical) incoherente con su propia versión móvil y con `/about` (oblicuas a 12°): tres héroes, dos
  orientaciones. Es justo lo que F3 P2-3 marcó para el móvil; el arreglo se aplicó a `movil` y no a `losa`.
- **Zona.** `src/data/hero.ts:116`; pósters `public/hero/199598aa-v2/losa-*` (horneados con 0°).
- **Arreglo.** `losa.angulo: 12` (mismo valor que `cine`/`movil`; si Doug quiere otro, uno solo para los tres), subir
  `version` a 3 y `npm run hero:poster` para rehornear; corregir el comentario. Revisar que `estria` 0.042 a 12°
  no caiga en moaré con el borde redondeado de la losa (captura a 1440 y 1024). Ajustar el test que afirme `losa = 0`
  en `hero.test` si existe.
- **Por qué.** Es la pieza más vista del sitio y la única decisión de Doug explícita sobre el vidrio. Un desvío así
  debe pasar por él, no resolverse en el ejecutor. (Si Doug prefiere vertical en la losa por ref-8, que lo diga y se
  anota en `ESTADO.md`; hasta entonces, oblicuo.)

### P1 · importantes

**P1-1 · La lente (cursor y dedo) no se percibe: la interacción que define el héroe no está demostrada.**
- **Evidencia.** `cursor-cara` frente a `cursor-fuera` son a ojo idénticas; la diferencia de píxeles en K1 da media
  5,3/255 y 5,4 % de píxeles > 20, y casi toda viene de que la tarjeta sube 2 px con el hover (el panel «Doug Vargas»
  pasa de y 745 a 743), no de que se aclare el vidrio. `cursor-hombro` (donde no hay protección de cara y la lente
  debería dejar un círculo de ≈ 150 px limpio) tampoco muestra un claro. `390-arrastre` vs `reposo`: 6,3 %, sin zona
  limpia visible «a media cara». La prueba (a) solo comprueba `data-lente = 1,00`, no lo que se pinta. No hay marca
  del cursor en las capturas.
- **Zona.** Shader: `vidrioShader.ts:33-34` (la lente multiplica `str` por `1 − lens`, bien planteado); el problema
  está en la cadena estado → uniforme → cuadro, o en el momento de la captura (¿se tomó antes de que `VidrioGL`
  montara tras `load` + `requestIdleCallback` + 400 ms de fundido?). Sobre la cara, además, la protección (0,68) ya
  deja `str` ≈ 0,18: la lente apenas tiene qué quitar ahí.
- **Arreglo.** (1) Rehacer las capturas esperando `canvas[data-cuadros] > 0` y opacidad 1, con un punto rojo de 8 px
  dibujado en la posición del cursor/dedo. (2) Añadir a `vidrio.spec` (a) y (d) una aserción **visual**: leer
  `gl.readPixels`/`toDataURL` en un parche de 40×40 bajo el cursor con la lente abierta y cerrada y exigir que la
  varianza horizontal (las estrías) baje ≥ 50 %. (3) Si con eso la lente sigue tímida: radio pleno a `uLensR·0,6`
  (hoy `0,5`) y +4 % de brillo en vez de +6 % para que lea como «aclarar», no como foco. Sobria = sin deformar, no
  invisible.
- **Por qué.** «El cursor solo abre/aclara el vidrio» es la mitad de la decisión de Doug y el único momento de
  interacción del héroe. Hoy no hay evidencia de que se vea; las pruebas pasan por un atributo, no por la imagen.

**P1-2 · Las aristas de las estrías oblicuas salen dentadas (sin antialias) y rasgan bordes duros.**
- **Evidencia.** `home-390x844-reposo.jpg`: líneas blancas punteadas en escalera en las aristas (borde izquierdo, sobre
  la pared) y el ala de la gorra cortada en tramos desplazados (y ≈ 180–260). `about-1440x900-p0-cursor.jpg`: las
  mismas aristas punteadas sobre la pared y la chaqueta. En K1 vertical no se nota porque la arista coincide con la
  rejilla de píxeles; al pasar `losa` a 12° (P0-1) aparecerá también en el home.
- **Zona.** `vidrioShader.ts:30` (`k = floor(u/uW)`, `t = fract(u/uW)`: salto duro de índice y de `disp` en la arista)
  y `:45-46` (`lip` con `smoothstep(0.10, 0.0, t)` estrecho → una línea de 1 px que, inclinada, se pinta en escalera).
- **Arreglo.** Antialias analítico en la arista: `float aa = fwidth(u / uW);` y mezclar la muestra de la estría `k` con
  la de `k−1` en `smoothstep(0.0, aa * 1.5, t)` (dos `texture()` solo en la franja de borde), y ensanchar el `lip` a
  `max(0.10, 2.0*aa)`. Alternativa barata: DPR interno mínimo 2 en el canvas para `movil` (el tope 1,5 se queda en
  escritorio) — cuesta GPU, por eso preferir el `fwidth`. Rehornear pósters.
- **Por qué.** El vidrio estriado vive de la nitidez de su arista; dentada se lee como «escaneo»/glitch y no como
  vidrio (refactoring-ui: el material se cree por la luz del borde). Es lo primero que ve un móvil.

**P1-3 · No hay captura a 1024 con cursor ni del respaldo sin WebGL: la matriz de la línea QA está incompleta.**
- **Evidencia.** `F4-capturas/` trae `1024-cursor-fuera` y nada sin WebGL ni con contexto perdido; `07` §F4 **QA.** pide
  1440/1024/390 con cursor, con arrastre, RM y **sin WebGL**. El respaldo (`LenteCss`, máscara radial
  `vidrio.css:28-29`) es lo que verá cualquier GPU con `failIfMajorPerformanceCaveat`, o sea una parte real del público.
- **Arreglo.** Capturar `home-1440` y `home-390` lanzando Chromium con `--disable-webgl --disable-webgl2`, en reposo y
  con cursor/dedo marcado (mismo criterio de P1-1); `home-1024` con cursor sobre la cara. Juntar con la tanda de P1-1.
- **Por qué.** Sin esa evidencia no se puede firmar que el respaldo cumpla la decisión («abre/aclara») ni que la lente
  CSS (borde a `#000 45%`) no se vea como un foco de linterna.

### P2 · pulido

**P2-1 · Una costura cae justo en el eje de la nariz.** En las cuatro capturas de escritorio y en `/about` hay una
arista que parte la cara por el centro (x ≈ 865 en K1). Con la cara protegida al 68 % la costura sigue viéndose y
divide la cara en dos tonos. Arreglo: en `uniformesVidrio()` calcular `uPhase` para que el centro de la cara
(`uFace.xy`) caiga en `t = 0,5` de su estría (centro de la lente cilíndrica, la parte más limpia). Un número derivado,
no un valor a mano en componentes.

**P2-2 · El láser no cruza la página como en ref-8.** En ref-8 la línea fina sigue fuera de K1 por los huecos entre
tarjetas y hasta los bordes del viewport (x 0–110 y 1415–1440, y ≈ 325); en F4 muere en el borde de la foto. En
`/about` sí cruza todo el ancho. Si lo cubre F5 (escena), anotarlo allí; si no, un `::before` de 1 px en la rejilla del
tablero alineado con `--foto-ojo`, por debajo de las tarjetas.

**P2-3 · Encuadre de K1 más abierto que ref-8.** ref-8 recorta la parte alta de la gorra y pone los ojos a ≈ 30 % de
la tarjeta; F4 deja la gorra entera y los ojos a ≈ 41 %, así la cara se ve más pequeña y el panel del nombre roza la
barbilla. Es de `object-position` en `hero.ts` (no de componentes) y la imagen está en pausa (D7): ajustar
`posicion.losa` y ≈ 0,30 cuando llegue la foto final, no ahora.

**P2-4 · Franja gris clara a la derecha en todas las capturas de escritorio** (x ≈ 1425–1440): la barra de desplazamiento
sale clara sobre la página oscura. Heredado de F3 (`color-scheme`); comprobar que el `html` de las superficies B lleve
`color-scheme: dark` (`globals.css:66` existe, pero algo lo deja en claro en el home).

**P2-5 · `experimental.inlineCss` (desvío 3): aceptable, con vigilancia.** Para la experiencia es una ganancia neta
(LCP móvil de `/` 2,94 → 1,00 s). El coste —57 KB gz de HTML en cada carga completa, sin caché del CSS entre páginas—
solo se siente al abrir rutas en pestañas nuevas o al entrar por un enlace profundo; la navegación interna no
recarga el HTML. No bloquea; en F8 medir con CDN y HTTP/3 si conviene volver al `<link>` con `preload`.

---

## 3. Arreglar antes de F5 (P0 + P1)

1. **P0-1** — `losa.angulo` 0 → 12 en `src/data/hero.ts`, `version` + 1, `npm run hero:poster`; tres héroes, una
   orientación (la decidida por Doug).
2. **P1-2** — antialias de la arista en `vidrioShader.ts` (`fwidth` + mezcla `k`/`k−1`, `lip` ≥ 2 px) y rehorneado;
   hacerlo en la misma tanda que P0-1, porque al inclinar K1 aparecerá el mismo dentado.
3. **P1-1** — demostrar la lente: capturas tras el fundido con el cursor marcado, aserción de píxeles en `vidrio.spec`
   (a) y (d); si sigue tímida, radio pleno `0,6·uLensR`.
4. **P1-3** — completar la matriz de QA: 1024 con cursor y respaldo sin WebGL a 1440/390 (reposo y con lente).
