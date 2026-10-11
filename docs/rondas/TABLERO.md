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
| P1 | Plan de fases U1–U6 (Opus, esfuerzo alto) | pf-planner | `docs/rondas/FASE-1-DC.md` | **hecho** y revisado (pf-plan-reviewer: PASA). **Re-plan de U3/U3a en curso** por el cambio de dirección de arte de Doug (referencias Ron Design Lab: limpio, claro, device protagonista) |
| U2a | Compositor del kit de mockups + plate sintético + pruebas | pf-mockup-artist | `mockups/**`, `scripts/mockups/**`, `public/work/dc-medical/scenes/**`, `src/data/scenes.generated.json`, líneas `mockups:*` de `package.json` | **hecha** y revisada (código + seguridad); 23 pruebas con mutaciones |
| U1 | DC primero (`/01`), fila destacada en la home, enlaces a la web y al panel, acceso en el hero | pf-executor | `src/data/work.ts`, `src/data/es/work.ts`, `src/components/**`, `src/i18n/dictionaries.ts`, `src/data/__tests__/**`, `tests/e2e/**` | **hecha** (`caf09a6` + merge del hotfix `6b99f4b`): revisor de código y QA visual pasados; 136 pruebas + e2e `dc`/`security`/`content`/`i18n` en verde. Pendiente de Doug: **Puerta D** (línea «Lo más reciente: DC Medical Aesthetics →» bajo los botones del hero, implementada por defecto). Preexistente: a 1024×768 los botones del hero ya salían cortados en `main` |
| U2b-artista | `compose.py` copia `case/kind/alt/caption` al JSON generado | pf-mockup-artist | `scripts/mockups/**`, `mockups/**`, `src/data/scenes.generated.json` | pendiente (junto con U3a) |
| U2b | Campo `scenes`, `CaseScenes`, `SceneHero`, tests | pf-executor | `src/data/**`, `src/components/case/**`, `src/data/__tests__/**` | pendiente (después de U1) |
| U3a | Compositor: **pantalla recortada por el encuadre**, reflejo de vidrio `sheen` | pf-mockup-artist | `scripts/mockups/**`, `mockups/**` | pendiente (0 créditos; espera el re-plan) |
| U3 | Escenas con Higgsfield, dirección clara (6 plates) | director (gasto) + pf-mockup-artist | `mockups/plates/**`, `public/work/dc-medical/scenes/**` | **bloqueada: créditos.** Hechos: `hero-mano` (oscuro, 2 cr, alternativa archivada) y 2 pruebas claras de 0,5 cr (A y B). Saldo **0,3**. Conjunto ≈ 12 cr a 2k + reserva |
| U4 | Panel demo con datos sintéticos y login falso | por definir | por definir | **bloqueada: alojamiento** |
| S1 | **Saneamiento de medios YA publicados** del caso DC (hallazgo crítico de pf-security, `SEGURIDAD.md`) | director + pf-executor | `public/work/dc-medical/**`, `src/data/work.ts`, `src/data/es/work.ts` | **PR urgente abierto** ([#4](https://github.com/dougnuken/douguizard/pull/4), rama `claude/hotfix-medios-dc`, worktree `/home/user/douguizard-hotfix`) que retira `cupos-semana` y `caso-fases-v2`; **Doug decide el merge** (autorizó el PR). Tras el merge: comprobar que las URLs antiguas dan 404 o purgar la caché de imágenes de Vercel. Reemplazos con datos 100 % inventados: depende de U4 (rama `claude/demo-publico` en el repo del panel, autorizada). Pendiente: confirmar con Doug que las bandas de ciudad de `agenda-mes`/`agenda-dia` son inventadas |
| U5 | Seguridad de lo publicado | pf-security | `docs/rondas/SEGURIDAD.md` | cruce de medios **hecho** (FALLA: 2 críticos, ver S1); queda re-verificar tras S1 y revisar el demo |
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
