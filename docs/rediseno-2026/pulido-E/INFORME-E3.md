# Pulido E3 · Timeline de /experience en móvil

## Causa

En móvil el círculo de cada hito se encendía con la clase `paso`/`activo`, calculada con un umbral distinto
al de la punta del hilo (`--fill`). El círculo cambiaba de estado antes o después de que la punta llegara a
su centro.

## Arreglo (commit `02e094a`)

- `TrayectoriaCliente.tsx`: nueva clase `encendido` por hito, con el mismo origen y umbral que la punta del
  hilo: `li.getBoundingClientRect().top + NODO_Y <= c`, con `NODO_Y = 30.5` (top 24 + 13/2, centro del
  círculo). El reset de cleanup también la quita.
- `trayectoria.css`: el estado apagado pasa de `.hito:not(.paso, .activo)` a `.hito:not(.encendido)`
  (círculo y `.duracion`); el halo láser pasa a `.hito.activo.encendido::before`.

## Prueba

`tests/e2e/experience.spec.ts` → «experience 390: círculos sincronizados con la punta del hilo».
Viewport 390×844; recorre el scroll en 25 pasos (0..24/24). En cada paso compara el centro real del `::before`
de cada hito con la punta (`ol.top + --fill`): con la punta más de 4 px por encima, el hito debe estar
apagado; más de 4 px por debajo, encendido.

## Vídeo

`docs/rediseno-2026/pulido-E/experience-390.webm`.

## Verificación

Lint ✓, `tsc --noEmit` ✓, vitest 258/258 ✓, build ✓, Playwright completo (`--trace off`):
**589 passed / 1 failed** (590). El fallo se reprodujo al repetirlo solo (no es intermitente):

- `tests/e2e/tablero.spec.ts:55` «móvil: el home mide ≤ 6 pantallas de 844 (≤ 5.064 px) a 390»:
  `Expected: <= 5064, Received: 5085` (+21 px). Sin relación con /experience; pendiente de revisar.
