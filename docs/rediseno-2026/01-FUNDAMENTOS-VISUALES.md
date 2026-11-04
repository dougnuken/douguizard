# 01 · Fundamentos visuales (investigador visual)

> Destilado de RonDesignLab y de las referencias de Doug (`referencias/ref-1` a `ref-4`) en reglas que se pueden
> construir. Leer junto con `00-BRIEF.md`. Los valores de color salen de **muestrear los píxeles de las referencias**
> (promedio 9×9 px con PIL) y después se ajustaron para pasar contraste AA. Los contrastes están calculados con la
> fórmula WCAG 2.x, no estimados.

---

## 0. Qué pude ver y qué no

| Fuente | Resultado | Qué saqué |
|---|---|---|
| `dribbble.com/RonDesignLab` (perfil y shots) | **No cargó.** El dominio está fuera de la red permitida de esta sesión (`ENOTFOUND`). | Nada directo. Para estudiar shots hay que permitir `dribbble.com` y `cdn.dribbble.com` en la configuración de red del entorno. |
| `instagram.com/p/DRzmIiKgoiO` (revelado por capas) | **No cargó** (mismo bloqueo, `www.instagram.com`). Tampoco está indexado por buscadores. | No vi el post. Describo el efecto por el brief y por técnicas equivalentes documentadas (§3.5). |
| Behance, sitio propio, Instagram del estudio | Bloqueados por la misma política. | Solo datos indexados por búsqueda. |
| Búsqueda web | Funcionó. | RonDesignLab es un estudio de UX/UI fundado en 2015 con sede en Cracovia (Polonia) y Odesa (Ucrania). En Dribbble figura como equipo «RonDesignLab ⭐️ Poland», con ~23 k seguidores, y en Behance tiene ~74 k seguidores. Trabaja sobre todo fintech, salud, IA y VR. Hay shots firmados por miembros («Jack R. for RonDesignLab», «Victa Wille for RonDesignLab»). |
| Las 4 referencias de Doug | **Vistas a fondo**: muestreo de color, recorte de tipografía, comparación de fuentes renderizadas. | Es la base real de este documento. Son fotogramas de un carrusel de video de Instagram («8/10», ícono de silencio, marca de agua «RON DESIGN»), así que el original tiene motion. |

Las imágenes de shots de Dribbble no se descargaron porque no había acceso. La carpeta `referencias/dribbble/` no se creó.

**Comparaciones que sí corrí** (renders locales en el scratchpad, no en el repo): Urbanist y Outfit contra el texto de
ref-1 y ref-2, y Doto (ejes `ROND`/`wght`), Sixtyfour y DotGothic16 contra el `$10,200 · 02 Jul` de ref-1. Los
resultados están en §4.

---

## 1. Lectura de las referencias (lo que se ve, medido)

| Ref | Qué es | Rasgos accionables |
|---|---|---|
| **ref-1** Upcoming Payments | Losa vertical «jelly» azul sobre una foto **enorme y con blur de movimiento** de una figura corriendo. | Gradiente radial: núcleo azul noche `#0C1266`, aro azul `#3F6BD9`–`#5F8FE1`, base lavanda `#7C7FD0`. Borde interno brillante de ~2 px. Radio ≈ 13 % del ancho de la losa. Botón círculo blanco con ↗ en tinta, arriba a la derecha. Cifras dot-matrix (`$10,200`, `02`) con etiqueta pequeña debajo (`Adidas`, `Jul`), **cifra a la izquierda y fecha alineada a la derecha**. Gráfico de órbitas con trazo de 1 px, uno sólido y otro punteado. |
| **ref-2** Reeded glass bank | Retrato tras **vidrio estriado vertical** dentro de una losa con fondo claro lila (`#E1DFE9`). Abajo, losa negra (`#111516`) con lista. | Las franjas tienen **anchos irregulares** (de ~1,5 % a ~6 % del ancho de la losa): no es un patrón uniforme. Cada franja muestra una tajada desplazada y ampliada (los ojos se duplican) y en el borde inferior la imagen **se estira hacia abajo** (gotea). La pill «Bank Account» es de vidrio oscuro con bordes laterales más claros (efecto metal pulido). Botón círculo blanco con ⇋. El botón secundario «+» es un círculo gris oscuro sin borde. |
| **ref-3** Dashboard monitor | Escritorio con fondo negro puro (`#010101`), **retícula de puntos tenue**, resplandor violeta arriba (`#361976`→`#1C0E49`), rail de íconos y pills de navegación. | Rail vertical en pill negra (`#101010`). Acción principal en círculo **azul eléctrico `#2B56F3`**; el ítem activo es un círculo blanco. Nav en pills de texto, la activa es una pill blanca con texto en tinta. Losa magenta jelly (`#2A0D2C` núcleo, `#8E1F55`–`#A12F6A` aro). Gráfico de matriz de puntos (círculos llenos y vacíos). Chips de marca en pill oscura («Brands · logos · ›»). Contadores en círculo blanco (`12`, `8`). La losa con foto clara es la «losa blanca» que da respiro. |
| **ref-4** Phone brand tasks | Móvil: foto de una figura con chaqueta acolchada blanca detrás de un **vidrio estriado vertical regular**; tarjetas de vidrio gris encima. | Las franjas aquí son **regulares**, ~9–10 por ancho de pantalla, con una línea de luz de 1 px en un borde. El número `24` es enorme y **fino** (peso ~200), con la etiqueta de dos líneas a su lado. El vidrio gris (`#8A8B90` efectivo) lleva texto blanco, **que no pasa AA** (3,4:1). Hay que corregirlo (§2.3). El timeline de abajo tiene degradado azul→magenta y chips de evento de colores. |

**El gesto común de las cuatro:** la UI vive en losas muy redondeadas que **flotan sobre una imagen de una persona
tratada como material** (estriada, borrosa o ampliada). La foto nunca es un rectángulo plano: siempre está mediada por
vidrio, blur o recorte.

---

## 2. Paleta

### 2.1 Tokens base

Los nombres son propuestas para `globals.css` (Tailwind v4, `@theme`).

| Token | Hex | Rol | De dónde sale |
|---|---|---|---|
| `--vacio` | `#060608` | Fondo de página (casi negro, neutro frío) | ref-3 `#010101`, subido un punto para que la retícula de puntos y las sombras se lean |
| `--losa` | `#111214` | Losa oscura base | ref-2 `#111516`, ref-3 `#101010` |
| `--losa-alta` | `#1A1B1F` | Losa oscura elevada / pill sobre losa | — |
| `--losa-borde` | `rgba(255,255,255,.08)` | Filo de 1 px de losas oscuras | — |
| `--claro` | `#F2F2F4` | Losa blanca (respiro) | — |
| `--niebla` | `#E4E2EC` | Losa clara lila, fondo de foto en estudio | ref-2 `#E1DFE9` |
| `--blanco` | `#FFFFFF` | **Solo** botones círculo, pill activa y contadores | ref-1/2/3 |
| `--tinta` | `#F5F5F7` | Texto principal sobre oscuro | — |
| `--tinta-2` | `#A1A1AB` | Texto secundario sobre oscuro | — |
| `--tinta-3` | `#8A8A95` | Terciario sobre oscuro (pie, metadatos) | mínimo que pasa 4,5 sobre `--losa-alta` |
| `--tinta-osc` | `#0E0E12` | Texto sobre claro y sobre blanco | — |
| `--tinta-osc-2` | `#55555F` | Secundario sobre claro | — |
| `--electrico` | `#2B56F3` | Relleno de acción principal (con texto blanco) | ref-3 rail, muestreado exacto |
| `--electrico-texto` | `#5B7CFF` | Azul **como texto o trazo** sobre oscuro | `#2B56F3` sobre `--vacio` da 3,59 y no pasa |
| `--magenta-texto` | `#FF5FA8` | Magenta como texto o trazo sobre oscuro | — |
| `--resplandor` | `#361976` | Glow violeta de fondo (radial, opacidad .35–.5) | ref-3 arriba |

### 2.2 Gradientes de losa (CSS de partida)

```css
/* Azul eléctrico «jelly» (ref-1) */
.losa-azul {
  background:
    linear-gradient(to top, #7C7FD0 0%, transparent 22%),                 /* base lavanda */
    radial-gradient(120% 75% at 50% 42%, #0C1266 0%, #1A2FB8 40%, #3F6BD9 72%, #7FA6EC 100%);
}
/* Magenta (ref-3) */
.losa-magenta {
  background:
    linear-gradient(to top, #A84D86 0%, transparent 26%),
    radial-gradient(110% 80% at 48% 45%, #2A0D2C 0%, #5E1640 38%, #8E1F55 66%, #B4407E 100%);
}
/* Vidrio gris (ref-4), corregido para AA */
.vidrio-gris {
  background: rgba(70, 71, 78, .62);            /* resultado efectivo ≈ #5E5F66 */
  backdrop-filter: blur(28px) saturate(140%);
}
```

Regla de uso: en el landing hay **una losa azul y una magenta como máximo**. El resto son oscuras, claras o con foto.
El color es un acontecimiento, no un fondo.

### 2.3 Contraste AA (calculado)

| Texto | Fondo | Ratio | Veredicto |
|---|---|---|---|
| `--tinta` `#F5F5F7` | `--vacio` `#060608` | 18,59 | AA/AAA |
| `--tinta-2` `#A1A1AB` | `--vacio` | 7,91 | AA |
| `--tinta-3` `#8A8A95` | `--losa` `#111214` | 5,49 | AA |
| `--tinta-3` `#8A8A95` | `--losa-alta` `#1A1B1F` | 5,04 | AA |
| `#7A7A85` (descartado) | `--losa` | 4,42 | **No pasa**. Por eso el terciario es `#8A8A95` |
| `--tinta-osc` `#0E0E12` | `--claro` `#F2F2F4` | 17,23 | AA/AAA |
| `--tinta-osc-2` `#55555F` | `--claro` | 6,59 | AA |
| `--tinta-osc-2` | `--niebla` `#E4E2EC` | 5,75 | AA |
| Blanco | `--electrico` `#2B56F3` | 5,63 | AA (botón principal) |
| `--electrico-texto` `#5B7CFF` | `--vacio` | 5,56 | AA |
| `--magenta-texto` `#FF5FA8` | `--losa` | 6,65 | AA |
| **Losa azul** · blanco | núcleo `#0C1266` | 16,23 | AA |
| Losa azul · blanco | aro medio `#3F6BD9` | 4,87 | AA (zona de títulos) |
| Losa azul · blanco | borde `#5F8FE1` | 3,23 | **Solo** texto ≥ 24 px |
| Losa azul · blanco | borde claro `#6F98E6` | 2,87 | **No pasa**: nada de texto en el último 10 % del borde |
| Losa azul · blanco | base lavanda `#7C7FD0` | 3,62 | Solo cifras dot-matrix ≥ 24 px. Etiquetas pequeñas sobre `#5A62B8` (5,42) |
| Losa azul · etiqueta `#9DB4F5` | núcleo `#0C1266` | 7,94 | AA (tinta tenue con el tono de la losa, no gris) |
| **Losa magenta** · blanco | aro `#B4407E` | 5,28 | AA |
| Losa magenta · blanco | `#8E1F55` | 8,48 | AA |
| Losa magenta · etiqueta `#F0B8D6` | `#8E1F55` | 5,06 | AA |
| **Vidrio gris** · blanco | `#8A8B90` (como en ref-4) | 3,40 | **No pasa**. La referencia falla aquí |
| Vidrio gris · blanco | `#5E5F66` (corregido) | 6,35 | AA |
| Vidrio gris · tinta oscura `#0E0E12` | `#8A8B90` | 5,67 | AA (alternativa: invertir) |

Reglas que salen de la tabla:

1. **Nunca gris sobre color** (Refactoring UI, regla 1). El texto tenue de cada losa de color es su propio tono aclarado
   (`#9DB4F5` en la azul, `#F0B8D6` en la magenta), igual que el «Adidas / Jul» de ref-1.
2. En las losas gradiente, el texto pequeño va **en la zona del núcleo o del aro medio**, nunca en el filo claro.
3. El vidrio sobre foto necesita un piso de oscuridad (≈ `#5E5F66` efectivo). Si no, sobre una foto clara el texto
   desaparece.

### 2.4 Proporción oscuro / claro / color

Medido a ojo en ref-3: ~70 % negro, ~15 % claro (pills, círculos, la losa con foto clara) y ~15 % color. El brief pide
más respiro blanco, así que propongo para el landing:

| Superficie | Proporción del área visible (desktop, primer pliegue) |
|---|---|
| `--vacio` + losas oscuras | **60–65 %** |
| Losas claras (`--claro`, `--niebla`, foto en estudio claro) | **25–30 %** |
| Color (azul, magenta, glow) | **≤ 10 %** |

El blanco puro (`#FFFFFF`) solo aparece en elementos pequeños y clicables: es la señal de «esto se toca».

---

## 3. Materiales

### 3.1 Vidrio estriado (reeded / fluted)

| Parámetro | Referencias | Propuesta para el héroe |
|---|---|---|
| Orientación | Vertical, 0° (ref-2, ref-4) | **Oblicuo 12°** (rango útil 8–16°; con más de 20° se vuelve truco y pelea con la lectura de la cara). El brief pide oblicuo. |
| Ancho de franja | ref-2: irregular, 1,5–6 % del ancho. ref-4: regular, ~10 % | Desktop 16:10 a 1280 px: **48–72 px** (18–24 franjas). Móvil 390 px: **28–40 px** (10–13). Mezclar 2–3 anchos con un patrón pseudoaleatorio fijo (semilla), como ref-2: lo irregular es lo que lo hace parecer vidrio real y no CSS. |
| Desplazamiento | Cada franja muestra la imagen corrida y ampliada ~1,3–1,6×; los rasgos se duplican | Desplazamiento lateral = `(local − 0,5) × fuerza × anchoFranja`, con **fuerza 0,8–1,0** en las franjas exteriores. **Sobre los ojos, fuerza 0,25–0,35**: en 5 segundos el reclutador tiene que reconocer a Doug. |
| Estiramiento vertical | ref-2: la imagen «gotea» en el borde inferior | `stretch` 0,15–0,3 solo en el 25 % inferior de la zona estriada, con máscara en degradado. |
| Luz por franja | ref-4: línea de luz de 1 px en un borde de cada franja | Luz blanca de 1 px a 25–40 % de opacidad en el borde izquierdo y sombra negra a 20–30 % en el 15 % derecho de cada franja. |
| Aberración cromática | No se aprecia en las referencias | **Mínima o nada**: separación RGB de ≤ 1,5 px solo en el filo de la franja y solo en WebGL. Si se exagera, se lee como glitch gamer. |
| Interacción | — (video) | En reposo el vidrio cubre el 55–70 % de la foto. Al acercar el cursor a la cara, la fuerza baja a 0 en un radio de ~180 px con un spring, y ahí empieza el revelado de la máscara (§3.5). |

**Cómo se construye**

- **WebGL (principal).** Fragment shader sobre la textura de la foto. En términos generales:
  `uvR = rot(θ) * uv` → `i = floor(uvR.x / w_i)` (ancho por franja desde una tabla o un hash) → `local = fract(...)` →
  `uv' = uv + rot(-θ) * vec2((local - .5) * fuerza * w, stretch * máscaraInferior)` → `texture(foto, uv')` + luz/sombra
  de borde con `smoothstep` sobre `local`. Hay una implementación MIT lista para estudiar o usar: **Paper Shaders `FlutedGlass`**
  (`@paper-design/shaders-react`). Sus props `size`, `angle`, `distortion`, `distortionShape: "prism"`, `shift`,
  `stretch`, `blur`, `edges`, `highlights` y `shadows` corresponden uno a uno a la tabla de arriba.
- **Respaldo estático (LCP).** Un AVIF/WebP **pre-renderizado** del mismo shader con los mismos parámetros. Se pinta
  primero y el canvas aparece encima con un fundido cuando está listo. Con `prefers-reduced-motion` o sin WebGL se queda solo la imagen.
- **Alternativa sin WebGL.** Un filtro SVG `feImage` (mapa de franjas en degradado) + `feDisplacementMap` aplicado como
  `filter` **al `<img>`** (funciona en todos los navegadores; con `backdrop-filter: url()` solo funciona en Chromium). La otra opción
  son N `<div>` rotados 12° con la misma imagen de fondo y `background-position` desplazado por franja: barato, pero sin
  refracción real.

### 3.2 Losa «jelly» (gradiente con borde interno brillante)

Es lo que hace que ref-1 y ref-3 parezcan gelatina y no un gradiente plano.

```css
.jelly {
  border-radius: 48px;
  /* fondo: .losa-azul o .losa-magenta */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.45),          /* filo superior: la luz toca el material */
    inset 0 0 0 1px rgba(255,255,255,.10),        /* contorno interno */
    inset 0 0 48px rgba(255,255,255,.18),         /* brillo interno hacia los bordes */
    0 24px 64px -12px rgba(43,86,243,.35);        /* bloom del propio color (azul o magenta) */
}
```

- El núcleo oscuro va **centrado un poco arriba** (42–45 %): ahí viven las cifras.
- Una capa de grano (SVG `feTurbulence`, opacidad .04–.06) evita bandas en el gradiente y le da textura.
- Al entrar, se materializa con `scale .96→1` + `filter: blur(12px)→0` + opacidad, no con un simple fundido
  (apple-design §12, «Materialize, don't just fade»).

### 3.3 Vidrio oscuro (pills y paneles sobre foto)

```css
.vidrio-oscuro {
  background: linear-gradient(90deg, rgba(58,59,63,.85) 0%, rgba(18,19,20,.80) 18% 82%, rgba(58,59,63,.85) 100%);
  backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 10px 24px rgba(0,0,0,.45);
}
```

El degradado horizontal con laterales más claros reproduce el metal pulido de la pill «Bank Account» (ref-2).
**Nunca se apila vidrio claro sobre vidrio claro** (apple-design). Con `prefers-reduced-transparency`, fondo opaco
`#1A1B1F` y sin blur.

### 3.4 Blur de movimiento de fondo

Firma de ref-1 y ref-2: **la misma persona de la losa aparece detrás, ampliada 2–3× y barrida con blur direccional**.

- CSS no tiene blur direccional, pero SVG sí: `feGaussianBlur stdDeviation="48 6"` (blur en X distinto del de Y), y
  rotando el contenedor se consigue blur diagonal. Barato, pero conviene **pre-renderizarlo** a imagen (AVIF ~60–90 KB
  a 1600 px, porque el detalle ya está perdido).
- Por encima va un viñeteo radial hacia `--vacio` al 70 %, para que las losas floten sobre algo oscuro.
- Retícula de puntos de ref-3: `background: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1.4px) 0 0 / 8px 8px;`
  con una máscara radial para que solo se vea cerca del glow.

### 3.5 Revelado de la máscara por capas (técnicas equivalentes)

No vi el post de Instagram. Lo que describe el brief (la máscara se quita por capas siguiendo el cursor) se construye así:

| Técnica | Cómo | Pros / contras |
|---|---|---|
| **A. Máscaras CSS apiladas** | 3 imágenes alineadas (máscara completa → máscara sin placas exteriores → cara limpia). Cada capa superior lleva `mask-image: radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0, transparent 60%, #000 100%)` con radios distintos (capa 1: r, capa 2: 0,6r) y **retardos distintos** (spring por capa, la interior va más lenta). | Muy barato y accesible. El borde es perfecto pero geométrico. |
| **B. Rastro en WebGL (FBO ping-pong)** | El cursor pinta un campo de «calor» con decaimiento. El shader compara contra umbrales: > 0,2 quita la capa 1 y > 0,55 quita la capa 2. Se puede deformar el borde con ruido. Es la base de componentes como Framer «Cursor Reveal» y del tutorial de Codrops con Three.js. | Orgánico, parecido a un líquido, y comparte canvas con el vidrio estriado. Más trabajo. |
| **C. SVG `<mask>` + `feTurbulence`** | Círculos en un `<mask>` siguiendo el puntero, con un filtro de turbulencia para dar borde irregular. | Intermedio. Funciona sin WebGL. |

En táctil: arrastrar con el dedo hace lo mismo. Al entrar en pantalla, autoplay de una vez (barrido en diagonal de 1,6 s)
y luego se queda en la capa 1. Con `prefers-reduced-motion`, un botón «Quitar máscara» con fundido de 200 ms. La clave de
producción (§5) es que **las tres capas estén alineadas al píxel**.

---

## 4. Tipografía

### 4.1 Identificación de la display de las referencias

Recorté «Upcoming Payments», «Authenticated platform» y «Bank Account» y los comparé con renders reales:

- Rasgos: `a` de un piso, `g` de un piso, `t` con corte recto, `y` de cola recta, `1` con bandera, ojo grande,
  contraste casi nulo. Títulos en peso ~500–600 y secundarios en ~300.
- **La que más se parece de las gratuitas es Urbanist** (OFL, variable 100–900). Coincide en `a`, `g`, `t`, `k`, `1` y
  proporciones, cerca de calco. Outfit se parece en estructura pero es más pesada y redonda. Lufga y Gilroy (comerciales y populares en
  Dribbble) **no cuadran**: las dos tienen `a` o `g` de dos pisos.
- No puedo confirmar la fuente exacta del archivo de RonDesignLab: puede ser Urbanist o una comercial muy cercana.

Nota de marca: **olbo, la app de Doug, ya usa Urbanist + Manrope**. Usar Urbanist en douguizard le da coherencia de autor;
la diferencia entre las dos marcas la ponen la segunda voz y el dot-matrix. El sitio actual usa Archivo + Geist Mono y se
reemplaza. Geist se descarta como voz de texto: es la fuente por defecto de `create-next-app` y se lee como plantilla.

### 4.2 Dot-matrix para cifras y fechas

| Fuente | Licencia | ¿Se parece a `$10,200 · 02 Jul`? | Veredicto |
|---|---|---|---|
| **Doto** (Óliver Lalán, Google Fonts) | OFL, variable `ROND` 0–100 y `wght` 100–900 | **Sí.** Con `ROND 100` y `wght 700` los puntos son redondos y gruesos como en ref-1, y hasta la coma punteada coincide. Es monoespaciada: hay que apretar el tracking. | **Elegida** |
| DotGothic16 | OFL | No: es pixel cuadrado de bitmap japonés, sin puntos. | Descartada |
| Sixtyfour | OFL | No: son líneas de barrido horizontales (CRT), no puntos. | Descartada |
| Geist Pixel | OFL | Pixel cuadrado. | Descartada |
| NDot (Nothing) | Propietaria, «All Rights Reserved» | Estética correcta | **No se puede usar** |
| DatDot | OFL, matriz 3×5 | Demasiado tosca para cifras grandes | Descartada |
| SVG/CSS de puntos propio | — | Control total | Solo si hace falta animar punto por punto (encendido secuencial). Doto ya permite animar `wght`/`ROND`. |

Ajustes de Doto: `font-variation-settings: "ROND" 100, "wght" 700;`, `letter-spacing: -0.04em` (−0,06 em en ≥ 72 px),
`font-variant-numeric: tabular-nums`. **Nunca por debajo de 20 px**: con menos, los puntos se funden. Solo para cifras, fechas
y contadores; nunca para frases.

### 4.3 Dos pares propuestos (+ Doto en ambos)

| | Display (títulos, nombre, cifras finas grandes) | Texto / UI | Carácter |
|---|---|---|---|
| **Par A · «Fiel»** | **Urbanist** 500–600 (títulos) y 200–300 (cifras gigantes finas, como el `24` de ref-4) | **Instrument Sans** 400/500 (OFL, grotesca algo condensada: se distingue bien de la geométrica) | El más cercano a RonDesignLab. Limpio y premium. |
| **Par B · «Carácter»** | **Funnel Display** 500–700 (OFL, NORD ID; terminales y `g` con más personalidad) | **Funnel Sans** 400/500 (misma familia, pensada para texto) | Más marca propia. Se aleja de la plantilla de Dribbble sin perder la geometría. |

Plan B para cualquiera de los dos: Outfit como display.

### 4.4 Escala (px; rem = px/16)

Se basa en la escala de Refactoring UI (12 14 16 18 20 24 30 36 48 60 72), ampliada arriba solo para la display del
héroe. El tracking depende del tamaño (apple-design §15). Los elementos grandes encogen más rápido en móvil.

| Rol | Desktop | Móvil | Peso | Tracking | Leading |
|---|---|---|---|---|---|
| Héroe · nombre/wordmark | 120 | 56 | 600 | −0,045 em | 0,92 |
| H1 de sección | 72 | 40 | 600 | −0,035 em | 1,0 |
| H2 / título de caso | 48 | 30 | 600 | −0,025 em | 1,08 |
| Título de losa («Upcoming Payments») | 24 | 20 | 600 | −0,01 em | 1,2 |
| Cifra fina gigante (Urbanist 200–300) | 96 | 64 | 250 | −0,04 em | 0,9 |
| **Dot-matrix XL** (Doto) | 72 | 48 | 700 · ROND 100 | −0,06 em | 1,0 |
| Dot-matrix L | 48 | 36 | 700 · ROND 100 | −0,04 em | 1,0 |
| Dot-matrix M (mínimo) | 30 | 24 | 700 · ROND 100 | −0,03 em | 1,0 |
| Texto destacado | 18 | 17 | 400 | 0 | 1,55 |
| Texto | 16 | 16 | 400 | 0 | 1,5 |
| UI / pill / botón | 14 | 14 | 500 | +0,005 em | 1,3 |
| Etiqueta bajo cifra («Adidas · Jul») | 14 | 13 | 400 | +0,01 em | 1,3 |
| Micro (pie, legal) | 12 | 12 | 400 | +0,02 em | 1,4 |

Reglas: medida de párrafo 45–70 caracteres (`max-width: 34em`). **Nada por debajo de 400 en texto de UI**: el peso
fino (200–300) solo se usa en display de 60 px o más. **Sin MAYÚSCULAS sostenidas en etiquetas**: las referencias usan
caja de oración en todo.

---

## 5. Formas, rejilla y espaciado

| Elemento | Valor | Nota |
|---|---|---|
| Base de espaciado | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 | Escala de Refactoring UI. Nada fuera de ella. |
| Radio losa XL (héroe, losas grandes) | **48 px** desktop / **36 px** móvil | En ref-1 el radio mide ≈ 13 % del ancho de la losa. 48 px en una losa de 360–420 px. |
| Radio losa M | 32 px / 28 px | — |
| Radio de lo anidado | **radio exterior − padding** (concéntrico) | Pill de 24 px dentro de losa de 48 con padding de 24. Es lo que hace que ref-2 se vea cuidado. |
| Pills, chips, nav | 999 px | — |
| Botón círculo blanco | **56 px** desktop / 48 px móvil; ícono ↗ de 20 px, trazo 1,5 px, en `--tinta-osc` | Una sola acción blanca por losa (el foco). |
| Botón secundario | Círculo de 56 px en `--losa-alta`, ícono en `--tinta` | Como el «+» de ref-2. |
| Nav superior | Pills de 40 px de alto, padding 0 20 px; **la activa es pill blanca** con texto `--tinta-osc` y las demás son texto `--tinta-2` | ref-3. |
| Rail de íconos (desktop ≥ 1024) | Pill vertical de 64 px de ancho en `--losa`, íconos de 20 px en celdas de 48; activo = círculo blanco de 44; acción principal = círculo `--electrico` | ref-3. En móvil pasa a dock inferior. |
| Chips de marca / herramientas | Pill de 48 px de alto en `--losa`, etiqueta en `--tinta-2` + logos monocromos de 20 px + `›` | Para «Herramientas» o «Clientes» en los casos. |
| Contador | Círculo blanco de 40 px con número de 14 px / 500 | ref-3 (`12`, `8`). |
| Gutter de la rejilla bento | **16 px** desktop (24 px ≥ 1440) / **12 px** móvil | Siempre menor que el padding interior de la losa (24–32 px). Así cada losa se lee como un objeto. |
| Padding interno de losa | 32 px desktop / 24 px móvil | — |
| Rejilla | 12 columnas, máx. 1320 px. Losas en spans de 3/4/5/6/8; filas con altura en múltiplos de 96 px | Ritmo de 96 px: las losas pequeñas miden 1 fila, las medianas 2 y la del héroe 4–5. |

**Sombras:** son pocas y del color de la losa (el bloom azul o magenta). Las losas oscuras se separan del fondo por
el filo de 1 px y por la diferencia de valor (`#060608` → `#111214`), no por sombra gris. Nada del «SaaS kit» con
`rgba(0,0,0,.1)` en todo.

---

## 6. Composición

1. **La cara es el sujeto y la UI flota encima.** En ref-2 y ref-4 la cara ocupa el 55–65 % superior de la losa y la UI
   las 35–45 % inferiores, en losas que se solapan con el retrato. En el héroe: cara en el tercio superior y bloque de
   texto y CTA en una losa oscura que monta sobre el pecho o la chaqueta.
2. **La foto se repite como atmósfera.** La misma imagen aparece nítida y estriada dentro de la losa y ampliada con blur
   de movimiento detrás de la página (§3.4). Es el gesto RonDesignLab más reconocible y no cuesta contenido nuevo.
3. **Oscuro con puntos blancos de foco.** Cada losa tiene un solo elemento blanco (el círculo de acción o la pill
   activa). La vista salta de blanco en blanco: ese es el recorrido de lectura.
4. **Las cifras mandan.** Cifra dot-matrix grande con etiqueta pequeña debajo, en pares justificados a los extremos
   (dato a la izquierda y fecha a la derecha). Sirve para años de experiencia, número de productos, impacto (%) y
   fechas del timeline.
5. **Una losa clara por fila**, como mínimo en el primer pliegue: es el respiro que pide el brief (ref-3, la losa de foto).
6. **Alineación a la izquierda** en todo el texto. Lo centrado se reserva para íconos dentro de círculos.

---

## 7. Motion (lo que se infiere de las referencias)

Las referencias son fotogramas de video. Lo que se puede deducir:

| Qué | Indicio | Propuesta |
|---|---|---|
| Fondo con blur de movimiento | Figura barrida en ref-1 y ref-2 | Parallax lento del fondo (0,15× el scroll) y aumento del blur direccional mientras se hace scroll; quieto en reposo. |
| Losas que entran | Losas flotando con sombra de color | Entrada coreografiada una sola vez (stagger de 60 ms, 500–700 ms, `cubic-bezier(.23,1,.32,1)`) con escala + blur → nítido. |
| Cámara en 3D | El monitor y el teléfono inclinados | Tilt sutil de la losa del héroe con el puntero (±4°, spring), nunca en toda la página. |
| Dot-matrix que se enciende | Matriz de puntos llenos y vacíos en ref-3 | Las cifras «se encienden» al entrar en pantalla: `wght` de 100 a 700 y opacidad por dígito, en 400 ms. |
| Vidrio vivo | — | Las franjas se mueven unos px con el puntero (`shift`), sin animación continua. |

Duraciones y curvas finas: las define el frontend (`emil-design-eng`, `motion-design`). Aquí solo se fija la intención:
**un momento orquestado (el héroe) y el resto quieto hasta que el usuario actúa.**

---

## 8. Qué NO hacer

- **Neón gamer:** magenta y cian saturados a la vez, glow exterior en el texto, rejillas en perspectiva estilo Tron,
  líneas láser rojas en la cara (los retratos `199598aa`/`a34aaaf8`/`a4ef948f` ya van por ahí: no repetirlo en el héroe).
- **Glassmorphism de plantilla:** tarjetas blancas al 10 % con `blur(10px)` sobre un gradiente de colores. En las
  referencias el vidrio está **sobre una foto real** y casi siempre es oscuro.
- **Gradientes por todas partes:** máximo dos losas de color en el landing. Nada de texto con gradiente.
- **El mismo radio y la misma sombra gris en todo:** los radios son concéntricos y las sombras tienen el color de la losa.
- **Dot-matrix en frases o en tamaños pequeños:** solo cifras y fechas, ≥ 20 px.
- **Texto blanco sobre vidrio gris claro** (falla AA, §2.3) y gris sobre losas de color.
- **Etiquetas en mayúsculas espaciadas sobre cada título, números `01/02/03` decorativos** (salvo en el timeline, que sí es
  una secuencia) y `→` pegado a cada enlace (frontend-design).
- **Aberración cromática fuerte, glitch o scanlines:** eso es «cyberpunk de stock», no RonDesignLab.
- **Logos de terceros grandes en la imagen** (el NY de la gorra es marca registrada). Ver §9.

---

## 9. Territorios de imagen para el héroe

Constantes en los tres:

- **Identidad:** cara de Doug, **gafas transparentes tipo aviador** (el ancla de identidad más fuerte en los retratos) y
  barba corta. La máscara cubre **boca y parte baja de la nariz**: nunca los ojos ni las gafas.
- **Encuadre:** generar a **3:4 a alta resolución**, para recortar a 16:10 y a 9:16 desde la misma imagen.
  - Desktop 16:10: ojos a ~30 % de la altura y cara en el 60–68 % del ancho (el texto y la losa de CTA a la izquierda);
    hombros cortados por abajo.
  - Móvil 9:16: ojos a ~22 % de la altura y centrado; el 45 % inferior es chaqueta oscura con poco detalle, el aire para el
    texto.
  - Dejar 15 % de aire por encima de la cabeza o de la gorra: el vidrio estriado y el radio de 48 px se comen los bordes.
- **Pares alineados para el revelado:** se genera **primero la cara limpia** como base, y luego, editando esa misma imagen
  (inpainting o edición con referencia), la capa 2 (estructura de la máscara) y la capa 3 (máscara completa).
  **Es más fácil añadir la máscara que quitarla** sin que se mueva la cara. Mismo seed, misma luz, sin reencuadrar.
- **Gorra NY:** es parte de la identidad actual, pero el logo es de un tercero. Recomiendo una gorra negra lisa o con un
  monograma propio «d» bordado en blanco. Así se mantiene la silueta y la marca deja de ser ajena.

### Territorio 1 · «Andén eléctrico»

| | |
|---|---|
| Concepto | Doug quieto en un andén de metro mientras el tren pasa barrido detrás. Es el blur de movimiento de ref-1 hecho escena. Futuro urbano y real, no de ciencia ficción. |
| Luz | Fluorescente frío cenital (rebote verde-azulado) + **contraluz azul eléctrico `#2B56F3`** desde atrás a la izquierda que dibuja la oreja y el hombro. Clave suave frontal baja, al 30 %. |
| Paleta | Casi negro, azul noche `#0C1266`, azul eléctrico, blanco frío. Un acento cálido mínimo en las ventanas del tren (ya está en `83a47bc7`) para que no quede monocromo. |
| Vestuario | Chaqueta técnica negra mate tipo shell, cuello alto con cremallera asimétrica, costuras termoselladas con **ribete reflectante** que se enciende con el contraluz. Camiseta negra. |
| Máscara | Respirador de **policarbonato ahumado translúcido** sobre una estructura de grafito, con una **rejilla de microperforaciones en matriz de puntos** al frente (eco del dot-matrix) y dos filtros laterales pequeños. Capas: 1) carcasa ahumada, 2) estructura de grafito con la rejilla, 3) cara. |
| Fondo | Tren en barrido horizontal (velocidad de obturación lenta) y andén de concreto. El fondo se puede ampliar y barrer más como atmósfera de página. |
| Encaja con | ref-1 (motion blur azul) y ref-3 (negro + azul). Es la opción más «oscura»: la blancura del landing viene de las losas claras. |
| Retratos de referencia | **`83a47bc7`** y **`adc6fda9`** (misma escena, misma cara y gorra; sin gafas, así que hay que añadirlas) + **`40fe7690`** para las gafas y la cara de cerca. |

### Territorio 2 · «Estudio lila, cerámica blanca» (recomendado)

| | |
|---|---|
| Concepto | Retrato de estudio limpio, como los mejores de Doug, pero con hardware de diseño industrial: la máscara parece una pieza de producto (tipo cerámica de audífonos premium), no un disfraz. «Diseñador que diseña su propio futuro». |
| Luz | Clave grande y suave a 45° arriba a la izquierda, **gel azul eléctrico de relleno** a la derecha (como en `40fe7690`/`87ff97a2`, donde ya hay un rim azul en mejilla y chaqueta) y un recorte blanco fino desde atrás. |
| Paleta | Fondo de **degradado lila-azul** (de `#8C8CF0` a `#5A62B8`, la base lavanda de ref-1), piel cálida, chaqueta negra y máscara **blanca mate** `#F2F2F4`. Da a la vez las losas claras y el color de ref-1 sin neón. |
| Vestuario | Evolución de su chaqueta de cuero: cuero negro con **paneles acolchados blancos** en hombros y cuello (el puffer blanco de ref-4), cremalleras de aluminio. Camiseta blanca de canalé, como ahora. |
| Máscara | Media máscara **modular de placas cerámicas blancas** con juntas finas en grafito y un piloto LED azul diminuto. **Las placas son las capas del revelado**: 1) placas exteriores (mejillas y mentón), 2) placa central y estructura, 3) cara. Al pasar el cursor, las placas se retiran una por una. Es el territorio donde «por capas» se entiende sin explicación. |
| Fondo | Ciclorama liso lila-azul con un viñeteo suave. Plano y limpio, y por eso el vidrio estriado se lee muy bien (como en ref-2 y ref-4, de fondo claro). |
| Encaja con | ref-2 y ref-4 (vidrio sobre fondo claro con prenda blanca) y ref-1 (paleta azul-lavanda). Equilibra oscuro y blanco desde la propia foto. |
| Retratos de referencia | **`40fe7690`**, **`87ff97a2`**, **`9c32de9f`**, **`f5946714`**, **`00a29741`** y **`d908689e`**: misma cara, gafas transparentes, gorra NY, cuero negro y fondo lila-azul. Son el set de identidad más consistente del índice. |

### Territorio 3 · «Escáner blanco»

| | |
|---|---|
| Concepto | Galería clara de alta luz con una **línea de escaneo blanca** (no roja) cruzando la cara, como si un sistema leyera a Doug. Silueta oscura sobre fondo claro: el contraste máximo para el vidrio estriado, igual que ref-2. |
| Luz | Fondo sobreexpuesto suave (`#E4E2EC`), clave lateral dura desde la derecha que esculpe la cara, sombra profunda en el lado opuesto y una barra de luz blanca de 2–3 cm a la altura de los ojos o de la máscara. |
| Paleta | Niebla lila `#E4E2EC`, negro, plata y **un solo acento magenta** `#B4407E` en el anillo interior de la máscara. Es el territorio que da la losa magenta. |
| Vestuario | Chaqueta negra técnica con volumen escultórico (cuello embudo, hombro redondeado, nylon mate), sin logos. |
| Máscara | Respirador de **aluminio anodizado negro**, perfil bajo, con ranuras horizontales y un aro interior que brilla en magenta tenue. Capas: 1) cubierta de aluminio, 2) aro magenta + estructura, 3) cara. |
| Fondo | Sala blanca con un degradado al gris lila hacia abajo. En móvil, ese gris inferior es el espacio del texto. |
| Encaja con | ref-2 (cara oscura sobre fondo claro tras vidrio) y ref-3 (magenta). Es el más editorial y menos «gamer» de los tres, pero el más alejado de las fotos que ya tiene Doug. |
| Retratos de referencia | **`18dd8c84`** y **`a49236ec`** para la forma de la cabeza y el cuello sin gorra, con gafas. **`199598aa`** / **`a34aaaf8`** solo como referencia de la idea de la línea de luz (cambiar el rojo por blanco). Cara y gafas: **`40fe7690`**. |

### Retratos a evitar como referencia de identidad

| Id | Motivo |
|---|---|
| `18768e58`, `6ee274d7` (`text2image_soul_v2`) | **Deriva de identidad**: otra persona (pelo, mandíbula y nariz distintos). El Soul `Urban Swagger Vibe` derivó en estas tomas. Si se usa el Soul, comprobar la cara contra `40fe7690`. |
| `19d9e60b` | Calvo, sin gafas, rasgos más finos: **identidad dudosa**. Su tratamiento (blur de movimiento lateral y halo) sí es buena referencia de **estilo** para el fondo de página. |
| `25588526` | Cuerpo entero en París: no sirve para el encuadre de cara. |
| `c2245cbd`, `f2a7ef42` | Cara correcta, pero suéter con letras y cadena: vestuario fuera de tono. Sí sirven de referencia de color (azul profundo). |

**Recomendación:** el **Territorio 2** es el más fuerte. Tiene el set de identidad más sólido, el revelado por capas
se explica solo (placas), equilibra oscuro y blanco desde la propia foto y conecta directo con ref-1, ref-2 y ref-4. El
**Territorio 1** queda como alternativa oscura para la segunda propuesta.

---

## 10. Fuentes

- Perfil del equipo en Dribbble (no cargó en esta sesión): https://dribbble.com/RonDesignLab
- RonDesignLab en The Manifest (sede y año de fundación): https://themanifest.com/company/rondesignlab
- RonDesignLab en Clutch (verticales y proyectos): https://clutch.co/profile/rondesignlab
- RonDesignLab en Behance (indexado): https://www.behance.net/rondesignlab/info
- Perfil en cases.media: https://cases.media/rondesignlab
- Shot «Fintech App – Joint Account», Jack R. for RonDesignLab: https://dribbble.com/shots/17260955-Fintech-App-Joint-Account
- Shot «Finance App Concept», Victa Wille for RonDesignLab: https://dribbble.com/shots/6628753-Finance-App-Concept
- Paper Shaders · Fluted Glass (MIT): https://shaders.paper.design/fluted-glass y props en https://cult-ui.com/r/fluted-glass.json
- Fluted glass en Three.js (Webflow): https://webflow.com/made-in-webflow/website/fluted-glass
- Herramienta de referencia de fluted glass: https://instantgradient.com/tools/fluted-glass
- Codrops · Gooey image hover effects con Three.js (revelado con textura): https://tympanus.net/codrops/2019/10/23/making-gooey-image-hover-effects-with-three-js/
- Codrops · Double image hover effects con clip-path: https://tympanus.net/codrops/2023/03/01/double-image-hover-effects-with-clip-path-animations/
- Framer · Cursor Reveal (rastro fluido en WebGL): https://www.framer.com/marketplace/components/cursor-reveal/
- Doto (Google Fonts): https://fonts.google.com/specimen/Doto/about · Fontsource: https://fontsource.org/fonts/doto/about
- Funnel Display / Funnel Sans (OFL): https://fontsource.org/fonts/funnel-display/about · https://fontsource.org/fonts/funnel-sans/cdn
- NDot de Nothing es propietaria: https://nothing.community/d/104-ndot57-the-nothing-typeface
- DatDot (OFL): https://ggbot.itch.io/datdot-font
- Comparación Outfit vs Urbanist: https://fontalternatives.com/compare/outfit-vs-urbanist/
- Skills del repo: `.claude/skills/frontend-design`, `refactoring-ui` (escalas, contraste, regla «nunca gris sobre color») y
  `apple-design` (§12 materiales, §15 tracking y leading).
