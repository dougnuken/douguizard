# 10 — Deltas de revisión (Fable) — resuelven conflictos entre specs y fijan defaults

Fecha: 2026-09-12. Este archivo manda sobre cualquier spec cuando se contradicen. Los defaults marcados `⚠️ CONFIRMAR DOUG` se implementan tal cual hasta que Doug diga lo contrario; el string queda en `src/data/` con el comentario, nunca como hecho sin marcar.

## A. Conflictos entre specs — quién manda

| Tema | Manda | Detalle |
|---|---|---|
| Wordmark strip (03 §3.1 vs 07 §a) | **07 copy deck** | `experiences.filter(e => e.era !== "earlier")`; render `company.name` y, si hay `client` distinto, el cliente como ítem aparte: `Naowee · Mercadolibre · Aval Digital Labs · Banco de Occidente · Globant · Qrvey · Ideaware`. Sin Smartbiz. `getWordmarks()` en `career.ts` implementa exactamente eso. |
| Facts del About (03 §6 vs 07 §d) | **07 copy deck** | Cinco facts: Based · Currently · Focus · Open to · Languages. El conteo de años vive en el lead del panel Work (`yearsOfExperience()`), no en los facts. |
| Sub-párrafo del Hero (03 §3 vs 07 §a) | **07 copy deck** | El párrafo de tres frases compuesto desde `currentExperience()` + KPIs de `mercadolibre-andes`. `site.summary` es para About y meta description. |
| Formato de periodo | **01 §6 `formatPeriod`** | `"Jan 2026 — Now"`, nunca "Present" (03 §6 muestra "Present" en el ejemplo: ignorar). |
| Metadata de `/cv` (05 §5 vs 06 §3) | **06 §3** | La versión computada con `yearsOfExperience()` y la lista de empresas. |
| Tipos de skills/tools (05 §4.3 vs 01 §2.3) | **01 §2.3** | `SkillGroup {id,label,items:{label,primary?}[]}` y `ToolGroup` con 4 grupos (design/code/ai/collaboration). |
| `getCaseMeta` | **01 §6.1** | Vive en `src/data/work.ts`, firma `getCaseMeta(slug: string): CaseMeta`. |
| Etiqueta del panel 00 | **01 §5** | `{ id: "home", label: "Home" }`. |
| H1 del hero | **07 opción A** | `I direct the product, then I build it.` |

## B. Defaults aplicados a los `⚠️ CONFIRMAR DOUG`

| Ítem | Default que se construye |
|---|---|
| Bullets de Smartbiz y Freelance | **Sin `impact[]`**: solo `summary`. No se inventan logros sin fuente. |
| Testimonio de Francesca | Verbatim, opción (a). |
| GitHub `dougnuken` | **Se incluye** en `site.social` y `sameAs`: ya es público desde el link "Source" de olbo. |
| Email | `hello@douguizard.com` en sitio y CV. Teléfono solo en print (05 §4.1). |
| KPI 4 de olbo (`1:2.5`, 6,305 lines) | **Se mantiene.** Verificado hoy en el repo de olbo: 6,410 líneas de test vs 16,265 de código = 1:2.5. Actualizar el delta a `6,400 lines of tests`. |
| Links de olbo → repo `bolsillo` | Se mantienen (el repo es el que existe). |
| Naowee `process[0]` "I joined as a product designer" | **Se mantiene.** Doug lo confirmó en sesión ("empecé siendo product designer"). El CV lleva una sola fila Head of Product ene 2026→ hasta que Doug dé el mes del cambio. |
| Mercadolibre "~40% fewer rework cycles" | Eliminado; cualitativo. |
| BdO "millions of customers" | Eliminado. |
| BdO landing pública | **Fuera**: el caso es solo el portal (9 ítems de galería del 07 §g). |
| Meses ML inicio / ADL salida | Sin mes; `formatPeriod` renderiza año solo. |
| Cargos Globant/Qrvey, grado 2009 | Según PDF (01 §9). |
| Foto | Sin foto. |
| Anchor de años | `smartbiz` (oct 2014). |

## C. Alcance por agente de build

- **Build A (fundación + home):** specs 01, 00, 02, 03, 06 + borrado de huérfanos del home. Al terminar: `next build` EXIT=0, vitest verde, home nuevo completo. `/cv` y `/work/*` pueden quedar en estado transitorio **pero deben compilar** (si un import se rompe, se arregla mínimamente).
- **Build B (rutas + assets):** specs 05, 04, 08 + datos del caso Banco de Occidente (07 §g) con los recortes desde `scratchpad/behance/` + Mercadolibre (07 §h) + correcciones olbo/Naowee (07 §i) + reemplazo de KPIs vagos (07 §i, RC/Qrvey/Ideaware).
- **QA:** spec 09 completo, reporte en `scratchpad/report-qa.md`.

## E. Galería de Banco de Occidente (para Build B)

- Los 9 recortes ya existen a resolución nativa en `scratchpad/bdo-crops/*.png` (+ `manifest.json` con cajas y notas, + `contact-sheet.jpg`). Build B los convierte a WebP (q 82) en `public/work/banco-de-occidente/` con los mismos nombres del 07 §g y NO vuelve a recortar.
- **Todos traen su propio bezel** (tablet con manos, tablet, iPhone) o son diagramas/boards sobre fondo lavanda `rgb(239,242,252)`. Meterlos en `BrowserFrame` sería un navegador con una tablet adentro. Por eso `CaseStudy.galleryKind` gana un tercer valor: **`"plain"`** → `CaseProduct` renderiza cada ítem como `next/image` dentro de una tarjeta plana (`border: 1px solid var(--line-strong)`, `border-radius: 12px`, `overflow: hidden`, fondo `var(--paper-raised)`), a su ratio natural, en grid `md:grid-cols-2` con `gap: 24px`, caption mono debajo. Sin chrome de navegador, sin marco de teléfono. `videoKind` sigue igual (BdO no tiene video).
- Ratios distintos por ítem (0.92 a 2.16): en el grid de 2 columnas cada tarjeta ocupa su celda con `align-self: start`; no forzar `aspect-ratio`. `illustrated-icons` (823 px de ancho) va con `sizes="(min-width:768px) 50vw, 100vw"` como los demás: a media columna queda nítido.
- Orden: el del 07 §g (portal-dashboard primero). `priorityFirst: false`.
- `portal-dashboard` contiene nombres mock del producto ("Jose Manuel", "Valeria Betancurt" y un teléfono) que ya estaban públicos en Behance desde 2022 y no son créditos de terceros. Se publican tal cual; ⚠️ CONFIRMAR DOUG si prefiere difuminarlos (el manifest lo marca en `flags.mock-ui-names`).
- Dimensiones `width`/`height` explícitas por ítem desde el `manifest.json` (el modelo `gallery[]` no las tiene: añadir `width?`/`height?` opcionales a `CaseStudy.gallery[]` y usarlas cuando existan; los casos phone/browser siguen con sus constantes).

## F. EN COLA — Archive de conceptos (⚠️ NO es alcance de Build A, B1 ni B2)

Doug entregó capturas de dos conceptos propios de 2023 y pidió meterlos **como pendientes, sin prioridad**. Nadie los construye hasta que se cierre la fase 1 y el QA pase. Queda escrito aquí para que no se pierda.

**Assets ya preparados** en `scratchpad/concepts/` (WebP q88, listos para copiar a `public/work/<slug>/`):

| Concepto | Archivos | Fuente | Densidad | Estado |
|---|---|---|---|---|
| **MakeAppet** — app iOS de adopción de mascotas | `makeappet-01..05.webp` | 390×844 | **1x** | ⚠️ Insuficiente. Se vería borroso dentro del marco de teléfono, que rinde a ~400 px CSS. Pedir reexportación a 3x antes de publicar. |
| **Chub** — app iOS de alquiler de autos, dark mode | `chub-01..04.webp` | 780×1688 | 2x | Usable. |

**Forma que debe tomar** (decisión de Fable, revisable):
- **No** son casos con página de detalle. El copy del índice dice "Seven that shaped how I work", y siete es el número de casos reales; los conceptos no compiten con Naowee ni con Banco de Occidente.
- Van en un bloque **Archive** al pie del panel Work: rejilla compacta, etiqueta mono `Concept · 2023`, un par de pantallas por pieza, sin enlace a detalle. Un nuevo tipo en el modelo (`kind: "concept"`) o una lista aparte en `src/data/concepts.ts` — lo segundo evita que los conceptos entren en `caseStudies` y descuadren `getNextCaseStudy`, la numeración `/01../07` y el conteo del copy. **Preferir `concepts.ts`.**
- ⚠️ **Marca de terceros**: las pantallas de Chub muestran un render de un Tesla Model 3 y el nombre del modelo. Es trabajo propio de Doug, público en Behance desde 2023, pero la marca no es suya. Decisión de Doug antes de publicar: dejarlo, recortar el nombre, o usar solo las pantallas de mapa y climatización, que no llevan marca.
- MakeAppet no se publica a 1x. O llega a 3x, o entra solo Chub.

## D. Reglas de proceso para los agentes de build

1. Rama `redesign/bn-editorial`. Commits por workstream (`feat(tokens): …`, `feat(data): …`, `feat(home): …`), mensajes convencionales, **nunca push, nunca main**.
2. `next build` verde antes de cada commit. Tests verdes antes de cada commit.
3. Verificación visual real: `npm run build && npx next start -p 3099`, capturas con Chrome headless (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --screenshot=… --window-size=1440,900 URL`) a 1440 y 375, ambos temas (`localStorage dg-theme` no aplica en headless: usar `?` no; en su lugar renderizar con `--force-dark-mode` / `--force-prefers-color-scheme` o inyectar `data-theme` vía CDP). Guardar en `scratchpad/build-shots/`. Nunca "debería verse bien".
4. No usar el puerto 3000 (lo usa Doug). Apagar `next start` al terminar.
5. Ignorar hooks de `graphify`: pertenecen a otro repo.
6. Sin `@apply` con clases custom. Solo `transform`/`opacity` animados. Sin hex fuera de `globals.css`. Archivos < 400 líneas (case/* < 300).
7. Nada de Tierra Querida, nada de nombres de terceros de la pieza BdO, ninguna cifra sin fuente.
