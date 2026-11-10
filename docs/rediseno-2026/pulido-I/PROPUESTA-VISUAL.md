# Pulido I · V-1 · Propuesta visual: tipografía e iconos

> Solo lectura. Fuentes: `crafthings/CATALOGO.md` y los skills `better-ui` (icon-transitions, icons),
> `better-typography`, `make-interfaces-feel-better`, `animate-text` (specs JSON), `transitions-dev`, `choreograph`,
> `animation-performance`. Fuera de alcance: héroe (vidrio, láser, escena), losa de Naowee, y lo que ya existe
> (View Transitions, selección deslizante, iconos del dock outline→fill, timeline, marquee, odómetro, `--dw` de Doto).

## 0 · Lo que encontré antes de proponer

- **Rasgos OpenType reales** (leídos de los woff2 del último build con fontTools):
  Instrument Sans `wght 400–700`, `liga`, `tnum`, `pnum`, `kern`. **Urbanist (latin) no trae `tnum` ni `ss`/`case`**;
  solo `frac` y `kern`. **Doto (subset latin) no trae GSUB**: el `tabular-nums` de `.dot` (`sistema.css:49`) y
  `.pasos-num` (`tablero.css:554`) no hace nada (Doto ya es monoespaciada, así que no se rompe). Ninguna tiene `opsz`.
  Consecuencia: las cifras que deban ser tabulares van en Instrument o en Doto, nunca en Urbanist.
- **Trazo de iconos dispar** a 20 px: 1,25 (`ThemeToggle.tsx:53,68`), 1,5 (sprite `sistema.css:278`, menú
  `chrome.css:393`), 1,6 (`globals.css:1597`, `caso.css:684`), 1,75 (dock 24 px, `chrome.css:655`).
- **Estados sin icono**: «Copiar correo» cambia el texto pero el icono no (`CopiarCorreo.tsx:29-31`). El menú móvil
  gira las dos rayas 90° (`chrome.css:396-398`): de «=» pasa a «‖», no a una ✕.
- **Citas**: en `/about` llevan comillas en línea (`Secciones.tsx:216`), en K15 del home no llevan (`CardTestimonio.tsx:32`).
  Ninguna cuelga la comilla. La cita de K15 cambia de golpe al pulsar ‹ ›; solo el número del contador se anima.

## 1 · Mejoras, por impacto/coste

Regla común: solo `opacity`/`transform` (o `scale`/`translate`/`rotate`), nada de `filter` animado; todas con
`@media (prefers-reduced-motion: reduce)` → cambio instantáneo. Ninguna añade JS a la carga ni dependencias.

### 1. Copiar → Copiado con cruce de icono · **APLICAR YA**
- Dónde: `CopiarCorreo.tsx:29-31`, trazo nuevo en `Iconos.tsx:35` (junto a `copiar`), estilos en `tablero.css:764`.
- Técnica: `better-ui/icon-transitions.md`, receta «CSS, los dos iconos en el DOM» (copy → copied es justo su caso).
  Trazo `hecho`: `<path d="M5 10.5 8.5 14 15 6" />`. Los dos `Icono` en una celda `display:grid`, `grid-area:1/1`.
- Valores: 250 ms (`transitions-dev`: swap de icono, simétrico), `cubic-bezier(0.2, 0, 0, 1)`; oculto =
  `opacity:0; scale:.25`, visible = `opacity:1; scale:1`. Sin blur (regla de rendimiento). El texto «Copiado» entra
  con `opacity 0→1` y `translate 0 4px→0` en 150 ms `--curva-suave` (text swap de `transitions-dev`), con `key`.
  Error: se queda el icono `copiar` y solo cambia el texto.
- Coste: ~0,3 KB gz de CSS, 1 `<symbol>`. TBT/CLS: nulo (la celda la fija el icono de 20 px).
- RM: sin escala ni desplazamiento, cambio inmediato.
- Verificar: clic en `/` (K17) a 390 y 1440; el `aria-live` sigue anunciando; captura del estado «Copiado».

### 2. Menú móvil: hamburguesa → ✕ · **APLICAR YA**
- Dónde: `SiteHeader.tsx:238-239` (partir el `path` en dos: `M4 7h12` y `M4 13h12`) y `chrome.css:390-398`.
- Técnica: swap de icono simétrico (`transitions-dev`, regla 2). Abierto: raya 1 `translate:0 3px; rotate:45deg`,
  raya 2 `translate:0 -3px; rotate:-45deg`, con `transform-box: view-box; transform-origin: 10px 10px`. Quitar el
  `rotate: 90deg` actual.
- Valores: 250 ms `--curva-suave` (`cubic-bezier(0.22,1,0.36,1)`) ida y vuelta.
- Coste: 0 KB; solo `transform`. RM: salta al estado final.
- Verificar: `controles.spec` «menú móvil» (no mira el icono, debe seguir verde); captura 390 abierto/cerrado.

### 3. Comillas tipográficas colgadas en todas las citas · **APLICAR YA**
- Dónde: `tablero.css:585` (K15) y `perfil.css:561` (`/about`).
- Técnica: `better-typography/wrapping-and-punctuation.md` (puntuación inteligente y colgada). K15: `quotes:"“" "”"`
  y `::before{content:open-quote}` / `::after{content:close-quote}` (la cita es `lang="en"`); antes, quitar el `”`
  final que pueda traer `oracionDe` (`i18n/tablero.ts:146`). En las dos: `hanging-punctuation: first last` (Safari)
  y, para Chromium/Firefox, `text-indent: -0.42em` en el `blockquote` (medir el ancho de «“» en Urbanist 500 a 20 px
  y ajustar; en `/about` la comilla ya está en el texto, así que solo se cuelga).
- Coste: 0 KB, sin animación. CLS: nulo (estático). Puede sumar una línea en una cita: medir alto del home.
- Verificar: captura 390 de K15 y de `/about` citas; el borde izquierdo del texto queda alineado con la ceja.

### 4. Cambio de cita en K15 con «fade through» · **APLICAR YA**
- Dónde: `CardTestimonio.tsx:31` (`key={i}` en `.k15-cita`) y CSS junto a `.contador-n` (`tablero.css:654-662`).
- Técnica: spec `fade-through` de `animate-text`, solo la entrada (la salida doble duplicaría el DOM y el alto).
- Valores: 240 ms `cubic-bezier(0.2, 0, 0, 1)`; desde `opacity:0; translate:0 6px`. Sin blur (el spec trae 2 px;
  se quita por la regla). Mismo ritmo que el número del contador, que ya entra en 200 ms.
- Coste: ~0,1 KB gz. Lo dispara el usuario: no cuenta para CLS.
- RM: sin animación. Verificar: pulsar ‹ › a 390; el foco no se pierde; el `aria-live` lee la nueva cita.

### 5. Un solo trazo de iconos · **APLICAR YA**
- Dónde: `globals.css:1597` y `caso.css:684` (1,6 → 1,5); `ThemeToggle.tsx:53,68` (1,25 → 1,5). Token
  `--trazo: 1.5` y `--trazo-dock: 1.75` en `globals.css` (bloque de tokens, ~l. 316) usados en `sistema.css:278`,
  `chrome.css:393`, `chrome.css:655`.
- Técnica: `better-ui/icons.md`: 1,5 px junto a texto 400 de 14–16 px; 1,75–2 px junto a 500–600 (el dock).
  `videoChrome.tsx:17,31` se deja en 1,25: es el cromo fingido de un dispositivo, no UI del sitio.
- Coste: 0. Sin animación. Verificar: captura de hoja de caso (botón círculo/secciones) y cabecera a 390.

### 6. Contadores con cifras tabulares (Instrument) · **APLICAR YA**
- Dónde: `.contador` en `tablero.css:663` (K15) y `tablero.css:1083` (carrusel móvil, «1 de 4»).
- Técnica: `make-interfaces-feel-better/typography.md` (tabular numbers). `font-variant-numeric: tabular-nums`:
  Instrument trae `tnum`, así «de 4» no se corre 1 px cuando el número cambia y anima.
- Coste: 0. RM: n/a. Verificar: pasar 1→4 en el carrusel a 390 y ver que «de N» no se mueve.

### 7. Cortes de línea: `pretty` en apoyos y `balance` en K17 · **APLICAR YA (si la altura pasa)**
- Dónde: `text-wrap: pretty` en `.apoyo` (`sistema.css:33`), `.lead` (`paginas-b.css:92`), `.k17 .lead`
  (`tablero.css:722`), `.k2 .sub` (`tablero.css:~189`). `text-wrap: balance` en `.k17 h2` (`tablero.css:718`),
  el único titular grande sin él.
- Técnica: `make-interfaces-feel-better/typography.md` (sin viudas en párrafos; balance solo en titulares cortos).
- Coste: 0 KB; `pretty` cuesta algo de layout solo en párrafos cortos (despreciable). Firefox lo ignora.
- Riesgo: puede sumar o quitar una línea → **medir el home a 390 (≤ 5.064 px)**; si se pasa, dejar `.k2 .sub` fuera.

### 8. El icono de descarga «apunta» al pasar · **APLICAR YA**
- Dónde: `.k2 .cta-2` (`tablero.css:228`, icono `bajar` de «CV») y el rail (`chrome.css:547`, iconos `bajar` y
  `arriba`). Solo `@media (hover:hover) and (pointer:fine)`. K2 es la tarjeta del claim, no el héroe.
- Técnica: hover de `transitions-dev` (regla 3: entrada rápida, salida que asienta).
- Valores: `bajar` `translate: 0 2px`, `arriba` `translate: 0 -2px`. Entrada 200 ms `--curva-salida`; salida 250 ms
  `cubic-bezier(0.34, 1.36, 0.64, 1)` (bounce suave; el «bounce-strong» de 3,85 es excesivo para 2 px).
- Coste: ~0,15 KB gz. RM: sin desplazamiento. Verificar: hover a 1440, vídeo corto opcional.

### 9. Padding óptico en botones con icono delante · **APLICAR YA**
- Dónde: `.boton` en `sistema.css:291`: `.boton:has(> .icono:first-child){ padding-inline-start: 20px }`
  (de 24). Afecta a «CV» (K2) y «Copiar correo»; `.k17 .externo` ya fija 16 px y no cambia.
- Técnica: `make-interfaces-feel-better` (alineación óptica: el lado del icono pesa más y pide menos aire).
- Coste: 0; el botón encoge 4 px de ancho, no de alto. Verificar: captura 390 de K2 y K17.

### 10. Titulares de página por palabras · **DEJAR (medir antes)**
- Dónde: `.t-pagina` (`WorkIndexPage.tsx:37`), `.caso-h1` (`CaseHeader.tsx:67,75`), `.exp-h1` (`Trayectoria.tsx:70`).
- Técnica: spec `per-word-crossfade` recortado: 520 ms, stagger 50 ms (tope 6 palabras, total < 300 ms de stagger),
  `cubic-bezier(0.16,1,0.3,1)`, desde `opacity:0; translate:0 0.08em`. Palabras partidas en el servidor (spans
  `inline-block`, sin `aria-label`: por palabra el lector lee bien). Nunca por carácter ni con blur.
- Por qué dejar: el h1 puede ser el LCP de `/work` y de los casos; con `opacity:0` el LCP se retrasa lo que dure
  la entrada. Solo valdría en navegaciones en el cliente (cuando ya corre la View Transition), y ahí se solapa con
  ella. Necesita Lighthouse antes/después.

### 11. Escala de tracking por tamaño como tokens · **DEJAR**
- Hoy es coherente pero repetida a mano: 36/48 → `-0.025em`, 72 → `-0.035em`, 96/120 → `-0.045em`
  (`tablero.css:185,719`, `perfil.css:601`, `paginas-b.css:79-89`, `caso.css:103`). Tokens `--tr-*` en
  `globals.css` evitan derivas. Sin cambio visible: mantenimiento, no pulido. Para la ola O.

### 12. Brillo («shimmer») en «Disponible» · **DEJAR**
- `gradient-shimmer` (catálogo #32) o el `shimmer-sweep` de `animate-text` animan `background-position` sobre texto:
  repinta cada cuadro y rompe la regla de solo `opacity`/`transform`. El punto verde ya pulsa (`estado-pulso`).

## 2 · Descartado del catálogo, con motivo

- `liquid-gooey` (#26, 746 KB desempaquetado): el dock ya tiene la selección deslizante; para iconos no aporta.
- `metal-fx` / Paper Shaders (#18, #57): no están instalados; otro contexto WebGL junto al del héroe.
- Animar el peso de Urbanist (patrón de Fluid Functionalism, #27): cambia el ancho del texto → reflujo.
- `soft-blur-in` / `per-character-rise`: un nodo por letra y blur animado; caro y molesto para lectores de pantalla.

## 3 · Para el ejecutor (V-2)

- Recomendado en una sesión: **1–9** (todo CSS + 3 archivos TSX pequeños). 10–12 quedan fuera.
- Antes de cerrar: `npm test`; specs `controles`, `tablero`, `keyboard`, `cromo-contraste`; alto del home a 390
  (`document.documentElement.scrollHeight` ≤ 5.064); Lighthouse móvil `/` ≥ 90, TBT < 200 ms, CLS 0; capturas
  390 y 1440 en `pulido-I/capturas/` de K2, K15, K17, menú abierto y citas de `/about`.
- Probar cada animación también con `prefers-reduced-motion: reduce` emulado (estado final, sin movimiento).
