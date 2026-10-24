# Hyperproof · revisión de portafolio — guía para Doug

Lunes 26 de octubre de 2026, 2:00 p. m. · 60 minutos · equipo de diseño de Hyperproof.

## Abrir la presentación

1. Opcional, una sola vez: en PowerShell, dentro de `presentations\hyperproof`, corre
   `powershell -ExecutionPolicy Bypass -File fetch-mockups.ps1` (descarga los 9 mockups para que funcione sin internet).
   Sin este paso el deck igual los carga de internet.
   Si no lo corres, el deck los carga del CDN de Higgsfield; sin internet muestra las capturas planas.
2. Abre `presentations/hyperproof/index.html` en Chrome (doble clic). Pulsa `F` para pantalla completa.
3. Pulsa `P`: se abre la **ventana de presentador** con tus notas en inglés sencillo, la siguiente diapositiva y un cronómetro.
   Comparte en Meet/Zoom **solo la pestaña o ventana del deck**, no la pantalla entera, así no ven tus notas.

| Tecla | Acción |
|---|---|
| → / espacio / Enter | Siguiente |
| ← | Anterior |
| `P` | Ventana de presentador (notas, siguiente, cronómetro; `R` reinicia el tiempo) |
| `N` | Notas sobre el deck (solo para ensayar; no las muestres en la llamada) |
| `O` | Vista de todas las diapositivas: úsala en las preguntas para saltar a un caso |
| `C` | Oculta la barra inferior y el progreso |
| `F` | Pantalla completa |

**Versión en español:** `index.es.html` (botón `ES`/`EN` abajo a la derecha; conserva la diapositiva en la que estás).
Es idéntica a la inglesa, para leerla y entenderla antes de presentar.

**Teleprompter:** `teleprompter.html` (el guion completo con conectores, en inglés con traducción al español).
Ábrelo en otra pantalla o en el iPad. Espacio inicia/pausa, ↑↓ cambia la velocidad, ←→ salta de diapositiva, `T` oculta el español.
El texto vive en `GUION.md`; si lo editas, corre `python presentations\hyperproof\build-teleprompter.py`.

## La idea que deben recordar

> In complex products, the states and the roles are the product. I design them first, then I prove them in a working prototype.

## Plan de tiempo (60 min)

| Bloque | Diapositivas | Min |
|---|---|---|
| Intro: portada, hola, carrera, el hilo | 1–4 | 6 |
| Proceso y requisitos | 5–6 | 5 |
| Naowee | 7–14 | 11 |
| Banco de Occidente | 15–21 | 8 |
| DC Medical + demo en vivo | 22–30 | 9 |
| Sistemas, herramientas, cierre | 31–34 | 6 |
| Preguntas | — | 15 |

**Si te interrumpen con preguntas**, respóndelas ahí: es la mejor señal. Corta en este orden:
herramientas (31–32 en 1 min) → Occidente a 5 min (salta 18) → DC a 6 min (salta 28).
Nunca cortes «Your world is already in my work» (4) ni «What I would bring» (33).

## Transiciones (dilas tal cual)

- Into Naowee: *"The biggest rules problem I work on is in government: let me show you Naowee."*
- Out of Naowee: *"Naowee has 15 roles. The next case is about scale: a bank with many teams."*
- Into DC: *"The bank taught me governance. Now a small product where I did everything myself."*
- Out of DC: *"All three cases depend on a design system, so let me talk about that."*

## Antes de la llamada

- [ ] Correr `fetch-mockups.sh` y abrir el deck: revisa que se vean los dispositivos (portada, 11, 13, 15, 19, 22, 25, 27, 28).
- [ ] Demo de DC lista: en `dc-medical-dashboard`, `python tools/demo_server.py 8787` → http://localhost:8787 (editora) y
      http://localhost:8787/?rol=lector (lector). Ten las dos pestañas abiertas. No inicies sesión en el panel real durante la llamada.
- [ ] Abre en otra pestaña el sistema de diseño de Naowee: https://naowee-tech.github.io/design-naowee-design-system/
- [ ] Prueba compartir pestaña + ventana de presentador 10 minutos antes.
- [ ] Llena los `[DOUG]` de abajo.

## Pendientes que solo tú puedes llenar `[DOUG]`

1. Diapositiva 2 (notas): un detalle personal — qué te gusta fuera del trabajo.
2. Diapositiva 30 (notas): cuánto tarda hoy encontrar el saldo de una paciente (antes eran ~10 min).
3. Preguntas 3, 4, 6, 8, 9, 11 y 12 abajo: una historia o dato propio en cada una.

Lo demás sale de tu sitio (`src/data/work.ts`, `cv.ts`, `testimonials.ts`); no hay cifras inventadas.
Los números de la diapositiva de saldos (26) están marcados como ilustrativos.

## Banco de preguntas (respuestas en inglés sencillo)

1. **Walk me through your process.**
   I start from the real work: the files and the exceptions. Then I map states and roles, before any screen. Then a prototype with real roles, then the system, then I ship a safe version and listen. (Naowee, DC)

2. **How do you gather requirements from non-designers?**
   I ask for their real files: the forms, the spreadsheets, the emails. At Naowee, analysts sign off story by story on the running prototype. The demo is the requirement. (Naowee)

3. **How do you research when you can't reach users?**
   I use the artifacts: procedures, documents and real data show the process. At the bank we did discovery, competitor research and user tests of prototypes, with several rounds for registration. At DC the user works next to me. `[DOUG: a case where you had no access to users]`

4. **How do you measure success?**
   With clear counts: 30 procedures digitized, 130+ screens on one system, 12+ squads aligned. At DC, finding what a patient owed took ten minutes; now it is on the case, beside the next step. `[DOUG: one usage or satisfaction metric]`

5. **How do you govern a design system?**
   One owner approves additions, removals and patterns. At the bank I did that for 12+ squads. At Naowee the rule is: no custom component, extend a shared one; anything off in review is a bug. (Velocity, Naowee, Andes)

6. **What do you do when you disagree with a PM or an engineer?**
   I make the disagreement concrete with a prototype, while it is still cheap. At Mercadolibre we agreed one component API across iOS, Android and Web. `[DOUG: a short real story]`

7. **How do you design roles and permissions?**
   I list roles and states first, then the actions. At Naowee: 15 roles and cascading approval, from the Ministry to the club. At DC: permissions by section of the app and action, with presets; you never see a button you can't use, and the server checks too. (Naowee, DC)

8. **How do you handle dense tables and data?**
   I put the next step beside the data and use honest states, like "unverified". Counters at the top answer "where is the problem". On a phone, tables become cards. `[DOUG: your patterns for filters, sorting and bulk actions]`

9. **What about accessibility?**
   At DC, the city colors were checked for color blindness, and color never works alone: the name sits beside the dot. Tap targets are at least 44 px. `[DOUG: WCAG level and practice at Mercadolibre or the bank]`

10. **How do you use AI in your work?**
    I prototype in code with Claude Code and Cursor. At Mercadolibre we used AI audits to catch drift in Figma before release. In products, AI drafts and a person confirms: at DC, the voice note fills the form, but nothing is saved until someone checks it.

11. **How do you hand off to engineering?**
    The prototype and the design system are the contract: engineering gets a resolved target, not a spec. At DC the business rules are tested functions. `[DOUG: tokens, Storybook, annotations you use]`

12. **How do you work with a remote US team?**
    I worked with US product and engineering at Globant (Royal Caribbean) and remote-first with US clients at Ideaware. I am in UTC−5, so we share most of the day. I write clearly and share prototypes, so decisions are easy to review async. `[DOUG: overlap hours and async habits]`

## Material de origen

- Mockups: generados en Higgsfield (escena con pantalla verde) y compuestos con las capturas reales en perspectiva; están en tu cuenta de Higgsfield.
- Textos de los casos: `src/data/work.ts`; testimonios: `src/data/testimonials.ts`.
- Borradores completos del equipo (storytelling y UX writing) usados para este deck: resumidos aquí y en las notas de cada diapositiva.
