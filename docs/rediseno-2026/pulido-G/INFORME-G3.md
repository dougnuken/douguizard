# Pulido G3 · datos, disponibilidad, banderas y marquee de empresas

Rama `pulido-g/g3-datos` (sobre 46f77d9). Actualizado tras la respuesta de Doug: Naowee terminó en oct 2026; disponibilidad «roles y consultoría, inmediata» queda; logos SVG buscados. Pruebas en `next start -p 3203`.

## 1. Naowee ya no es el rol actual
- `cv.ts`: Naowee con `end: { 2026, 11 }`, `era: "core"`; viñetas y resumen en pasado (EN y ES, `es/cv.ts`).
  **Fecha de fin = oct 2026, confirmada por Doug** (antes nov por defecto; quitada la marca `CONFIRMAR DOUG`).
- `career.ts`: `currentExperience()` (exigía exactamente un rol abierto) pasa a `latestExperience()` (el de inicio más reciente;
  admite 0 o 1 abierto). Lo usan K1/K11, /about, meta de /about y /experience, `rolCorto`.
- Copy en pasado o «último rol»: `site.ts` (summary, summaryLong, seo.description), `perfil.ts` (bio, logro K11), `coverLetter.ts`,
  `profile.summary`, caso de Naowee (`work.ts`/`es/work.ts`: «Dirigí el producto y construí el prototipo»), K2 sub
  («Último rol: Naowee. Antes, Andes…» / «Last role: Naowee. Before that, Andes…»), K17 («Terminé mi proyecto en Naowee y puedo empezar de inmediato.»).
- JSON-LD: se quita `worksFor` (no hay rol abierto). Metadatos de /about: «Último rol: … ; antes, Andes… Disponible de inmediato.»;
  /experience sin repetir la última empresa en la lista.
- Datos de /about: «Actualmente» → «Último rol · Head of Product · Naowee». Rótulo «Disponible para» → «Disponibilidad».
- `site.headline` («Head of Product · Senior Product Designer…») se mantiene: es el título profesional, no «actual». Doug decide si lo cambia.
- PDFs del CV y la carta regenerados (`npm run cv:pdf`; en este contenedor con `CHROME=<chrome-headless-shell de /opt/pw-browsers>`,
  porque `/opt/pw-browsers/chromium` es un directorio).

## 2. Disponibilidad inmediata
- `decisiones.disponibilidad = "ambas"`; `estado.ambas` = «Disponible para empezar de inmediato» / «Available to start immediately».
- `availability`: status `available`, label «Disponible de inmediato» / «Available immediately», nota «… · roles y consultoría» / «… · roles and consulting».

## 3. Punto verde
`.estado::before`: núcleo `#4ade80`, anillo `#16a34a` (3,3:1 sobre la losa blanca de K2, 5,2:1 sobre la oscura), halo verde y pulso
suave solo con `prefers-reduced-motion: no-preference`. Tokens `--disp*` en `globals.css`. El chip «Hoy» de /experience (que reutiliza `.estado`)
conserva el punto láser rojo. El resto del láser, intacto.

## 4. Banderas
`components/sistema/Bandera.tsx`: SVG inline 16×12, esquinas 2 px por CSS, `aria-hidden`. Colombia (3 franjas) y EE. UU. (simplificada: 7 franjas rojas + cantón con 8 puntos).

## 5. Marquee «Dónde he trabajado»
Solo CSS (`transform` -50 %, dos copias, la segunda `aria-hidden`), pausa en hover/foco (el contenedor es `role="group"` con `tabindex=0`),
máscara de fundido, `prefers-reduced-motion` → una sola lista en rejilla (4 por fila, 2 en móvil), sin scroll horizontal (scrollWidth 375/1425).

### Fuente de cada logo
Pasados a `fill="currentColor"` sin fondos, optimizados con svgo (multipass), `viewBox` normalizado y revisados a mano
(sin `<script>`, `<foreignObject>`, `<image>`, `<use>` ni enlaces). Van inline como datos en `src/components/perfil/logosMarcas.ts`
(altura óptica por logo en `alto`; el CSS la escala ×0,78 en móvil) y los SVG limpios quedan en `g3/logos/`.

| Marca | Fuente | Notas |
|---|---|---|
| Mercadolibre | npm `@thesvg/icons` (MIT), `mercado-libre`, variante wordmark, vía registro npm | Emblema a una tinta: óvalo exterior + interior como aro (evenodd), manos y texto. Sin clipPath |
| Banco de Occidente | Wikimedia Commons, `File:Banco_de_Occidente_logo.svg` | Se quitan metadatos Inkscape/RDF y clipPath |
| Globant | Wikimedia Commons, `File:Globant_Logo.svg` | Wordmark con la flecha |
| Royal Caribbean | Wikimedia Commons, `File:Royal_Caribbean_logo_(2024).svg` | Corona y ancla + wordmark. El SVG de royalcaribbean.com es una imagen incrustada (74 KB, no vectorial), se descartó |
| Ideaware | `ideaware.co/images/iwlogo.svg` (el del sitio de la marca) | Solo el isotipo (no trae wordmark); el nombre va en `sr-only` |
| Naowee | **wordmark tipográfico** | naowee.com solo usa PNG/WebP para su logo; no hay SVG público |
| Aval Digital Labs | **wordmark tipográfico** | su sitio no responde desde el contenedor y no hay SVG en Commons ni en los repos de logos |
| Qrvey | **wordmark tipográfico** | qrvey.com solo publica PNG; los SVG de agregadores no son oficiales |

Los wordmarks (Geologica, misma tinta) se cambian por SVG añadiendo la entrada en `logosMarcas.ts` con su nombre. Los logos son marcas de sus
dueños; se usan solo para mostrar dónde ha trabajado Doug.

## Verificación
vitest 258/258; tsc y eslint limpios; build OK. Playwright (about, cv-b, tablero, a11y, seo, content, experience, `--trace off`): 183 pasan,
salvo las 2 pruebas de tablero.spec del dock (ver nota abajo), que resuelve el orquestador al integrar.
Capturas: `g3/datos-{1440,390}.png`, `g3/marcas-{1440,390}.png`.

## Nota: prueba sensible al hash de la compilación
`tablero.spec.ts` «390: … llegando por el dock desde /about» (y «Contacto del dock … 24 px») fallan con esta rama porque, tras pulsar «Contacto»
en /about, Next hace una navegación dura a `/` y se pierde el `#contact`. No depende del contenido: la base (46f77d9) pasa, pero la base
con **solo un comentario añadido a `perfil.css`** también falla (y /work y /experience pasan). Quitar la máscara, la animación o todo el CSS
del marquee no lo arregla. Es una fragilidad previa (probable carrera de prefetch/fetch RSC según los nombres de los chunks), no del copy
ni del marquee; conviene investigarla aparte.
