# Catálogo de recursos de Crafthings

Fuente: `indice-crafthings.md` (79 recursos, actualizado el 6 nov 2026). Investigado el 9 nov 2026 con los hosts permitidos (sitios de los recursos accesibles, GitHub y el registro de npm). No se ha instalado ninguna dependencia: el `package.json` no se toca.

Convenciones:
- **sin verificar**: el sitio estaba bloqueado o no hay forma de comprobarlo sin instalar; no se asume compatibilidad.
- **Bundle**: tamaño desempaquetado según npm (`unpackedSize`); el gzip real no se midió. Es una cota alta, no el coste en cliente.
- **Relevancia** para douguizard: alta, media o baja.

Aviso de estado del repo: el `package.json` actual solo declara `gsap`, `next`, `react`, `react-dom` y `tailwind-merge` como dependencias; no figuran `three`, `framer-motion` ni `@paper-design/shaders`, aunque CLAUDE.md los menciona. El vidrio del hero está hecho a mano (`src/components/hero/VidrioGL.tsx`, con respaldo `VidrioCss.tsx` y carga diferida en `VidrioDiferido.tsx`). Confirmar con Doug antes de dar por instalado Paper Shaders.

## Tabla de los 79 recursos

| # | Recurso | Tipo | Cómo se usa | Compatibilidad Next 16 / React 19 / Tailwind v4 | Coste en bundle | Relevancia | Nota |
|---|---|---|---|---|---|---|---|
| 1 | [SortUI](https://sortui.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 2 | [Easy UI](https://easyui.site/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 3 | [Pace UI](https://paceui.com/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 4 | [Astryx](https://astryx.atmeta.com/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 5 | [Morphin](https://morphin.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 6 | [Tactile Glass UI](https://kit.uixninja.com/) | lib npm | lib npm `tactile-glass-ui@0.1.1` (MIT) | peer react>=18 (React 19 OK por peer); CSS propio inyectado, no depende de Tailwind; Next 16: sin verificar (necesita `"use client"` y carga diferida) | 543 KB desempaquetado (gzip sin medir) | alta | WebGL2 de vidrio óptico real. Ver sección de vidrio. |
| 7 | [Orbloom](https://vault.rickybharti.com/orbloom) | lib React | lib React/JS | sin verificar | n/d | baja | Efecto orbital; sin uso claro. |
| 8 | [Halaska UI](https://ui.halaska.com/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 9 | [CodedVisuals](https://codedvisuals.com/) | lib React | lib React de visuales | sin verificar | n/d | media | Visuales codificados; posible inspiración de fondos. |
| 10 | [Spectrum UI](https://ui.spectrumhq.in/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 11 | [Arc UI](https://uiarc.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 12 | [Hyperiux](https://vault.hyperiux.com/) | lib React | lib React (vault) | sin verificar | n/d | media | Efectos visuales; posible inspiración. |
| 13 | [loading.dev](https://loading.dev/) | lib React | lib React de loaders | sin verificar | n/d | baja | Loaders; sin uso. |
| 14 | [Bencho](https://bencho.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 15 | [Kobra](https://kobra.systems/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 16 | [ObsidianUI](https://temp.obsidianui.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 17 | [Loading — Animated loaders for moments in between](https://loading.daniasyrofi.com/) | lib React | lib React de loaders | sin verificar | n/d | baja | Loaders; sin uso. |
| 18 | [Metal](https://metal.jakubantalik.com/) | lib npm | lib npm `metal-fx@2.0.11` (MIT) | peer react>=18; Next 16 / Tailwind v4: sin verificar (WebGL2, cliente) | 303 KB desempaquetado (gzip sin medir); además `@paper-design/shaders` | alta | Anillo de metal líquido WebGL2 sobre un botón. Ver sección de vidrio. |
| 19 | [beUI](https://beui.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 20 | [Rare UI](https://rareui.com/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 21 | [Flicker](https://flicker.laurie.fyi/) | lib React | lib React; sitio bloqueado, paquete npm no identificable con certeza (el paquete `flicker` de npm es otro proyecto) | sin verificar | n/d | media | Sin verificar: no se pudo leer. Ver sección de motion. |
| 22 | [BoardUI](https://boardui.com/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 23 | [Open Source UI](https://opensourceui.in/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 24 | [Beautiful UI](https://www.beautifului.dev/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 25 | [Amicro](https://amicro.vercel.app/) | lib React | lib React; instalación no comprobada (sitio fuera de la lista de hosts permitidos) | sin verificar | n/d | baja | Kit de UI genérico; CLAUDE.md prohíbe añadir librerías de UI sin consultar. Solo inspiración. |
| 26 | [Liquid Gooey](https://libraries.dev/gooey) | lib npm | lib npm `liquid-gooey@0.2.2` (MIT) | peer react>=18; Safari incluido según su README; Next 16 / Tailwind v4: sin verificar | 746 KB desempaquetado (gzip sin medir) | alta | Morph/move líquido con SVG + springs CSS. Ver sección de vidrio. |
| 27 | [Fluid Functionalism](https://www.fluidfunctionalism.com/) | registro copy-paste | registro shadcn (`npx shadcn@latest add https://www.fluidfunctionalism.com/r/<x>.json`), copy-paste a `components/` | Tailwind v4 y alias `@/` requeridos; usa `motion/react`, Radix o Base UI e Inter variable; Next 16: sin verificar | 0 KB de paquete propio, pero arrastra `motion` (~1 MB desempaquetado) y Radix | media | Sistema de springs y hover fluido. Ver sección de motion. |
| 28 | [Orb Editor](https://orb-pg.vercel.app/) | shader (WebGL) | herramienta web (WebGL) para diseñar orbes | n/a | n/a | baja | Editor de orbes; solo si se quisiera un orbe decorativo. |
| 29 | [AI CSS](https://www.aicss.dev/) | lib React | lib React / CSS | sin verificar | n/d | baja | Efectos CSS para interfaces de IA. |
| 30 | [CSS Loaders](https://cssloaders.colorion.co/) | CSS | CSS puro (copiar) | agnóstico | 0 KB | baja | Spinners; el sitio no los necesita. |
| 31 | [Orbs](https://libraries.dev/orbs) | lib npm | lib npm `thinking-orbs@0.3.2` (MIT) | peer react>=18; sin verificar en Next 16 | 131 KB desempaquetado | baja | Orbes de "pensando" para IA; el sitio no tiene chat. |
| 32 | [Gradient Shimmer](https://gradient-shimmer.vercel.app/) | lib npm | lib npm `gradient-shimmer@0.1.1` (MIT) | peer react>=18; sin dependencias; Next 16 / Tailwind v4: sin verificar | 35 KB desempaquetado | media | Shimmer de texto multi-parada con WAAPI. Ver sección de motion. |
| 33 | [21st](https://21st.dev/) | registro copy-paste | registro de componentes React (copy-paste) comunitario | sin verificar; muchos usan shadcn/Tailwind | 0 KB si se copia | baja | Buscador de componentes; no añadir kits de UI sin consultar. |
| 34 | [Premotio](https://premotio.com/) | estudio | estudio de motion | sin verificar | n/a | baja | Una línea: estudio de motion; sin integración en el repo. |
| 35 | [Is Agentic](https://is-agentic.com/) | herramienta | directorio de recursos para agentes | sin verificar | n/a | baja | Una línea: directorio de recursos para agentes; sin integración en el repo. |
| 36 | [Caustic](https://caustic.wtf/) | shader | shader / lib npm probable `caustic@0.1.0-beta.1` (repo Oxkai/liquid-glass); la correspondencia con caustic.wtf no está confirmada | peer react>=18; beta; sin verificar en Next 16 | 1.1 MB desempaquetado (gzip sin medir) | media | Refracción por píxel que necesita una imagen de fondo. Ver sección de vidrio. |
| 37 | [Graphical UI](https://graphicalui.com/) | herramienta de interfaz | herramienta de interfaz | sin verificar | n/a | baja | Una línea: herramienta de interfaz; sin integración en el repo. |
| 38 | [Elyx Design](https://elyx.design/) | herramienta de diseño | herramienta de diseño con IA | sin verificar | n/a | baja | Una línea: herramienta de diseño con IA; sin integración en el repo. |
| 39 | [Dessn](https://dessn.ai/) | herramienta de diseño | herramienta de diseño con IA | sin verificar | n/a | baja | Una línea: herramienta de diseño con IA; sin integración en el repo. |
| 40 | [Zoah](https://zoah.com/) | herramienta de diseño | herramienta de diseño | sin verificar | n/a | baja | Una línea: herramienta de diseño; sin integración en el repo. |
| 41 | [Paper Design](https://paper.design/) | herramienta de diseño | herramienta de diseño (editor) | n/a | n/a | media | Origen de Paper Shaders; útil para prototipar shaders y fondos. |
| 42 | [Wonder Design](https://wonder.design/) | herramienta de diseño | herramienta de diseño | sin verificar | n/a | baja | Una línea: herramienta de diseño; sin integración en el repo. |
| 43 | [Dial Kit](https://dialkit.dev/) | estudio | herramienta de estudio (panel de controles para afinar valores) | sin verificar | n/d | media | Útil para afinar springs/valores en vivo. |
| 44 | [UI Camera](https://ui.camera/) | estudio | estudio de capturas/mockups | sin verificar | n/a | baja | Una línea: estudio de capturas/mockups; sin integración en el repo. |
| 45 | [Light Stroke Rail](https://light-stroke-rail.vercel.app/) | estudio | herramienta "Studio" (light-stroke-rail.vercel.app, bloqueado); no hay paquete npm con ese nombre | sin verificar | n/d | media | Sin verificar. Por el nombre: trazo de luz recorriendo un riel; candidato para el timeline "Cómo trabajo". |
| 46 | [Metalforge](https://metalforge.xyz/) | shader | herramienta de shader (metalforge.xyz, bloqueado; el paquete npm `metalforge` es otro proyecto de 2018) | sin verificar | n/d | media | Sin verificar. Probable generador de metal; se resuelve igual con Paper Shaders `liquidMetal`. |
| 47 | [Shader Lab](https://eng.basement.studio/tools/shader-lab) | shader | herramienta de shaders (basement.studio) | sin verificar | n/a | media | Laboratorio de shaders; inspiración para fondos. |
| 48 | [VGPU](https://vgpu.sh/) | shader | herramienta de shaders | sin verificar | n/a | baja | Una línea: herramienta de shaders; sin integración en el repo. |
| 49 | [SVG Patterns](https://nucleoapp.com/svg-patterns/) | herramienta de interfaz | patrones SVG (Nucleo) | sin verificar | n/a | baja | Una línea: patrones SVG (Nucleo); sin integración en el repo. |
| 50 | [Smooth Shadow Plugin](https://shadow.floriankiem.com/) | herramienta de interfaz | plugin de diseño (shadow.floriankiem.com, bloqueado); genera sombras en capas | sin verificar (salida CSS: agnóstica) | 0 KB | media | Sin verificar. La técnica (box-shadow en capas con curva suave) se copia a CSS sin dependencias. |
| 51 | [Canvas UI](https://canvasui.dev/) | shader | herramienta de shaders | sin verificar | n/a | baja | Una línea: herramienta de shaders; sin integración en el repo. |
| 52 | [Originkit](https://www.originkit.dev/) | shader | herramienta de shaders | sin verificar | n/a | baja | Una línea: herramienta de shaders; sin integración en el repo. |
| 53 | [Hero kit](https://hero-kit.vercel.app/) | herramienta de fondos | herramienta de fondos para heros | sin verificar | n/d | baja | El hero v3 ya está resuelto con galaxia propia. |
| 54 | [Ditther](https://app.ditther.com/) | shader | herramienta de dithering | sin verificar | n/a | baja | Una línea: herramienta de dithering; sin integración en el repo. |
| 55 | [Toolcraft](https://toolcraft.sh/) | shader | herramienta de shaders | sin verificar | n/a | baja | Una línea: herramienta de shaders; sin integración en el repo. |
| 56 | [Oklch fyi](https://oklch.fyi/) | herramienta de color | herramienta de color | n/a | n/a | media | Conversión y paletas OKLCH; apoya los tokens de color. |
| 57 | [Paper Shaders](https://shaders.paper.design/) | shader | lib npm `@paper-design/shaders-react@0.0.82` + `@paper-design/shaders@0.0.82` (Apache-2.0) | peer react ^18 o ^19 (OK React 19); Next 16 / Tailwind v4: sin verificar. OJO: no figura en el `package.json` actual del repo | 431 KB + 881 KB desempaquetado (gzip sin medir) | alta | Ya referenciado en CLAUDE.md para los CTA de metal líquido; confirmar que está instalado. |
| 58 | [Gradientool](https://www.gradientool.com/) | herramienta de gradientes | generador de gradientes | sin verificar | n/a | baja | Una línea: generador de gradientes; sin integración en el repo. |
| 59 | [Fluid](https://fluid.krackeddevs.com/) | shader | shader de fluidos | sin verificar | n/a | baja | Una línea: shader de fluidos; sin integración en el repo. |
| 60 | [Ultramock](https://www.ultramock.io/) | estudio | estudio de mockups | sin verificar | n/a | baja | Una línea: estudio de mockups; sin integración en el repo. |
| 61 | [Konvert](https://konvert.design/tools/svg-to-dot-animation) | shader | SVG a puntos animados | sin verificar | n/a | baja | Una línea: SVG a puntos animados; sin integración en el repo. |
| 62 | [Ascii Magic](https://www.ascii-magic.com/app) | shader | shader ASCII | sin verificar | n/a | baja | Una línea: shader ASCII; sin integración en el repo. |
| 63 | [Shadowlab](https://shadowlab.mocarski.design/) | herramienta de interfaz | laboratorio de sombras | sin verificar | n/a | baja | Una línea: laboratorio de sombras; sin integración en el repo. |
| 64 | [Shaders Evil Rabbit](https://shaders.evilrabbit.com/) | shader | herramienta/galería de shaders | sin verificar | n/a | media | Referencia de shaders. |
| 65 | [Hairline](https://hairline.lucasmarkes.com/skills) | skill | skill (descartado) | n/a | n/a | baja | Descartado: scripts que instalan playwright; genera figuras isométricas. |
| 66 | [Remotion](https://www.remotion.dev/docs/) | skill | lib npm + skills; resumen en `.claude/skills/remotion/` | React; proyecto de vídeo aparte | n/a (no va al bundle web) | baja | Vídeo programático; no es para la UI del sitio. |
| 67 | [Impeccable](https://impeccable.style/) | skill | skill (descartado) | n/a | n/a | media | Descartado: su launcher descarga y ejecuta un binario. |
| 68 | [Audio Raphael Salaja](https://audio.raphaelsalaja.com/resources/skill) | skill | skill `create-sound` instalado (solo markdown) + lib `@web-kits/audio@0.2.0` | peer react>=18; sin verificar en Next 16 | 205 KB desempaquetado | baja | Sonidos de UI sintetizados; el sitio no usa audio. |
| 69 | [Jakub Krehel Skills](https://www.skills.sh/jakubkrehel/skills) | skill | skill (instalado: better-*, interface-review, explain-interface) | n/a | n/a | alta | Revisión y pulido de UI. |
| 70 | [Animate Text](https://pixelpoint.io/skills/animate-text/) | skill | skill (catálogo de 24 specs JSON) instalado en `.claude/skills/animate-text/` | agnóstico: WAAPI, Motion, GSAP o CSS | 0 KB (solo datos) | alta | Catálogo de efectos de texto. Ver sección de motion. |
| 71 | [Transitions.dev](https://transitions.dev/) | skill | registro/CLI `npx transitions-dev add <nombre>` (MIT el CLI; snippets CSS con licencia de uso libre) o skill | CSS puro; sin dependencias; compatible por construcción con Next 16 / React 19 / Tailwind v4 (se pega en CSS) | 0 KB de JS | alta | Tokens de motion y snippets CSS. Ver sección de motion. Skill resumido en `.claude/skills/transitions-dev/`. |
| 72 | [Emil Kowalski](https://emilkowal.ski/skill) | skill | skill (instalado) | n/a | n/a | alta | Skills de animación; 11 skills nuevos instalados. |
| 73 | [Make interfaces feeel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better) | skill | skill `make-interfaces-feel-better` (instalado) | n/a | n/a | alta | Detalles de pulido: radios concéntricos, text-wrap, stagger. |
| 74 | [Vibrant](https://vibrant.design/) | referencia | referencia (galería) | n/a | n/a | baja | Inspiración visual. |
| 75 | [Designeer xyz](https://designeer.xyz/) | referencia | referencia (galería) | n/a | n/a | baja | Inspiración visual. |
| 76 | [Recent Design](https://recent.design/) | referencia | referencia (galería) | n/a | n/a | baja | Inspiración visual. |
| 77 | [Best Designs on X](https://bestdesignsonx.com/) | referencia | referencia (galería) | n/a | n/a | baja | Inspiración visual. |
| 78 | [Variant](https://variant.com/community) | referencia | referencia (galería) | n/a | n/a | baja | Inspiración visual. |
| 79 | [CollectUI](https://collectui.com/) | referencia | referencia (galería) | n/a | n/a | baja | Inspiración visual. |

## Skills de crafthings: qué se instaló

| Skill | Fuente | Estado |
|---|---|---|
| Emil Kowalski | github.com/emilkowalski/skill | `emil-design-eng` y `apple-design` ya estaban (idénticos, sin cambios). Nuevos: `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-performance`, `animation-vocabulary`, `choreograph`, `gestures`, `mobile-native`, `break-ui`, `remove-animations`. No instalados por no aplicar: `write-swift`, `animate-expo`, `ask-sonner`, `prototype`, `pick-ui-library` (este último empuja a añadir librerías, contra CLAUDE.md) |
| Jakub Krehel Skills | github.com/jakubkrehel/skills | `better-ui`, `better-interface`, `better-typography`, `better-colors`, `better-accessibility`, `better-layout`, `better-writing`, `interface-review`, `explain-interface`. No instalados: `break`, `state-machine`, `variant`, `afk`, `teardown`, `build-design` (montan páginas temporales, usan scripts o requieren Figma) |
| Make interfaces feel better | github.com/jakubkrehel/make-interfaces-feel-better | `make-interfaces-feel-better` (artículo de jakub.kr hecho skill) |
| Animate Text | github.com/pixel-point/animate-text | `animate-text`: SKILL.md, referencias y JSON; sin los scripts `.mjs` |
| Audio Raphael Salaja | github.com/raphaelsalaja/audio | `create-sound`: solo markdown (reglas); sin `src/*.mjs` ni `analyze.py`. Relevancia baja |
| Transitions.dev | transitions.dev, repo Jakubantalik/transitions.dev | `transitions-dev`: resumen propio (tokens y reglas), sin copiar los 36 snippets por la licencia (no redistribuir la librería) |
| Remotion | remotion.dev | `remotion`: resumen breve; no es para la UI |
| Impeccable | github.com/pbakaus/impeccable | **Descartado**: su SKILL.md obliga a ejecutar `scripts/impeccable`, un lanzador que descarga y corre un binario |
| Hairline | github.com/lucasmarkes/hairline | **Descartado**: depende de scripts que instalan `playwright-core` al ejecutarse y genera figuras isométricas sin relación con el sitio |

Revisión de seguridad: se buscó en todo el texto descargado `curl`, `wget`, `| sh`, `eval`, `base64`, `.env`, credenciales, SSH, `rm -rf` y similares. Lo único encontrado: un `curl` de una URL dada por el usuario en `explain-interface/no-browser.md` (inocuo) y menciones a "token" de diseño. No hay exfiltración ni acceso a credenciales en lo instalado.

## Vidrio, liquid, metal y shaders (investigación a fondo)

Resumen de la técnica y el soporte:

| Recurso | Técnica | Safari | Firefox | Coste de rendimiento |
|---|---|---|---|---|
| Tactile Glass UI (`tactile-glass-ui` 0.1.1) | WebGL2: un único contexto offscreen compartido por todos los componentes; refracción de Snell, bisel por SDF, dispersión cromática RGB, cáusticas FBM; `backdrop-filter` nativo para el frosted | WebGL2 desde Safari 15; sin verificar en este paquete | WebGL2 sí; sin verificar | Fragment shader pesado por componente; pausa en reposo fuera de pantalla o con pestaña inactiva. Versión 0.1.x: API inestable. Móvil flojo: necesita respaldo |
| Liquid Gooey (`liquid-gooey` 0.2.2) | SVG: capa de silueta con filtro goo (blur + contraste alfa) y la sombra reconstruida sobre la silueta fusionada; el DOM real va nítido encima. `dissolve` y `melt` con SVG displacement. Springs compilados a `linear()` de CSS | Sí, declarado: aplica los filtros sobre contenido SVG, nunca `url()` sobre HTML (lo que WebKit hace mal) | Sí (según su README) | Coste cero en reposo (el bucle de medición duerme). El filtro goo escala con el área y el radio de blur; usar pocas siluetas pequeñas |
| Metal (`metal-fx` 2.0.11) | WebGL2 con el shader `liquidMetal` de Paper Shaders: anillo de metal sobre el elemento, cursor-bend, brillo horneado en sprite (~10x más barato que SVG) | WebGL2 sí; sin verificar | WebGL2 sí; sin verificar | Un canvas por instancia; `isMetalFxSupported()` y, si falla, pinta el hijo sin efecto. Usar una o dos instancias |
| Caustic (`caustic` 0.1.0-beta.1; correspondencia con caustic.wtf sin confirmar) | Shader de refracción por píxel contra un perfil de altura; **hay que entregarle la imagen que dobla** (no puede leer el DOM). Los hijos se pintan sin refractar | Sin verificar | Sin verificar | Un shader por panel; beta, props pueden cambiar |
| Fluid Functionalism | No es de vidrio: registro shadcn con springs, hover fluido y escalera de superficies (8 niveles de fondo y sombra). Ver motion | n/a | n/a | n/a |
| Metalforge | Sitio bloqueado; sin verificar | sin verificar | sin verificar | sin verificar |
| Paper Shaders | Shaders WebGL (`liquidMetal`, mesh gradient, etc.) en React/vanilla | WebGL sí | WebGL sí | Depende del shader y del tamaño del canvas |

Recomendación por recurso:

- **Tactile Glass UI.** Su técnica es la más fiel al "vidrio físico", pero no conviene en cromo persistente (dock, pastillas, header): cada instancia es un shader activo en una página que ya corre WebGL en el hero, y la v0.1.x es inestable. Uso razonable: una sola pieza decorativa (una palabra o un panel) detrás de una carga diferida, o como referencia visual para afinar el `VidrioGL` propio (bisel concéntrico, dispersión sutil, borde brillante).
- **Liquid Gooey.** La mejor opción para pastillas y dock: el indicador activo con `effect="move"` (gota que sigue al elemento) y el menú desplegable `morph` mantienen el texto nítido, funcionan en Safari y no cuestan nada en reposo. Cuidado con el tamaño de bundle (746 KB desempaquetado) y con el soporte a React 19; probar antes en una rama.
- **Metal.** El mejor candidato para el botón "Hablemos": envuelve el botón real (sigue siendo interactivo y accesible) y cae a botón plano sin WebGL2. Como se apoya en el mismo `liquidMetal` de Paper Shaders que CLAUDE.md ya cita, se puede conseguir lo mismo con Paper directamente sin sumar un paquete más; decidirlo según lo que ya haya instalado.
- **Caustic.** Solo para paneles de imagen (tarjetas de proyecto con foto de fondo), donde el fondo es una imagen conocida. Inútil para el cromo sobre contenido DOM. Dejar en lista de seguimiento hasta que salga de beta.
- **Fluid Functionalism.** Ver motion; para vidrio no aporta, pero su escalera de superficies (fondo + sombra por nivel de elevación) sirve para ordenar los tonos del cromo.
- **Metalforge.** No se pudo leer. No recomendar hasta verlo.

Técnica sin dependencias para el cromo (dock, pastillas, header), con soporte en los tres navegadores: `backdrop-filter: blur() saturate()` con prefijo `-webkit-`, un borde interior de 1px con gradiente y un reflejo superior en `box-shadow: inset`, y radios concéntricos (radio exterior = radio interior + padding). La refracción real con `backdrop-filter: url(#filtro-svg)` (feDisplacementMap) solo funciona en Chromium; en Safari y Firefox se queda en el frosted, por lo que debe ser mejora progresiva. Respetar `prefers-reduced-transparency` y `prefers-reduced-motion`.

## Motion (investigación a fondo)

| Recurso | Técnica | Safari / Firefox | Coste | Recomendación |
|---|---|---|---|---|
| Transitions.dev | CSS puro: tokens (duraciones 40-500 ms, `cubic-bezier(0.22,1,0.36,1)` por defecto, distancias 4-30px, escalas 0.96-0.99, blur 2-8px) y 36 transiciones con guarda `prefers-reduced-motion`. CLI `npx transitions-dev add` | Sí, es CSS estándar (el `filter: blur` anima bien en ambos) | Ninguno de JS; el blur en superficies grandes cuesta GPU | Adoptar los tokens como variables CSS y las reglas de abrir/cerrar asimétrico. Resumen en `.claude/skills/transitions-dev/` |
| Animate Text | Catálogo de 24 efectos de texto con specs JSON portables (WAAPI, Motion, GSAP, CSS): blur-in, máscara, por carácter/palabra/línea, kinetic | Sí (WAAPI estándar); partir texto por carácter cuesta nodos DOM | Bajo, si se limita a títulos | Revelado de los titulares y del hero al entrar en vista |
| Emil Kowalski | Skills (curvas, springs, interrumpibilidad, gestos, rendimiento) | n/a | n/a | Ya instalado; `animate`, `choreograph` y `animation-performance` guían el timeline |
| Flicker | Sitio bloqueado; no se pudo leer | sin verificar | sin verificar | No recomendar hasta verlo |
| Gradient Shimmer (`gradient-shimmer` 0.1.1) | WAAPI + `background-clip: text`, multi-parada; pausa fuera de pantalla, al hacer scroll y con reduced-motion. Sin dependencias | `-webkit-background-clip: text` en Safari; Firefox sí | Bajo (35 KB desempaquetado) | Estado "disponible" o texto de acento puntual; en el sitio se puede replicar en CSS con un gradiente enmascarado sin añadir el paquete |
| Light Stroke Rail | Sitio bloqueado; sin verificar | sin verificar | sin verificar | Por el nombre, un trazo de luz sobre un riel: candidato para el timeline, pero sin evidencia |
| Smooth Shadow Plugin | Sitio bloqueado; sin verificar. Técnica conocida: sombras en capas con progresión suave | Sí (CSS puro) | Bajo (varias sombras estáticas) | Sombras en capas para las tarjetas neumórficas |
| Fluid Functionalism | Registro shadcn: tres niveles de spring (fast 80 ms, moderate 160 ms sin rebote, slow 240 ms con rebote 0.12), salidas más rápidas que las entradas, hover que se desliza entre ítems (`useFluidHover`, solo ratón) y peso de fuente animado sin reflujo (Inter con `opsz`) | Depende de `motion/react` (no instalado) | Arrastra `motion` | Copiar el patrón, no el paquete: hover fluido para el dock y las pastillas con CSS/GSAP |

## Recomendación para G2 (vidrio / Hablemos)

1. **Cromo, dock y pastillas:** CSS (`backdrop-filter` + borde degradado + reflejo + radios concéntricos). Para el indicador activo del dock y el despliegue de pastillas, evaluar `liquid-gooey` (`effect="move"` y `morph`) en una rama; no usar Tactile Glass en cromo persistente.
2. **Botón "Hablemos":** `metal-fx` o, mejor si Paper Shaders ya está, el `liquidMetal` de Paper directo, en una sola instancia, con carga diferida tras el LCP, respaldo a botón plano sin WebGL2 y sin animación con reduced-motion.
3. **Vidrio del hero:** mantener el `VidrioGL` propio; usar Tactile Glass solo como referencia óptica.
4. **No instalar nada sin consulta** (CLAUDE.md): se necesita el visto bueno de Doug para `liquid-gooey` (746 KB desempaquetado, React >=18) y `metal-fx` (303 KB).

## Recomendación para G4 (motion)

1. **Tokens de motion:** definir en `:root` las variables de `transitions-dev` (duración, easing, distancia, escala, blur) y usarlas en todo el sitio. Abrir 250 ms, cerrar 150 ms, `cubic-bezier(0.22,1,0.36,1)`.
2. **Transiciones de página:** patrón "page side-by-side" (8px + blur 3px, 250 ms, simétrico), con View Transitions si el soporte lo permite y CSS como respaldo.
3. **Timeline "Cómo trabajo":** GSAP ScrollTrigger (ya instalado) con la regla de stagger de 40 ms por ítem y total < 300 ms; si se quiere un trazo de luz, un SVG con `stroke-dashoffset` animado por scroll en lugar de añadir una herramienta no verificada (Light Stroke Rail).
4. **Texto:** specs de `animate-text` (`soft-blur-in`, `mask-reveal-up`) para titulares; shimmer solo en un elemento por vista.
5. **Hover del dock:** patrón de hover fluido de Fluid Functionalism implementado a mano (sin `motion`), con salida más rápida que la entrada.
6. **Revisión:** pasar `review-animations` y `animation-performance` sobre lo hecho; todo con guarda `prefers-reduced-motion`.
