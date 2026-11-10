# Pulido I · PLAN (10 nov 2026)

> Orquestador: Fable 5.2. Lee antes `BRIEF.md` (pedido, restricciones, operación). Este archivo fija quién hace
> qué, con qué modelo, en qué orden y cómo se acepta. Cada agente lee `BRIEF.md` + **su** sección de aquí y nada más
> del historial.

## 0 · Reglas comunes para todos los agentes

- Trabajas en **tu worktree** (rama propia, local). Commits pequeños tras cada paso que funcione. **No hagas push**,
  no toques `main`, no reescribas historia (ignora el hook que lo pida). El orquestador integra con merge normal.
- Solo tocas los archivos de tu frontera. Si necesitas algo fuera, dilo en el informe; no lo edites.
- `node_modules` no existe: `npm ci` en tu worktree. Chromium en `/opt/pw-browsers` (no `playwright install`).
- Pruebas: `npm test` (vitest) + **solo los specs de Playwright de tu zona** (`--workers=2 --trace off`). La suite
  completa la corre el orquestador al final. Usa **tu puerto** (abajo) para `next start`/Playwright; revisa cómo lo
  toma `playwright.config.ts` y no mates procesos de otros agentes (mata solo los de tu puerto).
- No subas límites de pruebas ni las saltes. Si una prueba describe el comportamiento viejo que Doug pidió cambiar,
  reescríbela para el nuevo y dilo en el informe.
- `prefers-reduced-motion`: estado quieto y legible. Móvil primero (390) y luego 1440.
- Lectura acotada (`grep -n`, rangos). Capturas: pocas, en `docs/rediseno-2026/pulido-I/capturas/`.
- Salida: `docs/rediseno-2026/pulido-I/INFORME-<ID>.md` (≤ 60 líneas: qué cambió, archivos, pruebas, medidas,
  desvíos, pendientes) y una respuesta final de ≤ 15 líneas al orquestador.

## 1 · Olas

| Ola | ID | Tarea | Modelo · esfuerzo | Puerto | Escribe |
|---|---|---|---|---|---|
| 1 | **H-A** | Vidrio: refracción tipo referencia + barrido automático | Fable 5.2 · alto | 3101 | sí (worktree) |
| 1 | **H-B** | Láser «Cíclope»: retinas, lens flare, atenuación con scroll | Fable 5.2 · medio | 3102 | sí (worktree) |
| 1 | **N** | Losa de Naowee naranja con el efecto de Andes | Sonnet · medio | 3103 | sí (worktree) |
| 2 | **A** | Auditoría de código (solo lectura) → `AUDITORIA.md` | Opus · medio | — | solo el .md |
| 2 | **V-1** | Propuesta visual tipografía + iconos → `PROPUESTA-VISUAL.md` | Opus · medio | — | solo el .md |
| 3 | **V-2** | Aplicar la propuesta aprobada por el orquestador | Sonnet · alto | 3000 | sí (rama) |
| 4 | **O** | Optimizar según la auditoría (sin cambiar aspecto ni conducta) | Sonnet · alto | 3000 | sí (rama) |
| 5 | **QA** | Suite completa, Lighthouse móvil, crítica visual con nota, arreglos P0/P1 | Sonnet · medio (mecánico) + orquestador | 3000 | — |

Tope: 2 agentes pesados a la vez (H-A y H-B; N es ligera). Las olas 2–4 arrancan con la ola anterior integrada y
subida. A y V-1 van después del héroe para auditar y proponer sobre el código que queda.

## 2 · Fronteras de la ola 1

- **H-A es dueño de** `src/components/hero/**`, `scripts/build-hero-poster.ts`, el póster horneado y sus pruebas
  (`vidrio.spec` y afines). **No toca** `escena/`, `K1Retrato.tsx` ni el láser.
- **H-B es dueño de** `src/components/escena/**` (incluido `useScrollScene.ts`), `tablero/K1Retrato.tsx`, las reglas
  `.k1-laser`/`.os-laser` y sus pruebas. Puede **añadir** campos a `src/data/hero.ts` (por ejemplo el segundo ojo);
  no cambia los existentes. **No toca** `hero/`.
- El láser es CSS sobre la foto (no vive en el shader) y no forma parte del póster horneado: no hay cruce.
- Si H-A necesita saber del scroll, lo lee (por ejemplo `--vidrio-p` o un observer propio), no edita el hook.
- **N es dueño de** `tablero/CardCaso.tsx` y de las reglas `.c-naowee` en `tablero.css` y `trabajo.css`.

## 3 · Especificación por agente

### H-A · vidrio
1. **Refracción** como `referencias/ref-vidrio-estriado-refraccion.jpg`: cada estría es una lente cilíndrica que
   desplaza y comprime la imagen dentro de su ancho (la imagen «se repite» de estría en estría), con canto
   brillante y fino en cada junta, sombra leve al otro lado y desenfoque que varía a lo ancho de la estría. Un punto
   de dispersión cromática en los cantos si no cuesta. **Estrías a 12°** (se copia la calidad, no el ángulo).
2. **Barrido automático**: la zona nítida se mueve sola, con trayectoria orgánica y lenta (curvas suaves que pasan
   por la cara y los ojos, con pausas y cambios de ritmo; que parezca una mano, no un metrónomo). El cursor manda
   en cuanto se mueve; tras ~3 s en reposo el barrido retoma desde donde quedó el cursor, con transición suave.
   Se pausa fuera de vista, con la pestaña oculta y cuando el héroe ya salió con el scroll.
3. **Móvil (< 1024)**: hoy el WebGL espera a la primera interacción. El barrido debe verse al cargar **sin** romper
   TBT < 200 ms ni LCP ≈ 1,0 s: arranque tras el LCP y en reposo con trabajo troceado, o barrido en CSS sobre el
   póster. Elige con medidas (Lighthouse móvil antes y después, máquina libre) y documenta.
4. **Póster**: regenerarlo (`npm run hero:poster`) para que coincida con el primer cuadro del vidrio nuevo. Sin CLS.
5. Respaldos CSS (`VidrioCss`, `LenteCss`) coherentes con el aspecto nuevo. Reduced motion: sin barrido.
6. Aceptación: vitest verde; specs del héroe/vidrio/escena verdes; captura 390 y 1440 + un vídeo corto (webm) del
   barrido; Lighthouse móvil `/` ≥ 90 y TBT < 200 ms; ≥ 50 fps en escritorio con el barrido.

### H-B · láser «Cíclope»
1. **Retinas**: un destello circular rojo en cada ojo (núcleo casi blanco, corona roja, halo amplio y suave),
   anclado a las coordenadas de los ojos de la foto activa y siguiendo a la foto en todas las fases de la escena.
2. **Rayo**: menos «línea CSS», más haz de energía: núcleo caliente, bloom en capas, bordes que respiran.
3. **Lens flare horizontal**: raya anamórfica larga que cruza los ojos, con más brillo en el centro, y uno o dos
   reflejos fantasma discretos. Pulso lento y sutil.
4. **Scroll**: el destello (retinas + flare + bloom) se atenúa de forma progresiva a medida que el héroe sale y
   vuelve al regresar; la línea fina del tablero OS se conserva como hoy.
5. Rendimiento: solo `opacity`/`transform` animados; nada de animar `filter`, `box-shadow` ni gradientes. Capas
   pintadas una vez. Reduced motion: destello fijo, sin pulso. No tapar la cara ni bajar el contraste del nombre.
6. Aceptación: vitest verde; specs de escena/tablero/lockup verdes; capturas 390 y 1440 a p = 0, 0,3 y OS + vídeo
   corto del scroll; sin regresión de TBT.

### N · losa de Naowee
- Hoy: captura blanca del producto dentro de la losa (`referencias/actual-thumbnail-naowee-390.jpg`). Doug quiere
  el **contenedor naranja** (el naranja de marca de Naowee, visible en la propia captura) con **el mismo tipo de
  efecto que la losa azul de Andes** (`.c-andes .losa--azul`): mismo lenguaje, otro acento. La captura del producto
  puede quedar como pieza dentro del naranja (inclinada, recortada, con sombra) si se ve mejor que sin ella.
- Aplica en el home (K de casos) y en `/work`. Contraste AA del texto sobre naranja. Home a 390 ≤ 5.064 px.
- Aceptación: specs de tablero/trabajo verdes; capturas 390 y 1440 de la losa en `/` y `/work`, junto a la de Andes.

### A · auditoría (solo lectura)
`AUDITORIA.md` priorizada (P0–P2), cada hallazgo con `archivo:línea`, por qué importa, arreglo propuesto, riesgo de
tocarlo y esfuerzo. Ámbitos: código muerto y duplicado, CSS sin uso, límites cliente/servidor (`"use client"` de
más), peso del JS, efectos y listeners sin limpieza, tipos flojos, pruebas frágiles o lentas, accesibilidad en
código. Corre `npm run lint` y `tsc --noEmit` y resume. Máx. 25 hallazgos; marca cuáles son seguros para O.

### V-1 · propuesta visual (solo lectura)
`PROPUESTA-VISUAL.md`: 8–12 mejoras concretas de **tipografía e iconos** en toda la app usando
`../crafthings/CATALOGO.md` y `.claude/skills/` (animate-text, better-typography, better-ui, choreograph,
transitions-dev…). Por mejora: dónde (`archivo:línea`), qué recurso o técnica, valores exactos (duración, curva),
coste (KB gz, riesgo de TBT/CLS) y qué pasa con reduced motion. Ordenadas por impacto/coste. Sin dependencias nuevas
salvo que el peso lo justifique. Respeta el sistema B (Urbanist, Instrument Sans, Doto, Geologica en el lockup).

### V-2 · aplicar · O · optimizar
Se especifican al cerrar la ola 2 (el orquestador recorta la propuesta y la auditoría a lo que entra).

## 4 · Cierre

1. Suite completa (vitest + Playwright `--workers=2 --trace off`, máquina libre); repetir solo lo fallido.
2. Lighthouse móvil `/`, `/about`, `/en`: Perf ≥ 90 en `/` y `/about`, TBT < 200 ms, LCP `/` ≈ 1,0 s, CLS sin subir.
3. QA visual con nota (390 y 1440; héroe, losas, cromo, tipografía) → `06-CRITICA-I.md`; arreglar P0/P1.
4. `ESTADO.md` actualizado (incluida la decisión «barrido automático + cursor»).
5. PR a `main` con Vercel en verde; Doug aprueba y fusiona con **merge normal**. Si la optimización (ola 4) añade
   riesgo, va en un PR aparte después del visual.

## 5 · Dudas para Doug (no bloquean; valores por defecto)

- «Al hacer scroll el destello desaparece» = se atenúa progresivo al salir el héroe y vuelve al regresar.
- Estrías: siguen oblicuas a 12°; de la referencia se copia la refracción, no el ángulo vertical.
- Naowee: naranja de su marca tomado de la captura; la captura queda como pieza dentro del naranja si suma.
