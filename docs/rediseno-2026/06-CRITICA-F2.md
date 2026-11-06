# 06 · Crítica de F2 (rutas `/work`, `/about`, `/experience`)

> Crítico / QA visual · 6 nov 2026 · objeto: el código de F2 en la rama `claude/douguizard-portfolio-redesign-9ivnau`
> (`F2-INFORME.md`, desvíos 1–15) y sus capturas `F2-capturas/`, frente a las maquetas aprobadas
> `propuestas/B-paginas/shot_P_*`. Método: refactoring-ui (jerarquía, espaciado, alineación) y web-design-guidelines
> (foco, RM, contraste, móvil), con el criterio de aceptación y la línea **QA.** de `07` §F2. Se compararon a pares
> (código arriba, maqueta abajo) los pliegues a 1440 y 1280×720 de las tres páginas, los de 390, `experience-*-050`,
> `about-1440-p030/p070/p100` contra `shot_P_about_1440_losa` y `about-1440-completa` contra su maqueta. No se levantó
> el sitio: lo que dicen las capturas y el código bastó, y las pruebas del ejecutor ya miden foco, contraste y RM.
>
> **Fuera de alcance (esperado, no cuenta):** la cabecera, el rail y el dock son los actuales hasta F3 (en las capturas
> salen en tema claro sobre páginas oscuras); el vidrio estriado de `/about` es un hueco hasta F3/F4; `/NN` y años del
> eje en Instrument (desvío 3, ya pedido en P2-1 de F1 y P2-14 de páginas); el nombre a 96 px a 1280×720 (regla
> ≤ 800 px de alto de `NameLockup`, desvío c): cabe y conserva la jerarquía, se acepta.

---

## 1. Veredicto por página

| Página | Nota | Veredicto (escritorio · móvil) |
|---|---|---|
| `/work` | **8,6** | Fiel a la maqueta casi al píxel: cabecera de 12 columnas, «En cifras» en losa clara, filtro en el flujo, Naowee oscura con captura, Andes jelly azul, numeración /01…/10 en orden. Los P1 de la crítica de páginas (numeración, filtro fijo, pliegue móvil) no reaparecen. Solo pulido. |
| `/about` | **7,6** | La jerarquía y la mitad baja son las de la maqueta (títulos de «Lo que hago» alineados, marcas 2 × 4, «Citas originales en inglés» en la base del H2, un solo láser a 390). El haz cae en el corte de «Vargas» a 1440 y 1280. Pero sin el vidrio que las tapaba en la maqueta, **se ven las costuras del póster**: dos bordes verticales duros en p = 0 y tres rectángulos en la transición. Es lo primero que se ve de la página. |
| `/experience` | **8,5** | Odómetro, eje, tramos, cabezal y pista como en la maqueta, a 1440 y a 1280×720 (cabe). Abre sin «0 · 0 · 0», la pista no pisa los años, los inactivos de móvil son legibles y el foco por Tab está probado. Queda un fundido cruzado que superpone dos hitos durante el cambio. |
| **Conjunto** | **8,2** | F2 entrega lo aprobado. Con P1-1 resuelto, `/about` sube a ≈ 8,5 y el conjunto a ≈ 8,5, el objetivo antes de F3. |

Conteo: **0 P0 · 2 P1 · 6 P2**.

**Comprobación de los P0/P1 de `06-CRITICA-PAGINAS.md` en el código:** P0-1 (Tab invisible) resuelto y probado
(`experience.spec`, `trayectoria.css:422` `:focus-within` sin transición). P1-1 numeración, P1-2 filtro fijo, P1-3
pliegue móvil, P1-4 una sola cuenta, P1-7 dos láseres en móvil, P1-8 «0 · 0 · 0», P1-9 scroll por hito, P1-10 cabe a
1280×720, P1-11 inactivos ilegibles, P1-12 pista sobre años y P1-13 alineación de `/about`: **ninguno reaparece**
(capturas `work-1440-pliegue`, `work-390-pliegue`, `about-390-pliegue`, `about-1440-completa`,
`experience-1280x720-050`, `experience-390-pliegue`). P1-5/P1-6 son del caso (F7).

---

## 2. Arreglos priorizados

**P0** bloquea. **P1** importante. **P2** pulido. Evidencia → zona y línea → valor → por qué.

### P0 · bloquea

Ninguno.

### P1 · importantes

**P1-1 · `/about` (≥ 1024): el póster tiene bordes duros; la foto no se integra con la atmósfera ni con el láser.**
- **Evidencia.**
  - `about-1440-pliegue.jpg`: costuras verticales en x ≈ 443 y x ≈ 1323; a la izquierda, el negro del velo; a la
    derecha, una franja más oscura. El halo del haz de la foto se corta en seco en x ≈ 1323 y sigue, más apagado, en la
    atmósfera.
  - `about-1280x720-pliegue.jpg`: lo mismo en x ≈ 432 y x ≈ 1137.
  - `about-1440-p030.jpg`: durante el paso a losa se ven **tres** rectángulos (fondo, atmósfera desde x ≈ 275 y póster),
    cada uno con su borde.
  - En la maqueta (`shot_P_about_1440_pliegue`) el vidrio estriado tapa esas costuras; en F2 el vidrio es un hueco
    (desvío 13), así que el defecto queda a la vista hasta F3/F4.
- **Causa.** `perfil.css:185-191`: en `cine` el póster es `height: 130%` con ancho natural (880/1168 → ≈ 880 px a
  900 de alto), centrado al 62 %; la atmósfera `perfil.css:32-38` es la misma foto con `brightness(0.5)` y `blur(40px)`:
  el salto de luminancia de 1 a 0,5 es la costura.
- **Zona y valor.**
  1. Fundir los bordes del póster solo en la escena: en `.perfil-cine .poster` (`perfil.css:187`)
     `mask-image: linear-gradient(90deg, transparent 0, #000 var(--pluma), #000 calc(100% - var(--pluma)), transparent 100%);`
     con `--pluma: 18%` en p = 0. La isla (`PortadaPerfilCliente.tsx`, donde ya escribe estilos por p, ~L100–115)
     lleva `--pluma` de 18 % a 0 entre p = 0 y 0,6, para que en la losa (radio 48) el borde vuelva a ser limpio.
  2. Acercar la atmósfera al tono de la foto: `filter: blur(28px) brightness(0.72) saturate(1.05)` (`perfil.css:37`).
     Con la máscara el salto ya no se nota y el haz se apaga sin corte.
  3. Verificar a 1440×900, 1280×720 y 1920×1080 en p = 0, 0,3 y 0,7: ninguna columna de 1 px con un salto de
     luminancia > 8 % en la banda y = 20–80 % (lectura de píxeles en Playwright), y que el láser de 1 px sigue en la
     rendija (la prueba actual de `about.spec`, |Δ| ≤ 2 px).
- **Por qué.** El encargo es «sin máscara ni revelado; foto + láser + nombre» como una sola imagen. Un rectángulo
  pegado sobre otro rompe esa unidad y es lo primero que ve quien entra a `/about`. No conviene esperar a F4: sin WebGL o
  con RM el vidrio no estará, y el respaldo debe verse bien solo.

**P1-2 · `/about` (móvil): el criterio «LCP < 2,0 s» de F2 no se cumple (2.560 ms) y no tiene dueño formal.**
- **Evidencia.** `F2-INFORME.md`, tabla de rendimiento y desvío 9; el criterio está en `07` §F2 (`/about`, `perf.spec`).
  El ejecutor ya hizo lo razonable en código: `preload` con `imageSrcSet`/`imageSizes` y `fetchPriority="high"`
  (`hero/HeroPoster.tsx:33-50`), `sizes="(min-width: 1024px) 880px, 160vw"` (`PortadaPerfil.tsx:36`), atmósfera solo en
  la escena.
- **Zona y valor.** No es un arreglo de código en F2: el orquestador debe **mover el criterio** en `07` (F2 → F4 con el
  póster horneado, y F8 con el presupuesto de `perf.spec`) y dejarlo escrito, o pedir a F3 un póster móvil de 440 px a
  calidad baja como primer pintado (`srcset` 440/640, ≈ 10 KB). Recomiendo moverlo: con 562 ms de latencia el límite
  son los viajes, no el peso.
- **Por qué.** Un criterio de aceptación incumplido sin decisión registrada se pierde; en F8 nadie sabrá si 2,5 s era
  aceptado.

### P2 · pulido

**P2-1 · `/experience` (escritorio): el cambio de hito superpone los dos textos.** `experience-1440-050.jpg`: bajo
«Globant · Royal Caribbean» y tras «ingeniería en EE. UU.» se lee el hito saliente a media opacidad, y «Ver caso» sale
gris. Causa: `trayectoria.css:404-418`, entrante y saliente se cruzan en la misma caja (`inset: 0`) con 240 ms cada uno.
Valor: el saliente sale en 120 ms sin retraso y el entrante entra en 240 ms con `transition-delay: 100ms`
(`.exp-cine .hito.activo { transition-delay: 100ms, 100ms }`), así nunca hay dos textos legibles a la vez. Mantener
`:focus-within` sin transición (desvío 12).

**P2-2 · `/about` (≥ 1024): el indicador «Desliza» sigue encima de la losa en p = 0,7.** `about-1440-p070.jpg`: la
barra y el texto, en x ≈ 1410, montan sobre la foto ya encogida. `PortadaPerfilCliente.tsx:115` lo apaga entre p 0,8
y 0,95. Valor: `1 - clamp((p - 0.15) / 0.2)` (desaparece al empezar el paso a losa: ya cumplió su función).

**P2-3 · `/about`: «Leer el caso de Banco de Occidente».** `about-1440-completa.jpg`, primera cita; la maqueta decía
«del Banco de Occidente». `i18n/paginas.ts:73` arma `Leer el caso de ${cliente}` para todos. Valor: que el dato traiga
la forma con artículo (`clienteCita: "del Banco de Occidente" | "de Qrvey" | "de Royal Caribbean"`) o
`leerCasoDe(cliente, articulo?)`. EN (`paginas.ts:175`) está bien.

**P2-4 · `/work` (390): el último filtro se corta sin aviso.** `work-390-pliegue.jpg`: «Anteri» cortado contra el
borde, sin indicio de que la fila se desplaza (igual en la maqueta). Valor: en el contenedor del filtro a < 1024,
`mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent)` y `scroll-padding-inline: 16px`; o que la
pastilla se parta en dos líneas a ≤ 400 px. Comprobar que el botón enfocado con Tab entra entero (`scrollIntoView`
nativo lo hace con `scroll-padding`).

**P2-5 · `/work` (1440): las cifras de Andes quedan más abajo que en la maqueta.** `work-1440-pliegue.jpg`: «400+» en
y ≈ 752 frente a ≈ 670 en `shot_P_work_1440_pliegue` (escala igual); queda una banda azul vacía de ≈ 150 px bajo la
descripción y «2.000+» cae al borde del pliegue. Valor: en la losa jelly de Andes, cifras con `margin-top: var(--e-48)`
en vez de empujarlas al fondo (`margin-top: auto`), o bien el chip «NDA» al fondo y las cifras justo tras el texto,
como la maqueta.

**P2-6 · `/about` · «Datos»: mayúsculas y cortes que la maqueta no tenía.** `about-1440-completa.jpg`: «Español
(Nativo)» (maqueta: «nativo») y «Inglés (B1 · Competencia profesional)» parte en dos líneas. Valor: minúscula tras el
paréntesis en ES (dato de `cv.ts`/`perfil.ts`) y la columna de etiqueta de `dl` a `max-content` con `minmax(0, 1fr)`
para el valor, que es lo que la maqueta usaba.

---

## 3. Lo que está muy bien y no se toca

- **Fidelidad.** Las tres páginas reproducen la composición, la rejilla, las superficies (losa clara, jelly azul,
  magenta única) y el orden de las maquetas aprobadas, a 1440, 1280×720 y 390.
- **Estado final como punto de partida.** Sin JS, sin GSAP o con RM, todo está completo; la clase `perfil-cine` /
  `exp-cine` antes del primer pintado evita el salto (CLS ≤ 0,0008).
- **El lockup en `/about`.** El haz de 1 px cae en la rendija de «Vargas» a 1440 y 1280 (medido ≤ 0,5 px) y el corte
  se cierra al bajar; en móvil, un solo láser y el nombre entero (P1-7 resuelto como se pidió).
- **Una sola cuenta.** 12 · 10 · 3 en `/work` y 12 · 6 · 10 al final de `/experience` salen de `cuentas.ts`; la pista
  y el filtro nombran los mismos 3 propios.
- **Doto solo en cifras.** En cifras, odómetro, acumulados, números de «Lo que hago» y «Cómo trabajo»; no en
  etiquetas ni en texto corrido.
- **Accesibilidad probada, no supuesta.** Tab sin paradas invisibles a tres tamaños, contraste de inactivos con su
  color efectivo, axe con y sin RM en las 6 rutas, `lang="en"` en las citas, anillo de foco `--foco` en filtro, filas y
  «Ver caso».
- **Peso.** Las páginas nuevas cargan menos JS que `/` y GSAP llega por `import()` después de `load`.

---

## 4. Arreglar antes de F3 (P0 + P1, en orden)

1. **P1-1** · `/about` ≥ 1024: fundir los bordes del póster con `mask-image` y `--pluma` 18 % → 0 (p 0 → 0,6) y
   subir la atmósfera a `brightness(0.72)` / `blur(28px)`; verificar sin costuras a 1280×720, 1440×900 y 1920×1080 en
   p 0 / 0,3 / 0,7, y que el láser sigue en la rendija.
2. **P1-2** · Orquestador: registrar en `07` que el LCP móvil de `/about` < 2,0 s pasa a F4 (póster horneado) y F8
   (presupuesto de `perf.spec`), o pedir el primer pintado de 440 px en F3.

Los P2 pueden ir con F3 (P2-1, P2-2 y P2-4 son de pocas líneas y conviene hacerlos con P1-1, en la misma sesión).
