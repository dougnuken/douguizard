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
- **B-2 · Marca dentro del demo** — conservar «DC Medical Aesthetics» solo si Doug lo confirma; si no, marca neutra (ver U4).
- **C · Créditos de Higgsfield** — cuánto se aprueba gastar y en qué escenas (ver U3: prueba ≈ 2; conjunto ≈ 12 + reserva 4).
- **D · Acceso a DC en el hero de la home** — tras U1: línea discreta bajo los botones (recomendada), nada, o chip sobre el titular (ver U1).

## Fases

Orden y dependencias: **U1 → U2b → (U3 ∥ U4) → U5 → U6**. Corren en paralelo, con rutas disjuntas: U2a (hecha) y U2b-artista con U1.
U3 y U4 están **bloqueadas** por las Puertas C y B; U1 y U2b se entregan sin ellas. Cada fase termina con
`npx tsc --noEmit && npm run lint && npm test 2>&1 | tail -40` en verde, `node scripts/qa/leak-scan.mjs` limpio y
`grep -c $'\x08'` = 0 en cada archivo tocado (Reglas 6 y 10). Los números de línea son del árbol de trabajo del 11 oct (commit `70ba0f9` más lo de U2a, que no toca `src/`); si un `grep -n` ya no
coincide, manda el patrón, no la línea. Mapa con el Backlog: U1 resuelve B1, B2 y B3; U2b y U3 resuelven B4 y, en parte, B6;
B5 y B7 no se eligieron (B7 sigue en «Fallos conocidos»).

### U1 · DC Medical primero, fila destacada y enlaces (`pf-executor`)

Se entrega **sin créditos, sin escenas y sin demo**. Cierra B2, B3 y B1.

**Hoy** (todo verificado con `grep -n`)
- `src/data/work.ts`: `caseStudies` abre con `olbo` (`num: "/01"`, línea 113) y `dc-medical` es el quinto objeto
  (`slug: "dc-medical"` 570, `num: "/05"` 571; el bloque va de la 569 a la 736). `grep -n 'slug: "' src/data/work.ts`.
- `externalLink` de DC: líneas 715–721 (comentario + `{ label: "Live panel — staff sign-in", href:
  "https://panel.dcmedicalaesthetics.com/login" }`); su traducción, `src/data/es/work.ts:436` (`externalLink: { label: "Panel en vivo —
  acceso del personal" }`). DC no define `links`.
- `src/components/pages/CasePage.tsx:66`: `showExternalLink = Boolean(study.externalLink) && !study.links?.length` (ya oculta el del
  colophon si hay `links`). `CaseMeta` pinta `CaseLinks` (`CaseMeta.tsx:54`), o sea después del showcase.
  `CaseHeader.tsx:44` recibe `{ study, meta }`.
- `src/components/sections/Work.tsx`: `featured = caseStudies.filter((c) => VIGNETTES[c.slug])` (118), `compact` (119) y el
  `ul` de `FeaturedRow` idénticas (151). `VignetteDc` es un dibujo animado (`registry.ts:25`).
- `src/components/sections/Hero.tsx:165–184`: el bloque `RevealText` con las dos píldoras (LinkedIn y `t.seeWork`).
  Sin ninguna referencia a DC.
- Tests que leen el orden: `src/data/__tests__/data.integrity.test.ts:111–122` (lista fija de slugs) y `:145–149` (`/NN` por posición);
  `i18n.parity.test.ts:96–98` («keeps the English list order») compara con `caseStudies`, así que no cambia.
  `tests/e2e/matrix.ts:3–17` es una lista de **rutas**, no de orden (DC ya está): no se toca.

**Nuevo**

1. **Datos (`src/data/work.ts`).** (a) Mover el objeto completo de `dc-medical` al **primer** lugar de `caseStudies`
   (justo después de `export const caseStudies: CaseStudy[] = [`, línea 110). (b) Renumerar: `dc-medical` `"/01"`, `olbo` `"/02"`,
   `naowee-suid` `"/03"`, `mercadolibre-andes` `"/04"`, `banco-de-occidente` `"/05"`; de `royal-caribbean` `"/06"` en adelante no cambia.
   (c) Campo nuevo en `CaseStudy`, junto a `links` (línea 105):
   ```ts
   /** Show `links` as buttons under the hero instead of as the meta strip's last row. */
   linksFirst?: boolean;
   ```
   (d) En el bloque de DC, **reemplazar** el comentario y el `externalLink` (715–721) por:
   ```ts
   // The two public destinations, under the hero. The panel is a sign-in page by design (the clinic's internal tool,
   // patient data behind it), so its label says so. A third entry, "Try the demo", is added by U4 only once the demo
   // URL answers 200 and the leak scan is clean: never a placeholder href.
   linksFirst: true,
   links: [
     { label: "Visit the website", href: "https://dcmedicalaesthetics.com/" },
     { label: "Staff panel (sign-in)", href: "https://panel.dcmedicalaesthetics.com/login" },
   ],
   ```
2. **Español (`src/data/es/work.ts`).** En `"dc-medical"`, reemplazar la línea 436 por (mismo orden, lista emparejada por posición):
   ```ts
   // Paired by index with work.ts. U4 appends { label: "Probar demo" } here, in step with the English list.
   links: [{ label: "Ver la web" }, { label: "Panel del personal (inicio de sesión)" }],
   ```
3. **Diccionarios (`src/i18n/dictionaries.ts`).** Claves nuevas, en los dos idiomas (el test de forma exige las dos):
   - `hero.latest`: EN `"Latest"`, ES `"Lo más reciente"` (después de `seeWork`).
   - `work.latest`: EN `"Most recent"`, ES `"Lo más reciente"` (después de `read`).
4. **`CaseHeader.tsx`.** Prop nueva `links?: { label: string; href: string }[]`. Después del `RevealText` del tagline (cierra en la línea
   ~112), dentro del mismo `div`, si `links?.length`:
   ```tsx
   <RevealText as="div" variant="fade" delay={0.3} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-10">
     {links.map((link, i) => (
       <a
         key={link.href}
         href={link.href}
         target="_blank"
         rel="noopener noreferrer"
         className={`btn-pill justify-center whitespace-normal py-3 text-center leading-[1.25]${i === 0 ? " btn-pill--solid" : ""}`}
       >
         {link.label}
         <span aria-hidden>→</span>
       </a>
     ))}
   </RevealText>
   ```
   (`btn-pill` ya fija `min-block-size: 44px`; `whitespace-normal` rompe su `nowrap` para que «Panel del personal (inicio de sesión)» no
   desborde a 320 px.)
5. **`CasePage.tsx`.** Después de la línea 66:
   ```tsx
   const linksTop = study.linksFirst && study.links?.length ? study.links : undefined;
   ```
   `<CaseHeader study={study} meta={meta} links={linksTop} />` (línea 148) y en `CaseMeta` (línea 89)
   `links={linksTop ? undefined : study.links}`. Los demás casos no cambian (ninguno define `linksFirst`).
6. **Fila destacada (`Work.tsx`).** Imports: `import BrowserFrame from "@/components/work/BrowserFrame";`. Nuevo componente junto a
   `FeaturedRow`, usando la **primera captura del caso** (`gallery[0]` = `caso-fases-v2.webp`, ya saneada, con su `alt` y `caption` ES/EN):
   ```tsx
   function SpotlightRow({ study, shot, locale }: { study: CaseStudy; shot: NonNullable<CaseStudy["gallery"]>[number]; locale: Locale }) {
     const t = getDict(locale).work;
     return (
       <li className="hairline-b">
         <Link
           href={localePath(locale, `/work/${study.slug}`)}
           aria-label={`${study.project} — ${study.tagline}`}
           className="group grid items-center gap-8 py-9 no-underline outline-none lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:py-12"
         >
           <div className="flex flex-col gap-3">
             <span className="section-num text-sm">{study.num}</span>
             <p className="kicker">{t.latest}</p>
             <h3 className="font-display text-[clamp(2rem,3.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--ink)] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[8px] group-focus-visible:underline">
               {study.project}
             </h3>
             <MetaLine study={study} locale={locale} />
             <p className="max-w-[46ch] text-[length:var(--step-body)] leading-[1.5] text-[var(--ink-muted)]">{study.tagline}</p>
             <span className="mt-2"><ReadAffordance locale={locale} /></span>
           </div>
           <RevealText as="div" variant="fade" className="w-full transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
             <BrowserFrame src={shot.src} alt={shot.alt} sizes="(max-width: 1023px) 92vw, 760px" animate={false} interactive={false} />
             {shot.caption && (
               <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">{shot.caption}</p>
             )}
           </RevealText>
         </Link>
       </li>
     );
   }
   ```
   En `Work()` (líneas 117–119 y 150–154):
   ```tsx
   const first = caseStudies[0];
   const shot = first?.nda ? undefined : first?.gallery?.[0];
   const spotlight = shot ? first : undefined;
   const featured = caseStudies.filter((c) => VIGNETTES[c.slug] && c !== spotlight);
   const compact = caseStudies.filter((c) => !VIGNETTES[c.slug] && c !== spotlight && c.kind !== "side");
   ```
   y dentro del `ul` (líneas 150–154): `{spotlight && shot && <SpotlightRow study={spotlight} shot={shot} locale={locale} />}` antes de `featured.map`. La regla es «el caso `/01` es el destacado»:
   si mañana otro caso pasa a ser el primero, la fila lo sigue sola. `VignetteDc` queda sin uso en la home; **no se borra** (la registry y su
   caption siguen y el artista puede reusarlos); si Doug quiere limpiarlo, es otra tarea.
   Sin `priority` ni `loading` propios: la imagen está bajo el pliegue, `next/image` la deja `lazy`. Si en 1440 el panel horizontal no la
   carga al llegar a «Trabajo» (`naturalWidth` 0), poner `loading="eager"` y anotarlo en el reporte.
7. **Acceso a DC en el hero (B1), reversible, sujeto a la Puerta D.** `Hero.tsx`: imports `getCaseStudies` (junto a `getCaseStudy`, línea 4) y
   `localePath` (línea 6 pasa a `import { localePath, type Locale } from "@/i18n/config";`). En el componente:
   `const latest = getCaseStudies(locale)[0];`. El `RevealText` de las píldoras (línea ~166) cambia su clase a
   `flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center` y suma, **después** de la píldora `seeWork`:
   ```tsx
   <Link
     href={localePath(locale, `/work/${latest.slug}`)}
     className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] no-underline underline-offset-4 hover:text-[var(--ink)] hover:underline sm:ml-2"
   >
     {t.latest}: {latest.project}
     <span aria-hidden>→</span>
   </Link>
   ```
   No cambia el titular, el blob, el orden de las píldoras ni la identidad. Resultado: «Lo más reciente: DC Medical Aesthetics →» /
   «Latest: DC Medical Aesthetics →». Si a 1440×720 o 1024×768 el `h1#home-title` queda cortado por la cabecera (ver Aceptación), añadir
   `[@media(max-height:780px)]:lg:hidden` al enlace y anotarlo.
8. **Tests.**
   - `data.integrity.test.ts` (111–122): la lista pasa a `["dc-medical","olbo","naowee-suid","mercadolibre-andes","banco-de-occidente",
     "royal-caribbean","qrvey","ideaware","chub","makeappet"]`.
   - Mismo archivo, `it` nuevo «dc-medical is /01 and lists the clinic's two origins»: `caseStudies[0].slug === "dc-medical"`,
     `externalLink` indefinido, `linksFirst === true`, `links.map(l => l.href)` igual a
     `["https://dcmedicalaesthetics.com/", "https://panel.dcmedicalaesthetics.com/login"]`; y otro: todo `href` de `links` y de `externalLink`
     de cualquier caso empieza por `https://`.
   - `tests/e2e/content.spec.ts:256` (X3): sumar `"/work/dc-medical"` y `"/en/work/dc-medical"` a `routes`.
   - `tests/e2e/dc.spec.ts` (nuevo, `pf-executor` es dueño): (i) `/` y `/en`: el primer `li` del primer `ul` de `section#work` (`#work ul` en CSS) contiene `a[href$="/work/dc-medical"]` y un
     `img` cuyo `alt` no está vacío; (ii) `/work/dc-medical` y `/en/work/dc-medical`: `main a[href="https://dcmedicalaesthetics.com/"]` y
     `main a[href="https://panel.dcmedicalaesthetics.com/login"]` existen una sola vez, con `target="_blank"` y `rel` con `noopener noreferrer`,
     el de «Ver la web» / «Visit the website» tiene `getBoundingClientRect().bottom` menor que `innerHeight` a 390×844 y los dos a 1440×900 (los enlaces se ven en la primera pantalla);
     (iii) el texto «Panel en vivo» / «Live panel» no aparece en el colophon.

**Dueño de rutas:** `pf-executor` en `src/data/**`, `src/components/**`, `src/i18n/**`, `tests/e2e/**`. Nadie más escribe.

**Pruebas y capturas:** `npx tsc --noEmit`; `npm run lint`; `npm test 2>&1 | tail -40`; `npm run build`, `npx next start -p 3131 &`;
`npx playwright test tests/e2e/dc.spec.ts tests/e2e/content.spec.ts tests/e2e/security.spec.ts tests/e2e/i18n.spec.ts 2>&1 | tail -40`;
`node scripts/qa/check.mjs --routes /,/en,/work/dc-medical,/en/work/dc-medical`;
`node scripts/qa/shots.mjs --routes /,/work/dc-medical --widths 390,1440 --tag u1` (4 miradas: hero y fila destacada a 1440 y 390).

**Aceptación**
- `grep -n 'slug: "' src/data/work.ts | head -2` muestra `olbo` en la 2.ª posición y `dc-medical` primero; `grep -n 'num: "/0[1-5]"' src/data/work.ts`
  da, en orden, `dc-medical /01`, `olbo /02`, `naowee-suid /03`, `mercadolibre-andes /04`, `banco-de-occidente /05`.
- `grep -c "Live panel" src/data/work.ts` = 0 y `grep -c "Panel en vivo" src/data/es/work.ts` = 0;
  `grep -c "panel.dcmedicalaesthetics.com/login" src/data/work.ts` = 1.
- `npm test` verde, incluidos los dos tests nuevos; X3 y S5 verdes con las rutas de DC.
- `/` a 1440: la primera fila de «Trabajo» es DC, con la captura (no la viñeta) y más grande que las otras; `/en` igual en inglés.
- `/work/dc-medical` a 1440: los dos botones se ven sin hacer scroll; a 390, al menos el de la web; el colophon ya no trae enlace externo.
- Hero: sin recorte del `h1#home-title` (su `top` ≥ el `bottom` de la cabecera) a 1440×900, 1440×720 y 1024×768; sin desborde
  horizontal de 320 a 1920 (`check.mjs`); toques ≥ 44 px; CLS < 0.1 en `/`.

**Riesgos:** (1) mover DC cambia `num` y los datos que leen `getNextCaseStudy` (el «siguiente» de `makeappet` pasa a ser DC, el de DC es
`olbo`): comportamiento esperado. (2) `i18n.parity` exige `es.links` con la misma longitud que `links`: por eso la línea 436 se reemplaza, no
se borra. (3) `motion.spec.ts` 7.2 solo exige los dígitos 5 y 4 de la viñeta de Naowee: que DC deje de pintar la suya en la home no lo afecta. (4) La CSP no cambia (`img-src 'self' data:`; el optimizador es del mismo origen).

**Puerta D · acceso a DC en el hero** (tras el commit de U1; el director manda `u1-*-390.png` y `u1-*-1440.png` de `/` y pregunta). Opciones:
(1) línea discreta bajo los botones, como se entregó (recomendada: no toca el titular ni el blob y resuelve B1 sin cambiar la identidad del hero);
(2) quitarla y dejar solo la fila destacada de «Trabajo» (hero intacto, B1 queda a medias); (3) chip sobre el titular («Lo más reciente · DC Medical
Aesthetics →»): más visible, pero compite con el titular. Elegir (2) = borrar el paso 7 (un `Link`, dos claves y un cambio de clase).

### U2 · Kit de mockups y escenas en el caso

**U2a (compositor) — hecha por `pf-mockup-artist`; no se planea aquí.** Contrato que U2b consume: `mockups/scenes/<id>.json` (con `case`, `kind`
∈ `hero|wide|duo|detail`, `alt`/`caption` `{es,en}`, `screen` o `screens[]` de 1 a 3 pantallas con `rank`), `npm run mockups:build|check|test`, salida
WebP con hash de contenido en `public/work/dc-medical/scenes/`, y `src/data/scenes.generated.json` = `{}` hasta que haya escenas reales
(`--all` no publica los ids con prefijo `_`; hoy existen `_fixture` y `_fixture-duo`, solo de prueba).

**Decisión de diseño (fuente única).** El manifiesto es el **único** lugar donde viven `kind`, `alt` y `caption` de una escena. `work.ts` solo dice
**qué escenas lleva el caso y en qué orden** (ids); los textos, el tamaño y la ruta salen del JSON generado. Así nadie copia un `alt` a mano ni
puede divergir del manifiesto, y cambiar la UI no obliga a tocar `work.ts`.

#### U2b-artista · el JSON generado trae los textos (`pf-mockup-artist`, 0 créditos; en paralelo con U1)

**Hoy:** `scripts/mockups/compose.py` escribe `src/data/scenes.generated.json` con `{ "<id>": { "src", "width", "height" } }` (`compose.py:597` define la ruta dentro de `main`, línea 585; la escritura va en 621–627).
**Nuevo:** pedido explícito. Cada entrada pasa a:
```json
"dc-hero": {
  "case": "dc-medical",
  "kind": "hero",
  "src": "/work/dc-medical/scenes/dc-hero.1a2b3c4d.webp",
  "width": 2400,
  "height": 1350,
  "alt": { "es": "…", "en": "…" },
  "caption": { "es": "…", "en": "…" }
}
```
`case`, `kind`, `alt` y `caption` se copian tal cual del manifiesto; `src`, `width` y `height` conservan su nombre y valor (compatibilidad);
claves ordenadas como hoy, sin los ids con prefijo `_`.
**Pasos:** (1) ajustar la escritura en `compose.py`; (2) ampliar `mockups/tests/test_compose.py` (las claves nuevas, `_*` ausentes, `--scene` conserva
las demás entradas); (3) documentar la forma en `mockups/README.md` (tabla «Salida»); (4) comprobar contra `--include-fixtures` en un directorio
temporal (`--root`), **sin dejar fixtures en el JSON del repo**.
**Dueño:** `pf-mockup-artist` en `scripts/mockups/**`, `mockups/**`, `src/data/scenes.generated.json`.
**Aceptación:** `npm run mockups:test 2>&1 | tail -20` y `npm run mockups:check` verdes; `grep -c '"_' src/data/scenes.generated.json` = 0;
`python3 -c "import json;d=json.load(open('src/data/scenes.generated.json'));print(all({'case','kind','src','width','height','alt','caption'}<=set(v) for v in d.values()))"`
imprime `True` (vacuo si `{}`; con el fixture temporal, `True`). **Riesgo:** ninguno del lado del sitio (el JSON sigue siendo `{}`).

#### U2b · campo `scenes`, `CaseScenes` y reglas (`pf-executor`; después de U1 y de U2b-artista)

**Hoy:** `CaseStudy` no tiene `scenes` (`grep -n "scenes" src/data/work.ts` no devuelve nada); `src/data/scenes.generated.json` es `{}`;
`CasePage.tsx` compone `CaseHeader` → `CaseShowcase` → bandas contadas (`bands`, línea 88). El test «every media path on a case study exists in
/public» está en `data.integrity.test.ts:130–143` y solo mira `video` y `gallery`. `resolveJsonModule` es `true` (`tsconfig.json:16`).

**Nuevo**
1. **`src/data/work.ts`:** en `CaseStudy`, después de `linksFirst`:
   ```ts
   /** Scene ids from scenes.generated.json, in display order. The first `hero` is the hero scene; the rest form the band (max 5). Words and sizes live in the manifest, never here. */
   scenes?: string[];
   ```
   `CaseCopy` **no** cambia (no hay palabras en `work.ts`); `localize()` ya conserva el campo (`...c`). En esta fase `dc-medical` **no** lleva `scenes`
   (los ids reales llegan con U3).
2. **`src/lib/caseScenes.ts`** (nuevo, puro, sin React):
   ```ts
   import generated from "@/data/scenes.generated.json";
   export type SceneKind = "hero" | "wide" | "duo" | "detail";
   export interface SceneEntry { case: string; kind: SceneKind; src: string; width: number; height: number; alt: Record<Locale, string>; caption: Record<Locale, string> }
   export interface CaseScene { id: string; kind: SceneKind; src: string; width: number; height: number; alt: string; caption: string }
   export const SCENE_BAND_MAX = 5;
   export function getCaseScenes(study: CaseStudy, locale: Locale, source: Record<string, SceneEntry> = generated as unknown as Record<string, SceneEntry>): CaseScene[]
   export function planScenes(scenes: CaseScene[]): { hero?: CaseScene; band: { scene: CaseScene; span: 6 | 12; offset: boolean }[] }
   ```
   `getCaseScenes` **lanza** (y por eso falla el build) si: un id del caso no está en `source`; un id empieza por `_`; `entry.case !== study.slug`;
   el id se repite; faltan `alt`/`caption` en `locale`. `planScenes`: `hero` = la única escena `kind: "hero"` (dos → lanza); `band` = el resto en el orden dado
   (más de `SCENE_BAND_MAX` → lanza); `span` 6 para `detail` y 12 para `wide`/`duo`; dos `detail` seguidos comparten fila (6+6); un `detail` suelto lleva
   `offset: true` (centrado, `md:col-start-4`).
3. **`src/components/case/CaseScenes.tsx`** (`"use client"`, como sus hermanos). Dos exportaciones:
   - `export function SceneHero({ scene }: { scene: CaseScene })`:
     `<Band tone="paper" wide className="py-0 pb-12 md:py-0 md:pb-16"><SceneFigure scene={scene} priority sizes="(max-width: 767px) 92vw, (max-width: 1479px) 92vw, 1344px" /></Band>`
     (sin `rule`: continúa el tono del `CaseHeader`, que es `paper`).
   - `export default function CaseScenes({ tone, scenes }: { tone: "paper" | "raised"; scenes: ReturnType<typeof planScenes>["band"] })`:
     `<Band tone={tone} rule="t" wide className="py-10 md:py-14">` con `<h2 className="sr-only">{t.scenes}</h2>` (`t = useDict().case`) y
     `<ul className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">`; cada `li` lleva `md:col-span-12` o `md:col-span-6` (+ `md:col-start-4` si `offset`)
     y un `FadeIn` con `delay={Math.min(i * 0.06, 0.25)}`. `sizes`: span 12 → `"(max-width: 767px) 92vw, (max-width: 1479px) 92vw, 1344px"`;
     span 6 → `"(max-width: 767px) 92vw, (max-width: 1479px) 44vw, 660px"`. Sin `priority`; `loading="lazy"` (el valor por defecto de `next/image`).
   - `SceneFigure` (interno):
     ```tsx
     <figure className="m-0">
       <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--scene-bg)]">
         <Image src={scene.src} alt={scene.alt} width={scene.width} height={scene.height} sizes={sizes} priority={priority} draggable={false} className="block h-auto w-full select-none" />
       </div>
       <figcaption className="mt-3 max-w-[68ch] text-[13.5px] leading-[1.5] text-[var(--ink-muted)]">{scene.caption}</figcaption>
     </figure>
     ```
     (el mismo pie de 13,5 px que `BrowserFrame`; `next/image` con `width`/`height` reales reserva el espacio: CLS 0.)
4. **`src/app/globals.css`:** token nuevo dentro del bloque `:root {` (línea 48), antes de `color-scheme`: `--scene-bg: #111111;` (el mismo en los dos
   temas: es el fondo de carga y el color con el que el compositor funde los bordes). No toca `--paper`, así que `theme.tokens.test.ts` sigue verde.
5. **`src/i18n/dictionaries.ts`:** `case.scenes`: EN `"Product in context"`, ES `"El producto en contexto"` (después de `product`).
6. **`CasePage.tsx`:** `const scenes = getCaseScenes(study, locale); const plan = planScenes(scenes);` (si `study.scenes` no existe devuelve `[]`).
   Entre `<CaseHeader … />` y `{showcase && …}`: `{plan.hero && <SceneHero scene={plan.hero} />}`. En `bands`, **al principio** (es una banda contada, así
   alterna sola y nunca deja una costura): `if (plan.band.length) bands.unshift({ key: "scenes", render: (tone) => <CaseScenes tone={tone} scenes={plan.band} /> });`
   (en cualquier punto después de crear `bands`). Orden resultante: `CaseHeader` → escena hero → `CaseShowcase` →
   `CaseScenes` → `CaseMeta` → impacto (el del Backlog).
7. **Tests.**
   - `data.integrity.test.ts`, dentro de «every media path on a case study exists in /public» (130–143), añadir: (a) cada entrada de
     `scenes.generated.json` cuyo id **no** empieza por `_` existe en `public/` (`existsSync(join(publicDir, entry.src))`); (b) para cada caso, cada id de
     `c.scenes` está en el JSON, no empieza por `_` y su `case` es el slug del caso. Un `it` aparte: «no scene id starts with `_`» sobre todo `caseStudies`.
   - `src/lib/__tests__/caseScenes.test.ts` (nuevo): con un `source` inyectado, `getCaseScenes` devuelve alt/caption en `es` y en `en`; lanza ante id
     desconocido, id `_fixture` (aunque esté en `source`), caso equivocado, id repetido; `planScenes` elige el hero, respeta el máximo de 5, empareja dos
     `detail` (6+6) y centra uno suelto; y un `it` sobre el JSON real: todo `alt` y `caption` tiene texto en `es` y en `en`, y `es` ≠ `en`.
   - `tests/e2e/scenes.spec.ts` (nuevo): para `/work/dc-medical` y `/en/work/dc-medical`: **ningún** `img` ni `source` del documento contiene `_fixture` ni `/scenes/_`; si
     el caso lleva `scenes`, cada `img` de escena tiene `alt` no vacío, atributos `width`/`height`, `naturalWidth > 0` tras cargar y el hero es el primero
     bajo el `h1`; si no lleva, no existe `h2` «Product in context»/«El producto en contexto».
8. **Regla de oro de las pruebas:** `_fixture` y `_fixture-duo` **nunca** se renderizan; los tres niveles de arriba (build que lanza, test que falla,
   e2e que busca la cadena) deben fallar antes que verlas en producción.
9. **Vista previa opcional y descartable** (para ver el layout antes de U3): en una **copia** del repo fuera del árbol (`<scratchpad>/u2b-preview`, con
   `node_modules` enlazado), copiar `mockups/scenes/_fixture.json` a `dc-prueba.json` (id sin guion bajo), correr `npm run mockups:build`, listar
   `scenes: ["dc-prueba"]` en la copia, construir y capturar. Nada de eso vuelve al repo. Si el enlace de `node_modules` falla, se difiere a la
   escena de prueba real de U3-prueba.

**Dueño de rutas:** `pf-executor` en `src/**` y `tests/e2e/**`. Solo lee `scenes.generated.json` y los manifiestos.

**Pruebas y capturas:** `npx tsc --noEmit`; `npm run lint`; `npm test 2>&1 | tail -40`; `npm run mockups:test 2>&1 | tail -15`;
`npm run build` (el build debe pasar con `scenes` ausente); `npx playwright test tests/e2e/scenes.spec.ts tests/e2e/security.spec.ts 2>&1 | tail -30`;
`node scripts/qa/check.mjs --routes /work/dc-medical,/en/work/dc-medical`. Capturas solo si se hizo la vista previa (2 miradas, 390 y 1440).

**Aceptación:** `grep -n "scenes" src/data/work.ts` muestra el campo en la interfaz y ninguna lista en un caso; `grep -c "_fixture" src/data/scenes.generated.json` = 0;
las tres líneas de `npm test` nuevas pasan; `/work/dc-medical` se ve **exactamente igual** que al cerrar U1 (sin escenas no se pinta nada ni queda un `h2` vacío);
con la vista previa, la banda no desborda en 320–1920 y las imágenes no desplazan nada (CLS < 0.1). **Riesgos:** `CasePage.tsx` y `work.ts` son los mismos
archivos de U1: por eso va después; `getCaseScenes` lanzando en SSG tumba el build ante un id mal escrito (es lo buscado); el optimizador cachea un año
por URL: el hash del nombre de salida ya lo resuelve.

### U3 · Escenas luxury con Higgsfield (director + `pf-mockup-artist`; **bloqueada por la Puerta C**)

**Hoy:** la cuenta tiene 3,3 créditos; un plate 2k cuesta ≈ 2 y uno de calidad alta ≈ 6,5 (`get_cost` lo consulta el director antes de cada
generación). `mockups/plates/` y `mockups/screens/` están vacíos; `mockups/README.md` trae la plantilla de prompt **clara** (marfil/champán).

**Dirección de arte vigente (Puerta A, recomendación revisada): oscuro editorial** — mármol negro/obsidiana, la pantalla encendida como única fuente de
luz, **un solo acento** (champán), luz y grano coherentes entre escenas y bordes que se funden con `#111111` (`--scene-bg`). Alternativa: claro luminoso
(la plantilla actual).

**Hallazgo de privacidad que fija el orden:** las seis capturas saneadas de `public/work/dc-medical/` (`caso-fases-v2`, `agenda-mes`, `agenda-dia`,
`cupos-semana`, `seguimiento-controles`, `usuarios-permisos-v2`) son **de escritorio, 2880×1800**. No existe una captura saneada **vertical** del panel en el
celular (el único formato así es el póster/video de la nota de voz, 786×1704, pendiente de la verificación de U5). Por eso: **ninguna escena usa el póster ni
fotogramas del video** hasta que U5 los despeje, y la escena que necesita un celular (`dc-duo`) espera a una captura vertical de la **demo sintética** (U4) o a
un fotograma que U5 apruebe. Las otras cinco muestran pantallas de escritorio en laptop, tableta o monitor.

#### U3a · el compositor aprende la luz oscura (`pf-mockup-artist`, 0 créditos; antes de generar nada)

Pedido explícito, probado con el plate sintético de `mockups/fixtures/`:
1. **`screen.glow`** (0–1, por defecto 0): después de componer, suma a la imagen un resplandor suave **fuera** de la pantalla (desenfoque ≈ 6 % del
   ancho de la pantalla, tomado del color medio de la captura, mezcla «screen»). Así la pantalla es la única fuente de luz **sin** que el plate pida una
   pantalla verde que ilumine verde el mármol y los dedos.
2. **`output.edge_fade`** (fracción del lado menor, p. ej. `0.06`) y **`output.edge_color`** (`"#111111"`): funde los bordes de la imagen con ese color.
3. **Métrica de derrame en `--check`:** media de `G − máx(R,B)` en un anillo de 24 px fuera del cuadrilátero de cada pantalla; umbral de aviso 12, de error 24.
   También imprime cuántas manchas verdes menores (< 20 % de la mayor) ignoró.
4. **`mockups/README.md`:** sección «Variante oscura» con la base de prompt de abajo y los campos nuevos. La base (cada escena cambia solo la primera línea):
   > Photorealistic editorial product photograph for a luxury aesthetic-medicine clinic. Palette: black marble with fine champagne veining, obsidian,
   > deep charcoal, a single warm champagne accent. Low-key lighting, one soft dim key light from the upper left, deep shadows, fine film grain, shallow
   > depth of field, 85mm lens, high-end magazine look. **The device screen is a perfectly flat, uniform, pure chroma-key green (#00FF00): no
   > reflections, no glare, no gradient, no UI, no text, no icons, entire screen visible and sharp, and it emits no light onto the scene.** No green
   > plants or leaves anywhere, no other green objects, no text, no logos, no brand marks, no identifiable faces (hands and forearms only), natural
   > manicured hands, no jewelry with text.

**Dueño:** `pf-mockup-artist` en `scripts/mockups/**`, `mockups/**`. **Aceptación:** `npm run mockups:test` y `npm run mockups:check` verdes;
con el fixture, `glow` y `edge_fade` cambian el hash del nombre de salida (nombre nuevo) y la métrica de derrame sale en cero.

#### Las seis escenas (orden de generación = orden de la lista; primero UNA de prueba)

Todas: `case: "dc-medical"`, salida `output.dir: "public/work/dc-medical/scenes"`, `width` 2400, `quality` 85, `screen.fit: "cover"`, `glow` 0.5,
`edge_fade` 0.06, `edge_color` "#111111". Formato del plate: 16:9 para `hero`/`wide`/`duo`, 4:5 para `detail`. Primera línea del prompt (el resto es la base):

| # | id | tipo | encuadre (primera línea del prompt) | pantalla (captura saneada) | costo est. |
|---|---|---|---|---|---|
| 1 | `dc-hero` | hero | *A slim graphite laptop open on a black marble desk with fine champagne veining, three-quarter front view from a slightly raised angle, a single champagne ceramic object beside it, deep obsidian background out of focus.* | `public/work/dc-medical/caso-fases-v2.webp` (la ficha del caso: el argumento del producto) | 2,0 |
| 2 | `dc-agenda` | wide | *A slim laptop seen almost straight on at desk height on a black marble surface, a thin champagne-gold pen resting in front, dark charcoal wall softly out of focus.* | `agenda-mes.webp` | 2,0 |
| 3 | `dc-cupos` | detail | *A tablet held in landscape by two manicured hands over black marble, slightly tilted toward the camera, dark cashmere cuffs, close crop.* | `cupos-semana.webp` | 2,0 |
| 4 | `dc-seguimiento` | detail | *Close crop of the corner of an open laptop on black marble, a manicured hand resting near the trackpad, the screen filling the upper two thirds of the frame.* | `seguimiento-controles.webp` | 2,0 |
| 5 | `dc-permisos` | wide | *A large desktop monitor on a black marble desk with a slim keyboard, seen from slightly above and to the side, obsidian wall.* | `usuarios-permisos-v2.webp` | 2,0 |
| 6 | `dc-duo` | duo | *A slim laptop open on a black marble desk with a smartphone standing upright beside it on a small champagne stone stand, both screens facing the camera, three-quarter view.* | `screens`: rank 1 (laptop) `agenda-dia.webp`; rank 2 (celular) **captura vertical saneada de la demo (U4)**, hoy inexistente | 2,0 |

Presupuesto: **12,0 créditos** si ninguna falla (1–5 = 10,0; la 6 solo cuando exista la captura vertical = 2,0) + **reserva 4,0** (dos reintentos) = **16,0
a aprobar**. La banda del caso queda así: hero `dc-hero`; banda (en este orden) `dc-agenda`, `dc-cupos`, `dc-seguimiento`, `dc-permisos`, `dc-duo` — es decir
ancho, dos detalles lado a lado, ancho, dúo (el tope de `SCENE_BAND_MAX` = 5). Sin la sexta, la banda trae 4 y sigue siendo válida.

**Orden de generación y flujo**
1. **U3a** (arriba, 0 créditos).
2. **U3-prueba — solo `dc-hero` (≈ 2,0; alcanza con los 3,3).** El director consulta `get_cost`, genera, descarga el plate y lo guarda en
   `mockups/plates/dc-hero.webp` (el director deja el archivo y pasa al artista `job_id`, modelo y resolución; el artista es el dueño del resto de la ruta).
   El artista escribe `mockups/scenes/dc-hero.json` (prompt completo, `higgsfield.job_id`, `model`, `resolution`, `notes`), corre
   `python3 scripts/mockups/compose.py --scene dc-hero --check` y luego `npm run mockups:build`. El ejecutor pone `scenes: ["dc-hero"]` en DC (con U2b hecha) y
   toma `node scripts/qa/shots.mjs --routes /work/dc-medical --widths 390,1440 --tag u3` (2 miradas). **Puerta A.**
3. **U3-resto** (tras la Puerta A y con presupuesto aprobado en la Puerta C): escenas 2 a 5, una por una, cada una validada antes de gastar la siguiente;
   la 6 cuando exista la captura vertical. Mismo flujo por escena. `pf-security` mira cada medio nuevo (EQUIPO §2). El ejecutor completa `scenes` en `work.ts`.

**Criterios de aceptación de un plate** (el artista los revisa con `--check` y con **una** mirada al compuesto a tamaño real; si uno falla, no se compone):
- Verde plano: la región clave es un cuadrilátero limpio de 4 esquinas, sin gradientes ni reflejos; el compositor declara el número exacto de pantallas;
  derrame < 12 (error ≥ 24); sin manchas verdes menores que el compositor tenga que ignorar cerca de la pantalla.
- Sin plantas ni otros objetos verdes; sin texto, logos ni marcas; sin rostros identificables (solo manos y antebrazos); sin joyas con texto.
- Dedos y bordes ocluyendo bien: ningún halo verde ni recorte duro alrededor de un dedo en el compuesto (se mira a 100 %); la pantalla entera a cuadro y sin pegarse al borde.
- Luz y grano coherentes con el resto del conjunto; acento único champán; los bordes se funden con `#111111` sin banda visible.

**Si un plate falla:** el artista NO regenera ni pide gastar: reporta (≤ 10 líneas) el defecto exacto (qué criterio, dónde en la imagen) y propone el **cambio de
prompt** (texto completo). El director decide el gasto con `get_cost` y dentro de la reserva; **una generación pagada nunca se reintenta sin avisar a Doug**
(EQUIPO §3). Defectos que se corrigen sin créditos antes de pedir un reintento: derrame leve (subir `tolerance`), reflejo suave (bajar `glare`).

**Puerta A · dirección visual** (tras `dc-hero` compuesto; `SendUserFile` con la captura a 1440 y a 390). Opciones: (1) oscuro editorial (recomendada, ver «Puertas»);
(2) claro luminoso (marfil/champán, como «ventana» dentro del sitio oscuro; cambia la base de prompt y `edge_color`); (3) mixto por escena. Si Doug elige (2) o (3),
el artista adapta la base y la prueba se repite con **un** plate más (≈ 2,0), dentro de la reserva.

**Puerta C · créditos** (el director la plantea antes de U3-prueba). Opciones: (1) **solo la prueba** — `dc-hero` ≈ 2,0; sirve con los 3,3 de hoy (recomendada para
empezar: la Puerta A la necesita igual); (2) **cuatro escenas** — hero + `dc-agenda`, `dc-cupos`, `dc-seguimiento` ≈ 8,0 + reserva 2,0 = 10,0 (faltan ≈ 6,7); (3) **conjunto
completo** — seis escenas ≈ 12,0 + reserva 4,0 = 16,0 (faltan ≈ 12,7). (Variante premium: `dc-hero` en calidad alta ≈ 6,5 + cinco de 2k ≈ 10,0 + reserva 4,0 = 20,5.)
Recomendación: (1) ahora; tras ver la prueba, (3) si Doug la aprueba.

**Dueños de rutas:** `pf-mockup-artist` en `mockups/**`, `scripts/mockups/**` y `public/work/dc-medical/scenes/**`; el director deposita el plate descargado; `pf-executor` solo
`src/data/work.ts` (la lista `scenes`) y las capturas. **Pruebas:** `npm run mockups:check`, `npm run mockups:build`, `npm run mockups:test`, `npm test`,
`npx playwright test tests/e2e/scenes.spec.ts`, `node scripts/qa/check.mjs --routes /work/dc-medical,/en/work/dc-medical`,
`node scripts/qa/leak-scan.mjs`. **Aceptación (por escena):** salida `*.webp` con hash en `public/work/dc-medical/scenes/`, entrada en
`scenes.generated.json` con `case/kind/alt/caption`, manifiesto con `job_id` no vacío, la escena visible en el caso, ninguna `_*` publicada. **Riesgos:** la captura de
origen cambia → `npm run mockups:build` regenera (el nombre cambia, así que no hay caché vieja); un plate no se commitea sin su manifiesto (Regla del director).

### U4 · Panel demo sintético y login falso (**bloqueada por la Puerta B**)

**Enfoque (conclusión del analista de viabilidad):** paquete **100 % estático** con un **interceptor de `fetch`** (más un Service Worker, o la conversión a JS de los
formularios de salida si los hay, decididos en D1) que responde desde datos inventados, con el estado **en memoria por navegador**: sin servidor, sin Cloudflare,
sin cookies reales. El trabajo ocurre en el **repo privado `dc-medical-dashboard`** (carpeta `tools/`, con su propio plan `docs/DEMO-PUBLICO.md`, que se escribe allí cuando Doug dé
acceso). Este plan público fija solo las fases, los criterios y la privacidad; **no** lista nombres de personas, endpoints internos ni identificadores. Los nombres de ruta
de abajo son propuestos; el plan privado manda.

**Privacidad (innegociable; la verifica `pf-security` en U5):**
1. Nada se **deriva ni se «limpia»** de los fixtures, de `--real` ni del historial: los datos se **inventan desde cero** con una semilla aleatoria fija. El generador no lee
   ningún archivo de fixtures (prueba que lo comprueba) y la demo local existente, que se alimenta de fixtures, no sirve de base.
2. El `index.html` del panel trae del orden de 200 menciones de nombres de personas reales, sedes y un dominio interno. El generador las reemplaza por una **tabla fija de nombres
   inventados**; el escáner **falla** si queda cualquiera. La marca «DC Medical Aesthetics» se conserva **solo si Doug lo confirma** (Puerta B-2).
3. El generador y los fixtures viven **solo en el repo privado**; **nunca** entran a este repo público. Al portafolio llega, solo si Doug elige esa opción, la carpeta
   resultante ya saneada.
4. El escáner revisa también `<title>`, comentarios, metadatos de build, imágenes y fuentes embebidas.

**Dueño de rutas:** la sesión de Doug abierta en `dc-medical-dashboard` (con sus agentes `ui-*`): `tools/demo/**`, `tools/build_demo.py`, `tests/demo/**`, `docs/DEMO-PUBLICO.md`.
En este repo: `pf-executor` solo agrega el tercer enlace (`src/data/work.ts`, `src/data/es/work.ts`, `tests/e2e/dc.spec.ts`) cuando la demo responde; `pf-security` solo lee y registra.

**D1 · semilla inventada y todas las pestañas en solo lectura**
- **Nuevo:** generador determinista de datos (semilla fija) en **el mismo formato de tablas** que el panel ya procesa: hojas de seguimiento/pacientes/casos, contabilidad
  anual, inventario, cupos y agenda de calendario. Orden de magnitud: 40–60 pacientes, 30–40 casos, ~80 ingresos, ~50 gastos, ~30 insumos, 30–60 eventos de agenda, 3 perfiles.
  Las fechas se anclan al día del navegador (desfases en días), para que la agenda no envejezca. El interceptor sirve esas tablas a todas las pestañas del panel.
- **Aceptación:** dos corridas del generador dan el mismo hash; todas las pestañas cargan en solo lectura sin errores de consola; ningún archivo de `tools/demo/**` referencia carpetas
  de fixtures (`grep` vacío); los nombres del conjunto salen de una lista inventada y **ninguno** coincide con la lista de nombres reales (se cruza fuera del repo).
- **Pruebas:** prueba unitaria de determinismo y de formato; prueba de navegador que recorre las pestañas. **Riesgo:** una columna con formato raro hace fallar un lector del panel: la
  prueba de navegador lo detecta.

**D2 · login de demostración y permisos por rol**
- **Nuevo:** página estática de entrada con el banner fijo «DEMO · datos ficticios, nada se guarda en un servidor» y tres botones: «Entrar como secretaria (editora)»,
  «Entrar como doctor (solo lectura)» y «Entrar como administrador». **Sin claves.** El rol queda en `sessionStorage` (no cookie) y el banner se repite en toda pantalla. Los permisos
  salen de las reglas de rol del propio panel (el doctor no ve botones de editar).
- **Aceptación:** sin pedir credenciales; el banner se ve en cada pestaña a 390 y 1440; cada rol ve solo lo suyo; ninguna petición sale del origen de la demo; ninguna cookie se crea.
- **Pruebas:** navegador por rol (3). **Riesgo:** que el banner tape la barra móvil (zona táctil < 44 px): se mide.

**D3 · escrituras emblemáticas**
- **Nuevo:** portar solo seis escrituras, sobre el estado en memoria: registrar pago, crear paciente, marcar realizado, agendar control, ajustar inventario y registrar gasto. Todo lo demás
  responde «No disponible en la demo»; la IA (nota de voz, recibos y facturas) se simula con textos fijos. Un botón «Restablecer demo» vuelve a la semilla.
- **Aceptación:** cada una de las seis cambia la vista y se pierde al recargar; el resto muestra el aviso exacto; ninguna llamada de red de salida.
- **Pruebas:** navegador, una prueba por escritura y una por «no disponible». **Riesgo:** un cálculo de saldos que se rompa con estado nuevo (regla de saldos «se leen, no se suman»): lo cubre una prueba.

**D4 · empaquetado, escáner de privacidad y prueba de navegador; solo entonces publicar**
- **Nuevo:** `tools/build_demo.py` genera una carpeta estática (`dist-demo/`) con el HTML transformado (tabla fija de nombres, marca según la Puerta B-2), el interceptor y los datos; y
  `tools/scan_demo.py`, que **falla** si encuentra: cualquiera de los nombres/sedes/dominios de la tabla de reemplazo (lista fuera del repo público), correos o teléfonos reales, ids de Drive, o
  cualquier cadena de la lista de nombres reales, en el HTML, `<title>`, comentarios, metadatos de build, cadenas de imágenes (incluidos EXIF/XMP/PNG) y fuentes embebidas.
- **Publicación (Puerta B, opción 1):** proyecto estático de origen aparte con sus propias cabeceras: CSP `default-src 'self'; connect-src 'self'; worker-src 'self'; frame-ancestors 'none';
  base-uri 'none'; form-action 'self'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex`. Despliegue lo hace Doug.
- **Aceptación:** `build_demo.py` y `scan_demo.py` verdes; prueba de navegador completa (tres roles, seis escrituras, «no disponible», cero peticiones a otro origen, cero cookies); revisión de
  `pf-security` con la lista de nombres reales (fuera del repo, sin imprimirla); recién entonces la carpeta se sube.
- **Cierre en este repo (`pf-executor`):** tercer enlace de DC: `links` EN `{ label: "Try the demo (in Spanish)", href: "<URL de la demo>" }` y ES `{ label: "Probar demo" }`
  (mismo orden; el `href` solo si responde 200 y `leak-scan.mjs` está limpio); sumar el caso a `tests/e2e/dc.spec.ts`. Regla 4: etiqueta honesta («datos ficticios» aparece ya en el banner de entrada).

**Puerta B · dónde vive el demo y con qué acceso** (el director pregunta antes de D1). Opciones: (1) **origen aparte desde el repo privado**, p. ej. `demo.dcmedicalaesthetics.com`,
assets estáticos, despliegue de Doug; el código del panel sigue privado y el dominio de la marca da credibilidad; requiere permiso de escritura en `dc-medical-dashboard`; **antes de
elegir un subdominio de la marca hay que confirmar que la cookie de sesión del panel real es de host (sin `Domain`), para que el demo no la reciba**; si no lo es, usar la variante (2);
(2) proyecto aparte con subdominio de `douguizard.com`; (3) dentro de este repo en `/demo/dc`: **no recomendada** (mismo origen, debilita la CSP y publica el código del panel).
**Recomendación: (1)**, con la comprobación de la cookie. **Puerta B-2 · marca dentro del demo:** (a) conservar el nombre de la clínica solo si Doug lo confirma (da credibilidad;
exige que el escáner también valide el resto de la marca); (b) renombrar a una marca neutra («Clínica Demo»). Sin confirmación explícita, se usa (b).

### U5 · Seguridad de lo publicado (`pf-security`)

Corre cuando U3 y U4 terminaron; solo lee y reporta, y escribe únicamente `docs/rondas/SEGURIDAD.md`. **Decide PASA o FALLA**: crítico o alto = no se hace push. Comprobaciones, con las de su definición:
1. `node scripts/qa/leak-scan.mjs 2>&1 | tail -40` — cualquier hallazgo es FALLA hasta explicarse.
2. **Lista de nombres reales**, armada fuera del repo en su scratchpad (nunca copiada al repo, nunca impresa, nunca en el reporte), pasada con `--denylist <ruta>`.
3. **Pedido pendiente (TABLERO):** cruzar **todos** los medios ya publicados de DC contra esa lista: las seis capturas de `public/work/dc-medical/*.webp` (incluidas las `-v2`), `nota-de-voz-poster.jpg`
   (muestra un nombre y un teléfono que parecen inventados y **nunca se verificó**) y los **fotogramas** de `nota-de-voz.mp4` y `.webm` (`ffmpeg` cada 2 s a su directorio temporal). Para este pedido se
   autoriza hasta 12 miradas, recortando la zona del formulario; sin OCR, la lectura es visual. Un nombre o teléfono real, o uno que no se pueda descartar = **crítico**: el medio sale del sitio y de los
   manifiestos hasta reemplazarlo por uno de la demo sintética.
4. **Medios nuevos de U3:** salidas de `public/work/dc-medical/scenes/`, plates archivados y capturas fuente: ¿se lee algo real? Metadatos de los plates y los WebP (EXIF, XMP, texto de PNG, C2PA) sin
   cuenta ni rutas locales; el `job_id` del manifiesto es lo único permitido.
5. **Encabezados y CSP:** `npx playwright test tests/e2e/security.spec.ts 2>&1 | tail -30`; sin `iframe`, sin orígenes nuevos; las imágenes de escenas salen del mismo origen.
6. **Enlaces:** `rel="noopener noreferrer"` en todo externo (S5 y X3 con las rutas de DC); ninguna URL con parámetros que revele usuarios o ids; los dos destinos de DC son los acordados.
7. **Demo (si existe):** sin backend real ni credenciales reales; el login dice serlo; los datos viven en el navegador; no alcanza el panel real ni Apps Script; cabeceras propias estrictas;
   sin cookies compartidas con el panel real; la carpeta saneada pasa el escáner del repo privado y la lista de nombres reales (que `pf-security` corre él mismo). La comprobación contra la URL pública
   usa red externa: el director la autoriza.
8. **Procedencia:** `git ls-files` no contiene generadores, fixtures ni carpetas `tools/` del panel; ninguna captura de `mockups/screens/` ni de las escenas sale de fuera de `public/work/**` o de la demo.
9. **Registro:** `docs/rondas/SEGURIDAD.md` con fecha, fase, comprobación, resultado, severidad y veredicto, **sin reproducir ningún dato sensible** (dónde, no qué). **Aceptación:** reporte `U5 · pf-security · PASA`
   y el archivo escrito; si FALLA, el director manda los hallazgos al dueño de la ruta (máx. 2 rondas) y U5 se repite solo sobre lo nuevo.

### U6 · Cierre (`pf-final-verifier`)

Solo lee y reporta (EQUIPO §3). Orden: (0) cerrar `next start` sueltos de más de una hora; (1) `npx tsc --noEmit`, `npm run lint`, `npm test` con `| tail`; (2) `npm run build` (nadie más construye: confirmarlo en
`docs/rondas/TABLERO.md`); (3) `npx playwright test 2>&1 | tail -60` completa (lo que falle se repite una vez y se dice si fue estable); (4) `npm run mockups:test` y `npm run mockups:check`;
(5) `node scripts/qa/leak-scan.mjs` limpio y `grep -c $'\x08'` = 0 en cada archivo tocado por la ronda; (6) `node scripts/qa/shots.mjs --routes /,/en,/work/dc-medical,/en/work/dc-medical --widths 390,1440 --tag u6`
(máx. 6 miradas: fila destacada, hero, enlaces, escenas, nada cortado ni desbordado); (7) comprobaciones propias de esta ronda: DC primero y `/01`; `grep -c "Live panel" src/data/work.ts` = 0; los dos enlaces de DC
y, si Puerta B se resolvió, el de la demo; `grep -c "_fixture" src/data/scenes.generated.json` = 0 y ninguna página los renderiza; `docs/rondas/SEGURIDAD.md` existe con veredicto PASA.
Fallos conocidos y ajenos (de «Fallos conocidos»): los pies sociales a 390 y los tres `span.absolute` del riel. Lista de lo que falta para cerrar: Puertas pendientes, créditos, despliegue de la demo,
el merge a `main`, B5 y B7 (no elegidos). **Aceptación:** `U6 · pf-final-verifier · PASA` con todo lo anterior; el cierre lo anota el director en el plan.

### Tabla de fases

| fase | qué | modelo / esfuerzo (agente) | tokens aprox. (ejecución + revisión) | dependencia | puerta |
|---|---|---|---|---|---|
| U0 | Auditoría de la primera impresión | Sonnet/medio (`pf-ux-auditor`) | hecha | — | — |
| U1 | DC primero, fila destacada, enlaces, acceso en el hero | Sonnet/medio (`pf-executor`) + `pf-code-reviewer` (Sonnet/medio) y `pf-visual-qa` (Haiku/bajo) | 90k + 55k | U0 | D |
| U2a | Compositor y plate sintético | Sonnet/medio (`pf-mockup-artist`) | hecha | — | — |
| U2b-artista | JSON generado con `case/kind/alt/caption` | Sonnet/medio (`pf-mockup-artist`) | 40k + 15k | U2a (en paralelo con U1) | — |
| U2b | Campo `scenes`, `CaseScenes`, tests | Sonnet/medio (`pf-executor`) + revisores | 110k + 55k | U1, U2b-artista | — |
| U3a | Luz oscura en el compositor (`glow`, `edge_fade`, derrame) | Sonnet/medio (`pf-mockup-artist`) | 55k + 15k | U2b-artista | — |
| U3-prueba | `dc-hero` (≈ 2 créditos) | director + Sonnet/medio (`pf-mockup-artist`) + `pf-visual-qa` | 60k | U2b, U3a, **C** | **A** |
| U3-resto | Escenas 2–6 (≈ 8–10 créditos) | director + Sonnet/medio (`pf-mockup-artist`, `pf-executor`) + `pf-security` (Sonnet/alto) | 130k + 60k | U3-prueba, **A**, **C**, la 6 con U4 | — |
| U4 | Demo: D1 semilla/lecturas (Sonnet/alto, 150k) → D2 login/roles (Sonnet/medio, 90k) → D3 escrituras (Sonnet/medio, 120k) → D4 empaquetado, escáner y publicación (Sonnet/alto, 130k) | sesión en el repo privado (agentes `ui-*`) + `pf-security` al final | ≈ 490k + 60k | **B** | **B**, B-2 |
| U5 | Seguridad de lo publicado | Sonnet/alto (`pf-security`) | 70k | U3, U4 | — |
| U6 | Cierre | Sonnet/medio (`pf-final-verifier`) | 80k | todas | — |

Opus solo se usa para re-planear (`pf-planner`) si una fase falla dos veces. Los tokens son estimaciones: una ronda de arreglos reanudando al mismo ejecutor cuesta ≈ 1/3 de la fase.
