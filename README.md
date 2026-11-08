# douguizard

Portafolio de Doug Vargas — [douguizard.com](https://douguizard.com). Rediseño 2026, propuesta B «Cine → OS»
(documentación completa en `docs/rediseno-2026/`; para Doug, empezar por `08-ENTREGA.md`).

> Next.js 16 (App Router) · React 19 · Tailwind v4 · GSAP 3 (diferido) · WebGL2 propio · TypeScript

## Arranque

```bash
npm ci              # dependencias
npm run dev         # desarrollo en http://localhost:3000
npm run build       # build de producción
npm run start       # sirve el build
```

En Windows (PowerShell), los mismos comandos con `npm.cmd` (ver `docs/rediseno-2026/08-ENTREGA.md`).

## Stack real

- **Next.js 16** con dos layouts raíz (`app/(es)` y `app/(en)/en`), `global-not-found.tsx`, `error.tsx` por idioma y
  `global-error.tsx`. CSS en línea (`experimental.inlineCss`) para que el LCP no espere una hoja externa.
- **Casos en hoja con URL real**: rutas interceptadas `@modal/(.)work/[slug]` (la hoja sobre la página) y la página
  completa `work/[slug]` (recarga, enlace directo, sin JS).
- **Héroe**: póster horneado (foto + vidrio estriado) como LCP; el vidrio vivo es un shader **WebGL2 propio**
  (`src/lib/gl/`), cargado después del LCP; con movimiento reducido o sin WebGL queda el póster.
- **GSAP** solo para el acto 1 (cine → OS) y solo en escritorio, importado de forma diferida.
- **Tipografía** (`src/app/fonts/`): Geologica (lockup «corte láser» del nombre), Urbanist (titulares), Instrument Sans
  (texto), Doto (cifras). Archivo y Geist Mono quedan para `/cv`.
- Sin Framer Motion, sin React Three Fiber, sin Lenis.

## Dónde se cambia cada cosa

| Qué | Dónde | Después |
|---|---|---|
| Foto del héroe | `src/data/hero.ts` (añadir objeto, `fotoActiva`, `version` + 1) | `npm run hero:poster` y `npm run og` |
| Fuente del nombre (lockup) | `src/app/fonts/lockup.ts` | — |
| Decisiones pendientes (disponibilidad, PDF del CTA, colofón…) | `src/data/decisiones.ts` | — |
| Datos de la persona y SEO | `src/data/site.ts` | — |
| CV (hechos) | `src/data/cv.ts` y `src/data/es/cv.ts` | `npm run cv:pdf` |
| Casos | `src/data/work.ts` y `src/data/es/work.ts` | — |
| Textos de la interfaz | `src/i18n/*.ts` | — |
| Tarjetas para compartir (OG) | `scripts/og/build-og.ts` | `npm run og` (con `next start` en el puerto 3131) |

Una sola fuente por dato: los años, roles y cifras se derivan de `src/data` (`data.singleSource.test.ts` lo vigila).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run lint` | ESLint |
| `npm test` | Vitest (datos, i18n, paridad ES/EN, CV, escena) |
| `npx playwright test --trace off` | E2E en Chromium sobre `next start -p 3131` (construir antes) |
| `npm run hero:poster` | Hornea el póster del héroe y la textura del WebGL |
| `npm run og` | Hornea `public/og.png` (ES) y `public/og-en.png` (EN) |
| `npm run cv:pdf` | Genera los PDF del CV |
| `npm run shots:rediseno` | Capturas de revisión |

`PERF_RUTA=/about PERF_OUT=docs/rediseno-2026/perf-x.json npx playwright test perf --workers=1` mide LCP, CLS y JS
con el perfil móvil de Lighthouse (Slow 4G, CPU × 4).

## Despliegue

Lo hace Doug (Vercel). Cabeceras de seguridad y caché en `next.config.ts`; redirecciones también allí. Pasos en
`docs/rediseno-2026/08-ENTREGA.md`.
