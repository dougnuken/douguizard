# 📋 HANDOFF PROMPT — Douguizard Portfolio

> Copia todo este archivo y úsalo como **primer mensaje** en cualquier chat nuevo de Claude para arrancar sin perder contexto.

---

# CONTEXTO — Douguizard Portfolio

## Quién soy
Soy Doug Vargas, Senior Product Designer / Tech Lead en Mercadolibre Andes Design System (2024-Present), basado en Barranquilla, Colombia. Hablo español nativo (B1 inglés). Trabajo en mi portfolio personal douguizard.com.

## El proyecto
- **Live URL:** https://douguizard.com
- **GitHub:** dougnuken/douguizard (SSH, branch main)
- **Hosting:** Vercel (auto-deploy on push to main)
- **DNS:** Cloudflare (DNS + Email Routing)
- **Local path:** /Users/dvargas/Downloads/Dougv3/douguizard-next/

## Stack técnico
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS v4 (IMPORTANTE: NO usa @apply para custom classes — Lightning CSS no lo soporta. Usar inline styles o tokens en globals.css)
- Framer Motion 11
- Three.js (para shaders custom)
- Geist Sans + Geist Mono (Google Fonts via next/font)
- Lenis (smooth scroll, opcional)

## Sistema de diseño actual
- **Paleta:** violeta cosmic inspirada en Reflect.app
  - --color-bg-deep: #15112d
  - --color-bg-mid: #1c1742
  - --color-accent: #a78bfa (violeta principal)
  - --color-accent-warm: #f0abfc
  - --color-accent-cool: #c4b5fd
  - --color-ink-strong: #ffffff
  - --color-ink: #f0eee6
  - --color-ink-muted: #b3afa3
- **Glassmorphism universal** con tokens en globals.css:
  - .glass, .glass-strong, .glass-subtle, .glass-pressed, .glass-button, .glass-nav
- **Tipografía:** Geist Sans (display + body), Geist Mono (mono details)
- **Aesthetic:** editorial senior product designer. Minimal. Sofisticado. NUNCA infantil.

## Editor y entorno
- Mac con zsh
- Editor: Cursor (NO VSCode)
- Comandos en terminal del Mac

---

# METODOLOGÍA DE TRABAJO (MUY IMPORTANTE)

## Cómo me das instrucciones (TÚ → CLAUDE)

**SIEMPRE en español.** Te paso:
- Descripciones de bugs ("se ve un parche negro en X")
- Referencias visuales (links a Dribbble, screenshots)
- Componentes copiados (a veces de 21st.dev o V0)
- Decisiones de diseño cortas

A veces te pego el contenido de un archivo completo dentro de un bloque de markdown — eso significa "este es el estado actual del archivo, úsalo como base".

## Cómo me das tú las instrucciones (CLAUDE → MÍ)

### Reglas estrictas

1. **CÓDIGO COMPLETO de archivos, NUNCA por bloques o parches.**
   - ❌ NO me digas "reemplaza la línea 47 por..."
   - ❌ NO me des solo "el bloque que cambia"
   - ✅ Sí dame el archivo COMPLETO en un solo bloque para que yo haga Cmd+A → Backspace → Cmd+V → Cmd+S

2. **UNA cosa a la vez.** Nunca múltiples archivos en una sola respuesta sin esperar mi confirmación.

3. **Pasos numerados claros.** Estructura cada respuesta así:
   - 🎯 Lo que vamos a hacer (1-2 frases)
   - ✅ Acción concreta (paso a paso)
   - 🌐 Cómo verificar
   - 📤 Pídeme reportar con texto

4. **Para archivos largos (>200 líneas) que pueden romperse al pegar en Cursor:**
   - Pártelo en 2-3 partes consecutivas
   - Cada parte con instrucciones claras: "OK 1 pegada" → te paso 2
   - **Razón:** Cursor auto-formatea agresivamente y a veces destroza JSX con `<a>` tags dentro de `.map()` blocks

5. **Confirmación entre pasos.** Después de cada cambio importante: pídeme "✅ Cargó!" o "❌ Error → cópialo" antes de seguir.

6. **NO uses bash heredoc** (cat <<EOF). El terminal se queda atorado en `dquote>` o `heredoc>` mode. Usa Cursor como medio principal.

7. **NO uses Python con base64** para escribir archivos. Mismo problema que el heredoc.

## Bug recurrente conocido: Cursor + JSX

Cursor tiene auto-formatter agresivo que cuando pego código largo con JSX que tiene `<a href={...}>...</a>` dentro de `{array.map()}`, BORRA el `<a` de apertura, dejando atributos colgando. Causa errores de parsing tipo "Expected `</`, got `<eof>`" o "Unexpected token. Did you mean `{'>'}` or `&gt;`?".

**Solución preventiva:** sacar `<a>` complejos a componentes helper separados (ej: NavLink, CtaPrimary, MobileMenuLink, ElsewhereLink) ANTES de pegarlos en el archivo principal. Si el archivo es largo y tiene `.map()` con `<a>`, particionalo.

## Patrón de trabajo emocional

Hago **sesiones largas** (8-11+ horas seguidas). Cuando muestres patrones de fatiga (cambio de dirección cada 10 min, swap de componentes seguidos, romper código que ya funcionaba), **interrumpe proactivamente** y sugiere parar para descansar y arrancar fresco. La calidad se degrada con fatiga acumulada.

**Push frequency:** end of each major session, NUNCA push con estado roto conocido.

---

# ESTADO ACTUAL DEL PROYECTO

## Lo que YA está LIVE en douguizard.com

**Visual:**
- Galaxia violeta Reflect-style (nebulosas + 3 capas estrellas + InterstellarShader sutil 0.4 opacity)
- Glassmorphism universal en cards, nav, marquee
- Custom cursor magnetic con `data-cursor="hover"` en interactivos
- Grain overlay sutil
- Loader inicial

**Componentes principales:**
- `Hero.tsx` — v5 statement "Designing the human side of an AI era™" + Live Work Card monocromática con iniciales rotando 3.5s (ML, AD, GL, QV, IW)
- `Navigation.tsx` — desktop dock central con halo lens-shape ovalado puntiagudo + bloom 3-layer; mobile burger menu fullscreen con AnimatePresence; logo "Douguizard*" arriba izquierda
- `Intro.tsx` — sección intro
- `Marquee.tsx` — glassmorphism full-width edge-to-edge con fades laterales
- `Manifesto.tsx` — note glass card
- `Capabilities.tsx` — "Four ways I work" con halo central 3-layer y 4 cards glass
- `WorkTimeline.tsx` — formato CV editorial: 5 ExperienceItem (Mercadolibre current + Aval + Globant + Qrvey + Ideaware) + 4 EducationItem
- `Stats.tsx` — glass cards con números
- `TestimonialsCarousel.tsx` — testimonials rotando
- `Footer.tsx` — CTA + links elsewhere

**Funcionalidad:**
- Bug del menú activo arreglado (detección por offsetTop absoluto, no IDs)
- Mobile burger menu fullscreen funcional
- Mobile pinch-to-zoom bloqueado (viewport en layout.tsx)
- Theme color violeta status bar
- Dev toolbar Next.js removed (devIndicators: false)

## Lo que está PENDIENTE (en orden de prioridad sugerido)

1. **Mobile QA sección por sección** (~1h, alto impacto)
   - Probar en iPhone real cada sección
   - Ajustar fontsize, spacing, breakpoints donde se vean mal
   - Verificar burger menu, scroll, animaciones

2. **i18n español primario con toggle a inglés** (~3h)
   - Instalar next-intl
   - Crear archivos JSON con todas las traducciones
   - Toggle UI en navigation
   - Routing /es/ /en/

3. **Manifesto rediseño** (~1h)
   - Cita destacada (pull quote) prominente
   - Párrafo principal más corto
   - Más diagramación visual
   - Quitar el bloque largo actual

4. **Scroll-reveal animations en cards** (~45min)
   - Usar framer-motion whileInView con stagger
   - En Capabilities, WorkTimeline, Testimonials

5. **Background especial WorkTimeline** (~1-2h)
   - **AVISO:** ya intenté 5 efectos (interstellar shader, eclipse con disco oscuro, EtherealShadow framer, AuroraShader Three.js, CosmicParallax CSS) y todos los reverti.
   - Próxima sesión: decidir UN solo efecto, implementarlo bien, NO swap múltiple.

## Lo que NO quiero (decisiones tomadas)

- ❌ NO Three.js shaders nuevos sin razón clara (causan parches negros, conflictos)
- ❌ NO efectos en escala canvas con 1000+ partículas (performance mobile)
- ❌ NO componentes con logos copyrighted (ML, Globant, Qrvey, etc.) — usar iniciales monocromáticas
- ❌ NO paleta multi-color (peach, cyan, etc.) — solo violeta paleta Reflect
- ❌ NO emojis decorativos en UI
- ❌ NO bullets/listas extensas en interfaz — siempre prosa editorial

---

# PRIMER PASO RECOMENDADO

Sugiero arrancar con **Mobile QA sección por sección**:
1. Yo abro douguizard.com en mi iPhone real
2. Te reporto sección por sección (Hero, Marquee, Manifesto, Capabilities, WorkTimeline, Stats, Testimonials, Footer)
3. Tú me das fixes uno por uno con archivo completo
4. Al final, push limpio

Cuando estés listo, arranca preguntándome:
"¿En qué sección empezamos el Mobile QA?"

— Doug