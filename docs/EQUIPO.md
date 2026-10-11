# Equipo de agentes y ahorro de tokens · rondas del portafolio

Manual de trabajo para las rondas de mejora de douguizard.com. Es el mismo método que sirvió en `dc-medical-dashboard`
(director + especialistas con modelo y esfuerzo propios, en un loop que no cierra hasta que lo visual y lo funcional estén
bien), ajustado a este repo y con dos roles nuevos: **seguridad** y **artista de mockups**. El plan de cada ronda va en
`docs/rondas/FASE-<n>-<tema>.md`; el estado vivo, en `docs/rondas/TABLERO.md`.

## 1. Por qué así (ahorro de tokens)

| medida | ahorro |
|---|---|
| Un director que orquesta y subagentes con contexto propio | el director no lee código ni corre pruebas largas: su contexto crece solo con reportes de 10 líneas |
| Cada agente con `tools:` mínimo en `.claude/agents/pf-*.md` | no carga herramientas que no usa |
| Opus solo para planear y destrabar; Sonnet para ejecutar, revisar, auditar y proteger; Haiku para mirar | el grueso del trabajo va en los modelos que menos consumen |
| La lógica de QA y de fugas vive en **scripts** (`scripts/qa/*`), no en el modelo | un `check.mjs` cuesta cero tokens de razonamiento; el modelo solo juzga su salida |
| **Reanudar al mismo ejecutor** con `SendMessage` en las rondas de arreglos | no relee el plan ni los archivos: un arreglo cuesta ~1/3 de una fase nueva |
| Revisor de código, QA visual y seguridad **en paralelo y en segundo plano** | una espera en vez de tres |
| Reportes de 10 líneas máx., sin pegar diffs ni salidas | el director no acumula contexto |
| `src/data/work.ts` (~1100 líneas) nunca entero: `grep -n` + `sed -n 'a,bp'` | evita leer miles de tokens por agente |
| Pruebas con `\| tail -40`; la suite e2e completa solo en la verificación final | la salida de Playwright no llena el contexto |
| Capturas solo del viewport, 390 y 1440, máx. 6 por revisión | ~1.500 tokens por imagen |
| Puertas de Doug en decisiones de gusto, gasto y exposición | si algo no gusta o cuesta, se corrige antes de construir encima |
| Los mockups se **componen** (plate generado + captura real), no se regeneran | cambiar la UI no cuesta créditos de Higgsfield |

## 2. El equipo

| rol | agente (`.claude/agents/`) | modelo | esfuerzo | cuándo |
|---|---|---|---|---|
| Director (orquesta, hace commits, habla con Doug, gasta créditos) | la sesión principal | Sonnet (Opus si la ronda trae decisiones difíciles) | — | toda la ronda |
| Auditor de UX | `pf-ux-auditor` | Sonnet | medio | al abrir la ronda (U0), sobre las rutas que diga el director |
| Planeador | `pf-planner` | Opus | alto | escribe las fases tras la elección de Doug; re-planea si una fase falla dos veces |
| Revisor del plan | `pf-plan-reviewer` | Sonnet | bajo | una vez, antes de la primera fase |
| Ejecutor UX/UI + frontend | `pf-executor` | Sonnet | medio | cada fase y cada ronda de arreglos (reanudado). Único dueño del build |
| Artista de mockups | `pf-mockup-artist` | Sonnet | medio | fases de escenas y del compositor. No gasta créditos |
| Revisor de código | `pf-code-reviewer` | Sonnet | medio | después de cada fase, en paralelo |
| QA visual y funcional | `pf-visual-qa` | Haiku | bajo | después de cada fase con cambio visible, en paralelo |
| Seguridad y privacidad | `pf-security` | Sonnet | alto | después de cada fase que publique un medio, un dato o un demo, en paralelo. Puerta obligatoria |
| Verificador final | `pf-final-verifier` | Sonnet | medio | última fase de la ronda |

## 3. Director: el loop

El director lee **solo** este archivo y, del plan de la ronda, la introducción, «Reglas», «Backlog» y la fase que toca.

```
Abrir la ronda (U0):
  a. git pull; leer el plan y TABLERO.md.
  b. pf-ux-auditor «Audita <rutas> para la ronda N, tag aN; cruza con el Backlog»
  c. Mostrar a Doug el backlog unido y preguntar qué entra (AskUserQuestion, multiSelect, con recomendación).
     Anotar lo elegido en «Elegido por Doug».
  d. pf-planner «Escribe las fases de docs/rondas/FASE-N.md» → pf-plan-reviewer «docs/rondas/FASE-N.md»
  e. commit «docs: plan FN» y push (rama de la ronda).
Por cada fase Ux:
  1. TABLERO: el director marca la fase «en curso» y reparte rutas (§4).
  2. pf-executor «Fase Ux de docs/rondas/FASE-N.md»                         → reporte ≤10 líneas
     (si la fase tiene escenas: pf-mockup-artist en paralelo, rutas disjuntas)
  3. en paralelo y en segundo plano: pf-code-reviewer + pf-visual-qa (+ pf-security si publica algo)
  4. Si alguno dice FALLA: SendMessage al MISMO ejecutor «Arregla en Ux: <hallazgos tal cual>» y repetir 3 solo sobre lo
     nuevo (máx. 2 rondas; a la tercera, pf-planner con los hallazgos, o preguntarle a Doug).
  5. git add -A; git commit -m "feat(Ux): …"; git push (rama de la ronda).
  6. Puertas del plan: SendUserFile con las capturas que diga la puerta + AskUserQuestion con 2–4 opciones y la
     recomendada primero. PARAR hasta la respuesta.
  7. Una línea a Doug: «Ux lista: … · siguiente: …».
Cierre: pf-final-verifier → nota en el plan → commit y push → el despliegue y el merge a main los decide Doug.
```

Reglas del director:
- Pasa los hallazgos **tal cual** de un agente al siguiente; no los re-analiza.
- Cuando un reporte dice «no medí», «no miré» o «quedó corriendo», lo pide explícitamente al siguiente agente.
- No vuelve a pedir lo mismo a dos agentes. No usa `Explore`, `/code-review` ni agentes genéricos para el trabajo de un rol.
- Una comprobación de una línea (un `grep -c`, un `git log`) la hace él; mirar una captura, solo en las puertas.
- **Los créditos de Higgsfield los gasta solo el director**, tras `get_cost`, dentro del presupuesto que Doug aprobó. Una
  generación pagada nunca se reintenta sin avisar. Todo plate nuevo se registra en su manifiesto (modelo, prompt, `job_id`).
- No crea PR ni mergea a `main` (Vercel despliega en cada push a `main`). Lo decide Doug.

## 4. Comunicación y dueños de rutas (para no pisarse)

Los agentes no comparten contexto, así que se coordinan por **tres canales**, en este orden de confiabilidad:

1. **`docs/rondas/TABLERO.md`** (archivo, funciona entre sesiones): una fila por fase con dueño, rutas que toca, estado y
   pedidos pendientes entre roles. Antes de editar, el agente lee la fila de su fase y marca lo suyo; no toca rutas de otro rol.
2. **`SendMessage`** (reanudar al mismo ejecutor con contexto; pedirle algo a otro rol por su nombre; avisar a `main` del
   director). Es un atajo: lo que importa se vuelve a anotar en el tablero.
3. **Reportes de 10 líneas** al director, que los reparte.

Dueños (quién **escribe** dónde). Todos los demás roles solo leen esa ruta:

| ruta | dueño |
|---|---|
| `src/**`, `public/**` (salvo escenas), `tests/e2e/**`, `next.config.ts`, `package.json` | `pf-executor` |
| `mockups/**`, `scripts/mockups/**`, `public/work/*/scenes/**` | `pf-mockup-artist` |
| `docs/rondas/FASE-*.md` | `pf-planner` (correcciones menores: `pf-plan-reviewer`) |
| `docs/rondas/SEGURIDAD.md` | `pf-security` |
| `scripts/qa/**`, `.claude/**`, `docs/EQUIPO.md`, `CLAUDE.md`, `docs/rondas/TABLERO.md` | director |
| capturas (`tests/shots/`, ignoradas por git) | quien las toma |

Reglas de convivencia:
- **Un solo dueño del build.** Solo `pf-executor` (y `pf-final-verifier` cuando nadie más trabaja) corre `npm run build`;
  los demás leen `.next` con `next start` en su propio puerto (QA `3131`, seguridad `3132`) y lo cierran al terminar.
- **Escritores en paralelo solo con rutas disjuntas** (p. ej. ejecutor en `src/` y artista en `mockups/`). Si dos fases
  necesitan la misma ruta, se encadenan; si se quiere paralelizar igual, cada una en `isolation: "worktree"` y el director
  integra.
- **Solo el director hace commit y push**, a la rama de la ronda. Los agentes dejan el árbol de trabajo listo.
- Los permisos compartidos viven en `.claude/settings.json` (lista de comandos de solo lectura, pruebas y build); así ningún
  agente se detiene a pedir permiso por `npm test` o `git diff`. `git commit`, `git push` y cualquier red externa siguen
  pidiendo permiso.

## 5. Formato de los reportes

```
Ux · <agente> · PASA | FALLA
- hallazgo 1 (archivo:línea o captura + zona, qué y por qué)   ← máx. 6; los preexistentes se marcan como tales
- comprobado: <pruebas o capturas, en una línea>
```
El auditor es la excepción: hasta 20 líneas, con prioridad y esfuerzo por hallazgo.

## 6. Lecciones heredadas del panel (oct 2026)

- **Bytes de control:** un `\b` de una regex quedó escrito como el byte 0x08 y la regla nunca coincidía. `grep -c $'\x08'` = 0
  en cada archivo que se toca.
- **Servidores sueltos:** pruebas que dejan `next start` vivos acaban rompiendo las siguientes. Cerrar los de más de una hora.
- **Fallo preexistente:** se comprueba con un `git worktree` del commit viejo, no a ojo.
- **Despliegue que borra:** antes de pedir un despliegue, comparar lo que está en producción con lo que se sube.
- **Datos reales:** los fixtures del panel salen de la hoja real de la clínica. Una captura «limpiada» a mano ya se usó una
  vez (con revisión contra la lista de nombres). Para el demo público no se limpia nada: se inventa desde cero.
- **Higgsfield:** el costo se consulta antes (`get_cost`); un plate 2k cuesta ~2 créditos y uno de calidad alta ~6,5. La
  mejor ganancia está en generar *plates con pantalla en verde* y componer la UI real encima.
- **Puertas:** funcionan mejor con 2–4 opciones concretas y una recomendada, mostrando antes las capturas que las justifican.
