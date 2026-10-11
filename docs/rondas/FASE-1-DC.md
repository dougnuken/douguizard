# Plan · Fase 1 — DC Medical Aesthetics primero (oct 2026)

Equipo, loop, dueños de rutas, reportes y ahorro de tokens: **`docs/EQUIPO.md`**. Estado vivo: `docs/rondas/TABLERO.md`.
Fases **`Ux`** (U0 abre la ronda); commits «feat(Ux): …» en la rama `claude/eloquent-mayer-by6jn3`; sin PR ni merge a `main`
(Vercel despliega en cada push a `main`; lo decide Doug).

Cada agente lee **solo** esta introducción, «Reglas», «Fallos conocidos» y su fase (el auditor y el planeador, también
«Backlog», «Elegido por Doug» y «Decisiones del director»).

## Elegido por Doug (su pedido, oct 11)

1. El trabajo de **DC Medical Aesthetics** es el más reciente: va **primero**, de primero en todo (índice, home, orden).
2. Mockups **de alto impacto** hechos con Higgsfield, en la línea de la **medicina estética luxury**: varios mockups de esta PWA
   hecha a la medida, con los estilos nuevos de la UI.
3. Los mockups quedan **disponibles siempre**: Doug seguirá iterando la UI y debe poder actualizarlos sin empezar de cero.
4. Enlaces a la web de la clínica `https://dcmedicalaesthetics.com/` y al panel `https://panel.dcmedicalaesthetics.com/login`.
5. El panel tiene una **versión demo con datos falsos** y un **login falso**, para que los reclutadores entren y vean la experiencia.

**Fase 2 (después, no ahora):** Olbo con mockups de alto impacto para finanzas neotech (mano con celular, gradientes); luego
mejorar su UI. Reutiliza el kit de mockups que se construya aquí.

## Decisiones del director (el planeador las respeta, no las reabre)

- **La escena se genera, la pantalla es real.** Higgsfield produce *plates* (celular en mano, laptop en escritorio de mármol…)
  con la pantalla en verde cromático `#00FF00` plano. `scripts/mockups/compose.py` (Python, PIL + numpy, sin dependencias npm)
  detecta el verde, ajusta las 4 esquinas, aplica perspectiva y compone la captura real, respetando dedos y reflejos. Así el
  texto de la UI nunca lo deforma un modelo de imagen, y al cambiar la UI **se regenera sin gastar créditos**.
- **Kit permanente:** `mockups/scenes/<id>.json` (manifiesto: prompt, modelo, `job_id`, plate, captura de origen, salida, alt
  ES/EN), `mockups/plates/` (plates archivados), `mockups/screens/` (capturas fuente saneadas), `mockups/README.md`, y
  `npm run mockups:build`. Salida versionada en `public/work/dc-medical/scenes/` (nombre con sufijo de contenido: el
  optimizador cachea un año por URL).
- **Datos del caso:** campo nuevo `scenes` en `CaseStudy` (con `alt` y `caption` ES/EN) y un componente `CaseScenes`. Los
  tests de `src/data/__tests__` (orden, `/NN`, medios existentes) lo cubren.
- **El demo es estático y de origen aparte.** Datos **100 % sintéticos, inventados desde cero** (jamás derivados ni «limpiados»
  de los fixtures del panel, que salen de la hoja real). Backend simulado en el navegador, login de demostración que dice
  serlo, sin acceso al panel real ni a Apps Script. Se enlaza desde el caso; **no** va en un iframe ni en este origen
  (la CSP de este sitio es estricta y no se debilita).
- **Créditos:** 3,3 disponibles; un plate 2k cuesta ~2. Solo el director gasta, con `get_cost` y presupuesto aprobado.

## Reglas

1. Tailwind v4: tokens en `src/app/globals.css`; no `@apply`. Sin dependencias npm nuevas. Fuentes y estilos como hoy.
2. Paridad ES/EN en todo texto visible (`dictionaries.ts`, `data/es/*`); el español es el idioma principal.
3. CSP intacta (`next.config.ts`, `tests/e2e/security.spec.ts`): sin orígenes de terceros, sin iframes, sin `dangerouslySetInnerHTML`.
4. Enlaces externos: `target="_blank"` con `rel="noopener noreferrer"`; etiqueta honesta (el panel real es un inicio de sesión del
   personal: no prometer un demo donde no lo hay).
5. Medios: WebP, `width`/`height` reales, `alt` obligatorio, `loading="lazy"` salvo el primero visible; renombrar al cambiar.
   El test «every media path exists» debe cubrir también `scenes`.
6. **Privacidad:** ningún dato real de pacientes ni de la clínica en ningún medio, texto, dato o demo. Las capturas que entran a
   un mockup salen solo de `public/work/**` (ya saneadas) o de la demo sintética. `node scripts/qa/leak-scan.mjs` limpio antes de cada commit.
7. Orden: `dc-medical` es `/01` y los demás se corren; los tests de orden se actualizan en la misma fase.
8. `data-*`, `id`, `role`, `aria-*` y el orden de tabulación se conservan salvo donde la fase diga lo contrario. Movimiento: todo
   se apaga con `prefers-reduced-motion`.
9. Contraste AA, toques ≥ 44 px en celular, sin desborde horizontal de 320 a 1920; CLS < 0.1.
10. `grep -c $'\x08'` = 0 en cada archivo tocado.
11. Capturas: `node scripts/qa/shots.mjs --routes … --widths 390,1440 --tag uX` → `tests/shots/` (solo viewport; máx. 6 miradas).

## Fallos conocidos (línea base del 11 oct; no cuentan como fallo de una fase)

Medidos con `node scripts/qa/check.mjs` sobre el build de `1e097a4`:
- `/` @390: los enlaces sociales del pie (LinkedIn, Behance, GitHub) miden ~17 px de alto (< 44 px). **Real**; es B7.
- `/` @1440: tres `span.absolute` quedan en opacidad 0 tras el revelado. **Decorativos, confirmado:** son las marcas inactivas
  del riel lateral (`RailLabel.tsx:249`, sin texto ni hijos). `check.mjs` los reporta; no son fallo de ninguna fase.

## Backlog (auditoría U0, tag `a0`, build `1e097a4`, 390 y 1440)

Evidencia: `tests/shots/a0-*.png` (se regeneran con `node scripts/qa/shots.mjs --tag a0`; no se versionan).

| # | prioridad · esfuerzo | dónde | qué pasa | idea |
|---|---|---|---|---|
| B1 | alto · M | `/` primera pantalla | el hero (titular + blob violeta) no muestra ningún producto ni nombra DC; nada real hasta hacer scroll | una pieza real (escena hero de DC) o un acceso a DC en el hero |
| B2 | alto · M | `/` · Work (`Work.tsx:118,151`) | 5 `FeaturedRow` idénticas con viñeta abstracta (`VignetteDc` es un dibujo, no la captura); DC (`/05`) queda ~5 filas abajo; no existe una fila «destacada» | DC primero **y** variante destacada más grande, con el mockup en lugar de la viñeta |
| B3 | alto · M | `/work/dc-medical` enlaces | la única salida externa («Panel en vivo — acceso del personal →», `externalLink`) está en el colophon, al 85–90 % del scroll; no hay «Ver la web» ni demo; el caso no define `links` | fila de enlaces junto a `CaseHeader`/`CaseShowcase` con «Ver la web · Panel del personal · Probar demo»; quitar el `externalLink` del colophon (el código ya lo oculta si hay `links`) |
| B4 | alto · M | `/work/dc-medical` hero @1440 | la mitad derecha del hero está vacía; el producto empieza en y≈655 y queda cortado en el primer pantallazo | escena hero grande a la derecha del título o justo debajo |
| B5 | medio · M | `/work/dc-medical` showcase | la pieza principal necesita pulsar «Reproducir»; el pie de captura es mono 10 px gris | que el producto se lea sin reproducir nada; subir el pie |
| B6 | medio · M | `/work/dc-medical` @390 | la primera pantalla es solo texto; el celular asoma en y≈540 atenuado por el modal de la captura | escena hero con el celular completo antes del scroll |
| B7 | medio · S | `/` @390 pie | LinkedIn/Behance/GitHub miden 17 px de alto (confirmado) | zona táctil de 44 px |
| B8 | bajo · — | `/` | `scrollWidth` 375 a 390 y 1425 a 1440 = barra de scroll, no desborde | sin acción |

Orden previsto para el caso: `CaseHeader` → escena hero → `CaseShowcase` (video + galería real) → `CaseScenes` (4–5 escenas,
banda propia, en `CasePage.tsx` después del showcase y antes de las bandas) → `CaseMeta`/`CaseLinks` → impacto.

## Puertas (decisiones de Doug; el director se detiene y pregunta)

- **A · Dirección visual de las escenas** — tras ver el primer plate. Opciones: (1) claro luminoso (marfil, champán, mármol)
  como una «ventana» dentro del sitio oscuro; (2) oscuro editorial (mármol negro, obsidiana, acento champán) con la pantalla
  encendida como única fuente de luz; (3) mixto por escena. **Recomendación (revisada tras U0): (2).** El auditor lo razona
  bien: las capturas del panel son claras y pastel, y sobre una escena oscura se leen como «pantalla encendida» sin aplanar el
  sitio (`#111`); una escena beige clara chocaría con el resto de la página. Además el lujo en estética médica también vive en
  negro y champán. Un solo acento, luz y grano coherentes entre escenas, bordes que se funden con la banda. Se confirma con el
  plate delante; (1) queda como alternativa si el plate oscuro no se ve «clínico» y limpio.
- **B · Dónde vive el demo y con qué acceso** — opciones: (1) origen aparte desde el repo privado del panel
  (p. ej. `demo.dcmedicalaesthetics.com`, assets estáticos, despliegue de Doug): el código del panel sigue privado y el dominio
  de la marca da credibilidad; requiere permiso de escritura en `dc-medical-dashboard`; (2) proyecto aparte en Vercel con
  subdominio de douguizard.com; (3) dentro de este repo en `/demo/dc`: **no recomendada** (mismo origen, debilita la CSP y
  publica el código del panel). Recomendación: **(1)**.
- **C · Créditos de Higgsfield** — cuánto se aprueba gastar y en qué escenas (ver U3).

## Fases

(las escribe `pf-planner` tras el backlog; el esquema previsto está en `docs/rondas/TABLERO.md`)

| fase | qué | modelo (agente) | dependencia |
|---|---|---|---|
| U0 | Auditoría de la primera impresión | Sonnet/medio (`pf-ux-auditor`) | — |
| U1 | DC primero + enlaces a web y panel | Sonnet/medio (`pf-executor`) | U0 |
| U2 | Kit de mockups + componente `CaseScenes` | Sonnet/medio (`pf-mockup-artist`, `pf-executor`) | U1 |
| U3 | Escenas luxury (Higgsfield) | director + Sonnet/medio (`pf-mockup-artist`) | U2, **Puerta C** |
| U4 | Panel demo sintético + login falso | por definir | **Puerta B** |
| U5 | Seguridad de lo publicado | Sonnet/alto (`pf-security`) | U3, U4 |
| U6 | Cierre | Sonnet/medio (`pf-final-verifier`) | todas |
