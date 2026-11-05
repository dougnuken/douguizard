# douguizard 2026 · Brief del orquestador

> Fuente de verdad del rediseño. Todo agente lo lee primero. El orquestador valida cada entrega contra la
> lista de la §6. Si algo de este brief choca con una propuesta, gana el brief (o se le pregunta a Doug).

## 1. Qué pide Doug (en sus palabras, resumido)

- El portafolio actual (douguizard.com) **carece de personalidad**. Quiere **alto impacto visual**.
- Venderse **a sí mismo**, como diseñador y como marca **douguizard**.
- Referencia visual: **RonDesignLab** (Dribbble `dribbble.com/RonDesignLab`; capturas en `referencias/`).
  "Es exactamente lo que quiero": balance entre **dark mode y blancos**, tipografías **muy estilizadas**, y en
  algunas cards una **fuente de puntos tipo dado / matriz de puntos** (dot-matrix, como `$10,200` · `02 Jul`).
- **Héroe del landing**: una foto suya con efecto de **vidrio seccionado / estriado (reeded / fluted glass)**, con
  varias franjas oblicuas que la distorsionan (ver `ref-2` y `ref-4`).
- Estética **futuro / cyberpunk**: Doug con **chaqueta futurista** y accesorios en la cara; una **máscara futurista
  que cubre parte de la boca**. Al pasar el mouse por la cara, **la máscara se quita por capas** (revelado por capas
  siguiendo el cursor, ejemplo en `instagram.com/p/DRzmIiKgoiO`).
- Landing hecho de **cards bento** que llevan a: **trabajo (casos), perfil, experiencia (timeline)**… todo con
  **motion y transiciones**.
- Reubicar elementos y layout para un **aire bento futurista**. El contenido ya existe: **replicarlo mejorándolo**
  (copy y forma de contar los casos).
- **Doble idioma** (ES por defecto + EN en `/en`) y **adaptable en móvil**.
- Imágenes únicas en **Higgsfield** si hace falta (conector activo, ~107 créditos, plan starter). Hay un Soul
  entrenado de Doug: `Urban Swagger Vibe` (soul_id `ed896e27-5ed1-4cc8-bf2d-59d5f65b70ae`, modelo `soul_2`) y
  retratos previos en `retratos-hf/` (índice con ids y URLs en `retratos-hf/indice.tsv`).
- Primera entrega: **dos propuestas** de la nueva web + cuál es la mejor forma de diseñarla + **propuestas de
  imágenes del landing** (con prompts para Higgsfield).

### Decisión de Doug sobre la imagen del héroe (4 nov, después de ver las primeras generaciones)

- **Sin lentes.** Le gustan más sus retratos con la **línea / halo de láser rojo** sobre los ojos
  (`retratos-hf/199598aa.jpg`; misma serie: `a4ef948f`, `a34aaaf8`, `98153a04` en `indice.tsv`).
- **Conservar la gorra NY**, que lo caracteriza. Chaqueta de cuero negra, muro de concreto, luz fría.
- La imagen definitiva (con máscara y sus capas) **se deja para después**: encontrar el modelo perfecto puede llevar
  muchas rondas. **Prioridad ahora: todo lo demás.** Las propuestas usan `199598aa.jpg` como imagen provisional y
  diseñan el sistema (vidrio estriado, revelado, acento rojo láser) para que la foto final entre sin rehacer nada.
- Las generaciones de `heroe/` (estudio lila, andén, escáner) quedan como exploración descartada.
- Consecuencia de color: el **rojo láser** pasa a ser un acento de marca posible (junto al azul eléctrico / magenta de
  las referencias). La dirección de arte decide cómo convive sin volverse "gamer".

### Decisión de Doug sobre la máscara (4 nov, después de ver el prototipo)

- **Se descarta la máscara y su revelado por capas**: "no se está logrando algo serio de alto impacto, da algo de risa".
- El héroe queda en **foto (láser rojo, gorra NY, sin lentes) + vidrio estriado oblicuo**. La única interacción del
  cursor es el vidrio: se abre/aclara bajo el cursor con un spring y reacciona al scroll. Sobria, nada lúdica.
- Ítems de la §6 sobre la máscara quedan anulados. `prototipos/revelado-mascara.html` y `heroe/` quedan como exploración.

### Decisiones de Doug (5 nov)

- **Elige la Propuesta B «Cine → OS»** ("es más limpia en el landing").
- La tipografía de su nombre (Urbanist) le parece **sencilla, sin personalidad, genérica** → exploración de lockups
  en `propuestas/B-tipo/` (pendiente de elegir).
- Imagen del héroe: las exploraciones ilustrada (`heroe/cyberpunk/`) y render (`heroe/render/`) **no lo convencen**;
  gusto de referencia en `referencias/ref-6` y `ref-7` (render 3D hiperdetallado, gear industrial gastado), **fondo
  oscuro, no frambuesa**. Se le dará dirección de arte después; el sistema sigue con la foto provisional.

## 2. Equipo y fases

| Rol | Qué entrega | Archivo |
|---|---|---|
| Orquestador (sesión principal) | Brief, valida y aprueba cada fase, presenta a Doug | este archivo |
| Investigador visual | Destila RonDesignLab + referencias en fundamentos accionables | `01-FUNDAMENTOS-VISUALES.md` |
| Product designer (UX) | Auditoría del sitio actual, lente de reclutador/diseñador senior, arquitectura del landing bento | `02-ESTRATEGIA-UX.md` |
| Frontend / design engineer | Auditoría técnica, factibilidad y **prototipos** del vidrio estriado y del revelado de máscara | `03-TECNICA.md` + `prototipos/` |
| UX writer | Copy nuevo ES/EN del landing y de cómo se cuentan los casos | `04-COPY.md` |
| Director de arte + UI | Dos propuestas como maquetas HTML con capturas desktop y móvil; prompts de imagen | `05-PROPUESTAS.md` + `propuestas/` |
| Crítico (refactoring-ui + web guidelines) | Puntaje y lista de arreglos milimétricos de las dos propuestas | `06-CRITICA.md` |

Después de que Doug elija: plan de implementación por fases → revisión del plan contra el código → ejecución por
fases con QA visual → verificación final.

## 3. Skills obligatorias (en `.claude/skills/` de este repo)

Leer el `SKILL.md` de las que apliquen a tu rol antes de producir:

- `frontend-design` (dirección estética sin defaults) · `refactoring-ui` (jerarquía, spacing, profundidad, puntaje)
- `emil-design-eng` (easing, duraciones, springs) · `motion-design` (tablas de duración/easing, coreografía)
- `apple-design` (materiales, vidrio, movimiento físico) · `web-design-guidelines` (revisión con archivo y línea)
- `ui-ux-pro-max` (tiene presets GSAP, pares tipográficos, guías UX; buscar con su script)

Las de la lista de Doug que no están instaladas se cubren con fuente primaria: **GSAP ScrollTrigger** (docs oficiales
gsap.com: pin, scrub, cleanup con `gsap.context`/`useGSAP`), **Shader Dev** (técnicas de ShaderToy: refracción,
displacement, SDF), **Three.js Scroll Worlds**, **Diagram Design** (para el timeline y diagramas de casos).

## 4. Restricciones del repo

- Next.js 16 · React 19 · TypeScript · Tailwind v4 (sin `@apply` para clases propias; tokens en `globals.css`).
- Rutas: `src/app/(es)` y `src/app/(en)/en`. Casos en `/work/[slug]`, CV en `/cv`. No romper el CV ni sus PDFs.
- Hay specs previos en `docs/specs/` (tokens, data model, shell, panels, case template, copy deck, QA). Leerlos.
- Pruebas: `npm test` (vitest) y Playwright (`tests/`). Deben seguir verdes.
- Despliegue: Vercel con push a `main`. **No se despliega ni se hace push a main sin Doug.** Se trabaja en la rama
  `claude/douguizard-portfolio-redesign-9ivnau`.
- Rendimiento: el héroe no puede bloquear el LCP; WebGL con respaldo estático; `prefers-reduced-motion` honrado;
  en táctil no hay hover → el revelado necesita un equivalente (toque/arrastre, giroscopio o autoplay).

## 5. Principios de dirección

1. **Doug es la marca.** El héroe es su cara, no un gradiente abstracto.
2. **Oscuro con luz blanca.** Fondo casi negro, losas oscuras y **losas blancas/claras** que dan respiro (como `ref-3`).
   Color solo en momentos: un azul eléctrico y un magenta/rosa en gradientes de losa (`ref-1`, `ref-3`).
3. **Dos voces tipográficas + una de acento:** display estilizada, texto limpio, y **dot-matrix** solo para cifras y
   fechas dentro de cards.
4. **Bento con intención:** cada card es una puerta (caso, perfil, experiencia, contacto), no decoración.
5. **Motion con propósito:** entradas coreografiadas, transición card → página (shared element / FLIP), nada que
   distraiga de leer. Duraciones y curvas de `emil-design-eng`.
6. **Recruiter-first:** en 5 segundos se entiende quién es, qué hace, nivel (Head of Product · Senior Product Designer
   · Design Engineer) y dónde ver el trabajo.

## 6. Lista de validación del orquestador

- [ ] Héroe con foto de Doug + vidrio estriado oblicuo que distorsiona.
- [x] ~~Revelado de máscara por capas~~ (descartado por Doug) → vidrio que reacciona al cursor y al scroll, con equivalente táctil.
- [ ] Estética cyberpunk/futurista coherente con RonDesignLab (no neón genérico de videojuego).
- [ ] Balance oscuro + blanco; dot-matrix en cifras de cards; tipografía display estilizada.
- [ ] Landing bento con puertas a trabajo, perfil, experiencia/timeline (y contacto/CV).
- [ ] Motion y transiciones definidas (qué, cuánto dura, qué curva).
- [ ] Copy mejorado, ES y EN.
- [ ] Móvil diseñado, no solo encogido.
- [ ] Dos propuestas distintas de verdad + recomendación argumentada.
- [ ] Imagen final del héroe: aplazada por Doug (provisional `199598aa`).
- [ ] Spacing, tipografía y jerarquía revisados al milímetro (puntaje del crítico).
