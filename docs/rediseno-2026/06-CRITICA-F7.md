# 06 · Crítica de F7 (casos y páginas al sistema B)

> Crítico / QA visual · 7 nov 2026 · objeto: el código de F7 en la rama `claude/douguizard-portfolio-redesign-9ivnau`
> (`F7-INFORME.md`, desvíos 1–7) y sus capturas `F7-capturas/`, frente a `07` §F7 (criterios y línea **QA.**) y a la
> maqueta aprobada `propuestas/B-paginas/shot_P_caso_1440_pliegue.jpg`, `shot_P_caso_1440_completa.jpg` y
> `shot_P_caso_390_pliegue.jpg`.
> Método: refactoring-ui (jerarquía, ritmo, superficies, radios concéntricos) y web-design-guidelines (legibilidad,
> contraste, foco, móvil, i18n), con la lente de reclutador (02 §2: ¿qué entiendo en 10 s?) y la de director de diseño.
> Se compararon lado a lado: pliegue 1440 (maqueta vs. Naowee); página entera de Naowee a 1440 y de la maqueta, en 4
> tramos al 42 %; Naowee 390 (ES, EN, entera), Andes 1440 entera y 390, hoja de Naowee a 1440 y a 390, y la 404.
> Recortes al 80 % del tablero y de la cubierta de Naowee; luminancia del texto con PIL.
> Código leído solo donde lo pedía un hallazgo: `src/components/case/caso.css:151-161`,
> `src/components/case/CaseBody.tsx:80-100`, `src/components/case/CaseHeader.tsx:43-68`.
>
> **Fuera de alcance (no cuenta):** Safari, Firefox y VoiceOver reales (F8); el CLS móvil de 0,066 (viene de F5); la
> imagen del héroe; el dato de plataformas de Banco de Occidente, Qrvey e Ideaware (pendiente de Doug); la animación
> del morph, que headless no mide (desvío 5).

---

## 1. Veredicto por vista

| Vista | Nota | Veredicto |
|---|---|---|
| Pliegue 1440 (Naowee) | **7,0** | La estructura calca la maqueta: miga corta, ceja, `h1` en col 1–7, ficha 2 × 2 sin escalera en col 8–12 alineada abajo y gancho en `--tinta-2`. Pero se pierden los dos golpes del pliegue. El título no es «Naowee» a 120 px, sino «Naowee — Plataforma del sector deportivo» a 72 px en 2 líneas (desvío 1, P1-1). La captura no es una losa clara a sangre: es la película vieja dentro de un marco de ventana con barra «○○○ NAOWEE · IVC», con un velo que apaga el blanco a ≈ 210/255 y un botón de reproducir en el centro (P1-2). |
| Página entera 1440 (Naowee) | **7,4** | El orden de 02 §5.3 es correcto y el ritmo general es bueno: tablero → frase de impacto → Problema → Mi parte → Decisiones → Producto → Proceso → colofón → siguiente caso, con 128 px entre bloques. El tablero tiene la losa clara primero, la misma cifra Doto en las cuatro losas, una sola línea y altura según contenido. El proceso, el colofón y el siguiente caso calcan la maqueta. Lo que falla: los `h2` del cuerpo son rótulos sueltos («Problema», «Mi parte», «Decisiones», «Proceso») y no titulares, así que el cuerpo largo se lee como un formulario (P1-3); y las bandas heredadas (la película con su pie «/ RECORRIDO — SIN SONIDO» en mono, mayúsculas y tracking, el chip «▷ REPRODUCIR», los marcos de ventana de la galería) siguen en el idioma de F0 (P1-4). |
| Andes 1440 (NDA) | **8,2** | Es la vista más fiel. El título corto va a 72 px en una línea, la losa jelly del NDA hace de cubierta con viñeta y botones `Boton`, y el índice muestra solo Impacto, Problema y Mi parte. El tablero tiene 4 columnas con cifras que llenan la losa. Hay dos detalles: la cuarta losa («3» + delta) es más alta que sus vecinas, con bordes inferiores dentados (P2-3), y el «© 2026 Doug Vargas» queda suelto entre el colofón y el siguiente caso (P2-5). |
| Pliegue 390 (ES, EN, Andes) | **7,3** | La ficha entra en el pliegue, sobre el dock, y «Secciones» reemplaza a Contacto. En EN, «Sports Sector Platform» se traduce bien y el resto no se filtra. Pero el título largo ocupa 3 líneas a 48 px («Naowee — / Plataforma del / sector deportivo»), cuando la maqueta pone «Naowee» en una sola, y empuja la cubierta bajo el dock (P1-1). |
| Página entera 390 (Naowee) | **7,8** | La prosa de 16 px tiene buena medida (≈ 38 caracteres) e interlineado. Las decisiones van en losas apiladas y el proceso en riel vertical con número Doto. En el siguiente caso, las cifras «400+ 2.000+» dejan «18» huérfano en una segunda línea (P2-2). |
| Hoja 1440 / 390 | **8,3** | Es el mismo cuerpo: título `h2` a 60 px en 3 líneas, ficha a la derecha, sin índice, el botón «Abrir como página completa» y Cerrar. A 390, el botón «Secciones» flota al pie. Hereda P1-1 y P1-2, y a 390 la píldora «Secciones» tapa el botón de reproducir de la cubierta (P2-4). |
| 404 (sitio y caso) | **8,8** | Lienzo B con resplandor, ceja «404 · Página no encontrada», «Aquí no hay nada.» en Urbanist grande, cuerpo en `--tinta-2` y tres salidas con jerarquía (primaria clara + 2 fantasma). La línea EN de apoyo («404 · Page not found · Go home») tiene sentido para quien llega del otro idioma, pero en la página ES pesa casi como el cuerpo (P2-6). |
| **Conjunto** | **7,6** | La ingeniería es alta: 502/502 dos veces, sin pérdida de contenido frente a F6, JS de `/` en +0,1 KB y la ficha y el tablero medidos por prueba. La pieza ya es de B en el chasis (tipografía, tokens, ficha, tablero, colofón, siguiente caso). Los fallos se concentran en lo que un reclutador ve primero: el título y la cubierta. A eso se suma una capa de F0 que se nota dentro del cuerpo. Con los P1 resueltos, sube a ≈ 8,7. |

---

## 2. Arreglos priorizados

### P0 · bloquea

Ninguno. No hay pérdida de contenido, ruptura de foco ni contraste por debajo de AA, y el orden del DOM es el aprobado.

### P1 · importantes

**P1-1 · El título del caso es el `project` largo, no el nombre: se pierde el golpe de 120 px del pliegue.**
- **Evidencia.**
  - Pliegue 1440: la maqueta pone «Naowee» a 120 px en una línea. F7 pone «Naowee — Plataforma del sector deportivo»
    a 72 px en 2 líneas (`CaseHeader.tsx:43`, `data-largo` si `project.length > 18`).
  - A 390 son 3 líneas a 48 px, y la cubierta queda bajo el dock. En la hoja de 1440 son 3 líneas a 60 px.
  - Con la lente de reclutador, el nombre del producto deja de ser la imagen y pasa a ser una frase. El descriptor
    («Plataforma del sector deportivo») repite lo que el gancho ya dice («Digitalizar cómo Colombia gestiona su
    deporte…»).
  - El nombre corto ya existe: es el de la miga (F6 P1-5).
- **Arreglo.**
  1. El `h1` (y el `h2` de la hoja) usa el **nombre corto** de la miga, a 120 / 72 (hoja 72 / 48), como en la maqueta.
  2. El descriptor va en la ceja: «Naowee · Head of Product · Plataforma del sector deportivo», o bien se omite porque
     el gancho ya lo cubre.
  3. Mantener `data-largo` solo como red para nombres cortos de más de 18 caracteres. Hoy, «Andes Design System» (19)
     ya cabe a 120 en col 1–7 si se mide; conviene subir el umbral o medir el ancho real.
  4. `<title>` y OG siguen con `project` completo (SEO).
  5. Prueba: en `caso.spec`, a 1440 el `h1` cabe en ≤ 2 líneas y su `font-size` es 120 en los casos de nombre de
     una palabra; a 390, la ficha y el borde superior de la cubierta caben sobre el dock.

**P1-2 · La cubierta no es una «captura a sangre» en losa: es la película de F0 con marco de ventana, un velo y radios
no concéntricos.**
- **Evidencia.**
  - Recorte de la cubierta de Naowee: marco oscuro con barra de ventana «○○○ NAOWEE · IVC» de radio ≈ 8, y dentro un
    póster de radio ≈ 24. `caso.css:159` aplica `--r-m` al `video`/`img` dentro de un marco que no lo comparte, así
    que las esquinas no son concéntricas y se ve el hueco.
  - El blanco de la UI llega a 209–215 de 255: el póster va bajo un velo (≈ 18 %) para el botón de reproducir
    central. Eso apaga justo el elemento que el plan define como LCP de la página completa.
  - La maqueta muestra la captura nítida, blanca, en losa de radio `--r-losa`, sin cromo de ventana ni botón.
  - Debajo quedan el chip «▷ REPRODUCIR» y el pie «/ RECORRIDO — SIN SONIDO» en mono y mayúsculas espaciadas.
- **Arreglo.**
  1. En `.caso-cubierta`, la cubierta es una **imagen estática** a 16:8 en losa (`--r-losa`, `overflow: hidden`, el
     radio en el contenedor, no en la imagen), `fetchpriority="high"`, sin barra de ventana y sin velo. Usar el
     `cover` del caso o el póster de la película.
  2. La película pasa al bloque **Producto** (es lo que dice el plan en el punto 8: «`video` con póster, `controls`…
     en este bloque»). Ahí puede llevar su botón de reproducir, sin velo sobre el póster, solo una sombra local bajo
     el botón.
  3. El pie de la película va en Instrument Sans, `--tinta-3` y caja normal («Recorrido · sin sonido»).
  4. Prueba: la luminancia máxima de la cubierta de Naowee ≥ 245; el radio del contenedor es igual a `--r-losa` y el
     de la imagen es 0 (o igual al del contenedor menos el padding).

**P1-3 · Los `h2` del cuerpo son rótulos, no titulares: el cuerpo largo pierde la jerarquía de la maqueta.**
- **Evidencia.**
  - En la maqueta, cada bloque lleva una ceja pequeña más un titular de 30 px que cuenta algo:
    «Problema / Un sector que funcionaba con archivos», «Mi parte / Dirijo el producto y construyo el prototipo»,
    «Decisiones / Tres reglas que sostienen la plataforma», «Proceso / Del archivo al prototipo firmado»,
    «Producto / Así se despeja hoy un trámite vencido».
  - F7 pinta solo «Problema», «Mi parte», «Decisiones», «En detalle» y «Proceso» como `h2`, sin ceja, y el índice
    lateral ya repite esos mismos rótulos.
  - Quien escanea (lente de reclutador) se queda sin la historia en los titulares. Además, la columna izquierda con
    una sola palabra deja un vacío grande junto a la prosa (Andes, «Problema» y «Mi parte» a 1440).
- **Arreglo.**
  1. Añadir a `work.ts` (ES/EN) un campo opcional `heads: { context?, contributions?, decisions?, product?, process? }`.
  2. Con dato: ceja = rótulo (12–14 px, `--tinta-3`) y `h2` = titular. Sin dato: como hoy (no se inventa copy).
  3. Para Naowee, el copy ya está escrito y aprobado en `propuestas/B-paginas/caso.html`: cargarlo. Para los otros
     casos, el ejecutor propone borradores sacados del texto del propio caso y los marca para Doug (§ preguntas
     abiertas).
  4. El índice lateral sigue con los rótulos cortos.

**P1-4 · Las bandas heredadas siguen en el idioma de F0 dentro de la pieza B (desvío 2).**
- **Evidencia.**
  - En Naowee 1440 y 390: pie «/ RECORRIDO — SIN SONIDO» y chip «▷ REPRODUCIR», en mono, mayúsculas y tracking.
  - Galería «En detalle» con marcos de ventana de puntos y etiqueta «NAOWEE · ESCENARIOS» / «NAOWEE · PROJECT» en
    mayúsculas, numeración «0 1» en mono y pies en `--tinta-3` pequeños.
  - El plan pide para F7 «`src/components/work/*` (marcos sobre losas)». La maqueta presenta las capturas de
    producto como losas limpias de radio `--r-losa` con el pie en Instrument Sans.
  - Para un director de diseño, la página cambia de sistema a mitad del scroll.
- **Arreglo.** Mínimo para cerrar F7 (lo extenso de olbo, DC Medical y MakeaPet puede quedar para F8):
  1. Los marcos de `CaseGallery` y de la película pasan a ser una losa (`--losa`, `--filo`, `--r-losa`, imagen a
     sangre dentro), sin la barra de ventana. Si la barra se queda por identidad, debe tener radios concéntricos y la
     etiqueta en caja normal.
  2. Ninguna ceja ni pie dentro de `.caso-b` en mayúsculas espaciadas ni en mono. Hoy hay restos que la regla del
     desvío 2 no alcanza.
  3. La numeración de la galería va en Doto, como el riel del proceso, o se quita.
  4. Prueba: dentro de `.caso-b`, ningún elemento de texto con `text-transform: uppercase` ni con `font-family` mono,
     salvo Doto.

### P2 · pulido

**P2-1 · «~» en Doto se lee como dos puntos altos («˙˙1.200»).** En el recorte del tablero, la virgulilla de Doto no se
reconoce a 48–56 px. Arreglo: pintar el «~» en Urbanist a 0,6 em, alineado a la línea media, o usar «≈». Ajustar
`anchoCifras()` si cambia el ancho.

**P2-2 · Cifra huérfana en el siguiente caso a 390.** «400+ 2.000+» y «18» en la línea siguiente. Arreglo: a < 1024,
mostrar 2 cifras en lugar de 3, o `white-space: nowrap` en el grupo con el tamaño ajustado por `cqi`, como en el
tablero.

**P2-3 · Bordes inferiores dentados en el tablero cuando una losa trae `delta`.** En Andes, la cuarta losa es más alta.
`align-items: start` cumple «mide lo que lleva», pero la fila queda escalonada, que es justo lo que la ficha evita.
Arreglo: `align-items: stretch` con el contenido arriba. La losa sigue sin `min-height` y la prueba de «alto =
contenido + padding» se cambia por «alto = el de la fila».

**P2-4 · El botón «Secciones» de la hoja a 390 tapa el contenido.** La píldora blanca centrada cae sobre la cubierta y
el botón de reproducir. Arreglo: anclarla a la derecha, como un FAB de 48 px con icono más el rótulo `sr-only`, o
mostrarla solo después de pasar la portada.

**P2-5 · Pie del caso.** El «© 2026 Doug Vargas» queda suelto entre el colofón y «Siguiente caso». La maqueta cierra
con una fila de pie completa («© 2026 Doug Vargas · Barranquilla · UTC-5 · Diseñado por mí… · Volver arriba») debajo
del siguiente caso. Arreglo: sacar el © del colofón y usar el pie B del sitio al final.

**P2-6 · 404: la línea en inglés pesa como el cuerpo.** Bajar a 12 px en `--tinta-3`, con `lang="en"` en ese nodo
(comprobar que esté).

**P2-7 · Duración «En curso» en Naowee.** La maqueta dice «Ene 2026 — Hoy». Con la lente de reclutador, «En curso» no
dice cuánto. Arreglo de dato: usar el periodo si existe (`period`), con «— hoy».

**P2-8 · Dos tintas para la misma prosa.** El cuerpo de «Problema» sale en `--tinta-2` (≈ 194/255), mientras que
los `li` de «Mi parte» se ven blancos (≈ 255) en toda la línea, no solo en el arranque en negrita. Arreglo: el cuerpo
de los dos bloques en `--tinta-2` y solo el arranque `strong` en `--tinta`.

---

## 3. Lo que está bien (no tocar)

- La ficha 2 × 2 sin escalera, con filetes de 1 px y Equipo a todo el ancho. Se cumple en las 6 vistas, ES y EN.
- El tablero: la losa clara primero, la cifra Doto con el mismo tamaño en todo el caso, una sola línea y el punto de
  miles en ES. Remata la portada como en la maqueta.
- El índice lateral: col 1–2, sticky, solo con las secciones presentes, y ausente en la hoja y por debajo de 1280.
- La medida de la prosa (≤ 34 em, ≈ 60–68 caracteres a 1440) y el interlineado. El riel de proceso con el hilo láser.
- El siguiente caso en losa jelly con las cifras Doto, más la losa clara «¿Quieres verlo en detalle?».
- La 404 en B, con el copy D17 y las tres salidas.

---

## 4. Arreglar antes de F8 (P0 + P1)

1. **P1-1** El `h1` y el `h2` de la hoja con el nombre corto, a 120 / 72 (48 en móvil); el descriptor en la ceja o
   fuera. Prueba de líneas y de pliegue a 390.
2. **P1-2** La cubierta como imagen estática en losa a sangre (radio en el contenedor, sin barra de ventana ni velo,
   `fetchpriority="high"`). La película pasa a Producto con el pie en caja normal. Prueba de luminancia y radios.
3. **P1-3** Campo opcional `heads` en `work.ts` (ES/EN): ceja + titular cuando hay dato. Copy de Naowee tomado de
   `caso.html`; borradores para el resto, marcados para Doug.
4. **P1-4** Marcos de la galería y de la película como losas B, y sin mayúsculas espaciadas ni mono dentro de
   `.caso-b`. Prueba de estilo computado.

Después de arreglar, rehacer `completa-` y `entera-` de Naowee y Andes (1440 y 390, ES y una EN) y
`hoja-naowee-suid-es-{1440,390}`.
