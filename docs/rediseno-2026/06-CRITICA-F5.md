# 06 · Crítica de F5 (acto 1 «cine» y scroll anclado)

> Crítico / QA visual · 7 nov 2026 · objeto: el código de F5 en la rama `claude/douguizard-portfolio-redesign-9ivnau`
> (`F5-INFORME.md`, desvíos 1–10) y sus capturas `F5-capturas/`, frente a las decisiones vigentes de Doug en `ESTADO.md`
> («**sin máscara**; foto + vidrio estriado oblicuo 12°; el cursor solo abre/aclara el vidrio; lockup «corte láser» que
> se cierra al encogerse la foto») y al acto 1 de referencia `propuestas/B/shot_B_1440_pliegue.jpg`. Método:
> refactoring-ui (jerarquía, bordes, materiales), web-design-guidelines (foco, RM, móvil, recortes) y motion-design
> (continuidad, coreografía, ≤ ⅓ de elementos en movimiento), con los criterios y la línea **QA.** de `07` §F5.
> Se compararon `home-es-1440x900-p{0,03,06,1}`, `-rm`, `1280x720-p{0,03}`, `1920x1080-p0` y `390x844`; además,
> perfiles de luminancia con PIL en los bordes de la foto (1440 p0) y en el hueco nombre ↔ K2 (1280 p0). Código
> leído solo donde lo pedía un hallazgo: `src/components/escena/escena.css:101-187`, `src/lib/escena.ts:192`.
> No se abrió el vídeo `recordVideo` (no está en `F5-capturas/`), así que el snap y las curvas se juzgan por
> fotogramas y por `escena.spec`.
>
> **Fuera de alcance (esperado, no cuenta):** imagen final del héroe (D7, en pausa); fps en hardware real; WebKit y
> Firefox (F8); CLS móvil 0,066 (ya existía en F4, pendiente declarado); el láser que parte «Vargas» (es el lockup
> decidido por Doug).

---

## 1. Veredicto por vista

| Vista | Nota | Veredicto |
|---|---|---|
| Acto 1 · 1440×900 p0 | **6,8** | La composición de B está: nombre XL con el corte sobre el láser, K2 de vidrio oscuro abajo a la izquierda, «Desliza» a la derecha, láser de borde a borde. Pero la foto **no** va a pantalla completa. Es una columna de 881 px con **bordes duros** en x ≈ 443 y x ≈ 1324, el mismo defecto que se arregló en `/about` en F2 (P1-1). Frente a la referencia, que es foto y vidrio a sangre, se lee como «foto pegada sobre un fondo borroso» (P0-1). Además, las estrías y el halo del láser se comen los ojos (P1-2). |
| Acto 1 · 1920×1080 p0 | **6,5** | El mismo borde (x ≈ 652 y x ≈ 1710), ahora con 250 px de vacío gris entre el nombre y la foto. La foto se ve blanda: el póster de 640 px y la textura de 880 px van estirados en una caja de 1.058 px (P2-3). |
| Acto 1 · 1280×720 p0 | **6,9** | Cabe, pero justo. Entre el descendente de «Vargas» y el borde superior de K2 hay ≈ 5 px (el desvío 7 promete 16), y el pie de K2 queda cortado por el borde inferior del viewport (P1-3). |
| Ancla p 0,3 (1440 y 1280) | **5,0** | **El nombre XL desaparece**: K2 sube por encima de su trayectoria y lo tapa (P0-2). El fotograma junta tres capas sin relación (fondo negro, caja gris redondeada de la atmósfera y columna nítida con bordes duros) y el láser se corta en x = 1324 (P1-1). |
| Ancla p 0,6 | **7,8** | La llegada se lee bien: K2 ya blanca, K3–K5 en su sitio, nombre pequeño en K1 y estrías finas con la cara legible. El rail entra recortado y deja leer «in», «Bē» y «gh» a medias (P2-2). |
| OS p 1 vs RM | **8,6** | Idéntico al OS de F3 en losas, panel y láser `.os-laser`. Lo único distinto es el fondo: con RM hay degradado violeta arriba y en p 1 es negro plano (P2-4). |
| Móvil 390 | **8,2** | OS directo, sin pista ni nombre XL, láser sobre los ojos y K2 dentro del pliegue. Correcto. |
| **Conjunto** | **6,9** | La ingeniería es sólida: 436/436 ×2, GSAP después del LCP, red de seguridad a los 8 s, foco que salta al final, RM y sin JS → OS. Lo que falla es la **imagen**: el acto 1 no es la foto a sangre de B y el protagonista se pierde a mitad del viaje. Con P0 + P1 resueltos sube a ≈ 8,4. |

Conteo: **2 P0 · 3 P1 · 5 P2**.

**Lo que se comprobó y está bien:**
- Estrías oblicuas a 12° de p 0 a p 1, coherentes con `/about` y el móvil.
- El láser del acto 1 cae en la rendija del nombre a 1280, 1440 y 1920.
- K2 legible en vidrio oscuro: la tinta clara se lee sobre el velo.
- La entrada por tiempo es CSS con `fill-mode: backwards`, así que en reposo no queda nada en efecto.
- RM, sin JS y 390 → OS desde el primer píxel.
- El chunk de GSAP llega después del LCP.
- En p 1 no queda ningún estilo en línea: el OS es el de F3.
- La cabecera y sus píldoras no se mueven durante el ancla.

---

## 2. Arreglos priorizados

**P0** bloquea. **P1** importante. **P2** pulido. Evidencia → zona → arreglo → por qué.

### P0 · bloquea

**P0-1 · La foto del acto 1 tiene bordes duros a los lados: no es «foto a pantalla completa» y repite el P1-1 de F2.**
- **Evidencia.**
  - `home-es-1440x900-p0.jpg`, perfil de luminancia: en y = 150 salta de 24 a 52 en x ≈ 445; en y = 600 salta de
    50 a 26 en x ≈ 1324, en un solo píxel y sin degradado.
  - En `1920x1080-p0` el corte cae en x ≈ 652 / 1710, y en `1280x720-p0` en x ≈ 432 / 1137.
  - La causa está en `escena.css:171-179`: la foto mide `height: 130%` con `aspect-ratio: var(--foto-ar)` (0,75), así
    que siempre ocupa ≈ 0,98 × el alto del viewport, nunca el ancho. Fuera queda la atmósfera borrosa (`::before`,
    `blur(28px) brightness(.72)`), con otro tono y otra nitidez.
  - La referencia `shot_B_1440_pliegue.jpg` lleva foto y estrías **a sangre**: el vidrio es un plano continuo de
    borde a borde.
  - En F2 el mismo defecto en `/about` se arregló con `mask-image` (06-CRITICA-F2 P1-1). Aquí sube a P0 porque es
    el primer pliegue del home, la vista más importante del sitio.
- **Zona.** `src/components/escena/escena.css:155-179` (`.k1-foto::before`, póster y canvas en `cine`).
- **Arreglo.**
  1. **Fundido lateral.** En `:root.cine .k1-foto :is(.k1-poster, .vidrio-gl, .vidrio-css)` va
     `mask-image: linear-gradient(90deg, transparent, #000 var(--fx), #000 calc(100% - var(--fx)), transparent)`
     con `--fx: calc(14% * (1 - var(--p-foto)))`. Así el fundido existe en p 0 y desaparece cuando la foto llega a
     losa (p ≥ 0,72), y el OS queda píxel a píxel.
  2. **Atmósfera.** `brightness(.72)` → `.6` y algo más de `blur`, para que el empalme no cambie de tono.
  3. **Estrías en la atmósfera.** Lo ideal es que el plano del vidrio también estríe la atmósfera, como en la
     referencia. Con el canvas WebGL basta con dibujarlo a `100vw` en `cine` y que el shader muestree la atmósfera
     fuera de la foto. Si cuesta, el fundido del punto 1 es suficiente para cerrar el P0.
  4. **Prueba.** En `escena.spec`, a 1440 p 0, |Δlum| < 6 entre columnas vecinas en los bordes de la foto.
- **Por qué.** Doug pidió «foto + vidrio», no «foto sobre fondo». El borde duro parte la pantalla en tres franjas,
  achica la cara y le quita al acto 1 su escala de cine. Ya se pagó una vez en F2.

**P0-2 · A mitad del viaje (p ≈ 0,3) el nombre XL desaparece detrás de K2.**
- **Evidencia.**
  - En `home-es-1440x900-p03.jpg` y `1280x720-p03` no se ve «Doug Vargas» en ninguna parte.
  - En p 0 el nombre está en (24, 200). En p 0,6 ya está pequeño en K1, en (660, 740).
  - En p 0,3 su FLIP (`escena.ts:192`, `p2io(tramo(p, 0, 0,72))`, ≈ 20 % del recorrido) lo deja en ≈ (110, 300),
    justo donde K2 (x 68–596, y 282–682) ha subido. `.escena-nombre` tiene `z-index: 1` (`escena.css:103`) y K2
    pinta encima, con su `backdrop-filter`.
  - La prueba «K2 sin tapar el nombre» de `escena.spec` solo mide p = 0 y no lo ve.
  - Tampoco se puede verificar el cierre del corte en p 0,3 (`data-corte="cerrado"`): se cierra a ciegas.
- **Zona.** `src/lib/escena.ts` (tramos del nombre y de K2) y `escena.css:101-104`.
- **Arreglo.** Las trayectorias no se pueden cruzar: el nombre baja y va a la derecha mientras K2 sube.
  1. **Repartir el viaje.** El nombre hace el FLIP en 0 → 0,45 con `p2o` (sale rápido hacia la derecha, sobre la
     foto), y K2 empieza a subir en 0,15 (0,15 → 0,6) y no en 0.
  2. **Subir de capa el nombre.** Mientras `data-escena-fase="anim"`, `.escena-nombre` va por encima de K2 (z 3,
     mismo contexto de apilamiento). Si en algún fotograma se cruzan, se ve el nombre, que es el protagonista.
  3. **Prueba.** En `escena.spec`, para p ∈ {0,1 … 0,7}: `rect(nombre) ∩ rect(K2) = ∅`, o el nombre por encima en
     `elementFromPoint` de su centro.
- **Por qué.** Motion-design, continuidad del objeto: el FLIP solo vende «es el mismo nombre» si el ojo puede
  seguirlo. Hoy el nombre XL entra por arriba y reaparece pequeño en K1 sin transición visible, que es justo el
  momento firma de B y el cierre del corte láser.

### P1 · importantes

**P1-1 · El fotograma intermedio (p 0,3) es un collage: tres capas que no conversan y un láser que se corta.**
- **Evidencia.** En `1440x900-p03` conviven:
  - fondo negro;
  - una caja gris redondeada de x 190 a 1324 (la atmósfera `::before` con `inset: -10%`, que se recorta con la caja
    de la foto);
  - la columna nítida, de x 477 a 1279, con sus bordes duros;
  - el láser, que empieza detrás de K2 (x ≈ 596) y acaba en seco en x = 1324.
  - Tampoco ayuda K2: de 0,30 a 0,41 hace a la vez el cambio de material, el viaje y la escala.
- **Arreglo.**
  1. El fundido de P0-1 resuelve la columna.
  2. La atmósfera se funde con `--atm` en 0 → 0,35, y no más tarde, para no ver nunca la caja gris sola.
  3. El láser sigue a todo el ancho del viewport hasta que entra `.os-laser` (0,8), con la alfa bajando, en lugar
     de cortarse en el borde de la caja.
- **Por qué.** «Nada que salte»: en scrub cada fotograma intermedio es una pantalla real que el usuario puede dejar
  quieta.

**P1-2 · Las estrías a pantalla completa y el halo del láser deforman demasiado la cara en el acto 1.**
- **Evidencia.** `1440x900-p0` y `1920x1080-p0`:
  - Las franjas, de ≈ 64 px a 12°, cizallan la barba y la boca 8–10 px (la mitad izquierda del mentón «baja»).
  - Una costura cae otra vez en el eje de la nariz (el P2-1 de F4 sigue abierto).
  - Los ojos quedan dentro de una banda roja saturada de ≈ 30 px de alto: se leen como dos manchas rojas, no como
    mirada.
  - En la referencia `shot_B_1440_pliegue` la cara sale más pequeña, las franjas son más finas en proporción y los
    ojos se leen.
  - En p 0,6, con franjas de ≈ 30 px, la cara es claramente más legible: el problema es el estado `cine`.
  - Se ven además costuras punteadas finas en las aristas, el residuo del dentado de F4 P1-2 (P2-5).
- **Zona.** `src/data/hero.ts` (`cine`), `lib/escena.ts` (`vidrioEnEscena`) y el halo de `.k1-laser`.
- **Arreglo.**
  1. En `cine`, `fuerza` × 0,6 dentro de una elipse centrada en la cara (ojos–boca) que se funda a 1 fuera de ella.
     Es un uniforme más en el shader, igual que la lente.
  2. Fijar la `fase` para que el **centro** de una franja, no una costura, caiga en el eje de la nariz. Así se cierra
     también F4 P2-1.
  3. El halo del láser sobre la foto va con la mitad de alto y alfa ≤ 0,55 en la banda de los ojos. La línea de 1 px
     se queda.
  4. Rehornear el póster `cine`.
- **Por qué.** El acto 1 presenta a una persona. Si los ojos no se leen en 5 s, el vidrio deja de ser un material
  y pasa a ser un filtro de distorsión. La decisión de Doug es «el cursor abre/aclara el vidrio», lo que supone que
  sin cursor el vidrio ya deja ver la cara.

**P1-3 · A 1280×720 el acto 1 no respira: K2 casi toca «Vargas» y queda cortada abajo.**
- **Evidencia.**
  - `1280x720-p0`: el descendente de la «g» de «Vargas» termina en y ≈ 341 y el borde superior de K2 está en
    y ≈ 347. Son ≈ 5 px frente a los 16 que promete el desvío 7.
  - El pie de K2 (radio y padding inferior) sale del viewport: la fila 719 todavía es la superficie de K2.
  - Los CTA se ven, pero la losa está recortada. El criterio de 07 es «sin recortes» y 1280×720 es el portátil
    típico.
- **Arreglo.**
  1. Con alto ≤ 800, K2 compacta: padding 24 → 20, el bloque «Hoy, Naowee…» a una sola línea o fuera, y CTA
     pegados al texto. Hoy hay ≈ 80 px de vacío entre el párrafo y los CTA, también a 1440 (ver P2-1).
  2. Medir la distancia con el **descendente**, no con la caja de línea: `getBoundingClientRect` de la línea 2 más
     0,25 em, más 16.
  3. Prueba de pie: `K2.bottom ≤ innerHeight − 16` a 1280×720 y 1366×768.

### P2 · pulido

- **P2-1 · K2 con vacío interno.** A 1440 hay ≈ 80 px muertos entre «…en 18 países.» y los CTA, lo que no aporta
  jerarquía (refactoring-ui: el espacio tiene que agrupar). CTA a 32 px del texto. Esto da aire a P1-3.
- **P2-2 · El rail entra recortado** (p 0,6): «in», «Bē» y «gh» se leen a medias en el borde. Que entre con
  opacidad 0 → 1 y `x` −24 → 0, no desde −112 px fuera de pantalla.
- **P2-3 · Foto blanda a ≥ 1440 y en retina.** Póster de 640 px y textura de 880 px en una caja de 881 (1440) o
  1.058 px (1920): ×1,2–2,4 a DPR 2. Está atado a D7: cuando llegue el máster ≥ 1920, `sizes` del póster del acto 1
  a `100vh*0,98` y textura de 1.760 px. Registrarlo en pendientes.
- **P2-4 · El fondo cambia entre el ancla y RM.** En p 1 el fondo es negro plano. En RM (y en F3) lleva un degradado
  violeta arriba. La escena tapa o quita el fondo del body y no lo devuelve en `data-escena-fase="os"`.
- **P2-5 · Costuras punteadas en las aristas de las estrías** (1440 p0, junto a la nariz y la gorra): el dentado de
  F4 P1-2 sigue visible a la escala de `cine`. Subir el ancho del `smoothstep` de la arista con la escala de la
  estría.
- *(Para verificar, no cuenta)*: a 1440 el interlineado del lockup XL deja la «g» de «Doug» rozando la «V» de
  «Vargas», y «Vargas» arranca 18 px a la izquierda de «Doug» (x ≈ 12 contra 30). Si no es intencional del corte
  (opción 4 de `B-tipo`), alinear los bordes izquierdos y dar 0,02 em más de interlínea.

---

## 3. Arreglar antes de F6 (P0 + P1)

1. **P0-1** Fundido lateral de la foto del acto 1 (`mask-image` ligado a p) y atmósfera más oscura. Lo ideal:
   estrías también sobre la atmósfera. Con su prueba de Δlum.
2. **P0-2** El nombre XL no puede quedar tapado por K2 durante el viaje: tramos repartidos (nombre 0 → 0,45; K2
   0,15 → 0,6), nombre por encima en `anim` y prueba de intersección en p 0,1…0,7.
3. **P1-1** Fotograma intermedio limpio: atmósfera fuera antes de 0,35 y láser a todo el ancho hasta 0,8.
4. **P1-2** Cara legible en `cine`: fuerza atenuada sobre la cara, centro de franja en el eje de la nariz y halo del
   láser a la mitad sobre los ojos. Rehornear el póster `cine`.
5. **P1-3** 1280×720: K2 compacta, 16 px medidos desde el descendente y K2 entera dentro del viewport (prueba a
   1280×720 y 1366×768).

Después de arreglar: rehacer las capturas 1440 p0/p03/p06, 1280 p0/p03 y 1920 p0, y adjuntar por fin el vídeo
`recordVideo` del ancla a 1440 para juzgar snap y curvas.
