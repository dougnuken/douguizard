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
| U0 | Auditoría de la primera impresión (home + caso DC) | pf-ux-auditor | — (solo lee) | pendiente |
| U1 | DC Medical primero + enlaces a la web y al panel | pf-executor | `src/data/**`, `src/components/**`, `tests/e2e/matrix.ts` | pendiente |
| U2 | Kit de mockups (manifiestos + compositor) y componente de escenas | pf-mockup-artist + pf-executor | `mockups/**`, `scripts/mockups/**` / `src/components/case/**` | pendiente |
| U3 | Escenas luxury con Higgsfield | director (gasto) + pf-mockup-artist | `mockups/plates/**`, `public/work/dc-medical/scenes/**` | **bloqueada: créditos** |
| U4 | Panel demo con datos sintéticos y login falso | por definir | por definir | **bloqueada: alojamiento** |
| U5 | Seguridad de lo publicado | pf-security | `docs/rondas/SEGURIDAD.md` | pendiente |
| U6 | Cierre | pf-final-verifier | — (solo lee) | pendiente |

## Pedidos entre roles

(vacío)

## Decisiones pendientes de Doug

1. **Créditos de Higgsfield:** la cuenta tiene 3,3 (plan free). Un plate 2k cuesta ~2. Para ~6 escenas de DC hacen falta ~15–20.
2. **Dónde vive el demo del panel** y si puedo escribir en `dc-medical-dashboard` (ver `FASE-1-DC.md`, Puerta B).
3. **Ruflo:** ¿complemento a evaluar o se queda fuera? (ver mensaje del director).
