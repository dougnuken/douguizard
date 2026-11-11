# Pulido I · H-A · vidrio — cierre (11 nov)

**Estado: cerrado.** El `wip` (`4847ec9`) queda como está: no rompió nada y no hizo falta tocar código.

## Qué hay
- Refracción por estría (lente cilíndrica, canto fino, estrías a 12°), barrido automático de la zona nítida y
  póster v4. El cursor manda; el barrido vuelve tras ~3 s en reposo; sin barrido con reduced motion.
- Móvil (< 1024): el barrido lo lleva la capa CSS (`LenteCss`) sobre el póster tras el `load`; el WebGL entra al
  primer gesto. Con WebGL por software o GPU muy justa, el barrido también pasa a la capa CSS.
- El `wip` quitó la optimización del «fondo guardado» (`guardar`/`copiar` en `src/lib/gl/programa.ts`): cada cuadro
  vuelve a pintar la pantalla entera. Más simple; `paralaje` sigue en 0 mientras barre sola.

## Verificación (rama en `bb3d201`)
- `npm run build` ✓ · `npx tsc --noEmit` ✓ · `npm run lint` ✓ · `npm test` 279/279 ✓
- Playwright `vidrio escena hero320 motion tablero` (incluye `g4-motion`), `--workers=2 --trace off`: **89/90**.
  El fallo: `escena.spec.ts:163` (snap: el scroll vuelve a 0 en 1.378 ms; tope 1.300). Es de tiempo con 2 workers:
  repetido solo, **3/3**. No se subió el límite.

## Lighthouse móvil `/` (local, `next start`, máquina en reposo)
| | Perf | TBT (ms) | LCP (ms) | CLS |
|---|---|---|---|---|
| Rama (2 corridas) | 96 · 96 | 235 · 228 | 1.272 · 1.332 | 0 |
| Base antes del pulido I (`40cadbf`, misma máquina, 2 corridas) | 95 · 98 | 244 · 171 | 1.144 · 1.251 | — |

- Una primera corrida justo después de Playwright (máquina cargada) dio Perf 83 / TBT 681: descartada.
- **Perf ≥ 90 ✓. TBT < 200 ✗ por ~30 ms, LCP ~1,3 s** (objetivo ≈ 1,0). La base da lo mismo aquí (171–244), así
  que es ruido de esta máquina más hidratación, no el vidrio:
  - las tareas largas son las mismas con y sin reduced motion (con RM el vidrio no carga JS);
  - con CPU 4× más lenta no hay ninguna tarea > 50 ms después del `load`: el barrido CSS no bloquea.
- No se ajustó nada: no hay nada del vidrio que recortar. Bajar más pide menos componentes cliente en el home
  (ya anotado en `pulido-G/INFORME-G1.md` «Límites»).

## Capturas
`capturas/ha-1440-barrido-ojos.png` y `ha-390-barrido-ojos.png` revisadas: zona nítida sobre los ojos, estrías
alrededor, legible. Sin cambios de aspecto, no se regeneraron. Vídeos: `ha-barrido-1440.webm`, `ha-barrido-390.webm`.

## Pendientes para la sesión 2 «Cierre»
- Repetir Lighthouse de `/` con la máquina libre (no justo después de Playwright); mirar el LCP (+~100 ms sobre la base).
- `escena.spec.ts:163` es sensible a la carga: si falla en la suite completa, repetirlo solo.
- ≥ 50 fps en escritorio con el barrido no se midió aquí (sin GPU en este entorno): comprobarlo en el equipo de Doug.
- QA visual a 1440: el láser cruza «Vargas» a la altura de los ojos (es de H-B); que la crítica diga si molesta.

## Prompt de la sesión 2 (para que Doug la lance)
Modelo Sonnet, esfuerzo medio, rama `claude/douguizard-portfolio-redesign-9ivnau`, título «Pulido I · sesión 2 · cierre»:

> Pulido I de douguizard.com · sesión 2 «Cierre». Sesión corta, sin subagentes, lectura acotada. Rama `claude/douguizard-portfolio-redesign-9ivnau` (nunca `main`, nunca force-push). Lee solo `docs/rediseno-2026/ESTADO.md` (sección «Pulido I · traspaso») y `docs/rediseno-2026/pulido-I/PLAN.md` §0 y §4. Haz la sesión 2 «Cierre» que describe el traspaso: suite completa (vitest, tsc, lint, Playwright `--workers=2 --trace off`, repetir solo lo fallido), Lighthouse móvil `/` `/about` `/en`, QA visual corta con nota en `docs/rediseno-2026/pulido-I/06-CRITICA-I.md` (pocas capturas, 390 y 1440), arreglos solo de P0/P1, completa `INFORME-O.md` con la verificación final, deja `ESTADO.md` al día, commit y push, y abre el PR de la rama a `main` con una descripción clara (cambios y cómo probarlos); se fusiona con merge normal, no squash, y lo aprueba Doug. Escribe a Doug en español llano, corto. Sin identificadores de modelo en commits, PR ni archivos.
