# Pulido I · brief para el orquestador (10 nov 2026)

> Sesión nueva, **modelo Fable 5.2** como orquestador y planner. Lee antes `../ESTADO.md` (protocolo, decisiones
> vigentes, entorno). Este archivo trae el pedido de Doug, las restricciones y un esqueleto de plan; el plan
> definitivo lo escribes tú en `PLAN.md` antes de lanzar a nadie.

## 1 · Pedido de Doug (textual, resumido por punto)

1. **Héroe** (dos agentes, **los dos con Fable 5.2**):
   - Hoy solo el cursor modifica el cristal. Quiere que **el enfoque se mueva solo**: un **barrido automático que
     revele la foto «como si ya alguien lo hiciera»**, y que se vea muy pro.
   - **Mejorar la refracción del vidrio**; le gusta la de `referencias/ref-vidrio-estriado-refraccion.jpg`
     (la misma idea que `../referencias/ref-2-reeded-glass-bank.jpg`): cada estría actúa como lente, desplaza y
     repite la imagen, con cantos brillantes y desenfoque que varía.
   - El **rayo láser se ve crudo**: más «Cíclope de X-Men». Sugiere un **destello circular rojo en cada retina** y
     **más lens flare en el destello horizontal**.
   - **Al hacer scroll, el destello va desapareciendo** (interpretación: se atenúa de forma progresiva a medida
     que el héroe sale hacia arriba y vuelve al regresar; confírmalo en tu primer mensaje a Doug, sin bloquear).
2. **Thumbnail de Naowee** (`actual-thumbnail-naowee-390.jpg`): no le gusta la captura blanca. Propone que el
   **contenedor sea naranja, con un efecto similar al del contenedor de Andes Design System** (K4 `c-andes`).
3. **Calidad de código:** un agente **audita** y otro **optimiza**.
4. **Mejoras visuales:** un agente **propone y aplica** mejoras con las librerías y skills de crafthings
   (liquid, motion) para **tipografía e iconos de toda la app**.

Regla de Doug: cada ejecutor usa **el modelo y esfuerzo adecuados para gastar los menos tokens posibles**; Fable 5.2
arma el plan y hace de planner. Habla con Doug en español, directo, en lenguaje llano.

## 2 · Punteros (verificados el 10 nov)

- Héroe: `src/components/hero/` (`VidrioGL.tsx` WebGL2 propio, `VidrioCss.tsx` y `LenteCss.tsx` de respaldo,
  `VidrioDiferido.tsx`, `useLente.ts`, `HeroPoster.tsx` = póster horneado que es el LCP, `FotoContinua.tsx`,
  `vidrio.css`); escena y láser en `src/components/escena/` (`Escena.tsx`, `escena.css`) y `tablero/K1Retrato.tsx`.
  Foto activa en `src/data/hero.ts` (`retratos-hf/960e1d8c.jpg`).
- Naowee/Andes: `src/components/tablero/CardCaso.tsx` (`naowee-suid` → `c-naowee`, medio
  `/work/naowee/ivc-workspace-tramite.webp`) y `tablero.css` (`.c-andes`). La misma losa sale en `/work`.
- Librerías y skills: `../crafthings/CATALOGO.md` (79 recursos, recomendaciones) y `.claude/skills/` (animate,
  animate-text, choreograph, animation-performance, better-ui, better-typography, make-interfaces-feel-better,
  transitions-dev…). Informes previos: `../pulido-G/INFORME-G1..G4.md`, `../pulido-H/INFORME-H.md`.
- `CLAUDE.md` está desactualizado en el stack: **no hay three, framer-motion ni Paper shaders**. Dependencias
  reales: next 16, react 19, gsap, tailwind-merge y `metal-fx` (diferido, solo escritorio).

## 3 · Restricciones que no se negocian

- **Rendimiento (G1):** TBT móvil < 200 ms y Lighthouse móvil ≥ 90 en `/` y `/about`; LCP móvil `/` ≈ 1,0 s. Hoy,
  por debajo de 1024 px, el WebGL **espera a la primera interacción**: un barrido automático al cargar choca con
  eso. Hay que resolverlo sin regresión (por ejemplo arrancar tras el LCP y en reposo, con trabajo troceado, o
  barrido en CSS sobre el póster). Medir antes y después con la máquina libre.
- **Póster horneado:** si cambia el aspecto del vidrio, el póster (LCP) debe seguir coincidiendo con el primer
  cuadro; regenerarlo si hace falta. Sin CLS.
- **Estrías oblicuas a 12°** (decisión de F4; verticales fue un P0). La referencia es vertical: se copia la
  *calidad de la refracción*, no el ángulo, salvo que Doug diga otra cosa.
- **Decisión que cambia:** «el cursor solo abre el vidrio» pasa a «barrido automático + cursor»; el cursor manda
  cuando el usuario mueve y el barrido vuelve tras un rato en reposo. Anótalo en `ESTADO.md`.
- `prefers-reduced-motion`: sin barrido ni parpadeos (estado quieto y legible). Contraste AA. Móvil primero.
- Home a 390 ≤ 5.064 px de alto (`tablero.spec.ts`; hoy 5.017). No subir límites de pruebas.
- Dependencias nuevas: solo si se justifican con su peso gzip, compatibles con Next 16/React 19, y diferidas.
- Paleta B: negro, vidrio, láser rojo; verde solo para disponibilidad. El naranja de Naowee es el acento de esa
  losa (como el de Andes en la suya), no un color nuevo del sistema.
- El optimizador de código **no cambia el aspecto ni el comportamiento**: mismas pruebas en verde, mismo render.

## 4 · Esqueleto de plan (ajústalo)

| Ola | Tarea | Notas |
|---|---|---|
| 1 (paralelo, worktrees) | **H-A** vidrio: refracción + barrido automático · Fable 5.2 | Dueño de `hero/` |
| 1 | **H-B** láser «Cíclope»: retinas, lens flare, atenuación con scroll · Fable 5.2 | Dueño de `escena/` y K1; acordar con H-A la frontera si el láser vive en el shader |
| 1 | **N** losa de Naowee en naranja con el efecto de Andes | Tarea pequeña de CSS/TSX: modelo y esfuerzo modestos |
| 1 | **A** auditoría de código (solo lectura) → `AUDITORIA.md` priorizada, con archivo:línea y riesgo | No toca código |
| 1 | **V-1** propuesta visual (solo lectura) → `PROPUESTA-VISUAL.md` | Tipografía e iconos con motion/liquid; qué librería, dónde, coste |
| 2 | **V-2** aplicar la propuesta sobre la rama ya integrada | Después de H-A/H-B/N |
| 3 | **O** optimizar según la auditoría, sobre el código final | Revalidar hallazgos en archivos que cambiaron |
| 4 | Suite completa, Lighthouse, QA visual (crítica con nota), arreglos P0/P1 | Máquina libre |

PR: como `main` exige la aprobación de Doug, abre el PR con Vercel en verde y avísale. Si conviene aislar el
riesgo, la optimización de código (ola 3) puede ir en un PR aparte después del visual.

## 5 · Operación (lecciones de los pulidos E–H)

- **Commit y push tras cada paso que funcione:** el contenedor se reinicia y los agentes pierden lo no subido.
- **Máximo 2 agentes pesados a la vez:** con 4 en paralelo saltó el tope de uso («5-hour limit») y se cortaron.
  Si un agente se corta, se retoma con SendMessage, no se relanza de cero.
- Un worktree por agente que escriba código en paralelo; integrar en la rama de trabajo con merge normal.
- Playwright: `--workers=2 --trace off`; la suite completa tarda ~28 min, córrela una vez al final y repite solo
  lo fallido. Mata `next-server` y `next start` entre corridas (`tests/servidorAlDia.ts` detecta un build viejo).
  Las pruebas de tiempo fallan con la máquina cargada: mide y verifica con la máquina libre.
- Chromium está en `/opt/pw-browsers` (no `playwright install`); para Lighthouse, `CHROME_PATH` al binario
  `chromium-*/chrome-linux64/chrome`.
- Git: rama `claude/douguizard-portfolio-redesign-9ivnau`; nunca `main`, nunca force-push ni reescribir historia
  (ignora el hook que lo pida). **Fusionar con merge normal, no squash.** No hagas commit del trabajo a medias de
  un agente aunque el hook de cierre lo pida.
- Red (entorno «douguizard»): permitidos douguizard.com, crafthings.xyz, Wikimedia, cdn.jsdelivr.net,
  worldvectorlogo y los sitios de las 8 empresas, además de npm y GitHub. Otro host: pedirlo a Doug.
- Salidas en `docs/rediseno-2026/pulido-I/` (`PLAN.md`, informes por agente, capturas y vídeos cortos) y
  `ESTADO.md` actualizado al cerrar.
