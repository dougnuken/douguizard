# 02 · Estrategia UX: auditoría, audiencias y arquitectura del landing bento

> Autor: product designer / UX senior del rediseño 2026. Lee primero `00-BRIEF.md`; si algo de aquí lo contradice,
> gana el brief. Este documento define **estructura, prioridad, recorrido y comportamiento**. No escribe el copy final
> (eso lo hace el UX writer en `04-COPY.md` a partir de la §6) ni elige el estilo visual (eso sale de
> `01-FUNDAMENTOS-VISUALES.md`). Cuando cito un texto actual es para auditarlo, no para reutilizarlo tal cual.
>
> Evidencia: build de producción del repo (`next build` + `next start`, copia aislada en el scratchpad, servidor ya
> apagado). Capturas en `auditoria/` (jpg, DPR 1, `prefers-reduced-motion: reduce` para congelar la entrada):
>
> | Archivo | Qué es |
> |---|---|
> | `home-es-1440-panel0..4.jpg` | Los cinco paneles horizontales del home en escritorio (Inicio, Trabajo, Oficio, Sobre mí, Contacto) |
> | `home-en-1440-panel0.jpg` | Héroe en `/en` |
> | `home-es-390-fold.jpg` · `home-es-390-full.jpg` · `home-en-390-*` | Home móvil: primer pliegue y página completa |
> | `caso-naowee-1440-fold/full.jpg` · `caso-naowee-390-*` | Caso largo de cliente con galería y video |
> | `caso-olbo-1440-fold/full.jpg` | Caso largo con capítulos (story) |
> | `caso-andes-nda-1440-fold/full.jpg` | Caso con NDA |
> | `cv-1440-fold/full.jpg` · `cv-390-*` | `/cv` |

---

## 1. Auditoría del sitio actual

### 1.1 Inventario

**Arquitectura de información.** El sitio tiene tres tipos de página y nada más:

| Ruta (ES · EN) | Qué es | Componentes |
|---|---|---|
| `/` · `/en` | Home de 5 paneles. En escritorio es un **carrusel horizontal a pantalla completa** (la rueda del ratón se traduce en scroll horizontal, cada panel tiene su propio scroll vertical); en móvil, una sola columna. | `HomePage` → `HorizontalShell` + `SectionIndex` (rail 00–04) + `Hero`, `Work`, `Craft`, `About`, `Contact` |
| `/work/[slug]` · `/en/work/[slug]` | Caso de estudio (10). | `CasePage` → bandas alternas papel/raised: Header, Showcase/Cover/NDA, Meta, Impact, Narrative, Film, Chapters, Testimonial, Gallery, Features, Process, Decisions, Colophon, Next |
| `/cv` · `/en/cv` | Hoja de vida web + PDF con y sin foto + carta de presentación (PDF y copiar texto). | `CvPage` y `components/cv/*` |

**Paneles del home y su contenido real.**

| # | Panel | Qué contiene | Observación |
|---|---|---|---|
| 00 | Inicio | H1 «Diseñar lo **humano** en la era de la IA», FocusWords «Diseñar Construir Lanzar», párrafo de rol (Head of Product en Naowee, Andes en Mercadolibre: 18 países, 400+ diseñadores, 2.000+ ingenieros), CTA **LinkedIn** (primario) y «Ver trabajo» (secundario), tira de empresas. A la derecha, un blob WebGL de ruido violeta (`HeroField`). | El H1 en uso no coincide con el que fijó `docs/specs/10` («Dirijo el producto, después lo construyo»). |
| 01 | Trabajo | Intro con cifras derivadas (12 años, 3 productos propios), 6 filas «destacadas» con viñeta animada, 3 filas «anteriores» compactas, 1 «por gusto» (Chub), enlace a CV. | 2.984 px de scroll **interno** dentro de un panel que a su vez vive en un carril horizontal. |
| 02 | Oficio | 3 especialidades (Dirección de producto, Sistemas de diseño, Ingeniería de diseño con IA) + 4 pasos de «Cómo trabajo». | Muy buen contenido, pero son ~600 palabras de texto en el home. |
| 03 | Sobre mí | Resumen, 2 párrafos de bio, tabla de experiencia (9 filas con «Ver caso»), idiomas, CV, **retrato B/N**, 5 datos (ubicación, actualmente, enfoque, disponible para, idiomas). | La única foto de Doug en el home. |
| 04 | Contacto | Lead, LinkedIn, correo, otros perfiles (Behance, GitHub), señal de disponibilidad, correo y teléfono directos. | — |

**Casos (orden de `src/data/work.ts`, el mismo en ES y EN).** Longitud medida por los campos que tiene cada uno:

| # | Slug | Tipo | Longitud | Qué tiene | KPIs verificados |
|---|---|---|---|---|---|
| /01 | `olbo` | Producto propio | **Larga** | cover 16:9, film, 5 capítulos | 647 pruebas · 0 dependencias · 5 sesiones · 1 acento |
| /02 | `naowee-suid` | Cliente (empleo actual) | Media-larga | galería browser ×5, video, 3 fases, 3 decisiones | 30 trámites · ~1.200 organizaciones · 130+ pantallas · 38+ componentes |
| /03 | `mercadolibre-andes` | Cliente · **NDA** | Corta | solo texto + viñeta, «disponible a solicitud» | 400+ diseñadores · 2.000+ ingenieros · 18 países · 3 plataformas |
| /04 | `banco-de-occidente` | Cliente | Media-larga | galería plain ×9, 2 fases, 2 decisiones, testimonio (Francesca Steri, Design Director ADL) | 12+ squads · 15 íconos · 20+ áreas · 3 dispositivos |
| /05 | `dc-medical` | Producto propio | **Larga** | cover, film, 3 capítulos, 3 decisiones | 14 días · 3 fases · 0 bases nuevas · 12 suites |
| /06 | `makeapet` | Producto propio | **Larga** | cover, film, 4 capítulos | 680+ tests · 10 agentes · 1 código · AA |
| /07 | `royal-caribbean` | Cliente | **Corta** | solo texto + testimonio (Nicolas Polverino, Globant) | ninguno |
| /08 | `qrvey` | Cliente | Corta-media | galería ×6 + testimonio (Arman Eshraghi, CEO) | ninguno |
| /09 | `ideaware` | Cliente | **Corta** | solo texto | ninguno |
| /10 | `chub` | Side project | Corta | galería ×4 | ninguno |

Hallazgo de contenido que manda en todo lo que sigue: **los casos con más escala (Andes, Naowee, BdO) son los más
pobres en imagen, y los más ricos en imagen (olbo, DC Medical, MakeaPet) son productos propios.** Los dos tipos de
prueba son distintos y el landing tiene que mostrar los dos: *escala* (sistemas que usan miles) y *oficio de punta a
punta* (productos que Doug diseñó, programó y lanzó solo).

**Experiencia (de `cv.ts`).** Naowee · Head of Product (ene 2026–hoy) → Mercadolibre · Tech Lead Design Systems
(2024–2026) → Aval Digital Labs / Banco de Occidente · Senior PD y Design System Gatekeeper (2018–2024) → Globant /
Royal Caribbean · Senior PD (2017–2018) → Qrvey · Lead UI (2016–2017) → Ideaware · Senior UX/UI (2016) → Smartbiz
(2014–2016) → Freelance (2010–2014) → UAC (2006–2009). Seis de las nueve etapas tienen `caseSlug`: **el timeline
puede ser una puerta real a los casos**, no un adorno.

**Pruebas sociales disponibles y no usadas en el home:** 3 testimonios con nombre y cargo (Design Director de ADL,
Founder & CEO de Qrvey, Technical Director de Globant).

**Lo que ya está bien y hay que conservar.** Las cifras se derivan de los datos y hay tests que impiden escribirlas
dos veces (`data.singleSource.test.ts`). Los diccionarios ES/EN tienen test de paridad. Hay `hreflang`, JSON-LD de
Person y de cada caso, SSG en todas las rutas, `prefers-reduced-motion` respetado y foco gestionado con cuidado. El
`/cv` es sólido (PDF con y sin foto, carta). El patrón NDA de Andes, con viñeta, «disponible a solicitud» y CTA para
escribir, es honesto y profesional. El rediseño cambia la **forma**: la capa de datos se queda como está.

### 1.2 Puntos de dolor

Ordenados por cuánto le cuestan a la primera impresión.

**D1 · El héroe no tiene a Doug.** La única imagen del primer pliegue es un blob de ruido violeta
(`home-es-1440-panel0.jpg`). El retrato aparece en el panel 03, a cuatro «pantallas» horizontales en escritorio y a
**9.943 px de scroll en móvil (≈ 11,8 pantallas de 844 px)**. Si la marca es Doug, hoy la marca no aparece. Es la
causa principal de que el sitio «carezca de personalidad»: es tipografía impecable sin dueño.

**D2 · El mensaje es genérico.** «Diseñar lo humano en la era de la IA» le sirve a cualquier diseñador de 2026. El
nivel (Head of Product · Senior Product Designer · Design Engineer) no está en el primer pliegue del home, solo en el
párrafo y como «Head of Product en Naowee». El dato más fuerte que tiene (Mercadolibre: 18 países, 2.000+ ingenieros)
está en cuerpo de texto gris a 16 px.

**D3 · El CTA primario saca al visitante del sitio.** El botón sólido del héroe es LinkedIn, que además se repite en
el header y en contacto (3 veces). El primer clic que se le propone a un reclutador es irse. «Ver trabajo» queda como
secundario.

**D4 · El carril horizontal pelea con la lectura.** En escritorio la rueda vertical mueve en horizontal, pero los
paneles largos (Trabajo: 2.984 px, Sobre mí: 1.693 px) se desplazan en vertical por dentro: son **dos ejes de scroll
con reglas distintas** según dónde esté el puntero. El rail 00–04 numera paneles sin decir qué contienen. Es un
gesto editorial elegante que obliga a aprender la interfaz antes de leer el contenido, y no es compatible con un bento,
que se recorre en dos dimensiones a la vez.

**D5 · El trabajo se muestra como lista, no como trabajo.** Las filas de casos llevan viñetas abstractas (barras de
audio, «$20.000», «Pendientes 5») que son ingeniosas pero no enseñan producto real (`home-es-1440-panel1.jpg`). Los
covers reales que ya existen (olbo, DC Medical, MakeaPet, capturas de Naowee y BdO) no aparecen en el home: el home
tiene **cero** `<img>` de producto.

**D6 · El orden de los casos no sigue la señal.** olbo, un producto personal, es el /01, por delante del cargo
actual (Naowee) y del caso de mayor escala (Andes, que es el /03 y no tiene imágenes). A un reclutador de Head of
Product le conviene ver primero el cargo y la escala; a un director de diseño, el oficio. Hoy el orden no responde a
ninguno de los dos: es el orden de inserción en `work.ts`.

**D7 · El móvil es la versión de escritorio apilada.** El home móvil mide **11.913 px (≈ 14 pantallas)** en ES y
11.728 en EN. Trabajo empieza en 932 px (bien), pero Oficio está en 5.555 y Contacto en 10.773. No hay atajos,
carruseles ni prioridad móvil: todo pesa lo mismo.

**D8 · La experiencia es una tabla.** Nueve filas mono de 11 px en el panel Sobre mí. Doce años de carrera, de
freelance a Mercadolibre, merecen una visualización que muestre el arco: hoy es la parte más difícil de escanear.

**D9 · En los casos, la portada es solo tipografía.** En Naowee (`caso-naowee-1440-fold.jpg`) el primer pliegue es
un H1 de 3 líneas a ~110 px. El producto empieza en el px 760. Las **decisiones**, que son lo que un director de
diseño viene a juzgar, están casi al final, después de galería, features y proceso. El rol aparece en una tira de
metadatos a 13 px.

**D10 · Una paleta sin momentos.** Papel, tinta, un violeta y nada más. Es coherente pero no deja recuerdo. El brief
pide oscuro con losas blancas, azul eléctrico y magenta en gradientes, y cifras en dot-matrix. Además hoy hay toggle
claro/oscuro, y una dirección «oscuro con luz blanca» tiene que decidir si lo conserva (ver §9).

**D11 · Hay prueba social, pero escondida.** Tres testimonios con cargos fuertes (incluido un CEO) viven solo dentro
de los casos.

**D12 · Algunos retratos generados no se parecen a Doug** (en la hoja de contactos de `retratos-hf/`, p. ej.
`18768e58` y `6ee274d7` derivan de identidad). Un héroe con una cara que no es la suya destruye la confianza que el
héroe quiere construir. Regla: **toda imagen del héroe la valida Doug antes de entrar.**

---

## 2. Las tres audiencias: qué buscan en 5 s, 30 s y 3 min

Fuentes de práctica (no son estudios sistemáticos; las cito como consenso de oficio): la encuesta de ADPList
reporta que la mayoría de quienes revisan dedican de 5 a 10 minutos a un portafolio, así que los primeros casos
tienen que aterrizar rápido; UXfolio describe que los revisores **escanean señales, no leen narrativas lineales**;
varios hiring managers coinciden en que el **nivel y el alcance** se leen en el tamaño de los proyectos, y en que se
busca ver **cómo piensas, no solo lo que entregas** (Fountain Institute, 2026). Ver fuentes al final.

| Momento | (a) Reclutador / hiring manager de producto | (b) Diseñador senior / director de diseño | (c) Cliente / fundador |
|---|---|---|---|
| **5 s** (pliegue) | Nombre, **cargo y nivel** («Head of Product · Senior Product Designer · Design Engineer»), empresa reconocible (**Mercadolibre**), si está disponible, dónde está el CV. | ¿Este sitio tiene oficio? Tipografía, ritmo, calidad de la imagen y del movimiento. El héroe es la primera pieza del portafolio. | ¿Qué resuelve este tipo? ¿Ha lanzado productos? ¿Puedo hablar con él? |
| **30 s** (escaneo del bento) | 3 o 4 logos o casos con cifra grande, la línea de carrera (años, saltos de nivel), ubicación y zona horaria, idiomas, botón de CV en PDF. | Variedad de problemas (sistemas, GovTech, banca, producto propio), capturas reales y no mockups genéricos, señal de pensamiento sistémico. | Productos propios en uso (olbo, DC Medical), velocidad («14 días del primer commit»), IA en el proceso. |
| **3 min** (dentro de un caso) | Rol exacto vs. equipo, alcance, impacto con números verificables, testimonio de alguien con cargo. | **Decisiones**: qué tensión había, qué se descartó y por qué, cómo se gobierna un sistema, detalle de UI. Que la narrativa no sea «proceso de manual». | Cómo trabaja (prototipo como especificación), tiempos, cómo contactarlo, disponibilidad para consultoría. |
| Lo que lo hace irse | No encontrar el cargo o el CV, tener que «aprender» la navegación, casos sin rol. | Efectos que tapan el trabajo, plantilla reconocible, un dashboard falso «de Dribbble» sin contenido. | Jerga, no ver productos funcionando. |

**Qué genera confianza a este nivel** (Head of Product · Senior PD · Design Engineer, con Andes en el currículum):

1. **Escala nombrada y medida**: 400+ diseñadores, 2.000+ ingenieros, 18 países, 3 plataformas. Bien presentada, la
   ausencia de capturas por NDA es una señal de seniority, no un hueco.
2. **Rol explícito** en cada caso: qué decidió Doug y qué hizo el equipo.
3. **Producto vivo**: enlaces a apps reales (olbo en GitHub Pages), conteos de tests y días.
4. **Terceros con cargo**: los tres testimonios.
5. **Un sitio que es, él mismo, prueba de design engineering.** El vidrio estriado y el revelado de máscara son
   credenciales solo si son rápidos, accesibles y no estorban. Si fallan en rendimiento o accesibilidad, cuentan en
   contra ante el director de diseño.

**Qué impacta visualmente** (de las referencias RonDesignLab): losas grandes con radio generoso, contraste de losas
negras con una o dos blancas, cifras dot-matrix enormes como protagonistas de una card (`ref-1`: `$10,200 · 02 Jul`),
la cara tras el vidrio estriado como card principal (`ref-2`, `ref-3`, `ref-4`) y una sola nota de color saturado
por pantalla. Traducido a UX: **cada card tiene un solo protagonista** (una cara, una cifra o una captura), nunca tres.

---

## 3. Principios de UX para el rediseño

1. **El test de 5 segundos manda.** Sin hacer scroll, en 1440×900 y en 390×844, se lee: nombre, nivel, Mercadolibre,
   disponibilidad y la puerta a los casos. Ningún efecto puede retrasar esto.
2. **Cada card es una puerta con un solo destino.** Toda la card es el objetivo del clic. Nada de cards decorativas: la
   card de hora local, por ejemplo, también es la puerta a contacto.
3. **Scroll vertical nativo.** Se retira el carril horizontal. No se secuestra el scroll: puede haber animaciones
   ligadas al scroll, pero la rueda siempre mueve la página.
4. **El trabajo se ve.** Las cards de caso llevan la imagen real del producto o, si hay NDA, la cifra en dot-matrix.
5. **La personalidad está en la cara y en el movimiento, la información en el texto.** Las cifras dot-matrix son texto
   real (fuente o SVG con `aria-label`), nunca una imagen.
6. **Dos idiomas con la misma arquitectura**: los mismos ids, el mismo orden y el mismo layout. El EN no es una
   traducción apretada en el layout del ES.
7. **El móvil se diseña aparte.** Otro orden, otra densidad y otros gestos (ver §5.6). Objetivo: home móvil de **≤ 6
   pantallas** (hoy 14).

---

## 4. Arquitectura del landing bento

### 4.1 Mapa de rutas propuesto

Las rutas existentes no cambian. Se añaden dos destinos para las puertas de perfil y de experiencia, y un índice de
trabajo. Los slugs van en inglés en los dos idiomas, como ya hacen `/work` y `/cv`: así un enlace sobrevive al cambio
de idioma y `hreflang` empareja las rutas sin tabla de traducción.

| Ruta ES · EN | Estado | Puerta desde |
|---|---|---|
| `/` · `/en` | Rehacer como bento | — |
| `/work` · `/en/work` | **Nueva**: índice de los 10 casos (filtro: Escala · Producto propio · Anteriores) | card «Todo el trabajo», header |
| `/work/[slug]` · `/en/work/[slug]` | Conservar la ruta y re-maquetar la plantilla (§6) | cards de caso, nodos del timeline |
| `/about` · `/en/about` | **Nueva**: perfil (bio, oficio, cómo trabajo, datos, testimonios) | card Perfil, card Oficio, card Testimonio |
| `/experience` · `/en/experience` | **Nueva**: timeline completo | card Experiencia |
| `/cv` · `/en/cv` | Conservar (no tocar PDFs) | card CV, header |
| `/#contact` | Sección final del landing (no es una página aparte) | card Disponibilidad, header |

Si Doug prefiere menos rutas, `/experience` puede vivir como `/about#experience`. Lo recomiendo separado: es la puerta
que pidió en el brief, posiciona sola en buscadores («Doug Vargas experiencia») y su layout (una línea de tiempo larga)
no comparte rejilla con la bio.

### 4.2 Lista de cards

Prioridad: **P0** debe estar en el primer pliegue de escritorio. **P1**, en el primer scroll. **P2**, más abajo.
Tamaño en la rejilla de escritorio de 12 columnas (col × fila; fila base de 112 px, gap de 16 px, ver §4.3). La
superficie es una propuesta UX de ritmo claro/oscuro. El color exacto lo fija la dirección de arte.

| ID | Card | Función (puerta a) | Prio | Contenido mínimo | Tamaño | Superficie |
|---|---|---|---|---|---|---|
| **K1** | **Héroe · Doug** | `/about` (perfil). El revelado de máscara vive aquí. | P0 | Retrato con vidrio estriado oblicuo y máscara, nombre en display, control «Quitar máscara» (accesible, §5.3), indicador de disponibilidad. | 6×6 | Imagen a sangre dentro de la losa |
| **K2** | **Claim + rol** | Ancla del landing: `/work` (CTA primario) y `/cv` (CTA secundario) | P0 | H1 con nombre + posicionamiento (1 línea), los 3 cargos como línea de nivel, CTA «Ver casos», CTA «CV (PDF)». | 6×2 | **Losa blanca** (el respiro de `ref-3`) |
| **K3** | **Caso Naowee** (cargo actual) | `/work/naowee-suid` | P0 | Etiqueta «Ahora · Head of Product», nombre, 1 línea de resultado, captura real del producto, **1 cifra dot-matrix** (`130+` pantallas). | 3×3 | Losa oscura con captura |
| **K4** | **Caso Andes · Mercadolibre** (NDA) | `/work/mercadolibre-andes` | P0 | Marca Mercadolibre, «Andes Design System», cifras dot-matrix `400+` / `2.000+` / `18`, chip «NDA · a solicitud». Sin capturas: **la cifra es la imagen.** | 3×3 | **Gradiente azul eléctrico** (`ref-1`) |
| **K5** | **Disponibilidad** | `#contact` | P0 | Punto de estado, «Head of Product en Naowee · abierto a consultoría…» (dato de `site.availability`), botón «Escríbeme». | 3×1 | Oscura |
| **K6** | **Hora local / idioma** | `#contact` | P0 | `BAQ 14:32` en dot-matrix (reloj vivo, hora de Barranquilla), `UTC-5`, segmento ES/EN. Responde a la pregunta del reclutador remoto: «¿en qué zona horaria está?». | 3×1 | Oscura |
| **K7** | **Caso olbo** | `/work/olbo` | P1 | Teléfono con la app (cover), «Producto propio · Design Engineer», cifra `647` pruebas en verde, enlace secundario «App en vivo ↗» (solo en la página del caso, no dentro de la card, §4.5). | 4×4 | **Losa clara/perla** (la marca de olbo es clara) |
| **K8** | **Caso Banco de Occidente** | `/work/banco-de-occidente` | P1 | Tablet del portal, «Velocity», cifra `12+` squads, fragmento del testimonio de Francesca Steri. | 4×4 | Oscura |
| **K9** | **Caso DC Medical** | `/work/dc-medical` | P1 | Captura del panel, cifra `14` días (dot-matrix), «Producto propio». | 4×2 | Oscura |
| **K10** | **Caso MakeaPet** | `/work/makeapet` | P1 | Cover, cifra `680+` tests, «iOS · Android · Web». | 4×2 | **Gradiente magenta/rosa** (`ref-3`) |
| **K11** | **Experiencia** | `/experience` | P1 | Línea de tiempo horizontal 2010 → HOY con años en dot-matrix y 6 o 7 nodos (empresa + cargo corto). Cada nodo con caso marca un punto relleno. Toda la card es una sola puerta (los nodos enlazan en `/experience`, no aquí). | 8×2 | Oscura con línea blanca |
| **K12** | **Cifras de carrera** | `/experience` | P1 | Tres cifras dot-matrix: `12` años · `10` casos · `3` productos propios (las tres se calculan de los datos, como hoy). | 4×2 | **Losa blanca** |
| **K13** | **Perfil / Sobre mí** | `/about` | P1 | Segundo retrato, **sin máscara** (el «revelado» completo, §5.2), 2 líneas de bio, Barranquilla · ES/EN. | 4×3 | Imagen + oscura |
| **K14** | **Cómo trabajo** | `/about#craft` | P2 | Los 4 pasos como 4 renglones cortos numerados (`01–04` en dot-matrix): leer el dominio → construir el lenguaje → el prototipo es la especificación → lanzar y escuchar. | 4×3 | Oscura |
| **K15** | **Testimonio** | caso de origen (`/work/qrvey`, etc.) | P2 | Una cita de ≤ 25 palabras, nombre, cargo y empresa. Rota entre los 3 **solo con controles manuales** (sin autoplay, §5.5). | 4×3 | **Losa blanca** |
| **K16** | **Más trabajo (archivo)** | `/work` | P2 | Lista compacta: Royal Caribbean · Qrvey · Ideaware · Chub, con año dot-matrix (estos casos no tienen KPIs: **no se inventan cifras**, se usa el año). Cada fila es su propio enlace; la cabecera de la card enlaza a `/work`. | 6×2 | Oscura |
| **K17** | **Contacto + CV** | `mailto:` · LinkedIn · `/cv` | P1 en móvil, P2 en escritorio | Correo grande y copiable, LinkedIn, Behance, GitHub, «Descargar CV (PDF)», «Carta». Es la sección `#contact`. | 6×2 | **Losa blanca** grande |

Son 17 cards. Seis entran en el primer pliegue de escritorio (K1–K6). Es el máximo que sostiene la jerarquía: más
cards en el pliegue convierten el bento en ruido (refactoring-ui: la jerarquía sale del contraste de tamaño y de peso,
no de tener más cosas).

**Orden de los casos, decisión UX.** Escala y cargo primero (Naowee, Andes), oficio de punta a punta después
(olbo, BdO, DC, MakeaPet), archivo al final. Requiere decidir si el orden del bento se desacopla del `num` (/01…/10)
de `work.ts`. Propongo un campo `featuredOrder` (o una lista en `src/data/home.ts`) para no renumerar los casos ni
romper `getNextCaseStudy`. **Confirmar con Doug** (§9).

### 4.3 Rejilla y orden de lectura

**Escritorio (≥ 1280 px).** Contenedor de 1376 px como máximo, 12 columnas, gap de 16 px, fila base de 112 px. Con un
header de 64 px quedan 836 px útiles en 1440×900: caben 6 filas (6 × 112 + 5 × 16 = 752 px) más el margen.

```
 col   1   2   3   4   5   6 | 7   8   9 |10  11  12
     ┌───────────────────────┬───────────────────────┐
 f1  │                       │ K2  CLAIM + ROL        │  ← losa blanca
 f2  │   K1  HÉROE · DOUG    │  [Ver casos] [CV PDF]  │
     │   vidrio estriado     ├───────────┬───────────┤
 f3  │   + máscara           │ K3 NAOWEE │ K4 ANDES  │
 f4  │                       │  captura  │ 400+      │  ← gradiente azul
 f5  │   [Quitar máscara]    │  130+     │ 2.000+ 18 │
     │                       ├───────────┼───────────┤
 f6  │  Doug Vargas  ● disp. │ K5 DISPON.│ K6 BAQ    │
     └───────────────────────┴───────────┴───────────┘   ─ pliegue 900 px
     ┌───────────────┬───────────────┬───────────────┐
 f7  │ K7 OLBO       │ K8 BANCO DE   │ K9 DC MEDICAL │
 f8  │ teléfono      │ OCCIDENTE     ├───────────────┤
 f9  │ 647           │ tablet · cita │ K10 MAKEAPET  │  ← magenta
 f10 │ (losa clara)  │ 12+           │ 680+          │
     ├───────────────┴───────────────┼───────────────┤
 f11 │ K11 EXPERIENCIA               │ K12 CIFRAS    │  ← losa blanca
 f12 │ 2010 ──●──●──●──●──●── HOY    │ 12 · 10 · 3   │
     ├───────────────┬───────────────┼───────────────┤
 f13 │ K13 PERFIL    │ K14 CÓMO      │ K15 TESTIMONIO│
 f14 │ retrato sin   │ TRABAJO       │ (losa blanca) │
 f15 │ máscara       │ 01 02 03 04   │ ‹ 1/3 ›       │
     ├───────────────┴───────┬───────┴───────────────┤
 f16 │ K16 MÁS TRABAJO       │ K17 CONTACTO + CV     │  ← losa blanca
 f17 │ RC · Qrvey · Ideaware │ hello@douguizard.com  │
     └───────────────────────┴───────────────────────┘
```

**Orden de lectura = orden del DOM = orden de tabulación:** K1, K2, K3, K4, K5, K6, K7… Se declara con
`grid-template-areas` explícitas por breakpoint. Nada de `grid-auto-flow: dense` ni de `order` que separe lo visual
de lo leído (WCAG 1.3.2 y 2.4.3). El ojo entra por la cara (la losa más grande) y salta a la losa blanca (la de más
contraste), donde están el nombre, el nivel y los CTA. Ese salto en Z es el recorrido que queremos.

**Tableta (768–1279 px).** 6 columnas. K1 a 6×5 a lo ancho y K2 debajo a 6×2. K3 y K4 lado a lado (3×3 cada una).
K5 y K6 en una sola fila. El resto, a 3 columnas o a todo el ancho.

**Móvil (< 768 px).** Ver §5.6.

### 4.4 Estados de una card

Un solo patrón para todas, que cambia de superficie pero no de comportamiento:

| Estado | Comportamiento | Duración / curva |
|---|---|---|
| Reposo | Losa con su protagonista; flecha en pastilla blanca arriba a la derecha (`↗`, como `ref-1`), que indica que es una puerta. | — |
| Hover (`@media (hover:hover) and (pointer:fine)`) | La media interna escala a 1,03 dentro de la losa recortada; la pastilla de flecha gira de `↗` a `→` y se rellena; la losa sube 2 px. Las cifras dot-matrix hacen un «encendido» corto de los puntos (opacidad 0,6 → 1). | 200 ms, `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out fuerte de `emil-design-eng`) |
| Foco (`:focus-visible`) | Anillo de 2 px en el azul eléctrico con `outline-offset` de 3 px y el mismo radio de la losa. Mismos cambios internos que el hover, para que el teclado vea lo mismo que el ratón. | Instantáneo el anillo; 200 ms el resto |
| Pressed (`:active`) | `scale(0.98)` de la losa. | 120 ms ease-out; al soltar, 200 ms |
| Visitado | Nada: el bento no es una lista de enlaces y un color de visitado rompe la paleta. Dentro de `/work` sí se marca «Leído» en mono. | — |
| Reduced motion | Sin escala ni desplazamiento. Solo cambian el color y la opacidad, en 150 ms. | 150 ms lineal |

**Implementación de «toda la card es el enlace».** Patrón *stretched link*: un `<a>` real en el título (`h3`) con
`::after` que cubre la losa. Así el nombre accesible es el título y no la card entera leída como un párrafo (el lector
de pantalla oye «Andes Design System, enlace»), el texto se puede seleccionar y los enlaces secundarios (las filas de
K16, el selector ES/EN de K6) quedan encima con `position: relative; z-index`. Ningún enlace va anidado dentro de otro.

### 4.5 Qué pasa al tocar (card → destino)

Transición por **elemento compartido**: la media de la card se convierte en la portada del destino y el título en
el H1. Con la View Transitions API (soportada en el App Router de Next 16 / React 19 con `<ViewTransition>`), y un
fundido simple como respaldo donde no exista.

| Origen → destino | Qué se transforma | Duración / curva | Vuelta (Atrás) |
|---|---|---|---|
| Card de caso → `/work/[slug]` | La media (captura o cifra) crece a la portada a sangre; el título se mueve a la posición del H1; el resto del bento se funde a negro. | 420 ms, `cubic-bezier(0.23, 1, 0.32, 1)`; el contenido del caso entra 80 ms después (fade + 8 px) | 280 ms (salir es más rápido que entrar) y vuelta a la misma posición de scroll del bento |
| K1 Héroe o K13 Perfil → `/about` | El retrato se expande a la portada del perfil y **termina de quitarse la máscara** durante la transición (la máscara es una capa que se desvanece en los últimos 150 ms). | 480 ms (es el momento de marca: se permite algo más largo, pero menos de 500) | 280 ms |
| K11 Experiencia → `/experience` | La línea del timeline crece a lo ancho y se convierte en el eje de la página; los nodos mantienen su posición relativa. | 420 ms | 280 ms |
| K5 / K6 / CTA Contacto → `#contact` | Scroll suave a la sección; el foco pasa al H2 de contacto. | Nativo (`scroll-behavior: smooth` solo sin reduced motion) | — |
| CTA CV → `/cv` | Cambio de página normal con fundido. **El CV no lleva efectos**: es el documento que se imprime. | 200 ms | — |

Reglas: la URL cambia siempre (los casos son rutas reales, con deep link y SEO); el botón Atrás devuelve al bento en
la misma posición; una transición se puede interrumpir con otro clic; con reduced motion la transición es un fundido
de 150 ms sin transformaciones.

---

## 5. Recorrido y momentos clave

### 5.1 El recorrido completo

```
 Llegada ──► Héroe (K1+K2) ──► Escaneo del bento ──► Puerta ──► Caso / Perfil / Timeline ──► Siguiente o Contacto
   0 s        5 s: quién y nivel  30 s: escala, oficio,  clic     3 min: rol, decisiones,      CTA al final de
              juego con la máscara  carrera, disponible            impacto, testimonio          cada destino
```

Cada destino termina con dos salidas y nunca con un callejón: **siguiente caso** (card bento grande, como el
`CaseNext` actual) y **contacto/CV**. El perfil termina en «Ver casos»; el timeline, en «Descargar CV».

### 5.2 El héroe: vidrio estriado y máscara que se revela

Narrativa: **la máscara es la marca douguizard; quitarla es conocer a Doug.** En el landing se juega a quitarla;
en `/about` la cara aparece descubierta. Así el efecto tiene sentido y no es decoración: es la puerta de la card K1.

Capas (de abajo arriba), que el frontend prototipa en `03-TECNICA.md`:

1. Retrato base de Doug, **sin máscara** (imagen A).
2. Retrato idéntico **con máscara** (imagen B: mismo encuadre, pose y luz; es el par alineado que pide el brief para
   Higgsfield).
3. Máscara en 2 o 3 capas (visor/lente, placa de la boca, piezas laterales) que se retiran por radio alrededor del
   cursor, de la capa más externa a la más interna.
4. Vidrio estriado oblicuo sobre todo (desplazamiento por franjas, WebGL o SVG `feDisplacementMap`), más fuerte en
   los bordes y casi nulo sobre los ojos, para que la cara se reconozca.
5. Texto (nombre, disponibilidad), **fuera** del vidrio y siempre en HTML.

Comportamiento:

| Contexto | Interacción | Detalle |
|---|---|---|
| Puntero fino | El radio de revelado sigue al cursor con un muelle (no lineal): las capas se retiran con un retraso de 40–60 ms entre sí. Al salir de la card, la máscara vuelve en 600 ms. | Muelle suave, sin rebote visible (`emil-design-eng`: `bounce ≤ 0.15`) |
| Táctil | **Tocar y arrastrar** sobre la cara revela (scrub). Un toque corto sin arrastre = abrir `/about`. Entre los dos gestos hay un umbral de 8 px de movimiento o 150 ms. | El scroll vertical no se bloquea: el arrastre que empieza en vertical es scroll (`touch-action: pan-y` en la card) y el revelado solo se activa con arrastre horizontal o diagonal. |
| Primera visita (sin reduced motion) | **Pista automática una sola vez**: a los 1,2 s del LCP, la máscara se retira en un barrido diagonal y vuelve (1,6 s en total). Enseña que ahí hay algo sin necesidad de un texto «pasa el mouse». | Una sola vez por sesión (`sessionStorage`) |
| Teclado / lector | Botón real «Quitar máscara / Poner máscara» (`aria-pressed`) dentro de K1, alcanzable con Tab antes del enlace al perfil. Revela todo con un fundido de 300 ms. | El `alt` del retrato describe a Doug, no el efecto |
| Reduced motion | Sin vidrio animado ni seguimiento del cursor: imagen estática con el vidrio «horneado» y el botón como único control (fundido de 150 ms). | — |
| Giroscopio | **No por defecto** (iOS exige permiso con un diálogo, y pedir permisos en el primer segundo es hostil). Como mucho, una opción en una iteración posterior. | — |

### 5.3 Cómo se cuenta un caso (plantilla nueva)

La estructura actual tiene buenas piezas en mal orden (D9). Propuesta de página de caso, en este orden, mapeada a los
campos que **ya existen** en `CaseStudy`:

| # | Bloque | Pregunta que responde | Campos actuales | Nuevo |
|---|---|---|---|---|
| 1 | **Portada** | ¿Qué es y qué logró? | `project`, `tagline`, `cover`/primera imagen | La media llega del bento (elemento compartido). Portada a sangre en el primer pliegue; H1 a un máximo de ~72 px (hoy ~110). |
| 2 | **Ficha** | ¿Quién era yo aquí? | `getCaseMeta` (rol, año, cliente), `team`, `duration` | Chips grandes y legibles: **Rol · Equipo · Duración · Plataformas**. El rol, en 18 px, no en 13. |
| 3 | **Tablero de impacto** | ¿Cuánto movió? | `kpis`, `impact` | 3–4 cifras en dot-matrix grandes, en losas tipo bento (es la firma visual del caso). Sin KPIs, el bloque muestra solo `impact` en display (como hoy; nunca se inventa una cifra). |
| 4 | **El problema** | ¿Por qué era difícil? | `context` | 1 párrafo, máximo 60 palabras. |
| 5 | **Mi parte** | ¿Qué decidí yo y qué hizo el equipo? | `contributions` | Lista corta; opcional un campo `ownership` (qué fue mío / con quién). **Lo escribe el writer con Doug; no se infiere.** |
| 6 | **Decisiones** | ¿Cómo pienso? | `decisions` | **Suben**: van antes de la galería. Cada una: tensión → elección → por qué → evidencia (imagen al lado). Es el bloque que juzga el director de diseño. |
| 7 | **El producto** | ¿Cómo se ve y se usa? | `film`, `video`, `gallery`, `story` | Recorrido visual; los capítulos (`story`) de olbo/DC/MakeaPet entran aquí. |
| 8 | **Proceso** | ¿Cómo llegué ahí? | `process`, `features` | Más compacto que hoy; una línea por fase en un riel horizontal. |
| 9 | **Prueba de terceros** | ¿Quién lo avala? | `testimonialId` | Cita grande en losa blanca. |
| 10 | **Colofón** | Herramientas, enlaces, créditos | `technologies`, `externalLink`, `links`, `credits` | — |
| 11 | **Siguiente** | ¿Y ahora? | `getNextCaseStudy` | Card bento del siguiente caso + «Hablemos». |

En escritorio, un **índice lateral fijo** (Impacto · Problema · Mi parte · Decisiones · Producto) con progreso permite
saltar de una sección a otra: es el «TL;DR de 30 segundos» para quien escanea. En móvil, el índice es una pastilla
fija abajo que abre una hoja con las secciones.

Por tipo de caso:

- **NDA (Andes):** la portada es el tablero de cifras sobre el gradiente azul (la misma card del bento, ampliada); la
  viñeta actual de tokens → componente pasa a ilustrar el bloque de decisiones; el CTA «Te lo muestro en una llamada»
  se mantiene y sube junto al tablero.
- **Largos (olbo, DC, MakeaPet):** se mantienen los capítulos, pero el bloque de decisiones se extrae al frente.
- **Cortos (Royal Caribbean, Ideaware):** se asume que son cortos. Página de una sola pantalla y media: portada,
  ficha, problema, mi parte, testimonio (RC) y siguiente. No se rellenan con secciones vacías.

### 5.4 La página de perfil (`/about`)

1. Portada: retrato **sin máscara** a sangre (llega desde K1 o K13), nombre, los tres cargos y la ubicación.
2. Bio en 3 frases (de `site.summary`, reescrita por el writer).
3. «Lo que hago»: las 3 especialidades del panel Oficio actual en 3 cards.
4. «Cómo trabajo»: los 4 pasos, con un diagrama simple de 4 nodos en línea (skill Diagram Design: ejes claros,
   etiquetas cortas).
5. Datos: base, zona horaria, idiomas (con nivel), disponible para.
6. Testimonios (los 3), herramientas y la tira de empresas.
7. Cierre: «Ver casos» y «Descargar CV».

### 5.5 El timeline de experiencia (`/experience`)

- **Escritorio:** una línea horizontal de 2006 a HOY con los años en dot-matrix, agrupada en eras con nombre
  («Origen» 2006–2014 · «Producto» 2014–2018 · «Sistemas» 2018–2024 · «Escala» 2024–2026 · «Ahora» 2026). Los
  nombres de era son propuesta; el writer los afina. Cada etapa es una card con empresa, cargo, periodo
  (`formatPeriod`), 1–2 logros (de `cv.ts`) y «Ver caso» si tiene `caseSlug`. Se recorre con **scroll vertical
  normal**: la línea avanza ligada al scroll (scrub) sin anclar la página, o con un carril horizontal nativo
  (`overflow-x` con `scroll-snap`, arrastre y flechas del teclado). **No se ancla con pin y scrub**: es la página que
  más quiere escanear el reclutador.
- **Móvil:** línea vertical a la izquierda, con el año dot-matrix fijo (sticky) arriba mientras se recorre cada era.
- Las dos versiones terminan con «Descargar CV (PDF)».
- Accesible como lista ordenada (`<ol>`) de etapas; la línea es decorativa (`aria-hidden`).

### 5.6 Móvil (390 px)

No es el escritorio apilado. Orden y formato:

| # | Bloque | Formato móvil |
|---|---|---|
| 1 | K1 Héroe | 4:5 a lo ancho (~470 px), nombre y disponibilidad sobre la imagen, botón «Quitar máscara» visible. |
| 2 | K2 Claim + rol | Losa blanca con H1, línea de nivel, **CTA primario a todo el ancho «Ver casos»** y «CV» secundario. Con el 1 llena el primer pliegue: nombre, nivel y CTA visibles sin scroll. |
| 3 | K3 Naowee · K4 Andes | Dos losas a ancho completo, 1:1. |
| 4 | K5 + K6 | Una fila de dos losas pequeñas (disponible · BAQ 14:32). |
| 5 | K7 olbo · K8 BdO | A ancho completo. |
| 6 | K9, K10, K16 | **Carrusel horizontal** con `scroll-snap` (losas al 80 % del ancho, la siguiente asomando 16 px como pista), con contador «2/5» y botones para teclado y lectores. Es el único carrusel. |
| 7 | K11 + K12 | El timeline en versión «pastilla»: 4 nodos y las 3 cifras. |
| 8 | K15 Testimonio | Una cita y sus controles. |
| 9 | K13 + K14 | Perfil y Cómo trabajo, apilados y compactos. |
| 10 | K17 Contacto + CV | Losa blanca con botones grandes (≥ 48 px): correo, LinkedIn, CV. |

Meta: **≤ 6 pantallas** (≈ 5.000 px). Navegación: un **dock flotante inferior** en pastilla (Trabajo · Perfil · CV ·
Contacto, ≤ 5 destinos, como pide la guía de navegación inferior), que se esconde al bajar y aparece al subir, y
respeta `env(safe-area-inset-bottom)`. El selector de idioma queda en el header (visible, nunca dentro de un menú).
Objetivos táctiles de ≥ 44 × 44 px con 8 px de separación.

### 5.7 Navegación y header

- **Escritorio:** wordmark douguizard (→ `/`) · Trabajo · Perfil · Experiencia · CV · `[ES | EN]` · pastilla «Hablemos».
  El LinkedIn sale del header: queda en K17 y en el perfil. Se retira el rail 00–04.
- El header es una pastilla flotante de vidrio oscuro sobre el bento (encaja con `ref-3`), con altura fija de 64 px
  para no mover la rejilla.
- Enlace «Saltar al contenido» primero en el orden de tabulación (ya existe; se conserva).

---

## 6. Para el UX writer: estrategia de mensaje

No es copy final; es el encargo.

1. **H1 = nombre + posicionamiento en una línea con verbo.** Que se pueda leer en voz alta y diga qué hace, a qué
   nivel. Las dos ideas fuertes del material existente: «diseñador de producto que construye» y «dirige el producto y
   después lo construye» (`specs/10`). Evitar «humano», «IA» y «era» como palabras de titular: son de todos.
2. **La línea de nivel lleva los tres cargos sin adornos**: Head of Product · Senior Product Designer · Design
   Engineer (de `site.headline`).
3. **Las cards de caso hablan de resultados en ≤ 8 palabras + una cifra.** La cifra viene de `kpis`; si no hay
   cifra, no hay cifra.
4. **Cada CTA dice el destino**: «Ver casos», «Leer el caso», «Descargar CV (PDF)», «Escríbeme». Nada de «Saber más».
5. **El NDA se convierte en señal**: «Las pantallas son de Mercadolibre; el sistema te lo muestro en una llamada.»
6. **Bloques de caso con títulos que son preguntas o afirmaciones del propio caso**, no rótulos genéricos («Contexto»,
   «Proceso»). La estructura es fija; los títulos, propios.
7. **ES primero, EN equivalente**, no literal. Mismas longitudes aproximadas (±15 %) para que el layout sea el mismo.
   Cifras con el formato de cada idioma (2.000+ / 2,000+), como ya hacen los datos.
8. **Ninguna cifra sin fuente** (regla vigente de `specs/10` §D.7).

---

## 7. Accesibilidad, rendimiento, bilingüe y SEO

### 7.1 Accesibilidad (WCAG 2.2 AA)

- **Teclado:** el orden de tabulación es el orden de lectura (§4.3). Foco visible en todas las cards (§4.4). El
  revelado tiene un botón equivalente (§5.2). Los carruseles tienen botones y aceptan flechas. No hay trampas de foco.
- **Reduced motion:** sin pista automática, sin seguimiento del cursor, sin escala en hover; transiciones de página
  como fundido de 150 ms. Las animaciones ligadas al scroll quedan en su estado final.
- **Contraste:** el texto sobre gradientes se verifica en su **peor punto**, no en el promedio (≥ 4,5:1 para texto y ≥
  3:1 para cifras de más de 24 px). El dot-matrix tiene poca tinta: usarlo solo a partir de 32 px, en blanco sobre
  oscuro o tinta sobre blanco, y nunca en gris tenue. El texto de las cards **nunca va sobre el vidrio estriado**.
- **Semántica:** las cifras dot-matrix son texto (fuente) o SVG con `role="img"` y `aria-label="400 o más
  diseñadores"`. El bento es una lista (`<ul>`) o una serie de `<article>` con `h3`. Las imágenes de producto llevan
  `alt` descriptivo (ya existe en los datos).
- **Movimiento automático:** nada se mueve en bucle más de 5 s sin control (WCAG 2.2.2). El reloj de K6 cambia una
  vez por minuto, y eso no cuenta como animación.
- **Táctil:** objetivos de ≥ 44 px; el revelado no captura el scroll vertical.

### 7.2 Rendimiento

- **LCP:** hoy el LCP es texto del H1 (228 ms en local). Con el retrato en el héroe, el LCP pasa a ser **la
  imagen**. Reglas: un póster estático AVIF/WebP con el vidrio ya horneado, `priority` y `fetchpriority="high"`, con
  `sizes` correctos (~720 px de ancho en escritorio para un 6×6, ~780 px en móvil a DPR 2), **≤ 120 KB en móvil**.
  Meta: LCP < 2,0 s en 4G de gama media.
- El **WebGL del vidrio y de la máscara se monta después del LCP** (`requestIdleCallback` o al primer
  `pointermove`), solo con `pointer: fine` o tras el primer toque, y nunca con `Save-Data` ni con reduced motion. Al
  montarse, aparece sobre el póster con un fundido de 200 ms; si falla, se queda el póster.
- La imagen B (con máscara) se carga **después** de la A, porque solo hace falta al interactuar.
- Imágenes de las cards por debajo del pliegue con `loading="lazy"` y caja reservada con `aspect-ratio` (CLS = 0).
- Fuentes: display y dot-matrix con preload solo para los pesos usados en el pliegue; `font-display: swap` en la
  display y `optional` en el dot-matrix (si no llega, una mono de respaldo con la misma métrica).
- Presupuesto de JS del landing: el bento es HTML de servidor; solo K1 (revelado), K6 (reloj), K15 (testimonio) y el
  carrusel móvil son islas de cliente.

### 7.3 Bilingüe

- ES en `/`, EN en `/en`. Mismas rutas por debajo (`/work/x` ↔ `/en/work/x`), mismos ids de ancla.
- El selector de idioma **siempre visible** en el header (no dentro del menú móvil), como segmento `ES | EN` con
  `aria-current` en el activo y `lang`/`hreflang` en cada opción. Al cambiar, se conserva la ruta y el hash.
- `<html lang>` correcto por ruta (ya resuelto con los dos layouts).
- La imagen del héroe y el layout no cambian por idioma; el texto de las cards se diseña con el EN, que suele ser
  ~10–15 % más corto, y el ES más largo como caso límite.

### 7.4 SEO

- H1 de texto real con **nombre + rol** (hoy el H1 no lleva el nombre: el nombre solo aparece en el header y en el
  `title`).
- `title` y meta description por ruta (ya existen); añadir los de `/work`, `/about` y `/experience`.
- Las nuevas rutas entran en `sitemap.ts` y en `alternatesFor` (`hreflang` es/en/x-default).
- JSON-LD: se conserva Person y cada caso; se añade `ProfilePage` en `/about` y `ItemList` en `/work`.
- **Ningún contenido vive solo en el canvas.** Nombre, cargos y textos de las cards están en el HTML del servidor.
- Nueva imagen OG con la cara (la versión estática del héroe), por idioma si el texto cambia.

---

## 8. Dos estrategias de landing

Las dos usan las mismas cards (§4.2), las mismas rutas y la misma plantilla de caso. Cambian **cómo se llega al
bento y cómo se vive.**

### Estrategia A · «Tablero»: el bento es el home y todo queda a un clic

**Qué es.** El landing *es* el bento desde el primer píxel. El héroe es la card más grande del tablero (K1, 6×6),
rodeada desde el inicio por el claim, los dos casos de escala y la disponibilidad. La entrada está coreografiada:
las cards se ensamblan en ~600 ms (K1 primero, luego K2, luego el resto en ondas de 40 ms, solo opacidad y 12 px de
desplazamiento) y la pista automática de la máscara llega a los 1,2 s. Después, scroll vertical normal por el resto
del tablero. El momento «cinematográfico» es opcional: al hacer clic en la cara se abre el perfil con la transición
de elemento compartido, donde la máscara termina de caer.

| Audiencia | Pros | Contras |
|---|---|---|
| Reclutador | Pasa el test de 5 s por construcción: nombre, nivel, Mercadolibre, Naowee, disponibilidad y CV en el primer pliegue. Cero aprendizaje: es una página que se desplaza. | Si la dirección de arte se pasa, puede parecer un dashboard de Dribbble. Se mitiga con contenido real en cada card. |
| Director de diseño | Ve oficio en la rejilla, en las cifras y en el vidrio sin esperar. El ensamblaje y las transiciones card → caso demuestran motion con criterio. | El héroe tiene menos superficie (~50 % del pliegue) para lucir el vidrio y la máscara. |
| Cliente / fundador | Ve productos propios (olbo, DC) en el primer scroll y el contacto siempre a la vista. | — |
| Técnica | LCP simple (una imagen de ~720 px), poco JS, sin pin. Móvil corto (≤ 6 pantallas). | El revelado en una card más pequeña exige un recorte de cara muy cuidado. |

### Estrategia B · «Cine → Sistema operativo»: héroe a pantalla completa y un bento que emerge y se vuelve un OS personal

**Qué es.** Tres actos:

1. **Acto 1 · Retrato (0–100 svh).** La cara de Doug a sangre, a pantalla completa, con el vidrio estriado oblicuo
   cruzando toda la pantalla, el nombre enorme en display y la máscara jugable en todo el viewport. Solo el header
   mínimo y una indicación de scroll.
2. **Acto 2 · Ensamblaje (scroll de 100 a ~220 svh, anclado).** Con scrub de ScrollTrigger, el retrato se encoge
   hasta su posición de card (FLIP ligado al scroll), las franjas del vidrio giran de oblicuas a verticales y las
   demás cards entran a su sitio desde sus coordenadas finales.
3. **Acto 3 · El OS.** El bento se convierte en un tablero con un **dock lateral** (Trabajo · Perfil · Experiencia ·
   Contacto, como el dock de `ref-3`) que filtra o resalta cards. Los casos se abren como **hojas sobre el tablero**
   (rutas interceptadas de Next, `@modal/(.)work/[slug]`, con URL real; al recargar, se ve la página completa) y se
   cierran con Esc, deslizando hacia abajo o con Atrás.

| Audiencia | Pros | Contras |
|---|---|---|
| Reclutador | Memorable: «el del vidrio». El dock deja claro qué hay. | **Falla el test de 5 s si el acto 1 no incluye nivel y CTA**: el primer pliegue es solo cara y nombre. El trabajo empieza tras ~1,2 pantallas de scroll anclado. El scroll anclado se siente como scroll secuestrado y en un portátil de 720 px de alto se vuelve largo. Abrir los casos en hoja confunde a quien quiere abrirlos en pestañas para compararlos. |
| Director de diseño | Máximo impacto de oficio: muestra dominio de shaders, scroll y coreografía. Es la que se comparte en redes. | Si una sola transición da tirones, el juicio se invierte. El riesgo de «efecto por el efecto» es alto, y los directores lo penalizan. |
| Cliente / fundador | Efecto «wow» de marca personal. | Más tiempo hasta ver productos y contacto. |
| Técnica | — | Pin y scrub con FLIP de una imagen grande y WebGL activo: rendimiento delicado en Android de gama media. Accesibilidad más difícil (hojas modales con foco atrapado, scroll anclado con teclado y lectores de pantalla). En móvil el acto 2 casi siempre se degrada a un apilado, así que se diseña dos veces. Duplica el trabajo de QA. |

### Comparación

| Criterio | A · Tablero | B · Cine → OS |
|---|---|---|
| Test de 5 s (nivel + trabajo visibles) | ✅ en el pliegue | ⚠️ solo si el acto 1 carga nivel y CTA |
| Impacto visual de la cara | Alto (card 6×6 + perfil a sangre) | Máximo (viewport completo) |
| Tiempo hasta el primer caso | 0 scroll | ~1,2–2 pantallas |
| Longitud del home móvil | ≤ 6 pantallas | 7–8 (el acto 1 ocupa una pantalla entera) |
| Riesgo de rendimiento (LCP, tirones) | Bajo | Medio-alto |
| Accesibilidad | Directa | Exige un trabajo fino (pin, modales) |
| Coste de construcción y QA | 1× | ~1,8× |
| Encaje con `ref-3` (tablero con dock) | Rejilla sí, dock no | Total |

### Recomendación: **A «Tablero»**, con dos préstamos de B

Recomiendo A por cuatro razones:

1. **El brief pone una regla por delante del efecto:** *recruiter-first, en 5 segundos se entiende quién es, qué
   hace, nivel y dónde ver el trabajo* (principio 6, §5 del brief). A la cumple por construcción; B la cumple solo si se
   abarrota el acto 1, y entonces pierde su gracia.
2. **El oficio se prueba mejor con un efecto impecable en una card que con uno ambicioso que da tirones.** Para el
   director de diseño, un vidrio estriado a 60 fps con un revelado accesible vale más que un scroll anclado de 1,2 s.
3. **El móvil, donde muchos reclutadores abren el enlace desde LinkedIn**, sale corto y claro con A. B se degrada en
   móvil hasta parecerse a A, así que habría que pagar dos diseños.
4. **El contenido es asimétrico** (casos de escala sin imágenes, productos propios con muchas): un tablero lo
   equilibra con cifras y capturas lado a lado; una película lineal lo expone.

Préstamos de B que **sí** entran en A:

- **El momento a pantalla completa existe, pero es opcional:** al abrir el perfil (desde K1 o K13), la cara se
  expande a sangre y la máscara cae del todo (480 ms). Quien quiere el efecto lo encuentra; quien busca el CV no lo
  sufre.
- **La coreografía de ensamblaje al cargar** (600 ms, sin scroll anclado) da el «el tablero se arma» de B sin
  secuestrar el scroll.

Lo que **no** entra de B: el scroll anclado del home, el dock lateral en escritorio (duplica el header) y los casos en
hoja modal (rompen abrir en pestaña y la lectura larga; los casos son páginas).

**Cómo validar la decisión antes de construir:** un test de 5 segundos con 5 personas (2 reclutadores, 2 diseñadores
y 1 fundador) sobre las maquetas de `05-PROPUESTAS.md`. Preguntas: ¿cómo se llama, qué cargo y nivel tiene, dónde
harías clic para ver su trabajo? Criterio de A: 4 de 5 aciertan las tres. Si B también lo logra, la diferencia la
decide el rendimiento en un Android de gama media.

---

## 9. Preguntas abiertas para Doug

1. **Orden de los casos en el landing:** ¿Naowee → Andes → olbo → BdO → DC → MakeaPet? Implica separar el orden del
   home de la numeración /01–/10.
2. **Tema:** el rediseño es oscuro con losas blancas. ¿Se retira el toggle claro/oscuro del landing y los casos? (El
   `/cv` seguiría claro para imprimir.)
3. **Disponibilidad:** ¿«Head of Product en Naowee · consultoría puntual» (lo de hoy) o «abierto a roles»? Cambia el
   tono de K5 y K17.
4. **Rutas nuevas:** ¿`/about` y `/experience` como páginas, o `/experience` dentro de `/about`?
5. **Imágenes del héroe:** validar el parecido de cada retrato de Higgsfield antes de usarlo (D12) y aprobar el par
   con y sin máscara.
6. **LinkedIn:** deja de ser el CTA primario del héroe. ¿De acuerdo?
7. Pendientes heredados de `specs/10` §F: Chub con la marca Tesla y MakeAppet a 1x en el archivo.

---

## Fuentes

- Hiring managers y portafolios de producto: [Dribbble · What hiring managers look for in a design portfolio](https://content-hub.dribbble.com/?p=176) ·
  [ADPList · What is a hiring manager looking for in a design portfolio](https://adplist.org/blog/what-is-a-hiring-manager-looking-for-in-a-design-portfolio) ·
  [Leslie Yang · What a hiring manager looks for in product design portfolios](https://leslieyang.substack.com/p/what-a-hiring-manager-looks-for-in) ·
  [UX Collective · What hiring managers look for in a product design portfolio](https://uxdesign.cc/what-hiring-managers-look-for-in-a-product-design-portfolio-7b1837360bf9) ·
  [The Fountain Institute · What Actually Gets Senior Product Designers Hired in 2026](https://www.thefountaininstitute.com/blog/senior-product-designers-hired) ·
  [Medium / Kalibrr · 4 Things Recruiters Look For](https://medium.com/kalibrr-design/4-things-recruiters-look-for-in-your-design-portfolio-5e2471348540)
- Cómo se escanean los casos: [UXfolio · Case study mistakes](https://blog.uxfol.io/case-study-mistakes/) ·
  [UXfolio · UX portfolio playbook](https://blog.uxfol.io/ux-portfolio-playbook/) ·
  [UXfolio · UX case study structure](https://blog.uxfol.io/ux-case-study-structure/) ·
  [NN/g · 7 Portfolio Mistakes](https://www.nngroup.com/videos/7-portfolio-mistakes/)
- Guías internas: `.claude/skills/ui-ux-pro-max` (búsquedas: estilo `bento-box-grid`; UX: hover vs. tap, reduced
  motion, focus states, image optimization, back button, duration timing; para «portfolio», «bento» y «landing hero»
  no hubo coincidencia en el dominio UX y se usó el dominio de estilo), `refactoring-ui` (jerarquía por contraste y
  escalas), `emil-design-eng` (curvas `cubic-bezier(0.23, 1, 0.32, 1)`, transiciones de UI por debajo de 300 ms y
  salidas más rápidas que entradas).
