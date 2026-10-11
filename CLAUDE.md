# CLAUDE.md — douguizard.com

Portafolio de Doug Vargas (Head of Product · Design Engineer). Next.js 16, React 19, Tailwind v4, español primero (`/`) con
espejo en inglés (`/en`). Lee `README.md` para la estructura; **este archivo solo fija cómo trabajar**.

## Cómo se trabaja aquí

Las mejoras van por **rondas con un equipo de agentes** (director + especialistas, cada uno con su modelo y esfuerzo). Método,
roles, dueños de rutas y loop: `docs/EQUIPO.md`. Plan vigente: `docs/rondas/FASE-1-DC.md`. Estado vivo: `docs/rondas/TABLERO.md`.
Los agentes están en `.claude/agents/pf-*.md`. La sesión principal es el director: orquesta, hace commit y push, y habla con Doug.

## Reglas que no se rompen

1. **Nunca datos reales de la clínica.** El repo del panel (`dc-medical-dashboard`) es privado y sus fixtures traen nombres,
   teléfonos y montos reales. Nada derivado de ahí entra a este repo público: ni capturas, ni videos, ni datos de demo.
   Antes de publicar un medio o un demo: `node scripts/qa/leak-scan.mjs` y `pf-security`.
2. **CSP estricta** (`next.config.ts`): nada de terceros, ni iframes. Un demo con otra política va en otro origen.
3. **Paridad ES/EN:** todo texto visible en los dos idiomas (`src/i18n/dictionaries.ts`, `src/data/work.ts` + `src/data/es/work.ts`).
   Los tests de `src/data/__tests__` lo vigilan, y el orden y `/NN` de los casos, y que cada medio exista en `public/`.
4. Tailwind v4: tokens en `src/app/globals.css`; no `@apply`. Sin dependencias npm nuevas sin motivo (hoy: next, react, tailwind-merge).
5. Imágenes en WebP con `width`/`height` y `alt`; si cambia una captura existente, **renombrarla** (`-v2`): el optimizador cachea un año.
6. Higgsfield cuesta créditos: solo el director gasta, tras `get_cost` y dentro del presupuesto aprobado.
7. Rama de trabajo: `claude/eloquent-mayer-by6jn3`. Sin PR ni merge a `main` sin que Doug lo pida (Vercel despliega en cada push a `main`).

## Ahorro de tokens (obligatorio)

- `src/data/work.ts` (~1100 líneas): `grep -n` y `sed -n 'a,bp'`; nunca entero. `docs/specs/*`: solo `grep -n` del tema.
- Salida de pruebas siempre recortada: `npm test 2>&1 | tail -40`. La suite e2e completa solo en la verificación final.
- Capturas: `node scripts/qa/shots.mjs`; solo viewport, 390 y 1440, máx. 6 por revisión.

## Comandos

```bash
npm run dev            # desarrollo (Turbopack)
npx tsc --noEmit       # tipos
npm run lint && npm test
npm run build && npx next start -p 3131 &        # servidor para QA y e2e
npx playwright test tests/e2e/security.spec.ts   # un spec; la suite completa: npx playwright test
node scripts/qa/check.mjs --routes /,/work/dc-medical    # consola, desborde, imágenes, enlaces, toques 44 px
node scripts/qa/leak-scan.mjs                             # fugas: ids de Drive, correos, teléfonos, claves
```
