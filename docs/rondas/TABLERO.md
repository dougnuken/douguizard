# Tablero de coordinación

Lo mantiene el director. Cada agente lee la fila de su fase antes de editar, marca lo suyo y no toca rutas de otro rol
(`docs/EQUIPO.md` §4). Es el canal que sobrevive entre sesiones; `SendMessage` es solo un atajo.

## Build y servidores

| recurso | dueño | estado |
|---|---|---|
| `.next` (build) | pf-executor | sin construir en esta sesión |
| `next start :3131` (QA, e2e) | pf-visual-qa / Playwright | cerrado |
| `next start :3132` (seguridad) | pf-security | cerrado |

## Fases

| fase | qué | dueño | rutas que escribe | estado |
|---|---|---|---|---|
| F0 | Equipo, protocolo, plan, scripts de QA (`shots`, `check`, `leak-scan`) | director | `.claude/**`, `docs/**`, `scripts/qa/**`, `CLAUDE.md` | **hecha** (scripts probados contra el build de `1e097a4`) |
| U0 | Auditoría de la primera impresión (home + caso DC) | pf-ux-auditor | — (solo lee) | **hecha** → Backlog B1–B8 en `FASE-1-DC.md` |
| V0 | Viabilidad del demo (lee `dc-medical-dashboard`, solo lectura) | analista (general-purpose) | — (solo lee) | **hecha** → enfoque (a): paquete estático con interceptor, datos inventados |
| P1 | Plan de fases U1–U6 (Opus, esfuerzo alto) | pf-planner | `docs/rondas/FASE-1-DC.md` | **en curso** |
| U2a | Compositor del kit de mockups + plate sintético + pruebas | pf-mockup-artist | `mockups/**`, `scripts/mockups/**`, `public/work/dc-medical/scenes/**`, `src/data/scenes.generated.json`, líneas `mockups:*` de `package.json` | **en curso** (rutas disjuntas del resto) |
| U1 | DC Medical primero + enlaces a la web y al panel | pf-executor | `src/data/**`, `src/components/**`, `tests/e2e/matrix.ts` | pendiente |
| U2 | Kit de mockups (manifiestos + compositor) y componente de escenas | pf-mockup-artist + pf-executor | `mockups/**`, `scripts/mockups/**` / `src/components/case/**` | pendiente |
| U3 | Escenas luxury con Higgsfield | director (gasto) + pf-mockup-artist | `mockups/plates/**`, `public/work/dc-medical/scenes/**` | **bloqueada: créditos** |
| U4 | Panel demo con datos sintéticos y login falso | por definir | por definir | **bloqueada: alojamiento** |
| U5 | Seguridad de lo publicado | pf-security | `docs/rondas/SEGURIDAD.md` | pendiente |
| U6 | Cierre | pf-final-verifier | — (solo lee) | pendiente |

## Notas operativas

- Claude Code carga `.claude/agents/*.md` al **iniciar** la sesión: los `pf-*` creados en la sesión que los escribió no existen
  como tipo hasta la siguiente. Mientras tanto se lanzan como `general-purpose` con la orden de leer su archivo de rol, con
  modelo y esfuerzo fijados en la llamada. En una sesión nueva se llaman por su nombre.
- `src/data/scenes.generated.json` lo escribe `scripts/mockups/compose.py` (dueño: pf-mockup-artist); el frontend solo lo importa.

## Pedidos entre roles

- **U5 (seguridad) — pendiente de cerrar:** `public/work/dc-medical/nota-de-voz-poster.jpg` (ya publicado) muestra un formulario de
  nueva paciente con un nombre y un teléfono visibles que parecen inventados. Cruzar **todos** los medios publicados de DC
  (galería, póster y fotogramas del video, `-v2`) contra la lista de nombres reales armada fuera del repo, y dejar el resultado en
  `docs/rondas/SEGURIDAD.md`. Origen: reporte de pf-security en U2a.

## Decisiones pendientes de Doug

1. **Créditos de Higgsfield:** la cuenta tiene 3,3 (plan free). Un plate 2k cuesta ~2. Para ~6 escenas de DC hacen falta ~15–20.
2. **Dónde vive el demo del panel** y si puedo escribir en `dc-medical-dashboard` (ver `FASE-1-DC.md`, Puerta B).
3. **Ruflo:** ¿complemento a evaluar o se queda fuera? (ver mensaje del director).
